import type { BambuClient } from "src/BambuClient"

export interface CommandInterface {
	category: "info" | "pushing" | "system" | "print"
	command: string
	extra?: Record<string, unknown>

	invoke(client: BambuClient): void
}
