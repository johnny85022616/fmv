<template>
  <div class="campaign">
    <template v-if="campaignData.otherInformation.image2">
      <a v-if="campaignData.otherInformation.hyperlink2" :href="campaignData.otherInformation.hyperlink2" target="_blank">
        <img class="campaignImg" :src="campaignData.otherInformation.image2" alt="">
      </a>
      <img v-else class="campaignImg" :src="campaignData.otherInformation.image2" alt="">
    </template>
    <div class="productArea">
      <div v-if="layout1Data" class="layout layout1">
        <p class="title">{{campaignData.campaignName}}</p>
        <ul>
          <li v-for="item in layout1Data" :key="item.main.cateId">
            <template v-if="item.mainSub">
              <pictureThreeBox v-if="item" :item="item" :hasLink="false" />
            </template>
          </li>
        </ul>
        <div class="scatteredArea">
          <p class="scatteredArea__title">暢銷夯品</p>
          <aiProductItem :showCampaignQtyIcon="true" :itemList="scatteredData"></aiProductItem>
        </div>
      </div>
      <!-- layout2(B型) -->
      <div v-if="layout2Data" class="layout layout2">
        <p class="title">{{campaignData.campaignName}}</p>
        <aiProductItem :showCampaignQtyIcon="true" :itemList="layout2Data"></aiProductItem>
      </div>
      <!-- layout3(1-6型) -->
      <div v-if="layout3Data" class="layout layout3">
        <p class="title">{{campaignData.campaignName}}</p>
        <ul>
          <li v-for="item in layout3Data" :key="item.main.cateId">
            <picture16Box v-if="item" :item="item" :hasLink="false" />
          </li>
        </ul>
        <div class="scatteredArea">
          <p class="scatteredArea__title">暢銷夯品</p>
          <aiProductItem :showCampaignQtyIcon="true" :itemList="scatteredData"></aiProductItem>
        </div>
      </div>
      <div v-if="layout4Data" class="layout layout4">
        <p class="title">{{campaignData.campaignName}}</p>
        <ul>
          <li v-for="item in layout4Data" :key="item.main.cateId">
            <picture43Box v-if="item" :item="item" :hasLink="false" />
          </li>
        </ul>
        <div class="scatteredArea">
          <p class="scatteredArea__title">暢銷夯品</p>
          <aiProductItem :showCampaignQtyIcon="true" :itemList="scatteredData"></aiProductItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import aiProductItem from "../../components/common/aiProductItem.vue";
import pictureThreeBox from "../../components/common/pictureThreeBox.vue";
import picture16Box from "../../components/common/picture1_6Box.vue";
import picture43Box from "../../components/common/picture4_3Box.vue";
export default {
  name: "layoutOther",
  data() {
    return {
      originData: null, //原始資料
      hasInitData: false,
      layout1Data: null, //layout1(A型)
      layout2Data: null, //layout2(B型)
      layout3Data: null, //layout3(1帶6型)
      layout4Data: null, //layout3(4帶3型)
      scatteredData: [], //暢銷夯品
    };
  },
  async created() {
    await this.getCampaignData();
    this.parseData();
  },
  props: {
    campaignData: {
      type: Object,
    },
  },
  methods: {
    //取得campaign資料
    async getCampaignData() {
      this.campaignPidsType = this.campaignData.campaignPidsType;
      let list;
      //type1
      if (this.campaignPidsType === 1) {
        const { productItems: fetchedProductItems } =
          await this.api.ui.campaign.getCampaignProducts(this.campaignData);
        list = await this.api.ui.campaign.getCampaignProducts(
          this.campaignData,
          null,
          fetchedProductItems
        );
        this.originData = list.productItems || [];
      } else {
        const data = await this.api.ui.campaign.getCampaignAiProducts(
          this.campaignData,
          200
        );
        this.originData = (await this.getProductInfo2(data.productItems)) || [];
      }

      if (this.originData.length > 0) {
        this.hasInitData = true;
      }
    },
    //取得商品價格(type2)
    async getProductInfo2(productItems) {
      const pids = productItems.map((v) => v.pid);
      const priceData = await this.api.product.getProducts(pids, 2);
      const originData = productItems.map((e) => {
        if (priceData[e.pid]) {
          return {
            ...e,
            ...priceData[e.pid],
          };
        } else {
          return e;
        }
      });

      this.isApiOk = true;
      return originData;
    },
    parseData() {
      switch (this.campaignData.otherInformation.layout) {
        case "1":
          this.parseLayout1Data();
          break;
        case "2":
          this.parseLayout2Data();
          break;
        case "3":
          this.parseLayout3Data();
          break;
        case "4":
          this.parseLayout4Data();
      }
    },
    //layout1(A型) data轉換
    parseLayout1Data() {
      let tempData = new Map();
      this.originData.forEach((v) => {
        const formattedData = this.formatedData(v);
        if (!tempData.has(v.auto_category_id_L)) {
          tempData.set(v.auto_category_id_L, {
            main: formattedData,
            mainSub: [],
            sub: [],
            allData: [formattedData],
          });
        } else {
          //已有該類別
          const category = tempData.get(v.auto_category_id_L);
          category.allData.push(formattedData);
          if (category.mainSub.length < 2) {
            category.mainSub.push(formattedData);
          } else {
            category.sub.push({
              ...formattedData,
            });
          }
        }
      });
      const groupData = this.dataFilter(tempData, 3, 9);
      this.layout1Data = groupData;
    },
    parseLayout2Data() {
      this.layout2Data = this.originData.map((v) => {
        return this.formatedData(v);
      });
    },
    //layout3(1帶6型) data轉換
    parseLayout3Data() {
      let tempData = new Map();
      this.originData.forEach((v) => {
        const formattedData = this.formatedData(v);
        if (!tempData.has(v.auto_category_id_L)) {
          tempData.set(v.auto_category_id_L, {
            main: formattedData,
            sub: [],
            allData: [formattedData],
          });
        } else {
          //已有該類別
          const category = tempData.get(v.auto_category_id_L);
          category.allData.push(formattedData);
          category.sub.push({
            ...formattedData,
          });
        }
      });
      const groupData = this.dataFilter(tempData, 6, 6);
      this.layout3Data = groupData;
    },
    //layout3(4帶3型) data轉換
    parseLayout4Data() {
      let tempData = new Map();
      this.originData.forEach((v) => {
        const formattedData = this.formatedData(v);
        if (!tempData.has(v.auto_category_id_L)) {
          tempData.set(v.auto_category_id_L, {
            catId: v.auto_category_id_L,
            catName: v.auto_category_id_L_c,
            main: [formattedData],
            sub: [],
            allData: [formattedData],
          });
        } else {
          //已有該類別
          const category = tempData.get(v.auto_category_id_L);
          category.allData.push(formattedData);
          if (category.main.length < 4) {
            category.main.push(formattedData);
          } else {
            category.sub.push({
              ...formattedData,
            });
          }
        }
      });
      const groupData = this.dataFilter(tempData, 3, 3);
      this.layout4Data = groupData;
    },
    formatedData(v) {
      return {
        cateId: v.auto_category_id_L,
        cateName: v.auto_category_id_L_c,
        name: v.name,
        pid: v.pid,
        image_url: v.image_url,
        price: this.formatPrice(v.promoPrice || v.price),
        priceSuffix: v.promoPrice && "(折扣後)",
        hasSub: true,
        campaignQty: v.campaignQty,
      };
    },
    //價格轉換
    formatPrice(price) {
      return price ? this.tools.priceFormat(price) : null;
    },
    //篩選條件(minSize: sub個數大於此數值才可添加指定layout陣列，不然一率丟到暢銷夯品)
    dataFilter(data, minSize, sizeLimit) {
      return Array.from(data.values()).reduce((a, v) => {
        if (v.sub.length >= minSize) {
          const calcSubRows = Math.min(
            Math.floor(v.sub.length / 3) * 3,
            sizeLimit
          );
          a.push({ ...v, sub: v.sub?.slice(0, calcSubRows) });
          this.scatteredData.push(...v.sub?.slice(calcSubRows)); //將分類中超出的商品丟到暢銷夯品
        } else {
          this.scatteredData.push(...v.allData); //不滿minSize的全丟到暢銷夯品
        }
        return a;
      }, []);
    },
  },
  components: {
    aiProductItem,
    pictureThreeBox,
    picture16Box,
    picture43Box,
  },
};
</script>

<style lang="scss">
@import "../../style/reset.module.scss";
@import "../../style/flex.module.scss";
@import "../../style/rwd.module.scss";
@import "../../style/icons.module.scss";
@import "../../style/global.module.scss";
</style>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.campaign {
  .campaignImg {
    width: 100%;
    object-fit: cover;
  }
  .productArea {
    .layout {
      padding: 10px;
      .title {
        font-size: 1.8rem;
        font-weight: bold;
        margin: 20px 0;
      }
      .scatteredArea {
        padding: 10px;
        &__title {
          font-size: 1.8rem;
          margin-bottom: 10px;
        }
      }
      &.layout1 {
        padding: 10px 0;
        .title {
          padding: 0 10px;
        }
        ul {
          li {
            margin-bottom: 20px;
          }
        }
      }
      &.layout3,
      &.layout4 {
        .scatteredArea {
          padding: 10px 0;
        }
      }
    }
  }
}
</style>
