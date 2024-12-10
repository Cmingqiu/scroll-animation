import { onMounted, onUnmounted, ref, ShallowRef, useTemplateRef } from 'vue';

export default function (
  sectionRef: Readonly<ShallowRef<HTMLElement>>,
  isLast: boolean,
  scopedCb?: () => void,
  unScopedCb?: () => void
) {
  // 滚动百分百
  const targetPercent = ref<number>(0);

  function scrollEvent() {
    const html = document.documentElement;
    const headerH = document.querySelector('header')!.offsetHeight;
    const scrollTop = html.scrollTop;
    const scrollStart = sectionRef.value.offsetTop - headerH; // - html.clientHeight / 2;
    const scrollEnd =
      sectionRef.value.offsetTop -
      headerH +
      sectionRef.value.offsetHeight -
      (isLast ? html.clientHeight : 0);
    const scrollTotal = scrollEnd - scrollStart;

    if (scrollStart <= scrollTop && scrollTop <= scrollEnd) {
      targetPercent.value = calcPercent(
        sectionRef.value,
        scrollTop,
        scrollTotal
      );
      scopedCb && scopedCb();
      // console.log('targetPercent：  ', targetPercent.value);
    } else {
      unScopedCb && unScopedCb();
    }
  }

  // 不应该把draw回调放在scroll事件回调
  // 应该放在requestAnimationFrame里，也就是浏览器重绘的钩子里
  window.addEventListener('scroll', scrollEvent);

  onMounted(() => {
    window.addEventListener('scroll', scrollEvent);
  });
  onUnmounted(() => {
    window.removeEventListener('scroll', scrollEvent);
  });

  return { targetPercent };
}

// 计算滚动百分百
function calcPercent(el: HTMLElement, scrollTop: number, scrollTotal: number) {
  let scrolledPercent = (scrollTop - el.offsetTop) / scrollTotal;
  scrolledPercent = Math.min(scrolledPercent, 1);
  return scrolledPercent;
}
