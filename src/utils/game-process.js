export default {
    botMoving(board) {
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

        return {win:false, winningCombination: null};
    }
}