<template>
  <div class="wrap" ref="section">
    <div class="wrap--1">
      <div class="title">
        <p class="ignore">Amazing</p>
        <p>Coffee Experience</p>
      </div>
      <div class="bottom-img-container ignore">
        <img class="coffee1" src="/imgs/coffee/1.png" alt="" srcset="" />
        <img class="coffee2" src="/imgs/coffee/2.png" alt="" srcset="" />
      </div>
    </div>

    <div class="wrap--2">
      <div class="matrix">
        <ul class="row" v-for="rowIndex in 3" :key="rowIndex">
          <li class="card ignore" v-for="cardIndex in 4" :key="cardIndex">
            <img
              :class="`card${rowIndex}-${cardIndex}`"
              :src="`/imgs/coffee/${rowIndex}-${cardIndex}.png`"
              alt=""
              srcset="" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, ShallowRef, onUnmounted } from 'vue';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import useScrollPercent from '@/hooks/useScrollPercent';

const sectionRef: Readonly<ShallowRef<HTMLElement>> = useTemplateRef('section');
const { isLast = false } = defineProps<{ isLast?: boolean }>();

const { targetPercent } = useScrollPercent(sectionRef, isLast);

// 注册插件
gsap.registerPlugin(ScrollTrigger);

let ctx: gsap.Context;
onMounted(init);
onUnmounted(() => {
  ctx.revert();
});
function init() {
  const html = document.documentElement;
  let currentPercent = 0;

  const mainTL = gsap.timeline();
  mainTL.add(coffeeFall()) /* .add(cardMatrixTL(), '<') */;

  // 咖啡杯回落
  function coffeeFall() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.wrap--1',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: true
      }
    });

    tl.to('.wrap--1 .coffee1', {
      x: '-=560',
      y: '+=750',
      scale: 0.5,
      duration: 1
    })
      .to(
        '.wrap--1 .coffee2',
        {
          x: '-=560',
          y: '+=750',
          scale: 0.5,
          duration: 1
        },
        '<'
      )
      .to('.wrap--2', {
        opacity: 1
      })
      .from(
        '.matrix',
        {
          opacity: 0,
          scale: 3
          // y: '+=400'
        },
        '<'
      );
    return tl;
  }

  // 卡片由大到小，透明度由暗到明
  function cardMatrixTL() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.wrap--2',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: true
      }
    });
    tl.from('.matrix', {
      opacity: 0,
      scale: 2,
      y: '+=100',
      scrollTrigger: {
        trigger: '.matrix',
        scrub: true
      }
    });
    return tl;
  }

  // ctx = gsap.context(() => {
  //   const tl =
  //     gsap.timeline(); /* { repeat: -1, yoyo: true, repeatDelay: 0.5 } */
  //   tl.to('.coffee1', {
  //     x: '-=560',
  //     y: '+=750',
  //     scale: 0.5,
  //     duration: 1,
  //     scrollTrigger: {
  //       trigger: '.coffee1',
  //       start: 'top center',
  //       // end: 'top 190%',
  //       scrub: 1
  //       // pin: '.card1-1'
  //     }
  //   })
  //     .to(
  //       '.coffee2',
  //       {
  //         x: '-=560',
  //         y: '+=750',
  //         scale: 0.5,
  //         // duration: 1,
  //         scrollTrigger: {
  //           trigger: '.coffee2',
  //           start: 'top center',
  //           scrub: 1
  //           // pin: '.card1-1'
  //         }
  //       }
  //       // '<'
  //     )
  //     .from(
  //       '.matrix',
  //       {
  //         opacity: 0,
  //         scale: 2,
  //         y: '+=100',
  //         duration: 3
  //         // scrollTrigger: {
  //         //   trigger: '.matrix',
  //         //   // start: 'top top',
  //         //   // end: 'top center',
  //         //   scrub: true
  //         // }
  //       }
  //       // '<'
  //     );
  // });

  /*  tl.to('.bottom-img-container', {
    opacity: 0,
    x: '-=100',
    y: '+=400',
    // y: 50,
    // rotation: 360,
    scale: 0.5,
    duration: 1
  });  */
  /* .to('.bottom-img-container', {
    rotation: 360,
    duration: 1
  }); */

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
    // console.log('==> ', targetPercent.value);
    changeCoffeePosi(targetPercent.value);
    window.requestAnimationFrame(animate);
  }

  function changeCoffeePosi(percent: number) {
    // 边界防跨越
    if (percent < 0) percent = 0;
    else if (percent > 1) percent = 1;
    // drawImgWhoFillsCanvas(canvas, allImgs[idx]);
    // currentPercent = idx;
    // gsap.fromTo(
    //   '.bottom-img-container',
    //   { opacity: 1 ,duration:2},
    //   { opacity: 0.2, x: 10 }
    // );
  }
}
</script>

<style scoped lang="scss">
.wrap {
  position: relative;
  /* padding-bottom: 100vh; */
  height: 200vh;
  width: 100vw;
  /* position: sticky; */
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */

  & > div {
    height: 100vh;
    position: relative;
  }

  .wrap--1 {
    padding-top: 10px;
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
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
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
