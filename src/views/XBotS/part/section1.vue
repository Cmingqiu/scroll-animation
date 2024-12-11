<template>
  <section ref="section">
    <div ref="sblk" class="sticky-block">
      <div class="title">
        <div class="bar">
          <p class="robot-handmade" ref="xbotModelS">ROBOT-HANDMADE</p>
        </div>
        <div class="bar"><p class="ai-coffee">AI COFFEE</p></div>
      </div>
      <canvas ref="canvas"></canvas>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, ShallowRef } from 'vue';
import gsap from 'gsap';

const IMG_DIR = '/assets/imgs/robot-avif-bg';
const frameCnt = 271;
const blk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('section');
const sblk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('sblk');
const canvasRef: Readonly<ShallowRef<HTMLCanvasElement>> =
  useTemplateRef('canvas');
const xbotModelSRef = useTemplateRef('xbotModelS');

const { isLast = false } = defineProps<{ isLast?: boolean }>();
onMounted(() => {
  init();
  ani1();
});
function ani1() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: blk.value,
      start: 'top top',
      end: '800 top',
      scrub: 1
      // markers: true
    }
  });

  tl.from('.robot-handmade', { y: '+=300' })
    .from('.ai-coffee', { y: '+=400' }, '<')
    .to('.title', { opacity: 0, y: '-=100' });
}

function init() {
  const html = document.documentElement;
  const canvas = canvasRef.value;
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

  const loader = new window.PxLoader();

  // 记录当前图片帧的编号，如果用户滚动到一半不滚动  而去缩放页面，保证重绘时画的是同一张图
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
      rawUrl: `${import.meta.env.VITE_ASSETS}/imgs/robot/0001.avif`
      // curFrameIdx: 0,
    }
  ];

  const allImgs: HTMLImageElement[] = [];
  preloadAllFrameImgs();
  loader.start();

  // 加载完所有图片时的回调，初始化canvas，画第一张图片
  loader.addCompletionListener(function () {
    document.body.classList.add('loaded');
    resizeCanvas(canvas);
    window.requestAnimationFrame(drawOnCanvas);
  });

  function getFrameImgUrl(frameIdx: number, sectionIdx: number) {
    const padIdx = frameIdx.toString().padStart(4, '0');
    const originUrl = sections[sectionIdx].rawUrl;
    const modifiedUrl =
      originUrl.substring(0, originUrl.lastIndexOf('/')) + `/${padIdx}.avif`;
    return modifiedUrl;
  }

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

  function drawOnCanvas() {
    changeFrameTo(targetFrameIdx);
    window.requestAnimationFrame(drawOnCanvas);
  }

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

  /**
   * 根据滚动距离计算某个块应该渲染的图片帧编号
   */
  function calcTargetFrameIndex(
    el: HTMLElement,
    scrollTop: number,
    scrollTotal: number
  ) {
    let scrolledPercent = (scrollTop - el.offsetTop) / scrollTotal;
    scrolledPercent = Math.min(scrolledPercent, 1);
    const frameIdx = Math.ceil(scrolledPercent * allImgs.length);
    return { frameIdx, scrolledPercent };
  }

  // 不应该把draw回调放在scroll事件回调
  // 应该放在requestAnimationFrame里，也就是浏览器重绘的钩子里
  window.addEventListener('scroll', e => {
    const html = document.documentElement;
    const headerH = document.querySelector('header')!.offsetHeight;
    const scrollTop = html.scrollTop;
    const scrollStart = blk.value.offsetTop; // - html.clientHeight / 2;
    const scrollEnd =
      blk.value.offsetTop +
      blk.value.offsetHeight +
      headerH -
      (isLast ? html.clientHeight : 0);
    const scrollTotal = scrollEnd - scrollStart;

    if (scrollStart <= scrollTop && scrollTop <= scrollEnd) {
      // sblk.value.style.opacity = '1';
      const { frameIdx, scrolledPercent } = calcTargetFrameIndex(
        blk.value,
        scrollTop,
        scrollTotal
      );
      targetFrameIdx = frameIdx;
      // console.info(`targetFrameIdx = ${targetFrameIdx}`, scrolledPercent);
      // 文字滚动
      // calcTitleTranslateY(scrolledPercent);
    } else {
      // sblk.value.style.opacity = '0';
    }
  });

  // 窗口resize时需要重绘canvas
  window.addEventListener('resize', resizeEvent);

  function resizeEvent() {
    resizeCanvas(canvas);
    drawImgWhoFillsCanvas(canvas, allImgs[currentFrameIdx]);
  }

  function resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.height = sblk.value.offsetHeight;
    canvas.width = sblk.value.offsetWidth;
  }

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
  /* transition: opacity 0.4s; */
  /* opacity: 0; */

  .title {
    width: 100%;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    .bar {
      display: flex;
      align-items: center;
      justify-content: center;
      /* overflow: hidden; */
      font-weight: 700;
      color: $white;
      text-align: center;
      background-color: $blue;
      height: 377px;
    }
    .robot-handmade {
      z-index: 1;
      position: relative;
      /* margin-top: 320px;
    margin-left: 115px; */
      /* width: 1184px; */
      font-family: Alfa Slab One;
      font-size: 80px;
      margin-bottom: 50px;
    }
    .ai-coffee {
      font-size: 260px;
    }
  }

  canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
