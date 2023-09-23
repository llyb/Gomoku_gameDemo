<template>
    <div ref="parent" class="gamemap">
        <canvas ref="canvas" tabindex="0"></canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import GameMap from '@/assets/game/GameMap.js';

let parent = ref(''); // 绑定我们的parent标签
let canvas = ref(''); // 绑定我们的canvas标签

onMounted(() => {
    new GameMap(canvas.value.getContext('2d'), parent.value); // 实例化地图
});
</script>

<style scoped>
.gamemap {
    width: 100%;
    height: 100%;
    background-color: #ba7c48;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
