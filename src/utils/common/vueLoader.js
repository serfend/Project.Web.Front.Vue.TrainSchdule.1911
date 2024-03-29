/* eslint-disable */
const obj = {};
(function umd (root, factory) {
  if (typeof module === 'object' && typeof exports === 'object') { module.exports = factory() } else if (typeof define === 'function' && define.amd) { define([], factory) } else { root.vueLoader = factory() }
})(obj, function factory () {
  'use strict'

  var scopeIndex = 0

  StyleContext.prototype = {

    withBase: function (callback) {
      var tmpBaseElt
      if (this.component.baseURI) {
        // firefox and chrome need the <base> to be set while inserting or modifying <style> in a document.
        tmpBaseElt = document.createElement('base')
        tmpBaseElt.href = this.component.baseURI

        var headElt = this.component.getHead()
        headElt.insertBefore(tmpBaseElt, headElt.firstChild)
      }

      callback.call(this)

      if (tmpBaseElt) { this.component.getHead().removeChild(tmpBaseElt) }
    },

    scopeStyles: function (styleElt, scopeName) {
      function process () {
        var sheet = styleElt.sheet
        var rules = sheet.cssRules

        for (var i = 0; i < rules.length; ++i) {
          var rule = rules[i]
          if (rule.type !== 1) { continue }

          var scopedSelectors = []

          rule.selectorText.split(/\s*,\s*/).forEach(function (sel) {
            scopedSelectors.push(scopeName + ' ' + sel)
            var segments = sel.match(/([^ :]+)(.+)?/)
            scopedSelectors.push(segments[1] + scopeName + (segments[2] || ''))
          })

          var scopedRule = scopedSelectors.join(',') + rule.cssText.substr(rule.selectorText.length)
          sheet.deleteRule(i)
          sheet.insertRule(scopedRule, i)
        }
      }

      try {
        // firefox may fail sheet.cssRules with InvalidAccessError
        process()
      } catch (ex) {
        if (ex instanceof DOMException && ex.code === DOMException.INVALID_ACCESS_ERR) {
          styleElt.sheet.disabled = true
          styleElt.addEventListener('load', function onStyleLoaded () {
            styleElt.removeEventListener('load', onStyleLoaded)

            // firefox need this timeout otherwise we have to use document.importNode(style, true)
            setTimeout(function () {
              process()
              styleElt.sheet.disabled = false
            })
          })
          return
        }

        throw ex
      }
    },

    compile: function () {
      var hasTemplate = this.template !== null

      var scoped = this.elt.hasAttribute('scoped')

      if (scoped) {
        // no template, no scopable style needed
        if (!hasTemplate) { return }

        // firefox does not tolerate this attribute
        this.elt.removeAttribute('scoped')
      }

      this.withBase(function () {
        this.component.getHead().appendChild(this.elt)
      })

      if (scoped) { this.scopeStyles(this.elt, '[' + this.component.getScopeId() + ']') }

      return Promise.resolve()
    },

    getContent: function () {
      return this.elt.textContent
    },

    setContent: function (content) {
      this.withBase(function () {
        this.elt.textContent = content
      })
    }
  }

  function StyleContext (component, elt) {
    this.component = component
    this.elt = elt
  }

  ScriptContext.prototype = {

    getContent: function () {
      return this.elt.textContent
    },

    setContent: function (content) {
      this.elt.textContent = content
    },

    compile: function (module) {
      var childModuleRequire = function (childURL) {
        return vueComponentLoader.require(resolveURL(this.component.baseURI, childURL))
      }.bind(this)

      var childLoader = function (childURL, childName) {
        return vueComponentLoader(resolveURL(this.component.baseURI, childURL), childName)
      }.bind(this)
      try {
        Function('exports', 'require', 'vueComponentLoader', 'module', this.getContent()).call(this.module.exports, this.module.exports, childModuleRequire, childLoader, this.module)
      } catch (ex) {
        if (!('lineNumber' in ex)) {
          return Promise.reject(ex)
        }
        var vueFileData = responseText.replace(/\r?\n/g, '\n')
        var lineNumber = vueFileData.substr(0, vueFileData.indexOf(script)).split('\n').length + ex.lineNumber - 1
        throw new (ex.constructor)(ex.message, url, lineNumber)
      }

      return Promise.resolve(this.module.exports)
        .then(vueComponentLoader.scriptExportsHandler.bind(this))
        .then(function (exports) {
          this.module.exports = exports
        }.bind(this))
    }
  }

  function ScriptContext (component, elt) {
    this.component = component
    this.elt = elt
    this.module = { exports: {}}
  }

  TemplateContext.prototype = {

    getContent: function () {
      return this.elt.innerHTML
    },

    setContent: function (content) {
      this.elt.innerHTML = content
    },

    getRootElt: function () {
      var tplElt = this.elt.content || this.elt

      if ('firstElementChild' in tplElt) { return tplElt.firstElementChild }

      for (tplElt = tplElt.firstChild; tplElt !== null; tplElt = tplElt.nextSibling) {
        if (tplElt.nodeType === Node.ELEMENT_NODE) { return tplElt }
      }

      return null
    },

    compile: function () {
      return Promise.resolve()
    }
  }

  function TemplateContext (component, elt) {
    this.component = component
    this.elt = elt
  }

  Component.prototype = {

    getHead: function () {
      return document.head || document.getElementsByTagName('head')[0]
    },

    getScopeId: function () {
      if (this._scopeId === '') {
        this._scopeId = 'data-s-' + (scopeIndex++).toString(36)
        this.template.getRootElt().setAttribute(this._scopeId, '')
      }
      return this._scopeId
    },

    load: function (content) {
      return new Promise((res, rej) => {
        var doc = document.implementation.createHTMLDocument('')
        doc.body.innerHTML = content
        for (var it = doc.body.firstChild; it; it = it.nextSibling) {
          switch (it.nodeName) {
            case 'TEMPLATE':
              this.template = new TemplateContext(this, it)
              break
            case 'SCRIPT':
              this.script = new ScriptContext(this, it)
              break
            case 'STYLE':
              this.styles.push(new StyleContext(this, it))
              break
          }
        }
        res(this)
      })
    },

    _normalizeSection: function (eltCx) {
      var p

      if (eltCx === null || !eltCx.elt.hasAttribute('src')) {
        p = Promise.resolve(null)
      } else {
        p = vueComponentLoader.httpRequest(eltCx.elt.getAttribute('src'))
          .then(function (content) {
            eltCx.elt.removeAttribute('src')
            return content
          })
      }

      return p
        .then(function (content) {
          if (eltCx !== null && eltCx.elt.hasAttribute('lang')) {
            var lang = eltCx.elt.getAttribute('lang')
            eltCx.elt.removeAttribute('lang')
            const dict = vueComponentLoader.langProcessor
            const l = lang.toLowerCase()
            return (dict[l] || dict['html']).call(this, content === null ? eltCx.getContent() : content)
          }
          return content
        }.bind(this))
        .then(function (content) {
          if (content !== null) { eltCx.setContent(content) }
        })
    },

    normalize: function () {
      return Promise.all(Array.prototype.concat(
        this._normalizeSection(this.template),
        this._normalizeSection(this.script),
        this.styles.map(this._normalizeSection)
      ))
        .then(function () {
          return this
        }.bind(this))
    },

    compile: function () {
      return Promise.all(Array.prototype.concat(
        this.template && this.template.compile(),
        this.script && this.script.compile(),
        this.styles.map(function (style) { return style.compile() })
      ))
        .then(function () {
          return this
        }.bind(this))
    }
  }

  function Component (name) {
    this.name = name
    this.template = null
    this.script = null
    this.styles = []
    this._scopeId = ''
  }

  function identity (value) {
    return value
  }

  function parseComponentURL (url) {
    var comp = url.match(/(.*?)([^/]+?)\/?(\.vue)?(\?.*|#.*|$)/)
    return {
      name: comp[2],
      url: comp[1] + comp[2] + (comp[3] === undefined ? '/index.vue' : comp[3]) + comp[4]
    }
  }

  function resolveURL (baseURL, url) {
    if (url.substr(0, 2) === './' || url.substr(0, 3) === '../') {
      return baseURL + url
    }
    return url
  }

  vueComponentLoader.load = function (content, name) {
    return new Component(name).load(content)
      .then(function (component) {
        return component.normalize()
      })
      .then(function (component) {
        return component.compile()
      })
      .then(function (component) {
        var exports = component.script !== null ? component.script.module.exports : {}

        if (component.template !== null) { exports.template = component.template.getContent() }

        if (exports.name === undefined) {
          if (component.name !== undefined) { exports.name = component.name }
        }

        exports._baseURI = component.baseURI

        return exports
      })
  }

  vueComponentLoader.register = function (Vue, url) {
    var comp = parseComponentURL(url)
    Vue.component(comp.name, vueComponentLoader.load(comp.url))
  }

  vueComponentLoader.install = function (Vue) {
    Vue.mixin({

      beforeCreate: function () {
        var components = this.$options.components

        for (var componentName in components) {
          if (typeof (components[componentName]) === 'string' && components[componentName].substr(0, 4) === 'url:') {
            var comp = parseComponentURL(components[componentName].substr(4))

            var componentURL = ('_baseURI' in this.$options) ? resolveURL(this.$options._baseURI, comp.url) : comp.url

            if (isNaN(componentName)) { components[componentName] = vueComponentLoader.load(componentURL, componentName) } else { components[componentName] = Vue.component(comp.name, vueComponentLoader.load(componentURL, comp.name)) }
          }
        }
      }
    })
  }

  vueComponentLoader.require = function (moduleName) {
    return window[moduleName]
  }

  vueComponentLoader.httpRequest = function (url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', url)
      xhr.responseType = 'text'

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) { resolve(xhr.responseText) } else { reject(xhr.status) }
        }
      }

      xhr.send(null)
    })
  }

  vueComponentLoader.langProcessor = {
    html: identity,
    js: identity,
    css: identity
  }

  vueComponentLoader.scriptExportsHandler = identity

  function vueComponentLoader (content, name) {
    return vueComponentLoader.load(content, name)
  }

  return vueComponentLoader
})

export const loader = obj.vueLoader
