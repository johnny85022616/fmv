<template>
  <div :class="['product-combo']">
    <div class="ele-info">
      <i class="notice"></i>
      組合商品無法單一退換貨，詳細說明請參考退換貨需知。
    </div>
    <div v-for="(item, index) of itemData" :key="index" :class="['product-list-box', { soldout: item.soldout }]">
      <div>
        <img :src="item.img" :alt="item.name" />
        <span v-if="item.soldout" class="circlemask">
          <font>補貨中</font>
        </span>
      </div>
      <div>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="gap-line"></div>
  </div>
</template>

<script>
  export default {
    name: 'comboProducts',
    data() {
      return {};
    },
    props: {
      comboData: {
        type: Object,
        default: () => null,
      },
    },
    computed: {
      itemData() {
        return this.comboData.uiComboData
          ? this.comboData.uiComboData.map((v) => {
              return {
                name: v.name,
                img: v.image_url,
                soldout: v.variants.every(x => x.isSoldOut),
              };
            })
          : [];
      },
    },
  };
</script>

<style lang="scss" scoped>
  .product-combo {
    font-size: 1.4rem;
  }
</style>
