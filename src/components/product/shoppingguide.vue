<template>
  <div style="padding-bottom: 60px">
    <div class="control-bar">
      <div class="control-bar-title" @click="openDialog">購物須知</div>
      <i class="arrow-right"></i>
    </div>

    <div v-if="showDialog">
      <autoscreendialog
        :closeDialog="closeDialog"
        v-on:closeDialog="closeDialog"
      >
        <template v-slot:header>購物須知</template>
        <template v-slot:body>
          <iframe :src="guideurl" />
        </template>
      </autoscreendialog>
    </div>
  </div>
</template>

<script>
import autoscreendialog from "../common/autoscreenDialog.vue"; // 蓋版提示框

export default {
  name: "shoppingguide",
  data() {
    return {
      showDialog: false,
    };
  },
  components: {
    autoscreendialog,
  },
  props: {
    guideurl: {
      type: String,
      default:
        "https://m.shopping.friday.tw/mobileweb/app/shopping/guide/shopping_guide",
    },
  },
  methods: {
    openDialog() {
      this.showDialog = true;
      this.$emit("stopBodyScroll");
    },
    closeDialog() {
      this.showDialog = false;
      this.$emit("stopBodyScroll", "close");
    },
  }
};
</script>
