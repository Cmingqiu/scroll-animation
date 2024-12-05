<template>
  <div ref="section" class="video-wrap">
    <p class="xbot-model-s ignore" ref="xbotModelS">XBOT-Model S</p>
    <video
      ref="video"
      src="/videos/spatial.mp4"
      muted
      loop
      preload="auto"
      width="100%"
      height="100%" />
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, ShallowRef } from 'vue';

const blk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('section');
const video: Readonly<ShallowRef<HTMLVideoElement>> = useTemplateRef('video');
const xbotModelSRef = useTemplateRef('xbotModelS');

const { isLast = false } = defineProps<{ isLast?: boolean }>();
onMounted(() => init());

function init() {
  const html = document.documentElement;
  function resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  }

  // 窗口resize时需要重绘canvas
  window.addEventListener('resize', () => {
    // resizeCanvas(canvas);
    // drawImgWhoFillsCanvas(canvas, allImgs[currentFrameIdx]);
  });

  /**
   * 根据滚动距离计算某个块应该渲染的图片帧编号
   * @param frameObj
   * @param el 包裹canvas块的元素
   * @param scrollTop
   * @returns
   */
  function calcTargetFrameIndex(el: HTMLElement, scrollTop: number) {
    const total = el.offsetHeight - (isLast ? html.clientHeight : 0);
    let scrolledPercent = (scrollTop - el.offsetTop) / total;

    scrolledPercent = Math.min(scrolledPercent, 1);

    return { scrolledPercent };
  }

  // 不应该把draw回调放在scroll事件回调
  // 应该放在requestAnimationFrame里，也就是浏览器重绘的钩子里
  window.addEventListener('scroll', e => {
    // scrollTop: 滚动条纵坐标距离整个网页最顶部的距离
    const scrollTop = html.scrollTop;

    // 视频到屏幕一半的时候播放
    if (
      blk.value.offsetTop - html.clientHeight / 2 <= scrollTop &&
      scrollTop <=
        blk.value.offsetTop +
          blk.value.offsetHeight -
          (isLast ? html.clientHeight : 0)
    ) {
      video.value.play();
      const { scrolledPercent } = calcTargetFrameIndex(blk.value, scrollTop);
      // 文字滚动
      calcTitleTranslateY(scrolledPercent);
    } else {
      video.value.pause();
    }
  });

  function calcTitleTranslateY(scrolledPercent: number) {
    xbotModelSRef.value.style.transform = `translateY(-${
      scrolledPercent * 100
    }%)`;
  }
}
</script>

<style scoped lang="scss">
.video-wrap {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
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
  video {
    position: absolute;
    left: 0;
    top: 0;
    object-fit: cover;
    opacity: 0.5;
  }
}
</style>
