<template>
  <div ref="section" style="height: 120vh">
    <div ref="sblk" class="sticky-block">
      <p class="xbot-model-s ignore" ref="xbotModelS">XBOT-Model S</p>
      <video
        ref="video"
        :src="videoUrl"
        muted
        loop
        preload="auto"
        width="100%"
        height="100%" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, ShallowRef, ref } from 'vue';

const blk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('section');
const sblk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('sblk');
const video: Readonly<ShallowRef<HTMLVideoElement>> = useTemplateRef('video');
const xbotModelSRef = useTemplateRef('xbotModelS');

const videoUrl = ref(import.meta.env.VITE_ASSETS + '/videos/video1.mp4');

const { isLast = false } = defineProps<{ isLast?: boolean }>();
onMounted(() => init());

function init() {
  const html = document.documentElement;

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
    const html = document.documentElement;
    const headerH = document.querySelector('header')!.offsetHeight;
    const scrollTop = html.scrollTop;
    const scrollStart = blk.value.offsetTop - html.clientHeight / 2;
    const scrollEnd =
      blk.value.offsetTop +
      blk.value.offsetHeight +
      headerH -
      (isLast ? html.clientHeight : 0);
    const scrollTotal = scrollEnd - scrollStart;
    // 视频到屏幕一半的时候播放
    if (scrollStart <= scrollTop && scrollTop <= scrollEnd) {
      // console.info('in: ', scrollTop, scrollStart, scrollEnd);
      video.value.play();
      // const { scrolledPercent } = calcTargetFrameIndex(blk.value, scrollTop);
      // 文字滚动
      // calcTitleTranslateY(scrolledPercent);
    } else {
      // console.info('out: ', scrollTop);
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
.sticky-block {
  height: calc(100vh - $headerHeight);
  max-height: calc(100vh - $headerMinHeight);
  /* width: 100vw; */
  position: sticky;
  top: $headerHeight;
  /* position: fixed; */
  /* display: flex; */
  /* overflow: hidden; */
  /* justify-content: center; */
  /* align-items: center; */
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.5;
  }
}
.video-wrap {
  width: 100vw;
  height: calc(100vh - $headerHeight);
  max-height: calc(100vh - $headerMinHeight);
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
