<template>
<div class="iconRadio">
  <i v-if="isActive" class="iconRadio__btnOn"></i>
  <i v-else class="iconRadio__btnOff" @click="handleClick"></i>
</div>
</template>

<script>
export default {
  name: 'radioButton',
  data() {
    return {}
  },
  props: {
    isActive: {  //radio狀態(on、off)
      type: Boolean,
      default: () => false
    },
    callBack: { //點擊radio時要執行的callback
      type: Function,
      default () {
        return ()=>{}
      }
    }
  },
  methods:{
    handleClick(){
      this.callBack();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";

.iconRadio {
  margin-right: 10px;
  i {
    width: 20px;
    height: 20px;
  }

  &__btnOn {
    background: url(../../images/icons/check-double-circle.svg) center/20px no-repeat;
  }

  &__btnOff {
    background: url(../../images/icons/check-circle-line-gy.svg) center/20px no-repeat;
  }
}
</style>
