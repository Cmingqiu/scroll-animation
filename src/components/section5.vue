<template>
  <div class="wrap" ref="section">
    <!-- <div ref="sblk" > -->

    <div class="wrap--1">
      <div class="title">
        <p class="ignore">Amazing</p>
        <p>Coffee Experience</p>
      </div>
      <div class="bottom-img-container ignore">
        <img src="/imgs/coffee/1.png" alt="" srcset="" />
        <img src="/imgs/coffee/2.png" alt="" srcset="" />
      </div>
    </div>

    <div class="wrap--2">
      <div class="matrix">
        <ul class="row" v-for="rowIndex in 3" :key="i">
          <li class="card ignore" v-for="cardIndex in 4" :key="cardIndex">
            <img
              :src="`/imgs/coffee/${rowIndex}-${cardIndex}.png`"
              alt=""
              srcset="" />
          </li>
        </ul>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, ShallowRef } from 'vue';

const blk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('section');
const sblk: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('sblk');
// const canvasRef: Readonly<ShallowRef<HTMLCanvasElement>> =  useTemplateRef('scrollAnimation');

import { gsap } from 'gsap';

const { isLast = false } = defineProps<{ isLast?: boolean }>();
onMounted(() => init());

function init() {
  const html = document.documentElement;
  let currentPercent = 0,
    targetPercent = 0; // 滚动的百分百

  function resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  }

  // 窗口resize时需要重绘canvas
  window.addEventListener('resize', () => {
    // resizeCanvas(canvas);
    // drawImgWhoFillsCanvas(canvas, allImgs[currentPercent]);
  });

  // 加载完所有图片时的回调，初始化canvas，画第一张图片
  // loader.addCompletionListener(function () {
  //   document.body.classList.add('loaded');
  //   resizeCanvas(canvas);
  window.requestAnimationFrame(animate);
  // });

  function animate() {
    changeCoffeePosi(targetPercent);
    window.requestAnimationFrame(animate);
  }

  function changeCoffeePosi(percent: number) {
    // let idx = frameIdx - 1;

    // // 边界防跨越
    // if (idx < 0) idx = 0;
    // if (idx > allImgs.length) idx = allImgs.length - 1;
    // drawImgWhoFillsCanvas(canvas, allImgs[idx]);
    // currentPercent = idx;
    gsap.fromTo('.bottom-img-container', {}, {});
  }

  /**
   * 根据滚动百分百
   */
  function calcPercent(
    el: HTMLElement,
    scrollTop: number,
    scrollTotal: number
  ) {
    let scrolledPercent = (scrollTop - el.offsetTop) / scrollTotal;
    scrolledPercent = Math.min(scrolledPercent, 1);
    return scrolledPercent;
  }

  // 不应该把draw回调放在scroll事件回调
  // 应该放在requestAnimationFrame里，也就是浏览器重绘的钩子里
  window.addEventListener('scroll', e => {
    const scrollTop = html.scrollTop;
    const scrollStart = blk.value.offsetTop; // - html.clientHeight / 2;
    const scrollEnd =
      blk.value.offsetTop +
      blk.value.offsetHeight -
      (isLast ? html.clientHeight : 0);
    const scrollTotal = scrollEnd - scrollStart;

    if (scrollStart <= scrollTop && scrollTop <= scrollEnd) {
      targetPercent = calcPercent(blk.value, scrollTop, scrollTotal);
      console.log('targetPercent：  ', targetPercent);
    } else {
    }
  });
}
</script>

<style scoped lang="scss">
.wrap {
  position: relative;
  /* height: 100vh;
  width: 100vw; */
  /* position: sticky; */
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */

  & > div {
    height: 100vh;
    position: relative;
  }

  .wrap--1 {
    overflow: hidden;
    .title {
      color: #fff;
      margin-top: 200px;
      p {
        font-weight: 700;
        letter-spacing: 0px;
        color: rgba(255, 255, 255, 0.5);
        text-align: center;
        &:nth-of-type(1) {
          font-size: 66px;
        }
        &:nth-of-type(2) {
          font-size: 190px;
        }
      }
    }
    .bottom-img-container.ignore {
      position: absolute;
      left: 50%;
      bottom: 100px;
      display: flex;
      transform: translateX(-50%);
      img {
        width: 440px;
        height: 413px;
        object-fit: cover;
      }
    }
  }
  .wrap--2 {
    display: flex;
    justify-content: center;
    align-items: center;
    .row {
      display: flex;
      align-items: center;
      .card.ignore {
        img {
          width: 420px;
          height: 224px;
        }
      }
    }
  }
  .amazing-coffee-experience.ignore {
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
}
</style>
