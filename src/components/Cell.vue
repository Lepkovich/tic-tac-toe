<script setup>

const props = defineProps(['value', 'isBotPlaying', 'moveCount', 'isWinningCell', 'cellColor']);
  const emit = defineEmits(['doMove']);

  function cellClick() {
    if (!props.value) {
      if (!props.isBotPlaying && props.moveCount % 2 === 0) {
        emit('doMove', 'o')
      } else {
        emit('doMove', 'x')
      }
    }
  }

</script>

<template>

  <div class="square" @click="cellClick"
       :class="[{ 'win-line': props.isWinningCell, 'empty-cell': props.isCellEmpty }, props.cellColor]">
    <div :class="props.value"></div>
  </div>

</template>
<style scoped>

@keyframes appear {
  from {
    transform: scale(0.3);
  }
  to {
    transform: scale(1);
  }
}

.square {
  width: 100px;
  height: 100px;
  border: 3px solid #d0d0d0;
  cursor: pointer;
  position: relative;
}

.square.empty-cell {
  background-color: #409eff;
}
.square.red {
  background-color: red;
}
.square.yellow {
  background-color: yellow;
}

.square.green {
  background-color: green;
}

.square .x,
.square .o {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  animation: appear .2s cubic-bezier(0.5, 1.8, 0.1, 1.1);
  transform: translate3d(0, 0, 0);
}

.square .x::before,
.square .x::after {
  position: absolute;
  content: '';
  width: 80px;
  height: 10px;
  background-color: white;
}

.square.win-line .x::before,
.square.win-line .x::after {
  background-color: red;
}

.square .x::before {
  transform: rotate(45deg);
}

.square .x::after {
  transform: rotate(-45deg);
}

.square .o::before {
  content: '';
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 10px solid white;
}

.square.win-line .o::before {
  border: 10px solid red;
}
</style>
