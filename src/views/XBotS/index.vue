<template>
  <div>
    <Seciton1 />
    <Seciton2 />
    <Seciton3 />
    <Seciton4 />
    <Seciton5 isLast />
  </div>
</template>

<script setup lang="ts">
import Seciton1 from './part/section1.vue';
import Seciton2 from './part/section2.vue';
import Seciton3 from './part/section3.vue';
import Seciton4 from './part/section4.vue';
import Seciton5 from './part/section5.vue';
</script>

<style lang="scss" scoped></style>
