const fs = require("fs-extra")
const chalk = require("chalk")
const importSingle = require("./processSingle")

console.log("Preparing temporary workspace...")
require("./prepareTempWorkspace")()
console.log("Adding text version on Start Game menu...")
require("./addStartGameText")()

const levels = fs.readdirSync("Levels/")

levels.forEach(levelName => {
	levelDir = `Levels/${levelName}`
	console.log(chalk`Processing {inverse ${levelName}}...`)
	importSingle(levelName, levelDir)
})

console.log("Packing for testing...")
require("./packForTesting")()

console.log("All done!")