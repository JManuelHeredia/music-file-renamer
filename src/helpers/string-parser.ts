export function stringCleaner( title:string ): string {
    if(!title) return '';
    let newTitle:string[] = title.trim().split(' ');


    newTitle.map(word => (word.match(/[a-zA-Z]/g)) ? word : '')

    newTitle = newTitle.map(word => `${word[0].toUpperCase() + word.substring(1).toLowerCase()}`);

    return newTitle.join(' ');
}