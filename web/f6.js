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
  o.addEventListener("click", f)
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

f6.ajax = function (arg) {
  var promise = new Promise(function (resolve, reject) {
    var xhr = new window.XMLHttpRequest()
    xhr.open(arg.method, arg.url, true)
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return
      if (xhr.status === 200) {
        resolve(xhr.responseText)
      } else {
        reject(new Error(xhr.statusText))
      }
    }
    var str = (arg.obj == null) ? null : JSON.stringify(arg.obj)
    xhr.send(str)
  })
  return promise
}

f6.onready = function (init) {
  return new Promise(function (resolve, reject) {
    window.onload = function () {
      console.log('onload')
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
