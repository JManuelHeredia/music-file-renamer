export function stringCleaner( title:string ): string {
    if(!title) return '';
    let newTitle:string[] = title.trim().split(' ');

    //Remove/Ignore track numbers in the title with a format like this: "04 Title"
    newTitle.map(word => (word.match(/[a-zA-Z]/g)) ? word : '');

    //
    const romanNumerals:RegExp = new RegExp(/(?<![MDCLXVI])(?=[MDCLXVI])M{0,3}(?:C[MD]|D?C{0,3})(?:X[CL]|L?X{0,3})(?:I[XV]|V?I{0,3})[^ ]\b/i);
    //
    newTitle = newTitle.map(word =>{
        const startFrom = (word.charAt(0).match(/\W/)) ? 1 : 0;
        if(word.match(romanNumerals) && word.length < 4) return word.toUpperCase();
        return `${ (startFrom == 1) ? word.charAt(0): ''}${ word[startFrom].toUpperCase() + word.substring(startFrom + 1).toLowerCase()}`;
    });
    console.log(newTitle.join(' '));
    return newTitle.join(' ');
}