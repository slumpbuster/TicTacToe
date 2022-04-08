const squares = [[0,1,2],[3,4,5],[6,7,8]];

const Page = () => {
  return (
    <Board />
  )
}

const Board = () => {
  // 1st player is X ie 1
  // State keeps track of next player and gameState
  const [player, setPlayer] = React.useState(1);
  const [gameState, setGameState] = React.useState([]);
  let winner = checkForWinner(gameState);
  let done = winner === -1 ? false : true;
  let status = `Winner is ${winner === -1 ? 'No winner yet' : winner === 0 ? 'Payer O' : 'Player X'}`;
  let turn = `Next Player: Player ${player == '0' ? 'O' : 'X'}`;

  const takeTurn = (id) => {
    setGameState([...gameState, { id: id, player: player }]);
    setPlayer((player + 1) % 2); // get next player
    return player;
  };
  function renderRow(row) {
    return row.map((column) => renderSquare(column))
  }
  function renderSquare(i) {
    // use properties to pass callback function takeTurn to Child
    return (
      <Square key={`square_${i}`} takeTurn={takeTurn} id={i} done={done}></Square>
    )
  }

  return (
    <div className="game-board">
      {squares.map((row) => (
        <div key={`row_${row}`} className="grid-row">
          {renderRow(row)}
        </div>
      ))}
      <div id="info">
        <h1 id="turn">{turn}</h1>
        <h1 id="winner">{status}</h1>
      </div>
    </div>
  );
};

const Square = ({ takeTurn, id, done }) => {
  const mark = ['O', 'X', '+'];
  // id is the square's number
  // filled tells you if square has been filled
  // tik tells you symbol in square (same as player)
  // You call takeTurn to tell Parent that the square has been filled
  const [filled, setFilled] = React.useState(false);
  const [tik, setTik] = React.useState(2);
  const [disabled, setDisabled] = React.useState(Array.from(Array(9).keys()).fill(false, 0, 9));

  return (
    <button disabled={!done ? disabled[id] : done}
      className={tik == '1' ? 'red' : 'white'}
      onClick={() => {
        disabled[id] = true;
        setDisabled(disabled)
        setTik(takeTurn(id));
        setFilled(true);
        //console.log(`Square: ${id} filled by player : ${tik}`);
      }}
    >
      <h1>{mark[tik]}</h1>
    </button>
  );
};

const Game = () => {
  return (
    <div className="game">
      <Board></Board>
    </div>
  );
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

ReactDOM.render(<Page />, document.getElementById('root'));
