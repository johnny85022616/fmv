<template>
  <div id="coupon-wrap" :class="{ 'use':selectBtnp === 0 ,'used':selectBtnp === 1 ,'tobeuse':selectBtnp === 2 }">
    <div v-for="(item,key) in couponData" :key="key" :class="['articleWrapper',{ 'all': item.couponCategory === 'wholeGH','lovebuy': item.couponCategory === 'amart','special': item.couponCategory === 'store','default': !item.couponCategory}]">
      <!--  all全館,lovebuy愛買,special專館-->
      <article>
        <div class="imgWrapper">
          <div class="img"></div>
          <h3 v-if="item.couponCategory === 'wholeGH'">全站折價券</h3>
          <h3 v-if="item.couponCategory === 'amart'">愛買折價券</h3>
          <h3 v-if="item.couponCategory === 'store'">專館折價券</h3>
          <h3 v-if="!item.couponCategory">折價券</h3>
        </div>
        <div class="couponContent">
          <div v-if="item.discount" class="discount"><span>{{item.discount}}</span>折</div>
          <div v-else class="amount">$<span>{{item.amount}}</span></div>
          <p class="maxCouponAmount">滿 ${{item.maxCouponAmount}} 可折抵</p>
          <div class="date expire" v-if="item.formatExpireDate == timeNow && selectBtnp != 2">
            <span>即將到期 </span>
            <span v-if="expiry(item.formatExpireDate) !== 1">剩{{expiry(item.formatExpireDate)}}小時</span>
            <span v-else>剩{{expiryMin(item.formatExpireDate)}}分鐘</span>
          </div>
          <div class="date" v-if="item.formatExpireDate !== timeNow && selectBtnp != 2">
            <span>有效期限 </span>
            <span>{{item.formatExpireDate}}</span>
          </div>
          <div class="date" v-if="selectBtnp == 2">
            <span>{{item.formatStartDate}} ~ {{item.formatExpireDate}}</span>
          </div>
        </div>
        <div class="detail" @click="toggleDetail(key)"></div>
      </article>
      <div :class="['couponDetail',{open: item.isDetailOpen}]" :id="item.couponId">
        <ul>
          <li>活動說明 <p>{{item.desc}}</p>
          </li>
          <li>折價券編號 <span>{{item.couponId}}</span></li>
          <li v-if="selectBtnp===1">訂單編號 <span>{{item.orderId}}</span> <a style="text-decoration:none;color:#558fff" :href="`https://m.shopping.friday.tw/mobileweb/member/ViewMyOrderMenuDetail?dealId=${item.dealId}`">查看訂單</a></li>
        </ul>
      </div>
    </div>
    <div class="btnWrapper">
      <p v-if="selectBtnp === 0 && noCoupon">您沒有可使用的折價券</p>
      <p v-if="selectBtnp === 1 && noCoupon">您沒有已使用的折價券</p>
      <p v-if="selectBtnp === 2 && noCoupon">您沒有待生效的折價券</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "couponlist",
  data() {
    return {
      couponData: [],
      totalPage: 1,
      pageNo: 1,
      noUsed: false,
      noCoupon: false, //未查詢出該類折價卷
      noStart: false,
      timeNow: null,
    };
  },
  props: {
    selectBtnp: {
      type: Number,
      default: 0,
    },
    windowY: {
      type: Number,
      default: 0,
    },
    isDownloadAppOpened: {
      type: Boolean,
      default: false,
    },
    receiveCount: {
      type: Number,
      dafault: () => 0,
    },
  },
  created() {
    let today = new Date();
    let date = "";
    today.getDate() < 10
      ? (date = `0${today.getDate()}`)
      : (date = today.getDate());
    this.timeNow = `${today.getFullYear()}/${today.getMonth() + 1}/${date}`;
    this.getCouponData();
  },
  mounted() {
    if (this.isDownloadAppOpened) {
      document.querySelector("#coupon-wrap").style.paddingTop = "218px";
    } else {
      document.querySelector("#coupon-wrap").style.paddingTop = "100px";
    }
  },
  watch: {
    async selectBtnp(value) {
      await this.getCouponData(value);
    },
    receiveCount() {
      this.getCouponData(0);
    },
  },
  methods: {
    async getCouponData() {
      this.couponData = [];
      this.noCoupon = false;
      let type;
      switch (this.selectBtnp) {
        case 0:
          type = "active";
          break;
        case 1:
          type = "used";
          break;
        case 2:
          type = "notStart";
          break;
      }
      this.axios
        .get(
          `${this.configs.ysdtDomain()}/${
            this.siteData.urlSuffix
          }/FetchCoupon/mycoupons/${type}`
        )
        .then((res) => {
          if (
            res &&
            res.data &&
            res.data.data &&
            res.data.data.couponData &&
            res.data.data.couponData.length > 0
          ) {
            let cd = res.data.data.couponData;
            cd = cd.map((ele) => {
              const formatStartDate = this.formatDataString(ele.startDate);
              const formatExpireDate = this.formatDataString(ele.expireDate);
              return {
                ...ele,
                formatStartDate,
                formatExpireDate,
                isDetailOpen: false,
              };
            });
            this.couponData = cd;
          } else {
            this.noCoupon = true;
          }
        })
        .catch((e) => {
          this.noCoupon = true;
          console.error(e);
        });
    },
    formatDataString(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
    },
    toggleDetail(index) {
      this.couponData[index].isDetailOpen =
        !this.couponData[index].isDetailOpen;
    },
  },
  computed: {
    expiry() {
      return function (time) {
        const couponExpiry = time;
        let today = new Date();
        if (couponExpiry == this.timeNow) {
          let restHour = 24 - today.getHours();
          return restHour;
        }
      };
    },
    expiryMin() {
      return function (time) {
        const couponExpiry = time;
        let today = new Date();
        if (couponExpiry == this.timeNow) {
          let restMin = 59 - today.getMinutes();
          return restMin;
        }
      };
    },
  },
};
</script>

<style lang="scss" scoped>
#coupon-wrap {
  padding: 10px;

  .btnWrapper {
    text-align: center;

    button {
      border-radius: 10px;
      font-size: 1.6rem;
      font-weight: 500;
      border: 1px solid #3c3c3c;
      background-color: transparent;
    }

    button,
    p {
      width: 100%;
      padding: 10px 116px 10px 117px;
      font-size: 1.4rem;
    }

    p {
      color: #adadad;
      padding: 10px 0 10px;
    }
  }

  .articleWrapper {
    margin-bottom: 10px;

    article {
      display: flex;
      // width: 355px;
      // height: 100px;
      position: relative;
      padding: 9.5px 10px;
      border-radius: 10px;
      background-color: #ffffff;

      .imgWrapper {
        width: 90px;
        height: 80px;
        // padding: 10px .5px 7px;
        text-align: center;
        border-right: 1px dashed #e0e0e0;

        .img {
          width: 36px;
          height: 36px;
          margin-top: 10px;
          display: inline-block;
          background-size: cover;
        }

        h3 {
          font-size: 1.4rem;
        }
      }

      .couponContent {
        padding: 5px 0 7px 14px;

        .amount,
        .discount {
          font-size: 14px;
          font-weight: 600;

          span {
            font-size: 2rem;
          }
        }

        .maxCouponAmount {
          font-size: 1.4rem;
          font-weight: 600;
        }

        .date {
          color: #adadad;
          font-size: 1.4rem;

          &.expire {
            color: #f34f59;
          }
        }
      }

      .detail {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 10px;
        bottom: 10px;
        background-size: cover;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAAEcElEQVRYCe1Yz0tUURR2xrGRQPNH6SiEm1q1kNqokI5iYIZiQfZjUYvqH7BoaOkyBtT/oE0bRSFEyaRCR4NaKS1yYTsDFQsVBXHScfq+N+eO7/fMNBmD+OC+e+69557ve+fdd+85Ly/v5DrmHvBk83zd3d2n1tbWgrFY7CLsVKFUi71l1Cv5+fnfKyoqIsPDw7+lP+MqY4LxeNwTDAZvHRwc3AVaO0pRCtRtjE94vd6hSCTyxuPxxFPoG4YzItjY2NiK2WGQvGKwkmjsAXyVIsYDqAoS3Yd3jM+hFZqdnf142OsupUWws7Pz9Obm5isA02vqWocwDs+MFhYWfpqcnPypvEMvt7W1ndvd3b0KT3dBrwOlTE2E3mBJScnjsbGxHdXnVKck2NTUdB6AoyiXxcgW6nBpaelAOgCcwwfc2NjogRhCKWYfSM6jdM3MzPxg2+lyJUhy8MAXTNYWPwy+w8J/MD09/cvJoFt/c3PzWXxQr/Gw10VvGW+g3o2k18kgn5qew7giNxAIBDr+lhxxOJc28KADgltNDGJJ21LlW3qko7Kykk96jU0axMJ+urCwkNEXaGebNpaWliZramrOYLwBpSoajV5A34idvq0H+bWCnPZB8LXiqZ/bTTb34RXWs5j77dq0SdscI5bsEBZVC0Eoc12GRXOLaw4bbcwy09QBgL79/f3PLJRNw5YmbdI2BvjR8eL2ZfkmLAS5CUNR7XPhdNcc5jxJ4GgeScqqz64W25oziElss56FIL7ae6K0zq3EPMGl/VU3ppd13VZRMLin5snpZFAyEOTZilG1BYynu8/Ros/nu4M11c/i9/u7DSguDcEYF5V24ZCc4UtKEHjwo9LOVp4Q+rFUMl4Xj7lnqfTsxokF7z3EWJFweK/0DAQlKtHGeHwppXTqlpaWS/hAeqkLb/ZOTU19S2cedYi1s5M49YRDkqDhFeNJVLi0x7M1XQDqgdwLLPTbLJQzmStYe5yj46CZMBCEmxnTcWNeRcloUwYxv2YRN72s+txqYhGTOoqD0jcQVJ25VJsJMhLW4jl4wbJpHhVxYqEExL7GQWGZCa7IQAHjOaV01LVgqQBXcdBgDQSZQygyDDaVfNS1HkvPgbgGgkxw0MccgouVkfB/uXRY28IhiWsgKNnXhIx2uMVpSQtZCoLBlIDXhDkDNBCkBvahIda4yiRMT7SO6C4YWr6iw06iWQhKasjsi1eIYXpCdL9jH4sqDb2s+uxqsc08hXvvHLHNehaCUOQGrU1CXcwcAge4Y+StDOJ4e4m5IyyUVb9TTZu0TQzRCQm2YYrjXoegcxB7k4qqtZDfMDPLBuz3w34PzYDYIFKK+3YmHT1TW1v7FrnCDUzi8dfAHKKuru5DtnkJPVdeXt6nIzePHPnm4uKidhabSTp6kIq5kHa6ElQk8bS5mbgrd3Ov+se/PobwWh+lE7Gn9KAiyRoLuxVV7v080pPE687d3296opSZ4KgfmIyEVbAJeQXyMg/+bH9gmjFP2sfOA38A1VgqqIp07dsAAAAASUVORK5CYII=");

        &.open {
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAAD7ElEQVRYCc1YTU8TQRhul1KBePBkIiaSmKg3owmgCdGDciAk5aO9KB4kEuIPINGTJ3+FBhMuEC5tWppAvHgxHhAOXD1WgiYkGuOFuqWtzzPMjOyy086upXSS6cy8n8++73x0Jhbr8BKPii+bzV6C7kQ8Hr+H9jJqf71e76c90L6hYd0D7SPatUwm8x1t6BIK4Pr6+rlyufwcTmcAYhitlT5kIVr/jHalp6fnzfj4+B9bpFYOYNzJ5/NParXaaxgesDVukCs5jvNqampqGYBrBhlNbgqwWCxecV03C41BrdWaznYymcykUqmvjcw1BFgoFEaq1WoOEbzYyEhUHiK439XVlZ6cnPxksuGYGLlc7tHh4eGH0wJHv7RNH/RlwhEYQUaOilBKmhRbTHcTicSDoEieAMg5V6lUtk4zckEfx3R3d3cP+eekJ8UA5XBBtBscAdOn9O3B5BlwK4Fsq1drUMBMtEGJQfN1irkJHxwcfAHnf/c5bTxip9Tb23tDbeY6gjwhOgAcv2lAYhHfpwFixPTaliom9SrqVjMFyOyiLqL+aiar+JiPM6ovAMqDf0gRm7Vwlk2n04+np6fvQnbJJA+5HfBuQ3Ye/ZcmOT8dssMSU0xFcAKo9Xz0K/jHkL2K6sBQDc7nwF/yy0hwo+D/IA/y1/wyprHEMkG+AnjfJGygD2L3f2cC6QcH2Wews2CwZSILTAlyYZD/5UyCJvosHDMyc4wkW47RvwUFHTkJbhF86wzRITGxFQDRigEJIcsJkBsbG+exRfymnajgJIZ/APF1UQHSlgckxq0Ax8wITGIOIpyh8yu/UjRMKyN3nIb+SNi0HtdXmNQiiXRfoEEY2unr63uo0qqcYAuaR39JjSO0ApMCyAtO6EJwUBodGxv7SWXOOVTj6g7pQGBSi2QvpLKIHHQCVytAOkivZ3VDdjakD4FJRBDGeDW0LojcLoQDwUkjXDj+SBatHUBQYVIpXlOT0tLIe3VCMK3QCdrnPCBx91i1tM3scNGuUV5vnnC0CdTDNkZggAf/C9TrqAvQ03YC9IsEh8sXz+KbAfwg0iYu+jzn9UbN/jKqFUAAugDZt1SyKCmAS1nIaREEYEUNVIpjvPGDWFKMM2xLEouAoAHyHyxv/GcI7AgQMKh/0yR45g5S53Augn5W95JtLL47SLF+EtERFGjB4HMEBPY5bmehT+lbg6N/D0ASeC/lcwS6LsdtKi59+u/E9H0CIIm84eOLnqLbDpAufQW9KhCLZw6ScLx0wuNRQ4AE29HPbyqaXN0d+4CpQLJVT8Do8g491OSIo4oomGM8W3mHXj6VJ+AjN97fdj2ie7124OgvGivsPbi+RhgAAAAASUVORK5CYII=");
        }
      }
    }

    .couponDetail {
      opacity: 0;
      margin-top: 1px;
      padding: 10px 0;
      border-radius: 10px;
      background-color: #ffffff;
      transform: translateY(-10%);
      transition: 0.4s;
      position: absolute;
      z-index: -1;

      &.open {
        opacity: 1;
        transform: translateX(0);
        position: static;
      }

      ul li {
        position: relative;
        padding: 8px 0 8px 20px;
        font-size: 1.4rem;
        list-style-type: none;
        &::before {
          content: "";
          width: 3px;
          height: 20px;
          position: absolute;
          top: 8px;
          left: 0;
          background-color: #f34f59;
          border-radius: 1.5px;
        }

        p {
          margin-top: 8px;
          padding-right: 15px;
        }
      }
    }

    &.all,
    &.default {
      .imgWrapper h3,
      .couponContent .amount,
      .couponContent .discount {
        color: #f34f59;
      }

      .img {
        background-image: url("data:image/png;base64,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");
      }
    }

    &.lovebuy {
      .imgWrapper h3,
      .couponContent .amount,
      .couponContent .discount {
        color: #c71338;
      }

      .img {
        background-image: url("data:image/png;base64,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");
      }
    }

    &.special {
      .imgWrapper h3,
      .couponContent .amount,
      .couponContent .discount {
        color: #60ba9a;
      }

      .img {
        background-image: url("data:image/png;base64,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");
      }
    }
  }

  &.used {
    .all,
    .special,
    .default,
    .lovebuy {
      .couponContent {
        .amount {
          color: #3c3c3c;
        }
      }

      .imgWrapper h3 {
        color: #adadad;
      }
    }

    .all .img,
    .special .img,
    .default .img {
      background-image: url("data:image/png;base64,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");
    }

    .lovebuy .img {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAASKADAAQAAAABAAAASAAAAACQMUbvAAAKEklEQVR4Ae1cC3BUVxk+5+7dbAyYQkULrShawVBKM202Gx7JPoL4arW2A6O2zvhCHZmOKMOMw5T6psWORcGiU2UyamUExQo6rYw2+4SUbLahoomgtNTWOkCwAjaQ7O69x+8knLB7c+/de+/eTUjMncmce/7zn///z7f/+c/zhpCpxxQBalp6uTCWzHyIEGW2ymjvilAgaaXOZOEpCVA03rmeEfKIaDCl5KnaaZ7Vfr//YjSZ3sgYWUMIe6o1GFhHKVUF32RJSwLUnkgfJYwtLmwwQNovMWmHQtQ/jNAl+tkVwcCPR/KT5EUq1Q7KyBu1PPCaOxXKHi2kg++9hfnJ8l4SIEbZGd3GMragiM7ItUX5SZIpCZBE6JVuZNJoRknOpHjCFhkClEx238RbJUvMUlxBMOubsCiYGG4IUJ7lt/J6LS1Nf0NQfsxExnARI/8oyTMBGQwBwtC+MJbo+hxvE4b19ZTQY2bto5SdNyufqGWykeHoMl2Mqd+LpbqOY84Tj3Vk7mJZ5Wnw36Bbh0qDunSbRMYYRfeuU4iyEO8eySP1vXn2jGfmz5/vinyb5hBDDyIIzvCiaqaov4+lOu+ILPMfk3xVzQDuhJ4SpqrX69Gt0mJHjsyIJtLboomuPnTvXoDza9T9paqosZf/9Wpfe6rro1ZluclnCFCNr3o/oTQ7DBL5TTTReU9k6a0v1lTXNGPG3D7aCHrraJo1SjyeblQvZI8DlC9gVv4GbS3Mu15PFbWto+M5fe/VVnAxbwjQkiWLT1PCdnNdAEmGkbsA0s5cjmUjwcaVEpXuQ/D+j7AF86VA7OTJapG3mh4+/PdalbI9UPImszr8h7qUy33ejKcSZYYAcWUy9X4bXSovFAOkT2eVS3+NJbtWR0KNO+g0zwIqSVvhaRfRwFryct8qwWs1vThw7j7IfZslfqYWT04tVSqPyRSgYPC2XkbpNo2K69AV9iBexFk/C0Ra/Bu8VJ4HkB5gKrmXB1YNv3mWqiFzhiul6Nq+K7mxeTMFiJsgzZr2Nb3ADCBCGOWexFTgqMJy7589a9rD8Krb44judkxnhL7DKj+6WZdVXrf4SgIUWbToNeLxrkKrB/SUMsJuVhn5yam+/jPoem0s9ex7enp6qvR49WhY5L6gR9fSoD8PT31CS6903vKvHUukP6wytgsGlexCmFSew699AJOIJMVfZHljL7oHSKOfWDL9MVVlj48uKaag/g4qk51EoXUqU+sg7e0Q+Dp0bR8aUYV3iTJ2CnyvwIn/SST2vJfWHmpurvtvsSR7OcsAcbFDjWHkp9gfKul5RWZQ8ioUHQZwvTD+GBa2x2qqqk80Nd18Fnwq4tkepKuL6riTUTDSZqA3xiR5d2vLbX+yK9YWQFw4QPoERp02xCDbdbXGDXsVO4cR8Dw8YJ623O08gIpj1N0Wbmn4LXRb2v101MhYsnMN9qcfs+1JbrfYoTwAlZEl+eN8lC4lwl5XuSwtEmzaSan0QXSXCblAxcDiz6n5bmwnbyjVExx5kEA9lepckFXJPnSRhYI20VIA8N3WcNN6I7sdeZAQxveKfJ5rmhAI9wvaREsR+74Ujae/YmR3WR4khHI3jacy67CifwgKba/HhBw3UgTfdsSYX2GruEOWvaez3kGJDcrXEVWpR8wMQ8cH0MVmaXV5iPTucLjxj1q6KwAJodgzqmNZ9XHexwVtrFK+cGZEXrUi1BA108knsWfO9t+FIWwdAFs6wktpd2uw0T88so5Q7S0LrlQzfosxJpNk5n4sQzbBmww35Iwl2C9Bo/qIJK+0O8/hJ8bDXs/quFZJklZjp2JvoQVlxaBCQeI9Qmkea7KvY3nixyw3LegVTBWZet5lFxxuTyTo31c7XbqFSvQb6Ep5lbBRZ4CudjEtCIhNEmLTWiwNNg9th2gZXMijAb/AKHRPuaKiqWcbPKqqhkKNRwplVRQgoYjvBA7kstsB2N2C5kbK4wWCa30o5P+zG/L0ZIwJQEJxNJm5HaPJo64tKyjBbZOmRUJ+JVLXY5CZka1B/5PVVdffJFG6Bb9+zozXWhl93hqfc64xBYibuWzZ3EuRUGAjukYDXxM5N32o5uQDSADC4wYNNS4dGkEM9ooEr3Fa+cPKMfegwsbyKQEuXn0VI9wXC+mW3xm90TKvQ8ZxBUjY3BoObEd3Oy7yVlM43nyrvE75rgqALhtvukTQbSCj78TUoeQWsG5di8SrBiDsT9o+e8eab0Yikca+VOWeqwYgnN/WO2kmNp23ODnRtarrqgAomuquRwwKWzW6iA9XAdlLfY8U0VzMjDtAQzFEzW9D6nhWj7prh+9yu4jMZVHjDlA82bUFDQyV2zTGlLaDBzNvKVeOtv64AtSeSn8Sh5EbtEY5yeMoauagou6O8f0oF59xAwgntfcSFSelbj7YIVSTmW+5KdJxvy/HiPZk+jNEZT+EjErMYRSv5AkEg/7ucmwUdcfUg3ggbk90bQE4P6oQOLxdnjxTfsB1iUaWk7oixIoBmUzmmgv96s9geEUndiO2uPTtyJh4UPRgetH5fgW3Zh2CgxOHkYZbfMHtjwegr+z2lS2glL24uXE3ybPDWLE7WlhiYy0JNz9YSo+2HODMjaXSK7V0u/mKAQQDKUaqb8KgvdhinW7XMMGP+0X8MNLZ7iOjnxJynKYVAYivjXDbbC/mOJs4UE6Nw7FRd6QlcABe9IoTGZgb3ZlKHZ3ppK6o4zpAHR0912Jt9DSAKe8EA/d3cJdnLTcU67STwmB7KfMpyuASe3WKuV0FqP1Q91sHsv2HAM7yYjWOct9vbfF38ppVHm8HvAmnxfYffPjnaJdAaHINIL4OorlcHHs0Q8e4QoGTFH3yxVkzfPeLusuX158B7RmRt5Oi3hw7/FpeVwDiB4PZvBpFMJ2nVWA3jwYNEI/nI/X19f2FdSF7X2He8js+Y7DMq8NYNkDJZGbOpVwW4LAbdeTbJiEgrxFdq7Cy5PU4A6jgS4FCeVbfywIo1tMzPceUA7hG4sonAhjSH8SZ2S494yPLGk4AvCf0ykrQTpUoNy12DBAfvtnZ136OCeAtphosFqLx2zGkbzJj9xDfhqEuaMakKaMSe0lDspV1DBA+QdjM5xm2tBkww3Mebg0N/WMChBrjJxSqPwkgv2PMMbqESdRRcBeSHAHE93IQczYKIU5TNBb2k02twaYvW5Xh8855EEO+xW826L/5LX+rsvX4bAOUSGQWo3u5sNFFz0vwwEioabOeYUY0frZfLfvuAEgvGPEIOrojvzBu6pWC1yi1BRC2LGryRNkDjWVd1MTM+C9VHhYIhwO/MzLMjM7nRVUSex94TpvxUVlqMyu3UmYLoAv9ylYEZcd3ovGL5gHOQ3NvmOnnV4itGGjEM3QFWfYEIO85PR7Qj0ea/bZ3AfRkTdGmEJhCYAqBKQSmEJhCYAqB/0cE/ge/kHOlhZwbMQAAAABJRU5ErkJggg==");
    }
  }
}
</style>
