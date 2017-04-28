f6 = module.exports = {
  scriptLoaded: {},
  router: { map: new Map() }
}

// onhashchange => route
f6.route = function (regexp, f) {
  f6.router.map.set(regexp, f)
  return this
}

f6.go = function (hash) {
  window.location.hash = '#' + hash
  return this
}

// DOM Element
Element.prototype.one = function (selector) {
  return this.querySelector(selector)
}

Element.prototype.all = function (selector) {
  return this.querySelectorAll(selector)
}

Element.prototype.hide = function () {
  this.hidden = true
}

Element.prototype.show = function () {
  this.hidden = undefined
}

Element.prototype.html = function (html) {
  this.innerHTML = html
}

// NodeList
NodeList.prototype.each = function (f) {
  return this.forEach(f)
}

NodeList.prototype.hide = function () {
  return this.each(function (x) { x.hide() })
}

NodeList.prototype.show = function () {
  return this.each(function (x) { x.show() })
}

NodeList.prototype.html = function (html) {
  return this.each(function (x) { x.html(html) })
}

// DOM short cut
f6.one = function (selector) {
  return document.querySelector(selector)
}

f6.all = function (selector) {
  return document.querySelectorAll(selector)
}

// View : Event Handling
f6.on = function (obj, event, f) {
  var o = (typeof obj === 'string') ? f6.one(obj) : obj
  o.addEventListener(event, f)
}

// load stylesheet (CSS)
f6.styleLoad = function (url) {
  var ss = document.createElement('link')
  ss.type = 'text/css'
  ss.rel = 'stylesheet'
  ss.href = url
  f6.one('head').appendChild(ss)
}

// load script (JS)
f6.scriptLoad = function (url) {
  return new Promise(function (resolve, reject) {
    var urlLoaded = f6.scriptLoaded[url]
    if (urlLoaded === true) resolve(url)
    var script = document.createElement('script')
    script.onload = function () {
      f6.scriptLoaded[url] = true
      resolve()
    }
    script.onerror = function () {
      f6.scriptLoaded[url] = false
      reject(new Error('Could not load script at ' + url));
    }
    script.src = url
    f6.one('head').appendChild(script)
  })
}

/** ajax with 4 contentType , ref : https://imququ.com/post/four-ways-to-post-data-in-http.html
 * 1. application/x-www-form-urlencoded  ex: title=test&sub%5B%5D=1&sub%5B%5D=2&sub%5B%5D=3
 * 2. multipart/form-data                ex: -...Content-Disposition: form-data; name="file"; filename="chrome.png" ... Content-Type: image/png
 * 3. application/json                   ex: JSON.stringify(o)
 * 4. text/plain                         ex: hello !
 * 5. text/xml                           ex: <?xml version="1.0"?><methodCall> ...
 * For form, use xhr.send(new window.FormData(form))
 */
f6.ajax = function (arg) {
  var promise = new Promise(function (resolve, reject) {
    var xhr = new window.XMLHttpRequest()
    xhr.open(arg.method, arg.url, true)
    if (arg.contentType) {
      xhr.setRequestHeader('Content-Type', arg.contentType)
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return
      if (xhr.status === 200) {
        resolve(xhr.responseText)
      } else {
        reject(new Error(xhr.statusText))
      }
    }
    xhr.send(arg.body)
  })
  return promise
}

f6.ojax = async function (arg) {
  arg.contentType = 'application/json'
  if (arg.obj) arg.body = JSON.stringify(arg.obj)
  var json = await f6.ajax(arg)
  return JSON.parse(json)
}

f6.fjax = async function (arg) {
  arg.contentType = 'multipart/form-data'
  if (arg.form) arg.body = new window.formData(form)
  var json = await f6.ajax(arg)
  return JSON.parse(json)
}

f6.onload = function (init) {
  return new Promise(function (resolve, reject) {
    window.addEventListener('load', function () {
      init()
      window.onhashchange()
      resolve()
    })
  })
}

window.onhashchange = function () {
  var hash = window.location.hash.trim().substring(1)
  for (let [regexp, f] of f6.router.map) {
    var m = hash.match(regexp)
    if (m) {
      f(m, hash)
      break
    }
  }
}

/*
f6.init = function () {
  return this
}

f6.init()

f6.plugin = function (selector, html) {
  f6.one(selector).innerHTML = html
}

*/