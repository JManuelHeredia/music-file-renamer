
// const romanNumerals:RegExp = new RegExp(/(?<![MDCLXVI])(?=[MDCLXVI])M{0,3}(?:C[MD]|D?C{0,3})(?:X[CL]|L?X{0,3})(?:I[XV]|V?I{0,3})[^ ]\b/i);
export const romanNumerals:RegExp = new RegExp(/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i);

/**
 *
 * @param { String } tagStringToParse i.e. 'soy un /pescadito '
 * @returns { String } i.e. 'Soy Un Pescadito'
 */
export function titleCaseParser( tagStringToParse:string ): string {
    if(!tagStringToParse) return '';

    let newTitle:string[] = tagStringToParse.trim().replace(':', ';').replace('/', '').replace('\\', '').split(' '); //TODO: replace ':' for another char

    //Remove/Ignore track numbers in the title with a format like this: "04 Title"
    newTitle.map(word => (word.match(/[a-zA-Z]/g)) ? word : '');

    try {
        newTitle = newTitle.map(word =>{
            const startFrom = (word.charAt(0).match(/\W/)) ? 1 : 0;
            if(word.match(romanNumerals) && word.length < 4) return word.toUpperCase();
            return `${ (startFrom == 1) ? word.charAt(0): ''}${ word[startFrom].toUpperCase() + word.substring(startFrom + 1).toLowerCase()}`;
        });
    } catch (error) {
        console.log('Error parsing: ', tagStringToParse);
    }
    return newTitle.join(' ');
}