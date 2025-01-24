<template>
<div>
  <div id="combine-area" class="tab-section" data-tab="任選">
    <p class="condition">
      組合商品 <span>{{this.conditionWord}}</span>
    </p>
    <div class="flex-container">
      <div
        class="flexBox"
        v-for="(item,key) in comboTab"
        :key="key"
        :class="{ 'active': key === tabSel}"
        @click="getCombo(item,key)"><span>{{item}}</span>區已選 <span class="orderCount" v-if="areaOrder[item]">{{areaOrder[item]}}</span></div>
    </div>
    <div class="pd-container">
      <comboItem
        :comboGroup="comboTab[tabSel]"
        :itemList="itemList"
        :pid="pid"
        :cid="cid"
        v-on:getOrder="insertMenu"
        v-on:showOrderMenu="showOrderMenu"
        v-on:removeOrder="removeOrder"
        :orderItemsAll="orderItemsAll" />
    </div>
  </div>
  <div class="orderList">
    <div class="flex-container">
      <div class="flexBox">
        <i :class="['alert',{'green':isAchieve}]"></i>
        <span v-if="isAchieve" class="green"> 達成優惠條件</span>
        <span v-else> 尚未達成優惠條件</span>
      </div>
      <div class="flexBox">
        <button :class="{'ordered': orderItemsAll.length > 0}" @click="showDialog = !showDialog">已選購({{orderItemsAll.length}})</button>
      </div>
    </div>
  </div>
  <div
    v-if="showDialog && orderItemsAll.length > 0"
    class="">
    <fullscreendialog
      :isFullscreen="false"
      :closeDialog="closeDialog"
      v-on:closeDialog="closeDialog">
      <template v-slot:header>選購明細</template>
      <template v-slot:body>
        <div
          class="orderItem"
          v-for="(item,index) in orderItemsAll"
          :key="index">
          <div class="flex-container">
            <div class="flexBox">
              <img :src="item.image" alt="">
            </div>
            <div class="flexBox">
              <h3>{{item.name}}</h3>
              <h3>{{item.spec}}</h3>
              <p :class="{'notReach':achieveCondition[item.comboGroup] != areaOrder[item.comboGroup]}"><span>{{item.comboGroup}}區任選{{achieveCondition[item.comboGroup]}}件</span><span v-if="achieveCondition[item.comboGroup] == areaOrder[item.comboGroup]">已達優惠</span><span v-else>未達優惠</span></p>
              <i class="del" @click="del(item.pid,item.comboGroup)"></i>
              <div class="count">x {{item.buyQty}}</div>
            </div>
          </div>
        </div>
      </template>
    </fullscreendialog>
  </div>

</div>
</template>

<script>
import comboItem from "../common/comboItem"; // 組合商品
import fullscreendialog from "../common/fullscreenDialog.vue"; // 全畫面蓋版提示框

export default {
  name: 'combineArea',
  data() {
    return {
      conditionWord: '',
      comboTab: [],
      achieveCondition: {},
      tabSel: 0,
      itemList: [],
      orderItems: [],
      isAchieve: false,
      areaOrder: {},
      orderItemsAll: [],
      showDialog: false,
      isFullscreen: false
    }
  },
  components: {
    comboItem,
    fullscreendialog
  },
  props: {
    pid: {
      type: Number
    },
    cid: {
      type: Number
    }
  },
  watch: {
    orderItemsAll: {
      handler() {
        if (this.orderItemsAll.length == 0) {
          this.showDialog = false
        }
      }
    },
    orderItems: {
      handler() {
        const orderTab = Object.keys(this.orderItems);
        this.orderItemsAll = [];
        orderTab.forEach((tab) => {
          let tabSize = 0;
          this.orderItems[tab].forEach((item) => {
            this.orderItemsAll.push(item)
            tabSize = tabSize + item.buyQty
            this.$set(this.areaOrder, tab, tabSize)
          })
        })
      },
      immediate: true,
      deep: true,
    },
    areaOrder: {
      handler() {
        this.conditionCHK();
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.axios.get(`api/product/${this.pid}/combo?cid=${this.cid}&group=A`).then(res => {
      const products = res.data.data[0].products
      this.itemList = products;
    })
    this.axios.get(`api/product/${this.pid}/detail?cid=${this.cid}`).then(res => {
      const combo = res.data.data[0].combo
      let txt = ''
      let tab = [];
      let achieve = {};
      combo.forEach(el => {
        txt += ` ${el.group}區任選${el.count}件 +`
        tab.push(el.group)
        achieve[el.group] = el.count;
      });
      txt = txt.substring(0, txt.length - 1)
      this.conditionWord = txt
      this.comboTab = tab
      this.achieveCondition = achieve
    })
  },
  computed: {

  },
  methods: {
    removeOrder(n) {
      this.$delete(this.areaOrder, n)
    },
    showOrderMenu(i) {
      if (i) {
        this.showDialog = true
      }
    },
    del(pid, comboGroup) {
      this.orderItems[comboGroup].forEach((e, i) => {
        if (e.pid == pid) {
          this.orderItems[comboGroup].splice(i, 1)
          this.$delete(this.areaOrder, comboGroup)
        }
      })
    },
    conditionCHK() {
      const achieveCondition = this.achieveCondition
      const achieveConditionSize = Object.keys(achieveCondition).length
      const areaOrder = this.areaOrder
      const areaOrderSize = Object.keys(areaOrder).length
      if (achieveConditionSize == areaOrderSize && achieveConditionSize != 0 && areaOrderSize != 0) {
        let isAchieve = true
        this.comboTab.forEach(tab => {
          if (achieveCondition[tab] !== areaOrder[tab]) {
            isAchieve = false
          }
        })
        if (!isAchieve) {
          this.isAchieve = false
        } else {
          this.isAchieve = true
        }
      } else {
        this.isAchieve = false
      }
      this.$emit('combinedAchieve', this.isAchieve)
    },
    closeDialog() {
      this.showDialog = false
      this.$emit('stopBodyScroll', 'close')
    },
    getCombo(groupName, i) {
      this.axios.get(`api/product/${this.pid}/combo?cid=${this.cid}&group=${groupName}`).then(res => {
        const products = res.data.data[0].products
        this.itemList = products;
      })
      this.tabSel = i
    },
    insertMenu(items) {
      this.orderItems = items
    }
  }
}
</script>

<style lang="scss" scoped>
p.condition {
  padding: 8px 18px;

  span {
    color: #60ba9a;
    padding-left: 10px;
  }
}

.orderItem {
  color: #60ba9a;
  overflow: hidden;
  border-radius: 10px;
  max-height: 100px;
  margin-bottom: 10px;

  .flex-container {
    display: flex;
    max-height: 100px;

    .flexBox {
      padding: 0;

      &:first-child {
        width: 30%;
        overflow: hidden;
        border-radius: 10px;

        img {
          width: 100%;
          height: 100%;
          max-height: 100px;
        }
      }

      &:nth-child(2) {
        width: 70%;
        padding: 5px 0 5px 10px;
        text-align: left;
        position: relative;

        h3 {
          color: #adadad;
          font-size: 1.4rem;
          max-width: 191px;

          &:first-child {
            color: #3c3c3c;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        p {
          position: absolute;
          bottom: 5px;

          &.notReach {
            color: #f34f59;
          }
        }

        .del {
          position: absolute;
          right: 10px;
          top: 10px;
          width: 24px;
          height: 24px;
          display: inline-block;
          background-size: contain;
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAMKADAAQAAAABAAAAMAAAAADbN2wMAAADN0lEQVRoBe2YTWgTQRTHmw+oEEqxok3wA7zVIgp6UUyDaA6CKEgNeKiCiFo9F7xV9CZ68CCiIiiCB4kI6qEUc5AkB0EUFEFv0hRpqiAoKRg0ib8XdstSktnZbJZQmIHHTt783/99zSTZ6eszw1TAVGBVVyDUjegzmUykXC5fajQa5+Hb4sJZCoVCd+Px+LVsNltzwbouR1wRGoChoaH7wKaQQQ24YA5WKpVNpVLphQZeCfHdgbGxsV1U/p3SS5tFOrG7UCi8b7OspY5qodSgC/YyAb1FzpBQy60RiUTCtVrtHut7LRuxPWvbd/L01YF0Oj1YrVa/EVBMnIfD4RP5fP6JKhA6Ng7+qWBIdqm/v39jLpf7pbJRrYVVi25rBH/SDh7s4sjIyDM3G7rwnMDLghNb4XCzUa0rO0C1pnGyvR0BgSRZT8g683nmb9phnXqwe8ButuwWmBed68452E+ck6tOnXOuTCCZTDac4F7Ni8Vi2ziVW4js//UqaNuvWwzKbyGMJ5BtQkabp5DmYUV3B1m0nXTjCfcwMilccC8hNyzezyr+tq1ZacR2koM3LHrId7IvP67E+PnMedtBAh8sjkW2TVyHT7mFdAh6jTEJ9LoDykOsE1wqlTpVr9dPcy7+IBf5Jf4qduhT7OnLMkd/BX3e0m9FfxtZwy/3A9SPRN/p8J0AwU/gfD8BSQz7kGYCfD6CHBAlQ/6wNRMAn2R+SJTM//LwlUBYiLo1CFj7W61bPruaQLeC8sJjEvBSrSCwpgNBVNULp+mAl2oFgTUdCKKqXjhNB7xUKwis6QB/leesytaj0ei8o8q2XlTLcwtTF6XDVj52NHx3gP/z5whkw8DAwNrXDDsK3plvxWKxdSIyt/WCEazYiK2t7/Tp+32AQORF4EerAGZnZ3+20s/MzPwWPbatlj3pfHfAk7cAwNoJUC1nNdcHEMsyJ76+6/JrbyHetr5A2rzk4jnJPc6CrhNNXPNSS7D4Ul5mOfm0E6AqjyE+Zjk4zlMkkMEN9kNdYk+niNu5VxCndck7xL3kVu6orq32GRDCRCJxmE7cZFrSdeABNwf39dHR0XEPNgZqKmAqsNor8B8/qgGW6KVl9QAAAABJRU5ErkJggg==');
        }

        .count {
          position: absolute;
          right: 10px;
          bottom: 5px;
          font-size: 1.4rem;
          color: #3c3c3c;
        }
      }
    }
  }
}

.flex-container {
  display: flex;
  background-color: #f4f4f4;

  .flexBox {
    flex-grow: 1;
    text-align: center;
    padding: 12px 0;
    cursor: pointer;
    font-size: 1.4rem;

    &.active {
      background-color: #fff;
      border-bottom: 2px solid #f34f59;
    }

    .orderCount {
      display: inline-block;
      width: 18px;
      height: 18px;
      background-color: red;
      border-radius: 50%;
      color: #fff;
    }
  }
}

.orderList {
  position: fixed;
  bottom: 60px;
  left: 0;
  z-index: 1;
  width: 100%;
  background-color: #fff;
  padding: 0 15px;
  box-sizing: border-box;

  .flex-container {
    display: flex;
    align-self: center;
    justify-self: center;
    background-color: #fff;

    .flexBox:first-child {
      text-align: left;

      span {
        vertical-align: middle;
        color: #f34f59;

        &.green {
          color: #60ba9a;
        }
      }

      i.alert {
        vertical-align: middle;
        display: inline-block;
        width: 20px;
        height: 20px;
        background-size: contain;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAAEh0lEQVRYCe1YTYgVRxDumvfiGmf2EH9iVjQQyM81SkI8CAYSEjztH4voRtEEhIBe9xYQcsvVQ4KHKOrqquzfSRKSg2AgIeLmmh8QouzGZJPLm+fPum869c286u2enzfvqQsPceBtVXdVV31b3dNVNUo9e57yCNDj/H965Pia+vIfuylqvBYR9ZHSW2BPK5r3tF7QXuV3v/rqVbp8fOlR/XQMUGtN94ZGByOt9zK7h+H0tnZONSJ9xSO6+PzU+DTxoLW+K+0IYDgw+h4D+oJB7nDNtDdicDeUorFgZvz79lawdjuK+siRdfW/w68Z2N5cfVL/cVxus2y+Kd+iSW3lvV6fp89AL/ovBh/TyZN38+T2XCnAu/2Ht0Xq/izvy3Z3Id1kEGe8SnXWnzwzZ8uErw8f3B41lvsZ/EGt9CsyD8qO5zy1tn/d7Klb9nyabwmwCe5HBhcf/mQxLSpPfR5sCr7kCDxMG8wb8w48F/4Tfqoi9RkfkY2iw87nGeTOViALAcbbeqd2zY4cK/9ElcqgP3VuQZx0QutDH/XpRmOabb4j69jmnL+5d1fRdnuimKbxmbO3lWjSf3nj7kcFB/tY67/Q865iW+IPAYAvGadpbgTxtmodfSfKiBzA0YkTD2Quj9aHD7yFeX/y7PU8uczpY8d66n8uXnUiSd77eW93JoK453CViDE+zotqTc9AGbhwcN/haHn5Z/zCgf2HVtZnOdjCUYltG3F8fWUClgGIS9i55/BCXD79l7FTxET0gRFp9aHhC5j4qLBtEcMnfMtYaAYgMoQISdFNvK0ybkU57hWR27zM5dGg+vpX8CEy27fMOQCRW5P0lYhxz7V7lYjBTihyNHzIGvgGBhmDOgCR+Pn8mdyKS9hWXg3e9aF7EwwrnhyAqEqMiNNXUYYwOk+AiX2wLzHlYOBJB2CkPJMxmrlV1q0qtX3ZGODUAUgU9VlIJPFbU6vGGl8pDC7AVXP/GIadCKIStmyZ7bbmClnepoYIbV7mSqjxlcLgRhBluhji13+r8G1RT39r9Eh9Y/g2GNuXjQFL3QhyD2HscbGJes6MS5hg+sIpr1p9G79g5vzpEnUjjn1YhS36GCNkpmoP0OCES7/V5C5Escny3GLUXid8WZEgejZt+mhOUQ0YbHkmOdcG9l9SWo9ACWnI3xy80U424QLhTS7xp2LjpIY4ir/YjvJ4FLL1O+GvUm0TqUvBzAWTarHG2WJMVEhNgOLBwrgSToZlf49Cv+nsaJky5LAt4DBG5wdqPxmAzdaQu6/mw2V6OHLoJRkWUtI/WLJrFp/LorpOWoBEjI4PvtPKGYBJ30pjK4rcQyw9mEGRuTKX5Tp5SWALpT/vkelP+ECNJb5d25kzKGI+UxNOm8llerBtw2hZ4SrriyjAhbf+HedzPiw6fNYngtnz+2Rs00wERRj3rfYbzAZRpre13WIkRbEWNlxwaJqCT1KqZlgYQWh0ddsp/0JXN+4Csqs/fQhI0K79eGSDRFvatZ/fbKDgnQ+YXI1Lsam1t+CpaP5JfMBM+3w2fuoi8D/vSB4YhDkQWAAAAABJRU5ErkJggg==');

        &.green {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAAElElEQVRYCe1YS2gUQRCtnnXiB0UNHrIS0RyCBy9GInoQo0QjEcQfKiKKm8QFRa/ehIA3r4LK5rOiCEnAH4JiVCSioBgSLx4khyiGJAdRQ8Rolt22amdquue3n2hgkQzsVnVVddWb6l/1AMw9/3kGxN+8X+v7nrKPYxN1AKJaSIgCZFZa/oxRKWAMQA6tiS7ta113eHqmcYoGKKUUsaft+7HjEQzaiO0luYILISZR/0gCdCd3tNzFNrKFP0UBbO5tr8+IzCUpYUPhIZSlEDBgSON8R0PLMyXNzRUEMN7/YFHq23gnZouy5nsEiK84pCOoGLWVKzFPlRJkuc8YBZjFbnN5RVOids/PIL0uywsw1te5CqbT9xFcjd4RwwwbAm4guPsdO1sG3Tqr1fykvQZB7s1IOIHzsUq3QZCDUBbZm6xr+qzLvXxOgDa41wjOnvz09vAF/y6ay2quJmprU16HQe14f7+Z+j54GqS8gNNjBdsgyFEEuTkXyFCA9rC+1DOHxm/MBQv3J7YexxVa/BN/cTOa+jV1F1fJJu5NmcTh3hI23AYbeqk959SwCri9uKqybqbgyD/1XW2a2wB9cTxKAMXitpcGZpBWaxoyT9mYMkfgLlfv/s2yINrU21FL8s6G5v4gPcvODT2c/2N4pE/PZASMHUGr25dBfCNBWwk7ozm30DT35QMXe9IWy0D6Lf2aniVOcv8gSr5oqmTns21gbV+4F3geH0DahF37HC6IK9tj455+via+WAMLM2nYxXwYzU4V9M16ikmxuc3UBxBfQdvrxDCtVjbOTUVE6XVeSb3c6ujSa7Rdsdwd25K6ANLZiuJG7kD7XKFbCfcphtIZTTG0Po02BkfkAkgHPw6Vc7bSJuxYzhKjx6DYVvGhgrkAYrqrWUXHV9gJwTb/glIMiqV8KQwkcwEU2olhn62q3yxyeiwdgw8gnpdY0zkPH/yOYBYZLZYLgzuDswhgxq5dQ4wjrr0JOAVCYd5lWtnpvJLm4LRYLgzuDOJccIoAqudyOPSp8NDvZaERgcfMF0L1WDoG6uvJoBxih1RsUj3H7Xw0ufNU0oDIRvp11sev57NnvV0zaoWtwkA289iQKF1wPo1OTPJeSMUmigOLUb0f8/mKBLbTqR0jK8JRmMTTpU/X+w7nk71tPbiaD1lGYrisvGZtIafJqeeJ9amUuEP9TFMeaNsef6cHCuKpkJ3+OviBq20E2IMjoR21viFGNwK6lDNZla2ElSCUQ3BnrUDYJ8uHmjoKy7e6CmD51e0obcYzBwGsqyEMOIZYpp95nqxw2iEMlk6vWGVE5EvmwyhV13QFYD32H6DY3GbqA4hplnQ1ZAO6Q0ylUveoyGRZEC1mkZCvbOmv3U8oJsX2+vbNQTbAArQLF4uaD1imL1lTeSxf4cr9wyiBm/w4cgskHNRsuq43xI9qbYf1ZZA1dG/FN1IrGB1SmV7IcLMPL6W+5EMHRzHKyqPNXltuh2aQDEr62slvUNIXdwZZ0p8+GCTRkv14pIPElV26n990oMS7P2DS9xsuNsWYpO8u/+ADpjfmXPu/y8AfsK8Yi7BiihUAAAAASUVORK5CYII=')
        }
      }
    }

    .flexBox:last-child {
      text-align: right;

      button {
        width: 80px;
        border-radius: 12.5px;
        border: 1px solid #e0e0e0;
        color: #e0e0e0;
        background-color: #fff;
        font-size: 1.2rem;
        cursor: not-allowed;

        &.ordered {
          color: #000;
          background-color: #fff;
          border: 1px solid #3c3c3c;
          cursor: pointer
        }
      }
    }
  }

}
</style>
