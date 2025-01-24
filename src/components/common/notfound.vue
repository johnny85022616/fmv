<template>
<div class="notfound">
  <h2>
    <b>{{ messages }}</b>
  </h2>
  <button @click="backHomepage">回首頁</button>
</div>
</template>

<script>
export default {
  name: 'notfound',
  props: {
    messages: {
      type: String,
      default: () => '抱歉，您所查看的網頁不存在'
    }
  },
  methods: {
    backHomepage() {
      window.location.replace('/');
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/color';

.notfound {
  text-align: center;

  h2 {
    padding: 40px 0 0px 0;
    line-height: 1.6em;
    font-size: 1.4rem;
  }
  
  button {
    width: 200px;
    font-weight: bold;
    font-size: 1.4rem;
    padding: 8px;
    margin: 30px 0 0 0;
    border-radius: 5px;
    border: 0px;
    background-color: $red;
    color: $white;
    box-sizing: border-box;
  }
}
</style>
