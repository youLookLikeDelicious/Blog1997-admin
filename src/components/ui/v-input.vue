<template>
  <div v-if="theme === 'inline'" :class="['v-input-inline', 'relative-position', { 'v-input-line_textarea': textarea }]">
    <textarea
      v-if="textarea"
      :placeholder="placeholder"
      v-model="currentValue"
      :autocomplete="autocomplete"
      :readonly="readonly"
      @keydown="handleKeydown"
      @blur="blurInput($event)"
      @focus="focus($event)"
      @change="$emit('change', currentValue)"></textarea>
    <input
      v-else
      :name="name"
      :type="currentType"
      :placeholder="placeholder"
      v-model="currentValue"
      :autocomplete="autocomplete"
      :readonly="readonly"
      @blur="blurInput($event)"
      @focus="focus($event)"
      @change="$emit('change', currentValue)"
    />
    <div class="hr-wrap">
      <hr />
    </div>
  </div>
  <div v-else :class="['v-input-box', 'relative-position', boxInputClass]">
    <span v-if="!currentValue" class="v-input-placeholder absolute-position">{{
      placeholder
    }}</span>
    <input
      v-model="currentValue"
      :readonly="readonly"
      :type="currentType"
      :name="name"
      @focus="focused = true"
      @blur="focused = false"
      :autocomplete="autocomplete"
      @change="$emit('change', currentValue)"
    />
  </div>
</template>

<script>
import calcTextareaHeight from 'element-ui/packages/input/src/calcTextareaHeight'
import _ from 'lodash'
export default {
  name: 'VInput',
  props: {
    placeholder: {
      type: String,
      default () {
        return ''
      }
    },
    val: {
      type: [String, Number],
      default () {
        return ''
      }
    },
    readonly: {
      type: Boolean,
      defautl () {
        return false
      }
    },
    type: {
      type: String,
      default () {
        return 'text'
      }
    },
    theme: {
      type: String,
      default () {
        return 'inline'
      }
    },
    name: {
      type: String,
      default () {
        return ''
      }
    },
    autocomplete: {
      type: String,
      default () {
        return 'on'
      }
    },
    textarea: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      currentValue: this.$attrs.vaue || this.val || '',
      currentType: this.type,
      focused: false,
      boxInputClass: ''
    }
  },
  created () {
    this.syncCurrentValue()
  },
  watch: {
    currentValue () {
      this.$emit('input', this.currentValue)
    },
    '$attrs.value' () {
      this.syncCurrentValue()
    },
    focused () {
      if (this.theme !== 'box') {
        return
      }
      this.boxInputClass = 'v-input-box-span-invisible'
      window.setTimeout(() => {
        this.boxInputClass = this.focused
          ? 'v-input-box-focused'
          : 'v-input-box-unfocused'
      }, 0)
    }
  },
  methods: {
    /**
     * input失去焦点事件
     *
     * @param {Event} event
     */
    blurInput (event) {
      this.blur(event)
      this.$emit('blur', event)
    },
    /**
     * in-line theme 失去焦点动画
     *
     * @param {Event} event
     */
    blur (event) {
      const hr = event.target.parentElement.querySelector('hr')
      this.$animate(hr, {
        width: '0px',
        duration: 230,
        easing: 'bezier(0.2, 0.2)',
        finish: true
      })
    },
    /**
     * in-line theme input聚焦动画
     *
     * @param {Event} event
     */
    focus (event) {
      const hr = event.target.parentElement.querySelector('hr')
      this.$animate(hr, { width: '100%', duration: 230, easing: 'bezier(0.2, 0.2)', finish: true })
    },
    syncCurrentValue () {
      if (this.$attrs.value !== this.currentValue) {
        this.currentValue = this.$attrs.value
      }
    },
    // 按下键盘,重新计算textarea的高度
    handleKeydown: _.throttle((event) => {
      const { minHeight, height } = calcTextareaHeight(event.target)
      event.target.style.minHeight = minHeight
      event.target.style.height = height
    }, 24)
  }
}
</script>

<style lang="scss">
%v-input {
  width: 100%;
  padding-left: 0.3rem;
  box-sizing: border-box;
}
.v-input-inline {
  width: 23rem;
  input {
    height: 3rem;
  }
  input, textarea {
    @extend %v-input;
    border-bottom: 0;
    background-color: transparent;
    border: 0;
    border-bottom: 0.1rem solid #c6c6c6;
    box-sizing: border-box;
    outline: none;
    &::-webkit-input-placeholder{
      color: #C0C4CC
    }
  }
  input {
    height: 3rem;
  }
  textarea {
    height: 2.5rem;
    font-size: 1.4rem;
  }
  .hr-wrap {
    width: 100%;
    margin-top: -0.1rem;
    hr {
      width: 0;
      background-color: #6cacff;
      border: 0;
      height: 0.2rem;
      margin: 0 auto;
    }
  }
  .eye-btn {
    position: absolute;
    top: 1rem;
    right: 2rem;
    color: #666;
    font-size: 1.6rem;
    cursor: pointer;
    &:hover {
      color: #999;
    }
    &:active {
      color: #333;
    }
  }
}
.v-input-line_textarea{
  overflow: hidden;
  .hr-wrap {
    margin-top: -.5rem;
  }
  textarea{
    width: 100%;
    resize: none;
    overflow: hidden;
    transition: height .3s;
    box-sizing: border-box;
    padding-bottom: .7rem;
  }
}
.v-input-box {
  border: 0.1rem solid #DCDFE6;
  box-sizing: border-box;
  border-radius: 0.3rem;
  // width: 23rem;
  padding-left: .7rem;
  padding-right: .7rem;
  transition: border-color 0.3s;
  input {
    @extend %v-input;
    height: 3rem;
    border: 0;
    box-sizing: border-box;
  }
  .v-input-placeholder {
    color: #C0C4CC;
    font-size: 1.2rem;
  }
  span {
    background-color: #fff;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 0.3rem;
  }
}
.v-input-box-unfocused {
  span {
    animation: transform-placeholder 0.3s reverse forwards;
  }
}
.v-input-box-focused {
  border-color: #3490dc;
  span {
    animation: transform-placeholder 0.3s forwards;
  }
}
.v-input-box-span-invisible {
  span {
    visibility: hidden;
  }
}
@keyframes transform-placeholder {
  to {
    top: -1.2rem;
    left: -0.5rem;
    z-index: 2;
    transform: scale(0.7, 0.7);
  }
}
</style>
