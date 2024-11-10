<template>
  <section>
    <div class="qArea">
      <div class="sentenceWrap">
        <transition name="fade" mode="out-in">
          <div :key="currentSentence.text" class="text">{{ currentSentence.text }}</div>
        </transition>
        <transition name="fade" mode="out-in">
          <div :key="currentSentence.hiragana" class="hiragana">{{ currentWordStatus }}</div>
        </transition>
      </div>
      <button @click="nextSentence">スキップ</button>
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
  if (currentWordStatus.value[0] !== value) {
    return
  }
  currentWordStatus.value = currentWordStatus.value.slice(1)
  if (!currentWordStatus.value.length) {
    nextSentence();
  }
}

function nextSentence() {
  const sentence = sentenceList.value.pop();
  if (!sentence) {
    location.reload();
    return;
  }
  currentSentence.value = sentence;
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
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.sentenceWrap {
  margin-top: 25%;
  width: 90%;
  border: 1px solid #CCC;
  border-radius: 5px;
  padding:10px;
  font-size: 1.2em;
}
.sentenceWrap > div{
  padding: 10px;
}

button {
  margin-top: 10px;
  padding: 5px;
}

.text {
  font-weight: bold;
}

.hiragana::first-letter {
  color: pink; /* 一文字目だけ色を赤に */
  font-weight: bold;
}
</style>
