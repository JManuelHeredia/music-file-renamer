// import yargs from 'yargs/yargs';
import fs from 'fs';
import NodeID3 from 'node-id3';
import { stringCleaner } from './helpers/string-parser';

function main(): void{
    const argPath:string = process.argv[2].toString();

    const musicFolder: boolean = fs.existsSync(argPath);

    if(!musicFolder){
        console.log(`Invalid path ${argPath}`);
        return;
    }

    // Get files list
    const files = fs.readdirSync(argPath).filter( file => fs.lstatSync(argPath+'\\'+file).isFile() && file.substring(file.length - 4) == '.mp3');

    // If not mp3 files, warn
    if(!files.length){
        console.log('No mp3 files in this folder');
        return;
    }
    // Get files metatags
    const options:object = {
        include: ['TALB', 'TIT2', 'TPE1'],
        noraw:   true
    }

    files.forEach(file => {
        const filename:string =  `${argPath}\\${file}`;
        const tags:any = NodeID3.read(`${argPath}\\${file}`, options);
        let { title, artist }: { title:string; artist:string  } = { ...tags };
        if(!title){
            console.warn(filename, "data missing: Title");
            // title = '[MISSING_TITLE]';
        }
        if(!artist){
            console.warn(filename, "data missing: Artist");
            // artist = '[MISSING_ARTIST]';
        }
        // Sanitize and trim file name
        title  = stringCleaner(title)  || '[MISSING_TITLE]';
        artist = stringCleaner(artist) || '[MISSING_ARTIST]';
        const newFilename:string = `${argPath}\\${title}-${artist}.mp3`;
        // Rename files that can be renamed
        fs.rename(filename, newFilename, (err) => {
            if(err) throw err;
            console.log(filename, "renamed succefully!");
        });
    });
    // Finish?
}

main();