<template>
  <section>
    <div class="qArea">
      <div>
        <div>{{currentSentence.text}}</div>
        <div>{{currentWordStatus}}</div>
      </div>
    </div>
    <div class="keyArea">
      <Keyboard :currentWordStatus @input="input"/>
    </div>
  </section>
</template>

<script setup lang="ts">
import Keyboard from "./parts/Keyboard.vue";
import {ref, watch} from "vue";
import sentences from "../json/sentences.json";
import {shuffle} from "lodash";

const sentenceList = ref(shuffle(sentences));
const currentSentence = ref(sentenceList.value.pop()!);

const currentWordStatus = ref(currentSentence.value.hiragana);

watch(currentSentence, () => {
  currentWordStatus.value = currentSentence.value.hiragana;
})

function input(value: string) {
  console.error(value)
  if (currentWordStatus.value[0] === value) {
    currentWordStatus.value = currentWordStatus.value.slice(1)
  }
}
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
