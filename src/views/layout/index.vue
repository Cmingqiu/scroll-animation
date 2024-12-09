<template>
  <div class="layout">
    <header>
      <img class="logo" src="/logo.png" alt="" srcset="" />
      <nav>
        <RouterLink
          class="menu-item"
          v-for="menu in menus"
          :key="menu.path"
          :to="menu.path"
          >{{ menu.name }}</RouterLink
        >
      </nav>
      <span></span>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { routes } from '@/router';
import { RouterLink } from 'vue-router';

const menus = [
  {
    path: '/',
    name: 'XBOT-Model S'
  },
  {
    path: 'xBotSPlus',
    name: 'XBOT-Model S Plus'
  },
  {
    path: 'xBOTModelIC',
    name: 'XBOT-Model IC'
  },
  {
    path: 'xBOTModelTk',
    name: 'XBOT-Model Tk'
  },
  {
    path: 'about',
    name: 'About Us'
  },
  {
    path: 'contact',
    name: 'Contact'
  }
];
</script>

<style lang="scss" scoped>
.layout {
  padding-top: $headerHeight;
  header {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    height: $headerHeight;
    min-height: $headerMinHeight;
    align-items: center;
    justify-content: space-between;
    background-color: $black;
    .logo {
      width: 63px;
      height: 65px;
      margin-left: 50px;
    }
    nav {
      display: flex;
      align-items: center;
      .menu-item {
        color: #fff;
        margin-right: 95px;
        text-decoration: none;
        font-size: 18px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  main {
    /* height: calc(100vh - $headerHeight); */
    /* max-height: calc(100vh - $headerMinHeight); */
    position: relative;
  }
}
</style>
