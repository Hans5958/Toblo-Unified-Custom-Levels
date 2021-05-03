module.exports = {
	parse(text) {
		const lines = text.split(/\r\n|\n/)
		const itemPattern = /^\s*(\w+)\s*(\d+)\s*(.+?)\s*$/
		let result = {}
		let category = ""
		lines.forEach(line => {
			// console.log(line)

			if (line.startsWith("#") || line.length === 0 || /^\s+$/.test(line) === true) return
			else if (line.endsWith("_START")) {
				category = line.replace("_START", "")
				result[category] = {
					items: {}
				}
				// console.log(category)
				return
			}
			else if (line.endsWith("_END")) {
				category = ""
				return
			}

			if (!category) return

			if (line.startsWith(" ")) {
				const [lineResult, name, id, extra] = itemPattern.exec(line)
				result[category].items[id] = {
					name,
					id,
					extra,
				}
			} else {
				const [key, value] = line.split(": ")
				result[category][key] = value 
			}
		})
		return result
	},
	parseSnippet(text) {
		const lines = text.split(/\r\n|\n/)
		const itemPattern = /^\s*(\w+)\s*(\d+)\s*(.+?)\s*$/
		let result = {}
		lines.forEach(line => {
			if (line.startsWith("#") || line.length === 0 || /^\s+$/.test(line) === true) return
			if (line.startsWith(" ")) {
				const [lineResult, name, id, extra] = itemPattern.exec(line)
				result[id] = ({
					name,
					id,
					extra
				})
			}
		})
		return result
	},
	stringify(iniObj) {
		let result = []
		Object.keys(iniObj).forEach(category => {
			const categoryObj = iniObj[category]
			result.push(`${category}_START`)
			if (Object.keys(categoryObj) !== ["items"]) {
				Object.keys(categoryObj).forEach(key => {
					if (key === "items") return
					result.push([key, categoryObj[key]].join(": "))
				})
			}
			Object.values(categoryObj.items).forEach(item => {
				result.push(`  ${item.name} ${item.id} ${item.extra}`)
			})
			result.push(`${category}_END`)
			result.push("")
		})
		return result.join("\r\n")
	}
}