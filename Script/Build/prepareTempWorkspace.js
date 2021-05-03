const fs = require("fs-extra")
const consts = require("./constants")

module.exports = () => {
	fs.removeSync(consts.tempWorkDir)

	const copyFilesFromToblo = path => {
		fs.ensureFileSync([consts.tempWorkDir, path].join("/"))
		fs.copyFileSync([consts.tobloDir, path].join("/"), [consts.tempWorkDir, path].join("/"))
	}

	copyFilesFromToblo("Config/Graphics/gfxGameAssets.ini")
	copyFilesFromToblo("Config/menus/startgamemenu.ini")
	copyFilesFromToblo("Levels/levels.ini")
	copyFilesFromToblo("Objects/objects.ini")
	fs.mkdirSync(`${consts.tempWorkDir}/Objects/Rocks`)
	fs.mkdirSync(`${consts.tempWorkDir}/Objects/Trees`)
	fs.mkdirSync(`${consts.tempWorkDir}/Levels/Palettes`)
}