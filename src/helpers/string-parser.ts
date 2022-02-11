export function stringCleaner( title:string ): string {
    if(!title) return '';
    let newTitle:string[] = title.split(' ');

    while(!newTitle[0].match(/[a-zA-Z]/g)?.length){
        newTitle.shift();
    }

    newTitle = newTitle.map(word => `${word[0].toUpperCase()}${word.substring(1).toLowerCase()}`);

    return newTitle.join(' ');
}