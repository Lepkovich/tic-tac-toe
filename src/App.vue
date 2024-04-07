<script setup>
  import Board from './components/Board.vue'
  import Score from './components/Score.vue'
  import {ref, watch} from "vue";
  import { Modal } from 'usemodal-vue3';
  import { Check, Close, StarFilled } from '@element-plus/icons-vue';

  const score = ref({
    user: 0,
    user2: 0,
    bot: 0,
    draw: 0,
  });

  const isBotPlaying = ref(false);
  const withMinimax = ref(false);
  const trainingMode = ref(false);

  const childBoard = ref(null);
  const isPopupVisible = ref(false);
  const gameResult = ref('');

  watch(isBotPlaying, (newValue) => {
    if (newValue) {
      trainingMode.value = false;
    }
  });

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
    <el-divider>
      <el-icon><star-filled /></el-icon>
    </el-divider>
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
  <div class="game-mode" v-if="!isBotPlaying">
    <div class="game-mode-train">Режим обучения</div>
    <el-switch
        v-model="trainingMode"
        class="mb-2"
        inline-prompt
        :active-icon="Check"
        :inactive-icon="Close"
        @click="onClosePopup"
    />
    <div class="about">
      <el-popover
          :width="300"
          popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
      >
        <template #reference>
          ?
        </template>
        <template #default>
              <p>
                В режиме обучения вы играете друг против друга, а компьютер подсвечивает вам правильные и неправильные ходы.
              </p>
              <p>
                Используя Minimax алгоритм программа дает оценку каждого хода для игрока. Следуя этим рекомендациям вы никогда не проиграете.
              </p>
              <p>
                Красный - отрицательный сценарий
              </p>
              <p>
                Желтый - нейтральный
              </p>
              <p>
                Зеленый - наилучший ход
              </p>
        </template>
      </el-popover>
    </div>
  </div>
  <div class="game-mode" v-if="isBotPlaying">
    <el-switch
        v-model="withMinimax"
        class="mb-2"
        active-text="сложно"
        inactive-text="легко"
        @click="onClosePopup"
    />
  </div>
  <div class="game">
    <Board @end="endHandler" ref="childBoard" :is-bot-playing="isBotPlaying" :with-minimax="withMinimax"
           :training-mode="trainingMode"/>
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

  .title .el-divider__text {
    background-color: black;
    color: white;
  }
  .game-mode {
     max-width: 324px;
     margin: 0 auto;
     display: flex;
     justify-content: center;
     align-items: center;
   }
  .game-mode .game-mode-train {
    color: #409EFF;
    margin-right: 10px;
    text-transform: uppercase;
  }

  .game-mode .about {
    margin-left: 20px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #dcdfe6;
    background-color: #303133;
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
