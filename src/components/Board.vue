<script setup>
import Cell from './Cell.vue';
import {ref} from "vue";
import gameProcess from "../utils/game-process";

const board = ref([
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]);

const props = defineProps(['isBotPlaying', 'withMinimax', 'trainingMode']);
const emit = defineEmits(['end']);
let botMoving = [];
let trainingBoard = [];

let locked = false;
let moveCount = ref(1);
const result = ref({win: false, winningCombination: []});


function doMoveHandler(i, j, value) {

  if (locked) return true; // waiting while bot moving
  board.value[i][j] = value; // make player move
  moveCount++; // making counts (odd - Х, even - O)


  result.value = gameProcess.checkPlayerWin(board.value, value);
  if (result.value.win) {
    if (value === 'x') {
      emit('end', 'user');
    } else {
      emit('end', 'user2');
    }
  } else if (props.isBotPlaying || props.trainingMode) {
    botMove(value);
  }
  if (moveCount === 10) {
    emit('end', 'draw');
  }

}

function botMove(value) {
  locked = true;
  setTimeout(() => {
    if (props.trainingMode) {
      let nextMove = 'x';
      if (value === 'x') {
        nextMove = 'o'
      }
      botMoving = gameProcess.bestMove(board.value, nextMove);
      trainingBoard = gameProcess.getTrainBoard();
    } else {
      if (props.withMinimax) {
        botMoving = gameProcess.bestMove(board.value, 'o');
      } else {
        botMoving = gameProcess.botRandomMoving(board.value);
      }
      if (botMoving && botMoving.length !== 0) {
        board.value[botMoving.i][botMoving.j] = 'o';
        result.value = gameProcess.checkPlayerWin(board.value, 'o');
        if (result.value.win) {
          emit('end', 'bot');
        }
      } else {
        emit('end', 'draw');
      }
    }

    locked = false;
  }, 300)
}

function cellColor(i, j) {
  if (trainingBoard && trainingBoard.length > 0) {
    const foundItem = trainingBoard.find((cell) => cell.i === i && cell.j === j);
    if (foundItem) {
      return foundItem.score || ''; // Возвращаем цвет
    }
  }

  return false; // Возвращаем пустую строку, если не найден элемент или не используется withMinimax
}

function endGame() {
  moveCount = 1;
  result.winningCombination = [];
  trainingBoard = [];
  setTimeout(() => {
    // clear board
    board.value = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]
  }, 300)
}

function isCellPartOfWinningCombination(i, j) {
  if (result.value.win) {
    const combination = result.value.winningCombination;
    return combination.some(coord => coord[0] === i && coord[1] === j);
  }
  return false;
}

// function isCellEmpty(i, j) {
//   if (!props.trainingMode) {
//     const emptyCell = gameProcess.checkAvailableCells(board.value);
//     return emptyCell.find((cell) => cell.i === i && cell.j === j)
//   }
//   return false;
// }


defineExpose({endGame});

</script>

<template>
  <div class="board">
    <template v-for="(iValue, i) in board">
      <template v-for="(jValue, j) in iValue">
        <Cell :value="jValue" :is-bot-playing="isBotPlaying" :moveCount="moveCount"
              :is-winning-cell="isCellPartOfWinningCombination(i, j)"
              :cell-color="cellColor(i, j)"
              @do-move="(value) => doMoveHandler(i, j, value)"/>

      </template>
    </template>
  </div>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  border: 3px solid #d0d0d0;
}
</style>
