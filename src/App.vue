<script setup lang="ts">
import Game from "./components/Game.vue";

</script>

<template>
  <header>
    フリック入力の練習
    <div class="icons">
      <fa :icon="['fab', 'github']" />
      <fa :icon="['fas', 'star-half-stroke']" />
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
}
.icons {
  display: flex;
  gap: 20px; /* アイコン間のスペース */
}
</style>
