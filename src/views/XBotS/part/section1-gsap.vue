<template>
  <section ref="section">
    <div ref="sblk" class="sticky-block">
      <p class="xbot-model-s ignore" ref="xbotModelS">XBOT-Model S 1</p>
      <canvas id="canvas" ref="scrollAnimation"></canvas>
    </div>
  </section>
</template>

<script setup lang="ts">
import useImgSequence from '@/hooks/useImgSequence';
import { useTemplateRef, onMounted, ShallowRef } from 'vue';
// import PxLoaderImage from 'pxloader/PxLoaderImage';
// import PxLoader from 'pxloader';

const IMG_DIR = 'robot-avif-bg';
const frameCnt = 271;
const blk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('section');
const sblk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('sblk');
const canvasRef = useTemplateRef('scrollAnimation');
const xbotModelSRef = useTemplateRef('xbotModelS');

useImgSequence(frameCnt, canvasRef, sblk, blk);
</script>

<style scoped lang="scss">
.sticky-block {
  height: calc(100vh - $headerHeight);
  max-height: calc(100vh - $headerMinHeight);
  bottom: 0;
  width: 100vw;
  /* position: sticky; */
  position: fixed;
  /* display: flex; */
  /* overflow: hidden; */
  /* justify-content: center; */
  /* align-items: center; */
  transition: opacity 0.4s;
  /* opacity: 0; */

  .xbot-model-s.ignore {
    z-index: 1;
    position: relative;
    margin-top: 320px;
    margin-left: 115px;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    width: 1184px;
    font-family: Alfa Slab One;
    font-size: 150px;
    font-weight: bold;
    line-height: 205px;
    color: rgba(255, 255, 255, 0.5);
  }

  canvas {
    position: absolute;
    left: 0;
    top: 0;
    /* width: 100%;
    height: 100%; */
  }
}
</style>
