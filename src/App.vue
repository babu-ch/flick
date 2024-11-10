<script setup lang="ts">
import Game from "./components/Game.vue";


function openGithub() {
  window.open("https://github.com/vuejs/github");
}
</script>

<template>
  <header>
    フリック入力の練習
    <div class="icons">
      <fa :icon="['fab', 'github']" @click="openGithub"/>
    </div>
  </header>
  <Game />
</template>

<style scoped>
header {
  border-bottom: 1px solid #CCC;
  height: 90px;
  position: absolute;
  width: 100%;
  font-size: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.icons {
  display: flex;
  gap: 20px; /* アイコン間のスペース */
  user-select: none;
  margin-right: 20px;
}
</style>
