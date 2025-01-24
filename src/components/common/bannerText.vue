<template>
<div class="wrap">
  <div class="items" v-for="item in itemList" :key="item.pid">
    <a :href="item.url">
      <div class="items-wrap">

        <img :src="fullimgurl(item.img)" />

        <span class="duration">
          {{ fulldate(item.activityStartDate, item.activityEndDate)}}
        </span>
        <span class="pname">
          {{ item.activitySubject }}
        </span>
      </div>
    </a>
  </div>
</div>
</template>

<script>
export default {
  name: 'bannerText',
  props: {
    itemList: {
      type: Array,
      required: true
    }
  },
  methods: {
    fullimgurl: function (jpg) {
      return 'https://img.shopping.friday.tw/cmsimg' + jpg
    },
    fulldate: function(start, end) {
      const newStart = new Date(start).toISOString().slice(0, 10).replace('-', '/')
      const newEnd = new Date(end).toISOString().slice(0, 10).replace('-', '/')
      return newStart + '-' + newEnd
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  padding-top: 10px;

  .items {
    flex: 0 0 100%;
    display: flex;
    padding: 11px 20px;
    box-sizing: border-box;

    a {
      text-decoration: none;
    }

    .items-wrap {
      width: 100%;
      background-color: #ffffff;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      font-size: 1.4rem;
      padding: 0 0 5px 0;

      img {
        width: 100%;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }

      .duration {
        padding: 0 10px;
        color: #adadad;
      }

      .pname {
        color: #3c3c3c;
        height: 25px;
        padding: 0 10px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        margin: 5px 0;
      }
    }
  }
}
</style>
