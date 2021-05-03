# Toblo Unified Custom Levels

Toblo Unified Custom Levels is a project that compiles scarce Toblo levels from around the web, and provides easy drag-and-drop installation for them.

## Usage

Coming soon! For now, read [Building](#building).

## Building

### Requirements

- Windows operating system
- Node.js (14)
- Toblo

### How-to

1. Run `Script/copy.bat`. This will set up Toblo inside this folder.
2. Run `node Script/Build/index.js`. This will build the files that you can copy directly into the Toblo folder (`Temp`), as well as another folder that you can run Toblo directly with (`TempTest`).

## License

Levels located inside the `Levels` folder are subject to other rights. Read [CREDITS.md](CREDITS.md).

The scripts and other files are licensed under the terms of [the MIT License](LICENSE).

----


## Level folder structure

### Tree

```bash
📁 [level name]
├── 📁 Level
├── 📁 Objects
├── 📄 Materials.ini
├── 📄 Objects.ini
├── 📄 Palette.ini
└── 📄 Textures.ini
```

### Description

- `Level` folder  
  Files that will be added on `Levels/[folder name]` folder
- `Objects` folder  
  Files that will be added on `Objects` folder
- `Materials.ini` file  
  Materials that will be added on `Config/Graphics/gfxGameAssets.ini`
- `Objects.ini` file  
  Objects that will be added on `Objects/objects.ini`
- `Palette.ini` file  
  The level palette that the level will use
- `Textures.ini` file  
  Textures that will be added on `Config/Graphics/gfxGameAssets.ini`

## 10 level limitation

Because of an oversight, instead of the whole number is used for the level ID, only the first character of the whole number is used for the ID. This means that the valID: IDs are from 0 to 9.

Some examples of this bug when inputing the ID: other than 0 to 9 are listed below.
- 10 → 1 → Level ID: 1
- 11 → 1 → Level ID: 1
- 20 → 2 → Level ID: 2
- 30 → 3 → Level ID: 3
- 100 → 1 → Level ID: 1
- 255 → 2 → Level ID: 2
- 1000 → 1 → Level ID: 1
- 9999 → 9 → Level ID: 9
- -1 → NaN → Level ID: 0
- a → NaN → Level ID: 0
- string → NaN → Level ID: 0

The developers stated that this bug won't be fixed in near future. [See the discussion on Google Groups](https://groups.google.com/g/toblolevels/c/i28OKqDzFy8).
