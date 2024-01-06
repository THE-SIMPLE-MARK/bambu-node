let sequenceId: number = 0

export function getSequenceId(): number {
	sequenceId += 1
	return sequenceId
}
