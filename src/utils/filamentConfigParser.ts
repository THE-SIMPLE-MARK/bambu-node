import fs from "fs"
import path from "path"
import type {
	BaseFilamentConfig,
	ExtendedFilamentConfig,
	FilamentConfig,
} from "src/responses"

type Result = Record<string, FilamentConfig>

function parseConfigFiles(dir: string): Result {
	const files = fs.readdirSync(dir).filter(file => file.endsWith(".json"))
	const globalObject: Record<string, any> = {}

	for (const file of files) {
		const filePath = path.join(dir, file)
		let fileData: ExtendedFilamentConfig = JSON.parse(fs.readFileSync(filePath, "utf-8"))

		if (!fileData.name.endsWith("@base") || fileData.name.includes("@BBL")) continue

		if (fileData.inherits) {
			const inheritsFilePath = path.join(dir, `${fileData.inherits}.json`)

			if (fs.existsSync(inheritsFilePath)) {
				const inheritedData: BaseFilamentConfig = JSON.parse(
					fs.readFileSync(inheritsFilePath, "utf-8")
				)

				fileData = { ...inheritedData, ...fileData }
			}
		}

		globalObject[fileData.filament_id ?? fileData.setting_id] = fileData
	}

	return globalObject
}

const dir = process.argv[2]
if (!dir) {
	console.error("No directory path provided.")
	console.log("Usage: node script.js /path/to/directory")
	process.exit(1)
}

const result = parseConfigFiles(dir)
fs.writeFileSync("filamentConfigs.json", JSON.stringify(result, null, 2))
