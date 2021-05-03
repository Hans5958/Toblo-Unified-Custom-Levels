const fs = require("fs-extra")
const ini = require("ini")
const { startGameText } = require("./constants")

module.exports = () => {
	const iniPath = "Temp/Config/menus/startgamemenu.ini"
	const iniFile = ini.parse(fs.readFileSync(iniPath, "utf-8"))
	iniFile.Text2 = {
		state: '53',
		x: '0.5000',
		y: '0.9800',
		z: '0.0050',
		extX: '0.1',
		extY: '0.02',
		image: '103',
		static: '1',
		font: '11',
		color: '4',
		caption: startGameText
	}
	fs.writeFileSync(iniPath, ini.stringify(iniFile))
}

module.exports()