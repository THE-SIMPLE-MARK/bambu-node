import { PushStatusCommand, VersionModule } from "./responses"

export type StringNumber = `${number}`

export type NumberRange<
	start extends number,
	end extends number,
	arr extends unknown[] = [],
	acc extends number = never,
> = arr["length"] extends end
	? acc | start | end
	: NumberRange<
			start,
			end,
			[...arr, 1],
			arr[start] extends undefined ? acc : acc | arr["length"]
		>

export type StringNumberRange<F extends number, T extends number> = `${NumberRange<F, T>}`

export enum PrinterModel {
	X1C = "X1C",
	X1 = "X1",
	X1E = "X1E",
	P1P = "P1P",
	P1S = "P1S",
	A1 = "A1",
	A1M = "A1M",
}

export interface IncomingMessageData {
	[key: string]: unknown
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export interface PrinterData extends Optional<PushStatusCommand, "command"> {
	modules: VersionModule[]
	model: PrinterModel | undefined
}
