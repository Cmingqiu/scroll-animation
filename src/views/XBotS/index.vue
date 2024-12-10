<template>
  <div>
    <Seciton1 class="panel" />
    <!-- <Seciton2 class="panel" /> -->
    <!-- <Seciton3 class="panel" /> -->
    <Seciton4 class="panel" isLast />
    <!-- <Seciton5 isLast /> -->
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Seciton1 from './part/section1.vue';
import Seciton2 from './part/section2.vue';
import Seciton3 from './part/section3.vue';
import Seciton4 from './part/section4.vue';
import Seciton5 from './part/section5.vue';
import { onMounted } from 'vue';

function init() {
  const panels = gsap.utils.toArray('.panel');
  // we'll create a ScrollTrigger for each panel just to track when each panel's top hits the top of the viewport (we only need this for snapping)
  let tops = panels.map(panel =>
    ScrollTrigger.create({ trigger: panel, start: 'top top' })
  );

  panels.forEach((panel, i) => {
    ScrollTrigger.create({
      trigger: panel,
      start: () =>
        panel.offsetHeight < window.innerHeight ? 'top top' : 'bottom bottom', // if it's shorter than the viewport, we prefer to pin it at the top
      pin: true,
      pinSpacing: false
    });
  });

  ScrollTrigger.create({
    snap: {
      snapTo: (progress, self) => {
        let panelStarts = tops.map(st => st.start), // an Array of all the starting scroll positions. We do this on each scroll to make sure it's totally responsive. Starting positions may change when the user resizes the viewport
          snapScroll = gsap.utils.snap(panelStarts, self.scroll()); // find the closest one
        return gsap.utils.normalize(
          0,
          ScrollTrigger.maxScroll(window),
          snapScroll
        ); // snapping requires a progress value, so convert the scroll position into a normalized progress value between 0 and 1
      },
      duration: 0.5
    }
  });
}
// onMounted(init);
</script>

<style lang="scss" scoped>
.panel {
  /* height: 100vh; */
  /* position: sticky; */
  /* top: 0; */
}
</style>
