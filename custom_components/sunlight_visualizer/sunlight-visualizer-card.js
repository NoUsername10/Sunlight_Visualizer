/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Io = globalThis, xs = Io.ShadowRoot && (Io.ShadyCSS === void 0 || Io.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ms = Symbol(), Yi = /* @__PURE__ */ new WeakMap();
let rn = class {
  constructor(e, t, a) {
    if (this._$cssResult$ = !0, a !== Ms) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (xs && e === void 0) {
      const a = t !== void 0 && t.length === 1;
      a && (e = Yi.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && Yi.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Qa = (u) => new rn(typeof u == "string" ? u : u + "", void 0, Ms), ln = (u, ...e) => {
  const t = u.length === 1 ? u[0] : e.reduce((a, r, p) => a + ((d) => {
    if (d._$cssResult$ === !0) return d.cssText;
    if (typeof d == "number") return d;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + d + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + u[p + 1], u[0]);
  return new rn(t, u, Ms);
}, tr = (u, e) => {
  if (xs) u.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const a = document.createElement("style"), r = Io.litNonce;
    r !== void 0 && a.setAttribute("nonce", r), a.textContent = t.cssText, u.appendChild(a);
  }
}, Zi = xs ? (u) => u : (u) => u instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const a of e.cssRules) t += a.cssText;
  return Qa(t);
})(u) : u;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: er, defineProperty: or, getOwnPropertyDescriptor: sr, getOwnPropertyNames: ir, getOwnPropertySymbols: nr, getPrototypeOf: ar } = Object, bt = globalThis, Xi = bt.trustedTypes, rr = Xi ? Xi.emptyScript : "", bs = bt.reactiveElementPolyfillSupport, Pe = (u, e) => u, ys = { toAttribute(u, e) {
  switch (e) {
    case Boolean:
      u = u ? rr : null;
      break;
    case Object:
    case Array:
      u = u == null ? u : JSON.stringify(u);
  }
  return u;
}, fromAttribute(u, e) {
  let t = u;
  switch (e) {
    case Boolean:
      t = u !== null;
      break;
    case Number:
      t = u === null ? null : Number(u);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(u);
      } catch {
        t = null;
      }
  }
  return t;
} }, cn = (u, e) => !er(u, e), Ji = { attribute: !0, type: String, converter: ys, reflect: !1, useDefault: !1, hasChanged: cn };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), bt.litPropertyMetadata ?? (bt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Yt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ji) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const a = Symbol(), r = this.getPropertyDescriptor(e, a, t);
      r !== void 0 && or(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, a) {
    const { get: r, set: p } = sr(this.prototype, e) ?? { get() {
      return this[t];
    }, set(d) {
      this[t] = d;
    } };
    return { get: r, set(d) {
      const R = r == null ? void 0 : r.call(this);
      p == null || p.call(this, d), this.requestUpdate(e, R, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ji;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Pe("elementProperties"))) return;
    const e = ar(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Pe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Pe("properties"))) {
      const t = this.properties, a = [...ir(t), ...nr(t)];
      for (const r of a) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [a, r] of t) this.elementProperties.set(a, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, a] of this.elementProperties) {
      const r = this._$Eu(t, a);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const r of a) t.unshift(Zi(r));
    } else e !== void 0 && t.push(Zi(e));
    return t;
  }
  static _$Eu(e, t) {
    const a = t.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const a of t.keys()) this.hasOwnProperty(a) && (e.set(a, this[a]), delete this[a]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return tr(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var a;
      return (a = t.hostConnected) == null ? void 0 : a.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var a;
      return (a = t.hostDisconnected) == null ? void 0 : a.call(t);
    });
  }
  attributeChangedCallback(e, t, a) {
    this._$AK(e, a);
  }
  _$ET(e, t) {
    var p;
    const a = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, a);
    if (r !== void 0 && a.reflect === !0) {
      const d = (((p = a.converter) == null ? void 0 : p.toAttribute) !== void 0 ? a.converter : ys).toAttribute(t, a.type);
      this._$Em = e, d == null ? this.removeAttribute(r) : this.setAttribute(r, d), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var p, d;
    const a = this.constructor, r = a._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const R = a.getPropertyOptions(r), _ = typeof R.converter == "function" ? { fromAttribute: R.converter } : ((p = R.converter) == null ? void 0 : p.fromAttribute) !== void 0 ? R.converter : ys;
      this._$Em = r;
      const E = _.fromAttribute(t, R.type);
      this[r] = E ?? ((d = this._$Ej) == null ? void 0 : d.get(r)) ?? E, this._$Em = null;
    }
  }
  requestUpdate(e, t, a, r = !1, p) {
    var d;
    if (e !== void 0) {
      const R = this.constructor;
      if (r === !1 && (p = this[e]), a ?? (a = R.getPropertyOptions(e)), !((a.hasChanged ?? cn)(p, t) || a.useDefault && a.reflect && p === ((d = this._$Ej) == null ? void 0 : d.get(e)) && !this.hasAttribute(R._$Eu(e, a)))) return;
      this.C(e, t, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: a, reflect: r, wrapped: p }, d) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, d ?? t ?? this[e]), p !== !0 || d !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var a;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [p, d] of this._$Ep) this[p] = d;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [p, d] of r) {
        const { wrapped: R } = d, _ = this[p];
        R !== !0 || this._$AL.has(p) || _ === void 0 || this.C(p, void 0, d, _);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (a = this._$EO) == null || a.forEach((r) => {
        var p;
        return (p = r.hostUpdate) == null ? void 0 : p.call(r);
      }), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((a) => {
      var r;
      return (r = a.hostUpdated) == null ? void 0 : r.call(a);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
Yt.elementStyles = [], Yt.shadowRootOptions = { mode: "open" }, Yt[Pe("elementProperties")] = /* @__PURE__ */ new Map(), Yt[Pe("finalized")] = /* @__PURE__ */ new Map(), bs == null || bs({ ReactiveElement: Yt }), (bt.reactiveElementVersions ?? (bt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const De = globalThis, Ki = (u) => u, Oo = De.trustedTypes, Qi = Oo ? Oo.createPolicy("lit-html", { createHTML: (u) => u }) : void 0, hn = "$lit$", gt = `lit$${Math.random().toFixed(9).slice(2)}$`, un = "?" + gt, lr = `<${un}>`, xt = document, Le = () => xt.createComment(""), ze = (u) => u === null || typeof u != "object" && typeof u != "function", Cs = Array.isArray, cr = (u) => Cs(u) || typeof (u == null ? void 0 : u[Symbol.iterator]) == "function", _s = `[ 	
\f\r]`, ke = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, tn = /-->/g, en = />/g, wt = RegExp(`>|${_s}(?:([^\\s"'>=/]+)(${_s}*=${_s}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), on = /'/g, sn = /"/g, fn = /^(?:script|style|textarea|title)$/i, hr = (u) => (e, ...t) => ({ _$litType$: u, strings: e, values: t }), Ho = hr(1), Mt = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), nn = /* @__PURE__ */ new WeakMap(), St = xt.createTreeWalker(xt, 129);
function dn(u, e) {
  if (!Cs(u) || !u.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Qi !== void 0 ? Qi.createHTML(e) : e;
}
const ur = (u, e) => {
  const t = u.length - 1, a = [];
  let r, p = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", d = ke;
  for (let R = 0; R < t; R++) {
    const _ = u[R];
    let E, T, S = -1, W = 0;
    for (; W < _.length && (d.lastIndex = W, T = d.exec(_), T !== null); ) W = d.lastIndex, d === ke ? T[1] === "!--" ? d = tn : T[1] !== void 0 ? d = en : T[2] !== void 0 ? (fn.test(T[2]) && (r = RegExp("</" + T[2], "g")), d = wt) : T[3] !== void 0 && (d = wt) : d === wt ? T[0] === ">" ? (d = r ?? ke, S = -1) : T[1] === void 0 ? S = -2 : (S = d.lastIndex - T[2].length, E = T[1], d = T[3] === void 0 ? wt : T[3] === '"' ? sn : on) : d === sn || d === on ? d = wt : d === tn || d === en ? d = ke : (d = wt, r = void 0);
    const M = d === wt && u[R + 1].startsWith("/>") ? " " : "";
    p += d === ke ? _ + lr : S >= 0 ? (a.push(E), _.slice(0, S) + hn + _.slice(S) + gt + M) : _ + gt + (S === -2 ? R : M);
  }
  return [dn(u, p + (u[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class Ie {
  constructor({ strings: e, _$litType$: t }, a) {
    let r;
    this.parts = [];
    let p = 0, d = 0;
    const R = e.length - 1, _ = this.parts, [E, T] = ur(e, t);
    if (this.el = Ie.createElement(E, a), St.currentNode = this.el.content, t === 2 || t === 3) {
      const S = this.el.content.firstChild;
      S.replaceWith(...S.childNodes);
    }
    for (; (r = St.nextNode()) !== null && _.length < R; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const S of r.getAttributeNames()) if (S.endsWith(hn)) {
          const W = T[d++], M = r.getAttribute(S).split(gt), Q = /([.?@])?(.*)/.exec(W);
          _.push({ type: 1, index: p, name: Q[2], strings: M, ctor: Q[1] === "." ? dr : Q[1] === "?" ? pr : Q[1] === "@" ? mr : Wo }), r.removeAttribute(S);
        } else S.startsWith(gt) && (_.push({ type: 6, index: p }), r.removeAttribute(S));
        if (fn.test(r.tagName)) {
          const S = r.textContent.split(gt), W = S.length - 1;
          if (W > 0) {
            r.textContent = Oo ? Oo.emptyScript : "";
            for (let M = 0; M < W; M++) r.append(S[M], Le()), St.nextNode(), _.push({ type: 2, index: ++p });
            r.append(S[W], Le());
          }
        }
      } else if (r.nodeType === 8) if (r.data === un) _.push({ type: 2, index: p });
      else {
        let S = -1;
        for (; (S = r.data.indexOf(gt, S + 1)) !== -1; ) _.push({ type: 7, index: p }), S += gt.length - 1;
      }
      p++;
    }
  }
  static createElement(e, t) {
    const a = xt.createElement("template");
    return a.innerHTML = e, a;
  }
}
function Xt(u, e, t = u, a) {
  var d, R;
  if (e === Mt) return e;
  let r = a !== void 0 ? (d = t._$Co) == null ? void 0 : d[a] : t._$Cl;
  const p = ze(e) ? void 0 : e._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== p && ((R = r == null ? void 0 : r._$AO) == null || R.call(r, !1), p === void 0 ? r = void 0 : (r = new p(u), r._$AT(u, t, a)), a !== void 0 ? (t._$Co ?? (t._$Co = []))[a] = r : t._$Cl = r), r !== void 0 && (e = Xt(u, r._$AS(u, e.values), r, a)), e;
}
class fr {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: a } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? xt).importNode(t, !0);
    St.currentNode = r;
    let p = St.nextNode(), d = 0, R = 0, _ = a[0];
    for (; _ !== void 0; ) {
      if (d === _.index) {
        let E;
        _.type === 2 ? E = new Oe(p, p.nextSibling, this, e) : _.type === 1 ? E = new _.ctor(p, _.name, _.strings, this, e) : _.type === 6 && (E = new gr(p, this, e)), this._$AV.push(E), _ = a[++R];
      }
      d !== (_ == null ? void 0 : _.index) && (p = St.nextNode(), d++);
    }
    return St.currentNode = xt, r;
  }
  p(e) {
    let t = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, t), t += a.strings.length - 2) : a._$AI(e[t])), t++;
  }
}
class Oe {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, a, r) {
    this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = a, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = Xt(this, e, t), ze(e) ? e === O || e == null || e === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : e !== this._$AH && e !== Mt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : cr(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== O && ze(this._$AH) ? this._$AA.nextSibling.data = e : this.T(xt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var p;
    const { values: t, _$litType$: a } = e, r = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = Ie.createElement(dn(a.h, a.h[0]), this.options)), a);
    if (((p = this._$AH) == null ? void 0 : p._$AD) === r) this._$AH.p(t);
    else {
      const d = new fr(r, this), R = d.u(this.options);
      d.p(t), this.T(R), this._$AH = d;
    }
  }
  _$AC(e) {
    let t = nn.get(e.strings);
    return t === void 0 && nn.set(e.strings, t = new Ie(e)), t;
  }
  k(e) {
    Cs(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let a, r = 0;
    for (const p of e) r === t.length ? t.push(a = new Oe(this.O(Le()), this.O(Le()), this, this.options)) : a = t[r], a._$AI(p), r++;
    r < t.length && (this._$AR(a && a._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, t); e !== this._$AB; ) {
      const r = Ki(e).nextSibling;
      Ki(e).remove(), e = r;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class Wo {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, a, r, p) {
    this.type = 1, this._$AH = O, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = p, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = O;
  }
  _$AI(e, t = this, a, r) {
    const p = this.strings;
    let d = !1;
    if (p === void 0) e = Xt(this, e, t, 0), d = !ze(e) || e !== this._$AH && e !== Mt, d && (this._$AH = e);
    else {
      const R = e;
      let _, E;
      for (e = p[0], _ = 0; _ < p.length - 1; _++) E = Xt(this, R[a + _], t, _), E === Mt && (E = this._$AH[_]), d || (d = !ze(E) || E !== this._$AH[_]), E === O ? e = O : e !== O && (e += (E ?? "") + p[_ + 1]), this._$AH[_] = E;
    }
    d && !r && this.j(e);
  }
  j(e) {
    e === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class dr extends Wo {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === O ? void 0 : e;
  }
}
class pr extends Wo {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== O);
  }
}
class mr extends Wo {
  constructor(e, t, a, r, p) {
    super(e, t, a, r, p), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = Xt(this, e, t, 0) ?? O) === Mt) return;
    const a = this._$AH, r = e === O && a !== O || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, p = e !== O && (a === O || r);
    r && this.element.removeEventListener(this.name, this, a), p && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class gr {
  constructor(e, t, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Xt(this, e);
  }
}
const $s = De.litHtmlPolyfillSupport;
$s == null || $s(Ie, Oe), (De.litHtmlVersions ?? (De.litHtmlVersions = [])).push("3.3.2");
const br = (u, e, t) => {
  const a = (t == null ? void 0 : t.renderBefore) ?? e;
  let r = a._$litPart$;
  if (r === void 0) {
    const p = (t == null ? void 0 : t.renderBefore) ?? null;
    a._$litPart$ = r = new Oe(e.insertBefore(Le(), p), p, void 0, t ?? {});
  }
  return r._$AI(u), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Rt = globalThis;
let Zt = class extends Yt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = br(t, this.renderRoot, this.renderOptions);
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
    return Mt;
  }
};
var an;
Zt._$litElement$ = !0, Zt.finalized = !0, (an = Rt.litElementHydrateSupport) == null || an.call(Rt, { LitElement: Zt });
const vs = Rt.litElementPolyfillSupport;
vs == null || vs({ LitElement: Zt });
(Rt.litElementVersions ?? (Rt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _r = { CHILD: 2 }, $r = (u) => (...e) => ({ _$litDirective$: u, values: e });
class vr {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, a) {
    this._$Ct = e, this._$AM = t, this._$Ci = a;
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class ws extends vr {
  constructor(e) {
    if (super(e), this.it = O, e.type !== _r.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === O || e == null) return this._t = void 0, this.it = e;
    if (e === Mt) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const t = [e];
    return t.raw = t, this._t = { _$litType$: this.constructor.resultType, strings: t, values: [] };
  }
}
ws.directiveName = "unsafeHTML", ws.resultType = 1;
const yr = $r(ws), Es = class Es extends Zt {
  constructor() {
    super(...arguments), this._config = {};
  }
  setConfig(e) {
    this._config = e || {};
  }
  set hass(e) {
    this._hass = e, this.requestUpdate();
  }
  _setConfigValue(e, t) {
    if (!this._config) return;
    const a = { ...this._config };
    t === "" || t === void 0 || t === null ? delete a[e] : a[e] = t, this._config = a, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: a },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _valueChanged(e) {
    var p;
    const t = e.target, a = t == null ? void 0 : t.configValue;
    if (!a) return;
    let r = ((p = e.detail) == null ? void 0 : p.value) ?? t.value;
    if (t.checked !== void 0 && (r = t.checked), t.type === "number") {
      const d = Number(r);
      Number.isNaN(d) || (r = d);
    }
    this._setConfigValue(a, r);
  }
  _setNumberEntityValue(e, t) {
    !this._hass || !e || this._hass.callService("number", "set_value", { entity_id: e, value: t });
  }
  _setSelectEntityOption(e, t) {
    !this._hass || !e || !t || this._hass.callService("select", "select_option", { entity_id: e, option: t });
  }
  render() {
    var Be, Fe, ut, At, et, Nt, Kt, Qt, te, ee, oe, se, ie, ne, ae, Ue, Ve, je, Ge, qe, Ye, re, Go, le, Ze, Tt, ft, dt, kt, ot, st, _t, pt, P, Pt, Dt, Xe, Je, Lt, Ke, Qe, to, eo, ce, he, zt, It, ue, oo, so, io, no, ao, ro, fe, lo, co, de, pe, ho, me, ge, uo, fo, po, Ot, mo, go, bo, _o, $o, vo, yo, be, wo, So, Ro, xo, _e, $e;
    if (!this._hass) return Ho``;
    const e = this._config || {}, t = e.siSourceAttr ?? "sunlight_visualizer_source", a = e.siSourceValue ?? "sunlight_visualizer", r = Object.entries(this._hass.states ?? {}).filter(
      ([, v]) => {
        var w;
        return ((w = v == null ? void 0 : v.attributes) == null ? void 0 : w[t]) === a;
      }
    ), p = (v) => {
      for (const [w, j] of r)
        if (v(j, w)) return w;
      return null;
    }, d = (v) => p((w) => {
      var j;
      return ((j = w == null ? void 0 : w.attributes) == null ? void 0 : j.camera_rotation) === v;
    }), R = (v) => p((w) => {
      var j;
      return ((j = w == null ? void 0 : w.attributes) == null ? void 0 : j.si_setting) === v;
    }), _ = e.rotationHEntity ?? d("h") ?? "", E = e.rotationVEntity ?? d("v") ?? "", T = e.houseAngleEntity ?? R("house_angle") ?? "", S = R("ceiling_tilt") ?? "", W = R("house_direction") ?? "", M = R("roof_direction") ?? "";
    let Q = e.roofPowerEntity ?? "";
    if (!Q) {
      for (const [, v] of r)
        if ((Be = v == null ? void 0 : v.attributes) != null && Be.roof_power_entity) {
          Q = v.attributes.roof_power_entity;
          break;
        }
    }
    let Ct = e.roofPowerEnabled, Et = e.roofPowerInvert;
    if (Ct === void 0 || Et === void 0)
      for (const [, v] of r)
        Ct === void 0 && ((Fe = v == null ? void 0 : v.attributes) == null ? void 0 : Fe.roof_power_enabled) !== void 0 && (Ct = v.attributes.roof_power_enabled), Et === void 0 && ((ut = v == null ? void 0 : v.attributes) == null ? void 0 : ut.roof_power_invert) !== void 0 && (Et = v.attributes.roof_power_invert);
    Number(((Nt = (et = (At = this._hass) == null ? void 0 : At.states) == null ? void 0 : et[T]) == null ? void 0 : Nt.state) ?? e.houseAngle ?? 0);
    const He = ["North", "NE", "East", "SE", "South", "SW", "West", "NW", "Custom"], We = ["front", "back", "left", "right"], tt = !!W, q = !!M, Bo = tt ? ((ee = (te = (Qt = (Kt = this._hass) == null ? void 0 : Kt.states) == null ? void 0 : Qt[W]) == null ? void 0 : te.attributes) == null ? void 0 : ee.options) ?? He : He, Fo = q ? ((ne = (ie = (se = (oe = this._hass) == null ? void 0 : oe.states) == null ? void 0 : se[M]) == null ? void 0 : ie.attributes) == null ? void 0 : ne.options) ?? We : We, Jt = tt ? ((Ve = (Ue = (ae = this._hass) == null ? void 0 : ae.states) == null ? void 0 : Ue[W]) == null ? void 0 : Ve.state) ?? "Custom" : e.houseDirection ?? "Custom", V = q ? ((qe = (Ge = (je = this._hass) == null ? void 0 : je.states) == null ? void 0 : Ge[M]) == null ? void 0 : qe.state) ?? "front" : e.roofTiltFace ?? "front", Uo = !!_, Vo = !!E, jo = !!S;
    return Ho`
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
              .value=${Number(((Go = (re = (Ye = this._hass) == null ? void 0 : Ye.states) == null ? void 0 : re[T]) == null ? void 0 : Go.state) ?? 0)}
              .min=${Number(((ft = (Tt = (Ze = (le = this._hass) == null ? void 0 : le.states) == null ? void 0 : Ze[T]) == null ? void 0 : Tt.attributes) == null ? void 0 : ft.min) ?? 0)}
              .max=${Number(((st = (ot = (kt = (dt = this._hass) == null ? void 0 : dt.states) == null ? void 0 : kt[T]) == null ? void 0 : ot.attributes) == null ? void 0 : st.max) ?? 359)}
              .step=${Number(((Pt = (P = (pt = (_t = this._hass) == null ? void 0 : _t.states) == null ? void 0 : pt[T]) == null ? void 0 : P.attributes) == null ? void 0 : Pt.step) ?? 1)}
              @change=${(v) => {
      var w;
      return this._setNumberEntityValue(T, Number(((w = v.target) == null ? void 0 : w.value) ?? 0));
    }}
              .disabled=${!T}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"House direction"}
              .selector=${{ select: { options: Bo, mode: "dropdown" } }}
              .value=${Jt}
              @value-changed=${(v) => {
      var j;
      const w = ((j = v.detail) == null ? void 0 : j.value) ?? Jt;
      this._setConfigValue("houseDirection", w), tt && this._setSelectEntityOption(W, w);
    }}
            ></ha-selector>
            <div class="helper">Quick preset for the house front orientation</div>
          </div>
        </div>
        <div class="row">
          <div>
            <div class="slider-label">Ceiling tilt</div>
            <ha-slider
              .value=${Number(((Je = (Xe = (Dt = this._hass) == null ? void 0 : Dt.states) == null ? void 0 : Xe[S]) == null ? void 0 : Je.state) ?? 0)}
              .min=${Number(((to = (Qe = (Ke = (Lt = this._hass) == null ? void 0 : Lt.states) == null ? void 0 : Ke[S]) == null ? void 0 : Qe.attributes) == null ? void 0 : to.min) ?? 0)}
              .max=${Number(((zt = (he = (ce = (eo = this._hass) == null ? void 0 : eo.states) == null ? void 0 : ce[S]) == null ? void 0 : he.attributes) == null ? void 0 : zt.max) ?? 90)}
              .step=${Number(((so = (oo = (ue = (It = this._hass) == null ? void 0 : It.states) == null ? void 0 : ue[S]) == null ? void 0 : oo.attributes) == null ? void 0 : so.step) ?? 1)}
              @change=${(v) => {
      var w;
      return this._setNumberEntityValue(S, Number(((w = v.target) == null ? void 0 : w.value) ?? 0));
    }}
              .disabled=${!jo}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"Roof direction"}
              .selector=${{ select: { options: Fo, mode: "dropdown" } }}
              .value=${V}
              @value-changed=${(v) => {
      var j;
      const w = ((j = v.detail) == null ? void 0 : j.value) ?? V;
      this._setConfigValue("roofTiltFace", w), q && this._setSelectEntityOption(M, w);
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
              .value=${Number(((ao = (no = (io = this._hass) == null ? void 0 : io.states) == null ? void 0 : no[_]) == null ? void 0 : ao.state) ?? 0)}
              .min=${Number(((co = (lo = (fe = (ro = this._hass) == null ? void 0 : ro.states) == null ? void 0 : fe[_]) == null ? void 0 : lo.attributes) == null ? void 0 : co.min) ?? 0)}
              .max=${Number(((me = (ho = (pe = (de = this._hass) == null ? void 0 : de.states) == null ? void 0 : pe[_]) == null ? void 0 : ho.attributes) == null ? void 0 : me.max) ?? 359)}
              .step=${Number(((po = (fo = (uo = (ge = this._hass) == null ? void 0 : ge.states) == null ? void 0 : uo[_]) == null ? void 0 : fo.attributes) == null ? void 0 : po.step) ?? 1)}
              @change=${(v) => {
      var w;
      return this._setNumberEntityValue(_, Number(((w = v.target) == null ? void 0 : w.value) ?? 0));
    }}
              .disabled=${!Uo}
            ></ha-slider>
          </div>
          <div>
            <div class="slider-label">Camera rotation V</div>
            <ha-slider
              .value=${Number(((go = (mo = (Ot = this._hass) == null ? void 0 : Ot.states) == null ? void 0 : mo[E]) == null ? void 0 : go.state) ?? 0)}
              .min=${Number(((vo = ($o = (_o = (bo = this._hass) == null ? void 0 : bo.states) == null ? void 0 : _o[E]) == null ? void 0 : $o.attributes) == null ? void 0 : vo.min) ?? 0)}
              .max=${Number(((So = (wo = (be = (yo = this._hass) == null ? void 0 : yo.states) == null ? void 0 : be[E]) == null ? void 0 : wo.attributes) == null ? void 0 : So.max) ?? 90)}
              .step=${Number((($e = (_e = (xo = (Ro = this._hass) == null ? void 0 : Ro.states) == null ? void 0 : xo[E]) == null ? void 0 : _e.attributes) == null ? void 0 : $e.step) ?? 1)}
              @change=${(v) => {
      var w;
      return this._setNumberEntityValue(E, Number(((w = v.target) == null ? void 0 : w.value) ?? 0));
    }}
              .disabled=${!Vo}
            ></ha-slider>
          </div>
        </div>
        <div class="row">
          <div>${_ || "Camera rotation H not found"}</div>
          <div>${E || "Camera rotation V not found"}</div>
        </div>
      </div>

      <div class="section">
        <div class="title">Roof power</div>
        <div class="row single">
          <ha-selector
            .hass=${this._hass}
            .selector=${{ entity: { domain: ["sensor", "number", "input_number"] } }}
            .value=${Q}
            @value-changed=${(v) => {
      var w;
      return this._setConfigValue("roofPowerEntity", (w = v.detail) == null ? void 0 : w.value);
    }}
          ></ha-selector>
        </div>
        <div class="row single">
          <div class="switch-row">
            <span>Enable power label</span>
            <ha-switch
              .checked=${Ct ?? !1}
              @change=${(v) => {
      var w;
      return this._setConfigValue("roofPowerEnabled", (w = v.target) == null ? void 0 : w.checked);
    }}
            ></ha-switch>
          </div>
          <div class="switch-row">
            <span>Invert power value</span>
            <ha-switch
              .checked=${Et ?? !1}
              @change=${(v) => {
      var w;
      return this._setConfigValue("roofPowerInvert", (w = v.target) == null ? void 0 : w.checked);
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
            .value=${String(e.autoRotateSpeed ?? 10)}
            .configValue=${"autoRotateSpeed"}
            @change=${this._valueChanged}
          ></ha-textfield>
        </div>
      </div>
    `;
  }
};
Es.styles = ln`
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
let Ss = Es;
customElements.define("sunlight-visualizer-card-editor", Ss);
const As = class As extends Zt {
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
    super.disconnectedCallback(), this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null);
  }
  getCardSize() {
    return 4;
  }
  render() {
    if (!this._hass)
      return Ho`<ha-card></ha-card>`;
    const e = this._config || {}, t = Number(e.cardWidth ?? 450), a = Number(e.cardHeight ?? 450), r = this.renderSvg();
    return Ho`<div class="wrap"><ha-card style="width:${t}px; height:${a}px;">${yr(r)}</ha-card></div>`;
  }
  renderSvg() {
    var Si, Ri, xi, Mi, Ci, Ei, Ai, Ni, Ti, ki, Pi, Di, Li, zi, Ii, Oi;
    const e = this._hass, t = this._config || {}, a = t.siSourceAttr ?? "sunlight_visualizer_source", r = t.siSourceValue ?? "sunlight_visualizer", p = Object.entries(e.states ?? {}).filter(
      ([, o]) => {
        var s;
        return ((s = o == null ? void 0 : o.attributes) == null ? void 0 : s[a]) === r;
      }
    ), d = (o) => {
      for (const [s, i] of p)
        if (o(i, s)) return [s, i];
      return null;
    }, R = (o) => {
      const s = d((i) => {
        var n;
        return ((n = i == null ? void 0 : i.attributes) == null ? void 0 : n.wall) === o;
      });
      return s ? s[0] : void 0;
    }, _ = (o) => {
      const s = d((i) => {
        var n;
        return ((n = i == null ? void 0 : i.attributes) == null ? void 0 : n.camera_rotation) === o;
      });
      return s ? s[0] : void 0;
    }, E = (o) => {
      const s = d((i) => {
        var n;
        return ((n = i == null ? void 0 : i.attributes) == null ? void 0 : n.si_setting) === o;
      });
      return s ? s[0] : void 0;
    }, T = d(
      (o) => {
        var s, i;
        return ((s = o == null ? void 0 : o.attributes) == null ? void 0 : s.sun_azimuth) != null && ((i = o == null ? void 0 : o.attributes) == null ? void 0 : i.sun_elevation) != null;
      }
    ), S = T ? T[1].attributes : null, W = d(
      (o) => {
        var s, i, n;
        return ((s = o == null ? void 0 : o.attributes) == null ? void 0 : s.roof_direction) != null || ((i = o == null ? void 0 : o.attributes) == null ? void 0 : i.ceiling_tilt) != null || ((n = o == null ? void 0 : o.attributes) == null ? void 0 : n.house_angle) != null;
      }
    ), M = W ? W[1].attributes : null, Q = !!(M != null && M.force_sun_fallback), Ct = Number(t.cardWidth ?? 450), Et = Number(t.cardHeight ?? 450), He = Ct, We = Et, tt = He, q = We, Bo = tt, Fo = q, Jt = tt * 0.1, V = t.floorScale ?? 2.6, Uo = tt * 0.5, Vo = q * 0.4, jo = t.floorColor ?? "#2f2f2f", Be = t.rotationHEntity ?? _("h") ?? "input_number.cube_rotation_h", Fe = t.rotationVEntity ?? _("v") ?? "input_number.cube_rotation_v", ut = t.preferIntegrationSettings ?? !0, At = t.houseAngleEntity ?? null;
    let et = Number(t.houseAngle ?? 0);
    const Nt = E("house_angle");
    At && e.states[At] ? et = Number(((Si = e.states[At]) == null ? void 0 : Si.state) ?? et) : Nt && e.states[Nt] ? et = Number(((Ri = e.states[Nt]) == null ? void 0 : Ri.state) ?? et) : (ut || t.houseAngle == null) && (M == null ? void 0 : M.house_angle) != null && (et = Number(M.house_angle ?? et));
    const Kt = t.wallFrontPctEntity ?? R("front"), Qt = t.wallRightPctEntity ?? R("right"), te = t.wallBackPctEntity ?? R("back"), ee = t.wallLeftPctEntity ?? R("left"), oe = t.roofPctEntity ?? R("ceiling"), se = t.roofPowerEntity ?? (M == null ? void 0 : M.roof_power_entity) ?? null, ie = t.roofPowerEnabled, ne = ie !== void 0 ? !!ie : (M == null ? void 0 : M.roof_power_enabled) ?? !1, ae = t.roofPowerInvert, Ue = ae !== void 0 ? !!ae : (M == null ? void 0 : M.roof_power_invert) ?? !1, Ve = Kt ? Number(((xi = e.states[Kt]) == null ? void 0 : xi.state) ?? 0) : 0, je = Qt ? Number(((Mi = e.states[Qt]) == null ? void 0 : Mi.state) ?? 0) : 0, Ge = te ? Number(((Ci = e.states[te]) == null ? void 0 : Ci.state) ?? 0) : 0, qe = ee ? Number(((Ei = e.states[ee]) == null ? void 0 : Ei.state) ?? 0) : 0, Ye = oe ? Number(((Ai = e.states[oe]) == null ? void 0 : Ai.state) ?? 0) : 0, re = ne && se ? Number((Ni = e.states[se]) == null ? void 0 : Ni.state) : NaN, le = ne ? ((o) => Number.isFinite(o) ? o >= 1e3 ? `${(o / 1e3).toFixed(2)} kW` : `${Math.round(o)} W` : "0 W")(Ue ? Math.abs(re) : re) : "0 W", Ze = t.useSunEntity ?? !1, Tt = t.sunEntityId ?? "sun.sun", ft = t.sunAzEntity ?? null, dt = t.sunElEntity ?? null;
    let kt = Number(t.sunDistance ?? 3), ot = Number(t.sunAz ?? 135), st = Number(t.sunEl ?? 55);
    ft && e.states[ft] && (ot = Number(((Ti = e.states[ft]) == null ? void 0 : Ti.state) ?? ot)), dt && e.states[dt] && (st = Number(((ki = e.states[dt]) == null ? void 0 : ki.state) ?? st)), !ft && ut && (S == null ? void 0 : S.sun_azimuth) != null && (ot = Number(S.sun_azimuth ?? ot)), !dt && ut && (S == null ? void 0 : S.sun_elevation) != null && (st = Number(S.sun_elevation ?? st)), !ft && !dt && !S && Ze && e.states[Tt] && (ot = Number(((Pi = e.states[Tt].attributes) == null ? void 0 : Pi.azimuth) ?? ot), st = Number(((Di = e.states[Tt].attributes) == null ? void 0 : Di.elevation) ?? st));
    const _t = t.roofTiltEnabled ?? !0;
    let pt = Number(t.roofTiltDeg ?? 25), P = t.roofTiltFace ?? "front";
    const Pt = E("ceiling_tilt"), Dt = E("roof_direction"), Xe = Number(t.roofTiltMax ?? 89), Je = Number(t.roofTiltOpacity ?? 1);
    Pt && e.states[Pt] ? pt = Number(((Li = e.states[Pt]) == null ? void 0 : Li.state) ?? pt) : (ut || t.roofTiltDeg == null) && (M == null ? void 0 : M.ceiling_tilt) != null && (pt = Number(M.ceiling_tilt ?? pt)), Dt && e.states[Dt] ? P = String(((zi = e.states[Dt]) == null ? void 0 : zi.state) ?? P) : (ut || t.roofTiltFace == null) && (M == null ? void 0 : M.roof_direction) != null && (P = String(M.roof_direction));
    const Lt = t.shadowEnabled ?? !0, Ke = Number(t.shadowOpacity ?? 0.35), Qe = Number(t.shadowBlur ?? 4), to = Number(t.shadowContactOpacity ?? 0.12), eo = Number(t.shadowContactBlur ?? 2.5), ce = t.shadowColor ?? "#000000", he = Number(t.shadowClipInset ?? 0.02), zt = t.sunlightEnabled ?? !0, It = t.sunlightColor ?? [255, 225, 160], ue = Number(t.sunlightOpacity ?? 0.7), oo = Number(t.sunlightSpread ?? 0.7), so = Number(t.wallBottomMix ?? 0.01), io = Number(t.wallMidMix ?? 0.7), no = Number(t.wallTopMix ?? 1.3), ao = Number(t.ceilingDarkMix ?? 0.1), ro = Number(t.ceilingLightMix ?? 1.4), fe = t.horizonEnabled ?? !0, lo = Number(t.horizonBase ?? 0.55), co = Number(t.horizonTiltStrength ?? 0.65), de = Number(t.horizonBand ?? 0.15), pe = t.horizonTopColor ?? [120, 170, 220], ho = t.horizonBandColor ?? [255, 210, 150], me = t.horizonBottomColor ?? [70, 80, 95], ge = t.vignetteEnabled ?? !0, uo = Number(t.vignetteOpacity ?? 0.35), fo = Number(t.vignetteRadius ?? 0.65), po = Number(t.vignetteInner ?? 0.85), Ot = t.vignetteColor ?? [0, 0, 0], mo = t.roofBackEnabled ?? !0, go = Number(t.roofBackMix ?? 0.7), bo = Number(t.roofBackOpacity ?? 1), _o = Number(t.roofGradientDarkMix ?? 0.125), $o = Number(t.roofGradientLightMix ?? 1.25), vo = t.roofSidesEnabled ?? !0, yo = Number(t.roofSideMix ?? 0.45), be = Number(t.roofSideOpacity ?? 1), wo = t.roofCapEnabled ?? !0, So = Number(t.floorCompassStroke ?? 4), Ro = Number(t.floorCompassRingBand ?? 0.09), xo = t.floorCompassRingMiddleColor ?? "rgba(255,255,255,0.9)", _e = t.floorCompassRingSideColor ?? "rgba(210,140,140,0.345)", $e = Number(t.floorCompassRingSideWidth ?? 3), v = t.floorCompassTicksEnabled ?? !0, w = t.floorCompassTickColor ?? "rgba(0,0,0,0.75)", j = Number(t.floorCompassTickWidth ?? 1), pn = Number(t.floorCompassTickMajorWidth ?? 4), mn = Number(t.floorCompassTickLength ?? -0.1), gn = Number(t.floorCompassTickMajorLength ?? -0.2), bn = Number(t.floorCompassLabelSize ?? 20), _n = Number(t.floorCompassLabelInset ?? -0.25), $n = Number(t.floorCompassLabelScaleBoost ?? 1.2), vn = Number(t.floorCompassLabelScaleMin ?? 0.6), yn = Number(t.floorCompassLabelScaleMax ?? 2), wn = Number(t.floorCompassLabelStroke ?? 1), Ns = Number(t.arrowScaleBoost ?? 0.6), Ts = Number(t.floorPointerScaleMin ?? 0.05), ks = Number(t.floorPointerScaleMax ?? 1), Ps = Number(t.floorPointerBaseWidth ?? 3), Sn = Number(t.floorPointerBaseHead ?? 15), Rn = Number(t.floorWallLabelSize ?? 12), Mo = Number(t.floorWallLabelOffset ?? 0.55), xn = Number(t.floorWallLabelScaleBoost ?? 1.2), Mn = Number(t.floorWallLabelScaleMin ?? 0.5), Cn = Number(t.floorWallLabelScaleMax ?? 1.8), En = Number(t.floorWallLabelScreenLift ?? 6), An = t.floorWallLabelColor ?? "rgba(255,255,255,0.9)", Nn = t.floorWallLabelStroke ?? "rgba(0,0,0,0.6)", Tn = Number(t.floorWallLabelStrokeWidth ?? 0.5), kn = Number(t.wallLabelVisibleThreshold ?? -0.05), Pn = Number(t.wallPctVisibleThreshold ?? -0.215), Dn = Number(t.wallPctAreaThreshold ?? 120), Ln = Number(t.wallPctVerticalPos ?? 0.66), Ds = t.surfaceLabelEnabled ?? !0, qo = Number(t.surfaceLabelSize ?? 12), zn = Number(t.surfaceLabelScaleBoost ?? 1.5), In = Number(t.surfaceLabelScaleMin ?? 0.6), On = Number(t.surfaceLabelScaleMax ?? 1.6), Ls = t.surfaceLabelColor ?? "rgba(255,213,0,.95)", zs = t.surfaceLabelStroke ?? "rgba(0,0,0,0.5)", Yo = Number(t.surfaceLabelStrokeWidth ?? 0.5), Zo = Number(t.surfaceLabelOffset ?? 0.03), Hn = Number(t.roofPowerLabelScale ?? 0.85), Wn = t.roofPowerLabelColor ?? "rgba(255,255,255,0.9)", Bn = t.frontDoorEnabled ?? !0, Is = Number(t.frontDoorWidth ?? 0.55), Fn = Number(t.frontDoorHeight ?? 1.1), Un = Number(t.frontDoorBottomInset ?? 0.05), Vn = Number(t.frontDoorOffset ?? 0.01), jn = t.frontDoorColor ?? "rgba(0,0,0,0.55)", Gn = Number(t.frontDoorOpacity ?? 0.9), Y = t.faceColors ?? {
      front: "#faf5f5ff",
      right: "#d8d2d2ff",
      top: "#13a057",
      back: "#d8d2d2ff",
      left: "#d8d2d2ff",
      bottom: "#d8d2d2ff"
    }, qn = t.autoRotateEnabledDefault ?? !1, Xo = Number(t.autoRotateSpeed ?? 10), $t = Number(t.autoRotateIntervalMs ?? 50), Jo = Number(t.autoRotateTapDelayMs ?? 250), Yn = t.autoRotateStopOnFullTurn ?? !0, Os = Number(t.autoRotateTurnCount ?? 1), Zn = t.autoRotateShowFps ?? !0, Xn = Number(t.autoRotateFpsWindowMs ?? 1e3), Jn = t.autoRotateAdaptiveEnabled ?? !0, Hs = Number(t.autoRotateAdaptiveMaxIntervalMs ?? 1e3), Kn = Number(t.autoRotateAdaptiveStepMs ?? 10), Qn = Number(t.autoRotateAdaptiveCheckMs ?? 1e3), ta = Number(t.autoRotateAdaptiveFpsThreshold ?? 0.8), ea = Number(t.autoRotateCalibrateMs ?? 2e3), oa = Number(t.autoRotateCalibrateFactor ?? 0.85);
    this._autoRotateSpeed = Xo, this._autoRotateIntervalMs = $t, this._autoRotateEnabled === void 0 && (this._autoRotateEnabled = qn), this._autoRotateOffsetDeg === void 0 && (this._autoRotateOffsetDeg = 0), this._autoRotateIntervalMsDynamic === void 0 && (this._autoRotateIntervalMsDynamic = $t), this._autoRotateFpsSamples === void 0 && (this._autoRotateFpsSamples = []), this._autoRotateFps === void 0 && (this._autoRotateFps = 0), this._autoRotateCalibrated === void 0 && (this._autoRotateCalibrated = !1), this._autoRotateAccumDeg === void 0 && (this._autoRotateAccumDeg = 0), this._autoRotateTargetDeg === void 0 && (this._autoRotateTargetDeg = 0);
    const Ko = () => typeof performance < "u" && performance.now ? performance.now() : Date.now(), Ws = (o) => {
      const s = this._autoRotateFpsSamples || [];
      s.push(o);
      const i = o - Xn;
      for (; s.length && s[0] < i; ) s.shift();
      if (this._autoRotateFpsSamples = s, s.length >= 2) {
        const n = (s[s.length - 1] - s[0]) / 1e3;
        this._autoRotateFps = n > 0 ? (s.length - 1) / n : 0;
      }
    }, Bs = (o) => {
      if (!this._autoRotateCalibrated || !Jn) return;
      const s = this._autoRotateAdaptiveLastCheck || 0;
      if (o - s < Qn) return;
      this._autoRotateAdaptiveLastCheck = o;
      const i = 1e3 / this._autoRotateIntervalMsDynamic;
      if (this._autoRotateFps && this._autoRotateFps < i * ta) {
        const n = Math.min(
          Hs,
          this._autoRotateIntervalMsDynamic + Kn
        );
        n !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = n, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
    }, Fs = (o) => {
      if (this._autoRotateCalibrated) return;
      const s = this._autoRotateCalibrateStart || o;
      if (this._autoRotateCalibrateStart = s, o - s < ea) return;
      const i = this._autoRotateFps || 0;
      if (i > 0) {
        const l = 1e3 / (i * oa), c = Math.min(
          Hs,
          Math.max($t, Math.round(l))
        );
        c !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = c, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
      this._autoRotateCalibrated = !0;
    }, Qo = () => {
      this._autoRotateEnabled && (this._autoRotateLastTick = 0, this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = 0, this._autoRotateEnabled = !1, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null), this._autoRotateIntervalMsDynamic = $t, this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._updateTimerMS = Date.now(), this.requestUpdate());
    }, sa = () => {
      this._autoRotateEnabled || (this._autoRotateEnabled = !0, this._autoRotateLastTick = Ko(), this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = Yn && Os > 0 ? Os * 360 : 0, this._autoRotateIntervalMsDynamic = $t, this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._autoRotateTimer || (this._autoRotateTimer = setInterval(() => {
        const o = Ko();
        Ws(o), Fs(o), Bs(o);
        const s = this._autoRotateLastTick || o, i = Math.max(0, o - s) / 1e3, n = Xo * i;
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + n, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + n, this._autoRotateLastTick = o, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
          Qo();
          return;
        }
        this._updateTimerMS = Date.now(), this.requestUpdate();
      }, this._autoRotateIntervalMsDynamic), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic), this._updateTimerMS = Date.now(), this.requestUpdate());
    };
    this._autoRotateStop = Qo, this._autoRotateStartFn = sa, this._autoRotateHandlers || (this._autoRotateHandlers = !0, this._autoRotateLastTap = 0, this.addEventListener("pointerup", (o) => {
      var n;
      if (o.button !== void 0 && o.button !== 0) return;
      const s = Date.now(), i = this._autoRotateLastTap || 0;
      if (s - i < Jo) {
        this._autoRotateLastTap = 0, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), (n = this._autoRotateStartFn) == null || n.call(this);
        return;
      }
      this._autoRotateLastTap = s, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), this._autoRotateClickTimer = setTimeout(() => {
        var l;
        this._autoRotateLastTap && Date.now() - this._autoRotateLastTap >= Jo && (this._autoRotateLastTap = 0, (l = this._autoRotateStop) == null || l.call(this));
      }, Jo + 10);
    }, { capture: !0 })), this._autoRotateEnabled ? (!this._autoRotateTimer || this._autoRotateTimerMs !== this._autoRotateIntervalMsDynamic) && (this._autoRotateTimer && clearInterval(this._autoRotateTimer), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic, this._autoRotateTimer = setInterval(() => {
      const o = Ko();
      Ws(o), Fs(o), Bs(o);
      const s = this._autoRotateLastTick || o, i = Math.max(0, o - s) / 1e3, n = Xo * i;
      if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + n, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + n, this._autoRotateLastTick = o, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
        Qo();
        return;
      }
      this._updateTimerMS = Date.now(), this.requestUpdate();
    }, this._autoRotateIntervalMsDynamic)) : this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null);
    const ia = Number(((Ii = e.states[Be]) == null ? void 0 : Ii.state) || 210);
    this._autoRotateCurrentDeg = this._autoRotateOffsetDeg || 0;
    const Us = (ia + (this._autoRotateOffsetDeg || 0)) * Math.PI / 180, Vs = Math.min(Math.max(Number(((Oi = e.states[Fe]) == null ? void 0 : Oi.state) || 35), 0), 90), js = Vs * Math.PI / 180, Gs = 5, qs = Math.cos(Us), Ys = Math.sin(Us), Zs = Math.cos(js), Xs = -Math.sin(js), Js = (et || 0) * Math.PI / 180, Ks = Math.cos(Js), Qs = Math.sin(Js), na = Math.PI * 2;
    function B(o, s, i) {
      return Math.min(i, Math.max(s, o));
    }
    function ve(o) {
      const s = Math.hypot(...o);
      return s > 0 ? o.map((i) => i / s) : [0, 0, 0];
    }
    function L(o) {
      const s = o[0], i = o[1], n = o[2], l = s * qs - n * Ys, c = s * Ys + n * qs, h = i * Zs - c * Xs, m = i * Xs + c * Zs;
      return [l, h, m];
    }
    function Z(o) {
      const s = o[0], i = o[1], n = o[2], l = s * Ks + n * Qs, c = -s * Qs + n * Ks;
      return [l, i, c];
    }
    function Co(o) {
      return L(Z(o));
    }
    function D(o) {
      const s = o[0], i = o[1], n = o[2], l = Gs / (Gs + n);
      return [Uo + s * Jt * l, Vo - i * Jt * l, n, l];
    }
    function rt(o, s) {
      const i = parseInt(o.substr(1, 2), 16), n = parseInt(o.substr(3, 2), 16), l = parseInt(o.substr(5, 2), 16), c = Math.min(255, Math.max(0, Math.round(i * s))), h = Math.min(255, Math.max(0, Math.round(n * s))), m = Math.min(255, Math.max(0, Math.round(l * s)));
      return `rgb(${c},${h},${m})`;
    }
    function aa(o, s, i, n) {
      const l = ve([i[0] - s[0], i[1] - s[1], i[2] - s[2]]), c = [o[0] - s[0], o[1] - s[1], o[2] - s[2]], h = Math.cos(n), m = Math.sin(n), g = [
        l[1] * c[2] - l[2] * c[1],
        l[2] * c[0] - l[0] * c[2],
        l[0] * c[1] - l[1] * c[0]
      ], f = l[0] * c[0] + l[1] * c[1] + l[2] * c[2], b = [
        c[0] * h + g[0] * m + l[0] * f * (1 - h),
        c[1] * h + g[1] * m + l[1] * f * (1 - h),
        c[2] * h + g[2] * m + l[2] * f * (1 - h)
      ];
      return [s[0] + b[0], s[1] + b[1], s[2] + b[2]];
    }
    function ra(o, s, i) {
      const n = [s[0] - o[0], s[1] - o[1], s[2] - o[2]], l = [i[0] - o[0], i[1] - o[1], i[2] - o[2]];
      return ve([
        n[1] * l[2] - n[2] * l[1],
        n[2] * l[0] - n[0] * l[2],
        n[0] * l[1] - n[1] * l[0]
      ]);
    }
    function Eo(o) {
      return o.reduce((s, i) => s + i[2], 0) / o.length;
    }
    function ti(o) {
      const s = Number(o);
      return Number.isFinite(s) ? `${Math.round(s)}%` : "0%";
    }
    function ts(o) {
      let s = 0;
      for (let i = 0; i < o.length; i++) {
        const n = (i + 1) % o.length;
        s += o[i][0] * o[n][1] - o[n][0] * o[i][1];
      }
      return s;
    }
    function la(o, s) {
      if (!o.length || s.length < 3) return [];
      const n = ts(s) > 0, l = (m, g, f) => {
        const b = (f[0] - g[0]) * (m[1] - g[1]) - (f[1] - g[1]) * (m[0] - g[0]);
        return n ? b >= 0 : b <= 0;
      }, c = (m, g, f, b) => {
        const y = m[0], $ = m[1], C = g[0], x = g[1], k = f[0], z = f[1], I = b[0], F = b[1], lt = (y - C) * (z - F) - ($ - x) * (k - I);
        if (Math.abs(lt) < 1e-6) return g;
        const Ne = ((y * x - $ * C) * (k - I) - (y - C) * (k * F - z * I)) / lt, zo = ((y * x - $ * C) * (z - F) - ($ - x) * (k * F - z * I)) / lt;
        return [Ne, zo];
      };
      let h = o.slice();
      for (let m = 0; m < s.length; m++) {
        const g = s[m], f = s[(m + 1) % s.length], b = h.slice();
        if (h = [], !b.length) break;
        for (let y = 0; y < b.length; y++) {
          const $ = b[y], C = b[(y - 1 + b.length) % b.length], x = l($, g, f), k = l(C, g, f);
          x ? (k || h.push(c(C, $, g, f)), h.push($)) : k && h.push(c(C, $, g, f));
        }
      }
      return h;
    }
    function ei(o, s, i, n) {
      return n > 0 && (o = -o, s = -s, i = -i, n = -n), o * n - s * i < 0 && (o = -o, s = -s), o < 0 && (o = -o, s = -s, i = -i, n = -n), { bx: o, by: s, ux: i, uy: n };
    }
    function oi(o, s, i, n) {
      return o * n - s * i < 0 && (i = -i, n = -n), { bx: o, by: s, ux: i, uy: n };
    }
    function si(o, s, i, n, l = !0) {
      const c = D(L(o)), h = D(L([
        o[0] + s[0],
        o[1] + s[1],
        o[2] + s[2]
      ])), m = D(L([
        o[0] + i[0],
        o[1] + i[1],
        o[2] + i[2]
      ]));
      let g = h[0] - c[0], f = h[1] - c[1], b = Math.hypot(g, f);
      if (b < 1e-6) return null;
      g /= b, f /= b;
      let y = m[0] - c[0], $ = m[1] - c[1], C = Math.hypot(y, $);
      C < 1e-6 ? (y = -f, $ = g, C = Math.hypot(y, $)) : (y /= C, $ /= C);
      let x = l ? ei(g, f, y, $) : oi(g, f, y, $);
      if (n) {
        const k = D(L([
          o[0] + n[0],
          o[1] + n[1],
          o[2] + n[2]
        ]));
        let z = k[0] - c[0], I = k[1] - c[1], F = Math.hypot(z, I);
        F > 1e-6 && (z /= F, I /= F, x.bx * z + x.by * I < 0 && (x = l ? ei(-x.bx, -x.by, -x.ux, -x.uy) : oi(-x.bx, -x.by, -x.ux, -x.uy)));
      }
      return { basis: x, centerScr: c };
    }
    function ca(o, s) {
      const i = o[0][0], n = o[0][1], l = o[1][0], c = o[1][1], h = o[2][0], m = o[2][1], g = s[0][0], f = s[0][1], b = s[1][0], y = s[1][1], $ = s[2][0], C = s[2][1], x = i * (c - m) + l * (m - n) + h * (n - c);
      if (Math.abs(x) < 1e-6) return null;
      const k = (g * (c - m) + b * (m - n) + $ * (n - c)) / x, z = (f * (c - m) + y * (m - n) + C * (n - c)) / x, I = (g * (h - l) + b * (i - h) + $ * (l - i)) / x, F = (f * (h - l) + y * (i - h) + C * (l - i)) / x, lt = (g * (l * m - h * c) + b * (h * n - i * m) + $ * (i * c - l * n)) / x, Ne = (f * (l * m - h * c) + y * (h * n - i * m) + C * (i * c - l * n)) / x;
      return { a: k, b: z, c: I, d: F, e: lt, f: Ne };
    }
    function ha(o) {
      const s = [0, 1, 0], i = [
        s[1] * o[2] - s[2] * o[1],
        s[2] * o[0] - s[0] * o[2],
        s[0] * o[1] - s[1] * o[0]
      ];
      return ve(i);
    }
    function ua(o) {
      if (o.length <= 1) return o.slice();
      const s = o.slice().sort((c, h) => c.x === h.x ? c.z - h.z : c.x - h.x), i = (c, h, m) => (h.x - c.x) * (m.z - c.z) - (h.z - c.z) * (m.x - c.x), n = [];
      for (const c of s) {
        for (; n.length >= 2 && i(n[n.length - 2], n[n.length - 1], c) <= 0; )
          n.pop();
        n.push(c);
      }
      const l = [];
      for (let c = s.length - 1; c >= 0; c--) {
        const h = s[c];
        for (; l.length >= 2 && i(l[l.length - 2], l[l.length - 1], h) <= 0; )
          l.pop();
        l.push(h);
      }
      return l.pop(), n.pop(), n.concat(l);
    }
    function fa(o, s, i, n, l) {
      if (o.length === 0) return o;
      const c = (f, b, y) => {
        const $ = [];
        for (let C = 0; C < f.length; C++) {
          const x = f[C], k = f[(C + 1) % f.length], z = b(x), I = b(k);
          z && I ? $.push(k) : z && !I ? $.push(y(x, k)) : !z && I && ($.push(y(x, k)), $.push(k));
        }
        return $;
      }, h = (f, b, y) => {
        const $ = b.x - f.x;
        if (Math.abs($) < 1e-9) return { x: y, z: f.z };
        const C = (y - f.x) / $;
        return { x: y, z: f.z + C * (b.z - f.z) };
      }, m = (f, b, y) => {
        const $ = b.z - f.z;
        if (Math.abs($) < 1e-9) return { x: f.x, z: y };
        const C = (y - f.z) / $;
        return { x: f.x + C * (b.x - f.x), z: y };
      };
      let g = o.slice();
      return g = c(g, (f) => f.x >= s, (f, b) => h(f, b, s)), g = c(g, (f) => f.x <= i, (f, b) => h(f, b, i)), g = c(g, (f) => f.z >= n, (f, b) => m(f, b, n)), g = c(g, (f) => f.z <= l, (f, b) => m(f, b, l)), g;
    }
    function da(o) {
      if (o.length <= 1) return o.slice();
      const s = o.slice().sort((c, h) => c.x === h.x ? c.y - h.y : c.x - h.x), i = (c, h, m) => (h.x - c.x) * (m.y - c.y) - (h.y - c.y) * (m.x - c.x), n = [];
      for (const c of s) {
        for (; n.length >= 2 && i(n[n.length - 2], n[n.length - 1], c) <= 0; ) n.pop();
        n.push(c);
      }
      const l = [];
      for (let c = s.length - 1; c >= 0; c--) {
        const h = s[c];
        for (; l.length >= 2 && i(l[l.length - 2], l[l.length - 1], h) <= 0; ) l.pop();
        l.push(h);
      }
      return l.pop(), n.pop(), n.concat(l);
    }
    const Ao = ot * Math.PI / 180, es = st * Math.PI / 180, ye = ve([
      Math.cos(es) * Math.sin(Ao),
      Math.sin(es),
      Math.cos(es) * Math.cos(Ao)
    ]), os = L(ye), No = ye[1] > 0.01, ii = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ], ss = ii.map(Z), we = ss.map(L).map(D);
    da(we.map((o) => ({ x: o[0], y: o[1] }))), Math.min(...we.map((o) => o[2]));
    const ni = [
      { id: "front", i: [4, 5, 6, 7], c: Y.front },
      { id: "right", i: [1, 5, 6, 2], c: Y.right },
      { id: "back", i: [0, 1, 2, 3], c: Y.back },
      { id: "left", i: [0, 4, 7, 3], c: Y.left },
      { id: "bottom", i: [0, 1, 5, 4], c: Y.bottom }
    ], ai = {
      front: { indices: [4, 5, 6, 7], edge: [4, 5] },
      right: { indices: [1, 5, 6, 2], edge: [1, 5] },
      back: { indices: [0, 1, 2, 3], edge: [0, 1] },
      left: { indices: [0, 4, 7, 3], edge: [0, 4] }
    }, pa = {
      front: [0, 0, 1],
      right: [1, 0, 0],
      back: [0, 0, -1],
      left: [-1, 0, 0]
    }, ma = {
      front: Ve,
      right: je,
      back: Ge,
      left: qe
    }, ga = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    }, H = [
      [-1, 1, -1],
      [1, 1, -1],
      [1, 1, 1],
      [-1, 1, 1]
    ], ri = B(pt, 0, Xe), To = _t && ri > 0.01;
    let N = H;
    if (To) {
      const o = ri * Math.PI / 180;
      let s = [-1, 1, 1], i = [1, 1, 1], n = 1;
      P === "front" && (s = [-1, 1, 1], i = [1, 1, 1], n = 1), P === "back" && (s = [-1, 1, -1], i = [1, 1, -1], n = -1), P === "left" && (s = [-1, 1, -1], i = [-1, 1, 1], n = 1), P === "right" && (s = [1, 1, -1], i = [1, 1, 1], n = -1);
      const l = o * n;
      N = H.map((c) => aa(c, s, i, l));
    }
    const Ht = N.map(Z), is = Ht.map(L).map(D);
    let ns = ra(N[0], N[1], N[2]);
    ns[1] < 0 && (ns = ns.map((o) => -o));
    const li = ts(is), ci = li < 0;
    this._roofWindingFront === void 0 ? this._roofWindingFront = ci : Math.abs(li) > 20 && (this._roofWindingFront = ci);
    const Wt = this._roofWindingFront;
    let Se = [];
    To && vo && (P === "front" ? Se = [
      [N[0], H[0], N[3]],
      [N[1], H[1], N[2]]
    ] : P === "back" ? Se = [
      [N[3], H[3], N[0]],
      [N[2], H[2], N[1]]
    ] : P === "left" ? Se = [
      [N[2], H[2], N[3]],
      [N[1], H[1], N[0]]
    ] : P === "right" && (Se = [
      [N[3], H[3], N[2]],
      [N[0], H[0], N[1]]
    ]));
    const ba = Se.map(
      (o) => o.map((s) => D(Co(s)))
    ), hi = rt(Y.top, yo), _a = rt(Y.top, go);
    let Bt = null;
    To && wo && (P === "front" ? Bt = [N[0], N[1], H[1], H[0]] : P === "back" ? Bt = [N[2], N[3], H[3], H[2]] : P === "left" ? Bt = [N[1], N[2], H[2], H[1]] : P === "right" && (Bt = [N[0], N[3], H[3], H[0]]));
    const as = Bt ? Bt.map((o) => D(Co(o))) : null;
    let it = [0, 0, -1];
    P === "front" && (it = [0, 0, -1]), P === "back" && (it = [0, 0, 1]), P === "left" && (it = [1, 0, 0]), P === "right" && (it = [-1, 0, 0]);
    const Ft = N.reduce((o, s) => [o[0] + s[0], o[1] + s[1], o[2] + s[2]], [0, 0, 0]).map((o) => o / 4), Ut = 2.2, ui = D(Co([
      Ft[0] - it[0] * Ut,
      Ft[1] - it[1] * Ut,
      Ft[2] - it[2] * Ut
    ])), fi = D(Co([
      Ft[0] + it[0] * Ut,
      Ft[1] + it[1] * Ut,
      Ft[2] + it[2] * Ut
    ])), U = -1, di = -1, $a = [
      [-V, U, -V],
      [V, U, -V],
      [V, U, V],
      [-V, U, V]
    ].map(L).map(D), va = [
      os[0] * kt,
      os[1] * kt,
      os[2] * kt
    ], X = D(va), Re = X[3], ya = Math.max(4, 12 * Re), wa = Math.max(3, 8 * Re), rs = B(lo - Vs / 90 * co, 0.1, 0.9), Sa = B(rs - de, 0, 1), Ra = B(rs, 0, 1), xa = B(rs + de, 0, 1), J = V * (1 - 0.05), ko = 64;
    let Vt = this._ringUnit;
    (!Vt || Vt.length !== ko) && (Vt = Array.from({ length: ko }, (o, s) => {
      const i = s / ko * na;
      return [Math.sin(i), Math.cos(i)];
    }), this._ringUnit = Vt);
    const pi = Math.min(Ro, J * 0.3), mi = J - pi, Ma = J + pi;
    function ls(o) {
      return Vt.map(([s, i]) => {
        const n = L([o * s, U, o * i]), l = D(n);
        return l[0] + "," + l[1];
      });
    }
    const Ca = ls(mi), Ea = ls(J), Aa = ls(Ma);
    let gi = [];
    v && (gi = Vt.map(([o, s], i) => {
      const n = i % (ko / 4) === 0, l = n ? gn : mn, c = mi, h = c - l, m = D(L([h * o, U, h * s])), g = D(L([c * o, U, c * s]));
      return { pIn: m, pOut: g, isMajor: n };
    }));
    const Na = [["N", 0], ["E", Math.PI / 2], ["S", Math.PI], ["W", 3 * Math.PI / 2]], bi = J * (1 - _n), Ta = Na.map(([o, s]) => {
      const i = L([bi * Math.sin(s), U, bi * Math.cos(s)]), n = D(i), l = B(n[3] * $n, vn, yn);
      return { t: o, x: n[0], y: n[1], scale: l };
    }), mt = ve([Math.sin(Ao), 0, Math.cos(Ao)]), ka = L([mt[0] * J * 0.25, U, mt[2] * J * 0.25]), Pa = L([mt[0] * J * 0.95, U, mt[2] * J * 0.95]), vt = D(ka), K = D(Pa), Da = B(vt[3] * Ns, Ts, ks), _i = B(K[3] * Ns, Ts, ks), Po = Ps * Da, Do = Ps * _i, jt = Sn * _i, $i = [
      { id: "front", label: "Front", normal: [0, 0, 1], pos: [0, U, 1 + Mo] },
      { id: "back", label: "Back", normal: [0, 0, -1], pos: [0, U, -1 - Mo] },
      { id: "right", label: "Right", normal: [1, 0, 0], pos: [1 + Mo, U, 0] },
      { id: "left", label: "Left", normal: [-1, 0, 0], pos: [-1 - Mo, U, 0] }
    ], cs = {}, hs = {};
    $i.forEach((o) => {
      const s = L(Z(o.normal));
      cs[o.id] = s[2] < kn;
      const i = ai[o.id];
      if (i) {
        const n = i.indices.map((c) => we[c]), l = Math.abs(ts(n));
        hs[o.id] = s[2] < Pn && l > Dn;
      } else
        hs[o.id] = cs[o.id];
    });
    let xe = null;
    if (Lt && No) {
      const o = [-ye[0], -ye[1], -ye[2]];
      if (Math.abs(o[1]) > 1e-6) {
        const s = [], i = To ? ss.concat(Ht) : ss;
        for (const l of i) {
          const c = (di - l[1]) / o[1];
          c >= 0 && s.push({ x: l[0] + o[0] * c, z: l[2] + o[2] * c });
        }
        const n = ua(s);
        if (n.length >= 3) {
          const l = B(he, 0, 0.2), c = V * (1 - l), h = fa(n, -c, c, -c, c);
          h.length >= 3 && (xe = h.map((m) => D(L([m.x, di, m.z]))));
        }
      }
    }
    const vi = xe ? xe.map((o) => o[0] + "," + o[1]).join(" ") : null;
    let Me = null, Ce = null;
    if (zt && No) {
      const s = Math.hypot(V * 2, V * 2) * oo, i = [mt[0] * J * 0.95, U, mt[2] * J * 0.95], n = [
        i[0] - mt[0] * s,
        U,
        i[2] - mt[2] * s
      ], l = L(i), c = L(n);
      Me = D(l), Ce = D(c);
    }
    const La = [2, 3, 6, 7];
    function za(o, s) {
      const i = o.length;
      if (i < 3) return "";
      let n = "";
      for (let l = 0; l < i; l++) {
        const c = o[(l - 1 + i) % i], h = o[l], m = o[(l + 1) % i], g = [c[0] - h[0], c[1] - h[1]], f = [m[0] - h[0], m[1] - h[1]], b = Math.hypot(g[0], g[1]), y = Math.hypot(f[0], f[1]);
        if (b === 0 || y === 0) continue;
        const $ = Math.min(s, b / 2, y / 2), C = [g[0] / b, g[1] / b], x = [f[0] / y, f[1] / y], k = [h[0] + C[0] * $, h[1] + C[1] * $], z = [h[0] + x[0] * $, h[1] + x[1] * $];
        l === 0 ? n += `M ${k[0]} ${k[1]}` : n += ` L ${k[0]} ${k[1]}`, n += ` Q ${h[0]} ${h[1]} ${z[0]} ${z[1]}`;
      }
      return n + " Z";
    }
    const Ia = 20, Ee = $a.map((o) => [o[0], o[1]]), yi = za(Ee, Ia), us = B(he, 0, 0.2), Lo = Ee.reduce((o, s) => [o[0] + s[0], o[1] + s[1]], [0, 0]).map((o) => o / Ee.length), Oa = us > 0 ? Ee.map((o) => [
      Lo[0] + (o[0] - Lo[0]) * (1 - us),
      Lo[1] + (o[1] - Lo[1]) * (1 - us)
    ]) : Ee, nt = [];
    fe && nt.push(`<linearGradient id="horizon-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgb(${pe.join(",")})"/>
        <stop offset="${(Sa * 100).toFixed(2)}%" stop-color="rgb(${pe.join(",")})"/>
        <stop offset="${(Ra * 100).toFixed(2)}%" stop-color="rgb(${ho.join(",")})"/>
        <stop offset="${(xa * 100).toFixed(2)}%" stop-color="rgb(${me.join(",")})"/>
        <stop offset="100%" stop-color="rgb(${me.join(",")})"/>
      </linearGradient>`), nt.push(`<radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,200,0.85)"/>
      <stop offset="70%" stop-color="rgba(255,255,150,0.35)"/>
      <stop offset="100%" stop-color="rgba(255,255,100,0)"/>
    </radialGradient>`), nt.push(`<linearGradient id="ceiling-grad" x1="0" y1="1" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${rt(Y.top, ao)}"/>
      <stop offset="100%" stop-color="${rt(Y.top, ro)}"/>
    </linearGradient>`), _t && nt.push(`<linearGradient id="roof-grad" x1="${ui[0]}" y1="${ui[1]}" x2="${fi[0]}" y2="${fi[1]}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${rt(Y.top, _o)}"/>
        <stop offset="100%" stop-color="${rt(Y.top, $o)}"/>
      </linearGradient>`), ni.forEach((o) => {
      nt.push(`<linearGradient id="wall-${o.id}" x1="0" y1="1" x2="0" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="${rt(o.c, so)}"/>
        <stop offset="60%" stop-color="${rt(o.c, io)}"/>
        <stop offset="100%" stop-color="${rt(o.c, no)}"/>
      </linearGradient>`);
    }), Lt && vi && (nt.push(`<filter id="shadow-blur-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Qe}"/>
      </filter>`), nt.push(`<filter id="shadow-blur-contact" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${eo}"/>
      </filter>`)), zt && No && Me && Ce && nt.push(`<linearGradient id="sunlight-grad" x1="${Me[0]}" y1="${Me[1]}"
                  x2="${Ce[0]}" y2="${Ce[1]}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="rgb(${It.join(",")})" stop-opacity="${ue}"/>
          <stop offset="55%" stop-color="rgb(${It.join(",")})" stop-opacity="${ue * 0.45}"/>
          <stop offset="100%" stop-color="rgb(${It.join(",")})" stop-opacity="0"/>
        </linearGradient>`), ge && nt.push(`<radialGradient id="vignette" cx="50%" cy="50%" r="${fo}">
        <stop offset="0%" stop-color="rgb(${Ot.join(",")})" stop-opacity="0"/>
        <stop offset="${(po * 100).toFixed(1)}%" stop-color="rgb(${Ot.join(",")})" stop-opacity="0"/>
        <stop offset="100%" stop-color="rgb(${Ot.join(",")})" stop-opacity="${uo}"/>
      </radialGradient>`);
    const A = [];
    if (A.push(`<svg viewBox="0 0 ${tt} ${q}" width="${Bo}" height="${Fo}" preserveAspectRatio="xMidYMid meet"><defs>${nt.join("")}</defs>`), fe && A.push(`<rect x="0" y="0" width="${tt}" height="${q}" fill="url(#horizon-grad)"/>`), A.push(`<path d="${yi}" fill="${jo}"/>`), zt && No && Me && Ce && A.push(`<path d="${yi}" fill="url(#sunlight-grad)"/>`), Lt && vi) {
      const o = xe ? xe.map((i) => [i[0], i[1]]) : [], s = la(o, Oa);
      if (s.length >= 3) {
        const i = s.map((n) => n[0] + "," + n[1]).join(" ");
        A.push(`<polygon points="${i}" fill="${ce}" opacity="${Ke}" filter="url(#shadow-blur-soft)"/>`), A.push(`<polygon points="${i}" fill="${ce}" opacity="${to}" filter="url(#shadow-blur-contact)"/>`);
      }
    }
    A.push(`<polygon points="${Ca.join(" ")}" fill="none" stroke="${_e}" stroke-width="${$e}" stroke-linecap="round"/>`), A.push(`<polygon points="${Ea.join(" ")}" fill="none" stroke="${xo}" stroke-width="${So}" stroke-linecap="round"/>`), A.push(`<polygon points="${Aa.join(" ")}" fill="none" stroke="${_e}" stroke-width="${$e}" stroke-linecap="round"/>`), v && gi.forEach((o) => {
      const s = o.isMajor ? pn : j;
      A.push(`<line x1="${o.pIn[0]}" y1="${o.pIn[1]}" x2="${o.pOut[0]}" y2="${o.pOut[1]}" stroke="${w}" stroke-width="${s}"/>`);
    }), Ta.forEach((o) => {
      A.push(`<text x="${o.x}" y="${o.y}" fill="white"
        font-size="${bn * o.scale}"
        stroke="rgba(0,0,0,0.6)" stroke-width="${wn * o.scale}"
        font-weight="700" text-anchor="middle">${o.t}</text>`);
    });
    const fs = K[0] - vt[0], ds = K[1] - vt[1], Ae = Math.hypot(fs, ds);
    if (Ae > 1e-3) {
      const o = -ds / Ae, s = fs / Ae, i = [vt[0] + o * Po / 2, vt[1] + s * Po / 2], n = [vt[0] - o * Po / 2, vt[1] - s * Po / 2], l = [K[0] + o * Do / 2, K[1] + s * Do / 2], c = [K[0] - o * Do / 2, K[1] - s * Do / 2];
      A.push(`<polygon points="${i[0]},${i[1]} ${n[0]},${n[1]} ${c[0]},${c[1]} ${l[0]},${l[1]}"
        fill="yellow" opacity="0.9"/>`);
      const h = K[0] - fs / Ae * jt, m = K[1] - ds / Ae * jt, g = [h + o * jt * 0.6, m + s * jt * 0.6], f = [h - o * jt * 0.6, m - s * jt * 0.6];
      A.push(`<polygon points="${K[0]},${K[1]} ${g[0]},${g[1]} ${f[0]},${f[1]}"
        fill="yellow" opacity="0.95"/>`);
    }
    const Ha = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    };
    $i.forEach((o) => {
      const s = Ha[o.id];
      if (!s) return;
      const i = Z(s), n = Z(o.pos), l = o.id === "front" || o.id === "left" ? s.map((C) => -C) : s, c = Z(l), h = si(n, i, ha(i), c, !1);
      if (!h) return;
      const { basis: m, centerScr: g } = h, f = B(g[3] * xn, Mn, Cn), b = Rn * f, y = Tn * f, $ = g[1] - En * f;
      A.push(`<text x="0" y="0"
        fill="${An}"
        font-size="${b}"
        stroke="${Nn}"
        stroke-width="${y}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${m.bx} ${m.by} ${m.ux} ${m.uy} ${g[0]} ${$})">${o.label}</text>`);
    }), La.forEach((o) => {
      const s = we[o];
      A.push(`<line x1="${X[0]}" y1="${X[1]}" x2="${s[0]}" y2="${s[1]}"
        stroke="rgba(255,255,150,0.2)" stroke-width="2"/>`);
    });
    const Wa = ni.map((o) => {
      const s = o.i.map((i) => we[i]);
      return { type: "cube", id: o.id, pts: s, z: Eo(s), fill: `url(#wall-${o.id})`, opacity: 1 };
    }), Gt = [];
    ba.forEach((o) => {
      Gt.push({ type: "roofSide", pts: o, z: Eo(o), fill: hi, opacity: be });
    }), as && Gt.push({ type: "roofCap", pts: as, z: Eo(as), fill: hi, opacity: be });
    let qt = Eo(is);
    if (Gt.length) {
      const o = Math.min(...Gt.map((i) => i.z)), s = Math.max(...Gt.map((i) => i.z));
      Wt ? qt = Math.min(qt, o - 0.02) : qt = Math.max(qt, s + 0.02);
    } else
      qt += Wt ? -1e-3 : 1e-3;
    const wi = _t && (Wt || mo) ? {
      type: "roofPlane",
      pts: is,
      z: qt,
      fill: Wt ? "url(#roof-grad)" : _a,
      opacity: Wt ? Je : bo
    } : null, Ba = Wa.concat(Gt).concat(wi ? [wi] : []).sort((o, s) => s.z - o.z), Fa = (o) => {
      if (!Ds || !hs[o]) return;
      const s = ga[o], i = pa[o];
      if (!s || !i) return;
      const n = o === "front" || o === "left" ? s.map((I) => -I) : s;
      let l = 0, c = 0, h = 0;
      ai[o].indices.forEach((I) => {
        const F = ii[I];
        l += F[0], c += F[1], h += F[2];
      }), l /= 4, c /= 4, h /= 4, c = B(Ln, -0.9, 0.9);
      const m = [
        l + i[0] * Zo,
        c + i[1] * Zo,
        h + i[2] * Zo
      ], g = Z(m), f = Z(s), b = Z(n), y = si(g, f, [0, 1, 0], b, !1);
      if (!y) return;
      const { basis: $, centerScr: C } = y, x = B(C[3] * zn, In, On), k = qo * x, z = Yo * x;
      A.push(`<text x="0" y="0"
        fill="${Ls}"
        font-size="${k}"
        stroke="${zs}"
        stroke-width="${z}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${$.bx} ${$.by} ${$.ux} ${$.uy} ${C[0]} ${C[1]})">${ti(ma[o])}</text>`);
    }, Ua = () => {
      if (!Bn || !cs.front) return;
      const o = -Is / 2, s = Is / 2, i = B(-1 + Un, -1, 1), n = B(i + Fn, -1, 1), l = 1 + Vn, m = [
        [o, i, l],
        [s, i, l],
        [s, n, l],
        [o, n, l]
      ].map((g) => D(L(Z(g)))).map((g) => g[0] + "," + g[1]).join(",");
      A.push(`<polygon points="${m}" fill="${jn}" opacity="${Gn}"/>`);
    }, Va = () => {
      if (!Ds || !_t || !Wt) return;
      const o = {
        front: { low: [3, 2], high: [0, 1] },
        back: { low: [0, 1], high: [3, 2] },
        left: { low: [0, 3], high: [1, 2] },
        right: { low: [1, 2], high: [0, 3] }
      }, s = o[P] ?? o.front;
      let i = Ht[s.low[0]], n = Ht[s.low[1]], l = Ht[s.high[0]], c = Ht[s.high[1]];
      if (!i || !n || !l || !c) return;
      if (P === "front" || P === "back") {
        if (n[0] < i[0]) {
          const G = i;
          i = n, n = G;
          const at = l;
          l = c, c = at;
        }
      } else if (n[2] < i[2]) {
        const G = i;
        i = n, n = G;
        const at = l;
        l = c, c = at;
      }
      const h = Math.hypot(n[0] - i[0], n[1] - i[1], n[2] - i[2]), m = [(i[0] + n[0]) / 2, (i[1] + n[1]) / 2, (i[2] + n[2]) / 2], g = [(l[0] + c[0]) / 2, (l[1] + c[1]) / 2, (l[2] + c[2]) / 2], f = Math.hypot(g[0] - m[0], g[1] - m[1], g[2] - m[2]);
      if (!isFinite(h) || !isFinite(f) || h <= 1e-6 || f <= 1e-6) return;
      const b = ti(Ye);
      let y = -f * (1 / 3), $ = -f * (2 / 3);
      const C = 1 / 6, x = h * (1 - 2 * C), k = "100%", z = "9.99 kW", I = Math.max(b.length, k.length);
      Math.max((le || "").length, z.length);
      const F = f * 0.36, lt = Math.min(x / (0.6 * I), F), Ne = Yo / qo * lt, zo = Math.min(lt * Hn, F * 0.85), ja = Yo / qo * zo;
      this._roofStripSeed = (this._roofStripSeed || 0) + 1;
      const ps = (G, at, Te) => [G[0] + (at[0] - G[0]) * Te, G[1] + (at[1] - G[1]) * Te, G[2] + (at[2] - G[2]) * Te], Hi = (G, at, Te, Ga, ms, qa, Cr) => {
        if (!G) return;
        const Ya = Math.max(at * qa, f * 0.08), gs = ms, Wi = ms - Ya, Bi = B(-gs / f, 0, 1), Za = B(-Wi / f, 0, 1), Xa = ps(i, l, Bi), Ja = ps(n, c, Bi), Ka = ps(i, l, Za), Fi = D(L(Xa)), Ui = D(L(Ja)), Vi = D(L(Ka)), ct = [[0, gs], [h, gs], [0, Wi]], ht = [[Fi[0], Fi[1]], [Ui[0], Ui[1]], [Vi[0], Vi[1]]], yt = ca(ct, ht);
        if (!yt) return;
        const ji = Math.sign((ct[1][0] - ct[0][0]) * (ct[2][1] - ct[0][1]) - (ct[1][1] - ct[0][1]) * (ct[2][0] - ct[0][0])), Gi = Math.sign((ht[1][0] - ht[0][0]) * (ht[2][1] - ht[0][1]) - (ht[1][1] - ht[0][1]) * (ht[2][0] - ht[0][0])), qi = ji !== 0 && Gi !== 0 && ji !== Gi;
        A.push(`<g transform="matrix(${yt.a} ${yt.b} ${yt.c} ${yt.d} ${yt.e} ${yt.f})">`), qi && A.push(`<g transform="translate(${h} 0) scale(-1 1)">`), A.push(`<text x="${h / 2}" y="${ms}" fill="${Ga}" font-size="${at}"
          stroke="${zs}" stroke-width="${Te}" font-weight="700"
          text-anchor="middle" dominant-baseline="middle">${G}</text>`), qi && A.push("</g>"), A.push("</g>");
      };
      Hi(le, zo, ja, Wn, y, 1.6), Hi(b, lt, Ne, Ls, $, 1.6);
    };
    Ba.forEach((o) => {
      const s = o.pts.map((i) => i[0] + "," + i[1]).join(",");
      A.push(`<polygon points="${s}" fill="${o.fill}" stroke="#000" stroke-width="0.5" opacity="${o.opacity}"/>`), o.type === "cube" && o.id === "front" && Ua(), o.type === "cube" && Fa(o.id), o.type === "roofPlane" && Va();
    }), A.push(`<circle cx="${X[0]}" cy="${X[1]}" r="${ya}" fill="url(#sun-glow)"/>`), A.push(`<circle cx="${X[0]}" cy="${X[1]}" r="${wa}" fill="yellow" stroke="orange" stroke-width="${Math.max(1, 2 * Re)}"/>`);
    for (let o = 0; o < 8; o++) {
      const s = o * Math.PI / 4, i = 20 * Re, n = X[0] + Math.cos(s) * i, l = X[1] + Math.sin(s) * i;
      A.push(`<line x1="${X[0]}" y1="${X[1]}" x2="${n}" y2="${l}"
          stroke="yellow" stroke-width="${1.5 * Re}" opacity="0.6"/>`);
    }
    if (Q && (A.push(`<text x="10" y="${q - 24}" fill="#ff3b3b" font-size="12" font-weight="700">SUN OVERRIDE ENABLED</text>`), A.push(`<text x="10" y="${q - 10}" fill="#ff3b3b" font-size="11" font-weight="700">Solar alignment % is disabled</text>`)), ge && A.push(`<rect x="0" y="0" width="${tt}" height="${q}" fill="url(#vignette)"/>`), Zn && this._autoRotateEnabled) {
      const o = Number.isFinite(this._autoRotateFps) ? this._autoRotateFps : 0, s = this._autoRotateIntervalMsDynamic || $t, i = s > $t ? " LIMIT" : "";
      A.push(`<text x="10" y="18" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">FPS ${o.toFixed(1)} | ${Math.round(s)}ms${i}</text>`);
    }
    return A.push("</svg>"), A.join("");
  }
};
As.styles = ln`
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
let Rs = As;
customElements.define("sunlight-visualizer-card", Rs);
