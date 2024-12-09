<template>
  <section ref="section">
    <div ref="sblk" class="sticky-block">
      <p class="xbot-model-s ignore">XBOT-Model S</p>
      <canvas ref="scrollAnimation"></canvas>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, ShallowRef } from 'vue';
// import PxLoaderImage from 'pxloader/PxLoaderImage';
// import PxLoader from 'pxloader';

const IMG_DIR = 'robot-avif';
const frameCnt = 271;
const blk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('section');
const sblk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('sblk');
const canvasRef: Readonly<ShallowRef<HTMLCanvasElement>> =
  useTemplateRef('scrollAnimation');

const { isLast = false } = defineProps<{ isLast?: boolean }>();
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
      rawUrl: `/imgs/${IMG_DIR}/0001.avif`
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

  // 利用闭包存上次滚动距离，方便滚动事件中计算滚动方向
  let lastScrollTop = 0;

  /**
   * 根据滚动距离计算某个块应该渲染的图片帧编号
   * @param frameObj
   * @param el 包裹canvas块的元素
   * @param scrollTop
   * @returns
   */
  function calcTargetFrameIndex(el: HTMLElement, scrollTop: number) {
    // el.offsetHeight: 元素的高度
    // 分子加上 el.offsetHeight/2 是为了抵消中心偏差
    // 结果：scrolled: [0, 1] 之间的百分比数字，用于计算目标图片帧的编号

    // 百分比算法一
    // let scrolledPercent = (scrollTop + el.offsetHeight / 2) / el.offsetHeight;

    // 百分比算法二
    // let scrolledPercent = scrollTop / (html.scrollHeight - html.clientHeight);
    let scrolledPercent =
      (scrollTop - el.offsetTop) /
      (el.offsetHeight - (isLast ? html.clientHeight : 0));

    scrolledPercent = Math.min(scrolledPercent, 1);
    const frameIdxByPercent = Math.ceil(scrolledPercent * allImgs.length);

    // let frameIdxNext = Math.min(currentFrameIdx + 1, allImgs.length);
    // return Math.min(frameIdxByPercent, frameIdxNext);

    return frameIdxByPercent;
  }

  // 不应该把draw回调放在scroll事件回调
  // 应该放在requestAnimationFrame里，也就是浏览器重绘的钩子里
  window.addEventListener('scroll', e => {
    // scrollTop: 滚动条纵坐标距离整个网页最顶部的距离
    const scrollTop = html.scrollTop;

    if (
      blk.value.offsetTop <= scrollTop &&
      scrollTop <= blk.value.offsetTop + blk.value.offsetHeight
    ) {
      sblk.value.style.opacity = '1';
      targetFrameIdx = calcTargetFrameIndex(blk.value, scrollTop);
    } else {
      sblk.value.style.opacity = '0';
    }

    // let opacity = scrolled;

    // changeFrameTo(targetFrameIdx);

    // 向下滚动
    // if (scrollTop > lastScrollTop) {
    //   if (targetFrameIdx >= allImgs.length) {
    //     canvas.style.visibility = "hidden";
    //   } else {
    //     changeFrameTo(targetFrameIdx);
    //   }
    // }
    // // 向上滚动
    // else {
    //   if (targetFrameIdx <= 0) {
    //   } else if (targetFrameIdx >= allImgs.length) {
    //     canvas.style.visibility = "visible";
    //     changeFrameTo(targetFrameIdx);
    //   } else {
    //     // document.getElementById("remaster").style.opacity = opacity;
    //   }
    // }

    lastScrollTop = scrollTop;
  });
}
</script>

<style scoped lang="scss">
.sticky-block {
  height: calc(100vh - $headerHeight);
  max-height: calc(100vh - $headerMinHeight);
  bottom: 0;
  width: 100vw;
  position: sticky;
  /* position: fixed; */
  /* display: flex; */
  /* overflow: hidden; */
  /* justify-content: center; */
  /* align-items: center; */
  transition: opacity 0.4s;
  opacity: 0;
  overflow: hidden;

  .xbot-model-s.ignore {
    z-index: 1;
    position: relative;
    margin-top: 320px;
    margin-left: 115px;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
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
