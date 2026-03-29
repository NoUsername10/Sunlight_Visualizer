/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ba = globalThis, si = Ba.ShadowRoot && (Ba.ShadyCSS === void 0 || Ba.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ai = Symbol(), mc = /* @__PURE__ */ new WeakMap();
let Nc = class {
  constructor(a, c, l) {
    if (this._$cssResult$ = !0, l !== ai) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = a, this.t = c;
  }
  get styleSheet() {
    let a = this.o;
    const c = this.t;
    if (si && a === void 0) {
      const l = c !== void 0 && c.length === 1;
      l && (a = mc.get(c)), a === void 0 && ((this.o = a = new CSSStyleSheet()).replaceSync(this.cssText), l && mc.set(c, a));
    }
    return a;
  }
  toString() {
    return this.cssText;
  }
};
const Df = (S) => new Nc(typeof S == "string" ? S : S + "", void 0, ai), Ec = (S, ...a) => {
  const c = S.length === 1 ? S[0] : a.reduce((l, o, x) => l + (($) => {
    if ($._$cssResult$ === !0) return $.cssText;
    if (typeof $ == "number") return $;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + $ + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + S[x + 1], S[0]);
  return new Nc(c, S, ai);
}, Bf = (S, a) => {
  if (si) S.adoptedStyleSheets = a.map((c) => c instanceof CSSStyleSheet ? c : c.styleSheet);
  else for (const c of a) {
    const l = document.createElement("style"), o = Ba.litNonce;
    o !== void 0 && l.setAttribute("nonce", o), l.textContent = c.cssText, S.appendChild(l);
  }
}, bc = si ? (S) => S : (S) => S instanceof CSSStyleSheet ? ((a) => {
  let c = "";
  for (const l of a.cssRules) c += l.cssText;
  return Df(c);
})(S) : S;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: zf, defineProperty: Pf, getOwnPropertyDescriptor: Lf, getOwnPropertyNames: Wf, getOwnPropertySymbols: Of, getPrototypeOf: If } = Object, bo = globalThis, gc = bo.trustedTypes, Vf = gc ? gc.emptyScript : "", Xn = bo.reactiveElementPolyfillSupport, bs = (S, a) => S, Qn = { toAttribute(S, a) {
  switch (a) {
    case Boolean:
      S = S ? Vf : null;
      break;
    case Object:
    case Array:
      S = S == null ? S : JSON.stringify(S);
  }
  return S;
}, fromAttribute(S, a) {
  let c = S;
  switch (a) {
    case Boolean:
      c = S !== null;
      break;
    case Number:
      c = S === null ? null : Number(S);
      break;
    case Object:
    case Array:
      try {
        c = JSON.parse(S);
      } catch {
        c = null;
      }
  }
  return c;
} }, Fc = (S, a) => !zf(S, a), _c = { attribute: !0, type: String, converter: Qn, reflect: !1, useDefault: !1, hasChanged: Fc };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), bo.litPropertyMetadata ?? (bo.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let $e = class extends HTMLElement {
  static addInitializer(a) {
    this._$Ei(), (this.l ?? (this.l = [])).push(a);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(a, c = _c) {
    if (c.state && (c.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(a) && ((c = Object.create(c)).wrapped = !0), this.elementProperties.set(a, c), !c.noAccessor) {
      const l = Symbol(), o = this.getPropertyDescriptor(a, l, c);
      o !== void 0 && Pf(this.prototype, a, o);
    }
  }
  static getPropertyDescriptor(a, c, l) {
    const { get: o, set: x } = Lf(this.prototype, a) ?? { get() {
      return this[c];
    }, set($) {
      this[c] = $;
    } };
    return { get: o, set($) {
      const B = o == null ? void 0 : o.call(this);
      x == null || x.call(this, $), this.requestUpdate(a, B, l);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(a) {
    return this.elementProperties.get(a) ?? _c;
  }
  static _$Ei() {
    if (this.hasOwnProperty(bs("elementProperties"))) return;
    const a = If(this);
    a.finalize(), a.l !== void 0 && (this.l = [...a.l]), this.elementProperties = new Map(a.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(bs("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(bs("properties"))) {
      const c = this.properties, l = [...Wf(c), ...Of(c)];
      for (const o of l) this.createProperty(o, c[o]);
    }
    const a = this[Symbol.metadata];
    if (a !== null) {
      const c = litPropertyMetadata.get(a);
      if (c !== void 0) for (const [l, o] of c) this.elementProperties.set(l, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [c, l] of this.elementProperties) {
      const o = this._$Eu(c, l);
      o !== void 0 && this._$Eh.set(o, c);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(a) {
    const c = [];
    if (Array.isArray(a)) {
      const l = new Set(a.flat(1 / 0).reverse());
      for (const o of l) c.unshift(bc(o));
    } else a !== void 0 && c.push(bc(a));
    return c;
  }
  static _$Eu(a, c) {
    const l = c.attribute;
    return l === !1 ? void 0 : typeof l == "string" ? l : typeof a == "string" ? a.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var a;
    this._$ES = new Promise((c) => this.enableUpdating = c), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (a = this.constructor.l) == null || a.forEach((c) => c(this));
  }
  addController(a) {
    var c;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(a), this.renderRoot !== void 0 && this.isConnected && ((c = a.hostConnected) == null || c.call(a));
  }
  removeController(a) {
    var c;
    (c = this._$EO) == null || c.delete(a);
  }
  _$E_() {
    const a = /* @__PURE__ */ new Map(), c = this.constructor.elementProperties;
    for (const l of c.keys()) this.hasOwnProperty(l) && (a.set(l, this[l]), delete this[l]);
    a.size > 0 && (this._$Ep = a);
  }
  createRenderRoot() {
    const a = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Bf(a, this.constructor.elementStyles), a;
  }
  connectedCallback() {
    var a;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (a = this._$EO) == null || a.forEach((c) => {
      var l;
      return (l = c.hostConnected) == null ? void 0 : l.call(c);
    });
  }
  enableUpdating(a) {
  }
  disconnectedCallback() {
    var a;
    (a = this._$EO) == null || a.forEach((c) => {
      var l;
      return (l = c.hostDisconnected) == null ? void 0 : l.call(c);
    });
  }
  attributeChangedCallback(a, c, l) {
    this._$AK(a, l);
  }
  _$ET(a, c) {
    var x;
    const l = this.constructor.elementProperties.get(a), o = this.constructor._$Eu(a, l);
    if (o !== void 0 && l.reflect === !0) {
      const $ = (((x = l.converter) == null ? void 0 : x.toAttribute) !== void 0 ? l.converter : Qn).toAttribute(c, l.type);
      this._$Em = a, $ == null ? this.removeAttribute(o) : this.setAttribute(o, $), this._$Em = null;
    }
  }
  _$AK(a, c) {
    var x, $;
    const l = this.constructor, o = l._$Eh.get(a);
    if (o !== void 0 && this._$Em !== o) {
      const B = l.getPropertyOptions(o), k = typeof B.converter == "function" ? { fromAttribute: B.converter } : ((x = B.converter) == null ? void 0 : x.fromAttribute) !== void 0 ? B.converter : Qn;
      this._$Em = o;
      const O = k.fromAttribute(c, B.type);
      this[o] = O ?? (($ = this._$Ej) == null ? void 0 : $.get(o)) ?? O, this._$Em = null;
    }
  }
  requestUpdate(a, c, l, o = !1, x) {
    var $;
    if (a !== void 0) {
      const B = this.constructor;
      if (o === !1 && (x = this[a]), l ?? (l = B.getPropertyOptions(a)), !((l.hasChanged ?? Fc)(x, c) || l.useDefault && l.reflect && x === (($ = this._$Ej) == null ? void 0 : $.get(a)) && !this.hasAttribute(B._$Eu(a, l)))) return;
      this.C(a, c, l);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(a, c, { useDefault: l, reflect: o, wrapped: x }, $) {
    l && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(a) && (this._$Ej.set(a, $ ?? c ?? this[a]), x !== !0 || $ !== void 0) || (this._$AL.has(a) || (this.hasUpdated || l || (c = void 0), this._$AL.set(a, c)), o === !0 && this._$Em !== a && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(a));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (c) {
      Promise.reject(c);
    }
    const a = this.scheduleUpdate();
    return a != null && await a, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var l;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [x, $] of this._$Ep) this[x] = $;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [x, $] of o) {
        const { wrapped: B } = $, k = this[x];
        B !== !0 || this._$AL.has(x) || k === void 0 || this.C(x, void 0, $, k);
      }
    }
    let a = !1;
    const c = this._$AL;
    try {
      a = this.shouldUpdate(c), a ? (this.willUpdate(c), (l = this._$EO) == null || l.forEach((o) => {
        var x;
        return (x = o.hostUpdate) == null ? void 0 : x.call(o);
      }), this.update(c)) : this._$EM();
    } catch (o) {
      throw a = !1, this._$EM(), o;
    }
    a && this._$AE(c);
  }
  willUpdate(a) {
  }
  _$AE(a) {
    var c;
    (c = this._$EO) == null || c.forEach((l) => {
      var o;
      return (o = l.hostUpdated) == null ? void 0 : o.call(l);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(a)), this.updated(a);
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
  shouldUpdate(a) {
    return !0;
  }
  update(a) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((c) => this._$ET(c, this[c]))), this._$EM();
  }
  updated(a) {
  }
  firstUpdated(a) {
  }
};
$e.elementStyles = [], $e.shadowRootOptions = { mode: "open" }, $e[bs("elementProperties")] = /* @__PURE__ */ new Map(), $e[bs("finalized")] = /* @__PURE__ */ new Map(), Xn == null || Xn({ ReactiveElement: $e }), (bo.reactiveElementVersions ?? (bo.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gs = globalThis, yc = (S) => S, za = gs.trustedTypes, $c = za ? za.createPolicy("lit-html", { createHTML: (S) => S }) : void 0, Ac = "$lit$", mo = `lit$${Math.random().toFixed(9).slice(2)}$`, Tc = "?" + mo, Hf = `<${Tc}>`, Go = document, _s = () => Go.createComment(""), ys = (S) => S === null || typeof S != "object" && typeof S != "function", ni = Array.isArray, Gf = (S) => ni(S) || typeof (S == null ? void 0 : S[Symbol.iterator]) == "function", Zn = `[ 	
\f\r]`, ms = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, vc = /-->/g, Sc = />/g, Oo = RegExp(`>|${Zn}(?:([^\\s"'>=/]+)(${Zn}*=${Zn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), xc = /'/g, wc = /"/g, Dc = /^(?:script|style|textarea|title)$/i, Uf = (S) => (a, ...c) => ({ _$litType$: S, strings: a, values: c }), Io = Uf(1), Uo = Symbol.for("lit-noChange"), st = Symbol.for("lit-nothing"), Rc = /* @__PURE__ */ new WeakMap(), Vo = Go.createTreeWalker(Go, 129);
function Bc(S, a) {
  if (!ni(S) || !S.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return $c !== void 0 ? $c.createHTML(a) : a;
}
const jf = (S, a) => {
  const c = S.length - 1, l = [];
  let o, x = a === 2 ? "<svg>" : a === 3 ? "<math>" : "", $ = ms;
  for (let B = 0; B < c; B++) {
    const k = S[B];
    let O, Y, L = -1, tt = 0;
    for (; tt < k.length && ($.lastIndex = tt, Y = $.exec(k), Y !== null); ) tt = $.lastIndex, $ === ms ? Y[1] === "!--" ? $ = vc : Y[1] !== void 0 ? $ = Sc : Y[2] !== void 0 ? (Dc.test(Y[2]) && (o = RegExp("</" + Y[2], "g")), $ = Oo) : Y[3] !== void 0 && ($ = Oo) : $ === Oo ? Y[0] === ">" ? ($ = o ?? ms, L = -1) : Y[1] === void 0 ? L = -2 : (L = $.lastIndex - Y[2].length, O = Y[1], $ = Y[3] === void 0 ? Oo : Y[3] === '"' ? wc : xc) : $ === wc || $ === xc ? $ = Oo : $ === vc || $ === Sc ? $ = ms : ($ = Oo, o = void 0);
    const j = $ === Oo && S[B + 1].startsWith("/>") ? " " : "";
    x += $ === ms ? k + Hf : L >= 0 ? (l.push(O), k.slice(0, L) + Ac + k.slice(L) + mo + j) : k + mo + (L === -2 ? B : j);
  }
  return [Bc(S, x + (S[c] || "<?>") + (a === 2 ? "</svg>" : a === 3 ? "</math>" : "")), l];
};
class $s {
  constructor({ strings: a, _$litType$: c }, l) {
    let o;
    this.parts = [];
    let x = 0, $ = 0;
    const B = a.length - 1, k = this.parts, [O, Y] = jf(a, c);
    if (this.el = $s.createElement(O, l), Vo.currentNode = this.el.content, c === 2 || c === 3) {
      const L = this.el.content.firstChild;
      L.replaceWith(...L.childNodes);
    }
    for (; (o = Vo.nextNode()) !== null && k.length < B; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const L of o.getAttributeNames()) if (L.endsWith(Ac)) {
          const tt = Y[$++], j = o.getAttribute(L).split(mo), z = /([.?@])?(.*)/.exec(tt);
          k.push({ type: 1, index: x, name: z[2], strings: j, ctor: z[1] === "." ? Yf : z[1] === "?" ? Xf : z[1] === "@" ? Zf : La }), o.removeAttribute(L);
        } else L.startsWith(mo) && (k.push({ type: 6, index: x }), o.removeAttribute(L));
        if (Dc.test(o.tagName)) {
          const L = o.textContent.split(mo), tt = L.length - 1;
          if (tt > 0) {
            o.textContent = za ? za.emptyScript : "";
            for (let j = 0; j < tt; j++) o.append(L[j], _s()), Vo.nextNode(), k.push({ type: 2, index: ++x });
            o.append(L[tt], _s());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Tc) k.push({ type: 2, index: x });
      else {
        let L = -1;
        for (; (L = o.data.indexOf(mo, L + 1)) !== -1; ) k.push({ type: 7, index: x }), L += mo.length - 1;
      }
      x++;
    }
  }
  static createElement(a, c) {
    const l = Go.createElement("template");
    return l.innerHTML = a, l;
  }
}
function Se(S, a, c = S, l) {
  var $, B;
  if (a === Uo) return a;
  let o = l !== void 0 ? ($ = c._$Co) == null ? void 0 : $[l] : c._$Cl;
  const x = ys(a) ? void 0 : a._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== x && ((B = o == null ? void 0 : o._$AO) == null || B.call(o, !1), x === void 0 ? o = void 0 : (o = new x(S), o._$AT(S, c, l)), l !== void 0 ? (c._$Co ?? (c._$Co = []))[l] = o : c._$Cl = o), o !== void 0 && (a = Se(S, o._$AS(S, a.values), o, l)), a;
}
class qf {
  constructor(a, c) {
    this._$AV = [], this._$AN = void 0, this._$AD = a, this._$AM = c;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(a) {
    const { el: { content: c }, parts: l } = this._$AD, o = ((a == null ? void 0 : a.creationScope) ?? Go).importNode(c, !0);
    Vo.currentNode = o;
    let x = Vo.nextNode(), $ = 0, B = 0, k = l[0];
    for (; k !== void 0; ) {
      if ($ === k.index) {
        let O;
        k.type === 2 ? O = new vs(x, x.nextSibling, this, a) : k.type === 1 ? O = new k.ctor(x, k.name, k.strings, this, a) : k.type === 6 && (O = new Kf(x, this, a)), this._$AV.push(O), k = l[++B];
      }
      $ !== (k == null ? void 0 : k.index) && (x = Vo.nextNode(), $++);
    }
    return Vo.currentNode = Go, o;
  }
  p(a) {
    let c = 0;
    for (const l of this._$AV) l !== void 0 && (l.strings !== void 0 ? (l._$AI(a, l, c), c += l.strings.length - 2) : l._$AI(a[c])), c++;
  }
}
class vs {
  get _$AU() {
    var a;
    return ((a = this._$AM) == null ? void 0 : a._$AU) ?? this._$Cv;
  }
  constructor(a, c, l, o) {
    this.type = 2, this._$AH = st, this._$AN = void 0, this._$AA = a, this._$AB = c, this._$AM = l, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
  }
  get parentNode() {
    let a = this._$AA.parentNode;
    const c = this._$AM;
    return c !== void 0 && (a == null ? void 0 : a.nodeType) === 11 && (a = c.parentNode), a;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(a, c = this) {
    a = Se(this, a, c), ys(a) ? a === st || a == null || a === "" ? (this._$AH !== st && this._$AR(), this._$AH = st) : a !== this._$AH && a !== Uo && this._(a) : a._$litType$ !== void 0 ? this.$(a) : a.nodeType !== void 0 ? this.T(a) : Gf(a) ? this.k(a) : this._(a);
  }
  O(a) {
    return this._$AA.parentNode.insertBefore(a, this._$AB);
  }
  T(a) {
    this._$AH !== a && (this._$AR(), this._$AH = this.O(a));
  }
  _(a) {
    this._$AH !== st && ys(this._$AH) ? this._$AA.nextSibling.data = a : this.T(Go.createTextNode(a)), this._$AH = a;
  }
  $(a) {
    var x;
    const { values: c, _$litType$: l } = a, o = typeof l == "number" ? this._$AC(a) : (l.el === void 0 && (l.el = $s.createElement(Bc(l.h, l.h[0]), this.options)), l);
    if (((x = this._$AH) == null ? void 0 : x._$AD) === o) this._$AH.p(c);
    else {
      const $ = new qf(o, this), B = $.u(this.options);
      $.p(c), this.T(B), this._$AH = $;
    }
  }
  _$AC(a) {
    let c = Rc.get(a.strings);
    return c === void 0 && Rc.set(a.strings, c = new $s(a)), c;
  }
  k(a) {
    ni(this._$AH) || (this._$AH = [], this._$AR());
    const c = this._$AH;
    let l, o = 0;
    for (const x of a) o === c.length ? c.push(l = new vs(this.O(_s()), this.O(_s()), this, this.options)) : l = c[o], l._$AI(x), o++;
    o < c.length && (this._$AR(l && l._$AB.nextSibling, o), c.length = o);
  }
  _$AR(a = this._$AA.nextSibling, c) {
    var l;
    for ((l = this._$AP) == null ? void 0 : l.call(this, !1, !0, c); a !== this._$AB; ) {
      const o = yc(a).nextSibling;
      yc(a).remove(), a = o;
    }
  }
  setConnected(a) {
    var c;
    this._$AM === void 0 && (this._$Cv = a, (c = this._$AP) == null || c.call(this, a));
  }
}
class La {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(a, c, l, o, x) {
    this.type = 1, this._$AH = st, this._$AN = void 0, this.element = a, this.name = c, this._$AM = o, this.options = x, l.length > 2 || l[0] !== "" || l[1] !== "" ? (this._$AH = Array(l.length - 1).fill(new String()), this.strings = l) : this._$AH = st;
  }
  _$AI(a, c = this, l, o) {
    const x = this.strings;
    let $ = !1;
    if (x === void 0) a = Se(this, a, c, 0), $ = !ys(a) || a !== this._$AH && a !== Uo, $ && (this._$AH = a);
    else {
      const B = a;
      let k, O;
      for (a = x[0], k = 0; k < x.length - 1; k++) O = Se(this, B[l + k], c, k), O === Uo && (O = this._$AH[k]), $ || ($ = !ys(O) || O !== this._$AH[k]), O === st ? a = st : a !== st && (a += (O ?? "") + x[k + 1]), this._$AH[k] = O;
    }
    $ && !o && this.j(a);
  }
  j(a) {
    a === st ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, a ?? "");
  }
}
class Yf extends La {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(a) {
    this.element[this.name] = a === st ? void 0 : a;
  }
}
class Xf extends La {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(a) {
    this.element.toggleAttribute(this.name, !!a && a !== st);
  }
}
class Zf extends La {
  constructor(a, c, l, o, x) {
    super(a, c, l, o, x), this.type = 5;
  }
  _$AI(a, c = this) {
    if ((a = Se(this, a, c, 0) ?? st) === Uo) return;
    const l = this._$AH, o = a === st && l !== st || a.capture !== l.capture || a.once !== l.once || a.passive !== l.passive, x = a !== st && (l === st || o);
    o && this.element.removeEventListener(this.name, this, l), x && this.element.addEventListener(this.name, this, a), this._$AH = a;
  }
  handleEvent(a) {
    var c;
    typeof this._$AH == "function" ? this._$AH.call(((c = this.options) == null ? void 0 : c.host) ?? this.element, a) : this._$AH.handleEvent(a);
  }
}
class Kf {
  constructor(a, c, l) {
    this.element = a, this.type = 6, this._$AN = void 0, this._$AM = c, this.options = l;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(a) {
    Se(this, a);
  }
}
const Kn = gs.litHtmlPolyfillSupport;
Kn == null || Kn($s, vs), (gs.litHtmlVersions ?? (gs.litHtmlVersions = [])).push("3.3.2");
const Jf = (S, a, c) => {
  const l = (c == null ? void 0 : c.renderBefore) ?? a;
  let o = l._$litPart$;
  if (o === void 0) {
    const x = (c == null ? void 0 : c.renderBefore) ?? null;
    l._$litPart$ = o = new vs(a.insertBefore(_s(), x), x, void 0, c ?? {});
  }
  return o._$AI(S), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ho = globalThis;
let ve = class extends $e {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var c;
    const a = super.createRenderRoot();
    return (c = this.renderOptions).renderBefore ?? (c.renderBefore = a.firstChild), a;
  }
  update(a) {
    const c = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(a), this._$Do = Jf(c, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var a;
    super.connectedCallback(), (a = this._$Do) == null || a.setConnected(!0);
  }
  disconnectedCallback() {
    var a;
    super.disconnectedCallback(), (a = this._$Do) == null || a.setConnected(!1);
  }
  render() {
    return Uo;
  }
};
var kc;
ve._$litElement$ = !0, ve.finalized = !0, (kc = Ho.litElementHydrateSupport) == null || kc.call(Ho, { LitElement: ve });
const Jn = Ho.litElementPolyfillSupport;
Jn == null || Jn({ LitElement: ve });
(Ho.litElementVersions ?? (Ho.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qf = { CHILD: 2 }, td = (S) => (...a) => ({ _$litDirective$: S, values: a });
class od {
  constructor(a) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(a, c, l) {
    this._$Ct = a, this._$AM = c, this._$Ci = l;
  }
  _$AS(a, c) {
    return this.update(a, c);
  }
  update(a, c) {
    return this.render(...c);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class ti extends od {
  constructor(a) {
    if (super(a), this.it = st, a.type !== Qf.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(a) {
    if (a === st || a == null) return this._t = void 0, this.it = a;
    if (a === Uo) return a;
    if (typeof a != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (a === this.it) return this._t;
    this.it = a;
    const c = [a];
    return c.raw = c, this._t = { _$litType$: this.constructor.resultType, strings: c, values: [] };
  }
}
ti.directiveName = "unsafeHTML", ti.resultType = 1;
const ed = td(ti), ii = class ii extends ve {
  constructor() {
    super(...arguments), this._config = {};
  }
  setConfig(a) {
    this._config = a || {};
  }
  set hass(a) {
    this._hass = a, this.requestUpdate();
  }
  _setConfigValue(a, c) {
    if (!this._config) return;
    const l = { ...this._config };
    c === "" || c === void 0 || c === null ? delete l[a] : l[a] = c, this._config = l, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: l },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _valueChanged(a) {
    var x;
    const c = a.target, l = c == null ? void 0 : c.configValue;
    if (!l) return;
    let o = ((x = a.detail) == null ? void 0 : x.value) ?? c.value;
    if (c.checked !== void 0 && (o = c.checked), c.type === "number") {
      const $ = Number(o);
      Number.isNaN($) || (o = $);
    }
    this._setConfigValue(l, o);
  }
  _setNumberEntityValue(a, c) {
    !this._hass || !a || this._hass.callService("number", "set_value", { entity_id: a, value: c });
  }
  _setSelectEntityOption(a, c) {
    !this._hass || !a || !c || this._hass.callService("select", "select_option", { entity_id: a, option: c });
  }
  _setIntegrationOptions(a) {
    this._hass && this._hass.callService("sunlight_visualizer", "set_options", a);
  }
  render() {
    var Ft, Yt, vo, it, Ct, ht, So, _t, we, Zo, Ss, Re, Lt, xo, xs, ws, Rs, Ms, Me, Ce, Wa, ke, Cs, Ko, ao, no, Jo, mt, ot, ks, Ns, wo, io, H, Qo, te, Es, Fs, Ro, At, As, Ts, Ds, Ne, Ee, Fe, Ae, oe, Te, De, Bs, zs, Ps, Ls, Ws, Be, Os, Is, ze, Vs, Hs, ee, Gs, Us, Pe, Le, We, Oe, Ie, Mo, Co, Ve, ro, co, He, js, qs, Ys, Xs, Zs, Ks, Js, Qs, ta, oa, ea, Ge, Ue, se, sa, aa, na;
    if (!this._hass) return Io``;
    const a = this._config || {}, c = a.siSourceAttr ?? "sunlight_visualizer_source", l = a.siSourceValue ?? "sunlight_visualizer", o = Object.entries(this._hass.states ?? {}).filter(
      ([, w]) => {
        var F;
        return ((F = w == null ? void 0 : w.attributes) == null ? void 0 : F[c]) === l;
      }
    ), x = (w) => {
      for (const [F, X] of o)
        if (w(X, F)) return F;
      return null;
    }, $ = (w) => x((F) => {
      var X;
      return ((X = F == null ? void 0 : F.attributes) == null ? void 0 : X.camera_rotation) === w;
    }), B = (w) => x((F) => {
      var X;
      return ((X = F == null ? void 0 : F.attributes) == null ? void 0 : X.si_setting) === w;
    }), k = a.rotationHEntity ?? $("h") ?? "", O = a.rotationVEntity ?? $("v") ?? "", Y = a.houseAngleEntity ?? B("house_angle") ?? "", L = B("ceiling_tilt") ?? "", tt = B("house_direction") ?? "", j = B("roof_direction") ?? "", z = (w, F = !1) => {
      if (w == null || w === "") return F;
      if (typeof w == "boolean") return w;
      if (typeof w == "number") return w !== 0;
      if (typeof w == "string") {
        const X = w.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(X)) return !0;
        if (["false", "0", "no", "off"].includes(X)) return !1;
      }
      return F;
    };
    let E = "", $t, vt, wt, Rt;
    for (const [, w] of o)
      !E && ((Ft = w == null ? void 0 : w.attributes) != null && Ft.roof_power_entity) && (E = w.attributes.roof_power_entity), $t === void 0 && ((Yt = w == null ? void 0 : w.attributes) == null ? void 0 : Yt.roof_power_enabled) !== void 0 && ($t = w.attributes.roof_power_enabled), vt === void 0 && ((vo = w == null ? void 0 : w.attributes) == null ? void 0 : vo.roof_power_invert) !== void 0 && (vt = w.attributes.roof_power_invert), wt === void 0 && ((it = w == null ? void 0 : w.attributes) == null ? void 0 : it.fixed_sun_rotation_enabled) !== void 0 && (wt = w.attributes.fixed_sun_rotation_enabled), Rt === void 0 && ((Ct = w == null ? void 0 : w.attributes) == null ? void 0 : Ct.fixed_sun_azimuth) !== void 0 && (Rt = w.attributes.fixed_sun_azimuth);
    const ft = a.preferIntegrationSettings ?? !0, Z = o.length > 0, Q = ft ? E || a.roofPowerEntity || "" : a.roofPowerEntity || E || "", Bt = ft ? z($t, z(a.roofPowerEnabled, !1)) : z(a.roofPowerEnabled, z($t, !1)), zt = ft ? z(vt, z(a.roofPowerInvert, !1)) : z(a.roofPowerInvert, z(vt, !1)), dt = Number((_t = (So = (ht = o.find(([, w]) => {
      var F;
      return ((F = w == null ? void 0 : w.attributes) == null ? void 0 : F.auto_rotate_speed) != null;
    })) == null ? void 0 : ht[1]) == null ? void 0 : So.attributes) == null ? void 0 : _t.auto_rotate_speed), at = ft && Number.isFinite(dt) ? dt : Number(a.autoRotateSpeed ?? (Number.isFinite(dt) ? dt : 25));
    Number(((Ss = (Zo = (we = this._hass) == null ? void 0 : we.states) == null ? void 0 : Zo[Y]) == null ? void 0 : Ss.state) ?? a.houseAngle ?? 0);
    const go = ["North", "NE", "East", "SE", "South", "SW", "West", "NW", "Custom"], jo = ["front", "back", "left", "right"], _o = !!tt, eo = !!j, qo = _o ? ((xs = (xo = (Lt = (Re = this._hass) == null ? void 0 : Re.states) == null ? void 0 : Lt[tt]) == null ? void 0 : xo.attributes) == null ? void 0 : xs.options) ?? go : go, xe = eo ? ((Me = (Ms = (Rs = (ws = this._hass) == null ? void 0 : ws.states) == null ? void 0 : Rs[j]) == null ? void 0 : Ms.attributes) == null ? void 0 : Me.options) ?? jo : jo, Yo = _o ? ((ke = (Wa = (Ce = this._hass) == null ? void 0 : Ce.states) == null ? void 0 : Wa[tt]) == null ? void 0 : ke.state) ?? "Custom" : a.houseDirection ?? "Custom", nt = eo ? ((ao = (Ko = (Cs = this._hass) == null ? void 0 : Cs.states) == null ? void 0 : Ko[j]) == null ? void 0 : ao.state) ?? "front" : a.roofTiltFace ?? "front", yo = !!k, Mt = !!O, Xo = !!L, It = Number(ft ? Rt ?? a.fixedSunAzimuthDeg ?? 225 : a.fixedSunAzimuthDeg ?? Rt ?? 225), so = Math.min(359, Math.max(0, Number.isFinite(It) ? It : 225)), $o = ft ? z(wt, z(a.fixedSunRotationEnabled, !1)) : z(a.fixedSunRotationEnabled, z(wt, !1)), pt = Number(
      (mt = (Jo = (no = o.find(([, w]) => {
        var F;
        return ((F = w == null ? void 0 : w.attributes) == null ? void 0 : F.sun_azimuth) != null;
      })) == null ? void 0 : no[1]) == null ? void 0 : Jo.attributes) == null ? void 0 : mt.sun_azimuth
    ), Vt = Number((wo = (Ns = (ks = (ot = this._hass) == null ? void 0 : ot.states) == null ? void 0 : ks["sun.sun"]) == null ? void 0 : Ns.attributes) == null ? void 0 : wo.azimuth), Pt = Number.isFinite(pt) ? pt : Number.isFinite(Vt) ? Vt : so;
    return Io`
      <div class="section">
        <div class="title">Size</div>
        <div class="row">
          <ha-textfield
            label="Card width (px)"
            type="number"
            .value=${String(a.cardWidth ?? 450)}
            .configValue=${"cardWidth"}
            @change=${this._valueChanged}
          ></ha-textfield>
          <ha-textfield
            label="Card height (px)"
            type="number"
            .value=${String(a.cardHeight ?? 450)}
            .configValue=${"cardHeight"}
            @change=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row single">
          <div class="switch-row">
            <span>Auto-scale Width</span>
            <ha-switch
              .checked=${a.autoScaleWidth ?? !0}
              .configValue=${"autoScaleWidth"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>
          <div class="helper">Auto-shrink by available width on small screens (minimum 250px). Never grows above configured width.</div>
        </div>
      </div>

      <div class="section">
        <div class="title">House & Roof</div>
        <div class="row">
          <div>
            <div class="slider-label">House angle</div>
            <ha-slider
              .value=${Number(((Qo = (H = (io = this._hass) == null ? void 0 : io.states) == null ? void 0 : H[Y]) == null ? void 0 : Qo.state) ?? 0)}
              .min=${Number(((Ro = (Fs = (Es = (te = this._hass) == null ? void 0 : te.states) == null ? void 0 : Es[Y]) == null ? void 0 : Fs.attributes) == null ? void 0 : Ro.min) ?? 0)}
              .max=${Number(((Ds = (Ts = (As = (At = this._hass) == null ? void 0 : At.states) == null ? void 0 : As[Y]) == null ? void 0 : Ts.attributes) == null ? void 0 : Ds.max) ?? 359)}
              .step=${Number(((Ae = (Fe = (Ee = (Ne = this._hass) == null ? void 0 : Ne.states) == null ? void 0 : Ee[Y]) == null ? void 0 : Fe.attributes) == null ? void 0 : Ae.step) ?? 1)}
              @change=${(w) => {
      var F;
      return this._setNumberEntityValue(Y, Number(((F = w.target) == null ? void 0 : F.value) ?? 0));
    }}
              .disabled=${!Y}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"House direction"}
              .selector=${{ select: { options: qo, mode: "dropdown" } }}
              .value=${Yo}
              @value-changed=${(w) => {
      var X;
      const F = ((X = w.detail) == null ? void 0 : X.value) ?? Yo;
      _o ? (this._setSelectEntityOption(tt, F), this._setConfigValue("houseDirection", void 0)) : this._setConfigValue("houseDirection", F);
    }}
            ></ha-selector>
            <div class="helper">Select compass direction your front door is facing.</div>
          </div>
        </div>
        <div class="row">
          <div>
            <div class="slider-label">Ceiling tilt</div>
            <ha-slider
              .value=${Number(((De = (Te = (oe = this._hass) == null ? void 0 : oe.states) == null ? void 0 : Te[L]) == null ? void 0 : De.state) ?? 0)}
              .min=${Number(((Ls = (Ps = (zs = (Bs = this._hass) == null ? void 0 : Bs.states) == null ? void 0 : zs[L]) == null ? void 0 : Ps.attributes) == null ? void 0 : Ls.min) ?? 0)}
              .max=${Number(((Is = (Os = (Be = (Ws = this._hass) == null ? void 0 : Ws.states) == null ? void 0 : Be[L]) == null ? void 0 : Os.attributes) == null ? void 0 : Is.max) ?? 90)}
              .step=${Number(((ee = (Hs = (Vs = (ze = this._hass) == null ? void 0 : ze.states) == null ? void 0 : Vs[L]) == null ? void 0 : Hs.attributes) == null ? void 0 : ee.step) ?? 1)}
              @change=${(w) => {
      var F;
      return this._setNumberEntityValue(L, Number(((F = w.target) == null ? void 0 : F.value) ?? 0));
    }}
              .disabled=${!Xo}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"Roof direction"}
              .selector=${{ select: { options: xe, mode: "dropdown" } }}
              .value=${nt}
              @value-changed=${(w) => {
      var X;
      const F = ((X = w.detail) == null ? void 0 : X.value) ?? nt;
      eo ? (this._setSelectEntityOption(j, F), this._setConfigValue("roofTiltFace", void 0)) : this._setConfigValue("roofTiltFace", F);
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
              .value=${Number(((Pe = (Us = (Gs = this._hass) == null ? void 0 : Gs.states) == null ? void 0 : Us[k]) == null ? void 0 : Pe.state) ?? 0)}
              .min=${Number(((Ie = (Oe = (We = (Le = this._hass) == null ? void 0 : Le.states) == null ? void 0 : We[k]) == null ? void 0 : Oe.attributes) == null ? void 0 : Ie.min) ?? 0)}
              .max=${Number(((ro = (Ve = (Co = (Mo = this._hass) == null ? void 0 : Mo.states) == null ? void 0 : Co[k]) == null ? void 0 : Ve.attributes) == null ? void 0 : ro.max) ?? 359)}
              .step=${Number(((qs = (js = (He = (co = this._hass) == null ? void 0 : co.states) == null ? void 0 : He[k]) == null ? void 0 : js.attributes) == null ? void 0 : qs.step) ?? 1)}
              @change=${(w) => {
      var F;
      return this._setNumberEntityValue(k, Number(((F = w.target) == null ? void 0 : F.value) ?? 0));
    }}
              .disabled=${!yo}
            ></ha-slider>
          </div>
          <div>
            <div class="slider-label">Camera rotation V</div>
            <ha-slider
              .value=${Number(((Zs = (Xs = (Ys = this._hass) == null ? void 0 : Ys.states) == null ? void 0 : Xs[O]) == null ? void 0 : Zs.state) ?? 0)}
              .min=${Number(((ta = (Qs = (Js = (Ks = this._hass) == null ? void 0 : Ks.states) == null ? void 0 : Js[O]) == null ? void 0 : Qs.attributes) == null ? void 0 : ta.min) ?? 0)}
              .max=${Number(((Ue = (Ge = (ea = (oa = this._hass) == null ? void 0 : oa.states) == null ? void 0 : ea[O]) == null ? void 0 : Ge.attributes) == null ? void 0 : Ue.max) ?? 90)}
              .step=${Number(((na = (aa = (sa = (se = this._hass) == null ? void 0 : se.states) == null ? void 0 : sa[O]) == null ? void 0 : aa.attributes) == null ? void 0 : na.step) ?? 1)}
              @change=${(w) => {
      var F;
      return this._setNumberEntityValue(O, Number(((F = w.target) == null ? void 0 : F.value) ?? 0));
    }}
              .disabled=${!Mt}
            ></ha-slider>
          </div>
        </div>
        <div class="row">
          <div>${k || "Camera rotation H not found"}</div>
          <div>${O || "Camera rotation V not found"}</div>
        </div>
      </div>

      <div class="section">
        <div class="title">Fixed sun position, azimuth. (Rotate scene)</div>
        <div class="row single">
          <div class="switch-row">
            <span>Fixed sun position, azimuth. (Rotate scene)</span>
            <ha-switch
              .checked=${$o}
              @change=${(w) => {
      var Xt;
      const F = !!((Xt = w.target) != null && Xt.checked);
      if (Z ? (this._setIntegrationOptions({ fixed_sun_rotation_enabled: F }), this._setConfigValue("fixedSunRotationEnabled", void 0)) : this._setConfigValue("fixedSunRotationEnabled", F), !F) return;
      const X = Math.min(359, Math.max(0, Math.round(Pt)));
      Z ? (this._setIntegrationOptions({ fixed_sun_azimuth: X }), this._setConfigValue("fixedSunAzimuthDeg", void 0)) : this._setConfigValue("fixedSunAzimuthDeg", X);
    }}
            ></ha-switch>
          </div>
          <div class="helper">Keep sun azimuth visually fixed and rotate the scene instead</div>
        </div>
      </div>

      <div class="section">
        <div class="title">Roof power</div>
        <div class="row single">
          <ha-selector
            .hass=${this._hass}
            .selector=${{ entity: { domain: ["sensor", "number", "input_number"] } }}
            .value=${Q}
            @value-changed=${(w) => {
      var X;
      const F = (X = w.detail) == null ? void 0 : X.value;
      Z ? (this._setIntegrationOptions({ roof_power_entity: F || null }), this._setConfigValue("roofPowerEntity", void 0)) : this._setConfigValue("roofPowerEntity", F);
    }}
          ></ha-selector>
        </div>
        <div class="row single">
          <div class="switch-row">
            <span>Enable power label</span>
            <ha-switch
              .checked=${Bt ?? !1}
              @change=${(w) => {
      var X;
      const F = !!((X = w.target) != null && X.checked);
      Z ? (this._setIntegrationOptions({ roof_power_enabled: F }), this._setConfigValue("roofPowerEnabled", void 0)) : this._setConfigValue("roofPowerEnabled", F);
    }}
            ></ha-switch>
          </div>
          <div class="switch-row">
            <span>Invert power value</span>
            <ha-switch
              .checked=${zt ?? !1}
              @change=${(w) => {
      var X;
      const F = !!((X = w.target) != null && X.checked);
      Z ? (this._setIntegrationOptions({ roof_power_invert: F }), this._setConfigValue("roofPowerInvert", void 0)) : this._setConfigValue("roofPowerInvert", F);
    }}
            ></ha-switch>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="title">Auto‑rotate</div>
        <div class="row single">
          <ha-textfield
            label="Speed (deg/sec)"
            type="number"
            .value=${String(at)}
            min="1"
            max="90"
            step="1"
            .configValue=${"autoRotateSpeed"}
            @change=${(w) => {
      var Xt, ia;
      const F = ((Xt = w == null ? void 0 : w.detail) == null ? void 0 : Xt.value) ?? ((ia = w == null ? void 0 : w.target) == null ? void 0 : ia.value);
      let X = Math.round(Number(F));
      Number.isNaN(X) || (X = Math.min(90, Math.max(1, X)), Z ? (this._setIntegrationOptions({ auto_rotate_speed: X }), this._setConfigValue("autoRotateSpeed", void 0)) : this._setConfigValue("autoRotateSpeed", X));
    }}
          ></ha-textfield>
        </div>
      </div>
    `;
  }
};
ii.styles = Ec`
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
let oi = ii;
const Mc = "sunlight-visualizer-card-editor";
if (!customElements.get(Mc))
  try {
    customElements.define(Mc, oi);
  } catch {
  }
const ri = class ri extends ve {
  constructor() {
    super(...arguments), this._config = {}, this._resizeObserver = null, this._hostWidth = 0;
  }
  static getConfigElement() {
    return document.createElement("sunlight-visualizer-card-editor");
  }
  static getStubConfig() {
    return {
      cardWidth: 450,
      cardHeight: 450,
      autoScaleWidth: !0,
      autoRotateEnabledDefault: !1,
      autoRotateSpeed: 25,
      fixedSunRotationEnabled: !1,
      fixedSunAzimuthDeg: 225
    };
  }
  setConfig(a) {
    this._config = a || {};
  }
  set hass(a) {
    this._hass = a, this.requestUpdate();
  }
  connectedCallback() {
    super.connectedCallback(), !(typeof ResizeObserver > "u" || this._resizeObserver) && (this._hostWidth = this.clientWidth || 0, this._resizeObserver = new ResizeObserver((a) => {
      var l, o;
      const c = Number(((o = (l = a == null ? void 0 : a[0]) == null ? void 0 : l.contentRect) == null ? void 0 : o.width) ?? this.clientWidth ?? 0);
      Math.abs(c - this._hostWidth) > 0.5 && (this._hostWidth = c, this.requestUpdate());
    }), this._resizeObserver.observe(this));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._resizeObserver && (this._resizeObserver.disconnect(), this._resizeObserver = null), this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null), this._manualRotateTimer && (clearInterval(this._manualRotateTimer), this._manualRotateTimer = null), this._cssFpsRaf && (cancelAnimationFrame(this._cssFpsRaf), this._cssFpsRaf = null), this._cssFpsCalibRaf && (cancelAnimationFrame(this._cssFpsCalibRaf), this._cssFpsCalibRaf = null), this._cssGlobalTickTimer && (clearInterval(this._cssGlobalTickTimer), this._cssGlobalTickTimer = null, this._cssGlobalTickFps = 0);
  }
  getCardSize() {
    return 4;
  }
  _getEffectiveCardSize(a) {
    const c = Math.max(1, Number(a.cardWidth ?? 450)), l = Math.max(1, Number(a.cardHeight ?? 450));
    if (!(a.autoScaleWidth ?? !0))
      return { cardW: c, cardH: l };
    const x = 250, $ = Number(this._hostWidth || this.clientWidth || 0), B = $ > 0 ? $ : c, k = Math.min(c, Math.max(x, Math.floor(B))), O = k / c, Y = Math.max(1, Math.round(l * O));
    return { cardW: k, cardH: Y };
  }
  _stopManualRotate() {
    const a = !!this._manualRotateEnabled;
    this._manualRotateTimer && (clearInterval(this._manualRotateTimer), this._manualRotateTimer = null), this._manualRotateEnabled = !1, this._manualRotateAxis = null, this._manualRotateDir = 0, this._manualRotateAccumDeg = 0, this._manualRotateTargetDeg = 0, this._manualRotateLastTick = 0, this._manualRotateIntervalMs = 0, a && (this._cssRecalibrateRequested = !0), this.requestUpdate();
  }
  _startManualRotate(a, c) {
    const l = () => typeof performance < "u" && performance.now ? performance.now() : Date.now(), o = Number(this._autoRotateSpeed || 25), x = Number(this._rotationIntervalMsFloor || this._autoRotateIntervalMs || 50), $ = Math.max(1, Number(this._autoRotateTurnCount || 1));
    this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate(), this._manualRotateEnabled = !0, this._manualRotateAxis = a, this._manualRotateDir = c, this._manualRotateAccumDeg = 0, this._manualRotateTargetDeg = a === "h" ? 360 * $ : 0, this._manualRotateLastTick = l(), this._manualRotateIntervalMs = x, this._manualRotateVOffsetDeg || (this._manualRotateVOffsetDeg = 0), this._manualRotateTimer = setInterval(() => {
      const B = l(), k = this._manualRotateLastTick || B, O = Math.max(0, B - k) / 1e3;
      if (this._manualRotateLastTick = B, !this._manualRotateEnabled) return;
      const Y = this._manualRotateAxis === "v" ? 0.5 : 1, L = o * Y * O * (this._manualRotateDir || 1);
      if (this._manualRotateAxis === "h") {
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + L, this._manualRotateAccumDeg = (this._manualRotateAccumDeg || 0) + Math.abs(L), this._manualRotateAccumDeg >= (this._manualRotateTargetDeg || 360)) {
          this._stopManualRotate();
          return;
        }
      } else if (this._manualRotateAxis === "v") {
        const tt = Number(this._manualRotateBaseVDeg ?? 35), j = Number(this._manualRotateVOffsetDeg || 0), z = Math.min(90, Math.max(0, tt + j)), E = Math.min(90, Math.max(0, z + L));
        if (this._manualRotateVOffsetDeg = j + (E - z), this._manualRotateAccumDeg = (this._manualRotateAccumDeg || 0) + Math.abs(E - z), E <= 1e-3 || E >= 89.999) {
          this._stopManualRotate();
          return;
        }
      }
      this._updateTimerMS = Date.now(), this.requestUpdate();
    }, x), this.requestUpdate();
  }
  _handleControlTap(a, c, l) {
    if (l.preventDefault(), l.stopPropagation(), a === "h" ? !!(this._autoRotateEnabled || this._manualRotateEnabled && this._manualRotateAxis === "h") : !!(this._manualRotateEnabled && this._manualRotateAxis === "v")) {
      this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate();
      return;
    }
    this._startManualRotate(a, c);
  }
  _normDeg(a) {
    const c = a % 360;
    return c < 0 ? c + 360 : c;
  }
  _degDiffAbs(a, c) {
    const l = (a - c + 540) % 360 - 180;
    return Math.abs(l);
  }
  async _setNumericEntityValue(a, c) {
    var o;
    if (!a || !((o = this._hass) != null && o.callService)) return;
    const l = a.split(".")[0];
    if (l)
      try {
        await this._hass.callService(l, "set_value", { entity_id: a, value: c });
      } catch {
      }
  }
  async _setIntegrationOptions(a) {
    var c;
    if (!((c = this._hass) != null && c.callService)) return !1;
    try {
      return await this._hass.callService("sunlight_visualizer", "set_options", a), !0;
    } catch {
      return !1;
    }
  }
  async _saveCurrentCamera(a) {
    var $t, vt, wt, Rt, ft;
    a.preventDefault(), a.stopPropagation(), this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate();
    const c = Number(this._currentCameraH ?? 0), l = Number(this._currentCameraV ?? 35), o = this._rotationHEntity, x = this._rotationVEntity, $ = !!this._fixedSunRotationEnabled, B = this._fixedSunAzimuthEntity, k = Number(this._currentSunAzimuthReal), O = Number(this._fixedSunSceneCompDeg ?? 0), Y = $ ? this._normDeg(c + O) : this._normDeg(c), L = Math.max(0, Math.min(90, l));
    this._cameraSavedBaseHOverride = Y, this._cameraSavedBaseVOverride = L, this._autoRotateOffsetDeg = 0, this._manualRotateVOffsetDeg = 0, $ && Number.isFinite(k) && (this._fixedSunAzimuthOverride = this._normDeg(k));
    const tt = (($t = this._config) == null ? void 0 : $t.siSourceAttr) ?? "sunlight_visualizer_source", j = ((vt = this._config) == null ? void 0 : vt.siSourceValue) ?? "sunlight_visualizer", z = (Z) => {
      var Q, Bt, zt, dt;
      return Z ? ((dt = (zt = (Bt = (Q = this._hass) == null ? void 0 : Q.states) == null ? void 0 : Bt[Z]) == null ? void 0 : zt.attributes) == null ? void 0 : dt[tt]) === j : !1;
    };
    if (!!((ft = (Rt = (wt = this._hass) == null ? void 0 : wt.services) == null ? void 0 : Rt.sunlight_visualizer) != null && ft.set_options) && z(o) && z(x)) {
      const Z = {
        camera_rotation_h: Math.round(this._normDeg(Y)),
        camera_rotation_v: Math.round(L)
      };
      if ($ && Number.isFinite(k) && (Z.fixed_sun_azimuth = Math.round(this._normDeg(k))), await this._setIntegrationOptions(Z)) {
        this.requestUpdate();
        return;
      }
    }
    await this._setNumericEntityValue(o, Y), await this._setNumericEntityValue(x, L), $ && B && Number.isFinite(k) && await this._setNumericEntityValue(B, this._normDeg(k)), this.requestUpdate();
  }
  _restoreSavedCamera(a) {
    a.preventDefault(), a.stopPropagation(), this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate(), this._autoRotateOffsetDeg = 0, this._manualRotateVOffsetDeg = 0, this.requestUpdate();
  }
  render() {
    if (!this._hass)
      return Io`<ha-card></ha-card>`;
    const a = this._config || {}, { cardW: c, cardH: l } = this._getEffectiveCardSize(a), o = Math.min(c, l), x = this.renderSvg(c, l), $ = !!(this._autoRotateEnabled || this._manualRotateEnabled && this._manualRotateAxis === "h"), B = !!(this._manualRotateEnabled && this._manualRotateAxis === "v"), k = this._normDeg(Number(this._currentCameraH ?? 0)), O = Math.max(0, Math.min(90, Number(this._currentCameraV ?? 35))), Y = this._normDeg(Number(this._savedCameraH ?? k)), L = Math.max(0, Math.min(90, Number(this._savedCameraV ?? O))), tt = this._degDiffAbs(k, Y) > 0.25 || Math.abs(O - L) > 0.25, j = o < 400, z = 43, E = 10, $t = 10, vt = (nt, yo, Mt) => Math.max(yo, Math.min(Mt, nt));
    let wt = !0, Rt = !0, ft, Z, Q, Bt, zt, dt;
    if (j) {
      const Mt = E + z + 8 + z + 4, Xo = c - (o < 260 ? 4 : 10), It = Math.max(0, Xo - Mt), so = o < 260 ? 2 : 8, $o = 18;
      if (wt = o >= 300 && It >= z * 3 + so * 2, wt) {
        const it = vt((It - z * 3) / 2, so, $o), Ct = z * 3 + it * 2, ht = Mt + Math.max(0, (It - Ct) / 2);
        ft = ht, Q = ht + z + it, Z = Q + z + it;
      } else {
        const it = vt(It - z * 2, so, $o), Ct = z * 2 + it, ht = Mt + Math.max(0, (It - Ct) / 2);
        ft = ht, Z = ht + z + it;
      }
      const pt = l - $t - z, Vt = o < 260 ? 46 : 34, Pt = pt - 8, Ft = Math.max(0, Pt - Vt), Yt = o < 260 ? 2 : 6, vo = o < 260 ? 10 : 24;
      if (Rt = o >= 300 && Ft >= z * 3 + Yt * 2, Rt) {
        const it = vt((Ft - z * 3) / 2, Yt, vo), Ct = z * 3 + it * 2, ht = Vt + Math.max(0, (Ft - Ct) / 2);
        Bt = ht, dt = ht + z + it, zt = dt + z + it;
      } else {
        const it = vt(Ft - z * 2, Yt, 16), Ct = z * 2 + it, ht = Vt + Math.max(0, (Ft - Ct) / 2);
        Bt = ht, zt = ht + z + it;
      }
    }
    const at = j && Q != null ? Q + z * 0.5 : void 0, go = j && dt != null ? dt + z * 0.5 : void 0, jo = j && ft != null ? `left:${ft.toFixed(1)}px; bottom:${$t}px;` : "", _o = j && Z != null ? `left:${Z.toFixed(1)}px; bottom:${$t}px;` : "", eo = j && at != null ? `left:${at.toFixed(1)}px; bottom:${$t}px;` : "", qo = j && Bt != null ? `left:${E}px; top:${Bt.toFixed(1)}px;` : "", xe = j && zt != null ? `left:${E}px; top:${zt.toFixed(1)}px;` : "", Yo = j && go != null ? `left:${E}px; top:${go.toFixed(1)}px;` : "";
    return Io`<div class="wrap">
      <ha-card style="width:${c}px; height:${l}px;">
        <div class="scene">${ed(x)}</div>
        <button class="cam-btn cam-btn-save" title="Save Camera View" @pointerup=${(nt) => this._saveCurrentCamera(nt)}><ha-icon icon="mdi:content-save"></ha-icon></button>
        ${tt ? Io`<button class="cam-btn cam-btn-restore" title="Restore Saved View" @pointerup=${(nt) => this._restoreSavedCamera(nt)}>↺</button>` : null}
        <button class="cam-btn cam-btn-h1 ${$ ? "cam-btn-stop" : ""}" style=${jo} @pointerup=${(nt) => this._handleControlTap("h", 1, nt)}>${$ ? "■" : "⇠"}</button>
        <button class="cam-btn cam-btn-h2 ${$ ? "cam-btn-stop" : ""}" style=${_o} @pointerup=${(nt) => this._handleControlTap("h", -1, nt)}>${$ ? "■" : "⇢"}</button>
        <button class="cam-btn cam-btn-v1 ${B ? "cam-btn-stop" : ""}" style=${qo} @pointerup=${(nt) => this._handleControlTap("v", 1, nt)}>${B ? "■" : "⇡"}</button>
        <button class="cam-btn cam-btn-v2 ${B ? "cam-btn-stop" : ""}" style=${xe} @pointerup=${(nt) => this._handleControlTap("v", -1, nt)}>${B ? "■" : "⇣"}</button>
        ${wt ? Io`<div class="cam-readout cam-readout-h" style=${eo}>${Math.round(k)}°</div>` : null}
        ${Rt ? Io`<div class="cam-readout cam-readout-v" style=${Yo}>${Math.round(O)}°</div>` : null}
      </ha-card>
    </div>`;
  }
  renderSvg(a, c) {
    var Gr, Ur, jr, qr, Yr, Xr, Zr, Kr, Jr, Qr, tc, oc, ec, sc, ac, nc, ic;
    const l = this._hass, o = this._config || {}, x = o.siSourceAttr ?? "sunlight_visualizer_source", $ = o.siSourceValue ?? "sunlight_visualizer", B = Object.entries(l.states ?? {}).filter(
      ([, t]) => {
        var e;
        return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e[x]) === $;
      }
    ), k = (t) => {
      for (const [e, s] of B)
        if (t(s, e)) return [e, s];
      return null;
    }, O = (t) => {
      const e = k((s) => {
        var n;
        return ((n = s == null ? void 0 : s.attributes) == null ? void 0 : n.wall) === t;
      });
      return e ? e[0] : void 0;
    }, Y = (t) => {
      const e = k((s) => {
        var n;
        return ((n = s == null ? void 0 : s.attributes) == null ? void 0 : n.camera_rotation) === t;
      });
      return e ? e[0] : void 0;
    }, L = (t) => {
      const e = k((s) => {
        var n;
        return ((n = s == null ? void 0 : s.attributes) == null ? void 0 : n.si_setting) === t;
      });
      return e ? e[0] : void 0;
    }, tt = k(
      (t) => {
        var e, s;
        return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.sun_azimuth) != null && ((s = t == null ? void 0 : t.attributes) == null ? void 0 : s.sun_elevation) != null;
      }
    ), j = tt ? tt[1].attributes : null, z = k(
      (t) => {
        var e, s, n;
        return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.roof_direction) != null || ((s = t == null ? void 0 : t.attributes) == null ? void 0 : s.ceiling_tilt) != null || ((n = t == null ? void 0 : t.attributes) == null ? void 0 : n.house_angle) != null;
      }
    ), E = z ? z[1].attributes : null, $t = !!(E != null && E.force_sun_fallback), vt = Number(a ?? o.cardWidth ?? 450), wt = Number(c ?? o.cardHeight ?? 450), Rt = vt, ft = wt, Z = Rt, Q = ft, Bt = Z, zt = Q, dt = Z * 0.1, at = o.floorScale ?? 2.6, go = Z * 0.5, jo = Q * 0.4, _o = o.floorColor ?? "#2f2f2f", eo = Number(o.floorCornerRadius ?? 26), qo = Number(o.floorThicknessPx ?? 7), xe = o.floorThicknessColor ?? "rgba(150,106,64,0.9)", Yo = o.floorTopStrokeColor ?? "rgba(72,112,56,0.8)", nt = Number(o.floorTopStrokeWidth ?? 1.4), yo = o.floorGrassEnabled ?? !0, Mt = Number(o.floorGrassOpacity ?? 0.3), Xo = o.floorGrassColorA ?? "rgb(136,186,88)", It = o.floorGrassColorB ?? "rgb(96,150,62)", so = o.rotationHEntity ?? Y("h") ?? "input_number.cube_rotation_h", $o = o.rotationVEntity ?? Y("v") ?? "input_number.cube_rotation_v";
    this._rotationHEntity = so, this._rotationVEntity = $o;
    const pt = o.preferIntegrationSettings ?? !0, Vt = o.houseAngleEntity ?? null;
    let Pt = Number(o.houseAngle ?? 0);
    const Ft = L("house_angle");
    Vt && l.states[Vt] ? Pt = Number(((Gr = l.states[Vt]) == null ? void 0 : Gr.state) ?? Pt) : Ft && l.states[Ft] ? Pt = Number(((Ur = l.states[Ft]) == null ? void 0 : Ur.state) ?? Pt) : (pt || o.houseAngle == null) && (E == null ? void 0 : E.house_angle) != null && (Pt = Number(E.house_angle ?? Pt));
    const Yt = o.wallFrontPctEntity ?? O("front"), vo = o.wallRightPctEntity ?? O("right"), it = o.wallBackPctEntity ?? O("back"), Ct = o.wallLeftPctEntity ?? O("left"), ht = o.roofPctEntity ?? O("ceiling"), So = o.fixedSunAzimuthEntity ?? L("fixed_sun_azimuth") ?? null;
    this._fixedSunAzimuthEntity = So ?? void 0;
    const _t = (t, e = !1) => {
      if (t == null || t === "") return e;
      if (typeof t == "boolean") return t;
      if (typeof t == "number") return t !== 0;
      if (typeof t == "string") {
        const s = t.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(s)) return !0;
        if (["false", "0", "no", "off"].includes(s)) return !1;
      }
      return e;
    }, we = pt ? (E == null ? void 0 : E.roof_power_entity) ?? o.roofPowerEntity ?? null : o.roofPowerEntity ?? (E == null ? void 0 : E.roof_power_entity) ?? null, Zo = pt ? _t(E == null ? void 0 : E.roof_power_enabled, _t(o.roofPowerEnabled, !1)) : _t(o.roofPowerEnabled, _t(E == null ? void 0 : E.roof_power_enabled, !1)), Ss = pt ? _t(E == null ? void 0 : E.roof_power_invert, _t(o.roofPowerInvert, !1)) : _t(o.roofPowerInvert, _t(E == null ? void 0 : E.roof_power_invert, !1)), Re = pt ? _t(
      E == null ? void 0 : E.fixed_sun_rotation_enabled,
      _t(o.fixedSunRotationEnabled, !1)
    ) : _t(
      o.fixedSunRotationEnabled,
      _t(E == null ? void 0 : E.fixed_sun_rotation_enabled, !1)
    );
    let Lt = Number(pt ? (E == null ? void 0 : E.fixed_sun_azimuth) ?? o.fixedSunAzimuthDeg ?? 225 : o.fixedSunAzimuthDeg ?? (E == null ? void 0 : E.fixed_sun_azimuth) ?? 225);
    const xo = Number(this._fixedSunAzimuthOverride);
    if (Number.isFinite(xo) && (Lt = xo), So && l.states[So]) {
      const t = Number(((jr = l.states[So]) == null ? void 0 : jr.state) ?? Lt);
      Number.isFinite(t) && (Number.isFinite(xo) && Math.abs((t - xo + 540) % 360 - 180) < 0.25 && (this._fixedSunAzimuthOverride = void 0), Lt = t);
    }
    Number.isFinite(Lt) || (Lt = 225), Lt = this._normDeg(Lt), this._fixedSunRotationEnabled = Re;
    const xs = Yt ? Number(((qr = l.states[Yt]) == null ? void 0 : qr.state) ?? 0) : 0, ws = vo ? Number(((Yr = l.states[vo]) == null ? void 0 : Yr.state) ?? 0) : 0, Rs = it ? Number(((Xr = l.states[it]) == null ? void 0 : Xr.state) ?? 0) : 0, Ms = Ct ? Number(((Zr = l.states[Ct]) == null ? void 0 : Zr.state) ?? 0) : 0, Me = ht ? Number(((Kr = l.states[ht]) == null ? void 0 : Kr.state) ?? 0) : 0, Ce = Zo && we ? Number((Jr = l.states[we]) == null ? void 0 : Jr.state) : NaN, ke = Zo ? ((t) => Number.isFinite(t) ? t >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W` : "0 W")(Ss ? Math.abs(Ce) : Ce) : "", Cs = o.useSunEntity ?? !1, Ko = o.sunEntityId ?? "sun.sun", ao = o.sunAzEntity ?? null, no = o.sunElEntity ?? null;
    let Jo = Number(o.sunDistance ?? 3), mt = Number(o.sunAz ?? 135), ot = Number(o.sunEl ?? 55);
    const ks = Number(o.sunVisualElevationBiasDeg ?? 6), Ns = Number(o.sunVisualElevationScale ?? 1);
    ao && l.states[ao] && (mt = Number(((Qr = l.states[ao]) == null ? void 0 : Qr.state) ?? mt)), no && l.states[no] && (ot = Number(((tc = l.states[no]) == null ? void 0 : tc.state) ?? ot)), !ao && pt && (j == null ? void 0 : j.sun_azimuth) != null && (mt = Number(j.sun_azimuth ?? mt)), !no && pt && (j == null ? void 0 : j.sun_elevation) != null && (ot = Number(j.sun_elevation ?? ot)), !ao && !no && !j && Cs && l.states[Ko] && (mt = Number(((oc = l.states[Ko].attributes) == null ? void 0 : oc.azimuth) ?? mt), ot = Number(((ec = l.states[Ko].attributes) == null ? void 0 : ec.elevation) ?? ot)), Number.isFinite(mt) || (mt = 135), mt = this._normDeg(mt), this._currentSunAzimuthReal = mt;
    const wo = o.roofTiltEnabled ?? !0;
    let io = Number(o.roofTiltDeg ?? 25), H = o.roofTiltFace ?? "front";
    const Qo = L("ceiling_tilt"), te = L("roof_direction"), Es = Number(o.roofTiltMax ?? 89), Fs = Number(o.roofTiltOpacity ?? 1);
    Qo && l.states[Qo] ? io = Number(((sc = l.states[Qo]) == null ? void 0 : sc.state) ?? io) : (pt || o.roofTiltDeg == null) && (E == null ? void 0 : E.ceiling_tilt) != null && (io = Number(E.ceiling_tilt ?? io)), te && l.states[te] ? H = String(((ac = l.states[te]) == null ? void 0 : ac.state) ?? H) : (pt || o.roofTiltFace == null) && (E == null ? void 0 : E.roof_direction) != null && (H = String(E.roof_direction));
    const Ro = o.houseStyleV2 ?? !0, At = o.flatRoofEnabled ?? !0, As = Number(o.flatRoofOverhang ?? 0.15), Ts = Number(o.flatRoofThickness ?? 0.12), Ds = Number(o.flatRoofLift ?? 0), Ne = o.flatRoofTopColor ?? "#e6e8ee";
    o.flatRoofEdgeColor;
    const Ee = o.flatRoofSideColor ?? "#9ea4af", Fe = Number(o.flatRoofSideShade ?? 0.4), Ae = Number(o.flatRoofTopOpacity ?? 1), oe = Number(o.flatRoofEdgeOpacity ?? 1), Te = Number(o.flatRoofTopDepthBias ?? 0.06), De = Number(o.flatRoofSideDepthBias ?? 0.025), Bs = Number(o.flatRoofSkirtDepthBias ?? 0.02), zs = o.wallWindowsEnabled ?? !0, Ps = o.wallWindowFrameColor ?? "rgba(221,228,236,0.98)", Ls = o.wallWindowGlassColor ?? "rgba(110,178,212,0.68)", Ws = o.wallWindowStrokeColor ?? "rgba(62,105,130,0.65)", Be = Number(o.wallWindowStrokeWidth ?? 1), Os = o.roofPanelsEnabled ?? Ro, Is = o.roofPanelColor ?? "#2d3f7b", ze = o.roofPanelGridColor ?? "rgba(214,230,255,0.65)", Vs = o.roofPanelBorderColor ?? "rgba(185,204,234,0.85)", Hs = Number(o.roofPanelBorderWidth ?? 0.9), ee = Math.max(1, Math.round(Number(o.roofPanelsCols ?? 3))), Gs = C(Number(o.roofPanelsWidthFrac ?? 0.9), 0.4, 0.98), Us = C(Number(o.roofPanelsGapFrac ?? 0.025), 0, 0.08), Pe = C(Number(o.roofPanelsT0 ?? 0.05), 0, 0.95), Le = C(Number(o.roofPanelsT1 ?? 0.26), 0.01, 0.98), We = Math.max(1, Math.round(Number(o.roofPanelGridCols ?? 5))), Oe = Math.max(1, Math.round(Number(o.roofPanelGridRows ?? 3))), Ie = o.backTreeEnabled ?? !0, Mo = Number(o.backTreeX ?? -2.2), Co = Number(o.backTreeZ ?? -2.2), Ve = Number(o.backTreeScale ?? 1), ro = o.backTreeLeafColor ?? "#9bc94b", co = o.backTreeTrunkColor ?? "#6f4b2a", He = o.backTreeShadowEnabled ?? Ro, js = Number(o.backTreeShadowOpacity ?? 0.35), qs = Number(o.backTreeShadowBlur ?? 1.1), Ys = Number(o.backTreeShadowLength ?? 0.015), Xs = o.plinthBandEnabled ?? Ro, Zs = Number(o.plinthBandHeight ?? 0.06), Ks = Number(o.plinthBandMix ?? 0.62), Js = o.patioStepEnabled ?? Ro, Qs = Number(o.patioStepDepth ?? 0.24), ta = Number(o.patioStepWidth ?? 1.1), oa = Number(o.patioStepInset ?? 0.02), ea = o.patioStepColor ?? "rgba(226,230,235,0.75)", Ge = o.patioGridColor ?? "rgba(164,170,182,0.8)", Ue = Number(o.patioGridWidth ?? 1), se = o.shadowEnabled ?? !0, sa = Number(o.shadowOpacity ?? 0.35), aa = Number(o.shadowBlur ?? 4), na = Number(o.shadowContactOpacity ?? 0.12), w = Number(o.shadowContactBlur ?? 2.5), F = o.shadowColor ?? "#000000", X = Number(o.shadowClipInset ?? 0.02), Xt = o.baseAnchorShadowEnabled ?? !0, ia = Number(o.baseAnchorShadowOpacity ?? 0.65), zc = Number(o.baseAnchorShadowBlur ?? 0.2), Pc = Number(o.baseAnchorShadowSpread ?? 0.05), Lc = o.baseAnchorShadowColor ?? "#000000", Oa = o.sunlightEnabled ?? !0, Ia = o.sunlightColor ?? [255, 225, 160], ci = Number(o.sunlightOpacity ?? 0.7), Wc = Number(o.sunlightSpread ?? 0.7), Oc = Number(o.sunBeamStaticOpacity ?? 0.07), Ic = Number(o.sunBeamStaticWidth ?? 1.6), Va = o.sunBeamFlowEnabled ?? !0, Vc = o.sunBeamFlowColor ?? "rgba(255,200,50,0.85)", Hc = Number(o.sunBeamFlowOpacity ?? 0.55), Gc = Number(o.sunBeamFlowWidthScale ?? 0.6), Ha = Number(o.sunBeamFlowDash ?? 8), Ga = Number(o.sunBeamFlowGap ?? 50), Uc = Number(o.sunBeamFlowDuration ?? 2.5), jc = Number(o.sunBeamFlowPhaseStep ?? 0.1), qc = Number(o.sunBeamDepthScaleBoost ?? 1), Yc = Number(o.sunBeamDepthScaleMin ?? 0.55), Xc = Number(o.sunBeamDepthScaleMax ?? 1.2), Zc = o.sunRayAnimEnabled ?? !0, Ua = Number(o.sunRayAnimDurationMin ?? 1.8), ja = Number(o.sunRayAnimDurationMax ?? 3), Kc = Number(o.sunRayAnimScaleMin ?? 0.5), Jc = Number(o.sunRayAnimScaleMax ?? 0.75), Qc = Number(o.sunRayAnimOpacityMin ?? 0.45);
    Number(o.sunRayAnimOpacityMax ?? 0.85);
    const li = o.sunRayAnimColorA ?? "rgb(255,240,110)";
    o.sunRayAnimColorB;
    const je = o.skyCloudsEnabled ?? !0, hi = Number(o.skyCloudOpacity ?? 0.34), tl = Number(o.skyCloudBlur ?? 3.3), qa = Number(o.skyCloudScale ?? 1.5), Ya = Number(o.skyCloudSpeed ?? 1), ol = Number(o.skyCloudHeight ?? 0.5);
    Number(o.wallBottomMix ?? 0.01), Number(o.wallMidMix ?? 0.7), Number(o.wallTopMix ?? 1.3);
    const el = o.facadeSunDimmingEnabled ?? !0, sl = Number(o.facadeSunMinFactor ?? 0.2), al = Number(o.facadeSunNoDimAtPct ?? 90), nl = Number(o.facadeSunCurve ?? 8), il = Number(o.ceilingDarkMix ?? 0.1), rl = Number(o.ceilingLightMix ?? 1.4), ui = o.horizonEnabled ?? !0, cl = Number(o.horizonBase ?? 0.55), ll = Number(o.horizonTiltStrength ?? 0.65), fi = Number(o.horizonBand ?? 0.15), hl = o.horizonTopColor ?? [120, 170, 220], ul = o.horizonBandColor ?? [255, 210, 150], fl = o.horizonBottomColor ?? [70, 80, 95], dl = Number(o.skyTwilightRangeDeg ?? 6), pl = o.horizonNightTopColor ?? [12, 20, 42], ml = o.horizonNightBandColor ?? [32, 44, 82], bl = o.horizonNightBottomColor ?? [6, 10, 22], gl = o.horizonSunriseTopColor ?? [118, 150, 206], _l = o.horizonSunriseBandColor ?? [236, 162, 132], yl = o.horizonSunriseBottomColor ?? [84, 70, 90], $l = o.horizonSunsetTopColor ?? [98, 106, 178], vl = o.horizonSunsetBandColor ?? [255, 122, 90], Sl = o.horizonSunsetBottomColor ?? [82, 48, 76], qe = o.skyStarsEnabled ?? !0, ra = Math.max(0, Math.round(Number(o.skyStarsCount ?? 34))), xl = o.skyStarsTwinkleEnabled ?? !0, wl = Number(o.skyStarsOpacity ?? 0.9), Xa = o.skyMoonEnabled ?? !0, Rl = Number(o.skyMoonX ?? 0.86), Ml = Number(o.skyMoonY ?? 0.12), Cl = Number(o.skyMoonSize ?? 14), kl = Number(o.skyMoonPhase ?? 0.72), Nl = Number(o.skyMoonOpacity ?? 0.92), Ye = o.moonlightEnabled ?? !0, ca = o.moonlightColor ?? [178, 208, 255], El = Number(o.moonlightOpacity ?? 0.22), Fl = Number(o.moonlightSpread ?? 0.6), Al = Number(o.moonlightWashOpacity ?? 0.08), Tl = Number(o.moonShadowElevationDeg ?? 18), Dl = Number(o.moonShadowYawDeg ?? -45), Bl = Number(o.shadowSunMoonBlendDeg ?? 3), di = o.vignetteEnabled ?? !0, zl = Number(o.vignetteOpacity ?? 0.35), Pl = Number(o.vignetteRadius ?? 0.65), Ll = Number(o.vignetteInner ?? 0.85), Za = o.vignetteColor ?? [0, 0, 0], Wl = o.roofBackEnabled ?? !0, pi = Number(o.roofBackMix ?? 0.7), Ol = Number(o.roofBackOpacity ?? 1);
    Number(o.roofGradientDarkMix ?? 0.125), Number(o.roofGradientLightMix ?? 1.25);
    const Il = o.roofSidesEnabled ?? !0, Vl = Number(o.roofSideMix ?? 0.45), Ka = Number(o.roofSideOpacity ?? 1), mi = Number(o.roofSideDepthBias ?? 0.012), Hl = o.roofCapEnabled ?? !0, Gl = Number(o.floorCompassStroke ?? 4), Ul = Number(o.floorCompassRingBand ?? 0.09), jl = o.floorCompassRingMiddleColor ?? "rgba(255,255,255,0.9)", bi = o.floorCompassRingSideColor ?? "rgba(210,140,140,0.345)", gi = Number(o.floorCompassRingSideWidth ?? 3), _i = o.floorCompassTicksEnabled ?? !0, ql = o.floorCompassTickColor ?? "rgba(0,0,0,0.75)", Yl = Number(o.floorCompassTickWidth ?? 1), Xl = Number(o.floorCompassTickMajorWidth ?? 4), Zl = Number(o.floorCompassTickLength ?? -0.1), Kl = Number(o.floorCompassTickMajorLength ?? -0.2), Jl = Number(o.floorCompassLabelSize ?? 20), Ql = Number(o.floorCompassLabelInset ?? -0.25), th = Number(o.floorCompassLabelScaleBoost ?? 1.2), oh = Number(o.floorCompassLabelScaleMin ?? 0.6), eh = Number(o.floorCompassLabelScaleMax ?? 2), sh = Number(o.floorCompassLabelStroke ?? 1), yi = Number(o.arrowScaleBoost ?? 0.6), $i = Number(o.floorPointerScaleMin ?? 0.05), vi = Number(o.floorPointerScaleMax ?? 1), Si = Number(o.floorPointerBaseWidth ?? 3.4), ah = Number(o.floorPointerBaseHead ?? 18), Ja = o.floorPointerColor ?? "gold", xi = o.floorPointerShadowEnabled ?? !0, Qa = Number(o.floorPointerShadowOpacity ?? 0.8), nh = Number(o.floorPointerShadowBlur ?? 1.1), ih = Number(o.floorPointerShadowOffset ?? 2.9), rh = Number(o.floorWallLabelSize ?? 12), la = Number(o.floorWallLabelOffset ?? 0.55), ch = Number(o.floorWallLabelScaleBoost ?? 1.2), lh = Number(o.floorWallLabelScaleMin ?? 0.5), hh = Number(o.floorWallLabelScaleMax ?? 1.8), uh = Number(o.floorWallLabelScreenLift ?? 6), fh = o.floorWallLabelColor ?? "rgba(255,255,255,0.9)", dh = o.floorWallLabelStroke ?? "rgba(0,0,0,0.6)", ph = Number(o.floorWallLabelStrokeWidth ?? 0.5), wi = Number(o.wallLabelVisibleThreshold ?? -0.05), mh = Number(o.wallPctVisibleThreshold ?? -0.215), bh = Number(o.wallPctAreaThreshold ?? 120), gh = Number(o.wallPctVerticalPos ?? 0.66), Ri = o.surfaceLabelEnabled ?? !0, tn = Number(o.surfaceLabelSize ?? 12), _h = Number(o.surfaceLabelScaleBoost ?? 1.5), yh = Number(o.surfaceLabelScaleMin ?? 0.6), $h = Number(o.surfaceLabelScaleMax ?? 1.6), Mi = o.surfaceLabelColor ?? "rgba(255,213,0,.95)", Ci = o.surfaceLabelStroke ?? "rgba(0,0,0,0.5)", on = Number(o.surfaceLabelStrokeWidth ?? 0.5), en = Number(o.surfaceLabelOffset ?? 0.03), vh = Number(o.roofPctLabelScale ?? 1.18), Sh = Number(o.roofPowerLabelScale ?? 0.7), xh = o.roofPowerLabelColor ?? "rgba(255,255,255,0.9)", wh = o.frontDoorEnabled ?? !0, sn = Number(o.frontDoorWidth ?? 0.55), ki = Number(o.frontDoorHeight ?? 1.1), Rh = Number(o.frontDoorBottomInset ?? 0.05), Mh = Number(o.frontDoorOffset ?? 0.01), Ch = o.frontDoorColor ?? "rgba(0,0,0,0.55)", Ni = Number(o.frontDoorOpacity ?? 0.9), kh = o.frontDoorFrameColor ?? "rgba(219,225,232,0.98)", Nh = o.frontDoorKnobColor ?? "rgba(236,198,111,0.95)", kt = o.faceColors ?? {
      front: "#faf5f5ff",
      right: "#d8d2d2ff",
      top: "#13a057",
      back: "#d8d2d2ff",
      left: "#d8d2d2ff",
      bottom: "#d8d2d2ff"
    }, Eh = o.autoRotateEnabledDefault ?? !1, ha = Number(E == null ? void 0 : E.auto_rotate_speed);
    let Xe = Number(o.autoRotateSpeed ?? 25);
    (pt && Number.isFinite(ha) || (o.autoRotateSpeed === void 0 || o.autoRotateSpeed === null || o.autoRotateSpeed === "") && Number.isFinite(ha)) && (Xe = ha);
    const Tt = Number(o.autoRotateIntervalMs ?? 50), an = Number(o.autoRotateTapDelayMs ?? 250), Fh = o.autoRotateStopOnFullTurn ?? !0, nn = Number(o.autoRotateTurnCount ?? 1), Ah = o.autoRotateShowFps ?? !0, Th = Number(o.autoRotateFpsWindowMs ?? 1e3), Dh = o.autoRotateAdaptiveEnabled ?? !0, Ei = Number(o.autoRotateAdaptiveMaxIntervalMs ?? 1e3), Bh = Number(o.autoRotateAdaptiveStepMs ?? 10), zh = Number(o.autoRotateAdaptiveCheckMs ?? 1e3), Ph = Number(o.autoRotateAdaptiveFpsThreshold ?? 0.8), Lh = Number(o.autoRotateCalibrateMs ?? 2e3), Wh = Number(o.autoRotateCalibrateFactor ?? 0.85), Fi = o.cssFpsDebugEnabled ?? !1, Oh = Number(o.cssFpsWindowMs ?? 1e3), Ih = Number(o.cssFpsUiUpdateMs ?? 500), ua = o.cssFpsAutoLimitEnabled ?? !0, Vh = Number(o.cssFpsCalibrateMs ?? 2e3), Hh = Number(o.cssFpsLimitThreshold ?? 20), Gh = Number(o.cssFpsLimitFactor ?? 0.5), Uh = Number(o.cssFpsLimitMin ?? 1), jh = Number(o.cssFpsLimitMax ?? 30), qh = o.cssFpsLimitTextEnabled ?? !0, Ai = Number(o.cssFpsRotationStartBoost ?? 2);
    this._autoRotateSpeed = Xe, this._autoRotateIntervalMs = Tt, this._autoRotateTurnCount = nn, this._autoRotateEnabled === void 0 && (this._autoRotateEnabled = Eh), this._autoRotateOffsetDeg === void 0 && (this._autoRotateOffsetDeg = 0), this._autoRotateIntervalMsDynamic === void 0 && (this._autoRotateIntervalMsDynamic = Tt), this._autoRotateFpsSamples === void 0 && (this._autoRotateFpsSamples = []), this._autoRotateFps === void 0 && (this._autoRotateFps = 0), this._autoRotateCalibrated === void 0 && (this._autoRotateCalibrated = !1), this._autoRotateAccumDeg === void 0 && (this._autoRotateAccumDeg = 0), this._autoRotateTargetDeg === void 0 && (this._autoRotateTargetDeg = 0), this._cssFps === void 0 && (this._cssFps = 0), this._cssFpsLimit === void 0 && (this._cssFpsLimit = 0), this._cssPerfLimited === void 0 && (this._cssPerfLimited = !1), this._cssFpsAutoCalibrated === void 0 && (this._cssFpsAutoCalibrated = !1), this._cssFpsMeasured === void 0 && (this._cssFpsMeasured = 0), this._cssRecalibrateRequested === void 0 && (this._cssRecalibrateRequested = !1);
    const ae = () => typeof performance < "u" && performance.now ? performance.now() : Date.now(), Ti = ae() / 1e3, fa = (t, e = 0) => {
      const s = Math.max(1e-3, t);
      return -(((Ti + e) % s + s) % s);
    }, da = (t, e = 0) => {
      const s = Math.max(1e-3, t);
      return -((e % s + s) % s);
    }, pa = () => {
      const t = Number(this._cssFpsLimit || 0);
      if (!(ua && !!this._cssPerfLimited && t > 0)) return Tt;
      const s = Math.max(1, Number.isFinite(Ai) ? Ai : 2), n = Math.max(1, Math.round(t * s));
      return Math.max(Tt, Math.round(1e3 / n));
    };
    this._cssGlobalTimeSec === void 0 && (this._cssGlobalTimeSec = ae() / 1e3);
    const Di = () => {
      this._cssGlobalTickTimer && (clearInterval(this._cssGlobalTickTimer), this._cssGlobalTickTimer = null), this._cssGlobalTickFps = 0;
    }, Yh = (t) => {
      const e = Math.max(1, Math.round(t));
      if (this._cssGlobalTickTimer && Number(this._cssGlobalTickFps || 0) === e) return;
      Di();
      const s = Math.max(1, Math.round(1e3 / e)), n = () => {
        var u, d;
        const i = ae() / 1e3, r = Math.floor(i * e) / e;
        this._cssGlobalTimeSec = r;
        const h = (d = (u = this.renderRoot) == null ? void 0 : u.querySelector) == null ? void 0 : d.call(u, "svg.sv-scene");
        h && h.style.setProperty("--sv-global-time", r.toFixed(3));
      };
      n(), this._cssGlobalTickFps = e, this._cssGlobalTickTimer = setInterval(n, s);
    }, Xh = () => {
      this._cssFpsRaf && (cancelAnimationFrame(this._cssFpsRaf), this._cssFpsRaf = null), this._cssFpsSamples = [], this._cssFps = 0;
    }, Zh = () => {
      if (this._cssFpsRaf) return;
      this._cssFpsSamples = [], this._cssFpsUiLast = 0;
      const t = (e) => {
        const s = this._cssFpsSamples || [];
        s.push(e);
        const n = e - Oh;
        for (; s.length && s[0] < n; ) s.shift();
        if (this._cssFpsSamples = s, s.length >= 2) {
          const r = (s[s.length - 1] - s[0]) / 1e3;
          this._cssFps = r > 0 ? (s.length - 1) / r : 0;
        }
        const i = this._cssFpsUiLast || 0;
        e - i >= Ih && (this._cssFpsUiLast = e, this._updateTimerMS = Date.now(), this.requestUpdate()), this._cssFpsRaf = requestAnimationFrame(t);
      };
      this._cssFpsRaf = requestAnimationFrame(t);
    }, rn = () => {
      this._cssFpsCalibRaf && (cancelAnimationFrame(this._cssFpsCalibRaf), this._cssFpsCalibRaf = null), this._cssFpsAutoCalibrating = !1;
    }, Kh = () => {
      if (this._cssFpsAutoCalibrated || this._cssFpsAutoCalibrating) return;
      this._cssFpsAutoCalibrating = !0;
      const t = [];
      let e = 0;
      const s = (n) => {
        if (e || (e = n), t.push(n), n - e >= Vh) {
          rn();
          let i = 0;
          if (t.length >= 2) {
            const h = (t[t.length - 1] - t[0]) / 1e3;
            i = h > 0 ? (t.length - 1) / h : 0;
          }
          this._cssFpsMeasured = i;
          let r = 0;
          i > 0 && i < Hh && (i < 5 ? r = 1 : (r = Math.floor(i * Gh), r = Math.min(jh, Math.max(Uh, r)))), this._cssFpsLimit = r, this._cssPerfLimited = r > 0, this._cssFpsAutoCalibrated = !0, this._updateTimerMS = Date.now(), this.requestUpdate();
          return;
        }
        this._cssFpsCalibRaf = requestAnimationFrame(s);
      };
      this._cssFpsCalibRaf = requestAnimationFrame(s);
    }, Bi = (t) => {
      const e = this._autoRotateFpsSamples || [];
      e.push(t);
      const s = t - Th;
      for (; e.length && e[0] < s; ) e.shift();
      if (this._autoRotateFpsSamples = e, e.length >= 2) {
        const n = (e[e.length - 1] - e[0]) / 1e3;
        this._autoRotateFps = n > 0 ? (e.length - 1) / n : 0;
      }
    }, zi = (t) => {
      if (!this._autoRotateCalibrated || !Dh) return;
      const e = this._autoRotateAdaptiveLastCheck || 0;
      if (t - e < zh) return;
      this._autoRotateAdaptiveLastCheck = t;
      const s = 1e3 / this._autoRotateIntervalMsDynamic;
      if (this._autoRotateFps && this._autoRotateFps < s * Ph) {
        const n = Math.min(
          Ei,
          this._autoRotateIntervalMsDynamic + Bh
        );
        n !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = n, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
    }, Pi = (t) => {
      if (this._autoRotateCalibrated) return;
      const e = this._autoRotateCalibrateStart || t;
      if (this._autoRotateCalibrateStart = e, t - e < Lh) return;
      const s = this._autoRotateFps || 0;
      if (s > 0) {
        const i = 1e3 / (s * Wh), r = Math.min(
          Ei,
          Math.max(pa(), Math.round(i))
        );
        r !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = r, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
      this._autoRotateCalibrated = !0;
    }, cn = () => {
      this._autoRotateEnabled && (this._autoRotateLastTick = 0, this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = 0, this._autoRotateEnabled = !1, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null), this._autoRotateIntervalMsDynamic = Tt, this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._cssRecalibrateRequested = !0, this._updateTimerMS = Date.now(), this.requestUpdate());
    }, Jh = () => {
      this._autoRotateEnabled || (this._manualRotateEnabled && this._stopManualRotate(), this._autoRotateEnabled = !0, this._autoRotateLastTick = ae(), this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = Fh && nn > 0 ? nn * 360 : 0, this._autoRotateIntervalMsDynamic = pa(), this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._autoRotateTimer || (this._autoRotateTimer = setInterval(() => {
        const t = ae();
        Bi(t), Pi(t), zi(t);
        const e = this._autoRotateLastTick || t, s = Math.max(0, t - e) / 1e3, n = Xe * s;
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + n, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + n, this._autoRotateLastTick = t, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
          cn();
          return;
        }
        this._updateTimerMS = Date.now(), this.requestUpdate();
      }, this._autoRotateIntervalMsDynamic), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic), this._updateTimerMS = Date.now(), this.requestUpdate());
    };
    if (this._autoRotateStop = cn, this._autoRotateStartFn = Jh, this._autoRotateHandlers || (this._autoRotateHandlers = !0, this._autoRotateLastTap = 0, this.addEventListener("pointerup", (t) => {
      var i;
      if ((t.composedPath ? t.composedPath() : []).some((r) => {
        var h, u;
        return (u = (h = r == null ? void 0 : r.classList) == null ? void 0 : h.contains) == null ? void 0 : u.call(h, "cam-btn");
      }) || t.button !== void 0 && t.button !== 0) return;
      const s = Date.now(), n = this._autoRotateLastTap || 0;
      if (s - n < an) {
        this._autoRotateLastTap = 0, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), (i = this._autoRotateStartFn) == null || i.call(this);
        return;
      }
      this._autoRotateLastTap = s, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), this._autoRotateClickTimer = setTimeout(() => {
        var r;
        this._autoRotateLastTap && Date.now() - this._autoRotateLastTap >= an && (this._autoRotateLastTap = 0, (r = this._autoRotateStop) == null || r.call(this));
      }, an + 10);
    }, { capture: !1 })), this._autoRotateEnabled) {
      const t = pa();
      Number(this._autoRotateIntervalMsDynamic || Tt) < t && (this._autoRotateIntervalMsDynamic = t, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null)), (!this._autoRotateTimer || this._autoRotateTimerMs !== this._autoRotateIntervalMsDynamic) && (this._autoRotateTimer && clearInterval(this._autoRotateTimer), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic, this._autoRotateTimer = setInterval(() => {
        const e = ae();
        Bi(e), Pi(e), zi(e);
        const s = this._autoRotateLastTick || e, n = Math.max(0, e - s) / 1e3, i = Xe * n;
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + i, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + i, this._autoRotateLastTick = e, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
          cn();
          return;
        }
        this._updateTimerMS = Date.now(), this.requestUpdate();
      }, this._autoRotateIntervalMsDynamic));
    } else this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null);
    Fi ? Zh() : Xh();
    const Li = !!(this._autoRotateEnabled || this._manualRotateEnabled);
    ua && this._cssRecalibrateRequested && !Li && (rn(), this._cssFpsAutoCalibrated = !1, this._cssFpsMeasured = 0, this._cssRecalibrateRequested = !1), ua ? Kh() : (rn(), this._cssFpsAutoCalibrated = !1, this._cssFpsMeasured = 0, this._cssFpsLimit = 0, this._cssPerfLimited = !1, this._cssRecalibrateRequested = !1);
    const ut = ua && this._cssPerfLimited && Number(this._cssFpsLimit) > 0, lo = ut ? Number(this._cssFpsLimit) : 0, ma = ut && lo <= 5, ln = Zc && !ma, hn = xl && !(ut && lo <= 1), Qh = pa();
    this._rotationIntervalMsFloor = Qh;
    const un = Li, tu = ut && un;
    ut && !un ? Yh(lo) : Di();
    const Wi = Number(((nc = l.states[so]) == null ? void 0 : nc.state) || 210), Oi = Number(((ic = l.states[$o]) == null ? void 0 : ic.state) || 35);
    let ba = Wi, ga = Oi;
    const fn = Number(this._cameraSavedBaseHOverride), dn = Number(this._cameraSavedBaseVOverride);
    Number.isFinite(fn) && (ba = fn, Math.abs((Wi - fn + 540) % 360 - 180) < 0.25 && (this._cameraSavedBaseHOverride = void 0)), Number.isFinite(dn) && (ga = dn, Math.abs(Oi - dn) < 0.25 && (this._cameraSavedBaseVOverride = void 0)), this._autoRotateCurrentDeg = this._autoRotateOffsetDeg || 0;
    const Ii = Number(this._autoRotateOffsetDeg || 0), Vi = Re ? (mt - Lt + 540) % 360 - 180 : 0;
    this._fixedSunSceneCompDeg = Vi;
    const Hi = (ba + Ii + Vi) * Math.PI / 180;
    this._manualRotateBaseVDeg = ga;
    const ou = Number(this._manualRotateVOffsetDeg || 0), ko = Math.min(Math.max(ga + ou, 0), 90);
    this._savedCameraH = this._normDeg(ba), this._savedCameraV = Math.max(0, Math.min(90, ga)), this._currentCameraH = this._normDeg(ba + Ii), this._currentCameraV = ko;
    const Gi = ko * Math.PI / 180, Ze = 5, _a = Math.cos(Hi), ya = Math.sin(Hi), $a = Math.cos(Gi), va = -Math.sin(Gi), Ui = (Pt || 0) * Math.PI / 180, ji = Math.cos(Ui), qi = Math.sin(Ui), eu = Math.PI * 2;
    function C(t, e, s) {
      return Math.min(s, Math.max(e, t));
    }
    function St(t) {
      const e = Math.hypot(...t);
      return e > 0 ? t.map((s) => s / e) : [0, 0, 0];
    }
    function su(t, e) {
      return t[0] * e[0] + t[1] * e[1] + t[2] * e[2];
    }
    function G(t) {
      const e = t[0], s = t[1], n = t[2], i = e * _a - n * ya, r = e * ya + n * _a, h = s * $a - r * va, u = s * va + r * $a;
      return [i, h, u];
    }
    function Yi(t) {
      const e = t[0], s = t[1], n = t[2], i = s * $a + n * va, r = -s * va + n * $a, h = e * _a + r * ya, u = -e * ya + r * _a;
      return [h, i, u];
    }
    function bt(t) {
      const e = t[0], s = t[1], n = t[2], i = e * ji + n * qi, r = -e * qi + n * ji;
      return [i, s, r];
    }
    function Sa(t) {
      return G(bt(t));
    }
    function U(t) {
      const e = t[0], s = t[1], n = t[2], i = Ze / (Ze + n);
      return [go + e * dt * i, jo - s * dt * i, n, i];
    }
    function Dt(t, e) {
      const s = parseInt(t.substr(1, 2), 16), n = parseInt(t.substr(3, 2), 16), i = parseInt(t.substr(5, 2), 16), r = Math.min(255, Math.max(0, Math.round(s * e))), h = Math.min(255, Math.max(0, Math.round(n * e))), u = Math.min(255, Math.max(0, Math.round(i * e)));
      return `rgb(${r},${h},${u})`;
    }
    function xa(t, e, s, n) {
      const i = St([s[0] - e[0], s[1] - e[1], s[2] - e[2]]), r = [t[0] - e[0], t[1] - e[1], t[2] - e[2]], h = Math.cos(n), u = Math.sin(n), d = [
        i[1] * r[2] - i[2] * r[1],
        i[2] * r[0] - i[0] * r[2],
        i[0] * r[1] - i[1] * r[0]
      ], f = i[0] * r[0] + i[1] * r[1] + i[2] * r[2], p = [
        r[0] * h + d[0] * u + i[0] * f * (1 - h),
        r[1] * h + d[1] * u + i[1] * f * (1 - h),
        r[2] * h + d[2] * u + i[2] * f * (1 - h)
      ];
      return [e[0] + p[0], e[1] + p[1], e[2] + p[2]];
    }
    function au(t, e, s) {
      const n = [e[0] - t[0], e[1] - t[1], e[2] - t[2]], i = [s[0] - t[0], s[1] - t[1], s[2] - t[2]];
      return St([
        n[1] * i[2] - n[2] * i[1],
        n[2] * i[0] - n[0] * i[2],
        n[0] * i[1] - n[1] * i[0]
      ]);
    }
    function No(t) {
      return t.reduce((e, s) => e + s[2], 0) / t.length;
    }
    function Xi(t) {
      const e = Number(t);
      return Number.isFinite(e) ? `${Math.round(e)}%` : "0%";
    }
    function pn(t) {
      let e = 0;
      for (let s = 0; s < t.length; s++) {
        const n = (s + 1) % t.length;
        e += t[s][0] * t[n][1] - t[n][0] * t[s][1];
      }
      return e;
    }
    function nu(t, e) {
      if (!t.length || e.length < 3) return [];
      const n = pn(e) > 0, i = (u, d, f) => {
        const p = (f[0] - d[0]) * (u[1] - d[1]) - (f[1] - d[1]) * (u[0] - d[0]);
        return n ? p >= 0 : p <= 0;
      }, r = (u, d, f, p) => {
        const m = u[0], b = u[1], g = d[0], _ = d[1], R = f[0], A = f[1], T = p[0], P = p[1], W = (m - g) * (A - P) - (b - _) * (R - T);
        if (Math.abs(W) < 1e-6) return d;
        const V = ((m * _ - b * g) * (R - T) - (m - g) * (R * P - A * T)) / W, N = ((m * _ - b * g) * (A - P) - (b - _) * (R * P - A * T)) / W;
        return [V, N];
      };
      let h = t.slice();
      for (let u = 0; u < e.length; u++) {
        const d = e[u], f = e[(u + 1) % e.length], p = h.slice();
        if (h = [], !p.length) break;
        for (let m = 0; m < p.length; m++) {
          const b = p[m], g = p[(m - 1 + p.length) % p.length], _ = i(b, d, f), R = i(g, d, f);
          _ ? (R || h.push(r(g, b, d, f)), h.push(b)) : R && h.push(r(g, b, d, f));
        }
      }
      return h;
    }
    function Zi(t, e, s, n) {
      return n > 0 && (t = -t, e = -e, s = -s, n = -n), t * n - e * s < 0 && (t = -t, e = -e), t < 0 && (t = -t, e = -e, s = -s, n = -n), { bx: t, by: e, ux: s, uy: n };
    }
    function Ki(t, e, s, n) {
      return t * n - e * s < 0 && (s = -s, n = -n), { bx: t, by: e, ux: s, uy: n };
    }
    function Ji(t, e, s, n, i = !0) {
      const r = U(G(t)), h = U(G([
        t[0] + e[0],
        t[1] + e[1],
        t[2] + e[2]
      ])), u = U(G([
        t[0] + s[0],
        t[1] + s[1],
        t[2] + s[2]
      ]));
      let d = h[0] - r[0], f = h[1] - r[1], p = Math.hypot(d, f);
      if (p < 1e-6) return null;
      d /= p, f /= p;
      let m = u[0] - r[0], b = u[1] - r[1], g = Math.hypot(m, b);
      g < 1e-6 ? (m = -f, b = d, g = Math.hypot(m, b)) : (m /= g, b /= g);
      let _ = i ? Zi(d, f, m, b) : Ki(d, f, m, b);
      if (n) {
        const R = U(G([
          t[0] + n[0],
          t[1] + n[1],
          t[2] + n[2]
        ]));
        let A = R[0] - r[0], T = R[1] - r[1], P = Math.hypot(A, T);
        P > 1e-6 && (A /= P, T /= P, _.bx * A + _.by * T < 0 && (_ = i ? Zi(-_.bx, -_.by, -_.ux, -_.uy) : Ki(-_.bx, -_.by, -_.ux, -_.uy)));
      }
      return { basis: _, centerScr: r };
    }
    function iu(t, e) {
      const s = t[0][0], n = t[0][1], i = t[1][0], r = t[1][1], h = t[2][0], u = t[2][1], d = e[0][0], f = e[0][1], p = e[1][0], m = e[1][1], b = e[2][0], g = e[2][1], _ = s * (r - u) + i * (u - n) + h * (n - r);
      if (Math.abs(_) < 1e-6) return null;
      const R = (d * (r - u) + p * (u - n) + b * (n - r)) / _, A = (f * (r - u) + m * (u - n) + g * (n - r)) / _, T = (d * (h - i) + p * (s - h) + b * (i - s)) / _, P = (f * (h - i) + m * (s - h) + g * (i - s)) / _, W = (d * (i * u - h * r) + p * (h * n - s * u) + b * (s * r - i * n)) / _, V = (f * (i * u - h * r) + m * (h * n - s * u) + g * (s * r - i * n)) / _;
      return { a: R, b: A, c: T, d: P, e: W, f: V };
    }
    function ru(t) {
      const e = [0, 1, 0], s = [
        e[1] * t[2] - e[2] * t[1],
        e[2] * t[0] - e[0] * t[2],
        e[0] * t[1] - e[1] * t[0]
      ];
      return St(s);
    }
    function Qi(t) {
      if (t.length <= 1) return t.slice();
      const e = t.slice().sort((r, h) => r.x === h.x ? r.z - h.z : r.x - h.x), s = (r, h, u) => (h.x - r.x) * (u.z - r.z) - (h.z - r.z) * (u.x - r.x), n = [];
      for (const r of e) {
        for (; n.length >= 2 && s(n[n.length - 2], n[n.length - 1], r) <= 0; )
          n.pop();
        n.push(r);
      }
      const i = [];
      for (let r = e.length - 1; r >= 0; r--) {
        const h = e[r];
        for (; i.length >= 2 && s(i[i.length - 2], i[i.length - 1], h) <= 0; )
          i.pop();
        i.push(h);
      }
      return i.pop(), n.pop(), n.concat(i);
    }
    function cu(t, e, s, n, i) {
      if (t.length === 0) return t;
      const r = (f, p, m) => {
        const b = [];
        for (let g = 0; g < f.length; g++) {
          const _ = f[g], R = f[(g + 1) % f.length], A = p(_), T = p(R);
          A && T ? b.push(R) : A && !T ? b.push(m(_, R)) : !A && T && (b.push(m(_, R)), b.push(R));
        }
        return b;
      }, h = (f, p, m) => {
        const b = p.x - f.x;
        if (Math.abs(b) < 1e-9) return { x: m, z: f.z };
        const g = (m - f.x) / b;
        return { x: m, z: f.z + g * (p.z - f.z) };
      }, u = (f, p, m) => {
        const b = p.z - f.z;
        if (Math.abs(b) < 1e-9) return { x: f.x, z: m };
        const g = (m - f.z) / b;
        return { x: f.x + g * (p.x - f.x), z: m };
      };
      let d = t.slice();
      return d = r(d, (f) => f.x >= e, (f, p) => h(f, p, e)), d = r(d, (f) => f.x <= s, (f, p) => h(f, p, s)), d = r(d, (f) => f.z >= n, (f, p) => u(f, p, n)), d = r(d, (f) => f.z <= i, (f, p) => u(f, p, i)), d;
    }
    function lu(t) {
      if (t.length <= 1) return t.slice();
      const e = t.slice().sort((r, h) => r.x === h.x ? r.y - h.y : r.x - h.x), s = (r, h, u) => (h.x - r.x) * (u.y - r.y) - (h.y - r.y) * (u.x - r.x), n = [];
      for (const r of e) {
        for (; n.length >= 2 && s(n[n.length - 2], n[n.length - 1], r) <= 0; ) n.pop();
        n.push(r);
      }
      const i = [];
      for (let r = e.length - 1; r >= 0; r--) {
        const h = e[r];
        for (; i.length >= 2 && s(i[i.length - 2], i[i.length - 1], h) <= 0; ) i.pop();
        i.push(h);
      }
      return i.pop(), n.pop(), n.concat(i);
    }
    const ne = mt * Math.PI / 180, mn = ot * Math.PI / 180, Ht = St([
      Math.cos(mn) * Math.sin(ne),
      Math.sin(mn),
      Math.cos(mn) * Math.cos(ne)
    ]), bn = C(ot * Ns + ks, -89.9, 89.9) * Math.PI / 180, gn = St([
      Math.cos(bn) * Math.sin(ne),
      Math.sin(bn),
      Math.cos(bn) * Math.cos(ne)
    ]);
    G(Ht);
    const Nt = Ht[1] > 0.01, tr = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ], Zt = tr.map(bt), Ke = Zt.map(G), Kt = Ke.map(U), hu = [
      { id: "front", i: [4, 5, 6, 7], c: kt.front },
      { id: "right", i: [1, 5, 6, 2], c: kt.right },
      { id: "back", i: [0, 1, 2, 3], c: kt.back },
      { id: "left", i: [0, 4, 7, 3], c: kt.left },
      { id: "bottom", i: [0, 1, 5, 4], c: kt.bottom }
    ], _n = {
      front: { indices: [4, 5, 6, 7], edge: [4, 5] },
      right: { indices: [1, 5, 6, 2], edge: [1, 5] },
      back: { indices: [0, 1, 2, 3], edge: [0, 1] },
      left: { indices: [0, 4, 7, 3], edge: [0, 4] }
    }, or = {
      front: [0, 0, 1],
      right: [1, 0, 0],
      back: [0, 0, -1],
      left: [-1, 0, 0]
    }, Je = {
      front: xs,
      right: ws,
      back: Rs,
      left: Ms
    }, Qe = (t) => {
      if (!el) return 1;
      const e = C(sl, 0, 1), s = C(al, 1, 100), i = C(Number.isFinite(t) ? t : 0, 0, s) / s, r = Math.max(1e-3, nl), h = Math.log(1 + r * i) / Math.log(1 + r);
      return e + (1 - e) * h;
    }, ho = {
      front: Qe(Je.front),
      right: Qe(Je.right),
      back: Qe(Je.back),
      left: Qe(Je.left)
    }, Wt = Qe(Me), uu = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    }, ct = [
      [-1, 1, -1],
      [1, 1, -1],
      [1, 1, 1],
      [-1, 1, 1]
    ], yn = C(io, 0, Es), Eo = wo && yn > 0.01;
    let J = ct;
    if (Eo) {
      const t = yn * Math.PI / 180;
      let e = [-1, 1, 1], s = [1, 1, 1], n = 1;
      H === "front" && (e = [-1, 1, 1], s = [1, 1, 1], n = 1), H === "back" && (e = [-1, 1, -1], s = [1, 1, -1], n = -1), H === "left" && (e = [-1, 1, -1], s = [-1, 1, 1], n = 1), H === "right" && (e = [1, 1, -1], s = [1, 1, 1], n = -1);
      const i = t * n;
      J = ct.map((r) => xa(r, e, s, i));
    }
    const ts = J.map(bt), er = ts.map(G), wa = er.map(U);
    let $n = au(J[0], J[1], J[2]);
    $n[1] < 0 && ($n = $n.map((t) => -t));
    const sr = pn(wa), Ra = sr < 0;
    At ? this._roofWindingFront = Ra : this._roofWindingFront === void 0 ? this._roofWindingFront = Ra : Math.abs(sr) > 20 && (this._roofWindingFront = Ra);
    const uo = At ? Ra : this._roofWindingFront;
    let vn = null;
    const os = (t, e) => /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t) ? Dt(t, e) : t;
    let ar = !1, Sn = !0, Ma = !1;
    const Jt = [];
    if (At) {
      const t = Math.max(0, As), e = Math.max(0, Ds), s = Math.max(0.01, Ts), n = 1 + e, i = n + s;
      let r = [
        [-1 - t, i, -1 - t],
        [1 + t, i, -1 - t],
        [1 + t, i, 1 + t],
        [-1 - t, i, 1 + t]
      ], h = [
        [-1 - t, n, -1 - t],
        [1 + t, n, -1 - t],
        [1 + t, n, 1 + t],
        [-1 - t, n, 1 + t]
      ], u = [
        [-1, n, -1],
        [1, n, -1],
        [1, n, 1],
        [-1, n, 1]
      ];
      if (Eo) {
        const N = yn * Math.PI / 180;
        let v = [-1, n, 1], M = [1, n, 1], I = 1;
        H === "front" && (v = [-1, n, 1], M = [1, n, 1], I = 1), H === "back" && (v = [-1, n, -1], M = [1, n, -1], I = -1), H === "left" && (v = [-1, n, -1], M = [-1, n, 1], I = 1), H === "right" && (v = [1, n, -1], M = [1, n, 1], I = -1);
        const D = N * I;
        r = r.map((q) => xa(q, v, M, D)), h = h.map((q) => xa(q, v, M, D)), u = u.map((q) => xa(q, v, M, D));
      }
      const d = r.map(bt), f = h.map(bt);
      vn = d;
      const p = d.map((N) => G(N)), m = f.map((N) => G(N)), b = p.map((N) => U(N)), g = m.map((N) => U(N)), _ = No(g) - No(b);
      this._flatRoofBottomCloser === void 0 ? this._flatRoofBottomCloser = _ < 0 : _ < -0.01 ? this._flatRoofBottomCloser = !0 : _ > 0.01 && (this._flatRoofBottomCloser = !1), ar = !!this._flatRoofBottomCloser;
      const R = os(Ne, Wt);
      Jt.push({
        type: "flatRoofTop",
        pts: b,
        z: No(b) - Te,
        fill: R,
        opacity: Ae
      });
      const A = [
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
      ], T = [...p, ...m].reduce((N, v) => [N[0] + v[0], N[1] + v[1], N[2] + v[2]], [0, 0, 0]).map((N) => N / 8);
      A.forEach((N) => {
        const v = ho[N.id] ?? Wt, M = C(v, 0.2, 1), I = Math.min(...N.pts.map((lt) => lt[2])), D = N.cam.reduce((lt, qt) => [lt[0] + qt[0], lt[1] + qt[1], lt[2] + qt[2]], [0, 0, 0]).map((lt) => lt / 4), q = St([D[0] - T[0], D[1] - T[1], D[2] - T[2]]), et = St([-D[0], -D[1], -Ze - D[2]]);
        su(q, et) > -0.02 && Jt.push({
          type: `flatRoofEdge-${N.id}`,
          pts: N.pts,
          z: I - De,
          fill: os(Ne, M),
          opacity: oe
        });
      });
      const P = ho[H] ?? Wt;
      if (Jt.push({
        type: "flatRoofBottom",
        pts: g,
        z: No(g),
        fill: os(Ee, Math.max(0.2, P * Fe * pi)),
        opacity: oe
      }), Eo) {
        const v = u.map(bt).map((q) => U(G(q))), M = [Kt[3], Kt[2], Kt[6], Kt[7]], I = (q) => {
          const et = ho[q] ?? 1;
          return os(Ee, C(et * Fe, 0.2, 1));
        }, D = (q, et, yt) => {
          const lt = Math.max(...et.map((qt) => qt[2]));
          Jt.push({
            type: yt,
            pts: et,
            // Keep connector skirts behind the roof overhang edges at corner views.
            z: lt + Math.max(Bs, 0.02),
            fill: I(q),
            opacity: Ka
          });
        };
        H === "front" ? (D("left", [v[0], M[0], v[3]], "flatRoofSkirt-left"), D("right", [v[1], M[1], v[2]], "flatRoofSkirt-right"), D("back", [v[0], v[1], M[1], M[0]], "flatRoofSkirt-back")) : H === "back" ? (D("left", [v[3], M[3], v[0]], "flatRoofSkirt-left"), D("right", [v[2], M[2], v[1]], "flatRoofSkirt-right"), D("front", [v[2], v[3], M[3], M[2]], "flatRoofSkirt-front")) : H === "left" ? (D("front", [v[2], M[2], v[3]], "flatRoofSkirt-front"), D("back", [v[1], M[1], v[0]], "flatRoofSkirt-back"), D("right", [v[1], v[2], M[2], M[1]], "flatRoofSkirt-right")) : H === "right" && (D("front", [v[3], M[3], v[2]], "flatRoofSkirt-front"), D("back", [v[0], M[0], v[1]], "flatRoofSkirt-back"), D("left", [v[0], v[3], M[3], M[0]], "flatRoofSkirt-left")), e > 1e-3 && (H === "front" ? D("front", [v[3], v[2], M[2], M[3]], "flatRoofSkirt-front-low") : H === "back" ? D("back", [v[0], v[1], M[1], M[0]], "flatRoofSkirt-back-low") : H === "left" ? D("left", [v[0], v[3], M[3], M[0]], "flatRoofSkirt-left-low") : H === "right" && D("right", [v[1], v[2], M[2], M[1]], "flatRoofSkirt-right-low"));
      }
      const W = Jt.find((N) => N.type === "flatRoofTop"), V = Jt.find((N) => N.type === "flatRoofBottom");
      if (Ma = ar || !uo, Sn = !Ma, W && V && (Ma ? (W.opacity = 0, V.opacity = oe) : (W.opacity = Ae, V.opacity = 0)), W && Sn) {
        const N = Jt.filter((v) => v !== W);
        if (N.length) {
          const v = Math.min(...N.map((M) => M.z));
          W.z = Math.min(W.z, v - Math.max(0.015, Te));
        }
      }
      if (V && Ma) {
        const N = Jt.filter((v) => v !== V);
        if (N.length) {
          const v = Math.max(...N.map((M) => M.z));
          V.z = Math.max(V.z, v + Math.max(0.02, De));
        }
      }
    }
    const xn = At ? Sn : uo;
    let es = [];
    Eo && Il && (H === "front" ? es = [
      { tri: [J[0], ct[0], J[3]], wall: "left" },
      { tri: [J[1], ct[1], J[2]], wall: "right" }
    ] : H === "back" ? es = [
      { tri: [J[3], ct[3], J[0]], wall: "left" },
      { tri: [J[2], ct[2], J[1]], wall: "right" }
    ] : H === "left" ? es = [
      { tri: [J[2], ct[2], J[3]], wall: "front" },
      { tri: [J[1], ct[1], J[0]], wall: "back" }
    ] : H === "right" && (es = [
      { tri: [J[3], ct[3], J[2]], wall: "front" },
      { tri: [J[0], ct[0], J[1]], wall: "back" }
    ]));
    const fu = es.map((t) => ({
      pts: t.tri.map((e) => U(Sa(e))),
      wall: t.wall
    })), wn = (t) => {
      const e = ho[t] ?? Wt, s = kt[t] ?? kt.top;
      return Dt(s, Vl * e);
    }, du = ho[H] ?? Wt, pu = kt[H] ?? kt.top, mu = Dt(pu, pi * du), bu = Dt(kt.top, Wt);
    let ie = null, re = null;
    Eo && Hl && (H === "front" ? (ie = [J[0], J[1], ct[1], ct[0]], re = "back") : H === "back" ? (ie = [J[2], J[3], ct[3], ct[2]], re = "front") : H === "left" ? (ie = [J[1], J[2], ct[2], ct[1]], re = "right") : H === "right" && (ie = [J[0], J[3], ct[3], ct[0]], re = "left"));
    const Rn = ie ? ie.map((t) => U(Sa(t))) : null, gu = wn(re || H);
    let Gt = [0, 0, -1];
    H === "front" && (Gt = [0, 0, -1]), H === "back" && (Gt = [0, 0, 1]), H === "left" && (Gt = [1, 0, 0]), H === "right" && (Gt = [-1, 0, 0]);
    const ce = J.reduce((t, e) => [t[0] + e[0], t[1] + e[1], t[2] + e[2]], [0, 0, 0]).map((t) => t / 4), le = 2.2;
    U(Sa([
      ce[0] - Gt[0] * le,
      ce[1] - Gt[1] * le,
      ce[2] - Gt[2] * le
    ])), U(Sa([
      ce[0] + Gt[0] * le,
      ce[1] + Gt[1] * le,
      ce[2] + Gt[2] * le
    ]));
    const K = -1, Mn = -1, nr = [
      [-at, K, -at],
      [at, K, -at],
      [at, K, at],
      [-at, K, at]
    ].map(G).map(U);
    let Cn = null;
    if (Xt) {
      const t = 1 + Math.max(0, Pc);
      Cn = [0, 1, 5, 4].map((i) => {
        const r = Zt[i];
        return [r[0] * t, K, r[2] * t];
      }).map((i) => U(G(i))).map((i) => i[0] + "," + i[1]).join(" ");
    }
    const _u = Math.min(...nr.map((t) => t[1])), ir = C(_u - 6, Q * 0.32, Q * 0.82);
    this._skyClipBottom === void 0 || this._skyClipCardW !== Z || this._skyClipCardH !== Q ? (this._skyClipBottom = ir, this._skyClipVertDeg = ko, this._skyClipCardW = Z, this._skyClipCardH = Q) : Math.abs(ko - (this._skyClipVertDeg ?? ko)) > 0.15 && (this._skyClipBottom = ir, this._skyClipVertDeg = ko);
    const ss = Number(this._skyClipBottom), Fo = [
      gn[0] * Jo,
      gn[1] * Jo,
      gn[2] * Jo
    ], rr = G(Fo), rt = U(rr), yu = Ke.reduce((t, e) => t + e[2], 0) / Ke.length, $u = rr[2] > yu + 0.02, Ao = rt[3], vu = Math.max(4, 12 * Ao), Su = Math.max(3, 8 * Ao), kn = C(cl - ko / 90 * ll, 0.1, 0.9), xu = C(kn - fi, 0, 1), wu = C(kn, 0, 1), Ru = C(kn + fi, 0, 1), Qt = (t, e) => {
      const s = Array.isArray(t) ? t : e;
      return [
        C(Number((s == null ? void 0 : s[0]) ?? e[0]), 0, 255),
        C(Number((s == null ? void 0 : s[1]) ?? e[1]), 0, 255),
        C(Number((s == null ? void 0 : s[2]) ?? e[2]), 0, 255)
      ];
    }, he = (t, e, s) => [
      Math.round(t[0] + (e[0] - t[0]) * s),
      Math.round(t[1] + (e[1] - t[1]) * s),
      Math.round(t[2] + (e[2] - t[2]) * s)
    ], cr = Number(this._prevSunEl);
    let ue = Number(this._skyTrend);
    if (Number.isFinite(ue) || (ue = -1), Number.isFinite(cr)) {
      const t = ot - cr;
      t < -0.03 ? ue = -1 : t > 0.03 && (ue = 1);
    }
    this._prevSunEl = ot, this._skyTrend = ue;
    const Nn = ue < 0, fe = Math.max(1, dl), En = C((ot + fe) / (2 * fe), 0, 1), Mu = C(1 - Math.abs(ot) / fe, 0, 1), Fn = Math.pow(Mu, 0.85), as = C((-ot + 1.5) / (fe + 5), 0, 1), Ca = qe ? C((-ot - 1.2) / (fe + 3), 0, 1) : 0, fo = Xa ? C((-ot + 0.2) / (fe + 2), 0, 1) : 0, Cu = C(Rl, 0.05, 0.95), ku = C(Ml, 0.05, 0.95), To = Cu * Z, Do = ku * Q, Ut = C(Cl, 6, 44), Nu = C(kl, 0, 1), de = C(fo * Nl, 0, 1), Eu = C(Tl, 0.5, 89.5), lr = (Dl + 180) * Math.PI / 180, An = Eu * Math.PI / 180, Fu = St([
      Math.sin(lr) * Math.cos(An),
      Math.sin(An),
      -Math.cos(lr) * Math.cos(An)
    ]);
    let jt = St(Yi(Fu));
    jt[1] < 0.06 && (jt = St([jt[0], 0.06, jt[2]]));
    const Au = Qt(hl, [120, 170, 220]), Tu = Qt(ul, [255, 210, 150]), Du = Qt(fl, [70, 80, 95]), Bu = Qt(pl, [12, 20, 42]), zu = Qt(ml, [32, 44, 82]), Pu = Qt(bl, [6, 10, 22]), Lu = Qt(Nn ? $l : gl, [108, 128, 188]), Wu = Qt(Nn ? vl : _l, [246, 146, 112]), Ou = Qt(Nn ? Sl : yl, [84, 62, 84]), Iu = he(Bu, Au, En), Vu = he(zu, Tu, En), Hu = he(Pu, Du, En), Tn = he(Iu, Lu, Fn * 0.82), Gu = he(Vu, Wu, Fn * 0.95), hr = he(Hu, Ou, Fn * 0.68), Et = at * (1 - 0.05), ka = 64;
    let pe = this._ringUnit;
    (!pe || pe.length !== ka) && (pe = Array.from({ length: ka }, (t, e) => {
      const s = e / ka * eu;
      return [Math.sin(s), Math.cos(s)];
    }), this._ringUnit = pe);
    const ur = Math.min(Ul, Et * 0.3), fr = Et - ur, Uu = Et + ur;
    function Dn(t) {
      return pe.map(([e, s]) => {
        const n = G([t * e, K, t * s]), i = U(n);
        return i[0] + "," + i[1];
      });
    }
    const ju = Dn(fr), qu = Dn(Et), Yu = Dn(Uu);
    let dr = [];
    _i && (dr = pe.map(([t, e], s) => {
      const n = s % (ka / 4) === 0, i = n ? Kl : Zl, r = fr, h = r - i, u = U(G([h * t, K, h * e])), d = U(G([r * t, K, r * e]));
      return { pIn: u, pOut: d, isMajor: n };
    }));
    const Xu = [["N", 0], ["E", Math.PI / 2], ["S", Math.PI], ["W", 3 * Math.PI / 2]], pr = Et * (1 - Ql), Zu = Xu.map(([t, e]) => {
      const s = G([pr * Math.sin(e), K, pr * Math.cos(e)]), n = U(s), i = C(n[3] * th, oh, eh);
      return { t, x: n[0], y: n[1], scale: i };
    }), po = St([Math.sin(ne), 0, Math.cos(ne)]), Na = St([jt[0], 0, jt[2]]), Ku = G([po[0] * Et * 0.25, K, po[2] * Et * 0.25]), Ju = G([po[0] * Et * 0.95, K, po[2] * Et * 0.95]), Bo = U(Ku), zo = U(Ju), Qu = C(Bo[3] * yi, $i, vi), Bn = C(zo[3] * yi, $i, vi), tf = Si * Qu, of = Si * Bn, Po = ah * Bn, mr = [
      { id: "front", label: "Front", normal: [0, 0, 1], pos: [0, K, 1 + la] },
      { id: "back", label: "Back", normal: [0, 0, -1], pos: [0, K, -1 - la] },
      { id: "right", label: "Right", normal: [1, 0, 0], pos: [1 + la, K, 0] },
      { id: "left", label: "Left", normal: [-1, 0, 0], pos: [-1 - la, K, 0] }
    ], zn = {}, Pn = {};
    mr.forEach((t) => {
      const e = G(bt(t.normal));
      zn[t.id] = e[2] < wi;
      const s = _n[t.id];
      if (s) {
        const n = s.indices.map((r) => Kt[r]), i = Math.abs(pn(n));
        Pn[t.id] = e[2] < mh && i > bh;
      } else
        Pn[t.id] = zn[t.id];
    });
    let ns = null;
    const Ln = Math.max(0.1, Bl), br = C((ot + Ln) / (2 * Ln), 0, 1), Wn = Ht[1] > 0.01 ? Ht : St([Ht[0], 0.01, Ht[2]]), ef = ot > -Ln ? 1 : 0, sf = Ye && fo > 0.03 && jt[1] > 0.01 ? 1 : 0, gr = br * ef, _r = (1 - br) * sf, Ea = gr + _r, is = Ea > 1e-6 ? gr / Ea : 0, me = Ea > 1e-6 ? _r / Ea : 0, On = is > 0 || me > 0 ? St([
      Wn[0] * is + jt[0] * me,
      Wn[1] * is + jt[1] * me,
      Wn[2] * is + jt[2] * me
    ]) : Ht;
    if (se && (is > 0 || me > 0)) {
      const t = [-On[0], -On[1], -On[2]];
      if (Math.abs(t[1]) > 1e-6) {
        const e = [], s = Eo ? Zt.concat(ts) : Zt;
        for (const i of s) {
          const r = (Mn - i[1]) / t[1];
          r >= 0 && e.push({ x: i[0] + t[0] * r, z: i[2] + t[2] * r });
        }
        const n = Qi(e);
        if (n.length >= 3) {
          const i = C(X, 0, 0.2), r = at * (1 - i), h = cu(n, -r, r, -r, r);
          h.length >= 3 && (ns = h.map((u) => U(G([u.x, Mn, u.z]))));
        }
      }
    }
    const yr = ns ? ns.map((t) => t[0] + "," + t[1]).join(" ") : null;
    let rs = null, cs = null;
    if (Oa && Nt) {
      const e = Math.hypot(at * 2, at * 2) * Wc, s = [po[0] * Et * 0.95, K, po[2] * Et * 0.95], n = [
        s[0] - po[0] * e,
        K,
        s[2] - po[2] * e
      ], i = G(s), r = G(n);
      rs = U(i), cs = U(r);
    }
    let ls = null, hs = null;
    if (Ye && !Nt && fo > 0.03) {
      const e = Math.hypot(at * 2, at * 2) * Fl, s = [Na[0] * Et * 0.9, K, Na[2] * Et * 0.9], n = [
        s[0] - Na[0] * e,
        K,
        s[2] - Na[2] * e
      ];
      ls = U(G(s)), hs = U(G(n));
    }
    const $r = `sv-beam-flow-${Math.round((Ha + Ga) * 10)}`, vr = `sv-sun-ray-${Math.round((Ua + ja) * 10)}`, Sr = `sv-cloud-drift-${Math.round(Z)}-${Math.round(Q)}`, af = Number(o.sunBeamRaySpacingPx ?? 40), nf = Number(o.sunBeamRayMinSepPx ?? 16), rf = Number(o.sunBeamSilhouetteMinRays ?? 3), cf = Number(o.sunBeamSilhouetteMaxRays ?? 7), xr = Eo ? Zt.concat(ts) : Zt, wr = xr.map((t, e) => {
      const s = G(t), n = U(s);
      return { sourceIdx: e, x: n[0], y: n[1], zCam: s[2], world: t };
    }), xt = lu(
      wr
    ), be = [], Fa = (t, e, s, n = -1, i = [0, 0, 0]) => {
      const r = Math.max(1, nf) ** 2;
      for (const h of be) {
        const u = h.x - t, d = h.y - e;
        if (u * u + d * d < r) return;
      }
      be.push({ x: t, y: e, zCam: s, sourceIdx: n, world: i });
    };
    if (xt.length >= 2) {
      let t = 0;
      for (let s = 0; s < xt.length; s++) {
        const n = (s + 1) % xt.length;
        t += xt[s].x * xt[n].y - xt[n].x * xt[s].y;
      }
      const e = t > 0;
      for (let s = 0; s < xt.length; s++) {
        const n = xt[s], i = xt[(s + 1) % xt.length], r = i.x - n.x, h = i.y - n.y, u = Math.hypot(r, h);
        if (u < 1e-3) continue;
        const d = (n.x + i.x) * 0.5, f = (n.y + i.y) * 0.5;
        let p = e ? h : -h, m = e ? -r : r;
        const b = Math.hypot(p, m) || 1;
        p /= b, m /= b;
        const g = rt[0] - d, _ = rt[1] - f;
        if (!(p * g + m * _ > 0)) continue;
        Fa(n.x, n.y, n.zCam, n.sourceIdx, n.world), Fa(i.x, i.y, i.zCam, i.sourceIdx, i.world);
        const A = Math.max(8, af), T = Math.max(1, Math.min(4, Math.round(u / A)));
        for (let P = 0; P < T; P++) {
          const W = (P + 1) / (T + 1), V = [
            n.world[0] + (i.world[0] - n.world[0]) * W,
            n.world[1] + (i.world[1] - n.world[1]) * W,
            n.world[2] + (i.world[2] - n.world[2]) * W
          ], N = G(V), v = U(N);
          Fa(v[0], v[1], N[2], -1, V);
        }
      }
    }
    !be.length && xt.length && xt.forEach((t) => Fa(t.x, t.y, t.zCam, t.sourceIdx, t.world)), be.length > 1 && be.sort((t, e) => {
      const s = Math.atan2(t.y - rt[1], t.x - rt[0]), n = Math.atan2(e.y - rt[1], e.x - rt[0]);
      return s - n;
    });
    const Rr = (t, e) => {
      if (t.length <= e) return t.slice();
      if (e <= 1) return [t[Math.floor(t.length / 2)]];
      const s = [];
      for (let n = 0; n < e; n++) {
        const i = Math.round(n * (t.length - 1) / (e - 1));
        s.push(t[i]);
      }
      return s;
    }, us = Math.max(1, Math.floor(rf)), Mr = Math.max(us, Math.floor(cf));
    let Ot = be.slice();
    if (Ot.length > Mr && (Ot = Rr(Ot, Mr)), Ot.length < us) {
      const t = xt.map((e) => ({ x: e.x, y: e.y, zCam: e.zCam, sourceIdx: e.sourceIdx, world: e.world }));
      if (t.length >= us)
        Ot = Rr(t, us);
      else if (t.length > 0)
        for (; Ot.length < us; ) {
          const e = t[Ot.length % t.length];
          Ot.push({ x: e.x, y: e.y, zCam: e.zCam, sourceIdx: e.sourceIdx, world: e.world });
        }
    }
    Ot.length || [2, 3, 6, 7].forEach((t) => {
      const e = Kt[t], s = Ke[t];
      Ot.push({ x: e[0], y: e[1], zCam: s[2], sourceIdx: t, world: Zt[t] });
    });
    const In = /* @__PURE__ */ new Set();
    if (Nt) {
      const t = [-Ht[0], -Ht[1], -Ht[2]];
      if (Math.abs(t[1]) > 1e-6) {
        const e = xr.map((s, n) => {
          const i = (Mn - s[1]) / t[1];
          return i < 0 ? null : { sourceIdx: n, x: s[0] + t[0] * i, z: s[2] + t[2] * i };
        }).filter((s) => !!s);
        if (e.length >= 3) {
          const s = Qi(e.map((i) => ({ x: i.x, z: i.z }))), n = 1e-4;
          e.forEach((i) => {
            s.some((r) => Math.abs(r.x - i.x) <= n && Math.abs(r.z - i.z) <= n) && In.add(i.sourceIdx);
          });
        }
      }
    }
    const Cr = ((t) => {
      const e = [], s = /* @__PURE__ */ new Set();
      return t.forEach((n) => {
        const i = `${Math.round(n.x)},${Math.round(n.y)}`;
        s.has(i) || (s.add(i), e.push(n));
      }), e;
    })(
      wr.filter((t) => In.has(t.sourceIdx)).map((t) => ({ x: t.x, y: t.y, zCam: t.zCam, sourceIdx: t.sourceIdx, world: t.world }))
    ), Vn = Cr.length ? Cr : Ot, Hn = /* @__PURE__ */ new Map(), kr = (t, e, s, n, i) => {
      const r = `${Math.round(e)},${Math.round(s)}`;
      Hn.has(r) || Hn.set(r, { x: e, y: s, zCam: n, sourceIdx: t, world: i });
    };
    Object.entries(_n).forEach(([t, e]) => {
      G(bt(or[t]))[2] >= wi || e.indices.forEach((n) => {
        kr(n, Kt[n][0], Kt[n][1], Ke[n][2], Zt[n]);
      });
    }), uo && wa.forEach((t, e) => {
      const s = Zt.length + e;
      kr(s, t[0], t[1], er[e][2], ts[e]);
    });
    let Gn = Array.from(Hn.values()).filter(
      (t) => In.has(t.sourceIdx)
    );
    if (!Gn.length && Vn.length) {
      const t = Vn.slice().sort((e, s) => e.zCam - s.zCam);
      Gn = t.slice(0, Math.min(3, t.length));
    }
    function lf(t, e) {
      const s = t.length;
      if (s < 3) return "";
      let n = "";
      for (let i = 0; i < s; i++) {
        const r = t[(i - 1 + s) % s], h = t[i], u = t[(i + 1) % s], d = [r[0] - h[0], r[1] - h[1]], f = [u[0] - h[0], u[1] - h[1]], p = Math.hypot(d[0], d[1]), m = Math.hypot(f[0], f[1]);
        if (p === 0 || m === 0) continue;
        const b = Math.min(e, p / 2, m / 2), g = [d[0] / p, d[1] / p], _ = [f[0] / m, f[1] / m], R = [h[0] + g[0] * b, h[1] + g[1] * b], A = [h[0] + _[0] * b, h[1] + _[1] * b];
        i === 0 ? n += `M ${R[0]} ${R[1]}` : n += ` L ${R[0]} ${R[1]}`, n += ` Q ${h[0]} ${h[1]} ${A[0]} ${A[1]}`;
      }
      return n + " Z";
    }
    const ge = nr.map((t) => [t[0], t[1]]), Aa = lf(ge, eo);
    function hf(t, e, s = 8) {
      const n = t.length;
      if (n < 3) return t.slice();
      const i = [];
      for (let r = 0; r < n; r++) {
        const h = t[(r - 1 + n) % n], u = t[r], d = t[(r + 1) % n], f = [h[0] - u[0], h[1] - u[1]], p = [d[0] - u[0], d[1] - u[1]], m = Math.hypot(f[0], f[1]), b = Math.hypot(p[0], p[1]);
        if (m === 0 || b === 0) continue;
        const g = Math.min(e, m / 2, b / 2), _ = [f[0] / m, f[1] / m], R = [p[0] / b, p[1] / b], A = [u[0] + _[0] * g, u[1] + _[1] * g], T = [u[0] + R[0] * g, u[1] + R[1] * g];
        i.length, i.push(A);
        for (let P = 1; P <= s; P++) {
          const W = P / s, V = 1 - W;
          i.push([
            V * V * A[0] + 2 * V * W * u[0] + W * W * T[0],
            V * V * A[1] + 2 * V * W * u[1] + W * W * T[1]
          ]);
        }
      }
      return i;
    }
    const fs = hf(ge, eo, 8), Nr = fs.map((t) => [t[0], t[1] + qo]), Er = [];
    for (let t = 0; t < fs.length; t++) {
      const e = (t + 1) % fs.length;
      Er.push([
        fs[t],
        fs[e],
        Nr[e],
        Nr[t]
      ]);
    }
    const Un = C(X, 0, 0.2), Ta = ge.reduce((t, e) => [t[0] + e[0], t[1] + e[1]], [0, 0]).map((t) => t / ge.length), uf = Un > 0 ? ge.map((t) => [
      Ta[0] + (t[0] - Ta[0]) * (1 - Un),
      Ta[1] + (t[1] - Ta[1]) * (1 - Un)
    ]) : ge, gt = [];
    if (ui && gt.push(`<linearGradient id="horizon-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgb(${Tn.join(",")})"/>
        <stop offset="${(xu * 100).toFixed(2)}%" stop-color="rgb(${Tn.join(",")})"/>
        <stop offset="${(wu * 100).toFixed(2)}%" stop-color="rgb(${Gu.join(",")})"/>
        <stop offset="${(Ru * 100).toFixed(2)}%" stop-color="rgb(${hr.join(",")})"/>
        <stop offset="100%" stop-color="rgb(${hr.join(",")})"/>
      </linearGradient>`), (je || qe && Ca > 0.01 || Xa && fo > 0.03) && gt.push(`<clipPath id="sky-cloud-clip"><rect x="0" y="0" width="${Z}" height="${ss}"/></clipPath>`), je && gt.push(`<filter id="sky-cloud-blur" x="-30%" y="-40%" width="160%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Math.max(0, tl)}"/>
      </filter>`), gt.push(`<radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,200,0.85)"/>
      <stop offset="70%" stop-color="rgba(255,255,150,0.35)"/>
      <stop offset="100%" stop-color="rgba(255,255,100,0)"/>
    </radialGradient>`), gt.push(`<linearGradient id="ceiling-grad" x1="0" y1="1" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${Dt(kt.top, il * Wt)}"/>
      <stop offset="100%" stop-color="${Dt(kt.top, rl * Wt)}"/>
    </linearGradient>`), yo && Mt > 1e-3 && gt.push(`<linearGradient id="floor-grass-grad" x1="0" y1="0.1" x2="1" y2="0.95" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="${Xo}" stop-opacity="${C(Mt * 0.55, 0, 1)}"/>
        <stop offset="55%" stop-color="${It}" stop-opacity="${C(Mt, 0, 1)}"/>
        <stop offset="100%" stop-color="${Xo}" stop-opacity="${C(Mt * 0.42, 0, 1)}"/>
      </linearGradient>`), se && yr && (gt.push(`<filter id="shadow-blur-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${aa}"/>
      </filter>`), gt.push(`<filter id="shadow-blur-contact" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${w}"/>
      </filter>`)), Xt && gt.push(`<filter id="base-anchor-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${zc}"/>
      </filter>`), xi && gt.push(`<filter id="floor-pointer-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${nh}"/>
      </filter>`), He && gt.push(`<filter id="back-tree-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${qs}"/>
      </filter>`), Oa && Nt && rs && cs && gt.push(`<linearGradient id="sunlight-grad" x1="${rs[0]}" y1="${rs[1]}"
                  x2="${cs[0]}" y2="${cs[1]}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="rgb(${Ia.join(",")})" stop-opacity="${ci}"/>
          <stop offset="55%" stop-color="rgb(${Ia.join(",")})" stop-opacity="${ci * 0.45}"/>
          <stop offset="100%" stop-color="rgb(${Ia.join(",")})" stop-opacity="0"/>
        </linearGradient>`), Ye && !Nt && ls && hs) {
      const t = Array.isArray(ca) ? ca : [178, 208, 255], e = C(El * fo, 0, 1);
      gt.push(`<linearGradient id="moonlight-grad" x1="${ls[0]}" y1="${ls[1]}"
                  x2="${hs[0]}" y2="${hs[1]}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="rgb(${t.join(",")})" stop-opacity="${e}"/>
          <stop offset="60%" stop-color="rgb(${t.join(",")})" stop-opacity="${e * 0.35}"/>
          <stop offset="100%" stop-color="rgb(${t.join(",")})" stop-opacity="0"/>
        </linearGradient>`);
    }
    di && gt.push(`<radialGradient id="vignette" cx="50%" cy="50%" r="${Pl}">
        <stop offset="0%" stop-color="rgb(${Za.join(",")})" stop-opacity="0"/>
        <stop offset="${(Ll * 100).toFixed(1)}%" stop-color="rgb(${Za.join(",")})" stop-opacity="0"/>
        <stop offset="100%" stop-color="rgb(${Za.join(",")})" stop-opacity="${zl}"/>
      </radialGradient>`);
    const Lo = [];
    if (Va && Nt && Lo.push(`
        @keyframes ${$r} {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -${Ha + Ga}; }
        }
        .sv-beam-flow {
          animation-name: ${$r};
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .sv-css-limit .sv-beam-flow {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `), je) {
      const e = Z + 140;
      Lo.push(`
        @keyframes ${Sr} {
          0% { transform: translateX(-140px); }
          100% { transform: translateX(${e}px); }
        }
        .sv-sky-cloud {
          animation-name: ${Sr};
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .sv-css-limit .sv-sky-cloud {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `);
    }
    ln && Lo.push(`
        @keyframes ${vr} {
          0%, 100% { transform: scaleX(var(--ray-min-scale, 0.45)); }
          50% { transform: scaleX(var(--ray-max-scale, 1.0)); }
        }
        .sv-sun-ray {
          animation-name: ${vr};
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          transform-origin: 0px 0px;
          will-change: transform;
        }
        .sv-css-limit .sv-sun-ray {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `);
    const Fr = `sv-star-twinkle-${Math.round(Z)}-${Math.round(Q)}`;
    qe && hn && Lo.push(`
        @keyframes ${Fr} {
          0%, 100% { opacity: calc(var(--star-op, 0.7) * 0.22); }
          50% { opacity: var(--star-op, 0.7); }
        }
        .sv-star {
          animation-name: ${Fr};
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .sv-css-limit .sv-star {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `), (Va || je || ln || qe && hn) && Lo.push(`
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
      `), Lo.length && gt.push(`<style><![CDATA[
        ${Lo.join(`
`)}
        @media (prefers-reduced-motion: reduce) {
          .sv-beam-flow, .sv-sun-ray { animation: none !important; }
        }
      ]]></style>`);
    const y = [], ff = `${ut ? "sv-css-limit sv-css-global " : ""}${tu ? "sv-css-pause " : ""}sv-scene`.trim(), df = Number(this._cssGlobalTimeSec || 0);
    if (y.push(`<svg class="${ff}" style="--sv-global-time:${df.toFixed(3)}" viewBox="0 0 ${Z} ${Q}" width="${Bt}" height="${zt}" preserveAspectRatio="xMidYMid meet"><defs>${gt.join("")}</defs>`), ui && y.push(`<rect x="0" y="0" width="${Z}" height="${Q}" fill="url(#horizon-grad)"/>`), qe && Ca > 0.01 && ra > 0) {
      let t = this._skyStars;
      if (!Array.isArray(t) || t.length !== ra) {
        let s = 2166136261 ^ Math.round(Z * 13 + Q * 17 + ra * 31);
        const n = () => (s ^= s << 13, s >>>= 0, s ^= s >> 17, s >>>= 0, s ^= s << 5, s >>>= 0, (s >>> 0) / 4294967295);
        t = Array.from({ length: ra }, () => ({
          x: 0.04 + n() * 0.92,
          y: 0.06 + n() * 0.86,
          r: 0.55 + n() * 1.25,
          a: 0.35 + n() * 0.65,
          dur: 1.2 + n() * 2.2,
          phase: n() * 2.2
        })), this._skyStars = t;
      }
      const e = ss * 0.97;
      y.push('<g clip-path="url(#sky-cloud-clip)">'), t.forEach((s) => {
        const n = s.x * Z, i = s.y * e, r = s.r * (0.85 + Ca * 0.35), h = C(Ca * wl * s.a, 0, 1);
        if (hn) {
          const u = Math.max(1.2, Number(s.dur)), d = Number(s.phase) || 0, f = ut ? da(u, d) : fa(u, d), p = ut ? Math.max(1, Math.round(u * lo)) : 0;
          y.push(`<circle class="sv-star" cx="${n}" cy="${i}" r="${r}"
            fill="rgba(242,246,255,0.98)"
            style="--star-op:${h};animation-duration:${u.toFixed(2)}s;--sv-phase-delay:${f.toFixed(3)}s;animation-delay:${f.toFixed(3)}s;--sv-steps:${p}"/>`);
        } else
          y.push(`<circle cx="${n}" cy="${i}" r="${r}" fill="rgba(242,246,255,${h})"/>`);
      }), y.push("</g>");
    }
    if (Xa && fo > 0.03) {
      const t = Ut * (Nu * 2), e = `rgb(${Tn.join(",")})`, s = `moon-disc-clip-${Math.round(To)}-${Math.round(Do)}-${Math.round(Ut)}`;
      y.push(`<defs><clipPath id="${s}"><circle cx="${To}" cy="${Do}" r="${Ut}"/></clipPath></defs>`), y.push(`<circle cx="${To}" cy="${Do}" r="${Ut * 1.25}" fill="rgba(196,206,255,${de * 0.22})"/>`), y.push(`<g clip-path="url(#${s})">`), y.push(`<circle cx="${To}" cy="${Do}" r="${Ut}" fill="rgba(238,244,255,${de})"/>`), y.push(`<circle cx="${To + t}" cy="${Do}" r="${Ut * 0.98}" fill="${e}" opacity="${de * 0.98}"/>`);
      const n = To - Ut * 0.34, i = Do + Ut * 0.3, r = Ut * 0.24;
      y.push(`<circle cx="${n}" cy="${i}" r="${r}" fill="rgba(152,162,180,${de * 0.72})"/>`), y.push(`<circle cx="${n + r * 0.14}" cy="${i + r * 0.16}" r="${r * 0.64}" fill="rgba(90,102,122,${de * 0.42})"/>`), y.push("</g>"), y.push(`<circle cx="${To}" cy="${Do}" r="${Ut}" fill="none" stroke="rgba(255,255,255,${de * 0.32})" stroke-width="1"/>`);
    }
    if (je) {
      const t = C(ol, 0, 1), e = [0.3, 0.42, 0.24], s = [0.46, 0.6, 0.38], n = [
        { y: ss * (e[0] + (s[0] - e[0]) * t), s: 0.76 * qa, dur: 38 / Math.max(0.2, Ya), phase: 0.12 },
        { y: ss * (e[1] + (s[1] - e[1]) * t), s: 1 * qa, dur: 56 / Math.max(0.2, Ya), phase: 0.48 },
        { y: ss * (e[2] + (s[2] - e[2]) * t), s: 0.66 * qa, dur: 76 / Math.max(0.2, Ya), phase: 0.78 }
      ];
      y.push('<g clip-path="url(#sky-cloud-clip)">'), n.forEach((i) => {
        const r = 1 - 0.35 * as, h = C(hi * r, 0, 1), u = C(hi * 0.75 * r, 0, 1);
        [-(i.phase * i.dur), -((i.phase + 0.5) * i.dur)].forEach((f) => {
          y.push(`<g transform="translate(0 ${i.y}) scale(${i.s})">`);
          const p = ma ? 6 : ut ? 3 : 1, m = i.dur * p, b = ut ? Math.max(1, Math.round(m * lo)) : 0, g = -f, _ = ut ? da(m, g) : fa(m, g);
          y.push(`<g class="sv-sky-cloud" style="animation-duration:${m}s;--sv-phase-delay:${_.toFixed(3)}s;animation-delay:${_.toFixed(3)}s;--sv-steps:${b}">`), y.push('<g filter="url(#sky-cloud-blur)">'), y.push(`<ellipse cx="0" cy="0" rx="52" ry="20" fill="rgba(255,255,255,${h})"/>`), y.push(`<ellipse cx="28" cy="-12" rx="36" ry="17" fill="rgba(255,255,255,${u})"/>`), y.push(`<ellipse cx="-26" cy="-10" rx="30" ry="15" fill="rgba(255,255,255,${u})"/>`), y.push(`<ellipse cx="64" cy="-4" rx="24" ry="12" fill="rgba(255,255,255,${u * 0.95})"/>`), y.push("</g>"), y.push("</g>"), y.push("</g>");
        });
      }), y.push("</g>");
    }
    const pf = () => {
      const t = zo[0] - Bo[0], e = zo[1] - Bo[1], s = Math.hypot(t, e);
      if (s <= 1e-3) return;
      const n = -e / s, i = t / s, r = t / s, h = e / s, u = zo[0] - r * Po, d = zo[1] - h * Po, f = [u + n * Po * 0.62, d + i * Po * 0.62], p = [u - n * Po * 0.62, d - i * Po * 0.62], m = Math.max(0.8, tf * 0.55 + of * 0.75), b = [
        [zo[0], zo[1]],
        [p[0], p[1]],
        [f[0], f[1]]
      ], g = b.map((R) => `${R[0]},${R[1]}`).join(" "), _ = Math.max(1.1, Po * 0.16);
      if (xi) {
        const R = ih * Bn, A = R * 0.55, T = R * 0.75, W = b.map((V) => [V[0] + A, V[1] + T]).map((V) => `${V[0]},${V[1]}`).join(" ");
        y.push(`<line x1="${Bo[0] + A}" y1="${Bo[1] + T}" x2="${u + A}" y2="${d + T}"
          stroke="${F}" stroke-opacity="${C(Qa, 0, 1)}" stroke-width="${m}"
          stroke-linecap="round" filter="url(#floor-pointer-shadow-blur)"/>`), y.push(`<polygon points="${W}" fill="${F}" fill-opacity="${C(Qa * 0.95, 0, 1)}"
          stroke="${F}" stroke-opacity="${C(Qa * 0.95, 0, 1)}"
          stroke-width="${_}" stroke-linejoin="round" filter="url(#floor-pointer-shadow-blur)"/>`);
      }
      y.push(`<line x1="${Bo[0]}" y1="${Bo[1]}" x2="${u}" y2="${d}"
        stroke="${Ja}" stroke-width="${m}" stroke-linecap="round" opacity="0.92"/>`), y.push(`<polygon points="${g}" fill="${Ja}" opacity="0.95"
        stroke="${Ja}" stroke-width="${_}" stroke-linejoin="round"/>`);
    }, mf = () => {
      if (!Js) return;
      const t = C(ta, 0.8, 1.9), e = Math.max(0.08, Qs), s = 1 + oa, n = s + e, i = K + 5e-4, r = (g) => U(G(bt(g))), h = r([-t / 2, i, s]), u = r([t / 2, i, s]), d = r([t / 2, i, n]), f = r([-t / 2, i, n]);
      y.push(`<polygon points="${h[0]},${h[1]} ${u[0]},${u[1]} ${d[0]},${d[1]} ${f[0]},${f[1]}"
        fill="${ea}" opacity="0.9"/>`);
      const p = (g, _, R) => [g[0] + (_[0] - g[0]) * R, g[1] + (_[1] - g[1]) * R];
      [0.25, 0.5, 0.75].forEach((g) => {
        const _ = p(h, u, g), R = p(f, d, g);
        y.push(`<line x1="${_[0]}" y1="${_[1]}" x2="${R[0]}" y2="${R[1]}"
          stroke="${Ge}" stroke-width="${Ue}" opacity="0.65"/>`);
      });
      const m = p(h, f, 0.5), b = p(u, d, 0.5);
      y.push(`<line x1="${m[0]}" y1="${m[1]}" x2="${b[0]}" y2="${b[1]}"
        stroke="${Ge}" stroke-width="${Ue}" opacity="0.65"/>`);
    };
    if (qo > 0.1 && Er.forEach((t, e) => {
      const s = t.map((i) => `${i[0]},${i[1]}`).join(" "), n = C(0.86 - e * 0.08, 0.62, 0.9);
      y.push(`<polygon points="${s}" fill="${xe}" opacity="${n}"/>`);
    }), y.push(`<path d="${Aa}" fill="${_o}" stroke="${Yo}" stroke-width="${nt}"/>`), yo && Mt > 1e-3 && y.push(`<path d="${Aa}" fill="url(#floor-grass-grad)"/>`), mf(), Oa && Nt && rs && cs && y.push(`<path d="${Aa}" fill="url(#sunlight-grad)"/>`), Ye && !Nt && ls && hs && y.push(`<path d="${Aa}" fill="url(#moonlight-grad)"/>`), se && yr) {
      const t = ns ? ns.map((s) => [s[0], s[1]]) : [], e = nu(t, uf);
      if (e.length >= 3) {
        const s = e.map((i) => i[0] + "," + i[1]).join(" "), n = 1 - 0.4 * me;
        y.push(`<polygon points="${s}" fill="${F}" opacity="${sa * n}" filter="url(#shadow-blur-soft)"/>`), y.push(`<polygon points="${s}" fill="${F}" opacity="${na * n}" filter="url(#shadow-blur-contact)"/>`);
      }
    }
    pf(), Xt && Cn && y.push(`<polygon points="${Cn}" fill="${Lc}" opacity="${ia}" filter="url(#base-anchor-shadow-blur)"/>`), y.push(`<polygon points="${ju.join(" ")}" fill="none" stroke="${bi}" stroke-width="${gi}" stroke-linecap="round"/>`), y.push(`<polygon points="${qu.join(" ")}" fill="none" stroke="${jl}" stroke-width="${Gl}" stroke-linecap="round"/>`), y.push(`<polygon points="${Yu.join(" ")}" fill="none" stroke="${bi}" stroke-width="${gi}" stroke-linecap="round"/>`), _i && dr.forEach((t) => {
      const e = t.isMajor ? Xl : Yl;
      y.push(`<line x1="${t.pIn[0]}" y1="${t.pIn[1]}" x2="${t.pOut[0]}" y2="${t.pOut[1]}" stroke="${ql}" stroke-width="${e}"/>`);
    }), Zu.forEach((t) => {
      y.push(`<text x="${t.x}" y="${t.y}" fill="white"
        font-size="${Jl * t.scale}"
        stroke="rgba(0,0,0,0.6)" stroke-width="${sh * t.scale}"
        font-weight="700" text-anchor="middle">${t.t}</text>`);
    });
    const bf = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    };
    mr.forEach((t) => {
      const e = bf[t.id];
      if (!e) return;
      const s = bt(e), n = bt(t.pos), i = t.id === "front" || t.id === "left" ? e.map((g) => -g) : e, r = bt(i), h = Ji(n, s, ru(s), r, !1);
      if (!h) return;
      const { basis: u, centerScr: d } = h, f = C(d[3] * ch, lh, hh), p = rh * f, m = ph * f, b = d[1] - uh * f;
      y.push(`<text x="0" y="0"
        fill="${fh}"
        font-size="${p}"
        stroke="${dh}"
        stroke-width="${m}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${u.bx} ${u.by} ${u.ux} ${u.uy} ${d[0]} ${b})">${t.label}</text>`);
    });
    const gf = Number(this._cssGlobalTimeSec || Ti), _f = Math.floor(gf / 1.6);
    let Ar = ma ? 1 : 0;
    const Tr = (t, e = 1, s = 1) => {
      const n = t.length > 0 ? (_f % t.length + t.length) % t.length : -1;
      t.forEach((i, r) => {
        const h = C(
          Ze / (Ze + i.zCam) * qc,
          Yc,
          Xc
        ), u = Math.max(0.7, Ic * Ao * h), d = C(Oc * s * h, 0, 1);
        y.push(`<line x1="${rt[0]}" y1="${rt[1]}" x2="${i.x}" y2="${i.y}"
          stroke="rgba(255,255,150,${d})" stroke-width="${u}"/>`);
        let f = !1;
        if (ma)
          f = Ar > 0 && r === n, f && (Ar -= 1);
        else {
          const p = r % 3 !== 2, m = !ut || r % 2 === 0;
          f = p && m;
        }
        if (Va && Nt && f) {
          const p = Math.max(0.6, u * Gc), m = Math.max(0.2, Uc), b = r * jc, g = ut ? da(m, b) : fa(m, b), _ = C(Hc * e * h, 0, 1), R = ut ? Math.max(1, Math.round(m * lo)) : 0;
          y.push(`<line x1="${rt[0]}" y1="${rt[1]}" x2="${i.x}" y2="${i.y}"
            class="sv-beam-flow"
            style="animation-duration:${m}s;--sv-phase-delay:${g.toFixed(3)}s;animation-delay:${g.toFixed(3)}s;--sv-steps:${R}"
            stroke="${Vc}" stroke-opacity="${_}" stroke-width="${p}"
            stroke-linecap="round" stroke-dasharray="${Ha} ${Ga}" stroke-dashoffset="0"/>`);
        }
      });
    };
    Nt && Tr(Vn);
    const yf = hu.map((t) => {
      const e = t.i.map((i) => Kt[i]), s = ho[t.id] ?? 1, n = Dt(t.c, s);
      return { type: "cube", id: t.id, pts: e, z: No(e), fill: n, opacity: 1 };
    }), _e = [];
    At || (fu.forEach((t) => {
      const e = Math.min(...t.pts.map((s) => s[2]));
      _e.push({
        type: "roofSide",
        pts: t.pts,
        // Use nearest point depth so side panels do not fall behind adjacent wall triangles.
        z: e - mi,
        fill: wn(t.wall),
        opacity: Ka
      });
    }), Rn && _e.push({
      type: "roofCap",
      pts: Rn,
      z: No(Rn) + mi * 0.35,
      fill: gu,
      opacity: Ka
    }));
    let ye = No(wa);
    if (_e.length) {
      const t = Math.min(..._e.map((s) => s.z)), e = Math.max(..._e.map((s) => s.z));
      uo ? ye = Math.min(ye, t - 0.02) : ye = Math.max(ye, e + 0.02);
    } else
      ye += uo ? -1e-3 : 1e-3;
    const Dr = !At && wo && (uo || Wl) ? {
      type: "roofPlane",
      pts: wa,
      z: ye,
      fill: uo ? bu : mu,
      opacity: uo ? Fs : Ol
    } : null, Br = yf.concat(_e).concat(Jt).concat(Dr ? [Dr] : []).sort((t, e) => {
      const s = e.z - t.z, n = String((t == null ? void 0 : t.type) || ""), i = String((e == null ? void 0 : e.type) || ""), r = n.startsWith("flatRoofEdge-"), h = i.startsWith("flatRoofEdge-"), u = n.startsWith("flatRoofSkirt-"), d = i.startsWith("flatRoofSkirt-");
      if (r && h || u && d || (n === "roofSide" || n === "roofCap") && (i === "roofSide" || i === "roofCap")) {
        if (Math.abs(s) > 1e-6) return s;
      } else if (Math.abs(s) > 0.015)
        return s;
      const m = (g) => {
        const _ = String((g == null ? void 0 : g.type) || "");
        return _.startsWith("flatRoofSkirt-") ? 0.7 : _ === "roofCap" ? 0.9 : _ === "flatRoofTop" || _ === "roofPlane" ? 1 : _ === "cube" ? 1.4 : _ === "roofSide" ? 1.55 : _.startsWith("flatRoofEdge-") ? 1.8 : _ === "flatRoofBottom" ? 3 : 1;
      }, b = m(t) - m(e);
      return Math.abs(b) > 1e-6 ? b : s;
    }), $f = (t, e) => {
      if (!Xs || !(t === "front" || t === "right" || t === "back" || t === "left") || !e || e.length < 4) return;
      const s = e[0], n = e[1], i = e[2], r = e[3], h = (m, b, g) => [m[0] + (b[0] - m[0]) * g, m[1] + (b[1] - m[1]) * g], u = C(Zs, 0.015, 0.22), d = h(s, r, u), f = h(n, i, u), p = Dt(kt[t], (ho[t] ?? 1) * C(Ks, 0.2, 1.2));
      y.push(`<polygon points="${s[0]},${s[1]} ${n[0]},${n[1]} ${f[0]},${f[1]} ${d[0]},${d[1]}"
        fill="${p}" opacity="0.95"/>`);
    }, vf = (t) => {
      if (!Ri || !Pn[t]) return;
      const e = uu[t], s = or[t];
      if (!e || !s) return;
      const n = t === "front" || t === "left" ? e.map((T) => -T) : e;
      let i = 0, r = 0, h = 0;
      _n[t].indices.forEach((T) => {
        const P = tr[T];
        i += P[0], r += P[1], h += P[2];
      }), i /= 4, r /= 4, h /= 4, r = C(gh, -0.9, 0.9);
      const u = [
        i + s[0] * en,
        r + s[1] * en,
        h + s[2] * en
      ], d = bt(u), f = bt(e), p = bt(n), m = Ji(d, f, [0, 1, 0], p, !1);
      if (!m) return;
      const { basis: b, centerScr: g } = m, _ = C(g[3] * _h, yh, $h), R = tn * _, A = on * _;
      y.push(`<text x="0" y="0"
        fill="${Mi}"
        font-size="${R}"
        stroke="${Ci}"
        stroke-width="${A}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${b.bx} ${b.by} ${b.ux} ${b.uy} ${g[0]} ${g[1]})">${Xi(Je[t])}</text>`);
    }, Sf = () => {
      if (!wh || !zn.front) return;
      const t = -sn / 2, e = sn / 2, s = C(-1 + Rh, -1, 1), n = C(s + ki, -1, 1), i = 1 + Mh, r = (T) => U(G(bt(T))), d = [
        [t, s, i],
        [e, s, i],
        [e, n, i],
        [t, n, i]
      ].map(r).map((T) => `${T[0]},${T[1]}`).join(",");
      y.push(`<polygon points="${d}" fill="${kh}" opacity="${Ni}"/>`);
      const f = Math.min(0.08, Math.max(0.04, sn * 0.14)), p = Math.min(0.08, Math.max(0.04, ki * 0.1)), g = [
        [t + f, s + p, i + 3e-3],
        [e - f, s + p, i + 3e-3],
        [e - f, n - p, i + 3e-3],
        [t + f, n - p, i + 3e-3]
      ].map(r).map((T) => `${T[0]},${T[1]}`).join(",");
      y.push(`<polygon points="${g}" fill="${Ch}" opacity="${Ni}"/>`);
      const _ = [e - f - 0.05, s + (n - s) * 0.45, i + 6e-3], R = r(_), A = Math.max(0.6, R[3]);
      y.push(`<circle cx="${R[0]}" cy="${R[1]}" r="${1.8 * A}" fill="${Nh}" opacity="0.95"/>`);
    }, xf = (t, e) => {
      if (!zs || !(t === "left" || t === "right" || t === "back") || !e || e.length < 4) return;
      const s = C(ho[t] ?? 1, 0.2, 1), n = e[0], i = e[1], r = e[2], h = e[3], u = (M, I, D) => [M[0] + (I[0] - M[0]) * D, M[1] + (I[1] - M[1]) * D], d = (M, I) => {
        const D = u(n, h, I), q = u(i, r, I);
        return u(D, q, M);
      }, f = t === "back" ? 0.2 : 0.24, p = t === "back" ? 0.8 : 0.76, m = 0.2, b = m + (0.74 - m) * 0.75, _ = [
        d(f, m),
        d(p, m),
        d(p, b),
        d(f, b)
      ].map((M) => `${M[0]},${M[1]}`).join(",");
      y.push(`<polygon points="${_}" fill="${Ps}" opacity="${0.98 * s}"/>`);
      const R = 0.035, A = 0.05, P = [
        d(f + R, m + A),
        d(p - R, m + A),
        d(p - R, b - A),
        d(f + R, b - A)
      ].map((M) => `${M[0]},${M[1]}`).join(",");
      y.push(`<polygon points="${P}" fill="${Ls}" opacity="${0.95 * s}"/>`);
      const W = d((f + p) * 0.5, m + A), V = d((f + p) * 0.5, b - A);
      y.push(`<line x1="${W[0]}" y1="${W[1]}" x2="${V[0]}" y2="${V[1]}"
        stroke="${Ws}" stroke-width="${Be}" opacity="${0.9 * s}"/>`);
      const N = d(f + R * 1.4, m + A * 1.2), v = d(p - R * 1.6, b - A * 1.3);
      y.push(`<line x1="${N[0]}" y1="${N[1]}" x2="${v[0]}" y2="${v[1]}"
        stroke="rgba(255,255,255,0.32)" stroke-width="${Math.max(0.8, Be * 0.9)}" opacity="${s}"/>`);
    }, Da = Yi([0, 0, -1]), zr = Math.hypot(Mo, Co), Pr = Math.hypot(Da[0], Da[2]), jn = zr > 1e-6 && Pr > 1e-6 && (Mo * Da[0] + Co * Da[2]) / (zr * Pr) < 0;
    function Lr(t, e) {
      if (!Ie || !He) return;
      const s = (A) => U(G(A)), n = Mo, i = Co, r = C(Ve, 0.4, 2.5), h = [n, K + 0.35 * r, i];
      let u = !0;
      if (jn)
        u = !1;
      else if (e) {
        const A = G(h), T = U(A), P = e(T[0], T[1]);
        u = P == null || A[2] <= P - 8e-3;
      }
      if (t === "front" !== u) return;
      const d = s([n, K, i]), f = s([n, K + 0.86 * r, i]), p = Math.max(2.6, 8.5 * f[3] * r), m = C(1 + Ys * 10, 0.6, 2.5), b = Math.max(2.2, p * 0.62 * m), g = Math.max(1.1, p * 0.24 * m), _ = d[0], R = d[1] + g * 0.28;
      y.push(`<ellipse cx="${_}" cy="${R}" rx="${b}" ry="${g}"
        fill="${F}" opacity="${C(js, 0, 1)}" filter="url(#back-tree-shadow-blur)"/>`);
    }
    function Wr(t, e) {
      if (!Ie) return;
      const s = (N) => U(G(N)), n = (N) => {
        if (jn) return !1;
        if (!e) return !0;
        const v = G(N), M = U(v), I = e(M[0], M[1]);
        return I == null || v[2] <= I - 8e-3;
      }, i = (N, v, M, I) => {
        if (jn) return !1;
        if (!e) return !0;
        const D = [
          [0.92, 0],
          [-0.92, 0],
          [0, 0.92],
          [0, -0.92],
          [0.66, 0.66],
          [-0.66, 0.66],
          [0.66, -0.66],
          [-0.66, -0.66]
        ];
        let q = 0;
        for (const [yt, lt] of D) {
          const qt = e(v + yt * I, M + lt * I);
          (qt == null || N <= qt - 8e-3) && q++;
        }
        return q / D.length >= 0.4;
      }, r = Mo, h = Co, u = C(Ve, 0.4, 2.5), d = C(1 - 0.55 * as, 0.35, 1), f = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(ro) ? Dt(ro, 0.72 * d) : ro, p = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(ro) ? Dt(ro, 1.18 - 0.4 * as) : "rgba(255,255,255,0.30)", m = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(co) ? Dt(co, 0.72 * d) : co, b = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(co) ? Dt(co, 1.2 - 0.45 * as) : "rgba(255,255,255,0.25)", g = C(1 - 0.3 * as, 0.55, 1), _ = s([r, K, h]), R = s([r, K + 0.86 * u, h]), A = Math.max(2.6, 8.5 * R[3] * u), T = [
        [r, K + 0.22 * u, h],
        [r, K + 0.45 * u, h],
        [r, K + 0.72 * u, h]
      ];
      let P = 0;
      T.forEach((N) => {
        n(N) && P++;
      });
      const W = P / T.length >= 0.4;
      if (t === "front" === W) {
        const N = R[0] - _[0], v = R[1] - _[1], M = Math.max(1e-3, Math.hypot(N, v)), I = -v / M, D = N / M, q = Math.max(0.35, A * 0.12);
        y.push(`<line x1="${_[0]}" y1="${_[1]}" x2="${R[0]}" y2="${R[1]}"
          stroke="${m}" stroke-width="${A}" stroke-linecap="round" opacity="${g}"/>`), y.push(`<line x1="${_[0] + I * q}" y1="${_[1] + D * q}" x2="${R[0] + I * q}" y2="${R[1] + D * q}"
          stroke="${b}" stroke-width="${Math.max(1.1, A * 0.36)}" stroke-linecap="round" opacity="${0.55 * g}"/>`);
      }
      [
        [r, K + 1.02 * u, h, 0.28],
        [r - 0.18 * u, K + 0.9 * u, h + 0.06 * u, 0.22],
        [r + 0.2 * u, K + 0.86 * u, h - 0.07 * u, 0.2]
      ].forEach((N) => {
        const v = s([N[0], N[1], N[2]]), M = G([N[0], N[1], N[2]]), I = Math.max(6, dt * N[3] * v[3] * 0.95), D = i(M[2], v[0], v[1], I * 0.92);
        t === "front" === D && (y.push(`<circle cx="${v[0]}" cy="${v[1]}" r="${I}" fill="${f}" opacity="${g}"/>`), y.push(`<circle cx="${v[0] - I * 0.2}" cy="${v[1] - I * 0.24}" r="${I * 0.62}" fill="${p}" opacity="${0.52 * g}"/>`), y.push(`<circle cx="${v[0] + I * 0.28}" cy="${v[1] + I * 0.22}" r="${I * 0.52}" fill="${f}" opacity="${0.26 * g}"/>`));
      });
    }
    const Or = () => {
      const t = At && vn ? vn : ts, e = {
        front: { low: [3, 2], high: [0, 1] },
        back: { low: [0, 1], high: [3, 2] },
        left: { low: [0, 3], high: [1, 2] },
        right: { low: [1, 2], high: [0, 3] }
      }, s = e[H] ?? e.front;
      let n = t[s.low[0]], i = t[s.low[1]], r = t[s.high[0]], h = t[s.high[1]];
      if (!n || !i || !r || !h) return null;
      if (H === "front" || H === "back") {
        if (i[0] < n[0]) {
          const m = n;
          n = i, i = m;
          const b = r;
          r = h, h = b;
        }
      } else if (i[2] < n[2]) {
        const m = n;
        n = i, i = m;
        const b = r;
        r = h, h = b;
      }
      const u = Math.hypot(i[0] - n[0], i[1] - n[1], i[2] - n[2]), d = [(n[0] + i[0]) / 2, (n[1] + i[1]) / 2, (n[2] + i[2]) / 2], f = [(r[0] + h[0]) / 2, (r[1] + h[1]) / 2, (r[2] + h[2]) / 2], p = Math.hypot(f[0] - d[0], f[1] - d[1], f[2] - d[2]);
      return !isFinite(u) || !isFinite(p) || u <= 1e-6 || p <= 1e-6 ? null : { lowA: n, lowB: i, highA: r, highB: h, worldEdgeLen: u, roofHeightWorld: p };
    }, wf = () => {
      if (!Os || !wo || !xn) return;
      const t = Or();
      if (!t) return;
      const { lowA: e, lowB: s, highA: n, highB: i } = t, r = Math.min(Pe, Le), h = Math.max(Pe, Le), u = Gs, d = Us, f = (1 - u) / 2, p = u, m = d * Math.max(0, ee - 1), b = (p - m) / ee;
      if (!isFinite(b) || b <= 0.01) return;
      const g = (P, W, V) => [P[0] + (W[0] - P[0]) * V, P[1] + (W[1] - P[1]) * V, P[2] + (W[2] - P[2]) * V], _ = (P, W) => {
        const V = g(e, n, W), N = g(s, i, W), v = g(V, N, P);
        return U(G(v));
      }, R = os(Is, C(Wt, 0.2, 1)), A = 0.55 + 0.4 * C(Wt, 0, 1), T = 0.3 + 0.5 * C(Wt, 0, 1);
      for (let P = 0; P < ee; P++) {
        const W = f + P * (b + d), V = W + b, N = _(W, r), v = _(V, r), M = _(V, h), I = _(W, h);
        y.push(`<polygon points="${N[0]},${N[1]} ${v[0]},${v[1]} ${M[0]},${M[1]} ${I[0]},${I[1]}"
          fill="${R}" opacity="0.96" stroke="${Vs}" stroke-opacity="${A}" stroke-width="${Hs}"/>`);
        const D = (q, et, yt) => [q[0] + (et[0] - q[0]) * yt, q[1] + (et[1] - q[1]) * yt];
        for (let q = 1; q < We; q++) {
          const et = q / We, yt = D(N, v, et), lt = D(I, M, et);
          y.push(`<line x1="${yt[0]}" y1="${yt[1]}" x2="${lt[0]}" y2="${lt[1]}"
            stroke="${ze}" stroke-opacity="${T}" stroke-width="0.7"/>`);
        }
        for (let q = 1; q < Oe; q++) {
          const et = q / Oe, yt = D(N, I, et), lt = D(v, M, et);
          y.push(`<line x1="${yt[0]}" y1="${yt[1]}" x2="${lt[0]}" y2="${lt[1]}"
            stroke="${ze}" stroke-opacity="${T}" stroke-width="0.7"/>`);
        }
      }
    }, Ir = () => {
      if (!Ri || !wo || !xn) return;
      const t = Or();
      if (!t) return;
      const { lowA: e, lowB: s, highA: n, highB: i, worldEdgeLen: r, roofHeightWorld: h } = t, u = Xi(Me);
      let d = -h * (1 / 3), f = -h * (2 / 3);
      const p = 1 / 6, m = r * (1 - 2 * p), b = "100%", g = "9.99 kW", _ = Math.max(u.length, b.length);
      Math.max((ke || "").length, g.length);
      const R = h * 0.36, A = Math.min(m / (0.6 * _), R), T = Math.min(A * vh, R * 1.05), P = on / tn * T, W = Math.min(T * Sh, R * 0.85), V = on / tn * W;
      this._roofStripSeed = (this._roofStripSeed || 0) + 1;
      const N = (M, I, D) => [M[0] + (I[0] - M[0]) * D, M[1] + (I[1] - M[1]) * D, M[2] + (I[2] - M[2]) * D], v = (M, I, D, q, et, yt, lt) => {
        if (!M) return;
        const qt = Math.max(I * yt, h * 0.08), Yn = et, rc = et - qt, cc = C(-Yn / h, 0, 1), Ef = C(-rc / h, 0, 1), Ff = N(e, n, cc), Af = N(s, i, cc), Tf = N(e, n, Ef), lc = U(G(Ff)), hc = U(G(Af)), uc = U(G(Tf)), to = [[0, Yn], [r, Yn], [0, rc]], oo = [[lc[0], lc[1]], [hc[0], hc[1]], [uc[0], uc[1]]], Wo = iu(to, oo);
        if (!Wo) return;
        const fc = Math.sign((to[1][0] - to[0][0]) * (to[2][1] - to[0][1]) - (to[1][1] - to[0][1]) * (to[2][0] - to[0][0])), dc = Math.sign((oo[1][0] - oo[0][0]) * (oo[2][1] - oo[0][1]) - (oo[1][1] - oo[0][1]) * (oo[2][0] - oo[0][0])), pc = fc !== 0 && dc !== 0 && fc !== dc;
        y.push(`<g transform="matrix(${Wo.a} ${Wo.b} ${Wo.c} ${Wo.d} ${Wo.e} ${Wo.f})">`), pc && y.push(`<g transform="translate(${r} 0) scale(-1 1)">`), y.push(`<text x="${r / 2}" y="${et}" fill="${q}" font-size="${I}"
          stroke="${Ci}" stroke-width="${D}" font-weight="700"
          text-anchor="middle" dominant-baseline="middle">${M}</text>`), pc && y.push("</g>"), y.push("</g>");
      };
      Zo && v(ke, W, V, xh, d, 1.6), v(u, T, P, Mi, f, 1.6);
    }, qn = [];
    Br.forEach((t) => {
      const e = t.pts || [];
      if (!(e.length < 3))
        if (e.length === 3)
          qn.push([e[0], e[1], e[2]]);
        else
          for (let s = 1; s < e.length - 1; s++)
            qn.push([e[0], e[s], e[s + 1]]);
    });
    const Rf = (t, e, s, n, i) => {
      const r = s[0], h = s[1], u = s[2], d = n[0], f = n[1], p = n[2], m = i[0], b = i[1], g = i[2], _ = (f - b) * (r - m) + (m - d) * (h - b);
      if (Math.abs(_) < 1e-6) return null;
      const R = ((f - b) * (t - m) + (m - d) * (e - b)) / _, A = ((b - h) * (t - m) + (r - m) * (e - b)) / _, T = 1 - R - A;
      return R < -1e-4 || A < -1e-4 || T < -1e-4 ? null : R * u + A * p + T * g;
    }, ds = (t, e) => {
      let s = 1 / 0;
      return qn.forEach(([n, i, r]) => {
        const h = Rf(t, e, n, i, r);
        h != null && h < s && (s = h);
      }), Number.isFinite(s) ? s : null;
    };
    Lr("back", ds), Wr("back", ds), Br.forEach((t) => {
      const e = t.pts.map((r) => r[0] + "," + r[1]).join(","), n = typeof t.type == "string" && t.type.startsWith("flatRoof") ? t.fill : "#000";
      y.push(`<polygon points="${e}" fill="${t.fill}" stroke="${n}" stroke-width="${0.5}" opacity="${t.opacity}"/>`), t.type === "cube" && $f(t.id, t.pts), t.type === "cube" && t.id === "front" && Sf(), t.type === "cube" && xf(t.id, t.pts), t.type === "cube" && vf(t.id), (t.type === "roofPlane" || t.type === "flatRoofTop") && wf(), t.type === "roofPlane" && !At && Ir();
    }), At && xn && Ir();
    const Mf = (t) => {
      const e = [0.14, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74, 0.84, 0.92];
      let s = 0, n = 0;
      for (const i of e) {
        const r = [
          Fo[0] + (t.world[0] - Fo[0]) * i,
          Fo[1] + (t.world[1] - Fo[1]) * i,
          Fo[2] + (t.world[2] - Fo[2]) * i
        ], h = G(r), u = U(h), d = ds(u[0], u[1]);
        n++, (d == null || h[2] <= d - 5e-3) && s++;
      }
      return n > 0 && s >= Math.ceil(n * 0.67);
    }, Vr = Gn.filter((t) => Mf(t));
    if (Nt && !$u && Vr.length && Tr(Vr, 1, 0.85), Lr("front", ds), Wr("front", ds), Nt) {
      y.push(`<circle cx="${rt[0]}" cy="${rt[1]}" r="${vu}" fill="url(#sun-glow)"/>`), y.push(`<circle cx="${rt[0]}" cy="${rt[1]}" r="${Su}" fill="yellow" stroke="orange" stroke-width="${Math.max(1, 2 * Ao)}"/>`);
      const t = Math.min(Ua, ja), e = Math.max(Ua, ja);
      for (let s = 0; s < 8; s++) {
        const n = s * 360 / 8, i = 20 * Ao;
        if (ln) {
          const r = t + (e - t) * (0.5 + 0.5 * Math.sin(s * 1.71)), h = 0.18 * s + 0.07 * Math.cos(s * 2.13), u = ut ? da(r, h) : fa(r, h), d = C(Kc + 0.015 * Math.sin(s * 0.93), 0.2, 1), f = C(Jc - 0.02 * Math.cos(s * 1.27), 0.25, 1), p = C(Qc + 0.04 * Math.cos(s * 1.37), 0.05, 1);
          y.push(`<g transform="translate(${rt[0]} ${rt[1]}) rotate(${n})">`);
          const m = ut ? Math.max(1, Math.round(r * lo)) : 0;
          y.push(`<line x1="0" y1="0" x2="${i}" y2="0"
            class="sv-sun-ray"
            style="animation-duration:${r.toFixed(2)}s;--sv-phase-delay:${u.toFixed(2)}s;animation-delay:${u.toFixed(2)}s;--ray-min-scale:${d.toFixed(3)};--ray-max-scale:${f.toFixed(3)};--sv-steps:${m};"
            stroke="${li}" stroke-width="${1.5 * Ao}" stroke-linecap="round" opacity="${p.toFixed(3)}"/>`), y.push("</g>");
        } else
          y.push(`<g transform="translate(${rt[0]} ${rt[1]}) rotate(${n})">`), y.push(`<line x1="0" y1="0" x2="${i}" y2="0"
            stroke="${li}" stroke-width="${1.5 * Ao}" stroke-linecap="round" opacity="0.6"/>`), y.push("</g>");
      }
    }
    if (Ye && !Nt && fo > 0.03) {
      const t = Array.isArray(ca) ? ca : [178, 208, 255], e = C(Al * fo, 0, 1);
      y.push(`<rect x="0" y="0" width="${Z}" height="${Q}"
        fill="rgb(${t.join(",")})" opacity="${e}"/>`);
    }
    const Cf = $t ? ["SUN OVERRIDE ENABLED", "Solar alignment % is disabled"] : [];
    di && y.push(`<rect x="0" y="0" width="${Z}" height="${Q}" fill="url(#vignette)"/>`);
    const Hr = this._autoRotateEnabled ? Number(this._autoRotateIntervalMsDynamic || Tt) : this._manualRotateEnabled ? Number(this._manualRotateIntervalMs || this._rotationIntervalMsFloor || Tt) : Tt, kf = un && Hr > Tt;
    let Nf = 0;
    const ps = () => 18 + Nf++ * 16;
    if (Ah && this._autoRotateEnabled) {
      const t = Number.isFinite(this._autoRotateFps) ? this._autoRotateFps : 0, e = this._autoRotateIntervalMsDynamic || Tt, s = e > Tt ? " LIMIT" : "";
      y.push(`<text x="10" y="${ps()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">FPS ${t.toFixed(1)} | ${Math.round(e)}ms${s}</text>`);
    }
    if (Fi) {
      const t = Number.isFinite(this._cssFps) ? this._cssFps : 0;
      y.push(`<text x="10" y="${ps()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">CSS FPS ${t.toFixed(1)}</text>`);
    }
    if (qh && ut && y.push(`<text x="10" y="${ps()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">CSS LIMIT ${lo} FPS</text>`), kf) {
      const t = Math.max(1, Math.round(1e3 / Hr));
      y.push(`<text x="10" y="${ps()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">ROT LIMIT ${t} FPS</text>`);
    }
    return Cf.forEach((t, e) => {
      const s = ps(), n = e === 0 ? 12 : 11;
      y.push(`<text x="10" y="${s}" fill="#ff3b3b" font-size="${n}" font-family="monospace" font-weight="700">${t}</text>`);
    }), y.push("</svg>"), y.join("");
  }
};
ri.styles = Ec`
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
let ei = ri;
const Pa = "sunlight-visualizer-card";
if (!customElements.get(Pa))
  try {
    customElements.define(Pa, ei);
  } catch {
  }
const Cc = window.customCards ?? (window.customCards = []);
Cc.some((S) => S.type === Pa) || Cc.push({
  type: Pa,
  name: "Sunlight Visualizer Card",
  description: "2.5D sunlight visualizer house card with auto-bound integration entities.",
  preview: !0,
  documentationURL: "https://github.com/NoUsername10/Sunlight_Visualizer"
});
