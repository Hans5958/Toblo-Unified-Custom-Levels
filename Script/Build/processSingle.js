const fs = require("fs-extra")
const ini = require("ini")
const globby = require("globby")
const graphicsIniReader = require("./graphicsIniReader")
const consts = require("./constants")
const { tobloDir, tempWorkDir } = require("./constants")

module.exports = (levelName, levelDir) => {

	// console.log(levelName, levelDir)
	console.log("Reading gfxGameAssets.ini...")
	gfxGameAssets = graphicsIniReader.parse(fs.readFileSync(`${consts.tempWorkDir}/Config/Graphics/gfxGameAssets.ini`, "utf-8"))

	const changesDict = {
		materials: {},
		textures: {}
	}

	// Copy all files

	console.log("Copying initial files...")
	fs.copySync(`${levelDir}/Level`, `${consts.tempWorkDir}/Levels/${levelName}`)
	if (fs.existsSync(`${levelDir}/Objects`)) fs.copySync(`${levelDir}/Objects`, `${consts.tempWorkDir}/Objects`)

	// If exists, add new materials to gfxGameAssets.ini

	if (fs.existsSync(`${levelDir}/Materials.ini`)) {
		console.log("Adding new materials...")
		const materials = graphicsIniReader.parseSnippet(fs.readFileSync(`${levelDir}/Materials.ini`, "utf-8"))
		let iniId = Object.keys(gfxGameAssets.MATERIALS.items).sort((a, b) => b - a)[0]
		iniId++
		Object.values(materials).forEach(item => {
			changesDict.materials[item.id] = iniId
			gfxGameAssets.MATERIALS.items[iniId] = {
				name: item.name,
				id: iniId,
				extra: item.extra
			}
			iniId++
		})
		// console.log(gfxGameAssets.MATERIALS.items)
		// console.log(changesDict)
	}

	// If exists, add new textures to gfxGameAssets.ini

	let screenshotId = -1
	
	if (fs.existsSync(`${levelDir}/Textures.ini`)) {
		console.log("Adding new textures...")
		const textures = graphicsIniReader.parseSnippet(fs.readFileSync(`${levelDir}/Textures.ini`, "utf-8"))
		let iniId = Object.keys(gfxGameAssets.TEXTURES.items).sort((a, b) => b - a)[0]
		iniId++
		Object.values(textures).forEach(item => {
			if (item.name.startsWith("menuScreen")) {
				// item.name += levelName.split(" ").join("")
				screenshotId = iniId
			}
			changesDict.textures[item.id] = iniId
			gfxGameAssets.TEXTURES.items[iniId] = {
				name: item.name,
				id: iniId,
				extra: item.extra
			}
			iniId++
		})
		// console.log(gfxGameAssets.TEXTURES.items)
		// console.log(changesDict)
	}

	// Write gfxGameAssets.ini

	console.log("Writing gfxGameAssets.ini...")
	fs.writeFileSync(`${consts.tempWorkDir}/Config/Graphics/gfxGameAssets.ini`, graphicsIniReader.stringify(gfxGameAssets))

	// Replace menu screen ID if needed

	let levelIniFile, levelIni
	if (screenshotId !== -1) {
		levelIniFile = fs.readdirSync(`${levelDir}/Level`, "utf-8").filter(file => file.endsWith(".ini"))[0]
		levelIni = ini.parse(fs.readFileSync(`${levelDir}/Level/${levelIniFile}`, "utf-8"))
		levelIni.level.screenshot = screenshotId
		fs.writeFileSync(`${consts.tempWorkDir}/Levels/${levelName}/${levelIniFile}`, ini.stringify(levelIni))	
	}
	
	// console.log(levelIni)

	// Add new entry on levels.ini

	console.log("Adding level to levels.ini...")
	const levelsIni = ini.parse(fs.readFileSync(`${consts.tempWorkDir}/Levels/levels.ini`, "utf-8"))
	let levelId = Object.keys(levelsIni).map(a => a.replace("level", "")).sort((a, b) => b - a)[0]
	levelId++
	levelsIni[`level${levelId}`] = {
		name: levelName,
		file: `Levels\\${levelName}\\${levelIniFile}`
	}
	fs.writeFileSync(`${consts.tempWorkDir}/Levels/levels.ini`, ini.stringify(levelsIni))

	// If exist, add new palettes and replace values if needed
	
	if (fs.existsSync(`${levelDir}/Palette.ini`)) {
		// const paletteIni = ini.parse(fs.readFileSync(`${levelDir}/Palette.ini`, "utf-8"))
		let paletteIni = fs.readFileSync(`${levelDir}/Palette.ini`, "utf-8")
		Object.entries(changesDict.materials).forEach(([from, to]) => {
			// console.log(from, to)
			paletteIni = paletteIni.replace(from, to)
		})
		// console.log(levelIni.level.palette)
		fs.writeFileSync(`${consts.tempWorkDir}/${levelIni.level.palette}`, paletteIni)
	}

	// If exist, add new objects

	if (fs.existsSync(`${levelDir}/Objects.ini`)) {
		let objectsIni = ini.parse(fs.readFileSync(`${consts.tempWorkDir}/Objects/objects.ini`, "utf-8"))
		let levelObjectsIni = ini.parse(fs.readFileSync(`${levelDir}/Objects.ini`, "utf-8"))
		Object.entries(levelObjectsIni).forEach(([id, iniFile]) => {
			if (typeof objectsIni.Objects[id] !== "undefined") throw Error(`ID ${id} is already occupied`)
			objectsIni.Objects[id] = iniFile
		})
		fs.writeFileSync(`${consts.tempWorkDir}/Objects/objects.ini`, ini.stringify(objectsIni))
	}

	// If exist, replace texture values on object ini files if needed

	if (globby.sync(`${levelDir}/Objects/*/*.ini`).length !== 0) {
		let objectIniPaths = globby.sync(`${levelDir}/Objects/*/*.ini`)
		objectIniPaths.forEach(objectIniPath => {
			const relativeObjectIniPath = objectIniPath.split("/").slice("3").join("/")
			console.log(relativeObjectIniPath)
			const objectIni = ini.parse(fs.readFileSync(objectIniPath, "utf-8"))
			Object.keys(objectIni).forEach(key => {
				if (!objectIni[key].texture) return
				if (changesDict.textures[objectIni[key].texture]) 
					objectIni[key].texture = changesDict.textures[objectIni[key].texture]
			})
			// console.log(objectIni)
			fs.writeFileSync(`${tempWorkDir}/Objects/${relativeObjectIniPath}`, ini.stringify(objectIni))
			// Object.entries(changesDict.textures).forEach(([from, to]) => {
			// 	// console.log(from, to)
			// 	paletteIni = paletteIni.replace(from, to)
			// })	
		})	
	}

}