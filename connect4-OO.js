//Part One: Make Game Into A Class
//Make a constructor that sets default values for global variables. 
class Game {
  //Every new game, the constructor is to reset these values. 
  //These values are the ones the players are going to pass as inputs. 
  constructor(p1, p2, wth, hght) {
    this.players = [p1, p2];
    this.currPlayer = p1;
    this.width = wth;
    this.height = hght;
    this.makeBoard();
    this.makeHtmlBoard();
  }

  //Methods/functions that will be called later on. 
  makeBoard() {
    this.board = [];
    for(let y = 0; y < this.height; y++) {
      this.board.push(Array.from({length : this.width}));
    }

  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    const top = document.createElement('tr');

    this.handleGameClick = this.handleClick.bind(this);

    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleGameCLick);

    for (let x = 0; x < this.width; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
      }

      board.append(row);
    }
  }

  handleClick(evt) {
    const x = evt.target.id;
    const y = this.findSpotForCol(x);
    if(y === null) {
      return;
    }

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if(this.checkForWin()) {
      return this.endGame(`The ${this.currPlayer.color} player has Won!`);
    }
    if(this.board.every(row => row.every(cell => cell))) {
      return this.endGame('It\'s a tie!');
    }

    this.currPlayer = this.currPLayer === this.players[0] ? this.players[1] : this.players[0];

  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.top = -50 * (y + 2);
    piece.style.backgroundColor = this.currPlayer.color;
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  checkForWin() {
    const _win = (cells) => {
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#column-top");
    top.removeEventListener('click', this.handleGameClick);
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

//Binding the buttons to useable and interactable pieces
const widthInt = document.getElementById('width');
const heightInt = document.getElementById('height');
const strtBtn = document.getElementById('start');

strtBtn.addEventListener('click', function(evt) {
  evt.preventDefault();
  if(!isFinite(widthInt.value) || !isFinite(heightInt.value)) {
    return alert('Width and height must be numbers greater than 5 and less than or equal to 10');
  }
  else if(widthInt.value > 10 || heightInt.value > 10) {
    return alert('One of two sides exceeded the size limit of 10!')
  }
  else if(widthInt.value < 6 || heightInt.value < 6) {
    return alert('One of two sides is smaller than the minimum of 6!')
  }

  let player1 = new Player(document.getElementById('p1Color').value);
  let player2 = new Player(document.getElementById('p2Color').value);

  let w = widthInt.value;
  let h = heightInt.value;

  new Game(player1, player2, w, h);
  // console.log(player1, player2, w, h);
})