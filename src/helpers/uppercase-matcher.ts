import { romanNumerals } from "./string-parser";

/**
 *
 * @param { Sting } songData [ 'AlbumName', 'Artist or Band', 'Title' ]
 * @returns { Boolean } Has a lot of Uppercase letters but not a Roman Numeral?
 */

export const uppercaseMatch = ( songData:string ):boolean => {
    if( !songData ) return false;

    if( romanNumerals.test( songData )) return false;
    let counter:number = 0;
    for(let i = 1; i < songData.length; i++){
        if(songData.charCodeAt(i) > 64 && songData.charCodeAt(i) < 91) counter++;
        if(counter >= 1 && songData.length <= 2) return true;
        if(counter >= 2 && songData.length >= 2) return true;
    }
    return false;
}