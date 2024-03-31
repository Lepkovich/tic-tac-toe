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


let locked = false;
let moveCount = ref(1);

const emit = defineEmits(['end'])

function doMoveHandler(i, j, value) {

  if (locked) return true; //не можем кликнуть пока ходит бот
  board.value[i][j] = value; //ставим Х или O в координаты i, j
  moveCount++; //считаем ходы (нечетные - Х, четные - O)

  if (gameProcess.checkPlayerWin(board.value, 'x')) {
    emit('end', 'user');
  } else if (gameProcess.checkPlayerWin(board.value, 'o')) {
    emit('end', 'user2');
  } else if (props.isBotPlaying) {
    botMove();
  }
}

function botMove() {
  locked = true;
  setTimeout(() => {
    const botMoving = gameProcess.botMoving(board.value);
    if (botMoving) {
      board.value[botMoving.i][botMoving.j] = 'o';
      if (gameProcess.checkPlayerWin(board.value, 'o')) {
        emit('end', 'bot');
      }
    } else {
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

defineExpose({endGame});

</script>

<template>
  <div class="board">
    <template v-for="(iValue, i) in board">
      <template v-for="(jValue, j) in iValue">
        <Cell :value="jValue" :is-bot-playing="isBotPlaying" :moveCount="moveCount"
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
