import * as mqtt from "mqtt"
import { MqttClient } from "mqtt"
import type { BambuClientEvents } from "src/BambuClientEvents"
import * as events from "eventemitter3"
import { CommandInterface, GetVersionCommand, PushAllCommand } from "src/commands"
import {
	isGetVersionCommand,
	isInfoMessage,
	VersionModule,
	isPrintMessage,
	isPushStatusCommand,
	PushStatusCommand,
} from "src/responses"
import { PrinterModel } from "src/types"

interface ClientOptions {
	host: string
	port?: number
	accessToken: string
	serialNumber: string
}

/**
 * Manages connectivity and messages from/to the printer.
 */
export class BambuClient extends events.EventEmitter<keyof BambuClientEvents> {
	private mqttClient: mqtt.MqttClient | undefined
	private config: ClientOptions
	private _printerData: { modules: VersionModule[]; model: PrinterModel | undefined } = {
		modules: [],
		model: undefined,
	}

	public constructor(public readonly clientOptions: ClientOptions) {
		super()

		this.config = clientOptions
	}

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

	private async connectMQTT() {
		return new Promise<void>((resolve, reject) => {
			this.mqttClient = mqtt.connect(
				`mqtts://${this.config.host}:${this.config.port ?? 8883}`,
				{
					username: "bblp",
					password: this.config.accessToken,
					reconnectPeriod: 1,
					rejectUnauthorized: false,
				}
			)

			this.mqttClient.once("connect", () => resolve())
			this.mqttClient.on("connect", this.onConnect.bind(this))
			this.mqttClient.on("disconnect", () => console.log("Disconnected from printer"))

			this.mqttClient.on("message", (topic, message) =>
				this.emit("globalRawMessage", topic, message)
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
		return Promise.all([this.connectMQTT()])
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
		console.log(`Subscribing to "${topic}"`)

		return new Promise<void>((resolve, reject) => {
			if (!this.mqttClient) {
				return reject("Client not connected.")
			}

			// @ts-ignore
			this.mqttClient.subscribe(topic, (error: Error | undefined) => {
				if (error) {
					return reject(`Error subscribing to topic '${topic}': ${error.message}`)
				}

				console.log(`Subscribed to "${topic}"`)
			})

			const listener = (receivedTopic: string, payload: Buffer) => {
				if (receivedTopic !== topic) {
					return
				}

				this.onMessage(payload.toString(), topic)
			}

			this.mqttClient.on("message", listener)

			resolve()
		})
	}

	/**
	 * Execute a command.
	 * @param command {CommandInterface} Command to execute.
	 * @returns {Promise<void>}
	 */
	public async executeCommand(command: CommandInterface): Promise<void> {
		return command.invoke(this)

		// TODO: wait for a response before resolving promise
	}

	protected async onConnect(packet: mqtt.IConnackPacket) {
		console.log("Connected to printer")

		// subscribe to the only available topic (report)
		await this.subscribe(`device/${this.config.serialNumber}/report`)

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
	}

	protected async onMessage(packet: string, topic: string) {
		const data = JSON.parse(packet)
		const key = Object.keys(data)[0]

		this.emit("message", topic, key, data)
		console.log("onMessage: ", { topic, key, data: JSON.stringify(data[key]) })

		if (isPrintMessage(data)) {
			if (isPushStatusCommand(data.print)) {
				// merge the new data with the old data
				this._printerData = {
					...this._printerData,
					...(data.print as Partial<PushStatusCommand>),
				}
			}
		}

		if (isInfoMessage(data)) {
			if (isGetVersionCommand(data.info)) {
				// merge the new data with the old data (without duplicates)
				this._printerData.modules = [
					...new Set([...this._printerData.modules, ...data.info.module]),
				]

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
			}
		}
	}

	public publish(message: string | object): Promise<void> {
		console.log("Publishing to printer", { message })

		return new Promise<void>((resolve, reject) => {
			if (!this.mqttClient) {
				return reject("Client not connected.")
			}

			const message_ = typeof message === "string" ? message : JSON.stringify(message)

			const topic = `device/${this.config.serialNumber}/request`

			this.mqttClient.publish(topic, message_, error => {
				console.log("Published message: ", { topic, message: message_, error })

				if (error) {
					return reject(`Error publishing to topic '${topic}': ${error.message}`)
				}

				console.log("Published to printer", { message })
				resolve()
			})
		})
	}

	public get printerData() {
		return this._printerData
	}
}
