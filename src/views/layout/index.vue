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
      <div class="contactWrap">
        <span>Coffee Robot</span>
        <router-link to="/contact" class="contact">
          <div>Contact</div>
        </router-link>
      </div>
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
    name: 'Model S'
  },
  {
    path: 'xBotSPlus',
    name: 'Model S Plus'
  },
  {
    path: 'xBOTModelIC',
    name: 'Model IC'
  },
  {
    path: 'xBOTModelTk',
    name: 'Model Tk'
  },
  {
    path: 'about',
    name: 'About Us'
  }
];
</script>

<style lang="scss" scoped>
.layout {
  padding-top: $headerHeight;
  header {
    width: 100%;
    min-width: 1200px;
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    display: flex;
    height: $headerHeight;
    /* min-height: $headerMinHeight; */
    align-items: center;
    justify-content: space-between;
    background-color: $black;
    padding-left: 60px;
    padding-right: 85px;
    .logo {
      width: 193px;
      height: 65px;
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
    .contactWrap {
      width: 288px;
      height: 57px;
      border-radius: 100px;
      background-color: $white;
      font-size: 18px;
      font-weight: 700;
      color: $black;
      display: flex;
      align-items: center;
      justify-content: center;
      .contact {
        width: 117.54px;
        height: 42px;
        line-height: 42px;
        border-radius: 100px;
        background-color: $black;
        color: rgba(249, 66, 58, 1);
        text-align: center;
        text-decoration: none;
        margin-left: 16px;
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
