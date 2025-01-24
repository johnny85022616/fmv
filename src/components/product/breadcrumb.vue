<template>
  <div v-if="isShow" class="topnav">
    <ul>
      <li v-for="(item, index) of items" :key="index">
        <a
          v-if="item.cart"
          :href="item.url"
          :class="{ last: item.url === null }"
          >{{ item.name }}</a
        >
        <font v-else>{{ item.name }}</font>
        <span v-if="index < items.length - 1">
          <i class="arrow"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "breadcrumb",
  data() {
    return {
      isShow: false,
      items: [],
      newsid: this.sid,
    };
  },
  props: {
    sid: {},
    cid: {},
    mid: {
      default: () => 1
    },
    data: {
      type: Array
    }
  },
  watch: {
    data(val) {
      if (val && val.length > 0) {
        this.items = val.map(v => {
          return Object.assign(v, {cart: v.url ? true: false})
        })
        this.isShow = true;
      }
    }
  },
  created() {
    if (this.configs.hiddenCommonHeader.test(location.search)) {
      this.isShow = false
    }

    if (this.sid !== undefined && this.cid !== undefined) {
      this.init();
    }
  },
  methods: {
    init() {
      this.axios
        .get(`catalog/categories/parents/${this.cid}?sid=${this.newsid}&mid=${this.mid}`)
        .then((res) => {
          const data = res.data;
          if (data.response.status === "OK") {
            this.datastatus = true;
            const payload = data.payload;
            this.$emit("getCatalogLevel", data.payload.categories.length);

            // 品牌館
            if (payload.classifyBrandStore) {
              this.items.push({
                name: payload.classifyBrandStore.name,
                url: payload.classifyBrandStore.url,
                cart: payload.classifyBrandStore.url ? true : false,
              });
            }

            // 品牌
            if (payload.classifyBrandCategory) {
              this.items.push({
                name: payload.classifyBrandCategory.name,
                url: payload.classifyBrandCategory.url,
                cart: payload.classifyBrandCategory ? true : false,
              });
            }

            // 館
            if (payload.store) {
              this.items.push({
                name: payload.store.name,
                url: payload.store.url,
                cart: true,
              });
            }

            // 目錄
            let categories = [];
            //<a class="bread-a-Link" href="//m.shopping.friday.tw/mobileweb/4/875/3/416422?cidpath=416432,416444,416422" title="米家電動打氣機">米家電動打氣機  </a>
            if (payload.categories && payload.categories.length > 0) {
              payload.categories.forEach((v, i) => {
                let url = v.url
                  ? v.url.match(/tw([\w\\/]+)$/i)[1]
                  : `/mobileweb/${this.mid}/${this.sid}/${i + 1}/${v.cid}`;
                categories.push({
                  name: v.name,
                  url: url,
                  cart: v.cart ? false : true,
                });
              });
              // 品牌特賣匯麵包屑特殊處理 僅呈現大目錄 且無法點擊
              if (this.sid === "341") {
                this.items = this.items.concat(
                  categories.slice(categories.length - 1).reverse()
                );
              } else {
                this.items = this.items.concat(categories.reverse());
              }
            }

            this.items = this.items.map((v, i, a) => {
              if (i === a.length - 1) {
                v.url = null;
              }
              return v;
            });

            this.seo.breadcrumb(this.items)

            // 品牌特賣匯麵包屑特殊處理 僅呈現大目錄 且無法點擊
            if (this.sid === "341") {
              this.$emit("getbreadcrumb", categories.slice(0, 1));
            } else {
              this.$emit("getbreadcrumb", this.items);
            }
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.topnav {
  display: block;
  padding: 10px 20px;
  min-height: 20px;
  background-color: #f4f4f4;

  li {
    display: inline;
    list-style-type: none;
    color: #adadad;
  }

  a {
    font-size: 1.3rem;
    color: #adadad;
    text-decoration: none;

    &.last {
      color: #3c3c3c;
    }
  }

  font {
    font-size: 1.3rem;
    color: #3c3c3c;
  }

  span {
    padding: 0 2px;
    text-align: center;
    vertical-align: middle;
  }

  i.arrow {
    display: inline-block;
    width: 12px;
    height: 12px;
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNMy45MTkgMS4yYS4zMTQuMzE0IDAgMCAwLS4yMjUuMDk0LjMxMi4zMTIgMCAwIDAtLjA5NC4yM2MwIC4wOS4wMzEuMTY3LjA5NC4yM2w0LjI3NSA0LjI3NC00LjIxOSA0LjIxOWEuMzA3LjMwNyAwIDAgMC0uMDk0LjIyNWMwIC4wODcuMDMyLjE2Mi4wOTQuMjI1LjA2My4wNjIuMTQuMDk0LjIzLjA5NHMuMTY3LS4wMzIuMjMtLjA5NGw0LjQ0My00LjQ0NGEuMzA3LjMwNyAwIDAgMCAuMDk0LS4yMjUuMzA3LjMwNyAwIDAgMC0uMDk0LS4yMjVsLTQuNTEtNC41MWEuMzI2LjMyNiAwIDAgMC0uMjI1LS4wOTR6IiBmaWxsPSIjM0MzQzNDIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+Cg==");
  }
}
</style>
