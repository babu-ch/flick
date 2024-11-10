<template>
  <section>
    <div class="qArea">
      <div>
        <div>{{currentWord}}</div>
        <div>{{currentWordStatus}}</div>
      </div>
    </div>
    <div class="keyArea">
      <Keyboard :currentWordStatus/>
    </div>
  </section>
</template>

<script setup lang="ts">
import Keyboard from "./parts/Keyboard.vue";
import {ref, watch} from "vue";

const wordList = ref(["ぁ"]);
const currentWord = ref(wordList.value.pop() as string);

const currentWordStatus = ref(currentWord.value);

watch(currentWord, () => {
  currentWordStatus.value = currentWord.value;
})
</script>

<style scoped>

section {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

section > div {
  width: 100%;
  border: 1px solid aquamarine;
  flex: 1;
}

.qArea {
  display: flex;
  justify-content: center; /* 水平方向に中央寄せ */
  align-items: center; /* 垂直方向に中央寄せ */
  flex-direction: column; /* 子要素を縦に並べる */
}

.keyArea {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
