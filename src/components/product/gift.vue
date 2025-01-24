<template>
  <div v-if="giftItems.length > 0">
    <div class="product-component-container">
      <div class="product-component-blocks product-campaign short-tag">
        <div v-for="(item, index) of giftItems" :key="index">
          <span>
            <label>贈品</label>
          </span>
          <span class="product-campaign__evt-desc">
            <font :class="[
                'product-campaign__desc-txt',
                { 'text-light': item.isSoldOut },
              ]">
              {{ giftName(item) }}
            </font>
            <a @click="openDialog(item)">查看</a>
          </span>
        </div>
      </div>

      <autoscreendialog v-if="showDialog" v-on:closeDialog="closeDialog">
        <template v-slot:header>{{ dialogData.name }}</template>
        <template v-slot:body>
          <div class="ele-info">
            <i class="notice"></i>
            {{ giftTypeDescription }}
          </div>
          <div class="ele-content mb20">
            <div>
              <img :src="dialogData.images[0]" alt="" />
              <span v-if="dialogData.isSoldOut" class="circlemask">
                <font>已贈完</font>
              </span>
            </div>

            <div v-if="noticeMsg" class="ele-title mb10 mt20">
              <font class="text-light">活動注意事項</font>
            </div>
            <div v-if="noticeMsg" class="ele-desc mb20" v-html="noticeMsg">
            </div>
          </div>
        </template>
      </autoscreendialog>
    </div>
  </div>
</template>

<script>
import autoscreendialog from "../common/autoscreenDialog.vue"; // 蓋版提示框

export default {
  name: "gift",
  components: {
    autoscreendialog,
  },
  data() {
    return {
      showDialog: false,
      dialogData: {},
    };
  },
  props: {
    giftItems: {
      type: Array,
      default: () => []
    },
    noticeMsg: {
      type: String,
      default: () => "",
    },
  },
  methods: {
    openDialog(data) {
      this.dialogData = data;
      this.showDialog = true;
    },
    closeDialog() {
      this.dialogData = {};
      this.showDialog = false;
    },
    giftName(item) {
      return item.isSoldOut ? "[已送完] " + item.name : item.name;
    },
  },
  computed: {
    giftTypeDescription() {
      return this.dialogData.giftType === 1
        ? "贈品活動送完為止，請依購物車結帳為準"
        : "此活動僅贈送符合最高門檻之贈品，恕不累贈。贈品活動送完為止，請以購物車結帳為主";
    },
  },
};
</script>

<style lang="sass" scoped>
@import '../../style/color.scss'

.product-campaign
  &.short-tag
    label
      color: $red
      border: 1px solid $red
</style>
