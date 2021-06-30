const Mock = require('mockjs')
const { param2Obj } = require('./utils')

const user = require('./user')
const role = require('./role')
const article = require('./article')
const search = require('./remote-search')
const admin = require('./admin')
const channel = require('./channel')
const program = require('./program')
const tempEpg = require('./temp-epg')
const epg = require('./epg')
const device = require('./device')
const devicechn = require('./device-chn')
const devicepro = require('./device-pro')
const prochn = require('./pro-chn')
const ip = require('./ip')
const myrole = require('./myrole')

const mocks = [
  ...user,
  ...role,
  ...article,
  ...search,
  ...admin,
  ...channel,
  ...program,
  ...tempEpg,
  ...epg,
  ...device,
  ...devicechn,
  ...devicepro,
  ...prochn,
  ...ip,
  ...myrole
]

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

module.exports = {
  mocks,
  mockXHR
}
