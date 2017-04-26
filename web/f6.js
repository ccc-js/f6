(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var R = { map: new Map() }

f6 = module.exports = {
  scriptLoaded: {},
  router: R
}

f6.route = function (regexp, f) {
  R.map.set(regexp, f)
  return this
}

f6.go = function (hash) {
  window.location.hash = '#' + hash
  return this
}

f6.one = function (query) {
  return document.querySelector(query)
}

f6.all = function (query) {
  return document.querySelectorAll(query)
}

f6.plugin = function (query, html) {
  f6.one(query).innerHTML = html
}

f6.hide = function (node) { node.hidden = true }
f6.show = function (node) { node.hidden = undefined }

f6.on = function (obj, event, f) {
  var o = (typeof obj === 'string') ? f6.one(obj) : obj
  o.addEventListener(event, f)
}

f6.styleLoad = function (url) {
  var ss = document.createElement('link')
  ss.type = 'text/css'
  ss.rel = 'stylesheet'
  ss.href = url
  f6.one('head').appendChild(ss)
}

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

/** ajax with 4 contentType
 * 1. application/x-www-form-urlencoded  ex: title=test&sub%5B%5D=1&sub%5B%5D=2&sub%5B%5D=3
 * 2. multipart/form-data                ex: -...Content-Disposition: form-data; name="file"; filename="chrome.png" ... Content-Type: image/png
 * 3. application/json                   ex: JSON.stringify(o)
 * 4. text/plain                         ex: hello !
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
  console.log(`ojax : arg.body=${arg.body}`)
  var json = await f6.ajax(arg)
  console.log('json=' + json)
  return JSON.parse(json)
}

f6.onload = function (init) {
  return new Promise(function (resolve, reject) {
    window.onload = function () {
      init()
      window.onhashchange()
      resolve()
    }
  })
}

f6.init = function () {
  window.onhashchange = function () {
    var hash = window.location.hash.trim().substring(1)
    for (let [regexp, f] of R.map) {
      var m = hash.match(regexp)
      if (m) {
        f(m, hash)
        break
      }
    }
  }
  return this
}

f6.init()

/*
function ajaxFormPost (path, form, callback) {
  var obj = new window.FormData(form)
  ajaxPost(path, obj, function (r) {
    if (callback != null) callback(r)
  })
}
*/

},{}]},{},[1]);
