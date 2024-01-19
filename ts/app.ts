import * as global from "./global.js";

class CampoMinado {
	public campo: Array<Array<{value:number, found:boolean, flag:boolean}>>;

	constructor(public nLines: number, public nColumns: number) {
		this.campo = [];

		for (let i = 0; i < nLines; i++) {
			this.campo.push([]);
			for (let j = 0; j < nColumns; j++) {
				this.campo[i].push({value: 0, found: false, flag: false});
			}
		}
	}

	public renderCampo(id: string) {
		let el = document.querySelector(`#${id}`);
		let table = '<table>';
		this.campo.forEach((line, i) => {
			table += '<tr>';
			/* Como funciona o render
				- Não chutado: any, found:false, flag:false
				- Bandeira:    any, found:false, flag:true
				- Mina:        -1,  found true
				- Numeros:     0~9, found true
			*/
			line.forEach((cell, j) => {
				if (this.campo[i][j].found) {
					if (this.campo[i][j].value == -1) // Mina
						table += `<td> <button name='cell' class='cell_mine'><image class='icon' src='./assets/mine.png'/></button> </td>`;
					
					else if (this.campo[i][j].value == 0)
						table += `<td> <button name='cell' class='cell_nums'>&nbsp</button> </td>`;

					else if (this.campo[i][j].value < 10) // Numero revelado
						table += `<td> <button name='cell' class='cell_nums_${this.campo[i][j].value}'>${this.campo[i][j].value}</button> </td>`;

					else // Possivel erro
						table += `<td> <button name='cell' class='cell_error'>${this.campo[i][j].value}</button> </td>`;
				} 
				else {
					if (this.campo[i][j].flag) // Bandeira
						table += `<td> <button name='cell' class='cell_unclicked'><image class='icon' src='./assets/flag.png'/></button> </td>`;

					else // Campo não revelado
						table += `<td> <button name='cell' class='cell_unclicked'>&nbsp</button> </td>`;
				}
			})
			table += '</tr>';
		});
		el!.innerHTML = table;
		
		document.getElementsByName(`cell`).forEach((element, key) => {
			let i = Math.floor(key / this.nColumns);
			let j = key % this.nColumns;
			element.addEventListener('click', event => { this.cellClicked(i, j) } ); // left click
			element.addEventListener('contextmenu', event => { this.toggleFlag(event, i, j) }); // right click
		});
	}

	public toggleFlag(event:MouseEvent, i: number, j: number) {
		event.preventDefault();
		
		if (gameover != GameOver.no) return; // Jogo já acabou

		if (!this.campo[i][j].found) {
			if (this.campo[i][j].flag) {
				this.campo[i][j].flag = false;
				nbands++;
			}
			else if (nbands > 0) { // só deixa colocar flag se haver bandeiras disponíveis
				this.campo[i][j].flag = true;
				nbands--;
			}
		}

		this.renderCampo('campo_minado');
		this.renderBands('nbands');
	}
	
	public cellClicked(i:number, j:number) {
		if (gameover != GameOver.no) return; // Jogo já acabou
		if (this.campo[i][j].flag) return; // nn deixa revelar a celula caso tiver uma flag

		this.campo[i][j].found = true;

		if (this.campo[i][j].value == -1) { // Se clicou numa mina, perdeu
			gameover = GameOver.defeat;
		}
		else if (this.campo[i][j].value == 0) {
			this.RevealCells(i, j);
		}

		if (this.ChecaVitoria()) gameover = GameOver.victory;

		this.renderCampo('campo_minado');

		if (gameover == GameOver.defeat) {alert("Você Perdeu!");}
		if (gameover == GameOver.victory) {alert("Você Ganhou!");}
	}

	public ChecaVitoria(): boolean {
		// passa por todas as cécluas:
		// se célula tem value > -1 e nn foi found, retorne false. se passou por todas retorna true
		for (let i = 0; i < this.nLines; i++) {
			for (let j = 0; j < this.nColumns; j++) {
				if (this.campo[i][j].value > -1 && !this.campo[i][j].found) return false;
			}
		}
		return true;
	}

	public RevealCells(i:number, j:number) {
		// acessa as células adjacentes;
		// p/ cada célula verifica se ja foi revelada:
		// 		caso ss, nn faz nada
		// 		caso nn, a revela, caso seu valor for 0, chama a função nessa célula

		for (let ii = i-1; ii <= i+1; ii++) {
			if (ii >= 0 && ii < this.nLines) {
				for (let jj = j-1; jj <= j+1; jj++) {
					if (jj >= 0 && jj < this.nColumns) {
						if (!this.campo[ii][jj].found) {
							this.campo[ii][jj].found = true;
							if (this.campo[ii][jj].value == 0) this.RevealCells(ii, jj);
						}
					}
				}
			}
		}
	}

	public geraCampo(nMinas: number) {
		for (let n = 0; n < nMinas; n++) { // colocando as minas
			while (true) {
				let i = global.randInt(0, this.nLines-1);
				let j = global.randInt(0, this.nColumns-1);

				if(this.campo[i][j].value != -1) {
					this.campo[i][j].value = -1;
					break;
				}
			}
		}

		for (let i = 0; i < this.nLines; i++) { // colocando os valores 
			for (let j = 0; j < this.nColumns; j++) {
				if (this.campo[i][j].value == -1) continue; // para se a celula for mina
				let counter = 0;

				for (let offi = -1; offi <= 1; offi++) {
					if ((offi+i < 0) || (offi+i >= this.nLines)) continue; // para se estiver fora do campo
					for (let offj = -1; offj <= 1; offj++) {
						if ((offj+j < 0) || (offj+j >= this.nColumns)) continue; // para se estiver fora do campo
						if (this.campo[offi+i][offj+j].value == -1) counter++; // soma se value da mascara for mina
					}
				}

				this.campo[i][j].value = counter;
			}
		}
	}

	public renderBands(id: string) {
		let  el = document.querySelector(`#${id}`);
		el!.innerHTML = nbands.toString();
	}
}

/*Falta:
	Melhorar popup de vitória/derrota
*/

document.getElementsByTagName('body')[0].addEventListener('contextmenu', event => {event.preventDefault();});

enum GameOver {
	no,
	victory,
	defeat
}

var gameover: GameOver = GameOver.no;

const NMINAS = 50;
var nbands = NMINAS;

var cm = new CampoMinado(11, 21);
cm.geraCampo(NMINAS);

cm.renderCampo('campo_minado');
cm.renderBands('nbands');

