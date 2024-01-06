import type { CommandInterface } from "./CommandInterface"
import type { BambuClient } from "src/BambuClient"
import { CommandResponse } from "../types"
import { getSequenceId } from "../utils/sequenceIdManager"

export abstract class AbstractCommand implements CommandInterface {
	public abstract category: CommandInterface["category"]
	public abstract command: CommandInterface["command"]
	public sequenceId = getSequenceId()

	public constructor(public extra: CommandInterface["extra"] = {}) {}

	public invoke(client: BambuClient): Promise<void> {
		return client.publish({
			[this.category]: {
				sequence_id: "" + this.sequenceId,
				command: this.command,
				...this.extra,
			},
		})
	}

	public abstract ownsResponse(command: CommandResponse): boolean
}
