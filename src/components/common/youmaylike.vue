<template>
<div
  id="venraasRecDom"
  class="youmaylike-wrap">
  <div
    v-if="title"
    class="youmaylike-wrap__title">{{title}}</div>
  <productItem :itemList="items" />
</div>
</template>

<script>
import productItem from "../common/productItem";
export default {
  name: 'youmaylike',
  data() {
    return {
      items: [],
      apiPath: 'https://aiapi.shopping.friday.tw/api/getqlist',
      ymlParams: {
        list_args: 'content',
        list_fun: 'Q3s27',
        list_remote: 'm',
        target: 'pseudoid',
        target_value: '0'
      },
      vavParams: {
        list_args: 'content',
        list_click: 0,
        list_cmpn: 'friday00',
        list_fun: 'Q3sII',
        list_remote: 'm',
        target: 'pseudoid',
        target_value: '0'
      },
    }
  },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    rectype: {
      type: String,
      default: () => 'YouMayLike'
    },
    recgid: {
      default: () => null
    },
    limit: {
      type: Number,
      default: () => 20
    }
  },
  components: {
    productItem,
  },
  created() {
    const gaCookie = document.cookie.match(/_ga=([a-z_0-9.]+);/i);
    const gid = gaCookie && gaCookie[1] ? gaCookie[1].slice(6) : 0;
    let payload = {}

    if (this.rectype === 'YouMayLike') {
      this.ymlParams.target_value = gid
      payload = this.ymlParams
    } else {
      this.vavParams.list_click = this.recgid
      this.vavParams.target_value = gid
      payload = this.vavParams
    }

    this.getAiRec(payload)
  },
  methods: {
    getAiRec(payload) {
      const recType = (this.rectype === 'YouMayLike') ? 'yml' : 'vav'
      let isShow = true

      fetch(this.apiPath, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
        .then((res) => res.json())
        .then((res) => {
          if (res && res[0] && res[0].pids.length > 0) {
            this.items = res[0].pids.slice(0, this.limit).map(item => {
              return {
                pid: item.pid,
                url: item.url.replace(/&WT\.me_id=(\w+)_AI/i, ''),
                img: item.image_url,
                name: item.name,
                price: item.price,
                payMethodList: ['CASH']
              }
            })
          } else {
            isShow = false
          }

          this.$emit('haveData', recType, isShow)
        })
        .catch(() => {
          this.$emit('haveData', recType, false)
        })
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../style/color';

.youmaylike-wrap {
  margin: 0 15px;
  &__title {
    text-align: center;
    margin: 25px 0 10px 0;
    font-size: 1.6rem;
    color: $web_minor;
  }
}
</style>
