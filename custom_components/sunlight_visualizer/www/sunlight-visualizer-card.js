/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xs = globalThis, Cn = xs.ShadowRoot && (xs.ShadyCSS === void 0 || xs.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, kn = Symbol(), Ci = /* @__PURE__ */ new WeakMap();
let Oi = class {
  constructor(e, o, l) {
    if (this._$cssResult$ = !0, l !== kn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = o;
  }
  get styleSheet() {
    let e = this.o;
    const o = this.t;
    if (Cn && e === void 0) {
      const l = o !== void 0 && o.length === 1;
      l && (e = Ci.get(o)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), l && Ci.set(o, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Fc = ($) => new Oi(typeof $ == "string" ? $ : $ + "", void 0, kn), Hi = ($, ...e) => {
  const o = $.length === 1 ? $[0] : e.reduce((l, h, _) => l + ((y) => {
    if (y._$cssResult$ === !0) return y.cssText;
    if (typeof y == "number") return y;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + y + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(h) + $[_ + 1], $[0]);
  return new Oi(o, $, kn);
}, Bc = ($, e) => {
  if (Cn) $.adoptedStyleSheets = e.map((o) => o instanceof CSSStyleSheet ? o : o.styleSheet);
  else for (const o of e) {
    const l = document.createElement("style"), h = xs.litNonce;
    h !== void 0 && l.setAttribute("nonce", h), l.textContent = o.cssText, $.appendChild(l);
  }
}, ki = Cn ? ($) => $ : ($) => $ instanceof CSSStyleSheet ? ((e) => {
  let o = "";
  for (const l of e.cssRules) o += l.cssText;
  return Fc(o);
})($) : $;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Dc, defineProperty: zc, getOwnPropertyDescriptor: Lc, getOwnPropertyNames: Wc, getOwnPropertySymbols: Ic, getPrototypeOf: Oc } = Object, zt = globalThis, Ei = zt.trustedTypes, Hc = Ei ? Ei.emptyScript : "", yn = zt.reactiveElementPolyfillSupport, ue = ($, e) => $, xn = { toAttribute($, e) {
  switch (e) {
    case Boolean:
      $ = $ ? Hc : null;
      break;
    case Object:
    case Array:
      $ = $ == null ? $ : JSON.stringify($);
  }
  return $;
}, fromAttribute($, e) {
  let o = $;
  switch (e) {
    case Boolean:
      o = $ !== null;
      break;
    case Number:
      o = $ === null ? null : Number($);
      break;
    case Object:
    case Array:
      try {
        o = JSON.parse($);
      } catch {
        o = null;
      }
  }
  return o;
} }, Ui = ($, e) => !Dc($, e), Ni = { attribute: !0, type: String, converter: xn, reflect: !1, useDefault: !1, hasChanged: Ui };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), zt.litPropertyMetadata ?? (zt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let So = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, o = Ni) {
    if (o.state && (o.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((o = Object.create(o)).wrapped = !0), this.elementProperties.set(e, o), !o.noAccessor) {
      const l = Symbol(), h = this.getPropertyDescriptor(e, l, o);
      h !== void 0 && zc(this.prototype, e, h);
    }
  }
  static getPropertyDescriptor(e, o, l) {
    const { get: h, set: _ } = Lc(this.prototype, e) ?? { get() {
      return this[o];
    }, set(y) {
      this[o] = y;
    } };
    return { get: h, set(y) {
      const F = h == null ? void 0 : h.call(this);
      _ == null || _.call(this, y), this.requestUpdate(e, F, l);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ni;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ue("elementProperties"))) return;
    const e = Oc(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ue("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ue("properties"))) {
      const o = this.properties, l = [...Wc(o), ...Ic(o)];
      for (const h of l) this.createProperty(h, o[h]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const o = litPropertyMetadata.get(e);
      if (o !== void 0) for (const [l, h] of o) this.elementProperties.set(l, h);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [o, l] of this.elementProperties) {
      const h = this._$Eu(o, l);
      h !== void 0 && this._$Eh.set(h, o);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const o = [];
    if (Array.isArray(e)) {
      const l = new Set(e.flat(1 / 0).reverse());
      for (const h of l) o.unshift(ki(h));
    } else e !== void 0 && o.push(ki(e));
    return o;
  }
  static _$Eu(e, o) {
    const l = o.attribute;
    return l === !1 ? void 0 : typeof l == "string" ? l : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((o) => this.enableUpdating = o), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((o) => o(this));
  }
  addController(e) {
    var o;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((o = e.hostConnected) == null || o.call(e));
  }
  removeController(e) {
    var o;
    (o = this._$EO) == null || o.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), o = this.constructor.elementProperties;
    for (const l of o.keys()) this.hasOwnProperty(l) && (e.set(l, this[l]), delete this[l]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Bc(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((o) => {
      var l;
      return (l = o.hostConnected) == null ? void 0 : l.call(o);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((o) => {
      var l;
      return (l = o.hostDisconnected) == null ? void 0 : l.call(o);
    });
  }
  attributeChangedCallback(e, o, l) {
    this._$AK(e, l);
  }
  _$ET(e, o) {
    var _;
    const l = this.constructor.elementProperties.get(e), h = this.constructor._$Eu(e, l);
    if (h !== void 0 && l.reflect === !0) {
      const y = (((_ = l.converter) == null ? void 0 : _.toAttribute) !== void 0 ? l.converter : xn).toAttribute(o, l.type);
      this._$Em = e, y == null ? this.removeAttribute(h) : this.setAttribute(h, y), this._$Em = null;
    }
  }
  _$AK(e, o) {
    var _, y;
    const l = this.constructor, h = l._$Eh.get(e);
    if (h !== void 0 && this._$Em !== h) {
      const F = l.getPropertyOptions(h), C = typeof F.converter == "function" ? { fromAttribute: F.converter } : ((_ = F.converter) == null ? void 0 : _.fromAttribute) !== void 0 ? F.converter : xn;
      this._$Em = h;
      const W = C.fromAttribute(o, F.type);
      this[h] = W ?? ((y = this._$Ej) == null ? void 0 : y.get(h)) ?? W, this._$Em = null;
    }
  }
  requestUpdate(e, o, l, h = !1, _) {
    var y;
    if (e !== void 0) {
      const F = this.constructor;
      if (h === !1 && (_ = this[e]), l ?? (l = F.getPropertyOptions(e)), !((l.hasChanged ?? Ui)(_, o) || l.useDefault && l.reflect && _ === ((y = this._$Ej) == null ? void 0 : y.get(e)) && !this.hasAttribute(F._$Eu(e, l)))) return;
      this.C(e, o, l);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, o, { useDefault: l, reflect: h, wrapped: _ }, y) {
    l && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, y ?? o ?? this[e]), _ !== !0 || y !== void 0) || (this._$AL.has(e) || (this.hasUpdated || l || (o = void 0), this._$AL.set(e, o)), h === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (o) {
      Promise.reject(o);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var l;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [_, y] of this._$Ep) this[_] = y;
        this._$Ep = void 0;
      }
      const h = this.constructor.elementProperties;
      if (h.size > 0) for (const [_, y] of h) {
        const { wrapped: F } = y, C = this[_];
        F !== !0 || this._$AL.has(_) || C === void 0 || this.C(_, void 0, y, C);
      }
    }
    let e = !1;
    const o = this._$AL;
    try {
      e = this.shouldUpdate(o), e ? (this.willUpdate(o), (l = this._$EO) == null || l.forEach((h) => {
        var _;
        return (_ = h.hostUpdate) == null ? void 0 : _.call(h);
      }), this.update(o)) : this._$EM();
    } catch (h) {
      throw e = !1, this._$EM(), h;
    }
    e && this._$AE(o);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var o;
    (o = this._$EO) == null || o.forEach((l) => {
      var h;
      return (h = l.hostUpdated) == null ? void 0 : h.call(l);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((o) => this._$ET(o, this[o]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
So.elementStyles = [], So.shadowRootOptions = { mode: "open" }, So[ue("elementProperties")] = /* @__PURE__ */ new Map(), So[ue("finalized")] = /* @__PURE__ */ new Map(), yn == null || yn({ ReactiveElement: So }), (zt.reactiveElementVersions ?? (zt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fe = globalThis, Ai = ($) => $, vs = fe.trustedTypes, Pi = vs ? vs.createPolicy("lit-html", { createHTML: ($) => $ }) : void 0, Vi = "$lit$", Dt = `lit$${Math.random().toFixed(9).slice(2)}$`, ji = "?" + Dt, Uc = `<${ji}>`, Jt = document, de = () => Jt.createComment(""), pe = ($) => $ === null || typeof $ != "object" && typeof $ != "function", En = Array.isArray, Vc = ($) => En($) || typeof ($ == null ? void 0 : $[Symbol.iterator]) == "function", _n = `[ 	
\f\r]`, he = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ti = /-->/g, Fi = />/g, Xt = RegExp(`>|${_n}(?:([^\\s"'>=/]+)(${_n}*=${_n}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Bi = /'/g, Di = /"/g, Gi = /^(?:script|style|textarea|title)$/i, jc = ($) => (e, ...o) => ({ _$litType$: $, strings: e, values: o }), Rs = jc(1), Qt = Symbol.for("lit-noChange"), Y = Symbol.for("lit-nothing"), zi = /* @__PURE__ */ new WeakMap(), Zt = Jt.createTreeWalker(Jt, 129);
function Yi($, e) {
  if (!En($) || !$.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Pi !== void 0 ? Pi.createHTML(e) : e;
}
const Gc = ($, e) => {
  const o = $.length - 1, l = [];
  let h, _ = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", y = he;
  for (let F = 0; F < o; F++) {
    const C = $[F];
    let W, H, T = -1, K = 0;
    for (; K < C.length && (y.lastIndex = K, H = y.exec(C), H !== null); ) K = y.lastIndex, y === he ? H[1] === "!--" ? y = Ti : H[1] !== void 0 ? y = Fi : H[2] !== void 0 ? (Gi.test(H[2]) && (h = RegExp("</" + H[2], "g")), y = Xt) : H[3] !== void 0 && (y = Xt) : y === Xt ? H[0] === ">" ? (y = h ?? he, T = -1) : H[1] === void 0 ? T = -2 : (T = y.lastIndex - H[2].length, W = H[1], y = H[3] === void 0 ? Xt : H[3] === '"' ? Di : Bi) : y === Di || y === Bi ? y = Xt : y === Ti || y === Fi ? y = he : (y = Xt, h = void 0);
    const k = y === Xt && $[F + 1].startsWith("/>") ? " " : "";
    _ += y === he ? C + Uc : T >= 0 ? (l.push(W), C.slice(0, T) + Vi + C.slice(T) + Dt + k) : C + Dt + (T === -2 ? F : k);
  }
  return [Yi($, _ + ($[o] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), l];
};
class me {
  constructor({ strings: e, _$litType$: o }, l) {
    let h;
    this.parts = [];
    let _ = 0, y = 0;
    const F = e.length - 1, C = this.parts, [W, H] = Gc(e, o);
    if (this.el = me.createElement(W, l), Zt.currentNode = this.el.content, o === 2 || o === 3) {
      const T = this.el.content.firstChild;
      T.replaceWith(...T.childNodes);
    }
    for (; (h = Zt.nextNode()) !== null && C.length < F; ) {
      if (h.nodeType === 1) {
        if (h.hasAttributes()) for (const T of h.getAttributeNames()) if (T.endsWith(Vi)) {
          const K = H[y++], k = h.getAttribute(T).split(Dt), tt = /([.?@])?(.*)/.exec(K);
          C.push({ type: 1, index: _, name: tt[2], strings: k, ctor: tt[1] === "." ? qc : tt[1] === "?" ? Xc : tt[1] === "@" ? Zc : Ms }), h.removeAttribute(T);
        } else T.startsWith(Dt) && (C.push({ type: 6, index: _ }), h.removeAttribute(T));
        if (Gi.test(h.tagName)) {
          const T = h.textContent.split(Dt), K = T.length - 1;
          if (K > 0) {
            h.textContent = vs ? vs.emptyScript : "";
            for (let k = 0; k < K; k++) h.append(T[k], de()), Zt.nextNode(), C.push({ type: 2, index: ++_ });
            h.append(T[K], de());
          }
        }
      } else if (h.nodeType === 8) if (h.data === ji) C.push({ type: 2, index: _ });
      else {
        let T = -1;
        for (; (T = h.data.indexOf(Dt, T + 1)) !== -1; ) C.push({ type: 7, index: _ }), T += Dt.length - 1;
      }
      _++;
    }
  }
  static createElement(e, o) {
    const l = Jt.createElement("template");
    return l.innerHTML = e, l;
  }
}
function vo($, e, o = $, l) {
  var y, F;
  if (e === Qt) return e;
  let h = l !== void 0 ? (y = o._$Co) == null ? void 0 : y[l] : o._$Cl;
  const _ = pe(e) ? void 0 : e._$litDirective$;
  return (h == null ? void 0 : h.constructor) !== _ && ((F = h == null ? void 0 : h._$AO) == null || F.call(h, !1), _ === void 0 ? h = void 0 : (h = new _($), h._$AT($, o, l)), l !== void 0 ? (o._$Co ?? (o._$Co = []))[l] = h : o._$Cl = h), h !== void 0 && (e = vo($, h._$AS($, e.values), h, l)), e;
}
class Yc {
  constructor(e, o) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = o;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: o }, parts: l } = this._$AD, h = ((e == null ? void 0 : e.creationScope) ?? Jt).importNode(o, !0);
    Zt.currentNode = h;
    let _ = Zt.nextNode(), y = 0, F = 0, C = l[0];
    for (; C !== void 0; ) {
      if (y === C.index) {
        let W;
        C.type === 2 ? W = new be(_, _.nextSibling, this, e) : C.type === 1 ? W = new C.ctor(_, C.name, C.strings, this, e) : C.type === 6 && (W = new Kc(_, this, e)), this._$AV.push(W), C = l[++F];
      }
      y !== (C == null ? void 0 : C.index) && (_ = Zt.nextNode(), y++);
    }
    return Zt.currentNode = Jt, h;
  }
  p(e) {
    let o = 0;
    for (const l of this._$AV) l !== void 0 && (l.strings !== void 0 ? (l._$AI(e, l, o), o += l.strings.length - 2) : l._$AI(e[o])), o++;
  }
}
class be {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, o, l, h) {
    this.type = 2, this._$AH = Y, this._$AN = void 0, this._$AA = e, this._$AB = o, this._$AM = l, this.options = h, this._$Cv = (h == null ? void 0 : h.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const o = this._$AM;
    return o !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = o.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, o = this) {
    e = vo(this, e, o), pe(e) ? e === Y || e == null || e === "" ? (this._$AH !== Y && this._$AR(), this._$AH = Y) : e !== this._$AH && e !== Qt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Vc(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== Y && pe(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Jt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var _;
    const { values: o, _$litType$: l } = e, h = typeof l == "number" ? this._$AC(e) : (l.el === void 0 && (l.el = me.createElement(Yi(l.h, l.h[0]), this.options)), l);
    if (((_ = this._$AH) == null ? void 0 : _._$AD) === h) this._$AH.p(o);
    else {
      const y = new Yc(h, this), F = y.u(this.options);
      y.p(o), this.T(F), this._$AH = y;
    }
  }
  _$AC(e) {
    let o = zi.get(e.strings);
    return o === void 0 && zi.set(e.strings, o = new me(e)), o;
  }
  k(e) {
    En(this._$AH) || (this._$AH = [], this._$AR());
    const o = this._$AH;
    let l, h = 0;
    for (const _ of e) h === o.length ? o.push(l = new be(this.O(de()), this.O(de()), this, this.options)) : l = o[h], l._$AI(_), h++;
    h < o.length && (this._$AR(l && l._$AB.nextSibling, h), o.length = h);
  }
  _$AR(e = this._$AA.nextSibling, o) {
    var l;
    for ((l = this._$AP) == null ? void 0 : l.call(this, !1, !0, o); e !== this._$AB; ) {
      const h = Ai(e).nextSibling;
      Ai(e).remove(), e = h;
    }
  }
  setConnected(e) {
    var o;
    this._$AM === void 0 && (this._$Cv = e, (o = this._$AP) == null || o.call(this, e));
  }
}
class Ms {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, o, l, h, _) {
    this.type = 1, this._$AH = Y, this._$AN = void 0, this.element = e, this.name = o, this._$AM = h, this.options = _, l.length > 2 || l[0] !== "" || l[1] !== "" ? (this._$AH = Array(l.length - 1).fill(new String()), this.strings = l) : this._$AH = Y;
  }
  _$AI(e, o = this, l, h) {
    const _ = this.strings;
    let y = !1;
    if (_ === void 0) e = vo(this, e, o, 0), y = !pe(e) || e !== this._$AH && e !== Qt, y && (this._$AH = e);
    else {
      const F = e;
      let C, W;
      for (e = _[0], C = 0; C < _.length - 1; C++) W = vo(this, F[l + C], o, C), W === Qt && (W = this._$AH[C]), y || (y = !pe(W) || W !== this._$AH[C]), W === Y ? e = Y : e !== Y && (e += (W ?? "") + _[C + 1]), this._$AH[C] = W;
    }
    y && !h && this.j(e);
  }
  j(e) {
    e === Y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class qc extends Ms {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === Y ? void 0 : e;
  }
}
class Xc extends Ms {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== Y);
  }
}
class Zc extends Ms {
  constructor(e, o, l, h, _) {
    super(e, o, l, h, _), this.type = 5;
  }
  _$AI(e, o = this) {
    if ((e = vo(this, e, o, 0) ?? Y) === Qt) return;
    const l = this._$AH, h = e === Y && l !== Y || e.capture !== l.capture || e.once !== l.once || e.passive !== l.passive, _ = e !== Y && (l === Y || h);
    h && this.element.removeEventListener(this.name, this, l), _ && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var o;
    typeof this._$AH == "function" ? this._$AH.call(((o = this.options) == null ? void 0 : o.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Kc {
  constructor(e, o, l) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = o, this.options = l;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    vo(this, e);
  }
}
const wn = fe.litHtmlPolyfillSupport;
wn == null || wn(me, be), (fe.litHtmlVersions ?? (fe.litHtmlVersions = [])).push("3.3.2");
const Jc = ($, e, o) => {
  const l = (o == null ? void 0 : o.renderBefore) ?? e;
  let h = l._$litPart$;
  if (h === void 0) {
    const _ = (o == null ? void 0 : o.renderBefore) ?? null;
    l._$litPart$ = h = new be(e.insertBefore(de(), _), _, void 0, o ?? {});
  }
  return h._$AI($), h;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kt = globalThis;
let xo = class extends So {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var o;
    const e = super.createRenderRoot();
    return (o = this.renderOptions).renderBefore ?? (o.renderBefore = e.firstChild), e;
  }
  update(e) {
    const o = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Jc(o, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return Qt;
  }
};
var Ii;
xo._$litElement$ = !0, xo.finalized = !0, (Ii = Kt.litElementHydrateSupport) == null || Ii.call(Kt, { LitElement: xo });
const Sn = Kt.litElementPolyfillSupport;
Sn == null || Sn({ LitElement: xo });
(Kt.litElementVersions ?? (Kt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qc = { CHILD: 2 }, th = ($) => (...e) => ({ _$litDirective$: $, values: e });
class oh {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, o, l) {
    this._$Ct = e, this._$AM = o, this._$Ci = l;
  }
  _$AS(e, o) {
    return this.update(e, o);
  }
  update(e, o) {
    return this.render(...o);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class vn extends oh {
  constructor(e) {
    if (super(e), this.it = Y, e.type !== Qc.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === Y || e == null) return this._t = void 0, this.it = e;
    if (e === Qt) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const o = [e];
    return o.raw = o, this._t = { _$litType$: this.constructor.resultType, strings: o, values: [] };
  }
}
vn.directiveName = "unsafeHTML", vn.resultType = 1;
const eh = th(vn), Nn = class Nn extends xo {
  constructor() {
    super(...arguments), this._config = {};
  }
  setConfig(e) {
    this._config = e || {};
  }
  set hass(e) {
    this._hass = e, this.requestUpdate();
  }
  _setConfigValue(e, o) {
    if (!this._config) return;
    const l = { ...this._config };
    o === "" || o === void 0 || o === null ? delete l[e] : l[e] = o, this._config = l, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: l },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _valueChanged(e) {
    var _;
    const o = e.target, l = o == null ? void 0 : o.configValue;
    if (!l) return;
    let h = ((_ = e.detail) == null ? void 0 : _.value) ?? o.value;
    if (o.checked !== void 0 && (h = o.checked), o.type === "number") {
      const y = Number(h);
      Number.isNaN(y) || (h = y);
    }
    this._setConfigValue(l, h);
  }
  _setNumberEntityValue(e, o) {
    !this._hass || !e || this._hass.callService("number", "set_value", { entity_id: e, value: o });
  }
  _setSelectEntityOption(e, o) {
    !this._hass || !e || !o || this._hass.callService("select", "select_option", { entity_id: e, option: o });
  }
  _setIntegrationOptions(e) {
    this._hass && this._hass.callService("sunlight_visualizer", "set_options", e);
  }
  render() {
    var ko, Eo, No, lt, Ao, ao, we, Se, xe, ve, Re, Po, To, Ns, Fo, Me, io, kt, Et, ro, bt, gt, Lt, Nt, D, lo, co, Ce, ke, _t, wt, Ee, Ne, Ae, Bo, Do, zo, Pe, Lo, Te, Fe, Be, De, ze, Le, We, Wo, Ie, Oe, Io, He, Ue, ho, Ve, je, Oo, Ho, Uo, Vo, Ge, Ye, qe, Xe, Ze, Ke, Je, Qe, ts, os, es, ss, ns, as, jo, Go, uo, is, rs, ls, cs, St, Yo, fo;
    if (!this._hass) return Rs``;
    const e = this._config || {}, o = e.siSourceAttr ?? "sunlight_visualizer_source", l = e.siSourceValue ?? "sunlight_visualizer", h = Object.entries(this._hass.states ?? {}).filter(
      ([, M]) => {
        var E;
        return ((E = M == null ? void 0 : M.attributes) == null ? void 0 : E[o]) === l;
      }
    ), _ = (M) => {
      for (const [E, I] of h)
        if (M(I, E)) return E;
      return null;
    }, y = (M) => _((E) => {
      var I;
      return ((I = E == null ? void 0 : E.attributes) == null ? void 0 : I.camera_rotation) === M;
    }), F = (M) => _((E) => {
      var I;
      return ((I = E == null ? void 0 : E.attributes) == null ? void 0 : I.si_setting) === M;
    }), C = e.rotationHEntity ?? y("h") ?? "", W = e.rotationVEntity ?? y("v") ?? "", H = e.houseAngleEntity ?? F("house_angle") ?? "", T = F("ceiling_tilt") ?? "", K = F("house_direction") ?? "", k = F("roof_direction") ?? "", tt = (M, E = !1) => {
      if (M == null || M === "") return E;
      if (typeof M == "boolean") return M;
      if (typeof M == "number") return M !== 0;
      if (typeof M == "string") {
        const I = M.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(I)) return !0;
        if (["false", "0", "no", "off"].includes(I)) return !1;
      }
      return E;
    };
    let to = "", oo, eo;
    for (const [, M] of h)
      !to && ((ko = M == null ? void 0 : M.attributes) != null && ko.roof_power_entity) && (to = M.attributes.roof_power_entity), oo === void 0 && ((Eo = M == null ? void 0 : M.attributes) == null ? void 0 : Eo.roof_power_enabled) !== void 0 && (oo = M.attributes.roof_power_enabled), eo === void 0 && ((No = M == null ? void 0 : M.attributes) == null ? void 0 : No.roof_power_invert) !== void 0 && (eo = M.attributes.roof_power_invert);
    const so = e.preferIntegrationSettings ?? !0, ot = h.length > 0, it = so ? to || e.roofPowerEntity || "" : e.roofPowerEntity || to || "", Cs = so ? tt(oo, tt(e.roofPowerEnabled, !1)) : tt(e.roofPowerEnabled, tt(oo, !1)), ks = so ? tt(eo, tt(e.roofPowerInvert, !1)) : tt(e.roofPowerInvert, tt(eo, !1)), Ct = Number((ao = (Ao = (lt = h.find(([, M]) => {
      var E;
      return ((E = M == null ? void 0 : M.attributes) == null ? void 0 : E.auto_rotate_speed) != null;
    })) == null ? void 0 : lt[1]) == null ? void 0 : Ao.attributes) == null ? void 0 : ao.auto_rotate_speed), et = so && Number.isFinite(Ct) ? Ct : Number(e.autoRotateSpeed ?? (Number.isFinite(Ct) ? Ct : 10));
    Number(((xe = (Se = (we = this._hass) == null ? void 0 : we.states) == null ? void 0 : Se[H]) == null ? void 0 : xe.state) ?? e.houseAngle ?? 0);
    const ge = ["North", "NE", "East", "SE", "South", "SW", "West", "NW", "Custom"], $e = ["front", "back", "left", "right"], Ro = !!K, Mo = !!k, Es = Ro ? ((To = (Po = (Re = (ve = this._hass) == null ? void 0 : ve.states) == null ? void 0 : Re[K]) == null ? void 0 : Po.attributes) == null ? void 0 : To.options) ?? ge : ge, rt = Mo ? ((io = (Me = (Fo = (Ns = this._hass) == null ? void 0 : Ns.states) == null ? void 0 : Fo[k]) == null ? void 0 : Me.attributes) == null ? void 0 : io.options) ?? $e : $e, no = Ro ? ((ro = (Et = (kt = this._hass) == null ? void 0 : kt.states) == null ? void 0 : Et[K]) == null ? void 0 : ro.state) ?? "Custom" : e.houseDirection ?? "Custom", mt = Mo ? ((Lt = (gt = (bt = this._hass) == null ? void 0 : bt.states) == null ? void 0 : gt[k]) == null ? void 0 : Lt.state) ?? "front" : e.roofTiltFace ?? "front", Co = !!C, ye = !!W, _e = !!T;
    return Rs`
      <div class="section">
        <div class="title">Size</div>
        <div class="row">
          <ha-textfield
            label="Card width (px)"
            type="number"
            .value=${String(e.cardWidth ?? 450)}
            .configValue=${"cardWidth"}
            @change=${this._valueChanged}
          ></ha-textfield>
          <ha-textfield
            label="Card height (px)"
            type="number"
            .value=${String(e.cardHeight ?? 450)}
            .configValue=${"cardHeight"}
            @change=${this._valueChanged}
          ></ha-textfield>
        </div>
      </div>

      <div class="section">
        <div class="title">House & Roof</div>
        <div class="row">
          <div>
            <div class="slider-label">House angle</div>
            <ha-slider
              .value=${Number(((lo = (D = (Nt = this._hass) == null ? void 0 : Nt.states) == null ? void 0 : D[H]) == null ? void 0 : lo.state) ?? 0)}
              .min=${Number(((_t = (ke = (Ce = (co = this._hass) == null ? void 0 : co.states) == null ? void 0 : Ce[H]) == null ? void 0 : ke.attributes) == null ? void 0 : _t.min) ?? 0)}
              .max=${Number(((Ae = (Ne = (Ee = (wt = this._hass) == null ? void 0 : wt.states) == null ? void 0 : Ee[H]) == null ? void 0 : Ne.attributes) == null ? void 0 : Ae.max) ?? 359)}
              .step=${Number(((Pe = (zo = (Do = (Bo = this._hass) == null ? void 0 : Bo.states) == null ? void 0 : Do[H]) == null ? void 0 : zo.attributes) == null ? void 0 : Pe.step) ?? 1)}
              @change=${(M) => {
      var E;
      return this._setNumberEntityValue(H, Number(((E = M.target) == null ? void 0 : E.value) ?? 0));
    }}
              .disabled=${!H}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"House direction"}
              .selector=${{ select: { options: Es, mode: "dropdown" } }}
              .value=${no}
              @value-changed=${(M) => {
      var I;
      const E = ((I = M.detail) == null ? void 0 : I.value) ?? no;
      Ro ? (this._setSelectEntityOption(K, E), this._setConfigValue("houseDirection", void 0)) : this._setConfigValue("houseDirection", E);
    }}
            ></ha-selector>
            <div class="helper">Quick preset for the house front orientation</div>
          </div>
        </div>
        <div class="row">
          <div>
            <div class="slider-label">Ceiling tilt</div>
            <ha-slider
              .value=${Number(((Fe = (Te = (Lo = this._hass) == null ? void 0 : Lo.states) == null ? void 0 : Te[T]) == null ? void 0 : Fe.state) ?? 0)}
              .min=${Number(((Le = (ze = (De = (Be = this._hass) == null ? void 0 : Be.states) == null ? void 0 : De[T]) == null ? void 0 : ze.attributes) == null ? void 0 : Le.min) ?? 0)}
              .max=${Number(((Oe = (Ie = (Wo = (We = this._hass) == null ? void 0 : We.states) == null ? void 0 : Wo[T]) == null ? void 0 : Ie.attributes) == null ? void 0 : Oe.max) ?? 90)}
              .step=${Number(((ho = (Ue = (He = (Io = this._hass) == null ? void 0 : Io.states) == null ? void 0 : He[T]) == null ? void 0 : Ue.attributes) == null ? void 0 : ho.step) ?? 1)}
              @change=${(M) => {
      var E;
      return this._setNumberEntityValue(T, Number(((E = M.target) == null ? void 0 : E.value) ?? 0));
    }}
              .disabled=${!_e}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"Roof direction"}
              .selector=${{ select: { options: rt, mode: "dropdown" } }}
              .value=${mt}
              @value-changed=${(M) => {
      var I;
      const E = ((I = M.detail) == null ? void 0 : I.value) ?? mt;
      Mo ? (this._setSelectEntityOption(k, E), this._setConfigValue("roofTiltFace", void 0)) : this._setConfigValue("roofTiltFace", E);
    }}
            ></ha-selector>
            <div class="helper">Which side the roof slopes down toward</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="title">Camera rotation</div>
        <div class="row">
          <div>
            <div class="slider-label">Camera rotation H</div>
            <ha-slider
              .value=${Number(((Oo = (je = (Ve = this._hass) == null ? void 0 : Ve.states) == null ? void 0 : je[C]) == null ? void 0 : Oo.state) ?? 0)}
              .min=${Number(((Ge = (Vo = (Uo = (Ho = this._hass) == null ? void 0 : Ho.states) == null ? void 0 : Uo[C]) == null ? void 0 : Vo.attributes) == null ? void 0 : Ge.min) ?? 0)}
              .max=${Number(((Ze = (Xe = (qe = (Ye = this._hass) == null ? void 0 : Ye.states) == null ? void 0 : qe[C]) == null ? void 0 : Xe.attributes) == null ? void 0 : Ze.max) ?? 359)}
              .step=${Number(((ts = (Qe = (Je = (Ke = this._hass) == null ? void 0 : Ke.states) == null ? void 0 : Je[C]) == null ? void 0 : Qe.attributes) == null ? void 0 : ts.step) ?? 1)}
              @change=${(M) => {
      var E;
      return this._setNumberEntityValue(C, Number(((E = M.target) == null ? void 0 : E.value) ?? 0));
    }}
              .disabled=${!Co}
            ></ha-slider>
          </div>
          <div>
            <div class="slider-label">Camera rotation V</div>
            <ha-slider
              .value=${Number(((ss = (es = (os = this._hass) == null ? void 0 : os.states) == null ? void 0 : es[W]) == null ? void 0 : ss.state) ?? 0)}
              .min=${Number(((Go = (jo = (as = (ns = this._hass) == null ? void 0 : ns.states) == null ? void 0 : as[W]) == null ? void 0 : jo.attributes) == null ? void 0 : Go.min) ?? 0)}
              .max=${Number(((ls = (rs = (is = (uo = this._hass) == null ? void 0 : uo.states) == null ? void 0 : is[W]) == null ? void 0 : rs.attributes) == null ? void 0 : ls.max) ?? 90)}
              .step=${Number(((fo = (Yo = (St = (cs = this._hass) == null ? void 0 : cs.states) == null ? void 0 : St[W]) == null ? void 0 : Yo.attributes) == null ? void 0 : fo.step) ?? 1)}
              @change=${(M) => {
      var E;
      return this._setNumberEntityValue(W, Number(((E = M.target) == null ? void 0 : E.value) ?? 0));
    }}
              .disabled=${!ye}
            ></ha-slider>
          </div>
        </div>
        <div class="row">
          <div>${C || "Camera rotation H not found"}</div>
          <div>${W || "Camera rotation V not found"}</div>
        </div>
      </div>

      <div class="section">
        <div class="title">Roof power</div>
        <div class="row single">
          <ha-selector
            .hass=${this._hass}
            .selector=${{ entity: { domain: ["sensor", "number", "input_number"] } }}
            .value=${it}
            @value-changed=${(M) => {
      var I;
      const E = (I = M.detail) == null ? void 0 : I.value;
      ot ? (this._setIntegrationOptions({ roof_power_entity: E || null }), this._setConfigValue("roofPowerEntity", void 0)) : this._setConfigValue("roofPowerEntity", E);
    }}
          ></ha-selector>
        </div>
        <div class="row single">
          <div class="switch-row">
            <span>Enable power label</span>
            <ha-switch
              .checked=${Cs ?? !1}
              @change=${(M) => {
      var I;
      const E = !!((I = M.target) != null && I.checked);
      ot ? (this._setIntegrationOptions({ roof_power_enabled: E }), this._setConfigValue("roofPowerEnabled", void 0)) : this._setConfigValue("roofPowerEnabled", E);
    }}
            ></ha-switch>
          </div>
          <div class="switch-row">
            <span>Invert power value</span>
            <ha-switch
              .checked=${ks ?? !1}
              @change=${(M) => {
      var I;
      const E = !!((I = M.target) != null && I.checked);
      ot ? (this._setIntegrationOptions({ roof_power_invert: E }), this._setConfigValue("roofPowerInvert", void 0)) : this._setConfigValue("roofPowerInvert", E);
    }}
            ></ha-switch>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="title">Auto‑rotate</div>
        <div class="row">
          <ha-textfield
            label="Speed (deg/sec)"
            type="number"
            .value=${String(et)}
            min="1"
            max="90"
            step="1"
            .configValue=${"autoRotateSpeed"}
            @change=${(M) => {
      var hs, qo;
      const E = ((hs = M == null ? void 0 : M.detail) == null ? void 0 : hs.value) ?? ((qo = M == null ? void 0 : M.target) == null ? void 0 : qo.value);
      let I = Math.round(Number(E));
      Number.isNaN(I) || (I = Math.min(90, Math.max(1, I)), ot ? (this._setIntegrationOptions({ auto_rotate_speed: I }), this._setConfigValue("autoRotateSpeed", void 0)) : this._setConfigValue("autoRotateSpeed", I));
    }}
          ></ha-textfield>
        </div>
      </div>
    `;
  }
};
Nn.styles = Hi`
    :host {
      display: block;
      padding: 16px;
      box-sizing: border-box;
    }
    .section {
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--divider-color, #333);
    }
    .section:last-child {
      border-bottom: none;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .row.single {
      grid-template-columns: 1fr;
    }
    .title {
      font-weight: 600;
      margin-bottom: 10px;
    }
    ha-textfield,
    ha-select,
    ha-entity-picker {
      width: 100%;
    }
    .switch-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 6px 0;
    }
    .slider-label {
      font-size: 12px;
      opacity: 0.7;
      margin-bottom: 4px;
    }
    .helper {
      font-size: 12px;
      opacity: 0.7;
      margin-top: 4px;
    }
  `;
let Rn = Nn;
const Li = "sunlight-visualizer-card-editor";
if (!customElements.get(Li))
  try {
    customElements.define(Li, Rn);
  } catch {
  }
const An = class An extends xo {
  constructor() {
    super(...arguments), this._config = {};
  }
  static getConfigElement() {
    return document.createElement("sunlight-visualizer-card-editor");
  }
  static getStubConfig() {
    return {
      cardWidth: 450,
      cardHeight: 450,
      autoRotateEnabledDefault: !1,
      autoRotateSpeed: 10
    };
  }
  setConfig(e) {
    this._config = e || {};
  }
  set hass(e) {
    this._hass = e, this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null), this._cssFpsRaf && (cancelAnimationFrame(this._cssFpsRaf), this._cssFpsRaf = null);
  }
  getCardSize() {
    return 4;
  }
  render() {
    if (!this._hass)
      return Rs`<ha-card></ha-card>`;
    const e = this._config || {}, o = Number(e.cardWidth ?? 450), l = Number(e.cardHeight ?? 450), h = this.renderSvg();
    return Rs`<div class="wrap"><ha-card style="width:${o}px; height:${l}px;">${eh(h)}</ha-card></div>`;
  }
  renderSvg() {
    var si, ni, ai, ii, ri, li, ci, hi, ui, fi, di, pi, mi, bi, gi, $i;
    const e = this._hass, o = this._config || {}, l = o.siSourceAttr ?? "sunlight_visualizer_source", h = o.siSourceValue ?? "sunlight_visualizer", _ = Object.entries(e.states ?? {}).filter(
      ([, t]) => {
        var s;
        return ((s = t == null ? void 0 : t.attributes) == null ? void 0 : s[l]) === h;
      }
    ), y = (t) => {
      for (const [s, n] of _)
        if (t(n, s)) return [s, n];
      return null;
    }, F = (t) => {
      const s = y((n) => {
        var a;
        return ((a = n == null ? void 0 : n.attributes) == null ? void 0 : a.wall) === t;
      });
      return s ? s[0] : void 0;
    }, C = (t) => {
      const s = y((n) => {
        var a;
        return ((a = n == null ? void 0 : n.attributes) == null ? void 0 : a.camera_rotation) === t;
      });
      return s ? s[0] : void 0;
    }, W = (t) => {
      const s = y((n) => {
        var a;
        return ((a = n == null ? void 0 : n.attributes) == null ? void 0 : a.si_setting) === t;
      });
      return s ? s[0] : void 0;
    }, H = y(
      (t) => {
        var s, n;
        return ((s = t == null ? void 0 : t.attributes) == null ? void 0 : s.sun_azimuth) != null && ((n = t == null ? void 0 : t.attributes) == null ? void 0 : n.sun_elevation) != null;
      }
    ), T = H ? H[1].attributes : null, K = y(
      (t) => {
        var s, n, a;
        return ((s = t == null ? void 0 : t.attributes) == null ? void 0 : s.roof_direction) != null || ((n = t == null ? void 0 : t.attributes) == null ? void 0 : n.ceiling_tilt) != null || ((a = t == null ? void 0 : t.attributes) == null ? void 0 : a.house_angle) != null;
      }
    ), k = K ? K[1].attributes : null, tt = !!(k != null && k.force_sun_fallback), to = Number(o.cardWidth ?? 450), oo = Number(o.cardHeight ?? 450), eo = to, so = oo, ot = eo, it = so, Cs = ot, ks = it, Ct = ot * 0.1, et = o.floorScale ?? 2.6, ge = ot * 0.5, $e = it * 0.4, Ro = o.floorColor ?? "#2f2f2f", Mo = o.rotationHEntity ?? C("h") ?? "input_number.cube_rotation_h", Es = o.rotationVEntity ?? C("v") ?? "input_number.cube_rotation_v", rt = o.preferIntegrationSettings ?? !0, no = o.houseAngleEntity ?? null;
    let mt = Number(o.houseAngle ?? 0);
    const Co = W("house_angle");
    no && e.states[no] ? mt = Number(((si = e.states[no]) == null ? void 0 : si.state) ?? mt) : Co && e.states[Co] ? mt = Number(((ni = e.states[Co]) == null ? void 0 : ni.state) ?? mt) : (rt || o.houseAngle == null) && (k == null ? void 0 : k.house_angle) != null && (mt = Number(k.house_angle ?? mt));
    const ye = o.wallFrontPctEntity ?? F("front"), _e = o.wallRightPctEntity ?? F("right"), ko = o.wallBackPctEntity ?? F("back"), Eo = o.wallLeftPctEntity ?? F("left"), No = o.roofPctEntity ?? F("ceiling"), lt = (t, s = !1) => {
      if (t == null || t === "") return s;
      if (typeof t == "boolean") return t;
      if (typeof t == "number") return t !== 0;
      if (typeof t == "string") {
        const n = t.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(n)) return !0;
        if (["false", "0", "no", "off"].includes(n)) return !1;
      }
      return s;
    }, Ao = rt ? (k == null ? void 0 : k.roof_power_entity) ?? o.roofPowerEntity ?? null : o.roofPowerEntity ?? (k == null ? void 0 : k.roof_power_entity) ?? null, ao = rt ? lt(k == null ? void 0 : k.roof_power_enabled, lt(o.roofPowerEnabled, !1)) : lt(o.roofPowerEnabled, lt(k == null ? void 0 : k.roof_power_enabled, !1)), we = rt ? lt(k == null ? void 0 : k.roof_power_invert, lt(o.roofPowerInvert, !1)) : lt(o.roofPowerInvert, lt(k == null ? void 0 : k.roof_power_invert, !1)), Se = ye ? Number(((ai = e.states[ye]) == null ? void 0 : ai.state) ?? 0) : 0, xe = _e ? Number(((ii = e.states[_e]) == null ? void 0 : ii.state) ?? 0) : 0, ve = ko ? Number(((ri = e.states[ko]) == null ? void 0 : ri.state) ?? 0) : 0, Re = Eo ? Number(((li = e.states[Eo]) == null ? void 0 : li.state) ?? 0) : 0, Po = No ? Number(((ci = e.states[No]) == null ? void 0 : ci.state) ?? 0) : 0, To = ao && Ao ? Number((hi = e.states[Ao]) == null ? void 0 : hi.state) : NaN, Fo = ao ? ((t) => Number.isFinite(t) ? t >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W` : "0 W")(we ? Math.abs(To) : To) : "", Me = o.useSunEntity ?? !1, io = o.sunEntityId ?? "sun.sun", kt = o.sunAzEntity ?? null, Et = o.sunElEntity ?? null;
    let ro = Number(o.sunDistance ?? 3), bt = Number(o.sunAz ?? 135), gt = Number(o.sunEl ?? 55);
    kt && e.states[kt] && (bt = Number(((ui = e.states[kt]) == null ? void 0 : ui.state) ?? bt)), Et && e.states[Et] && (gt = Number(((fi = e.states[Et]) == null ? void 0 : fi.state) ?? gt)), !kt && rt && (T == null ? void 0 : T.sun_azimuth) != null && (bt = Number(T.sun_azimuth ?? bt)), !Et && rt && (T == null ? void 0 : T.sun_elevation) != null && (gt = Number(T.sun_elevation ?? gt)), !kt && !Et && !T && Me && e.states[io] && (bt = Number(((di = e.states[io].attributes) == null ? void 0 : di.azimuth) ?? bt), gt = Number(((pi = e.states[io].attributes) == null ? void 0 : pi.elevation) ?? gt));
    const Lt = o.roofTiltEnabled ?? !0;
    let Nt = Number(o.roofTiltDeg ?? 25), D = o.roofTiltFace ?? "front";
    const lo = W("ceiling_tilt"), co = W("roof_direction"), Ce = Number(o.roofTiltMax ?? 89), ke = Number(o.roofTiltOpacity ?? 1);
    lo && e.states[lo] ? Nt = Number(((mi = e.states[lo]) == null ? void 0 : mi.state) ?? Nt) : (rt || o.roofTiltDeg == null) && (k == null ? void 0 : k.ceiling_tilt) != null && (Nt = Number(k.ceiling_tilt ?? Nt)), co && e.states[co] ? D = String(((bi = e.states[co]) == null ? void 0 : bi.state) ?? D) : (rt || o.roofTiltFace == null) && (k == null ? void 0 : k.roof_direction) != null && (D = String(k.roof_direction));
    const _t = o.houseStyleV2 ?? !1, wt = o.flatRoofEnabled ?? _t, Ee = Number(o.flatRoofOverhang ?? 0.15), Ne = Number(o.flatRoofThickness ?? 0.12), Ae = Number(o.flatRoofLift ?? 0), Bo = o.flatRoofTopColor ?? "#e6e8ee";
    o.flatRoofEdgeColor;
    const Do = o.flatRoofSideColor ?? "#9ea4af", zo = Number(o.flatRoofSideShade ?? 0.4), Pe = Number(o.flatRoofTopOpacity ?? 1), Lo = Number(o.flatRoofEdgeOpacity ?? 1), Te = Number(o.flatRoofTopDepthBias ?? 0.06), Fe = Number(o.flatRoofSideDepthBias ?? 0.025), Be = Number(o.flatRoofSkirtDepthBias ?? 0.02), De = o.wallWindowsEnabled ?? _t, ze = o.wallWindowFrameColor ?? "rgba(221,228,236,0.98)", Le = o.wallWindowGlassColor ?? "rgba(110,178,212,0.68)", We = o.wallWindowStrokeColor ?? "rgba(62,105,130,0.65)", Wo = Number(o.wallWindowStrokeWidth ?? 1), Ie = o.roofPanelsEnabled ?? _t, Oe = o.roofPanelColor ?? "#2d3f7b", Io = o.roofPanelGridColor ?? "rgba(214,230,255,0.65)", He = o.roofPanelBorderColor ?? "rgba(185,204,234,0.85)", Ue = Number(o.roofPanelBorderWidth ?? 0.9), ho = Math.max(1, Math.round(Number(o.roofPanelsCols ?? 3))), Ve = N(Number(o.roofPanelsWidthFrac ?? 0.9), 0.4, 0.98), je = N(Number(o.roofPanelsGapFrac ?? 0.025), 0, 0.08), Oo = N(Number(o.roofPanelsT0 ?? 0.05), 0, 0.95), Ho = N(Number(o.roofPanelsT1 ?? 0.26), 0.01, 0.98), Uo = Math.max(1, Math.round(Number(o.roofPanelGridCols ?? 5))), Vo = Math.max(1, Math.round(Number(o.roofPanelGridRows ?? 3))), Ge = o.backTreeEnabled ?? _t, Ye = Number(o.backTreeX ?? -2.2), qe = Number(o.backTreeZ ?? -2.2), Xe = Number(o.backTreeScale ?? 1), Ze = o.backTreeLeafColor ?? "#9bc94b", Ke = o.backTreeTrunkColor ?? "#6f4b2a", Je = o.plinthBandEnabled ?? _t, Qe = Number(o.plinthBandHeight ?? 0.06), ts = Number(o.plinthBandMix ?? 0.62), os = o.patioStepEnabled ?? _t, es = Number(o.patioStepDepth ?? 0.24), ss = Number(o.patioStepWidth ?? 1.1), ns = Number(o.patioStepInset ?? 0.02), as = o.patioStepColor ?? "rgba(226,230,235,0.75)", jo = o.patioGridColor ?? "rgba(164,170,182,0.8)", Go = Number(o.patioGridWidth ?? 1), uo = o.shadowEnabled ?? !0, is = Number(o.shadowOpacity ?? 0.35), rs = Number(o.shadowBlur ?? 4), ls = Number(o.shadowContactOpacity ?? 0.12), cs = Number(o.shadowContactBlur ?? 2.5), St = o.shadowColor ?? "#000000", Yo = Number(o.shadowClipInset ?? 0.02), fo = o.baseAnchorShadowEnabled ?? !0, M = Number(o.baseAnchorShadowOpacity ?? 0.65), E = Number(o.baseAnchorShadowBlur ?? 0.2), I = Number(o.baseAnchorShadowSpread ?? 0.05), hs = o.baseAnchorShadowColor ?? "#000000", qo = o.wallBaseShadowEnabled ?? !0, qi = Number(o.wallBaseShadowHeight ?? 0.023), Xi = Number(o.wallBaseShadowOpacity ?? 0.8), Pn = Number(o.wallBaseShadowBlur ?? 0.02), As = o.sunlightEnabled ?? !0, Ps = o.sunlightColor ?? [255, 225, 160], Tn = Number(o.sunlightOpacity ?? 0.7), Zi = Number(o.sunlightSpread ?? 0.7), Ki = Number(o.sunBeamStaticOpacity ?? 0.07), Ji = Number(o.sunBeamStaticWidth ?? 1.6), Fn = o.sunBeamFlowEnabled ?? !0, Qi = o.sunBeamFlowColor ?? "rgba(255,200,50,0.85)", tr = Number(o.sunBeamFlowOpacity ?? 0.55), or = Number(o.sunBeamFlowWidthScale ?? 0.6), Ts = Number(o.sunBeamFlowDash ?? 8), Fs = Number(o.sunBeamFlowGap ?? 50), er = Number(o.sunBeamFlowDuration ?? 2.5), sr = Number(o.sunBeamFlowPhaseStep ?? 0.1), nr = Number(o.sunBeamDepthScaleBoost ?? 1), ar = Number(o.sunBeamDepthScaleMin ?? 0.55), ir = Number(o.sunBeamDepthScaleMax ?? 1.2), Bn = o.sunRayAnimEnabled ?? !0, Bs = Number(o.sunRayAnimDurationMin ?? 1.8), Ds = Number(o.sunRayAnimDurationMax ?? 3), rr = Number(o.sunRayAnimScaleMin ?? 0.5), lr = Number(o.sunRayAnimScaleMax ?? 0.75), cr = Number(o.sunRayAnimOpacityMin ?? 0.45);
    Number(o.sunRayAnimOpacityMax ?? 0.85);
    const Dn = o.sunRayAnimColorA ?? "rgb(255,240,110)";
    o.sunRayAnimColorB;
    const zs = o.skyCloudsEnabled ?? !0, zn = Number(o.skyCloudOpacity ?? 0.34), hr = Number(o.skyCloudBlur ?? 3.3), Ls = Number(o.skyCloudScale ?? 1.5), Ws = Number(o.skyCloudSpeed ?? 1), ur = Number(o.skyCloudHeight ?? 0.5);
    Number(o.wallBottomMix ?? 0.01), Number(o.wallMidMix ?? 0.7), Number(o.wallTopMix ?? 1.3);
    const fr = o.facadeSunDimmingEnabled ?? !0, dr = Number(o.facadeSunMinFactor ?? 0.2), pr = Number(o.facadeSunNoDimAtPct ?? 90), mr = Number(o.facadeSunCurve ?? 8), br = Number(o.ceilingDarkMix ?? 0.1), gr = Number(o.ceilingLightMix ?? 1.4), Ln = o.horizonEnabled ?? !0, $r = Number(o.horizonBase ?? 0.55), yr = Number(o.horizonTiltStrength ?? 0.65), Wn = Number(o.horizonBand ?? 0.15), In = o.horizonTopColor ?? [120, 170, 220], _r = o.horizonBandColor ?? [255, 210, 150], On = o.horizonBottomColor ?? [70, 80, 95], Hn = o.vignetteEnabled ?? !0, wr = Number(o.vignetteOpacity ?? 0.35), Sr = Number(o.vignetteRadius ?? 0.65), xr = Number(o.vignetteInner ?? 0.85), Is = o.vignetteColor ?? [0, 0, 0], vr = o.roofBackEnabled ?? !0, Un = Number(o.roofBackMix ?? 0.7), Rr = Number(o.roofBackOpacity ?? 1);
    Number(o.roofGradientDarkMix ?? 0.125), Number(o.roofGradientLightMix ?? 1.25);
    const Mr = o.roofSidesEnabled ?? !0, Cr = Number(o.roofSideMix ?? 0.45), Os = Number(o.roofSideOpacity ?? 1), kr = o.roofCapEnabled ?? !0, Er = Number(o.floorCompassStroke ?? 4), Nr = Number(o.floorCompassRingBand ?? 0.09), Ar = o.floorCompassRingMiddleColor ?? "rgba(255,255,255,0.9)", Vn = o.floorCompassRingSideColor ?? "rgba(210,140,140,0.345)", jn = Number(o.floorCompassRingSideWidth ?? 3), Gn = o.floorCompassTicksEnabled ?? !0, Pr = o.floorCompassTickColor ?? "rgba(0,0,0,0.75)", Tr = Number(o.floorCompassTickWidth ?? 1), Fr = Number(o.floorCompassTickMajorWidth ?? 4), Br = Number(o.floorCompassTickLength ?? -0.1), Dr = Number(o.floorCompassTickMajorLength ?? -0.2), zr = Number(o.floorCompassLabelSize ?? 20), Lr = Number(o.floorCompassLabelInset ?? -0.25), Wr = Number(o.floorCompassLabelScaleBoost ?? 1.2), Ir = Number(o.floorCompassLabelScaleMin ?? 0.6), Or = Number(o.floorCompassLabelScaleMax ?? 2), Hr = Number(o.floorCompassLabelStroke ?? 1), Yn = Number(o.arrowScaleBoost ?? 0.6), qn = Number(o.floorPointerScaleMin ?? 0.05), Xn = Number(o.floorPointerScaleMax ?? 1), Zn = Number(o.floorPointerBaseWidth ?? 3.4), Ur = Number(o.floorPointerBaseHead ?? 18), Hs = o.floorPointerColor ?? "gold", Kn = o.floorPointerShadowEnabled ?? !0, Us = Number(o.floorPointerShadowOpacity ?? 0.8), Vr = Number(o.floorPointerShadowBlur ?? 1.1), jr = Number(o.floorPointerShadowOffset ?? 2.9), Gr = Number(o.floorWallLabelSize ?? 12), us = Number(o.floorWallLabelOffset ?? 0.55), Yr = Number(o.floorWallLabelScaleBoost ?? 1.2), qr = Number(o.floorWallLabelScaleMin ?? 0.5), Xr = Number(o.floorWallLabelScaleMax ?? 1.8), Zr = Number(o.floorWallLabelScreenLift ?? 6), Kr = o.floorWallLabelColor ?? "rgba(255,255,255,0.9)", Jr = o.floorWallLabelStroke ?? "rgba(0,0,0,0.6)", Qr = Number(o.floorWallLabelStrokeWidth ?? 0.5), Jn = Number(o.wallLabelVisibleThreshold ?? -0.05), tl = Number(o.wallPctVisibleThreshold ?? -0.215), ol = Number(o.wallPctAreaThreshold ?? 120), el = Number(o.wallPctVerticalPos ?? 0.66), Qn = o.surfaceLabelEnabled ?? !0, Vs = Number(o.surfaceLabelSize ?? 12), sl = Number(o.surfaceLabelScaleBoost ?? 1.5), nl = Number(o.surfaceLabelScaleMin ?? 0.6), al = Number(o.surfaceLabelScaleMax ?? 1.6), ta = o.surfaceLabelColor ?? "rgba(255,213,0,.95)", oa = o.surfaceLabelStroke ?? "rgba(0,0,0,0.5)", js = Number(o.surfaceLabelStrokeWidth ?? 0.5), Gs = Number(o.surfaceLabelOffset ?? 0.03), il = Number(o.roofPowerLabelScale ?? 0.85), rl = o.roofPowerLabelColor ?? "rgba(255,255,255,0.9)", ll = o.frontDoorEnabled ?? !0, Ys = Number(o.frontDoorWidth ?? 0.55), ea = Number(o.frontDoorHeight ?? 1.1), cl = Number(o.frontDoorBottomInset ?? 0.05), hl = Number(o.frontDoorOffset ?? 0.01), ul = o.frontDoorColor ?? "rgba(0,0,0,0.55)", sa = Number(o.frontDoorOpacity ?? 0.9), fl = o.frontDoorFrameColor ?? "rgba(219,225,232,0.98)", dl = o.frontDoorKnobColor ?? "rgba(236,198,111,0.95)", at = o.faceColors ?? {
      front: "#faf5f5ff",
      right: "#d8d2d2ff",
      top: "#13a057",
      back: "#d8d2d2ff",
      left: "#d8d2d2ff",
      bottom: "#d8d2d2ff"
    }, pl = o.autoRotateEnabledDefault ?? !1, fs = Number(k == null ? void 0 : k.auto_rotate_speed);
    let Xo = Number(o.autoRotateSpeed ?? 10);
    (rt && Number.isFinite(fs) || (o.autoRotateSpeed === void 0 || o.autoRotateSpeed === null || o.autoRotateSpeed === "") && Number.isFinite(fs)) && (Xo = fs);
    const Wt = Number(o.autoRotateIntervalMs ?? 50), qs = Number(o.autoRotateTapDelayMs ?? 250), ml = o.autoRotateStopOnFullTurn ?? !0, na = Number(o.autoRotateTurnCount ?? 1), aa = o.autoRotateShowFps ?? !0, bl = Number(o.autoRotateFpsWindowMs ?? 1e3), gl = o.autoRotateAdaptiveEnabled ?? !0, ia = Number(o.autoRotateAdaptiveMaxIntervalMs ?? 1e3), $l = Number(o.autoRotateAdaptiveStepMs ?? 10), yl = Number(o.autoRotateAdaptiveCheckMs ?? 1e3), _l = Number(o.autoRotateAdaptiveFpsThreshold ?? 0.8), wl = Number(o.autoRotateCalibrateMs ?? 2e3), Sl = Number(o.autoRotateCalibrateFactor ?? 0.85), ra = o.cssFpsDebugEnabled ?? !1, xl = Number(o.cssFpsWindowMs ?? 1e3), vl = Number(o.cssFpsUiUpdateMs ?? 500);
    this._autoRotateSpeed = Xo, this._autoRotateIntervalMs = Wt, this._autoRotateEnabled === void 0 && (this._autoRotateEnabled = pl), this._autoRotateOffsetDeg === void 0 && (this._autoRotateOffsetDeg = 0), this._autoRotateIntervalMsDynamic === void 0 && (this._autoRotateIntervalMsDynamic = Wt), this._autoRotateFpsSamples === void 0 && (this._autoRotateFpsSamples = []), this._autoRotateFps === void 0 && (this._autoRotateFps = 0), this._autoRotateCalibrated === void 0 && (this._autoRotateCalibrated = !1), this._autoRotateAccumDeg === void 0 && (this._autoRotateAccumDeg = 0), this._autoRotateTargetDeg === void 0 && (this._autoRotateTargetDeg = 0), this._cssFps === void 0 && (this._cssFps = 0);
    const Xs = () => typeof performance < "u" && performance.now ? performance.now() : Date.now(), Rl = () => {
      this._cssFpsRaf && (cancelAnimationFrame(this._cssFpsRaf), this._cssFpsRaf = null), this._cssFpsSamples = [], this._cssFps = 0;
    }, Ml = () => {
      if (this._cssFpsRaf) return;
      this._cssFpsSamples = [], this._cssFpsUiLast = 0;
      const t = (s) => {
        const n = this._cssFpsSamples || [];
        n.push(s);
        const a = s - xl;
        for (; n.length && n[0] < a; ) n.shift();
        if (this._cssFpsSamples = n, n.length >= 2) {
          const r = (n[n.length - 1] - n[0]) / 1e3;
          this._cssFps = r > 0 ? (n.length - 1) / r : 0;
        }
        const i = this._cssFpsUiLast || 0;
        s - i >= vl && (this._cssFpsUiLast = s, this._updateTimerMS = Date.now(), this.requestUpdate()), this._cssFpsRaf = requestAnimationFrame(t);
      };
      this._cssFpsRaf = requestAnimationFrame(t);
    }, la = (t) => {
      const s = this._autoRotateFpsSamples || [];
      s.push(t);
      const n = t - bl;
      for (; s.length && s[0] < n; ) s.shift();
      if (this._autoRotateFpsSamples = s, s.length >= 2) {
        const a = (s[s.length - 1] - s[0]) / 1e3;
        this._autoRotateFps = a > 0 ? (s.length - 1) / a : 0;
      }
    }, ca = (t) => {
      if (!this._autoRotateCalibrated || !gl) return;
      const s = this._autoRotateAdaptiveLastCheck || 0;
      if (t - s < yl) return;
      this._autoRotateAdaptiveLastCheck = t;
      const n = 1e3 / this._autoRotateIntervalMsDynamic;
      if (this._autoRotateFps && this._autoRotateFps < n * _l) {
        const a = Math.min(
          ia,
          this._autoRotateIntervalMsDynamic + $l
        );
        a !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = a, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
    }, ha = (t) => {
      if (this._autoRotateCalibrated) return;
      const s = this._autoRotateCalibrateStart || t;
      if (this._autoRotateCalibrateStart = s, t - s < wl) return;
      const n = this._autoRotateFps || 0;
      if (n > 0) {
        const i = 1e3 / (n * Sl), r = Math.min(
          ia,
          Math.max(Wt, Math.round(i))
        );
        r !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = r, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
      this._autoRotateCalibrated = !0;
    }, Zs = () => {
      this._autoRotateEnabled && (this._autoRotateLastTick = 0, this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = 0, this._autoRotateEnabled = !1, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null), this._autoRotateIntervalMsDynamic = Wt, this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._updateTimerMS = Date.now(), this.requestUpdate());
    }, Cl = () => {
      this._autoRotateEnabled || (this._autoRotateEnabled = !0, this._autoRotateLastTick = Xs(), this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = ml && na > 0 ? na * 360 : 0, this._autoRotateIntervalMsDynamic = Wt, this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._autoRotateTimer || (this._autoRotateTimer = setInterval(() => {
        const t = Xs();
        la(t), ha(t), ca(t);
        const s = this._autoRotateLastTick || t, n = Math.max(0, t - s) / 1e3, a = Xo * n;
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + a, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + a, this._autoRotateLastTick = t, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
          Zs();
          return;
        }
        this._updateTimerMS = Date.now(), this.requestUpdate();
      }, this._autoRotateIntervalMsDynamic), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic), this._updateTimerMS = Date.now(), this.requestUpdate());
    };
    this._autoRotateStop = Zs, this._autoRotateStartFn = Cl, this._autoRotateHandlers || (this._autoRotateHandlers = !0, this._autoRotateLastTap = 0, this.addEventListener("pointerup", (t) => {
      var a;
      if (t.button !== void 0 && t.button !== 0) return;
      const s = Date.now(), n = this._autoRotateLastTap || 0;
      if (s - n < qs) {
        this._autoRotateLastTap = 0, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), (a = this._autoRotateStartFn) == null || a.call(this);
        return;
      }
      this._autoRotateLastTap = s, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), this._autoRotateClickTimer = setTimeout(() => {
        var i;
        this._autoRotateLastTap && Date.now() - this._autoRotateLastTap >= qs && (this._autoRotateLastTap = 0, (i = this._autoRotateStop) == null || i.call(this));
      }, qs + 10);
    }, { capture: !0 })), this._autoRotateEnabled ? (!this._autoRotateTimer || this._autoRotateTimerMs !== this._autoRotateIntervalMsDynamic) && (this._autoRotateTimer && clearInterval(this._autoRotateTimer), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic, this._autoRotateTimer = setInterval(() => {
      const t = Xs();
      la(t), ha(t), ca(t);
      const s = this._autoRotateLastTick || t, n = Math.max(0, t - s) / 1e3, a = Xo * n;
      if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + a, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + a, this._autoRotateLastTick = t, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
        Zs();
        return;
      }
      this._updateTimerMS = Date.now(), this.requestUpdate();
    }, this._autoRotateIntervalMsDynamic)) : this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null), ra ? Ml() : Rl();
    const kl = Number(((gi = e.states[Mo]) == null ? void 0 : gi.state) || 210);
    this._autoRotateCurrentDeg = this._autoRotateOffsetDeg || 0;
    const ua = (kl + (this._autoRotateOffsetDeg || 0)) * Math.PI / 180, fa = Math.min(Math.max(Number((($i = e.states[Es]) == null ? void 0 : $i.state) || 35), 0), 90), da = fa * Math.PI / 180, ds = 5, pa = Math.cos(ua), ma = Math.sin(ua), ba = Math.cos(da), ga = -Math.sin(da), $a = (mt || 0) * Math.PI / 180, ya = Math.cos($a), _a = Math.sin($a), El = Math.PI * 2;
    function N(t, s, n) {
      return Math.min(n, Math.max(s, t));
    }
    function Zo(t) {
      const s = Math.hypot(...t);
      return s > 0 ? t.map((n) => n / s) : [0, 0, 0];
    }
    function z(t) {
      const s = t[0], n = t[1], a = t[2], i = s * pa - a * ma, r = s * ma + a * pa, c = n * ba - r * ga, d = n * ga + r * ba;
      return [i, c, d];
    }
    function J(t) {
      const s = t[0], n = t[1], a = t[2], i = s * ya + a * _a, r = -s * _a + a * ya;
      return [i, n, r];
    }
    function ps(t) {
      return z(J(t));
    }
    function L(t) {
      const s = t[0], n = t[1], a = t[2], i = ds / (ds + a);
      return [ge + s * Ct * i, $e - n * Ct * i, a, i];
    }
    function At(t, s) {
      const n = parseInt(t.substr(1, 2), 16), a = parseInt(t.substr(3, 2), 16), i = parseInt(t.substr(5, 2), 16), r = Math.min(255, Math.max(0, Math.round(n * s))), c = Math.min(255, Math.max(0, Math.round(a * s))), d = Math.min(255, Math.max(0, Math.round(i * s)));
      return `rgb(${r},${c},${d})`;
    }
    function ms(t, s, n, a) {
      const i = Zo([n[0] - s[0], n[1] - s[1], n[2] - s[2]]), r = [t[0] - s[0], t[1] - s[1], t[2] - s[2]], c = Math.cos(a), d = Math.sin(a), f = [
        i[1] * r[2] - i[2] * r[1],
        i[2] * r[0] - i[0] * r[2],
        i[0] * r[1] - i[1] * r[0]
      ], u = i[0] * r[0] + i[1] * r[1] + i[2] * r[2], p = [
        r[0] * c + f[0] * d + i[0] * u * (1 - c),
        r[1] * c + f[1] * d + i[1] * u * (1 - c),
        r[2] * c + f[2] * d + i[2] * u * (1 - c)
      ];
      return [s[0] + p[0], s[1] + p[1], s[2] + p[2]];
    }
    function Nl(t, s, n) {
      const a = [s[0] - t[0], s[1] - t[1], s[2] - t[2]], i = [n[0] - t[0], n[1] - t[1], n[2] - t[2]];
      return Zo([
        a[1] * i[2] - a[2] * i[1],
        a[2] * i[0] - a[0] * i[2],
        a[0] * i[1] - a[1] * i[0]
      ]);
    }
    function Pt(t) {
      return t.reduce((s, n) => s + n[2], 0) / t.length;
    }
    function wa(t) {
      const s = Number(t);
      return Number.isFinite(s) ? `${Math.round(s)}%` : "0%";
    }
    function Ks(t) {
      let s = 0;
      for (let n = 0; n < t.length; n++) {
        const a = (n + 1) % t.length;
        s += t[n][0] * t[a][1] - t[a][0] * t[n][1];
      }
      return s;
    }
    function Al(t, s) {
      if (!t.length || s.length < 3) return [];
      const a = Ks(s) > 0, i = (d, f, u) => {
        const p = (u[0] - f[0]) * (d[1] - f[1]) - (u[1] - f[1]) * (d[0] - f[0]);
        return a ? p >= 0 : p <= 0;
      }, r = (d, f, u, p) => {
        const m = d[0], b = d[1], R = f[0], v = f[1], w = u[0], g = u[1], S = p[0], A = p[1], P = (m - R) * (g - A) - (b - v) * (w - S);
        if (Math.abs(P) < 1e-6) return f;
        const B = ((m * v - b * R) * (w - S) - (m - R) * (w * A - g * S)) / P, G = ((m * v - b * R) * (g - A) - (b - v) * (w * A - g * S)) / P;
        return [B, G];
      };
      let c = t.slice();
      for (let d = 0; d < s.length; d++) {
        const f = s[d], u = s[(d + 1) % s.length], p = c.slice();
        if (c = [], !p.length) break;
        for (let m = 0; m < p.length; m++) {
          const b = p[m], R = p[(m - 1 + p.length) % p.length], v = i(b, f, u), w = i(R, f, u);
          v ? (w || c.push(r(R, b, f, u)), c.push(b)) : w && c.push(r(R, b, f, u));
        }
      }
      return c;
    }
    function Sa(t, s, n, a) {
      return a > 0 && (t = -t, s = -s, n = -n, a = -a), t * a - s * n < 0 && (t = -t, s = -s), t < 0 && (t = -t, s = -s, n = -n, a = -a), { bx: t, by: s, ux: n, uy: a };
    }
    function xa(t, s, n, a) {
      return t * a - s * n < 0 && (n = -n, a = -a), { bx: t, by: s, ux: n, uy: a };
    }
    function va(t, s, n, a, i = !0) {
      const r = L(z(t)), c = L(z([
        t[0] + s[0],
        t[1] + s[1],
        t[2] + s[2]
      ])), d = L(z([
        t[0] + n[0],
        t[1] + n[1],
        t[2] + n[2]
      ]));
      let f = c[0] - r[0], u = c[1] - r[1], p = Math.hypot(f, u);
      if (p < 1e-6) return null;
      f /= p, u /= p;
      let m = d[0] - r[0], b = d[1] - r[1], R = Math.hypot(m, b);
      R < 1e-6 ? (m = -u, b = f, R = Math.hypot(m, b)) : (m /= R, b /= R);
      let v = i ? Sa(f, u, m, b) : xa(f, u, m, b);
      if (a) {
        const w = L(z([
          t[0] + a[0],
          t[1] + a[1],
          t[2] + a[2]
        ]));
        let g = w[0] - r[0], S = w[1] - r[1], A = Math.hypot(g, S);
        A > 1e-6 && (g /= A, S /= A, v.bx * g + v.by * S < 0 && (v = i ? Sa(-v.bx, -v.by, -v.ux, -v.uy) : xa(-v.bx, -v.by, -v.ux, -v.uy)));
      }
      return { basis: v, centerScr: r };
    }
    function Pl(t, s) {
      const n = t[0][0], a = t[0][1], i = t[1][0], r = t[1][1], c = t[2][0], d = t[2][1], f = s[0][0], u = s[0][1], p = s[1][0], m = s[1][1], b = s[2][0], R = s[2][1], v = n * (r - d) + i * (d - a) + c * (a - r);
      if (Math.abs(v) < 1e-6) return null;
      const w = (f * (r - d) + p * (d - a) + b * (a - r)) / v, g = (u * (r - d) + m * (d - a) + R * (a - r)) / v, S = (f * (c - i) + p * (n - c) + b * (i - n)) / v, A = (u * (c - i) + m * (n - c) + R * (i - n)) / v, P = (f * (i * d - c * r) + p * (c * a - n * d) + b * (n * r - i * a)) / v, B = (u * (i * d - c * r) + m * (c * a - n * d) + R * (n * r - i * a)) / v;
      return { a: w, b: g, c: S, d: A, e: P, f: B };
    }
    function Tl(t) {
      const s = [0, 1, 0], n = [
        s[1] * t[2] - s[2] * t[1],
        s[2] * t[0] - s[0] * t[2],
        s[0] * t[1] - s[1] * t[0]
      ];
      return Zo(n);
    }
    function Ra(t) {
      if (t.length <= 1) return t.slice();
      const s = t.slice().sort((r, c) => r.x === c.x ? r.z - c.z : r.x - c.x), n = (r, c, d) => (c.x - r.x) * (d.z - r.z) - (c.z - r.z) * (d.x - r.x), a = [];
      for (const r of s) {
        for (; a.length >= 2 && n(a[a.length - 2], a[a.length - 1], r) <= 0; )
          a.pop();
        a.push(r);
      }
      const i = [];
      for (let r = s.length - 1; r >= 0; r--) {
        const c = s[r];
        for (; i.length >= 2 && n(i[i.length - 2], i[i.length - 1], c) <= 0; )
          i.pop();
        i.push(c);
      }
      return i.pop(), a.pop(), a.concat(i);
    }
    function Fl(t, s, n, a, i) {
      if (t.length === 0) return t;
      const r = (u, p, m) => {
        const b = [];
        for (let R = 0; R < u.length; R++) {
          const v = u[R], w = u[(R + 1) % u.length], g = p(v), S = p(w);
          g && S ? b.push(w) : g && !S ? b.push(m(v, w)) : !g && S && (b.push(m(v, w)), b.push(w));
        }
        return b;
      }, c = (u, p, m) => {
        const b = p.x - u.x;
        if (Math.abs(b) < 1e-9) return { x: m, z: u.z };
        const R = (m - u.x) / b;
        return { x: m, z: u.z + R * (p.z - u.z) };
      }, d = (u, p, m) => {
        const b = p.z - u.z;
        if (Math.abs(b) < 1e-9) return { x: u.x, z: m };
        const R = (m - u.z) / b;
        return { x: u.x + R * (p.x - u.x), z: m };
      };
      let f = t.slice();
      return f = r(f, (u) => u.x >= s, (u, p) => c(u, p, s)), f = r(f, (u) => u.x <= n, (u, p) => c(u, p, n)), f = r(f, (u) => u.z >= a, (u, p) => d(u, p, a)), f = r(f, (u) => u.z <= i, (u, p) => d(u, p, i)), f;
    }
    function Ma(t) {
      if (t.length <= 1) return t.slice();
      const s = t.slice().sort((r, c) => r.x === c.x ? r.y - c.y : r.x - c.x), n = (r, c, d) => (c.x - r.x) * (d.y - r.y) - (c.y - r.y) * (d.x - r.x), a = [];
      for (const r of s) {
        for (; a.length >= 2 && n(a[a.length - 2], a[a.length - 1], r) <= 0; ) a.pop();
        a.push(r);
      }
      const i = [];
      for (let r = s.length - 1; r >= 0; r--) {
        const c = s[r];
        for (; i.length >= 2 && n(i[i.length - 2], i[i.length - 1], c) <= 0; ) i.pop();
        i.push(c);
      }
      return i.pop(), a.pop(), a.concat(i);
    }
    const bs = bt * Math.PI / 180, Js = gt * Math.PI / 180, ct = Zo([
      Math.cos(Js) * Math.sin(bs),
      Math.sin(Js),
      Math.cos(Js) * Math.cos(bs)
    ]);
    z(ct);
    const It = ct[1] > 0.01, Ca = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ], xt = Ca.map(J), Ko = xt.map(z), ht = Ko.map(L);
    Ma(ht.map((t) => ({ x: t[0], y: t[1] }))), Math.min(...ht.map((t) => t[2]));
    const Bl = [
      { id: "front", i: [4, 5, 6, 7], c: at.front },
      { id: "right", i: [1, 5, 6, 2], c: at.right },
      { id: "back", i: [0, 1, 2, 3], c: at.back },
      { id: "left", i: [0, 4, 7, 3], c: at.left },
      { id: "bottom", i: [0, 1, 5, 4], c: at.bottom }
    ], Qs = {
      front: { indices: [4, 5, 6, 7], edge: [4, 5] },
      right: { indices: [1, 5, 6, 2], edge: [1, 5] },
      back: { indices: [0, 1, 2, 3], edge: [0, 1] },
      left: { indices: [0, 4, 7, 3], edge: [0, 4] }
    }, ka = {
      front: [0, 0, 1],
      right: [1, 0, 0],
      back: [0, 0, -1],
      left: [-1, 0, 0]
    }, Jo = {
      front: Se,
      right: xe,
      back: ve,
      left: Re
    }, Qo = (t) => {
      if (!fr) return 1;
      const s = N(dr, 0, 1), n = N(pr, 1, 100), i = N(Number.isFinite(t) ? t : 0, 0, n) / n, r = Math.max(1e-3, mr), c = Math.log(1 + r * i) / Math.log(1 + r);
      return s + (1 - s) * c;
    }, Tt = {
      front: Qo(Jo.front),
      right: Qo(Jo.right),
      back: Qo(Jo.back),
      left: Qo(Jo.left)
    }, ut = Qo(Po), Dl = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    }, X = [
      [-1, 1, -1],
      [1, 1, -1],
      [1, 1, 1],
      [-1, 1, 1]
    ], tn = N(Nt, 0, Ce), Ot = Lt && tn > 0.01;
    let O = X;
    if (Ot) {
      const t = tn * Math.PI / 180;
      let s = [-1, 1, 1], n = [1, 1, 1], a = 1;
      D === "front" && (s = [-1, 1, 1], n = [1, 1, 1], a = 1), D === "back" && (s = [-1, 1, -1], n = [1, 1, -1], a = -1), D === "left" && (s = [-1, 1, -1], n = [-1, 1, 1], a = 1), D === "right" && (s = [1, 1, -1], n = [1, 1, 1], a = -1);
      const i = t * a;
      O = X.map((r) => ms(r, s, n, i));
    }
    const te = O.map(J), Ea = te.map(z), gs = Ea.map(L);
    let on = Nl(O[0], O[1], O[2]);
    on[1] < 0 && (on = on.map((t) => -t));
    const Na = Ks(gs), Aa = Na < 0;
    this._roofWindingFront === void 0 ? this._roofWindingFront = Aa : Math.abs(Na) > 20 && (this._roofWindingFront = Aa);
    const Ft = this._roofWindingFront;
    let en = null;
    const oe = (t, s) => /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t) ? At(t, s) : t, ee = [];
    if (wt) {
      const t = Math.max(0, Ee), s = Math.max(0, Ae), n = Math.max(0.01, Ne), a = 1 + s, i = a + n;
      let r = [
        [-1 - t, i, -1 - t],
        [1 + t, i, -1 - t],
        [1 + t, i, 1 + t],
        [-1 - t, i, 1 + t]
      ], c = [
        [-1 - t, a, -1 - t],
        [1 + t, a, -1 - t],
        [1 + t, a, 1 + t],
        [-1 - t, a, 1 + t]
      ], d = [
        [-1, a, -1],
        [1, a, -1],
        [1, a, 1],
        [-1, a, 1]
      ];
      if (Ot) {
        const w = tn * Math.PI / 180;
        let g = [-1, a, 1], S = [1, a, 1], A = 1;
        D === "front" && (g = [-1, a, 1], S = [1, a, 1], A = 1), D === "back" && (g = [-1, a, -1], S = [1, a, -1], A = -1), D === "left" && (g = [-1, a, -1], S = [-1, a, 1], A = 1), D === "right" && (g = [1, a, -1], S = [1, a, 1], A = -1);
        const P = w * A;
        r = r.map((B) => ms(B, g, S, P)), c = c.map((B) => ms(B, g, S, P)), d = d.map((B) => ms(B, g, S, P));
      }
      const f = r.map(J), u = c.map(J);
      en = f;
      const p = f.map((w) => L(z(w))), m = u.map((w) => L(z(w))), b = oe(Bo, ut);
      ee.push({
        type: "flatRoofTop",
        pts: p,
        z: Pt(p) - Te,
        fill: b,
        opacity: Pe
      }), [
        { id: "front", pts: [p[3], p[2], m[2], m[3]] },
        { id: "right", pts: [p[2], p[1], m[1], m[2]] },
        { id: "back", pts: [p[1], p[0], m[0], m[1]] },
        { id: "left", pts: [p[0], p[3], m[3], m[0]] }
      ].forEach((w) => {
        const g = Tt[w.id] ?? ut, S = N(g, 0.2, 1);
        ee.push({
          type: `flatRoofEdge-${w.id}`,
          pts: w.pts,
          z: Pt(w.pts) - Fe,
          fill: oe(Bo, S),
          opacity: Lo
        });
      });
      const v = Tt[D] ?? ut;
      if (ee.push({
        type: "flatRoofBottom",
        pts: m,
        z: Pt(m),
        fill: oe(Do, Math.max(0.2, v * zo * Un)),
        opacity: Lo
      }), Ot) {
        const g = d.map(J).map((B) => L(z(B))), S = [ht[3], ht[2], ht[6], ht[7]], A = (B) => {
          const G = Tt[B] ?? 1;
          return oe(Do, N(G * zo, 0.2, 1));
        }, P = (B, G, U) => {
          ee.push({
            type: U,
            pts: G,
            z: Pt(G) - Be,
            fill: A(B),
            opacity: Os
          });
        };
        D === "front" ? (P("left", [g[0], S[0], g[3]], "flatRoofSkirt-left"), P("right", [g[1], S[1], g[2]], "flatRoofSkirt-right"), P("back", [g[0], g[1], S[1], S[0]], "flatRoofSkirt-back")) : D === "back" ? (P("left", [g[3], S[3], g[0]], "flatRoofSkirt-left"), P("right", [g[2], S[2], g[1]], "flatRoofSkirt-right"), P("front", [g[2], g[3], S[3], S[2]], "flatRoofSkirt-front")) : D === "left" ? (P("front", [g[2], S[2], g[3]], "flatRoofSkirt-front"), P("back", [g[1], S[1], g[0]], "flatRoofSkirt-back"), P("right", [g[1], g[2], S[2], S[1]], "flatRoofSkirt-right")) : D === "right" && (P("front", [g[3], S[3], g[2]], "flatRoofSkirt-front"), P("back", [g[0], S[0], g[1]], "flatRoofSkirt-back"), P("left", [g[0], g[3], S[3], S[0]], "flatRoofSkirt-left"));
      }
    }
    let se = [];
    Ot && Mr && (D === "front" ? se = [
      { tri: [O[0], X[0], O[3]], wall: "left" },
      { tri: [O[1], X[1], O[2]], wall: "right" }
    ] : D === "back" ? se = [
      { tri: [O[3], X[3], O[0]], wall: "left" },
      { tri: [O[2], X[2], O[1]], wall: "right" }
    ] : D === "left" ? se = [
      { tri: [O[2], X[2], O[3]], wall: "front" },
      { tri: [O[1], X[1], O[0]], wall: "back" }
    ] : D === "right" && (se = [
      { tri: [O[3], X[3], O[2]], wall: "front" },
      { tri: [O[0], X[0], O[1]], wall: "back" }
    ]));
    const zl = se.map((t) => ({
      pts: t.tri.map((s) => L(ps(s))),
      wall: t.wall
    })), sn = (t) => {
      const s = Tt[t] ?? ut, n = at[t] ?? at.top;
      return At(n, Cr * s);
    }, Ll = Tt[D] ?? ut, Wl = at[D] ?? at.top, Il = At(Wl, Un * Ll), Ol = At(at.top, ut);
    let po = null, mo = null;
    Ot && kr && (D === "front" ? (po = [O[0], O[1], X[1], X[0]], mo = "back") : D === "back" ? (po = [O[2], O[3], X[3], X[2]], mo = "front") : D === "left" ? (po = [O[1], O[2], X[2], X[1]], mo = "right") : D === "right" && (po = [O[0], O[3], X[3], X[0]], mo = "left"));
    const nn = po ? po.map((t) => L(ps(t))) : null, Hl = sn(mo || D);
    let $t = [0, 0, -1];
    D === "front" && ($t = [0, 0, -1]), D === "back" && ($t = [0, 0, 1]), D === "left" && ($t = [1, 0, 0]), D === "right" && ($t = [-1, 0, 0]);
    const bo = O.reduce((t, s) => [t[0] + s[0], t[1] + s[1], t[2] + s[2]], [0, 0, 0]).map((t) => t / 4), go = 2.2;
    L(ps([
      bo[0] - $t[0] * go,
      bo[1] - $t[1] * go,
      bo[2] - $t[2] * go
    ])), L(ps([
      bo[0] + $t[0] * go,
      bo[1] + $t[1] * go,
      bo[2] + $t[2] * go
    ]));
    const j = -1, an = -1, Pa = [
      [-et, j, -et],
      [et, j, -et],
      [et, j, et],
      [-et, j, et]
    ].map(z).map(L);
    let rn = null;
    if (fo) {
      const t = 1 + Math.max(0, I);
      rn = [0, 1, 5, 4].map((i) => {
        const r = xt[i];
        return [r[0] * t, j, r[2] * t];
      }).map((i) => L(z(i))).map((i) => i[0] + "," + i[1]).join(" ");
    }
    const Ul = Math.min(...Pa.map((t) => t[1])), $s = N(Ul - 6, it * 0.32, it * 0.82), Ht = [
      ct[0] * ro,
      ct[1] * ro,
      ct[2] * ro
    ], Ta = z(Ht), q = L(Ta), Vl = Ko.reduce((t, s) => t + s[2], 0) / Ko.length, jl = Ta[2] > Vl + 0.02, Ut = q[3], Gl = Math.max(4, 12 * Ut), Yl = Math.max(3, 8 * Ut), ln = N($r - fa / 90 * yr, 0.1, 0.9), ql = N(ln - Wn, 0, 1), Xl = N(ln, 0, 1), Zl = N(ln + Wn, 0, 1), ft = et * (1 - 0.05), ys = 64;
    let $o = this._ringUnit;
    (!$o || $o.length !== ys) && ($o = Array.from({ length: ys }, (t, s) => {
      const n = s / ys * El;
      return [Math.sin(n), Math.cos(n)];
    }), this._ringUnit = $o);
    const Fa = Math.min(Nr, ft * 0.3), Ba = ft - Fa, Kl = ft + Fa;
    function cn(t) {
      return $o.map(([s, n]) => {
        const a = z([t * s, j, t * n]), i = L(a);
        return i[0] + "," + i[1];
      });
    }
    const Jl = cn(Ba), Ql = cn(ft), tc = cn(Kl);
    let Da = [];
    Gn && (Da = $o.map(([t, s], n) => {
      const a = n % (ys / 4) === 0, i = a ? Dr : Br, r = Ba, c = r - i, d = L(z([c * t, j, c * s])), f = L(z([r * t, j, r * s]));
      return { pIn: d, pOut: f, isMajor: a };
    }));
    const oc = [["N", 0], ["E", Math.PI / 2], ["S", Math.PI], ["W", 3 * Math.PI / 2]], za = ft * (1 - Lr), ec = oc.map(([t, s]) => {
      const n = z([za * Math.sin(s), j, za * Math.cos(s)]), a = L(n), i = N(a[3] * Wr, Ir, Or);
      return { t, x: a[0], y: a[1], scale: i };
    }), Bt = Zo([Math.sin(bs), 0, Math.cos(bs)]), sc = z([Bt[0] * ft * 0.25, j, Bt[2] * ft * 0.25]), nc = z([Bt[0] * ft * 0.95, j, Bt[2] * ft * 0.95]), Vt = L(sc), jt = L(nc), ac = N(Vt[3] * Yn, qn, Xn), hn = N(jt[3] * Yn, qn, Xn), ic = Zn * ac, rc = Zn * hn, Gt = Ur * hn, La = [
      { id: "front", label: "Front", normal: [0, 0, 1], pos: [0, j, 1 + us] },
      { id: "back", label: "Back", normal: [0, 0, -1], pos: [0, j, -1 - us] },
      { id: "right", label: "Right", normal: [1, 0, 0], pos: [1 + us, j, 0] },
      { id: "left", label: "Left", normal: [-1, 0, 0], pos: [-1 - us, j, 0] }
    ], _s = {}, un = {};
    La.forEach((t) => {
      const s = z(J(t.normal));
      _s[t.id] = s[2] < Jn;
      const n = Qs[t.id];
      if (n) {
        const a = n.indices.map((r) => ht[r]), i = Math.abs(Ks(a));
        un[t.id] = s[2] < tl && i > ol;
      } else
        un[t.id] = _s[t.id];
    });
    let ne = null;
    if (uo && It) {
      const t = [-ct[0], -ct[1], -ct[2]];
      if (Math.abs(t[1]) > 1e-6) {
        const s = [], n = Ot ? xt.concat(te) : xt;
        for (const i of n) {
          const r = (an - i[1]) / t[1];
          r >= 0 && s.push({ x: i[0] + t[0] * r, z: i[2] + t[2] * r });
        }
        const a = Ra(s);
        if (a.length >= 3) {
          const i = N(Yo, 0, 0.2), r = et * (1 - i), c = Fl(a, -r, r, -r, r);
          c.length >= 3 && (ne = c.map((d) => L(z([d.x, an, d.z]))));
        }
      }
    }
    const Wa = ne ? ne.map((t) => t[0] + "," + t[1]).join(" ") : null;
    let ae = null, ie = null;
    if (As && It) {
      const s = Math.hypot(et * 2, et * 2) * Zi, n = [Bt[0] * ft * 0.95, j, Bt[2] * ft * 0.95], a = [
        n[0] - Bt[0] * s,
        j,
        n[2] - Bt[2] * s
      ], i = z(n), r = z(a);
      ae = L(i), ie = L(r);
    }
    const Ia = `sv-beam-flow-${Math.round((Ts + Fs) * 10)}`, Oa = `sv-sun-ray-${Math.round((Bs + Ds) * 10)}`, Ha = `sv-cloud-drift-${Math.round(ot)}-${Math.round(it)}`, lc = Number(o.sunBeamRaySpacingPx ?? 40), cc = Number(o.sunBeamRayMinSepPx ?? 16), hc = Number(o.sunBeamSilhouetteMinRays ?? 3), uc = Number(o.sunBeamSilhouetteMaxRays ?? 7), Ua = Ot ? xt.concat(te) : xt, Va = Ua.map((t, s) => {
      const n = z(t), a = L(n);
      return { sourceIdx: s, x: a[0], y: a[1], zCam: n[2], world: t };
    }), st = Ma(
      Va
    ), yo = [], ws = (t, s, n, a = -1, i = [0, 0, 0]) => {
      const r = Math.max(1, cc) ** 2;
      for (const c of yo) {
        const d = c.x - t, f = c.y - s;
        if (d * d + f * f < r) return;
      }
      yo.push({ x: t, y: s, zCam: n, sourceIdx: a, world: i });
    };
    if (st.length >= 2) {
      let t = 0;
      for (let n = 0; n < st.length; n++) {
        const a = (n + 1) % st.length;
        t += st[n].x * st[a].y - st[a].x * st[n].y;
      }
      const s = t > 0;
      for (let n = 0; n < st.length; n++) {
        const a = st[n], i = st[(n + 1) % st.length], r = i.x - a.x, c = i.y - a.y, d = Math.hypot(r, c);
        if (d < 1e-3) continue;
        const f = (a.x + i.x) * 0.5, u = (a.y + i.y) * 0.5;
        let p = s ? c : -c, m = s ? -r : r;
        const b = Math.hypot(p, m) || 1;
        p /= b, m /= b;
        const R = q[0] - f, v = q[1] - u;
        if (!(p * R + m * v > 0)) continue;
        ws(a.x, a.y, a.zCam, a.sourceIdx, a.world), ws(i.x, i.y, i.zCam, i.sourceIdx, i.world);
        const g = Math.max(8, lc), S = Math.max(1, Math.min(4, Math.round(d / g)));
        for (let A = 0; A < S; A++) {
          const P = (A + 1) / (S + 1), B = [
            a.world[0] + (i.world[0] - a.world[0]) * P,
            a.world[1] + (i.world[1] - a.world[1]) * P,
            a.world[2] + (i.world[2] - a.world[2]) * P
          ], G = z(B), U = L(G);
          ws(U[0], U[1], G[2], -1, B);
        }
      }
    }
    !yo.length && st.length && st.forEach((t) => ws(t.x, t.y, t.zCam, t.sourceIdx, t.world)), yo.length > 1 && yo.sort((t, s) => {
      const n = Math.atan2(t.y - q[1], t.x - q[0]), a = Math.atan2(s.y - q[1], s.x - q[0]);
      return n - a;
    });
    const ja = (t, s) => {
      if (t.length <= s) return t.slice();
      if (s <= 1) return [t[Math.floor(t.length / 2)]];
      const n = [];
      for (let a = 0; a < s; a++) {
        const i = Math.round(a * (t.length - 1) / (s - 1));
        n.push(t[i]);
      }
      return n;
    }, re = Math.max(1, Math.floor(hc)), Ga = Math.max(re, Math.floor(uc));
    let dt = yo.slice();
    if (dt.length > Ga && (dt = ja(dt, Ga)), dt.length < re) {
      const t = st.map((s) => ({ x: s.x, y: s.y, zCam: s.zCam, sourceIdx: s.sourceIdx, world: s.world }));
      if (t.length >= re)
        dt = ja(t, re);
      else if (t.length > 0)
        for (; dt.length < re; ) {
          const s = t[dt.length % t.length];
          dt.push({ x: s.x, y: s.y, zCam: s.zCam, sourceIdx: s.sourceIdx, world: s.world });
        }
    }
    dt.length || [2, 3, 6, 7].forEach((t) => {
      const s = ht[t], n = Ko[t];
      dt.push({ x: s[0], y: s[1], zCam: n[2], sourceIdx: t, world: xt[t] });
    });
    const fn = /* @__PURE__ */ new Set();
    if (It) {
      const t = [-ct[0], -ct[1], -ct[2]];
      if (Math.abs(t[1]) > 1e-6) {
        const s = Ua.map((n, a) => {
          const i = (an - n[1]) / t[1];
          return i < 0 ? null : { sourceIdx: a, x: n[0] + t[0] * i, z: n[2] + t[2] * i };
        }).filter((n) => !!n);
        if (s.length >= 3) {
          const n = Ra(s.map((i) => ({ x: i.x, z: i.z }))), a = 1e-4;
          s.forEach((i) => {
            n.some((r) => Math.abs(r.x - i.x) <= a && Math.abs(r.z - i.z) <= a) && fn.add(i.sourceIdx);
          });
        }
      }
    }
    const Ya = ((t) => {
      const s = [], n = /* @__PURE__ */ new Set();
      return t.forEach((a) => {
        const i = `${Math.round(a.x)},${Math.round(a.y)}`;
        n.has(i) || (n.add(i), s.push(a));
      }), s;
    })(
      Va.filter((t) => fn.has(t.sourceIdx)).map((t) => ({ x: t.x, y: t.y, zCam: t.zCam, sourceIdx: t.sourceIdx, world: t.world }))
    ), dn = Ya.length ? Ya : dt, pn = /* @__PURE__ */ new Map(), qa = (t, s, n, a, i) => {
      const r = `${Math.round(s)},${Math.round(n)}`;
      pn.has(r) || pn.set(r, { x: s, y: n, zCam: a, sourceIdx: t, world: i });
    };
    Object.entries(Qs).forEach(([t, s]) => {
      z(J(ka[t]))[2] >= Jn || s.indices.forEach((a) => {
        qa(a, ht[a][0], ht[a][1], Ko[a][2], xt[a]);
      });
    }), Ft && gs.forEach((t, s) => {
      const n = xt.length + s;
      qa(n, t[0], t[1], Ea[s][2], te[s]);
    });
    let mn = Array.from(pn.values()).filter(
      (t) => fn.has(t.sourceIdx)
    );
    if (!mn.length && dn.length) {
      const t = dn.slice().sort((s, n) => s.zCam - n.zCam);
      mn = t.slice(0, Math.min(3, t.length));
    }
    function fc(t, s) {
      const n = t.length;
      if (n < 3) return "";
      let a = "";
      for (let i = 0; i < n; i++) {
        const r = t[(i - 1 + n) % n], c = t[i], d = t[(i + 1) % n], f = [r[0] - c[0], r[1] - c[1]], u = [d[0] - c[0], d[1] - c[1]], p = Math.hypot(f[0], f[1]), m = Math.hypot(u[0], u[1]);
        if (p === 0 || m === 0) continue;
        const b = Math.min(s, p / 2, m / 2), R = [f[0] / p, f[1] / p], v = [u[0] / m, u[1] / m], w = [c[0] + R[0] * b, c[1] + R[1] * b], g = [c[0] + v[0] * b, c[1] + v[1] * b];
        i === 0 ? a += `M ${w[0]} ${w[1]}` : a += ` L ${w[0]} ${w[1]}`, a += ` Q ${c[0]} ${c[1]} ${g[0]} ${g[1]}`;
      }
      return a + " Z";
    }
    const dc = 20, le = Pa.map((t) => [t[0], t[1]]), Xa = fc(le, dc), bn = N(Yo, 0, 0.2), Ss = le.reduce((t, s) => [t[0] + s[0], t[1] + s[1]], [0, 0]).map((t) => t / le.length), pc = bn > 0 ? le.map((t) => [
      Ss[0] + (t[0] - Ss[0]) * (1 - bn),
      Ss[1] + (t[1] - Ss[1]) * (1 - bn)
    ]) : le, nt = [];
    Ln && nt.push(`<linearGradient id="horizon-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgb(${In.join(",")})"/>
        <stop offset="${(ql * 100).toFixed(2)}%" stop-color="rgb(${In.join(",")})"/>
        <stop offset="${(Xl * 100).toFixed(2)}%" stop-color="rgb(${_r.join(",")})"/>
        <stop offset="${(Zl * 100).toFixed(2)}%" stop-color="rgb(${On.join(",")})"/>
        <stop offset="100%" stop-color="rgb(${On.join(",")})"/>
      </linearGradient>`), zs && (nt.push(`<clipPath id="sky-cloud-clip"><rect x="0" y="0" width="${ot}" height="${$s}"/></clipPath>`), nt.push(`<filter id="sky-cloud-blur" x="-30%" y="-40%" width="160%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Math.max(0, hr)}"/>
      </filter>`)), nt.push(`<radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,200,0.85)"/>
      <stop offset="70%" stop-color="rgba(255,255,150,0.35)"/>
      <stop offset="100%" stop-color="rgba(255,255,100,0)"/>
    </radialGradient>`), nt.push(`<linearGradient id="ceiling-grad" x1="0" y1="1" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${At(at.top, br * ut)}"/>
      <stop offset="100%" stop-color="${At(at.top, gr * ut)}"/>
    </linearGradient>`), uo && Wa && (nt.push(`<filter id="shadow-blur-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${rs}"/>
      </filter>`), nt.push(`<filter id="shadow-blur-contact" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${cs}"/>
      </filter>`)), fo && nt.push(`<filter id="base-anchor-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${E}"/>
      </filter>`), Kn && nt.push(`<filter id="floor-pointer-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Vr}"/>
      </filter>`), qo && nt.push(`<filter id="wall-base-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Pn}"/>
      </filter>`), As && It && ae && ie && nt.push(`<linearGradient id="sunlight-grad" x1="${ae[0]}" y1="${ae[1]}"
                  x2="${ie[0]}" y2="${ie[1]}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="rgb(${Ps.join(",")})" stop-opacity="${Tn}"/>
          <stop offset="55%" stop-color="rgb(${Ps.join(",")})" stop-opacity="${Tn * 0.45}"/>
          <stop offset="100%" stop-color="rgb(${Ps.join(",")})" stop-opacity="0"/>
        </linearGradient>`), Hn && nt.push(`<radialGradient id="vignette" cx="50%" cy="50%" r="${Sr}">
        <stop offset="0%" stop-color="rgb(${Is.join(",")})" stop-opacity="0"/>
        <stop offset="${(xr * 100).toFixed(1)}%" stop-color="rgb(${Is.join(",")})" stop-opacity="0"/>
        <stop offset="100%" stop-color="rgb(${Is.join(",")})" stop-opacity="${wr}"/>
      </radialGradient>`);
    const ce = [];
    if (Fn && It && ce.push(`
        @keyframes ${Ia} {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -${Ts + Fs}; }
        }
        .sv-beam-flow {
          animation-name: ${Ia};
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `), zs) {
      const s = ot + 140;
      ce.push(`
        @keyframes ${Ha} {
          0% { transform: translateX(-140px); }
          100% { transform: translateX(${s}px); }
        }
        .sv-sky-cloud {
          animation-name: ${Ha};
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
      `);
    }
    Bn && ce.push(`
        @keyframes ${Oa} {
          0%, 100% { transform: scaleX(var(--ray-min-scale, 0.45)); }
          50% { transform: scaleX(var(--ray-max-scale, 1.0)); }
        }
        .sv-sun-ray {
          animation-name: ${Oa};
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          transform-origin: 0px 0px;
          will-change: transform;
        }
      `), ce.length && nt.push(`<style><![CDATA[
        ${ce.join(`
`)}
        @media (prefers-reduced-motion: reduce) {
          .sv-beam-flow, .sv-sun-ray { animation: none !important; }
        }
      ]]></style>`);
    const x = [];
    if (x.push(`<svg viewBox="0 0 ${ot} ${it}" width="${Cs}" height="${ks}" preserveAspectRatio="xMidYMid meet"><defs>${nt.join("")}</defs>`), Ln && x.push(`<rect x="0" y="0" width="${ot}" height="${it}" fill="url(#horizon-grad)"/>`), zs) {
      const t = N(ur, 0, 1), s = [0.3, 0.42, 0.24], n = [0.46, 0.6, 0.38], a = [
        { y: $s * (s[0] + (n[0] - s[0]) * t), s: 0.76 * Ls, dur: 38 / Math.max(0.2, Ws), phase: 0.12 },
        { y: $s * (s[1] + (n[1] - s[1]) * t), s: 1 * Ls, dur: 56 / Math.max(0.2, Ws), phase: 0.48 },
        { y: $s * (s[2] + (n[2] - s[2]) * t), s: 0.66 * Ls, dur: 76 / Math.max(0.2, Ws), phase: 0.78 }
      ];
      x.push('<g clip-path="url(#sky-cloud-clip)">'), a.forEach((i) => {
        const r = N(zn, 0, 1), c = N(zn * 0.75, 0, 1);
        [-(i.phase * i.dur), -((i.phase + 0.5) * i.dur)].forEach((f) => {
          x.push(`<g transform="translate(0 ${i.y}) scale(${i.s})">`), x.push(`<g class="sv-sky-cloud" style="animation-duration:${i.dur}s;animation-delay:${f}s">`), x.push('<g filter="url(#sky-cloud-blur)">'), x.push(`<ellipse cx="0" cy="0" rx="52" ry="20" fill="rgba(255,255,255,${r})"/>`), x.push(`<ellipse cx="28" cy="-12" rx="36" ry="17" fill="rgba(255,255,255,${c})"/>`), x.push(`<ellipse cx="-26" cy="-10" rx="30" ry="15" fill="rgba(255,255,255,${c})"/>`), x.push(`<ellipse cx="64" cy="-4" rx="24" ry="12" fill="rgba(255,255,255,${c * 0.95})"/>`), x.push("</g>"), x.push("</g>"), x.push("</g>");
        });
      }), x.push("</g>");
    }
    const mc = () => {
      const t = jt[0] - Vt[0], s = jt[1] - Vt[1], n = Math.hypot(t, s);
      if (n <= 1e-3) return;
      const a = -s / n, i = t / n, r = t / n, c = s / n, d = jt[0] - r * Gt, f = jt[1] - c * Gt, u = [d + a * Gt * 0.62, f + i * Gt * 0.62], p = [d - a * Gt * 0.62, f - i * Gt * 0.62], m = Math.max(0.8, ic * 0.55 + rc * 0.75), b = [
        [jt[0], jt[1]],
        [p[0], p[1]],
        [u[0], u[1]]
      ], R = b.map((w) => `${w[0]},${w[1]}`).join(" "), v = Math.max(1.1, Gt * 0.16);
      if (Kn) {
        const w = jr * hn, g = w * 0.55, S = w * 0.75, P = b.map((B) => [B[0] + g, B[1] + S]).map((B) => `${B[0]},${B[1]}`).join(" ");
        x.push(`<line x1="${Vt[0] + g}" y1="${Vt[1] + S}" x2="${d + g}" y2="${f + S}"
          stroke="${St}" stroke-opacity="${N(Us, 0, 1)}" stroke-width="${m}"
          stroke-linecap="round" filter="url(#floor-pointer-shadow-blur)"/>`), x.push(`<polygon points="${P}" fill="${St}" fill-opacity="${N(Us * 0.95, 0, 1)}"
          stroke="${St}" stroke-opacity="${N(Us * 0.95, 0, 1)}"
          stroke-width="${v}" stroke-linejoin="round" filter="url(#floor-pointer-shadow-blur)"/>`);
      }
      x.push(`<line x1="${Vt[0]}" y1="${Vt[1]}" x2="${d}" y2="${f}"
        stroke="${Hs}" stroke-width="${m}" stroke-linecap="round" opacity="0.92"/>`), x.push(`<polygon points="${R}" fill="${Hs}" opacity="0.95"
        stroke="${Hs}" stroke-width="${v}" stroke-linejoin="round"/>`);
    }, bc = () => {
      if (!os) return;
      const t = N(ss, 0.8, 1.9), s = Math.max(0.08, es), n = 1 + ns, a = n + s, i = j + 5e-4, r = (R) => L(z(J(R))), c = r([-t / 2, i, n]), d = r([t / 2, i, n]), f = r([t / 2, i, a]), u = r([-t / 2, i, a]);
      x.push(`<polygon points="${c[0]},${c[1]} ${d[0]},${d[1]} ${f[0]},${f[1]} ${u[0]},${u[1]}"
        fill="${as}" opacity="0.9"/>`);
      const p = (R, v, w) => [R[0] + (v[0] - R[0]) * w, R[1] + (v[1] - R[1]) * w];
      [0.25, 0.5, 0.75].forEach((R) => {
        const v = p(c, d, R), w = p(u, f, R);
        x.push(`<line x1="${v[0]}" y1="${v[1]}" x2="${w[0]}" y2="${w[1]}"
          stroke="${jo}" stroke-width="${Go}" opacity="0.65"/>`);
      });
      const m = p(c, u, 0.5), b = p(d, f, 0.5);
      x.push(`<line x1="${m[0]}" y1="${m[1]}" x2="${b[0]}" y2="${b[1]}"
        stroke="${jo}" stroke-width="${Go}" opacity="0.65"/>`);
    };
    if (x.push(`<path d="${Xa}" fill="${Ro}"/>`), bc(), As && It && ae && ie && x.push(`<path d="${Xa}" fill="url(#sunlight-grad)"/>`), uo && Wa) {
      const t = ne ? ne.map((n) => [n[0], n[1]]) : [], s = Al(t, pc);
      if (s.length >= 3) {
        const n = s.map((a) => a[0] + "," + a[1]).join(" ");
        x.push(`<polygon points="${n}" fill="${St}" opacity="${is}" filter="url(#shadow-blur-soft)"/>`), x.push(`<polygon points="${n}" fill="${St}" opacity="${ls}" filter="url(#shadow-blur-contact)"/>`);
      }
    }
    mc(), fo && rn && x.push(`<polygon points="${rn}" fill="${hs}" opacity="${M}" filter="url(#base-anchor-shadow-blur)"/>`), vc(), x.push(`<polygon points="${Jl.join(" ")}" fill="none" stroke="${Vn}" stroke-width="${jn}" stroke-linecap="round"/>`), x.push(`<polygon points="${Ql.join(" ")}" fill="none" stroke="${Ar}" stroke-width="${Er}" stroke-linecap="round"/>`), x.push(`<polygon points="${tc.join(" ")}" fill="none" stroke="${Vn}" stroke-width="${jn}" stroke-linecap="round"/>`), Gn && Da.forEach((t) => {
      const s = t.isMajor ? Fr : Tr;
      x.push(`<line x1="${t.pIn[0]}" y1="${t.pIn[1]}" x2="${t.pOut[0]}" y2="${t.pOut[1]}" stroke="${Pr}" stroke-width="${s}"/>`);
    }), ec.forEach((t) => {
      x.push(`<text x="${t.x}" y="${t.y}" fill="white"
        font-size="${zr * t.scale}"
        stroke="rgba(0,0,0,0.6)" stroke-width="${Hr * t.scale}"
        font-weight="700" text-anchor="middle">${t.t}</text>`);
    });
    const gc = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    };
    La.forEach((t) => {
      const s = gc[t.id];
      if (!s) return;
      const n = J(s), a = J(t.pos), i = t.id === "front" || t.id === "left" ? s.map((R) => -R) : s, r = J(i), c = va(a, n, Tl(n), r, !1);
      if (!c) return;
      const { basis: d, centerScr: f } = c, u = N(f[3] * Yr, qr, Xr), p = Gr * u, m = Qr * u, b = f[1] - Zr * u;
      x.push(`<text x="0" y="0"
        fill="${Kr}"
        font-size="${p}"
        stroke="${Jr}"
        stroke-width="${m}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${d.bx} ${d.by} ${d.ux} ${d.uy} ${f[0]} ${b})">${t.label}</text>`);
    });
    const Za = (t, s = 1, n = 1) => {
      t.forEach((a, i) => {
        const r = N(
          ds / (ds + a.zCam) * nr,
          ar,
          ir
        ), c = Math.max(0.7, Ji * Ut * r), d = N(Ki * n * r, 0, 1);
        if (x.push(`<line x1="${q[0]}" y1="${q[1]}" x2="${a.x}" y2="${a.y}"
          stroke="rgba(255,255,150,${d})" stroke-width="${c}"/>`), Fn && It) {
          const f = Math.max(0.6, c * or), u = Math.max(0.2, er), p = -i * sr, m = N(tr * s * r, 0, 1);
          x.push(`<line x1="${q[0]}" y1="${q[1]}" x2="${a.x}" y2="${a.y}"
            class="sv-beam-flow"
            style="animation-duration:${u}s;animation-delay:${p}s"
            stroke="${Qi}" stroke-opacity="${m}" stroke-width="${f}"
            stroke-linecap="round" stroke-dasharray="${Ts} ${Fs}" stroke-dashoffset="0"/>`);
        }
      });
    };
    Za(dn);
    const $c = Bl.map((t) => {
      const s = t.i.map((i) => ht[i]), n = Tt[t.id] ?? 1, a = At(t.c, n);
      return { type: "cube", id: t.id, pts: s, z: Pt(s), fill: a, opacity: 1 };
    }), _o = [];
    wt || (zl.forEach((t) => {
      _o.push({ type: "roofSide", pts: t.pts, z: Pt(t.pts), fill: sn(t.wall), opacity: Os });
    }), nn && _o.push({ type: "roofCap", pts: nn, z: Pt(nn), fill: Hl, opacity: Os }));
    let wo = Pt(gs);
    if (_o.length) {
      const t = Math.min(..._o.map((n) => n.z)), s = Math.max(..._o.map((n) => n.z));
      Ft ? wo = Math.min(wo, t - 0.02) : wo = Math.max(wo, s + 0.02);
    } else
      wo += Ft ? -1e-3 : 1e-3;
    const Ka = !wt && Lt && (Ft || vr) ? {
      type: "roofPlane",
      pts: gs,
      z: wo,
      fill: Ft ? Ol : Il,
      opacity: Ft ? ke : Rr
    } : null, Ja = $c.concat(_o).concat(ee).concat(Ka ? [Ka] : []).sort((t, s) => s.z - t.z), yc = (t, s) => {
      if (!qo || !(t === "front" || t === "right" || t === "back" || t === "left") || !_s[t] || !s || s.length < 4) return;
      const n = s[0], a = s[1], i = s[2], r = s[3], c = (g, S, A) => [g[0] + (S[0] - g[0]) * A, g[1] + (S[1] - g[1]) * A], d = N(qi, 0.01, 0.35), f = N(d * 0.45, 3e-3, 0.12), u = c(n, r, f), p = c(a, i, f), m = Math.hypot(r[0] - n[0], r[1] - n[1]), b = Math.hypot(i[0] - a[0], i[1] - a[1]), R = Math.max(1, (m + b) * 0.5), v = Math.max(0.8, R * d), w = Pn > 0.01 ? ' filter="url(#wall-base-shadow-blur)"' : "";
      x.push(`<line x1="${u[0]}" y1="${u[1]}" x2="${p[0]}" y2="${p[1]}"
        stroke="${St}" stroke-opacity="${N(Xi, 0, 1)}"
        stroke-width="${v}" stroke-linecap="round"${w}/>`);
    }, _c = (t, s) => {
      if (!Je || !(t === "front" || t === "right" || t === "back" || t === "left") || !s || s.length < 4) return;
      const n = s[0], a = s[1], i = s[2], r = s[3], c = (m, b, R) => [m[0] + (b[0] - m[0]) * R, m[1] + (b[1] - m[1]) * R], d = N(Qe, 0.015, 0.22), f = c(n, r, d), u = c(a, i, d), p = At(at[t], (Tt[t] ?? 1) * N(ts, 0.2, 1.2));
      x.push(`<polygon points="${n[0]},${n[1]} ${a[0]},${a[1]} ${u[0]},${u[1]} ${f[0]},${f[1]}"
        fill="${p}" opacity="0.95"/>`);
    }, wc = (t) => {
      if (!Qn || !un[t]) return;
      const s = Dl[t], n = ka[t];
      if (!s || !n) return;
      const a = t === "front" || t === "left" ? s.map((S) => -S) : s;
      let i = 0, r = 0, c = 0;
      Qs[t].indices.forEach((S) => {
        const A = Ca[S];
        i += A[0], r += A[1], c += A[2];
      }), i /= 4, r /= 4, c /= 4, r = N(el, -0.9, 0.9);
      const d = [
        i + n[0] * Gs,
        r + n[1] * Gs,
        c + n[2] * Gs
      ], f = J(d), u = J(s), p = J(a), m = va(f, u, [0, 1, 0], p, !1);
      if (!m) return;
      const { basis: b, centerScr: R } = m, v = N(R[3] * sl, nl, al), w = Vs * v, g = js * v;
      x.push(`<text x="0" y="0"
        fill="${ta}"
        font-size="${w}"
        stroke="${oa}"
        stroke-width="${g}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${b.bx} ${b.by} ${b.ux} ${b.uy} ${R[0]} ${R[1]})">${wa(Jo[t])}</text>`);
    }, Sc = () => {
      if (!ll || !_s.front) return;
      const t = -Ys / 2, s = Ys / 2, n = N(-1 + cl, -1, 1), a = N(n + ea, -1, 1), i = 1 + hl, r = (S) => L(z(J(S))), f = [
        [t, n, i],
        [s, n, i],
        [s, a, i],
        [t, a, i]
      ].map(r).map((S) => `${S[0]},${S[1]}`).join(",");
      x.push(`<polygon points="${f}" fill="${fl}" opacity="${sa}"/>`);
      const u = Math.min(0.08, Math.max(0.04, Ys * 0.14)), p = Math.min(0.08, Math.max(0.04, ea * 0.1)), R = [
        [t + u, n + p, i + 3e-3],
        [s - u, n + p, i + 3e-3],
        [s - u, a - p, i + 3e-3],
        [t + u, a - p, i + 3e-3]
      ].map(r).map((S) => `${S[0]},${S[1]}`).join(",");
      x.push(`<polygon points="${R}" fill="${ul}" opacity="${sa}"/>`);
      const v = [s - u - 0.05, n + (a - n) * 0.45, i + 6e-3], w = r(v), g = Math.max(0.6, w[3]);
      x.push(`<circle cx="${w[0]}" cy="${w[1]}" r="${1.8 * g}" fill="${dl}" opacity="0.95"/>`);
    }, xc = (t, s) => {
      if (!De || !(t === "left" || t === "right" || t === "back") || !s || s.length < 4) return;
      const n = N(Tt[t] ?? 1, 0.2, 1), a = s[0], i = s[1], r = s[2], c = s[3], d = (V, Q, pt) => [V[0] + (Q[0] - V[0]) * pt, V[1] + (Q[1] - V[1]) * pt], f = (V, Q) => {
        const pt = d(a, c, Q), Z = d(i, r, Q);
        return d(pt, Z, V);
      }, u = t === "back" ? 0.2 : 0.24, p = t === "back" ? 0.8 : 0.76, m = 0.2, b = 0.74, v = [
        f(u, m),
        f(p, m),
        f(p, b),
        f(u, b)
      ].map((V) => `${V[0]},${V[1]}`).join(",");
      x.push(`<polygon points="${v}" fill="${ze}" opacity="${0.98 * n}"/>`);
      const w = 0.035, g = 0.05, A = [
        f(u + w, m + g),
        f(p - w, m + g),
        f(p - w, b - g),
        f(u + w, b - g)
      ].map((V) => `${V[0]},${V[1]}`).join(",");
      x.push(`<polygon points="${A}" fill="${Le}" opacity="${0.95 * n}"/>`);
      const P = f((u + p) * 0.5, m + g), B = f((u + p) * 0.5, b - g);
      x.push(`<line x1="${P[0]}" y1="${P[1]}" x2="${B[0]}" y2="${B[1]}"
        stroke="${We}" stroke-width="${Wo}" opacity="${0.9 * n}"/>`);
      const G = f(u + w * 1.4, m + g * 1.2), U = f(p - w * 1.6, b - g * 1.3);
      x.push(`<line x1="${G[0]}" y1="${G[1]}" x2="${U[0]}" y2="${U[1]}"
        stroke="rgba(255,255,255,0.32)" stroke-width="${Math.max(0.8, Wo * 0.9)}" opacity="${n}"/>`);
    };
    function vc() {
      if (!Ge) return;
      const t = (f) => L(z(f)), s = Ye, n = qe, a = N(Xe, 0.4, 2.5), i = t([s, j, n]), r = t([s, j + 0.86 * a, n]), c = Math.max(2.6, 8.5 * r[3] * a);
      x.push(`<line x1="${i[0]}" y1="${i[1]}" x2="${r[0]}" y2="${r[1]}"
        stroke="${Ke}" stroke-width="${c}" stroke-linecap="round" opacity="0.95"/>`), [
        [s, j + 1.02 * a, n, 0.28],
        [s - 0.18 * a, j + 0.9 * a, n + 0.06 * a, 0.22],
        [s + 0.2 * a, j + 0.86 * a, n - 0.07 * a, 0.2]
      ].forEach((f) => {
        const u = t([f[0], f[1], f[2]]), p = Math.max(6, Ct * f[3] * u[3] * 0.95);
        x.push(`<circle cx="${u[0]}" cy="${u[1]}" r="${p}" fill="${Ze}" opacity="0.95"/>`);
      });
    }
    const Qa = () => {
      const t = wt && en ? en : te, s = {
        front: { low: [3, 2], high: [0, 1] },
        back: { low: [0, 1], high: [3, 2] },
        left: { low: [0, 3], high: [1, 2] },
        right: { low: [1, 2], high: [0, 3] }
      }, n = s[D] ?? s.front;
      let a = t[n.low[0]], i = t[n.low[1]], r = t[n.high[0]], c = t[n.high[1]];
      if (!a || !i || !r || !c) return null;
      if (D === "front" || D === "back") {
        if (i[0] < a[0]) {
          const m = a;
          a = i, i = m;
          const b = r;
          r = c, c = b;
        }
      } else if (i[2] < a[2]) {
        const m = a;
        a = i, i = m;
        const b = r;
        r = c, c = b;
      }
      const d = Math.hypot(i[0] - a[0], i[1] - a[1], i[2] - a[2]), f = [(a[0] + i[0]) / 2, (a[1] + i[1]) / 2, (a[2] + i[2]) / 2], u = [(r[0] + c[0]) / 2, (r[1] + c[1]) / 2, (r[2] + c[2]) / 2], p = Math.hypot(u[0] - f[0], u[1] - f[1], u[2] - f[2]);
      return !isFinite(d) || !isFinite(p) || d <= 1e-6 || p <= 1e-6 ? null : { lowA: a, lowB: i, highA: r, highB: c, worldEdgeLen: d, roofHeightWorld: p };
    }, Rc = () => {
      if (!Ie || !Lt || !Ft) return;
      const t = Qa();
      if (!t) return;
      const { lowA: s, lowB: n, highA: a, highB: i } = t, r = Math.min(Oo, Ho), c = Math.max(Oo, Ho), d = Ve, f = je, u = (1 - d) / 2, p = d, m = f * Math.max(0, ho - 1), b = (p - m) / ho;
      if (!isFinite(b) || b <= 0.01) return;
      const R = (A, P, B) => [A[0] + (P[0] - A[0]) * B, A[1] + (P[1] - A[1]) * B, A[2] + (P[2] - A[2]) * B], v = (A, P) => {
        const B = R(s, a, P), G = R(n, i, P), U = R(B, G, A);
        return L(z(U));
      }, w = oe(Oe, N(ut, 0.2, 1)), g = 0.55 + 0.4 * N(ut, 0, 1), S = 0.3 + 0.5 * N(ut, 0, 1);
      for (let A = 0; A < ho; A++) {
        const P = u + A * (b + f), B = P + b, G = v(P, r), U = v(B, r), V = v(B, c), Q = v(P, c);
        x.push(`<polygon points="${G[0]},${G[1]} ${U[0]},${U[1]} ${V[0]},${V[1]} ${Q[0]},${Q[1]}"
          fill="${w}" opacity="0.96" stroke="${He}" stroke-opacity="${g}" stroke-width="${Ue}"/>`);
        const pt = (Z, yt, vt) => [Z[0] + (yt[0] - Z[0]) * vt, Z[1] + (yt[1] - Z[1]) * vt];
        for (let Z = 1; Z < Uo; Z++) {
          const yt = Z / Uo, vt = pt(G, U, yt), Yt = pt(Q, V, yt);
          x.push(`<line x1="${vt[0]}" y1="${vt[1]}" x2="${Yt[0]}" y2="${Yt[1]}"
            stroke="${Io}" stroke-opacity="${S}" stroke-width="0.7"/>`);
        }
        for (let Z = 1; Z < Vo; Z++) {
          const yt = Z / Vo, vt = pt(G, Q, yt), Yt = pt(U, V, yt);
          x.push(`<line x1="${vt[0]}" y1="${vt[1]}" x2="${Yt[0]}" y2="${Yt[1]}"
            stroke="${Io}" stroke-opacity="${S}" stroke-width="0.7"/>`);
        }
      }
    }, ti = () => {
      if (!Qn || !Lt || !Ft) return;
      const t = Qa();
      if (!t) return;
      const { lowA: s, lowB: n, highA: a, highB: i, worldEdgeLen: r, roofHeightWorld: c } = t, d = wa(Po);
      let f = -c * (1 / 3), u = -c * (2 / 3);
      const p = 1 / 6, m = r * (1 - 2 * p), b = "100%", R = "9.99 kW", v = Math.max(d.length, b.length);
      Math.max((Fo || "").length, R.length);
      const w = c * 0.36, g = Math.min(m / (0.6 * v), w), S = js / Vs * g, A = Math.min(g * il, w * 0.85), P = js / Vs * A;
      this._roofStripSeed = (this._roofStripSeed || 0) + 1;
      const B = (U, V, Q) => [U[0] + (V[0] - U[0]) * Q, U[1] + (V[1] - U[1]) * Q, U[2] + (V[2] - U[2]) * Q], G = (U, V, Q, pt, Z, yt, vt) => {
        if (!U) return;
        const Yt = Math.max(V * yt, c * 0.08), $n = Z, yi = Z - Yt, _i = N(-$n / c, 0, 1), Nc = N(-yi / c, 0, 1), Ac = B(s, a, _i), Pc = B(n, i, _i), Tc = B(s, a, Nc), wi = L(z(Ac)), Si = L(z(Pc)), xi = L(z(Tc)), Rt = [[0, $n], [r, $n], [0, yi]], Mt = [[wi[0], wi[1]], [Si[0], Si[1]], [xi[0], xi[1]]], qt = Pl(Rt, Mt);
        if (!qt) return;
        const vi = Math.sign((Rt[1][0] - Rt[0][0]) * (Rt[2][1] - Rt[0][1]) - (Rt[1][1] - Rt[0][1]) * (Rt[2][0] - Rt[0][0])), Ri = Math.sign((Mt[1][0] - Mt[0][0]) * (Mt[2][1] - Mt[0][1]) - (Mt[1][1] - Mt[0][1]) * (Mt[2][0] - Mt[0][0])), Mi = vi !== 0 && Ri !== 0 && vi !== Ri;
        x.push(`<g transform="matrix(${qt.a} ${qt.b} ${qt.c} ${qt.d} ${qt.e} ${qt.f})">`), Mi && x.push(`<g transform="translate(${r} 0) scale(-1 1)">`), x.push(`<text x="${r / 2}" y="${Z}" fill="${pt}" font-size="${V}"
          stroke="${oa}" stroke-width="${Q}" font-weight="700"
          text-anchor="middle" dominant-baseline="middle">${U}</text>`), Mi && x.push("</g>"), x.push("</g>");
      };
      ao && G(Fo, A, P, rl, f, 1.6), G(d, g, S, ta, u, 1.6);
    };
    Ja.forEach((t) => {
      const s = t.pts.map((r) => r[0] + "," + r[1]).join(","), a = typeof t.type == "string" && t.type.startsWith("flatRoof") ? t.fill : "#000";
      x.push(`<polygon points="${s}" fill="${t.fill}" stroke="${a}" stroke-width="${0.5}" opacity="${t.opacity}"/>`), t.type === "cube" && _c(t.id, t.pts), t.type === "cube" && yc(t.id, t.pts), t.type === "cube" && t.id === "front" && Sc(), t.type === "cube" && xc(t.id, t.pts), t.type === "cube" && wc(t.id), (t.type === "roofPlane" || t.type === "flatRoofTop") && Rc(), t.type === "roofPlane" && !wt && ti();
    }), wt && ti();
    const gn = [];
    Ja.forEach((t) => {
      const s = t.pts || [];
      if (!(s.length < 3))
        if (s.length === 3)
          gn.push([s[0], s[1], s[2]]);
        else
          for (let n = 1; n < s.length - 1; n++)
            gn.push([s[0], s[n], s[n + 1]]);
    });
    const Mc = (t, s, n, a, i) => {
      const r = n[0], c = n[1], d = n[2], f = a[0], u = a[1], p = a[2], m = i[0], b = i[1], R = i[2], v = (u - b) * (r - m) + (m - f) * (c - b);
      if (Math.abs(v) < 1e-6) return null;
      const w = ((u - b) * (t - m) + (m - f) * (s - b)) / v, g = ((b - c) * (t - m) + (r - m) * (s - b)) / v, S = 1 - w - g;
      return w < -1e-4 || g < -1e-4 || S < -1e-4 ? null : w * d + g * p + S * R;
    }, Cc = (t, s) => {
      let n = 1 / 0;
      return gn.forEach(([a, i, r]) => {
        const c = Mc(t, s, a, i, r);
        c != null && c < n && (n = c);
      }), Number.isFinite(n) ? n : null;
    }, kc = (t) => {
      const s = [0.14, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74, 0.84, 0.92];
      let n = 0, a = 0;
      for (const i of s) {
        const r = [
          Ht[0] + (t.world[0] - Ht[0]) * i,
          Ht[1] + (t.world[1] - Ht[1]) * i,
          Ht[2] + (t.world[2] - Ht[2]) * i
        ], c = z(r), d = L(c), f = Cc(d[0], d[1]);
        a++, (f == null || c[2] <= f - 5e-3) && n++;
      }
      return a > 0 && n >= Math.ceil(a * 0.67);
    }, oi = mn.filter((t) => kc(t));
    !jl && oi.length && Za(oi, 1, 0.85), x.push(`<circle cx="${q[0]}" cy="${q[1]}" r="${Gl}" fill="url(#sun-glow)"/>`), x.push(`<circle cx="${q[0]}" cy="${q[1]}" r="${Yl}" fill="yellow" stroke="orange" stroke-width="${Math.max(1, 2 * Ut)}"/>`);
    const ei = Math.min(Bs, Ds), Ec = Math.max(Bs, Ds);
    for (let t = 0; t < 8; t++) {
      const s = t * 360 / 8, n = 20 * Ut;
      if (Bn) {
        const a = ei + (Ec - ei) * (0.5 + 0.5 * Math.sin(t * 1.71)), i = -(0.18 * t + 0.07 * Math.cos(t * 2.13)), r = N(rr + 0.015 * Math.sin(t * 0.93), 0.2, 1), c = N(lr - 0.02 * Math.cos(t * 1.27), 0.25, 1), d = N(cr + 0.04 * Math.cos(t * 1.37), 0.05, 1);
        x.push(`<g transform="translate(${q[0]} ${q[1]}) rotate(${s})">`), x.push(`<line x1="0" y1="0" x2="${n}" y2="0"
            class="sv-sun-ray"
            style="animation-duration:${a.toFixed(2)}s;animation-delay:${i.toFixed(2)}s;--ray-min-scale:${r.toFixed(3)};--ray-max-scale:${c.toFixed(3)};"
            stroke="${Dn}" stroke-width="${1.5 * Ut}" stroke-linecap="round" opacity="${d.toFixed(3)}"/>`), x.push("</g>");
      } else
        x.push(`<g transform="translate(${q[0]} ${q[1]}) rotate(${s})">`), x.push(`<line x1="0" y1="0" x2="${n}" y2="0"
            stroke="${Dn}" stroke-width="${1.5 * Ut}" stroke-linecap="round" opacity="0.6"/>`), x.push("</g>");
    }
    if (tt && (x.push(`<text x="10" y="${it - 24}" fill="#ff3b3b" font-size="12" font-weight="700">SUN OVERRIDE ENABLED</text>`), x.push(`<text x="10" y="${it - 10}" fill="#ff3b3b" font-size="11" font-weight="700">Solar alignment % is disabled</text>`)), Hn && x.push(`<rect x="0" y="0" width="${ot}" height="${it}" fill="url(#vignette)"/>`), aa && this._autoRotateEnabled) {
      const t = Number.isFinite(this._autoRotateFps) ? this._autoRotateFps : 0, s = this._autoRotateIntervalMsDynamic || Wt, n = s > Wt ? " LIMIT" : "";
      x.push(`<text x="10" y="18" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">FPS ${t.toFixed(1)} | ${Math.round(s)}ms${n}</text>`);
    }
    if (ra) {
      const t = Number.isFinite(this._cssFps) ? this._cssFps : 0, s = aa && this._autoRotateEnabled ? 34 : 18;
      x.push(`<text x="10" y="${s}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">CSS FPS ${t.toFixed(1)}</text>`);
    }
    return x.push("</svg>"), x.join("");
  }
};
An.styles = Hi`
    :host {
      display: block;
    }
    .wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    ha-card {
      width: 100%;
      height: 100%;
      padding: 0;
      background: transparent;
      box-shadow: none;
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
    }
  `;
let Mn = An;
const Wi = "sunlight-visualizer-card";
if (!customElements.get(Wi))
  try {
    customElements.define(Wi, Mn);
  } catch {
  }
