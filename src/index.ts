import fs from 'fs';
import NodeID3 from 'node-id3';

import { titleCaseParser }      from './helpers/string-parser';
import { uppercaseMatch }       from './helpers/uppercase-matcher';
import { loadBandsAndAlbumsDB, writeToDB } from './helpers/album-db-validator';

interface Band {
  band_name: string,
  albums: string[]
}

interface Bands {
  [ key: string ]: Band
  // band: Band[]
}

function main(): void{

  // let artistAndAlbums:[ object, string[]];
  let bands:Bands = {};

  // ! Expected to be executed with a path arg i.e. node index.js 'valid-path'
  const argPath:string = process.argv[2].toString(); 
  if( !fs.existsSync( argPath )){
    console.log(`Invalid path ${ argPath }... Exiting...`);
    return;
  }

  // Get files list
  const files = fs.readdirSync( argPath )
    .filter( file => fs.lstatSync( argPath+'\\'+file ).isFile() && file.substring( file.length - 4 ) == '.mp3' );

  let [ artistAndAlbums, bandNames ]:[ Bands, string[] ] = loadBandsAndAlbumsDB();

  // If not mp3 files, warn
  if( !files.length ){
    console.log( 'No mp3 files in this folder' );
    return;
  }
  // NodeID3 Options: Get selected metatags
  const options:object = {
    include : [ 'TALB', 'TIT2', 'TPE1' ], // Album, Title, Artist
    noraw   : true
  }

  // Loop each file in [/path/file] arr
  files.forEach(( file, i ) => {
    const filename:string = `${ argPath }\\${ file }`;
    const tags:any = NodeID3.read( filename , options );
    let { album, title, artist }: { album:string; title:string; artist:string  } = { ...tags };
    // console.log(tags);
    if( !title ){
      console.warn( file, "Data missing: Title" );
    }
    if( !artist ){
      console.warn( file, "Data missing: Artist" );
    }
    // Sanitize and trim tag strings
    const newTitle:string     = title  ? titleCaseParser( title )  : titleCaseParser( file.substring( 0, ( file.length - 4 )));
    const parsedArtist:string = artist ? titleCaseParser( artist ) : artist;
    const parsedAlbum:string  = album  ? titleCaseParser( album )  : album;

    // * Add artist and album to the object
    // ! Band append here

    let objBandName:string = parsedArtist.toLocaleLowerCase().split(' ').join('_');

    let band:Band = {
      band_name : parsedArtist,
      albums    : bands[ objBandName ]?.albums?.includes( parsedAlbum ) ?
        bands[ objBandName ].albums : [ parsedAlbum.trim() ]
    }

    bands[ objBandName ] = band;

    //Remove Uppercase for MetaTags
    if( uppercaseMatch( title ) || title !== newTitle ){
      NodeID3.update(
        {
          title: newTitle ?? title
        },
        filename
      );
    }
    if( uppercaseMatch(artist) || artist !== parsedArtist ){
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

    const tempFileName:string = `${ newTitle }-${ parsedArtist }`
    // New expected filename. i.e. 'Pescadito-Los Pescaditos.mp3'
    const newFileName:string = `${ argPath }\\${ tempFileName }.mp3`;

    //
    if( file === tempFileName ){
      console.log(`${filename}`, 'not renamed, file already has the expected name.');
      return;
    }
    else{
      // Rename files that can be renamed
      fs.rename( filename, newFileName, ( err ) => {
        if(err) {
          console.log( 'Error renaming:', file );
          throw err;
        }
        console.log( tempFileName, "renamed succefully!" );
      });
    }

  });

  // ! Check repeated albums
  // FIXME!!
  let warnedItems:string[] = [];
  Object.keys( bands ).forEach( bandName =>{
    if( !bandNames.includes( bandName )){
      return; //Band not listened yet
    }

    const listenedAlbums = artistAndAlbums[ bandName ].albums;
    bands[ bandName ].albums.forEach( album => {
      listenedAlbums.map( listenedAlbum =>{
        if( listenedAlbum == album ){
          if( warnedItems.includes( album )) return;
          console.warn( `Album ${ album } from band ${ bandName } already listened?` );
          warnedItems.push( album )
          return;
        }
        if( !listenedAlbums.includes( album )){
          artistAndAlbums[ bandName ].albums.push( album );
        }
      })
      let { [ bandName ]:toRemove, ...restBands } = bands;
      bands = {
        ...restBands
      }
    })
  })

  artistAndAlbums = {
    ...artistAndAlbums,
    ...bands
  }

  writeToDB( artistAndAlbums );
  // Finish?
}

main();