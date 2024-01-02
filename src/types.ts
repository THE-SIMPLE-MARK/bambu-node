export type StringNumber = `${number}`

export type Enumerate<
	N extends number,
	Accumulator extends number[] = [],
> = Accumulator["length"] extends N
	? Accumulator[number]
	: Enumerate<N, [...Accumulator, Accumulator["length"]]>

export type IntRange<F extends number, T extends number> = Exclude<
	Enumerate<T>,
	Enumerate<F>
>

export type StringRange<F extends number, T extends number> = `${IntRange<F, T>}`

type NonEmptyStr<T extends string = string> = T extends "" ? never : T

export enum PrinterModel {
	X1C = "X1C",
	X1 = "X1",
	X1E = "X1E",
	P1P = "P1P",
	P1S = "P1S",
	A1 = "A1",
	A1M = "A1M",
}
