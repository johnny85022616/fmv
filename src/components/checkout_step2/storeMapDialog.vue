<template>
  <div class="storeMapDialog">
    <fullscreendialog :isFullscreen="true" @closeDialog="closeStoreMapDialog">
      <template v-slot:header>門市地圖</template>
      <template v-slot:body>
        <iframe src="https://event.shopping.friday.tw/event/ifameTest/map.html">
        </iframe>
      </template>
    </fullscreendialog>
    <form name="store" method="post" action="${url}">
      <input type="hidden" name="eshopid" value="R01">
      <input type="hidden" name="servicetype" value="${serviceType}">
      <input type="hidden" name="url" value="${callbackUrl}">
      <input type="hidden" name="tempvar" value="${tempVar}">
    </form>
  </div>
</template>

<script>
import fullscreendialog from "../common/fullscreenDialog.vue";
export default {
  name: "modifyStoreDialog",
  data() {
    return {};
  },
  props: {
    storeType: {
      type: Number,
    },
  },
  methods: {
    //關閉選擇門市popup
    closeStoreMapDialog() {
      this.$emit("closeMapDialog", this.storeData);
    },
    //initIframe
    initIframe() {
      window.addEventListener("message", (e) => {
        this.storeData = e.data;
        if (this.storeData && this.storeData.storeId) {
          this.closeStoreMapDialog();
        }
      });
    },
  },
  async created() {
    this.initIframe();
  },

  components: { fullscreendialog },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
</style>
