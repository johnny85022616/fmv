<template>
<a href="/onsale" class="cupn-item cupn-item__click" :title="item.name" :data-pid="item.pid" :style="cupnItemStyle">
  <div class="photo">
    <img class="cupnimg" :src="image_url" :alt="item.name" @error="imgFail(image_url)">
  </div>
  <div class="info">
    <div class="cupn">
      <h3 class="name">{{ item.name }}</h3>
      <div class="cupn_block">
        <div class="cupn_t">個人對品折價券</div>
        <div class="cupn_ticket">
          <div class="cupn_price">{{ priceFormat(item.discount)}}</div>
        </div>
      </div>
    </div>
    <div class="nor">
      <div class="nor_t">市價</div>
      <div class="nor_price">{{ priceFormat(item.list_price)}}</div>
    </div>
    <div class="dis">
      <div class="dis_net">
        <div class="dis_t">網路價</div>
        <div class="dis_price">{{ priceFormat(item.price)}}</div>
      </div><img src="@/images/icons/cupn_arrow.svg">
      <div class="dis_net">
        <div class="dis_af">折後</div>
        <div class="dis_af_price">{{ priceFormat(item.after_discount)}}</div>
      </div>
    </div>
  </div>
</a>
</template>

<script>
export default {
  name: 'card',
  data() {
    return {
      styleLeft: '',
      image_url: '',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": this.tools.getCookie('_ga_BRVPB1BSBT')
      },
    }
  },
  created() {
    this.image_url = this.item.image_url
  },
  updated() {
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    isBsite: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    item(n) {
      this.image_url = n.image_url
    }
  },
  methods: {
    imgFail(img) {
      fetch('https://mservice-event.shopping.friday.tw/api/imgBase64', {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            img_path: img
          })
        }).then(res => res.json())
        .then(data => {
          if (data.status === 1) {
            this.image_url = data.base64
          }
        })
    },
    priceFormat(x) {
      return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
    },
  },
  computed: {
    cupnItemStyle() {
      return {
        'left': this.styleLeft
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cupn-item {
  display: flex;
  position: relative;
  box-sizing: border-box;
  width: auto;
  width: 100%;
  height: 120px;
  margin-bottom: 10px;
  margin: 0 auto 2px auto;
  padding: 8px;
  border-radius: 8px;
  text-decoration: none;
  background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/hourly-wrap.jpg');
  background-size: cover;
  touch-action: pan-y !important;
  -webkit-overflow-scrolling: touch; 

  &.opacity {
    background-color: #777;

    .nor_price, .nor_t, .dis_t {
      color: #bbb;
    }
    .dis_price {
      color: #ffc;
    }
  }

  &__click {
    cursor: pointer;
  }

  &__promotion {
    padding: 0;
    border-radius: unset;
    height: auto;
    background-color: unset;

    img {
      vertical-align: middle;
      width: 100%;
    }
  }

  &.reward {
    border: 5px solid #e6b;
    background: linear-gradient(180deg, #b19, #808);
    height: 130px;

    .nor,
    .dis {
      color: #aaa;
    }
    .info {
      .dis {
        max-width: 205px;
      }
    }
  }

  .photo {
    display: block;
  }

  .cupnimg {
    display: inline-block;
    box-sizing: border-box;
    width: 104px;
    height: 100%;
    max-width: unset;
    max-height: unset;
    border: 2px solid white;
    border-radius: 8px;
    vertical-align: unset;
    object-fit: cover;
    aspect-ratio: 1/1;
  }

  .info {
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-flow: column nowrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin: 0 0 0 8px;
    flex-grow: 1;
  }

  .cupn {
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-flow: row nowrap;
    -webkit-box-align: start;
    align-items: flex-start;
    margin: 5px 0 0;

    .name {
      height: 48px;
      margin: 0 15px 0 0;
      font-size: 14px;
      color: white;
      line-height: calc(48px/3);
      word-break: break-word;
      overflow: hidden;
      flex-grow: 1;
    }
  }

  .cupn_block {
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-flow: column;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
  }

  .cupn_t {
    margin: 0 0 6px;
    color: #f5c5c5;
    font-size: 1.2rem;
    -webkit-transform: scale(0.9);
    transform: scale(0.9);
    white-space: nowrap;
  }

  .cupn_ticket {
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-flow: column;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    width: 91px;
    height: 39px;
    margin: 0 6px 0 0;
    font-size: 0.7rem;
    background: #f5c5c5 url(https://turn.shopping.friday.tw/images/cupn_frame.svg) no-repeat center center;
    border: 2px solid #f5c5c5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .cupn_dur {
    color: #555;
    -webkit-transform: scale(0.9);
    transform: scale(0.9);
  }

  .cupn_price {
    color: #ee6262;
    font-size: 2.2rem;
    font-weight: 700;

    &::before {
      content: '$';
      font-size: 10px;
    }
  }

  .dis {
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    img {
      width: 14px;
      margin: 0 2px;
    }
  }

  .nor,
  .dis {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-flow: row nowrap;
    flex-flow: row nowrap;
    -webkit-box-align: baseline;
    -ms-flex-align: baseline;
    align-items: baseline;
  }

  .nor {
    margin-bottom: -8px;
  }

  .nor_t,
  .dis_t {
    margin: 0 5px 0 0;
    color: #888;
    font-size: 0.7rem;
  }

  .nor_price {
    margin: 0 8px 0 0;
    font-size: 12px;
    color: #888;
    text-decoration: line-through;

    &::before {
      content: '$';
      font-size: 9px;
    }
  }

  .dis_price {
    color: #f77;
    font-size: 15px;

    &::before {
      content: '$';
      font-size: 10px;
    }
  }

  .dis_net {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: baseline;
    -ms-flex-align: baseline;
    align-items: baseline;
  }

  .dis_af {
    color: white;
    font-size: 0.8rem;
  }

  .dis_af_price {
    color: #ff0;
    font-size: 18px;

    &::before {
      content: '$';
      font-size: 10px;
    }
  }
}

</style>
