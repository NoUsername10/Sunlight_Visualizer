/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $a = globalThis, Hn = $a.ShadowRoot && ($a.ShadyCSS === void 0 || $a.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Gn = Symbol(), oc = /* @__PURE__ */ new WeakMap();
let mc = class {
  constructor(a, c, l) {
    if (this._$cssResult$ = !0, l !== Gn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = a, this.t = c;
  }
  get styleSheet() {
    let a = this.o;
    const c = this.t;
    if (Hn && a === void 0) {
      const l = c !== void 0 && c.length === 1;
      l && (a = oc.get(c)), a === void 0 && ((this.o = a = new CSSStyleSheet()).replaceSync(this.cssText), l && oc.set(c, a));
    }
    return a;
  }
  toString() {
    return this.cssText;
  }
};
const Cf = (S) => new mc(typeof S == "string" ? S : S + "", void 0, Gn), bc = (S, ...a) => {
  const c = S.length === 1 ? S[0] : a.reduce((l, o, w) => l + ((v) => {
    if (v._$cssResult$ === !0) return v.cssText;
    if (typeof v == "number") return v;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + v + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + S[w + 1], S[0]);
  return new mc(c, S, Gn);
}, kf = (S, a) => {
  if (Hn) S.adoptedStyleSheets = a.map((c) => c instanceof CSSStyleSheet ? c : c.styleSheet);
  else for (const c of a) {
    const l = document.createElement("style"), o = $a.litNonce;
    o !== void 0 && l.setAttribute("nonce", o), l.textContent = c.cssText, S.appendChild(l);
  }
}, ec = Hn ? (S) => S : (S) => S instanceof CSSStyleSheet ? ((a) => {
  let c = "";
  for (const l of a.cssRules) c += l.cssText;
  return Cf(c);
})(S) : S;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Nf, defineProperty: Ef, getOwnPropertyDescriptor: Tf, getOwnPropertyNames: Ff, getOwnPropertySymbols: Af, getPrototypeOf: Df } = Object, mo = globalThis, sc = mo.trustedTypes, Bf = sc ? sc.emptyScript : "", Bn = mo.reactiveElementPolyfillSupport, ls = (S, a) => S, Wn = { toAttribute(S, a) {
  switch (a) {
    case Boolean:
      S = S ? Bf : null;
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
} }, gc = (S, a) => !Nf(S, a), ac = { attribute: !0, type: String, converter: Wn, reflect: !1, useDefault: !1, hasChanged: gc };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), mo.litPropertyMetadata ?? (mo.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let me = class extends HTMLElement {
  static addInitializer(a) {
    this._$Ei(), (this.l ?? (this.l = [])).push(a);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(a, c = ac) {
    if (c.state && (c.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(a) && ((c = Object.create(c)).wrapped = !0), this.elementProperties.set(a, c), !c.noAccessor) {
      const l = Symbol(), o = this.getPropertyDescriptor(a, l, c);
      o !== void 0 && Ef(this.prototype, a, o);
    }
  }
  static getPropertyDescriptor(a, c, l) {
    const { get: o, set: w } = Tf(this.prototype, a) ?? { get() {
      return this[c];
    }, set(v) {
      this[c] = v;
    } };
    return { get: o, set(v) {
      const P = o == null ? void 0 : o.call(this);
      w == null || w.call(this, v), this.requestUpdate(a, P, l);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(a) {
    return this.elementProperties.get(a) ?? ac;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ls("elementProperties"))) return;
    const a = Df(this);
    a.finalize(), a.l !== void 0 && (this.l = [...a.l]), this.elementProperties = new Map(a.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ls("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ls("properties"))) {
      const c = this.properties, l = [...Ff(c), ...Af(c)];
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
      for (const o of l) c.unshift(ec(o));
    } else a !== void 0 && c.push(ec(a));
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
    return kf(a, this.constructor.elementStyles), a;
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
    var w;
    const l = this.constructor.elementProperties.get(a), o = this.constructor._$Eu(a, l);
    if (o !== void 0 && l.reflect === !0) {
      const v = (((w = l.converter) == null ? void 0 : w.toAttribute) !== void 0 ? l.converter : Wn).toAttribute(c, l.type);
      this._$Em = a, v == null ? this.removeAttribute(o) : this.setAttribute(o, v), this._$Em = null;
    }
  }
  _$AK(a, c) {
    var w, v;
    const l = this.constructor, o = l._$Eh.get(a);
    if (o !== void 0 && this._$Em !== o) {
      const P = l.getPropertyOptions(o), k = typeof P.converter == "function" ? { fromAttribute: P.converter } : ((w = P.converter) == null ? void 0 : w.fromAttribute) !== void 0 ? P.converter : Wn;
      this._$Em = o;
      const W = k.fromAttribute(c, P.type);
      this[o] = W ?? ((v = this._$Ej) == null ? void 0 : v.get(o)) ?? W, this._$Em = null;
    }
  }
  requestUpdate(a, c, l, o = !1, w) {
    var v;
    if (a !== void 0) {
      const P = this.constructor;
      if (o === !1 && (w = this[a]), l ?? (l = P.getPropertyOptions(a)), !((l.hasChanged ?? gc)(w, c) || l.useDefault && l.reflect && w === ((v = this._$Ej) == null ? void 0 : v.get(a)) && !this.hasAttribute(P._$Eu(a, l)))) return;
      this.C(a, c, l);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(a, c, { useDefault: l, reflect: o, wrapped: w }, v) {
    l && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(a) && (this._$Ej.set(a, v ?? c ?? this[a]), w !== !0 || v !== void 0) || (this._$AL.has(a) || (this.hasUpdated || l || (c = void 0), this._$AL.set(a, c)), o === !0 && this._$Em !== a && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(a));
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
        for (const [w, v] of this._$Ep) this[w] = v;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [w, v] of o) {
        const { wrapped: P } = v, k = this[w];
        P !== !0 || this._$AL.has(w) || k === void 0 || this.C(w, void 0, v, k);
      }
    }
    let a = !1;
    const c = this._$AL;
    try {
      a = this.shouldUpdate(c), a ? (this.willUpdate(c), (l = this._$EO) == null || l.forEach((o) => {
        var w;
        return (w = o.hostUpdate) == null ? void 0 : w.call(o);
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
me.elementStyles = [], me.shadowRootOptions = { mode: "open" }, me[ls("elementProperties")] = /* @__PURE__ */ new Map(), me[ls("finalized")] = /* @__PURE__ */ new Map(), Bn == null || Bn({ ReactiveElement: me }), (mo.reactiveElementVersions ?? (mo.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const hs = globalThis, nc = (S) => S, _a = hs.trustedTypes, ic = _a ? _a.createPolicy("lit-html", { createHTML: (S) => S }) : void 0, yc = "$lit$", po = `lit$${Math.random().toFixed(9).slice(2)}$`, $c = "?" + po, Pf = `<${$c}>`, Io = document, us = () => Io.createComment(""), fs = (S) => S === null || typeof S != "object" && typeof S != "function", Un = Array.isArray, zf = (S) => Un(S) || typeof (S == null ? void 0 : S[Symbol.iterator]) == "function", Pn = `[ 	
\f\r]`, cs = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rc = /-->/g, cc = />/g, zo = RegExp(`>|${Pn}(?:([^\\s"'>=/]+)(${Pn}*=${Pn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), lc = /'/g, hc = /"/g, _c = /^(?:script|style|textarea|title)$/i, Lf = (S) => (a, ...c) => ({ _$litType$: S, strings: a, values: c }), Lo = Lf(1), Vo = Symbol.for("lit-noChange"), at = Symbol.for("lit-nothing"), uc = /* @__PURE__ */ new WeakMap(), Wo = Io.createTreeWalker(Io, 129);
function vc(S, a) {
  if (!Un(S) || !S.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ic !== void 0 ? ic.createHTML(a) : a;
}
const Wf = (S, a) => {
  const c = S.length - 1, l = [];
  let o, w = a === 2 ? "<svg>" : a === 3 ? "<math>" : "", v = cs;
  for (let P = 0; P < c; P++) {
    const k = S[P];
    let W, Y, V = -1, Q = 0;
    for (; Q < k.length && (v.lastIndex = Q, Y = v.exec(k), Y !== null); ) Q = v.lastIndex, v === cs ? Y[1] === "!--" ? v = rc : Y[1] !== void 0 ? v = cc : Y[2] !== void 0 ? (_c.test(Y[2]) && (o = RegExp("</" + Y[2], "g")), v = zo) : Y[3] !== void 0 && (v = zo) : v === zo ? Y[0] === ">" ? (v = o ?? cs, V = -1) : Y[1] === void 0 ? V = -2 : (V = v.lastIndex - Y[2].length, W = Y[1], v = Y[3] === void 0 ? zo : Y[3] === '"' ? hc : lc) : v === hc || v === lc ? v = zo : v === rc || v === cc ? v = cs : (v = zo, o = void 0);
    const q = v === zo && S[P + 1].startsWith("/>") ? " " : "";
    w += v === cs ? k + Pf : V >= 0 ? (l.push(W), k.slice(0, V) + yc + k.slice(V) + po + q) : k + po + (V === -2 ? P : q);
  }
  return [vc(S, w + (S[c] || "<?>") + (a === 2 ? "</svg>" : a === 3 ? "</math>" : "")), l];
};
class ds {
  constructor({ strings: a, _$litType$: c }, l) {
    let o;
    this.parts = [];
    let w = 0, v = 0;
    const P = a.length - 1, k = this.parts, [W, Y] = Wf(a, c);
    if (this.el = ds.createElement(W, l), Wo.currentNode = this.el.content, c === 2 || c === 3) {
      const V = this.el.content.firstChild;
      V.replaceWith(...V.childNodes);
    }
    for (; (o = Wo.nextNode()) !== null && k.length < P; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const V of o.getAttributeNames()) if (V.endsWith(yc)) {
          const Q = Y[v++], q = o.getAttribute(V).split(po), O = /([.?@])?(.*)/.exec(Q);
          k.push({ type: 1, index: w, name: O[2], strings: q, ctor: O[1] === "." ? If : O[1] === "?" ? Vf : O[1] === "@" ? Hf : Sa }), o.removeAttribute(V);
        } else V.startsWith(po) && (k.push({ type: 6, index: w }), o.removeAttribute(V));
        if (_c.test(o.tagName)) {
          const V = o.textContent.split(po), Q = V.length - 1;
          if (Q > 0) {
            o.textContent = _a ? _a.emptyScript : "";
            for (let q = 0; q < Q; q++) o.append(V[q], us()), Wo.nextNode(), k.push({ type: 2, index: ++w });
            o.append(V[Q], us());
          }
        }
      } else if (o.nodeType === 8) if (o.data === $c) k.push({ type: 2, index: w });
      else {
        let V = -1;
        for (; (V = o.data.indexOf(po, V + 1)) !== -1; ) k.push({ type: 7, index: w }), V += po.length - 1;
      }
      w++;
    }
  }
  static createElement(a, c) {
    const l = Io.createElement("template");
    return l.innerHTML = a, l;
  }
}
function ge(S, a, c = S, l) {
  var v, P;
  if (a === Vo) return a;
  let o = l !== void 0 ? (v = c._$Co) == null ? void 0 : v[l] : c._$Cl;
  const w = fs(a) ? void 0 : a._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== w && ((P = o == null ? void 0 : o._$AO) == null || P.call(o, !1), w === void 0 ? o = void 0 : (o = new w(S), o._$AT(S, c, l)), l !== void 0 ? (c._$Co ?? (c._$Co = []))[l] = o : c._$Cl = o), o !== void 0 && (a = ge(S, o._$AS(S, a.values), o, l)), a;
}
class Of {
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
    const { el: { content: c }, parts: l } = this._$AD, o = ((a == null ? void 0 : a.creationScope) ?? Io).importNode(c, !0);
    Wo.currentNode = o;
    let w = Wo.nextNode(), v = 0, P = 0, k = l[0];
    for (; k !== void 0; ) {
      if (v === k.index) {
        let W;
        k.type === 2 ? W = new ps(w, w.nextSibling, this, a) : k.type === 1 ? W = new k.ctor(w, k.name, k.strings, this, a) : k.type === 6 && (W = new Gf(w, this, a)), this._$AV.push(W), k = l[++P];
      }
      v !== (k == null ? void 0 : k.index) && (w = Wo.nextNode(), v++);
    }
    return Wo.currentNode = Io, o;
  }
  p(a) {
    let c = 0;
    for (const l of this._$AV) l !== void 0 && (l.strings !== void 0 ? (l._$AI(a, l, c), c += l.strings.length - 2) : l._$AI(a[c])), c++;
  }
}
class ps {
  get _$AU() {
    var a;
    return ((a = this._$AM) == null ? void 0 : a._$AU) ?? this._$Cv;
  }
  constructor(a, c, l, o) {
    this.type = 2, this._$AH = at, this._$AN = void 0, this._$AA = a, this._$AB = c, this._$AM = l, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
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
    a = ge(this, a, c), fs(a) ? a === at || a == null || a === "" ? (this._$AH !== at && this._$AR(), this._$AH = at) : a !== this._$AH && a !== Vo && this._(a) : a._$litType$ !== void 0 ? this.$(a) : a.nodeType !== void 0 ? this.T(a) : zf(a) ? this.k(a) : this._(a);
  }
  O(a) {
    return this._$AA.parentNode.insertBefore(a, this._$AB);
  }
  T(a) {
    this._$AH !== a && (this._$AR(), this._$AH = this.O(a));
  }
  _(a) {
    this._$AH !== at && fs(this._$AH) ? this._$AA.nextSibling.data = a : this.T(Io.createTextNode(a)), this._$AH = a;
  }
  $(a) {
    var w;
    const { values: c, _$litType$: l } = a, o = typeof l == "number" ? this._$AC(a) : (l.el === void 0 && (l.el = ds.createElement(vc(l.h, l.h[0]), this.options)), l);
    if (((w = this._$AH) == null ? void 0 : w._$AD) === o) this._$AH.p(c);
    else {
      const v = new Of(o, this), P = v.u(this.options);
      v.p(c), this.T(P), this._$AH = v;
    }
  }
  _$AC(a) {
    let c = uc.get(a.strings);
    return c === void 0 && uc.set(a.strings, c = new ds(a)), c;
  }
  k(a) {
    Un(this._$AH) || (this._$AH = [], this._$AR());
    const c = this._$AH;
    let l, o = 0;
    for (const w of a) o === c.length ? c.push(l = new ps(this.O(us()), this.O(us()), this, this.options)) : l = c[o], l._$AI(w), o++;
    o < c.length && (this._$AR(l && l._$AB.nextSibling, o), c.length = o);
  }
  _$AR(a = this._$AA.nextSibling, c) {
    var l;
    for ((l = this._$AP) == null ? void 0 : l.call(this, !1, !0, c); a !== this._$AB; ) {
      const o = nc(a).nextSibling;
      nc(a).remove(), a = o;
    }
  }
  setConnected(a) {
    var c;
    this._$AM === void 0 && (this._$Cv = a, (c = this._$AP) == null || c.call(this, a));
  }
}
class Sa {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(a, c, l, o, w) {
    this.type = 1, this._$AH = at, this._$AN = void 0, this.element = a, this.name = c, this._$AM = o, this.options = w, l.length > 2 || l[0] !== "" || l[1] !== "" ? (this._$AH = Array(l.length - 1).fill(new String()), this.strings = l) : this._$AH = at;
  }
  _$AI(a, c = this, l, o) {
    const w = this.strings;
    let v = !1;
    if (w === void 0) a = ge(this, a, c, 0), v = !fs(a) || a !== this._$AH && a !== Vo, v && (this._$AH = a);
    else {
      const P = a;
      let k, W;
      for (a = w[0], k = 0; k < w.length - 1; k++) W = ge(this, P[l + k], c, k), W === Vo && (W = this._$AH[k]), v || (v = !fs(W) || W !== this._$AH[k]), W === at ? a = at : a !== at && (a += (W ?? "") + w[k + 1]), this._$AH[k] = W;
    }
    v && !o && this.j(a);
  }
  j(a) {
    a === at ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, a ?? "");
  }
}
class If extends Sa {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(a) {
    this.element[this.name] = a === at ? void 0 : a;
  }
}
class Vf extends Sa {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(a) {
    this.element.toggleAttribute(this.name, !!a && a !== at);
  }
}
class Hf extends Sa {
  constructor(a, c, l, o, w) {
    super(a, c, l, o, w), this.type = 5;
  }
  _$AI(a, c = this) {
    if ((a = ge(this, a, c, 0) ?? at) === Vo) return;
    const l = this._$AH, o = a === at && l !== at || a.capture !== l.capture || a.once !== l.once || a.passive !== l.passive, w = a !== at && (l === at || o);
    o && this.element.removeEventListener(this.name, this, l), w && this.element.addEventListener(this.name, this, a), this._$AH = a;
  }
  handleEvent(a) {
    var c;
    typeof this._$AH == "function" ? this._$AH.call(((c = this.options) == null ? void 0 : c.host) ?? this.element, a) : this._$AH.handleEvent(a);
  }
}
class Gf {
  constructor(a, c, l) {
    this.element = a, this.type = 6, this._$AN = void 0, this._$AM = c, this.options = l;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(a) {
    ge(this, a);
  }
}
const zn = hs.litHtmlPolyfillSupport;
zn == null || zn(ds, ps), (hs.litHtmlVersions ?? (hs.litHtmlVersions = [])).push("3.3.2");
const Uf = (S, a, c) => {
  const l = (c == null ? void 0 : c.renderBefore) ?? a;
  let o = l._$litPart$;
  if (o === void 0) {
    const w = (c == null ? void 0 : c.renderBefore) ?? null;
    l._$litPart$ = o = new ps(a.insertBefore(us(), w), w, void 0, c ?? {});
  }
  return o._$AI(S), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oo = globalThis;
let be = class extends me {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(a), this._$Do = Uf(c, this.renderRoot, this.renderOptions);
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
    return Vo;
  }
};
var pc;
be._$litElement$ = !0, be.finalized = !0, (pc = Oo.litElementHydrateSupport) == null || pc.call(Oo, { LitElement: be });
const Ln = Oo.litElementPolyfillSupport;
Ln == null || Ln({ LitElement: be });
(Oo.litElementVersions ?? (Oo.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jf = { CHILD: 2 }, qf = (S) => (...a) => ({ _$litDirective$: S, values: a });
class Yf {
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
class On extends Yf {
  constructor(a) {
    if (super(a), this.it = at, a.type !== jf.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(a) {
    if (a === at || a == null) return this._t = void 0, this.it = a;
    if (a === Vo) return a;
    if (typeof a != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (a === this.it) return this._t;
    this.it = a;
    const c = [a];
    return c.raw = c, this._t = { _$litType$: this.constructor.resultType, strings: c, values: [] };
  }
}
On.directiveName = "unsafeHTML", On.resultType = 1;
const Xf = qf(On), jn = class jn extends be {
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
    var w;
    const c = a.target, l = c == null ? void 0 : c.configValue;
    if (!l) return;
    let o = ((w = a.detail) == null ? void 0 : w.value) ?? c.value;
    if (c.checked !== void 0 && (o = c.checked), c.type === "number") {
      const v = Number(o);
      Number.isNaN(v) || (o = v);
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
    var mt, $o, zt, Ut, eo, bt, Lt, wt, xt, jt, _o, nt, $t, ht, Ft, _e, Uo, ms, bs, gs, ys, $s, ve, Se, wa, we, _s, jo, so, ao, qo, Wt, et, vs, Ss, vo, no, H, Yo, Xo, ws, xs, So, Rt, Rs, Ms, Cs, xe, Re, Me, Ce, Zo, ke, Ne, ks, Ns, Es, Ts, Fs, Ee, As, Ds, Te, Bs, Ps, Ko, zs, Ls, Fe, Ae, De, Be, Pe, wo, xo, ze, io, ro, Le, Ws, Os, Is, Vs;
    if (!this._hass) return Lo``;
    const a = this._config || {}, c = a.siSourceAttr ?? "sunlight_visualizer_source", l = a.siSourceValue ?? "sunlight_visualizer", o = Object.entries(this._hass.states ?? {}).filter(
      ([, N]) => {
        var D;
        return ((D = N == null ? void 0 : N.attributes) == null ? void 0 : D[c]) === l;
      }
    ), w = (N) => {
      for (const [D, X] of o)
        if (N(X, D)) return D;
      return null;
    }, v = (N) => w((D) => {
      var X;
      return ((X = D == null ? void 0 : D.attributes) == null ? void 0 : X.camera_rotation) === N;
    }), P = (N) => w((D) => {
      var X;
      return ((X = D == null ? void 0 : D.attributes) == null ? void 0 : X.si_setting) === N;
    }), k = a.rotationHEntity ?? v("h") ?? "", W = a.rotationVEntity ?? v("v") ?? "", Y = a.houseAngleEntity ?? P("house_angle") ?? "", V = P("ceiling_tilt") ?? "", Q = P("house_direction") ?? "", q = P("roof_direction") ?? "", O = (N, D = !1) => {
      if (N == null || N === "") return D;
      if (typeof N == "boolean") return N;
      if (typeof N == "number") return N !== 0;
      if (typeof N == "string") {
        const X = N.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(X)) return !0;
        if (["false", "0", "no", "off"].includes(X)) return !1;
      }
      return D;
    };
    let F = "", kt, Nt;
    for (const [, N] of o)
      !F && ((mt = N == null ? void 0 : N.attributes) != null && mt.roof_power_entity) && (F = N.attributes.roof_power_entity), kt === void 0 && (($o = N == null ? void 0 : N.attributes) == null ? void 0 : $o.roof_power_enabled) !== void 0 && (kt = N.attributes.roof_power_enabled), Nt === void 0 && ((zt = N == null ? void 0 : N.attributes) == null ? void 0 : zt.roof_power_invert) !== void 0 && (Nt = N.attributes.roof_power_invert);
    const Bt = a.preferIntegrationSettings ?? !0, Pt = o.length > 0, Qt = Bt ? F || a.roofPowerEntity || "" : a.roofPowerEntity || F || "", J = Bt ? O(kt, O(a.roofPowerEnabled, !1)) : O(a.roofPowerEnabled, O(kt, !1)), tt = Bt ? O(Nt, O(a.roofPowerInvert, !1)) : O(a.roofPowerInvert, O(Nt, !1)), Et = Number((bt = (eo = (Ut = o.find(([, N]) => {
      var D;
      return ((D = N == null ? void 0 : N.attributes) == null ? void 0 : D.auto_rotate_speed) != null;
    })) == null ? void 0 : Ut[1]) == null ? void 0 : eo.attributes) == null ? void 0 : bt.auto_rotate_speed), to = Bt && Number.isFinite(Et) ? Et : Number(a.autoRotateSpeed ?? (Number.isFinite(Et) ? Et : 10));
    Number(((xt = (wt = (Lt = this._hass) == null ? void 0 : Lt.states) == null ? void 0 : wt[Y]) == null ? void 0 : xt.state) ?? a.houseAngle ?? 0);
    const Tt = ["North", "NE", "East", "SE", "South", "SW", "West", "NW", "Custom"], ot = ["front", "back", "left", "right"], oo = !!Q, bo = !!q, ye = oo ? (($t = (nt = (_o = (jt = this._hass) == null ? void 0 : jt.states) == null ? void 0 : _o[Q]) == null ? void 0 : nt.attributes) == null ? void 0 : $t.options) ?? Tt : Tt, Ho = bo ? ((Uo = (_e = (Ft = (ht = this._hass) == null ? void 0 : ht.states) == null ? void 0 : Ft[q]) == null ? void 0 : _e.attributes) == null ? void 0 : Uo.options) ?? ot : ot, go = oo ? ((gs = (bs = (ms = this._hass) == null ? void 0 : ms.states) == null ? void 0 : bs[Q]) == null ? void 0 : gs.state) ?? "Custom" : a.houseDirection ?? "Custom", Go = bo ? ((ve = ($s = (ys = this._hass) == null ? void 0 : ys.states) == null ? void 0 : $s[q]) == null ? void 0 : ve.state) ?? "front" : a.roofTiltFace ?? "front", $e = !!k, rt = !!W, yo = !!V;
    return Lo`
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
      </div>

      <div class="section">
        <div class="title">House & Roof</div>
        <div class="row">
          <div>
            <div class="slider-label">House angle</div>
            <ha-slider
              .value=${Number(((we = (wa = (Se = this._hass) == null ? void 0 : Se.states) == null ? void 0 : wa[Y]) == null ? void 0 : we.state) ?? 0)}
              .min=${Number(((ao = (so = (jo = (_s = this._hass) == null ? void 0 : _s.states) == null ? void 0 : jo[Y]) == null ? void 0 : so.attributes) == null ? void 0 : ao.min) ?? 0)}
              .max=${Number(((vs = (et = (Wt = (qo = this._hass) == null ? void 0 : qo.states) == null ? void 0 : Wt[Y]) == null ? void 0 : et.attributes) == null ? void 0 : vs.max) ?? 359)}
              .step=${Number(((H = (no = (vo = (Ss = this._hass) == null ? void 0 : Ss.states) == null ? void 0 : vo[Y]) == null ? void 0 : no.attributes) == null ? void 0 : H.step) ?? 1)}
              @change=${(N) => {
      var D;
      return this._setNumberEntityValue(Y, Number(((D = N.target) == null ? void 0 : D.value) ?? 0));
    }}
              .disabled=${!Y}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"House direction"}
              .selector=${{ select: { options: ye, mode: "dropdown" } }}
              .value=${go}
              @value-changed=${(N) => {
      var X;
      const D = ((X = N.detail) == null ? void 0 : X.value) ?? go;
      oo ? (this._setSelectEntityOption(Q, D), this._setConfigValue("houseDirection", void 0)) : this._setConfigValue("houseDirection", D);
    }}
            ></ha-selector>
            <div class="helper">Select compass direction your front door is facing.</div>
          </div>
        </div>
        <div class="row">
          <div>
            <div class="slider-label">Ceiling tilt</div>
            <ha-slider
              .value=${Number(((ws = (Xo = (Yo = this._hass) == null ? void 0 : Yo.states) == null ? void 0 : Xo[V]) == null ? void 0 : ws.state) ?? 0)}
              .min=${Number(((Rs = (Rt = (So = (xs = this._hass) == null ? void 0 : xs.states) == null ? void 0 : So[V]) == null ? void 0 : Rt.attributes) == null ? void 0 : Rs.min) ?? 0)}
              .max=${Number(((Re = (xe = (Cs = (Ms = this._hass) == null ? void 0 : Ms.states) == null ? void 0 : Cs[V]) == null ? void 0 : xe.attributes) == null ? void 0 : Re.max) ?? 90)}
              .step=${Number(((ke = (Zo = (Ce = (Me = this._hass) == null ? void 0 : Me.states) == null ? void 0 : Ce[V]) == null ? void 0 : Zo.attributes) == null ? void 0 : ke.step) ?? 1)}
              @change=${(N) => {
      var D;
      return this._setNumberEntityValue(V, Number(((D = N.target) == null ? void 0 : D.value) ?? 0));
    }}
              .disabled=${!yo}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"Roof direction"}
              .selector=${{ select: { options: Ho, mode: "dropdown" } }}
              .value=${Go}
              @value-changed=${(N) => {
      var X;
      const D = ((X = N.detail) == null ? void 0 : X.value) ?? Go;
      bo ? (this._setSelectEntityOption(q, D), this._setConfigValue("roofTiltFace", void 0)) : this._setConfigValue("roofTiltFace", D);
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
              .value=${Number(((Ns = (ks = (Ne = this._hass) == null ? void 0 : Ne.states) == null ? void 0 : ks[k]) == null ? void 0 : Ns.state) ?? 0)}
              .min=${Number(((Ee = (Fs = (Ts = (Es = this._hass) == null ? void 0 : Es.states) == null ? void 0 : Ts[k]) == null ? void 0 : Fs.attributes) == null ? void 0 : Ee.min) ?? 0)}
              .max=${Number(((Bs = (Te = (Ds = (As = this._hass) == null ? void 0 : As.states) == null ? void 0 : Ds[k]) == null ? void 0 : Te.attributes) == null ? void 0 : Bs.max) ?? 359)}
              .step=${Number(((Ls = (zs = (Ko = (Ps = this._hass) == null ? void 0 : Ps.states) == null ? void 0 : Ko[k]) == null ? void 0 : zs.attributes) == null ? void 0 : Ls.step) ?? 1)}
              @change=${(N) => {
      var D;
      return this._setNumberEntityValue(k, Number(((D = N.target) == null ? void 0 : D.value) ?? 0));
    }}
              .disabled=${!$e}
            ></ha-slider>
          </div>
          <div>
            <div class="slider-label">Camera rotation V</div>
            <ha-slider
              .value=${Number(((De = (Ae = (Fe = this._hass) == null ? void 0 : Fe.states) == null ? void 0 : Ae[W]) == null ? void 0 : De.state) ?? 0)}
              .min=${Number(((xo = (wo = (Pe = (Be = this._hass) == null ? void 0 : Be.states) == null ? void 0 : Pe[W]) == null ? void 0 : wo.attributes) == null ? void 0 : xo.min) ?? 0)}
              .max=${Number(((Le = (ro = (io = (ze = this._hass) == null ? void 0 : ze.states) == null ? void 0 : io[W]) == null ? void 0 : ro.attributes) == null ? void 0 : Le.max) ?? 90)}
              .step=${Number(((Vs = (Is = (Os = (Ws = this._hass) == null ? void 0 : Ws.states) == null ? void 0 : Os[W]) == null ? void 0 : Is.attributes) == null ? void 0 : Vs.step) ?? 1)}
              @change=${(N) => {
      var D;
      return this._setNumberEntityValue(W, Number(((D = N.target) == null ? void 0 : D.value) ?? 0));
    }}
              .disabled=${!rt}
            ></ha-slider>
          </div>
        </div>
        <div class="row">
          <div>${k || "Camera rotation H not found"}</div>
          <div>${W || "Camera rotation V not found"}</div>
        </div>
      </div>

      <div class="section">
        <div class="title">Roof power</div>
        <div class="row single">
          <ha-selector
            .hass=${this._hass}
            .selector=${{ entity: { domain: ["sensor", "number", "input_number"] } }}
            .value=${Qt}
            @value-changed=${(N) => {
      var X;
      const D = (X = N.detail) == null ? void 0 : X.value;
      Pt ? (this._setIntegrationOptions({ roof_power_entity: D || null }), this._setConfigValue("roofPowerEntity", void 0)) : this._setConfigValue("roofPowerEntity", D);
    }}
          ></ha-selector>
        </div>
        <div class="row single">
          <div class="switch-row">
            <span>Enable power label</span>
            <ha-switch
              .checked=${J ?? !1}
              @change=${(N) => {
      var X;
      const D = !!((X = N.target) != null && X.checked);
      Pt ? (this._setIntegrationOptions({ roof_power_enabled: D }), this._setConfigValue("roofPowerEnabled", void 0)) : this._setConfigValue("roofPowerEnabled", D);
    }}
            ></ha-switch>
          </div>
          <div class="switch-row">
            <span>Invert power value</span>
            <ha-switch
              .checked=${tt ?? !1}
              @change=${(N) => {
      var X;
      const D = !!((X = N.target) != null && X.checked);
      Pt ? (this._setIntegrationOptions({ roof_power_invert: D }), this._setConfigValue("roofPowerInvert", void 0)) : this._setConfigValue("roofPowerInvert", D);
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
            .value=${String(to)}
            min="1"
            max="90"
            step="1"
            .configValue=${"autoRotateSpeed"}
            @change=${(N) => {
      var Hs, Gs;
      const D = ((Hs = N == null ? void 0 : N.detail) == null ? void 0 : Hs.value) ?? ((Gs = N == null ? void 0 : N.target) == null ? void 0 : Gs.value);
      let X = Math.round(Number(D));
      Number.isNaN(X) || (X = Math.min(90, Math.max(1, X)), Pt ? (this._setIntegrationOptions({ auto_rotate_speed: X }), this._setConfigValue("autoRotateSpeed", void 0)) : this._setConfigValue("autoRotateSpeed", X));
    }}
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
      autoRotateSpeed: 10
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
    const w = 250, v = Number(this._hostWidth || this.clientWidth || 0), P = v > 0 ? v : c, k = Math.min(c, Math.max(w, Math.floor(P))), W = k / c, Y = Math.max(1, Math.round(l * W));
    return { cardW: k, cardH: Y };
  }
  _stopManualRotate() {
    const a = !!this._manualRotateEnabled;
    this._manualRotateTimer && (clearInterval(this._manualRotateTimer), this._manualRotateTimer = null), this._manualRotateEnabled = !1, this._manualRotateAxis = null, this._manualRotateDir = 0, this._manualRotateAccumDeg = 0, this._manualRotateTargetDeg = 0, this._manualRotateLastTick = 0, this._manualRotateIntervalMs = 0, a && (this._cssRecalibrateRequested = !0), this.requestUpdate();
  }
  _startManualRotate(a, c) {
    const l = () => typeof performance < "u" && performance.now ? performance.now() : Date.now(), o = Number(this._autoRotateSpeed || 10), w = Number(this._rotationIntervalMsFloor || this._autoRotateIntervalMs || 50), v = Math.max(1, Number(this._autoRotateTurnCount || 1));
    this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate(), this._manualRotateEnabled = !0, this._manualRotateAxis = a, this._manualRotateDir = c, this._manualRotateAccumDeg = 0, this._manualRotateTargetDeg = a === "h" ? 360 * v : 0, this._manualRotateLastTick = l(), this._manualRotateIntervalMs = w, this._manualRotateVOffsetDeg || (this._manualRotateVOffsetDeg = 0), this._manualRotateTimer = setInterval(() => {
      const P = l(), k = this._manualRotateLastTick || P, W = Math.max(0, P - k) / 1e3;
      if (this._manualRotateLastTick = P, !this._manualRotateEnabled) return;
      const Y = this._manualRotateAxis === "v" ? 0.5 : 1, V = o * Y * W * (this._manualRotateDir || 1);
      if (this._manualRotateAxis === "h") {
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + V, this._manualRotateAccumDeg = (this._manualRotateAccumDeg || 0) + Math.abs(V), this._manualRotateAccumDeg >= (this._manualRotateTargetDeg || 360)) {
          this._stopManualRotate();
          return;
        }
      } else if (this._manualRotateAxis === "v") {
        const Q = Number(this._manualRotateBaseVDeg ?? 35), q = Number(this._manualRotateVOffsetDeg || 0), O = Math.min(90, Math.max(0, Q + q)), F = Math.min(90, Math.max(0, O + V));
        if (this._manualRotateVOffsetDeg = q + (F - O), this._manualRotateAccumDeg = (this._manualRotateAccumDeg || 0) + Math.abs(F - O), F <= 1e-3 || F >= 89.999) {
          this._stopManualRotate();
          return;
        }
      }
      this._updateTimerMS = Date.now(), this.requestUpdate();
    }, w), this.requestUpdate();
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
  async _saveCurrentCamera(a) {
    a.preventDefault(), a.stopPropagation(), this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate();
    const c = Number(this._currentCameraH ?? 0), l = Number(this._currentCameraV ?? 35), o = this._rotationHEntity, w = this._rotationVEntity;
    this._cameraSavedBaseHOverride = this._normDeg(c), this._cameraSavedBaseVOverride = Math.max(0, Math.min(90, l)), this._autoRotateOffsetDeg = 0, this._manualRotateVOffsetDeg = 0, await this._setNumericEntityValue(o, this._normDeg(c)), await this._setNumericEntityValue(w, Math.max(0, Math.min(90, l))), this.requestUpdate();
  }
  _restoreSavedCamera(a) {
    a.preventDefault(), a.stopPropagation(), this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate(), this._autoRotateOffsetDeg = 0, this._manualRotateVOffsetDeg = 0, this.requestUpdate();
  }
  render() {
    if (!this._hass)
      return Lo`<ha-card></ha-card>`;
    const a = this._config || {}, { cardW: c, cardH: l } = this._getEffectiveCardSize(a), o = Math.min(c, l), w = this.renderSvg(c, l), v = !!(this._autoRotateEnabled || this._manualRotateEnabled && this._manualRotateAxis === "h"), P = !!(this._manualRotateEnabled && this._manualRotateAxis === "v"), k = this._normDeg(Number(this._currentCameraH ?? 0)), W = Math.max(0, Math.min(90, Number(this._currentCameraV ?? 35))), Y = this._normDeg(Number(this._savedCameraH ?? k)), V = Math.max(0, Math.min(90, Number(this._savedCameraV ?? W))), Q = this._degDiffAbs(k, Y) > 0.25 || Math.abs(W - V) > 0.25, q = o < 400, O = 43, F = 10, kt = 10, Nt = (rt, yo, mt) => Math.max(yo, Math.min(mt, rt));
    let Bt = !0, Pt = !0, Qt, J, tt, Et, to, Tt;
    if (q) {
      const mt = F + O + 8 + O + 4, $o = c - (o < 260 ? 4 : 10), zt = Math.max(0, $o - mt), Ut = o < 260 ? 2 : 8, eo = 18;
      if (Bt = o >= 300 && zt >= O * 3 + Ut * 2, Bt) {
        const nt = Nt((zt - O * 3) / 2, Ut, eo), $t = O * 3 + nt * 2, ht = mt + Math.max(0, (zt - $t) / 2);
        Qt = ht, tt = ht + O + nt, J = tt + O + nt;
      } else {
        const nt = Nt(zt - O * 2, Ut, eo), $t = O * 2 + nt, ht = mt + Math.max(0, (zt - $t) / 2);
        Qt = ht, J = ht + O + nt;
      }
      const bt = l - kt - O, Lt = o < 260 ? 46 : 34, wt = bt - 8, xt = Math.max(0, wt - Lt), jt = o < 260 ? 2 : 6, _o = o < 260 ? 10 : 24;
      if (Pt = o >= 300 && xt >= O * 3 + jt * 2, Pt) {
        const nt = Nt((xt - O * 3) / 2, jt, _o), $t = O * 3 + nt * 2, ht = Lt + Math.max(0, (xt - $t) / 2);
        Et = ht, Tt = ht + O + nt, to = Tt + O + nt;
      } else {
        const nt = Nt(xt - O * 2, jt, 16), $t = O * 2 + nt, ht = Lt + Math.max(0, (xt - $t) / 2);
        Et = ht, to = ht + O + nt;
      }
    }
    const ot = q && tt != null ? tt + O * 0.5 : void 0, oo = q && Tt != null ? Tt + O * 0.5 : void 0, bo = q && Qt != null ? `left:${Qt.toFixed(1)}px; bottom:${kt}px;` : "", ye = q && J != null ? `left:${J.toFixed(1)}px; bottom:${kt}px;` : "", Ho = q && ot != null ? `left:${ot.toFixed(1)}px; bottom:${kt}px;` : "", go = q && Et != null ? `left:${F}px; top:${Et.toFixed(1)}px;` : "", Go = q && to != null ? `left:${F}px; top:${to.toFixed(1)}px;` : "", $e = q && oo != null ? `left:${F}px; top:${oo.toFixed(1)}px;` : "";
    return Lo`<div class="wrap">
      <ha-card style="width:${c}px; height:${l}px;">
        <div class="scene">${Xf(w)}</div>
        <button class="cam-btn cam-btn-save" title="Save Camera View" @pointerup=${(rt) => this._saveCurrentCamera(rt)}><ha-icon icon="mdi:content-save"></ha-icon></button>
        ${Q ? Lo`<button class="cam-btn cam-btn-restore" title="Restore Saved View" @pointerup=${(rt) => this._restoreSavedCamera(rt)}>↺</button>` : null}
        <button class="cam-btn cam-btn-h1 ${v ? "cam-btn-stop" : ""}" style=${bo} @pointerup=${(rt) => this._handleControlTap("h", 1, rt)}>${v ? "■" : "⇠"}</button>
        <button class="cam-btn cam-btn-h2 ${v ? "cam-btn-stop" : ""}" style=${ye} @pointerup=${(rt) => this._handleControlTap("h", -1, rt)}>${v ? "■" : "⇢"}</button>
        <button class="cam-btn cam-btn-v1 ${P ? "cam-btn-stop" : ""}" style=${go} @pointerup=${(rt) => this._handleControlTap("v", 1, rt)}>${P ? "■" : "⇡"}</button>
        <button class="cam-btn cam-btn-v2 ${P ? "cam-btn-stop" : ""}" style=${Go} @pointerup=${(rt) => this._handleControlTap("v", -1, rt)}>${P ? "■" : "⇣"}</button>
        ${Bt ? Lo`<div class="cam-readout cam-readout-h" style=${Ho}>${Math.round(k)}°</div>` : null}
        ${Pt ? Lo`<div class="cam-readout cam-readout-v" style=${$e}>${Math.round(W)}°</div>` : null}
      </ha-card>
    </div>`;
  }
  renderSvg(a, c) {
    var Tr, Fr, Ar, Dr, Br, Pr, zr, Lr, Wr, Or, Ir, Vr, Hr, Gr, Ur, jr;
    const l = this._hass, o = this._config || {}, w = o.siSourceAttr ?? "sunlight_visualizer_source", v = o.siSourceValue ?? "sunlight_visualizer", P = Object.entries(l.states ?? {}).filter(
      ([, t]) => {
        var e;
        return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e[w]) === v;
      }
    ), k = (t) => {
      for (const [e, s] of P)
        if (t(s, e)) return [e, s];
      return null;
    }, W = (t) => {
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
    }, V = (t) => {
      const e = k((s) => {
        var n;
        return ((n = s == null ? void 0 : s.attributes) == null ? void 0 : n.si_setting) === t;
      });
      return e ? e[0] : void 0;
    }, Q = k(
      (t) => {
        var e, s;
        return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.sun_azimuth) != null && ((s = t == null ? void 0 : t.attributes) == null ? void 0 : s.sun_elevation) != null;
      }
    ), q = Q ? Q[1].attributes : null, O = k(
      (t) => {
        var e, s, n;
        return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.roof_direction) != null || ((s = t == null ? void 0 : t.attributes) == null ? void 0 : s.ceiling_tilt) != null || ((n = t == null ? void 0 : t.attributes) == null ? void 0 : n.house_angle) != null;
      }
    ), F = O ? O[1].attributes : null, kt = !!(F != null && F.force_sun_fallback), Nt = Number(a ?? o.cardWidth ?? 450), Bt = Number(c ?? o.cardHeight ?? 450), Pt = Nt, Qt = Bt, J = Pt, tt = Qt, Et = J, to = tt, Tt = J * 0.1, ot = o.floorScale ?? 2.6, oo = J * 0.5, bo = tt * 0.4, ye = o.floorColor ?? "#2f2f2f", Ho = Number(o.floorCornerRadius ?? 26), go = Number(o.floorThicknessPx ?? 7), Go = o.floorThicknessColor ?? "rgba(150,106,64,0.9)", $e = o.floorTopStrokeColor ?? "rgba(72,112,56,0.8)", rt = Number(o.floorTopStrokeWidth ?? 1.4), yo = o.floorGrassEnabled ?? !0, mt = Number(o.floorGrassOpacity ?? 0.3), $o = o.floorGrassColorA ?? "rgb(136,186,88)", zt = o.floorGrassColorB ?? "rgb(96,150,62)", Ut = o.rotationHEntity ?? Y("h") ?? "input_number.cube_rotation_h", eo = o.rotationVEntity ?? Y("v") ?? "input_number.cube_rotation_v";
    this._rotationHEntity = Ut, this._rotationVEntity = eo;
    const bt = o.preferIntegrationSettings ?? !0, Lt = o.houseAngleEntity ?? null;
    let wt = Number(o.houseAngle ?? 0);
    const xt = V("house_angle");
    Lt && l.states[Lt] ? wt = Number(((Tr = l.states[Lt]) == null ? void 0 : Tr.state) ?? wt) : xt && l.states[xt] ? wt = Number(((Fr = l.states[xt]) == null ? void 0 : Fr.state) ?? wt) : (bt || o.houseAngle == null) && (F == null ? void 0 : F.house_angle) != null && (wt = Number(F.house_angle ?? wt));
    const jt = o.wallFrontPctEntity ?? W("front"), _o = o.wallRightPctEntity ?? W("right"), nt = o.wallBackPctEntity ?? W("back"), $t = o.wallLeftPctEntity ?? W("left"), ht = o.roofPctEntity ?? W("ceiling"), Ft = (t, e = !1) => {
      if (t == null || t === "") return e;
      if (typeof t == "boolean") return t;
      if (typeof t == "number") return t !== 0;
      if (typeof t == "string") {
        const s = t.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(s)) return !0;
        if (["false", "0", "no", "off"].includes(s)) return !1;
      }
      return e;
    }, _e = bt ? (F == null ? void 0 : F.roof_power_entity) ?? o.roofPowerEntity ?? null : o.roofPowerEntity ?? (F == null ? void 0 : F.roof_power_entity) ?? null, Uo = bt ? Ft(F == null ? void 0 : F.roof_power_enabled, Ft(o.roofPowerEnabled, !1)) : Ft(o.roofPowerEnabled, Ft(F == null ? void 0 : F.roof_power_enabled, !1)), ms = bt ? Ft(F == null ? void 0 : F.roof_power_invert, Ft(o.roofPowerInvert, !1)) : Ft(o.roofPowerInvert, Ft(F == null ? void 0 : F.roof_power_invert, !1)), bs = jt ? Number(((Ar = l.states[jt]) == null ? void 0 : Ar.state) ?? 0) : 0, gs = _o ? Number(((Dr = l.states[_o]) == null ? void 0 : Dr.state) ?? 0) : 0, ys = nt ? Number(((Br = l.states[nt]) == null ? void 0 : Br.state) ?? 0) : 0, $s = $t ? Number(((Pr = l.states[$t]) == null ? void 0 : Pr.state) ?? 0) : 0, ve = ht ? Number(((zr = l.states[ht]) == null ? void 0 : zr.state) ?? 0) : 0, Se = Uo && _e ? Number((Lr = l.states[_e]) == null ? void 0 : Lr.state) : NaN, we = Uo ? ((t) => Number.isFinite(t) ? t >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W` : "0 W")(ms ? Math.abs(Se) : Se) : "", _s = o.useSunEntity ?? !1, jo = o.sunEntityId ?? "sun.sun", so = o.sunAzEntity ?? null, ao = o.sunElEntity ?? null;
    let qo = Number(o.sunDistance ?? 3), Wt = Number(o.sunAz ?? 135), et = Number(o.sunEl ?? 55);
    const vs = Number(o.sunVisualElevationBiasDeg ?? 6), Ss = Number(o.sunVisualElevationScale ?? 1);
    so && l.states[so] && (Wt = Number(((Wr = l.states[so]) == null ? void 0 : Wr.state) ?? Wt)), ao && l.states[ao] && (et = Number(((Or = l.states[ao]) == null ? void 0 : Or.state) ?? et)), !so && bt && (q == null ? void 0 : q.sun_azimuth) != null && (Wt = Number(q.sun_azimuth ?? Wt)), !ao && bt && (q == null ? void 0 : q.sun_elevation) != null && (et = Number(q.sun_elevation ?? et)), !so && !ao && !q && _s && l.states[jo] && (Wt = Number(((Ir = l.states[jo].attributes) == null ? void 0 : Ir.azimuth) ?? Wt), et = Number(((Vr = l.states[jo].attributes) == null ? void 0 : Vr.elevation) ?? et));
    const vo = o.roofTiltEnabled ?? !0;
    let no = Number(o.roofTiltDeg ?? 25), H = o.roofTiltFace ?? "front";
    const Yo = V("ceiling_tilt"), Xo = V("roof_direction"), ws = Number(o.roofTiltMax ?? 89), xs = Number(o.roofTiltOpacity ?? 1);
    Yo && l.states[Yo] ? no = Number(((Hr = l.states[Yo]) == null ? void 0 : Hr.state) ?? no) : (bt || o.roofTiltDeg == null) && (F == null ? void 0 : F.ceiling_tilt) != null && (no = Number(F.ceiling_tilt ?? no)), Xo && l.states[Xo] ? H = String(((Gr = l.states[Xo]) == null ? void 0 : Gr.state) ?? H) : (bt || o.roofTiltFace == null) && (F == null ? void 0 : F.roof_direction) != null && (H = String(F.roof_direction));
    const So = o.houseStyleV2 ?? !0, Rt = o.flatRoofEnabled ?? !0, Rs = Number(o.flatRoofOverhang ?? 0.15), Ms = Number(o.flatRoofThickness ?? 0.12), Cs = Number(o.flatRoofLift ?? 0), xe = o.flatRoofTopColor ?? "#e6e8ee";
    o.flatRoofEdgeColor;
    const Re = o.flatRoofSideColor ?? "#9ea4af", Me = Number(o.flatRoofSideShade ?? 0.4), Ce = Number(o.flatRoofTopOpacity ?? 1), Zo = Number(o.flatRoofEdgeOpacity ?? 1), ke = Number(o.flatRoofTopDepthBias ?? 0.06), Ne = Number(o.flatRoofSideDepthBias ?? 0.025), ks = Number(o.flatRoofSkirtDepthBias ?? 0.02), Ns = o.wallWindowsEnabled ?? !0, Es = o.wallWindowFrameColor ?? "rgba(221,228,236,0.98)", Ts = o.wallWindowGlassColor ?? "rgba(110,178,212,0.68)", Fs = o.wallWindowStrokeColor ?? "rgba(62,105,130,0.65)", Ee = Number(o.wallWindowStrokeWidth ?? 1), As = o.roofPanelsEnabled ?? So, Ds = o.roofPanelColor ?? "#2d3f7b", Te = o.roofPanelGridColor ?? "rgba(214,230,255,0.65)", Bs = o.roofPanelBorderColor ?? "rgba(185,204,234,0.85)", Ps = Number(o.roofPanelBorderWidth ?? 0.9), Ko = Math.max(1, Math.round(Number(o.roofPanelsCols ?? 3))), zs = M(Number(o.roofPanelsWidthFrac ?? 0.9), 0.4, 0.98), Ls = M(Number(o.roofPanelsGapFrac ?? 0.025), 0, 0.08), Fe = M(Number(o.roofPanelsT0 ?? 0.05), 0, 0.95), Ae = M(Number(o.roofPanelsT1 ?? 0.26), 0.01, 0.98), De = Math.max(1, Math.round(Number(o.roofPanelGridCols ?? 5))), Be = Math.max(1, Math.round(Number(o.roofPanelGridRows ?? 3))), Pe = o.backTreeEnabled ?? !0, wo = Number(o.backTreeX ?? -2.2), xo = Number(o.backTreeZ ?? -2.2), ze = Number(o.backTreeScale ?? 1), io = o.backTreeLeafColor ?? "#9bc94b", ro = o.backTreeTrunkColor ?? "#6f4b2a", Le = o.backTreeShadowEnabled ?? So, Ws = Number(o.backTreeShadowOpacity ?? 0.35), Os = Number(o.backTreeShadowBlur ?? 1.1), Is = Number(o.backTreeShadowLength ?? 0.015), Vs = o.plinthBandEnabled ?? So, N = Number(o.plinthBandHeight ?? 0.06), D = Number(o.plinthBandMix ?? 0.62), X = o.patioStepEnabled ?? So, Hs = Number(o.patioStepDepth ?? 0.24), Gs = Number(o.patioStepWidth ?? 1.1), Sc = Number(o.patioStepInset ?? 0.02), wc = o.patioStepColor ?? "rgba(226,230,235,0.75)", Yn = o.patioGridColor ?? "rgba(164,170,182,0.8)", Xn = Number(o.patioGridWidth ?? 1), xa = o.shadowEnabled ?? !0, xc = Number(o.shadowOpacity ?? 0.35), Rc = Number(o.shadowBlur ?? 4), Mc = Number(o.shadowContactOpacity ?? 0.12), Cc = Number(o.shadowContactBlur ?? 2.5), Jo = o.shadowColor ?? "#000000", Zn = Number(o.shadowClipInset ?? 0.02), Ra = o.baseAnchorShadowEnabled ?? !0, kc = Number(o.baseAnchorShadowOpacity ?? 0.65), Nc = Number(o.baseAnchorShadowBlur ?? 0.2), Ec = Number(o.baseAnchorShadowSpread ?? 0.05), Tc = o.baseAnchorShadowColor ?? "#000000", Ma = o.sunlightEnabled ?? !0, Ca = o.sunlightColor ?? [255, 225, 160], Kn = Number(o.sunlightOpacity ?? 0.7), Fc = Number(o.sunlightSpread ?? 0.7), Ac = Number(o.sunBeamStaticOpacity ?? 0.07), Dc = Number(o.sunBeamStaticWidth ?? 1.6), ka = o.sunBeamFlowEnabled ?? !0, Bc = o.sunBeamFlowColor ?? "rgba(255,200,50,0.85)", Pc = Number(o.sunBeamFlowOpacity ?? 0.55), zc = Number(o.sunBeamFlowWidthScale ?? 0.6), Na = Number(o.sunBeamFlowDash ?? 8), Ea = Number(o.sunBeamFlowGap ?? 50), Lc = Number(o.sunBeamFlowDuration ?? 2.5), Wc = Number(o.sunBeamFlowPhaseStep ?? 0.1), Oc = Number(o.sunBeamDepthScaleBoost ?? 1), Ic = Number(o.sunBeamDepthScaleMin ?? 0.55), Vc = Number(o.sunBeamDepthScaleMax ?? 1.2), Hc = o.sunRayAnimEnabled ?? !0, Ta = Number(o.sunRayAnimDurationMin ?? 1.8), Fa = Number(o.sunRayAnimDurationMax ?? 3), Gc = Number(o.sunRayAnimScaleMin ?? 0.5), Uc = Number(o.sunRayAnimScaleMax ?? 0.75), jc = Number(o.sunRayAnimOpacityMin ?? 0.45);
    Number(o.sunRayAnimOpacityMax ?? 0.85);
    const Jn = o.sunRayAnimColorA ?? "rgb(255,240,110)";
    o.sunRayAnimColorB;
    const We = o.skyCloudsEnabled ?? !0, Qn = Number(o.skyCloudOpacity ?? 0.34), qc = Number(o.skyCloudBlur ?? 3.3), Aa = Number(o.skyCloudScale ?? 1.5), Da = Number(o.skyCloudSpeed ?? 1), Yc = Number(o.skyCloudHeight ?? 0.5);
    Number(o.wallBottomMix ?? 0.01), Number(o.wallMidMix ?? 0.7), Number(o.wallTopMix ?? 1.3);
    const Xc = o.facadeSunDimmingEnabled ?? !0, Zc = Number(o.facadeSunMinFactor ?? 0.2), Kc = Number(o.facadeSunNoDimAtPct ?? 90), Jc = Number(o.facadeSunCurve ?? 8), Qc = Number(o.ceilingDarkMix ?? 0.1), tl = Number(o.ceilingLightMix ?? 1.4), ti = o.horizonEnabled ?? !0, ol = Number(o.horizonBase ?? 0.55), el = Number(o.horizonTiltStrength ?? 0.65), oi = Number(o.horizonBand ?? 0.15), sl = o.horizonTopColor ?? [120, 170, 220], al = o.horizonBandColor ?? [255, 210, 150], nl = o.horizonBottomColor ?? [70, 80, 95], il = Number(o.skyTwilightRangeDeg ?? 6), rl = o.horizonNightTopColor ?? [12, 20, 42], cl = o.horizonNightBandColor ?? [32, 44, 82], ll = o.horizonNightBottomColor ?? [6, 10, 22], hl = o.horizonSunriseTopColor ?? [118, 150, 206], ul = o.horizonSunriseBandColor ?? [236, 162, 132], fl = o.horizonSunriseBottomColor ?? [84, 70, 90], dl = o.horizonSunsetTopColor ?? [98, 106, 178], pl = o.horizonSunsetBandColor ?? [255, 122, 90], ml = o.horizonSunsetBottomColor ?? [82, 48, 76], Oe = o.skyStarsEnabled ?? !0, Us = Math.max(0, Math.round(Number(o.skyStarsCount ?? 34))), bl = o.skyStarsTwinkleEnabled ?? !0, gl = Number(o.skyStarsOpacity ?? 0.9), Ba = o.skyMoonEnabled ?? !0, yl = Number(o.skyMoonX ?? 0.86), $l = Number(o.skyMoonY ?? 0.12), _l = Number(o.skyMoonSize ?? 14), vl = Number(o.skyMoonPhase ?? 0.72), Sl = Number(o.skyMoonOpacity ?? 0.92), Ie = o.moonlightEnabled ?? !0, js = o.moonlightColor ?? [178, 208, 255], wl = Number(o.moonlightOpacity ?? 0.22), xl = Number(o.moonlightSpread ?? 0.6), Rl = Number(o.moonlightWashOpacity ?? 0.08), Ml = Number(o.moonShadowElevationDeg ?? 18), Cl = Number(o.moonShadowYawDeg ?? -45), kl = Number(o.shadowSunMoonBlendDeg ?? 3), ei = o.vignetteEnabled ?? !0, Nl = Number(o.vignetteOpacity ?? 0.35), El = Number(o.vignetteRadius ?? 0.65), Tl = Number(o.vignetteInner ?? 0.85), Pa = o.vignetteColor ?? [0, 0, 0], Fl = o.roofBackEnabled ?? !0, si = Number(o.roofBackMix ?? 0.7), Al = Number(o.roofBackOpacity ?? 1);
    Number(o.roofGradientDarkMix ?? 0.125), Number(o.roofGradientLightMix ?? 1.25);
    const Dl = o.roofSidesEnabled ?? !0, Bl = Number(o.roofSideMix ?? 0.45), za = Number(o.roofSideOpacity ?? 1), ai = Number(o.roofSideDepthBias ?? 0.012), Pl = o.roofCapEnabled ?? !0, zl = Number(o.floorCompassStroke ?? 4), Ll = Number(o.floorCompassRingBand ?? 0.09), Wl = o.floorCompassRingMiddleColor ?? "rgba(255,255,255,0.9)", ni = o.floorCompassRingSideColor ?? "rgba(210,140,140,0.345)", ii = Number(o.floorCompassRingSideWidth ?? 3), ri = o.floorCompassTicksEnabled ?? !0, Ol = o.floorCompassTickColor ?? "rgba(0,0,0,0.75)", Il = Number(o.floorCompassTickWidth ?? 1), Vl = Number(o.floorCompassTickMajorWidth ?? 4), Hl = Number(o.floorCompassTickLength ?? -0.1), Gl = Number(o.floorCompassTickMajorLength ?? -0.2), Ul = Number(o.floorCompassLabelSize ?? 20), jl = Number(o.floorCompassLabelInset ?? -0.25), ql = Number(o.floorCompassLabelScaleBoost ?? 1.2), Yl = Number(o.floorCompassLabelScaleMin ?? 0.6), Xl = Number(o.floorCompassLabelScaleMax ?? 2), Zl = Number(o.floorCompassLabelStroke ?? 1), ci = Number(o.arrowScaleBoost ?? 0.6), li = Number(o.floorPointerScaleMin ?? 0.05), hi = Number(o.floorPointerScaleMax ?? 1), ui = Number(o.floorPointerBaseWidth ?? 3.4), Kl = Number(o.floorPointerBaseHead ?? 18), La = o.floorPointerColor ?? "gold", fi = o.floorPointerShadowEnabled ?? !0, Wa = Number(o.floorPointerShadowOpacity ?? 0.8), Jl = Number(o.floorPointerShadowBlur ?? 1.1), Ql = Number(o.floorPointerShadowOffset ?? 2.9), th = Number(o.floorWallLabelSize ?? 12), qs = Number(o.floorWallLabelOffset ?? 0.55), oh = Number(o.floorWallLabelScaleBoost ?? 1.2), eh = Number(o.floorWallLabelScaleMin ?? 0.5), sh = Number(o.floorWallLabelScaleMax ?? 1.8), ah = Number(o.floorWallLabelScreenLift ?? 6), nh = o.floorWallLabelColor ?? "rgba(255,255,255,0.9)", ih = o.floorWallLabelStroke ?? "rgba(0,0,0,0.6)", rh = Number(o.floorWallLabelStrokeWidth ?? 0.5), di = Number(o.wallLabelVisibleThreshold ?? -0.05), ch = Number(o.wallPctVisibleThreshold ?? -0.215), lh = Number(o.wallPctAreaThreshold ?? 120), hh = Number(o.wallPctVerticalPos ?? 0.66), pi = o.surfaceLabelEnabled ?? !0, Oa = Number(o.surfaceLabelSize ?? 12), uh = Number(o.surfaceLabelScaleBoost ?? 1.5), fh = Number(o.surfaceLabelScaleMin ?? 0.6), dh = Number(o.surfaceLabelScaleMax ?? 1.6), mi = o.surfaceLabelColor ?? "rgba(255,213,0,.95)", bi = o.surfaceLabelStroke ?? "rgba(0,0,0,0.5)", Ia = Number(o.surfaceLabelStrokeWidth ?? 0.5), Va = Number(o.surfaceLabelOffset ?? 0.03), ph = Number(o.roofPctLabelScale ?? 1.18), mh = Number(o.roofPowerLabelScale ?? 0.7), bh = o.roofPowerLabelColor ?? "rgba(255,255,255,0.9)", gh = o.frontDoorEnabled ?? !0, Ha = Number(o.frontDoorWidth ?? 0.55), gi = Number(o.frontDoorHeight ?? 1.1), yh = Number(o.frontDoorBottomInset ?? 0.05), $h = Number(o.frontDoorOffset ?? 0.01), _h = o.frontDoorColor ?? "rgba(0,0,0,0.55)", yi = Number(o.frontDoorOpacity ?? 0.9), vh = o.frontDoorFrameColor ?? "rgba(219,225,232,0.98)", Sh = o.frontDoorKnobColor ?? "rgba(236,198,111,0.95)", _t = o.faceColors ?? {
      front: "#faf5f5ff",
      right: "#d8d2d2ff",
      top: "#13a057",
      back: "#d8d2d2ff",
      left: "#d8d2d2ff",
      bottom: "#d8d2d2ff"
    }, wh = o.autoRotateEnabledDefault ?? !1, Ys = Number(F == null ? void 0 : F.auto_rotate_speed);
    let Ve = Number(o.autoRotateSpeed ?? 10);
    (bt && Number.isFinite(Ys) || (o.autoRotateSpeed === void 0 || o.autoRotateSpeed === null || o.autoRotateSpeed === "") && Number.isFinite(Ys)) && (Ve = Ys);
    const Mt = Number(o.autoRotateIntervalMs ?? 50), Ga = Number(o.autoRotateTapDelayMs ?? 250), xh = o.autoRotateStopOnFullTurn ?? !0, Ua = Number(o.autoRotateTurnCount ?? 1), Rh = o.autoRotateShowFps ?? !0, Mh = Number(o.autoRotateFpsWindowMs ?? 1e3), Ch = o.autoRotateAdaptiveEnabled ?? !0, $i = Number(o.autoRotateAdaptiveMaxIntervalMs ?? 1e3), kh = Number(o.autoRotateAdaptiveStepMs ?? 10), Nh = Number(o.autoRotateAdaptiveCheckMs ?? 1e3), Eh = Number(o.autoRotateAdaptiveFpsThreshold ?? 0.8), Th = Number(o.autoRotateCalibrateMs ?? 2e3), Fh = Number(o.autoRotateCalibrateFactor ?? 0.85), _i = o.cssFpsDebugEnabled ?? !1, Ah = Number(o.cssFpsWindowMs ?? 1e3), Dh = Number(o.cssFpsUiUpdateMs ?? 500), Xs = o.cssFpsAutoLimitEnabled ?? !0, Bh = Number(o.cssFpsCalibrateMs ?? 2e3), Ph = Number(o.cssFpsLimitThreshold ?? 20), zh = Number(o.cssFpsLimitFactor ?? 0.5), Lh = Number(o.cssFpsLimitMin ?? 1), Wh = Number(o.cssFpsLimitMax ?? 30), Oh = o.cssFpsLimitTextEnabled ?? !0, vi = Number(o.cssFpsRotationStartBoost ?? 2);
    this._autoRotateSpeed = Ve, this._autoRotateIntervalMs = Mt, this._autoRotateTurnCount = Ua, this._autoRotateEnabled === void 0 && (this._autoRotateEnabled = wh), this._autoRotateOffsetDeg === void 0 && (this._autoRotateOffsetDeg = 0), this._autoRotateIntervalMsDynamic === void 0 && (this._autoRotateIntervalMsDynamic = Mt), this._autoRotateFpsSamples === void 0 && (this._autoRotateFpsSamples = []), this._autoRotateFps === void 0 && (this._autoRotateFps = 0), this._autoRotateCalibrated === void 0 && (this._autoRotateCalibrated = !1), this._autoRotateAccumDeg === void 0 && (this._autoRotateAccumDeg = 0), this._autoRotateTargetDeg === void 0 && (this._autoRotateTargetDeg = 0), this._cssFps === void 0 && (this._cssFps = 0), this._cssFpsLimit === void 0 && (this._cssFpsLimit = 0), this._cssPerfLimited === void 0 && (this._cssPerfLimited = !1), this._cssFpsAutoCalibrated === void 0 && (this._cssFpsAutoCalibrated = !1), this._cssFpsMeasured === void 0 && (this._cssFpsMeasured = 0), this._cssRecalibrateRequested === void 0 && (this._cssRecalibrateRequested = !1);
    const Qo = () => typeof performance < "u" && performance.now ? performance.now() : Date.now(), Si = Qo() / 1e3, Zs = (t, e = 0) => {
      const s = Math.max(1e-3, t);
      return -(((Si + e) % s + s) % s);
    }, Ks = (t, e = 0) => {
      const s = Math.max(1e-3, t);
      return -((e % s + s) % s);
    }, Js = () => {
      const t = Number(this._cssFpsLimit || 0);
      if (!(Xs && !!this._cssPerfLimited && t > 0)) return Mt;
      const s = Math.max(1, Number.isFinite(vi) ? vi : 2), n = Math.max(1, Math.round(t * s));
      return Math.max(Mt, Math.round(1e3 / n));
    };
    this._cssGlobalTimeSec === void 0 && (this._cssGlobalTimeSec = Qo() / 1e3);
    const wi = () => {
      this._cssGlobalTickTimer && (clearInterval(this._cssGlobalTickTimer), this._cssGlobalTickTimer = null), this._cssGlobalTickFps = 0;
    }, Ih = (t) => {
      const e = Math.max(1, Math.round(t));
      if (this._cssGlobalTickTimer && Number(this._cssGlobalTickFps || 0) === e) return;
      wi();
      const s = Math.max(1, Math.round(1e3 / e)), n = () => {
        var u, d;
        const i = Qo() / 1e3, r = Math.floor(i * e) / e;
        this._cssGlobalTimeSec = r;
        const h = (d = (u = this.renderRoot) == null ? void 0 : u.querySelector) == null ? void 0 : d.call(u, "svg.sv-scene");
        h && h.style.setProperty("--sv-global-time", r.toFixed(3));
      };
      n(), this._cssGlobalTickFps = e, this._cssGlobalTickTimer = setInterval(n, s);
    }, Vh = () => {
      this._cssFpsRaf && (cancelAnimationFrame(this._cssFpsRaf), this._cssFpsRaf = null), this._cssFpsSamples = [], this._cssFps = 0;
    }, Hh = () => {
      if (this._cssFpsRaf) return;
      this._cssFpsSamples = [], this._cssFpsUiLast = 0;
      const t = (e) => {
        const s = this._cssFpsSamples || [];
        s.push(e);
        const n = e - Ah;
        for (; s.length && s[0] < n; ) s.shift();
        if (this._cssFpsSamples = s, s.length >= 2) {
          const r = (s[s.length - 1] - s[0]) / 1e3;
          this._cssFps = r > 0 ? (s.length - 1) / r : 0;
        }
        const i = this._cssFpsUiLast || 0;
        e - i >= Dh && (this._cssFpsUiLast = e, this._updateTimerMS = Date.now(), this.requestUpdate()), this._cssFpsRaf = requestAnimationFrame(t);
      };
      this._cssFpsRaf = requestAnimationFrame(t);
    }, ja = () => {
      this._cssFpsCalibRaf && (cancelAnimationFrame(this._cssFpsCalibRaf), this._cssFpsCalibRaf = null), this._cssFpsAutoCalibrating = !1;
    }, Gh = () => {
      if (this._cssFpsAutoCalibrated || this._cssFpsAutoCalibrating) return;
      this._cssFpsAutoCalibrating = !0;
      const t = [];
      let e = 0;
      const s = (n) => {
        if (e || (e = n), t.push(n), n - e >= Bh) {
          ja();
          let i = 0;
          if (t.length >= 2) {
            const h = (t[t.length - 1] - t[0]) / 1e3;
            i = h > 0 ? (t.length - 1) / h : 0;
          }
          this._cssFpsMeasured = i;
          let r = 0;
          i > 0 && i < Ph && (i < 5 ? r = 1 : (r = Math.floor(i * zh), r = Math.min(Wh, Math.max(Lh, r)))), this._cssFpsLimit = r, this._cssPerfLimited = r > 0, this._cssFpsAutoCalibrated = !0, this._updateTimerMS = Date.now(), this.requestUpdate();
          return;
        }
        this._cssFpsCalibRaf = requestAnimationFrame(s);
      };
      this._cssFpsCalibRaf = requestAnimationFrame(s);
    }, xi = (t) => {
      const e = this._autoRotateFpsSamples || [];
      e.push(t);
      const s = t - Mh;
      for (; e.length && e[0] < s; ) e.shift();
      if (this._autoRotateFpsSamples = e, e.length >= 2) {
        const n = (e[e.length - 1] - e[0]) / 1e3;
        this._autoRotateFps = n > 0 ? (e.length - 1) / n : 0;
      }
    }, Ri = (t) => {
      if (!this._autoRotateCalibrated || !Ch) return;
      const e = this._autoRotateAdaptiveLastCheck || 0;
      if (t - e < Nh) return;
      this._autoRotateAdaptiveLastCheck = t;
      const s = 1e3 / this._autoRotateIntervalMsDynamic;
      if (this._autoRotateFps && this._autoRotateFps < s * Eh) {
        const n = Math.min(
          $i,
          this._autoRotateIntervalMsDynamic + kh
        );
        n !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = n, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
    }, Mi = (t) => {
      if (this._autoRotateCalibrated) return;
      const e = this._autoRotateCalibrateStart || t;
      if (this._autoRotateCalibrateStart = e, t - e < Th) return;
      const s = this._autoRotateFps || 0;
      if (s > 0) {
        const i = 1e3 / (s * Fh), r = Math.min(
          $i,
          Math.max(Js(), Math.round(i))
        );
        r !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = r, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
      this._autoRotateCalibrated = !0;
    }, qa = () => {
      this._autoRotateEnabled && (this._autoRotateLastTick = 0, this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = 0, this._autoRotateEnabled = !1, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null), this._autoRotateIntervalMsDynamic = Mt, this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._cssRecalibrateRequested = !0, this._updateTimerMS = Date.now(), this.requestUpdate());
    }, Uh = () => {
      this._autoRotateEnabled || (this._manualRotateEnabled && this._stopManualRotate(), this._autoRotateEnabled = !0, this._autoRotateLastTick = Qo(), this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = xh && Ua > 0 ? Ua * 360 : 0, this._autoRotateIntervalMsDynamic = Js(), this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._autoRotateTimer || (this._autoRotateTimer = setInterval(() => {
        const t = Qo();
        xi(t), Mi(t), Ri(t);
        const e = this._autoRotateLastTick || t, s = Math.max(0, t - e) / 1e3, n = Ve * s;
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + n, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + n, this._autoRotateLastTick = t, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
          qa();
          return;
        }
        this._updateTimerMS = Date.now(), this.requestUpdate();
      }, this._autoRotateIntervalMsDynamic), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic), this._updateTimerMS = Date.now(), this.requestUpdate());
    };
    if (this._autoRotateStop = qa, this._autoRotateStartFn = Uh, this._autoRotateHandlers || (this._autoRotateHandlers = !0, this._autoRotateLastTap = 0, this.addEventListener("pointerup", (t) => {
      var i;
      if ((t.composedPath ? t.composedPath() : []).some((r) => {
        var h, u;
        return (u = (h = r == null ? void 0 : r.classList) == null ? void 0 : h.contains) == null ? void 0 : u.call(h, "cam-btn");
      }) || t.button !== void 0 && t.button !== 0) return;
      const s = Date.now(), n = this._autoRotateLastTap || 0;
      if (s - n < Ga) {
        this._autoRotateLastTap = 0, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), (i = this._autoRotateStartFn) == null || i.call(this);
        return;
      }
      this._autoRotateLastTap = s, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), this._autoRotateClickTimer = setTimeout(() => {
        var r;
        this._autoRotateLastTap && Date.now() - this._autoRotateLastTap >= Ga && (this._autoRotateLastTap = 0, (r = this._autoRotateStop) == null || r.call(this));
      }, Ga + 10);
    }, { capture: !1 })), this._autoRotateEnabled) {
      const t = Js();
      Number(this._autoRotateIntervalMsDynamic || Mt) < t && (this._autoRotateIntervalMsDynamic = t, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null)), (!this._autoRotateTimer || this._autoRotateTimerMs !== this._autoRotateIntervalMsDynamic) && (this._autoRotateTimer && clearInterval(this._autoRotateTimer), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic, this._autoRotateTimer = setInterval(() => {
        const e = Qo();
        xi(e), Mi(e), Ri(e);
        const s = this._autoRotateLastTick || e, n = Math.max(0, e - s) / 1e3, i = Ve * n;
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + i, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + i, this._autoRotateLastTick = e, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
          qa();
          return;
        }
        this._updateTimerMS = Date.now(), this.requestUpdate();
      }, this._autoRotateIntervalMsDynamic));
    } else this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null);
    _i ? Hh() : Vh();
    const Ci = !!(this._autoRotateEnabled || this._manualRotateEnabled);
    Xs && this._cssRecalibrateRequested && !Ci && (ja(), this._cssFpsAutoCalibrated = !1, this._cssFpsMeasured = 0, this._cssRecalibrateRequested = !1), Xs ? Gh() : (ja(), this._cssFpsAutoCalibrated = !1, this._cssFpsMeasured = 0, this._cssFpsLimit = 0, this._cssPerfLimited = !1, this._cssRecalibrateRequested = !1);
    const ut = Xs && this._cssPerfLimited && Number(this._cssFpsLimit) > 0, co = ut ? Number(this._cssFpsLimit) : 0, Qs = ut && co <= 5, Ya = Hc && !Qs, Xa = bl && !(ut && co <= 1), jh = Js();
    this._rotationIntervalMsFloor = jh;
    const Za = Ci, qh = ut && Za;
    ut && !Za ? Ih(co) : wi();
    const ki = Number(((Ur = l.states[Ut]) == null ? void 0 : Ur.state) || 210), Ni = Number(((jr = l.states[eo]) == null ? void 0 : jr.state) || 35);
    let ta = ki, oa = Ni;
    const Ka = Number(this._cameraSavedBaseHOverride), Ja = Number(this._cameraSavedBaseVOverride);
    Number.isFinite(Ka) && (ta = Ka, Math.abs((ki - Ka + 540) % 360 - 180) < 0.25 && (this._cameraSavedBaseHOverride = void 0)), Number.isFinite(Ja) && (oa = Ja, Math.abs(Ni - Ja) < 0.25 && (this._cameraSavedBaseVOverride = void 0)), this._autoRotateCurrentDeg = this._autoRotateOffsetDeg || 0;
    const Ei = (ta + (this._autoRotateOffsetDeg || 0)) * Math.PI / 180;
    this._manualRotateBaseVDeg = oa;
    const Yh = Number(this._manualRotateVOffsetDeg || 0), Ro = Math.min(Math.max(oa + Yh, 0), 90);
    this._savedCameraH = this._normDeg(ta), this._savedCameraV = Math.max(0, Math.min(90, oa)), this._currentCameraH = this._normDeg(ta + Number(this._autoRotateOffsetDeg || 0)), this._currentCameraV = Ro;
    const Ti = Ro * Math.PI / 180, He = 5, ea = Math.cos(Ei), sa = Math.sin(Ei), aa = Math.cos(Ti), na = -Math.sin(Ti), Fi = (wt || 0) * Math.PI / 180, Ai = Math.cos(Fi), Di = Math.sin(Fi), Xh = Math.PI * 2;
    function M(t, e, s) {
      return Math.min(s, Math.max(e, t));
    }
    function gt(t) {
      const e = Math.hypot(...t);
      return e > 0 ? t.map((s) => s / e) : [0, 0, 0];
    }
    function Zh(t, e) {
      return t[0] * e[0] + t[1] * e[1] + t[2] * e[2];
    }
    function G(t) {
      const e = t[0], s = t[1], n = t[2], i = e * ea - n * sa, r = e * sa + n * ea, h = s * aa - r * na, u = s * na + r * aa;
      return [i, h, u];
    }
    function Bi(t) {
      const e = t[0], s = t[1], n = t[2], i = s * aa + n * na, r = -s * na + n * aa, h = e * ea + r * sa, u = -e * sa + r * ea;
      return [h, i, u];
    }
    function ft(t) {
      const e = t[0], s = t[1], n = t[2], i = e * Ai + n * Di, r = -e * Di + n * Ai;
      return [i, s, r];
    }
    function ia(t) {
      return G(ft(t));
    }
    function U(t) {
      const e = t[0], s = t[1], n = t[2], i = He / (He + n);
      return [oo + e * Tt * i, bo - s * Tt * i, n, i];
    }
    function Ct(t, e) {
      const s = parseInt(t.substr(1, 2), 16), n = parseInt(t.substr(3, 2), 16), i = parseInt(t.substr(5, 2), 16), r = Math.min(255, Math.max(0, Math.round(s * e))), h = Math.min(255, Math.max(0, Math.round(n * e))), u = Math.min(255, Math.max(0, Math.round(i * e)));
      return `rgb(${r},${h},${u})`;
    }
    function ra(t, e, s, n) {
      const i = gt([s[0] - e[0], s[1] - e[1], s[2] - e[2]]), r = [t[0] - e[0], t[1] - e[1], t[2] - e[2]], h = Math.cos(n), u = Math.sin(n), d = [
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
    function Kh(t, e, s) {
      const n = [e[0] - t[0], e[1] - t[1], e[2] - t[2]], i = [s[0] - t[0], s[1] - t[1], s[2] - t[2]];
      return gt([
        n[1] * i[2] - n[2] * i[1],
        n[2] * i[0] - n[0] * i[2],
        n[0] * i[1] - n[1] * i[0]
      ]);
    }
    function Mo(t) {
      return t.reduce((e, s) => e + s[2], 0) / t.length;
    }
    function Pi(t) {
      const e = Number(t);
      return Number.isFinite(e) ? `${Math.round(e)}%` : "0%";
    }
    function Qa(t) {
      let e = 0;
      for (let s = 0; s < t.length; s++) {
        const n = (s + 1) % t.length;
        e += t[s][0] * t[n][1] - t[n][0] * t[s][1];
      }
      return e;
    }
    function Jh(t, e) {
      if (!t.length || e.length < 3) return [];
      const n = Qa(e) > 0, i = (u, d, f) => {
        const p = (f[0] - d[0]) * (u[1] - d[1]) - (f[1] - d[1]) * (u[0] - d[0]);
        return n ? p >= 0 : p <= 0;
      }, r = (u, d, f, p) => {
        const m = u[0], b = u[1], g = d[0], y = d[1], x = f[0], E = f[1], T = p[0], B = p[1], z = (m - g) * (E - B) - (b - y) * (x - T);
        if (Math.abs(z) < 1e-6) return d;
        const I = ((m * y - b * g) * (x - T) - (m - g) * (x * B - E * T)) / z, C = ((m * y - b * g) * (E - B) - (b - y) * (x * B - E * T)) / z;
        return [I, C];
      };
      let h = t.slice();
      for (let u = 0; u < e.length; u++) {
        const d = e[u], f = e[(u + 1) % e.length], p = h.slice();
        if (h = [], !p.length) break;
        for (let m = 0; m < p.length; m++) {
          const b = p[m], g = p[(m - 1 + p.length) % p.length], y = i(b, d, f), x = i(g, d, f);
          y ? (x || h.push(r(g, b, d, f)), h.push(b)) : x && h.push(r(g, b, d, f));
        }
      }
      return h;
    }
    function zi(t, e, s, n) {
      return n > 0 && (t = -t, e = -e, s = -s, n = -n), t * n - e * s < 0 && (t = -t, e = -e), t < 0 && (t = -t, e = -e, s = -s, n = -n), { bx: t, by: e, ux: s, uy: n };
    }
    function Li(t, e, s, n) {
      return t * n - e * s < 0 && (s = -s, n = -n), { bx: t, by: e, ux: s, uy: n };
    }
    function Wi(t, e, s, n, i = !0) {
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
      let y = i ? zi(d, f, m, b) : Li(d, f, m, b);
      if (n) {
        const x = U(G([
          t[0] + n[0],
          t[1] + n[1],
          t[2] + n[2]
        ]));
        let E = x[0] - r[0], T = x[1] - r[1], B = Math.hypot(E, T);
        B > 1e-6 && (E /= B, T /= B, y.bx * E + y.by * T < 0 && (y = i ? zi(-y.bx, -y.by, -y.ux, -y.uy) : Li(-y.bx, -y.by, -y.ux, -y.uy)));
      }
      return { basis: y, centerScr: r };
    }
    function Qh(t, e) {
      const s = t[0][0], n = t[0][1], i = t[1][0], r = t[1][1], h = t[2][0], u = t[2][1], d = e[0][0], f = e[0][1], p = e[1][0], m = e[1][1], b = e[2][0], g = e[2][1], y = s * (r - u) + i * (u - n) + h * (n - r);
      if (Math.abs(y) < 1e-6) return null;
      const x = (d * (r - u) + p * (u - n) + b * (n - r)) / y, E = (f * (r - u) + m * (u - n) + g * (n - r)) / y, T = (d * (h - i) + p * (s - h) + b * (i - s)) / y, B = (f * (h - i) + m * (s - h) + g * (i - s)) / y, z = (d * (i * u - h * r) + p * (h * n - s * u) + b * (s * r - i * n)) / y, I = (f * (i * u - h * r) + m * (h * n - s * u) + g * (s * r - i * n)) / y;
      return { a: x, b: E, c: T, d: B, e: z, f: I };
    }
    function tu(t) {
      const e = [0, 1, 0], s = [
        e[1] * t[2] - e[2] * t[1],
        e[2] * t[0] - e[0] * t[2],
        e[0] * t[1] - e[1] * t[0]
      ];
      return gt(s);
    }
    function Oi(t) {
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
    function ou(t, e, s, n, i) {
      if (t.length === 0) return t;
      const r = (f, p, m) => {
        const b = [];
        for (let g = 0; g < f.length; g++) {
          const y = f[g], x = f[(g + 1) % f.length], E = p(y), T = p(x);
          E && T ? b.push(x) : E && !T ? b.push(m(y, x)) : !E && T && (b.push(m(y, x)), b.push(x));
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
    function eu(t) {
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
    const te = Wt * Math.PI / 180, tn = et * Math.PI / 180, Ot = gt([
      Math.cos(tn) * Math.sin(te),
      Math.sin(tn),
      Math.cos(tn) * Math.cos(te)
    ]), on = M(et * Ss + vs, -89.9, 89.9) * Math.PI / 180, en = gt([
      Math.cos(on) * Math.sin(te),
      Math.sin(on),
      Math.cos(on) * Math.cos(te)
    ]);
    G(Ot);
    const vt = Ot[1] > 0.01, Ii = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ], qt = Ii.map(ft), Ge = qt.map(G), Yt = Ge.map(U), su = [
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
    }, Ue = {
      front: bs,
      right: gs,
      back: ys,
      left: $s
    }, je = (t) => {
      if (!Xc) return 1;
      const e = M(Zc, 0, 1), s = M(Kc, 1, 100), i = M(Number.isFinite(t) ? t : 0, 0, s) / s, r = Math.max(1e-3, Jc), h = Math.log(1 + r * i) / Math.log(1 + r);
      return e + (1 - e) * h;
    }, lo = {
      front: je(Ue.front),
      right: je(Ue.right),
      back: je(Ue.back),
      left: je(Ue.left)
    }, At = je(ve), au = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    }, ct = [
      [-1, 1, -1],
      [1, 1, -1],
      [1, 1, 1],
      [-1, 1, 1]
    ], an = M(no, 0, ws), Co = vo && an > 0.01;
    let K = ct;
    if (Co) {
      const t = an * Math.PI / 180;
      let e = [-1, 1, 1], s = [1, 1, 1], n = 1;
      H === "front" && (e = [-1, 1, 1], s = [1, 1, 1], n = 1), H === "back" && (e = [-1, 1, -1], s = [1, 1, -1], n = -1), H === "left" && (e = [-1, 1, -1], s = [-1, 1, 1], n = 1), H === "right" && (e = [1, 1, -1], s = [1, 1, 1], n = -1);
      const i = t * n;
      K = ct.map((r) => ra(r, e, s, i));
    }
    const qe = K.map(ft), Hi = qe.map(G), ca = Hi.map(U);
    let nn = Kh(K[0], K[1], K[2]);
    nn[1] < 0 && (nn = nn.map((t) => -t));
    const Gi = Qa(ca), la = Gi < 0;
    Rt ? this._roofWindingFront = la : this._roofWindingFront === void 0 ? this._roofWindingFront = la : Math.abs(Gi) > 20 && (this._roofWindingFront = la);
    const ho = Rt ? la : this._roofWindingFront;
    let rn = null;
    const Ye = (t, e) => /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t) ? Ct(t, e) : t;
    let Ui = !1, cn = !0, ha = !1;
    const Xt = [];
    if (Rt) {
      const t = Math.max(0, Rs), e = Math.max(0, Cs), s = Math.max(0.01, Ms), n = 1 + e, i = n + s;
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
      if (Co) {
        const C = an * Math.PI / 180;
        let _ = [-1, n, 1], R = [1, n, 1], L = 1;
        H === "front" && (_ = [-1, n, 1], R = [1, n, 1], L = 1), H === "back" && (_ = [-1, n, -1], R = [1, n, -1], L = -1), H === "left" && (_ = [-1, n, -1], R = [-1, n, 1], L = 1), H === "right" && (_ = [1, n, -1], R = [1, n, 1], L = -1);
        const A = C * L;
        r = r.map((j) => ra(j, _, R, A)), h = h.map((j) => ra(j, _, R, A)), u = u.map((j) => ra(j, _, R, A));
      }
      const d = r.map(ft), f = h.map(ft);
      rn = d;
      const p = d.map((C) => G(C)), m = f.map((C) => G(C)), b = p.map((C) => U(C)), g = m.map((C) => U(C)), y = Mo(g) - Mo(b);
      this._flatRoofBottomCloser === void 0 ? this._flatRoofBottomCloser = y < 0 : y < -0.01 ? this._flatRoofBottomCloser = !0 : y > 0.01 && (this._flatRoofBottomCloser = !1), Ui = !!this._flatRoofBottomCloser;
      const x = Ye(xe, At);
      Xt.push({
        type: "flatRoofTop",
        pts: b,
        z: Mo(b) - ke,
        fill: x,
        opacity: Ce
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
      ], T = [...p, ...m].reduce((C, _) => [C[0] + _[0], C[1] + _[1], C[2] + _[2]], [0, 0, 0]).map((C) => C / 8);
      E.forEach((C) => {
        const _ = lo[C.id] ?? At, R = M(_, 0.2, 1), L = Math.min(...C.pts.map((lt) => lt[2])), A = C.cam.reduce((lt, Gt) => [lt[0] + Gt[0], lt[1] + Gt[1], lt[2] + Gt[2]], [0, 0, 0]).map((lt) => lt / 4), j = gt([A[0] - T[0], A[1] - T[1], A[2] - T[2]]), st = gt([-A[0], -A[1], -He - A[2]]);
        Zh(j, st) > -0.02 && Xt.push({
          type: `flatRoofEdge-${C.id}`,
          pts: C.pts,
          z: L - Ne,
          fill: Ye(xe, R),
          opacity: Zo
        });
      });
      const B = lo[H] ?? At;
      if (Xt.push({
        type: "flatRoofBottom",
        pts: g,
        z: Mo(g),
        fill: Ye(Re, Math.max(0.2, B * Me * si)),
        opacity: Zo
      }), Co) {
        const _ = u.map(ft).map((j) => U(G(j))), R = [Yt[3], Yt[2], Yt[6], Yt[7]], L = (j) => {
          const st = lo[j] ?? 1;
          return Ye(Re, M(st * Me, 0.2, 1));
        }, A = (j, st, pt) => {
          const lt = Math.max(...st.map((Gt) => Gt[2]));
          Xt.push({
            type: pt,
            pts: st,
            // Keep connector skirts behind the roof overhang edges at corner views.
            z: lt + Math.max(ks, 0.02),
            fill: L(j),
            opacity: za
          });
        };
        H === "front" ? (A("left", [_[0], R[0], _[3]], "flatRoofSkirt-left"), A("right", [_[1], R[1], _[2]], "flatRoofSkirt-right"), A("back", [_[0], _[1], R[1], R[0]], "flatRoofSkirt-back")) : H === "back" ? (A("left", [_[3], R[3], _[0]], "flatRoofSkirt-left"), A("right", [_[2], R[2], _[1]], "flatRoofSkirt-right"), A("front", [_[2], _[3], R[3], R[2]], "flatRoofSkirt-front")) : H === "left" ? (A("front", [_[2], R[2], _[3]], "flatRoofSkirt-front"), A("back", [_[1], R[1], _[0]], "flatRoofSkirt-back"), A("right", [_[1], _[2], R[2], R[1]], "flatRoofSkirt-right")) : H === "right" && (A("front", [_[3], R[3], _[2]], "flatRoofSkirt-front"), A("back", [_[0], R[0], _[1]], "flatRoofSkirt-back"), A("left", [_[0], _[3], R[3], R[0]], "flatRoofSkirt-left")), e > 1e-3 && (H === "front" ? A("front", [_[3], _[2], R[2], R[3]], "flatRoofSkirt-front-low") : H === "back" ? A("back", [_[0], _[1], R[1], R[0]], "flatRoofSkirt-back-low") : H === "left" ? A("left", [_[0], _[3], R[3], R[0]], "flatRoofSkirt-left-low") : H === "right" && A("right", [_[1], _[2], R[2], R[1]], "flatRoofSkirt-right-low"));
      }
      const z = Xt.find((C) => C.type === "flatRoofTop"), I = Xt.find((C) => C.type === "flatRoofBottom");
      if (ha = Ui || !ho, cn = !ha, z && I && (ha ? (z.opacity = 0, I.opacity = Zo) : (z.opacity = Ce, I.opacity = 0)), z && cn) {
        const C = Xt.filter((_) => _ !== z);
        if (C.length) {
          const _ = Math.min(...C.map((R) => R.z));
          z.z = Math.min(z.z, _ - Math.max(0.015, ke));
        }
      }
      if (I && ha) {
        const C = Xt.filter((_) => _ !== I);
        if (C.length) {
          const _ = Math.max(...C.map((R) => R.z));
          I.z = Math.max(I.z, _ + Math.max(0.02, Ne));
        }
      }
    }
    const ln = Rt ? cn : ho;
    let Xe = [];
    Co && Dl && (H === "front" ? Xe = [
      { tri: [K[0], ct[0], K[3]], wall: "left" },
      { tri: [K[1], ct[1], K[2]], wall: "right" }
    ] : H === "back" ? Xe = [
      { tri: [K[3], ct[3], K[0]], wall: "left" },
      { tri: [K[2], ct[2], K[1]], wall: "right" }
    ] : H === "left" ? Xe = [
      { tri: [K[2], ct[2], K[3]], wall: "front" },
      { tri: [K[1], ct[1], K[0]], wall: "back" }
    ] : H === "right" && (Xe = [
      { tri: [K[3], ct[3], K[2]], wall: "front" },
      { tri: [K[0], ct[0], K[1]], wall: "back" }
    ]));
    const nu = Xe.map((t) => ({
      pts: t.tri.map((e) => U(ia(e))),
      wall: t.wall
    })), hn = (t) => {
      const e = lo[t] ?? At, s = _t[t] ?? _t.top;
      return Ct(s, Bl * e);
    }, iu = lo[H] ?? At, ru = _t[H] ?? _t.top, cu = Ct(ru, si * iu), lu = Ct(_t.top, At);
    let oe = null, ee = null;
    Co && Pl && (H === "front" ? (oe = [K[0], K[1], ct[1], ct[0]], ee = "back") : H === "back" ? (oe = [K[2], K[3], ct[3], ct[2]], ee = "front") : H === "left" ? (oe = [K[1], K[2], ct[2], ct[1]], ee = "right") : H === "right" && (oe = [K[0], K[3], ct[3], ct[0]], ee = "left"));
    const un = oe ? oe.map((t) => U(ia(t))) : null, hu = hn(ee || H);
    let It = [0, 0, -1];
    H === "front" && (It = [0, 0, -1]), H === "back" && (It = [0, 0, 1]), H === "left" && (It = [1, 0, 0]), H === "right" && (It = [-1, 0, 0]);
    const se = K.reduce((t, e) => [t[0] + e[0], t[1] + e[1], t[2] + e[2]], [0, 0, 0]).map((t) => t / 4), ae = 2.2;
    U(ia([
      se[0] - It[0] * ae,
      se[1] - It[1] * ae,
      se[2] - It[2] * ae
    ])), U(ia([
      se[0] + It[0] * ae,
      se[1] + It[1] * ae,
      se[2] + It[2] * ae
    ]));
    const Z = -1, fn = -1, ji = [
      [-ot, Z, -ot],
      [ot, Z, -ot],
      [ot, Z, ot],
      [-ot, Z, ot]
    ].map(G).map(U);
    let dn = null;
    if (Ra) {
      const t = 1 + Math.max(0, Ec);
      dn = [0, 1, 5, 4].map((i) => {
        const r = qt[i];
        return [r[0] * t, Z, r[2] * t];
      }).map((i) => U(G(i))).map((i) => i[0] + "," + i[1]).join(" ");
    }
    const uu = Math.min(...ji.map((t) => t[1])), qi = M(uu - 6, tt * 0.32, tt * 0.82);
    this._skyClipBottom === void 0 || this._skyClipCardW !== J || this._skyClipCardH !== tt ? (this._skyClipBottom = qi, this._skyClipVertDeg = Ro, this._skyClipCardW = J, this._skyClipCardH = tt) : Math.abs(Ro - (this._skyClipVertDeg ?? Ro)) > 0.15 && (this._skyClipBottom = qi, this._skyClipVertDeg = Ro);
    const Ze = Number(this._skyClipBottom), ko = [
      en[0] * qo,
      en[1] * qo,
      en[2] * qo
    ], Yi = G(ko), it = U(Yi), fu = Ge.reduce((t, e) => t + e[2], 0) / Ge.length, du = Yi[2] > fu + 0.02, No = it[3], pu = Math.max(4, 12 * No), mu = Math.max(3, 8 * No), pn = M(ol - Ro / 90 * el, 0.1, 0.9), bu = M(pn - oi, 0, 1), gu = M(pn, 0, 1), yu = M(pn + oi, 0, 1), Zt = (t, e) => {
      const s = Array.isArray(t) ? t : e;
      return [
        M(Number((s == null ? void 0 : s[0]) ?? e[0]), 0, 255),
        M(Number((s == null ? void 0 : s[1]) ?? e[1]), 0, 255),
        M(Number((s == null ? void 0 : s[2]) ?? e[2]), 0, 255)
      ];
    }, ne = (t, e, s) => [
      Math.round(t[0] + (e[0] - t[0]) * s),
      Math.round(t[1] + (e[1] - t[1]) * s),
      Math.round(t[2] + (e[2] - t[2]) * s)
    ], Xi = Number(this._prevSunEl);
    let ie = Number(this._skyTrend);
    if (Number.isFinite(ie) || (ie = -1), Number.isFinite(Xi)) {
      const t = et - Xi;
      t < -0.03 ? ie = -1 : t > 0.03 && (ie = 1);
    }
    this._prevSunEl = et, this._skyTrend = ie;
    const mn = ie < 0, re = Math.max(1, il), bn = M((et + re) / (2 * re), 0, 1), $u = M(1 - Math.abs(et) / re, 0, 1), gn = Math.pow($u, 0.85), Ke = M((-et + 1.5) / (re + 5), 0, 1), ua = Oe ? M((-et - 1.2) / (re + 3), 0, 1) : 0, uo = Ba ? M((-et + 0.2) / (re + 2), 0, 1) : 0, _u = M(yl, 0.05, 0.95), vu = M($l, 0.05, 0.95), Eo = _u * J, To = vu * tt, Vt = M(_l, 6, 44), Su = M(vl, 0, 1), ce = M(uo * Sl, 0, 1), wu = M(Ml, 0.5, 89.5), Zi = (Cl + 180) * Math.PI / 180, yn = wu * Math.PI / 180, xu = gt([
      Math.sin(Zi) * Math.cos(yn),
      Math.sin(yn),
      -Math.cos(Zi) * Math.cos(yn)
    ]);
    let Ht = gt(Bi(xu));
    Ht[1] < 0.06 && (Ht = gt([Ht[0], 0.06, Ht[2]]));
    const Ru = Zt(sl, [120, 170, 220]), Mu = Zt(al, [255, 210, 150]), Cu = Zt(nl, [70, 80, 95]), ku = Zt(rl, [12, 20, 42]), Nu = Zt(cl, [32, 44, 82]), Eu = Zt(ll, [6, 10, 22]), Tu = Zt(mn ? dl : hl, [108, 128, 188]), Fu = Zt(mn ? pl : ul, [246, 146, 112]), Au = Zt(mn ? ml : fl, [84, 62, 84]), Du = ne(ku, Ru, bn), Bu = ne(Nu, Mu, bn), Pu = ne(Eu, Cu, bn), $n = ne(Du, Tu, gn * 0.82), zu = ne(Bu, Fu, gn * 0.95), Ki = ne(Pu, Au, gn * 0.68), St = ot * (1 - 0.05), fa = 64;
    let le = this._ringUnit;
    (!le || le.length !== fa) && (le = Array.from({ length: fa }, (t, e) => {
      const s = e / fa * Xh;
      return [Math.sin(s), Math.cos(s)];
    }), this._ringUnit = le);
    const Ji = Math.min(Ll, St * 0.3), Qi = St - Ji, Lu = St + Ji;
    function _n(t) {
      return le.map(([e, s]) => {
        const n = G([t * e, Z, t * s]), i = U(n);
        return i[0] + "," + i[1];
      });
    }
    const Wu = _n(Qi), Ou = _n(St), Iu = _n(Lu);
    let tr = [];
    ri && (tr = le.map(([t, e], s) => {
      const n = s % (fa / 4) === 0, i = n ? Gl : Hl, r = Qi, h = r - i, u = U(G([h * t, Z, h * e])), d = U(G([r * t, Z, r * e]));
      return { pIn: u, pOut: d, isMajor: n };
    }));
    const Vu = [["N", 0], ["E", Math.PI / 2], ["S", Math.PI], ["W", 3 * Math.PI / 2]], or = St * (1 - jl), Hu = Vu.map(([t, e]) => {
      const s = G([or * Math.sin(e), Z, or * Math.cos(e)]), n = U(s), i = M(n[3] * ql, Yl, Xl);
      return { t, x: n[0], y: n[1], scale: i };
    }), fo = gt([Math.sin(te), 0, Math.cos(te)]), da = gt([Ht[0], 0, Ht[2]]), Gu = G([fo[0] * St * 0.25, Z, fo[2] * St * 0.25]), Uu = G([fo[0] * St * 0.95, Z, fo[2] * St * 0.95]), Fo = U(Gu), Ao = U(Uu), ju = M(Fo[3] * ci, li, hi), vn = M(Ao[3] * ci, li, hi), qu = ui * ju, Yu = ui * vn, Do = Kl * vn, er = [
      { id: "front", label: "Front", normal: [0, 0, 1], pos: [0, Z, 1 + qs] },
      { id: "back", label: "Back", normal: [0, 0, -1], pos: [0, Z, -1 - qs] },
      { id: "right", label: "Right", normal: [1, 0, 0], pos: [1 + qs, Z, 0] },
      { id: "left", label: "Left", normal: [-1, 0, 0], pos: [-1 - qs, Z, 0] }
    ], Sn = {}, wn = {};
    er.forEach((t) => {
      const e = G(ft(t.normal));
      Sn[t.id] = e[2] < di;
      const s = sn[t.id];
      if (s) {
        const n = s.indices.map((r) => Yt[r]), i = Math.abs(Qa(n));
        wn[t.id] = e[2] < ch && i > lh;
      } else
        wn[t.id] = Sn[t.id];
    });
    let Je = null;
    const xn = Math.max(0.1, kl), sr = M((et + xn) / (2 * xn), 0, 1), Rn = Ot[1] > 0.01 ? Ot : gt([Ot[0], 0.01, Ot[2]]), Xu = et > -xn ? 1 : 0, Zu = Ie && uo > 0.03 && Ht[1] > 0.01 ? 1 : 0, ar = sr * Xu, nr = (1 - sr) * Zu, pa = ar + nr, Qe = pa > 1e-6 ? ar / pa : 0, he = pa > 1e-6 ? nr / pa : 0, Mn = Qe > 0 || he > 0 ? gt([
      Rn[0] * Qe + Ht[0] * he,
      Rn[1] * Qe + Ht[1] * he,
      Rn[2] * Qe + Ht[2] * he
    ]) : Ot;
    if (xa && (Qe > 0 || he > 0)) {
      const t = [-Mn[0], -Mn[1], -Mn[2]];
      if (Math.abs(t[1]) > 1e-6) {
        const e = [], s = Co ? qt.concat(qe) : qt;
        for (const i of s) {
          const r = (fn - i[1]) / t[1];
          r >= 0 && e.push({ x: i[0] + t[0] * r, z: i[2] + t[2] * r });
        }
        const n = Oi(e);
        if (n.length >= 3) {
          const i = M(Zn, 0, 0.2), r = ot * (1 - i), h = ou(n, -r, r, -r, r);
          h.length >= 3 && (Je = h.map((u) => U(G([u.x, fn, u.z]))));
        }
      }
    }
    const ir = Je ? Je.map((t) => t[0] + "," + t[1]).join(" ") : null;
    let ts = null, os = null;
    if (Ma && vt) {
      const e = Math.hypot(ot * 2, ot * 2) * Fc, s = [fo[0] * St * 0.95, Z, fo[2] * St * 0.95], n = [
        s[0] - fo[0] * e,
        Z,
        s[2] - fo[2] * e
      ], i = G(s), r = G(n);
      ts = U(i), os = U(r);
    }
    let es = null, ss = null;
    if (Ie && !vt && uo > 0.03) {
      const e = Math.hypot(ot * 2, ot * 2) * xl, s = [da[0] * St * 0.9, Z, da[2] * St * 0.9], n = [
        s[0] - da[0] * e,
        Z,
        s[2] - da[2] * e
      ];
      es = U(G(s)), ss = U(G(n));
    }
    const rr = `sv-beam-flow-${Math.round((Na + Ea) * 10)}`, cr = `sv-sun-ray-${Math.round((Ta + Fa) * 10)}`, lr = `sv-cloud-drift-${Math.round(J)}-${Math.round(tt)}`, Ku = Number(o.sunBeamRaySpacingPx ?? 40), Ju = Number(o.sunBeamRayMinSepPx ?? 16), Qu = Number(o.sunBeamSilhouetteMinRays ?? 3), tf = Number(o.sunBeamSilhouetteMaxRays ?? 7), hr = Co ? qt.concat(qe) : qt, ur = hr.map((t, e) => {
      const s = G(t), n = U(s);
      return { sourceIdx: e, x: n[0], y: n[1], zCam: s[2], world: t };
    }), yt = eu(
      ur
    ), ue = [], ma = (t, e, s, n = -1, i = [0, 0, 0]) => {
      const r = Math.max(1, Ju) ** 2;
      for (const h of ue) {
        const u = h.x - t, d = h.y - e;
        if (u * u + d * d < r) return;
      }
      ue.push({ x: t, y: e, zCam: s, sourceIdx: n, world: i });
    };
    if (yt.length >= 2) {
      let t = 0;
      for (let s = 0; s < yt.length; s++) {
        const n = (s + 1) % yt.length;
        t += yt[s].x * yt[n].y - yt[n].x * yt[s].y;
      }
      const e = t > 0;
      for (let s = 0; s < yt.length; s++) {
        const n = yt[s], i = yt[(s + 1) % yt.length], r = i.x - n.x, h = i.y - n.y, u = Math.hypot(r, h);
        if (u < 1e-3) continue;
        const d = (n.x + i.x) * 0.5, f = (n.y + i.y) * 0.5;
        let p = e ? h : -h, m = e ? -r : r;
        const b = Math.hypot(p, m) || 1;
        p /= b, m /= b;
        const g = it[0] - d, y = it[1] - f;
        if (!(p * g + m * y > 0)) continue;
        ma(n.x, n.y, n.zCam, n.sourceIdx, n.world), ma(i.x, i.y, i.zCam, i.sourceIdx, i.world);
        const E = Math.max(8, Ku), T = Math.max(1, Math.min(4, Math.round(u / E)));
        for (let B = 0; B < T; B++) {
          const z = (B + 1) / (T + 1), I = [
            n.world[0] + (i.world[0] - n.world[0]) * z,
            n.world[1] + (i.world[1] - n.world[1]) * z,
            n.world[2] + (i.world[2] - n.world[2]) * z
          ], C = G(I), _ = U(C);
          ma(_[0], _[1], C[2], -1, I);
        }
      }
    }
    !ue.length && yt.length && yt.forEach((t) => ma(t.x, t.y, t.zCam, t.sourceIdx, t.world)), ue.length > 1 && ue.sort((t, e) => {
      const s = Math.atan2(t.y - it[1], t.x - it[0]), n = Math.atan2(e.y - it[1], e.x - it[0]);
      return s - n;
    });
    const fr = (t, e) => {
      if (t.length <= e) return t.slice();
      if (e <= 1) return [t[Math.floor(t.length / 2)]];
      const s = [];
      for (let n = 0; n < e; n++) {
        const i = Math.round(n * (t.length - 1) / (e - 1));
        s.push(t[i]);
      }
      return s;
    }, as = Math.max(1, Math.floor(Qu)), dr = Math.max(as, Math.floor(tf));
    let Dt = ue.slice();
    if (Dt.length > dr && (Dt = fr(Dt, dr)), Dt.length < as) {
      const t = yt.map((e) => ({ x: e.x, y: e.y, zCam: e.zCam, sourceIdx: e.sourceIdx, world: e.world }));
      if (t.length >= as)
        Dt = fr(t, as);
      else if (t.length > 0)
        for (; Dt.length < as; ) {
          const e = t[Dt.length % t.length];
          Dt.push({ x: e.x, y: e.y, zCam: e.zCam, sourceIdx: e.sourceIdx, world: e.world });
        }
    }
    Dt.length || [2, 3, 6, 7].forEach((t) => {
      const e = Yt[t], s = Ge[t];
      Dt.push({ x: e[0], y: e[1], zCam: s[2], sourceIdx: t, world: qt[t] });
    });
    const Cn = /* @__PURE__ */ new Set();
    if (vt) {
      const t = [-Ot[0], -Ot[1], -Ot[2]];
      if (Math.abs(t[1]) > 1e-6) {
        const e = hr.map((s, n) => {
          const i = (fn - s[1]) / t[1];
          return i < 0 ? null : { sourceIdx: n, x: s[0] + t[0] * i, z: s[2] + t[2] * i };
        }).filter((s) => !!s);
        if (e.length >= 3) {
          const s = Oi(e.map((i) => ({ x: i.x, z: i.z }))), n = 1e-4;
          e.forEach((i) => {
            s.some((r) => Math.abs(r.x - i.x) <= n && Math.abs(r.z - i.z) <= n) && Cn.add(i.sourceIdx);
          });
        }
      }
    }
    const pr = ((t) => {
      const e = [], s = /* @__PURE__ */ new Set();
      return t.forEach((n) => {
        const i = `${Math.round(n.x)},${Math.round(n.y)}`;
        s.has(i) || (s.add(i), e.push(n));
      }), e;
    })(
      ur.filter((t) => Cn.has(t.sourceIdx)).map((t) => ({ x: t.x, y: t.y, zCam: t.zCam, sourceIdx: t.sourceIdx, world: t.world }))
    ), kn = pr.length ? pr : Dt, Nn = /* @__PURE__ */ new Map(), mr = (t, e, s, n, i) => {
      const r = `${Math.round(e)},${Math.round(s)}`;
      Nn.has(r) || Nn.set(r, { x: e, y: s, zCam: n, sourceIdx: t, world: i });
    };
    Object.entries(sn).forEach(([t, e]) => {
      G(ft(Vi[t]))[2] >= di || e.indices.forEach((n) => {
        mr(n, Yt[n][0], Yt[n][1], Ge[n][2], qt[n]);
      });
    }), ho && ca.forEach((t, e) => {
      const s = qt.length + e;
      mr(s, t[0], t[1], Hi[e][2], qe[e]);
    });
    let En = Array.from(Nn.values()).filter(
      (t) => Cn.has(t.sourceIdx)
    );
    if (!En.length && kn.length) {
      const t = kn.slice().sort((e, s) => e.zCam - s.zCam);
      En = t.slice(0, Math.min(3, t.length));
    }
    function of(t, e) {
      const s = t.length;
      if (s < 3) return "";
      let n = "";
      for (let i = 0; i < s; i++) {
        const r = t[(i - 1 + s) % s], h = t[i], u = t[(i + 1) % s], d = [r[0] - h[0], r[1] - h[1]], f = [u[0] - h[0], u[1] - h[1]], p = Math.hypot(d[0], d[1]), m = Math.hypot(f[0], f[1]);
        if (p === 0 || m === 0) continue;
        const b = Math.min(e, p / 2, m / 2), g = [d[0] / p, d[1] / p], y = [f[0] / m, f[1] / m], x = [h[0] + g[0] * b, h[1] + g[1] * b], E = [h[0] + y[0] * b, h[1] + y[1] * b];
        i === 0 ? n += `M ${x[0]} ${x[1]}` : n += ` L ${x[0]} ${x[1]}`, n += ` Q ${h[0]} ${h[1]} ${E[0]} ${E[1]}`;
      }
      return n + " Z";
    }
    const fe = ji.map((t) => [t[0], t[1]]), ba = of(fe, Ho);
    function ef(t, e, s = 8) {
      const n = t.length;
      if (n < 3) return t.slice();
      const i = [];
      for (let r = 0; r < n; r++) {
        const h = t[(r - 1 + n) % n], u = t[r], d = t[(r + 1) % n], f = [h[0] - u[0], h[1] - u[1]], p = [d[0] - u[0], d[1] - u[1]], m = Math.hypot(f[0], f[1]), b = Math.hypot(p[0], p[1]);
        if (m === 0 || b === 0) continue;
        const g = Math.min(e, m / 2, b / 2), y = [f[0] / m, f[1] / m], x = [p[0] / b, p[1] / b], E = [u[0] + y[0] * g, u[1] + y[1] * g], T = [u[0] + x[0] * g, u[1] + x[1] * g];
        i.length, i.push(E);
        for (let B = 1; B <= s; B++) {
          const z = B / s, I = 1 - z;
          i.push([
            I * I * E[0] + 2 * I * z * u[0] + z * z * T[0],
            I * I * E[1] + 2 * I * z * u[1] + z * z * T[1]
          ]);
        }
      }
      return i;
    }
    const ns = ef(fe, Ho, 8), br = ns.map((t) => [t[0], t[1] + go]), gr = [];
    for (let t = 0; t < ns.length; t++) {
      const e = (t + 1) % ns.length;
      gr.push([
        ns[t],
        ns[e],
        br[e],
        br[t]
      ]);
    }
    const Tn = M(Zn, 0, 0.2), ga = fe.reduce((t, e) => [t[0] + e[0], t[1] + e[1]], [0, 0]).map((t) => t / fe.length), sf = Tn > 0 ? fe.map((t) => [
      ga[0] + (t[0] - ga[0]) * (1 - Tn),
      ga[1] + (t[1] - ga[1]) * (1 - Tn)
    ]) : fe, dt = [];
    if (ti && dt.push(`<linearGradient id="horizon-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgb(${$n.join(",")})"/>
        <stop offset="${(bu * 100).toFixed(2)}%" stop-color="rgb(${$n.join(",")})"/>
        <stop offset="${(gu * 100).toFixed(2)}%" stop-color="rgb(${zu.join(",")})"/>
        <stop offset="${(yu * 100).toFixed(2)}%" stop-color="rgb(${Ki.join(",")})"/>
        <stop offset="100%" stop-color="rgb(${Ki.join(",")})"/>
      </linearGradient>`), (We || Oe && ua > 0.01 || Ba && uo > 0.03) && dt.push(`<clipPath id="sky-cloud-clip"><rect x="0" y="0" width="${J}" height="${Ze}"/></clipPath>`), We && dt.push(`<filter id="sky-cloud-blur" x="-30%" y="-40%" width="160%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Math.max(0, qc)}"/>
      </filter>`), dt.push(`<radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,200,0.85)"/>
      <stop offset="70%" stop-color="rgba(255,255,150,0.35)"/>
      <stop offset="100%" stop-color="rgba(255,255,100,0)"/>
    </radialGradient>`), dt.push(`<linearGradient id="ceiling-grad" x1="0" y1="1" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${Ct(_t.top, Qc * At)}"/>
      <stop offset="100%" stop-color="${Ct(_t.top, tl * At)}"/>
    </linearGradient>`), yo && mt > 1e-3 && dt.push(`<linearGradient id="floor-grass-grad" x1="0" y1="0.1" x2="1" y2="0.95" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="${$o}" stop-opacity="${M(mt * 0.55, 0, 1)}"/>
        <stop offset="55%" stop-color="${zt}" stop-opacity="${M(mt, 0, 1)}"/>
        <stop offset="100%" stop-color="${$o}" stop-opacity="${M(mt * 0.42, 0, 1)}"/>
      </linearGradient>`), xa && ir && (dt.push(`<filter id="shadow-blur-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Rc}"/>
      </filter>`), dt.push(`<filter id="shadow-blur-contact" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Cc}"/>
      </filter>`)), Ra && dt.push(`<filter id="base-anchor-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Nc}"/>
      </filter>`), fi && dt.push(`<filter id="floor-pointer-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Jl}"/>
      </filter>`), Le && dt.push(`<filter id="back-tree-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Os}"/>
      </filter>`), Ma && vt && ts && os && dt.push(`<linearGradient id="sunlight-grad" x1="${ts[0]}" y1="${ts[1]}"
                  x2="${os[0]}" y2="${os[1]}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="rgb(${Ca.join(",")})" stop-opacity="${Kn}"/>
          <stop offset="55%" stop-color="rgb(${Ca.join(",")})" stop-opacity="${Kn * 0.45}"/>
          <stop offset="100%" stop-color="rgb(${Ca.join(",")})" stop-opacity="0"/>
        </linearGradient>`), Ie && !vt && es && ss) {
      const t = Array.isArray(js) ? js : [178, 208, 255], e = M(wl * uo, 0, 1);
      dt.push(`<linearGradient id="moonlight-grad" x1="${es[0]}" y1="${es[1]}"
                  x2="${ss[0]}" y2="${ss[1]}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="rgb(${t.join(",")})" stop-opacity="${e}"/>
          <stop offset="60%" stop-color="rgb(${t.join(",")})" stop-opacity="${e * 0.35}"/>
          <stop offset="100%" stop-color="rgb(${t.join(",")})" stop-opacity="0"/>
        </linearGradient>`);
    }
    ei && dt.push(`<radialGradient id="vignette" cx="50%" cy="50%" r="${El}">
        <stop offset="0%" stop-color="rgb(${Pa.join(",")})" stop-opacity="0"/>
        <stop offset="${(Tl * 100).toFixed(1)}%" stop-color="rgb(${Pa.join(",")})" stop-opacity="0"/>
        <stop offset="100%" stop-color="rgb(${Pa.join(",")})" stop-opacity="${Nl}"/>
      </radialGradient>`);
    const Bo = [];
    if (ka && vt && Bo.push(`
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
      `), We) {
      const e = J + 140;
      Bo.push(`
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
    Ya && Bo.push(`
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
    const yr = `sv-star-twinkle-${Math.round(J)}-${Math.round(tt)}`;
    Oe && Xa && Bo.push(`
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
      `), (ka || We || Ya || Oe && Xa) && Bo.push(`
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
      `), Bo.length && dt.push(`<style><![CDATA[
        ${Bo.join(`
`)}
        @media (prefers-reduced-motion: reduce) {
          .sv-beam-flow, .sv-sun-ray { animation: none !important; }
        }
      ]]></style>`);
    const $ = [], af = `${ut ? "sv-css-limit sv-css-global " : ""}${qh ? "sv-css-pause " : ""}sv-scene`.trim(), nf = Number(this._cssGlobalTimeSec || 0);
    if ($.push(`<svg class="${af}" style="--sv-global-time:${nf.toFixed(3)}" viewBox="0 0 ${J} ${tt}" width="${Et}" height="${to}" preserveAspectRatio="xMidYMid meet"><defs>${dt.join("")}</defs>`), ti && $.push(`<rect x="0" y="0" width="${J}" height="${tt}" fill="url(#horizon-grad)"/>`), Oe && ua > 0.01 && Us > 0) {
      let t = this._skyStars;
      if (!Array.isArray(t) || t.length !== Us) {
        let s = 2166136261 ^ Math.round(J * 13 + tt * 17 + Us * 31);
        const n = () => (s ^= s << 13, s >>>= 0, s ^= s >> 17, s >>>= 0, s ^= s << 5, s >>>= 0, (s >>> 0) / 4294967295);
        t = Array.from({ length: Us }, () => ({
          x: 0.04 + n() * 0.92,
          y: 0.06 + n() * 0.86,
          r: 0.55 + n() * 1.25,
          a: 0.35 + n() * 0.65,
          dur: 1.2 + n() * 2.2,
          phase: n() * 2.2
        })), this._skyStars = t;
      }
      const e = Ze * 0.97;
      $.push('<g clip-path="url(#sky-cloud-clip)">'), t.forEach((s) => {
        const n = s.x * J, i = s.y * e, r = s.r * (0.85 + ua * 0.35), h = M(ua * gl * s.a, 0, 1);
        if (Xa) {
          const u = Math.max(1.2, Number(s.dur)), d = Number(s.phase) || 0, f = ut ? Ks(u, d) : Zs(u, d), p = ut ? Math.max(1, Math.round(u * co)) : 0;
          $.push(`<circle class="sv-star" cx="${n}" cy="${i}" r="${r}"
            fill="rgba(242,246,255,0.98)"
            style="--star-op:${h};animation-duration:${u.toFixed(2)}s;--sv-phase-delay:${f.toFixed(3)}s;animation-delay:${f.toFixed(3)}s;--sv-steps:${p}"/>`);
        } else
          $.push(`<circle cx="${n}" cy="${i}" r="${r}" fill="rgba(242,246,255,${h})"/>`);
      }), $.push("</g>");
    }
    if (Ba && uo > 0.03) {
      const t = Vt * (Su * 2), e = `rgb(${$n.join(",")})`, s = `moon-disc-clip-${Math.round(Eo)}-${Math.round(To)}-${Math.round(Vt)}`;
      $.push(`<defs><clipPath id="${s}"><circle cx="${Eo}" cy="${To}" r="${Vt}"/></clipPath></defs>`), $.push(`<circle cx="${Eo}" cy="${To}" r="${Vt * 1.25}" fill="rgba(196,206,255,${ce * 0.22})"/>`), $.push(`<g clip-path="url(#${s})">`), $.push(`<circle cx="${Eo}" cy="${To}" r="${Vt}" fill="rgba(238,244,255,${ce})"/>`), $.push(`<circle cx="${Eo + t}" cy="${To}" r="${Vt * 0.98}" fill="${e}" opacity="${ce * 0.98}"/>`);
      const n = Eo - Vt * 0.34, i = To + Vt * 0.3, r = Vt * 0.24;
      $.push(`<circle cx="${n}" cy="${i}" r="${r}" fill="rgba(152,162,180,${ce * 0.72})"/>`), $.push(`<circle cx="${n + r * 0.14}" cy="${i + r * 0.16}" r="${r * 0.64}" fill="rgba(90,102,122,${ce * 0.42})"/>`), $.push("</g>"), $.push(`<circle cx="${Eo}" cy="${To}" r="${Vt}" fill="none" stroke="rgba(255,255,255,${ce * 0.32})" stroke-width="1"/>`);
    }
    if (We) {
      const t = M(Yc, 0, 1), e = [0.3, 0.42, 0.24], s = [0.46, 0.6, 0.38], n = [
        { y: Ze * (e[0] + (s[0] - e[0]) * t), s: 0.76 * Aa, dur: 38 / Math.max(0.2, Da), phase: 0.12 },
        { y: Ze * (e[1] + (s[1] - e[1]) * t), s: 1 * Aa, dur: 56 / Math.max(0.2, Da), phase: 0.48 },
        { y: Ze * (e[2] + (s[2] - e[2]) * t), s: 0.66 * Aa, dur: 76 / Math.max(0.2, Da), phase: 0.78 }
      ];
      $.push('<g clip-path="url(#sky-cloud-clip)">'), n.forEach((i) => {
        const r = 1 - 0.35 * Ke, h = M(Qn * r, 0, 1), u = M(Qn * 0.75 * r, 0, 1);
        [-(i.phase * i.dur), -((i.phase + 0.5) * i.dur)].forEach((f) => {
          $.push(`<g transform="translate(0 ${i.y}) scale(${i.s})">`);
          const p = Qs ? 6 : ut ? 3 : 1, m = i.dur * p, b = ut ? Math.max(1, Math.round(m * co)) : 0, g = -f, y = ut ? Ks(m, g) : Zs(m, g);
          $.push(`<g class="sv-sky-cloud" style="animation-duration:${m}s;--sv-phase-delay:${y.toFixed(3)}s;animation-delay:${y.toFixed(3)}s;--sv-steps:${b}">`), $.push('<g filter="url(#sky-cloud-blur)">'), $.push(`<ellipse cx="0" cy="0" rx="52" ry="20" fill="rgba(255,255,255,${h})"/>`), $.push(`<ellipse cx="28" cy="-12" rx="36" ry="17" fill="rgba(255,255,255,${u})"/>`), $.push(`<ellipse cx="-26" cy="-10" rx="30" ry="15" fill="rgba(255,255,255,${u})"/>`), $.push(`<ellipse cx="64" cy="-4" rx="24" ry="12" fill="rgba(255,255,255,${u * 0.95})"/>`), $.push("</g>"), $.push("</g>"), $.push("</g>");
        });
      }), $.push("</g>");
    }
    const rf = () => {
      const t = Ao[0] - Fo[0], e = Ao[1] - Fo[1], s = Math.hypot(t, e);
      if (s <= 1e-3) return;
      const n = -e / s, i = t / s, r = t / s, h = e / s, u = Ao[0] - r * Do, d = Ao[1] - h * Do, f = [u + n * Do * 0.62, d + i * Do * 0.62], p = [u - n * Do * 0.62, d - i * Do * 0.62], m = Math.max(0.8, qu * 0.55 + Yu * 0.75), b = [
        [Ao[0], Ao[1]],
        [p[0], p[1]],
        [f[0], f[1]]
      ], g = b.map((x) => `${x[0]},${x[1]}`).join(" "), y = Math.max(1.1, Do * 0.16);
      if (fi) {
        const x = Ql * vn, E = x * 0.55, T = x * 0.75, z = b.map((I) => [I[0] + E, I[1] + T]).map((I) => `${I[0]},${I[1]}`).join(" ");
        $.push(`<line x1="${Fo[0] + E}" y1="${Fo[1] + T}" x2="${u + E}" y2="${d + T}"
          stroke="${Jo}" stroke-opacity="${M(Wa, 0, 1)}" stroke-width="${m}"
          stroke-linecap="round" filter="url(#floor-pointer-shadow-blur)"/>`), $.push(`<polygon points="${z}" fill="${Jo}" fill-opacity="${M(Wa * 0.95, 0, 1)}"
          stroke="${Jo}" stroke-opacity="${M(Wa * 0.95, 0, 1)}"
          stroke-width="${y}" stroke-linejoin="round" filter="url(#floor-pointer-shadow-blur)"/>`);
      }
      $.push(`<line x1="${Fo[0]}" y1="${Fo[1]}" x2="${u}" y2="${d}"
        stroke="${La}" stroke-width="${m}" stroke-linecap="round" opacity="0.92"/>`), $.push(`<polygon points="${g}" fill="${La}" opacity="0.95"
        stroke="${La}" stroke-width="${y}" stroke-linejoin="round"/>`);
    }, cf = () => {
      if (!X) return;
      const t = M(Gs, 0.8, 1.9), e = Math.max(0.08, Hs), s = 1 + Sc, n = s + e, i = Z + 5e-4, r = (g) => U(G(ft(g))), h = r([-t / 2, i, s]), u = r([t / 2, i, s]), d = r([t / 2, i, n]), f = r([-t / 2, i, n]);
      $.push(`<polygon points="${h[0]},${h[1]} ${u[0]},${u[1]} ${d[0]},${d[1]} ${f[0]},${f[1]}"
        fill="${wc}" opacity="0.9"/>`);
      const p = (g, y, x) => [g[0] + (y[0] - g[0]) * x, g[1] + (y[1] - g[1]) * x];
      [0.25, 0.5, 0.75].forEach((g) => {
        const y = p(h, u, g), x = p(f, d, g);
        $.push(`<line x1="${y[0]}" y1="${y[1]}" x2="${x[0]}" y2="${x[1]}"
          stroke="${Yn}" stroke-width="${Xn}" opacity="0.65"/>`);
      });
      const m = p(h, f, 0.5), b = p(u, d, 0.5);
      $.push(`<line x1="${m[0]}" y1="${m[1]}" x2="${b[0]}" y2="${b[1]}"
        stroke="${Yn}" stroke-width="${Xn}" opacity="0.65"/>`);
    };
    if (go > 0.1 && gr.forEach((t, e) => {
      const s = t.map((i) => `${i[0]},${i[1]}`).join(" "), n = M(0.86 - e * 0.08, 0.62, 0.9);
      $.push(`<polygon points="${s}" fill="${Go}" opacity="${n}"/>`);
    }), $.push(`<path d="${ba}" fill="${ye}" stroke="${$e}" stroke-width="${rt}"/>`), yo && mt > 1e-3 && $.push(`<path d="${ba}" fill="url(#floor-grass-grad)"/>`), cf(), Ma && vt && ts && os && $.push(`<path d="${ba}" fill="url(#sunlight-grad)"/>`), Ie && !vt && es && ss && $.push(`<path d="${ba}" fill="url(#moonlight-grad)"/>`), xa && ir) {
      const t = Je ? Je.map((s) => [s[0], s[1]]) : [], e = Jh(t, sf);
      if (e.length >= 3) {
        const s = e.map((i) => i[0] + "," + i[1]).join(" "), n = 1 - 0.4 * he;
        $.push(`<polygon points="${s}" fill="${Jo}" opacity="${xc * n}" filter="url(#shadow-blur-soft)"/>`), $.push(`<polygon points="${s}" fill="${Jo}" opacity="${Mc * n}" filter="url(#shadow-blur-contact)"/>`);
      }
    }
    rf(), Ra && dn && $.push(`<polygon points="${dn}" fill="${Tc}" opacity="${kc}" filter="url(#base-anchor-shadow-blur)"/>`), $.push(`<polygon points="${Wu.join(" ")}" fill="none" stroke="${ni}" stroke-width="${ii}" stroke-linecap="round"/>`), $.push(`<polygon points="${Ou.join(" ")}" fill="none" stroke="${Wl}" stroke-width="${zl}" stroke-linecap="round"/>`), $.push(`<polygon points="${Iu.join(" ")}" fill="none" stroke="${ni}" stroke-width="${ii}" stroke-linecap="round"/>`), ri && tr.forEach((t) => {
      const e = t.isMajor ? Vl : Il;
      $.push(`<line x1="${t.pIn[0]}" y1="${t.pIn[1]}" x2="${t.pOut[0]}" y2="${t.pOut[1]}" stroke="${Ol}" stroke-width="${e}"/>`);
    }), Hu.forEach((t) => {
      $.push(`<text x="${t.x}" y="${t.y}" fill="white"
        font-size="${Ul * t.scale}"
        stroke="rgba(0,0,0,0.6)" stroke-width="${Zl * t.scale}"
        font-weight="700" text-anchor="middle">${t.t}</text>`);
    });
    const lf = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    };
    er.forEach((t) => {
      const e = lf[t.id];
      if (!e) return;
      const s = ft(e), n = ft(t.pos), i = t.id === "front" || t.id === "left" ? e.map((g) => -g) : e, r = ft(i), h = Wi(n, s, tu(s), r, !1);
      if (!h) return;
      const { basis: u, centerScr: d } = h, f = M(d[3] * oh, eh, sh), p = th * f, m = rh * f, b = d[1] - ah * f;
      $.push(`<text x="0" y="0"
        fill="${nh}"
        font-size="${p}"
        stroke="${ih}"
        stroke-width="${m}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${u.bx} ${u.by} ${u.ux} ${u.uy} ${d[0]} ${b})">${t.label}</text>`);
    });
    const hf = Number(this._cssGlobalTimeSec || Si), uf = Math.floor(hf / 1.6);
    let $r = Qs ? 1 : 0;
    const _r = (t, e = 1, s = 1) => {
      const n = t.length > 0 ? (uf % t.length + t.length) % t.length : -1;
      t.forEach((i, r) => {
        const h = M(
          He / (He + i.zCam) * Oc,
          Ic,
          Vc
        ), u = Math.max(0.7, Dc * No * h), d = M(Ac * s * h, 0, 1);
        $.push(`<line x1="${it[0]}" y1="${it[1]}" x2="${i.x}" y2="${i.y}"
          stroke="rgba(255,255,150,${d})" stroke-width="${u}"/>`);
        let f = !1;
        if (Qs)
          f = $r > 0 && r === n, f && ($r -= 1);
        else {
          const p = r % 3 !== 2, m = !ut || r % 2 === 0;
          f = p && m;
        }
        if (ka && vt && f) {
          const p = Math.max(0.6, u * zc), m = Math.max(0.2, Lc), b = r * Wc, g = ut ? Ks(m, b) : Zs(m, b), y = M(Pc * e * h, 0, 1), x = ut ? Math.max(1, Math.round(m * co)) : 0;
          $.push(`<line x1="${it[0]}" y1="${it[1]}" x2="${i.x}" y2="${i.y}"
            class="sv-beam-flow"
            style="animation-duration:${m}s;--sv-phase-delay:${g.toFixed(3)}s;animation-delay:${g.toFixed(3)}s;--sv-steps:${x}"
            stroke="${Bc}" stroke-opacity="${y}" stroke-width="${p}"
            stroke-linecap="round" stroke-dasharray="${Na} ${Ea}" stroke-dashoffset="0"/>`);
        }
      });
    };
    vt && _r(kn);
    const ff = su.map((t) => {
      const e = t.i.map((i) => Yt[i]), s = lo[t.id] ?? 1, n = Ct(t.c, s);
      return { type: "cube", id: t.id, pts: e, z: Mo(e), fill: n, opacity: 1 };
    }), de = [];
    Rt || (nu.forEach((t) => {
      const e = Math.min(...t.pts.map((s) => s[2]));
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
      z: Mo(un) + ai * 0.35,
      fill: hu,
      opacity: za
    }));
    let pe = Mo(ca);
    if (de.length) {
      const t = Math.min(...de.map((s) => s.z)), e = Math.max(...de.map((s) => s.z));
      ho ? pe = Math.min(pe, t - 0.02) : pe = Math.max(pe, e + 0.02);
    } else
      pe += ho ? -1e-3 : 1e-3;
    const vr = !Rt && vo && (ho || Fl) ? {
      type: "roofPlane",
      pts: ca,
      z: pe,
      fill: ho ? lu : cu,
      opacity: ho ? xs : Al
    } : null, Sr = ff.concat(de).concat(Xt).concat(vr ? [vr] : []).sort((t, e) => {
      const s = e.z - t.z, n = String((t == null ? void 0 : t.type) || ""), i = String((e == null ? void 0 : e.type) || ""), r = n.startsWith("flatRoofEdge-"), h = i.startsWith("flatRoofEdge-"), u = n.startsWith("flatRoofSkirt-"), d = i.startsWith("flatRoofSkirt-");
      if (r && h || u && d || (n === "roofSide" || n === "roofCap") && (i === "roofSide" || i === "roofCap")) {
        if (Math.abs(s) > 1e-6) return s;
      } else if (Math.abs(s) > 0.015)
        return s;
      const m = (g) => {
        const y = String((g == null ? void 0 : g.type) || "");
        return y.startsWith("flatRoofSkirt-") ? 0.7 : y === "roofCap" ? 0.9 : y === "flatRoofTop" || y === "roofPlane" ? 1 : y === "cube" ? 1.4 : y === "roofSide" ? 1.55 : y.startsWith("flatRoofEdge-") ? 1.8 : y === "flatRoofBottom" ? 3 : 1;
      }, b = m(t) - m(e);
      return Math.abs(b) > 1e-6 ? b : s;
    }), df = (t, e) => {
      if (!Vs || !(t === "front" || t === "right" || t === "back" || t === "left") || !e || e.length < 4) return;
      const s = e[0], n = e[1], i = e[2], r = e[3], h = (m, b, g) => [m[0] + (b[0] - m[0]) * g, m[1] + (b[1] - m[1]) * g], u = M(N, 0.015, 0.22), d = h(s, r, u), f = h(n, i, u), p = Ct(_t[t], (lo[t] ?? 1) * M(D, 0.2, 1.2));
      $.push(`<polygon points="${s[0]},${s[1]} ${n[0]},${n[1]} ${f[0]},${f[1]} ${d[0]},${d[1]}"
        fill="${p}" opacity="0.95"/>`);
    }, pf = (t) => {
      if (!pi || !wn[t]) return;
      const e = au[t], s = Vi[t];
      if (!e || !s) return;
      const n = t === "front" || t === "left" ? e.map((T) => -T) : e;
      let i = 0, r = 0, h = 0;
      sn[t].indices.forEach((T) => {
        const B = Ii[T];
        i += B[0], r += B[1], h += B[2];
      }), i /= 4, r /= 4, h /= 4, r = M(hh, -0.9, 0.9);
      const u = [
        i + s[0] * Va,
        r + s[1] * Va,
        h + s[2] * Va
      ], d = ft(u), f = ft(e), p = ft(n), m = Wi(d, f, [0, 1, 0], p, !1);
      if (!m) return;
      const { basis: b, centerScr: g } = m, y = M(g[3] * uh, fh, dh), x = Oa * y, E = Ia * y;
      $.push(`<text x="0" y="0"
        fill="${mi}"
        font-size="${x}"
        stroke="${bi}"
        stroke-width="${E}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${b.bx} ${b.by} ${b.ux} ${b.uy} ${g[0]} ${g[1]})">${Pi(Ue[t])}</text>`);
    }, mf = () => {
      if (!gh || !Sn.front) return;
      const t = -Ha / 2, e = Ha / 2, s = M(-1 + yh, -1, 1), n = M(s + gi, -1, 1), i = 1 + $h, r = (T) => U(G(ft(T))), d = [
        [t, s, i],
        [e, s, i],
        [e, n, i],
        [t, n, i]
      ].map(r).map((T) => `${T[0]},${T[1]}`).join(",");
      $.push(`<polygon points="${d}" fill="${vh}" opacity="${yi}"/>`);
      const f = Math.min(0.08, Math.max(0.04, Ha * 0.14)), p = Math.min(0.08, Math.max(0.04, gi * 0.1)), g = [
        [t + f, s + p, i + 3e-3],
        [e - f, s + p, i + 3e-3],
        [e - f, n - p, i + 3e-3],
        [t + f, n - p, i + 3e-3]
      ].map(r).map((T) => `${T[0]},${T[1]}`).join(",");
      $.push(`<polygon points="${g}" fill="${_h}" opacity="${yi}"/>`);
      const y = [e - f - 0.05, s + (n - s) * 0.45, i + 6e-3], x = r(y), E = Math.max(0.6, x[3]);
      $.push(`<circle cx="${x[0]}" cy="${x[1]}" r="${1.8 * E}" fill="${Sh}" opacity="0.95"/>`);
    }, bf = (t, e) => {
      if (!Ns || !(t === "left" || t === "right" || t === "back") || !e || e.length < 4) return;
      const s = M(lo[t] ?? 1, 0.2, 1), n = e[0], i = e[1], r = e[2], h = e[3], u = (R, L, A) => [R[0] + (L[0] - R[0]) * A, R[1] + (L[1] - R[1]) * A], d = (R, L) => {
        const A = u(n, h, L), j = u(i, r, L);
        return u(A, j, R);
      }, f = t === "back" ? 0.2 : 0.24, p = t === "back" ? 0.8 : 0.76, m = 0.2, b = m + (0.74 - m) * 0.75, y = [
        d(f, m),
        d(p, m),
        d(p, b),
        d(f, b)
      ].map((R) => `${R[0]},${R[1]}`).join(",");
      $.push(`<polygon points="${y}" fill="${Es}" opacity="${0.98 * s}"/>`);
      const x = 0.035, E = 0.05, B = [
        d(f + x, m + E),
        d(p - x, m + E),
        d(p - x, b - E),
        d(f + x, b - E)
      ].map((R) => `${R[0]},${R[1]}`).join(",");
      $.push(`<polygon points="${B}" fill="${Ts}" opacity="${0.95 * s}"/>`);
      const z = d((f + p) * 0.5, m + E), I = d((f + p) * 0.5, b - E);
      $.push(`<line x1="${z[0]}" y1="${z[1]}" x2="${I[0]}" y2="${I[1]}"
        stroke="${Fs}" stroke-width="${Ee}" opacity="${0.9 * s}"/>`);
      const C = d(f + x * 1.4, m + E * 1.2), _ = d(p - x * 1.6, b - E * 1.3);
      $.push(`<line x1="${C[0]}" y1="${C[1]}" x2="${_[0]}" y2="${_[1]}"
        stroke="rgba(255,255,255,0.32)" stroke-width="${Math.max(0.8, Ee * 0.9)}" opacity="${s}"/>`);
    }, ya = Bi([0, 0, -1]), wr = Math.hypot(wo, xo), xr = Math.hypot(ya[0], ya[2]), Fn = wr > 1e-6 && xr > 1e-6 && (wo * ya[0] + xo * ya[2]) / (wr * xr) < 0;
    function Rr(t, e) {
      if (!Pe || !Le) return;
      const s = (E) => U(G(E)), n = wo, i = xo, r = M(ze, 0.4, 2.5), h = [n, Z + 0.35 * r, i];
      let u = !0;
      if (Fn)
        u = !1;
      else if (e) {
        const E = G(h), T = U(E), B = e(T[0], T[1]);
        u = B == null || E[2] <= B - 8e-3;
      }
      if (t === "front" !== u) return;
      const d = s([n, Z, i]), f = s([n, Z + 0.86 * r, i]), p = Math.max(2.6, 8.5 * f[3] * r), m = M(1 + Is * 10, 0.6, 2.5), b = Math.max(2.2, p * 0.62 * m), g = Math.max(1.1, p * 0.24 * m), y = d[0], x = d[1] + g * 0.28;
      $.push(`<ellipse cx="${y}" cy="${x}" rx="${b}" ry="${g}"
        fill="${Jo}" opacity="${M(Ws, 0, 1)}" filter="url(#back-tree-shadow-blur)"/>`);
    }
    function Mr(t, e) {
      if (!Pe) return;
      const s = (C) => U(G(C)), n = (C) => {
        if (Fn) return !1;
        if (!e) return !0;
        const _ = G(C), R = U(_), L = e(R[0], R[1]);
        return L == null || _[2] <= L - 8e-3;
      }, i = (C, _, R, L) => {
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
        for (const [pt, lt] of A) {
          const Gt = e(_ + pt * L, R + lt * L);
          (Gt == null || C <= Gt - 8e-3) && j++;
        }
        return j / A.length >= 0.4;
      }, r = wo, h = xo, u = M(ze, 0.4, 2.5), d = M(1 - 0.55 * Ke, 0.35, 1), f = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(io) ? Ct(io, 0.72 * d) : io, p = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(io) ? Ct(io, 1.18 - 0.4 * Ke) : "rgba(255,255,255,0.30)", m = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(ro) ? Ct(ro, 0.72 * d) : ro, b = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(ro) ? Ct(ro, 1.2 - 0.45 * Ke) : "rgba(255,255,255,0.25)", g = M(1 - 0.3 * Ke, 0.55, 1), y = s([r, Z, h]), x = s([r, Z + 0.86 * u, h]), E = Math.max(2.6, 8.5 * x[3] * u), T = [
        [r, Z + 0.22 * u, h],
        [r, Z + 0.45 * u, h],
        [r, Z + 0.72 * u, h]
      ];
      let B = 0;
      T.forEach((C) => {
        n(C) && B++;
      });
      const z = B / T.length >= 0.4;
      if (t === "front" === z) {
        const C = x[0] - y[0], _ = x[1] - y[1], R = Math.max(1e-3, Math.hypot(C, _)), L = -_ / R, A = C / R, j = Math.max(0.35, E * 0.12);
        $.push(`<line x1="${y[0]}" y1="${y[1]}" x2="${x[0]}" y2="${x[1]}"
          stroke="${m}" stroke-width="${E}" stroke-linecap="round" opacity="${g}"/>`), $.push(`<line x1="${y[0] + L * j}" y1="${y[1] + A * j}" x2="${x[0] + L * j}" y2="${x[1] + A * j}"
          stroke="${b}" stroke-width="${Math.max(1.1, E * 0.36)}" stroke-linecap="round" opacity="${0.55 * g}"/>`);
      }
      [
        [r, Z + 1.02 * u, h, 0.28],
        [r - 0.18 * u, Z + 0.9 * u, h + 0.06 * u, 0.22],
        [r + 0.2 * u, Z + 0.86 * u, h - 0.07 * u, 0.2]
      ].forEach((C) => {
        const _ = s([C[0], C[1], C[2]]), R = G([C[0], C[1], C[2]]), L = Math.max(6, Tt * C[3] * _[3] * 0.95), A = i(R[2], _[0], _[1], L * 0.92);
        t === "front" === A && ($.push(`<circle cx="${_[0]}" cy="${_[1]}" r="${L}" fill="${f}" opacity="${g}"/>`), $.push(`<circle cx="${_[0] - L * 0.2}" cy="${_[1] - L * 0.24}" r="${L * 0.62}" fill="${p}" opacity="${0.52 * g}"/>`), $.push(`<circle cx="${_[0] + L * 0.28}" cy="${_[1] + L * 0.22}" r="${L * 0.52}" fill="${f}" opacity="${0.26 * g}"/>`));
      });
    }
    const Cr = () => {
      const t = Rt && rn ? rn : qe, e = {
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
    }, gf = () => {
      if (!As || !vo || !ln) return;
      const t = Cr();
      if (!t) return;
      const { lowA: e, lowB: s, highA: n, highB: i } = t, r = Math.min(Fe, Ae), h = Math.max(Fe, Ae), u = zs, d = Ls, f = (1 - u) / 2, p = u, m = d * Math.max(0, Ko - 1), b = (p - m) / Ko;
      if (!isFinite(b) || b <= 0.01) return;
      const g = (B, z, I) => [B[0] + (z[0] - B[0]) * I, B[1] + (z[1] - B[1]) * I, B[2] + (z[2] - B[2]) * I], y = (B, z) => {
        const I = g(e, n, z), C = g(s, i, z), _ = g(I, C, B);
        return U(G(_));
      }, x = Ye(Ds, M(At, 0.2, 1)), E = 0.55 + 0.4 * M(At, 0, 1), T = 0.3 + 0.5 * M(At, 0, 1);
      for (let B = 0; B < Ko; B++) {
        const z = f + B * (b + d), I = z + b, C = y(z, r), _ = y(I, r), R = y(I, h), L = y(z, h);
        $.push(`<polygon points="${C[0]},${C[1]} ${_[0]},${_[1]} ${R[0]},${R[1]} ${L[0]},${L[1]}"
          fill="${x}" opacity="0.96" stroke="${Bs}" stroke-opacity="${E}" stroke-width="${Ps}"/>`);
        const A = (j, st, pt) => [j[0] + (st[0] - j[0]) * pt, j[1] + (st[1] - j[1]) * pt];
        for (let j = 1; j < De; j++) {
          const st = j / De, pt = A(C, _, st), lt = A(L, R, st);
          $.push(`<line x1="${pt[0]}" y1="${pt[1]}" x2="${lt[0]}" y2="${lt[1]}"
            stroke="${Te}" stroke-opacity="${T}" stroke-width="0.7"/>`);
        }
        for (let j = 1; j < Be; j++) {
          const st = j / Be, pt = A(C, L, st), lt = A(_, R, st);
          $.push(`<line x1="${pt[0]}" y1="${pt[1]}" x2="${lt[0]}" y2="${lt[1]}"
            stroke="${Te}" stroke-opacity="${T}" stroke-width="0.7"/>`);
        }
      }
    }, kr = () => {
      if (!pi || !vo || !ln) return;
      const t = Cr();
      if (!t) return;
      const { lowA: e, lowB: s, highA: n, highB: i, worldEdgeLen: r, roofHeightWorld: h } = t, u = Pi(ve);
      let d = -h * (1 / 3), f = -h * (2 / 3);
      const p = 1 / 6, m = r * (1 - 2 * p), b = "100%", g = "9.99 kW", y = Math.max(u.length, b.length);
      Math.max((we || "").length, g.length);
      const x = h * 0.36, E = Math.min(m / (0.6 * y), x), T = Math.min(E * ph, x * 1.05), B = Ia / Oa * T, z = Math.min(T * mh, x * 0.85), I = Ia / Oa * z;
      this._roofStripSeed = (this._roofStripSeed || 0) + 1;
      const C = (R, L, A) => [R[0] + (L[0] - R[0]) * A, R[1] + (L[1] - R[1]) * A, R[2] + (L[2] - R[2]) * A], _ = (R, L, A, j, st, pt, lt) => {
        if (!R) return;
        const Gt = Math.max(L * pt, h * 0.08), Dn = st, qr = st - Gt, Yr = M(-Dn / h, 0, 1), wf = M(-qr / h, 0, 1), xf = C(e, n, Yr), Rf = C(s, i, Yr), Mf = C(e, n, wf), Xr = U(G(xf)), Zr = U(G(Rf)), Kr = U(G(Mf)), Kt = [[0, Dn], [r, Dn], [0, qr]], Jt = [[Xr[0], Xr[1]], [Zr[0], Zr[1]], [Kr[0], Kr[1]]], Po = Qh(Kt, Jt);
        if (!Po) return;
        const Jr = Math.sign((Kt[1][0] - Kt[0][0]) * (Kt[2][1] - Kt[0][1]) - (Kt[1][1] - Kt[0][1]) * (Kt[2][0] - Kt[0][0])), Qr = Math.sign((Jt[1][0] - Jt[0][0]) * (Jt[2][1] - Jt[0][1]) - (Jt[1][1] - Jt[0][1]) * (Jt[2][0] - Jt[0][0])), tc = Jr !== 0 && Qr !== 0 && Jr !== Qr;
        $.push(`<g transform="matrix(${Po.a} ${Po.b} ${Po.c} ${Po.d} ${Po.e} ${Po.f})">`), tc && $.push(`<g transform="translate(${r} 0) scale(-1 1)">`), $.push(`<text x="${r / 2}" y="${st}" fill="${j}" font-size="${L}"
          stroke="${bi}" stroke-width="${A}" font-weight="700"
          text-anchor="middle" dominant-baseline="middle">${R}</text>`), tc && $.push("</g>"), $.push("</g>");
      };
      Uo && _(we, z, I, bh, d, 1.6), _(u, T, B, mi, f, 1.6);
    }, An = [];
    Sr.forEach((t) => {
      const e = t.pts || [];
      if (!(e.length < 3))
        if (e.length === 3)
          An.push([e[0], e[1], e[2]]);
        else
          for (let s = 1; s < e.length - 1; s++)
            An.push([e[0], e[s], e[s + 1]]);
    });
    const yf = (t, e, s, n, i) => {
      const r = s[0], h = s[1], u = s[2], d = n[0], f = n[1], p = n[2], m = i[0], b = i[1], g = i[2], y = (f - b) * (r - m) + (m - d) * (h - b);
      if (Math.abs(y) < 1e-6) return null;
      const x = ((f - b) * (t - m) + (m - d) * (e - b)) / y, E = ((b - h) * (t - m) + (r - m) * (e - b)) / y, T = 1 - x - E;
      return x < -1e-4 || E < -1e-4 || T < -1e-4 ? null : x * u + E * p + T * g;
    }, is = (t, e) => {
      let s = 1 / 0;
      return An.forEach(([n, i, r]) => {
        const h = yf(t, e, n, i, r);
        h != null && h < s && (s = h);
      }), Number.isFinite(s) ? s : null;
    };
    Rr("back", is), Mr("back", is), Sr.forEach((t) => {
      const e = t.pts.map((r) => r[0] + "," + r[1]).join(","), n = typeof t.type == "string" && t.type.startsWith("flatRoof") ? t.fill : "#000";
      $.push(`<polygon points="${e}" fill="${t.fill}" stroke="${n}" stroke-width="${0.5}" opacity="${t.opacity}"/>`), t.type === "cube" && df(t.id, t.pts), t.type === "cube" && t.id === "front" && mf(), t.type === "cube" && bf(t.id, t.pts), t.type === "cube" && pf(t.id), (t.type === "roofPlane" || t.type === "flatRoofTop") && gf(), t.type === "roofPlane" && !Rt && kr();
    }), Rt && ln && kr();
    const $f = (t) => {
      const e = [0.14, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74, 0.84, 0.92];
      let s = 0, n = 0;
      for (const i of e) {
        const r = [
          ko[0] + (t.world[0] - ko[0]) * i,
          ko[1] + (t.world[1] - ko[1]) * i,
          ko[2] + (t.world[2] - ko[2]) * i
        ], h = G(r), u = U(h), d = is(u[0], u[1]);
        n++, (d == null || h[2] <= d - 5e-3) && s++;
      }
      return n > 0 && s >= Math.ceil(n * 0.67);
    }, Nr = En.filter((t) => $f(t));
    if (vt && !du && Nr.length && _r(Nr, 1, 0.85), Rr("front", is), Mr("front", is), vt) {
      $.push(`<circle cx="${it[0]}" cy="${it[1]}" r="${pu}" fill="url(#sun-glow)"/>`), $.push(`<circle cx="${it[0]}" cy="${it[1]}" r="${mu}" fill="yellow" stroke="orange" stroke-width="${Math.max(1, 2 * No)}"/>`);
      const t = Math.min(Ta, Fa), e = Math.max(Ta, Fa);
      for (let s = 0; s < 8; s++) {
        const n = s * 360 / 8, i = 20 * No;
        if (Ya) {
          const r = t + (e - t) * (0.5 + 0.5 * Math.sin(s * 1.71)), h = 0.18 * s + 0.07 * Math.cos(s * 2.13), u = ut ? Ks(r, h) : Zs(r, h), d = M(Gc + 0.015 * Math.sin(s * 0.93), 0.2, 1), f = M(Uc - 0.02 * Math.cos(s * 1.27), 0.25, 1), p = M(jc + 0.04 * Math.cos(s * 1.37), 0.05, 1);
          $.push(`<g transform="translate(${it[0]} ${it[1]}) rotate(${n})">`);
          const m = ut ? Math.max(1, Math.round(r * co)) : 0;
          $.push(`<line x1="0" y1="0" x2="${i}" y2="0"
            class="sv-sun-ray"
            style="animation-duration:${r.toFixed(2)}s;--sv-phase-delay:${u.toFixed(2)}s;animation-delay:${u.toFixed(2)}s;--ray-min-scale:${d.toFixed(3)};--ray-max-scale:${f.toFixed(3)};--sv-steps:${m};"
            stroke="${Jn}" stroke-width="${1.5 * No}" stroke-linecap="round" opacity="${p.toFixed(3)}"/>`), $.push("</g>");
        } else
          $.push(`<g transform="translate(${it[0]} ${it[1]}) rotate(${n})">`), $.push(`<line x1="0" y1="0" x2="${i}" y2="0"
            stroke="${Jn}" stroke-width="${1.5 * No}" stroke-linecap="round" opacity="0.6"/>`), $.push("</g>");
      }
    }
    if (Ie && !vt && uo > 0.03) {
      const t = Array.isArray(js) ? js : [178, 208, 255], e = M(Rl * uo, 0, 1);
      $.push(`<rect x="0" y="0" width="${J}" height="${tt}"
        fill="rgb(${t.join(",")})" opacity="${e}"/>`);
    }
    const _f = kt ? ["SUN OVERRIDE ENABLED", "Solar alignment % is disabled"] : [];
    ei && $.push(`<rect x="0" y="0" width="${J}" height="${tt}" fill="url(#vignette)"/>`);
    const Er = this._autoRotateEnabled ? Number(this._autoRotateIntervalMsDynamic || Mt) : this._manualRotateEnabled ? Number(this._manualRotateIntervalMs || this._rotationIntervalMsFloor || Mt) : Mt, vf = Za && Er > Mt;
    let Sf = 0;
    const rs = () => 18 + Sf++ * 16;
    if (Rh && this._autoRotateEnabled) {
      const t = Number.isFinite(this._autoRotateFps) ? this._autoRotateFps : 0, e = this._autoRotateIntervalMsDynamic || Mt, s = e > Mt ? " LIMIT" : "";
      $.push(`<text x="10" y="${rs()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">FPS ${t.toFixed(1)} | ${Math.round(e)}ms${s}</text>`);
    }
    if (_i) {
      const t = Number.isFinite(this._cssFps) ? this._cssFps : 0;
      $.push(`<text x="10" y="${rs()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">CSS FPS ${t.toFixed(1)}</text>`);
    }
    if (Oh && ut && $.push(`<text x="10" y="${rs()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">CSS LIMIT ${co} FPS</text>`), vf) {
      const t = Math.max(1, Math.round(1e3 / Er));
      $.push(`<text x="10" y="${rs()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">ROT LIMIT ${t} FPS</text>`);
    }
    return _f.forEach((t, e) => {
      const s = rs(), n = e === 0 ? 12 : 11;
      $.push(`<text x="10" y="${s}" fill="#ff3b3b" font-size="${n}" font-family="monospace" font-weight="700">${t}</text>`);
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
