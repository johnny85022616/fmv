<template>
<div>
  <div class="popup-mask"></div>
  <div class="popup">
    <div class="popup__content">
      <ul>
        <li
          v-for="(item,index) in items"
          :key="index"
          @click="e=>tools.goProductPage(e, item.pid, item)">
          <div>
            <img :src="item.image_url" />
            <p class="name">{{item.name}}</p>
            <div class="price">
              <span>折後</span>
              <p class="dc-price-af">{{ priceFormat(item.after_discount)}}</p>
            </div>
          </div>
        </li>
      </ul>
      <a @click="(e)=>close(e)">收合</a>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'popup',
  data() {
    return {

    }
  },
  created() {

  },
  updated() {},
  props: {
    items: {
      type: Array,
      default: () => ([])
    },
  },
  methods: {
    close(e) {
      this.$emit('popupClose', e)
    },
    priceFormat(x) {
      return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../style/color';

.popup-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $black;
  opacity: 0.6;
  z-index: 20;
}

.popup{
  display: flex;
  z-index: 21;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;

  &__content{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    width: 95%;
    padding: 10px;
    border-radius: 8px;
    background-color: $black;
    ul{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      max-height: 80vh;
      overflow: auto;
      overscroll-behavior: contain;
      li{
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        width: 32.5%;
        height: 170px;
        margin-bottom: 5px;
        padding:5px 0;
        border-radius: 5px;
        list-style-type: none;
        background-color: $white;
        >div{
          width:104px;
          font-weight: bold;
          img{
            width: 100px;
            height: 100px;
            margin: 0 auto;
          }
          .name{
            display: -webkit-box;
            margin: 0 auto;
            overflow: hidden;
            color: $dustygray;
            font-size: 1.1rem;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .price{
            display: flex;
            align-items: flex-end;
            justify-content: center;
            span{
              margin-right: 5px;
              margin-bottom: 3px;
              font-weight: normal;
              font-size: 1.2rem;
            }
            .dc-price-af{
              font-size: 1.8rem;
              color: $red;
              &::before{
                content: '$';
                font-size: 13px;
              }
            }
          }
        }
      }
    }
    a{
      position: relative;
      right: 8px;
      color: $white;
      font-size: 1.2rem;
      text-align: right;
      text-decoration: underline;
      &:after {
        position: absolute;
        right: -8px;
        text-decoration: unset;
        content: '>';
      }
    }
  }
}
</style>
