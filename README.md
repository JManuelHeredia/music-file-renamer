This only works for files with current metatags available. If not the result will be something like \[missing_title]\[missing_artist].mp3

## Usage

```
npm install
```

If you dont have TypeScript installed then run in terminal as Admin:
```
npm install --global typescript
```

Transpile .ts files in root directory
```
tsc
```

Just run ``node ... <files_path> `` where the mp3 files are stored

```
node .\dist\index.js "D:\Music"
```
or cd to dist
```
node .\index.js "D:\Music"
```
depending on where your files are located...

For now only runs on windows because difference on path names. This will work on Linux as soon as possible. Also exceptions have to be done like already renamed files...


## Sample



![Sample image](/test.png)

## TODO:

Remove prefixes like: 'EP', 'Japanesse Edition'...
Like UnitWork for updating metatags

FIXME: 'VI' roman number outputs 'Vi'