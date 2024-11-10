<script setup lang="ts">
import {ref} from "vue";

type DirectionKeys = 'left' | 'right' | 'up' | 'down';
type Key = {
  main: string;
  isCommand: boolean
} &{
  [key in DirectionKeys]?: string;
}

const keys: Key[] = [
  {main: "あ", left: "い", up: "う", right: "え", down: "お", isCommand:false},
  {main: "か", left: "き", up: "く", right: "け", down: "こ", isCommand:false},
  {main: "さ", left: "し", up: "す", right: "せ", down: "そ", isCommand:false},
  {main: "✗", isCommand:true},
  {main: "た", left: "ち", up: "つ", right: "て", down: "と", isCommand:false},
  {main: "な", left: "に", up: "ぬ", right: "ね", down: "の", isCommand:false},
  {main: "は", left: "ひ", up: "ふ", right: "へ", down: "ほ", isCommand:false},
  {main: "→", isCommand:true},
  {main: "ま", left: "み", up: "む", right: "め", down: "も", isCommand:false},
  {main: "や", left: "", up: "ゆ", right: "", down: "よ", isCommand:false},
  {main: "ら", left: "り", up: "る", right: "れ", down: "ろ", isCommand:false},
  {main: "_", isCommand:true},
  {main: "゛゜", isCommand:true},
  {main: "わ", left: "を", up: "ん", right: "ー", down: "〜", isCommand:false},
  {main: "、", left: "。", up: "？", right: "！", down: "...", isCommand:false},
  {main: "↵", isCommand:true},
];

const currentKey = ref<Key>({main: "", isCommand:false});
const positions = ref<Record<DirectionKeys, {top:string; left:string}>>({
  left: {top: "", left: ""},
  right: {top: "", left: ""},
  up: {top: "", left: ""},
  down: {top: "", left: ""},
})

const arrows = ref<HTMLDivElement[]>([]);
const gridContainer = ref<HTMLDivElement>()
function mousedown(key: Key, e: MouseEvent) {
  currentKey.value = key;

  const target = (e.target as HTMLDivElement);

  if (!arrows.value.length) {
    return;
  }

  const rect = target.getBoundingClientRect();
  // copy style
  arrows.value.forEach((arrow) => {
    arrow.style.width = (rect.width - 2) + "px"
    arrow.style.height = (rect.height - 2) + "px"
  })


  const absoluteTop = rect.top + window.scrollY;
  const absoluteLeft = rect.left + window.scrollX;

  const height = target.offsetHeight;
  const width = target.offsetWidth;

  const styles = getComputedStyle(gridContainer.value!);
  const gap = Number(styles.getPropertyValue('gap').replace("px", ""));

  positions.value.up = {
    top: (absoluteTop - height - gap) + "px",
    left: (absoluteLeft) + "px"
  };
  positions.value.down = {
    top: (absoluteTop + height + gap) + "px",
    left: (absoluteLeft) + "px"
  }
  positions.value.left = {
    top: (absoluteTop) + "px",
    left: (absoluteLeft - width - gap) + "px"
  }
  positions.value.right = {
    top: (absoluteTop) + "px",
    left: (absoluteLeft + width + gap) + "px"
  }
}

document.addEventListener("mouseup", () => {
  if (currentKey.value.main !== "") {
    currentKey.value = {main:"", isCommand: false};
  }
})

const prevInput = ref("");
function mouseup(value:string) {
  if (Object.values(currentKey.value).find(v => v === value)) {
    console.error(value)
    prevInput.value = value;
  }
  currentKey.value = {main:"", isCommand: false};
}

// quiz logic
const {currentWordStatus} = defineProps<{
  currentWordStatus: string;
}>()

const hintMap:{[key:string]:string} = {
  // 小文字
  "ぁ": "あ", "ぃ": "い", "ぅ": "う", "ぇ": "え", "ぉ": "お",
  "っ": "つ", "ゃ": "や", "ゅ": "ゆ", "ょ": "よ", "ゎ": "わ",
  // 濁音
  "が": "か", "ぎ": "き", "ぐ": "く", "げ": "け", "ご": "こ",
  "ざ": "さ", "じ": "し", "ず": "す", "ぜ": "せ", "ぞ": "そ",
  "だ": "た", "ぢ": "ち", "づ": "つ", "で": "て", "ど": "と",
  "ば": "は", "び": "ひ", "ぶ": "ふ", "べ": "へ", "ぼ": "ほ",
  "ぱ": "は", "ぴ": "ひ", "ぷ": "ふ", "ぺ": "へ", "ぽ": "ほ",
};

function isHint(key:Key|string|undefined) {
  if (!key) return false;
  // stringの場合は展開された時
  if (key instanceof String) {
    if (key === currentWordStatus[0]) {
      return true;
    }
    return false;
  }
  const hintChar = hintMap[currentWordStatus[0]];
  // 小文字等
  if (hintChar && prevInput.value === hintChar) {
    console.error(key.main)
    return key.main === "゛゜";
  }

  return Object.values(key).includes(hintChar ?? currentWordStatus[0]);
}
</script>

<template>

  <div class="grid-container" ref="gridContainer">
    <div class="grid-item"
         v-for="key in keys" :key="key.main"
         @mousedown="mousedown(key, $event)"
         @mouseup="mouseup(key.main)"
         :class="{hint: isHint(key), disabled:key.isCommand && key.main !== '゛゜'}"
    >{{ key.main }}
    </div>
  </div>
  <div
    v-for="direction in (['left', 'right', 'up', 'down'] as (DirectionKeys)[])" :key="direction"
    class="arrows" ref="arrows"
   :class="[direction, {hint: isHint(currentKey.left!)}]"
       v-show="currentKey[direction]"
       @mouseup="mouseup(currentKey[direction]!)"
       :style="{'left': positions[direction].left, 'top': positions[direction].top}">
    {{ currentKey[direction] }}
  </div>
</template>

<style scoped>


.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 5px;
  width: 60%;
  height: 60%;
}

.grid-item, .arrows {
  user-select: none;
  background-color: lightblue;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  position: relative;
}

.arrows {
  position: absolute;
  background-color: white;
}

.arrows.hint {
  background-color: hotpink;
}

.hint {
  background-color: pink;
}

.disabled {
  background-color: gray;
}
</style>