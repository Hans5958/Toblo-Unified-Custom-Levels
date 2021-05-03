const fs = require("fs-extra")
const consts = require("./constants")

module.exports = () => {
	console.log("Clearing the pack test directory...")
	fs.removeSync(consts.packTestDir)
	fs.mkdirSync(consts.packTestDir)
	console.log("Copying Toblo files into the pack test directory...")
	fs.copySync(consts.tobloDir, consts.packTestDir)
	console.log("Copying temporary workspace files into the pack test directory...")
	fs.copySync(consts.tempWorkDir, consts.packTestDir)
	console.log("Packing done.")
}