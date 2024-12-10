<template>
  <section ref="section">
    <div ref="sblk" class="sticky-block">
      <p class="xbot-model-s ignore" ref="xbotModelS">XBOT-Model S 1</p>
      <canvas ref="scrollAnimation"></canvas>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, ShallowRef, watch } from 'vue';
import useScrollPercent from '@/hooks/useScrollPercent';
// import PxLoaderImage from 'pxloader/PxLoaderImage';
// import PxLoader from 'pxloader';

const IMG_DIR = '/assets/imgs/robot-avif-bg';
const frameCnt = 271;
const blk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('section');
const sblk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('sblk');
const canvasRef: Readonly<ShallowRef<HTMLCanvasElement>> =
  useTemplateRef('scrollAnimation');
const xbotModelSRef = useTemplateRef('xbotModelS');

const sectionRef: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('section');
const { isLast = false } = defineProps<{ isLast?: boolean }>();

const { targetPercent } = useScrollPercent(
  sectionRef,
  isLast,
  () => {
    sblk.value.style.opacity = '1';
  },
  () => {
    sblk.value.style.opacity = '0';
  }
);

watch(targetPercent, () => {
  calcTargetFrameIndex(targetPercent.value);
  // 文字滚动
  calcTitleTranslateY(targetPercent.value);
});
onMounted(() => init());
function init() {
  const html = document.documentElement;
  const canvas = canvasRef.value;
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

  const loader = new window.PxLoader();

  function resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  }

  // 窗口resize时需要重绘canvas
  window.addEventListener('resize', () => {
    resizeCanvas(canvas);
    drawImgWhoFillsCanvas(canvas, allImgs[currentFrameIdx]);
  });

  // 记录当前图片帧的编号，如果用户滚动到一半不滚动
  // 而去缩放页面，保证重绘时画的是同一张图
  let currentFrameIdx = 0;

  // 即将切换到的帧号
  // onscroll的回调负责更新这个值
  // requestAnimationFrame的回调draw负责每次取这个值画图
  let targetFrameIdx = 0;

  const sections: Sections = [
    {
      name: IMG_DIR,
      frameCnt,
      imgs: [],
      rawUrl: `${IMG_DIR}/0001.avif`
      // curFrameIdx: 0,
    }
  ];

  const allImgs: HTMLImageElement[] = [];

  const getFrameImgUrl = (frameIdx: number, sectionIdx: number) => {
    const padIdx = frameIdx.toString().padStart(4, '0');
    const originUrl = sections[sectionIdx].rawUrl;
    const modifiedUrl =
      originUrl.substring(0, originUrl.lastIndexOf('/')) + `/${padIdx}.avif`;
    return modifiedUrl;
  };

  function preloadFrameImgs(sectionIdx: number) {
    for (let i = 1; i <= sections[sectionIdx].frameCnt; i++) {
      sections[sectionIdx].imgs[i - 1] = loader.addImage(
        getFrameImgUrl(i, sectionIdx)
      );
    }
  }

  function preloadAllFrameImgs() {
    for (let i = 0; i < sections.length; i++) {
      preloadFrameImgs(i);
      allImgs.push(...sections[i].imgs);
    }
  }

  preloadAllFrameImgs();

  // 加载完所有图片时的回调，初始化canvas，画第一张图片
  loader.addCompletionListener(function () {
    document.body.classList.add('loaded');
    resizeCanvas(canvas);
    window.requestAnimationFrame(drawOnCanvas);
  });

  function drawOnCanvas() {
    changeFrameTo(targetFrameIdx);
    window.requestAnimationFrame(drawOnCanvas);
  }

  loader.start();

  // 将图片img以全填充方式画到canvas上
  function drawImgWhoFillsCanvas(
    canvas: HTMLCanvasElement,
    img: HTMLImageElement
  ) {
    if (!img || !canvas) {
      console.error(
        `invalid argument: currentFrameIdx:${currentFrameIdx}, targetFrameIdx:${targetFrameIdx}`
      );
      return;
    }

    const [hRatio, wRatio] = [
      canvas.height / img.height,
      canvas.width / img.width
    ];
    const ratio = Math.max(hRatio, wRatio);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      // 0,
      // 0,
      // img.width,
      // img.height,
      0,
      0,
      img.width * ratio,
      img.height * ratio
    );
  }

  function changeFrameTo(frameIdx: number) {
    let idx = frameIdx - 1;

    // 边界防跨越
    if (idx < 0) idx = 0;
    if (idx > allImgs.length) idx = allImgs.length - 1;
    drawImgWhoFillsCanvas(canvas, allImgs[idx]);
    currentFrameIdx = idx;
  }
}
/**
 * 根据滚动距离计算某个块应该渲染的图片帧编号
 * @param frameObj
 * @param el 包裹canvas块的元素
 * @param scrollTop
 * @returns
 */
function calcTargetFrameIndex(scrolledPercent: number) {
  scrolledPercent = Math.min(scrolledPercent, 1);
  const targetFrameIdx = Math.ceil(scrolledPercent * allImgs.length);
  return targetFrameIdx;
}
function calcTitleTranslateY(scrolledPercent: number) {
  xbotModelSRef.value.style.transform = `translateY(-${
    scrolledPercent * 100
  }%)`;
}
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
  }
}
</style>
