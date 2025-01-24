<template>
  <div v-if="isShow" class="downloadapp" :style="{'background-color':bgColor}">
    <div>
      <a @click="closeAppDownloadTop" class="downloadapp__image-close">
        <img :src="closeButtonImage" />
      </a>
      <div>
        <span></span>
        <div class="downloadapp__info">
          <strong :style="{'color': titleColor}">
            {{ dataObj.title }}
          </strong>
          <span :style="{'color': subTitleColor}">
            {{ dataObj.author }}
          </span>
          <span> </span>
        </div>
      </div>
    </div>
    <a :href="deepLink" target="_blank">
      <img :src="openButtonImage" />
    </a>
  </div>
</template>

<script>
export default {
  name: 'downloadapp',
  data() {
    return {
      isShow: false,
      deepLink: '',
      dataObj: {},
      version: '1.0',
      bgColor: '#3c3c3c',
      logoImg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9Im5vbmUiPgogICAgICAgIDxyZWN0IHN0cm9rZT0iI0VBRUFFQSIgZmlsbD0iI0ZGRiIgeD0iLjUiIHk9Ii41IiB3aWR0aD0iMzkiIGhlaWdodD0iMzkiIHJ4PSI4Ii8+CiAgICAgICAgPHBhdGggZD0iTTIwLjEwNiAyOC4xNGExMS45NSAxMS45NSAwIDAgMS00LjIzOC0uNzY5Yy0yLjA5LS44LTQuODcyLTIuNjMtNi4zMDMtNi43MjlsLS4xMzctLjQgMjEuMTk0LTcuMzMyLjEzNy40YTEzLjM1IDEzLjM1IDAgMCAxIC4xMDkgNi44MWMtLjkwOSAzLjYwNy0zLjI3IDYuMTE0LTcuMDI0IDcuNDEyYTExLjU3NSAxMS41NzUgMCAwIDEtMy43MzguNjA5TTM2LjU2IDExLjEzNWwtLjk3OC0zLjExNmMtLjQtMS4zMTgtMS4yMDUtMi4wMDMtMi4zNTgtMi4wMDMtLjQ2OS4wMDktLjkzMi4wOTYtMS4zNzIuMjU2TDQuNDIgMTUuNzg2Yy0uOTY1LjMzNy0xLjYwOC44MjEtMS44ODUgMS40NDJhMi43ODUgMi43ODUgMCAwIDAtLjE4OCAxLjExM2MuMDE1LjM3OS4xMDcuNzUyLjI3MiAxLjA5NGwxLjE3NCAzLjA0NWMyLjQ0IDYuMzU4IDYuNjQyIDkuMTM4IDkuNzM3IDEwLjM1MmExOC43NDYgMTguNzQ2IDAgMCAwIDYuNzM4IDEuMjQ1YzEuOS4wMTIgMy43ODktLjI5MyA1LjU4Ny0uOSA4LjkyMi0zLjA5IDEzLjYyLTEyLjc2OCAxMC43MDYtMjIuMDQyIiBmaWxsPSIjRjUyODFFIi8+CiAgICA8L2c+Cjwvc3ZnPgo=',
      openButtonImage: '',
      closeButtonImage: '',
      titleColor: '#f4f4f4',
      subTitleColor: '#f4f4f4'
    }
  },
  created() {
    const passAppDownloadNotice = window.sessionStorage.getItem('appdown-notice')
    // const configsFileName = /(localhost|ec2-m)/i.test(location.hostname) ? 'setting_beta.json' : 'setting.json' //62535 [3.0][轉轉] APP查訂單的Header沒有正常隱藏


    if (this.tools.checkInAppSessions() || this.tools.checkInSuperAppSessions()) {
      return
    }
    if (passAppDownloadNotice) {
      return
    }

    if (this.configs.hiddenCommonHeader.test(location.search)) {
      return
    }

    // GET Banners
    // this.axios          // 62535[3.0][轉轉] APP查訂單的Header沒有正常隱藏
    //   .get(
    //     `https://event.shopping.friday.tw/event/CP/appbanner_setting/${configsFileName}`,
    //     {
    //       baseURL: '',
    //     }
    //   )
    //   .then((res) => {
    //     const data = res.data
    //     if (data.author && data.icon && data.title) {
    //       this.isShow = true
    //       this.dataObj = data
    //       if (data.version) this.version = data.version
    //       if (data.bgColor) this.bgColor = data.bgColor
    //       if (data.icon) this.logoImg = data.icon
    //       if (data.titleColor) this.titleColor = data.titleColor
    //       if (data.subTitleColor) this.subTitleColor = data.subTitleColor
    //       if (data.openButtonImage) this.openButtonImage = data.openButtonImage
    //       if (data.closeButtonImage) this.closeButtonImage = data.closeButtonImage
    //       this.$emit('downloadAppOpened')
    //     }
    //     if (data.link) {
    //       this.deepLink = data.link
    //     }
    //   })

    // deeplink
    const regexp = new RegExp(/product\?|sid\/341|5\/341/, 'i') // 特殊pathname不轉進
    const app = this.configs.appConfigs
    let targetUrl = window.location.href
    let urlSearch = ''
    let appParams = `apn=${app.apn()}&isi=${app.isi}&ibi=${app.ibi}&efr=${
      app.efr
    }`
    if (regexp.exec(targetUrl)) {
      if (!/\?/i.test(targetUrl)) {
        targetUrl += '?'
      }
      targetUrl += app.utmcode
      urlSearch = `?link=${encodeURIComponent(targetUrl)}&${appParams}`
    } else {
      urlSearch = `mobile-topbar?${appParams}`
    }
    this.deepLink = app.firebaseLink() + urlSearch
  },
  methods: {
    closeAppDownloadTop() {
      this.isShow = false
      window.sessionStorage.setItem('appdown-notice', this.dataObj.daysHidden + 'd')
      this.$emit('downloadAppOpened')
    },
  },
}
</script>

<style lang="scss" scoped>
.downloadapp {
  position: fixed;
  z-index: 99;
  top: 0;
  width: 100%;
  height: 58px;
  padding: 5px 10px;
  box-sizing: border-box;
  display: block;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;

  * {
    box-sizing: border-box;
  }

  >a {
    img {
      vertical-align: middle;
    }
  }

  &__image-close {
    margin-right: 10px;
    img {
      vertical-align: middle;
    }
  }

  &__info {
    max-width: 220px;
    font-size: 1.1rem;
    line-height: 1.2em;
    color: #f4f4f4;

    strong {
      display: block;
      font-size: 1.5rem;
      color: #f4f4f4;
      font-weight: 500;
      line-height: 18px;
    }

    span {
      font-size: 1.1rem;
      display: block;
    }
  }

  >div {
    display: flex;
    align-items: center;
    justify-content: space-between;

    >div {
      display: flex;
      align-items: center;
    }

    span {
      &:first-child {
        display: inline-block;
        width: 40px;
        height: 40px;
        margin-right: 8px;
        background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9Im5vbmUiPgogICAgICAgIDxyZWN0IHN0cm9rZT0iI0VBRUFFQSIgZmlsbD0iI0ZGRiIgeD0iLjUiIHk9Ii41IiB3aWR0aD0iMzkiIGhlaWdodD0iMzkiIHJ4PSI4Ii8+CiAgICAgICAgPHBhdGggZD0iTTIwLjEwNiAyOC4xNGExMS45NSAxMS45NSAwIDAgMS00LjIzOC0uNzY5Yy0yLjA5LS44LTQuODcyLTIuNjMtNi4zMDMtNi43MjlsLS4xMzctLjQgMjEuMTk0LTcuMzMyLjEzNy40YTEzLjM1IDEzLjM1IDAgMCAxIC4xMDkgNi44MWMtLjkwOSAzLjYwNy0zLjI3IDYuMTE0LTcuMDI0IDcuNDEyYTExLjU3NSAxMS41NzUgMCAwIDEtMy43MzguNjA5TTM2LjU2IDExLjEzNWwtLjk3OC0zLjExNmMtLjQtMS4zMTgtMS4yMDUtMi4wMDMtMi4zNTgtMi4wMDMtLjQ2OS4wMDktLjkzMi4wOTYtMS4zNzIuMjU2TDQuNDIgMTUuNzg2Yy0uOTY1LjMzNy0xLjYwOC44MjEtMS44ODUgMS40NDJhMi43ODUgMi43ODUgMCAwIDAtLjE4OCAxLjExM2MuMDE1LjM3OS4xMDcuNzUyLjI3MiAxLjA5NGwxLjE3NCAzLjA0NWMyLjQ0IDYuMzU4IDYuNjQyIDkuMTM4IDkuNzM3IDEwLjM1MmExOC43NDYgMTguNzQ2IDAgMCAwIDYuNzM4IDEuMjQ1YzEuOS4wMTIgMy43ODktLjI5MyA1LjU4Ny0uOSA4LjkyMi0zLjA5IDEzLjYyLTEyLjc2OCAxMC43MDYtMjIuMDQyIiBmaWxsPSIjRjUyODFFIi8+CiAgICA8L2c+Cjwvc3ZnPgo=') no-repeat;
      }
    }
  }
}
</style>
