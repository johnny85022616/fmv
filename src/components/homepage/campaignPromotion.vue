<template>
  <section v-if="couponData && couponData.length > 0" class="campaign_promotion">
    <section :class="['head', {bsite: isBsite}]">
      <p><i></i>折價券</p>
      <a href="#" @click.prevent="goAllCampaign">領更多》</a>
    </section>
    <section class="coupon">
      <div class="coupon__container">
        <carousel class="custom-carousel" :autoplay="true" :loop="true" :autoplayTimeout="5000" :perPage="1" :paginationEnabled="false">
          <slide class="coupon__item" v-for="(c, index) of couponData" :key="index">
            <a :href="urlSuffixPath + c.campaignUrl">
              <div class="coupon_left">
                <div class="coupon__item-content">
                  <p>{{ c.campaignName }}</p>
                </div>
                <div class="coupon__item-price" v-html="c.title"></div>
                <div class="coupon__item-rules">
                  <font class="coupon__item-rules-lookall">看全部商品</font>
                  <font>{{ c.campaignEndTime }}</font>
                </div>
              </div>
              <div class="coupon_right">
                去逛逛
              </div>
            </a>
          </slide>
        </carousel>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  name: "campignPromotion",
  data() {
    return {
      isBsite: false,
      couponData: null, // 折價券資料
      urlSuffixPath: "", // B網前綴
    };
  },
  created() {
    if (this.siteData) {
      this.isBsite = true;
      this.urlSuffixPath = "/" + this.siteData.urlSuffix;
    }

    // 取得優惠券清單
    this.getEventCampaigns();
  },
  methods: {
    goAllCampaign() {
      window.location.href = this.siteData
        ? `/${this.siteData.urlSuffix}/campaignlist`
        : "/campaignlist";
    },
    // 取得coupon資料
    async getEventCampaigns() {
      // 若快取中有資料就不需要打api 直接取資料
      if (window.sessionStorage.getItem("campaignData")) {
        this.couponData = JSON.parse(
          window.sessionStorage.getItem("campaignData")
        );
        return;
      }
      await this.api.campaign.getEventCampaign().then((res) => {
        this.couponData = res ? res : null;
        // 將資料寫入快取
        window.sessionStorage.setItem(
          "campaignData",
          JSON.stringify(this.couponData)
        );
      });
    },
  },
};
</script>

<style lang="scss">
@import "../../style/color";
@import "../../style/icons.module.scss";

.campaign_promotion {
  margin: 15px 0;
  overflow: hidden;
  background: rgb(255 247 241);
  border-radius: 10px;
  .head {
    padding: 8px 20px 8px 5px;
    background-image: linear-gradient(86deg, #ffc268 0%, #feecd9 97%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.bsite {
      padding: 8px 20px 8px;
      background-image: unset;
      background-color: $bean-red;
      p {
        color: $white;
      }
      i {
        display: none;
      }
    }
    p {
      color: $white;
      font-size: 1.7rem;
      display: flex;
      align-items: center;
      i {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin: 0 10px 0 10px;
        background-image: url(https://event.shopping.friday.tw/event/homepage/images/index-icons/friDay.svg);
        background-size: 20px;
      }
    }
    a {
      align-items: center;
      background: $white;
      border-radius: 999rem;
      border: 1px solid $scorpion;
      color: $scorpion;
      display: flex;
      font-size: 1.3rem;
      padding: 2px 0 2px 8px;
      text-decoration: none;
      i {
        filter: brightness(0.5);
        margin-left: 3px;
      }
    }
  }
  .coupon {
    &__container {
      width: 100%;
      height: 100%;
    }

    a {
      text-decoration: none;
      color: unset;
      display: flex;
      width: calc(100vw - 25px);
      height: 145px;
    }

    &_left {
      flex: 1 1 80%;
      padding-top: 20px;
    }
    &_right {
      align-items: center;
      color: $yellow;
      display: flex;
      flex: 1 1 20%;
      font-size: 1.5rem;
      justify-content: center;
      letter-spacing: 1.1rem;
      text-align: center;
      writing-mode: vertical-lr;
    }

    &__item {
      width: 100%;
      background: no-repeat url("../../images/coupon_red2.png") center/99%;

      &-price {
        align-items: center;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
        color: $red;
        font {
          font-size: 4rem;
          margin: 0 5px;
        }
      }
      &-rules {
        display: flex;
        justify-content: space-between;
        padding: 0 15px;
        font-size: 1.2rem;
        &-lookall {
          text-decoration: underline;
          color: $blue;
        }
        font {
          &:first-child {
            color: $blue;
          }
          &:last-child {
            color: $red;
          }
        }
      }
      &-content {
        text-align: center;
        color: $web_main;
        margin-bottom: 10px;
        p {
          font-size: 1.5rem;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
