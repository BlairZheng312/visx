export function ave(data){
    let length = data.length;
    let sum = data.map(item => item.y).reduce((prev, next) => prev + next);
    return Math.round(sum/length,0)
}