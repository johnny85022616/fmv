<template>
  <div class="brandMCategory">
    <div class="brandNav">
      <div class="logo">
        <a :href="logoUrl">
          <img :src="supplierData.logoMobile"
            :style="{ backgroundColor: `${supplierData.headerColor ? supplierData.headerColor : '#ddd5cc'}` }" />
        </a>
      </div>
      <div class="pageCatName">{{ this.pageCatName }}</div>
    </div>
    <template v-if="hasSub">
      <div class="brandMCategory__products" v-if="data && data.length > 0">
        <ul class="brandMCategory__products__block-list" v-if="data">
          <li v-for="item in data" :key="item.main.cateId">
            <template v-if="item.main && item.mainSub && item.mainSub.length === 2">
              <pictureThreeBox v-if="supplierData && item && urlCidAry" :supplierData="supplierData" :item="item"
                :urlCidAry="urlCidAry" />
            </template>
            <template v-else>
              <pictureTwoBox v-if="supplierData && item" :supplierData="supplierData" :item="item"
                :urlCidAry="urlCidAry" />
            </template>
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <div class="brandMCategory__products-list">
        <aiProductItem v-if="productItems.length > 0" :itemList="productItems" />
      </div>
    </template>
  </div>
</template>

<script>
/*
>=3筆資料 ---> pictureThreeBox
<3筆資料 ---> pictureTwoBox
*/
import pictureTwoBox from "./pictureTwoBox.vue";
import pictureThreeBox from "./pictureThreeBox.vue";
import aiProductItem from "../common/aiProductItem.vue";
export default {
  name: "brandMCategory",
  data() {
    return {
      data: [],
      pageCatName: "",
      category: null,
      subObj: null, // 目錄物件
      subData: null, // 底層資料
      hasSub: false, // 是否有下層資料
      tempData: {},
      productItems: [],
      urlCidAry: [], // 目前網址參數陣列
    };
  },
  async created() {
    const cateObj = this.tools.processUrlCid();
    this.urlCidAry = JSON.parse(JSON.stringify(cateObj.catgArr));

    // 取得目錄資料
    await this.getCategory();

    // 取得目錄TITLE 畫面目錄結構
    this.subObj = this.getCategoryInfo();
    this.pageCatName = this.subObj?.name;
    this.hasSub = this.subObj?.sub && Object.keys(this.subObj.sub).length > 0;
    if (this.hasSub) {
      this.subData = Object.values(this.subObj.sub);
    } else {
      this.subData = [this.subObj];
    }

    // 取商品
    await this.getPrd();
  },
  props: {
    supplierData: {
      type: Object,
    },
    type: {
      type: String,
      default: "M",
    },
  },
  methods: {
    // 取商品
    async getPrd() {
      const nowPageArr = this.subData;
      for (let cat of nowPageArr) {
        await this.getCategoryData(cat);
      }
    },
    async getCategoryData(cateObj) {
      const postData = {
        type: 2,
        q1_x: 0.5,
        supplier_y: 1,
        list_num: 12,
        filter: this.api.ai.composeBListFilter(
          this.supplierData?.supplierId,
          this.supplierData?.unShowSupplierIds?.join(',') || '',
          cateObj.cid,
          this.supplierData?.b4Info?.kws || ''
        ),
      };

      const data = await this.api.ai.getAiData("getalist", postData);
      if (!data) return;

      this.hasSub ? this.parseData(data, cateObj) : this.productItems.push(...data);
    },
    parseData(data, cateObj) {
      if (!data) return false;

      const hasSub = cateObj.sub && Object.keys(cateObj.sub).length > 0;
      let tempData = {
        main: {
          cateId: cateObj.cid,
          cateName: cateObj.name,
          name: '',
          pid: '',
          image_url: '',
          price: null,
          hasSub,
        },
        mainSub: [],
        sub: [],
      };

      data.forEach((v, index) => {
        const product = {
          name: v.name,
          pid: v.pid,
          image_url: v.image_url,
          price: v.price ? this.tools.priceFormat(v.price) : null,
        };

        if (index === 0) {
          // 首項設置為 main
          Object.assign(tempData.main, product);
        } else if (index < 3) {
          // 第2、3項設置為 mainSub
          tempData.mainSub.push(product);
        } else {
          // 其餘設置為 sub
          tempData.sub.push(product);
        }
      });

      this.spreadData(tempData);
    },
    // 過濾每個類別如果sub太少不顯示該類別的sub
    spreadData(tempData) {
      // 初始化 sub 的處理結果
      let subData = [];

      if (tempData.sub.length >= 3) {
        // 計算 sub 的行數，最多取 9 個元素
        const calcSubRows = Math.min(Math.floor(tempData.sub.length / 3) * 3, 9);
        subData = tempData.sub.slice(0, calcSubRows);
      }

      // 構建 uiData，sub 根據條件被設置為合適的數據
      const uiData = { ...tempData, sub: subData };

      this.data.push(uiData);
    },
    // 取得目錄資料
    async getCategory() {
      const postData = {
        target: "pseudoid",
        list_fun: "allCategory",
        list_args: "content",
        list_remote: "b01",
        site_id: this.supplierData.siteId,
        if_bWeb: "1",
      };

      const data = await this.api.ai.getAiData("getvlist", postData);
      if (data && data.catg1) {
        this.category = data.catg1[0];
      }
    },
    // 取網址對應的目錄資料
    getCategoryInfo() {
      return this.urlCidAry.reduce((p, c, i, a) => {
        const isLastElement = (i + 1) === a.length;
        return isLastElement ? p[c] : (p[c]?.sub || p);
      }, this.category);
    },
  },
  computed: {
    logoUrl() {
      return `/shop/${this.supplierData.urlSuffix}`;
    }
  },
  components: {
    pictureTwoBox,
    pictureThreeBox,
    aiProductItem,
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";

.brandMCategory {
  margin-bottom: 60px;

  .brandNav {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    position: sticky;
    top: 87px;
    z-index: 1;
    background-color: $white;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);

    .logo {
      margin-right: 5px;
      border-radius: 5px;

      img {
        width: auto;
        max-height: 40px;
        object-fit: contain;
        border-radius: 5px;
        vertical-align: top;
      }
    }

    .pageCatName {
      font-size: 14px;
    }
  }

  &__products {
    &-list {
      padding: 15px;
    }

    &__block-list {
      padding: 15px 0;
      list-style-type: none;

      >li {
        &:last-of-type {
          margin-bottom: 70px;
        }
      }

      li {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
