
// const romanNumerals:RegExp = new RegExp(/(?<![MDCLXVI])(?=[MDCLXVI])M{0,3}(?:C[MD]|D?C{0,3})(?:X[CL]|L?X{0,3})(?:I[XV]|V?I{0,3})[^ ]\b/i);
export const romanNumerals:RegExp = new RegExp(/^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i);

/**
 *
 * @param { String } tagStringToParse i.e. 'soy un /pescadito '
 * @returns { String } i.e. 'Soy Un Pescadito'
 */

// ? Single, Deluxe, Edition, Bonus, Acustic?, Live

export function titleCaseParser( tagStringToParse:string ): string {
  if(!tagStringToParse){
    console.log('no string to parse?', tagStringToParse);
    return '';
  };

  let newString:string[] = tagStringToParse
    .trim()
    .replace( ':', ';' )
    .replace( '/', ''  )
    .replace( '-', '~' )
    .replace( '\\', '' )
    .replace( '?', '¿' )
    .split(' '); //TODO: replace ':' for another char

  // * Remove/Ignore track numbers in the title with a format like this: "04 Title"
  newString.filter( word => {
    return !!word.match(/[a-zA-Z]/g) ? true : false;
  })

  try {
    const stringRegex = new RegExp(/[a-zA-Z]/);
    newString = newString.filter( word =>{
      return stringRegex.test( word ) ? true : false;
    })
    newString = newString.map(( word, i ) =>{
      // ! TODO: Remerber the usage of this number, maybe '('
      // if( i == 0 && word.match( /\W/ )){
      //   console.log('What to print?');
      //   return '';
      // }
      const startFrom:number = ( word.charAt(0).match( /\W/ )) ? 1 : 0;
      if ( word.match( romanNumerals )) return word?.toUpperCase() ?? word;
      return `${ startFrom ? word.charAt(0): ''}${ word[ startFrom ]?.toUpperCase() + word.substring( startFrom + 1 ).toLowerCase()}`.trim().replace( 'undefined', '' );
    });
  } catch ( error ) {
    console.log( 'Error parsing: ', tagStringToParse );
    console.log( error );
  }
  return newString.join(' ').trim();
}

// TODO: Fix this error

// Error renaming: Fatum Horrificum; Why!.mp3
// C:\Stratorrider\Projects\JS\music-renamer-old\dist\index.js:90
//                     throw err;
//                     ^

// [Error: ENOENT: no such file or directory, rename 'M:\Tagging\Fatum Horrificum; Why!.mp3' -> 'M:\Tagging\Ayreon Fatum Horrificum; Why?!-Ayreon.mp3'] {
//   errno: -4058,
//   code: 'ENOENT',
//   syscall: 'rename',
//   path: 'M:\\Tagging\\Fatum Horrificum; Why!.mp3',
//   dest: 'M:\\Tagging\\Ayreon Fatum Horrificum; Why?!-Ayreon.mp3'
// }