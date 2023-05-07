import fs from 'fs';

export interface Band {
  band_name: string,
  albums: string[]
}

export interface Bands {
  [ key: string ]: Band
}


export const loadBandsAndAlbumsDB = ( path:string = 'M:' ): [ Bands, string[]] /*:Map< string, string[] >*/ => {
  try {
    let albumsAndBands:string = fs.readFileSync( `${ path }\\json_bands.json`, { encoding: 'utf-8' });

    let parsedBands:Bands = JSON.parse( albumsAndBands );

    let bandNames:string[] = Object.keys(parsedBands)
    return [ parsedBands, bandNames ]
  } catch (error) {
    console.log( error );
  }
  // return bands;
  return [{}, []]
}

export const writeToDB = ( payload:object ): void => {
  if( !payload ) return;
  fs.writeFileSync( `M:\\json_bands.json`, JSON.stringify( payload ));
}