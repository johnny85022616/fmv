# friday_mobile_vue

## Important!!!! Check configs before run build
#### __1. check subdomain must be ignore in configs.js line:28__
#### __2. check gtm code exsited and ignore venraas.min.js in /public/\<xxx\>.html__
#### __3. check static path must be '/static/' on production in vue.config.js line:5__

<br>

## Vue Mapping JSP
- index.html -> index.jsp 首頁
- category.html -> category.jsp 館大中小目錄頁
- product.html -> product.jsp 商品頁
- coupon.html -> memberQueryCoupon.jsp
- invoiceManagement.html -> einvoiceInfo.jsp
- promotion.html -> promotionCategory.jsp 超值活動總覽頁
- promotion_page.html -> promotion.jsp 促銷活動頁 & 紅配綠活動頁

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Custom vue-carousel
See [gitlab](http://gitlaboa.hq.hiiir/ec_f2e_groups/vue-carousel)
#### vue-carousel commands
```
#npm run build
#git add . && git commit -m 'change package' --no-verify
#git tag -a v0.24.0 -m 'change style'
#git push && git push --tags
```