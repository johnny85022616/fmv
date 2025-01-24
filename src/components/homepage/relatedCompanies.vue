<template>
  <div class="relatedCompanies">
    <ul class="relatedCompaniesList">
      <li v-for="(item,idx) in relatedCompaniesList" :key="idx" :style="{backgroundColor:item.headerColor}">
        <a :href="item.link">
          <img :src="item.logoMobile" alt="">
          <p>{{item.siteName}}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "relatedCompanies",
  data() {
    return {
      relatedCompaniesList: [
        {
          siteId: "BW067863",
          siteName: "愛買線上購",
          logoMobile:
            "https://event.shopping.friday.tw/event/homepage/logo/amart_logo_w.png",
          headerColor: "#d50039",
          urlSuffix: "BW067863",
          link: "/shop/BW067863",
        },
        {
          siteId: "BW811102",
          siteName: "遠東百貨",
          logoMobile:
            "https://event.shopping.friday.tw/event/homepage/logo/feds_logo.png",
          headerColor: "#f1edea",
          urlSuffix: "aifeds",
          link: "/shop/aifeds",
        },
        {
          siteId: "BW043495",
          siteName: "遠東SOGO百貨",
          logoMobile:
            "https://event.shopping.friday.tw/event/homepage/logo/sogo_logo_w.png",
          headerColor: "#e31e27",
          urlSuffix: "aisogo",
          link: "/shop/aisogo",
        },
        {
          siteId: "BW710878",
          siteName: "citysuper",
          logoMobile:
            "https://event.shopping.friday.tw/event/homepage/logo/citysuper_logo_all.png",
          headerColor: "#187831",
          urlSuffix: "aicitysuper",
          link: "/shop/aicitysuper",
        },
        {
          siteId: "BW976288",
          siteName: "超商取貨",
          logoMobile:
            "https://event.shopping.friday.tw/event/homepage/logo/imarket_logo.png",
          headerColor: "#f1edea",
          urlSuffix: "imarket",
          link: "/shop/imarket",
        },
        {
          siteId: "BW994783",
          siteName: "花蓮小農",
          logoMobile:
            "https://event.shopping.friday.tw/event/homepage/logo/hulian_logo.png",
          headerColor: "#f1edea",
          urlSuffix: "hulian",
          link: "/shop/hulian",
        },
        {
          siteId: "BW180662",
          siteName: "屈臣氏",
          logoMobile:
            "https://event.shopping.friday.tw/event/homepage/logo/watsons_logo.png",
          headerColor: "#f1edea",
          urlSuffix: "watsons",
          link: "/shop/watsons",
        },
        {
          siteId: "BW668862",
          siteName: "快速到貨",
          logoMobile:
            "https://event.shopping.friday.tw/event/homepage/logo/famarket_logo.png",
          headerColor: "#f1edea",
          urlSuffix: "famarket",
          link: "/shop/famarket",
        },
        {
          siteId: "BW264188",
          siteName: "APPLE",
          logoMobile:
            "https://event.shopping.friday.tw/event/homepage/logo/apple_logo.png",
          headerColor: "#f1edea",
          urlSuffix: "apple",
          link: "/shop/apple",
        },
        {
          siteId: "BW808627",
          siteName: "小米旗艦館",
          logoMobile:
            "https://event.shopping.friday.tw/event/homepage/logo/mi_logo.png",
          headerColor: "#f1edea",
          urlSuffix: "mi",
          link: "/shop/mi",
        },
      ],
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "../../style/color";
@import "../../style/icons.module.scss";
.relatedCompanies {
  margin: 20px 0;
  ul {
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
    li {
      display: inline-block;
      margin-right: 5px;
      border: 1px solid $alto;
      border-radius: 10px;
      width: 110px;
      flex-shrink: 0;
      text-align: center;
      box-sizing: border-box;
      a {
        text-decoration: none;
        img {
          width: 90px;
          height: 90px;
          object-fit: contain;
          margin-top: 10px;
        }
        p {
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.04),
            rgba(0, 0, 0, 0.6)
          );
          color: $white;
          font-size: 16px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          box-sizing: border-box;
          line-height: 33px;
        }
      }
    }
  }
}
</style>
