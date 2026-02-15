/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $a = globalThis, Hn = $a.ShadowRoot && ($a.ShadyCSS === void 0 || $a.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Gn = Symbol(), oc = /* @__PURE__ */ new WeakMap();
let mc = class {
  constructor(s, o, l) {
    if (this._$cssResult$ = !0, l !== Gn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = s, this.t = o;
  }
  get styleSheet() {
    let s = this.o;
    const o = this.t;
    if (Hn && s === void 0) {
      const l = o !== void 0 && o.length === 1;
      l && (s = oc.get(o)), s === void 0 && ((this.o = s = new CSSStyleSheet()).replaceSync(this.cssText), l && oc.set(o, s));
    }
    return s;
  }
  toString() {
    return this.cssText;
  }
};
const Rf = (S) => new mc(typeof S == "string" ? S : S + "", void 0, Gn), bc = (S, ...s) => {
  const o = S.length === 1 ? S[0] : s.reduce((l, u, x) => l + ((v) => {
    if (v._$cssResult$ === !0) return v.cssText;
    if (typeof v == "number") return v;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + v + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(u) + S[x + 1], S[0]);
  return new mc(o, S, Gn);
}, Mf = (S, s) => {
  if (Hn) S.adoptedStyleSheets = s.map((o) => o instanceof CSSStyleSheet ? o : o.styleSheet);
  else for (const o of s) {
    const l = document.createElement("style"), u = $a.litNonce;
    u !== void 0 && l.setAttribute("nonce", u), l.textContent = o.cssText, S.appendChild(l);
  }
}, ec = Hn ? (S) => S : (S) => S instanceof CSSStyleSheet ? ((s) => {
  let o = "";
  for (const l of s.cssRules) o += l.cssText;
  return Rf(o);
})(S) : S;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Cf, defineProperty: kf, getOwnPropertyDescriptor: Nf, getOwnPropertyNames: Ef, getOwnPropertySymbols: Tf, getPrototypeOf: Ff } = Object, fo = globalThis, sc = fo.trustedTypes, Af = sc ? sc.emptyScript : "", Dn = fo.reactiveElementPolyfillSupport, rs = (S, s) => S, On = { toAttribute(S, s) {
  switch (s) {
    case Boolean:
      S = S ? Af : null;
      break;
    case Object:
    case Array:
      S = S == null ? S : JSON.stringify(S);
  }
  return S;
}, fromAttribute(S, s) {
  let o = S;
  switch (s) {
    case Boolean:
      o = S !== null;
      break;
    case Number:
      o = S === null ? null : Number(S);
      break;
    case Object:
    case Array:
      try {
        o = JSON.parse(S);
      } catch {
        o = null;
      }
  }
  return o;
} }, gc = (S, s) => !Cf(S, s), ac = { attribute: !0, type: String, converter: On, reflect: !1, useDefault: !1, hasChanged: gc };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), fo.litPropertyMetadata ?? (fo.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let me = class extends HTMLElement {
  static addInitializer(s) {
    this._$Ei(), (this.l ?? (this.l = [])).push(s);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(s, o = ac) {
    if (o.state && (o.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(s) && ((o = Object.create(o)).wrapped = !0), this.elementProperties.set(s, o), !o.noAccessor) {
      const l = Symbol(), u = this.getPropertyDescriptor(s, l, o);
      u !== void 0 && kf(this.prototype, s, u);
    }
  }
  static getPropertyDescriptor(s, o, l) {
    const { get: u, set: x } = Nf(this.prototype, s) ?? { get() {
      return this[o];
    }, set(v) {
      this[o] = v;
    } };
    return { get: u, set(v) {
      const D = u == null ? void 0 : u.call(this);
      x == null || x.call(this, v), this.requestUpdate(s, D, l);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(s) {
    return this.elementProperties.get(s) ?? ac;
  }
  static _$Ei() {
    if (this.hasOwnProperty(rs("elementProperties"))) return;
    const s = Ff(this);
    s.finalize(), s.l !== void 0 && (this.l = [...s.l]), this.elementProperties = new Map(s.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(rs("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(rs("properties"))) {
      const o = this.properties, l = [...Ef(o), ...Tf(o)];
      for (const u of l) this.createProperty(u, o[u]);
    }
    const s = this[Symbol.metadata];
    if (s !== null) {
      const o = litPropertyMetadata.get(s);
      if (o !== void 0) for (const [l, u] of o) this.elementProperties.set(l, u);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [o, l] of this.elementProperties) {
      const u = this._$Eu(o, l);
      u !== void 0 && this._$Eh.set(u, o);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s) {
    const o = [];
    if (Array.isArray(s)) {
      const l = new Set(s.flat(1 / 0).reverse());
      for (const u of l) o.unshift(ec(u));
    } else s !== void 0 && o.push(ec(s));
    return o;
  }
  static _$Eu(s, o) {
    const l = o.attribute;
    return l === !1 ? void 0 : typeof l == "string" ? l : typeof s == "string" ? s.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var s;
    this._$ES = new Promise((o) => this.enableUpdating = o), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (s = this.constructor.l) == null || s.forEach((o) => o(this));
  }
  addController(s) {
    var o;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(s), this.renderRoot !== void 0 && this.isConnected && ((o = s.hostConnected) == null || o.call(s));
  }
  removeController(s) {
    var o;
    (o = this._$EO) == null || o.delete(s);
  }
  _$E_() {
    const s = /* @__PURE__ */ new Map(), o = this.constructor.elementProperties;
    for (const l of o.keys()) this.hasOwnProperty(l) && (s.set(l, this[l]), delete this[l]);
    s.size > 0 && (this._$Ep = s);
  }
  createRenderRoot() {
    const s = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Mf(s, this.constructor.elementStyles), s;
  }
  connectedCallback() {
    var s;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (s = this._$EO) == null || s.forEach((o) => {
      var l;
      return (l = o.hostConnected) == null ? void 0 : l.call(o);
    });
  }
  enableUpdating(s) {
  }
  disconnectedCallback() {
    var s;
    (s = this._$EO) == null || s.forEach((o) => {
      var l;
      return (l = o.hostDisconnected) == null ? void 0 : l.call(o);
    });
  }
  attributeChangedCallback(s, o, l) {
    this._$AK(s, l);
  }
  _$ET(s, o) {
    var x;
    const l = this.constructor.elementProperties.get(s), u = this.constructor._$Eu(s, l);
    if (u !== void 0 && l.reflect === !0) {
      const v = (((x = l.converter) == null ? void 0 : x.toAttribute) !== void 0 ? l.converter : On).toAttribute(o, l.type);
      this._$Em = s, v == null ? this.removeAttribute(u) : this.setAttribute(u, v), this._$Em = null;
    }
  }
  _$AK(s, o) {
    var x, v;
    const l = this.constructor, u = l._$Eh.get(s);
    if (u !== void 0 && this._$Em !== u) {
      const D = l.getPropertyOptions(u), T = typeof D.converter == "function" ? { fromAttribute: D.converter } : ((x = D.converter) == null ? void 0 : x.fromAttribute) !== void 0 ? D.converter : On;
      this._$Em = u;
      const U = T.fromAttribute(o, D.type);
      this[u] = U ?? ((v = this._$Ej) == null ? void 0 : v.get(u)) ?? U, this._$Em = null;
    }
  }
  requestUpdate(s, o, l, u = !1, x) {
    var v;
    if (s !== void 0) {
      const D = this.constructor;
      if (u === !1 && (x = this[s]), l ?? (l = D.getPropertyOptions(s)), !((l.hasChanged ?? gc)(x, o) || l.useDefault && l.reflect && x === ((v = this._$Ej) == null ? void 0 : v.get(s)) && !this.hasAttribute(D._$Eu(s, l)))) return;
      this.C(s, o, l);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(s, o, { useDefault: l, reflect: u, wrapped: x }, v) {
    l && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(s) && (this._$Ej.set(s, v ?? o ?? this[s]), x !== !0 || v !== void 0) || (this._$AL.has(s) || (this.hasUpdated || l || (o = void 0), this._$AL.set(s, o)), u === !0 && this._$Em !== s && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(s));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (o) {
      Promise.reject(o);
    }
    const s = this.scheduleUpdate();
    return s != null && await s, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var l;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [x, v] of this._$Ep) this[x] = v;
        this._$Ep = void 0;
      }
      const u = this.constructor.elementProperties;
      if (u.size > 0) for (const [x, v] of u) {
        const { wrapped: D } = v, T = this[x];
        D !== !0 || this._$AL.has(x) || T === void 0 || this.C(x, void 0, v, T);
      }
    }
    let s = !1;
    const o = this._$AL;
    try {
      s = this.shouldUpdate(o), s ? (this.willUpdate(o), (l = this._$EO) == null || l.forEach((u) => {
        var x;
        return (x = u.hostUpdate) == null ? void 0 : x.call(u);
      }), this.update(o)) : this._$EM();
    } catch (u) {
      throw s = !1, this._$EM(), u;
    }
    s && this._$AE(o);
  }
  willUpdate(s) {
  }
  _$AE(s) {
    var o;
    (o = this._$EO) == null || o.forEach((l) => {
      var u;
      return (u = l.hostUpdated) == null ? void 0 : u.call(l);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(s)), this.updated(s);
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
  shouldUpdate(s) {
    return !0;
  }
  update(s) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((o) => this._$ET(o, this[o]))), this._$EM();
  }
  updated(s) {
  }
  firstUpdated(s) {
  }
};
me.elementStyles = [], me.shadowRootOptions = { mode: "open" }, me[rs("elementProperties")] = /* @__PURE__ */ new Map(), me[rs("finalized")] = /* @__PURE__ */ new Map(), Dn == null || Dn({ ReactiveElement: me }), (fo.reactiveElementVersions ?? (fo.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const cs = globalThis, nc = (S) => S, _a = cs.trustedTypes, ic = _a ? _a.createPolicy("lit-html", { createHTML: (S) => S }) : void 0, yc = "$lit$", uo = `lit$${Math.random().toFixed(9).slice(2)}$`, $c = "?" + uo, Bf = `<${$c}>`, Oo = document, ls = () => Oo.createComment(""), hs = (S) => S === null || typeof S != "object" && typeof S != "function", Un = Array.isArray, Df = (S) => Un(S) || typeof (S == null ? void 0 : S[Symbol.iterator]) == "function", Pn = `[ 	
\f\r]`, is = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rc = /-->/g, cc = />/g, Do = RegExp(`>|${Pn}(?:([^\\s"'>=/]+)(${Pn}*=${Pn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), lc = /'/g, hc = /"/g, _c = /^(?:script|style|textarea|title)$/i, Pf = (S) => (s, ...o) => ({ _$litType$: S, strings: s, values: o }), Po = Pf(1), Wo = Symbol.for("lit-noChange"), at = Symbol.for("lit-nothing"), uc = /* @__PURE__ */ new WeakMap(), zo = Oo.createTreeWalker(Oo, 129);
function vc(S, s) {
  if (!Un(S) || !S.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ic !== void 0 ? ic.createHTML(s) : s;
}
const zf = (S, s) => {
  const o = S.length - 1, l = [];
  let u, x = s === 2 ? "<svg>" : s === 3 ? "<math>" : "", v = is;
  for (let D = 0; D < o; D++) {
    const T = S[D];
    let U, Y, z = -1, J = 0;
    for (; J < T.length && (v.lastIndex = J, Y = v.exec(T), Y !== null); ) J = v.lastIndex, v === is ? Y[1] === "!--" ? v = rc : Y[1] !== void 0 ? v = cc : Y[2] !== void 0 ? (_c.test(Y[2]) && (u = RegExp("</" + Y[2], "g")), v = Do) : Y[3] !== void 0 && (v = Do) : v === Do ? Y[0] === ">" ? (v = u ?? is, z = -1) : Y[1] === void 0 ? z = -2 : (z = v.lastIndex - Y[2].length, U = Y[1], v = Y[3] === void 0 ? Do : Y[3] === '"' ? hc : lc) : v === hc || v === lc ? v = Do : v === rc || v === cc ? v = is : (v = Do, u = void 0);
    const k = v === Do && S[D + 1].startsWith("/>") ? " " : "";
    x += v === is ? T + Bf : z >= 0 ? (l.push(U), T.slice(0, z) + yc + T.slice(z) + uo + k) : T + uo + (z === -2 ? D : k);
  }
  return [vc(S, x + (S[o] || "<?>") + (s === 2 ? "</svg>" : s === 3 ? "</math>" : "")), l];
};
class us {
  constructor({ strings: s, _$litType$: o }, l) {
    let u;
    this.parts = [];
    let x = 0, v = 0;
    const D = s.length - 1, T = this.parts, [U, Y] = zf(s, o);
    if (this.el = us.createElement(U, l), zo.currentNode = this.el.content, o === 2 || o === 3) {
      const z = this.el.content.firstChild;
      z.replaceWith(...z.childNodes);
    }
    for (; (u = zo.nextNode()) !== null && T.length < D; ) {
      if (u.nodeType === 1) {
        if (u.hasAttributes()) for (const z of u.getAttributeNames()) if (z.endsWith(yc)) {
          const J = Y[v++], k = u.getAttribute(z).split(uo), I = /([.?@])?(.*)/.exec(J);
          T.push({ type: 1, index: x, name: I[2], strings: k, ctor: I[1] === "." ? Of : I[1] === "?" ? Wf : I[1] === "@" ? If : Sa }), u.removeAttribute(z);
        } else z.startsWith(uo) && (T.push({ type: 6, index: x }), u.removeAttribute(z));
        if (_c.test(u.tagName)) {
          const z = u.textContent.split(uo), J = z.length - 1;
          if (J > 0) {
            u.textContent = _a ? _a.emptyScript : "";
            for (let k = 0; k < J; k++) u.append(z[k], ls()), zo.nextNode(), T.push({ type: 2, index: ++x });
            u.append(z[J], ls());
          }
        }
      } else if (u.nodeType === 8) if (u.data === $c) T.push({ type: 2, index: x });
      else {
        let z = -1;
        for (; (z = u.data.indexOf(uo, z + 1)) !== -1; ) T.push({ type: 7, index: x }), z += uo.length - 1;
      }
      x++;
    }
  }
  static createElement(s, o) {
    const l = Oo.createElement("template");
    return l.innerHTML = s, l;
  }
}
function ge(S, s, o = S, l) {
  var v, D;
  if (s === Wo) return s;
  let u = l !== void 0 ? (v = o._$Co) == null ? void 0 : v[l] : o._$Cl;
  const x = hs(s) ? void 0 : s._$litDirective$;
  return (u == null ? void 0 : u.constructor) !== x && ((D = u == null ? void 0 : u._$AO) == null || D.call(u, !1), x === void 0 ? u = void 0 : (u = new x(S), u._$AT(S, o, l)), l !== void 0 ? (o._$Co ?? (o._$Co = []))[l] = u : o._$Cl = u), u !== void 0 && (s = ge(S, u._$AS(S, s.values), u, l)), s;
}
class Lf {
  constructor(s, o) {
    this._$AV = [], this._$AN = void 0, this._$AD = s, this._$AM = o;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(s) {
    const { el: { content: o }, parts: l } = this._$AD, u = ((s == null ? void 0 : s.creationScope) ?? Oo).importNode(o, !0);
    zo.currentNode = u;
    let x = zo.nextNode(), v = 0, D = 0, T = l[0];
    for (; T !== void 0; ) {
      if (v === T.index) {
        let U;
        T.type === 2 ? U = new fs(x, x.nextSibling, this, s) : T.type === 1 ? U = new T.ctor(x, T.name, T.strings, this, s) : T.type === 6 && (U = new Vf(x, this, s)), this._$AV.push(U), T = l[++D];
      }
      v !== (T == null ? void 0 : T.index) && (x = zo.nextNode(), v++);
    }
    return zo.currentNode = Oo, u;
  }
  p(s) {
    let o = 0;
    for (const l of this._$AV) l !== void 0 && (l.strings !== void 0 ? (l._$AI(s, l, o), o += l.strings.length - 2) : l._$AI(s[o])), o++;
  }
}
class fs {
  get _$AU() {
    var s;
    return ((s = this._$AM) == null ? void 0 : s._$AU) ?? this._$Cv;
  }
  constructor(s, o, l, u) {
    this.type = 2, this._$AH = at, this._$AN = void 0, this._$AA = s, this._$AB = o, this._$AM = l, this.options = u, this._$Cv = (u == null ? void 0 : u.isConnected) ?? !0;
  }
  get parentNode() {
    let s = this._$AA.parentNode;
    const o = this._$AM;
    return o !== void 0 && (s == null ? void 0 : s.nodeType) === 11 && (s = o.parentNode), s;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(s, o = this) {
    s = ge(this, s, o), hs(s) ? s === at || s == null || s === "" ? (this._$AH !== at && this._$AR(), this._$AH = at) : s !== this._$AH && s !== Wo && this._(s) : s._$litType$ !== void 0 ? this.$(s) : s.nodeType !== void 0 ? this.T(s) : Df(s) ? this.k(s) : this._(s);
  }
  O(s) {
    return this._$AA.parentNode.insertBefore(s, this._$AB);
  }
  T(s) {
    this._$AH !== s && (this._$AR(), this._$AH = this.O(s));
  }
  _(s) {
    this._$AH !== at && hs(this._$AH) ? this._$AA.nextSibling.data = s : this.T(Oo.createTextNode(s)), this._$AH = s;
  }
  $(s) {
    var x;
    const { values: o, _$litType$: l } = s, u = typeof l == "number" ? this._$AC(s) : (l.el === void 0 && (l.el = us.createElement(vc(l.h, l.h[0]), this.options)), l);
    if (((x = this._$AH) == null ? void 0 : x._$AD) === u) this._$AH.p(o);
    else {
      const v = new Lf(u, this), D = v.u(this.options);
      v.p(o), this.T(D), this._$AH = v;
    }
  }
  _$AC(s) {
    let o = uc.get(s.strings);
    return o === void 0 && uc.set(s.strings, o = new us(s)), o;
  }
  k(s) {
    Un(this._$AH) || (this._$AH = [], this._$AR());
    const o = this._$AH;
    let l, u = 0;
    for (const x of s) u === o.length ? o.push(l = new fs(this.O(ls()), this.O(ls()), this, this.options)) : l = o[u], l._$AI(x), u++;
    u < o.length && (this._$AR(l && l._$AB.nextSibling, u), o.length = u);
  }
  _$AR(s = this._$AA.nextSibling, o) {
    var l;
    for ((l = this._$AP) == null ? void 0 : l.call(this, !1, !0, o); s !== this._$AB; ) {
      const u = nc(s).nextSibling;
      nc(s).remove(), s = u;
    }
  }
  setConnected(s) {
    var o;
    this._$AM === void 0 && (this._$Cv = s, (o = this._$AP) == null || o.call(this, s));
  }
}
class Sa {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(s, o, l, u, x) {
    this.type = 1, this._$AH = at, this._$AN = void 0, this.element = s, this.name = o, this._$AM = u, this.options = x, l.length > 2 || l[0] !== "" || l[1] !== "" ? (this._$AH = Array(l.length - 1).fill(new String()), this.strings = l) : this._$AH = at;
  }
  _$AI(s, o = this, l, u) {
    const x = this.strings;
    let v = !1;
    if (x === void 0) s = ge(this, s, o, 0), v = !hs(s) || s !== this._$AH && s !== Wo, v && (this._$AH = s);
    else {
      const D = s;
      let T, U;
      for (s = x[0], T = 0; T < x.length - 1; T++) U = ge(this, D[l + T], o, T), U === Wo && (U = this._$AH[T]), v || (v = !hs(U) || U !== this._$AH[T]), U === at ? s = at : s !== at && (s += (U ?? "") + x[T + 1]), this._$AH[T] = U;
    }
    v && !u && this.j(s);
  }
  j(s) {
    s === at ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, s ?? "");
  }
}
class Of extends Sa {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(s) {
    this.element[this.name] = s === at ? void 0 : s;
  }
}
class Wf extends Sa {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(s) {
    this.element.toggleAttribute(this.name, !!s && s !== at);
  }
}
class If extends Sa {
  constructor(s, o, l, u, x) {
    super(s, o, l, u, x), this.type = 5;
  }
  _$AI(s, o = this) {
    if ((s = ge(this, s, o, 0) ?? at) === Wo) return;
    const l = this._$AH, u = s === at && l !== at || s.capture !== l.capture || s.once !== l.once || s.passive !== l.passive, x = s !== at && (l === at || u);
    u && this.element.removeEventListener(this.name, this, l), x && this.element.addEventListener(this.name, this, s), this._$AH = s;
  }
  handleEvent(s) {
    var o;
    typeof this._$AH == "function" ? this._$AH.call(((o = this.options) == null ? void 0 : o.host) ?? this.element, s) : this._$AH.handleEvent(s);
  }
}
class Vf {
  constructor(s, o, l) {
    this.element = s, this.type = 6, this._$AN = void 0, this._$AM = o, this.options = l;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(s) {
    ge(this, s);
  }
}
const zn = cs.litHtmlPolyfillSupport;
zn == null || zn(us, fs), (cs.litHtmlVersions ?? (cs.litHtmlVersions = [])).push("3.3.2");
const Hf = (S, s, o) => {
  const l = (o == null ? void 0 : o.renderBefore) ?? s;
  let u = l._$litPart$;
  if (u === void 0) {
    const x = (o == null ? void 0 : o.renderBefore) ?? null;
    l._$litPart$ = u = new fs(s.insertBefore(ls(), x), x, void 0, o ?? {});
  }
  return u._$AI(S), u;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lo = globalThis;
let be = class extends me {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var o;
    const s = super.createRenderRoot();
    return (o = this.renderOptions).renderBefore ?? (o.renderBefore = s.firstChild), s;
  }
  update(s) {
    const o = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(s), this._$Do = Hf(o, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var s;
    super.connectedCallback(), (s = this._$Do) == null || s.setConnected(!0);
  }
  disconnectedCallback() {
    var s;
    super.disconnectedCallback(), (s = this._$Do) == null || s.setConnected(!1);
  }
  render() {
    return Wo;
  }
};
var pc;
be._$litElement$ = !0, be.finalized = !0, (pc = Lo.litElementHydrateSupport) == null || pc.call(Lo, { LitElement: be });
const Ln = Lo.litElementPolyfillSupport;
Ln == null || Ln({ LitElement: be });
(Lo.litElementVersions ?? (Lo.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gf = { CHILD: 2 }, Uf = (S) => (...s) => ({ _$litDirective$: S, values: s });
class jf {
  constructor(s) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(s, o, l) {
    this._$Ct = s, this._$AM = o, this._$Ci = l;
  }
  _$AS(s, o) {
    return this.update(s, o);
  }
  update(s, o) {
    return this.render(...o);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class Wn extends jf {
  constructor(s) {
    if (super(s), this.it = at, s.type !== Gf.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(s) {
    if (s === at || s == null) return this._t = void 0, this.it = s;
    if (s === Wo) return s;
    if (typeof s != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (s === this.it) return this._t;
    this.it = s;
    const o = [s];
    return o.raw = o, this._t = { _$litType$: this.constructor.resultType, strings: o, values: [] };
  }
}
Wn.directiveName = "unsafeHTML", Wn.resultType = 1;
const qf = Uf(Wn), jn = class jn extends be {
  constructor() {
    super(...arguments), this._config = {};
  }
  setConfig(s) {
    this._config = s || {};
  }
  set hass(s) {
    this._hass = s, this.requestUpdate();
  }
  _setConfigValue(s, o) {
    if (!this._config) return;
    const l = { ...this._config };
    o === "" || o === void 0 || o === null ? delete l[s] : l[s] = o, this._config = l, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: l },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _valueChanged(s) {
    var x;
    const o = s.target, l = o == null ? void 0 : o.configValue;
    if (!l) return;
    let u = ((x = s.detail) == null ? void 0 : x.value) ?? o.value;
    if (o.checked !== void 0 && (u = o.checked), o.type === "number") {
      const v = Number(u);
      Number.isNaN(v) || (u = v);
    }
    this._setConfigValue(l, u);
  }
  _setNumberEntityValue(s, o) {
    !this._hass || !s || this._hass.callService("number", "set_value", { entity_id: s, value: o });
  }
  _setSelectEntityOption(s, o) {
    !this._hass || !s || !o || this._hass.callService("select", "select_option", { entity_id: s, option: o });
  }
  _setIntegrationOptions(s) {
    this._hass && this._hass.callService("sunlight_visualizer", "set_options", s);
  }
  render() {
    var Bt, bo, Nt, dt, Ht, xt, Dt, go, Et, Gt, yo, nt, it, ht, Uo, ds, ps, ms, bs, gs, $e, _e, xa, ve, ys, jo, oo, eo, qo, Pt, et, $s, _s, $o, so, V, Yo, Xo, vs, Ss, _o, wt, xs, ws, Rs, Se, xe, we, Re, Zo, Me, Ce, Ms, Cs, ks, Ns, Es, ke, Ts, Fs, Ne, As, Bs, Ko, Ds, Ps, Ee, Te, Fe, Ae, Be, vo, So, De, ao, no, Pe, zs, Ls, Os, Ws, Is, Vs;
    if (!this._hass) return Po``;
    const s = this._config || {}, o = s.siSourceAttr ?? "sunlight_visualizer_source", l = s.siSourceValue ?? "sunlight_visualizer", u = Object.entries(this._hass.states ?? {}).filter(
      ([, N]) => {
        var B;
        return ((B = N == null ? void 0 : N.attributes) == null ? void 0 : B[o]) === l;
      }
    ), x = (N) => {
      for (const [B, q] of u)
        if (N(q, B)) return B;
      return null;
    }, v = (N) => x((B) => {
      var q;
      return ((q = B == null ? void 0 : B.attributes) == null ? void 0 : q.camera_rotation) === N;
    }), D = (N) => x((B) => {
      var q;
      return ((q = B == null ? void 0 : B.attributes) == null ? void 0 : q.si_setting) === N;
    }), T = s.rotationHEntity ?? v("h") ?? "", U = s.rotationVEntity ?? v("v") ?? "", Y = s.houseAngleEntity ?? D("house_angle") ?? "", z = D("ceiling_tilt") ?? "", J = D("house_direction") ?? "", k = D("roof_direction") ?? "", I = (N, B = !1) => {
      if (N == null || N === "") return B;
      if (typeof N == "boolean") return N;
      if (typeof N == "number") return N !== 0;
      if (typeof N == "string") {
        const q = N.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(q)) return !0;
        if (["false", "0", "no", "off"].includes(q)) return !1;
      }
      return B;
    };
    let ft = "", Ct, kt;
    for (const [, N] of u)
      !ft && ((Bt = N == null ? void 0 : N.attributes) != null && Bt.roof_power_entity) && (ft = N.attributes.roof_power_entity), Ct === void 0 && ((bo = N == null ? void 0 : N.attributes) == null ? void 0 : bo.roof_power_enabled) !== void 0 && (Ct = N.attributes.roof_power_enabled), kt === void 0 && ((Nt = N == null ? void 0 : N.attributes) == null ? void 0 : Nt.roof_power_invert) !== void 0 && (kt = N.attributes.roof_power_invert);
    const At = s.preferIntegrationSettings ?? !0, K = u.length > 0, tt = At ? ft || s.roofPowerEntity || "" : s.roofPowerEntity || ft || "", Kt = At ? I(Ct, I(s.roofPowerEnabled, !1)) : I(s.roofPowerEnabled, I(Ct, !1)), Qt = At ? I(kt, I(s.roofPowerInvert, !1)) : I(s.roofPowerInvert, I(kt, !1)), $t = Number((xt = (Ht = (dt = u.find(([, N]) => {
      var B;
      return ((B = N == null ? void 0 : N.attributes) == null ? void 0 : B.auto_rotate_speed) != null;
    })) == null ? void 0 : dt[1]) == null ? void 0 : Ht.attributes) == null ? void 0 : xt.auto_rotate_speed), ot = At && Number.isFinite($t) ? $t : Number(s.autoRotateSpeed ?? (Number.isFinite($t) ? $t : 10));
    Number(((Et = (go = (Dt = this._hass) == null ? void 0 : Dt.states) == null ? void 0 : go[Y]) == null ? void 0 : Et.state) ?? s.houseAngle ?? 0);
    const Vt = ["North", "NE", "East", "SE", "South", "SW", "West", "NW", "Custom"], po = ["front", "back", "left", "right"], Jt = !!J, to = !!k, Io = Jt ? ((it = (nt = (yo = (Gt = this._hass) == null ? void 0 : Gt.states) == null ? void 0 : yo[J]) == null ? void 0 : nt.attributes) == null ? void 0 : it.options) ?? Vt : Vt, ye = to ? ((ps = (ds = (Uo = (ht = this._hass) == null ? void 0 : ht.states) == null ? void 0 : Uo[k]) == null ? void 0 : ds.attributes) == null ? void 0 : ps.options) ?? po : po, Vo = Jt ? ((gs = (bs = (ms = this._hass) == null ? void 0 : ms.states) == null ? void 0 : bs[J]) == null ? void 0 : gs.state) ?? "Custom" : s.houseDirection ?? "Custom", Ho = to ? ((xa = (_e = ($e = this._hass) == null ? void 0 : $e.states) == null ? void 0 : _e[k]) == null ? void 0 : xa.state) ?? "front" : s.roofTiltFace ?? "front", Go = !!T, Q = !!U, mo = !!z;
    return Po`
      <div class="section">
        <div class="title">Size</div>
        <div class="row">
          <ha-textfield
            label="Card width (px)"
            type="number"
            .value=${String(s.cardWidth ?? 450)}
            .configValue=${"cardWidth"}
            @change=${this._valueChanged}
          ></ha-textfield>
          <ha-textfield
            label="Card height (px)"
            type="number"
            .value=${String(s.cardHeight ?? 450)}
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
              .value=${Number(((jo = (ys = (ve = this._hass) == null ? void 0 : ve.states) == null ? void 0 : ys[Y]) == null ? void 0 : jo.state) ?? 0)}
              .min=${Number(((Pt = (qo = (eo = (oo = this._hass) == null ? void 0 : oo.states) == null ? void 0 : eo[Y]) == null ? void 0 : qo.attributes) == null ? void 0 : Pt.min) ?? 0)}
              .max=${Number((($o = (_s = ($s = (et = this._hass) == null ? void 0 : et.states) == null ? void 0 : $s[Y]) == null ? void 0 : _s.attributes) == null ? void 0 : $o.max) ?? 359)}
              .step=${Number(((Xo = (Yo = (V = (so = this._hass) == null ? void 0 : so.states) == null ? void 0 : V[Y]) == null ? void 0 : Yo.attributes) == null ? void 0 : Xo.step) ?? 1)}
              @change=${(N) => {
      var B;
      return this._setNumberEntityValue(Y, Number(((B = N.target) == null ? void 0 : B.value) ?? 0));
    }}
              .disabled=${!Y}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"House direction"}
              .selector=${{ select: { options: Io, mode: "dropdown" } }}
              .value=${Vo}
              @value-changed=${(N) => {
      var q;
      const B = ((q = N.detail) == null ? void 0 : q.value) ?? Vo;
      Jt ? (this._setSelectEntityOption(J, B), this._setConfigValue("houseDirection", void 0)) : this._setConfigValue("houseDirection", B);
    }}
            ></ha-selector>
            <div class="helper">Quick preset for the house front orientation</div>
          </div>
        </div>
        <div class="row">
          <div>
            <div class="slider-label">Ceiling tilt</div>
            <ha-slider
              .value=${Number(((_o = (Ss = (vs = this._hass) == null ? void 0 : vs.states) == null ? void 0 : Ss[z]) == null ? void 0 : _o.state) ?? 0)}
              .min=${Number(((Rs = (ws = (xs = (wt = this._hass) == null ? void 0 : wt.states) == null ? void 0 : xs[z]) == null ? void 0 : ws.attributes) == null ? void 0 : Rs.min) ?? 0)}
              .max=${Number(((Re = (we = (xe = (Se = this._hass) == null ? void 0 : Se.states) == null ? void 0 : xe[z]) == null ? void 0 : we.attributes) == null ? void 0 : Re.max) ?? 90)}
              .step=${Number(((Ms = (Ce = (Me = (Zo = this._hass) == null ? void 0 : Zo.states) == null ? void 0 : Me[z]) == null ? void 0 : Ce.attributes) == null ? void 0 : Ms.step) ?? 1)}
              @change=${(N) => {
      var B;
      return this._setNumberEntityValue(z, Number(((B = N.target) == null ? void 0 : B.value) ?? 0));
    }}
              .disabled=${!mo}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"Roof direction"}
              .selector=${{ select: { options: ye, mode: "dropdown" } }}
              .value=${Ho}
              @value-changed=${(N) => {
      var q;
      const B = ((q = N.detail) == null ? void 0 : q.value) ?? Ho;
      to ? (this._setSelectEntityOption(k, B), this._setConfigValue("roofTiltFace", void 0)) : this._setConfigValue("roofTiltFace", B);
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
              .value=${Number(((Ns = (ks = (Cs = this._hass) == null ? void 0 : Cs.states) == null ? void 0 : ks[T]) == null ? void 0 : Ns.state) ?? 0)}
              .min=${Number(((Fs = (Ts = (ke = (Es = this._hass) == null ? void 0 : Es.states) == null ? void 0 : ke[T]) == null ? void 0 : Ts.attributes) == null ? void 0 : Fs.min) ?? 0)}
              .max=${Number(((Ko = (Bs = (As = (Ne = this._hass) == null ? void 0 : Ne.states) == null ? void 0 : As[T]) == null ? void 0 : Bs.attributes) == null ? void 0 : Ko.max) ?? 359)}
              .step=${Number(((Te = (Ee = (Ps = (Ds = this._hass) == null ? void 0 : Ds.states) == null ? void 0 : Ps[T]) == null ? void 0 : Ee.attributes) == null ? void 0 : Te.step) ?? 1)}
              @change=${(N) => {
      var B;
      return this._setNumberEntityValue(T, Number(((B = N.target) == null ? void 0 : B.value) ?? 0));
    }}
              .disabled=${!Go}
            ></ha-slider>
          </div>
          <div>
            <div class="slider-label">Camera rotation V</div>
            <ha-slider
              .value=${Number(((Be = (Ae = (Fe = this._hass) == null ? void 0 : Fe.states) == null ? void 0 : Ae[U]) == null ? void 0 : Be.state) ?? 0)}
              .min=${Number(((ao = (De = (So = (vo = this._hass) == null ? void 0 : vo.states) == null ? void 0 : So[U]) == null ? void 0 : De.attributes) == null ? void 0 : ao.min) ?? 0)}
              .max=${Number(((Ls = (zs = (Pe = (no = this._hass) == null ? void 0 : no.states) == null ? void 0 : Pe[U]) == null ? void 0 : zs.attributes) == null ? void 0 : Ls.max) ?? 90)}
              .step=${Number(((Vs = (Is = (Ws = (Os = this._hass) == null ? void 0 : Os.states) == null ? void 0 : Ws[U]) == null ? void 0 : Is.attributes) == null ? void 0 : Vs.step) ?? 1)}
              @change=${(N) => {
      var B;
      return this._setNumberEntityValue(U, Number(((B = N.target) == null ? void 0 : B.value) ?? 0));
    }}
              .disabled=${!Q}
            ></ha-slider>
          </div>
        </div>
        <div class="row">
          <div>${T || "Camera rotation H not found"}</div>
          <div>${U || "Camera rotation V not found"}</div>
        </div>
      </div>

      <div class="section">
        <div class="title">Roof power</div>
        <div class="row single">
          <ha-selector
            .hass=${this._hass}
            .selector=${{ entity: { domain: ["sensor", "number", "input_number"] } }}
            .value=${tt}
            @value-changed=${(N) => {
      var q;
      const B = (q = N.detail) == null ? void 0 : q.value;
      K ? (this._setIntegrationOptions({ roof_power_entity: B || null }), this._setConfigValue("roofPowerEntity", void 0)) : this._setConfigValue("roofPowerEntity", B);
    }}
          ></ha-selector>
        </div>
        <div class="row single">
          <div class="switch-row">
            <span>Enable power label</span>
            <ha-switch
              .checked=${Kt ?? !1}
              @change=${(N) => {
      var q;
      const B = !!((q = N.target) != null && q.checked);
      K ? (this._setIntegrationOptions({ roof_power_enabled: B }), this._setConfigValue("roofPowerEnabled", void 0)) : this._setConfigValue("roofPowerEnabled", B);
    }}
            ></ha-switch>
          </div>
          <div class="switch-row">
            <span>Invert power value</span>
            <ha-switch
              .checked=${Qt ?? !1}
              @change=${(N) => {
      var q;
      const B = !!((q = N.target) != null && q.checked);
      K ? (this._setIntegrationOptions({ roof_power_invert: B }), this._setConfigValue("roofPowerInvert", void 0)) : this._setConfigValue("roofPowerInvert", B);
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
            .value=${String(ot)}
            min="1"
            max="90"
            step="1"
            .configValue=${"autoRotateSpeed"}
            @change=${(N) => {
      var Hs, Gs;
      const B = ((Hs = N == null ? void 0 : N.detail) == null ? void 0 : Hs.value) ?? ((Gs = N == null ? void 0 : N.target) == null ? void 0 : Gs.value);
      let q = Math.round(Number(B));
      Number.isNaN(q) || (q = Math.min(90, Math.max(1, q)), K ? (this._setIntegrationOptions({ auto_rotate_speed: q }), this._setConfigValue("autoRotateSpeed", void 0)) : this._setConfigValue("autoRotateSpeed", q));
    }}
          ></ha-textfield>
          <ha-textfield
            label="CSS-limit rotation start boost"
            type="number"
            .value=${String(s.cssFpsRotationStartBoost ?? 2)}
            min="1"
            max="5"
            step="0.1"
            .configValue=${"cssFpsRotationStartBoost"}
            @change=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="helper">Used when CSS limit is active: rotation starts at (CSS FPS limit × boost).</div>
      </div>
    `;
  }
};
jn.styles = bc`
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
let In = jn;
const fc = "sunlight-visualizer-card-editor";
if (!customElements.get(fc))
  try {
    customElements.define(fc, In);
  } catch {
  }
const qn = class qn extends be {
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
  setConfig(s) {
    this._config = s || {};
  }
  set hass(s) {
    this._hass = s, this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null), this._manualRotateTimer && (clearInterval(this._manualRotateTimer), this._manualRotateTimer = null), this._cssFpsRaf && (cancelAnimationFrame(this._cssFpsRaf), this._cssFpsRaf = null), this._cssFpsCalibRaf && (cancelAnimationFrame(this._cssFpsCalibRaf), this._cssFpsCalibRaf = null), this._cssGlobalTickTimer && (clearInterval(this._cssGlobalTickTimer), this._cssGlobalTickTimer = null, this._cssGlobalTickFps = 0);
  }
  getCardSize() {
    return 4;
  }
  _stopManualRotate() {
    const s = !!this._manualRotateEnabled;
    this._manualRotateTimer && (clearInterval(this._manualRotateTimer), this._manualRotateTimer = null), this._manualRotateEnabled = !1, this._manualRotateAxis = null, this._manualRotateDir = 0, this._manualRotateAccumDeg = 0, this._manualRotateTargetDeg = 0, this._manualRotateLastTick = 0, this._manualRotateIntervalMs = 0, s && (this._cssRecalibrateRequested = !0), this.requestUpdate();
  }
  _startManualRotate(s, o) {
    const l = () => typeof performance < "u" && performance.now ? performance.now() : Date.now(), u = Number(this._autoRotateSpeed || 10), x = Number(this._rotationIntervalMsFloor || this._autoRotateIntervalMs || 50), v = Math.max(1, Number(this._autoRotateTurnCount || 1));
    this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate(), this._manualRotateEnabled = !0, this._manualRotateAxis = s, this._manualRotateDir = o, this._manualRotateAccumDeg = 0, this._manualRotateTargetDeg = s === "h" ? 360 * v : 0, this._manualRotateLastTick = l(), this._manualRotateIntervalMs = x, this._manualRotateVOffsetDeg || (this._manualRotateVOffsetDeg = 0), this._manualRotateTimer = setInterval(() => {
      const D = l(), T = this._manualRotateLastTick || D, U = Math.max(0, D - T) / 1e3;
      if (this._manualRotateLastTick = D, !this._manualRotateEnabled) return;
      const Y = this._manualRotateAxis === "v" ? 0.5 : 1, z = u * Y * U * (this._manualRotateDir || 1);
      if (this._manualRotateAxis === "h") {
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + z, this._manualRotateAccumDeg = (this._manualRotateAccumDeg || 0) + Math.abs(z), this._manualRotateAccumDeg >= (this._manualRotateTargetDeg || 360)) {
          this._stopManualRotate();
          return;
        }
      } else if (this._manualRotateAxis === "v") {
        const J = Number(this._manualRotateBaseVDeg ?? 35), k = Number(this._manualRotateVOffsetDeg || 0), I = Math.min(90, Math.max(0, J + k)), ft = Math.min(90, Math.max(0, I + z));
        if (this._manualRotateVOffsetDeg = k + (ft - I), this._manualRotateAccumDeg = (this._manualRotateAccumDeg || 0) + Math.abs(ft - I), ft <= 1e-3 || ft >= 89.999) {
          this._stopManualRotate();
          return;
        }
      }
      this._updateTimerMS = Date.now(), this.requestUpdate();
    }, x), this.requestUpdate();
  }
  _handleControlTap(s, o, l) {
    if (l.preventDefault(), l.stopPropagation(), s === "h" ? !!(this._autoRotateEnabled || this._manualRotateEnabled && this._manualRotateAxis === "h") : !!(this._manualRotateEnabled && this._manualRotateAxis === "v")) {
      this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate();
      return;
    }
    this._startManualRotate(s, o);
  }
  _normDeg(s) {
    const o = s % 360;
    return o < 0 ? o + 360 : o;
  }
  _degDiffAbs(s, o) {
    const l = (s - o + 540) % 360 - 180;
    return Math.abs(l);
  }
  async _setNumericEntityValue(s, o) {
    var u;
    if (!s || !((u = this._hass) != null && u.callService)) return;
    const l = s.split(".")[0];
    if (l)
      try {
        await this._hass.callService(l, "set_value", { entity_id: s, value: o });
      } catch {
      }
  }
  async _saveCurrentCamera(s) {
    s.preventDefault(), s.stopPropagation(), this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate();
    const o = Number(this._currentCameraH ?? 0), l = Number(this._currentCameraV ?? 35), u = this._rotationHEntity, x = this._rotationVEntity;
    this._cameraSavedBaseHOverride = this._normDeg(o), this._cameraSavedBaseVOverride = Math.max(0, Math.min(90, l)), this._autoRotateOffsetDeg = 0, this._manualRotateVOffsetDeg = 0, await this._setNumericEntityValue(u, this._normDeg(o)), await this._setNumericEntityValue(x, Math.max(0, Math.min(90, l))), this.requestUpdate();
  }
  _restoreSavedCamera(s) {
    s.preventDefault(), s.stopPropagation(), this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate(), this._autoRotateOffsetDeg = 0, this._manualRotateVOffsetDeg = 0, this.requestUpdate();
  }
  render() {
    if (!this._hass)
      return Po`<ha-card></ha-card>`;
    const s = this._config || {}, o = Number(s.cardWidth ?? 450), l = Number(s.cardHeight ?? 450), u = Math.min(o, l), x = this.renderSvg(), v = !!(this._autoRotateEnabled || this._manualRotateEnabled && this._manualRotateAxis === "h"), D = !!(this._manualRotateEnabled && this._manualRotateAxis === "v"), T = this._normDeg(Number(this._currentCameraH ?? 0)), U = Math.max(0, Math.min(90, Number(this._currentCameraV ?? 35))), Y = this._normDeg(Number(this._savedCameraH ?? T)), z = Math.max(0, Math.min(90, Number(this._savedCameraV ?? U))), J = this._degDiffAbs(T, Y) > 0.25 || Math.abs(U - z) > 0.25, k = u < 400, I = 43, ft = 10, Ct = 10, kt = (Q, mo, Bt) => Math.max(mo, Math.min(Bt, Q));
    let At = !0, K = !0, tt, Kt, Qt, $t, ot, Vt;
    if (k) {
      const Bt = ft + I + 8 + I + 4, bo = o - (u < 260 ? 4 : 10), Nt = Math.max(0, bo - Bt), dt = u < 260 ? 2 : 8, Ht = 18;
      if (At = u >= 300 && Nt >= I * 3 + dt * 2, At) {
        const nt = kt((Nt - I * 3) / 2, dt, Ht), it = I * 3 + nt * 2, ht = Bt + Math.max(0, (Nt - it) / 2);
        tt = ht, Qt = ht + I + nt, Kt = Qt + I + nt;
      } else {
        const nt = kt(Nt - I * 2, dt, Ht), it = I * 2 + nt, ht = Bt + Math.max(0, (Nt - it) / 2);
        tt = ht, Kt = ht + I + nt;
      }
      const xt = l - Ct - I, Dt = u < 260 ? 46 : 34, go = xt - 8, Et = Math.max(0, go - Dt), Gt = u < 260 ? 2 : 6, yo = u < 260 ? 10 : 24;
      if (K = u >= 300 && Et >= I * 3 + Gt * 2, K) {
        const nt = kt((Et - I * 3) / 2, Gt, yo), it = I * 3 + nt * 2, ht = Dt + Math.max(0, (Et - it) / 2);
        $t = ht, Vt = ht + I + nt, ot = Vt + I + nt;
      } else {
        const nt = kt(Et - I * 2, Gt, 16), it = I * 2 + nt, ht = Dt + Math.max(0, (Et - it) / 2);
        $t = ht, ot = ht + I + nt;
      }
    }
    const po = k && Qt != null ? Qt + I * 0.5 : void 0, Jt = k && Vt != null ? Vt + I * 0.5 : void 0, to = k && tt != null ? `left:${tt.toFixed(1)}px; bottom:${Ct}px;` : "", Io = k && Kt != null ? `left:${Kt.toFixed(1)}px; bottom:${Ct}px;` : "", ye = k && po != null ? `left:${po.toFixed(1)}px; bottom:${Ct}px;` : "", Vo = k && $t != null ? `left:${ft}px; top:${$t.toFixed(1)}px;` : "", Ho = k && ot != null ? `left:${ft}px; top:${ot.toFixed(1)}px;` : "", Go = k && Jt != null ? `left:${ft}px; top:${Jt.toFixed(1)}px;` : "";
    return Po`<div class="wrap">
      <ha-card style="width:${o}px; height:${l}px;">
        <div class="scene">${qf(x)}</div>
        <button class="cam-btn cam-btn-save" title="Save Camera View" @pointerup=${(Q) => this._saveCurrentCamera(Q)}><ha-icon icon="mdi:content-save"></ha-icon></button>
        ${J ? Po`<button class="cam-btn cam-btn-restore" title="Restore Saved View" @pointerup=${(Q) => this._restoreSavedCamera(Q)}>↺</button>` : null}
        <button class="cam-btn cam-btn-h1 ${v ? "cam-btn-stop" : ""}" style=${to} @pointerup=${(Q) => this._handleControlTap("h", 1, Q)}>${v ? "■" : "⇠"}</button>
        <button class="cam-btn cam-btn-h2 ${v ? "cam-btn-stop" : ""}" style=${Io} @pointerup=${(Q) => this._handleControlTap("h", -1, Q)}>${v ? "■" : "⇢"}</button>
        <button class="cam-btn cam-btn-v1 ${D ? "cam-btn-stop" : ""}" style=${Vo} @pointerup=${(Q) => this._handleControlTap("v", 1, Q)}>${D ? "■" : "⇡"}</button>
        <button class="cam-btn cam-btn-v2 ${D ? "cam-btn-stop" : ""}" style=${Ho} @pointerup=${(Q) => this._handleControlTap("v", -1, Q)}>${D ? "■" : "⇣"}</button>
        ${At ? Po`<div class="cam-readout cam-readout-h" style=${ye}>${Math.round(T)}°</div>` : null}
        ${K ? Po`<div class="cam-readout cam-readout-v" style=${Go}>${Math.round(U)}°</div>` : null}
      </ha-card>
    </div>`;
  }
  renderSvg() {
    var Tr, Fr, Ar, Br, Dr, Pr, zr, Lr, Or, Wr, Ir, Vr, Hr, Gr, Ur, jr;
    const s = this._hass, o = this._config || {}, l = o.siSourceAttr ?? "sunlight_visualizer_source", u = o.siSourceValue ?? "sunlight_visualizer", x = Object.entries(s.states ?? {}).filter(
      ([, t]) => {
        var e;
        return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e[l]) === u;
      }
    ), v = (t) => {
      for (const [e, a] of x)
        if (t(a, e)) return [e, a];
      return null;
    }, D = (t) => {
      const e = v((a) => {
        var n;
        return ((n = a == null ? void 0 : a.attributes) == null ? void 0 : n.wall) === t;
      });
      return e ? e[0] : void 0;
    }, T = (t) => {
      const e = v((a) => {
        var n;
        return ((n = a == null ? void 0 : a.attributes) == null ? void 0 : n.camera_rotation) === t;
      });
      return e ? e[0] : void 0;
    }, U = (t) => {
      const e = v((a) => {
        var n;
        return ((n = a == null ? void 0 : a.attributes) == null ? void 0 : n.si_setting) === t;
      });
      return e ? e[0] : void 0;
    }, Y = v(
      (t) => {
        var e, a;
        return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.sun_azimuth) != null && ((a = t == null ? void 0 : t.attributes) == null ? void 0 : a.sun_elevation) != null;
      }
    ), z = Y ? Y[1].attributes : null, J = v(
      (t) => {
        var e, a, n;
        return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.roof_direction) != null || ((a = t == null ? void 0 : t.attributes) == null ? void 0 : a.ceiling_tilt) != null || ((n = t == null ? void 0 : t.attributes) == null ? void 0 : n.house_angle) != null;
      }
    ), k = J ? J[1].attributes : null, I = !!(k != null && k.force_sun_fallback), ft = Number(o.cardWidth ?? 450), Ct = Number(o.cardHeight ?? 450), kt = ft, At = Ct, K = kt, tt = At, Kt = K, Qt = tt, $t = K * 0.1, ot = o.floorScale ?? 2.6, Vt = K * 0.5, po = tt * 0.4, Jt = o.floorColor ?? "#2f2f2f", to = Number(o.floorCornerRadius ?? 26), Io = Number(o.floorThicknessPx ?? 7), ye = o.floorThicknessColor ?? "rgba(150,106,64,0.9)", Vo = o.floorTopStrokeColor ?? "rgba(72,112,56,0.8)", Ho = Number(o.floorTopStrokeWidth ?? 1.4), Go = o.floorGrassEnabled ?? !0, Q = Number(o.floorGrassOpacity ?? 0.3), mo = o.floorGrassColorA ?? "rgb(136,186,88)", Bt = o.floorGrassColorB ?? "rgb(96,150,62)", bo = o.rotationHEntity ?? T("h") ?? "input_number.cube_rotation_h", Nt = o.rotationVEntity ?? T("v") ?? "input_number.cube_rotation_v";
    this._rotationHEntity = bo, this._rotationVEntity = Nt;
    const dt = o.preferIntegrationSettings ?? !0, Ht = o.houseAngleEntity ?? null;
    let xt = Number(o.houseAngle ?? 0);
    const Dt = U("house_angle");
    Ht && s.states[Ht] ? xt = Number(((Tr = s.states[Ht]) == null ? void 0 : Tr.state) ?? xt) : Dt && s.states[Dt] ? xt = Number(((Fr = s.states[Dt]) == null ? void 0 : Fr.state) ?? xt) : (dt || o.houseAngle == null) && (k == null ? void 0 : k.house_angle) != null && (xt = Number(k.house_angle ?? xt));
    const go = o.wallFrontPctEntity ?? D("front"), Et = o.wallRightPctEntity ?? D("right"), Gt = o.wallBackPctEntity ?? D("back"), yo = o.wallLeftPctEntity ?? D("left"), nt = o.roofPctEntity ?? D("ceiling"), it = (t, e = !1) => {
      if (t == null || t === "") return e;
      if (typeof t == "boolean") return t;
      if (typeof t == "number") return t !== 0;
      if (typeof t == "string") {
        const a = t.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(a)) return !0;
        if (["false", "0", "no", "off"].includes(a)) return !1;
      }
      return e;
    }, ht = dt ? (k == null ? void 0 : k.roof_power_entity) ?? o.roofPowerEntity ?? null : o.roofPowerEntity ?? (k == null ? void 0 : k.roof_power_entity) ?? null, Uo = dt ? it(k == null ? void 0 : k.roof_power_enabled, it(o.roofPowerEnabled, !1)) : it(o.roofPowerEnabled, it(k == null ? void 0 : k.roof_power_enabled, !1)), ds = dt ? it(k == null ? void 0 : k.roof_power_invert, it(o.roofPowerInvert, !1)) : it(o.roofPowerInvert, it(k == null ? void 0 : k.roof_power_invert, !1)), ps = go ? Number(((Ar = s.states[go]) == null ? void 0 : Ar.state) ?? 0) : 0, ms = Et ? Number(((Br = s.states[Et]) == null ? void 0 : Br.state) ?? 0) : 0, bs = Gt ? Number(((Dr = s.states[Gt]) == null ? void 0 : Dr.state) ?? 0) : 0, gs = yo ? Number(((Pr = s.states[yo]) == null ? void 0 : Pr.state) ?? 0) : 0, $e = nt ? Number(((zr = s.states[nt]) == null ? void 0 : zr.state) ?? 0) : 0, _e = Uo && ht ? Number((Lr = s.states[ht]) == null ? void 0 : Lr.state) : NaN, ve = Uo ? ((t) => Number.isFinite(t) ? t >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W` : "0 W")(ds ? Math.abs(_e) : _e) : "", ys = o.useSunEntity ?? !1, jo = o.sunEntityId ?? "sun.sun", oo = o.sunAzEntity ?? null, eo = o.sunElEntity ?? null;
    let qo = Number(o.sunDistance ?? 3), Pt = Number(o.sunAz ?? 135), et = Number(o.sunEl ?? 55);
    const $s = Number(o.sunVisualElevationBiasDeg ?? 6), _s = Number(o.sunVisualElevationScale ?? 1);
    oo && s.states[oo] && (Pt = Number(((Or = s.states[oo]) == null ? void 0 : Or.state) ?? Pt)), eo && s.states[eo] && (et = Number(((Wr = s.states[eo]) == null ? void 0 : Wr.state) ?? et)), !oo && dt && (z == null ? void 0 : z.sun_azimuth) != null && (Pt = Number(z.sun_azimuth ?? Pt)), !eo && dt && (z == null ? void 0 : z.sun_elevation) != null && (et = Number(z.sun_elevation ?? et)), !oo && !eo && !z && ys && s.states[jo] && (Pt = Number(((Ir = s.states[jo].attributes) == null ? void 0 : Ir.azimuth) ?? Pt), et = Number(((Vr = s.states[jo].attributes) == null ? void 0 : Vr.elevation) ?? et));
    const $o = o.roofTiltEnabled ?? !0;
    let so = Number(o.roofTiltDeg ?? 25), V = o.roofTiltFace ?? "front";
    const Yo = U("ceiling_tilt"), Xo = U("roof_direction"), vs = Number(o.roofTiltMax ?? 89), Ss = Number(o.roofTiltOpacity ?? 1);
    Yo && s.states[Yo] ? so = Number(((Hr = s.states[Yo]) == null ? void 0 : Hr.state) ?? so) : (dt || o.roofTiltDeg == null) && (k == null ? void 0 : k.ceiling_tilt) != null && (so = Number(k.ceiling_tilt ?? so)), Xo && s.states[Xo] ? V = String(((Gr = s.states[Xo]) == null ? void 0 : Gr.state) ?? V) : (dt || o.roofTiltFace == null) && (k == null ? void 0 : k.roof_direction) != null && (V = String(k.roof_direction));
    const _o = o.houseStyleV2 ?? !0, wt = o.flatRoofEnabled ?? !0, xs = Number(o.flatRoofOverhang ?? 0.15), ws = Number(o.flatRoofThickness ?? 0.12), Rs = Number(o.flatRoofLift ?? 0), Se = o.flatRoofTopColor ?? "#e6e8ee";
    o.flatRoofEdgeColor;
    const xe = o.flatRoofSideColor ?? "#9ea4af", we = Number(o.flatRoofSideShade ?? 0.4), Re = Number(o.flatRoofTopOpacity ?? 1), Zo = Number(o.flatRoofEdgeOpacity ?? 1), Me = Number(o.flatRoofTopDepthBias ?? 0.06), Ce = Number(o.flatRoofSideDepthBias ?? 0.025), Ms = Number(o.flatRoofSkirtDepthBias ?? 0.02), Cs = o.wallWindowsEnabled ?? !0, ks = o.wallWindowFrameColor ?? "rgba(221,228,236,0.98)", Ns = o.wallWindowGlassColor ?? "rgba(110,178,212,0.68)", Es = o.wallWindowStrokeColor ?? "rgba(62,105,130,0.65)", ke = Number(o.wallWindowStrokeWidth ?? 1), Ts = o.roofPanelsEnabled ?? _o, Fs = o.roofPanelColor ?? "#2d3f7b", Ne = o.roofPanelGridColor ?? "rgba(214,230,255,0.65)", As = o.roofPanelBorderColor ?? "rgba(185,204,234,0.85)", Bs = Number(o.roofPanelBorderWidth ?? 0.9), Ko = Math.max(1, Math.round(Number(o.roofPanelsCols ?? 3))), Ds = M(Number(o.roofPanelsWidthFrac ?? 0.9), 0.4, 0.98), Ps = M(Number(o.roofPanelsGapFrac ?? 0.025), 0, 0.08), Ee = M(Number(o.roofPanelsT0 ?? 0.05), 0, 0.95), Te = M(Number(o.roofPanelsT1 ?? 0.26), 0.01, 0.98), Fe = Math.max(1, Math.round(Number(o.roofPanelGridCols ?? 5))), Ae = Math.max(1, Math.round(Number(o.roofPanelGridRows ?? 3))), Be = o.backTreeEnabled ?? !0, vo = Number(o.backTreeX ?? -2.2), So = Number(o.backTreeZ ?? -2.2), De = Number(o.backTreeScale ?? 1), ao = o.backTreeLeafColor ?? "#9bc94b", no = o.backTreeTrunkColor ?? "#6f4b2a", Pe = o.backTreeShadowEnabled ?? _o, zs = Number(o.backTreeShadowOpacity ?? 0.35), Ls = Number(o.backTreeShadowBlur ?? 1.1), Os = Number(o.backTreeShadowLength ?? 0.015), Ws = o.plinthBandEnabled ?? _o, Is = Number(o.plinthBandHeight ?? 0.06), Vs = Number(o.plinthBandMix ?? 0.62), N = o.patioStepEnabled ?? _o, B = Number(o.patioStepDepth ?? 0.24), q = Number(o.patioStepWidth ?? 1.1), Hs = Number(o.patioStepInset ?? 0.02), Gs = o.patioStepColor ?? "rgba(226,230,235,0.75)", Yn = o.patioGridColor ?? "rgba(164,170,182,0.8)", Xn = Number(o.patioGridWidth ?? 1), wa = o.shadowEnabled ?? !0, Sc = Number(o.shadowOpacity ?? 0.35), xc = Number(o.shadowBlur ?? 4), wc = Number(o.shadowContactOpacity ?? 0.12), Rc = Number(o.shadowContactBlur ?? 2.5), Qo = o.shadowColor ?? "#000000", Zn = Number(o.shadowClipInset ?? 0.02), Ra = o.baseAnchorShadowEnabled ?? !0, Mc = Number(o.baseAnchorShadowOpacity ?? 0.65), Cc = Number(o.baseAnchorShadowBlur ?? 0.2), kc = Number(o.baseAnchorShadowSpread ?? 0.05), Nc = o.baseAnchorShadowColor ?? "#000000", Ma = o.sunlightEnabled ?? !0, Ca = o.sunlightColor ?? [255, 225, 160], Kn = Number(o.sunlightOpacity ?? 0.7), Ec = Number(o.sunlightSpread ?? 0.7), Tc = Number(o.sunBeamStaticOpacity ?? 0.07), Fc = Number(o.sunBeamStaticWidth ?? 1.6), ka = o.sunBeamFlowEnabled ?? !0, Ac = o.sunBeamFlowColor ?? "rgba(255,200,50,0.85)", Bc = Number(o.sunBeamFlowOpacity ?? 0.55), Dc = Number(o.sunBeamFlowWidthScale ?? 0.6), Na = Number(o.sunBeamFlowDash ?? 8), Ea = Number(o.sunBeamFlowGap ?? 50), Pc = Number(o.sunBeamFlowDuration ?? 2.5), zc = Number(o.sunBeamFlowPhaseStep ?? 0.1), Lc = Number(o.sunBeamDepthScaleBoost ?? 1), Oc = Number(o.sunBeamDepthScaleMin ?? 0.55), Wc = Number(o.sunBeamDepthScaleMax ?? 1.2), Ic = o.sunRayAnimEnabled ?? !0, Ta = Number(o.sunRayAnimDurationMin ?? 1.8), Fa = Number(o.sunRayAnimDurationMax ?? 3), Vc = Number(o.sunRayAnimScaleMin ?? 0.5), Hc = Number(o.sunRayAnimScaleMax ?? 0.75), Gc = Number(o.sunRayAnimOpacityMin ?? 0.45);
    Number(o.sunRayAnimOpacityMax ?? 0.85);
    const Qn = o.sunRayAnimColorA ?? "rgb(255,240,110)";
    o.sunRayAnimColorB;
    const ze = o.skyCloudsEnabled ?? !0, Jn = Number(o.skyCloudOpacity ?? 0.34), Uc = Number(o.skyCloudBlur ?? 3.3), Aa = Number(o.skyCloudScale ?? 1.5), Ba = Number(o.skyCloudSpeed ?? 1), jc = Number(o.skyCloudHeight ?? 0.5);
    Number(o.wallBottomMix ?? 0.01), Number(o.wallMidMix ?? 0.7), Number(o.wallTopMix ?? 1.3);
    const qc = o.facadeSunDimmingEnabled ?? !0, Yc = Number(o.facadeSunMinFactor ?? 0.2), Xc = Number(o.facadeSunNoDimAtPct ?? 90), Zc = Number(o.facadeSunCurve ?? 8), Kc = Number(o.ceilingDarkMix ?? 0.1), Qc = Number(o.ceilingLightMix ?? 1.4), ti = o.horizonEnabled ?? !0, Jc = Number(o.horizonBase ?? 0.55), tl = Number(o.horizonTiltStrength ?? 0.65), oi = Number(o.horizonBand ?? 0.15), ol = o.horizonTopColor ?? [120, 170, 220], el = o.horizonBandColor ?? [255, 210, 150], sl = o.horizonBottomColor ?? [70, 80, 95], al = Number(o.skyTwilightRangeDeg ?? 6), nl = o.horizonNightTopColor ?? [12, 20, 42], il = o.horizonNightBandColor ?? [32, 44, 82], rl = o.horizonNightBottomColor ?? [6, 10, 22], cl = o.horizonSunriseTopColor ?? [118, 150, 206], ll = o.horizonSunriseBandColor ?? [236, 162, 132], hl = o.horizonSunriseBottomColor ?? [84, 70, 90], ul = o.horizonSunsetTopColor ?? [98, 106, 178], fl = o.horizonSunsetBandColor ?? [255, 122, 90], dl = o.horizonSunsetBottomColor ?? [82, 48, 76], Le = o.skyStarsEnabled ?? !0, Us = Math.max(0, Math.round(Number(o.skyStarsCount ?? 34))), pl = o.skyStarsTwinkleEnabled ?? !0, ml = Number(o.skyStarsOpacity ?? 0.9), Da = o.skyMoonEnabled ?? !0, bl = Number(o.skyMoonX ?? 0.86), gl = Number(o.skyMoonY ?? 0.12), yl = Number(o.skyMoonSize ?? 14), $l = Number(o.skyMoonPhase ?? 0.72), _l = Number(o.skyMoonOpacity ?? 0.92), Oe = o.moonlightEnabled ?? !0, js = o.moonlightColor ?? [178, 208, 255], vl = Number(o.moonlightOpacity ?? 0.22), Sl = Number(o.moonlightSpread ?? 0.6), xl = Number(o.moonlightWashOpacity ?? 0.08), wl = Number(o.moonShadowElevationDeg ?? 18), Rl = Number(o.moonShadowYawDeg ?? -45), Ml = Number(o.shadowSunMoonBlendDeg ?? 3), ei = o.vignetteEnabled ?? !0, Cl = Number(o.vignetteOpacity ?? 0.35), kl = Number(o.vignetteRadius ?? 0.65), Nl = Number(o.vignetteInner ?? 0.85), Pa = o.vignetteColor ?? [0, 0, 0], El = o.roofBackEnabled ?? !0, si = Number(o.roofBackMix ?? 0.7), Tl = Number(o.roofBackOpacity ?? 1);
    Number(o.roofGradientDarkMix ?? 0.125), Number(o.roofGradientLightMix ?? 1.25);
    const Fl = o.roofSidesEnabled ?? !0, Al = Number(o.roofSideMix ?? 0.45), za = Number(o.roofSideOpacity ?? 1), ai = Number(o.roofSideDepthBias ?? 0.012), Bl = o.roofCapEnabled ?? !0, Dl = Number(o.floorCompassStroke ?? 4), Pl = Number(o.floorCompassRingBand ?? 0.09), zl = o.floorCompassRingMiddleColor ?? "rgba(255,255,255,0.9)", ni = o.floorCompassRingSideColor ?? "rgba(210,140,140,0.345)", ii = Number(o.floorCompassRingSideWidth ?? 3), ri = o.floorCompassTicksEnabled ?? !0, Ll = o.floorCompassTickColor ?? "rgba(0,0,0,0.75)", Ol = Number(o.floorCompassTickWidth ?? 1), Wl = Number(o.floorCompassTickMajorWidth ?? 4), Il = Number(o.floorCompassTickLength ?? -0.1), Vl = Number(o.floorCompassTickMajorLength ?? -0.2), Hl = Number(o.floorCompassLabelSize ?? 20), Gl = Number(o.floorCompassLabelInset ?? -0.25), Ul = Number(o.floorCompassLabelScaleBoost ?? 1.2), jl = Number(o.floorCompassLabelScaleMin ?? 0.6), ql = Number(o.floorCompassLabelScaleMax ?? 2), Yl = Number(o.floorCompassLabelStroke ?? 1), ci = Number(o.arrowScaleBoost ?? 0.6), li = Number(o.floorPointerScaleMin ?? 0.05), hi = Number(o.floorPointerScaleMax ?? 1), ui = Number(o.floorPointerBaseWidth ?? 3.4), Xl = Number(o.floorPointerBaseHead ?? 18), La = o.floorPointerColor ?? "gold", fi = o.floorPointerShadowEnabled ?? !0, Oa = Number(o.floorPointerShadowOpacity ?? 0.8), Zl = Number(o.floorPointerShadowBlur ?? 1.1), Kl = Number(o.floorPointerShadowOffset ?? 2.9), Ql = Number(o.floorWallLabelSize ?? 12), qs = Number(o.floorWallLabelOffset ?? 0.55), Jl = Number(o.floorWallLabelScaleBoost ?? 1.2), th = Number(o.floorWallLabelScaleMin ?? 0.5), oh = Number(o.floorWallLabelScaleMax ?? 1.8), eh = Number(o.floorWallLabelScreenLift ?? 6), sh = o.floorWallLabelColor ?? "rgba(255,255,255,0.9)", ah = o.floorWallLabelStroke ?? "rgba(0,0,0,0.6)", nh = Number(o.floorWallLabelStrokeWidth ?? 0.5), di = Number(o.wallLabelVisibleThreshold ?? -0.05), ih = Number(o.wallPctVisibleThreshold ?? -0.215), rh = Number(o.wallPctAreaThreshold ?? 120), ch = Number(o.wallPctVerticalPos ?? 0.66), pi = o.surfaceLabelEnabled ?? !0, Wa = Number(o.surfaceLabelSize ?? 12), lh = Number(o.surfaceLabelScaleBoost ?? 1.5), hh = Number(o.surfaceLabelScaleMin ?? 0.6), uh = Number(o.surfaceLabelScaleMax ?? 1.6), mi = o.surfaceLabelColor ?? "rgba(255,213,0,.95)", bi = o.surfaceLabelStroke ?? "rgba(0,0,0,0.5)", Ia = Number(o.surfaceLabelStrokeWidth ?? 0.5), Va = Number(o.surfaceLabelOffset ?? 0.03), fh = Number(o.roofPctLabelScale ?? 1.18), dh = Number(o.roofPowerLabelScale ?? 0.7), ph = o.roofPowerLabelColor ?? "rgba(255,255,255,0.9)", mh = o.frontDoorEnabled ?? !0, Ha = Number(o.frontDoorWidth ?? 0.55), gi = Number(o.frontDoorHeight ?? 1.1), bh = Number(o.frontDoorBottomInset ?? 0.05), gh = Number(o.frontDoorOffset ?? 0.01), yh = o.frontDoorColor ?? "rgba(0,0,0,0.55)", yi = Number(o.frontDoorOpacity ?? 0.9), $h = o.frontDoorFrameColor ?? "rgba(219,225,232,0.98)", _h = o.frontDoorKnobColor ?? "rgba(236,198,111,0.95)", _t = o.faceColors ?? {
      front: "#faf5f5ff",
      right: "#d8d2d2ff",
      top: "#13a057",
      back: "#d8d2d2ff",
      left: "#d8d2d2ff",
      bottom: "#d8d2d2ff"
    }, vh = o.autoRotateEnabledDefault ?? !1, Ys = Number(k == null ? void 0 : k.auto_rotate_speed);
    let We = Number(o.autoRotateSpeed ?? 10);
    (dt && Number.isFinite(Ys) || (o.autoRotateSpeed === void 0 || o.autoRotateSpeed === null || o.autoRotateSpeed === "") && Number.isFinite(Ys)) && (We = Ys);
    const Rt = Number(o.autoRotateIntervalMs ?? 50), Ga = Number(o.autoRotateTapDelayMs ?? 250), Sh = o.autoRotateStopOnFullTurn ?? !0, Ua = Number(o.autoRotateTurnCount ?? 1), xh = o.autoRotateShowFps ?? !0, wh = Number(o.autoRotateFpsWindowMs ?? 1e3), Rh = o.autoRotateAdaptiveEnabled ?? !0, $i = Number(o.autoRotateAdaptiveMaxIntervalMs ?? 1e3), Mh = Number(o.autoRotateAdaptiveStepMs ?? 10), Ch = Number(o.autoRotateAdaptiveCheckMs ?? 1e3), kh = Number(o.autoRotateAdaptiveFpsThreshold ?? 0.8), Nh = Number(o.autoRotateCalibrateMs ?? 2e3), Eh = Number(o.autoRotateCalibrateFactor ?? 0.85), _i = o.cssFpsDebugEnabled ?? !1, Th = Number(o.cssFpsWindowMs ?? 1e3), Fh = Number(o.cssFpsUiUpdateMs ?? 500), Xs = o.cssFpsAutoLimitEnabled ?? !0, Ah = Number(o.cssFpsCalibrateMs ?? 2e3), Bh = Number(o.cssFpsLimitThreshold ?? 20), Dh = Number(o.cssFpsLimitFactor ?? 0.5), Ph = Number(o.cssFpsLimitMin ?? 1), zh = Number(o.cssFpsLimitMax ?? 30), Lh = o.cssFpsLimitTextEnabled ?? !0, vi = Number(o.cssFpsRotationStartBoost ?? 2);
    this._autoRotateSpeed = We, this._autoRotateIntervalMs = Rt, this._autoRotateTurnCount = Ua, this._autoRotateEnabled === void 0 && (this._autoRotateEnabled = vh), this._autoRotateOffsetDeg === void 0 && (this._autoRotateOffsetDeg = 0), this._autoRotateIntervalMsDynamic === void 0 && (this._autoRotateIntervalMsDynamic = Rt), this._autoRotateFpsSamples === void 0 && (this._autoRotateFpsSamples = []), this._autoRotateFps === void 0 && (this._autoRotateFps = 0), this._autoRotateCalibrated === void 0 && (this._autoRotateCalibrated = !1), this._autoRotateAccumDeg === void 0 && (this._autoRotateAccumDeg = 0), this._autoRotateTargetDeg === void 0 && (this._autoRotateTargetDeg = 0), this._cssFps === void 0 && (this._cssFps = 0), this._cssFpsLimit === void 0 && (this._cssFpsLimit = 0), this._cssPerfLimited === void 0 && (this._cssPerfLimited = !1), this._cssFpsAutoCalibrated === void 0 && (this._cssFpsAutoCalibrated = !1), this._cssFpsMeasured === void 0 && (this._cssFpsMeasured = 0), this._cssRecalibrateRequested === void 0 && (this._cssRecalibrateRequested = !1);
    const Jo = () => typeof performance < "u" && performance.now ? performance.now() : Date.now(), Si = Jo() / 1e3, Zs = (t, e = 0) => {
      const a = Math.max(1e-3, t);
      return -(((Si + e) % a + a) % a);
    }, Ks = (t, e = 0) => {
      const a = Math.max(1e-3, t);
      return -((e % a + a) % a);
    }, Qs = () => {
      const t = Number(this._cssFpsLimit || 0);
      if (!(Xs && !!this._cssPerfLimited && t > 0)) return Rt;
      const a = Math.max(1, Number.isFinite(vi) ? vi : 2), n = Math.max(1, Math.round(t * a));
      return Math.max(Rt, Math.round(1e3 / n));
    };
    this._cssGlobalTimeSec === void 0 && (this._cssGlobalTimeSec = Jo() / 1e3);
    const xi = () => {
      this._cssGlobalTickTimer && (clearInterval(this._cssGlobalTickTimer), this._cssGlobalTickTimer = null), this._cssGlobalTickFps = 0;
    }, Oh = (t) => {
      const e = Math.max(1, Math.round(t));
      if (this._cssGlobalTickTimer && Number(this._cssGlobalTickFps || 0) === e) return;
      xi();
      const a = Math.max(1, Math.round(1e3 / e)), n = () => {
        var h, d;
        const i = Jo() / 1e3, r = Math.floor(i * e) / e;
        this._cssGlobalTimeSec = r;
        const c = (d = (h = this.renderRoot) == null ? void 0 : h.querySelector) == null ? void 0 : d.call(h, "svg.sv-scene");
        c && c.style.setProperty("--sv-global-time", r.toFixed(3));
      };
      n(), this._cssGlobalTickFps = e, this._cssGlobalTickTimer = setInterval(n, a);
    }, Wh = () => {
      this._cssFpsRaf && (cancelAnimationFrame(this._cssFpsRaf), this._cssFpsRaf = null), this._cssFpsSamples = [], this._cssFps = 0;
    }, Ih = () => {
      if (this._cssFpsRaf) return;
      this._cssFpsSamples = [], this._cssFpsUiLast = 0;
      const t = (e) => {
        const a = this._cssFpsSamples || [];
        a.push(e);
        const n = e - Th;
        for (; a.length && a[0] < n; ) a.shift();
        if (this._cssFpsSamples = a, a.length >= 2) {
          const r = (a[a.length - 1] - a[0]) / 1e3;
          this._cssFps = r > 0 ? (a.length - 1) / r : 0;
        }
        const i = this._cssFpsUiLast || 0;
        e - i >= Fh && (this._cssFpsUiLast = e, this._updateTimerMS = Date.now(), this.requestUpdate()), this._cssFpsRaf = requestAnimationFrame(t);
      };
      this._cssFpsRaf = requestAnimationFrame(t);
    }, ja = () => {
      this._cssFpsCalibRaf && (cancelAnimationFrame(this._cssFpsCalibRaf), this._cssFpsCalibRaf = null), this._cssFpsAutoCalibrating = !1;
    }, Vh = () => {
      if (this._cssFpsAutoCalibrated || this._cssFpsAutoCalibrating) return;
      this._cssFpsAutoCalibrating = !0;
      const t = [];
      let e = 0;
      const a = (n) => {
        if (e || (e = n), t.push(n), n - e >= Ah) {
          ja();
          let i = 0;
          if (t.length >= 2) {
            const c = (t[t.length - 1] - t[0]) / 1e3;
            i = c > 0 ? (t.length - 1) / c : 0;
          }
          this._cssFpsMeasured = i;
          let r = 0;
          i > 0 && i < Bh && (i < 5 ? r = 1 : (r = Math.floor(i * Dh), r = Math.min(zh, Math.max(Ph, r)))), this._cssFpsLimit = r, this._cssPerfLimited = r > 0, this._cssFpsAutoCalibrated = !0, this._updateTimerMS = Date.now(), this.requestUpdate();
          return;
        }
        this._cssFpsCalibRaf = requestAnimationFrame(a);
      };
      this._cssFpsCalibRaf = requestAnimationFrame(a);
    }, wi = (t) => {
      const e = this._autoRotateFpsSamples || [];
      e.push(t);
      const a = t - wh;
      for (; e.length && e[0] < a; ) e.shift();
      if (this._autoRotateFpsSamples = e, e.length >= 2) {
        const n = (e[e.length - 1] - e[0]) / 1e3;
        this._autoRotateFps = n > 0 ? (e.length - 1) / n : 0;
      }
    }, Ri = (t) => {
      if (!this._autoRotateCalibrated || !Rh) return;
      const e = this._autoRotateAdaptiveLastCheck || 0;
      if (t - e < Ch) return;
      this._autoRotateAdaptiveLastCheck = t;
      const a = 1e3 / this._autoRotateIntervalMsDynamic;
      if (this._autoRotateFps && this._autoRotateFps < a * kh) {
        const n = Math.min(
          $i,
          this._autoRotateIntervalMsDynamic + Mh
        );
        n !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = n, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
    }, Mi = (t) => {
      if (this._autoRotateCalibrated) return;
      const e = this._autoRotateCalibrateStart || t;
      if (this._autoRotateCalibrateStart = e, t - e < Nh) return;
      const a = this._autoRotateFps || 0;
      if (a > 0) {
        const i = 1e3 / (a * Eh), r = Math.min(
          $i,
          Math.max(Qs(), Math.round(i))
        );
        r !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = r, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
      this._autoRotateCalibrated = !0;
    }, qa = () => {
      this._autoRotateEnabled && (this._autoRotateLastTick = 0, this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = 0, this._autoRotateEnabled = !1, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null), this._autoRotateIntervalMsDynamic = Rt, this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._cssRecalibrateRequested = !0, this._updateTimerMS = Date.now(), this.requestUpdate());
    }, Hh = () => {
      this._autoRotateEnabled || (this._manualRotateEnabled && this._stopManualRotate(), this._autoRotateEnabled = !0, this._autoRotateLastTick = Jo(), this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = Sh && Ua > 0 ? Ua * 360 : 0, this._autoRotateIntervalMsDynamic = Qs(), this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._autoRotateTimer || (this._autoRotateTimer = setInterval(() => {
        const t = Jo();
        wi(t), Mi(t), Ri(t);
        const e = this._autoRotateLastTick || t, a = Math.max(0, t - e) / 1e3, n = We * a;
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + n, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + n, this._autoRotateLastTick = t, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
          qa();
          return;
        }
        this._updateTimerMS = Date.now(), this.requestUpdate();
      }, this._autoRotateIntervalMsDynamic), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic), this._updateTimerMS = Date.now(), this.requestUpdate());
    };
    if (this._autoRotateStop = qa, this._autoRotateStartFn = Hh, this._autoRotateHandlers || (this._autoRotateHandlers = !0, this._autoRotateLastTap = 0, this.addEventListener("pointerup", (t) => {
      var i;
      if ((t.composedPath ? t.composedPath() : []).some((r) => {
        var c, h;
        return (h = (c = r == null ? void 0 : r.classList) == null ? void 0 : c.contains) == null ? void 0 : h.call(c, "cam-btn");
      }) || t.button !== void 0 && t.button !== 0) return;
      const a = Date.now(), n = this._autoRotateLastTap || 0;
      if (a - n < Ga) {
        this._autoRotateLastTap = 0, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), (i = this._autoRotateStartFn) == null || i.call(this);
        return;
      }
      this._autoRotateLastTap = a, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), this._autoRotateClickTimer = setTimeout(() => {
        var r;
        this._autoRotateLastTap && Date.now() - this._autoRotateLastTap >= Ga && (this._autoRotateLastTap = 0, (r = this._autoRotateStop) == null || r.call(this));
      }, Ga + 10);
    }, { capture: !1 })), this._autoRotateEnabled) {
      const t = Qs();
      Number(this._autoRotateIntervalMsDynamic || Rt) < t && (this._autoRotateIntervalMsDynamic = t, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null)), (!this._autoRotateTimer || this._autoRotateTimerMs !== this._autoRotateIntervalMsDynamic) && (this._autoRotateTimer && clearInterval(this._autoRotateTimer), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic, this._autoRotateTimer = setInterval(() => {
        const e = Jo();
        wi(e), Mi(e), Ri(e);
        const a = this._autoRotateLastTick || e, n = Math.max(0, e - a) / 1e3, i = We * n;
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + i, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + i, this._autoRotateLastTick = e, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
          qa();
          return;
        }
        this._updateTimerMS = Date.now(), this.requestUpdate();
      }, this._autoRotateIntervalMsDynamic));
    } else this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null);
    _i ? Ih() : Wh();
    const Ci = !!(this._autoRotateEnabled || this._manualRotateEnabled);
    Xs && this._cssRecalibrateRequested && !Ci && (ja(), this._cssFpsAutoCalibrated = !1, this._cssFpsMeasured = 0, this._cssRecalibrateRequested = !1), Xs ? Vh() : (ja(), this._cssFpsAutoCalibrated = !1, this._cssFpsMeasured = 0, this._cssFpsLimit = 0, this._cssPerfLimited = !1, this._cssRecalibrateRequested = !1);
    const ut = Xs && this._cssPerfLimited && Number(this._cssFpsLimit) > 0, io = ut ? Number(this._cssFpsLimit) : 0, Js = ut && io <= 5, Ya = Ic && !Js, Xa = pl && !(ut && io <= 1), Gh = Qs();
    this._rotationIntervalMsFloor = Gh;
    const Za = Ci, Uh = ut && Za;
    ut && !Za ? Oh(io) : xi();
    const ki = Number(((Ur = s.states[bo]) == null ? void 0 : Ur.state) || 210), Ni = Number(((jr = s.states[Nt]) == null ? void 0 : jr.state) || 35);
    let ta = ki, oa = Ni;
    const Ka = Number(this._cameraSavedBaseHOverride), Qa = Number(this._cameraSavedBaseVOverride);
    Number.isFinite(Ka) && (ta = Ka, Math.abs((ki - Ka + 540) % 360 - 180) < 0.25 && (this._cameraSavedBaseHOverride = void 0)), Number.isFinite(Qa) && (oa = Qa, Math.abs(Ni - Qa) < 0.25 && (this._cameraSavedBaseVOverride = void 0)), this._autoRotateCurrentDeg = this._autoRotateOffsetDeg || 0;
    const Ei = (ta + (this._autoRotateOffsetDeg || 0)) * Math.PI / 180;
    this._manualRotateBaseVDeg = oa;
    const jh = Number(this._manualRotateVOffsetDeg || 0), xo = Math.min(Math.max(oa + jh, 0), 90);
    this._savedCameraH = this._normDeg(ta), this._savedCameraV = Math.max(0, Math.min(90, oa)), this._currentCameraH = this._normDeg(ta + Number(this._autoRotateOffsetDeg || 0)), this._currentCameraV = xo;
    const Ti = xo * Math.PI / 180, Ie = 5, ea = Math.cos(Ei), sa = Math.sin(Ei), aa = Math.cos(Ti), na = -Math.sin(Ti), Fi = (xt || 0) * Math.PI / 180, Ai = Math.cos(Fi), Bi = Math.sin(Fi), qh = Math.PI * 2;
    function M(t, e, a) {
      return Math.min(a, Math.max(e, t));
    }
    function gt(t) {
      const e = Math.hypot(...t);
      return e > 0 ? t.map((a) => a / e) : [0, 0, 0];
    }
    function Yh(t, e) {
      return t[0] * e[0] + t[1] * e[1] + t[2] * e[2];
    }
    function H(t) {
      const e = t[0], a = t[1], n = t[2], i = e * ea - n * sa, r = e * sa + n * ea, c = a * aa - r * na, h = a * na + r * aa;
      return [i, c, h];
    }
    function Di(t) {
      const e = t[0], a = t[1], n = t[2], i = a * aa + n * na, r = -a * na + n * aa, c = e * ea + r * sa, h = -e * sa + r * ea;
      return [c, i, h];
    }
    function pt(t) {
      const e = t[0], a = t[1], n = t[2], i = e * Ai + n * Bi, r = -e * Bi + n * Ai;
      return [i, a, r];
    }
    function ia(t) {
      return H(pt(t));
    }
    function G(t) {
      const e = t[0], a = t[1], n = t[2], i = Ie / (Ie + n);
      return [Vt + e * $t * i, po - a * $t * i, n, i];
    }
    function Mt(t, e) {
      const a = parseInt(t.substr(1, 2), 16), n = parseInt(t.substr(3, 2), 16), i = parseInt(t.substr(5, 2), 16), r = Math.min(255, Math.max(0, Math.round(a * e))), c = Math.min(255, Math.max(0, Math.round(n * e))), h = Math.min(255, Math.max(0, Math.round(i * e)));
      return `rgb(${r},${c},${h})`;
    }
    function ra(t, e, a, n) {
      const i = gt([a[0] - e[0], a[1] - e[1], a[2] - e[2]]), r = [t[0] - e[0], t[1] - e[1], t[2] - e[2]], c = Math.cos(n), h = Math.sin(n), d = [
        i[1] * r[2] - i[2] * r[1],
        i[2] * r[0] - i[0] * r[2],
        i[0] * r[1] - i[1] * r[0]
      ], f = i[0] * r[0] + i[1] * r[1] + i[2] * r[2], p = [
        r[0] * c + d[0] * h + i[0] * f * (1 - c),
        r[1] * c + d[1] * h + i[1] * f * (1 - c),
        r[2] * c + d[2] * h + i[2] * f * (1 - c)
      ];
      return [e[0] + p[0], e[1] + p[1], e[2] + p[2]];
    }
    function Xh(t, e, a) {
      const n = [e[0] - t[0], e[1] - t[1], e[2] - t[2]], i = [a[0] - t[0], a[1] - t[1], a[2] - t[2]];
      return gt([
        n[1] * i[2] - n[2] * i[1],
        n[2] * i[0] - n[0] * i[2],
        n[0] * i[1] - n[1] * i[0]
      ]);
    }
    function wo(t) {
      return t.reduce((e, a) => e + a[2], 0) / t.length;
    }
    function Pi(t) {
      const e = Number(t);
      return Number.isFinite(e) ? `${Math.round(e)}%` : "0%";
    }
    function Ja(t) {
      let e = 0;
      for (let a = 0; a < t.length; a++) {
        const n = (a + 1) % t.length;
        e += t[a][0] * t[n][1] - t[n][0] * t[a][1];
      }
      return e;
    }
    function Zh(t, e) {
      if (!t.length || e.length < 3) return [];
      const n = Ja(e) > 0, i = (h, d, f) => {
        const p = (f[0] - d[0]) * (h[1] - d[1]) - (f[1] - d[1]) * (h[0] - d[0]);
        return n ? p >= 0 : p <= 0;
      }, r = (h, d, f, p) => {
        const m = h[0], b = h[1], g = d[0], y = d[1], w = f[0], E = f[1], F = p[0], P = p[1], L = (m - g) * (E - P) - (b - y) * (w - F);
        if (Math.abs(L) < 1e-6) return d;
        const W = ((m * y - b * g) * (w - F) - (m - g) * (w * P - E * F)) / L, C = ((m * y - b * g) * (E - P) - (b - y) * (w * P - E * F)) / L;
        return [W, C];
      };
      let c = t.slice();
      for (let h = 0; h < e.length; h++) {
        const d = e[h], f = e[(h + 1) % e.length], p = c.slice();
        if (c = [], !p.length) break;
        for (let m = 0; m < p.length; m++) {
          const b = p[m], g = p[(m - 1 + p.length) % p.length], y = i(b, d, f), w = i(g, d, f);
          y ? (w || c.push(r(g, b, d, f)), c.push(b)) : w && c.push(r(g, b, d, f));
        }
      }
      return c;
    }
    function zi(t, e, a, n) {
      return n > 0 && (t = -t, e = -e, a = -a, n = -n), t * n - e * a < 0 && (t = -t, e = -e), t < 0 && (t = -t, e = -e, a = -a, n = -n), { bx: t, by: e, ux: a, uy: n };
    }
    function Li(t, e, a, n) {
      return t * n - e * a < 0 && (a = -a, n = -n), { bx: t, by: e, ux: a, uy: n };
    }
    function Oi(t, e, a, n, i = !0) {
      const r = G(H(t)), c = G(H([
        t[0] + e[0],
        t[1] + e[1],
        t[2] + e[2]
      ])), h = G(H([
        t[0] + a[0],
        t[1] + a[1],
        t[2] + a[2]
      ]));
      let d = c[0] - r[0], f = c[1] - r[1], p = Math.hypot(d, f);
      if (p < 1e-6) return null;
      d /= p, f /= p;
      let m = h[0] - r[0], b = h[1] - r[1], g = Math.hypot(m, b);
      g < 1e-6 ? (m = -f, b = d, g = Math.hypot(m, b)) : (m /= g, b /= g);
      let y = i ? zi(d, f, m, b) : Li(d, f, m, b);
      if (n) {
        const w = G(H([
          t[0] + n[0],
          t[1] + n[1],
          t[2] + n[2]
        ]));
        let E = w[0] - r[0], F = w[1] - r[1], P = Math.hypot(E, F);
        P > 1e-6 && (E /= P, F /= P, y.bx * E + y.by * F < 0 && (y = i ? zi(-y.bx, -y.by, -y.ux, -y.uy) : Li(-y.bx, -y.by, -y.ux, -y.uy)));
      }
      return { basis: y, centerScr: r };
    }
    function Kh(t, e) {
      const a = t[0][0], n = t[0][1], i = t[1][0], r = t[1][1], c = t[2][0], h = t[2][1], d = e[0][0], f = e[0][1], p = e[1][0], m = e[1][1], b = e[2][0], g = e[2][1], y = a * (r - h) + i * (h - n) + c * (n - r);
      if (Math.abs(y) < 1e-6) return null;
      const w = (d * (r - h) + p * (h - n) + b * (n - r)) / y, E = (f * (r - h) + m * (h - n) + g * (n - r)) / y, F = (d * (c - i) + p * (a - c) + b * (i - a)) / y, P = (f * (c - i) + m * (a - c) + g * (i - a)) / y, L = (d * (i * h - c * r) + p * (c * n - a * h) + b * (a * r - i * n)) / y, W = (f * (i * h - c * r) + m * (c * n - a * h) + g * (a * r - i * n)) / y;
      return { a: w, b: E, c: F, d: P, e: L, f: W };
    }
    function Qh(t) {
      const e = [0, 1, 0], a = [
        e[1] * t[2] - e[2] * t[1],
        e[2] * t[0] - e[0] * t[2],
        e[0] * t[1] - e[1] * t[0]
      ];
      return gt(a);
    }
    function Wi(t) {
      if (t.length <= 1) return t.slice();
      const e = t.slice().sort((r, c) => r.x === c.x ? r.z - c.z : r.x - c.x), a = (r, c, h) => (c.x - r.x) * (h.z - r.z) - (c.z - r.z) * (h.x - r.x), n = [];
      for (const r of e) {
        for (; n.length >= 2 && a(n[n.length - 2], n[n.length - 1], r) <= 0; )
          n.pop();
        n.push(r);
      }
      const i = [];
      for (let r = e.length - 1; r >= 0; r--) {
        const c = e[r];
        for (; i.length >= 2 && a(i[i.length - 2], i[i.length - 1], c) <= 0; )
          i.pop();
        i.push(c);
      }
      return i.pop(), n.pop(), n.concat(i);
    }
    function Jh(t, e, a, n, i) {
      if (t.length === 0) return t;
      const r = (f, p, m) => {
        const b = [];
        for (let g = 0; g < f.length; g++) {
          const y = f[g], w = f[(g + 1) % f.length], E = p(y), F = p(w);
          E && F ? b.push(w) : E && !F ? b.push(m(y, w)) : !E && F && (b.push(m(y, w)), b.push(w));
        }
        return b;
      }, c = (f, p, m) => {
        const b = p.x - f.x;
        if (Math.abs(b) < 1e-9) return { x: m, z: f.z };
        const g = (m - f.x) / b;
        return { x: m, z: f.z + g * (p.z - f.z) };
      }, h = (f, p, m) => {
        const b = p.z - f.z;
        if (Math.abs(b) < 1e-9) return { x: f.x, z: m };
        const g = (m - f.z) / b;
        return { x: f.x + g * (p.x - f.x), z: m };
      };
      let d = t.slice();
      return d = r(d, (f) => f.x >= e, (f, p) => c(f, p, e)), d = r(d, (f) => f.x <= a, (f, p) => c(f, p, a)), d = r(d, (f) => f.z >= n, (f, p) => h(f, p, n)), d = r(d, (f) => f.z <= i, (f, p) => h(f, p, i)), d;
    }
    function tu(t) {
      if (t.length <= 1) return t.slice();
      const e = t.slice().sort((r, c) => r.x === c.x ? r.y - c.y : r.x - c.x), a = (r, c, h) => (c.x - r.x) * (h.y - r.y) - (c.y - r.y) * (h.x - r.x), n = [];
      for (const r of e) {
        for (; n.length >= 2 && a(n[n.length - 2], n[n.length - 1], r) <= 0; ) n.pop();
        n.push(r);
      }
      const i = [];
      for (let r = e.length - 1; r >= 0; r--) {
        const c = e[r];
        for (; i.length >= 2 && a(i[i.length - 2], i[i.length - 1], c) <= 0; ) i.pop();
        i.push(c);
      }
      return i.pop(), n.pop(), n.concat(i);
    }
    const te = Pt * Math.PI / 180, tn = et * Math.PI / 180, zt = gt([
      Math.cos(tn) * Math.sin(te),
      Math.sin(tn),
      Math.cos(tn) * Math.cos(te)
    ]), on = M(et * _s + $s, -89.9, 89.9) * Math.PI / 180, en = gt([
      Math.cos(on) * Math.sin(te),
      Math.sin(on),
      Math.cos(on) * Math.cos(te)
    ]);
    H(zt);
    const vt = zt[1] > 0.01, Ii = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ], Ut = Ii.map(pt), Ve = Ut.map(H), jt = Ve.map(G), ou = [
      { id: "front", i: [4, 5, 6, 7], c: _t.front },
      { id: "right", i: [1, 5, 6, 2], c: _t.right },
      { id: "back", i: [0, 1, 2, 3], c: _t.back },
      { id: "left", i: [0, 4, 7, 3], c: _t.left },
      { id: "bottom", i: [0, 1, 5, 4], c: _t.bottom }
    ], sn = {
      front: { indices: [4, 5, 6, 7], edge: [4, 5] },
      right: { indices: [1, 5, 6, 2], edge: [1, 5] },
      back: { indices: [0, 1, 2, 3], edge: [0, 1] },
      left: { indices: [0, 4, 7, 3], edge: [0, 4] }
    }, Vi = {
      front: [0, 0, 1],
      right: [1, 0, 0],
      back: [0, 0, -1],
      left: [-1, 0, 0]
    }, He = {
      front: ps,
      right: ms,
      back: bs,
      left: gs
    }, Ge = (t) => {
      if (!qc) return 1;
      const e = M(Yc, 0, 1), a = M(Xc, 1, 100), i = M(Number.isFinite(t) ? t : 0, 0, a) / a, r = Math.max(1e-3, Zc), c = Math.log(1 + r * i) / Math.log(1 + r);
      return e + (1 - e) * c;
    }, ro = {
      front: Ge(He.front),
      right: Ge(He.right),
      back: Ge(He.back),
      left: Ge(He.left)
    }, Tt = Ge($e), eu = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    }, ct = [
      [-1, 1, -1],
      [1, 1, -1],
      [1, 1, 1],
      [-1, 1, 1]
    ], an = M(so, 0, vs), Ro = $o && an > 0.01;
    let Z = ct;
    if (Ro) {
      const t = an * Math.PI / 180;
      let e = [-1, 1, 1], a = [1, 1, 1], n = 1;
      V === "front" && (e = [-1, 1, 1], a = [1, 1, 1], n = 1), V === "back" && (e = [-1, 1, -1], a = [1, 1, -1], n = -1), V === "left" && (e = [-1, 1, -1], a = [-1, 1, 1], n = 1), V === "right" && (e = [1, 1, -1], a = [1, 1, 1], n = -1);
      const i = t * n;
      Z = ct.map((r) => ra(r, e, a, i));
    }
    const Ue = Z.map(pt), Hi = Ue.map(H), ca = Hi.map(G);
    let nn = Xh(Z[0], Z[1], Z[2]);
    nn[1] < 0 && (nn = nn.map((t) => -t));
    const Gi = Ja(ca), la = Gi < 0;
    wt ? this._roofWindingFront = la : this._roofWindingFront === void 0 ? this._roofWindingFront = la : Math.abs(Gi) > 20 && (this._roofWindingFront = la);
    const co = wt ? la : this._roofWindingFront;
    let rn = null;
    const je = (t, e) => /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t) ? Mt(t, e) : t;
    let Ui = !1, cn = !0, ha = !1;
    const qt = [];
    if (wt) {
      const t = Math.max(0, xs), e = Math.max(0, Rs), a = Math.max(0.01, ws), n = 1 + e, i = n + a;
      let r = [
        [-1 - t, i, -1 - t],
        [1 + t, i, -1 - t],
        [1 + t, i, 1 + t],
        [-1 - t, i, 1 + t]
      ], c = [
        [-1 - t, n, -1 - t],
        [1 + t, n, -1 - t],
        [1 + t, n, 1 + t],
        [-1 - t, n, 1 + t]
      ], h = [
        [-1, n, -1],
        [1, n, -1],
        [1, n, 1],
        [-1, n, 1]
      ];
      if (Ro) {
        const C = an * Math.PI / 180;
        let _ = [-1, n, 1], R = [1, n, 1], O = 1;
        V === "front" && (_ = [-1, n, 1], R = [1, n, 1], O = 1), V === "back" && (_ = [-1, n, -1], R = [1, n, -1], O = -1), V === "left" && (_ = [-1, n, -1], R = [-1, n, 1], O = 1), V === "right" && (_ = [1, n, -1], R = [1, n, 1], O = -1);
        const A = C * O;
        r = r.map((j) => ra(j, _, R, A)), c = c.map((j) => ra(j, _, R, A)), h = h.map((j) => ra(j, _, R, A));
      }
      const d = r.map(pt), f = c.map(pt);
      rn = d;
      const p = d.map((C) => H(C)), m = f.map((C) => H(C)), b = p.map((C) => G(C)), g = m.map((C) => G(C)), y = wo(g) - wo(b);
      this._flatRoofBottomCloser === void 0 ? this._flatRoofBottomCloser = y < 0 : y < -0.01 ? this._flatRoofBottomCloser = !0 : y > 0.01 && (this._flatRoofBottomCloser = !1), Ui = !!this._flatRoofBottomCloser;
      const w = je(Se, Tt);
      qt.push({
        type: "flatRoofTop",
        pts: b,
        z: wo(b) - Me,
        fill: w,
        opacity: Re
      });
      const E = [
        {
          id: "front",
          pts: [b[3], b[2], g[2], g[3]],
          cam: [p[3], p[2], m[2], m[3]]
        },
        {
          id: "right",
          pts: [b[2], b[1], g[1], g[2]],
          cam: [p[2], p[1], m[1], m[2]]
        },
        {
          id: "back",
          pts: [b[1], b[0], g[0], g[1]],
          cam: [p[1], p[0], m[0], m[1]]
        },
        {
          id: "left",
          pts: [b[0], b[3], g[3], g[0]],
          cam: [p[0], p[3], m[3], m[0]]
        }
      ], F = [...p, ...m].reduce((C, _) => [C[0] + _[0], C[1] + _[1], C[2] + _[2]], [0, 0, 0]).map((C) => C / 8);
      E.forEach((C) => {
        const _ = ro[C.id] ?? Tt, R = M(_, 0.2, 1), O = Math.min(...C.pts.map((lt) => lt[2])), A = C.cam.reduce((lt, It) => [lt[0] + It[0], lt[1] + It[1], lt[2] + It[2]], [0, 0, 0]).map((lt) => lt / 4), j = gt([A[0] - F[0], A[1] - F[1], A[2] - F[2]]), st = gt([-A[0], -A[1], -Ie - A[2]]);
        Yh(j, st) > -0.02 && qt.push({
          type: `flatRoofEdge-${C.id}`,
          pts: C.pts,
          z: O - Ce,
          fill: je(Se, R),
          opacity: Zo
        });
      });
      const P = ro[V] ?? Tt;
      if (qt.push({
        type: "flatRoofBottom",
        pts: g,
        z: wo(g),
        fill: je(xe, Math.max(0.2, P * we * si)),
        opacity: Zo
      }), Ro) {
        const _ = h.map(pt).map((j) => G(H(j))), R = [jt[3], jt[2], jt[6], jt[7]], O = (j) => {
          const st = ro[j] ?? 1;
          return je(xe, M(st * we, 0.2, 1));
        }, A = (j, st, bt) => {
          const lt = Math.max(...st.map((It) => It[2]));
          qt.push({
            type: bt,
            pts: st,
            // Keep connector skirts behind the roof overhang edges at corner views.
            z: lt + Math.max(Ms, 0.02),
            fill: O(j),
            opacity: za
          });
        };
        V === "front" ? (A("left", [_[0], R[0], _[3]], "flatRoofSkirt-left"), A("right", [_[1], R[1], _[2]], "flatRoofSkirt-right"), A("back", [_[0], _[1], R[1], R[0]], "flatRoofSkirt-back")) : V === "back" ? (A("left", [_[3], R[3], _[0]], "flatRoofSkirt-left"), A("right", [_[2], R[2], _[1]], "flatRoofSkirt-right"), A("front", [_[2], _[3], R[3], R[2]], "flatRoofSkirt-front")) : V === "left" ? (A("front", [_[2], R[2], _[3]], "flatRoofSkirt-front"), A("back", [_[1], R[1], _[0]], "flatRoofSkirt-back"), A("right", [_[1], _[2], R[2], R[1]], "flatRoofSkirt-right")) : V === "right" && (A("front", [_[3], R[3], _[2]], "flatRoofSkirt-front"), A("back", [_[0], R[0], _[1]], "flatRoofSkirt-back"), A("left", [_[0], _[3], R[3], R[0]], "flatRoofSkirt-left")), e > 1e-3 && (V === "front" ? A("front", [_[3], _[2], R[2], R[3]], "flatRoofSkirt-front-low") : V === "back" ? A("back", [_[0], _[1], R[1], R[0]], "flatRoofSkirt-back-low") : V === "left" ? A("left", [_[0], _[3], R[3], R[0]], "flatRoofSkirt-left-low") : V === "right" && A("right", [_[1], _[2], R[2], R[1]], "flatRoofSkirt-right-low"));
      }
      const L = qt.find((C) => C.type === "flatRoofTop"), W = qt.find((C) => C.type === "flatRoofBottom");
      if (ha = Ui || !co, cn = !ha, L && W && (ha ? (L.opacity = 0, W.opacity = Zo) : (L.opacity = Re, W.opacity = 0)), L && cn) {
        const C = qt.filter((_) => _ !== L);
        if (C.length) {
          const _ = Math.min(...C.map((R) => R.z));
          L.z = Math.min(L.z, _ - Math.max(0.015, Me));
        }
      }
      if (W && ha) {
        const C = qt.filter((_) => _ !== W);
        if (C.length) {
          const _ = Math.max(...C.map((R) => R.z));
          W.z = Math.max(W.z, _ + Math.max(0.02, Ce));
        }
      }
    }
    const ln = wt ? cn : co;
    let qe = [];
    Ro && Fl && (V === "front" ? qe = [
      { tri: [Z[0], ct[0], Z[3]], wall: "left" },
      { tri: [Z[1], ct[1], Z[2]], wall: "right" }
    ] : V === "back" ? qe = [
      { tri: [Z[3], ct[3], Z[0]], wall: "left" },
      { tri: [Z[2], ct[2], Z[1]], wall: "right" }
    ] : V === "left" ? qe = [
      { tri: [Z[2], ct[2], Z[3]], wall: "front" },
      { tri: [Z[1], ct[1], Z[0]], wall: "back" }
    ] : V === "right" && (qe = [
      { tri: [Z[3], ct[3], Z[2]], wall: "front" },
      { tri: [Z[0], ct[0], Z[1]], wall: "back" }
    ]));
    const su = qe.map((t) => ({
      pts: t.tri.map((e) => G(ia(e))),
      wall: t.wall
    })), hn = (t) => {
      const e = ro[t] ?? Tt, a = _t[t] ?? _t.top;
      return Mt(a, Al * e);
    }, au = ro[V] ?? Tt, nu = _t[V] ?? _t.top, iu = Mt(nu, si * au), ru = Mt(_t.top, Tt);
    let oe = null, ee = null;
    Ro && Bl && (V === "front" ? (oe = [Z[0], Z[1], ct[1], ct[0]], ee = "back") : V === "back" ? (oe = [Z[2], Z[3], ct[3], ct[2]], ee = "front") : V === "left" ? (oe = [Z[1], Z[2], ct[2], ct[1]], ee = "right") : V === "right" && (oe = [Z[0], Z[3], ct[3], ct[0]], ee = "left"));
    const un = oe ? oe.map((t) => G(ia(t))) : null, cu = hn(ee || V);
    let Lt = [0, 0, -1];
    V === "front" && (Lt = [0, 0, -1]), V === "back" && (Lt = [0, 0, 1]), V === "left" && (Lt = [1, 0, 0]), V === "right" && (Lt = [-1, 0, 0]);
    const se = Z.reduce((t, e) => [t[0] + e[0], t[1] + e[1], t[2] + e[2]], [0, 0, 0]).map((t) => t / 4), ae = 2.2;
    G(ia([
      se[0] - Lt[0] * ae,
      se[1] - Lt[1] * ae,
      se[2] - Lt[2] * ae
    ])), G(ia([
      se[0] + Lt[0] * ae,
      se[1] + Lt[1] * ae,
      se[2] + Lt[2] * ae
    ]));
    const X = -1, fn = -1, ji = [
      [-ot, X, -ot],
      [ot, X, -ot],
      [ot, X, ot],
      [-ot, X, ot]
    ].map(H).map(G);
    let dn = null;
    if (Ra) {
      const t = 1 + Math.max(0, kc);
      dn = [0, 1, 5, 4].map((i) => {
        const r = Ut[i];
        return [r[0] * t, X, r[2] * t];
      }).map((i) => G(H(i))).map((i) => i[0] + "," + i[1]).join(" ");
    }
    const lu = Math.min(...ji.map((t) => t[1])), qi = M(lu - 6, tt * 0.32, tt * 0.82);
    this._skyClipBottom === void 0 || this._skyClipCardW !== K || this._skyClipCardH !== tt ? (this._skyClipBottom = qi, this._skyClipVertDeg = xo, this._skyClipCardW = K, this._skyClipCardH = tt) : Math.abs(xo - (this._skyClipVertDeg ?? xo)) > 0.15 && (this._skyClipBottom = qi, this._skyClipVertDeg = xo);
    const Ye = Number(this._skyClipBottom), Mo = [
      en[0] * qo,
      en[1] * qo,
      en[2] * qo
    ], Yi = H(Mo), rt = G(Yi), hu = Ve.reduce((t, e) => t + e[2], 0) / Ve.length, uu = Yi[2] > hu + 0.02, Co = rt[3], fu = Math.max(4, 12 * Co), du = Math.max(3, 8 * Co), pn = M(Jc - xo / 90 * tl, 0.1, 0.9), pu = M(pn - oi, 0, 1), mu = M(pn, 0, 1), bu = M(pn + oi, 0, 1), Yt = (t, e) => {
      const a = Array.isArray(t) ? t : e;
      return [
        M(Number((a == null ? void 0 : a[0]) ?? e[0]), 0, 255),
        M(Number((a == null ? void 0 : a[1]) ?? e[1]), 0, 255),
        M(Number((a == null ? void 0 : a[2]) ?? e[2]), 0, 255)
      ];
    }, ne = (t, e, a) => [
      Math.round(t[0] + (e[0] - t[0]) * a),
      Math.round(t[1] + (e[1] - t[1]) * a),
      Math.round(t[2] + (e[2] - t[2]) * a)
    ], Xi = Number(this._prevSunEl);
    let ie = Number(this._skyTrend);
    if (Number.isFinite(ie) || (ie = -1), Number.isFinite(Xi)) {
      const t = et - Xi;
      t < -0.03 ? ie = -1 : t > 0.03 && (ie = 1);
    }
    this._prevSunEl = et, this._skyTrend = ie;
    const mn = ie < 0, re = Math.max(1, al), bn = M((et + re) / (2 * re), 0, 1), gu = M(1 - Math.abs(et) / re, 0, 1), gn = Math.pow(gu, 0.85), Xe = M((-et + 1.5) / (re + 5), 0, 1), ua = Le ? M((-et - 1.2) / (re + 3), 0, 1) : 0, lo = Da ? M((-et + 0.2) / (re + 2), 0, 1) : 0, yu = M(bl, 0.05, 0.95), $u = M(gl, 0.05, 0.95), ko = yu * K, No = $u * tt, Ot = M(yl, 6, 44), _u = M($l, 0, 1), ce = M(lo * _l, 0, 1), vu = M(wl, 0.5, 89.5), Zi = (Rl + 180) * Math.PI / 180, yn = vu * Math.PI / 180, Su = gt([
      Math.sin(Zi) * Math.cos(yn),
      Math.sin(yn),
      -Math.cos(Zi) * Math.cos(yn)
    ]);
    let Wt = gt(Di(Su));
    Wt[1] < 0.06 && (Wt = gt([Wt[0], 0.06, Wt[2]]));
    const xu = Yt(ol, [120, 170, 220]), wu = Yt(el, [255, 210, 150]), Ru = Yt(sl, [70, 80, 95]), Mu = Yt(nl, [12, 20, 42]), Cu = Yt(il, [32, 44, 82]), ku = Yt(rl, [6, 10, 22]), Nu = Yt(mn ? ul : cl, [108, 128, 188]), Eu = Yt(mn ? fl : ll, [246, 146, 112]), Tu = Yt(mn ? dl : hl, [84, 62, 84]), Fu = ne(Mu, xu, bn), Au = ne(Cu, wu, bn), Bu = ne(ku, Ru, bn), $n = ne(Fu, Nu, gn * 0.82), Du = ne(Au, Eu, gn * 0.95), Ki = ne(Bu, Tu, gn * 0.68), St = ot * (1 - 0.05), fa = 64;
    let le = this._ringUnit;
    (!le || le.length !== fa) && (le = Array.from({ length: fa }, (t, e) => {
      const a = e / fa * qh;
      return [Math.sin(a), Math.cos(a)];
    }), this._ringUnit = le);
    const Qi = Math.min(Pl, St * 0.3), Ji = St - Qi, Pu = St + Qi;
    function _n(t) {
      return le.map(([e, a]) => {
        const n = H([t * e, X, t * a]), i = G(n);
        return i[0] + "," + i[1];
      });
    }
    const zu = _n(Ji), Lu = _n(St), Ou = _n(Pu);
    let tr = [];
    ri && (tr = le.map(([t, e], a) => {
      const n = a % (fa / 4) === 0, i = n ? Vl : Il, r = Ji, c = r - i, h = G(H([c * t, X, c * e])), d = G(H([r * t, X, r * e]));
      return { pIn: h, pOut: d, isMajor: n };
    }));
    const Wu = [["N", 0], ["E", Math.PI / 2], ["S", Math.PI], ["W", 3 * Math.PI / 2]], or = St * (1 - Gl), Iu = Wu.map(([t, e]) => {
      const a = H([or * Math.sin(e), X, or * Math.cos(e)]), n = G(a), i = M(n[3] * Ul, jl, ql);
      return { t, x: n[0], y: n[1], scale: i };
    }), ho = gt([Math.sin(te), 0, Math.cos(te)]), da = gt([Wt[0], 0, Wt[2]]), Vu = H([ho[0] * St * 0.25, X, ho[2] * St * 0.25]), Hu = H([ho[0] * St * 0.95, X, ho[2] * St * 0.95]), Eo = G(Vu), To = G(Hu), Gu = M(Eo[3] * ci, li, hi), vn = M(To[3] * ci, li, hi), Uu = ui * Gu, ju = ui * vn, Fo = Xl * vn, er = [
      { id: "front", label: "Front", normal: [0, 0, 1], pos: [0, X, 1 + qs] },
      { id: "back", label: "Back", normal: [0, 0, -1], pos: [0, X, -1 - qs] },
      { id: "right", label: "Right", normal: [1, 0, 0], pos: [1 + qs, X, 0] },
      { id: "left", label: "Left", normal: [-1, 0, 0], pos: [-1 - qs, X, 0] }
    ], Sn = {}, xn = {};
    er.forEach((t) => {
      const e = H(pt(t.normal));
      Sn[t.id] = e[2] < di;
      const a = sn[t.id];
      if (a) {
        const n = a.indices.map((r) => jt[r]), i = Math.abs(Ja(n));
        xn[t.id] = e[2] < ih && i > rh;
      } else
        xn[t.id] = Sn[t.id];
    });
    let Ze = null;
    const wn = Math.max(0.1, Ml), sr = M((et + wn) / (2 * wn), 0, 1), Rn = zt[1] > 0.01 ? zt : gt([zt[0], 0.01, zt[2]]), qu = et > -wn ? 1 : 0, Yu = Oe && lo > 0.03 && Wt[1] > 0.01 ? 1 : 0, ar = sr * qu, nr = (1 - sr) * Yu, pa = ar + nr, Ke = pa > 1e-6 ? ar / pa : 0, he = pa > 1e-6 ? nr / pa : 0, Mn = Ke > 0 || he > 0 ? gt([
      Rn[0] * Ke + Wt[0] * he,
      Rn[1] * Ke + Wt[1] * he,
      Rn[2] * Ke + Wt[2] * he
    ]) : zt;
    if (wa && (Ke > 0 || he > 0)) {
      const t = [-Mn[0], -Mn[1], -Mn[2]];
      if (Math.abs(t[1]) > 1e-6) {
        const e = [], a = Ro ? Ut.concat(Ue) : Ut;
        for (const i of a) {
          const r = (fn - i[1]) / t[1];
          r >= 0 && e.push({ x: i[0] + t[0] * r, z: i[2] + t[2] * r });
        }
        const n = Wi(e);
        if (n.length >= 3) {
          const i = M(Zn, 0, 0.2), r = ot * (1 - i), c = Jh(n, -r, r, -r, r);
          c.length >= 3 && (Ze = c.map((h) => G(H([h.x, fn, h.z]))));
        }
      }
    }
    const ir = Ze ? Ze.map((t) => t[0] + "," + t[1]).join(" ") : null;
    let Qe = null, Je = null;
    if (Ma && vt) {
      const e = Math.hypot(ot * 2, ot * 2) * Ec, a = [ho[0] * St * 0.95, X, ho[2] * St * 0.95], n = [
        a[0] - ho[0] * e,
        X,
        a[2] - ho[2] * e
      ], i = H(a), r = H(n);
      Qe = G(i), Je = G(r);
    }
    let ts = null, os = null;
    if (Oe && !vt && lo > 0.03) {
      const e = Math.hypot(ot * 2, ot * 2) * Sl, a = [da[0] * St * 0.9, X, da[2] * St * 0.9], n = [
        a[0] - da[0] * e,
        X,
        a[2] - da[2] * e
      ];
      ts = G(H(a)), os = G(H(n));
    }
    const rr = `sv-beam-flow-${Math.round((Na + Ea) * 10)}`, cr = `sv-sun-ray-${Math.round((Ta + Fa) * 10)}`, lr = `sv-cloud-drift-${Math.round(K)}-${Math.round(tt)}`, Xu = Number(o.sunBeamRaySpacingPx ?? 40), Zu = Number(o.sunBeamRayMinSepPx ?? 16), Ku = Number(o.sunBeamSilhouetteMinRays ?? 3), Qu = Number(o.sunBeamSilhouetteMaxRays ?? 7), hr = Ro ? Ut.concat(Ue) : Ut, ur = hr.map((t, e) => {
      const a = H(t), n = G(a);
      return { sourceIdx: e, x: n[0], y: n[1], zCam: a[2], world: t };
    }), yt = tu(
      ur
    ), ue = [], ma = (t, e, a, n = -1, i = [0, 0, 0]) => {
      const r = Math.max(1, Zu) ** 2;
      for (const c of ue) {
        const h = c.x - t, d = c.y - e;
        if (h * h + d * d < r) return;
      }
      ue.push({ x: t, y: e, zCam: a, sourceIdx: n, world: i });
    };
    if (yt.length >= 2) {
      let t = 0;
      for (let a = 0; a < yt.length; a++) {
        const n = (a + 1) % yt.length;
        t += yt[a].x * yt[n].y - yt[n].x * yt[a].y;
      }
      const e = t > 0;
      for (let a = 0; a < yt.length; a++) {
        const n = yt[a], i = yt[(a + 1) % yt.length], r = i.x - n.x, c = i.y - n.y, h = Math.hypot(r, c);
        if (h < 1e-3) continue;
        const d = (n.x + i.x) * 0.5, f = (n.y + i.y) * 0.5;
        let p = e ? c : -c, m = e ? -r : r;
        const b = Math.hypot(p, m) || 1;
        p /= b, m /= b;
        const g = rt[0] - d, y = rt[1] - f;
        if (!(p * g + m * y > 0)) continue;
        ma(n.x, n.y, n.zCam, n.sourceIdx, n.world), ma(i.x, i.y, i.zCam, i.sourceIdx, i.world);
        const E = Math.max(8, Xu), F = Math.max(1, Math.min(4, Math.round(h / E)));
        for (let P = 0; P < F; P++) {
          const L = (P + 1) / (F + 1), W = [
            n.world[0] + (i.world[0] - n.world[0]) * L,
            n.world[1] + (i.world[1] - n.world[1]) * L,
            n.world[2] + (i.world[2] - n.world[2]) * L
          ], C = H(W), _ = G(C);
          ma(_[0], _[1], C[2], -1, W);
        }
      }
    }
    !ue.length && yt.length && yt.forEach((t) => ma(t.x, t.y, t.zCam, t.sourceIdx, t.world)), ue.length > 1 && ue.sort((t, e) => {
      const a = Math.atan2(t.y - rt[1], t.x - rt[0]), n = Math.atan2(e.y - rt[1], e.x - rt[0]);
      return a - n;
    });
    const fr = (t, e) => {
      if (t.length <= e) return t.slice();
      if (e <= 1) return [t[Math.floor(t.length / 2)]];
      const a = [];
      for (let n = 0; n < e; n++) {
        const i = Math.round(n * (t.length - 1) / (e - 1));
        a.push(t[i]);
      }
      return a;
    }, es = Math.max(1, Math.floor(Ku)), dr = Math.max(es, Math.floor(Qu));
    let Ft = ue.slice();
    if (Ft.length > dr && (Ft = fr(Ft, dr)), Ft.length < es) {
      const t = yt.map((e) => ({ x: e.x, y: e.y, zCam: e.zCam, sourceIdx: e.sourceIdx, world: e.world }));
      if (t.length >= es)
        Ft = fr(t, es);
      else if (t.length > 0)
        for (; Ft.length < es; ) {
          const e = t[Ft.length % t.length];
          Ft.push({ x: e.x, y: e.y, zCam: e.zCam, sourceIdx: e.sourceIdx, world: e.world });
        }
    }
    Ft.length || [2, 3, 6, 7].forEach((t) => {
      const e = jt[t], a = Ve[t];
      Ft.push({ x: e[0], y: e[1], zCam: a[2], sourceIdx: t, world: Ut[t] });
    });
    const Cn = /* @__PURE__ */ new Set();
    if (vt) {
      const t = [-zt[0], -zt[1], -zt[2]];
      if (Math.abs(t[1]) > 1e-6) {
        const e = hr.map((a, n) => {
          const i = (fn - a[1]) / t[1];
          return i < 0 ? null : { sourceIdx: n, x: a[0] + t[0] * i, z: a[2] + t[2] * i };
        }).filter((a) => !!a);
        if (e.length >= 3) {
          const a = Wi(e.map((i) => ({ x: i.x, z: i.z }))), n = 1e-4;
          e.forEach((i) => {
            a.some((r) => Math.abs(r.x - i.x) <= n && Math.abs(r.z - i.z) <= n) && Cn.add(i.sourceIdx);
          });
        }
      }
    }
    const pr = ((t) => {
      const e = [], a = /* @__PURE__ */ new Set();
      return t.forEach((n) => {
        const i = `${Math.round(n.x)},${Math.round(n.y)}`;
        a.has(i) || (a.add(i), e.push(n));
      }), e;
    })(
      ur.filter((t) => Cn.has(t.sourceIdx)).map((t) => ({ x: t.x, y: t.y, zCam: t.zCam, sourceIdx: t.sourceIdx, world: t.world }))
    ), kn = pr.length ? pr : Ft, Nn = /* @__PURE__ */ new Map(), mr = (t, e, a, n, i) => {
      const r = `${Math.round(e)},${Math.round(a)}`;
      Nn.has(r) || Nn.set(r, { x: e, y: a, zCam: n, sourceIdx: t, world: i });
    };
    Object.entries(sn).forEach(([t, e]) => {
      H(pt(Vi[t]))[2] >= di || e.indices.forEach((n) => {
        mr(n, jt[n][0], jt[n][1], Ve[n][2], Ut[n]);
      });
    }), co && ca.forEach((t, e) => {
      const a = Ut.length + e;
      mr(a, t[0], t[1], Hi[e][2], Ue[e]);
    });
    let En = Array.from(Nn.values()).filter(
      (t) => Cn.has(t.sourceIdx)
    );
    if (!En.length && kn.length) {
      const t = kn.slice().sort((e, a) => e.zCam - a.zCam);
      En = t.slice(0, Math.min(3, t.length));
    }
    function Ju(t, e) {
      const a = t.length;
      if (a < 3) return "";
      let n = "";
      for (let i = 0; i < a; i++) {
        const r = t[(i - 1 + a) % a], c = t[i], h = t[(i + 1) % a], d = [r[0] - c[0], r[1] - c[1]], f = [h[0] - c[0], h[1] - c[1]], p = Math.hypot(d[0], d[1]), m = Math.hypot(f[0], f[1]);
        if (p === 0 || m === 0) continue;
        const b = Math.min(e, p / 2, m / 2), g = [d[0] / p, d[1] / p], y = [f[0] / m, f[1] / m], w = [c[0] + g[0] * b, c[1] + g[1] * b], E = [c[0] + y[0] * b, c[1] + y[1] * b];
        i === 0 ? n += `M ${w[0]} ${w[1]}` : n += ` L ${w[0]} ${w[1]}`, n += ` Q ${c[0]} ${c[1]} ${E[0]} ${E[1]}`;
      }
      return n + " Z";
    }
    const fe = ji.map((t) => [t[0], t[1]]), ba = Ju(fe, to);
    function tf(t, e, a = 8) {
      const n = t.length;
      if (n < 3) return t.slice();
      const i = [];
      for (let r = 0; r < n; r++) {
        const c = t[(r - 1 + n) % n], h = t[r], d = t[(r + 1) % n], f = [c[0] - h[0], c[1] - h[1]], p = [d[0] - h[0], d[1] - h[1]], m = Math.hypot(f[0], f[1]), b = Math.hypot(p[0], p[1]);
        if (m === 0 || b === 0) continue;
        const g = Math.min(e, m / 2, b / 2), y = [f[0] / m, f[1] / m], w = [p[0] / b, p[1] / b], E = [h[0] + y[0] * g, h[1] + y[1] * g], F = [h[0] + w[0] * g, h[1] + w[1] * g];
        i.length, i.push(E);
        for (let P = 1; P <= a; P++) {
          const L = P / a, W = 1 - L;
          i.push([
            W * W * E[0] + 2 * W * L * h[0] + L * L * F[0],
            W * W * E[1] + 2 * W * L * h[1] + L * L * F[1]
          ]);
        }
      }
      return i;
    }
    const ss = tf(fe, to, 8), br = ss.map((t) => [t[0], t[1] + Io]), gr = [];
    for (let t = 0; t < ss.length; t++) {
      const e = (t + 1) % ss.length;
      gr.push([
        ss[t],
        ss[e],
        br[e],
        br[t]
      ]);
    }
    const Tn = M(Zn, 0, 0.2), ga = fe.reduce((t, e) => [t[0] + e[0], t[1] + e[1]], [0, 0]).map((t) => t / fe.length), of = Tn > 0 ? fe.map((t) => [
      ga[0] + (t[0] - ga[0]) * (1 - Tn),
      ga[1] + (t[1] - ga[1]) * (1 - Tn)
    ]) : fe, mt = [];
    if (ti && mt.push(`<linearGradient id="horizon-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgb(${$n.join(",")})"/>
        <stop offset="${(pu * 100).toFixed(2)}%" stop-color="rgb(${$n.join(",")})"/>
        <stop offset="${(mu * 100).toFixed(2)}%" stop-color="rgb(${Du.join(",")})"/>
        <stop offset="${(bu * 100).toFixed(2)}%" stop-color="rgb(${Ki.join(",")})"/>
        <stop offset="100%" stop-color="rgb(${Ki.join(",")})"/>
      </linearGradient>`), (ze || Le && ua > 0.01 || Da && lo > 0.03) && mt.push(`<clipPath id="sky-cloud-clip"><rect x="0" y="0" width="${K}" height="${Ye}"/></clipPath>`), ze && mt.push(`<filter id="sky-cloud-blur" x="-30%" y="-40%" width="160%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Math.max(0, Uc)}"/>
      </filter>`), mt.push(`<radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,200,0.85)"/>
      <stop offset="70%" stop-color="rgba(255,255,150,0.35)"/>
      <stop offset="100%" stop-color="rgba(255,255,100,0)"/>
    </radialGradient>`), mt.push(`<linearGradient id="ceiling-grad" x1="0" y1="1" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${Mt(_t.top, Kc * Tt)}"/>
      <stop offset="100%" stop-color="${Mt(_t.top, Qc * Tt)}"/>
    </linearGradient>`), Go && Q > 1e-3 && mt.push(`<linearGradient id="floor-grass-grad" x1="0" y1="0.1" x2="1" y2="0.95" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="${mo}" stop-opacity="${M(Q * 0.55, 0, 1)}"/>
        <stop offset="55%" stop-color="${Bt}" stop-opacity="${M(Q, 0, 1)}"/>
        <stop offset="100%" stop-color="${mo}" stop-opacity="${M(Q * 0.42, 0, 1)}"/>
      </linearGradient>`), wa && ir && (mt.push(`<filter id="shadow-blur-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${xc}"/>
      </filter>`), mt.push(`<filter id="shadow-blur-contact" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Rc}"/>
      </filter>`)), Ra && mt.push(`<filter id="base-anchor-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Cc}"/>
      </filter>`), fi && mt.push(`<filter id="floor-pointer-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Zl}"/>
      </filter>`), Pe && mt.push(`<filter id="back-tree-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Ls}"/>
      </filter>`), Ma && vt && Qe && Je && mt.push(`<linearGradient id="sunlight-grad" x1="${Qe[0]}" y1="${Qe[1]}"
                  x2="${Je[0]}" y2="${Je[1]}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="rgb(${Ca.join(",")})" stop-opacity="${Kn}"/>
          <stop offset="55%" stop-color="rgb(${Ca.join(",")})" stop-opacity="${Kn * 0.45}"/>
          <stop offset="100%" stop-color="rgb(${Ca.join(",")})" stop-opacity="0"/>
        </linearGradient>`), Oe && !vt && ts && os) {
      const t = Array.isArray(js) ? js : [178, 208, 255], e = M(vl * lo, 0, 1);
      mt.push(`<linearGradient id="moonlight-grad" x1="${ts[0]}" y1="${ts[1]}"
                  x2="${os[0]}" y2="${os[1]}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="rgb(${t.join(",")})" stop-opacity="${e}"/>
          <stop offset="60%" stop-color="rgb(${t.join(",")})" stop-opacity="${e * 0.35}"/>
          <stop offset="100%" stop-color="rgb(${t.join(",")})" stop-opacity="0"/>
        </linearGradient>`);
    }
    ei && mt.push(`<radialGradient id="vignette" cx="50%" cy="50%" r="${kl}">
        <stop offset="0%" stop-color="rgb(${Pa.join(",")})" stop-opacity="0"/>
        <stop offset="${(Nl * 100).toFixed(1)}%" stop-color="rgb(${Pa.join(",")})" stop-opacity="0"/>
        <stop offset="100%" stop-color="rgb(${Pa.join(",")})" stop-opacity="${Cl}"/>
      </radialGradient>`);
    const Ao = [];
    if (ka && vt && Ao.push(`
        @keyframes ${rr} {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -${Na + Ea}; }
        }
        .sv-beam-flow {
          animation-name: ${rr};
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .sv-css-limit .sv-beam-flow {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `), ze) {
      const e = K + 140;
      Ao.push(`
        @keyframes ${lr} {
          0% { transform: translateX(-140px); }
          100% { transform: translateX(${e}px); }
        }
        .sv-sky-cloud {
          animation-name: ${lr};
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .sv-css-limit .sv-sky-cloud {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `);
    }
    Ya && Ao.push(`
        @keyframes ${cr} {
          0%, 100% { transform: scaleX(var(--ray-min-scale, 0.45)); }
          50% { transform: scaleX(var(--ray-max-scale, 1.0)); }
        }
        .sv-sun-ray {
          animation-name: ${cr};
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          transform-origin: 0px 0px;
          will-change: transform;
        }
        .sv-css-limit .sv-sun-ray {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `);
    const yr = `sv-star-twinkle-${Math.round(K)}-${Math.round(tt)}`;
    Le && Xa && Ao.push(`
        @keyframes ${yr} {
          0%, 100% { opacity: calc(var(--star-op, 0.7) * 0.22); }
          50% { opacity: var(--star-op, 0.7); }
        }
        .sv-star {
          animation-name: ${yr};
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .sv-css-limit .sv-star {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `), (ka || ze || Ya || Le && Xa) && Ao.push(`
        .sv-css-global .sv-beam-flow,
        .sv-css-global .sv-sun-ray,
        .sv-css-global .sv-sky-cloud,
        .sv-css-global .sv-star {
          animation-play-state: paused !important;
          animation-delay: calc(var(--sv-phase-delay, 0s) - (var(--sv-global-time, 0) * 1s)) !important;
        }
        .sv-css-pause .sv-beam-flow,
        .sv-css-pause .sv-sun-ray,
        .sv-css-pause .sv-sky-cloud,
        .sv-css-pause .sv-star {
          animation-play-state: paused !important;
        }
      `), Ao.length && mt.push(`<style><![CDATA[
        ${Ao.join(`
`)}
        @media (prefers-reduced-motion: reduce) {
          .sv-beam-flow, .sv-sun-ray { animation: none !important; }
        }
      ]]></style>`);
    const $ = [], ef = `${ut ? "sv-css-limit sv-css-global " : ""}${Uh ? "sv-css-pause " : ""}sv-scene`.trim(), sf = Number(this._cssGlobalTimeSec || 0);
    if ($.push(`<svg class="${ef}" style="--sv-global-time:${sf.toFixed(3)}" viewBox="0 0 ${K} ${tt}" width="${Kt}" height="${Qt}" preserveAspectRatio="xMidYMid meet"><defs>${mt.join("")}</defs>`), ti && $.push(`<rect x="0" y="0" width="${K}" height="${tt}" fill="url(#horizon-grad)"/>`), Le && ua > 0.01 && Us > 0) {
      let t = this._skyStars;
      if (!Array.isArray(t) || t.length !== Us) {
        let a = 2166136261 ^ Math.round(K * 13 + tt * 17 + Us * 31);
        const n = () => (a ^= a << 13, a >>>= 0, a ^= a >> 17, a >>>= 0, a ^= a << 5, a >>>= 0, (a >>> 0) / 4294967295);
        t = Array.from({ length: Us }, () => ({
          x: 0.04 + n() * 0.92,
          y: 0.06 + n() * 0.86,
          r: 0.55 + n() * 1.25,
          a: 0.35 + n() * 0.65,
          dur: 1.2 + n() * 2.2,
          phase: n() * 2.2
        })), this._skyStars = t;
      }
      const e = Ye * 0.97;
      $.push('<g clip-path="url(#sky-cloud-clip)">'), t.forEach((a) => {
        const n = a.x * K, i = a.y * e, r = a.r * (0.85 + ua * 0.35), c = M(ua * ml * a.a, 0, 1);
        if (Xa) {
          const h = Math.max(1.2, Number(a.dur)), d = Number(a.phase) || 0, f = ut ? Ks(h, d) : Zs(h, d), p = ut ? Math.max(1, Math.round(h * io)) : 0;
          $.push(`<circle class="sv-star" cx="${n}" cy="${i}" r="${r}"
            fill="rgba(242,246,255,0.98)"
            style="--star-op:${c};animation-duration:${h.toFixed(2)}s;--sv-phase-delay:${f.toFixed(3)}s;animation-delay:${f.toFixed(3)}s;--sv-steps:${p}"/>`);
        } else
          $.push(`<circle cx="${n}" cy="${i}" r="${r}" fill="rgba(242,246,255,${c})"/>`);
      }), $.push("</g>");
    }
    if (Da && lo > 0.03) {
      const t = Ot * (_u * 2), e = `rgb(${$n.join(",")})`, a = `moon-disc-clip-${Math.round(ko)}-${Math.round(No)}-${Math.round(Ot)}`;
      $.push(`<defs><clipPath id="${a}"><circle cx="${ko}" cy="${No}" r="${Ot}"/></clipPath></defs>`), $.push(`<circle cx="${ko}" cy="${No}" r="${Ot * 1.25}" fill="rgba(196,206,255,${ce * 0.22})"/>`), $.push(`<g clip-path="url(#${a})">`), $.push(`<circle cx="${ko}" cy="${No}" r="${Ot}" fill="rgba(238,244,255,${ce})"/>`), $.push(`<circle cx="${ko + t}" cy="${No}" r="${Ot * 0.98}" fill="${e}" opacity="${ce * 0.98}"/>`);
      const n = ko - Ot * 0.34, i = No + Ot * 0.3, r = Ot * 0.24;
      $.push(`<circle cx="${n}" cy="${i}" r="${r}" fill="rgba(152,162,180,${ce * 0.72})"/>`), $.push(`<circle cx="${n + r * 0.14}" cy="${i + r * 0.16}" r="${r * 0.64}" fill="rgba(90,102,122,${ce * 0.42})"/>`), $.push("</g>"), $.push(`<circle cx="${ko}" cy="${No}" r="${Ot}" fill="none" stroke="rgba(255,255,255,${ce * 0.32})" stroke-width="1"/>`);
    }
    if (ze) {
      const t = M(jc, 0, 1), e = [0.3, 0.42, 0.24], a = [0.46, 0.6, 0.38], n = [
        { y: Ye * (e[0] + (a[0] - e[0]) * t), s: 0.76 * Aa, dur: 38 / Math.max(0.2, Ba), phase: 0.12 },
        { y: Ye * (e[1] + (a[1] - e[1]) * t), s: 1 * Aa, dur: 56 / Math.max(0.2, Ba), phase: 0.48 },
        { y: Ye * (e[2] + (a[2] - e[2]) * t), s: 0.66 * Aa, dur: 76 / Math.max(0.2, Ba), phase: 0.78 }
      ];
      $.push('<g clip-path="url(#sky-cloud-clip)">'), n.forEach((i) => {
        const r = 1 - 0.35 * Xe, c = M(Jn * r, 0, 1), h = M(Jn * 0.75 * r, 0, 1);
        [-(i.phase * i.dur), -((i.phase + 0.5) * i.dur)].forEach((f) => {
          $.push(`<g transform="translate(0 ${i.y}) scale(${i.s})">`);
          const p = Js ? 6 : ut ? 3 : 1, m = i.dur * p, b = ut ? Math.max(1, Math.round(m * io)) : 0, g = -f, y = ut ? Ks(m, g) : Zs(m, g);
          $.push(`<g class="sv-sky-cloud" style="animation-duration:${m}s;--sv-phase-delay:${y.toFixed(3)}s;animation-delay:${y.toFixed(3)}s;--sv-steps:${b}">`), $.push('<g filter="url(#sky-cloud-blur)">'), $.push(`<ellipse cx="0" cy="0" rx="52" ry="20" fill="rgba(255,255,255,${c})"/>`), $.push(`<ellipse cx="28" cy="-12" rx="36" ry="17" fill="rgba(255,255,255,${h})"/>`), $.push(`<ellipse cx="-26" cy="-10" rx="30" ry="15" fill="rgba(255,255,255,${h})"/>`), $.push(`<ellipse cx="64" cy="-4" rx="24" ry="12" fill="rgba(255,255,255,${h * 0.95})"/>`), $.push("</g>"), $.push("</g>"), $.push("</g>");
        });
      }), $.push("</g>");
    }
    const af = () => {
      const t = To[0] - Eo[0], e = To[1] - Eo[1], a = Math.hypot(t, e);
      if (a <= 1e-3) return;
      const n = -e / a, i = t / a, r = t / a, c = e / a, h = To[0] - r * Fo, d = To[1] - c * Fo, f = [h + n * Fo * 0.62, d + i * Fo * 0.62], p = [h - n * Fo * 0.62, d - i * Fo * 0.62], m = Math.max(0.8, Uu * 0.55 + ju * 0.75), b = [
        [To[0], To[1]],
        [p[0], p[1]],
        [f[0], f[1]]
      ], g = b.map((w) => `${w[0]},${w[1]}`).join(" "), y = Math.max(1.1, Fo * 0.16);
      if (fi) {
        const w = Kl * vn, E = w * 0.55, F = w * 0.75, L = b.map((W) => [W[0] + E, W[1] + F]).map((W) => `${W[0]},${W[1]}`).join(" ");
        $.push(`<line x1="${Eo[0] + E}" y1="${Eo[1] + F}" x2="${h + E}" y2="${d + F}"
          stroke="${Qo}" stroke-opacity="${M(Oa, 0, 1)}" stroke-width="${m}"
          stroke-linecap="round" filter="url(#floor-pointer-shadow-blur)"/>`), $.push(`<polygon points="${L}" fill="${Qo}" fill-opacity="${M(Oa * 0.95, 0, 1)}"
          stroke="${Qo}" stroke-opacity="${M(Oa * 0.95, 0, 1)}"
          stroke-width="${y}" stroke-linejoin="round" filter="url(#floor-pointer-shadow-blur)"/>`);
      }
      $.push(`<line x1="${Eo[0]}" y1="${Eo[1]}" x2="${h}" y2="${d}"
        stroke="${La}" stroke-width="${m}" stroke-linecap="round" opacity="0.92"/>`), $.push(`<polygon points="${g}" fill="${La}" opacity="0.95"
        stroke="${La}" stroke-width="${y}" stroke-linejoin="round"/>`);
    }, nf = () => {
      if (!N) return;
      const t = M(q, 0.8, 1.9), e = Math.max(0.08, B), a = 1 + Hs, n = a + e, i = X + 5e-4, r = (g) => G(H(pt(g))), c = r([-t / 2, i, a]), h = r([t / 2, i, a]), d = r([t / 2, i, n]), f = r([-t / 2, i, n]);
      $.push(`<polygon points="${c[0]},${c[1]} ${h[0]},${h[1]} ${d[0]},${d[1]} ${f[0]},${f[1]}"
        fill="${Gs}" opacity="0.9"/>`);
      const p = (g, y, w) => [g[0] + (y[0] - g[0]) * w, g[1] + (y[1] - g[1]) * w];
      [0.25, 0.5, 0.75].forEach((g) => {
        const y = p(c, h, g), w = p(f, d, g);
        $.push(`<line x1="${y[0]}" y1="${y[1]}" x2="${w[0]}" y2="${w[1]}"
          stroke="${Yn}" stroke-width="${Xn}" opacity="0.65"/>`);
      });
      const m = p(c, f, 0.5), b = p(h, d, 0.5);
      $.push(`<line x1="${m[0]}" y1="${m[1]}" x2="${b[0]}" y2="${b[1]}"
        stroke="${Yn}" stroke-width="${Xn}" opacity="0.65"/>`);
    };
    if (Io > 0.1 && gr.forEach((t, e) => {
      const a = t.map((i) => `${i[0]},${i[1]}`).join(" "), n = M(0.86 - e * 0.08, 0.62, 0.9);
      $.push(`<polygon points="${a}" fill="${ye}" opacity="${n}"/>`);
    }), $.push(`<path d="${ba}" fill="${Jt}" stroke="${Vo}" stroke-width="${Ho}"/>`), Go && Q > 1e-3 && $.push(`<path d="${ba}" fill="url(#floor-grass-grad)"/>`), nf(), Ma && vt && Qe && Je && $.push(`<path d="${ba}" fill="url(#sunlight-grad)"/>`), Oe && !vt && ts && os && $.push(`<path d="${ba}" fill="url(#moonlight-grad)"/>`), wa && ir) {
      const t = Ze ? Ze.map((a) => [a[0], a[1]]) : [], e = Zh(t, of);
      if (e.length >= 3) {
        const a = e.map((i) => i[0] + "," + i[1]).join(" "), n = 1 - 0.4 * he;
        $.push(`<polygon points="${a}" fill="${Qo}" opacity="${Sc * n}" filter="url(#shadow-blur-soft)"/>`), $.push(`<polygon points="${a}" fill="${Qo}" opacity="${wc * n}" filter="url(#shadow-blur-contact)"/>`);
      }
    }
    af(), Ra && dn && $.push(`<polygon points="${dn}" fill="${Nc}" opacity="${Mc}" filter="url(#base-anchor-shadow-blur)"/>`), $.push(`<polygon points="${zu.join(" ")}" fill="none" stroke="${ni}" stroke-width="${ii}" stroke-linecap="round"/>`), $.push(`<polygon points="${Lu.join(" ")}" fill="none" stroke="${zl}" stroke-width="${Dl}" stroke-linecap="round"/>`), $.push(`<polygon points="${Ou.join(" ")}" fill="none" stroke="${ni}" stroke-width="${ii}" stroke-linecap="round"/>`), ri && tr.forEach((t) => {
      const e = t.isMajor ? Wl : Ol;
      $.push(`<line x1="${t.pIn[0]}" y1="${t.pIn[1]}" x2="${t.pOut[0]}" y2="${t.pOut[1]}" stroke="${Ll}" stroke-width="${e}"/>`);
    }), Iu.forEach((t) => {
      $.push(`<text x="${t.x}" y="${t.y}" fill="white"
        font-size="${Hl * t.scale}"
        stroke="rgba(0,0,0,0.6)" stroke-width="${Yl * t.scale}"
        font-weight="700" text-anchor="middle">${t.t}</text>`);
    });
    const rf = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    };
    er.forEach((t) => {
      const e = rf[t.id];
      if (!e) return;
      const a = pt(e), n = pt(t.pos), i = t.id === "front" || t.id === "left" ? e.map((g) => -g) : e, r = pt(i), c = Oi(n, a, Qh(a), r, !1);
      if (!c) return;
      const { basis: h, centerScr: d } = c, f = M(d[3] * Jl, th, oh), p = Ql * f, m = nh * f, b = d[1] - eh * f;
      $.push(`<text x="0" y="0"
        fill="${sh}"
        font-size="${p}"
        stroke="${ah}"
        stroke-width="${m}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${h.bx} ${h.by} ${h.ux} ${h.uy} ${d[0]} ${b})">${t.label}</text>`);
    });
    const cf = Number(this._cssGlobalTimeSec || Si), lf = Math.floor(cf / 1.6);
    let $r = Js ? 1 : 0;
    const _r = (t, e = 1, a = 1) => {
      const n = t.length > 0 ? (lf % t.length + t.length) % t.length : -1;
      t.forEach((i, r) => {
        const c = M(
          Ie / (Ie + i.zCam) * Lc,
          Oc,
          Wc
        ), h = Math.max(0.7, Fc * Co * c), d = M(Tc * a * c, 0, 1);
        $.push(`<line x1="${rt[0]}" y1="${rt[1]}" x2="${i.x}" y2="${i.y}"
          stroke="rgba(255,255,150,${d})" stroke-width="${h}"/>`);
        let f = !1;
        if (Js)
          f = $r > 0 && r === n, f && ($r -= 1);
        else {
          const p = r % 3 !== 2, m = !ut || r % 2 === 0;
          f = p && m;
        }
        if (ka && vt && f) {
          const p = Math.max(0.6, h * Dc), m = Math.max(0.2, Pc), b = r * zc, g = ut ? Ks(m, b) : Zs(m, b), y = M(Bc * e * c, 0, 1), w = ut ? Math.max(1, Math.round(m * io)) : 0;
          $.push(`<line x1="${rt[0]}" y1="${rt[1]}" x2="${i.x}" y2="${i.y}"
            class="sv-beam-flow"
            style="animation-duration:${m}s;--sv-phase-delay:${g.toFixed(3)}s;animation-delay:${g.toFixed(3)}s;--sv-steps:${w}"
            stroke="${Ac}" stroke-opacity="${y}" stroke-width="${p}"
            stroke-linecap="round" stroke-dasharray="${Na} ${Ea}" stroke-dashoffset="0"/>`);
        }
      });
    };
    vt && _r(kn);
    const hf = ou.map((t) => {
      const e = t.i.map((i) => jt[i]), a = ro[t.id] ?? 1, n = Mt(t.c, a);
      return { type: "cube", id: t.id, pts: e, z: wo(e), fill: n, opacity: 1 };
    }), de = [];
    wt || (su.forEach((t) => {
      const e = Math.min(...t.pts.map((a) => a[2]));
      de.push({
        type: "roofSide",
        pts: t.pts,
        // Use nearest point depth so side panels do not fall behind adjacent wall triangles.
        z: e - ai,
        fill: hn(t.wall),
        opacity: za
      });
    }), un && de.push({
      type: "roofCap",
      pts: un,
      z: wo(un) + ai * 0.35,
      fill: cu,
      opacity: za
    }));
    let pe = wo(ca);
    if (de.length) {
      const t = Math.min(...de.map((a) => a.z)), e = Math.max(...de.map((a) => a.z));
      co ? pe = Math.min(pe, t - 0.02) : pe = Math.max(pe, e + 0.02);
    } else
      pe += co ? -1e-3 : 1e-3;
    const vr = !wt && $o && (co || El) ? {
      type: "roofPlane",
      pts: ca,
      z: pe,
      fill: co ? ru : iu,
      opacity: co ? Ss : Tl
    } : null, Sr = hf.concat(de).concat(qt).concat(vr ? [vr] : []).sort((t, e) => {
      const a = e.z - t.z, n = String((t == null ? void 0 : t.type) || ""), i = String((e == null ? void 0 : e.type) || ""), r = n.startsWith("flatRoofEdge-"), c = i.startsWith("flatRoofEdge-"), h = n.startsWith("flatRoofSkirt-"), d = i.startsWith("flatRoofSkirt-");
      if (r && c || h && d || (n === "roofSide" || n === "roofCap") && (i === "roofSide" || i === "roofCap")) {
        if (Math.abs(a) > 1e-6) return a;
      } else if (Math.abs(a) > 0.015)
        return a;
      const m = (g) => {
        const y = String((g == null ? void 0 : g.type) || "");
        return y.startsWith("flatRoofSkirt-") ? 0.7 : y === "roofCap" ? 0.9 : y === "flatRoofTop" || y === "roofPlane" ? 1 : y === "cube" ? 1.4 : y === "roofSide" ? 1.55 : y.startsWith("flatRoofEdge-") ? 1.8 : y === "flatRoofBottom" ? 3 : 1;
      }, b = m(t) - m(e);
      return Math.abs(b) > 1e-6 ? b : a;
    }), uf = (t, e) => {
      if (!Ws || !(t === "front" || t === "right" || t === "back" || t === "left") || !e || e.length < 4) return;
      const a = e[0], n = e[1], i = e[2], r = e[3], c = (m, b, g) => [m[0] + (b[0] - m[0]) * g, m[1] + (b[1] - m[1]) * g], h = M(Is, 0.015, 0.22), d = c(a, r, h), f = c(n, i, h), p = Mt(_t[t], (ro[t] ?? 1) * M(Vs, 0.2, 1.2));
      $.push(`<polygon points="${a[0]},${a[1]} ${n[0]},${n[1]} ${f[0]},${f[1]} ${d[0]},${d[1]}"
        fill="${p}" opacity="0.95"/>`);
    }, ff = (t) => {
      if (!pi || !xn[t]) return;
      const e = eu[t], a = Vi[t];
      if (!e || !a) return;
      const n = t === "front" || t === "left" ? e.map((F) => -F) : e;
      let i = 0, r = 0, c = 0;
      sn[t].indices.forEach((F) => {
        const P = Ii[F];
        i += P[0], r += P[1], c += P[2];
      }), i /= 4, r /= 4, c /= 4, r = M(ch, -0.9, 0.9);
      const h = [
        i + a[0] * Va,
        r + a[1] * Va,
        c + a[2] * Va
      ], d = pt(h), f = pt(e), p = pt(n), m = Oi(d, f, [0, 1, 0], p, !1);
      if (!m) return;
      const { basis: b, centerScr: g } = m, y = M(g[3] * lh, hh, uh), w = Wa * y, E = Ia * y;
      $.push(`<text x="0" y="0"
        fill="${mi}"
        font-size="${w}"
        stroke="${bi}"
        stroke-width="${E}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${b.bx} ${b.by} ${b.ux} ${b.uy} ${g[0]} ${g[1]})">${Pi(He[t])}</text>`);
    }, df = () => {
      if (!mh || !Sn.front) return;
      const t = -Ha / 2, e = Ha / 2, a = M(-1 + bh, -1, 1), n = M(a + gi, -1, 1), i = 1 + gh, r = (F) => G(H(pt(F))), d = [
        [t, a, i],
        [e, a, i],
        [e, n, i],
        [t, n, i]
      ].map(r).map((F) => `${F[0]},${F[1]}`).join(",");
      $.push(`<polygon points="${d}" fill="${$h}" opacity="${yi}"/>`);
      const f = Math.min(0.08, Math.max(0.04, Ha * 0.14)), p = Math.min(0.08, Math.max(0.04, gi * 0.1)), g = [
        [t + f, a + p, i + 3e-3],
        [e - f, a + p, i + 3e-3],
        [e - f, n - p, i + 3e-3],
        [t + f, n - p, i + 3e-3]
      ].map(r).map((F) => `${F[0]},${F[1]}`).join(",");
      $.push(`<polygon points="${g}" fill="${yh}" opacity="${yi}"/>`);
      const y = [e - f - 0.05, a + (n - a) * 0.45, i + 6e-3], w = r(y), E = Math.max(0.6, w[3]);
      $.push(`<circle cx="${w[0]}" cy="${w[1]}" r="${1.8 * E}" fill="${_h}" opacity="0.95"/>`);
    }, pf = (t, e) => {
      if (!Cs || !(t === "left" || t === "right" || t === "back") || !e || e.length < 4) return;
      const a = M(ro[t] ?? 1, 0.2, 1), n = e[0], i = e[1], r = e[2], c = e[3], h = (R, O, A) => [R[0] + (O[0] - R[0]) * A, R[1] + (O[1] - R[1]) * A], d = (R, O) => {
        const A = h(n, c, O), j = h(i, r, O);
        return h(A, j, R);
      }, f = t === "back" ? 0.2 : 0.24, p = t === "back" ? 0.8 : 0.76, m = 0.2, b = m + (0.74 - m) * 0.75, y = [
        d(f, m),
        d(p, m),
        d(p, b),
        d(f, b)
      ].map((R) => `${R[0]},${R[1]}`).join(",");
      $.push(`<polygon points="${y}" fill="${ks}" opacity="${0.98 * a}"/>`);
      const w = 0.035, E = 0.05, P = [
        d(f + w, m + E),
        d(p - w, m + E),
        d(p - w, b - E),
        d(f + w, b - E)
      ].map((R) => `${R[0]},${R[1]}`).join(",");
      $.push(`<polygon points="${P}" fill="${Ns}" opacity="${0.95 * a}"/>`);
      const L = d((f + p) * 0.5, m + E), W = d((f + p) * 0.5, b - E);
      $.push(`<line x1="${L[0]}" y1="${L[1]}" x2="${W[0]}" y2="${W[1]}"
        stroke="${Es}" stroke-width="${ke}" opacity="${0.9 * a}"/>`);
      const C = d(f + w * 1.4, m + E * 1.2), _ = d(p - w * 1.6, b - E * 1.3);
      $.push(`<line x1="${C[0]}" y1="${C[1]}" x2="${_[0]}" y2="${_[1]}"
        stroke="rgba(255,255,255,0.32)" stroke-width="${Math.max(0.8, ke * 0.9)}" opacity="${a}"/>`);
    }, ya = Di([0, 0, -1]), xr = Math.hypot(vo, So), wr = Math.hypot(ya[0], ya[2]), Fn = xr > 1e-6 && wr > 1e-6 && (vo * ya[0] + So * ya[2]) / (xr * wr) < 0;
    function Rr(t, e) {
      if (!Be || !Pe) return;
      const a = (E) => G(H(E)), n = vo, i = So, r = M(De, 0.4, 2.5), c = [n, X + 0.35 * r, i];
      let h = !0;
      if (Fn)
        h = !1;
      else if (e) {
        const E = H(c), F = G(E), P = e(F[0], F[1]);
        h = P == null || E[2] <= P - 8e-3;
      }
      if (t === "front" !== h) return;
      const d = a([n, X, i]), f = a([n, X + 0.86 * r, i]), p = Math.max(2.6, 8.5 * f[3] * r), m = M(1 + Os * 10, 0.6, 2.5), b = Math.max(2.2, p * 0.62 * m), g = Math.max(1.1, p * 0.24 * m), y = d[0], w = d[1] + g * 0.28;
      $.push(`<ellipse cx="${y}" cy="${w}" rx="${b}" ry="${g}"
        fill="${Qo}" opacity="${M(zs, 0, 1)}" filter="url(#back-tree-shadow-blur)"/>`);
    }
    function Mr(t, e) {
      if (!Be) return;
      const a = (C) => G(H(C)), n = (C) => {
        if (Fn) return !1;
        if (!e) return !0;
        const _ = H(C), R = G(_), O = e(R[0], R[1]);
        return O == null || _[2] <= O - 8e-3;
      }, i = (C, _, R, O) => {
        if (Fn) return !1;
        if (!e) return !0;
        const A = [
          [0.92, 0],
          [-0.92, 0],
          [0, 0.92],
          [0, -0.92],
          [0.66, 0.66],
          [-0.66, 0.66],
          [0.66, -0.66],
          [-0.66, -0.66]
        ];
        let j = 0;
        for (const [bt, lt] of A) {
          const It = e(_ + bt * O, R + lt * O);
          (It == null || C <= It - 8e-3) && j++;
        }
        return j / A.length >= 0.4;
      }, r = vo, c = So, h = M(De, 0.4, 2.5), d = M(1 - 0.55 * Xe, 0.35, 1), f = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(ao) ? Mt(ao, 0.72 * d) : ao, p = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(ao) ? Mt(ao, 1.18 - 0.4 * Xe) : "rgba(255,255,255,0.30)", m = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(no) ? Mt(no, 0.72 * d) : no, b = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(no) ? Mt(no, 1.2 - 0.45 * Xe) : "rgba(255,255,255,0.25)", g = M(1 - 0.3 * Xe, 0.55, 1), y = a([r, X, c]), w = a([r, X + 0.86 * h, c]), E = Math.max(2.6, 8.5 * w[3] * h), F = [
        [r, X + 0.22 * h, c],
        [r, X + 0.45 * h, c],
        [r, X + 0.72 * h, c]
      ];
      let P = 0;
      F.forEach((C) => {
        n(C) && P++;
      });
      const L = P / F.length >= 0.4;
      if (t === "front" === L) {
        const C = w[0] - y[0], _ = w[1] - y[1], R = Math.max(1e-3, Math.hypot(C, _)), O = -_ / R, A = C / R, j = Math.max(0.35, E * 0.12);
        $.push(`<line x1="${y[0]}" y1="${y[1]}" x2="${w[0]}" y2="${w[1]}"
          stroke="${m}" stroke-width="${E}" stroke-linecap="round" opacity="${g}"/>`), $.push(`<line x1="${y[0] + O * j}" y1="${y[1] + A * j}" x2="${w[0] + O * j}" y2="${w[1] + A * j}"
          stroke="${b}" stroke-width="${Math.max(1.1, E * 0.36)}" stroke-linecap="round" opacity="${0.55 * g}"/>`);
      }
      [
        [r, X + 1.02 * h, c, 0.28],
        [r - 0.18 * h, X + 0.9 * h, c + 0.06 * h, 0.22],
        [r + 0.2 * h, X + 0.86 * h, c - 0.07 * h, 0.2]
      ].forEach((C) => {
        const _ = a([C[0], C[1], C[2]]), R = H([C[0], C[1], C[2]]), O = Math.max(6, $t * C[3] * _[3] * 0.95), A = i(R[2], _[0], _[1], O * 0.92);
        t === "front" === A && ($.push(`<circle cx="${_[0]}" cy="${_[1]}" r="${O}" fill="${f}" opacity="${g}"/>`), $.push(`<circle cx="${_[0] - O * 0.2}" cy="${_[1] - O * 0.24}" r="${O * 0.62}" fill="${p}" opacity="${0.52 * g}"/>`), $.push(`<circle cx="${_[0] + O * 0.28}" cy="${_[1] + O * 0.22}" r="${O * 0.52}" fill="${f}" opacity="${0.26 * g}"/>`));
      });
    }
    const Cr = () => {
      const t = wt && rn ? rn : Ue, e = {
        front: { low: [3, 2], high: [0, 1] },
        back: { low: [0, 1], high: [3, 2] },
        left: { low: [0, 3], high: [1, 2] },
        right: { low: [1, 2], high: [0, 3] }
      }, a = e[V] ?? e.front;
      let n = t[a.low[0]], i = t[a.low[1]], r = t[a.high[0]], c = t[a.high[1]];
      if (!n || !i || !r || !c) return null;
      if (V === "front" || V === "back") {
        if (i[0] < n[0]) {
          const m = n;
          n = i, i = m;
          const b = r;
          r = c, c = b;
        }
      } else if (i[2] < n[2]) {
        const m = n;
        n = i, i = m;
        const b = r;
        r = c, c = b;
      }
      const h = Math.hypot(i[0] - n[0], i[1] - n[1], i[2] - n[2]), d = [(n[0] + i[0]) / 2, (n[1] + i[1]) / 2, (n[2] + i[2]) / 2], f = [(r[0] + c[0]) / 2, (r[1] + c[1]) / 2, (r[2] + c[2]) / 2], p = Math.hypot(f[0] - d[0], f[1] - d[1], f[2] - d[2]);
      return !isFinite(h) || !isFinite(p) || h <= 1e-6 || p <= 1e-6 ? null : { lowA: n, lowB: i, highA: r, highB: c, worldEdgeLen: h, roofHeightWorld: p };
    }, mf = () => {
      if (!Ts || !$o || !ln) return;
      const t = Cr();
      if (!t) return;
      const { lowA: e, lowB: a, highA: n, highB: i } = t, r = Math.min(Ee, Te), c = Math.max(Ee, Te), h = Ds, d = Ps, f = (1 - h) / 2, p = h, m = d * Math.max(0, Ko - 1), b = (p - m) / Ko;
      if (!isFinite(b) || b <= 0.01) return;
      const g = (P, L, W) => [P[0] + (L[0] - P[0]) * W, P[1] + (L[1] - P[1]) * W, P[2] + (L[2] - P[2]) * W], y = (P, L) => {
        const W = g(e, n, L), C = g(a, i, L), _ = g(W, C, P);
        return G(H(_));
      }, w = je(Fs, M(Tt, 0.2, 1)), E = 0.55 + 0.4 * M(Tt, 0, 1), F = 0.3 + 0.5 * M(Tt, 0, 1);
      for (let P = 0; P < Ko; P++) {
        const L = f + P * (b + d), W = L + b, C = y(L, r), _ = y(W, r), R = y(W, c), O = y(L, c);
        $.push(`<polygon points="${C[0]},${C[1]} ${_[0]},${_[1]} ${R[0]},${R[1]} ${O[0]},${O[1]}"
          fill="${w}" opacity="0.96" stroke="${As}" stroke-opacity="${E}" stroke-width="${Bs}"/>`);
        const A = (j, st, bt) => [j[0] + (st[0] - j[0]) * bt, j[1] + (st[1] - j[1]) * bt];
        for (let j = 1; j < Fe; j++) {
          const st = j / Fe, bt = A(C, _, st), lt = A(O, R, st);
          $.push(`<line x1="${bt[0]}" y1="${bt[1]}" x2="${lt[0]}" y2="${lt[1]}"
            stroke="${Ne}" stroke-opacity="${F}" stroke-width="0.7"/>`);
        }
        for (let j = 1; j < Ae; j++) {
          const st = j / Ae, bt = A(C, O, st), lt = A(_, R, st);
          $.push(`<line x1="${bt[0]}" y1="${bt[1]}" x2="${lt[0]}" y2="${lt[1]}"
            stroke="${Ne}" stroke-opacity="${F}" stroke-width="0.7"/>`);
        }
      }
    }, kr = () => {
      if (!pi || !$o || !ln) return;
      const t = Cr();
      if (!t) return;
      const { lowA: e, lowB: a, highA: n, highB: i, worldEdgeLen: r, roofHeightWorld: c } = t, h = Pi($e);
      let d = -c * (1 / 3), f = -c * (2 / 3);
      const p = 1 / 6, m = r * (1 - 2 * p), b = "100%", g = "9.99 kW", y = Math.max(h.length, b.length);
      Math.max((ve || "").length, g.length);
      const w = c * 0.36, E = Math.min(m / (0.6 * y), w), F = Math.min(E * fh, w * 1.05), P = Ia / Wa * F, L = Math.min(F * dh, w * 0.85), W = Ia / Wa * L;
      this._roofStripSeed = (this._roofStripSeed || 0) + 1;
      const C = (R, O, A) => [R[0] + (O[0] - R[0]) * A, R[1] + (O[1] - R[1]) * A, R[2] + (O[2] - R[2]) * A], _ = (R, O, A, j, st, bt, lt) => {
        if (!R) return;
        const It = Math.max(O * bt, c * 0.08), Bn = st, qr = st - It, Yr = M(-Bn / c, 0, 1), vf = M(-qr / c, 0, 1), Sf = C(e, n, Yr), xf = C(a, i, Yr), wf = C(e, n, vf), Xr = G(H(Sf)), Zr = G(H(xf)), Kr = G(H(wf)), Xt = [[0, Bn], [r, Bn], [0, qr]], Zt = [[Xr[0], Xr[1]], [Zr[0], Zr[1]], [Kr[0], Kr[1]]], Bo = Kh(Xt, Zt);
        if (!Bo) return;
        const Qr = Math.sign((Xt[1][0] - Xt[0][0]) * (Xt[2][1] - Xt[0][1]) - (Xt[1][1] - Xt[0][1]) * (Xt[2][0] - Xt[0][0])), Jr = Math.sign((Zt[1][0] - Zt[0][0]) * (Zt[2][1] - Zt[0][1]) - (Zt[1][1] - Zt[0][1]) * (Zt[2][0] - Zt[0][0])), tc = Qr !== 0 && Jr !== 0 && Qr !== Jr;
        $.push(`<g transform="matrix(${Bo.a} ${Bo.b} ${Bo.c} ${Bo.d} ${Bo.e} ${Bo.f})">`), tc && $.push(`<g transform="translate(${r} 0) scale(-1 1)">`), $.push(`<text x="${r / 2}" y="${st}" fill="${j}" font-size="${O}"
          stroke="${bi}" stroke-width="${A}" font-weight="700"
          text-anchor="middle" dominant-baseline="middle">${R}</text>`), tc && $.push("</g>"), $.push("</g>");
      };
      Uo && _(ve, L, W, ph, d, 1.6), _(h, F, P, mi, f, 1.6);
    }, An = [];
    Sr.forEach((t) => {
      const e = t.pts || [];
      if (!(e.length < 3))
        if (e.length === 3)
          An.push([e[0], e[1], e[2]]);
        else
          for (let a = 1; a < e.length - 1; a++)
            An.push([e[0], e[a], e[a + 1]]);
    });
    const bf = (t, e, a, n, i) => {
      const r = a[0], c = a[1], h = a[2], d = n[0], f = n[1], p = n[2], m = i[0], b = i[1], g = i[2], y = (f - b) * (r - m) + (m - d) * (c - b);
      if (Math.abs(y) < 1e-6) return null;
      const w = ((f - b) * (t - m) + (m - d) * (e - b)) / y, E = ((b - c) * (t - m) + (r - m) * (e - b)) / y, F = 1 - w - E;
      return w < -1e-4 || E < -1e-4 || F < -1e-4 ? null : w * h + E * p + F * g;
    }, as = (t, e) => {
      let a = 1 / 0;
      return An.forEach(([n, i, r]) => {
        const c = bf(t, e, n, i, r);
        c != null && c < a && (a = c);
      }), Number.isFinite(a) ? a : null;
    };
    Rr("back", as), Mr("back", as), Sr.forEach((t) => {
      const e = t.pts.map((r) => r[0] + "," + r[1]).join(","), n = typeof t.type == "string" && t.type.startsWith("flatRoof") ? t.fill : "#000";
      $.push(`<polygon points="${e}" fill="${t.fill}" stroke="${n}" stroke-width="${0.5}" opacity="${t.opacity}"/>`), t.type === "cube" && uf(t.id, t.pts), t.type === "cube" && t.id === "front" && df(), t.type === "cube" && pf(t.id, t.pts), t.type === "cube" && ff(t.id), (t.type === "roofPlane" || t.type === "flatRoofTop") && mf(), t.type === "roofPlane" && !wt && kr();
    }), wt && ln && kr();
    const gf = (t) => {
      const e = [0.14, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74, 0.84, 0.92];
      let a = 0, n = 0;
      for (const i of e) {
        const r = [
          Mo[0] + (t.world[0] - Mo[0]) * i,
          Mo[1] + (t.world[1] - Mo[1]) * i,
          Mo[2] + (t.world[2] - Mo[2]) * i
        ], c = H(r), h = G(c), d = as(h[0], h[1]);
        n++, (d == null || c[2] <= d - 5e-3) && a++;
      }
      return n > 0 && a >= Math.ceil(n * 0.67);
    }, Nr = En.filter((t) => gf(t));
    if (vt && !uu && Nr.length && _r(Nr, 1, 0.85), Rr("front", as), Mr("front", as), vt) {
      $.push(`<circle cx="${rt[0]}" cy="${rt[1]}" r="${fu}" fill="url(#sun-glow)"/>`), $.push(`<circle cx="${rt[0]}" cy="${rt[1]}" r="${du}" fill="yellow" stroke="orange" stroke-width="${Math.max(1, 2 * Co)}"/>`);
      const t = Math.min(Ta, Fa), e = Math.max(Ta, Fa);
      for (let a = 0; a < 8; a++) {
        const n = a * 360 / 8, i = 20 * Co;
        if (Ya) {
          const r = t + (e - t) * (0.5 + 0.5 * Math.sin(a * 1.71)), c = 0.18 * a + 0.07 * Math.cos(a * 2.13), h = ut ? Ks(r, c) : Zs(r, c), d = M(Vc + 0.015 * Math.sin(a * 0.93), 0.2, 1), f = M(Hc - 0.02 * Math.cos(a * 1.27), 0.25, 1), p = M(Gc + 0.04 * Math.cos(a * 1.37), 0.05, 1);
          $.push(`<g transform="translate(${rt[0]} ${rt[1]}) rotate(${n})">`);
          const m = ut ? Math.max(1, Math.round(r * io)) : 0;
          $.push(`<line x1="0" y1="0" x2="${i}" y2="0"
            class="sv-sun-ray"
            style="animation-duration:${r.toFixed(2)}s;--sv-phase-delay:${h.toFixed(2)}s;animation-delay:${h.toFixed(2)}s;--ray-min-scale:${d.toFixed(3)};--ray-max-scale:${f.toFixed(3)};--sv-steps:${m};"
            stroke="${Qn}" stroke-width="${1.5 * Co}" stroke-linecap="round" opacity="${p.toFixed(3)}"/>`), $.push("</g>");
        } else
          $.push(`<g transform="translate(${rt[0]} ${rt[1]}) rotate(${n})">`), $.push(`<line x1="0" y1="0" x2="${i}" y2="0"
            stroke="${Qn}" stroke-width="${1.5 * Co}" stroke-linecap="round" opacity="0.6"/>`), $.push("</g>");
      }
    }
    if (Oe && !vt && lo > 0.03) {
      const t = Array.isArray(js) ? js : [178, 208, 255], e = M(xl * lo, 0, 1);
      $.push(`<rect x="0" y="0" width="${K}" height="${tt}"
        fill="rgb(${t.join(",")})" opacity="${e}"/>`);
    }
    const yf = I ? ["SUN OVERRIDE ENABLED", "Solar alignment % is disabled"] : [];
    ei && $.push(`<rect x="0" y="0" width="${K}" height="${tt}" fill="url(#vignette)"/>`);
    const Er = this._autoRotateEnabled ? Number(this._autoRotateIntervalMsDynamic || Rt) : this._manualRotateEnabled ? Number(this._manualRotateIntervalMs || this._rotationIntervalMsFloor || Rt) : Rt, $f = Za && Er > Rt;
    let _f = 0;
    const ns = () => 18 + _f++ * 16;
    if (xh && this._autoRotateEnabled) {
      const t = Number.isFinite(this._autoRotateFps) ? this._autoRotateFps : 0, e = this._autoRotateIntervalMsDynamic || Rt, a = e > Rt ? " LIMIT" : "";
      $.push(`<text x="10" y="${ns()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">FPS ${t.toFixed(1)} | ${Math.round(e)}ms${a}</text>`);
    }
    if (_i) {
      const t = Number.isFinite(this._cssFps) ? this._cssFps : 0;
      $.push(`<text x="10" y="${ns()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">CSS FPS ${t.toFixed(1)}</text>`);
    }
    if (Lh && ut && $.push(`<text x="10" y="${ns()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">CSS LIMIT ${io} FPS</text>`), $f) {
      const t = Math.max(1, Math.round(1e3 / Er));
      $.push(`<text x="10" y="${ns()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">ROT LIMIT ${t} FPS</text>`);
    }
    return yf.forEach((t, e) => {
      const a = ns(), n = e === 0 ? 12 : 11;
      $.push(`<text x="10" y="${a}" fill="#ff3b3b" font-size="${n}" font-family="monospace" font-weight="700">${t}</text>`);
    }), $.push("</svg>"), $.join("");
  }
};
qn.styles = bc`
    :host {
      display: block;
      --cam-control-size: 43px;
      --cam-control-radius: 11px;
      --cam-control-font-size: 21px;
      --cam-readout-font-size: 14px;
      --cam-axis-gap: 62px;
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
      position: relative;
    }
    .scene {
      width: 100%;
      height: 100%;
    }
    .cam-btn {
      position: absolute;
      width: var(--cam-control-size);
      height: var(--cam-control-size);
      padding: 0;
      box-sizing: border-box;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: var(--cam-control-radius);
      background: rgba(54, 62, 78, 0.58);
      color: rgba(255, 255, 255, 0.96);
      font-size: var(--cam-control-font-size);
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      touch-action: manipulation;
      z-index: 6;
    }
    .cam-btn-h1 { left: calc(var(--cam-h-center, 50%) - (var(--cam-axis-gap) / 2) - var(--cam-control-size)); bottom: var(--cam-h-bottom, 10px); }
    .cam-btn-h2 { left: calc(var(--cam-h-center, 50%) + (var(--cam-axis-gap) / 2)); bottom: var(--cam-h-bottom, 10px); }
    .cam-btn-v1 { left: 10px; top: calc(var(--cam-v-center, 50%) - (var(--cam-v-gap, var(--cam-axis-gap)) / 2) - var(--cam-control-size)); }
    .cam-btn-v2 { left: 10px; top: calc(var(--cam-v-center, 50%) + (var(--cam-v-gap, var(--cam-axis-gap)) / 2)); }
    .cam-btn ha-icon {
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
      color: inherit;
    }
    .cam-btn-stop {
      background: rgba(160, 40, 40, 0.78);
      border-color: rgba(255, 180, 180, 0.55);
    }
    .cam-readout {
      position: absolute;
      min-width: var(--cam-control-size);
      box-sizing: border-box;
      width: var(--cam-control-size);
      height: var(--cam-control-size);
      border-radius: var(--cam-control-radius);
      border: 1px solid rgba(255,255,255,0.28);
      background: rgba(54, 62, 78, 0.50);
      color: rgba(255,255,255,0.96);
      font-size: var(--cam-readout-font-size);
      font-weight: 600;
      line-height: 1;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      z-index: 6;
      pointer-events: none;
      user-select: none;
      -webkit-user-select: none;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    .cam-readout-h {
      left: var(--cam-h-center, 50%);
      bottom: 10px;
      transform: translateX(-50%);
    }
    .cam-readout-v {
      left: 10px;
      top: 49.5%;
      transform: translateY(-50%);
    }
    .cam-btn-save { left: 10px; bottom: 10px; }
    .cam-btn-restore { left: calc(10px + var(--cam-control-size) + 10px); bottom: 10px; }
  `;
let Vn = qn;
const va = "sunlight-visualizer-card";
if (!customElements.get(va))
  try {
    customElements.define(va, Vn);
  } catch {
  }
const dc = window.customCards ?? (window.customCards = []);
dc.some((S) => S.type === va) || dc.push({
  type: va,
  name: "Sunlight Visualizer Card",
  description: "2.5D sunlight visualizer house card with auto-bound integration entities.",
  preview: !0,
  documentationURL: "https://github.com/NoUsername10/Sunlight_Visualizer"
});
