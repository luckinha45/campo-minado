export function randInt(min:number, max:number): number {
	let diff = max-min+1;
	return min + Math.floor(Math.random() * diff);
}

export function inRange(value:number, min:number, max:number) {
	return value >= min && value <= max;
}
