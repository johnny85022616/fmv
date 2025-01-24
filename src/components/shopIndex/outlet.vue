<template>
  <div class="outlet">
    <ul v-for="(channelList , index) in data" :key="index" class="channel">
      <!-- 頻道-->
      <li v-for="(item , index) in channelList" :key="index" class="channel__schedule">
        <!-- 檔期-->
        <a :href="item.url" class="channel__schedule-link">
          <img :src="item.img" class="channel__schedule-img" />
          <countDown :endTime="item.endTime" />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import countDown from "./countDown.vue";
export default {
  name: "outlet",
  data() {
    return {
      data: {},
    };
  },
  props: {
    jsonPayload: Object,
    sid: Number,
  },
  components: {
    countDown,
  },
  created() {
    this.buildChannel();
  },
  methods: {
    buildChannel() {
      if (this.jsonPayload === null) return; //初始時尚未取回response, 或取得失敗
      const channelNames = [
        "hot",
        "new",
        "timeup",
        "SH10",
        "fashion",
        "life",
        "bigshop",
      ];
      let channelArr = [];
      channelNames.forEach((cname) => {
        //channelArr[hot]=hot頻道的檔期;
        for (let channel in this.jsonPayload) {
          if (channel === cname) {
            let items = this.jsonPayload[channel]; //該頻道的每個檔期
            items = this.findCmsItems(
              items,
              this.sorter("orderNum", true, "itemId", true),
              9999
            ); //排序
            channelArr[cname] = items; //排序完畢塞進channelArr
          }
        }
      });
      channelNames.forEach((cname) => {
        this.data[cname] = []; //建立最終頻道key值
        let items = channelArr[cname]; //檔期
        if (items) {
          //假設此頻道有檔期
          items.forEach((item) => {
            //遍歷每個檔期
            const startTime = new Date().getTime();
            const endtime = item.endTime;
            if (endtime < startTime) {
              //檔期資訊來自cache檔，若已過期不應顯示在此擋掉
              return;
            }
            let rootCid = "0";
            if (item.cidFromCmsItemOutlet) {
              rootCid = item.cidFromCmsItemOutlet;
            }
            let outletUrl = this.getOutletUrl(cname, item, rootCid); //取得連結

            var imgUrlForImgDOM = this.getImgUrl(cname, item); //取得圖片
            this.data[cname].push({
              //將每一檔期塞入該頻道的檔期陣列中
              url: outletUrl,
              img: this.configs.checkImgSrc(imgUrlForImgDOM),
              endTime: item.endTime,
            });
          });
        }
      });
    },
    getImgUrl(chName, item) {
      return chName === "SH10" ? item.img : item.imgFromSP;
    },
    getOutletUrl(chName, item, rootCid) {
      var outletUrl = "/promotion/page/" + rootCid + "?sid=341";
      return chName === "SH10" ? item.url : outletUrl;
    },
    findCmsItems(items, _sorter, topn) {
      items.sort(_sorter ? _sorter : this.sorter("orderNum"));
      // filter items, top n.
      return items.filter((item, idx) => {
        return idx < (topn ? topn : 1);
      });
    },

    /**
     * Array 排序
     *
     * field: 指定欄位.
     * asc: 升降冪(true:asc, false:desc, others:true).
     */
    sorter(field, asc, field2, asc2) {
      asc = undefined === asc || typeof asc !== "boolean" ? true : asc;
      asc2 = undefined === asc2 || typeof asc2 !== "boolean" ? true : asc2;
      var result;
      return function (a, b) {
        if (field2) {
          var ascNum = asc ? 1 : -1;
          var ascNum2 = asc2 ? 1 : -1;
          result =
            a[field] < b[field]
              ? -1 * ascNum
              : a[field] > b[field]
              ? 1 * ascNum
              : a[field2] < b[field2]
              ? -1 * ascNum2
              : a[field2] > b[field2]
              ? 1 * ascNum2
              : 0;
          return result;
        } else {
          result = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
          return asc ? result : result * -1;
        }
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.outlet {
  .channel {
    margin: 16px 3% 0;
    box-sizing: border-box;

    &__schedule {
      list-style-type: none;

      &-link {
        width: 100%;
        border: 1px solid #a1a1a1;
        display: block;
        margin-bottom: 20px;
        text-decoration: none;
        position: relative;
        box-sizing: border-box;
      }

      &-img {
        width: 100%;
      }
    }
  }
}
</style>
