import fs from 'fs';
import NodeID3 from 'node-id3';

import { titleCaseParser } from './helpers/string-parser';
import { uppercaseMatch } from './helpers/uppercase-matcher';

function main(): void{

    let artistAndAlbums: Map<string, [ string ]> = new Map();

    const argPath:string = process.argv[2].toString();
    // Provided Folder/Path is valid
    if(!fs.existsSync(argPath)){
        console.log(`Invalid path ${argPath}... Exiting...`);
        return;
    }

    // Get files list
    const files = fs.readdirSync(argPath).filter( file => fs.lstatSync(argPath+'\\'+file).isFile() && file.substring(file.length - 4) == '.mp3');

    // If not mp3 files, warn
    if(!files.length){
        console.log('No mp3 files in this folder');
        return;
    }
    // NodeID3 Options: Get selected metatags
    const options:object = {
        include: ['TALB', 'TIT2', 'TPE1'], // Album, Title, Artist
        noraw:   true
    }

    // Loop each file in [/path/file] arr
    files.forEach(( file, i ) => {
        const filename:string =  `${argPath}\\${file}`;
        const tags:any = NodeID3.read(`${argPath}\\${file}`, options);
        let { album, title, artist }: { album:string; title:string; artist:string  } = { ...tags };
        // console.log(tags);
        if(!title){
            console.warn(file, "data missing: Title");
            // title = '[MISSING_TITLE]';
        }
        if(!artist){
            console.warn(file, "data missing: Artist");
            // artist = '[MISSING_ARTIST]';
        }
        // Sanitize and trim tag strings
        const newTitle:string   = title  ? titleCaseParser(title)  : file.substring( 0, ( file.length - 4 ));
        const parsedArtist:string  = artist ? titleCaseParser(artist) : artist;
        const parsedAlbum:string   = album  ? titleCaseParser(album)  : album;

        if( !artistAndAlbums.get( parsedArtist )){
            artistAndAlbums.set( parsedArtist, [ parsedAlbum ]);
        }

        //Remove Uppercase for MetaTags
        if(uppercaseMatch(title) || title !== newTitle){
            NodeID3.update(
                {
                    title: newTitle ?? title
                },
                filename
            );
        }
        if(uppercaseMatch(artist) || artist !== parsedArtist){
            NodeID3.update(
                {
                    artist: parsedArtist ?? artist
                },
                filename
            );
        }
        if(uppercaseMatch(album) || album != titleCaseParser(album)){
            NodeID3.update(
                {
                    album: parsedAlbum ?? album
                },
                filename
            );
        }

        // New expected filename. i.e. 'Pescadito-Los Pescaditos.mp3'
        let newFileName:string = `${argPath}\\${newTitle}-${parsedArtist}.mp3`;

        //
        if(filename === newFileName){
            console.log(`${filename}`, 'not renamed, file already has the expected name.');
            return;
        }
        else{
            // Rename files that can be renamed
            fs.rename(filename, newFileName, (err) => {
                if(err) {
                    console.log( 'Error renaming:', file);
                    throw err;
                }
                console.log(filename, "renamed succefully!");
            });
        }

    });

    let parsedMap: string = '';
    artistAndAlbums.forEach(( value, key ) => {
        parsedMap += `Iterpeter:${ key } Album:${ value[0] }|`;
    });

    fs.appendFileSync( `${argPath}\\listened.txt`, parsedMap );
    // Finish?
}

main();