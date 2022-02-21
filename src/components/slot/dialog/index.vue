<template>
  <transition appear name="v-dialog">
    <div v-show="visible" class="dialog-wrap">
      <div class="dialog relative-position" :style="{ width, height }">
        <header>
          <span>{{ title }}</span>
          <a href="/" title="关闭" @click.prevent="close">✘</a>
        </header>
        <!-- 对话框内容部分 -->
        <div class="dialog-slot-container">
          <slot />
        </div>
        <div v-if="showFooter" class="dialog-footer">
          <slot v-if="$scopedSlots.footer" name="footer" />
          <div v-else class="footer-wrapper">
            <v-button @click="close">取消</v-button>
            <v-button :disabled="disableConfirm" @click="$emit('confirm')" type="primary">提交</v-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'VDialog',
  props: {
    title: {
      type: String,
      default () {
        return ''
      }
    },
    width: {
      type: String,
      default () {
        return '100rem'
      }
    },
    height: {
      type: String,
      default () {
        return '17rem'
      }
    },
    visible: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 是否禁用dialog
    disableConfirm: {
      type: Boolean,
      default () {
        return false
      }
    },
    showFooter: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  watch: {
    visible () {
      if (!this.visible) {
        this.$emit('close')
      }
    }
  },
  methods: {
    /**
     * 关闭该窗口
     */
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss">
.dialog-wrap {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: fixed;
  overflow: hidden;
  box-sizing: border-box;
  animation-duration: 512ms;
  background-color: rgba(0, 0, 0, 0.5);
  header {
    width: 100%;
    height: 4rem;
    display: flex;
    padding: 0 0.7rem;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    border-bottom: .1rem solid rgba(0, 0, 0, 0.12);
    .little-prompt {
      @extend %little-prompt;
    }
  }
  .dialog {
    border-radius: 0.4rem;
    box-sizing: border-box;
    background-color: #fff;
    margin: 17vh auto 0 auto;
    padding: 0 0 7rem 0;
    max-width: 98%;
    max-height: 80vh !important;
    border: 0.1rem solid #c6c6c6;
  }
  .dialog-slot-container {
    padding-top: 1.7rem;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 4rem);
    &::-webkit-scrollbar {
      width: 0.3rem;
      height: 100%;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      transition: all 1s ease-out;
      box-shadow: inset 0 0 5px #f6f6f6;
      background-color: inherit;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      @include compatible-style(
        '',
        (
          'background-image': linear-gradient(to bottom right, #e6e6e6, #cecece),
        )
      );
      border-radius: 10px;
    }
    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      @include compatible-style(
        '',
        (
          'background-image': linear-gradient(to bottom right, #e6e6e6, #999),
        )
      );
    }
  }
}
.v-dialog-enter-active, .v-dialog-leave-active{
  transition: transform .3s, opacity .3s;
  .dialog {
    transition: transform .3s cubic-bezier(.17,.67,.79,1.5), opacity .3s;
    opacity: .3;
    transform: translateY(-6rem) scaleY(.7);
  }
}
.v-dialog-enter-from, .v-dialog-leave-to {
  opacity: 0;
  .dialog {
    opacity: 0;
    transform: translateY(-7rem) scaleY(.7);
  }
}
.v-dialog-enter-to, .v-dialog-leave-from {
  opacity: 1;
  .dialog {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}
.dialog-footer{
  text-align: right;
  padding-top: 1.7rem;
  padding-right: 1.7rem;
  padding-bottom: 1.2rem;
  border-top: .1rem solid rgba(0, 0, 0, 0.12);
}
</style>
