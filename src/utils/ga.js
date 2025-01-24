const gaConsole = !window.dataLayer || /localhost/i.test(location.host) ? true : false

module.exports = {
  event: (category, action, label) => {
    const dataObj = {
      event: 'customEventTrigger',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: 1,
    }
    if (gaConsole) {
      console.log('ga debug', dataObj)
      return
    }
    window.dataLayer.push(dataObj)
  },
  pageview: (url) => {
    const dataObj = {
      event: 'customPageviewTrigger',
      path_url: url
    }
    if (gaConsole) {
      console.log('ga debug', dataObj)
      return
    }
    window.dataLayer.push(dataObj)
  },
}
