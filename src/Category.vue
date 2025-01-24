<template>
<div>
  <restrict v-if="isShowRestrict" v-on:passRestrictOkay="passRestrictOkay" />
  <downloadapp v-on:downloadAppOpened="downloadAppOpened" />
  <navigation
    :isShowRedTop="isShowRedTop"
    :windowY="windowY"
    v-on:stopBodyScroll="stopBodyScroll"
    v-on:directBestbuy="directBestbuy"
    :isDownloadAppOpened="isDownloadAppOpened" />
  <breadcrumb
    v-if="categoryIdReady"
    :sid="catalogParams.sid"
    :cid="catalogParams.cid"
    mid="1"
    v-on:getbreadcrumb="getbreadcrumb" />
  <catelogmenu
    v-if="categoryIdReady && catalogParams.sid !== '341' && page.subCategories.length > 0"
    :cid="parseInt(catalogParams.cid)"
    :items="page.subCategories"
    :level="parseInt(catalogParams.level)"
    :templateId="parseInt(catalogParams.tid)" />

  <banner
    v-if="page.banners.items.length > 0"
    :items="page.banners.items" />

  <bannerThree
    v-if="page.todaybest.items.length > 0"
    :title="page.todaybest.memo"
    :items="page.todaybest.items" />

  <bannerValue
    v-if="catalogParams.level === '1'"
    :catalogParams="catalogParams" />

  <bannerSquare
    v-if="page.selection.items.length > 0"
    :title="page.selection.memo"
    :items="page.selection.items" />

  <onsaleInfo
    v-if="onsaleDisplay"
    :title="onsaleTitle"
    :content="onsaleContent"
    :orderinfo="onsaleOrderInfo" />

  <div class="product-wrap">
    <controls
      v-on:controlsParams="controlsParams"
    />
    <div class="category-box__products">
      <productItem
        v-if="products.length"
        :isSingleAddToCart="false"
        :gaCategoryTitle="'小網目錄頁'"
        :fullInfoStyle="true"
        :isMenuPage="true"
        :showCart="showCart"
        :itemList="products"
        :mallId="parseInt(catalogParams.tid)" />
    </div>
  </div>
</div>
</template>

<script>
import downloadapp from "./components/common/downloadapp.vue"; // 頁面最上方的app下載提示
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import breadcrumb from "./components/product/breadcrumb.vue"; // 麵包屑
import catelogmenu from "./components/category/catelogmenu.vue"; // 目錄選單
import banner from "./components/category/banner.vue"; // 廣告Banner
import bannerThree from "./components/category/bannerThree.vue"; // 廣告Banner 3等份
import bannerValue from "./components/category/bannerValue.vue"; // 超值活動
import bannerSquare from "./components/category/bannerSquare.vue"; // 廣告Banner 正方大圖
import controls from "./components/category/controls.vue"; // 商品排序
import onsaleInfo from "./components/category/onsaleInfo.vue"; // cartA或促銷資訊
import productItem from "./components/common/productItem"; // 商品
import restrict from "./components/product/restrict.vue"; // 18禁提醒

export default {
  name: "Category",
  components: {
    downloadapp,
    navigation,
    breadcrumb,
    catelogmenu,
    banner,
    bannerThree,
    bannerValue,
    bannerSquare,
    onsaleInfo,
    controls,
    productItem,
    restrict
  },
  data() {
    return {
      blockMaxShowNum: 4,
      maxCategoryProductNum: 4,
      blockPage: 1,
      blockProductLen: 0,
      blockProducts: [],
      blockStickyProducts: [],
      blockTotalPage: 0,
      breadcrumbAry: [],
      catagoryOutlet: {}, // 品牌特賣匯專屬版位
      categoryIdReady: false, // for 品特sid=341的情境底下，要特別從目錄api換回正確的cid
      catalogParams: {
        // shop id
        cid: null,
        // category id
        level: null // category level
          ,
        // template id
        sid: null,
        tid: null
      },
      currentY: 0,
      dueToBottomGap: window.innerHeight / 2,
      hiddenDimensionMenu: false,
      isAtBottom: false,
      isDownloadAppOpened: false,
      isShowAllBlocks: false,
      isShowRedTop: true,
      isStopScrolling: false,
      nextPage: false,
      onsaleTitle: '',
      onsaleContent: '',
      onsaleOrderInfo: '',
      onsaleDisplay: false,
      page: {
        banners: {
          items: []
        },
        selection: {
          items: []
        },
        todaybest: {
          items: []
        },
        subCategories: []
      },
      prodParams: {
        cid: null,
        complexDiscount: 0,
        imgType: 3,
        level: null,
        mid: null,
        orderBy: 'md',
        page: 1,
        sid: null,
        sorting: 'RELEVANT'
      },
      products: [],
      showCart: true,
      showOnLighthouse: true,
      urlIncludePid: null,
      urlObj: {},
      windowY: 0,
      isShowRestrict: false
    };
  },
  mounted() {},
  created() {
    // save all product api data
    window.productsPool = {}

    // for localhost dev
    this.urlObj = this.tools.urlSearchToObj()
    if (/category\.html/i.test(location.pathname)) {
      this.catalogParams = Object.assign(this.catalogParams, this.urlObj)
    } else {
      const pathAry = location.pathname.replace(/\/mobileweb\//i, '').split('/')
      this.catalogParams.tid = pathAry[0]
      this.catalogParams.sid = pathAry[1]
      this.catalogParams.level = pathAry[2]
      this.catalogParams.cid = pathAry[3]
    }

    // 愛買sid699階層特別處理 level皆降1
    if (this.catalogParams.sid === '699') {
      const num = parseInt(this.catalogParams.level) - 1
      this.catalogParams.level = num.toString()
    }
    // 樣版tid若為4 level皆升1
    // **品牌旗鑑館特殊判斷要特別排除 sid === cid , tid = 4 為品鑑特有pattern
    if (this.catalogParams.tid === '4' && this.catalogParams.level !== '1') {
      const num = parseInt(this.catalogParams.level) + 1
      this.catalogParams.level = num.toString()
    }

    this.prodParams.sid = this.catalogParams.sid
    this.prodParams.cid = this.catalogParams.cid
    this.prodParams.mid = this.catalogParams.tid
    this.prodParams.level = this.catalogParams.level

    // 取得特殊目錄類型
    this.getCategoryDetail()
  },
  watch: {
    isAtBottom(newValue) {
      if (newValue && this.blockTotalPage > 0) {
        if (this.blockPage <= this.blockTotalPage) {
          this.parseBlockProduct()
        } else {
          this.getCategoryProducts();
        }
      }
    },
    "prodParams.sorting": {
      handler: function (newValue) {
        this.blockPage = 1
        switch (newValue) {
          case 'PRICE_LOW':
            this.blockProducts = this.blockProducts.sort((a, b) => a.saleDesc > b.saleDesc ? 1 : -1)
            break;
          case 'PRICE_HIGH':
            this.blockProducts = this.blockProducts.sort((a, b) => a.saleDesc < b.saleDesc ? 1 : -1)
            break;
          default:
            this.blockProducts = this.blockStickyProducts
        }
        this.parseBlockProduct()
      },
      immediate: true
    }
  },
  computed: {

  },
  methods: {
    initCategoryAPIs() {
      // 網址帶pid 取該pid商品資料當作第一品
      this.getFirstProduct()

      // 取得下拉分類清單
      this.getCategorySubMenu()

      // 取得版面廣告
      this.getPageALL()

      /** !important 中小目錄api不同於大中目錄，page初始值重設定為0 */
      if (['2'].indexOf(this.catalogParams.level) > -1) this.prodParams.page = 0

      // 大目錄有入稿商品資訊, 先執行入稿商品後取目錄商品
      // 中小直接取目錄商品
      // if (this.catalogParams.level === '1') {
      //   this.getBlocksPage()
      // } else {
      //   this.getCategoryProducts()
      // }
      this.getCategoryProducts()

      window.addEventListener(
        "scroll",
        () => {
          const wy = window.scrollY;
          this.windowY = wy;
          this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
          this.isShowRedTop = wy > 0 ? false : true;
          this.checkIsAtBottom()
        }, {
          passive: true,
        }
      );
    },
    getFirstProduct() {
      if (this.urlObj.pid) {
        this.urlIncludePid = parseInt(this.urlObj.pid)
        this.urlIncludeCid = parseInt(this.catalogParams.cid)
        this.products.push({
          pid: this.urlIncludePid
        })

        this.getProductsDetail([{
          pid: this.urlIncludePid,
          cid: this.urlIncludeCid
        }])
      }
    },
    checkIsAtBottom() {
      const wy = window.scrollY
      if (
        window.innerHeight + wy + this.dueToBottomGap >=
        document.body.scrollHeight
      ) {
        this.isAtBottom = true;
      } else {
        this.isAtBottom = false;
      }
    },
    parseBlockProduct() {
      if (this.blockProducts.length > 0) {
        this.products = this.products.concat(this.blockProducts.slice((this.blockPage - 1) * this.blockMaxShowNum, this.blockPage * this.blockMaxShowNum))
        let pool = this.blockProducts.slice((this.blockPage - 1) * this.blockMaxShowNum, this.blockPage * this.blockMaxShowNum)
        this.getProductsDetail(this.getProductsDetailParams(pool))
        this.blockPage++
      }
    },
    controlsParams(key) {
      const orderByMap = {
        'NEW_ARRIVAL': 'md',
        'PRICE_LOW': 'pu',
        'PRICE_HIGH': 'pd'
      }
      if (this.prodParams.sorting !== key) {
        this.blockProductLen = 0
        this.blockProducts = []
        this.products = []
        this.blockStickyProducts = []
        this.blockTotalPage = 0

        this.prodParams.sorting = key
        this.prodParams.orderBy = orderByMap[key]
        this.prodParams.page = 1
        this.getCategoryProducts()
      }
    },
    // 取得麵包屑資訊
    getbreadcrumb(data) {
      this.breadcrumbAry = data
      this.setSEOInfo()

      if (data && data.length > 0) {
        this.onsaleTitle = data[data.length - 1].name
      }
    },
    // 取得目錄類型
    getCategoryDetail() {
      const api = `api/category/detail?sid=${this.catalogParams.sid}&cid=${this.catalogParams.cid}&format=pretty`

      this.axios.get(api).then(res => {
        const data = res.data;
        if (data.status === 1 && data.data.length > 0) {
          const details = data.data[0].detail

          // check 18 restrict
          const passRestrict = this.tools.getCookie("r18");
          if (details.restricted && !passRestrict) {
            this.isShowRestrict = true
          }

          /**
           * 品特sid=341特殊處理
           */
          if (this.catalogParams.sid === '341') {
            this.catagoryOutlet = data.data[0].outletDetail
            this.catalogParams.cid = details.id.toString()
            this.prodParams.cid = this.catalogParams.cid
          }

          // 取得頁面其他資訊
          this.categoryIdReady = true
          this.initCategoryAPIs()

          // 促銷目錄促銷訊息
          if (details.categoryRuleInfo && details.categoryRuleInfo.ruleList) {
            details.categoryRuleInfo.ruleList.forEach(v => {
              this.onsaleContent += v + '<br>'
            })
          } else if (details.rule) {
            this.onsaleContent = details.rule.message
          }
          if (details.cat_pre_order_info && details.cat_pre_order_info.message) {
            this.onsaleOrderInfo = details.cat_pre_order_info.message
          }
        } else {
          location.href = '/mobileweb/productNotFound'
        }
      });
    },
    // 取得版面Banner資料
    getPageALL() {
      const sid = this.catalogParams.sid === '0' ? '1' : this.catalogParams.sid // 修正api當為0時會異常
      const level = this.catalogParams.sid === '699' ? parseInt(this.catalogParams.level) + 1 : this.catalogParams.level
      const api = `api/page/${this.catalogParams.tid}/${sid}/${level}/${this.catalogParams.cid}/all`

      this.axios.get(api).then(res => {
        const data = res.data;
        if (data.code === 1 && data.payload.length > 0) {
          const payload = data.payload[0].blocks
          payload.forEach(item => {
            // Banner
            if (item.kind === 4) {
              this.page.banners = item
            }
            // TodayBest本日強打
            if (item.kind === 64) {
              this.page.todaybest = item
            }
            // Selection精選活動
            if ([128, 256].indexOf(item.kind) > -1) {
              this.page.selection = item
            }
          })
        }
      });
    },
    setSEOInfo() {
      const level = parseInt(this.catalogParams.level)
      const submenu = this.page.subCategories ? this.page.subCategories.reduce((p, c) => {
        return p.concat(c.itemName)
      }, []) : []
      let firstLevelName = this.breadcrumbAry[level] ? this.breadcrumbAry[level].name : ''
      let nextLevelData = submenu.length > 0 ? submenu.join(',') : ''

      if (level === 3 && this.catalogParams.sid === '341') firstLevelName = this.breadcrumbAry[0].name
      if (level === 3 && this.catalogParams.sid !== '341' && this.breadcrumbAry.length > 2) nextLevelData = this.breadcrumbAry[level - 1].name
      this.seo.category(level, firstLevelName, nextLevelData)
    },
    // 取得目錄分類清單
    getCategorySubMenu() {
      const api = ['1', '2'].indexOf(this.catalogParams.level) > -1 ?
        `catalog/categories/${this.catalogParams.cid}?sid=${this.catalogParams.sid}&mid=${this.catalogParams.tid}&level=${this.catalogParams.level}` :
        `catalog/categories/siblings/${this.catalogParams.cid}`

      this.axios.get(api).then(res => {
        const data = res.data;
        if (data.response.status === 'OK') {
          this.page.subCategories = data.payload.categories.map(v => {
            return {
              itemName: v.name,
              sid: this.catalogParams.sid,
              cid: v.cid,
              url: v.url
            }
          })
        }
      });
    },
    // 取得目錄商品資訊
    getCategoryProducts() {
      const api = ['1', '2'].indexOf(this.catalogParams.level) > -1 ?
        `page/${this.prodParams.cid}/products` :
        `catalog/categories/${this.prodParams.cid}/products?cid=${this.prodParams.cid}`
      let apiParams = {
        page: this.prodParams.page,
        sid: this.prodParams.sid,
        mid: this.prodParams.mid,
        level: this.prodParams.level,
        num: this.maxCategoryProductNum
      }
      if (this.catalogParams.level === '3') {
        apiParams = Object.assign(apiParams, {
          complexDiscount: this.prodParams.complexDiscount,
          imgType: this.prodParams.imgType,
          orderBy: this.prodParams.orderBy
        })
      }

      this.axios.get(api, {
        params: apiParams,
      }).then(res => {
        const data = res.data;
        if (data.response.status === 'OK') {
          // 若無資料轉至補貨中訊息頁
          if (this.prodParams.page <= 1) {
            if (['3', '4'].indexOf(this.catalogParams.level) > -1 && data.payload.bottomCategoryProducts.length === 0) {
              location.href = '/mobileweb/productNotFound?categoryName=' + encodeURIComponent(this.breadcrumbAry[this.breadcrumbAry.length - 1].name)
              return
            }
          }

          let items = []
          if (['1', '2'].indexOf(this.catalogParams.level) > -1) {
            items = this.reformatProducts(data.payload.prds)
          } else {
            items = this.reformatBottomProducts(data.payload.bottomCategoryProducts)
            delete data.payload.bottomCategoryProducts
          }

          // 若目錄網址被帶入pid，則一開始就會以該pid取資料並帶到列表第一品，這邊取回的資料當中需過濾以免重覆顯示
          if (this.urlIncludePid) {
            items = items.filter(v => v.pid !== this.urlIncludePid ? v : null)
          }

          this.blockProductLen = this.blockProducts.length + items.length
          this.blockTotalPage = Math.ceil(this.blockProductLen / this.blockMaxShowNum)
          this.blockProducts = this.blockProducts.concat(items)
          this.blockStickyProducts = this.blockStickyProducts.concat(items)
          this.parseBlockProduct()
          this.prodParams.page++;
        }
      }).catch(() => {
        this.nextPage = false;
      })
    },
    // 取得入稿商品資訊
    getBlocksPage() {
      let blockCode = 'MB7'

      // 品牌旗鑑館
      if (this.catalogParams.sid === this.catalogParams.cid && this.catalogParams.tid === '4' && this.catalogParams.level === '1') {
        blockCode = 'MF7'
      }

      this.axios.get(`page?blocks=${blockCode}&cid=${this.catalogParams.cid}&sid=${this.catalogParams.sid}`).then(res => {
        const data = res.data;
        if (data.response.status === 'OK') {

          // 若有入稿商品，則先行顯示入稿商品
          if (data.payload.prds.length > 0) {
            this.blockProductLen = data.payload.prds.length
            this.blockTotalPage = Math.ceil(this.blockProductLen / this.blockMaxShowNum)
            this.blockProducts = this.reformatProducts(data.payload.prds)
            this.blockStickyProducts = this.blockProducts.slice(0) // 保有原排序，以免做價格排序時無法還原

            this.parseBlockProduct()
          } else {
            this.isShowAllBlocks = true
            this.getCategoryProducts()
          }
        }
      });
    },
    reformatProducts(data) {
      return data.map(i => {
        const linkParse = i.link.match(/cid=(\d+)&?/i)
        const cid = linkParse && linkParse[1] ? parseInt(linkParse[1]) : i.cid
        return {
          pid: i.pid,
          cid: cid,
          combined: i.combined ? i.combined : false,
          url: i.link,
          img: i.img,
          name: i.name,
          pricePrefix: "",
          price: parseInt(i.displaying),
          priceSuffix: "",
          tags: i.tags ? i.tags : [],
          restricted: false,
          promotion: i.label ? i.label : '',
          productStatus: i.productStatus ? i.productStatus : [{
            id: 0,
            name: '直接購買'
          }],
          fullInfoStyle: true,
          soldout: i.soldout ? i.soldout : false,
          payMethodList: i.payMethodList ? i.payMethodList : ['CASH']
        };
      })
    },
    reformatBottomProducts(data) {
      const cid = parseInt(this.catalogParams.cid)
      let products = data.map(i => {
        const lifeProduct = i.lifeProduct ? {
          lifePartialPoint: i.lifePartialPoint,
          lifePartialPrice: i.lifePartialPrice,
          lifeExchangePoint: i.lifeExchangePoint
        } : null
        return {
          sid: i.sid,
          pid: i.productId,
          cid: i.cid ? i.cid : cid,
          combined: i.combined ? i.combined : false,
          url: i.url,
          img: this.configs.checkImgSrc(i.img),
          name: i.productName,
          pricePrefix: "",
          price: this.tools.displayProductPrice(i),
          priceSuffix: "",
          tags: i.tags ? i.tags : [],
          restricted: false,
          promotion: i.productNameLabel ? i.productNameLabel : '',
          productStatus: i.productStatus ? i.productStatus : [{
            id: 0,
            name: '直接購買'
          }],
          fullInfoStyle: true,
          soldout: i.soldout ? i.soldout : false,
          rewardPointInfo: lifeProduct,
          lifeProduct: i.lifeProduct ? i.lifeProduct : false
        };
      })

      return products
    },
    // 取得商品集合資訊
    getProductsDetail(pool) {
      if (pool.length > 0) {
        this.axios
          .post(`api/product/search/batch`, JSON.stringify(pool), {
            headers: {
              apiversion: '4'
            }
          })
          .then((res) => {
            const data = res.data
            if (data.code === 1 && data?.payload[0]?.products) {
              data?.payload[0]?.products.forEach(items => {
                this.mergeProductsDetail(items)
                window.productsPool[items.pid] = items
              })
            }
          });
      }
    },
    // 取得商品集合API所需資訊
    getProductsDetailParams(data) {
      return data.map(v => {
        return {
          pid: v.pid,
          cid: v.cid
        }
      })
    },
    // 合併商品集合資訊
    mergeProductsDetail(data) {
      // array to object with key
      const obj = {}
      if (typeof data === 'object') data = [data]
      data.forEach(v => {
        obj[v.pid] = v
      })
      this.products = this.products.map(v => {
        let n = {}
        if (obj[v.pid]) {
          const o = obj[v.pid]
          n = {
            cart_type: o.cart_type,
            cid: o.cid,
            combined: o.combined,
            fullInfoStyle: true,
            gift: o.gift ? o.gift : null,
            img: o.image_url,
            lifeProduct: o.rewardPointInfo && (o.rewardPointInfo.lifePartialPoint || o.rewardPointInfo.lifeExchangePoint) ? true : false,
            name: o.name,
            pid: o.pid,
            promo_price: o.promo_price,
            price: this.tools.displayProductPrice(o),
            pricePrefix: '',
            priceSuffix: '',
            productStatus: [o.productStatus],
            payMethodList: o.payMethodList,
            promotion: o.promotion,
            purchaseLimitInfo: o.purchaseLimitInfo,
            restricted: o.restricted,
            rewardPointInfo: o.rewardPointInfo,
            sid: o.sid,
            soldout: o.soldout,
            tags: o.tags,
            url: `/mobileweb/product?pid=${o.pid}&cid=${o.cid}&sid=${o.sid}&mid=1`
          }
        }
        return Object.assign(v, n)
      })
    },
    downloadAppOpened() {
      this.isDownloadAppOpened = !this.isDownloadAppOpened;
    },
    stopBodyScroll(action, jumpCurrentY = true) {
      const body = document.body;
      if (!this.isStopScrolling) {
        body.style = "padding:0;margin:0;overflow:hidden;height:100%";
        this.isStopScrolling = !this.isStopScrolling;
      }
      if (action === "close") {
        body.style = "padding:0;margin:0;";
        if (jumpCurrentY) {
          setTimeout(() => {
            window.scrollTo(0, this.currentY);
          }, 0);
        }
        this.isStopScrolling = false;
      }
    },
    directBestbuy() {
      this.directJumpToBestBuy = true;
      setTimeout(() => {
        this.directJumpToBestBuy = false;
      }, 100);
    },
    passRestrictOkay() {
      this.isShowRestrict = false
    }
  },
}
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
</style>

<style lang="scss" scoped>
.product-wrap {
  padding: 0;
  margin: 0;
  background-color: #f4f4f4;
}
.category-box__products {
  padding: 0 20px 20px;
}
</style>
