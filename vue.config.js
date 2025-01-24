const configs = require('./src/config/configs');
const env = process.env.NODE_ENV;

module.exports = {
  publicPath: env && /(production|stage|uat)/i.test(env) ? '/public/m' : '', // static file path
  productionSourceMap: false,
  filenameHashing: false,
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          minChunks: 3,
          chunks: 'initial',
        },
        common: {},
      },
    }),
      config.module
        .rule('images')
        .use('url-loader')
        .loader('file-loader')
        .tap((options) =>
          Object.assign(options, {
            name: 'images/[folder]/[name].[ext]',
          })
        ),
      config.module
        .rule('svg')
        .use('file-loader')
        .tap((options) =>
          Object.assign(options, {
            name: 'images/[folder]/[name].[ext]',
          })
        );
    // config.optimization.delete('splitChunks')
  },
  css: {
    extract: {
      ignoreOrder: true,
    },
  },
  pages: {
    otp_verify: {
      // page entry
      entry: 'src/otp_verify.js',
      // tempalte source
      template: 'public/otp_verify.html',
      // dist filename
      filename: 'otp_verify.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    page_not_found: {
      // page entry
      entry: 'src/page_not_found.js',
      // tempalte source
      template: 'public/page_not_found.html',
      // dist filename
      filename: 'page_not_found.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    index: {
      // page entry
      entry: 'src/homepage.js',
      // tempalte source
      template: 'public/index.html',
      // dist filename
      filename: 'index.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    onsale: {
      // page entry
      entry: 'src/onsale.js',
      filename: 'onsale.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    category: {
      // page entry
      entry: 'src/category.js',
      // dist filename
      filename: 'category.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    aisearch: {
      // page entry
      entry: 'src/aiSearch.js',
      // dist filename
      filename: 'aiSearch.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    product: {
      // page entry
      entry: 'src/product.js',
      // tempalte source
      template: 'public/product.html',
      // dist filename
      filename: 'product.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    shoppingcart: {
      // page entry
      entry: 'src/shoppingcart.js',
      // tempalte source
      template: 'public/shoppingcart.html',
      // dist filename
      filename: 'shoppingcart.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    invoiceManagement: {
      // page entry
      entry: 'src/invoice_management.js',
      // tempalte source
      template: 'public/invoice_management.html',
      // dist filename
      filename: 'invoice_management.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    shoppingIntro: {
      // page entry
      entry: 'src/shoppingIntro.js',
      // tempalte source
      template: 'public/membersInterests_shoppingIntro.html',
      // dist filename
      filename: 'membersInterests_shoppingIntro.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    privacyIntro: {
      // page entry
      entry: 'src/privacyIntro.js',
      // tempalte source
      template: 'public/membersInterests_privacyIntro.html',
      // dist filename
      filename: 'membersInterests_privacyIntro.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    seviceTermsIntro: {
      // page entry
      entry: 'src/seviceTermsIntro.js',
      // tempalte source
      template: 'public/membersInterests_seviceTermsIntro.html',
      // dist filename
      filename: 'membersInterests_seviceTermsIntro.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    shoppingAggreementIntro: {
      // page entry
      entry: 'src/shoppingAggreementIntro.js',
      // tempalte source
      template: 'public/membersInterests_shoppingAggreementIntro.html',
      // dist filename
      filename: 'membersInterests_shoppingAggreementIntro.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    shoppingCheat: {
      // page entry
      entry: 'src/shoppingCheat.js',
      // tempalte source
      template: 'public/membersInterests_shoppingCheat.html',
      // dist filename
      filename: 'membersInterests_shoppingCheat.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    commonProblem: {
      // page entry
      entry: 'src/commonProblem.js',
      // tempalte source
      template: 'public/customerService_commonProblem.html',
      // dist filename
      filename: 'customerService_commonProblem.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    serviceLine: {
      // page entry
      entry: 'src/serviceLine.js',
      // tempalte source
      template: 'public/customerService_serviceLine.html',
      // dist filename
      filename: 'customerService_serviceLine.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    creditCardManagement: {
      // page entry
      entry: 'src/creditCardManagement.js',
      // tempalte source
      template: 'public/checkout_creditCardManagement.html',
      // dist filename
      filename: 'checkout_creditCardManagenent.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    consigneeManagement: {
      // page entry
      entry: 'src/consigneeManagement.js',
      // tempalte source
      template: 'public/checkout_consigneeManagement.html',
      // dist filename
      filename: 'checkout_consigneeManagement.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    fcoin: {
      // page entry
      entry: 'src/fcoin.js',
      // tempalte source
      template: 'public/fcoin.html',
      // dist filename
      filename: 'fcoin.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    aicategory: {
      entry: 'src/aiCategory.js',
      filename: 'aiCategory.html',
      title: configs.title,
      description: configs.description,
    },
    aiCategoryProduct: {
      // page entry
      entry: 'src/aiCategoryProduct.js',
      // dist filename
      filename: 'aiCategoryProduct.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    aiViewed: {
      // page entry
      entry: 'src/aiViewed.js',
      // dist filename
      filename: 'aiViewed.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    // Under will deprecated
    promotion: {
      // page entry
      entry: 'src/promotion.js',
      // dist filename
      filename: 'promotion.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    promotion_page: {
      // page entry
      entry: 'src/promotion_page.js',
      // dist filename
      filename: 'promotion_page.html',
    },
    aiPromotion: {
      // page entry
      entry: 'src/aiPromotion.js',
      // dist filename
      filename: 'aiPromotion.html',
    },
    brands: {
      // page entry
      entry: 'src/brands.js',
      // dist filename
      filename: 'brands.html',
    },
    brandPromotion: {
      // page entry
      entry: 'src/brandPromotion.js',
      // tempalte source
      template: 'public/brandPromotion.html',
      // dist filename
      filename: 'brandPromotion.html',
    },
    brandPromotionCategory: {
      // page entry
      entry: 'src/brandPromotionCategory.js',
      // tempalte source
      template: 'public/brandPromotionCategory.html',
      // dist filename
      filename: 'brandPromotionCategory.html',
    },
    brandPromotionSearch: {
      // page entry
      entry: 'src/brandPromotionSearch.js',
      // tempalte source
      template: 'public/brandPromotionSearch.html',
      // dist filename
      filename: 'brandPromotionSearch.html',
    },
    myFavorite: {
      // page entry
      entry: 'src/myFavorite.js',
      // tempalte source
      template: 'public/myFavorite.html',
      // dist filename
      filename: 'myFavorite.html',
    },
    happygo: {
      // page entry
      entry: 'src/happygo.js',
      // tempalte source
      template: 'public/happygo.html',
      // dist filename
      filename: 'happygo.html',
    },
    aiAllCategory: {
      // page entry
      entry: 'src/aiAllCategory.js',
      // tempalte source
      template: 'public/aiAllCategory.html',
      // dist filename
      filename: 'aiAllCategory.html',
    },
    // 會員中心
    memberCenter: {
      // page entry
      entry: 'src/memberCenter.js',
      // tempalte source
      template: 'public/memberCenter.html',
      // dist filename
      filename: 'memberCenter.html',
    },
    // 我的購物金
    voucher: {
      // page entry
      entry: 'src/voucher.js',
      // tempalte source
      template: 'public/voucher.html',
      // dist filename
      filename: 'voucher.html',
    },
    // 結帳第2動
    checkout_step2: {
      // page entry
      entry: 'src/checkout_step2.js',
      // tempalte source
      template: 'public/checkout_step2.html',
      // dist filename
      filename: 'checkout_step2.html',
    },
    // 結帳第3動
    checkout_step3: {
      // page entry
      entry: 'src/checkout_step3.js',
      // tempalte source
      template: 'public/checkout_step3.html',
      // dist filename
      filename: 'checkout_step3.html',
    },
    // 查訂單
    order: {
      // page entry
      entry: 'src/order.js',
      // tempalte source
      template: 'public/order.html',
      // dist filename
      filename: 'order.html',
    },
    // 發票列印
    invoicePrinting: {
      // page entry
      entry: 'src/invoicePrinting.js',
      // dist filename
      filename: 'invoicePrinting.html',
      // website title
      title: configs.title,
      // website description
      description: configs.description,
    },
    // 活動頁
    campaign: {
      // page entry
      entry: 'src/campaign.js',
      // tempalte source
      template: 'public/campaign.html',
      // dist filename
      filename: 'campaign.html',
    },
    myCampaign: {
      // page entry
      entry: 'src/myCampaign.js',
      // tempalte source
      template: 'public/myCampaign.html',
      // dist filename
      filename: 'myCampaign.html',
    },
    GetCoupon: {
      // page entry
      entry: 'src/GetCoupon.js',
      // tempalte source
      template: 'public/GetCoupon.html',
      // dist filename
      filename: 'GetCoupon.html',
    },
    shipFeeProductList: {
      // page entry
      entry: 'src/shipFeeProductList.js',
      // tempalte source
      template: 'public/shipFeeProductList.html',
      // dist filename
      filename: 'shipFeeProductList.html',
    },
    allCampaign: {
      // page entry
      entry: 'src/allCampaign.js',
      // tempalte source
      template: 'public/allCampaign.html',
      // dist filename
      filename: 'allCampaign.html',
    },
    CvsManagement: {
      // page entry
      entry: 'src/CvsManagement.js',
      // tempalte source
      template: 'public/CvsManagement.html',
      // dist filename
      filename: 'CvsManagement.html',
    },
    myFcoin: {
      // page entry
      entry: 'src/myFcoin.js',
      // tempalte source
      template: 'public/myFcoin.html',
      // dist filename
      filename: 'myFcoin.html',
    },
    electronicTicket: {
      // page entry
      entry: 'src/electronicTicket.js',
      // tempalte source
      template: 'public/electronicTicket.html',
      // dist filename
      filename: 'electronicTicket.html',
    },
    modifyMemberInfo: {
      // page entry
      entry: 'src/modifyMemberInfo.js',
      // tempalte source
      template: 'public/modifyMemberInfo.html',
      // dist filename
      filename: 'modifyMemberInfo.html',
    },
    myHg: {
      // page entry
      entry: 'src/myHg.js',
      // tempalte source
      template: 'public/myHg.html',
      // dist filename
      filename: 'myHg.html',
    },
  },
};
