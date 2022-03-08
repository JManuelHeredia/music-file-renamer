export const uppercaseMatch = ( songData:string ):boolean => {
    let counter:number = 0;
    for(let i = 1; i < songData.length; i++){
        if(songData.charCodeAt(i) > 64 && songData.charCodeAt(i) < 91) counter++;
        if(counter >= 1 && songData.length <= 2) return true;
        if(counter >= 2 && songData.length >= 2) return true;
    }
    return false;
}