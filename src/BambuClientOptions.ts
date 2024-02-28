export interface BambuClientOptions {
	/**
	 * The IP address / URL of the printer.
	 */
	host: string
	/**
	 * The port of the printer.
	 * @default 8883
	 */
	port?: number
	/**
	 * The access token of the printer.
	 * It can be found in the settings.
	 */
	accessToken: string
	/**
	 * The serial number of the printer.
	 * It can be found in the settings or the back sticker.
	 */
	serialNumber: string
	/**
	 * Whether to throw errors while running `publish` and `executeCommand` methods when offline.
	 * @default false
	 */
	throwOnOfflineCommands?: boolean
	/**
	 * The time between 2 reconnection attempts in ms.
	 * @default 1000
	 */
	reconnectInterval?: number
	/**
	 * The time to wait before a `CONNACK` is received in ms.
	 * @default 2000
	 */
	connectTimeout?: number
	/**
	 * The amount of time that keep alive will consider the server inactive in seconds.
	 *
	 * Please note: numbers lower than 20 usually make the client go into a reconnect loop. If you have an idea on how to fix this then feel free to open a PR / issue.
	 * @default 20
	 */
	keepAlive?: number
}
