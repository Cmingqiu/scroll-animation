import gsap from 'gsap';
import { onMounted, onUnmounted, ShallowRef } from 'vue';

export default function (
  frameCnt: number,
  canvas: Readonly<ShallowRef<HTMLCanvasElement>>,
  sblk: Readonly<ShallowRef<HTMLElement>>,
  section: Readonly<ShallowRef<HTMLElement>>
) {
  let ctx: CanvasRenderingContext2D;
  const target = { frameCnt: 1 };
  const allImgs = preloadAllFrameImgs(frameCnt);
  allImgs[0].onload = () => {
    resizeCanvas(canvas, sblk);
    render();
  };

  let gsapCtx: gsap.Context;

  // canvas绘制帧图片
  function render() {
    const frameIdx = Math.ceil(target.frameCnt) - 1;
    const img = allImgs[frameIdx];
    console.log(frameIdx);
    if (!img || !canvas) {
      console.error(`invalid argument: frameIdx:${frameIdx}`);
      return;
    }
    const [hRatio, wRatio] = [
      canvas.value.height / img.height,
      canvas.value.width / img.width
    ];
    const ratio = Math.max(hRatio, wRatio);
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
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

  function resizeEvent() {
    resizeCanvas(canvas, sblk);
    render();
  }

  onMounted(() => {
    ctx = canvas.value.getContext('2d')!;
    gsapCtx = gsap.context(self => {
      gsap.to(target, {
        frameCnt,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          start: 'top top',
          end: () => section.value.offsetTop + section.value.offsetHeight,
          scrub: 0.5,
          markers: true
        },
        onUpdate: () => {
          render();
          const sblk = self.selector('.sticky-block')[0];
          console.log(self, self.isActive);

          // sblk.style.opacity = '0';
        },

        onComplete: () => {},
        onStart: () => {
          console.log('onStart');
        },
        onReverseComplete: () => {
          console.log('onRepeat');
        }
      });
    }, section.value);

    // 窗口resize时需要重绘canvas
    window.addEventListener('resize', resizeEvent);
  });
  onUnmounted(() => {
    gsapCtx.revert();
    window.removeEventListener('resize', resizeEvent);
  });
}

function preloadAllFrameImgs(count: number) {
  const allImgs: HTMLImageElement[] = [];
  for (let i = 1; i <= count; i++) {
    const img = new Image();
    img.src = getFrameImgUrl(i);
    allImgs.push(img);
  }
  return allImgs;
}
const getFrameImgUrl = (frameIdx: number) => {
  const padIdx = frameIdx.toString().padStart(4, '0');
  const modifiedUrl = `${import.meta.env.VITE_ASSETS}/imgs/${padIdx}.avif`;
  // originUrl.substring(0, originUrl.lastIndexOf('/')) + `/${padIdx}.avif`;
  return modifiedUrl;
};

function resizeCanvas(
  canvas: Readonly<ShallowRef<HTMLCanvasElement>>,
  sblk: Readonly<ShallowRef<HTMLElement>>
) {
  canvas.value.width = sblk.value.offsetWidth;
  canvas.value.height = sblk.value.offsetHeight;
}
