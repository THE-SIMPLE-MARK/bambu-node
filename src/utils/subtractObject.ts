/**
 * Returns an object containing the properties that are present in `obj2` but not in `obj1`.
 *
 * @param obj1 - The first object to compare.
 * @param obj2 - The second object to compare.
 * @returns An object containing the properties that are present in `obj2` but not in `obj1`.
 */
export default function getAddedProperties(
	obj1: Record<string, any>,
	obj2: Record<string, any>
): Record<string, any> {
	const result: Record<string, any> = {}

	const checkDifferences = (
		obj1: Record<string, any>,
		obj2: Record<string, any>,
		currentResult: Record<string, any>
	) => {
		for (const key in obj2) {
			// If the key is in obj1 & values are the same => skip to the next iteration
			if (key in obj1 && JSON.stringify(obj1[key]) === JSON.stringify(obj2[key])) {
				continue
			}

			// If value is object => recurse into it
			if (typeof obj2[key] === "object" && obj2[key] !== null && obj1[key] !== null) {
				currentResult[key] = currentResult[key] || {}
				checkDifferences(obj1[key], obj2[key], currentResult[key])
				continue
			}

			// otherwise => add the key-value pair to the result
			currentResult[key] = obj2[key]
		}
	}

	checkDifferences(obj1, obj2, result)

	return result
}
