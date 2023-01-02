<template>
  <div class="password-strength">
    <span :class="'strength-' + strength"></span>
    <span
      :class="{
        'strength-2': strength === 2,
        'strength-3': strength === 3,
      }"
    ></span>
    <span :class="{ 'strength-3': strength === 3 }"></span>
  </div>
</template>

<script>
export default {
  name: 'PasswordStrength',
  props: {
    strength: {
      type: Number,
      default () {
        return 1
      }
    }
  }
}
</script>

<style lang="scss">
.password-strength {
  margin-top: 1rem !important;
  display: flex;
  justify-content: flex-start;
  span {
    width: 30%;
    height: 1rem;
    display: inline-block;
    box-sizing: border-box;
    border-radius: 0.3rem;
    border: 0.1rem solid #999;
    transition: background-color .3s;
    &:not(first-child) {
      margin-right: .7rem;
    }
  }
  .strength-1 {
    border: 0;
    background-color: #e61e1e;
    box-shadow: 0rem 0rem 0.2rem 0.1rem rgba($color: #e91313, $alpha: 0.3);
  }
  .strength-2 {
    border: 0;
    background-color: #f08c1a;
    box-shadow: 0rem 0rem 0.2rem 0.1rem rgba($color: #f38c16, $alpha: 0.3);
  }
  .strength-3 {
    border: 0;
    background-color: #32e23b;
    box-shadow: 0rem 0rem 0.2rem 0.1rem rgba($color: #34f316, $alpha: 0.3);
  }
}
</style>
