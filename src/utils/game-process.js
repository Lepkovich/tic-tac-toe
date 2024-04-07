let score = {
    x: -10,
    o: 10,
    tie: 0
};

let scoreArr = [];

export default {
    botRandomMoving(board) {
        const availableCells = this.checkAvailableCells(board);
        if (availableCells.length > 0) {
            const botMoveNumber = this.getRandomMove(availableCells.length - 1);
            return {
                i: availableCells[botMoveNumber].i,
                j: availableCells[botMoveNumber].j
            }
        }

        return null;
    },

    getRandomMove(max) {
        return Math.floor(Math.random() * max);
    },

    checkAvailableCells(board) {
        let cells = [];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === '') {
                    cells.push({i, j});
                }
            }
        }
        return cells;
    },

    checkPlayerWin(board, sign) {
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === sign && board[1][i] === sign && board[2][i] === sign) {
                return {win: true, winningCombination: [[0, i], [1, i], [2, i]]};
            }
        }

        for (let i = 0; i < 3; i++) {
            if (board [i][0] === sign && board [i][1] === sign && board [i][2] === sign) {
                return {win: true, winningCombination: [[i, 0], [i, 1], [i, 2]]};
            }
        }

        if (board[0][0] === sign && board[1][1] === sign && board[2][2] === sign) {
            return {win: true, winningCombination: [[0, 0], [1, 1], [2, 2]]};
        }

        if (board[0][2] === sign && board[1][1] === sign && board[2][0] === sign) {
            return {win: true, winningCombination: [[0, 2], [1, 1], [2, 0]]};
        }

        return {win: false, winningCombination: null};
    },

    setTrainBoard(i, j, score) {
        scoreArr.push({i, j, score});
    },

    getTrainBoard() {
        const colorMap = {
            10: 'green',
            0: 'yellow',
            '-10': 'red'
        };

        return scoreArr.map(item => {
            const color = colorMap[item.score] || ''; // Если значения нет в colorMap, используем пустую строку
            return {...item, score: color};
        });
    },

    bestMove(board, sign) {
        // AI to make its turn
        let bestScore = -Infinity;
        scoreArr = [];
        let move;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === '') {
                    board[i][j] = sign;
                    // let isMaximizing = false;
                    // if (sign === 'x') {
                    //     isMaximizing = true;
                    // }
                    let score = this.minimax(board, 0, false, sign); //было false
                    board[i][j] = '';
                    // console.log('координаты: i:' + i + ', j: ' + j + '. Score: ' + score)
                    this.setTrainBoard(i, j, score);
                    if (score > bestScore) {
                        bestScore = score;
                        move = {i, j};
                    }
                }
            }
        }
        let result = this.checkWinner(board);
        if (result === 'tie') {
            return null;
        }
        return {
            i: move.i,
            j: move.j
        }
    },


    minimax(board, depth, isMaximizing, sign) {
        let result = this.checkWinner(board);
        if (result != null) {
            return score[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Is the spot available?
                    if (board[i][j] === '') {
                        let nextMove = 'o'
                        if (sign === 'x') {
                            nextMove = 'x';
                        }
                        board[i][j] = nextMove; // был o
                        let score = this.minimax(board, depth + 1, false, sign);
                        board[i][j] = '';
                        bestScore = nextMove === 'o' ? Math.max(score, bestScore) : Math.min(score, bestScore);

                        // bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Is the spot available?
                    if (board[i][j] === '') {
                        let nextMove = 'x';
                        if (sign === 'x') {
                            nextMove = 'o';
                        }
                        board[i][j] = nextMove; //был x
                        let score = this.minimax(board, depth + 1, true, sign);
                        board[i][j] = '';
                        bestScore = nextMove === 'x' ? Math.min(score, bestScore) : Math.max(score, bestScore);
                        // всегда Infinity  - исправить логику
                        // bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    },

    equals3(a, b, c) {
        return (a === b && b === c && a !== '');
    },

    checkWinner(board) {
        let winner = null;

        // horizontal
        for (let i = 0; i < 3; i++) {
            if (this.equals3(board[i][0], board[i][1], board[i][2])) {
                winner = board[i][0];
            }
        }

        // Vertical
        for (let i = 0; i < 3; i++) {
            if (this.equals3(board[0][i], board[1][i], board[2][i])) {
                winner = board[0][i];
            }
        }

        // Diagonal
        if (this.equals3(board[0][0], board[1][1], board[2][2])) {
            winner = board[0][0];
        }
        if (this.equals3(board[2][0], board[1][1], board[0][2])) {
            winner = board[2][0];
        }

        let openSpots = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    openSpots++;
                }
            }
        }

        if (winner == null && openSpots === 0) {
            return 'tie';
        } else {
            return winner;
        }
    }
}

