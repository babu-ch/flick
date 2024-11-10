<script setup lang="ts">
import Game from "./components/Game.vue";


function openGithub() {
  window.open("https://github.com/babu-ch/flick");
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
  height: 70px;
  position: absolute;
  width: 100%;
  font-size: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  padding: 10px;
  box-sizing: border-box;
}
.icons {
  display: flex;
  user-select: none;
}
</style>
