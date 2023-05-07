
// const romanNumerals:RegExp = new RegExp(/(?<![MDCLXVI])(?=[MDCLXVI])M{0,3}(?:C[MD]|D?C{0,3})(?:X[CL]|L?X{0,3})(?:I[XV]|V?I{0,3})[^ ]\b/i);
export const romanNumerals:RegExp = new RegExp(/^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i);

/**
 *
 * @param { String } tagStringToParse i.e. 'soy un /pescadito '
 * @returns { String } i.e. 'Soy Un Pescadito'
 */

// ? Single, Deluxe, Edition, Bonus, Acustic

export function titleCaseParser( tagStringToParse:string ): string {
  if(!tagStringToParse) return '';

  let newString:string[] = tagStringToParse
    .trim()
    .replace( ':', ';' )
    .replace( '/', ''  )
    .replace( '-', '~' )
    .replace( '\\', '' )
    .split(' '); //TODO: replace ':' for another char

  // * Remove/Ignore track numbers in the title with a format like this: "04 Title"
  newString.map( word => ( word.match(/[a-zA-Z]/g)) ? word : '' );

  try {
    newString = newString.map(( word, i ) =>{
      // ! TODO: Remerber the usage of this number, maybe '('
      if( i == 0 && word.match( /\W/ ) ) return '';
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