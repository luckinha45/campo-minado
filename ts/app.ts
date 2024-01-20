document.querySelector('#btn_start')?.addEventListener('click', event => { start_game() } );

function start_game() {

	let minas = (<HTMLInputElement>document.querySelector('#txt_minas'))?.value;
	let cols = (<HTMLInputElement>document.querySelector('#txt_cols'))?.value;
	let rows = (<HTMLInputElement>document.querySelector('#txt_rows'))?.value;

	console.log(minas, cols, rows);
	
	location.href = `sudoku.html?minas=${minas}&cols=${cols}&rows=${rows}`;
}