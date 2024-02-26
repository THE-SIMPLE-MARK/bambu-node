import * as mqtt from "mqtt"
import { MqttClient } from "mqtt"
import type { BambuClientEvents } from "src/BambuClientEvents"
import * as events from "eventemitter3"
import { AbstractCommand, GetVersionCommand, PushAllCommand } from "src/commands"
import {
	isGetVersionCommand,
	isInfoMessage,
	isMCPrintMessage,
	isPrintMessage,
	isPushAllCommand,
	isPushStatusCommand,
	PushAllResponse as PushAllCommandResponse,
} from "src/responses"
import {
	BambuClientPrinterStatus,
	CommandResponse,
	IncomingMessageData,
	PrinterData,
	PrinterModel,
} from "src/types"
import { Job } from "./Job"
import { createId } from "@paralleldrive/cuid2"
import sleep from "src/utils/sleep"

export interface ClientOptions {
	host: string
	port?: number
	accessToken: string
	serialNumber: string
	throwOnOfflineCommands?: boolean
	reconnectInterval?: number
	connectTimeout?: number
	keepAlive?: number
}

/**
 * Manages connectivity and messages from/to the printer.
 */
export class BambuClient extends events.EventEmitter<keyof BambuClientEvents> {
	public override emit<K extends keyof BambuClientEvents>(
		event: K,
		...arguments_: BambuClientEvents[K]
	): boolean
	public override emit(event: string, ...arguments_: any[]): boolean {
		return super.emit(event as keyof BambuClientEvents, ...arguments_)
	}

	public override off<K extends keyof BambuClientEvents>(
		event: K,
		listener?: (...arguments_: BambuClientEvents[K]) => void
	): this
	public override off(event: string, listener?: (...arguments_: any[]) => void): this {
		super.off(event as keyof BambuClientEvents, listener)

		return this
	}

	public override once<K extends keyof BambuClientEvents>(
		event: K,
		listener: (...arguments_: BambuClientEvents[K]) => void
	): this
	public override once(event: string, listener: (...arguments_: any[]) => void): this {
		super.once(event as keyof BambuClientEvents, listener)

		return this
	}

	public override on<K extends keyof BambuClientEvents>(
		event: K,
		listener: (...arguments_: BambuClientEvents[K]) => void
	): this
	public override on(event: string, listener: (...arguments_: any[]) => void): this {
		super.on(event as keyof BambuClientEvents, listener)

		return this
	}

	public id: string = createId()

	private mqttClient: mqtt.MqttClient | undefined = undefined
	public isConnected: boolean = false

	public config

	private _printerData: PrinterData = {
		modules: [],
		model: undefined,
	}
	private _printerStatus: BambuClientPrinterStatus = "OFFLINE"

	private isInitialized: boolean = false

	/**
	 * A job that would've been created before init but couldn't due to the lack of data.
	 * The object contains the date the job would've been created at and the type of event that needs to be emitted.
	 * @private
	 */
	private preInitJob: {
		type: "CREATE" | "CREATE_OFFLINE" | "PAUSE"
		createdAt: Date
	} | null = null

	public jobHistory: Job[] = []
	public currentJob: Job | null = null

	public constructor(public readonly clientOptions: ClientOptions) {
		super()

		this.config = {
			host: clientOptions.host,
			port: clientOptions.port ?? 8883,
			accessToken: clientOptions.accessToken,
			serialNumber: clientOptions.serialNumber,
			throwOnOfflineCommands: clientOptions.throwOnOfflineCommands ?? false,
			reconnectInterval: clientOptions.reconnectInterval ?? 1000,
			connectTimeout: clientOptions.connectTimeout ?? 2000,
			keepAlive: clientOptions.keepAlive ?? 20,
		}
	}

	private async connectMQTT() {
		return new Promise<void>((resolve, reject) => {
			// make sure that we are not already connected
			if (this.isConnected)
				throw new Error("Can't establish a new connection while running another one!")

			this.mqttClient = mqtt.connect(`mqtts://${this.config.host}:${this.config.port}`, {
				username: "bblp",
				password: this.config.accessToken,
				reconnectPeriod: this.clientOptions.reconnectInterval,
				connectTimeout: this.clientOptions.connectTimeout,
				keepalive: this.clientOptions.keepAlive,
				resubscribe: true,
				rejectUnauthorized: false,
			})

			this.mqttClient.on("connect", async (...args) => {
				this.isConnected = true

				// while we did connect, we only resolve the promise once the onConnect logic has also (successfully) completed
				await this.onConnect(...args)
				resolve()
			})

			this.mqttClient.on("disconnect", () => {
				this.isConnected = false
				this.emit("printer:statusUpdate", this._printerStatus, "OFFLINE")
				this._printerStatus = "OFFLINE"
			})

			this.mqttClient.on("offline", () => {
				this.isConnected = false
				this.emit("printer:statusUpdate", this._printerStatus, "OFFLINE")
				this._printerStatus = "OFFLINE"
			})

			this.mqttClient.on("message", (topic, message) =>
				this.emit("rawMessage", topic, message)
			)

			this.mqttClient.on("error", err => {
				console.error("Error while trying to connect to printer:", err.message)
				reject(err)
			})
		})
	}

	/**
	 * Connect to the printer.
	 */
	public async connect() {
		return await Promise.all([this.connectMQTT()])
	}

	/**
	 * Disconnect from the printer.
	 * @param force Forcefully disconnect.
	 * @param options {Parameters<MqttClient["end"]>[1]} MQTT client options
	 */
	public async disconnect(force = false, options?: Parameters<MqttClient["end"]>[1]) {
		return new Promise(resolve => this.mqttClient?.end(force, options, resolve))
	}

	private subscribe(topic: string): Promise<void> {
		if (!this.isConnected && this.config.throwOnOfflineCommands)
			throw new Error(
				`Unable to subscribe to topic "${topic}" while disconnected from printer!`
			)

		return new Promise<void>((resolve, reject) => {
			if (!this.mqttClient) {
				return reject("Client not connected.")
			}

			this.mqttClient.subscribe(topic, (error: any) => {
				if (error) {
					return reject(`Error subscribing to topic '${topic}': ${error.message}`)
				}
			})

			const listener = async (receivedTopic: string, payload: Buffer) => {
				if (receivedTopic !== topic) return

				await this.onMessage(payload.toString(), topic)
			}

			this.mqttClient.on("message", listener)

			resolve()
		})
	}

	/**
	 * Execute a command.
	 * @param command {AbstractCommand} Command to execute.
	 * @returns {Promise<CommandResponse>} A promise which resolves to the CommandResponse once the command has been acknowledged by the printer, times out after 5 seconds.
	 */
	public async executeCommand(command: AbstractCommand): Promise<CommandResponse> {
		if (!this.isConnected && this.config.throwOnOfflineCommands)
			throw new Error(`Unable to send commands while disconnected from printer!`)

		return new Promise((resolve, reject) => {
			// run command
			command.invoke(this).catch(err => reject(err))

			// start a timeout which rejects the promise after 5 seconds
			const timeout = setTimeout(() => {
				reject(new Error("Command execution timed out after 5 seconds."))
			}, 5000)

			// wait for a response
			this.on("rawMessage", (topic: string, payload: Buffer) => {
				const data = JSON.parse(payload.toString())
				const key = Object.keys(data)[0]

				if (!(isInfoMessage(data) || isMCPrintMessage(data) || isPrintMessage(data)))
					return

				const response = (data as unknown as IncomingMessageData)[key] as CommandResponse

				if (!response?.command) return

				if (command.ownsResponse(response)) {
					// clear the timeout and resolve the promise
					clearTimeout(timeout)
					resolve(response)
				}
			})
		})
	}

	protected async onConnect(packet: mqtt.IConnackPacket) {
		// subscribe to the only available topic (report)
		await this.subscribe(`device/${this.config.serialNumber}/report`)

		// sleep for a second so the printer has time to process the subscription
		await sleep(1000)

		// request printer version data
		await this.executeCommand(new GetVersionCommand())

		// request full printer data on P1 && A1 series printers
		// because they don't send it each time like the X1 series
		if (
			this._printerData.model === PrinterModel.P1P ||
			this._printerData.model === PrinterModel.P1S ||
			this._printerData.model === PrinterModel.A1 ||
			this._printerData.model === PrinterModel.A1M
		) {
			// request full printer data
			await this.executeCommand(new PushAllCommand())

			// request full printer data every 5 minutes
			// this ensures compatibility with the p1 series' "slow" ESP32 controller
			setInterval(
				async () => {
					await this.executeCommand(new PushAllCommand())
				},
				5 * 60 * 1000 // 5 minutes
			)
		}

		this.isInitialized = true

		// check if any jobs would've been created before init and create them now
		if (this.preInitJob) {
			// We will probably never have any previous jobs is very slim, as this is
			//  a fresh reboot and the window this edge case even happens is a couple of ms.
			// But we'll preserve any history there is anyway
			if (this.currentJob) this.jobHistory.push(this.currentJob)

			this.currentJob = new Job(
				this._printerData as PushAllCommandResponse, // we've already queried all the data
				this.id
			)

			if (this.preInitJob.type === "CREATE") {
				this.emit("job:start", this.currentJob)
			} else if (this.preInitJob.type === "CREATE_OFFLINE") {
				this.emit("job:start", this.currentJob)
				this.emit("job:start:wasOffline", this.currentJob)
			} else if (this.preInitJob.type === "PAUSE") {
				this.emit("job:pause", this.currentJob)
				this.emit("job:pause:wasOffline", this.currentJob)
			}
		}
	}

	private async onMessage(packet: string, topic: string) {
		const data = JSON.parse(packet)
		const key = Object.keys(data)[0]

		if (!(isInfoMessage(data) || isMCPrintMessage(data) || isPrintMessage(data))) return

		if (isPrintMessage(data)) {
			this.emit("message", topic, key, data.print)

			if (isPushAllCommand(data.print) || isPushStatusCommand(data.print)) {
				// this includes any general data updates

				// merge the new data with the old data
				this._printerData = {
					...this._printerData,
					...data.print,
				}

				this.emit("printer:dataUpdate", this._printerData)

				// update job data
				if (this.currentJob) this.currentJob.update(data.print)

				// printer status updates and job creation
				if (data.print.gcode_state && data.print.gcode_state !== this._printerStatus) {
					let oldStatus = this._printerStatus
					let newStatus = data.print.gcode_state

					this.emit("printer:statusUpdate", oldStatus, newStatus)

					// we treat PREPARE and SLICING as an alias of idle because they're of no use
					if (newStatus === "PREPARE" || newStatus === "SLICING") newStatus = "IDLE"
					if (oldStatus === "PREPARE" || oldStatus === "SLICING") oldStatus = "RUNNING"

					if (
						(oldStatus === "OFFLINE" ||
							oldStatus === "IDLE" ||
							oldStatus === "FINISH" ||
							oldStatus === "FAILED") &&
						newStatus === "RUNNING"
					) {
						// print start
						// this can also happen when the client connects into an ongoing job

						// we might receive a print start event before we've initialized (have all the data)
						// => we reschedule any job start events to after the initialization (always less than 3s, but closer to 500ms)

						// throw an error if we haven't initialized yet, but we already have a new Job
						if (!this.isInitialized && this.preInitJob)
							throw new Error(
								"Tried to add a second job before the first one could be initialized! Handling this isn't currently done. Feel free to open a pull request if you need this feature."
							)

						// put the current job that would've been created to the preInitJob property, so it can be created right after init
						if (!this.isInitialized) {
							// push the current date to the preInitJobs array, so they can be created later
							this.preInitJob = {
								type: "CREATE",
								createdAt: new Date(),
							}
							return
						}

						// move current job to jobHistory
						if (this.currentJob !== null) this.jobHistory.push(this.currentJob)

						// create new job and set it as the current job
						this.currentJob = new Job(
							this._printerData as PushAllCommandResponse, // if we don't have all the data we would've already rescheduled
							this.id
						)

						this.emit("job:start", this.currentJob)
						if (oldStatus === "OFFLINE")
							this.emit("job:start:wasOffline", this.currentJob)
					} else if (
						oldStatus === "RUNNING" &&
						(newStatus === "FINISH" || newStatus === "FAILED" || newStatus === "IDLE")
					) {
						// print finish

						if (newStatus === "FINISH") {
							// finished with no errors

							if (this.currentJob !== null)
								this.emit("job:finish:success", this.currentJob)
						} else if (newStatus === "FAILED") {
							// finished with errors

							if (this.currentJob !== null)
								this.emit("job:finish:success", this.currentJob)
						} else if (newStatus === "IDLE") {
							// unexpected finish

							if (this.currentJob !== null)
								this.emit("job:finish:unexpected", this.currentJob)
						}

						if (this.currentJob !== null) {
							// move currentJob to jobHistory
							this.jobHistory.push(this.currentJob)

							this.emit("job:finish", this.currentJob)
						}

						// empty currentJob
						this.currentJob = null
					} else if (oldStatus === "RUNNING" && newStatus === "PAUSE") {
						// paused

						if (this.currentJob) this.emit("job:pause", this.currentJob)
					} else if (oldStatus === "PAUSE" && newStatus === "RUNNING") {
						// unpaused

						if (this.currentJob) this.emit("job:unpause", this.currentJob)
					} else if (oldStatus === "OFFLINE" && newStatus === "PAUSE") {
						// this happens when the printer resumes a job from a power outage

						// we might receive this event before we've initialized (have all the data)
						// => we reschedule any of these events to after the initialization (always less than 3s, but closer to 500ms)

						// throw an error if we haven't initialized yet, but we already have a new Job
						if (!this.isInitialized && this.preInitJob)
							throw new Error(
								"Tried to add a second job after a power outage before the first one could be initialized! Handling this isn't currently done. Feel free to open a pull request if you need this feature."
							)

						// put the current job that would've been created to the preInitJob property, so it can be created right after init
						if (!this.isInitialized) {
							// push the current date to the preInitJobs array, so they can be created later
							this.preInitJob = {
								type: "CREATE",
								createdAt: new Date(),
							}
							return
						}

						// move current job to jobHistory
						if (this.currentJob !== null) this.jobHistory.push(this.currentJob)

						// create new job and set it as the current job
						this.currentJob = new Job(
							this._printerData as PushAllCommandResponse, // if we don't have all the data we would've already rescheduled
							this.id
						)

						this.emit("job:pause:wasOffline", this.currentJob)
						this.emit("job:pause", this.currentJob)
					} else if (
						(oldStatus === "IDLE" || oldStatus === "OFFLINE") &&
						(newStatus === "FINISH" || newStatus === "FAILED" || newStatus === "IDLE")
					) {
						// this usually only happens when the client connects, all of which we ignore
					} else if (oldStatus !== newStatus) {
						// does not match but not "caught" before
						throw new Error("Edge case detected while updating printer status!")
					}

					// set old status as the new status
					this._printerStatus = data.print.gcode_state
				}
			}
		}

		if (isMCPrintMessage(data)) {
			this.emit("message", topic, key, data.print)
		}

		if (isInfoMessage(data)) {
			this.emit("message", topic, key, data.info)

			if (isGetVersionCommand(data.info)) {
				// merge the new data with the old data (without duplicates)
				this._printerData.modules = [
					...new Set([...this._printerData.modules, ...data.info.module]),
				]

				this.emit("printer:dataUpdate", this._printerData)

				// figure out the printer version and add it to the printer data
				// we do this by checking the serial number of OTA module
				const otaModule = this._printerData.modules.find(module => module.name === "ota")
				if (!otaModule)
					throw new Error(
						"OTA module version data not found, unable to determine printer model!"
					)

				if (otaModule.sn.startsWith("00M")) this._printerData.model = PrinterModel.X1C
				else if (otaModule.sn.startsWith("00W")) this._printerData.model = PrinterModel.X1
				else if (otaModule.sn.startsWith("03W"))
					this._printerData.model = PrinterModel.X1E
				else if (otaModule.sn.startsWith("01S"))
					this._printerData.model = PrinterModel.P1P
				else if (otaModule.sn.startsWith("01P"))
					this._printerData.model = PrinterModel.P1S
				else if (otaModule.sn.startsWith("030")) this._printerData.model = PrinterModel.A1
				else if (otaModule.sn.startsWith("039"))
					this._printerData.model = PrinterModel.A1M
				else throw new Error("Printer model not supported!")

				this.emit("printer:dataUpdate", this._printerData)
			}
		}
	}

	/**
	 * Used by the individual command types to publish messages to the printer.
	 * @param message
	 */
	public publish(message: string | object): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (!this.mqttClient) {
				return reject("Client not connected.")
			}

			const message_ = typeof message === "string" ? message : JSON.stringify(message)

			const topic = `device/${this.config.serialNumber}/request`

			this.mqttClient.publish(topic, message_, error => {
				if (error) {
					return reject(`Error publishing to topic '${topic}': ${error.message}`)
				}

				resolve()
			})
		})
	}

	public get data(): PrinterData {
		return this._printerData
	}

	public get status(): BambuClientPrinterStatus {
		return this._printerStatus
	}
}
