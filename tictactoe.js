let cpu = true;
const squares = [[0,1,2],[3,4,5],[6,7,8]];
let totalClicks = 0;

const Settings = () => {
  const handleChange = (e) => {
    if (e.target.value === "2") {
      cpu = false;
    } else {
      cpu = true;
    }
  }
  return (
    <div style={{display: "inline-block", width: "200px", margin: "4px 8px 4px 8px"}}>
      <h1>Tik Tak Toe</h1>
      <select disabled={totalClicks === 0 ? false : true} onChange={(e) => {handleChange(e)}}>
        <option value="1">One Player Mode</option>
        <option value="2">Two Player Mode</option>
      </select>
    </div>
  )
}

const Board = () => {
  // 1st player is X ie 1
  // State keeps track of next player and gameState
  const [player, setPlayer] = React.useState(1);
  const [gameState, setGameState] = React.useState([]);
  const [disabled, setDisabled] = React.useState(Array.from(Array(9).keys()).fill(false, 0, 9));
  let winner = checkForWinner(gameState);
  let done = winner === -1 ? false : true;
  let status = `${winner === -1 && totalClicks === 9 ? 'Game is a Draw' : winner === 0 ? 'Player O' : 'Player X'}`;
  let turn = `Player ${player == '0' ? 'O' : 'X'} Move`;

  const takeTurn = (id) => {
    setGameState([...gameState, { id: id, player: player }]);
    setPlayer((player + 1) % 2); // get next player
    disabled[id] = true;
    setDisabled(disabled);
    return player;
  };
  function renderRow(row) {
    return row.map((column) => renderSquare(column))
  }
  function renderSquare(i) {
    // use properties to pass callback function takeTurn to Child
    return <Square key={`square_${i}`} player={player} takeTurn={takeTurn} id={i} done={done} disabled={disabled}></Square>
  }

  return (
    <div className="game">
      <Settings key="settings" />
      <div style={{display: "inline-block", width: "600px"}}>      
        <div className="game-board">
          {squares.map((row) => (
            <div key={`row_${row}`} className="grid-row">
              {renderRow(row)}
            </div>
          ))}
          <ul className="info">
            <li className="black">{winner != -1 || totalClicks === 9 ? 'Winner: ' : 'Turn: '}</li>
            <li className={winner == -1 && totalClicks === 9
              ? 'black'
              : winner == 1
                ? 'red'
                : winner == 0
                  ? 'white'
                  : player == '1'
                    ? 'red'
                    : 'white'}>{winner != -1 || totalClicks === 9 ? '' + status : turn}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Square = ({ takeTurn, player, id, done, disabled }) => {
  const mark = ['O', 'X'];
  // id is the square's number
  // tik tells you symbol in square (same as player)
  const [tik, setTik] = React.useState(2);

  const move = (e, id) => {
    if (cpu && player === 0 && (e.screenX > 0 || e.screenY > 0)) return;
      totalClicks ++;
      setTik(takeTurn(id));
      if (cpu && totalClicks < 9 && !done && player === 1) {
        setTimeout(computerMove, 1000);
      }
  }
  const computerMove = () => {
    let i = -1;
    do {
      let random = Math.floor(Math.random() * 9);
      if (!disabled[random]) i = random;
      //console.log(i, random)
    } while (i === -1);
    if (i != -1) {
      document.getElementById(`square_${i}`).click();
    }
  }

  return (
    <button key={`square_${id}`} id={`square_${id}`} disabled={!done ? disabled[id] : done}
      className={tik == '1' ? 'red' : 'white'}
      onClick={(e) => {move(e, id)}}
    >
      {mark[tik]}
    </button>
  );
};

const Game = () => {
  return <Board />
};

// Checking for Winner takes a bit of work
// Use JavaScript Sets to check players choices
// against winning combinations
// Online there is more compact version but Dr. Williams prefers this one

const win = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonal
  [0, 4, 8],
  [2, 4, 6],
];

const checkPlayerTurn = (gameState) => {
  return gameState.player;
};

const checkForWinner = (gameState) => {
  // get array of box id's
  // can't be a winner in less than 5 turns
  if (gameState.length < 5) return -1;
  let p0 = gameState.filter((item) => {
    if (item.player == 0) return item;
  });
  p0 = p0.map((item) => item.id);
  let px = gameState.filter((item) => {
    if (item.player == 1) return item;
  });
  px = px.map((item) => item.id);
  if (p0 != null && px != null) {
    var win0 = win.filter((item) => {
      return isSuperset(new Set(p0), new Set(item));
    });
    var winX = win.filter((item) => {
      return isSuperset(new Set(px), new Set(item));
    });
  }
  if (win0.length > 0) return 0;
  if (winX.length > 0) return 1;
  return -1;
};
// check if subset is in the set
function isSuperset(set, subset) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

ReactDOM.render(<Game />, document.getElementById('root'));
