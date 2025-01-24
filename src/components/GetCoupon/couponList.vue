<template>
  <div class="conponList">
    <ul>
      <li v-for="item,idx in conponList" :key="idx" :class="['apricotWhite',{yellow: item.discountCode}]">
        <div class="couponlist__top">
          <p>{{ item.campaignName }}</p>
          <div>
            <p v-if="item.digitalType === 'd16'" class="storeIcon">超取</p>
          </div>
        </div>
        <div class="couponlist__bottom">
          <div class="left">
            <p v-html="item.title"></p>
            <p v-if="page === 'myCampaign' && item.discountCode" class="discountCodeText leftBottomText">折扣碼 {{ item.discountCode }}</p>
            <p v-if="item.isAdditionalDiscount" class="reDiscount leftBottomText" :href="item.campaignUrl">可與其他優惠併用</p>
          </div>
          <div class="middle">
            <p v-if="item.rule">{{item.rule}}</p>
            <p v-if="item.listCampaignEndTime" class="gray">{{item.listCampaignEndTime}}</p>
          </div>
          <div class="right">
            <a v-if="page==='myCampaign'" :href="item.campaignUrl">去逛逛</a>
            <template v-else>
              <a v-if="item.isGeted" :href="item.campaignUrl">去逛逛</a>
              <a v-else href="" @click="(e)=>drawCoupon(e, item.campaignId , item.childCampaignInfo?.campaignId, item.discountCode)">領取</a>
            </template>
          </div>
        </div>
        <div v-if="item.childCampaignInfo" class="d9Discount">
          <div class="flower">
            <p class="d9Title" v-html="item.childCampaignInfo.title"></p>
          </div>
          <p class="d9Content">{{item.childCampaignInfo.rule}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "conponList",
  data() {
    return {};
  },
  methods: {
    //領折價券頁按領取
    drawCoupon(e, campaignId, childCampaignId, discountCode) {
      console.log(campaignId, childCampaignId);
      e.preventDefault();
      this.$emit("drawCoupon", campaignId, childCampaignId, discountCode);
    },
  },
  props: {
    conponList: {
      type: Array,
    },
    page: {
      type: String,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../style/color";
@import "../../style/tailwind.module.scss";

.conponList {
  ul {
    list-style-type: none;
    li {
      padding: 10px;
      border: 1px solid $sliver;
      border-radius: 5px;
      margin-bottom: 20px;
      min-height: 120px;
      box-sizing: border-box;
      // background: no-repeat
      //   url("https://ec-m.shopping.friday.tw/public/m/images/icons/Coupon02_L.png")
      //   center;
      .couponlist__top {
        font-size: 1.6rem;
        border-bottom: 1px dashed $special;
        padding-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .storeIcon {
          background-color: $olivine;
          color: $white;
          border-radius: 5px;
          padding: 2px 10px;
          font-size: 1.3rem;
        }
        font-weight: bold;
      }
      .couponlist__bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding-top: 8px;
      }
      &.yellow {
        background-color: $varden;
      }
      .left {
        position: relative;
        width: 54%;
        font-size: 1.5rem;
        text-align: center;
        p {
          &:first-of-type {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.5rem;
            &::v-deep {
              font {
                color: $red;
                font-size: 3.5rem;
                font-weight: 900;
              }
            }
          }
        }
        .leftBottomText {
          font-size: 1.1rem;
          position: absolute;
          bottom: -5px;
        }
        .reDiscount {
          color: $sundown1;
        }
        .discountCodeText {
          color: $sliver;
        }
        .range {
          color: $dodger-blue;
          font-size: 1.2rem;
          position: absolute;
          left: 15px;
          bottom: -5px;
        }
      }
      .middle {
        width: 30%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: center;
        p {
          font-size: 1.3rem;
        }
      }
      .right {
        width: 14%;
        text-align: center;
        a {
          color: $dodger-blue;
          font-size: 1.4rem;
        }
      }
    }
  }
}
.d9Discount {
  display: flex;
  align-items: center;
  color: $tundora;
  margin-top: 10px;
  .flower {
    min-width: 45%;
    max-width: 50%;
    min-height: 45px;
    background-image: url("../../images/icons/flowerCampaignPage.svg");
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    box-sizing: border-box;
    .d9Title {
      font-size: 1.5rem;
      font-weight: bold;
      ::v-deep {
        font {
          color: $red;
        }
      }
    }
  }
  .d9Content {
    font-size: 1.3rem;
  }
}
.gray {
  color: $sliver;
}
.apricotWhite {
  background-color: $apricot-white;
}
</style>