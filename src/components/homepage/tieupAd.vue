<template>
  <div v-if="promotionData || imgData" class="tieupAd">
    <div v-if="promotionData" class="promotiontProd">
      <div class="head" v-if="promotionData.title">
        {{promotionData.title}}
      </div>
      <div class="adImg">
        <img src="../../images/employee_five_products.png" />
      </div>
      <div class="prdList">
        <aiProductItem v-if="promotionData && promotionData.prdList" :itemList="promotionData.prdList" :noWrap="true" />
      </div>
    </div>
    <div v-else-if="imgData" class="adImg">
      <a :href="imgData.url">
        <img :src="imgData.img" alt="">
      </a>
    </div>
  </div>
</template>

<script>
import aiProductItem from "../common/aiProductItem.vue";
export default {
  data() {
    return {
      imgData: null,
      promotionData: null,
    };
  },
  props: {
    //板塊代號
    blockNum: {
      type: Number,
    },
  },
  components: {
    aiProductItem,
  },
  async created() {
    const data = await this.getAdInfo();
    if (data) {
      let {
        materialType,
        curatingUrl,
        bannerImageUrl,
        bannerUrl,
        eventName,
        eventImageName,
      } = data;
      let pd;
      if (materialType === 1) {
        if (/^A/.test(curatingUrl)) {
          const kws = await this.getKeyWordByPromotionId(curatingUrl);
          pd = await this.getProductByKeyword(kws);
        } else {
          const pids = await this.getPidsByPromotionId(curatingUrl);
          // 取得5筆商品資料
          pd = await this.getSearchBatch(pids.slice(0, 5));
          // 取得5筆商品的折扣金額
          const discountData = await this.getProductDiscount(pids);
          // 合併商品價格 扣掉員工折金額
          pd =
            pd.map(({ img, name, price, pid }) => ({
              img,
              name,
              price: discountData[pid] ? price - discountData[pid] : price,
              pid,
            })) || [];
        }
        this.promotionData = {
          prdList: pd,
          title: eventName,
          img: eventImageName
            ? `${this.configs.imgJsonDomain}images/ai4/index_deploy/image/${eventImageName}`
            : "",
        };
      } else {
        const targetUrl = /^(A|B)/.test(bannerUrl)
          ? `/${this.siteData.urlSuffix}/aipromotion/${bannerUrl}`
          : bannerUrl;
        this.imgData = {
          img: `${this.configs.imgJsonDomain}images/ai4/index_deploy/image/${bannerImageUrl}`,
          url: targetUrl,
        };
      }
    }
  },
  methods: {
    async getAdInfo() {
      return await this.tools.getImgJsonData(
        `images/ai4/index_deploy/${this.siteData.siteId}/A${this.blockNum}/A${this.blockNum}.json`
      );
    },
    //取得策展主題keyword
    async getKeyWordByPromotionId(promotionId) {
      const data = await fetch(
        `${this.configs.frontApiPath()}ai/promotion/curate/${promotionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res && res.resultData) {
            return res.resultData.keyword;
          }
        })
        .catch((err) => {
          console.error(err);
        });
      return data;
    },
    //利用keyword取得策展所有product
    async getProductByKeyword(keyWord) {
      let postData = {
        q1_x: 1,
        supplier_y: 0,
        list_num: 5,
        type: 2,
      };

      postData.filter = { k: "0001", v: ["", "", "", keyWord] };
      const data = await this.api.ai.getAiData("getblist", postData);
      let d;
      if (data && data.pids && data.pids.length > 0) {
        const prdInfo = await this.tools.getPidsInfo(
          data.pids.map((v) => v.pid)
        );
        d = data.pids.map((e) => {
          return {
            ...e,
            img: e.image_url,
            ...prdInfo[e.pid],
          };
        });
      }
      return d;
    },
    //取得集合目錄資料
    async getPidsByPromotionId(promotionId) {
      const data = await fetch(
        `${this.configs.frontApiPath()}ai/promotion/gather/${promotionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res && res.resultData) {
            if (typeof res.resultData.value === "string") {
              return res.resultData.value.split(",");
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
      return data;
    },
    async getSearchBatch(pids) {
      if (pids && pids.length > 0) {
        let allpostData = pids.map((pid) => {
          return { pid, cid: 0 };
        });
        const data = this.axios({
          method: "POST",
          url: "api/product/search/batch",
          data: allpostData,
        }).then((res) => {
          const { data } = res;
          if (data && data.payload && data.payload.length > 0) {
            const dataArr = data.payload[0].products.map((e) => {
              return {
                img: e.image_url,
                name: e.name,
                price: e.price || null,
                pid: e.pid,
              };
            });
            return dataArr;
          }
        });
        return data;
      }
    },
    // 取得員工折金額
    async getProductDiscount(pids) {
      return await fetch(
        this.configs.frontApiPath() + "bWeb/product/discount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            param: {
              siteId: this.siteData.siteId,
              productIdList: pids,
              version: "v2",
            },
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          const obj = {};
          if (res.resultCode === 0 && res.resultData.length > 0) {
            res.resultData.forEach((v) => {
              obj[v.pid] = parseInt(v.discount);
            });
          }
          return obj;
        })
        .catch(() => {
          return {};
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.tieupAd {
  margin: 10px 0;
  .promotiontProd {
    .head {
      padding: 7px 15px;
      background-color: #e9e9e9;
      margin-bottom: 10px;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .prdList {
      width: 100%;
    }
  }
  .adImg {
    display: inline-block;
    width: 100%;
    a {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
    img {
      width: 100%;
      object-fit: cover;
    }
  }
}
</style>
