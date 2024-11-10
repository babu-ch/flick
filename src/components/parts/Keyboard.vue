<script setup lang="ts">
import {ref} from "vue";
import {invert} from "lodash";
import hintMap from "../../json/hintMap.json";

type DirectionKeys = 'left' | 'right' | 'up' | 'down';
type Key = {
  main: string;
  isCommand: boolean
  isConvertKey?:boolean;
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
  {main: "゛゜", isCommand:true, isConvertKey: true},
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

const emit = defineEmits<{
  input: [value: string]
}>()

const prevInput = ref("");
function mouseup(value:string) {
  // 他のキーの上でupするのを防ぐ
  if (Object.values(currentKey.value).find(v => v === value)) {
    if (value === "゛゜") {
      emit("input", convertMap[prevInput.value] ?? value);
      prevInput.value = convertMap[prevInput.value] ?? value;
    } else {
      emit("input", value);
      prevInput.value = value;
    }
  }
  currentKey.value = {main:"", isCommand: false};
}

// quiz logic
const {currentWordStatus} = defineProps<{
  currentWordStatus: string;
}>()


const convertMap = invert(hintMap);

function isHint(key:Key|string|undefined) {
  if (!key) return false;
  const hintChar = hintMap[currentWordStatus[0]];

  // stringの場合は展開された時
  if (typeof key === "string") {
    return key === (hintChar ?? currentWordStatus[0])
  }

  // 小文字等
  if (hintChar && prevInput.value === hintChar) {
    return key.isConvertKey;
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
         :class="{hint: isHint(key), disabled:key.isCommand && !key.isConvertKey}"
    >{{ key.main }}
    </div>
  </div>
  <div
    v-for="direction in (['left', 'right', 'up', 'down'] as (DirectionKeys)[])" :key="direction"
    class="arrows" ref="arrows"
   :class="[direction, {hint: isHint(currentKey[direction]!)}]"
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
  width: 70%;
  height: 70%;
}

.grid-item, .arrows {
  user-select: none;
  background-color: whitesmoke;
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
  position: fixed;
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