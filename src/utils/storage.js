module.exports = {
  get: function(key) {
    const wl = window.localStorage
    const now = parseInt(new Date().getTime() / 1000)
    let data = null
    if (wl === null) {
      return data
    }
    let st = wl.getItem(key)
    let obj = {}
    if (st !== null) {
      obj = JSON.parse(st)
      if (obj.expire !== undefined && obj.expire > now) {
        data = obj.data
      }
    }
    return data
  },
  set: function(key, value, expire) {
    const wl = window.localStorage
    const now = parseInt(new Date().getTime() / 1000)
    if (wl === null) {
      return false
    }
    let obj = {}
    obj.data = value
    if (expire !== undefined && Number.isInteger(expire)) {
      obj.expire = now + expire
    }
    obj = JSON.stringify(obj)
    wl.setItem(key, obj)
  },
  del: function(key) {
    const wl = window.localStorage
    if (wl.getItem(key) !== null) {
      wl.removeItem(key)
    }
  },
}
