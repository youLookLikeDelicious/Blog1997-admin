<template>
  <div>
    <ul v-for="(menu, index) in menus" :key="index">
      <li
        class="header"
        @click.capture="toggleMenu"
        v-if="$can(menu.permission)"
      >
        <span
          ><i v-if="menu.icon" :class="menu.icon"></i><span class="sidebar-title">{{ menu.header }}</span></span
        >
        <span><i class="icofont-caret-down"></i></span>
      </li>
      <li v-if="menu.children">
        <!-- <ul class="sub-menu">
          <li
            v-for="(subMenu, subIndex) in filterMenu(menu.subMenu)"
            :key="subIndex"
            :class="{ on: currentPath === subMenu.url }"
          >
            <i v-if="subMenu.icon" :class="subMenu.icon"></i>
            <router-link :to="subMenu.url">{{ subMenu.title }}</router-link>
          </li>
        </ul> -->
        <menu-tree :menus="menu.children"></menu-tree>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MenuTree',
  props: {
    menus: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style>

</style>
