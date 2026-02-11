/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ts = globalThis, Bs = ts.ShadowRoot && (ts.ShadyCSS === void 0 || ts.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Fs = Symbol(), nn = /* @__PURE__ */ new WeakMap();
let bn = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Fs) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Bs && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = nn.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && nn.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Qr = (u) => new bn(typeof u == "string" ? u : u + "", void 0, Fs), _n = (u, ...e) => {
  const t = u.length === 1 ? u[0] : e.reduce((r, a, p) => r + ((d) => {
    if (d._$cssResult$ === !0) return d.cssText;
    if (typeof d == "number") return d;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + d + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + u[p + 1], u[0]);
  return new bn(t, u, Fs);
}, ta = (u, e) => {
  if (Bs) u.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), a = ts.litNonce;
    a !== void 0 && r.setAttribute("nonce", a), r.textContent = t.cssText, u.appendChild(r);
  }
}, rn = Bs ? (u) => u : (u) => u instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return Qr(t);
})(u) : u;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ea, defineProperty: oa, getOwnPropertyDescriptor: sa, getOwnPropertyNames: ia, getOwnPropertySymbols: na, getPrototypeOf: ra } = Object, _t = globalThis, an = _t.trustedTypes, aa = an ? an.emptyScript : "", Ts = _t.reactiveElementPolyfillSupport, Ie = (u, e) => u, Ls = { toAttribute(u, e) {
  switch (e) {
    case Boolean:
      u = u ? aa : null;
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
} }, $n = (u, e) => !ea(u, e), ln = { attribute: !0, type: String, converter: Ls, reflect: !1, useDefault: !1, hasChanged: $n };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), _t.litPropertyMetadata ?? (_t.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Kt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ln) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), a = this.getPropertyDescriptor(e, r, t);
      a !== void 0 && oa(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: a, set: p } = sa(this.prototype, e) ?? { get() {
      return this[t];
    }, set(d) {
      this[t] = d;
    } };
    return { get: a, set(d) {
      const x = a == null ? void 0 : a.call(this);
      p == null || p.call(this, d), this.requestUpdate(e, x, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ln;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ie("elementProperties"))) return;
    const e = ra(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ie("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ie("properties"))) {
      const t = this.properties, r = [...ia(t), ...na(t)];
      for (const a of r) this.createProperty(a, t[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, a] of t) this.elementProperties.set(r, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const a = this._$Eu(t, r);
      a !== void 0 && this._$Eh.set(a, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const a of r) t.unshift(rn(a));
    } else e !== void 0 && t.push(rn(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ta(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostConnected) == null ? void 0 : r.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostDisconnected) == null ? void 0 : r.call(t);
    });
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    var p;
    const r = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, r);
    if (a !== void 0 && r.reflect === !0) {
      const d = (((p = r.converter) == null ? void 0 : p.toAttribute) !== void 0 ? r.converter : Ls).toAttribute(t, r.type);
      this._$Em = e, d == null ? this.removeAttribute(a) : this.setAttribute(a, d), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var p, d;
    const r = this.constructor, a = r._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const x = r.getPropertyOptions(a), $ = typeof x.converter == "function" ? { fromAttribute: x.converter } : ((p = x.converter) == null ? void 0 : p.fromAttribute) !== void 0 ? x.converter : Ls;
      this._$Em = a;
      const N = $.fromAttribute(t, x.type);
      this[a] = N ?? ((d = this._$Ej) == null ? void 0 : d.get(a)) ?? N, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, a = !1, p) {
    var d;
    if (e !== void 0) {
      const x = this.constructor;
      if (a === !1 && (p = this[e]), r ?? (r = x.getPropertyOptions(e)), !((r.hasChanged ?? $n)(p, t) || r.useDefault && r.reflect && p === ((d = this._$Ej) == null ? void 0 : d.get(e)) && !this.hasAttribute(x._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: a, wrapped: p }, d) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, d ?? t ?? this[e]), p !== !0 || d !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), a === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [p, d] of this._$Ep) this[p] = d;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [p, d] of a) {
        const { wrapped: x } = d, $ = this[p];
        x !== !0 || this._$AL.has(p) || $ === void 0 || this.C(p, void 0, d, $);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (r = this._$EO) == null || r.forEach((a) => {
        var p;
        return (p = a.hostUpdate) == null ? void 0 : p.call(a);
      }), this.update(t)) : this._$EM();
    } catch (a) {
      throw e = !1, this._$EM(), a;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((r) => {
      var a;
      return (a = r.hostUpdated) == null ? void 0 : a.call(r);
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
Kt.elementStyles = [], Kt.shadowRootOptions = { mode: "open" }, Kt[Ie("elementProperties")] = /* @__PURE__ */ new Map(), Kt[Ie("finalized")] = /* @__PURE__ */ new Map(), Ts == null || Ts({ ReactiveElement: Kt }), (_t.reactiveElementVersions ?? (_t.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oe = globalThis, cn = (u) => u, es = Oe.trustedTypes, hn = es ? es.createPolicy("lit-html", { createHTML: (u) => u }) : void 0, yn = "$lit$", bt = `lit$${Math.random().toFixed(9).slice(2)}$`, vn = "?" + bt, la = `<${vn}>`, Ct = document, Be = () => Ct.createComment(""), Fe = (u) => u === null || typeof u != "object" && typeof u != "function", Hs = Array.isArray, ca = (u) => Hs(u) || typeof (u == null ? void 0 : u[Symbol.iterator]) == "function", Ps = `[ 	
\f\r]`, ze = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, un = /-->/g, fn = />/g, St = RegExp(`>|${Ps}(?:([^\\s"'>=/]+)(${Ps}*=${Ps}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), dn = /'/g, pn = /"/g, wn = /^(?:script|style|textarea|title)$/i, ha = (u) => (e, ...t) => ({ _$litType$: u, strings: e, values: t }), os = ha(1), Et = Symbol.for("lit-noChange"), B = Symbol.for("lit-nothing"), mn = /* @__PURE__ */ new WeakMap(), xt = Ct.createTreeWalker(Ct, 129);
function Rn(u, e) {
  if (!Hs(u) || !u.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return hn !== void 0 ? hn.createHTML(e) : e;
}
const ua = (u, e) => {
  const t = u.length - 1, r = [];
  let a, p = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", d = ze;
  for (let x = 0; x < t; x++) {
    const $ = u[x];
    let N, P, S = -1, H = 0;
    for (; H < $.length && (d.lastIndex = H, P = d.exec($), P !== null); ) H = d.lastIndex, d === ze ? P[1] === "!--" ? d = un : P[1] !== void 0 ? d = fn : P[2] !== void 0 ? (wn.test(P[2]) && (a = RegExp("</" + P[2], "g")), d = St) : P[3] !== void 0 && (d = St) : d === St ? P[0] === ">" ? (d = a ?? ze, S = -1) : P[1] === void 0 ? S = -2 : (S = d.lastIndex - P[2].length, N = P[1], d = P[3] === void 0 ? St : P[3] === '"' ? pn : dn) : d === pn || d === dn ? d = St : d === un || d === fn ? d = ze : (d = St, a = void 0);
    const v = d === St && u[x + 1].startsWith("/>") ? " " : "";
    p += d === ze ? $ + la : S >= 0 ? (r.push(N), $.slice(0, S) + yn + $.slice(S) + bt + v) : $ + bt + (S === -2 ? x : v);
  }
  return [Rn(u, p + (u[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class He {
  constructor({ strings: e, _$litType$: t }, r) {
    let a;
    this.parts = [];
    let p = 0, d = 0;
    const x = e.length - 1, $ = this.parts, [N, P] = ua(e, t);
    if (this.el = He.createElement(N, r), xt.currentNode = this.el.content, t === 2 || t === 3) {
      const S = this.el.content.firstChild;
      S.replaceWith(...S.childNodes);
    }
    for (; (a = xt.nextNode()) !== null && $.length < x; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const S of a.getAttributeNames()) if (S.endsWith(yn)) {
          const H = P[d++], v = a.getAttribute(S).split(bt), j = /([.?@])?(.*)/.exec(H);
          $.push({ type: 1, index: p, name: j[2], strings: v, ctor: j[1] === "." ? da : j[1] === "?" ? pa : j[1] === "@" ? ma : ss }), a.removeAttribute(S);
        } else S.startsWith(bt) && ($.push({ type: 6, index: p }), a.removeAttribute(S));
        if (wn.test(a.tagName)) {
          const S = a.textContent.split(bt), H = S.length - 1;
          if (H > 0) {
            a.textContent = es ? es.emptyScript : "";
            for (let v = 0; v < H; v++) a.append(S[v], Be()), xt.nextNode(), $.push({ type: 2, index: ++p });
            a.append(S[H], Be());
          }
        }
      } else if (a.nodeType === 8) if (a.data === vn) $.push({ type: 2, index: p });
      else {
        let S = -1;
        for (; (S = a.data.indexOf(bt, S + 1)) !== -1; ) $.push({ type: 7, index: p }), S += bt.length - 1;
      }
      p++;
    }
  }
  static createElement(e, t) {
    const r = Ct.createElement("template");
    return r.innerHTML = e, r;
  }
}
function te(u, e, t = u, r) {
  var d, x;
  if (e === Et) return e;
  let a = r !== void 0 ? (d = t._$Co) == null ? void 0 : d[r] : t._$Cl;
  const p = Fe(e) ? void 0 : e._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== p && ((x = a == null ? void 0 : a._$AO) == null || x.call(a, !1), p === void 0 ? a = void 0 : (a = new p(u), a._$AT(u, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = a : t._$Cl = a), a !== void 0 && (e = te(u, a._$AS(u, e.values), a, r)), e;
}
class fa {
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
    const { el: { content: t }, parts: r } = this._$AD, a = ((e == null ? void 0 : e.creationScope) ?? Ct).importNode(t, !0);
    xt.currentNode = a;
    let p = xt.nextNode(), d = 0, x = 0, $ = r[0];
    for (; $ !== void 0; ) {
      if (d === $.index) {
        let N;
        $.type === 2 ? N = new We(p, p.nextSibling, this, e) : $.type === 1 ? N = new $.ctor(p, $.name, $.strings, this, e) : $.type === 6 && (N = new ga(p, this, e)), this._$AV.push(N), $ = r[++x];
      }
      d !== ($ == null ? void 0 : $.index) && (p = xt.nextNode(), d++);
    }
    return xt.currentNode = Ct, a;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class We {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, r, a) {
    this.type = 2, this._$AH = B, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
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
    e = te(this, e, t), Fe(e) ? e === B || e == null || e === "" ? (this._$AH !== B && this._$AR(), this._$AH = B) : e !== this._$AH && e !== Et && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ca(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== B && Fe(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Ct.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var p;
    const { values: t, _$litType$: r } = e, a = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = He.createElement(Rn(r.h, r.h[0]), this.options)), r);
    if (((p = this._$AH) == null ? void 0 : p._$AD) === a) this._$AH.p(t);
    else {
      const d = new fa(a, this), x = d.u(this.options);
      d.p(t), this.T(x), this._$AH = d;
    }
  }
  _$AC(e) {
    let t = mn.get(e.strings);
    return t === void 0 && mn.set(e.strings, t = new He(e)), t;
  }
  k(e) {
    Hs(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, a = 0;
    for (const p of e) a === t.length ? t.push(r = new We(this.O(Be()), this.O(Be()), this, this.options)) : r = t[a], r._$AI(p), a++;
    a < t.length && (this._$AR(r && r._$AB.nextSibling, a), t.length = a);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, t); e !== this._$AB; ) {
      const a = cn(e).nextSibling;
      cn(e).remove(), e = a;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class ss {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, a, p) {
    this.type = 1, this._$AH = B, this._$AN = void 0, this.element = e, this.name = t, this._$AM = a, this.options = p, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = B;
  }
  _$AI(e, t = this, r, a) {
    const p = this.strings;
    let d = !1;
    if (p === void 0) e = te(this, e, t, 0), d = !Fe(e) || e !== this._$AH && e !== Et, d && (this._$AH = e);
    else {
      const x = e;
      let $, N;
      for (e = p[0], $ = 0; $ < p.length - 1; $++) N = te(this, x[r + $], t, $), N === Et && (N = this._$AH[$]), d || (d = !Fe(N) || N !== this._$AH[$]), N === B ? e = B : e !== B && (e += (N ?? "") + p[$ + 1]), this._$AH[$] = N;
    }
    d && !a && this.j(e);
  }
  j(e) {
    e === B ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class da extends ss {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === B ? void 0 : e;
  }
}
class pa extends ss {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== B);
  }
}
class ma extends ss {
  constructor(e, t, r, a, p) {
    super(e, t, r, a, p), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = te(this, e, t, 0) ?? B) === Et) return;
    const r = this._$AH, a = e === B && r !== B || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, p = e !== B && (r === B || a);
    a && this.element.removeEventListener(this.name, this, r), p && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ga {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    te(this, e);
  }
}
const ks = Oe.litHtmlPolyfillSupport;
ks == null || ks(He, We), (Oe.litHtmlVersions ?? (Oe.litHtmlVersions = [])).push("3.3.2");
const ba = (u, e, t) => {
  const r = (t == null ? void 0 : t.renderBefore) ?? e;
  let a = r._$litPart$;
  if (a === void 0) {
    const p = (t == null ? void 0 : t.renderBefore) ?? null;
    r._$litPart$ = a = new We(e.insertBefore(Be(), p), p, void 0, t ?? {});
  }
  return a._$AI(u), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mt = globalThis;
let Qt = class extends Kt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ba(t, this.renderRoot, this.renderOptions);
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
    return Et;
  }
};
var gn;
Qt._$litElement$ = !0, Qt.finalized = !0, (gn = Mt.litElementHydrateSupport) == null || gn.call(Mt, { LitElement: Qt });
const Ds = Mt.litElementPolyfillSupport;
Ds == null || Ds({ LitElement: Qt });
(Mt.litElementVersions ?? (Mt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _a = { CHILD: 2 }, $a = (u) => (...e) => ({ _$litDirective$: u, values: e });
class ya {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, r) {
    this._$Ct = e, this._$AM = t, this._$Ci = r;
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
class zs extends ya {
  constructor(e) {
    if (super(e), this.it = B, e.type !== _a.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === B || e == null) return this._t = void 0, this.it = e;
    if (e === Et) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const t = [e];
    return t.raw = t, this._t = { _$litType$: this.constructor.resultType, strings: t, values: [] };
  }
}
zs.directiveName = "unsafeHTML", zs.resultType = 1;
const va = $a(zs), Ws = class Ws extends Qt {
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
    const r = { ...this._config };
    t === "" || t === void 0 || t === null ? delete r[e] : r[e] = t, this._config = r, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: r },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _valueChanged(e) {
    var p;
    const t = e.target, r = t == null ? void 0 : t.configValue;
    if (!r) return;
    let a = ((p = e.detail) == null ? void 0 : p.value) ?? t.value;
    if (t.checked !== void 0 && (a = t.checked), t.type === "number") {
      const d = Number(a);
      Number.isNaN(d) || (a = d);
    }
    this._setConfigValue(r, a);
  }
  _setNumberEntityValue(e, t) {
    !this._hass || !e || this._hass.callService("number", "set_value", { entity_id: e, value: t });
  }
  _setSelectEntityOption(e, t) {
    !this._hass || !e || !t || this._hass.callService("select", "select_option", { entity_id: e, option: t });
  }
  _setIntegrationOptions(e) {
    this._hass && this._hass.callService("sunlight_visualizer", "set_options", e);
  }
  render() {
    var ie, ne, re, X, ae, Dt, qe, Ye, Ze, Xe, Je, Ke, le, as, ce, Qe, Lt, dt, pt, zt, st, it, yt, mt, D, It, Ot, to, eo, Bt, oo, so, io, no, he, ue, Ft, Ht, fe, ro, ao, lo, co, ho, uo, de, fo, po, pe, me, mo, ge, be, go, bo, _o, Wt, $o, yo, vo, wo, Ro, So, xo, _e, Mo, Co, Eo, No, $e, ye, ve, Ao, To, Po, ko, Do, Lo, zo, Io, Oo, Bo, Fo;
    if (!this._hass) return os``;
    const e = this._config || {}, t = e.siSourceAttr ?? "sunlight_visualizer_source", r = e.siSourceValue ?? "sunlight_visualizer", a = Object.entries(this._hass.states ?? {}).filter(
      ([, g]) => {
        var y;
        return ((y = g == null ? void 0 : g.attributes) == null ? void 0 : y[t]) === r;
      }
    ), p = (g) => {
      for (const [y, E] of a)
        if (g(E, y)) return y;
      return null;
    }, d = (g) => p((y) => {
      var E;
      return ((E = y == null ? void 0 : y.attributes) == null ? void 0 : E.camera_rotation) === g;
    }), x = (g) => p((y) => {
      var E;
      return ((E = y == null ? void 0 : y.attributes) == null ? void 0 : E.si_setting) === g;
    }), $ = e.rotationHEntity ?? d("h") ?? "", N = e.rotationVEntity ?? d("v") ?? "", P = e.houseAngleEntity ?? x("house_angle") ?? "", S = x("ceiling_tilt") ?? "", H = x("house_direction") ?? "", v = x("roof_direction") ?? "", j = (g, y = !1) => {
      if (g == null || g === "") return y;
      if (typeof g == "boolean") return g;
      if (typeof g == "number") return g !== 0;
      if (typeof g == "string") {
        const E = g.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(E)) return !0;
        if (["false", "0", "no", "off"].includes(E)) return !1;
      }
      return y;
    };
    let Nt = "", At, Tt;
    for (const [, g] of a)
      !Nt && ((ie = g == null ? void 0 : g.attributes) != null && ie.roof_power_entity) && (Nt = g.attributes.roof_power_entity), At === void 0 && ((ne = g == null ? void 0 : g.attributes) == null ? void 0 : ne.roof_power_enabled) !== void 0 && (At = g.attributes.roof_power_enabled), Tt === void 0 && ((re = g == null ? void 0 : g.attributes) == null ? void 0 : re.roof_power_invert) !== void 0 && (Tt = g.attributes.roof_power_invert);
    const Pt = e.preferIntegrationSettings ?? !0, Y = a.length > 0, lt = Pt ? Nt || e.roofPowerEntity || "" : e.roofPowerEntity || Nt || "", is = Pt ? j(At, j(e.roofPowerEnabled, !1)) : j(e.roofPowerEnabled, j(At, !1)), ns = Pt ? j(Tt, j(e.roofPowerInvert, !1)) : j(e.roofPowerInvert, j(Tt, !1)), $t = Number((Dt = (ae = (X = a.find(([, g]) => {
      var y;
      return ((y = g == null ? void 0 : g.attributes) == null ? void 0 : y.auto_rotate_speed) != null;
    })) == null ? void 0 : X[1]) == null ? void 0 : ae.attributes) == null ? void 0 : Dt.auto_rotate_speed), G = Pt && Number.isFinite($t) ? $t : Number(e.autoRotateSpeed ?? (Number.isFinite($t) ? $t : 10));
    Number(((Ze = (Ye = (qe = this._hass) == null ? void 0 : qe.states) == null ? void 0 : Ye[P]) == null ? void 0 : Ze.state) ?? e.houseAngle ?? 0);
    const Ue = ["North", "NE", "East", "SE", "South", "SW", "West", "NW", "Custom"], Ve = ["front", "back", "left", "right"], ee = !!H, oe = !!v, rs = ee ? ((le = (Ke = (Je = (Xe = this._hass) == null ? void 0 : Xe.states) == null ? void 0 : Je[H]) == null ? void 0 : Ke.attributes) == null ? void 0 : le.options) ?? Ue : Ue, Z = oe ? ((Lt = (Qe = (ce = (as = this._hass) == null ? void 0 : as.states) == null ? void 0 : ce[v]) == null ? void 0 : Qe.attributes) == null ? void 0 : Lt.options) ?? Ve : Ve, kt = ee ? ((zt = (pt = (dt = this._hass) == null ? void 0 : dt.states) == null ? void 0 : pt[H]) == null ? void 0 : zt.state) ?? "Custom" : e.houseDirection ?? "Custom", ot = oe ? ((yt = (it = (st = this._hass) == null ? void 0 : st.states) == null ? void 0 : it[v]) == null ? void 0 : yt.state) ?? "front" : e.roofTiltFace ?? "front", se = !!$, je = !!N, Ge = !!S;
    return os`
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
              .value=${Number(((It = (D = (mt = this._hass) == null ? void 0 : mt.states) == null ? void 0 : D[P]) == null ? void 0 : It.state) ?? 0)}
              .min=${Number(((Bt = (eo = (to = (Ot = this._hass) == null ? void 0 : Ot.states) == null ? void 0 : to[P]) == null ? void 0 : eo.attributes) == null ? void 0 : Bt.min) ?? 0)}
              .max=${Number(((no = (io = (so = (oo = this._hass) == null ? void 0 : oo.states) == null ? void 0 : so[P]) == null ? void 0 : io.attributes) == null ? void 0 : no.max) ?? 359)}
              .step=${Number(((Ht = (Ft = (ue = (he = this._hass) == null ? void 0 : he.states) == null ? void 0 : ue[P]) == null ? void 0 : Ft.attributes) == null ? void 0 : Ht.step) ?? 1)}
              @change=${(g) => {
      var y;
      return this._setNumberEntityValue(P, Number(((y = g.target) == null ? void 0 : y.value) ?? 0));
    }}
              .disabled=${!P}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"House direction"}
              .selector=${{ select: { options: rs, mode: "dropdown" } }}
              .value=${kt}
              @value-changed=${(g) => {
      var E;
      const y = ((E = g.detail) == null ? void 0 : E.value) ?? kt;
      ee ? (this._setSelectEntityOption(H, y), this._setConfigValue("houseDirection", void 0)) : this._setConfigValue("houseDirection", y);
    }}
            ></ha-selector>
            <div class="helper">Quick preset for the house front orientation</div>
          </div>
        </div>
        <div class="row">
          <div>
            <div class="slider-label">Ceiling tilt</div>
            <ha-slider
              .value=${Number(((ao = (ro = (fe = this._hass) == null ? void 0 : fe.states) == null ? void 0 : ro[S]) == null ? void 0 : ao.state) ?? 0)}
              .min=${Number(((uo = (ho = (co = (lo = this._hass) == null ? void 0 : lo.states) == null ? void 0 : co[S]) == null ? void 0 : ho.attributes) == null ? void 0 : uo.min) ?? 0)}
              .max=${Number(((pe = (po = (fo = (de = this._hass) == null ? void 0 : de.states) == null ? void 0 : fo[S]) == null ? void 0 : po.attributes) == null ? void 0 : pe.max) ?? 90)}
              .step=${Number(((be = (ge = (mo = (me = this._hass) == null ? void 0 : me.states) == null ? void 0 : mo[S]) == null ? void 0 : ge.attributes) == null ? void 0 : be.step) ?? 1)}
              @change=${(g) => {
      var y;
      return this._setNumberEntityValue(S, Number(((y = g.target) == null ? void 0 : y.value) ?? 0));
    }}
              .disabled=${!Ge}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"Roof direction"}
              .selector=${{ select: { options: Z, mode: "dropdown" } }}
              .value=${ot}
              @value-changed=${(g) => {
      var E;
      const y = ((E = g.detail) == null ? void 0 : E.value) ?? ot;
      oe ? (this._setSelectEntityOption(v, y), this._setConfigValue("roofTiltFace", void 0)) : this._setConfigValue("roofTiltFace", y);
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
              .value=${Number(((_o = (bo = (go = this._hass) == null ? void 0 : go.states) == null ? void 0 : bo[$]) == null ? void 0 : _o.state) ?? 0)}
              .min=${Number(((vo = (yo = ($o = (Wt = this._hass) == null ? void 0 : Wt.states) == null ? void 0 : $o[$]) == null ? void 0 : yo.attributes) == null ? void 0 : vo.min) ?? 0)}
              .max=${Number(((xo = (So = (Ro = (wo = this._hass) == null ? void 0 : wo.states) == null ? void 0 : Ro[$]) == null ? void 0 : So.attributes) == null ? void 0 : xo.max) ?? 359)}
              .step=${Number(((Eo = (Co = (Mo = (_e = this._hass) == null ? void 0 : _e.states) == null ? void 0 : Mo[$]) == null ? void 0 : Co.attributes) == null ? void 0 : Eo.step) ?? 1)}
              @change=${(g) => {
      var y;
      return this._setNumberEntityValue($, Number(((y = g.target) == null ? void 0 : y.value) ?? 0));
    }}
              .disabled=${!se}
            ></ha-slider>
          </div>
          <div>
            <div class="slider-label">Camera rotation V</div>
            <ha-slider
              .value=${Number(((ye = ($e = (No = this._hass) == null ? void 0 : No.states) == null ? void 0 : $e[N]) == null ? void 0 : ye.state) ?? 0)}
              .min=${Number(((Po = (To = (Ao = (ve = this._hass) == null ? void 0 : ve.states) == null ? void 0 : Ao[N]) == null ? void 0 : To.attributes) == null ? void 0 : Po.min) ?? 0)}
              .max=${Number(((zo = (Lo = (Do = (ko = this._hass) == null ? void 0 : ko.states) == null ? void 0 : Do[N]) == null ? void 0 : Lo.attributes) == null ? void 0 : zo.max) ?? 90)}
              .step=${Number(((Fo = (Bo = (Oo = (Io = this._hass) == null ? void 0 : Io.states) == null ? void 0 : Oo[N]) == null ? void 0 : Bo.attributes) == null ? void 0 : Fo.step) ?? 1)}
              @change=${(g) => {
      var y;
      return this._setNumberEntityValue(N, Number(((y = g.target) == null ? void 0 : y.value) ?? 0));
    }}
              .disabled=${!je}
            ></ha-slider>
          </div>
        </div>
        <div class="row">
          <div>${$ || "Camera rotation H not found"}</div>
          <div>${N || "Camera rotation V not found"}</div>
        </div>
      </div>

      <div class="section">
        <div class="title">Roof power</div>
        <div class="row single">
          <ha-selector
            .hass=${this._hass}
            .selector=${{ entity: { domain: ["sensor", "number", "input_number"] } }}
            .value=${lt}
            @value-changed=${(g) => {
      var E;
      const y = (E = g.detail) == null ? void 0 : E.value;
      Y ? (this._setIntegrationOptions({ roof_power_entity: y || null }), this._setConfigValue("roofPowerEntity", void 0)) : this._setConfigValue("roofPowerEntity", y);
    }}
          ></ha-selector>
        </div>
        <div class="row single">
          <div class="switch-row">
            <span>Enable power label</span>
            <ha-switch
              .checked=${is ?? !1}
              @change=${(g) => {
      var E;
      const y = !!((E = g.target) != null && E.checked);
      Y ? (this._setIntegrationOptions({ roof_power_enabled: y }), this._setConfigValue("roofPowerEnabled", void 0)) : this._setConfigValue("roofPowerEnabled", y);
    }}
            ></ha-switch>
          </div>
          <div class="switch-row">
            <span>Invert power value</span>
            <ha-switch
              .checked=${ns ?? !1}
              @change=${(g) => {
      var E;
      const y = !!((E = g.target) != null && E.checked);
      Y ? (this._setIntegrationOptions({ roof_power_invert: y }), this._setConfigValue("roofPowerInvert", void 0)) : this._setConfigValue("roofPowerInvert", y);
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
            .value=${String(G)}
            min="1"
            max="90"
            step="1"
            .configValue=${"autoRotateSpeed"}
            @change=${(g) => {
      var we, Ho;
      const y = ((we = g == null ? void 0 : g.detail) == null ? void 0 : we.value) ?? ((Ho = g == null ? void 0 : g.target) == null ? void 0 : Ho.value);
      let E = Math.round(Number(y));
      Number.isNaN(E) || (E = Math.min(90, Math.max(1, E)), Y ? (this._setIntegrationOptions({ auto_rotate_speed: E }), this._setConfigValue("autoRotateSpeed", void 0)) : this._setConfigValue("autoRotateSpeed", E));
    }}
          ></ha-textfield>
        </div>
      </div>
    `;
  }
};
Ws.styles = _n`
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
let Is = Ws;
customElements.define("sunlight-visualizer-card-editor", Is);
const Us = class Us extends Qt {
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
      return os`<ha-card></ha-card>`;
    const e = this._config || {}, t = Number(e.cardWidth ?? 450), r = Number(e.cardHeight ?? 450), a = this.renderSvg();
    return os`<div class="wrap"><ha-card style="width:${t}px; height:${r}px;">${va(a)}</ha-card></div>`;
  }
  renderSvg() {
    var ki, Di, Li, zi, Ii, Oi, Bi, Fi, Hi, Wi, Ui, Vi, ji, Gi, qi, Yi;
    const e = this._hass, t = this._config || {}, r = t.siSourceAttr ?? "sunlight_visualizer_source", a = t.siSourceValue ?? "sunlight_visualizer", p = Object.entries(e.states ?? {}).filter(
      ([, o]) => {
        var s;
        return ((s = o == null ? void 0 : o.attributes) == null ? void 0 : s[r]) === a;
      }
    ), d = (o) => {
      for (const [s, i] of p)
        if (o(i, s)) return [s, i];
      return null;
    }, x = (o) => {
      const s = d((i) => {
        var n;
        return ((n = i == null ? void 0 : i.attributes) == null ? void 0 : n.wall) === o;
      });
      return s ? s[0] : void 0;
    }, $ = (o) => {
      const s = d((i) => {
        var n;
        return ((n = i == null ? void 0 : i.attributes) == null ? void 0 : n.camera_rotation) === o;
      });
      return s ? s[0] : void 0;
    }, N = (o) => {
      const s = d((i) => {
        var n;
        return ((n = i == null ? void 0 : i.attributes) == null ? void 0 : n.si_setting) === o;
      });
      return s ? s[0] : void 0;
    }, P = d(
      (o) => {
        var s, i;
        return ((s = o == null ? void 0 : o.attributes) == null ? void 0 : s.sun_azimuth) != null && ((i = o == null ? void 0 : o.attributes) == null ? void 0 : i.sun_elevation) != null;
      }
    ), S = P ? P[1].attributes : null, H = d(
      (o) => {
        var s, i, n;
        return ((s = o == null ? void 0 : o.attributes) == null ? void 0 : s.roof_direction) != null || ((i = o == null ? void 0 : o.attributes) == null ? void 0 : i.ceiling_tilt) != null || ((n = o == null ? void 0 : o.attributes) == null ? void 0 : n.house_angle) != null;
      }
    ), v = H ? H[1].attributes : null, j = !!(v != null && v.force_sun_fallback), Nt = Number(t.cardWidth ?? 450), At = Number(t.cardHeight ?? 450), Tt = Nt, Pt = At, Y = Tt, lt = Pt, is = Y, ns = lt, $t = Y * 0.1, G = t.floorScale ?? 2.6, Ue = Y * 0.5, Ve = lt * 0.4, ee = t.floorColor ?? "#2f2f2f", oe = t.rotationHEntity ?? $("h") ?? "input_number.cube_rotation_h", rs = t.rotationVEntity ?? $("v") ?? "input_number.cube_rotation_v", Z = t.preferIntegrationSettings ?? !0, kt = t.houseAngleEntity ?? null;
    let ot = Number(t.houseAngle ?? 0);
    const se = N("house_angle");
    kt && e.states[kt] ? ot = Number(((ki = e.states[kt]) == null ? void 0 : ki.state) ?? ot) : se && e.states[se] ? ot = Number(((Di = e.states[se]) == null ? void 0 : Di.state) ?? ot) : (Z || t.houseAngle == null) && (v == null ? void 0 : v.house_angle) != null && (ot = Number(v.house_angle ?? ot));
    const je = t.wallFrontPctEntity ?? x("front"), Ge = t.wallRightPctEntity ?? x("right"), ie = t.wallBackPctEntity ?? x("back"), ne = t.wallLeftPctEntity ?? x("left"), re = t.roofPctEntity ?? x("ceiling"), X = (o, s = !1) => {
      if (o == null || o === "") return s;
      if (typeof o == "boolean") return o;
      if (typeof o == "number") return o !== 0;
      if (typeof o == "string") {
        const i = o.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(i)) return !0;
        if (["false", "0", "no", "off"].includes(i)) return !1;
      }
      return s;
    }, ae = Z ? (v == null ? void 0 : v.roof_power_entity) ?? t.roofPowerEntity ?? null : t.roofPowerEntity ?? (v == null ? void 0 : v.roof_power_entity) ?? null, Dt = Z ? X(v == null ? void 0 : v.roof_power_enabled, X(t.roofPowerEnabled, !1)) : X(t.roofPowerEnabled, X(v == null ? void 0 : v.roof_power_enabled, !1)), qe = Z ? X(v == null ? void 0 : v.roof_power_invert, X(t.roofPowerInvert, !1)) : X(t.roofPowerInvert, X(v == null ? void 0 : v.roof_power_invert, !1)), Ye = je ? Number(((Li = e.states[je]) == null ? void 0 : Li.state) ?? 0) : 0, Ze = Ge ? Number(((zi = e.states[Ge]) == null ? void 0 : zi.state) ?? 0) : 0, Xe = ie ? Number(((Ii = e.states[ie]) == null ? void 0 : Ii.state) ?? 0) : 0, Je = ne ? Number(((Oi = e.states[ne]) == null ? void 0 : Oi.state) ?? 0) : 0, Ke = re ? Number(((Bi = e.states[re]) == null ? void 0 : Bi.state) ?? 0) : 0, le = Dt && ae ? Number((Fi = e.states[ae]) == null ? void 0 : Fi.state) : NaN, ce = Dt ? ((o) => Number.isFinite(o) ? o >= 1e3 ? `${(o / 1e3).toFixed(2)} kW` : `${Math.round(o)} W` : "0 W")(qe ? Math.abs(le) : le) : "", Qe = t.useSunEntity ?? !1, Lt = t.sunEntityId ?? "sun.sun", dt = t.sunAzEntity ?? null, pt = t.sunElEntity ?? null;
    let zt = Number(t.sunDistance ?? 3), st = Number(t.sunAz ?? 135), it = Number(t.sunEl ?? 55);
    dt && e.states[dt] && (st = Number(((Hi = e.states[dt]) == null ? void 0 : Hi.state) ?? st)), pt && e.states[pt] && (it = Number(((Wi = e.states[pt]) == null ? void 0 : Wi.state) ?? it)), !dt && Z && (S == null ? void 0 : S.sun_azimuth) != null && (st = Number(S.sun_azimuth ?? st)), !pt && Z && (S == null ? void 0 : S.sun_elevation) != null && (it = Number(S.sun_elevation ?? it)), !dt && !pt && !S && Qe && e.states[Lt] && (st = Number(((Ui = e.states[Lt].attributes) == null ? void 0 : Ui.azimuth) ?? st), it = Number(((Vi = e.states[Lt].attributes) == null ? void 0 : Vi.elevation) ?? it));
    const yt = t.roofTiltEnabled ?? !0;
    let mt = Number(t.roofTiltDeg ?? 25), D = t.roofTiltFace ?? "front";
    const It = N("ceiling_tilt"), Ot = N("roof_direction"), to = Number(t.roofTiltMax ?? 89), eo = Number(t.roofTiltOpacity ?? 1);
    It && e.states[It] ? mt = Number(((ji = e.states[It]) == null ? void 0 : ji.state) ?? mt) : (Z || t.roofTiltDeg == null) && (v == null ? void 0 : v.ceiling_tilt) != null && (mt = Number(v.ceiling_tilt ?? mt)), Ot && e.states[Ot] ? D = String(((Gi = e.states[Ot]) == null ? void 0 : Gi.state) ?? D) : (Z || t.roofTiltFace == null) && (v == null ? void 0 : v.roof_direction) != null && (D = String(v.roof_direction));
    const Bt = t.shadowEnabled ?? !0, oo = Number(t.shadowOpacity ?? 0.35), so = Number(t.shadowBlur ?? 4), io = Number(t.shadowContactOpacity ?? 0.12), no = Number(t.shadowContactBlur ?? 2.5), he = t.shadowColor ?? "#000000", ue = Number(t.shadowClipInset ?? 0.02), Ft = t.sunlightEnabled ?? !0, Ht = t.sunlightColor ?? [255, 225, 160], fe = Number(t.sunlightOpacity ?? 0.7), ro = Number(t.sunlightSpread ?? 0.7), ao = Number(t.wallBottomMix ?? 0.01), lo = Number(t.wallMidMix ?? 0.7), co = Number(t.wallTopMix ?? 1.3), ho = Number(t.ceilingDarkMix ?? 0.1), uo = Number(t.ceilingLightMix ?? 1.4), de = t.horizonEnabled ?? !0, fo = Number(t.horizonBase ?? 0.55), po = Number(t.horizonTiltStrength ?? 0.65), pe = Number(t.horizonBand ?? 0.15), me = t.horizonTopColor ?? [120, 170, 220], mo = t.horizonBandColor ?? [255, 210, 150], ge = t.horizonBottomColor ?? [70, 80, 95], be = t.vignetteEnabled ?? !0, go = Number(t.vignetteOpacity ?? 0.35), bo = Number(t.vignetteRadius ?? 0.65), _o = Number(t.vignetteInner ?? 0.85), Wt = t.vignetteColor ?? [0, 0, 0], $o = t.roofBackEnabled ?? !0, yo = Number(t.roofBackMix ?? 0.7), vo = Number(t.roofBackOpacity ?? 1), wo = Number(t.roofGradientDarkMix ?? 0.125), Ro = Number(t.roofGradientLightMix ?? 1.25), So = t.roofSidesEnabled ?? !0, xo = Number(t.roofSideMix ?? 0.45), _e = Number(t.roofSideOpacity ?? 1), Mo = t.roofCapEnabled ?? !0, Co = Number(t.floorCompassStroke ?? 4), Eo = Number(t.floorCompassRingBand ?? 0.09), No = t.floorCompassRingMiddleColor ?? "rgba(255,255,255,0.9)", $e = t.floorCompassRingSideColor ?? "rgba(210,140,140,0.345)", ye = Number(t.floorCompassRingSideWidth ?? 3), ve = t.floorCompassTicksEnabled ?? !0, Ao = t.floorCompassTickColor ?? "rgba(0,0,0,0.75)", To = Number(t.floorCompassTickWidth ?? 1), Po = Number(t.floorCompassTickMajorWidth ?? 4), ko = Number(t.floorCompassTickLength ?? -0.1), Do = Number(t.floorCompassTickMajorLength ?? -0.2), Lo = Number(t.floorCompassLabelSize ?? 20), zo = Number(t.floorCompassLabelInset ?? -0.25), Io = Number(t.floorCompassLabelScaleBoost ?? 1.2), Oo = Number(t.floorCompassLabelScaleMin ?? 0.6), Bo = Number(t.floorCompassLabelScaleMax ?? 2), Fo = Number(t.floorCompassLabelStroke ?? 1), g = Number(t.arrowScaleBoost ?? 0.6), y = Number(t.floorPointerScaleMin ?? 0.05), E = Number(t.floorPointerScaleMax ?? 1), we = Number(t.floorPointerBaseWidth ?? 3), Ho = Number(t.floorPointerBaseHead ?? 15), Sn = Number(t.floorWallLabelSize ?? 12), Wo = Number(t.floorWallLabelOffset ?? 0.55), xn = Number(t.floorWallLabelScaleBoost ?? 1.2), Mn = Number(t.floorWallLabelScaleMin ?? 0.5), Cn = Number(t.floorWallLabelScaleMax ?? 1.8), En = Number(t.floorWallLabelScreenLift ?? 6), Nn = t.floorWallLabelColor ?? "rgba(255,255,255,0.9)", An = t.floorWallLabelStroke ?? "rgba(0,0,0,0.6)", Tn = Number(t.floorWallLabelStrokeWidth ?? 0.5), Pn = Number(t.wallLabelVisibleThreshold ?? -0.05), kn = Number(t.wallPctVisibleThreshold ?? -0.215), Dn = Number(t.wallPctAreaThreshold ?? 120), Ln = Number(t.wallPctVerticalPos ?? 0.66), Vs = t.surfaceLabelEnabled ?? !0, ls = Number(t.surfaceLabelSize ?? 12), zn = Number(t.surfaceLabelScaleBoost ?? 1.5), In = Number(t.surfaceLabelScaleMin ?? 0.6), On = Number(t.surfaceLabelScaleMax ?? 1.6), js = t.surfaceLabelColor ?? "rgba(255,213,0,.95)", Gs = t.surfaceLabelStroke ?? "rgba(0,0,0,0.5)", cs = Number(t.surfaceLabelStrokeWidth ?? 0.5), hs = Number(t.surfaceLabelOffset ?? 0.03), Bn = Number(t.roofPowerLabelScale ?? 0.85), Fn = t.roofPowerLabelColor ?? "rgba(255,255,255,0.9)", Hn = t.frontDoorEnabled ?? !0, qs = Number(t.frontDoorWidth ?? 0.55), Wn = Number(t.frontDoorHeight ?? 1.1), Un = Number(t.frontDoorBottomInset ?? 0.05), Vn = Number(t.frontDoorOffset ?? 0.01), jn = t.frontDoorColor ?? "rgba(0,0,0,0.55)", Gn = Number(t.frontDoorOpacity ?? 0.9), J = t.faceColors ?? {
      front: "#faf5f5ff",
      right: "#d8d2d2ff",
      top: "#13a057",
      back: "#d8d2d2ff",
      left: "#d8d2d2ff",
      bottom: "#d8d2d2ff"
    }, qn = t.autoRotateEnabledDefault ?? !1, Uo = Number(v == null ? void 0 : v.auto_rotate_speed);
    let Re = Number(t.autoRotateSpeed ?? 10);
    (Z && Number.isFinite(Uo) || (t.autoRotateSpeed === void 0 || t.autoRotateSpeed === null || t.autoRotateSpeed === "") && Number.isFinite(Uo)) && (Re = Uo);
    const vt = Number(t.autoRotateIntervalMs ?? 50), us = Number(t.autoRotateTapDelayMs ?? 250), Yn = t.autoRotateStopOnFullTurn ?? !0, Ys = Number(t.autoRotateTurnCount ?? 1), Zn = t.autoRotateShowFps ?? !0, Xn = Number(t.autoRotateFpsWindowMs ?? 1e3), Jn = t.autoRotateAdaptiveEnabled ?? !0, Zs = Number(t.autoRotateAdaptiveMaxIntervalMs ?? 1e3), Kn = Number(t.autoRotateAdaptiveStepMs ?? 10), Qn = Number(t.autoRotateAdaptiveCheckMs ?? 1e3), tr = Number(t.autoRotateAdaptiveFpsThreshold ?? 0.8), er = Number(t.autoRotateCalibrateMs ?? 2e3), or = Number(t.autoRotateCalibrateFactor ?? 0.85);
    this._autoRotateSpeed = Re, this._autoRotateIntervalMs = vt, this._autoRotateEnabled === void 0 && (this._autoRotateEnabled = qn), this._autoRotateOffsetDeg === void 0 && (this._autoRotateOffsetDeg = 0), this._autoRotateIntervalMsDynamic === void 0 && (this._autoRotateIntervalMsDynamic = vt), this._autoRotateFpsSamples === void 0 && (this._autoRotateFpsSamples = []), this._autoRotateFps === void 0 && (this._autoRotateFps = 0), this._autoRotateCalibrated === void 0 && (this._autoRotateCalibrated = !1), this._autoRotateAccumDeg === void 0 && (this._autoRotateAccumDeg = 0), this._autoRotateTargetDeg === void 0 && (this._autoRotateTargetDeg = 0);
    const fs = () => typeof performance < "u" && performance.now ? performance.now() : Date.now(), Xs = (o) => {
      const s = this._autoRotateFpsSamples || [];
      s.push(o);
      const i = o - Xn;
      for (; s.length && s[0] < i; ) s.shift();
      if (this._autoRotateFpsSamples = s, s.length >= 2) {
        const n = (s[s.length - 1] - s[0]) / 1e3;
        this._autoRotateFps = n > 0 ? (s.length - 1) / n : 0;
      }
    }, Js = (o) => {
      if (!this._autoRotateCalibrated || !Jn) return;
      const s = this._autoRotateAdaptiveLastCheck || 0;
      if (o - s < Qn) return;
      this._autoRotateAdaptiveLastCheck = o;
      const i = 1e3 / this._autoRotateIntervalMsDynamic;
      if (this._autoRotateFps && this._autoRotateFps < i * tr) {
        const n = Math.min(
          Zs,
          this._autoRotateIntervalMsDynamic + Kn
        );
        n !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = n, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
    }, Ks = (o) => {
      if (this._autoRotateCalibrated) return;
      const s = this._autoRotateCalibrateStart || o;
      if (this._autoRotateCalibrateStart = s, o - s < er) return;
      const i = this._autoRotateFps || 0;
      if (i > 0) {
        const l = 1e3 / (i * or), c = Math.min(
          Zs,
          Math.max(vt, Math.round(l))
        );
        c !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = c, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
      this._autoRotateCalibrated = !0;
    }, ds = () => {
      this._autoRotateEnabled && (this._autoRotateLastTick = 0, this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = 0, this._autoRotateEnabled = !1, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null), this._autoRotateIntervalMsDynamic = vt, this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._updateTimerMS = Date.now(), this.requestUpdate());
    }, sr = () => {
      this._autoRotateEnabled || (this._autoRotateEnabled = !0, this._autoRotateLastTick = fs(), this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = Yn && Ys > 0 ? Ys * 360 : 0, this._autoRotateIntervalMsDynamic = vt, this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._autoRotateTimer || (this._autoRotateTimer = setInterval(() => {
        const o = fs();
        Xs(o), Ks(o), Js(o);
        const s = this._autoRotateLastTick || o, i = Math.max(0, o - s) / 1e3, n = Re * i;
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + n, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + n, this._autoRotateLastTick = o, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
          ds();
          return;
        }
        this._updateTimerMS = Date.now(), this.requestUpdate();
      }, this._autoRotateIntervalMsDynamic), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic), this._updateTimerMS = Date.now(), this.requestUpdate());
    };
    this._autoRotateStop = ds, this._autoRotateStartFn = sr, this._autoRotateHandlers || (this._autoRotateHandlers = !0, this._autoRotateLastTap = 0, this.addEventListener("pointerup", (o) => {
      var n;
      if (o.button !== void 0 && o.button !== 0) return;
      const s = Date.now(), i = this._autoRotateLastTap || 0;
      if (s - i < us) {
        this._autoRotateLastTap = 0, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), (n = this._autoRotateStartFn) == null || n.call(this);
        return;
      }
      this._autoRotateLastTap = s, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), this._autoRotateClickTimer = setTimeout(() => {
        var l;
        this._autoRotateLastTap && Date.now() - this._autoRotateLastTap >= us && (this._autoRotateLastTap = 0, (l = this._autoRotateStop) == null || l.call(this));
      }, us + 10);
    }, { capture: !0 })), this._autoRotateEnabled ? (!this._autoRotateTimer || this._autoRotateTimerMs !== this._autoRotateIntervalMsDynamic) && (this._autoRotateTimer && clearInterval(this._autoRotateTimer), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic, this._autoRotateTimer = setInterval(() => {
      const o = fs();
      Xs(o), Ks(o), Js(o);
      const s = this._autoRotateLastTick || o, i = Math.max(0, o - s) / 1e3, n = Re * i;
      if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + n, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + n, this._autoRotateLastTick = o, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
        ds();
        return;
      }
      this._updateTimerMS = Date.now(), this.requestUpdate();
    }, this._autoRotateIntervalMsDynamic)) : this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null);
    const ir = Number(((qi = e.states[oe]) == null ? void 0 : qi.state) || 210);
    this._autoRotateCurrentDeg = this._autoRotateOffsetDeg || 0;
    const Qs = (ir + (this._autoRotateOffsetDeg || 0)) * Math.PI / 180, ti = Math.min(Math.max(Number(((Yi = e.states[rs]) == null ? void 0 : Yi.state) || 35), 0), 90), ei = ti * Math.PI / 180, oi = 5, si = Math.cos(Qs), ii = Math.sin(Qs), ni = Math.cos(ei), ri = -Math.sin(ei), ai = (ot || 0) * Math.PI / 180, li = Math.cos(ai), ci = Math.sin(ai), nr = Math.PI * 2;
    function W(o, s, i) {
      return Math.min(i, Math.max(s, o));
    }
    function Se(o) {
      const s = Math.hypot(...o);
      return s > 0 ? o.map((i) => i / s) : [0, 0, 0];
    }
    function z(o) {
      const s = o[0], i = o[1], n = o[2], l = s * si - n * ii, c = s * ii + n * si, h = i * ni - c * ri, m = i * ri + c * ni;
      return [l, h, m];
    }
    function K(o) {
      const s = o[0], i = o[1], n = o[2], l = s * li + n * ci, c = -s * ci + n * li;
      return [l, i, c];
    }
    function Vo(o) {
      return z(K(o));
    }
    function L(o) {
      const s = o[0], i = o[1], n = o[2], l = oi / (oi + n);
      return [Ue + s * $t * l, Ve - i * $t * l, n, l];
    }
    function ct(o, s) {
      const i = parseInt(o.substr(1, 2), 16), n = parseInt(o.substr(3, 2), 16), l = parseInt(o.substr(5, 2), 16), c = Math.min(255, Math.max(0, Math.round(i * s))), h = Math.min(255, Math.max(0, Math.round(n * s))), m = Math.min(255, Math.max(0, Math.round(l * s)));
      return `rgb(${c},${h},${m})`;
    }
    function rr(o, s, i, n) {
      const l = Se([i[0] - s[0], i[1] - s[1], i[2] - s[2]]), c = [o[0] - s[0], o[1] - s[1], o[2] - s[2]], h = Math.cos(n), m = Math.sin(n), b = [
        l[1] * c[2] - l[2] * c[1],
        l[2] * c[0] - l[0] * c[2],
        l[0] * c[1] - l[1] * c[0]
      ], f = l[0] * c[0] + l[1] * c[1] + l[2] * c[2], _ = [
        c[0] * h + b[0] * m + l[0] * f * (1 - h),
        c[1] * h + b[1] * m + l[1] * f * (1 - h),
        c[2] * h + b[2] * m + l[2] * f * (1 - h)
      ];
      return [s[0] + _[0], s[1] + _[1], s[2] + _[2]];
    }
    function ar(o, s, i) {
      const n = [s[0] - o[0], s[1] - o[1], s[2] - o[2]], l = [i[0] - o[0], i[1] - o[1], i[2] - o[2]];
      return Se([
        n[1] * l[2] - n[2] * l[1],
        n[2] * l[0] - n[0] * l[2],
        n[0] * l[1] - n[1] * l[0]
      ]);
    }
    function jo(o) {
      return o.reduce((s, i) => s + i[2], 0) / o.length;
    }
    function hi(o) {
      const s = Number(o);
      return Number.isFinite(s) ? `${Math.round(s)}%` : "0%";
    }
    function ps(o) {
      let s = 0;
      for (let i = 0; i < o.length; i++) {
        const n = (i + 1) % o.length;
        s += o[i][0] * o[n][1] - o[n][0] * o[i][1];
      }
      return s;
    }
    function lr(o, s) {
      if (!o.length || s.length < 3) return [];
      const n = ps(s) > 0, l = (m, b, f) => {
        const _ = (f[0] - b[0]) * (m[1] - b[1]) - (f[1] - b[1]) * (m[0] - b[0]);
        return n ? _ >= 0 : _ <= 0;
      }, c = (m, b, f, _) => {
        const R = m[0], w = m[1], C = b[0], M = b[1], k = f[0], I = f[1], O = _[0], U = _[1], ht = (R - C) * (I - U) - (w - M) * (k - O);
        if (Math.abs(ht) < 1e-6) return b;
        const De = ((R * M - w * C) * (k - O) - (R - C) * (k * U - I * O)) / ht, Qo = ((R * M - w * C) * (I - U) - (w - M) * (k * U - I * O)) / ht;
        return [De, Qo];
      };
      let h = o.slice();
      for (let m = 0; m < s.length; m++) {
        const b = s[m], f = s[(m + 1) % s.length], _ = h.slice();
        if (h = [], !_.length) break;
        for (let R = 0; R < _.length; R++) {
          const w = _[R], C = _[(R - 1 + _.length) % _.length], M = l(w, b, f), k = l(C, b, f);
          M ? (k || h.push(c(C, w, b, f)), h.push(w)) : k && h.push(c(C, w, b, f));
        }
      }
      return h;
    }
    function ui(o, s, i, n) {
      return n > 0 && (o = -o, s = -s, i = -i, n = -n), o * n - s * i < 0 && (o = -o, s = -s), o < 0 && (o = -o, s = -s, i = -i, n = -n), { bx: o, by: s, ux: i, uy: n };
    }
    function fi(o, s, i, n) {
      return o * n - s * i < 0 && (i = -i, n = -n), { bx: o, by: s, ux: i, uy: n };
    }
    function di(o, s, i, n, l = !0) {
      const c = L(z(o)), h = L(z([
        o[0] + s[0],
        o[1] + s[1],
        o[2] + s[2]
      ])), m = L(z([
        o[0] + i[0],
        o[1] + i[1],
        o[2] + i[2]
      ]));
      let b = h[0] - c[0], f = h[1] - c[1], _ = Math.hypot(b, f);
      if (_ < 1e-6) return null;
      b /= _, f /= _;
      let R = m[0] - c[0], w = m[1] - c[1], C = Math.hypot(R, w);
      C < 1e-6 ? (R = -f, w = b, C = Math.hypot(R, w)) : (R /= C, w /= C);
      let M = l ? ui(b, f, R, w) : fi(b, f, R, w);
      if (n) {
        const k = L(z([
          o[0] + n[0],
          o[1] + n[1],
          o[2] + n[2]
        ]));
        let I = k[0] - c[0], O = k[1] - c[1], U = Math.hypot(I, O);
        U > 1e-6 && (I /= U, O /= U, M.bx * I + M.by * O < 0 && (M = l ? ui(-M.bx, -M.by, -M.ux, -M.uy) : fi(-M.bx, -M.by, -M.ux, -M.uy)));
      }
      return { basis: M, centerScr: c };
    }
    function cr(o, s) {
      const i = o[0][0], n = o[0][1], l = o[1][0], c = o[1][1], h = o[2][0], m = o[2][1], b = s[0][0], f = s[0][1], _ = s[1][0], R = s[1][1], w = s[2][0], C = s[2][1], M = i * (c - m) + l * (m - n) + h * (n - c);
      if (Math.abs(M) < 1e-6) return null;
      const k = (b * (c - m) + _ * (m - n) + w * (n - c)) / M, I = (f * (c - m) + R * (m - n) + C * (n - c)) / M, O = (b * (h - l) + _ * (i - h) + w * (l - i)) / M, U = (f * (h - l) + R * (i - h) + C * (l - i)) / M, ht = (b * (l * m - h * c) + _ * (h * n - i * m) + w * (i * c - l * n)) / M, De = (f * (l * m - h * c) + R * (h * n - i * m) + C * (i * c - l * n)) / M;
      return { a: k, b: I, c: O, d: U, e: ht, f: De };
    }
    function hr(o) {
      const s = [0, 1, 0], i = [
        s[1] * o[2] - s[2] * o[1],
        s[2] * o[0] - s[0] * o[2],
        s[0] * o[1] - s[1] * o[0]
      ];
      return Se(i);
    }
    function ur(o) {
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
    function fr(o, s, i, n, l) {
      if (o.length === 0) return o;
      const c = (f, _, R) => {
        const w = [];
        for (let C = 0; C < f.length; C++) {
          const M = f[C], k = f[(C + 1) % f.length], I = _(M), O = _(k);
          I && O ? w.push(k) : I && !O ? w.push(R(M, k)) : !I && O && (w.push(R(M, k)), w.push(k));
        }
        return w;
      }, h = (f, _, R) => {
        const w = _.x - f.x;
        if (Math.abs(w) < 1e-9) return { x: R, z: f.z };
        const C = (R - f.x) / w;
        return { x: R, z: f.z + C * (_.z - f.z) };
      }, m = (f, _, R) => {
        const w = _.z - f.z;
        if (Math.abs(w) < 1e-9) return { x: f.x, z: R };
        const C = (R - f.z) / w;
        return { x: f.x + C * (_.x - f.x), z: R };
      };
      let b = o.slice();
      return b = c(b, (f) => f.x >= s, (f, _) => h(f, _, s)), b = c(b, (f) => f.x <= i, (f, _) => h(f, _, i)), b = c(b, (f) => f.z >= n, (f, _) => m(f, _, n)), b = c(b, (f) => f.z <= l, (f, _) => m(f, _, l)), b;
    }
    function dr(o) {
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
    const Go = st * Math.PI / 180, ms = it * Math.PI / 180, xe = Se([
      Math.cos(ms) * Math.sin(Go),
      Math.sin(ms),
      Math.cos(ms) * Math.cos(Go)
    ]), gs = z(xe), qo = xe[1] > 0.01, pi = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ], bs = pi.map(K), Me = bs.map(z).map(L);
    dr(Me.map((o) => ({ x: o[0], y: o[1] }))), Math.min(...Me.map((o) => o[2]));
    const mi = [
      { id: "front", i: [4, 5, 6, 7], c: J.front },
      { id: "right", i: [1, 5, 6, 2], c: J.right },
      { id: "back", i: [0, 1, 2, 3], c: J.back },
      { id: "left", i: [0, 4, 7, 3], c: J.left },
      { id: "bottom", i: [0, 1, 5, 4], c: J.bottom }
    ], gi = {
      front: { indices: [4, 5, 6, 7], edge: [4, 5] },
      right: { indices: [1, 5, 6, 2], edge: [1, 5] },
      back: { indices: [0, 1, 2, 3], edge: [0, 1] },
      left: { indices: [0, 4, 7, 3], edge: [0, 4] }
    }, pr = {
      front: [0, 0, 1],
      right: [1, 0, 0],
      back: [0, 0, -1],
      left: [-1, 0, 0]
    }, mr = {
      front: Ye,
      right: Ze,
      back: Xe,
      left: Je
    }, gr = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    }, F = [
      [-1, 1, -1],
      [1, 1, -1],
      [1, 1, 1],
      [-1, 1, 1]
    ], bi = W(mt, 0, to), Yo = yt && bi > 0.01;
    let T = F;
    if (Yo) {
      const o = bi * Math.PI / 180;
      let s = [-1, 1, 1], i = [1, 1, 1], n = 1;
      D === "front" && (s = [-1, 1, 1], i = [1, 1, 1], n = 1), D === "back" && (s = [-1, 1, -1], i = [1, 1, -1], n = -1), D === "left" && (s = [-1, 1, -1], i = [-1, 1, 1], n = 1), D === "right" && (s = [1, 1, -1], i = [1, 1, 1], n = -1);
      const l = o * n;
      T = F.map((c) => rr(c, s, i, l));
    }
    const Ut = T.map(K), _s = Ut.map(z).map(L);
    let $s = ar(T[0], T[1], T[2]);
    $s[1] < 0 && ($s = $s.map((o) => -o));
    const _i = ps(_s), $i = _i < 0;
    this._roofWindingFront === void 0 ? this._roofWindingFront = $i : Math.abs(_i) > 20 && (this._roofWindingFront = $i);
    const Vt = this._roofWindingFront;
    let Ce = [];
    Yo && So && (D === "front" ? Ce = [
      [T[0], F[0], T[3]],
      [T[1], F[1], T[2]]
    ] : D === "back" ? Ce = [
      [T[3], F[3], T[0]],
      [T[2], F[2], T[1]]
    ] : D === "left" ? Ce = [
      [T[2], F[2], T[3]],
      [T[1], F[1], T[0]]
    ] : D === "right" && (Ce = [
      [T[3], F[3], T[2]],
      [T[0], F[0], T[1]]
    ]));
    const br = Ce.map(
      (o) => o.map((s) => L(Vo(s)))
    ), yi = ct(J.top, xo), _r = ct(J.top, yo);
    let jt = null;
    Yo && Mo && (D === "front" ? jt = [T[0], T[1], F[1], F[0]] : D === "back" ? jt = [T[2], T[3], F[3], F[2]] : D === "left" ? jt = [T[1], T[2], F[2], F[1]] : D === "right" && (jt = [T[0], T[3], F[3], F[0]]));
    const ys = jt ? jt.map((o) => L(Vo(o))) : null;
    let nt = [0, 0, -1];
    D === "front" && (nt = [0, 0, -1]), D === "back" && (nt = [0, 0, 1]), D === "left" && (nt = [1, 0, 0]), D === "right" && (nt = [-1, 0, 0]);
    const Gt = T.reduce((o, s) => [o[0] + s[0], o[1] + s[1], o[2] + s[2]], [0, 0, 0]).map((o) => o / 4), qt = 2.2, vi = L(Vo([
      Gt[0] - nt[0] * qt,
      Gt[1] - nt[1] * qt,
      Gt[2] - nt[2] * qt
    ])), wi = L(Vo([
      Gt[0] + nt[0] * qt,
      Gt[1] + nt[1] * qt,
      Gt[2] + nt[2] * qt
    ])), V = -1, Ri = -1, $r = [
      [-G, V, -G],
      [G, V, -G],
      [G, V, G],
      [-G, V, G]
    ].map(z).map(L), yr = [
      gs[0] * zt,
      gs[1] * zt,
      gs[2] * zt
    ], Q = L(yr), Ee = Q[3], vr = Math.max(4, 12 * Ee), wr = Math.max(3, 8 * Ee), vs = W(fo - ti / 90 * po, 0.1, 0.9), Rr = W(vs - pe, 0, 1), Sr = W(vs, 0, 1), xr = W(vs + pe, 0, 1), tt = G * (1 - 0.05), Zo = 64;
    let Yt = this._ringUnit;
    (!Yt || Yt.length !== Zo) && (Yt = Array.from({ length: Zo }, (o, s) => {
      const i = s / Zo * nr;
      return [Math.sin(i), Math.cos(i)];
    }), this._ringUnit = Yt);
    const Si = Math.min(Eo, tt * 0.3), xi = tt - Si, Mr = tt + Si;
    function ws(o) {
      return Yt.map(([s, i]) => {
        const n = z([o * s, V, o * i]), l = L(n);
        return l[0] + "," + l[1];
      });
    }
    const Cr = ws(xi), Er = ws(tt), Nr = ws(Mr);
    let Mi = [];
    ve && (Mi = Yt.map(([o, s], i) => {
      const n = i % (Zo / 4) === 0, l = n ? Do : ko, c = xi, h = c - l, m = L(z([h * o, V, h * s])), b = L(z([c * o, V, c * s]));
      return { pIn: m, pOut: b, isMajor: n };
    }));
    const Ar = [["N", 0], ["E", Math.PI / 2], ["S", Math.PI], ["W", 3 * Math.PI / 2]], Ci = tt * (1 - zo), Tr = Ar.map(([o, s]) => {
      const i = z([Ci * Math.sin(s), V, Ci * Math.cos(s)]), n = L(i), l = W(n[3] * Io, Oo, Bo);
      return { t: o, x: n[0], y: n[1], scale: l };
    }), gt = Se([Math.sin(Go), 0, Math.cos(Go)]), Pr = z([gt[0] * tt * 0.25, V, gt[2] * tt * 0.25]), kr = z([gt[0] * tt * 0.95, V, gt[2] * tt * 0.95]), wt = L(Pr), et = L(kr), Dr = W(wt[3] * g, y, E), Ei = W(et[3] * g, y, E), Xo = we * Dr, Jo = we * Ei, Zt = Ho * Ei, Ni = [
      { id: "front", label: "Front", normal: [0, 0, 1], pos: [0, V, 1 + Wo] },
      { id: "back", label: "Back", normal: [0, 0, -1], pos: [0, V, -1 - Wo] },
      { id: "right", label: "Right", normal: [1, 0, 0], pos: [1 + Wo, V, 0] },
      { id: "left", label: "Left", normal: [-1, 0, 0], pos: [-1 - Wo, V, 0] }
    ], Rs = {}, Ss = {};
    Ni.forEach((o) => {
      const s = z(K(o.normal));
      Rs[o.id] = s[2] < Pn;
      const i = gi[o.id];
      if (i) {
        const n = i.indices.map((c) => Me[c]), l = Math.abs(ps(n));
        Ss[o.id] = s[2] < kn && l > Dn;
      } else
        Ss[o.id] = Rs[o.id];
    });
    let Ne = null;
    if (Bt && qo) {
      const o = [-xe[0], -xe[1], -xe[2]];
      if (Math.abs(o[1]) > 1e-6) {
        const s = [], i = Yo ? bs.concat(Ut) : bs;
        for (const l of i) {
          const c = (Ri - l[1]) / o[1];
          c >= 0 && s.push({ x: l[0] + o[0] * c, z: l[2] + o[2] * c });
        }
        const n = ur(s);
        if (n.length >= 3) {
          const l = W(ue, 0, 0.2), c = G * (1 - l), h = fr(n, -c, c, -c, c);
          h.length >= 3 && (Ne = h.map((m) => L(z([m.x, Ri, m.z]))));
        }
      }
    }
    const Ai = Ne ? Ne.map((o) => o[0] + "," + o[1]).join(" ") : null;
    let Ae = null, Te = null;
    if (Ft && qo) {
      const s = Math.hypot(G * 2, G * 2) * ro, i = [gt[0] * tt * 0.95, V, gt[2] * tt * 0.95], n = [
        i[0] - gt[0] * s,
        V,
        i[2] - gt[2] * s
      ], l = z(i), c = z(n);
      Ae = L(l), Te = L(c);
    }
    const Lr = [2, 3, 6, 7];
    function zr(o, s) {
      const i = o.length;
      if (i < 3) return "";
      let n = "";
      for (let l = 0; l < i; l++) {
        const c = o[(l - 1 + i) % i], h = o[l], m = o[(l + 1) % i], b = [c[0] - h[0], c[1] - h[1]], f = [m[0] - h[0], m[1] - h[1]], _ = Math.hypot(b[0], b[1]), R = Math.hypot(f[0], f[1]);
        if (_ === 0 || R === 0) continue;
        const w = Math.min(s, _ / 2, R / 2), C = [b[0] / _, b[1] / _], M = [f[0] / R, f[1] / R], k = [h[0] + C[0] * w, h[1] + C[1] * w], I = [h[0] + M[0] * w, h[1] + M[1] * w];
        l === 0 ? n += `M ${k[0]} ${k[1]}` : n += ` L ${k[0]} ${k[1]}`, n += ` Q ${h[0]} ${h[1]} ${I[0]} ${I[1]}`;
      }
      return n + " Z";
    }
    const Ir = 20, Pe = $r.map((o) => [o[0], o[1]]), Ti = zr(Pe, Ir), xs = W(ue, 0, 0.2), Ko = Pe.reduce((o, s) => [o[0] + s[0], o[1] + s[1]], [0, 0]).map((o) => o / Pe.length), Or = xs > 0 ? Pe.map((o) => [
      Ko[0] + (o[0] - Ko[0]) * (1 - xs),
      Ko[1] + (o[1] - Ko[1]) * (1 - xs)
    ]) : Pe, rt = [];
    de && rt.push(`<linearGradient id="horizon-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgb(${me.join(",")})"/>
        <stop offset="${(Rr * 100).toFixed(2)}%" stop-color="rgb(${me.join(",")})"/>
        <stop offset="${(Sr * 100).toFixed(2)}%" stop-color="rgb(${mo.join(",")})"/>
        <stop offset="${(xr * 100).toFixed(2)}%" stop-color="rgb(${ge.join(",")})"/>
        <stop offset="100%" stop-color="rgb(${ge.join(",")})"/>
      </linearGradient>`), rt.push(`<radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,200,0.85)"/>
      <stop offset="70%" stop-color="rgba(255,255,150,0.35)"/>
      <stop offset="100%" stop-color="rgba(255,255,100,0)"/>
    </radialGradient>`), rt.push(`<linearGradient id="ceiling-grad" x1="0" y1="1" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${ct(J.top, ho)}"/>
      <stop offset="100%" stop-color="${ct(J.top, uo)}"/>
    </linearGradient>`), yt && rt.push(`<linearGradient id="roof-grad" x1="${vi[0]}" y1="${vi[1]}" x2="${wi[0]}" y2="${wi[1]}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${ct(J.top, wo)}"/>
        <stop offset="100%" stop-color="${ct(J.top, Ro)}"/>
      </linearGradient>`), mi.forEach((o) => {
      rt.push(`<linearGradient id="wall-${o.id}" x1="0" y1="1" x2="0" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="${ct(o.c, ao)}"/>
        <stop offset="60%" stop-color="${ct(o.c, lo)}"/>
        <stop offset="100%" stop-color="${ct(o.c, co)}"/>
      </linearGradient>`);
    }), Bt && Ai && (rt.push(`<filter id="shadow-blur-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${so}"/>
      </filter>`), rt.push(`<filter id="shadow-blur-contact" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${no}"/>
      </filter>`)), Ft && qo && Ae && Te && rt.push(`<linearGradient id="sunlight-grad" x1="${Ae[0]}" y1="${Ae[1]}"
                  x2="${Te[0]}" y2="${Te[1]}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="rgb(${Ht.join(",")})" stop-opacity="${fe}"/>
          <stop offset="55%" stop-color="rgb(${Ht.join(",")})" stop-opacity="${fe * 0.45}"/>
          <stop offset="100%" stop-color="rgb(${Ht.join(",")})" stop-opacity="0"/>
        </linearGradient>`), be && rt.push(`<radialGradient id="vignette" cx="50%" cy="50%" r="${bo}">
        <stop offset="0%" stop-color="rgb(${Wt.join(",")})" stop-opacity="0"/>
        <stop offset="${(_o * 100).toFixed(1)}%" stop-color="rgb(${Wt.join(",")})" stop-opacity="0"/>
        <stop offset="100%" stop-color="rgb(${Wt.join(",")})" stop-opacity="${go}"/>
      </radialGradient>`);
    const A = [];
    if (A.push(`<svg viewBox="0 0 ${Y} ${lt}" width="${is}" height="${ns}" preserveAspectRatio="xMidYMid meet"><defs>${rt.join("")}</defs>`), de && A.push(`<rect x="0" y="0" width="${Y}" height="${lt}" fill="url(#horizon-grad)"/>`), A.push(`<path d="${Ti}" fill="${ee}"/>`), Ft && qo && Ae && Te && A.push(`<path d="${Ti}" fill="url(#sunlight-grad)"/>`), Bt && Ai) {
      const o = Ne ? Ne.map((i) => [i[0], i[1]]) : [], s = lr(o, Or);
      if (s.length >= 3) {
        const i = s.map((n) => n[0] + "," + n[1]).join(" ");
        A.push(`<polygon points="${i}" fill="${he}" opacity="${oo}" filter="url(#shadow-blur-soft)"/>`), A.push(`<polygon points="${i}" fill="${he}" opacity="${io}" filter="url(#shadow-blur-contact)"/>`);
      }
    }
    A.push(`<polygon points="${Cr.join(" ")}" fill="none" stroke="${$e}" stroke-width="${ye}" stroke-linecap="round"/>`), A.push(`<polygon points="${Er.join(" ")}" fill="none" stroke="${No}" stroke-width="${Co}" stroke-linecap="round"/>`), A.push(`<polygon points="${Nr.join(" ")}" fill="none" stroke="${$e}" stroke-width="${ye}" stroke-linecap="round"/>`), ve && Mi.forEach((o) => {
      const s = o.isMajor ? Po : To;
      A.push(`<line x1="${o.pIn[0]}" y1="${o.pIn[1]}" x2="${o.pOut[0]}" y2="${o.pOut[1]}" stroke="${Ao}" stroke-width="${s}"/>`);
    }), Tr.forEach((o) => {
      A.push(`<text x="${o.x}" y="${o.y}" fill="white"
        font-size="${Lo * o.scale}"
        stroke="rgba(0,0,0,0.6)" stroke-width="${Fo * o.scale}"
        font-weight="700" text-anchor="middle">${o.t}</text>`);
    });
    const Ms = et[0] - wt[0], Cs = et[1] - wt[1], ke = Math.hypot(Ms, Cs);
    if (ke > 1e-3) {
      const o = -Cs / ke, s = Ms / ke, i = [wt[0] + o * Xo / 2, wt[1] + s * Xo / 2], n = [wt[0] - o * Xo / 2, wt[1] - s * Xo / 2], l = [et[0] + o * Jo / 2, et[1] + s * Jo / 2], c = [et[0] - o * Jo / 2, et[1] - s * Jo / 2];
      A.push(`<polygon points="${i[0]},${i[1]} ${n[0]},${n[1]} ${c[0]},${c[1]} ${l[0]},${l[1]}"
        fill="yellow" opacity="0.9"/>`);
      const h = et[0] - Ms / ke * Zt, m = et[1] - Cs / ke * Zt, b = [h + o * Zt * 0.6, m + s * Zt * 0.6], f = [h - o * Zt * 0.6, m - s * Zt * 0.6];
      A.push(`<polygon points="${et[0]},${et[1]} ${b[0]},${b[1]} ${f[0]},${f[1]}"
        fill="yellow" opacity="0.95"/>`);
    }
    const Br = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    };
    Ni.forEach((o) => {
      const s = Br[o.id];
      if (!s) return;
      const i = K(s), n = K(o.pos), l = o.id === "front" || o.id === "left" ? s.map((C) => -C) : s, c = K(l), h = di(n, i, hr(i), c, !1);
      if (!h) return;
      const { basis: m, centerScr: b } = h, f = W(b[3] * xn, Mn, Cn), _ = Sn * f, R = Tn * f, w = b[1] - En * f;
      A.push(`<text x="0" y="0"
        fill="${Nn}"
        font-size="${_}"
        stroke="${An}"
        stroke-width="${R}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${m.bx} ${m.by} ${m.ux} ${m.uy} ${b[0]} ${w})">${o.label}</text>`);
    }), Lr.forEach((o) => {
      const s = Me[o];
      A.push(`<line x1="${Q[0]}" y1="${Q[1]}" x2="${s[0]}" y2="${s[1]}"
        stroke="rgba(255,255,150,0.2)" stroke-width="2"/>`);
    });
    const Fr = mi.map((o) => {
      const s = o.i.map((i) => Me[i]);
      return { type: "cube", id: o.id, pts: s, z: jo(s), fill: `url(#wall-${o.id})`, opacity: 1 };
    }), Xt = [];
    br.forEach((o) => {
      Xt.push({ type: "roofSide", pts: o, z: jo(o), fill: yi, opacity: _e });
    }), ys && Xt.push({ type: "roofCap", pts: ys, z: jo(ys), fill: yi, opacity: _e });
    let Jt = jo(_s);
    if (Xt.length) {
      const o = Math.min(...Xt.map((i) => i.z)), s = Math.max(...Xt.map((i) => i.z));
      Vt ? Jt = Math.min(Jt, o - 0.02) : Jt = Math.max(Jt, s + 0.02);
    } else
      Jt += Vt ? -1e-3 : 1e-3;
    const Pi = yt && (Vt || $o) ? {
      type: "roofPlane",
      pts: _s,
      z: Jt,
      fill: Vt ? "url(#roof-grad)" : _r,
      opacity: Vt ? eo : vo
    } : null, Hr = Fr.concat(Xt).concat(Pi ? [Pi] : []).sort((o, s) => s.z - o.z), Wr = (o) => {
      if (!Vs || !Ss[o]) return;
      const s = gr[o], i = pr[o];
      if (!s || !i) return;
      const n = o === "front" || o === "left" ? s.map((O) => -O) : s;
      let l = 0, c = 0, h = 0;
      gi[o].indices.forEach((O) => {
        const U = pi[O];
        l += U[0], c += U[1], h += U[2];
      }), l /= 4, c /= 4, h /= 4, c = W(Ln, -0.9, 0.9);
      const m = [
        l + i[0] * hs,
        c + i[1] * hs,
        h + i[2] * hs
      ], b = K(m), f = K(s), _ = K(n), R = di(b, f, [0, 1, 0], _, !1);
      if (!R) return;
      const { basis: w, centerScr: C } = R, M = W(C[3] * zn, In, On), k = ls * M, I = cs * M;
      A.push(`<text x="0" y="0"
        fill="${js}"
        font-size="${k}"
        stroke="${Gs}"
        stroke-width="${I}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${w.bx} ${w.by} ${w.ux} ${w.uy} ${C[0]} ${C[1]})">${hi(mr[o])}</text>`);
    }, Ur = () => {
      if (!Hn || !Rs.front) return;
      const o = -qs / 2, s = qs / 2, i = W(-1 + Un, -1, 1), n = W(i + Wn, -1, 1), l = 1 + Vn, m = [
        [o, i, l],
        [s, i, l],
        [s, n, l],
        [o, n, l]
      ].map((b) => L(z(K(b)))).map((b) => b[0] + "," + b[1]).join(",");
      A.push(`<polygon points="${m}" fill="${jn}" opacity="${Gn}"/>`);
    }, Vr = () => {
      if (!Vs || !yt || !Vt) return;
      const o = {
        front: { low: [3, 2], high: [0, 1] },
        back: { low: [0, 1], high: [3, 2] },
        left: { low: [0, 3], high: [1, 2] },
        right: { low: [1, 2], high: [0, 3] }
      }, s = o[D] ?? o.front;
      let i = Ut[s.low[0]], n = Ut[s.low[1]], l = Ut[s.high[0]], c = Ut[s.high[1]];
      if (!i || !n || !l || !c) return;
      if (D === "front" || D === "back") {
        if (n[0] < i[0]) {
          const q = i;
          i = n, n = q;
          const at = l;
          l = c, c = at;
        }
      } else if (n[2] < i[2]) {
        const q = i;
        i = n, n = q;
        const at = l;
        l = c, c = at;
      }
      const h = Math.hypot(n[0] - i[0], n[1] - i[1], n[2] - i[2]), m = [(i[0] + n[0]) / 2, (i[1] + n[1]) / 2, (i[2] + n[2]) / 2], b = [(l[0] + c[0]) / 2, (l[1] + c[1]) / 2, (l[2] + c[2]) / 2], f = Math.hypot(b[0] - m[0], b[1] - m[1], b[2] - m[2]);
      if (!isFinite(h) || !isFinite(f) || h <= 1e-6 || f <= 1e-6) return;
      const _ = hi(Ke);
      let R = -f * (1 / 3), w = -f * (2 / 3);
      const C = 1 / 6, M = h * (1 - 2 * C), k = "100%", I = "9.99 kW", O = Math.max(_.length, k.length);
      Math.max((ce || "").length, I.length);
      const U = f * 0.36, ht = Math.min(M / (0.6 * O), U), De = cs / ls * ht, Qo = Math.min(ht * Bn, U * 0.85), jr = cs / ls * Qo;
      this._roofStripSeed = (this._roofStripSeed || 0) + 1;
      const Es = (q, at, Le) => [q[0] + (at[0] - q[0]) * Le, q[1] + (at[1] - q[1]) * Le, q[2] + (at[2] - q[2]) * Le], Zi = (q, at, Le, Gr, Ns, qr, Ca) => {
        if (!q) return;
        const Yr = Math.max(at * qr, f * 0.08), As = Ns, Xi = Ns - Yr, Ji = W(-As / f, 0, 1), Zr = W(-Xi / f, 0, 1), Xr = Es(i, l, Ji), Jr = Es(n, c, Ji), Kr = Es(i, l, Zr), Ki = L(z(Xr)), Qi = L(z(Jr)), tn = L(z(Kr)), ut = [[0, As], [h, As], [0, Xi]], ft = [[Ki[0], Ki[1]], [Qi[0], Qi[1]], [tn[0], tn[1]]], Rt = cr(ut, ft);
        if (!Rt) return;
        const en = Math.sign((ut[1][0] - ut[0][0]) * (ut[2][1] - ut[0][1]) - (ut[1][1] - ut[0][1]) * (ut[2][0] - ut[0][0])), on = Math.sign((ft[1][0] - ft[0][0]) * (ft[2][1] - ft[0][1]) - (ft[1][1] - ft[0][1]) * (ft[2][0] - ft[0][0])), sn = en !== 0 && on !== 0 && en !== on;
        A.push(`<g transform="matrix(${Rt.a} ${Rt.b} ${Rt.c} ${Rt.d} ${Rt.e} ${Rt.f})">`), sn && A.push(`<g transform="translate(${h} 0) scale(-1 1)">`), A.push(`<text x="${h / 2}" y="${Ns}" fill="${Gr}" font-size="${at}"
          stroke="${Gs}" stroke-width="${Le}" font-weight="700"
          text-anchor="middle" dominant-baseline="middle">${q}</text>`), sn && A.push("</g>"), A.push("</g>");
      };
      Dt && Zi(ce, Qo, jr, Fn, R, 1.6), Zi(_, ht, De, js, w, 1.6);
    };
    Hr.forEach((o) => {
      const s = o.pts.map((i) => i[0] + "," + i[1]).join(",");
      A.push(`<polygon points="${s}" fill="${o.fill}" stroke="#000" stroke-width="0.5" opacity="${o.opacity}"/>`), o.type === "cube" && o.id === "front" && Ur(), o.type === "cube" && Wr(o.id), o.type === "roofPlane" && Vr();
    }), A.push(`<circle cx="${Q[0]}" cy="${Q[1]}" r="${vr}" fill="url(#sun-glow)"/>`), A.push(`<circle cx="${Q[0]}" cy="${Q[1]}" r="${wr}" fill="yellow" stroke="orange" stroke-width="${Math.max(1, 2 * Ee)}"/>`);
    for (let o = 0; o < 8; o++) {
      const s = o * Math.PI / 4, i = 20 * Ee, n = Q[0] + Math.cos(s) * i, l = Q[1] + Math.sin(s) * i;
      A.push(`<line x1="${Q[0]}" y1="${Q[1]}" x2="${n}" y2="${l}"
          stroke="yellow" stroke-width="${1.5 * Ee}" opacity="0.6"/>`);
    }
    if (j && (A.push(`<text x="10" y="${lt - 24}" fill="#ff3b3b" font-size="12" font-weight="700">SUN OVERRIDE ENABLED</text>`), A.push(`<text x="10" y="${lt - 10}" fill="#ff3b3b" font-size="11" font-weight="700">Solar alignment % is disabled</text>`)), be && A.push(`<rect x="0" y="0" width="${Y}" height="${lt}" fill="url(#vignette)"/>`), Zn && this._autoRotateEnabled) {
      const o = Number.isFinite(this._autoRotateFps) ? this._autoRotateFps : 0, s = this._autoRotateIntervalMsDynamic || vt, i = s > vt ? " LIMIT" : "";
      A.push(`<text x="10" y="18" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">FPS ${o.toFixed(1)} | ${Math.round(s)}ms${i}</text>`);
    }
    return A.push("</svg>"), A.join("");
  }
};
Us.styles = _n`
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
let Os = Us;
customElements.define("sunlight-visualizer-card", Os);
