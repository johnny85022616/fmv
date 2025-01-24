<template>
  <div class="fcoin">
    <div class="fcoin__content">
      <p class="fcoin__content-fcoinOwn">您的遠傳幣是 :<font> {{ fcoin }} </font></p>
      <p v-if="hasActive" class="fcoin__content-fcoinUseLimit">遠傳幣<span> {{ fcoinEventUseLimit }} </span>以內的 1 幣可折抵 {{fcoinEventRate}} 元</p>
      <p v-if="hasActive" class="fcoin__content-warn">(超過的部分，1幣可折1元)</p>
      <p class="fcoin__content-inputLabel">輸入您要折的遠傳幣</p>
      <input class="fcoin__content-fcoinDiscountForQA" type="hidden" v-model="fcoinUsagePrice">
      <input type="tel" class="fcoin__content-input" v-model.lazy="fcoinUsage" @keyup.enter="handleEnter" :disabled="isDisable">
    </div>
    <div class="fcoin__button">
      <span :class="['fcoin__button-confirm', 'button',{disable:isDisable}]" ref="confirmBtn" @click="sendCoinToStep2">確認</span>
      <span class="fcoin__button-back button" @click="historyBack">取消</span>
    </div>
  </div>
</template>
  
  <script>
  export default {
    name: "Fcoin",
    data() {
      return {
        urlSearchObj: null, //url queryString
        hasActive: false, //有無活動
        fcoin: null,  //目前擁有的f幣
        fetId: null,  //遠傳新生活id

        //---------------倍率1以上的(活動倍率) start -----------------
        fcoinEventLimit: null, //活動折抵最高折抵金額
        fcoinEventPriceRate: null, //活動折抵消費金額的Ｎ%
        fcoinEventRate: null, //活動折抵f幣倍率
        fcoinEventUseLimit: null, //活動折抵f幣上限(倍率1以上的)
        //---------------倍率1以上的(活動倍率) end -------------------

        fcoinUsage: null, //使用者輸入的f幣數量
        fcoinTotalLimit: 0, //活動倍率及1:1f幣加總的上限
        totalAmount: 0, //消費總金額
        fcoinRateUsage: 0, //使用者花費的活動折抵(倍率1以上的)f幣個數
        isDisable: true,  //true: 尚未執行完init階段 false: 已執行完init階段
        fcoinUsagePrice: 0 //遠傳幣換算出來的金額(for QA比對是否和step2扣除的相等)
      };
    },
    components: {
  
    },
    async created() {
      this.urlSearchObj = this.tools.urlSearchToObj() //取得queryString
      this.getTotalAmount()  //取得消費金額
      this.getFetId() //取得fetid
      await this.getFcoinByFetId()  //利用fetid取得用戶擁有的遠傳幣
      await this.getFcoinRateRule() //取得現行計算加倍折抵公式
      this.calcFcoinTotalLimit() //計算使用者可使用的最大遠傳幣上限
      this.fcoinUsageInit() //自動帶入上次的f幣
    },
    methods: {
      //取得消費金額
      getTotalAmount(){
        const amount = this.urlSearchObj.amount
        this.totalAmount = parseInt(amount);
      },
      //取得fetid
      getFetId(){
        this.fetId = sessionStorage.getItem('mcid');
      },
      //利用fetid取得用戶擁有的遠傳幣
      getFcoinByFetId(){
        return new Promise((resolve)=>{
          const api = `api/fcoin/queryFcoinsByFetId?fetId=${this.fetId}`
            this.axios.get(api).then((res)=>{
              const {data} = res
              if(data.code === 1){
                this.fcoin = data.payload? data.payload[0].result: 0
                resolve()
              }else{
                alert(this.error['0'])
              }
            }).catch((error) => {
              console.error('queryFcoinsByFetId api error')
              console.error(error)
              alert(this.error['-1'])
            })
        })
      },
      //現行計算加倍折抵公式
      getFcoinRateRule(){
        return new Promise((resolve)=>{
          const CHANNEL_ID7 = this.urlSearchObj.channelId7? this.urlSearchObj.channelId7:'';
          const pids = this.urlSearchObj.pids.split(',');
          const postData = {
            channelId7: CHANNEL_ID7,
            dealAmount: this.totalAmount,
            userFcoin: this.fcoin,
            pidAndSidList: pids
          }
          const api = 'api/promotion/fcoin'
          this.axios({
            method: 'POST',
            url: api,
            data: postData,
          }).then((res) => {
            let {data} = res;
            // 測試無活動時開啟此區域
            // data = {
            //     "code": 0,
            //     "message": "OK",
            //     "timestamp": "20230111154623",
            // }
            if (data.code === 1 || data.code === 0){ //1:有倍率 0:無倍率
              if(data.payload && data.payload[0] && data.payload[0].promotionFcoinInfo){
                this.hasActive = true;
                const {sellDiscountAmt, sellDiscountPct,  sellPrice, canUseMaxFcoin} = data.payload[0].promotionFcoinInfo
                this.fcoinEventLimit = sellDiscountAmt, //活動折抵最高折抵金額
                this.fcoinEventPriceRate = sellDiscountPct, //活動折抵消費金額的Ｎ%
                this.fcoinEventRate = sellPrice //活動折抵f幣倍率
                this.fcoinEventUseLimit = canUseMaxFcoin //活動折抵f幣上限(倍率1以上的)
              }
              resolve()
            }
          }).catch((error)=>{
            console.error('getFcoinRateRule api error')
            console.error(error)
            alert(this.error['-1'])
          })
        })
      },
      //計算使用者可使用的最大遠傳幣上限
      calcFcoinTotalLimit(){
        if(this.hasActive){ //有活動:活動倍率上限 + 1:1
          const fcoinRate1Limit = this.totalAmount - (this.fcoinEventUseLimit * this.fcoinEventRate)  //倍率為1的最大數量
          this.fcoinTotalLimit = this.fcoinEventUseLimit + fcoinRate1Limit //倍率N + 倍率1
        }else{ //無活動: 該訂單的金額
          this.fcoinTotalLimit = this.totalAmount 
        }
        //折抵上限大於使用者擁有的fcoin，設定為使用擁有的所有fcoin(使用者擁有的fcoin不足以折抵全額)
        if(this.fcoinTotalLimit > this.fcoin){
          this.fcoinTotalLimit = this.fcoin
        }
      },
      //在輸入框按下enter視同按下確認
      handleEnter(){
        this.$refs.confirmBtn.click();
      },
      //回上一頁
      historyBack(){
        if(window.opener){
          window.close();
        }
      },
      //自動帶入上次的f幣(判斷url currentFcoin 有無值，若沒有表示尚未輸入過直接帶入最大折抵上限)
      fcoinUsageInit(){
        const pastFcoinUsage = this.urlSearchObj.currentFcoin? this.urlSearchObj.currentFcoin : this.fcoinTotalLimit;  
        this.fcoinUsage = pastFcoinUsage  
        this.isDisable = false
      },
      //將f幣折抵的金額送回結帳step2
      sendCoinToStep2(){
        if(this.isDisable){ //若尚未init完畢，點擊確認不動作
          return false
        }
        if(this.fcoinUsage === null || this.fcoinUsage ===''){
          const fcoinUsageInputEmptyMessage = new this.fridayComponent.Message({
            name: 'fcoinUsageInputEmptyMessage',
            className: 'friday',
            type: 'success',
            message: '請輸入要折抵的遠傳幣數量'
          })
          fcoinUsageInputEmptyMessage.init()
          fcoinUsageInputEmptyMessage.show()
          return false;
        }
        
        const payLoad = {fcoin: this.fcoinUsage, eventFcoin: this.fcoinRateUsage}
      
        //for web
        if(window.opener){
          window.opener.checkoutUseFcoin(payLoad)
          window.close();
        }
      }
    },
    watch:{
      //輸入相關檢查及計算輸入的f幣轉換成的折抵金額
      fcoinUsage(fcoinUsage){
        
        let errorMsg = '' //提示訊息
        //去除數字前方0(若只輸入0則不去除)
  
        if(this.fcoinUsage !== '0'){
          //去除字首0
          this.fcoinUsage = this.fcoinUsage.toString().replace(/^[0]+/,'') // eslint-disable-line 
          this.fcoinUsage = this.fcoinUsage.toString().replace(/[^0-9]/g,'') // eslint-disable-line 
        }

        if(this.hasActive){  //有倍率活動
          //使用者輸入的活動折抵倍率數量
          let totalRateCount = 0 
          //使用者輸入的 1:1 數量
          let totalRate1Count = 0
          if(fcoinUsage > this.fcoinEventUseLimit){  //超過活動折抵上限
            if(fcoinUsage > this.fcoin){ //超過使用者擁有的遠傳幣
              this.fcoinUsage = this.fcoinTotalLimit
              errorMsg = "遠傳幣餘額不足"
            }else if(fcoinUsage > this.fcoinTotalLimit){ //超過活動倍率及1:1f幣加總的上限
              this.fcoinUsage = this.fcoinTotalLimit 
              errorMsg = "已超過折抵上限"
            }
            totalRateCount = this.fcoinEventUseLimit
            totalRate1Count = this.fcoinUsage - this.fcoinEventUseLimit
          }else{
            totalRateCount = this.fcoinUsage
          }
          this.fcoinRateUsage = totalRateCount; //紀錄有倍率的
          this.fcoinUsagePrice = (totalRateCount * this.fcoinEventRate) + totalRate1Count
        }else{  //無倍率活動
          if(this.fcoinUsage > this.fcoinTotalLimit){ //超過使用者擁有的遠傳幣
            this.fcoinUsage = this.fcoinTotalLimit
            errorMsg = '遠傳幣餘額不足'
          }else if(fcoinUsage > this.fcoinTotalLimit){ //超過活動倍率及1:1f幣加總的上限
            this.fcoinUsage = this.fcoinTotalLimit 
            errorMsg = "已超過折抵上限"
          }
          this.fcoinUsagePrice = this.fcoinUsage
        }

        //提示訊息顯示
        if(errorMsg!==''){
          const checkFcoinUsageMessage = new this.fridayComponent.Message({
            name: 'checkFcoinUsageMessage',
            className: 'friday',
            type: 'success',
            message: errorMsg
          })
          checkFcoinUsageMessage.init()
          checkFcoinUsageMessage.show()
        }
      }
    },
  };
  </script>
  
  <style lang="scss">
  @import "./style/reset.module.scss";
  @import "./style/flex.module.scss";
  @import "./style/rwd.module.scss";
  @import "./style/icons.module.scss";
  @import "./style/global.module.scss";
  </style>
  
  <style lang="scss" scoped>
  @import "./style/_color.scss";
  .button{
    display: inline-block;
      width: 95%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 10px;
      background-color: $red;
      color: $white;
      font-size: 16px;
      cursor: pointer;
      border: 0;
  }
  .disable{
    opacity: .6;
  }
  .fcoin{
    &__content{
      text-align: center;
      padding: 20px;
      margin-top: 15vh;
      &-fcoinOwn{
        margin: 20px 0;
        font-size: 1.8rem;
        color: $tundora;
        font{
          font-size: 1.9rem;
          font-weight: bold;
        }
      }
      &-warn{
        margin-bottom: 30px;
        font-size: 1.5rem;
        color: $sliver;
      }
      &-fcoinUseLimit{
        margin-bottom: 3px;
        font-size: 2rem;
        color: $mine-shaft;
        span{
          color: $red;
          font-size: 2.5rem;
        }
      }
      &-inputLabel{
        font-size: 1.4rem;
        margin-bottom: 10px;
        color: $tundora;
      }
      &-input{
        border: 1px solid $ghost;
        border-radius: 3px;
        padding: 10px;
        box-sizing: border-box;
        text-align: center;
        width: 176px;
        height: 55px;
        font-size: 20px;
      }
    }
    &__button{
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 10px 0 10px;
      border-top: 1px solid $alto;
      text-align: center;
      background-color: $white;
      &-back{
        margin-top: 10px;
        border: 1px solid $red;
        color: $red ;
        background-color: $white;
      }
    }
  }
  </style>
  