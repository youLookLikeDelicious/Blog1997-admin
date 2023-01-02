<template>
  <!-- 有两个主题 type="box|text" -->
  <button
    v-if="text"
    type="button"
    :title="title"
    @click="handleClick"
    :class="[
      'v-button',
      {'text-button': text},
      'link-btn-' + type,
      { 'btn-disable': disabled },
    ]"
    >
      <template v-if="icon">
        <i :class="icon"></i>
      </template>
      <slot></slot>
    </button>
  <button
    v-else
    type="button"
    @click="handleClick"
    :class="[
      'v-button',
      'btn-' + type,
      { 'btn-disable': disabled }
    ]"
    :title="title"
    >
    <template v-if="icon">
      <i :class="icon"></i>
    </template>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'v-button',
  props: {
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    },
    type: {
      type: String,
      default () {
        return 'default'
      }
    },
    // 是否时文本按钮
    text: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 图标
    icon: {
      type: String,
      default () {
        return ''
      }
    },
    title: {
      type: String,
      default () {
        return ''
      }
    },
    mouseenter: {
      type: Function
    },
    mouseleave: {
      type: Function
    },
    href: {
      type: String,
      default () {
        return '/'
      }
    }
  },
  methods: {
    handleClick () {
      if (this.disabled) {
        return
      }

      if (this.href !== '/') {
        window.open(this.href, '_blank')
        return
      }
      this.$emit('click')
    }
  },
  mounted () {
    if (this.mouseenter) {
      this.$el.addEventListener('mouseenter', this.mouseenter)
    }
    if (this.mouseleave) {
      this.$el.addEventListener('mouseleave', this.mouseleave)
    }
  }
}
</script>

<style lang="scss">
.btn-primary {
  font-size: 1.4rem;
  @extend %btn;
  @extend %base-btn;
}
.btn-default{
  @extend %base-btn;
  color: #666 !important;
  border: .1rem solid rgba(#999, .2);
}
.text-button {
  border-color: transparent;
  background-color: transparent;
}
.v-button{
  cursor: pointer;
  font-size: 1.4rem;
  white-space: nowrap;
  &:not(first-child) {
    margin-left: 1.2rem;
  }
  i {
    margin-right: .3rem;
  }
}
</style>
