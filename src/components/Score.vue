<script setup>

const props = defineProps(['score', 'isBotPlaying']);

</script>

<template>

  <div class="score">
    <div class="score-block">
      <div class="score-title" v-if="isBotPlaying">Игрок</div>
      <div class="score-title" v-else>Игрок X</div>
      <div class="score-result">{{ props.score.user }}</div>
    </div>
    <div class="score-block">
      <div class="score-title" v-if="isBotPlaying">Компьютер</div>
      <div class="score-title" v-else>Игрок О</div>
      <div class="score-result" v-if="isBotPlaying">{{ props.score.bot }}</div>
      <div class="score-result" v-else>{{ props.score.user2 }}</div>
    </div>
    <div class="score-block">
      <div class="score-title">Ничья</div>
      <div class="score-result">{{ props.score.draw }}</div>
    </div>
  </div>

</template>

<style scoped>
.score {
  color: white;
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
  text-align: center;
}

.score-title {
  font-size: 24px;
}

.score-result {
  font-size: 21px;
}

</style>
