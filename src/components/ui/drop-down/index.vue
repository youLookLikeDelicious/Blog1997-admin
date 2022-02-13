<template>
<div class="relative-position inline-block" @mouseenter="handleShowSubmenu" @mouseleave="handleHidSubmenu">
  <slot></slot>
  <transition name="v-sub-menu-box">
    <div class="v-sub-menu" v-if="showSubMenu" @mouseenter="handleShowSubmenu" @mouseleave="handleHidSubmenu">
      <slot name="drop-down"></slot>
    </div>
  </transition>
</div>
</template>

<script>
export default {
  data () {
    return {
      showSubMenu: false
    }
  },
  methods: {
    handleShowSubmenu () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.showSubMenu = true
    },
    handleHidSubmenu () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(_ => {
        this.showSubMenu = false
      }, 170)
    }
  }
}
</script>

<style lang="scss">
/** 子菜单过度动画 */
.v-sub-menu-box-enter{
  transform: scale(1, .2) translate(0rem, -9rem);
  opacity: 0;
}
.v-sub-menu-box-leave-to {
  transform: scale(1, .2);
  margin-top: -4rem;
  opacity: 0;
}
.v-sub-menu-box-leave, .v-sub-menu-box-enter-to{
  transform: scale(1, 1) translate(0, 0);
  opacity: 1;
}
.v-sub-menu-box-enter-active, .v-sub-menu-box-leave-active {
  transition: transform .3s, opacity .3s, margin-top .3s;
}
  /** 子菜单列表 */
.v-sub-menu {
  right: 0;
  top: 3.2rem;
  z-index: 99;
  color: #666;
  width: fit-content;
  position: absolute;
  border-radius: .3rem;
  background-color: #fff;
  box-shadow: 0rem .3rem 1.5rem #f0f0f0;
  ul {
    list-style: none;
    font-size: 1.4rem;
    padding: .7rem 0;
    &::before {
      top: -.7rem;
      right: .8rem;
      content: '';
      position: absolute;
      border-color: transparent;
      border: .5rem solid transparent;
      border-bottom-color: #fff;
    }
    &::after {
      $size: .8rem;
      content: '';
      position: absolute;
      width: $size;
      height: $size;
      top: -.2rem;
      right: .8rem;
      border-left: .1rem solid #ebede6;
      border-top: .1rem solid #ebede6;
      transform: rotate(45deg);
    }
    li {
      white-space: nowrap;
      word-break: keep-all;
      cursor: pointer;
      padding: .7rem 1.3rem;
      transition: background-color .3s;
      &:hover {
        background-color: #f5f5f5;
      }
    }
    i {
      width: 2.4rem;
      color: #666;
      font-size: 1.6rem;
      margin-right: .3rem;
      display: inline-block;
    }
  }
}
</style>
