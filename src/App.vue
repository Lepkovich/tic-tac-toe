<script setup>
  import Board from './components/Board.vue'
  import Score from './components/Score.vue'
  import {ref} from "vue";
  import { Modal } from 'usemodal-vue3';

  const score = ref({
    user: 0,
    user2: 0,
    bot: 0,
    draw: 0,
  });

  const isBotPlaying = ref(false);

  const childBoard = ref(null);
  const isPopupVisible = ref(false);
  const gameResult = ref('');

  function endHandler(winner) {
    switch (winner) {
      case 'user':
        score.value.user++;
        gameResult.value = 'Победил игрок X!';
        break;
      case 'user2':
        score.value.user2++;
        gameResult.value = 'Победил игрок O!';
        break;
      case 'bot':
        score.value.bot++;
        gameResult.value = 'Победил компьютер!';
        break;
      case 'draw':
        score.value.draw++;
        gameResult.value = 'Ничья!';
        break;
    }
    openPopup();
  }

  function closePopup() {
    isPopupVisible.value = false;
  }

  function openPopup() {
    isPopupVisible.value = true;
  }

  function onClosePopup() {
    if (childBoard.value) {
      childBoard.value.endGame();
    }
  }

</script>

<template>
  <div class="title">
    Крестики-нолики
  </div>
  <div class="game-mode">
    <el-switch
        v-model="isBotPlaying"
        class="mb-2"
        active-text="компьютер"
        inactive-text="соперник"
        @click="onClosePopup"
    />
  </div>
  <div class="game">
    <Board @end="endHandler" ref="childBoard" :is-bot-playing="isBotPlaying"/>
    <Score :score="score" :is-bot-playing="isBotPlaying"/>
  </div>
  <Modal v-model:visible="isPopupVisible" @onUnVisible="onClosePopup" :type="'clean'" :modalClass="'popup'">
    <span class="close" @click="closePopup">&times;</span>
    <div>{{gameResult}}</div>
    <button class="button" @click="closePopup">Новая игра</button>
  </Modal>
</template>

<style>
  .title {
    font-size: 40px;
    text-transform: uppercase;
    color: #409EFF;
    text-align: center;
    margin-top: 50px;
    margin-bottom: 30px;
  }
   .game-mode {
     max-width: 324px;
     margin: 0 auto;
     display: flex;
     justify-content: center;
   }

   .game-mode .el-switch.mb-2 span {
      font-size: 20px;
     text-transform: uppercase;
   }
  .game {
    margin: 50px auto;
    max-width: 324px;
  }

  .modal-vue3-content {
    border-radius: 5px;
    border: 0;
    background: #2b9595;
    color: white;
    max-width: 250px;
    text-align: center;
    padding: 20px;
  }
  .modal-vue3-content .close {
    cursor: pointer;
    position: absolute;
    display: block;
    right: 5px;
    top: -5px;
    font-size: 24px;
  }
  .button {
    padding: 10px 20px;
    margin-top: 10px;
    color: white;
    cursor: pointer;
    border: 0;
    background: black;
    border-radius: 5px;
  }
</style>
