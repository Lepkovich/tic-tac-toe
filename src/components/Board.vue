<script setup>
import Cell from './Cell.vue';
import {ref} from "vue";
import gameProcess from "../utils/game-process";

const board = ref([
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]);

const props = defineProps(['isBotPlaying']);
const emit = defineEmits(['end']);


let locked = false;
let moveCount = ref(1);
const result = ref({ win: false, winningCombination: [] });


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
  } else {
    if (props.isBotPlaying) {
      botMove();
    } else {
      if (moveCount === 10) {
        emit('end', 'draw');
      }
    }
  }

}

function botMove() {
  locked = true;
  setTimeout(() => {
    const botMoving = gameProcess.botMoving(board.value);
    if (botMoving) {
      board.value[botMoving.i][botMoving.j] = 'o';
      result.value = gameProcess.checkPlayerWin(board.value, 'o');
      if (result.value.win) {
        emit('end', 'bot');
      }
    }
    else {
      emit('end', 'draw');
    }
    locked = false;
  }, 300)
}

function endGame() {
  moveCount = 1;
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

defineExpose({endGame});

</script>

<template>
  <div class="board">
    <template v-for="(iValue, i) in board">
      <template v-for="(jValue, j) in iValue">
        <Cell :value="jValue" :is-bot-playing="isBotPlaying" :moveCount="moveCount"
              :is-winning-cell="isCellPartOfWinningCombination(i, j)"
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
