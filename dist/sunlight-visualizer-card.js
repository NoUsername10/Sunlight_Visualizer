/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ua = globalThis, gr = Ua.ShadowRoot && (Ua.ShadyCSS === void 0 || Ua.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, yr = Symbol(), Yl = /* @__PURE__ */ new WeakMap();
let lh = class {
  constructor(n, c, l) {
    if (this._$cssResult$ = !0, l !== yr) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = n, this.t = c;
  }
  get styleSheet() {
    let n = this.o;
    const c = this.t;
    if (gr && n === void 0) {
      const l = c !== void 0 && c.length === 1;
      l && (n = Yl.get(c)), n === void 0 && ((this.o = n = new CSSStyleSheet()).replaceSync(this.cssText), l && Yl.set(c, n));
    }
    return n;
  }
  toString() {
    return this.cssText;
  }
};
const z0 = (k) => new lh(typeof k == "string" ? k : k + "", void 0, yr), hh = (k, ...n) => {
  const c = k.length === 1 ? k[0] : n.reduce((l, o, N) => l + (($) => {
    if ($._$cssResult$ === !0) return $.cssText;
    if (typeof $ == "number") return $;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + $ + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + k[N + 1], k[0]);
  return new lh(c, k, yr);
}, B0 = (k, n) => {
  if (gr) k.adoptedStyleSheets = n.map((c) => c instanceof CSSStyleSheet ? c : c.styleSheet);
  else for (const c of n) {
    const l = document.createElement("style"), o = Ua.litNonce;
    o !== void 0 && l.setAttribute("nonce", o), l.textContent = c.cssText, k.appendChild(l);
  }
}, Zl = gr ? (k) => k : (k) => k instanceof CSSStyleSheet ? ((n) => {
  let c = "";
  for (const l of n.cssRules) c += l.cssText;
  return z0(c);
})(k) : k;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: L0, defineProperty: W0, getOwnPropertyDescriptor: O0, getOwnPropertyNames: H0, getOwnPropertySymbols: I0, getPrototypeOf: V0 } = Object, ne = globalThis, Kl = ne.trustedTypes, G0 = Kl ? Kl.emptyScript : "", lr = ne.reactiveElementPolyfillSupport, kn = (k, n) => k, fr = { toAttribute(k, n) {
  switch (n) {
    case Boolean:
      k = k ? G0 : null;
      break;
    case Object:
    case Array:
      k = k == null ? k : JSON.stringify(k);
  }
  return k;
}, fromAttribute(k, n) {
  let c = k;
  switch (n) {
    case Boolean:
      c = k !== null;
      break;
    case Number:
      c = k === null ? null : Number(k);
      break;
    case Object:
    case Array:
      try {
        c = JSON.parse(k);
      } catch {
        c = null;
      }
  }
  return c;
} }, uh = (k, n) => !L0(k, n), Jl = { attribute: !0, type: String, converter: fr, reflect: !1, useDefault: !1, hasChanged: uh };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), ne.litPropertyMetadata ?? (ne.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let _s = class extends HTMLElement {
  static addInitializer(n) {
    this._$Ei(), (this.l ?? (this.l = [])).push(n);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(n, c = Jl) {
    if (c.state && (c.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(n) && ((c = Object.create(c)).wrapped = !0), this.elementProperties.set(n, c), !c.noAccessor) {
      const l = Symbol(), o = this.getPropertyDescriptor(n, l, c);
      o !== void 0 && W0(this.prototype, n, o);
    }
  }
  static getPropertyDescriptor(n, c, l) {
    const { get: o, set: N } = O0(this.prototype, n) ?? { get() {
      return this[c];
    }, set($) {
      this[c] = $;
    } };
    return { get: o, set($) {
      const G = o == null ? void 0 : o.call(this);
      N == null || N.call(this, $), this.requestUpdate(n, G, l);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(n) {
    return this.elementProperties.get(n) ?? Jl;
  }
  static _$Ei() {
    if (this.hasOwnProperty(kn("elementProperties"))) return;
    const n = V0(this);
    n.finalize(), n.l !== void 0 && (this.l = [...n.l]), this.elementProperties = new Map(n.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(kn("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(kn("properties"))) {
      const c = this.properties, l = [...H0(c), ...I0(c)];
      for (const o of l) this.createProperty(o, c[o]);
    }
    const n = this[Symbol.metadata];
    if (n !== null) {
      const c = litPropertyMetadata.get(n);
      if (c !== void 0) for (const [l, o] of c) this.elementProperties.set(l, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [c, l] of this.elementProperties) {
      const o = this._$Eu(c, l);
      o !== void 0 && this._$Eh.set(o, c);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(n) {
    const c = [];
    if (Array.isArray(n)) {
      const l = new Set(n.flat(1 / 0).reverse());
      for (const o of l) c.unshift(Zl(o));
    } else n !== void 0 && c.push(Zl(n));
    return c;
  }
  static _$Eu(n, c) {
    const l = c.attribute;
    return l === !1 ? void 0 : typeof l == "string" ? l : typeof n == "string" ? n.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var n;
    this._$ES = new Promise((c) => this.enableUpdating = c), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (n = this.constructor.l) == null || n.forEach((c) => c(this));
  }
  addController(n) {
    var c;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(n), this.renderRoot !== void 0 && this.isConnected && ((c = n.hostConnected) == null || c.call(n));
  }
  removeController(n) {
    var c;
    (c = this._$EO) == null || c.delete(n);
  }
  _$E_() {
    const n = /* @__PURE__ */ new Map(), c = this.constructor.elementProperties;
    for (const l of c.keys()) this.hasOwnProperty(l) && (n.set(l, this[l]), delete this[l]);
    n.size > 0 && (this._$Ep = n);
  }
  createRenderRoot() {
    const n = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return B0(n, this.constructor.elementStyles), n;
  }
  connectedCallback() {
    var n;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (n = this._$EO) == null || n.forEach((c) => {
      var l;
      return (l = c.hostConnected) == null ? void 0 : l.call(c);
    });
  }
  enableUpdating(n) {
  }
  disconnectedCallback() {
    var n;
    (n = this._$EO) == null || n.forEach((c) => {
      var l;
      return (l = c.hostDisconnected) == null ? void 0 : l.call(c);
    });
  }
  attributeChangedCallback(n, c, l) {
    this._$AK(n, l);
  }
  _$ET(n, c) {
    var N;
    const l = this.constructor.elementProperties.get(n), o = this.constructor._$Eu(n, l);
    if (o !== void 0 && l.reflect === !0) {
      const $ = (((N = l.converter) == null ? void 0 : N.toAttribute) !== void 0 ? l.converter : fr).toAttribute(c, l.type);
      this._$Em = n, $ == null ? this.removeAttribute(o) : this.setAttribute(o, $), this._$Em = null;
    }
  }
  _$AK(n, c) {
    var N, $;
    const l = this.constructor, o = l._$Eh.get(n);
    if (o !== void 0 && this._$Em !== o) {
      const G = l.getPropertyOptions(o), F = typeof G.converter == "function" ? { fromAttribute: G.converter } : ((N = G.converter) == null ? void 0 : N.fromAttribute) !== void 0 ? G.converter : fr;
      this._$Em = o;
      const q = F.fromAttribute(c, G.type);
      this[o] = q ?? (($ = this._$Ej) == null ? void 0 : $.get(o)) ?? q, this._$Em = null;
    }
  }
  requestUpdate(n, c, l, o = !1, N) {
    var $;
    if (n !== void 0) {
      const G = this.constructor;
      if (o === !1 && (N = this[n]), l ?? (l = G.getPropertyOptions(n)), !((l.hasChanged ?? uh)(N, c) || l.useDefault && l.reflect && N === (($ = this._$Ej) == null ? void 0 : $.get(n)) && !this.hasAttribute(G._$Eu(n, l)))) return;
      this.C(n, c, l);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(n, c, { useDefault: l, reflect: o, wrapped: N }, $) {
    l && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(n) && (this._$Ej.set(n, $ ?? c ?? this[n]), N !== !0 || $ !== void 0) || (this._$AL.has(n) || (this.hasUpdated || l || (c = void 0), this._$AL.set(n, c)), o === !0 && this._$Em !== n && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(n));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (c) {
      Promise.reject(c);
    }
    const n = this.scheduleUpdate();
    return n != null && await n, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var l;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [N, $] of this._$Ep) this[N] = $;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [N, $] of o) {
        const { wrapped: G } = $, F = this[N];
        G !== !0 || this._$AL.has(N) || F === void 0 || this.C(N, void 0, $, F);
      }
    }
    let n = !1;
    const c = this._$AL;
    try {
      n = this.shouldUpdate(c), n ? (this.willUpdate(c), (l = this._$EO) == null || l.forEach((o) => {
        var N;
        return (N = o.hostUpdate) == null ? void 0 : N.call(o);
      }), this.update(c)) : this._$EM();
    } catch (o) {
      throw n = !1, this._$EM(), o;
    }
    n && this._$AE(c);
  }
  willUpdate(n) {
  }
  _$AE(n) {
    var c;
    (c = this._$EO) == null || c.forEach((l) => {
      var o;
      return (o = l.hostUpdated) == null ? void 0 : o.call(l);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(n)), this.updated(n);
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
  shouldUpdate(n) {
    return !0;
  }
  update(n) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((c) => this._$ET(c, this[c]))), this._$EM();
  }
  updated(n) {
  }
  firstUpdated(n) {
  }
};
_s.elementStyles = [], _s.shadowRootOptions = { mode: "open" }, _s[kn("elementProperties")] = /* @__PURE__ */ new Map(), _s[kn("finalized")] = /* @__PURE__ */ new Map(), lr == null || lr({ ReactiveElement: _s }), (ne.reactiveElementVersions ?? (ne.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nn = globalThis, Ql = (k) => k, ja = Nn.trustedTypes, th = ja ? ja.createPolicy("lit-html", { createHTML: (k) => k }) : void 0, dh = "$lit$", se = `lit$${Math.random().toFixed(9).slice(2)}$`, fh = "?" + se, U0 = `<${fh}>`, Te = document, En = () => Te.createComment(""), Fn = (k) => k === null || typeof k != "object" && typeof k != "function", $r = Array.isArray, j0 = (k) => $r(k) || typeof (k == null ? void 0 : k[Symbol.iterator]) == "function", hr = `[ 	
\f\r]`, Cn = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, oh = /-->/g, eh = />/g, Ee = RegExp(`>|${hr}(?:([^\\s"'>=/]+)(${hr}*=${hr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), sh = /'/g, nh = /"/g, ph = /^(?:script|style|textarea|title)$/i, q0 = (k) => (n, ...c) => ({ _$litType$: k, strings: n, values: c }), oo = q0(1), Pe = Symbol.for("lit-noChange"), vt = Symbol.for("lit-nothing"), ah = /* @__PURE__ */ new WeakMap(), Fe = Te.createTreeWalker(Te, 129);
function mh(k, n) {
  if (!$r(k) || !k.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return th !== void 0 ? th.createHTML(n) : n;
}
const X0 = (k, n) => {
  const c = k.length - 1, l = [];
  let o, N = n === 2 ? "<svg>" : n === 3 ? "<math>" : "", $ = Cn;
  for (let G = 0; G < c; G++) {
    const F = k[G];
    let q, Q, j = -1, mt = 0;
    for (; mt < F.length && ($.lastIndex = mt, Q = $.exec(F), Q !== null); ) mt = $.lastIndex, $ === Cn ? Q[1] === "!--" ? $ = oh : Q[1] !== void 0 ? $ = eh : Q[2] !== void 0 ? (ph.test(Q[2]) && (o = RegExp("</" + Q[2], "g")), $ = Ee) : Q[3] !== void 0 && ($ = Ee) : $ === Ee ? Q[0] === ">" ? ($ = o ?? Cn, j = -1) : Q[1] === void 0 ? j = -2 : (j = $.lastIndex - Q[2].length, q = Q[1], $ = Q[3] === void 0 ? Ee : Q[3] === '"' ? nh : sh) : $ === nh || $ === sh ? $ = Ee : $ === oh || $ === eh ? $ = Cn : ($ = Ee, o = void 0);
    const ct = $ === Ee && k[G + 1].startsWith("/>") ? " " : "";
    N += $ === Cn ? F + U0 : j >= 0 ? (l.push(q), F.slice(0, j) + dh + F.slice(j) + se + ct) : F + se + (j === -2 ? G : ct);
  }
  return [mh(k, N + (k[c] || "<?>") + (n === 2 ? "</svg>" : n === 3 ? "</math>" : "")), l];
};
class An {
  constructor({ strings: n, _$litType$: c }, l) {
    let o;
    this.parts = [];
    let N = 0, $ = 0;
    const G = n.length - 1, F = this.parts, [q, Q] = X0(n, c);
    if (this.el = An.createElement(q, l), Fe.currentNode = this.el.content, c === 2 || c === 3) {
      const j = this.el.content.firstChild;
      j.replaceWith(...j.childNodes);
    }
    for (; (o = Fe.nextNode()) !== null && F.length < G; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const j of o.getAttributeNames()) if (j.endsWith(dh)) {
          const mt = Q[$++], ct = o.getAttribute(j).split(se), et = /([.?@])?(.*)/.exec(mt);
          F.push({ type: 1, index: N, name: et[2], strings: ct, ctor: et[1] === "." ? Z0 : et[1] === "?" ? K0 : et[1] === "@" ? J0 : Xa }), o.removeAttribute(j);
        } else j.startsWith(se) && (F.push({ type: 6, index: N }), o.removeAttribute(j));
        if (ph.test(o.tagName)) {
          const j = o.textContent.split(se), mt = j.length - 1;
          if (mt > 0) {
            o.textContent = ja ? ja.emptyScript : "";
            for (let ct = 0; ct < mt; ct++) o.append(j[ct], En()), Fe.nextNode(), F.push({ type: 2, index: ++N });
            o.append(j[mt], En());
          }
        }
      } else if (o.nodeType === 8) if (o.data === fh) F.push({ type: 2, index: N });
      else {
        let j = -1;
        for (; (j = o.data.indexOf(se, j + 1)) !== -1; ) F.push({ type: 7, index: N }), j += se.length - 1;
      }
      N++;
    }
  }
  static createElement(n, c) {
    const l = Te.createElement("template");
    return l.innerHTML = n, l;
  }
}
function ws(k, n, c = k, l) {
  var $, G;
  if (n === Pe) return n;
  let o = l !== void 0 ? ($ = c._$Co) == null ? void 0 : $[l] : c._$Cl;
  const N = Fn(n) ? void 0 : n._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== N && ((G = o == null ? void 0 : o._$AO) == null || G.call(o, !1), N === void 0 ? o = void 0 : (o = new N(k), o._$AT(k, c, l)), l !== void 0 ? (c._$Co ?? (c._$Co = []))[l] = o : c._$Cl = o), o !== void 0 && (n = ws(k, o._$AS(k, n.values), o, l)), n;
}
class Y0 {
  constructor(n, c) {
    this._$AV = [], this._$AN = void 0, this._$AD = n, this._$AM = c;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(n) {
    const { el: { content: c }, parts: l } = this._$AD, o = ((n == null ? void 0 : n.creationScope) ?? Te).importNode(c, !0);
    Fe.currentNode = o;
    let N = Fe.nextNode(), $ = 0, G = 0, F = l[0];
    for (; F !== void 0; ) {
      if ($ === F.index) {
        let q;
        F.type === 2 ? q = new Tn(N, N.nextSibling, this, n) : F.type === 1 ? q = new F.ctor(N, F.name, F.strings, this, n) : F.type === 6 && (q = new Q0(N, this, n)), this._$AV.push(q), F = l[++G];
      }
      $ !== (F == null ? void 0 : F.index) && (N = Fe.nextNode(), $++);
    }
    return Fe.currentNode = Te, o;
  }
  p(n) {
    let c = 0;
    for (const l of this._$AV) l !== void 0 && (l.strings !== void 0 ? (l._$AI(n, l, c), c += l.strings.length - 2) : l._$AI(n[c])), c++;
  }
}
class Tn {
  get _$AU() {
    var n;
    return ((n = this._$AM) == null ? void 0 : n._$AU) ?? this._$Cv;
  }
  constructor(n, c, l, o) {
    this.type = 2, this._$AH = vt, this._$AN = void 0, this._$AA = n, this._$AB = c, this._$AM = l, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
  }
  get parentNode() {
    let n = this._$AA.parentNode;
    const c = this._$AM;
    return c !== void 0 && (n == null ? void 0 : n.nodeType) === 11 && (n = c.parentNode), n;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(n, c = this) {
    n = ws(this, n, c), Fn(n) ? n === vt || n == null || n === "" ? (this._$AH !== vt && this._$AR(), this._$AH = vt) : n !== this._$AH && n !== Pe && this._(n) : n._$litType$ !== void 0 ? this.$(n) : n.nodeType !== void 0 ? this.T(n) : j0(n) ? this.k(n) : this._(n);
  }
  O(n) {
    return this._$AA.parentNode.insertBefore(n, this._$AB);
  }
  T(n) {
    this._$AH !== n && (this._$AR(), this._$AH = this.O(n));
  }
  _(n) {
    this._$AH !== vt && Fn(this._$AH) ? this._$AA.nextSibling.data = n : this.T(Te.createTextNode(n)), this._$AH = n;
  }
  $(n) {
    var N;
    const { values: c, _$litType$: l } = n, o = typeof l == "number" ? this._$AC(n) : (l.el === void 0 && (l.el = An.createElement(mh(l.h, l.h[0]), this.options)), l);
    if (((N = this._$AH) == null ? void 0 : N._$AD) === o) this._$AH.p(c);
    else {
      const $ = new Y0(o, this), G = $.u(this.options);
      $.p(c), this.T(G), this._$AH = $;
    }
  }
  _$AC(n) {
    let c = ah.get(n.strings);
    return c === void 0 && ah.set(n.strings, c = new An(n)), c;
  }
  k(n) {
    $r(this._$AH) || (this._$AH = [], this._$AR());
    const c = this._$AH;
    let l, o = 0;
    for (const N of n) o === c.length ? c.push(l = new Tn(this.O(En()), this.O(En()), this, this.options)) : l = c[o], l._$AI(N), o++;
    o < c.length && (this._$AR(l && l._$AB.nextSibling, o), c.length = o);
  }
  _$AR(n = this._$AA.nextSibling, c) {
    var l;
    for ((l = this._$AP) == null ? void 0 : l.call(this, !1, !0, c); n !== this._$AB; ) {
      const o = Ql(n).nextSibling;
      Ql(n).remove(), n = o;
    }
  }
  setConnected(n) {
    var c;
    this._$AM === void 0 && (this._$Cv = n, (c = this._$AP) == null || c.call(this, n));
  }
}
class Xa {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(n, c, l, o, N) {
    this.type = 1, this._$AH = vt, this._$AN = void 0, this.element = n, this.name = c, this._$AM = o, this.options = N, l.length > 2 || l[0] !== "" || l[1] !== "" ? (this._$AH = Array(l.length - 1).fill(new String()), this.strings = l) : this._$AH = vt;
  }
  _$AI(n, c = this, l, o) {
    const N = this.strings;
    let $ = !1;
    if (N === void 0) n = ws(this, n, c, 0), $ = !Fn(n) || n !== this._$AH && n !== Pe, $ && (this._$AH = n);
    else {
      const G = n;
      let F, q;
      for (n = N[0], F = 0; F < N.length - 1; F++) q = ws(this, G[l + F], c, F), q === Pe && (q = this._$AH[F]), $ || ($ = !Fn(q) || q !== this._$AH[F]), q === vt ? n = vt : n !== vt && (n += (q ?? "") + N[F + 1]), this._$AH[F] = q;
    }
    $ && !o && this.j(n);
  }
  j(n) {
    n === vt ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, n ?? "");
  }
}
class Z0 extends Xa {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(n) {
    this.element[this.name] = n === vt ? void 0 : n;
  }
}
class K0 extends Xa {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(n) {
    this.element.toggleAttribute(this.name, !!n && n !== vt);
  }
}
class J0 extends Xa {
  constructor(n, c, l, o, N) {
    super(n, c, l, o, N), this.type = 5;
  }
  _$AI(n, c = this) {
    if ((n = ws(this, n, c, 0) ?? vt) === Pe) return;
    const l = this._$AH, o = n === vt && l !== vt || n.capture !== l.capture || n.once !== l.once || n.passive !== l.passive, N = n !== vt && (l === vt || o);
    o && this.element.removeEventListener(this.name, this, l), N && this.element.addEventListener(this.name, this, n), this._$AH = n;
  }
  handleEvent(n) {
    var c;
    typeof this._$AH == "function" ? this._$AH.call(((c = this.options) == null ? void 0 : c.host) ?? this.element, n) : this._$AH.handleEvent(n);
  }
}
class Q0 {
  constructor(n, c, l) {
    this.element = n, this.type = 6, this._$AN = void 0, this._$AM = c, this.options = l;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(n) {
    ws(this, n);
  }
}
const ur = Nn.litHtmlPolyfillSupport;
ur == null || ur(An, Tn), (Nn.litHtmlVersions ?? (Nn.litHtmlVersions = [])).push("3.3.2");
const tp = (k, n, c) => {
  const l = (c == null ? void 0 : c.renderBefore) ?? n;
  let o = l._$litPart$;
  if (o === void 0) {
    const N = (c == null ? void 0 : c.renderBefore) ?? null;
    l._$litPart$ = o = new Tn(n.insertBefore(En(), N), N, void 0, c ?? {});
  }
  return o._$AI(k), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ae = globalThis;
let xs = class extends _s {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var c;
    const n = super.createRenderRoot();
    return (c = this.renderOptions).renderBefore ?? (c.renderBefore = n.firstChild), n;
  }
  update(n) {
    const c = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(n), this._$Do = tp(c, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var n;
    super.connectedCallback(), (n = this._$Do) == null || n.setConnected(!0);
  }
  disconnectedCallback() {
    var n;
    super.disconnectedCallback(), (n = this._$Do) == null || n.setConnected(!1);
  }
  render() {
    return Pe;
  }
};
var ch;
xs._$litElement$ = !0, xs.finalized = !0, (ch = Ae.litElementHydrateSupport) == null || ch.call(Ae, { LitElement: xs });
const dr = Ae.litElementPolyfillSupport;
dr == null || dr({ LitElement: xs });
(Ae.litElementVersions ?? (Ae.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const op = { CHILD: 2 }, ep = (k) => (...n) => ({ _$litDirective$: k, values: n });
class sp {
  constructor(n) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(n, c, l) {
    this._$Ct = n, this._$AM = c, this._$Ci = l;
  }
  _$AS(n, c) {
    return this.update(n, c);
  }
  update(n, c) {
    return this.render(...c);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class pr extends sp {
  constructor(n) {
    if (super(n), this.it = vt, n.type !== op.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(n) {
    if (n === vt || n == null) return this._t = void 0, this.it = n;
    if (n === Pe) return n;
    if (typeof n != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (n === this.it) return this._t;
    this.it = n;
    const c = [n];
    return c.raw = c, this._t = { _$litType$: this.constructor.resultType, strings: c, values: [] };
  }
}
pr.directiveName = "unsafeHTML", pr.resultType = 1;
const np = ep(pr), _r = class _r extends xs {
  constructor() {
    super(...arguments), this._config = {};
  }
  setConfig(n) {
    this._config = n || {};
  }
  set hass(n) {
    this._hass = n, this.requestUpdate();
  }
  _setConfigValue(n, c) {
    if (!this._config) return;
    const l = { ...this._config };
    c === "" || c === void 0 || c === null ? delete l[n] : l[n] = c, this._config = l, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: l },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _valueChanged(n) {
    var N;
    const c = n.target, l = c == null ? void 0 : c.configValue;
    if (!l) return;
    let o = ((N = n.detail) == null ? void 0 : N.value) ?? c.value;
    if (c.checked !== void 0 && (o = c.checked), c.type === "number") {
      const $ = Number(o);
      Number.isNaN($) || (o = $);
    }
    this._setConfigValue(l, o);
  }
  _setNumberEntityValue(n, c) {
    !this._hass || !n || this._hass.callService("number", "set_value", { entity_id: n, value: c });
  }
  _setSelectEntityOption(n, c) {
    !this._hass || !n || !c || this._hass.callService("select", "select_option", { entity_id: n, option: c });
  }
  _setIntegrationOptions(n) {
    this._hass && this._hass.callService("sunlight_visualizer", "set_options", n);
  }
  _supportsEntityPicker() {
    var n;
    try {
      const c = globalThis == null ? void 0 : globalThis.customElements;
      return !!((n = c == null ? void 0 : c.get) != null && n.call(c, "ha-entity-picker"));
    } catch {
      return !1;
    }
  }
  render() {
    var Ms, he, Oe, Rs, Cs, He, Dn, ks, bo, ue, zn, Bn, Ln, Wn, Ns, Es, Ie, Ve, Ya, Fs, Io, de, Ge, As, On, Hn, In, Vn, Ue, Za, Eo, fe, je, Vo, Jt, Ts, Gn, Ps, Ds, Un, zs, Bs, Ls, Ws, jn, qe, Go, Uo, Xe, zt, yt, qn, Xn, pe, jo, J, Ye, Ze, Yn, Zn, me, so, Kn, Jn, Qn, Os, Hs, Is, Vs, Ke, Gs, Us, ta, oa, ea, sa, na, js, aa, ia, qs, ra, ca, Je, la, ha, Xs, Ys, Zs, Ks, Js, be;
    if (!this._hass) return oo``;
    const n = this._config || {}, c = n.siSourceAttr ?? "sunlight_visualizer_source", l = n.siSourceValue ?? "sunlight_visualizer", o = Object.entries(this._hass.states ?? {}).filter(
      ([, _]) => {
        var W;
        return ((W = _ == null ? void 0 : _.attributes) == null ? void 0 : W[c]) === l;
      }
    ), N = (_) => {
      for (const [W, Y] of o)
        if (_(Y, W)) return W;
      return null;
    }, $ = (_) => N((W) => {
      var Y;
      return ((Y = W == null ? void 0 : W.attributes) == null ? void 0 : Y.camera_rotation) === _;
    }), G = (_) => N((W) => {
      var Y;
      return ((Y = W == null ? void 0 : W.attributes) == null ? void 0 : Y.si_setting) === _;
    }), F = n.rotationHEntity ?? $("h") ?? "", q = n.rotationVEntity ?? $("v") ?? "", Q = n.houseAngleEntity ?? G("house_angle") ?? "", j = G("ceiling_tilt") ?? "", mt = G("house_direction") ?? "", ct = G("roof_direction") ?? "", et = (_, W = !1) => {
      if (_ == null || _ === "") return W;
      if (typeof _ == "boolean") return _;
      if (typeof _ == "number") return _ !== 0;
      if (typeof _ == "string") {
        const Y = _.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(Y)) return !0;
        if (["false", "0", "no", "off"].includes(Y)) return !1;
      }
      return W;
    }, z = (_) => {
      var Nt, Wt, Qs;
      const W = typeof _ == "string" ? _ : String((_ == null ? void 0 : _.entity_id) ?? (_ == null ? void 0 : _.entityId) ?? "");
      if (!W.startsWith("sensor.")) return !1;
      const Y = typeof _ == "object" && (_ != null && _.attributes) ? _ : (Wt = (Nt = this._hass) == null ? void 0 : Nt.states) == null ? void 0 : Wt[W];
      return String(((Qs = Y == null ? void 0 : Y.attributes) == null ? void 0 : Qs.device_class) ?? "").toLowerCase() === "power";
    }, ht = (_, W, Y) => this._supportsEntityPicker() ? oo`
          <ha-entity-picker
            .hass=${this._hass}
            .label=${_}
            .value=${W}
            .includeDomains=${["sensor"]}
            .entityFilter=${z}
            .allowCustomEntity=${!1}
            .clearable=${!0}
            @value-changed=${(Nt) => {
      var Wt;
      return Y((Wt = Nt.detail) == null ? void 0 : Wt.value);
    }}
          ></ha-entity-picker>
        ` : oo`
        <ha-selector
          .hass=${this._hass}
          .label=${_}
          .selector=${{ entity: { filter: [{ domain: "sensor", device_class: "power" }] } }}
          .value=${W}
          @value-changed=${(Nt) => {
      var Wt;
      return Y((Wt = Nt.detail) == null ? void 0 : Wt.value);
    }}
        ></ha-selector>
      `;
    let Vt = "", Gt, Ut, Zt, nt;
    for (const [, _] of o)
      !Vt && ((Ms = _ == null ? void 0 : _.attributes) != null && Ms.roof_power_entity) && (Vt = _.attributes.roof_power_entity), Gt === void 0 && ((he = _ == null ? void 0 : _.attributes) == null ? void 0 : he.roof_power_enabled) !== void 0 && (Gt = _.attributes.roof_power_enabled), Ut === void 0 && ((Oe = _ == null ? void 0 : _.attributes) == null ? void 0 : Oe.roof_power_invert) !== void 0 && (Ut = _.attributes.roof_power_invert), Zt === void 0 && ((Rs = _ == null ? void 0 : _.attributes) == null ? void 0 : Rs.fixed_sun_rotation_enabled) !== void 0 && (Zt = _.attributes.fixed_sun_rotation_enabled), nt === void 0 && ((Cs = _ == null ? void 0 : _.attributes) == null ? void 0 : Cs.fixed_sun_azimuth) !== void 0 && (nt = _.attributes.fixed_sun_azimuth);
    const it = n.preferIntegrationSettings ?? !0, Dt = o.length > 0, fo = it ? Vt || n.roofPowerEntity || "" : n.roofPowerEntity || Vt || "", Kt = it ? et(Gt, et(n.roofPowerEnabled, !1)) : et(n.roofPowerEnabled, et(Gt, !1)), gt = it ? et(Ut, et(n.roofPowerInvert, !1)) : et(n.roofPowerInvert, et(Ut, !1)), po = Number((ks = (Dn = (He = o.find(([, _]) => {
      var W;
      return ((W = _ == null ? void 0 : _.attributes) == null ? void 0 : W.auto_rotate_speed) != null;
    })) == null ? void 0 : He[1]) == null ? void 0 : Dn.attributes) == null ? void 0 : ks.auto_rotate_speed), De = it && Number.isFinite(po) ? po : Number(n.autoRotateSpeed ?? (Number.isFinite(po) ? po : 25));
    Number(((zn = (ue = (bo = this._hass) == null ? void 0 : bo.states) == null ? void 0 : ue[Q]) == null ? void 0 : zn.state) ?? n.houseAngle ?? 0);
    const ae = ["North", "NE", "East", "SE", "South", "SW", "West", "NW", "Custom"], ie = ["front", "back", "left", "right"], Wo = !!mt, re = !!ct, vs = Wo ? ((Ns = (Wn = (Ln = (Bn = this._hass) == null ? void 0 : Bn.states) == null ? void 0 : Ln[mt]) == null ? void 0 : Wn.attributes) == null ? void 0 : Ns.options) ?? ae : ae, Ss = re ? ((Ya = (Ve = (Ie = (Es = this._hass) == null ? void 0 : Es.states) == null ? void 0 : Ie[ct]) == null ? void 0 : Ve.attributes) == null ? void 0 : Ya.options) ?? ie : ie, ce = Wo ? ((de = (Io = (Fs = this._hass) == null ? void 0 : Fs.states) == null ? void 0 : Io[mt]) == null ? void 0 : de.state) ?? "Custom" : n.houseDirection ?? "Custom", ft = re ? ((On = (As = (Ge = this._hass) == null ? void 0 : Ge.states) == null ? void 0 : As[ct]) == null ? void 0 : On.state) ?? "front" : n.roofTiltFace ?? "front", le = !!F, No = !!q, ze = !!j, mo = Number(it ? nt ?? n.fixedSunAzimuthDeg ?? 225 : n.fixedSunAzimuthDeg ?? nt ?? 225), Pt = Math.min(359, Math.max(0, Number.isFinite(mo) ? mo : 225)), Oo = it ? et(Zt, et(n.fixedSunRotationEnabled, !1)) : et(n.fixedSunRotationEnabled, et(Zt, !1)), eo = Number(
      (Vn = (In = (Hn = o.find(([, _]) => {
        var W;
        return ((W = _ == null ? void 0 : _.attributes) == null ? void 0 : W.sun_azimuth) != null;
      })) == null ? void 0 : Hn[1]) == null ? void 0 : In.attributes) == null ? void 0 : Vn.sun_azimuth
    ), $o = Number((fe = (Eo = (Za = (Ue = this._hass) == null ? void 0 : Ue.states) == null ? void 0 : Za["sun.sun"]) == null ? void 0 : Eo.attributes) == null ? void 0 : fe.azimuth), Be = Number.isFinite(eo) ? eo : Number.isFinite($o) ? $o : Pt, _o = et(n.powerlineEnabled, !0), Ho = et(n.powerlinePulseEnabled, !0), Le = Math.min(60, Math.max(1, Math.round(Number(n.powerlinePulseIntervalSec ?? 5)))), Rt = n.gridFlowEntity ?? "", jt = et(n.gridFlowInvert, !1), Ct = et(n.energyHudEnabled, !0), We = et(n.energyHudAutoCompact, !0), kt = et(n.energyHudRoofAlignmentEnabled, !0), Pn = Math.min(0.95, Math.max(0.12, Number(n.energyHudOpacity ?? 0.45)));
    return oo`
      <div class="section">
        <div class="title">Size</div>
        <div class="row">
          <ha-textfield
            label="Card width (px)"
            type="number"
            .value=${String(n.cardWidth ?? 450)}
            .configValue=${"cardWidth"}
            @change=${this._valueChanged}
          ></ha-textfield>
          <ha-textfield
            label="Card height (px)"
            type="number"
            .value=${String(n.cardHeight ?? 450)}
            .configValue=${"cardHeight"}
            @change=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row single">
          <div class="switch-row">
            <span>Auto-scale Width</span>
            <ha-switch
              .checked=${n.autoScaleWidth ?? !0}
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
              .value=${Number(((Jt = (Vo = (je = this._hass) == null ? void 0 : je.states) == null ? void 0 : Vo[Q]) == null ? void 0 : Jt.state) ?? 0)}
              .min=${Number(((Ds = (Ps = (Gn = (Ts = this._hass) == null ? void 0 : Ts.states) == null ? void 0 : Gn[Q]) == null ? void 0 : Ps.attributes) == null ? void 0 : Ds.min) ?? 0)}
              .max=${Number(((Ls = (Bs = (zs = (Un = this._hass) == null ? void 0 : Un.states) == null ? void 0 : zs[Q]) == null ? void 0 : Bs.attributes) == null ? void 0 : Ls.max) ?? 359)}
              .step=${Number(((Go = (qe = (jn = (Ws = this._hass) == null ? void 0 : Ws.states) == null ? void 0 : jn[Q]) == null ? void 0 : qe.attributes) == null ? void 0 : Go.step) ?? 1)}
              @change=${(_) => {
      var W;
      return this._setNumberEntityValue(Q, Number(((W = _.target) == null ? void 0 : W.value) ?? 0));
    }}
              .disabled=${!Q}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"House direction"}
              .selector=${{ select: { options: vs, mode: "dropdown" } }}
              .value=${ce}
              @value-changed=${(_) => {
      var Y;
      const W = ((Y = _.detail) == null ? void 0 : Y.value) ?? ce;
      Wo ? (this._setSelectEntityOption(mt, W), this._setConfigValue("houseDirection", void 0)) : this._setConfigValue("houseDirection", W);
    }}
            ></ha-selector>
            <div class="helper">Select compass direction your front door is facing.</div>
          </div>
        </div>
        <div class="row">
          <div>
            <div class="slider-label">Ceiling tilt</div>
            <ha-slider
              .value=${Number(((zt = (Xe = (Uo = this._hass) == null ? void 0 : Uo.states) == null ? void 0 : Xe[j]) == null ? void 0 : zt.state) ?? 0)}
              .min=${Number(((pe = (Xn = (qn = (yt = this._hass) == null ? void 0 : yt.states) == null ? void 0 : qn[j]) == null ? void 0 : Xn.attributes) == null ? void 0 : pe.min) ?? 0)}
              .max=${Number(((Ze = (Ye = (J = (jo = this._hass) == null ? void 0 : jo.states) == null ? void 0 : J[j]) == null ? void 0 : Ye.attributes) == null ? void 0 : Ze.max) ?? 90)}
              .step=${Number(((so = (me = (Zn = (Yn = this._hass) == null ? void 0 : Yn.states) == null ? void 0 : Zn[j]) == null ? void 0 : me.attributes) == null ? void 0 : so.step) ?? 1)}
              @change=${(_) => {
      var W;
      return this._setNumberEntityValue(j, Number(((W = _.target) == null ? void 0 : W.value) ?? 0));
    }}
              .disabled=${!ze}
            ></ha-slider>
          </div>
          <div>
            <ha-selector
              .hass=${this._hass}
              .label=${"Roof direction"}
              .selector=${{ select: { options: Ss, mode: "dropdown" } }}
              .value=${ft}
              @value-changed=${(_) => {
      var Y;
      const W = ((Y = _.detail) == null ? void 0 : Y.value) ?? ft;
      re ? (this._setSelectEntityOption(ct, W), this._setConfigValue("roofTiltFace", void 0)) : this._setConfigValue("roofTiltFace", W);
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
              .value=${Number(((Qn = (Jn = (Kn = this._hass) == null ? void 0 : Kn.states) == null ? void 0 : Jn[F]) == null ? void 0 : Qn.state) ?? 0)}
              .min=${Number(((Vs = (Is = (Hs = (Os = this._hass) == null ? void 0 : Os.states) == null ? void 0 : Hs[F]) == null ? void 0 : Is.attributes) == null ? void 0 : Vs.min) ?? 0)}
              .max=${Number(((ta = (Us = (Gs = (Ke = this._hass) == null ? void 0 : Ke.states) == null ? void 0 : Gs[F]) == null ? void 0 : Us.attributes) == null ? void 0 : ta.max) ?? 359)}
              .step=${Number(((na = (sa = (ea = (oa = this._hass) == null ? void 0 : oa.states) == null ? void 0 : ea[F]) == null ? void 0 : sa.attributes) == null ? void 0 : na.step) ?? 1)}
              @change=${(_) => {
      var W;
      return this._setNumberEntityValue(F, Number(((W = _.target) == null ? void 0 : W.value) ?? 0));
    }}
              .disabled=${!le}
            ></ha-slider>
          </div>
          <div>
            <div class="slider-label">Camera rotation V</div>
            <ha-slider
              .value=${Number(((ia = (aa = (js = this._hass) == null ? void 0 : js.states) == null ? void 0 : aa[q]) == null ? void 0 : ia.state) ?? 0)}
              .min=${Number(((Je = (ca = (ra = (qs = this._hass) == null ? void 0 : qs.states) == null ? void 0 : ra[q]) == null ? void 0 : ca.attributes) == null ? void 0 : Je.min) ?? 0)}
              .max=${Number(((Ys = (Xs = (ha = (la = this._hass) == null ? void 0 : la.states) == null ? void 0 : ha[q]) == null ? void 0 : Xs.attributes) == null ? void 0 : Ys.max) ?? 90)}
              .step=${Number(((be = (Js = (Ks = (Zs = this._hass) == null ? void 0 : Zs.states) == null ? void 0 : Ks[q]) == null ? void 0 : Js.attributes) == null ? void 0 : be.step) ?? 1)}
              @change=${(_) => {
      var W;
      return this._setNumberEntityValue(q, Number(((W = _.target) == null ? void 0 : W.value) ?? 0));
    }}
              .disabled=${!No}
            ></ha-slider>
          </div>
        </div>
        <div class="row">
          <div>${F || "Camera rotation H not found"}</div>
          <div>${q || "Camera rotation V not found"}</div>
        </div>
      </div>

      <div class="section">
        <div class="title">Fixed sun position, azimuth. (Rotate scene)</div>
        <div class="row single">
          <div class="switch-row">
            <span>Fixed sun position, azimuth. (Rotate scene)</span>
            <ha-switch
              .checked=${Oo}
              @change=${(_) => {
      var Nt;
      const W = !!((Nt = _.target) != null && Nt.checked);
      if (Dt ? (this._setIntegrationOptions({ fixed_sun_rotation_enabled: W }), this._setConfigValue("fixedSunRotationEnabled", void 0)) : this._setConfigValue("fixedSunRotationEnabled", W), !W) return;
      const Y = Math.min(359, Math.max(0, Math.round(Be)));
      Dt ? (this._setIntegrationOptions({ fixed_sun_azimuth: Y }), this._setConfigValue("fixedSunAzimuthDeg", void 0)) : this._setConfigValue("fixedSunAzimuthDeg", Y);
    }}
            ></ha-switch>
          </div>
          <div class="helper">Keep sun azimuth visually fixed and rotate the scene instead</div>
        </div>
      </div>

      <div class="section">
        <div class="title">Grid connection</div>
        <div class="row single">
          ${ht(
      "Grid flow sensor (power)",
      Rt,
      (_) => this._setConfigValue("gridFlowEntity", _ || void 0)
    )}
          <div class="helper">Optional whole-house/grid power sensor. When valid, this drives pulse direction and overrides roof power flow.</div>
          <div class="switch-row">
            <span>Invert grid flow sign</span>
            <ha-switch
              .checked=${jt}
              .configValue=${"gridFlowInvert"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>
          <div class="switch-row">
            <span>Enable powerline & pole</span>
            <ha-switch
              .checked=${_o}
              .configValue=${"powerlineEnabled"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>
          <div class="switch-row">
            <span>Enable power pulse</span>
            <ha-switch
              .checked=${Ho}
              .configValue=${"powerlinePulseEnabled"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>
          <ha-textfield
            label="Pulse interval (seconds)"
            type="number"
            min="1"
            max="60"
            step="1"
            .value=${String(Le)}
            .configValue=${"powerlinePulseIntervalSec"}
            @change=${this._valueChanged}
          ></ha-textfield>
        </div>
      </div>

      <div class="section">
        <div class="title">Roof power</div>
        <div class="row single">
          ${ht(
      "Roof power sensor (power)",
      fo,
      (_) => {
        Dt ? (this._setIntegrationOptions({ roof_power_entity: _ || null }), this._setConfigValue("roofPowerEntity", void 0)) : this._setConfigValue("roofPowerEntity", _ || void 0);
      }
    )}
        </div>
        <div class="row single">
          <div class="switch-row">
            <span>Enable power label</span>
            <ha-switch
              .checked=${Kt ?? !1}
              @change=${(_) => {
      var Y;
      const W = !!((Y = _.target) != null && Y.checked);
      Dt ? (this._setIntegrationOptions({ roof_power_enabled: W }), this._setConfigValue("roofPowerEnabled", void 0)) : this._setConfigValue("roofPowerEnabled", W);
    }}
            ></ha-switch>
          </div>
          <div class="switch-row">
            <span>Invert power value</span>
            <ha-switch
              .checked=${gt ?? !1}
              @change=${(_) => {
      var Y;
      const W = !!((Y = _.target) != null && Y.checked);
      Dt ? (this._setIntegrationOptions({ roof_power_invert: W }), this._setConfigValue("roofPowerInvert", void 0)) : this._setConfigValue("roofPowerInvert", W);
    }}
            ></ha-switch>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="title">Energy HUD</div>
        <div class="row single">
          <div class="switch-row">
            <span>Show energy HUD</span>
            <ha-switch
              .checked=${Ct}
              .configValue=${"energyHudEnabled"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>
          <div class="switch-row">
            <span>Auto-compact on small cards</span>
            <ha-switch
              .checked=${We}
              .configValue=${"energyHudAutoCompact"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>
          <div class="switch-row">
            <span>Show roof alignment details</span>
            <ha-switch
              .checked=${kt}
              .configValue=${"energyHudRoofAlignmentEnabled"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>
          <ha-textfield
            label="HUD opacity (0.12 - 0.95)"
            type="number"
            min="0.12"
            max="0.95"
            step="0.01"
            .value=${String(Pn)}
            .configValue=${"energyHudOpacity"}
            @change=${this._valueChanged}
          ></ha-textfield>
        </div>
      </div>

      <div class="section">
        <div class="title">Auto‑rotate</div>
        <div class="row single">
          <ha-textfield
            label="Speed (deg/sec)"
            type="number"
            .value=${String(De)}
            min="1"
            max="90"
            step="1"
            .configValue=${"autoRotateSpeed"}
            @change=${(_) => {
      var Nt, Wt;
      const W = ((Nt = _ == null ? void 0 : _.detail) == null ? void 0 : Nt.value) ?? ((Wt = _ == null ? void 0 : _.target) == null ? void 0 : Wt.value);
      let Y = Math.round(Number(W));
      Number.isNaN(Y) || (Y = Math.min(90, Math.max(1, Y)), Dt ? (this._setIntegrationOptions({ auto_rotate_speed: Y }), this._setConfigValue("autoRotateSpeed", void 0)) : this._setConfigValue("autoRotateSpeed", Y));
    }}
          ></ha-textfield>
        </div>
      </div>
    `;
  }
};
_r.styles = hh`
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
let mr = _r;
const ih = "sunlight-visualizer-card-editor";
if (!customElements.get(ih))
  try {
    customElements.define(ih, mr);
  } catch {
  }
const xr = class xr extends xs {
  constructor() {
    super(...arguments), this._config = {}, this._resizeObserver = null, this._hostWidth = 0, this._energyHudExpanded = !1;
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
      fixedSunAzimuthDeg: 225,
      gridFlowEntity: "",
      gridFlowInvert: !1,
      energyHudEnabled: !0,
      energyHudAutoCompact: !0,
      energyHudRoofAlignmentEnabled: !0,
      energyHudCompactAtPx: 360,
      energyHudUltraCompactAtPx: 300,
      energyHudOpacity: 0.45,
      powerlineEnabled: !0,
      powerlinePulseEnabled: !0,
      powerlinePulseIntervalSec: 5,
      powerPoleX: 2.2,
      powerPoleZ: 2.2
    };
  }
  setConfig(n) {
    this._config = n || {};
  }
  set hass(n) {
    this._hass = n, this.requestUpdate();
  }
  connectedCallback() {
    super.connectedCallback(), !(typeof ResizeObserver > "u" || this._resizeObserver) && (this._hostWidth = this.clientWidth || 0, this._resizeObserver = new ResizeObserver((n) => {
      var l, o;
      const c = Number(((o = (l = n == null ? void 0 : n[0]) == null ? void 0 : l.contentRect) == null ? void 0 : o.width) ?? this.clientWidth ?? 0);
      Math.abs(c - this._hostWidth) > 0.5 && (this._hostWidth = c, this.requestUpdate());
    }), this._resizeObserver.observe(this));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._resizeObserver && (this._resizeObserver.disconnect(), this._resizeObserver = null), this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null), this._manualRotateTimer && (clearInterval(this._manualRotateTimer), this._manualRotateTimer = null), this._cssFpsRaf && (cancelAnimationFrame(this._cssFpsRaf), this._cssFpsRaf = null), this._cssFpsCalibRaf && (cancelAnimationFrame(this._cssFpsCalibRaf), this._cssFpsCalibRaf = null), this._cssGlobalTickTimer && (clearInterval(this._cssGlobalTickTimer), this._cssGlobalTickTimer = null, this._cssGlobalTickFps = 0);
  }
  getCardSize() {
    return 4;
  }
  _getEffectiveCardSize(n) {
    const c = Math.max(1, Number(n.cardWidth ?? 450)), l = Math.max(1, Number(n.cardHeight ?? 450));
    if (!(n.autoScaleWidth ?? !0))
      return { cardW: c, cardH: l };
    const N = 250, $ = Number(this._hostWidth || this.clientWidth || 0), G = $ > 0 ? $ : c, F = Math.min(c, Math.max(N, Math.floor(G))), q = F / c, Q = Math.max(1, Math.round(l * q));
    return { cardW: F, cardH: Q };
  }
  _stopManualRotate() {
    const n = !!this._manualRotateEnabled;
    this._manualRotateTimer && (clearInterval(this._manualRotateTimer), this._manualRotateTimer = null), this._manualRotateEnabled = !1, this._manualRotateAxis = null, this._manualRotateDir = 0, this._manualRotateAccumDeg = 0, this._manualRotateTargetDeg = 0, this._manualRotateLastTick = 0, this._manualRotateIntervalMs = 0, n && (this._cssRecalibrateRequested = !0), this.requestUpdate();
  }
  _startManualRotate(n, c) {
    const l = () => typeof performance < "u" && performance.now ? performance.now() : Date.now(), o = Number(this._autoRotateSpeed || 25), N = Number(this._rotationIntervalMsFloor || this._autoRotateIntervalMs || 50), $ = Math.max(1, Number(this._autoRotateTurnCount || 1));
    this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate(), this._manualRotateEnabled = !0, this._manualRotateAxis = n, this._manualRotateDir = c, this._manualRotateAccumDeg = 0, this._manualRotateTargetDeg = n === "h" ? 360 * $ : 0, this._manualRotateLastTick = l(), this._manualRotateIntervalMs = N, this._manualRotateVOffsetDeg || (this._manualRotateVOffsetDeg = 0), this._manualRotateTimer = setInterval(() => {
      const G = l(), F = this._manualRotateLastTick || G, q = Math.max(0, G - F) / 1e3;
      if (this._manualRotateLastTick = G, !this._manualRotateEnabled) return;
      const Q = this._manualRotateAxis === "v" ? 0.5 : 1, j = o * Q * q * (this._manualRotateDir || 1);
      if (this._manualRotateAxis === "h") {
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + j, this._manualRotateAccumDeg = (this._manualRotateAccumDeg || 0) + Math.abs(j), this._manualRotateAccumDeg >= (this._manualRotateTargetDeg || 360)) {
          this._stopManualRotate();
          return;
        }
      } else if (this._manualRotateAxis === "v") {
        const mt = Number(this._manualRotateBaseVDeg ?? 35), ct = Number(this._manualRotateVOffsetDeg || 0), et = Math.min(90, Math.max(0, mt + ct)), z = Math.min(90, Math.max(0, et + j));
        if (this._manualRotateVOffsetDeg = ct + (z - et), this._manualRotateAccumDeg = (this._manualRotateAccumDeg || 0) + Math.abs(z - et), z <= 1e-3 || z >= 89.999) {
          this._stopManualRotate();
          return;
        }
      }
      this._updateTimerMS = Date.now(), this.requestUpdate();
    }, N), this.requestUpdate();
  }
  _handleControlTap(n, c, l) {
    if (l.preventDefault(), l.stopPropagation(), n === "h" ? !!(this._autoRotateEnabled || this._manualRotateEnabled && this._manualRotateAxis === "h") : !!(this._manualRotateEnabled && this._manualRotateAxis === "v")) {
      this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate();
      return;
    }
    this._startManualRotate(n, c);
  }
  _normDeg(n) {
    const c = n % 360;
    return c < 0 ? c + 360 : c;
  }
  _degDiffAbs(n, c) {
    const l = (n - c + 540) % 360 - 180;
    return Math.abs(l);
  }
  async _setNumericEntityValue(n, c) {
    var o;
    if (!n || !((o = this._hass) != null && o.callService)) return;
    const l = n.split(".")[0];
    if (l)
      try {
        await this._hass.callService(l, "set_value", { entity_id: n, value: c });
      } catch {
      }
  }
  async _setIntegrationOptions(n) {
    var c;
    if (!((c = this._hass) != null && c.callService)) return !1;
    try {
      return await this._hass.callService("sunlight_visualizer", "set_options", n), !0;
    } catch {
      return !1;
    }
  }
  async _saveCurrentCamera(n) {
    var ht, Vt, Gt, Ut, Zt;
    n.preventDefault(), n.stopPropagation(), this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate();
    const c = Number(this._currentCameraH ?? 0), l = Number(this._currentCameraV ?? 35), o = this._rotationHEntity, N = this._rotationVEntity, $ = !!this._fixedSunRotationEnabled, G = this._fixedSunAzimuthEntity, F = Number(this._currentSunAzimuthReal), q = Number(this._fixedSunSceneCompDeg ?? 0), Q = $ ? this._normDeg(c + q) : this._normDeg(c), j = Math.max(0, Math.min(90, l));
    this._cameraSavedBaseHOverride = Q, this._cameraSavedBaseVOverride = j, this._autoRotateOffsetDeg = 0, this._manualRotateVOffsetDeg = 0, $ && Number.isFinite(F) && (this._fixedSunAzimuthOverride = this._normDeg(F));
    const mt = ((ht = this._config) == null ? void 0 : ht.siSourceAttr) ?? "sunlight_visualizer_source", ct = ((Vt = this._config) == null ? void 0 : Vt.siSourceValue) ?? "sunlight_visualizer", et = (nt) => {
      var it, Dt, fo, Kt;
      return nt ? ((Kt = (fo = (Dt = (it = this._hass) == null ? void 0 : it.states) == null ? void 0 : Dt[nt]) == null ? void 0 : fo.attributes) == null ? void 0 : Kt[mt]) === ct : !1;
    };
    if (!!((Zt = (Ut = (Gt = this._hass) == null ? void 0 : Gt.services) == null ? void 0 : Ut.sunlight_visualizer) != null && Zt.set_options) && et(o) && et(N)) {
      const nt = {
        camera_rotation_h: Math.round(this._normDeg(Q)),
        camera_rotation_v: Math.round(j)
      };
      if ($ && Number.isFinite(F) && (nt.fixed_sun_azimuth = Math.round(this._normDeg(F))), await this._setIntegrationOptions(nt)) {
        this.requestUpdate();
        return;
      }
    }
    await this._setNumericEntityValue(o, Q), await this._setNumericEntityValue(N, j), $ && G && Number.isFinite(F) && await this._setNumericEntityValue(G, this._normDeg(F)), this.requestUpdate();
  }
  _restoreSavedCamera(n) {
    n.preventDefault(), n.stopPropagation(), this._autoRotateEnabled && this._autoRotateStop && this._autoRotateStop(), this._stopManualRotate(), this._autoRotateOffsetDeg = 0, this._manualRotateVOffsetDeg = 0, this.requestUpdate();
  }
  _toggleEnergyHud(n) {
    n.preventDefault(), n.stopPropagation(), this._energyHudExpanded = !this._energyHudExpanded, this.requestUpdate();
  }
  render() {
    if (!this._hass)
      return oo`<ha-card></ha-card>`;
    const n = this._config || {}, { cardW: c, cardH: l } = this._getEffectiveCardSize(n), o = Math.min(c, l), N = this.renderSvg(c, l), $ = this._energyHudOverlay, G = !!($ != null && $.enabled) && !!($ != null && $.iconOnly);
    !G && this._energyHudExpanded && (this._energyHudExpanded = !1);
    const F = !!(this._autoRotateEnabled || this._manualRotateEnabled && this._manualRotateAxis === "h"), q = !!(this._manualRotateEnabled && this._manualRotateAxis === "v"), Q = this._normDeg(Number(this._currentCameraH ?? 0)), j = Math.max(0, Math.min(90, Number(this._currentCameraV ?? 35))), mt = this._normDeg(Number(this._savedCameraH ?? Q)), ct = Math.max(0, Math.min(90, Number(this._savedCameraV ?? j))), et = this._degDiffAbs(Q, mt) > 0.25 || Math.abs(j - ct) > 0.25, z = o < 400, ht = 43, Vt = 10, Gt = 10, Ut = (ft, le, No) => Math.max(le, Math.min(No, ft));
    let Zt = !0, nt = !0, it, Dt, fo, Kt, gt, po;
    if (z) {
      const No = Vt + ht + 8 + ht + 4, ze = c - (o < 260 ? 4 : 10), mo = Math.max(0, ze - No), Pt = o < 260 ? 2 : 8, Oo = 18;
      if (Zt = o >= 300 && mo >= ht * 3 + Pt * 2, Zt) {
        const Rt = Ut((mo - ht * 3) / 2, Pt, Oo), jt = ht * 3 + Rt * 2, Ct = No + Math.max(0, (mo - jt) / 2);
        it = Ct, fo = Ct + ht + Rt, Dt = fo + ht + Rt;
      } else {
        const Rt = Ut(mo - ht * 2, Pt, Oo), jt = ht * 2 + Rt, Ct = No + Math.max(0, (mo - jt) / 2);
        it = Ct, Dt = Ct + ht + Rt;
      }
      const eo = l - Gt - ht, $o = o < 260 ? 46 : 34, Be = eo - 8, _o = Math.max(0, Be - $o), Ho = o < 260 ? 2 : 6, Le = o < 260 ? 10 : 24;
      if (nt = o >= 300 && _o >= ht * 3 + Ho * 2, nt) {
        const Rt = Ut((_o - ht * 3) / 2, Ho, Le), jt = ht * 3 + Rt * 2, Ct = $o + Math.max(0, (_o - jt) / 2);
        Kt = Ct, po = Ct + ht + Rt, gt = po + ht + Rt;
      } else {
        const Rt = Ut(_o - ht * 2, Ho, 16), jt = ht * 2 + Rt, Ct = $o + Math.max(0, (_o - jt) / 2);
        Kt = Ct, gt = Ct + ht + Rt;
      }
    }
    const De = z && fo != null ? fo + ht * 0.5 : void 0, ae = z && po != null ? po + ht * 0.5 : void 0, ie = z && it != null ? `left:${it.toFixed(1)}px; bottom:${Gt}px;` : "", Wo = z && Dt != null ? `left:${Dt.toFixed(1)}px; bottom:${Gt}px;` : "", re = z && De != null ? `left:${De.toFixed(1)}px; bottom:${Gt}px;` : "", vs = z && Kt != null ? `left:${Vt}px; top:${Kt.toFixed(1)}px;` : "", Ss = z && gt != null ? `left:${Vt}px; top:${gt.toFixed(1)}px;` : "", ce = z && ae != null ? `left:${Vt}px; top:${ae.toFixed(1)}px;` : "";
    return oo`<div class="wrap">
      <ha-card style="width:${c}px; height:${l}px;">
        <div class="scene">${np(N)}</div>
        <button class="cam-btn cam-btn-save" title="Save Camera View" @pointerup=${(ft) => this._saveCurrentCamera(ft)}><ha-icon icon="mdi:content-save"></ha-icon></button>
        ${et ? oo`<button class="cam-btn cam-btn-restore" title="Restore Saved View" @pointerup=${(ft) => this._restoreSavedCamera(ft)}>↺</button>` : null}
        <button class="cam-btn cam-btn-h1 ${F ? "cam-btn-stop" : ""}" style=${ie} @pointerup=${(ft) => this._handleControlTap("h", 1, ft)}>${F ? "■" : "⇠"}</button>
        <button class="cam-btn cam-btn-h2 ${F ? "cam-btn-stop" : ""}" style=${Wo} @pointerup=${(ft) => this._handleControlTap("h", -1, ft)}>${F ? "■" : "⇢"}</button>
        <button class="cam-btn cam-btn-v1 ${q ? "cam-btn-stop" : ""}" style=${vs} @pointerup=${(ft) => this._handleControlTap("v", 1, ft)}>${q ? "■" : "⇡"}</button>
        <button class="cam-btn cam-btn-v2 ${q ? "cam-btn-stop" : ""}" style=${Ss} @pointerup=${(ft) => this._handleControlTap("v", -1, ft)}>${q ? "■" : "⇣"}</button>
        ${Zt ? oo`<div class="cam-readout cam-readout-h" style=${re}>${Math.round(Q)}°</div>` : null}
        ${nt ? oo`<div class="cam-readout cam-readout-v" style=${ce}>${Math.round(j)}°</div>` : null}
        ${G && !this._energyHudExpanded ? oo`<button class="energy-hud-btn" title="Energy Overview" @pointerup=${(ft) => this._toggleEnergyHud(ft)}>i</button>` : null}
        ${G && this._energyHudExpanded && $ ? oo`<div
              class="energy-hud-panel"
              title="Tap to close"
              style=${`top:${$.hudTop}px;right:${$.hudRight}px;width:${$.hudWidth}px;height:${$.hudHeight}px;background:${$.panelFill};`}
              @pointerup=${(ft) => this._toggleEnergyHud(ft)}
            >
              <div class="energy-hud-row"><span>SOLAR</span><span style="color:#ffe08c;">${$.solarText}</span></div>
              ${$.showRoofAlignment ? oo`
                    <div class="energy-hud-subrow" style="margin-top:2px;"><span>ALIGNMENT</span><span>${$.roofAlignmentDisplayText}</span></div>
                    <div class="energy-hud-row" style="margin-top:2px;"><span>HOME</span><span style=${`color:${$.homeColor};`}>${$.homeText}</span></div>
                    <div class="energy-hud-row" style="margin-top:2px;"><span>GRID</span><span style=${`color:${$.gridColor};`}>${$.gridText}</span></div>
                  ` : oo`
                    <div class="energy-hud-row"><span>HOME</span><span style=${`color:${$.homeColor};`}>${$.homeText}</span></div>
                    <div class="energy-hud-row" style="margin-top:2px;"><span>GRID</span><span style=${`color:${$.gridColor};`}>${$.gridText}</span></div>
                  `}
            </div>` : null}
      </ha-card>
    </div>`;
  }
  renderSvg(n, c) {
    var ll, hl, ul, dl, fl, pl, ml, bl, gl, yl, $l, _l, xl, wl, vl, Sl, Ml, Rl, Cl, kl, Nl, El, Fl, Al, Tl, Pl;
    const l = this._hass, o = this._config || {}, N = o.siSourceAttr ?? "sunlight_visualizer_source", $ = o.siSourceValue ?? "sunlight_visualizer", G = Object.entries(l.states ?? {}).filter(
      ([, t]) => {
        var e;
        return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e[N]) === $;
      }
    ), F = (t) => {
      for (const [e, s] of G)
        if (t(s, e)) return [e, s];
      return null;
    }, q = (t) => {
      const e = F((s) => {
        var a;
        return ((a = s == null ? void 0 : s.attributes) == null ? void 0 : a.wall) === t;
      });
      return e ? e[0] : void 0;
    }, Q = (t) => {
      const e = F((s) => {
        var a;
        return ((a = s == null ? void 0 : s.attributes) == null ? void 0 : a.camera_rotation) === t;
      });
      return e ? e[0] : void 0;
    }, j = (t) => {
      const e = F((s) => {
        var a;
        return ((a = s == null ? void 0 : s.attributes) == null ? void 0 : a.si_setting) === t;
      });
      return e ? e[0] : void 0;
    }, mt = F(
      (t) => {
        var e, s;
        return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.sun_azimuth) != null && ((s = t == null ? void 0 : t.attributes) == null ? void 0 : s.sun_elevation) != null;
      }
    ), ct = mt ? mt[1].attributes : null, et = F(
      (t) => {
        var e, s, a;
        return ((e = t == null ? void 0 : t.attributes) == null ? void 0 : e.roof_direction) != null || ((s = t == null ? void 0 : t.attributes) == null ? void 0 : s.ceiling_tilt) != null || ((a = t == null ? void 0 : t.attributes) == null ? void 0 : a.house_angle) != null;
      }
    ), z = et ? et[1].attributes : null, ht = !!(z != null && z.force_sun_fallback), Vt = Number(n ?? o.cardWidth ?? 450), Gt = Number(c ?? o.cardHeight ?? 450), Ut = Vt, Zt = Gt, nt = Ut, it = Zt, Dt = nt, fo = it, Kt = nt * 0.1, gt = o.floorScale ?? 2.6, po = nt * 0.5, De = it * 0.4, ae = o.floorColor ?? "#2f2f2f", ie = Number(o.floorCornerRadius ?? 26), Wo = Number(o.floorThicknessPx ?? 7), re = o.floorThicknessColor ?? "rgba(150,106,64,0.9)", vs = o.floorTopStrokeColor ?? "rgba(72,112,56,0.8)", Ss = Number(o.floorTopStrokeWidth ?? 1.4), ce = o.floorGrassEnabled ?? !0, ft = Number(o.floorGrassOpacity ?? 0.3), le = o.floorGrassColorA ?? "rgb(136,186,88)", No = o.floorGrassColorB ?? "rgb(96,150,62)", ze = o.rotationHEntity ?? Q("h") ?? "input_number.cube_rotation_h", mo = o.rotationVEntity ?? Q("v") ?? "input_number.cube_rotation_v";
    this._rotationHEntity = ze, this._rotationVEntity = mo;
    const Pt = o.preferIntegrationSettings ?? !0, Oo = o.houseAngleEntity ?? null;
    let eo = Number(o.houseAngle ?? 0);
    const $o = j("house_angle");
    Oo && l.states[Oo] ? eo = Number(((ll = l.states[Oo]) == null ? void 0 : ll.state) ?? eo) : $o && l.states[$o] ? eo = Number(((hl = l.states[$o]) == null ? void 0 : hl.state) ?? eo) : (Pt || o.houseAngle == null) && (z == null ? void 0 : z.house_angle) != null && (eo = Number(z.house_angle ?? eo));
    const Be = o.wallFrontPctEntity ?? q("front"), _o = o.wallRightPctEntity ?? q("right"), Ho = o.wallBackPctEntity ?? q("back"), Le = o.wallLeftPctEntity ?? q("left"), Rt = o.roofPctEntity ?? q("ceiling"), jt = o.roofAlignmentPctEntity ?? (() => {
      const t = F((e) => {
        var s;
        return ((s = e == null ? void 0 : e.attributes) == null ? void 0 : s.alignment_status) != null;
      });
      return t ? t[0] : void 0;
    })(), Ct = o.roofAlignmentStatusEntity ?? (() => {
      const t = F((e) => {
        var s;
        return ((s = e == null ? void 0 : e.attributes) == null ? void 0 : s.alignment_percentage) != null;
      });
      return t ? t[0] : void 0;
    })(), We = o.fixedSunAzimuthEntity ?? j("fixed_sun_azimuth") ?? null;
    this._fixedSunAzimuthEntity = We ?? void 0;
    const kt = (t, e = !1) => {
      if (t == null || t === "") return e;
      if (typeof t == "boolean") return t;
      if (typeof t == "number") return t !== 0;
      if (typeof t == "string") {
        const s = t.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(s)) return !0;
        if (["false", "0", "no", "off"].includes(s)) return !1;
      }
      return e;
    }, Pn = (t) => {
      var s, a;
      if (!t || typeof t != "string" || !t.startsWith("sensor.")) return !1;
      const e = (s = l.states) == null ? void 0 : s[t];
      return e ? String(((a = e.attributes) == null ? void 0 : a.device_class) ?? "").toLowerCase() === "power" : !1;
    }, Ms = Pt ? (z == null ? void 0 : z.roof_power_entity) ?? o.roofPowerEntity ?? null : o.roofPowerEntity ?? (z == null ? void 0 : z.roof_power_entity) ?? null, he = Pn(Ms) ? Ms : null, Oe = Pt ? kt(z == null ? void 0 : z.roof_power_enabled, kt(o.roofPowerEnabled, !1)) : kt(o.roofPowerEnabled, kt(z == null ? void 0 : z.roof_power_enabled, !1)), Rs = Pt ? kt(z == null ? void 0 : z.roof_power_invert, kt(o.roofPowerInvert, !1)) : kt(o.roofPowerInvert, kt(z == null ? void 0 : z.roof_power_invert, !1)), Cs = o.gridFlowEntity ?? null, He = Pn(Cs) ? Cs : null, Dn = kt(o.gridFlowInvert, !1), ks = Pt ? kt(
      z == null ? void 0 : z.fixed_sun_rotation_enabled,
      kt(o.fixedSunRotationEnabled, !1)
    ) : kt(
      o.fixedSunRotationEnabled,
      kt(z == null ? void 0 : z.fixed_sun_rotation_enabled, !1)
    );
    let bo = Number(Pt ? (z == null ? void 0 : z.fixed_sun_azimuth) ?? o.fixedSunAzimuthDeg ?? 225 : o.fixedSunAzimuthDeg ?? (z == null ? void 0 : z.fixed_sun_azimuth) ?? 225);
    const ue = Number(this._fixedSunAzimuthOverride);
    if (Number.isFinite(ue) && (bo = ue), We && l.states[We]) {
      const t = Number(((ul = l.states[We]) == null ? void 0 : ul.state) ?? bo);
      Number.isFinite(t) && (Number.isFinite(ue) && Math.abs((t - ue + 540) % 360 - 180) < 0.25 && (this._fixedSunAzimuthOverride = void 0), bo = t);
    }
    Number.isFinite(bo) || (bo = 225), bo = this._normDeg(bo), this._fixedSunRotationEnabled = ks;
    const zn = Be ? Number(((dl = l.states[Be]) == null ? void 0 : dl.state) ?? 0) : 0, Bn = _o ? Number(((fl = l.states[_o]) == null ? void 0 : fl.state) ?? 0) : 0, Ln = Ho ? Number(((pl = l.states[Ho]) == null ? void 0 : pl.state) ?? 0) : 0, Wn = Le ? Number(((ml = l.states[Le]) == null ? void 0 : ml.state) ?? 0) : 0, Ns = Rt ? Number(((bl = l.states[Rt]) == null ? void 0 : bl.state) ?? 0) : 0, Es = Oe && he ? Number((gl = l.states[he]) == null ? void 0 : gl.state) : NaN, Ie = he ? Number((yl = l.states[he]) == null ? void 0 : yl.state) : NaN, Ve = He ? Number(($l = l.states[He]) == null ? void 0 : $l.state) : NaN, Fs = Oe ? ((t) => Number.isFinite(t) ? t >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W` : "0 W")(Rs ? Math.abs(Es) : Es) : "", Io = Number.isFinite(Ie) ? Rs ? -Ie : Ie : NaN, de = Number.isFinite(Ve) ? Dn ? -Ve : Ve : NaN, Ge = Number.isFinite(de) ? de : Io, As = Number.isFinite(Ge) && Ge > 1e-6, On = kt(o.energyHudEnabled, !0);
    kt(o.energyHudAutoCompact, !0);
    const Hn = kt(o.energyHudRoofAlignmentEnabled, !0), In = Math.max(240, Number(o.energyHudUltraCompactAtPx ?? 300));
    Math.max(
      In + 20,
      Math.max(260, Number(o.energyHudCompactAtPx ?? 360))
    );
    const Vn = Math.min(0.95, Math.max(0.12, Number(o.energyHudOpacity ?? 0.45))), Ue = Number.isFinite(Io) ? Math.abs(Io) : NaN, Eo = !!He && Number.isFinite(de) ? de : NaN, fe = Number.isFinite(Eo) ? Math.abs(Eo) : NaN, je = Number.isFinite(Io) && Number.isFinite(Eo) ? Math.max(0, Math.abs(Io) - Eo) : NaN, Vo = Number.isFinite(Eo) ? Eo > 0 : null, Jt = (t) => Number.isFinite(t) ? Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W` : "--", Ts = jt ? Number((_l = l.states[jt]) == null ? void 0 : _l.state) : NaN, Gn = Ct ? Number((wl = (xl = l.states[Ct]) == null ? void 0 : xl.attributes) == null ? void 0 : wl.alignment_percentage) : NaN, Ps = Number.isFinite(Ts) ? Ts : Gn, Ds = Ct ? Number((Sl = (vl = l.states[Ct]) == null ? void 0 : vl.attributes) == null ? void 0 : Sl.minutes_to_optimal) : NaN, Un = jt ? Number((Rl = (Ml = l.states[jt]) == null ? void 0 : Ml.attributes) == null ? void 0 : Rl.minutes_to_optimal) : NaN, zs = Number.isFinite(Ds) ? Ds : Un, Bs = Number.isFinite(zs) ? zs > 0 ? "↑" : "↓" : "", Ls = Number.isFinite(Ps) ? `${Math.round(Ps)} %` : "--", Ws = Bs ? `${Bs} ${Ls}` : Ls, jn = o.useSunEntity ?? !1, qe = o.sunEntityId ?? "sun.sun", Go = o.sunAzEntity ?? null, Uo = o.sunElEntity ?? null;
    let Xe = Number(o.sunDistance ?? 3), zt = Number(o.sunAz ?? 135), yt = Number(o.sunEl ?? 55);
    const qn = Number(o.sunVisualElevationBiasDeg ?? 6), Xn = Number(o.sunVisualElevationScale ?? 1);
    Go && l.states[Go] && (zt = Number(((Cl = l.states[Go]) == null ? void 0 : Cl.state) ?? zt)), Uo && l.states[Uo] && (yt = Number(((kl = l.states[Uo]) == null ? void 0 : kl.state) ?? yt)), !Go && Pt && (ct == null ? void 0 : ct.sun_azimuth) != null && (zt = Number(ct.sun_azimuth ?? zt)), !Uo && Pt && (ct == null ? void 0 : ct.sun_elevation) != null && (yt = Number(ct.sun_elevation ?? yt)), !Go && !Uo && !ct && jn && l.states[qe] && (zt = Number(((Nl = l.states[qe].attributes) == null ? void 0 : Nl.azimuth) ?? zt), yt = Number(((El = l.states[qe].attributes) == null ? void 0 : El.elevation) ?? yt)), Number.isFinite(zt) || (zt = 135), zt = this._normDeg(zt), this._currentSunAzimuthReal = zt;
    const pe = o.roofTiltEnabled ?? !0;
    let jo = Number(o.roofTiltDeg ?? 25), J = o.roofTiltFace ?? "front";
    const Ye = j("ceiling_tilt"), Ze = j("roof_direction"), Yn = Number(o.roofTiltMax ?? 89), Zn = Number(o.roofTiltOpacity ?? 1);
    Ye && l.states[Ye] ? jo = Number(((Fl = l.states[Ye]) == null ? void 0 : Fl.state) ?? jo) : (Pt || o.roofTiltDeg == null) && (z == null ? void 0 : z.ceiling_tilt) != null && (jo = Number(z.ceiling_tilt ?? jo)), Ze && l.states[Ze] ? J = String(((Al = l.states[Ze]) == null ? void 0 : Al.state) ?? J) : (Pt || o.roofTiltFace == null) && (z == null ? void 0 : z.roof_direction) != null && (J = String(z.roof_direction));
    const me = o.houseStyleV2 ?? !0, so = o.flatRoofEnabled ?? !0, Kn = Number(o.flatRoofOverhang ?? 0.15), Jn = Number(o.flatRoofThickness ?? 0.12), Qn = Number(o.flatRoofLift ?? 0), Os = o.flatRoofTopColor ?? "#e6e8ee";
    o.flatRoofEdgeColor;
    const Hs = o.flatRoofSideColor ?? "#9ea4af", Is = Number(o.flatRoofSideShade ?? 0.4), Vs = Number(o.flatRoofTopOpacity ?? 1), Ke = Number(o.flatRoofEdgeOpacity ?? 1), Gs = Number(o.flatRoofTopDepthBias ?? 0.06), Us = Number(o.flatRoofSideDepthBias ?? 0.025), ta = Number(o.flatRoofSkirtDepthBias ?? 0.02), oa = o.wallWindowsEnabled ?? !0, ea = o.wallWindowFrameColor ?? "rgba(221,228,236,0.98)", sa = o.wallWindowGlassColor ?? "rgba(110,178,212,0.68)", na = o.wallWindowStrokeColor ?? "rgba(62,105,130,0.65)", js = Number(o.wallWindowStrokeWidth ?? 1), aa = o.roofPanelsEnabled ?? me, ia = o.roofPanelColor ?? "#2d3f7b", qs = o.roofPanelGridColor ?? "rgba(214,230,255,0.65)", ra = o.roofPanelBorderColor ?? "rgba(185,204,234,0.85)", ca = Number(o.roofPanelBorderWidth ?? 0.9), Je = Math.max(1, Math.round(Number(o.roofPanelsCols ?? 3))), la = S(Number(o.roofPanelsWidthFrac ?? 0.9), 0.4, 0.98), ha = S(Number(o.roofPanelsGapFrac ?? 0.025), 0, 0.08), Xs = S(Number(o.roofPanelsT0 ?? 0.05), 0, 0.95), Ys = S(Number(o.roofPanelsT1 ?? 0.26), 0.01, 0.98), Zs = Math.max(1, Math.round(Number(o.roofPanelGridCols ?? 5))), Ks = Math.max(1, Math.round(Number(o.roofPanelGridRows ?? 3))), Js = o.backTreeEnabled ?? !0, be = Number(o.backTreeX ?? -2.2), _ = Number(o.backTreeZ ?? -2.2), W = Number(o.backTreeScale ?? 1), Y = o.backTreeLeafColor ?? "#9bc94b", Nt = o.backTreeTrunkColor ?? "#6f4b2a", Wt = o.backTreeShadowEnabled ?? me, Qs = Number(o.backTreeShadowOpacity ?? 0.35), bh = Number(o.backTreeShadowBlur ?? 1.1), gh = Number(o.backTreeShadowLength ?? 0.015), wr = o.powerlineEnabled ?? !0, yh = o.powerlinePulseEnabled ?? !0, ua = Math.max(1, Number(o.powerlinePulseIntervalSec ?? 5)), Qe = Number(o.powerPoleX ?? 2.2), ts = Number(o.powerPoleZ ?? 2.2), $h = o.plinthBandEnabled ?? me, _h = Number(o.plinthBandHeight ?? 0.06), xh = Number(o.plinthBandMix ?? 0.62), wh = o.patioStepEnabled ?? me, vh = Number(o.patioStepDepth ?? 0.24), Sh = Number(o.patioStepWidth ?? 1.1), Mh = Number(o.patioStepInset ?? 0.02), Rh = o.patioStepColor ?? "rgba(226,230,235,0.75)", vr = o.patioGridColor ?? "rgba(164,170,182,0.8)", Sr = Number(o.patioGridWidth ?? 1), Ka = o.shadowEnabled ?? !0, Ch = Number(o.shadowOpacity ?? 0.35), kh = Number(o.shadowBlur ?? 4), Nh = Number(o.shadowContactOpacity ?? 0.12), Eh = Number(o.shadowContactBlur ?? 2.5), ge = o.shadowColor ?? "#000000", Mr = Number(o.shadowClipInset ?? 0.02), Ja = o.baseAnchorShadowEnabled ?? !0, Fh = Number(o.baseAnchorShadowOpacity ?? 0.65), Ah = Number(o.baseAnchorShadowBlur ?? 0.2), Th = Number(o.baseAnchorShadowSpread ?? 0.05), Ph = o.baseAnchorShadowColor ?? "#000000", Qa = o.sunlightEnabled ?? !0, ti = o.sunlightColor ?? [255, 225, 160], Rr = Number(o.sunlightOpacity ?? 0.7), Dh = Number(o.sunlightSpread ?? 0.7), zh = Number(o.sunBeamStaticOpacity ?? 0.07), Bh = Number(o.sunBeamStaticWidth ?? 1.6), oi = o.sunBeamFlowEnabled ?? !0, Lh = o.sunBeamFlowColor ?? "rgba(255,200,50,0.85)", Wh = Number(o.sunBeamFlowOpacity ?? 0.55), Oh = Number(o.sunBeamFlowWidthScale ?? 0.6), ei = Number(o.sunBeamFlowDash ?? 8), si = Number(o.sunBeamFlowGap ?? 50), Hh = Number(o.sunBeamFlowDuration ?? 2.5), Ih = Number(o.sunBeamFlowPhaseStep ?? 0.1), Vh = Number(o.sunBeamDepthScaleBoost ?? 1), Gh = Number(o.sunBeamDepthScaleMin ?? 0.55), Uh = Number(o.sunBeamDepthScaleMax ?? 1.2), jh = o.sunRayAnimEnabled ?? !0, ni = Number(o.sunRayAnimDurationMin ?? 1.8), ai = Number(o.sunRayAnimDurationMax ?? 3), qh = Number(o.sunRayAnimScaleMin ?? 0.5), Xh = Number(o.sunRayAnimScaleMax ?? 0.75), Yh = Number(o.sunRayAnimOpacityMin ?? 0.45);
    Number(o.sunRayAnimOpacityMax ?? 0.85);
    const Cr = o.sunRayAnimColorA ?? "rgb(255,240,110)";
    o.sunRayAnimColorB;
    const tn = o.skyCloudsEnabled ?? !0, kr = Number(o.skyCloudOpacity ?? 0.34), Zh = Number(o.skyCloudBlur ?? 3.3), ii = Number(o.skyCloudScale ?? 1.5), ri = Number(o.skyCloudSpeed ?? 1), Kh = Number(o.skyCloudHeight ?? 0.5);
    Number(o.wallBottomMix ?? 0.01), Number(o.wallMidMix ?? 0.7), Number(o.wallTopMix ?? 1.3);
    const Jh = o.facadeSunDimmingEnabled ?? !0, Qh = Number(o.facadeSunMinFactor ?? 0.2), tu = Number(o.facadeSunNoDimAtPct ?? 90), ou = Number(o.facadeSunCurve ?? 8), eu = Number(o.ceilingDarkMix ?? 0.1), su = Number(o.ceilingLightMix ?? 1.4), Nr = o.horizonEnabled ?? !0, nu = Number(o.horizonBase ?? 0.55), au = Number(o.horizonTiltStrength ?? 0.65), Er = Number(o.horizonBand ?? 0.15), iu = o.horizonTopColor ?? [120, 170, 220], ru = o.horizonBandColor ?? [255, 210, 150], cu = o.horizonBottomColor ?? [70, 80, 95], lu = Number(o.skyTwilightRangeDeg ?? 6), hu = o.horizonNightTopColor ?? [12, 20, 42], uu = o.horizonNightBandColor ?? [32, 44, 82], du = o.horizonNightBottomColor ?? [6, 10, 22], fu = o.horizonSunriseTopColor ?? [118, 150, 206], pu = o.horizonSunriseBandColor ?? [236, 162, 132], mu = o.horizonSunriseBottomColor ?? [84, 70, 90], bu = o.horizonSunsetTopColor ?? [98, 106, 178], gu = o.horizonSunsetBandColor ?? [255, 122, 90], yu = o.horizonSunsetBottomColor ?? [82, 48, 76], on = o.skyStarsEnabled ?? !0, da = Math.max(0, Math.round(Number(o.skyStarsCount ?? 34))), $u = o.skyStarsTwinkleEnabled ?? !0, _u = Number(o.skyStarsOpacity ?? 0.9), fa = o.skyMoonEnabled ?? !0, xu = Number(o.skyMoonX ?? 0.86), wu = Number(o.skyMoonY ?? 0.12), vu = Number(o.skyMoonSize ?? 14), Su = Number(o.skyMoonPhase ?? 0.72), Mu = Number(o.skyMoonOpacity ?? 0.92), en = o.moonlightEnabled ?? !0, pa = o.moonlightColor ?? [178, 208, 255], Ru = Number(o.moonlightOpacity ?? 0.22), Cu = Number(o.moonlightSpread ?? 0.6), ku = Number(o.moonlightWashOpacity ?? 0.08), Nu = Number(o.moonShadowElevationDeg ?? 18), Eu = Number(o.moonShadowYawDeg ?? -45), Fu = Number(o.shadowSunMoonBlendDeg ?? 3), Fr = o.vignetteEnabled ?? !0, Au = Number(o.vignetteOpacity ?? 0.35), Tu = Number(o.vignetteRadius ?? 0.65), Pu = Number(o.vignetteInner ?? 0.85), ci = o.vignetteColor ?? [0, 0, 0], Du = o.roofBackEnabled ?? !0, Ar = Number(o.roofBackMix ?? 0.7), zu = Number(o.roofBackOpacity ?? 1);
    Number(o.roofGradientDarkMix ?? 0.125), Number(o.roofGradientLightMix ?? 1.25);
    const Bu = o.roofSidesEnabled ?? !0, Lu = Number(o.roofSideMix ?? 0.45), li = Number(o.roofSideOpacity ?? 1), Tr = Number(o.roofSideDepthBias ?? 0.012), Wu = o.roofCapEnabled ?? !0, Ou = Number(o.floorCompassStroke ?? 4), Hu = Number(o.floorCompassRingBand ?? 0.09), Iu = o.floorCompassRingMiddleColor ?? "rgba(255,255,255,0.9)", Pr = o.floorCompassRingSideColor ?? "rgba(210,140,140,0.345)", Dr = Number(o.floorCompassRingSideWidth ?? 3), zr = o.floorCompassTicksEnabled ?? !0, Vu = o.floorCompassTickColor ?? "rgba(0,0,0,0.75)", Gu = Number(o.floorCompassTickWidth ?? 1), Uu = Number(o.floorCompassTickMajorWidth ?? 4), ju = Number(o.floorCompassTickLength ?? -0.1), qu = Number(o.floorCompassTickMajorLength ?? -0.2), Xu = Number(o.floorCompassLabelSize ?? 20), Yu = Number(o.floorCompassLabelInset ?? -0.25), Zu = Number(o.floorCompassLabelScaleBoost ?? 1.2), Ku = Number(o.floorCompassLabelScaleMin ?? 0.6), Ju = Number(o.floorCompassLabelScaleMax ?? 2), Qu = Number(o.floorCompassLabelStroke ?? 1), Br = Number(o.arrowScaleBoost ?? 0.6), Lr = Number(o.floorPointerScaleMin ?? 0.05), Wr = Number(o.floorPointerScaleMax ?? 1), Or = Number(o.floorPointerBaseWidth ?? 3.4), td = Number(o.floorPointerBaseHead ?? 18), hi = o.floorPointerColor ?? "gold", Hr = o.floorPointerShadowEnabled ?? !0, ui = Number(o.floorPointerShadowOpacity ?? 0.8), od = Number(o.floorPointerShadowBlur ?? 1.1), ed = Number(o.floorPointerShadowOffset ?? 2.9), sd = Number(o.floorWallLabelSize ?? 12), ma = Number(o.floorWallLabelOffset ?? 0.55), nd = Number(o.floorWallLabelScaleBoost ?? 1.2), ad = Number(o.floorWallLabelScaleMin ?? 0.5), id = Number(o.floorWallLabelScaleMax ?? 1.8), rd = Number(o.floorWallLabelScreenLift ?? 6), cd = o.floorWallLabelColor ?? "rgba(255,255,255,0.9)", ld = o.floorWallLabelStroke ?? "rgba(0,0,0,0.6)", hd = Number(o.floorWallLabelStrokeWidth ?? 0.5), Ir = Number(o.wallLabelVisibleThreshold ?? -0.05), ud = Number(o.wallPctVisibleThreshold ?? -0.215), dd = Number(o.wallPctAreaThreshold ?? 120), fd = Number(o.wallPctVerticalPos ?? 0.66), Vr = o.surfaceLabelEnabled ?? !0, ba = Number(o.surfaceLabelSize ?? 25), pd = Number(o.surfaceLabelScaleBoost ?? 1.5), md = Number(o.surfaceLabelScaleMin ?? 0.6), bd = Number(o.surfaceLabelScaleMax ?? 1.6), Gr = o.surfaceLabelColor ?? "rgba(255,213,0,.95)", Ur = o.surfaceLabelStroke ?? "rgba(0,0,0,0.5)", di = Number(o.surfaceLabelStrokeWidth ?? 0.5), fi = Number(o.surfaceLabelOffset ?? 0.03), gd = Number(o.wallLabelAspectCompensation ?? 0.7), yd = Number(o.wallLabelAspectCompensationMin ?? 0.72), $d = Number(o.wallLabelAspectCompensationMax ?? 1.05), _d = Number(o.roofPctLabelScale ?? 1.18), xd = Number(o.roofPowerLabelScale ?? 0.7), wd = o.roofPowerLabelColor ?? "rgba(255,255,255,0.9)", vd = o.frontDoorEnabled ?? !0, pi = Number(o.frontDoorWidth ?? 0.55), jr = Number(o.frontDoorHeight ?? 1.1), Sd = Number(o.frontDoorBottomInset ?? 0.05), Md = Number(o.frontDoorOffset ?? 0.01), Rd = o.frontDoorColor ?? "rgba(0,0,0,0.55)", qr = Number(o.frontDoorOpacity ?? 0.9), Cd = o.frontDoorFrameColor ?? "rgba(219,225,232,0.98)", kd = o.frontDoorKnobColor ?? "rgba(236,198,111,0.95)", Qt = o.faceColors ?? {
      front: "#faf5f5ff",
      right: "#d8d2d2ff",
      top: "#13a057",
      back: "#d8d2d2ff",
      left: "#d8d2d2ff",
      bottom: "#d8d2d2ff"
    }, Nd = o.autoRotateEnabledDefault ?? !1, ga = Number(z == null ? void 0 : z.auto_rotate_speed);
    let sn = Number(o.autoRotateSpeed ?? 25);
    (Pt && Number.isFinite(ga) || (o.autoRotateSpeed === void 0 || o.autoRotateSpeed === null || o.autoRotateSpeed === "") && Number.isFinite(ga)) && (sn = ga);
    const no = Number(o.autoRotateIntervalMs ?? 50), mi = Number(o.autoRotateTapDelayMs ?? 250), Ed = o.autoRotateStopOnFullTurn ?? !0, bi = Number(o.autoRotateTurnCount ?? 1), Fd = o.autoRotateShowFps ?? !0, Ad = Number(o.autoRotateFpsWindowMs ?? 1e3), Td = o.autoRotateAdaptiveEnabled ?? !0, Xr = Number(o.autoRotateAdaptiveMaxIntervalMs ?? 1e3), Pd = Number(o.autoRotateAdaptiveStepMs ?? 10), Dd = Number(o.autoRotateAdaptiveCheckMs ?? 1e3), zd = Number(o.autoRotateAdaptiveFpsThreshold ?? 0.8), Bd = Number(o.autoRotateCalibrateMs ?? 2e3), Ld = Number(o.autoRotateCalibrateFactor ?? 0.85), Yr = o.cssFpsDebugEnabled ?? !1, Wd = Number(o.cssFpsWindowMs ?? 1e3), Od = Number(o.cssFpsUiUpdateMs ?? 500), ya = o.cssFpsAutoLimitEnabled ?? !0, Hd = Number(o.cssFpsCalibrateMs ?? 2e3), Id = Number(o.cssFpsLimitThreshold ?? 20), Vd = Number(o.cssFpsLimitFactor ?? 0.5), Gd = Number(o.cssFpsLimitMin ?? 1), Ud = Number(o.cssFpsLimitMax ?? 30), jd = o.cssFpsLimitTextEnabled ?? !0, Zr = Number(o.cssFpsRotationStartBoost ?? 2);
    this._autoRotateSpeed = sn, this._autoRotateIntervalMs = no, this._autoRotateTurnCount = bi, this._autoRotateEnabled === void 0 && (this._autoRotateEnabled = Nd), this._autoRotateOffsetDeg === void 0 && (this._autoRotateOffsetDeg = 0), this._autoRotateIntervalMsDynamic === void 0 && (this._autoRotateIntervalMsDynamic = no), this._autoRotateFpsSamples === void 0 && (this._autoRotateFpsSamples = []), this._autoRotateFps === void 0 && (this._autoRotateFps = 0), this._autoRotateCalibrated === void 0 && (this._autoRotateCalibrated = !1), this._autoRotateAccumDeg === void 0 && (this._autoRotateAccumDeg = 0), this._autoRotateTargetDeg === void 0 && (this._autoRotateTargetDeg = 0), this._cssFps === void 0 && (this._cssFps = 0), this._cssFpsLimit === void 0 && (this._cssFpsLimit = 0), this._cssPerfLimited === void 0 && (this._cssPerfLimited = !1), this._cssFpsAutoCalibrated === void 0 && (this._cssFpsAutoCalibrated = !1), this._cssFpsMeasured === void 0 && (this._cssFpsMeasured = 0), this._cssRecalibrateRequested === void 0 && (this._cssRecalibrateRequested = !1);
    const os = () => typeof performance < "u" && performance.now ? performance.now() : Date.now(), Kr = os() / 1e3, nn = (t, e = 0) => {
      const s = Math.max(1e-3, t);
      return -(((Kr + e) % s + s) % s);
    }, an = (t, e = 0) => {
      const s = Math.max(1e-3, t);
      return -((e % s + s) % s);
    }, $a = () => {
      const t = Number(this._cssFpsLimit || 0);
      if (!(ya && !!this._cssPerfLimited && t > 0)) return no;
      const s = Math.max(1, Number.isFinite(Zr) ? Zr : 2), a = Math.max(1, Math.round(t * s));
      return Math.max(no, Math.round(1e3 / a));
    };
    this._cssGlobalTimeSec === void 0 && (this._cssGlobalTimeSec = os() / 1e3);
    const Jr = () => {
      this._cssGlobalTickTimer && (clearInterval(this._cssGlobalTickTimer), this._cssGlobalTickTimer = null), this._cssGlobalTickFps = 0;
    }, qd = (t) => {
      const e = Math.max(1, Math.round(t));
      if (this._cssGlobalTickTimer && Number(this._cssGlobalTickFps || 0) === e) return;
      Jr();
      const s = Math.max(1, Math.round(1e3 / e)), a = () => {
        var u, f;
        const i = os() / 1e3, r = Math.floor(i * e) / e;
        this._cssGlobalTimeSec = r;
        const h = (f = (u = this.renderRoot) == null ? void 0 : u.querySelector) == null ? void 0 : f.call(u, "svg.sv-scene");
        h && h.style.setProperty("--sv-global-time", r.toFixed(3));
      };
      a(), this._cssGlobalTickFps = e, this._cssGlobalTickTimer = setInterval(a, s);
    }, Xd = () => {
      this._cssFpsRaf && (cancelAnimationFrame(this._cssFpsRaf), this._cssFpsRaf = null), this._cssFpsSamples = [], this._cssFps = 0;
    }, Yd = () => {
      if (this._cssFpsRaf) return;
      this._cssFpsSamples = [], this._cssFpsUiLast = 0;
      const t = (e) => {
        const s = this._cssFpsSamples || [];
        s.push(e);
        const a = e - Wd;
        for (; s.length && s[0] < a; ) s.shift();
        if (this._cssFpsSamples = s, s.length >= 2) {
          const r = (s[s.length - 1] - s[0]) / 1e3;
          this._cssFps = r > 0 ? (s.length - 1) / r : 0;
        }
        const i = this._cssFpsUiLast || 0;
        e - i >= Od && (this._cssFpsUiLast = e, this._updateTimerMS = Date.now(), this.requestUpdate()), this._cssFpsRaf = requestAnimationFrame(t);
      };
      this._cssFpsRaf = requestAnimationFrame(t);
    }, gi = () => {
      this._cssFpsCalibRaf && (cancelAnimationFrame(this._cssFpsCalibRaf), this._cssFpsCalibRaf = null), this._cssFpsAutoCalibrating = !1;
    }, Zd = () => {
      if (this._cssFpsAutoCalibrated || this._cssFpsAutoCalibrating) return;
      this._cssFpsAutoCalibrating = !0;
      const t = [];
      let e = 0;
      const s = (a) => {
        if (e || (e = a), t.push(a), a - e >= Hd) {
          gi();
          let i = 0;
          if (t.length >= 2) {
            const h = (t[t.length - 1] - t[0]) / 1e3;
            i = h > 0 ? (t.length - 1) / h : 0;
          }
          this._cssFpsMeasured = i;
          let r = 0;
          i > 0 && i < Id && (i < 5 ? r = 1 : (r = Math.floor(i * Vd), r = Math.min(Ud, Math.max(Gd, r)))), this._cssFpsLimit = r, this._cssPerfLimited = r > 0, this._cssFpsAutoCalibrated = !0, this._updateTimerMS = Date.now(), this.requestUpdate();
          return;
        }
        this._cssFpsCalibRaf = requestAnimationFrame(s);
      };
      this._cssFpsCalibRaf = requestAnimationFrame(s);
    }, Qr = (t) => {
      const e = this._autoRotateFpsSamples || [];
      e.push(t);
      const s = t - Ad;
      for (; e.length && e[0] < s; ) e.shift();
      if (this._autoRotateFpsSamples = e, e.length >= 2) {
        const a = (e[e.length - 1] - e[0]) / 1e3;
        this._autoRotateFps = a > 0 ? (e.length - 1) / a : 0;
      }
    }, tc = (t) => {
      if (!this._autoRotateCalibrated || !Td) return;
      const e = this._autoRotateAdaptiveLastCheck || 0;
      if (t - e < Dd) return;
      this._autoRotateAdaptiveLastCheck = t;
      const s = 1e3 / this._autoRotateIntervalMsDynamic;
      if (this._autoRotateFps && this._autoRotateFps < s * zd) {
        const a = Math.min(
          Xr,
          this._autoRotateIntervalMsDynamic + Pd
        );
        a !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = a, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
    }, oc = (t) => {
      if (this._autoRotateCalibrated) return;
      const e = this._autoRotateCalibrateStart || t;
      if (this._autoRotateCalibrateStart = e, t - e < Bd) return;
      const s = this._autoRotateFps || 0;
      if (s > 0) {
        const i = 1e3 / (s * Ld), r = Math.min(
          Xr,
          Math.max($a(), Math.round(i))
        );
        r !== this._autoRotateIntervalMsDynamic && (this._autoRotateIntervalMsDynamic = r, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null));
      }
      this._autoRotateCalibrated = !0;
    }, yi = () => {
      this._autoRotateEnabled && (this._autoRotateLastTick = 0, this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = 0, this._autoRotateEnabled = !1, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null), this._autoRotateIntervalMsDynamic = no, this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._cssRecalibrateRequested = !0, this._updateTimerMS = Date.now(), this.requestUpdate());
    }, Kd = () => {
      this._autoRotateEnabled || (this._manualRotateEnabled && this._stopManualRotate(), this._autoRotateEnabled = !0, this._autoRotateLastTick = os(), this._autoRotateAccumDeg = 0, this._autoRotateTargetDeg = Ed && bi > 0 ? bi * 360 : 0, this._autoRotateIntervalMsDynamic = $a(), this._autoRotateFpsSamples = [], this._autoRotateFps = 0, this._autoRotateAdaptiveLastCheck = 0, this._autoRotateCalibrated = !1, this._autoRotateCalibrateStart = 0, this._autoRotateTimer || (this._autoRotateTimer = setInterval(() => {
        const t = os();
        Qr(t), oc(t), tc(t);
        const e = this._autoRotateLastTick || t, s = Math.max(0, t - e) / 1e3, a = sn * s;
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + a, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + a, this._autoRotateLastTick = t, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
          yi();
          return;
        }
        this._updateTimerMS = Date.now(), this.requestUpdate();
      }, this._autoRotateIntervalMsDynamic), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic), this._updateTimerMS = Date.now(), this.requestUpdate());
    };
    if (this._autoRotateStop = yi, this._autoRotateStartFn = Kd, this._autoRotateHandlers || (this._autoRotateHandlers = !0, this._autoRotateLastTap = 0, this.addEventListener("pointerup", (t) => {
      var i;
      if ((t.composedPath ? t.composedPath() : []).some((r) => {
        var h, u;
        return (u = (h = r == null ? void 0 : r.classList) == null ? void 0 : h.contains) == null ? void 0 : u.call(h, "cam-btn");
      }) || t.button !== void 0 && t.button !== 0) return;
      const s = Date.now(), a = this._autoRotateLastTap || 0;
      if (s - a < mi) {
        this._autoRotateLastTap = 0, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), (i = this._autoRotateStartFn) == null || i.call(this);
        return;
      }
      this._autoRotateLastTap = s, this._autoRotateClickTimer && clearTimeout(this._autoRotateClickTimer), this._autoRotateClickTimer = setTimeout(() => {
        var r;
        this._autoRotateLastTap && Date.now() - this._autoRotateLastTap >= mi && (this._autoRotateLastTap = 0, (r = this._autoRotateStop) == null || r.call(this));
      }, mi + 10);
    }, { capture: !1 })), this._autoRotateEnabled) {
      const t = $a();
      Number(this._autoRotateIntervalMsDynamic || no) < t && (this._autoRotateIntervalMsDynamic = t, this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null)), (!this._autoRotateTimer || this._autoRotateTimerMs !== this._autoRotateIntervalMsDynamic) && (this._autoRotateTimer && clearInterval(this._autoRotateTimer), this._autoRotateTimerMs = this._autoRotateIntervalMsDynamic, this._autoRotateTimer = setInterval(() => {
        const e = os();
        Qr(e), oc(e), tc(e);
        const s = this._autoRotateLastTick || e, a = Math.max(0, e - s) / 1e3, i = sn * a;
        if (this._autoRotateOffsetDeg = (this._autoRotateOffsetDeg || 0) + i, this._autoRotateAccumDeg = (this._autoRotateAccumDeg || 0) + i, this._autoRotateLastTick = e, this._autoRotateTargetDeg > 0 && this._autoRotateAccumDeg >= this._autoRotateTargetDeg) {
          yi();
          return;
        }
        this._updateTimerMS = Date.now(), this.requestUpdate();
      }, this._autoRotateIntervalMsDynamic));
    } else this._autoRotateTimer && (clearInterval(this._autoRotateTimer), this._autoRotateTimer = null);
    Yr ? Yd() : Xd();
    const ec = !!(this._autoRotateEnabled || this._manualRotateEnabled);
    ya && this._cssRecalibrateRequested && !ec && (gi(), this._cssFpsAutoCalibrated = !1, this._cssFpsMeasured = 0, this._cssRecalibrateRequested = !1), ya ? Zd() : (gi(), this._cssFpsAutoCalibrated = !1, this._cssFpsMeasured = 0, this._cssFpsLimit = 0, this._cssPerfLimited = !1, this._cssRecalibrateRequested = !1);
    const St = ya && this._cssPerfLimited && Number(this._cssFpsLimit) > 0, Fo = St ? Number(this._cssFpsLimit) : 0, _a = St && Fo <= 5, $i = jh && !_a, _i = $u && !(St && Fo <= 1), Jd = $a();
    this._rotationIntervalMsFloor = Jd;
    const xi = ec, Qd = St && xi;
    St && !xi ? qd(Fo) : Jr();
    const sc = Number(((Tl = l.states[ze]) == null ? void 0 : Tl.state) || 210), nc = Number(((Pl = l.states[mo]) == null ? void 0 : Pl.state) || 35);
    let xa = sc, wa = nc;
    const wi = Number(this._cameraSavedBaseHOverride), vi = Number(this._cameraSavedBaseVOverride);
    Number.isFinite(wi) && (xa = wi, Math.abs((sc - wi + 540) % 360 - 180) < 0.25 && (this._cameraSavedBaseHOverride = void 0)), Number.isFinite(vi) && (wa = vi, Math.abs(nc - vi) < 0.25 && (this._cameraSavedBaseVOverride = void 0)), this._autoRotateCurrentDeg = this._autoRotateOffsetDeg || 0;
    const ac = Number(this._autoRotateOffsetDeg || 0), ic = ks ? (zt - bo + 540) % 360 - 180 : 0;
    this._fixedSunSceneCompDeg = ic;
    const rc = (xa + ac + ic) * Math.PI / 180;
    this._manualRotateBaseVDeg = wa;
    const tf = Number(this._manualRotateVOffsetDeg || 0), ye = Math.min(Math.max(wa + tf, 0), 90);
    this._savedCameraH = this._normDeg(xa), this._savedCameraV = Math.max(0, Math.min(90, wa)), this._currentCameraH = this._normDeg(xa + ac), this._currentCameraV = ye;
    const cc = ye * Math.PI / 180, rn = 5, va = Math.cos(rc), Sa = Math.sin(rc), Ma = Math.cos(cc), Ra = -Math.sin(cc), lc = (eo || 0) * Math.PI / 180, hc = Math.cos(lc), uc = Math.sin(lc), of = Math.PI * 2;
    function S(t, e, s) {
      return Math.min(s, Math.max(e, t));
    }
    function Et(t) {
      const e = Math.hypot(...t);
      return e > 0 ? t.map((s) => s / e) : [0, 0, 0];
    }
    function Ca(t, e) {
      return t[0] * e[0] + t[1] * e[1] + t[2] * e[2];
    }
    function V(t) {
      const e = t[0], s = t[1], a = t[2], i = e * va - a * Sa, r = e * Sa + a * va, h = s * Ma - r * Ra, u = s * Ra + r * Ma;
      return [i, h, u];
    }
    function dc(t) {
      const e = t[0], s = t[1], a = t[2], i = s * Ma + a * Ra, r = -s * Ra + a * Ma, h = e * va + r * Sa, u = -e * Sa + r * va;
      return [h, i, u];
    }
    function qt(t) {
      const e = t[0], s = t[1], a = t[2], i = e * hc + a * uc, r = -e * uc + a * hc;
      return [i, s, r];
    }
    function ka(t) {
      return V(qt(t));
    }
    function U(t) {
      const e = t[0], s = t[1], a = t[2], i = rn / (rn + a);
      return [po + e * Kt * i, De - s * Kt * i, a, i];
    }
    function Ot(t, e) {
      const s = parseInt(t.substr(1, 2), 16), a = parseInt(t.substr(3, 2), 16), i = parseInt(t.substr(5, 2), 16), r = Math.min(255, Math.max(0, Math.round(s * e))), h = Math.min(255, Math.max(0, Math.round(a * e))), u = Math.min(255, Math.max(0, Math.round(i * e)));
      return `rgb(${r},${h},${u})`;
    }
    function Bt(t, e, s) {
      return [
        t[0] + (e[0] - t[0]) * s,
        t[1] + (e[1] - t[1]) * s,
        t[2] + (e[2] - t[2]) * s
      ];
    }
    function Na(t, e, s, a) {
      const i = Et([s[0] - e[0], s[1] - e[1], s[2] - e[2]]), r = [t[0] - e[0], t[1] - e[1], t[2] - e[2]], h = Math.cos(a), u = Math.sin(a), f = [
        i[1] * r[2] - i[2] * r[1],
        i[2] * r[0] - i[0] * r[2],
        i[0] * r[1] - i[1] * r[0]
      ], d = i[0] * r[0] + i[1] * r[1] + i[2] * r[2], p = [
        r[0] * h + f[0] * u + i[0] * d * (1 - h),
        r[1] * h + f[1] * u + i[1] * d * (1 - h),
        r[2] * h + f[2] * u + i[2] * d * (1 - h)
      ];
      return [e[0] + p[0], e[1] + p[1], e[2] + p[2]];
    }
    function ef(t, e, s) {
      const a = [e[0] - t[0], e[1] - t[1], e[2] - t[2]], i = [s[0] - t[0], s[1] - t[1], s[2] - t[2]];
      return Et([
        a[1] * i[2] - a[2] * i[1],
        a[2] * i[0] - a[0] * i[2],
        a[0] * i[1] - a[1] * i[0]
      ]);
    }
    function $e(t) {
      return t.reduce((e, s) => e + s[2], 0) / t.length;
    }
    function fc(t) {
      const e = Number(t);
      return Number.isFinite(e) ? `${Math.round(e)}%` : "0%";
    }
    function Si(t) {
      let e = 0;
      for (let s = 0; s < t.length; s++) {
        const a = (s + 1) % t.length;
        e += t[s][0] * t[a][1] - t[a][0] * t[s][1];
      }
      return e;
    }
    function sf(t, e) {
      if (!t.length || e.length < 3) return [];
      const a = Si(e) > 0, i = (u, f, d) => {
        const p = (d[0] - f[0]) * (u[1] - f[1]) - (d[1] - f[1]) * (u[0] - f[0]);
        return a ? p >= 0 : p <= 0;
      }, r = (u, f, d, p) => {
        const m = u[0], g = u[1], y = f[0], x = f[1], M = d[0], E = d[1], A = p[0], B = p[1], L = (m - y) * (E - B) - (g - x) * (M - A);
        if (Math.abs(L) < 1e-6) return f;
        const I = ((m * x - g * y) * (M - A) - (m - y) * (M * B - E * A)) / L, v = ((m * x - g * y) * (E - B) - (g - x) * (M * B - E * A)) / L;
        return [I, v];
      };
      let h = t.slice();
      for (let u = 0; u < e.length; u++) {
        const f = e[u], d = e[(u + 1) % e.length], p = h.slice();
        if (h = [], !p.length) break;
        for (let m = 0; m < p.length; m++) {
          const g = p[m], y = p[(m - 1 + p.length) % p.length], x = i(g, f, d), M = i(y, f, d);
          x ? (M || h.push(r(y, g, f, d)), h.push(g)) : M && h.push(r(y, g, f, d));
        }
      }
      return h;
    }
    function pc(t, e, s, a) {
      return a > 0 && (t = -t, e = -e, s = -s, a = -a), t * a - e * s < 0 && (t = -t, e = -e), t < 0 && (t = -t, e = -e, s = -s, a = -a), { bx: t, by: e, ux: s, uy: a };
    }
    function mc(t, e, s, a) {
      return t * a - e * s < 0 && (s = -s, a = -a), { bx: t, by: e, ux: s, uy: a };
    }
    function nf(t, e, s, a, i = !0) {
      const r = U(V(t)), h = U(V([
        t[0] + e[0],
        t[1] + e[1],
        t[2] + e[2]
      ])), u = U(V([
        t[0] + s[0],
        t[1] + s[1],
        t[2] + s[2]
      ]));
      let f = h[0] - r[0], d = h[1] - r[1], p = Math.hypot(f, d);
      if (p < 1e-6) return null;
      f /= p, d /= p;
      let m = u[0] - r[0], g = u[1] - r[1], y = Math.hypot(m, g);
      y < 1e-6 ? (m = -d, g = f, y = Math.hypot(m, g)) : (m /= y, g /= y);
      let x = i ? pc(f, d, m, g) : mc(f, d, m, g);
      if (a) {
        const M = U(V([
          t[0] + a[0],
          t[1] + a[1],
          t[2] + a[2]
        ]));
        let E = M[0] - r[0], A = M[1] - r[1], B = Math.hypot(E, A);
        B > 1e-6 && (E /= B, A /= B, x.bx * E + x.by * A < 0 && (x = i ? pc(-x.bx, -x.by, -x.ux, -x.uy) : mc(-x.bx, -x.by, -x.ux, -x.uy)));
      }
      return { basis: x, centerScr: r };
    }
    function bc(t, e) {
      const s = t[0][0], a = t[0][1], i = t[1][0], r = t[1][1], h = t[2][0], u = t[2][1], f = e[0][0], d = e[0][1], p = e[1][0], m = e[1][1], g = e[2][0], y = e[2][1], x = s * (r - u) + i * (u - a) + h * (a - r);
      if (Math.abs(x) < 1e-6) return null;
      const M = (f * (r - u) + p * (u - a) + g * (a - r)) / x, E = (d * (r - u) + m * (u - a) + y * (a - r)) / x, A = (f * (h - i) + p * (s - h) + g * (i - s)) / x, B = (d * (h - i) + m * (s - h) + y * (i - s)) / x, L = (f * (i * u - h * r) + p * (h * a - s * u) + g * (s * r - i * a)) / x, I = (d * (i * u - h * r) + m * (h * a - s * u) + y * (s * r - i * a)) / x;
      return { a: M, b: E, c: A, d: B, e: L, f: I };
    }
    function af(t) {
      const e = [0, 1, 0], s = [
        e[1] * t[2] - e[2] * t[1],
        e[2] * t[0] - e[0] * t[2],
        e[0] * t[1] - e[1] * t[0]
      ];
      return Et(s);
    }
    function gc(t) {
      if (t.length <= 1) return t.slice();
      const e = t.slice().sort((r, h) => r.x === h.x ? r.z - h.z : r.x - h.x), s = (r, h, u) => (h.x - r.x) * (u.z - r.z) - (h.z - r.z) * (u.x - r.x), a = [];
      for (const r of e) {
        for (; a.length >= 2 && s(a[a.length - 2], a[a.length - 1], r) <= 0; )
          a.pop();
        a.push(r);
      }
      const i = [];
      for (let r = e.length - 1; r >= 0; r--) {
        const h = e[r];
        for (; i.length >= 2 && s(i[i.length - 2], i[i.length - 1], h) <= 0; )
          i.pop();
        i.push(h);
      }
      return i.pop(), a.pop(), a.concat(i);
    }
    function rf(t, e, s, a, i) {
      if (t.length === 0) return t;
      const r = (d, p, m) => {
        const g = [];
        for (let y = 0; y < d.length; y++) {
          const x = d[y], M = d[(y + 1) % d.length], E = p(x), A = p(M);
          E && A ? g.push(M) : E && !A ? g.push(m(x, M)) : !E && A && (g.push(m(x, M)), g.push(M));
        }
        return g;
      }, h = (d, p, m) => {
        const g = p.x - d.x;
        if (Math.abs(g) < 1e-9) return { x: m, z: d.z };
        const y = (m - d.x) / g;
        return { x: m, z: d.z + y * (p.z - d.z) };
      }, u = (d, p, m) => {
        const g = p.z - d.z;
        if (Math.abs(g) < 1e-9) return { x: d.x, z: m };
        const y = (m - d.z) / g;
        return { x: d.x + y * (p.x - d.x), z: m };
      };
      let f = t.slice();
      return f = r(f, (d) => d.x >= e, (d, p) => h(d, p, e)), f = r(f, (d) => d.x <= s, (d, p) => h(d, p, s)), f = r(f, (d) => d.z >= a, (d, p) => u(d, p, a)), f = r(f, (d) => d.z <= i, (d, p) => u(d, p, i)), f;
    }
    function cf(t) {
      if (t.length <= 1) return t.slice();
      const e = t.slice().sort((r, h) => r.x === h.x ? r.y - h.y : r.x - h.x), s = (r, h, u) => (h.x - r.x) * (u.y - r.y) - (h.y - r.y) * (u.x - r.x), a = [];
      for (const r of e) {
        for (; a.length >= 2 && s(a[a.length - 2], a[a.length - 1], r) <= 0; ) a.pop();
        a.push(r);
      }
      const i = [];
      for (let r = e.length - 1; r >= 0; r--) {
        const h = e[r];
        for (; i.length >= 2 && s(i[i.length - 2], i[i.length - 1], h) <= 0; ) i.pop();
        i.push(h);
      }
      return i.pop(), a.pop(), a.concat(i);
    }
    const es = zt * Math.PI / 180, Mi = yt * Math.PI / 180, xo = Et([
      Math.cos(Mi) * Math.sin(es),
      Math.sin(Mi),
      Math.cos(Mi) * Math.cos(es)
    ]), Ri = S(yt * Xn + qn, -89.9, 89.9) * Math.PI / 180, Ci = Et([
      Math.cos(Ri) * Math.sin(es),
      Math.sin(Ri),
      Math.cos(Ri) * Math.cos(es)
    ]);
    V(xo);
    const Ft = xo[1] > 0.01, ut = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ].map(qt), cn = ut.map(V), Ao = cn.map(U), lf = [
      { id: "front", i: [4, 5, 6, 7], c: Qt.front },
      { id: "right", i: [1, 5, 6, 2], c: Qt.right },
      { id: "back", i: [0, 1, 2, 3], c: Qt.back },
      { id: "left", i: [0, 4, 7, 3], c: Qt.left },
      { id: "bottom", i: [0, 1, 5, 4], c: Qt.bottom }
    ], ki = {
      front: { indices: [4, 5, 6, 7], edge: [4, 5] },
      right: { indices: [1, 5, 6, 2], edge: [1, 5] },
      back: { indices: [0, 1, 2, 3], edge: [0, 1] },
      left: { indices: [0, 4, 7, 3], edge: [0, 4] }
    }, yc = {
      front: [0, 0, 1],
      right: [1, 0, 0],
      back: [0, 0, -1],
      left: [-1, 0, 0]
    }, ln = {
      front: zn,
      right: Bn,
      back: Ln,
      left: Wn
    }, hn = (t) => {
      if (!Jh) return 1;
      const e = S(Qh, 0, 1), s = S(tu, 1, 100), i = S(Number.isFinite(t) ? t : 0, 0, s) / s, r = Math.max(1e-3, ou), h = Math.log(1 + r * i) / Math.log(1 + r);
      return e + (1 - e) * h;
    }, To = {
      front: hn(ln.front),
      right: hn(ln.right),
      back: hn(ln.back),
      left: hn(ln.left)
    }, go = hn(Ns), At = [
      [-1, 1, -1],
      [1, 1, -1],
      [1, 1, 1],
      [-1, 1, 1]
    ], Ni = S(jo, 0, Yn), _e = pe && Ni > 0.01;
    let lt = At;
    if (_e) {
      const t = Ni * Math.PI / 180;
      let e = [-1, 1, 1], s = [1, 1, 1], a = 1;
      J === "front" && (e = [-1, 1, 1], s = [1, 1, 1], a = 1), J === "back" && (e = [-1, 1, -1], s = [1, 1, -1], a = -1), J === "left" && (e = [-1, 1, -1], s = [-1, 1, 1], a = 1), J === "right" && (e = [1, 1, -1], s = [1, 1, 1], a = -1);
      const i = t * a;
      lt = At.map((r) => Na(r, e, s, i));
    }
    const un = lt.map(qt), $c = un.map(V), Ea = $c.map(U);
    let Ei = ef(lt[0], lt[1], lt[2]);
    Ei[1] < 0 && (Ei = Ei.map((t) => -t));
    const _c = Si(Ea), Fa = _c < 0;
    so ? this._roofWindingFront = Fa : this._roofWindingFront === void 0 ? this._roofWindingFront = Fa : Math.abs(_c) > 20 && (this._roofWindingFront = Fa);
    const qo = so ? Fa : this._roofWindingFront;
    let Fi = null;
    const dn = (t, e) => /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t) ? Ot(t, e) : t;
    let xc = !1, Ai = !0, Aa = !1;
    const Po = [];
    if (so) {
      const t = Math.max(0, Kn), e = Math.max(0, Qn), s = Math.max(0.01, Jn), a = 1 + e, i = a + s;
      let r = [
        [-1 - t, i, -1 - t],
        [1 + t, i, -1 - t],
        [1 + t, i, 1 + t],
        [-1 - t, i, 1 + t]
      ], h = [
        [-1 - t, a, -1 - t],
        [1 + t, a, -1 - t],
        [1 + t, a, 1 + t],
        [-1 - t, a, 1 + t]
      ], u = [
        [-1, a, -1],
        [1, a, -1],
        [1, a, 1],
        [-1, a, 1]
      ];
      if (_e) {
        const v = Ni * Math.PI / 180;
        let w = [-1, a, 1], C = [1, a, 1], H = 1;
        J === "front" && (w = [-1, a, 1], C = [1, a, 1], H = 1), J === "back" && (w = [-1, a, -1], C = [1, a, -1], H = -1), J === "left" && (w = [-1, a, -1], C = [-1, a, 1], H = 1), J === "right" && (w = [1, a, -1], C = [1, a, 1], H = -1);
        const O = v * H;
        r = r.map((X) => Na(X, w, C, O)), h = h.map((X) => Na(X, w, C, O)), u = u.map((X) => Na(X, w, C, O));
      }
      const f = r.map(qt), d = h.map(qt);
      Fi = f;
      const p = f.map((v) => V(v)), m = d.map((v) => V(v)), g = p.map((v) => U(v)), y = m.map((v) => U(v)), x = $e(y) - $e(g);
      this._flatRoofBottomCloser === void 0 ? this._flatRoofBottomCloser = x < 0 : x < -0.01 ? this._flatRoofBottomCloser = !0 : x > 0.01 && (this._flatRoofBottomCloser = !1), xc = !!this._flatRoofBottomCloser;
      const M = dn(Os, go);
      Po.push({
        type: "flatRoofTop",
        pts: g,
        z: $e(g) - Gs,
        fill: M,
        opacity: Vs
      });
      const E = [
        {
          id: "front",
          pts: [g[3], g[2], y[2], y[3]],
          cam: [p[3], p[2], m[2], m[3]]
        },
        {
          id: "right",
          pts: [g[2], g[1], y[1], y[2]],
          cam: [p[2], p[1], m[1], m[2]]
        },
        {
          id: "back",
          pts: [g[1], g[0], y[0], y[1]],
          cam: [p[1], p[0], m[0], m[1]]
        },
        {
          id: "left",
          pts: [g[0], g[3], y[3], y[0]],
          cam: [p[0], p[3], m[3], m[0]]
        }
      ], A = [...p, ...m].reduce((v, w) => [v[0] + w[0], v[1] + w[1], v[2] + w[2]], [0, 0, 0]).map((v) => v / 8);
      E.forEach((v) => {
        const w = To[v.id] ?? go, C = S(w, 0.2, 1), H = Math.min(...v.pts.map((pt) => pt[2])), O = v.cam.reduce((pt, Tt) => [pt[0] + Tt[0], pt[1] + Tt[1], pt[2] + Tt[2]], [0, 0, 0]).map((pt) => pt / 4), X = Et([O[0] - A[0], O[1] - A[1], O[2] - A[2]]), rt = Et([-O[0], -O[1], -rn - O[2]]);
        Ca(X, rt) > -0.02 && Po.push({
          type: `flatRoofEdge-${v.id}`,
          pts: v.pts,
          z: H - Us,
          fill: dn(Os, C),
          opacity: Ke
        });
      });
      const B = To[J] ?? go;
      if (Po.push({
        type: "flatRoofBottom",
        pts: y,
        z: $e(y),
        fill: dn(Hs, Math.max(0.2, B * Is * Ar)),
        opacity: Ke
      }), _e) {
        const w = u.map(qt).map((X) => U(V(X))), C = [Ao[3], Ao[2], Ao[6], Ao[7]], H = (X) => {
          const rt = To[X] ?? 1;
          return dn(Hs, S(rt * Is, 0.2, 1));
        }, O = (X, rt, $t) => {
          const pt = Math.max(...rt.map((Tt) => Tt[2]));
          Po.push({
            type: $t,
            pts: rt,
            // Keep connector skirts behind the roof overhang edges at corner views.
            z: pt + Math.max(ta, 0.02),
            fill: H(X),
            opacity: li
          });
        };
        J === "front" ? (O("left", [w[0], C[0], w[3]], "flatRoofSkirt-left"), O("right", [w[1], C[1], w[2]], "flatRoofSkirt-right"), O("back", [w[0], w[1], C[1], C[0]], "flatRoofSkirt-back")) : J === "back" ? (O("left", [w[3], C[3], w[0]], "flatRoofSkirt-left"), O("right", [w[2], C[2], w[1]], "flatRoofSkirt-right"), O("front", [w[2], w[3], C[3], C[2]], "flatRoofSkirt-front")) : J === "left" ? (O("front", [w[2], C[2], w[3]], "flatRoofSkirt-front"), O("back", [w[1], C[1], w[0]], "flatRoofSkirt-back"), O("right", [w[1], w[2], C[2], C[1]], "flatRoofSkirt-right")) : J === "right" && (O("front", [w[3], C[3], w[2]], "flatRoofSkirt-front"), O("back", [w[0], C[0], w[1]], "flatRoofSkirt-back"), O("left", [w[0], w[3], C[3], C[0]], "flatRoofSkirt-left")), e > 1e-3 && (J === "front" ? O("front", [w[3], w[2], C[2], C[3]], "flatRoofSkirt-front-low") : J === "back" ? O("back", [w[0], w[1], C[1], C[0]], "flatRoofSkirt-back-low") : J === "left" ? O("left", [w[0], w[3], C[3], C[0]], "flatRoofSkirt-left-low") : J === "right" && O("right", [w[1], w[2], C[2], C[1]], "flatRoofSkirt-right-low"));
      }
      const L = Po.find((v) => v.type === "flatRoofTop"), I = Po.find((v) => v.type === "flatRoofBottom");
      if (Aa = xc || !qo, Ai = !Aa, L && I && (Aa ? (L.opacity = 0, I.opacity = Ke) : (L.opacity = Vs, I.opacity = 0)), L && Ai) {
        const v = Po.filter((w) => w !== L);
        if (v.length) {
          const w = Math.min(...v.map((C) => C.z));
          L.z = Math.min(L.z, w - Math.max(0.015, Gs));
        }
      }
      if (I && Aa) {
        const v = Po.filter((w) => w !== I);
        if (v.length) {
          const w = Math.max(...v.map((C) => C.z));
          I.z = Math.max(I.z, w + Math.max(0.02, Us));
        }
      }
    }
    const Ti = so ? Ai : qo;
    let fn = [];
    _e && Bu && (J === "front" ? fn = [
      { tri: [lt[0], At[0], lt[3]], wall: "left" },
      { tri: [lt[1], At[1], lt[2]], wall: "right" }
    ] : J === "back" ? fn = [
      { tri: [lt[3], At[3], lt[0]], wall: "left" },
      { tri: [lt[2], At[2], lt[1]], wall: "right" }
    ] : J === "left" ? fn = [
      { tri: [lt[2], At[2], lt[3]], wall: "front" },
      { tri: [lt[1], At[1], lt[0]], wall: "back" }
    ] : J === "right" && (fn = [
      { tri: [lt[3], At[3], lt[2]], wall: "front" },
      { tri: [lt[0], At[0], lt[1]], wall: "back" }
    ]));
    const hf = fn.map((t) => ({
      pts: t.tri.map((e) => U(ka(e))),
      wall: t.wall
    })), Pi = (t) => {
      const e = To[t] ?? go, s = Qt[t] ?? Qt.top;
      return Ot(s, Lu * e);
    }, uf = To[J] ?? go, df = Qt[J] ?? Qt.top, ff = Ot(df, Ar * uf), pf = Ot(Qt.top, go);
    let ss = null, ns = null;
    _e && Wu && (J === "front" ? (ss = [lt[0], lt[1], At[1], At[0]], ns = "back") : J === "back" ? (ss = [lt[2], lt[3], At[3], At[2]], ns = "front") : J === "left" ? (ss = [lt[1], lt[2], At[2], At[1]], ns = "right") : J === "right" && (ss = [lt[0], lt[3], At[3], At[0]], ns = "left"));
    const Di = ss ? ss.map((t) => U(ka(t))) : null, mf = Pi(ns || J);
    let wo = [0, 0, -1];
    J === "front" && (wo = [0, 0, -1]), J === "back" && (wo = [0, 0, 1]), J === "left" && (wo = [1, 0, 0]), J === "right" && (wo = [-1, 0, 0]);
    const as = lt.reduce((t, e) => [t[0] + e[0], t[1] + e[1], t[2] + e[2]], [0, 0, 0]).map((t) => t / 4), is = 2.2;
    U(ka([
      as[0] - wo[0] * is,
      as[1] - wo[1] * is,
      as[2] - wo[2] * is
    ])), U(ka([
      as[0] + wo[0] * is,
      as[1] + wo[1] * is,
      as[2] + wo[2] * is
    ]));
    const st = -1, zi = -1, wc = [
      [-gt, st, -gt],
      [gt, st, -gt],
      [gt, st, gt],
      [-gt, st, gt]
    ].map(V).map(U);
    let Bi = null;
    if (Ja) {
      const t = 1 + Math.max(0, Th);
      Bi = [0, 1, 5, 4].map((i) => {
        const r = ut[i];
        return [r[0] * t, st, r[2] * t];
      }).map((i) => U(V(i))).map((i) => i[0] + "," + i[1]).join(" ");
    }
    const bf = Math.min(...wc.map((t) => t[1])), vc = S(bf - 6, it * 0.32, it * 0.82);
    this._skyClipBottom === void 0 || this._skyClipCardW !== nt || this._skyClipCardH !== it ? (this._skyClipBottom = vc, this._skyClipVertDeg = ye, this._skyClipCardW = nt, this._skyClipCardH = it) : Math.abs(ye - (this._skyClipVertDeg ?? ye)) > 0.15 && (this._skyClipBottom = vc, this._skyClipVertDeg = ye);
    const pn = Number(this._skyClipBottom), xe = [
      Ci[0] * Xe,
      Ci[1] * Xe,
      Ci[2] * Xe
    ], Xo = V(xe), Mt = U(Xo), gf = cn.reduce((t, e) => t + e[2], 0) / cn.length, yf = Xo[2] > gf + 0.02, we = Mt[3], $f = Math.max(4, 12 * we), _f = Math.max(3, 8 * we), Li = S(nu - ye / 90 * au, 0.1, 0.9), xf = S(Li - Er, 0, 1), wf = S(Li, 0, 1), vf = S(Li + Er, 0, 1), Do = (t, e) => {
      const s = Array.isArray(t) ? t : e;
      return [
        S(Number((s == null ? void 0 : s[0]) ?? e[0]), 0, 255),
        S(Number((s == null ? void 0 : s[1]) ?? e[1]), 0, 255),
        S(Number((s == null ? void 0 : s[2]) ?? e[2]), 0, 255)
      ];
    }, rs = (t, e, s) => [
      Math.round(t[0] + (e[0] - t[0]) * s),
      Math.round(t[1] + (e[1] - t[1]) * s),
      Math.round(t[2] + (e[2] - t[2]) * s)
    ], Sc = Number(this._prevSunEl);
    let cs = Number(this._skyTrend);
    if (Number.isFinite(cs) || (cs = -1), Number.isFinite(Sc)) {
      const t = yt - Sc;
      t < -0.03 ? cs = -1 : t > 0.03 && (cs = 1);
    }
    this._prevSunEl = yt, this._skyTrend = cs;
    const Ta = cs < 0, ls = Math.max(1, lu), Wi = S((yt + ls) / (2 * ls), 0, 1), Sf = S(1 - Math.abs(yt) / ls, 0, 1), Oi = Math.pow(Sf, 0.85), mn = S((-yt + 1.5) / (ls + 5), 0, 1), Pa = on ? S((-yt - 1.2) / (ls + 3), 0, 1) : 0, vo = fa ? S((-yt + 0.2) / (ls + 2), 0, 1) : 0, Mf = S(xu, 0.05, 0.95), Rf = S(wu, 0.05, 0.95), ve = Mf * nt, Se = Rf * it, So = S(vu, 6, 44), Cf = S(Su, 0, 1), hs = S(vo * Mu, 0, 1), kf = S(Nu, 0.5, 89.5), Mc = (Eu + 180) * Math.PI / 180, Hi = kf * Math.PI / 180, Nf = Et([
      Math.sin(Mc) * Math.cos(Hi),
      Math.sin(Hi),
      -Math.cos(Mc) * Math.cos(Hi)
    ]);
    let Mo = Et(dc(Nf));
    Mo[1] < 0.06 && (Mo = Et([Mo[0], 0.06, Mo[2]]));
    const Ef = Do(iu, [120, 170, 220]), Ff = Do(ru, [255, 210, 150]), Af = Do(cu, [70, 80, 95]), Tf = Do(hu, [12, 20, 42]), Pf = Do(uu, [32, 44, 82]), Df = Do(du, [6, 10, 22]), zf = Do(Ta ? bu : fu, [108, 128, 188]), Bf = Do(Ta ? gu : pu, [246, 146, 112]), Lf = Do(Ta ? yu : mu, [84, 62, 84]), Wf = rs(Tf, Ef, Wi), Of = rs(Pf, Ff, Wi), Hf = rs(Df, Af, Wi), Ii = rs(Wf, zf, Oi * 0.82), If = rs(Of, Bf, Oi * 0.95), Rc = rs(Hf, Lf, Oi * 0.68), to = gt * (1 - 0.05), Da = 64;
    let us = this._ringUnit;
    (!us || us.length !== Da) && (us = Array.from({ length: Da }, (t, e) => {
      const s = e / Da * of;
      return [Math.sin(s), Math.cos(s)];
    }), this._ringUnit = us);
    const Cc = Math.min(Hu, to * 0.3), kc = to - Cc, Vf = to + Cc;
    function Vi(t) {
      return us.map(([e, s]) => {
        const a = V([t * e, st, t * s]), i = U(a);
        return i[0] + "," + i[1];
      });
    }
    const Gf = Vi(kc), Uf = Vi(to), jf = Vi(Vf);
    let Nc = [];
    zr && (Nc = us.map(([t, e], s) => {
      const a = s % (Da / 4) === 0, i = a ? qu : ju, r = kc, h = r - i, u = U(V([h * t, st, h * e])), f = U(V([r * t, st, r * e]));
      return { pIn: u, pOut: f, isMajor: a };
    }));
    const qf = [["N", 0], ["E", Math.PI / 2], ["S", Math.PI], ["W", 3 * Math.PI / 2]], Ec = to * (1 - Yu), Xf = qf.map(([t, e]) => {
      const s = V([Ec * Math.sin(e), st, Ec * Math.cos(e)]), a = U(s), i = S(a[3] * Zu, Ku, Ju);
      return { t, x: a[0], y: a[1], scale: i };
    }), Yo = Et([Math.sin(es), 0, Math.cos(es)]), za = Et([Mo[0], 0, Mo[2]]), Yf = V([Yo[0] * to * 0.25, st, Yo[2] * to * 0.25]), Zf = V([Yo[0] * to * 0.95, st, Yo[2] * to * 0.95]), Me = U(Yf), Re = U(Zf), Kf = S(Me[3] * Br, Lr, Wr), Gi = S(Re[3] * Br, Lr, Wr), Jf = Or * Kf, Qf = Or * Gi, Ce = td * Gi, Fc = [
      { id: "front", label: "Front", normal: [0, 0, 1], pos: [0, st, 1 + ma] },
      { id: "back", label: "Back", normal: [0, 0, -1], pos: [0, st, -1 - ma] },
      { id: "right", label: "Right", normal: [1, 0, 0], pos: [1 + ma, st, 0] },
      { id: "left", label: "Left", normal: [-1, 0, 0], pos: [-1 - ma, st, 0] }
    ], Ui = {}, ji = {};
    Fc.forEach((t) => {
      const e = V(qt(t.normal));
      Ui[t.id] = e[2] < Ir;
      const s = ki[t.id];
      if (s) {
        const a = s.indices.map((r) => Ao[r]), i = Math.abs(Si(a));
        ji[t.id] = e[2] < ud && i > dd;
      } else
        ji[t.id] = Ui[t.id];
    });
    let bn = null;
    const qi = Math.max(0.1, Fu), Ac = S((yt + qi) / (2 * qi), 0, 1), Xi = xo[1] > 0.01 ? xo : Et([xo[0], 0.01, xo[2]]), t0 = yt > -qi ? 1 : 0, o0 = en && vo > 0.03 && Mo[1] > 0.01 ? 1 : 0, Tc = Ac * t0, Pc = (1 - Ac) * o0, Ba = Tc + Pc, gn = Ba > 1e-6 ? Tc / Ba : 0, ds = Ba > 1e-6 ? Pc / Ba : 0, Yi = gn > 0 || ds > 0 ? Et([
      Xi[0] * gn + Mo[0] * ds,
      Xi[1] * gn + Mo[1] * ds,
      Xi[2] * gn + Mo[2] * ds
    ]) : xo;
    if (Ka && (gn > 0 || ds > 0)) {
      const t = [-Yi[0], -Yi[1], -Yi[2]];
      if (Math.abs(t[1]) > 1e-6) {
        const e = [], s = _e ? ut.concat(un) : ut;
        for (const i of s) {
          const r = (zi - i[1]) / t[1];
          r >= 0 && e.push({ x: i[0] + t[0] * r, z: i[2] + t[2] * r });
        }
        const a = gc(e);
        if (a.length >= 3) {
          const i = S(Mr, 0, 0.2), r = gt * (1 - i), h = rf(a, -r, r, -r, r);
          h.length >= 3 && (bn = h.map((u) => U(V([u.x, zi, u.z]))));
        }
      }
    }
    const Dc = bn ? bn.map((t) => t[0] + "," + t[1]).join(" ") : null;
    let yn = null, $n = null;
    if (Qa && Ft) {
      const e = Math.hypot(gt * 2, gt * 2) * Dh, s = [Yo[0] * to * 0.95, st, Yo[2] * to * 0.95], a = [
        s[0] - Yo[0] * e,
        st,
        s[2] - Yo[2] * e
      ], i = V(s), r = V(a);
      yn = U(i), $n = U(r);
    }
    let _n = null, xn = null;
    if (en && !Ft && vo > 0.03) {
      const e = Math.hypot(gt * 2, gt * 2) * Cu, s = [za[0] * to * 0.9, st, za[2] * to * 0.9], a = [
        s[0] - za[0] * e,
        st,
        s[2] - za[2] * e
      ];
      _n = U(V(s)), xn = U(V(a));
    }
    const zc = `sv-beam-flow-${Math.round((ei + si) * 10)}`, Bc = `sv-sun-ray-${Math.round((ni + ai) * 10)}`, Lc = `sv-cloud-drift-${Math.round(nt)}-${Math.round(it)}`, e0 = Number(o.sunBeamRaySpacingPx ?? 40), s0 = Number(o.sunBeamRayMinSepPx ?? 16), n0 = Number(o.sunBeamSilhouetteMinRays ?? 3), a0 = Number(o.sunBeamSilhouetteMaxRays ?? 7), Wc = _e ? ut.concat(un) : ut, Oc = Wc.map((t, e) => {
      const s = V(t), a = U(s);
      return { sourceIdx: e, x: a[0], y: a[1], zCam: s[2], world: t };
    }), Xt = cf(
      Oc
    ), fs = [], La = (t, e, s, a = -1, i = [0, 0, 0]) => {
      const r = Math.max(1, s0) ** 2;
      for (const h of fs) {
        const u = h.x - t, f = h.y - e;
        if (u * u + f * f < r) return;
      }
      fs.push({ x: t, y: e, zCam: s, sourceIdx: a, world: i });
    };
    if (Xt.length >= 2) {
      let t = 0;
      for (let s = 0; s < Xt.length; s++) {
        const a = (s + 1) % Xt.length;
        t += Xt[s].x * Xt[a].y - Xt[a].x * Xt[s].y;
      }
      const e = t > 0;
      for (let s = 0; s < Xt.length; s++) {
        const a = Xt[s], i = Xt[(s + 1) % Xt.length], r = i.x - a.x, h = i.y - a.y, u = Math.hypot(r, h);
        if (u < 1e-3) continue;
        const f = (a.x + i.x) * 0.5, d = (a.y + i.y) * 0.5;
        let p = e ? h : -h, m = e ? -r : r;
        const g = Math.hypot(p, m) || 1;
        p /= g, m /= g;
        const y = Mt[0] - f, x = Mt[1] - d;
        if (!(p * y + m * x > 0)) continue;
        La(a.x, a.y, a.zCam, a.sourceIdx, a.world), La(i.x, i.y, i.zCam, i.sourceIdx, i.world);
        const E = Math.max(8, e0), A = Math.max(1, Math.min(4, Math.round(u / E)));
        for (let B = 0; B < A; B++) {
          const L = (B + 1) / (A + 1), I = [
            a.world[0] + (i.world[0] - a.world[0]) * L,
            a.world[1] + (i.world[1] - a.world[1]) * L,
            a.world[2] + (i.world[2] - a.world[2]) * L
          ], v = V(I), w = U(v);
          La(w[0], w[1], v[2], -1, I);
        }
      }
    }
    !fs.length && Xt.length && Xt.forEach((t) => La(t.x, t.y, t.zCam, t.sourceIdx, t.world)), fs.length > 1 && fs.sort((t, e) => {
      const s = Math.atan2(t.y - Mt[1], t.x - Mt[0]), a = Math.atan2(e.y - Mt[1], e.x - Mt[0]);
      return s - a;
    });
    const Hc = (t, e) => {
      if (t.length <= e) return t.slice();
      if (e <= 1) return [t[Math.floor(t.length / 2)]];
      const s = [];
      for (let a = 0; a < e; a++) {
        const i = Math.round(a * (t.length - 1) / (e - 1));
        s.push(t[i]);
      }
      return s;
    }, wn = Math.max(1, Math.floor(n0)), Ic = Math.max(wn, Math.floor(a0));
    let yo = fs.slice();
    if (yo.length > Ic && (yo = Hc(yo, Ic)), yo.length < wn) {
      const t = Xt.map((e) => ({ x: e.x, y: e.y, zCam: e.zCam, sourceIdx: e.sourceIdx, world: e.world }));
      if (t.length >= wn)
        yo = Hc(t, wn);
      else if (t.length > 0)
        for (; yo.length < wn; ) {
          const e = t[yo.length % t.length];
          yo.push({ x: e.x, y: e.y, zCam: e.zCam, sourceIdx: e.sourceIdx, world: e.world });
        }
    }
    yo.length || [2, 3, 6, 7].forEach((t) => {
      const e = Ao[t], s = cn[t];
      yo.push({ x: e[0], y: e[1], zCam: s[2], sourceIdx: t, world: ut[t] });
    });
    const Zi = /* @__PURE__ */ new Set();
    if (Ft) {
      const t = [-xo[0], -xo[1], -xo[2]];
      if (Math.abs(t[1]) > 1e-6) {
        const e = Wc.map((s, a) => {
          const i = (zi - s[1]) / t[1];
          return i < 0 ? null : { sourceIdx: a, x: s[0] + t[0] * i, z: s[2] + t[2] * i };
        }).filter((s) => !!s);
        if (e.length >= 3) {
          const s = gc(e.map((i) => ({ x: i.x, z: i.z }))), a = 1e-4;
          e.forEach((i) => {
            s.some((r) => Math.abs(r.x - i.x) <= a && Math.abs(r.z - i.z) <= a) && Zi.add(i.sourceIdx);
          });
        }
      }
    }
    const Vc = ((t) => {
      const e = [], s = /* @__PURE__ */ new Set();
      return t.forEach((a) => {
        const i = `${Math.round(a.x)},${Math.round(a.y)}`;
        s.has(i) || (s.add(i), e.push(a));
      }), e;
    })(
      Oc.filter((t) => Zi.has(t.sourceIdx)).map((t) => ({ x: t.x, y: t.y, zCam: t.zCam, sourceIdx: t.sourceIdx, world: t.world }))
    ), Ki = Vc.length ? Vc : yo, Ji = /* @__PURE__ */ new Map(), Gc = (t, e, s, a, i) => {
      const r = `${Math.round(e)},${Math.round(s)}`;
      Ji.has(r) || Ji.set(r, { x: e, y: s, zCam: a, sourceIdx: t, world: i });
    };
    Object.entries(ki).forEach(([t, e]) => {
      V(qt(yc[t]))[2] >= Ir || e.indices.forEach((a) => {
        Gc(a, Ao[a][0], Ao[a][1], cn[a][2], ut[a]);
      });
    }), qo && Ea.forEach((t, e) => {
      const s = ut.length + e;
      Gc(s, t[0], t[1], $c[e][2], un[e]);
    });
    let Qi = Array.from(Ji.values()).filter(
      (t) => Zi.has(t.sourceIdx)
    );
    if (!Qi.length && Ki.length) {
      const t = Ki.slice().sort((e, s) => e.zCam - s.zCam);
      Qi = t.slice(0, Math.min(3, t.length));
    }
    function i0(t, e) {
      const s = t.length;
      if (s < 3) return "";
      let a = "";
      for (let i = 0; i < s; i++) {
        const r = t[(i - 1 + s) % s], h = t[i], u = t[(i + 1) % s], f = [r[0] - h[0], r[1] - h[1]], d = [u[0] - h[0], u[1] - h[1]], p = Math.hypot(f[0], f[1]), m = Math.hypot(d[0], d[1]);
        if (p === 0 || m === 0) continue;
        const g = Math.min(e, p / 2, m / 2), y = [f[0] / p, f[1] / p], x = [d[0] / m, d[1] / m], M = [h[0] + y[0] * g, h[1] + y[1] * g], E = [h[0] + x[0] * g, h[1] + x[1] * g];
        i === 0 ? a += `M ${M[0]} ${M[1]}` : a += ` L ${M[0]} ${M[1]}`, a += ` Q ${h[0]} ${h[1]} ${E[0]} ${E[1]}`;
      }
      return a + " Z";
    }
    const ps = wc.map((t) => [t[0], t[1]]), Wa = i0(ps, ie);
    function r0(t, e, s = 8) {
      const a = t.length;
      if (a < 3) return t.slice();
      const i = [];
      for (let r = 0; r < a; r++) {
        const h = t[(r - 1 + a) % a], u = t[r], f = t[(r + 1) % a], d = [h[0] - u[0], h[1] - u[1]], p = [f[0] - u[0], f[1] - u[1]], m = Math.hypot(d[0], d[1]), g = Math.hypot(p[0], p[1]);
        if (m === 0 || g === 0) continue;
        const y = Math.min(e, m / 2, g / 2), x = [d[0] / m, d[1] / m], M = [p[0] / g, p[1] / g], E = [u[0] + x[0] * y, u[1] + x[1] * y], A = [u[0] + M[0] * y, u[1] + M[1] * y];
        i.length, i.push(E);
        for (let B = 1; B <= s; B++) {
          const L = B / s, I = 1 - L;
          i.push([
            I * I * E[0] + 2 * I * L * u[0] + L * L * A[0],
            I * I * E[1] + 2 * I * L * u[1] + L * L * A[1]
          ]);
        }
      }
      return i;
    }
    const vn = r0(ps, ie, 8), Uc = vn.map((t) => [t[0], t[1] + Wo]), jc = [];
    for (let t = 0; t < vn.length; t++) {
      const e = (t + 1) % vn.length;
      jc.push([
        vn[t],
        vn[e],
        Uc[e],
        Uc[t]
      ]);
    }
    const tr = S(Mr, 0, 0.2), Oa = ps.reduce((t, e) => [t[0] + e[0], t[1] + e[1]], [0, 0]).map((t) => t / ps.length), c0 = tr > 0 ? ps.map((t) => [
      Oa[0] + (t[0] - Oa[0]) * (1 - tr),
      Oa[1] + (t[1] - Oa[1]) * (1 - tr)
    ]) : ps, Lt = [];
    if (Nr && Lt.push(`<linearGradient id="horizon-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgb(${Ii.join(",")})"/>
        <stop offset="${(xf * 100).toFixed(2)}%" stop-color="rgb(${Ii.join(",")})"/>
        <stop offset="${(wf * 100).toFixed(2)}%" stop-color="rgb(${If.join(",")})"/>
        <stop offset="${(vf * 100).toFixed(2)}%" stop-color="rgb(${Rc.join(",")})"/>
        <stop offset="100%" stop-color="rgb(${Rc.join(",")})"/>
      </linearGradient>`), (tn || on && Pa > 0.01 || fa && vo > 0.03) && Lt.push(`<clipPath id="sky-cloud-clip"><rect x="0" y="0" width="${nt}" height="${pn}"/></clipPath>`), tn && Lt.push(`<filter id="sky-cloud-blur" x="-30%" y="-40%" width="160%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Math.max(0, Zh)}"/>
      </filter>`), Lt.push(`<radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,200,0.85)"/>
      <stop offset="70%" stop-color="rgba(255,255,150,0.35)"/>
      <stop offset="100%" stop-color="rgba(255,255,100,0)"/>
    </radialGradient>`), Lt.push(`<linearGradient id="ceiling-grad" x1="0" y1="1" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${Ot(Qt.top, eu * go)}"/>
      <stop offset="100%" stop-color="${Ot(Qt.top, su * go)}"/>
    </linearGradient>`), ce && ft > 1e-3 && Lt.push(`<linearGradient id="floor-grass-grad" x1="0" y1="0.1" x2="1" y2="0.95" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="${le}" stop-opacity="${S(ft * 0.55, 0, 1)}"/>
        <stop offset="55%" stop-color="${No}" stop-opacity="${S(ft, 0, 1)}"/>
        <stop offset="100%" stop-color="${le}" stop-opacity="${S(ft * 0.42, 0, 1)}"/>
      </linearGradient>`), Ka && Dc && (Lt.push(`<filter id="shadow-blur-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${kh}"/>
      </filter>`), Lt.push(`<filter id="shadow-blur-contact" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Eh}"/>
      </filter>`)), Ja && Lt.push(`<filter id="base-anchor-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${Ah}"/>
      </filter>`), Hr && Lt.push(`<filter id="floor-pointer-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${od}"/>
      </filter>`), Wt && Lt.push(`<filter id="back-tree-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${bh}"/>
      </filter>`), Qa && Ft && yn && $n && Lt.push(`<linearGradient id="sunlight-grad" x1="${yn[0]}" y1="${yn[1]}"
                  x2="${$n[0]}" y2="${$n[1]}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="rgb(${ti.join(",")})" stop-opacity="${Rr}"/>
          <stop offset="55%" stop-color="rgb(${ti.join(",")})" stop-opacity="${Rr * 0.45}"/>
          <stop offset="100%" stop-color="rgb(${ti.join(",")})" stop-opacity="0"/>
        </linearGradient>`), en && !Ft && _n && xn) {
      const t = Array.isArray(pa) ? pa : [178, 208, 255], e = S(Ru * vo, 0, 1);
      Lt.push(`<linearGradient id="moonlight-grad" x1="${_n[0]}" y1="${_n[1]}"
                  x2="${xn[0]}" y2="${xn[1]}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="rgb(${t.join(",")})" stop-opacity="${e}"/>
          <stop offset="60%" stop-color="rgb(${t.join(",")})" stop-opacity="${e * 0.35}"/>
          <stop offset="100%" stop-color="rgb(${t.join(",")})" stop-opacity="0"/>
        </linearGradient>`);
    }
    Fr && Lt.push(`<radialGradient id="vignette" cx="50%" cy="50%" r="${Tu}">
        <stop offset="0%" stop-color="rgb(${ci.join(",")})" stop-opacity="0"/>
        <stop offset="${(Pu * 100).toFixed(1)}%" stop-color="rgb(${ci.join(",")})" stop-opacity="0"/>
        <stop offset="100%" stop-color="rgb(${ci.join(",")})" stop-opacity="${Au}"/>
      </radialGradient>`);
    const or = wr && yh && Number.isFinite(Ge), Zo = [];
    if (oi && Ft && Zo.push(`
        @keyframes ${zc} {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -${ei + si}; }
        }
        .sv-beam-flow {
          animation-name: ${zc};
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .sv-css-limit .sv-beam-flow {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `), tn) {
      const e = nt + 140;
      Zo.push(`
        @keyframes ${Lc} {
          0% { transform: translateX(-140px); }
          100% { transform: translateX(${e}px); }
        }
        .sv-sky-cloud {
          animation-name: ${Lc};
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .sv-css-limit .sv-sky-cloud {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `);
    }
    $i && Zo.push(`
        @keyframes ${Bc} {
          0%, 100% { transform: scaleX(var(--ray-min-scale, 0.45)); }
          50% { transform: scaleX(var(--ray-max-scale, 1.0)); }
        }
        .sv-sun-ray {
          animation-name: ${Bc};
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          transform-origin: 0px 0px;
          will-change: transform;
        }
        .sv-css-limit .sv-sun-ray {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `);
    const qc = `sv-star-twinkle-${Math.round(nt)}-${Math.round(it)}`;
    if (on && _i && Zo.push(`
        @keyframes ${qc} {
          0%, 100% { opacity: calc(var(--star-op, 0.7) * 0.22); }
          50% { opacity: var(--star-op, 0.7); }
        }
        .sv-star {
          animation-name: ${qc};
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .sv-css-limit .sv-star {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `), or) {
      const t = `sv-grid-pulse-${Math.round(nt)}-${Math.round(it)}`;
      Zo.push(`
        @keyframes ${t} {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: calc(-1 * var(--grid-cycle, 240)); }
        }
        .sv-grid-pulse {
          animation-name: ${t};
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .sv-css-limit .sv-grid-pulse {
          animation-timing-function: steps(var(--sv-steps, 1), end);
        }
      `);
    }
    (oi || tn || $i || on && _i || or) && Zo.push(`
        .sv-css-global .sv-beam-flow,
        .sv-css-global .sv-sun-ray,
        .sv-css-global .sv-sky-cloud,
        .sv-css-global .sv-star,
        .sv-css-global .sv-grid-pulse {
          animation-play-state: paused !important;
          animation-delay: calc(var(--sv-phase-delay, 0s) - (var(--sv-global-time, 0) * 1s)) !important;
        }
        .sv-css-pause .sv-beam-flow,
        .sv-css-pause .sv-sun-ray,
        .sv-css-pause .sv-sky-cloud,
        .sv-css-pause .sv-star,
        .sv-css-pause .sv-grid-pulse {
          animation-play-state: paused !important;
        }
      `), Zo.length && Lt.push(`<style><![CDATA[
        ${Zo.join(`
`)}
        @media (prefers-reduced-motion: reduce) {
          .sv-beam-flow, .sv-sun-ray, .sv-grid-pulse { animation: none !important; }
        }
      ]]></style>`);
    const b = [], l0 = `${St ? "sv-css-limit sv-css-global " : ""}${Qd ? "sv-css-pause " : ""}sv-scene`.trim(), h0 = Number(this._cssGlobalTimeSec || 0);
    if (b.push(`<svg class="${l0}" style="--sv-global-time:${h0.toFixed(3)}" viewBox="0 0 ${nt} ${it}" width="${Dt}" height="${fo}" preserveAspectRatio="xMidYMid meet"><defs>${Lt.join("")}</defs>`), Nr && b.push(`<rect x="0" y="0" width="${nt}" height="${it}" fill="url(#horizon-grad)"/>`), on && Pa > 0.01 && da > 0) {
      let t = this._skyStars;
      if (!Array.isArray(t) || t.length !== da) {
        let s = 2166136261 ^ Math.round(nt * 13 + it * 17 + da * 31);
        const a = () => (s ^= s << 13, s >>>= 0, s ^= s >> 17, s >>>= 0, s ^= s << 5, s >>>= 0, (s >>> 0) / 4294967295);
        t = Array.from({ length: da }, () => ({
          x: 0.04 + a() * 0.92,
          y: 0.06 + a() * 0.86,
          r: 0.55 + a() * 1.25,
          a: 0.35 + a() * 0.65,
          dur: 1.2 + a() * 2.2,
          phase: a() * 2.2
        })), this._skyStars = t;
      }
      const e = pn * 0.97;
      b.push('<g clip-path="url(#sky-cloud-clip)">'), t.forEach((s) => {
        const a = s.x * nt, i = s.y * e, r = s.r * (0.85 + Pa * 0.35), h = S(Pa * _u * s.a, 0, 1);
        if (_i) {
          const u = Math.max(1.2, Number(s.dur)), f = Number(s.phase) || 0, d = St ? an(u, f) : nn(u, f), p = St ? Math.max(1, Math.round(u * Fo)) : 0;
          b.push(`<circle class="sv-star" cx="${a}" cy="${i}" r="${r}"
            fill="rgba(242,246,255,0.98)"
            style="--star-op:${h};animation-duration:${u.toFixed(2)}s;--sv-phase-delay:${d.toFixed(3)}s;animation-delay:${d.toFixed(3)}s;--sv-steps:${p}"/>`);
        } else
          b.push(`<circle cx="${a}" cy="${i}" r="${r}" fill="rgba(242,246,255,${h})"/>`);
      }), b.push("</g>");
    }
    if (fa && vo > 0.03) {
      const t = So * (Cf * 2), e = `rgb(${Ii.join(",")})`, s = `moon-disc-clip-${Math.round(ve)}-${Math.round(Se)}-${Math.round(So)}`;
      b.push(`<defs><clipPath id="${s}"><circle cx="${ve}" cy="${Se}" r="${So}"/></clipPath></defs>`), b.push(`<circle cx="${ve}" cy="${Se}" r="${So * 1.25}" fill="rgba(196,206,255,${hs * 0.22})"/>`), b.push(`<g clip-path="url(#${s})">`), b.push(`<circle cx="${ve}" cy="${Se}" r="${So}" fill="rgba(238,244,255,${hs})"/>`), b.push(`<circle cx="${ve + t}" cy="${Se}" r="${So * 0.98}" fill="${e}" opacity="${hs * 0.98}"/>`);
      const a = ve - So * 0.34, i = Se + So * 0.3, r = So * 0.24;
      b.push(`<circle cx="${a}" cy="${i}" r="${r}" fill="rgba(152,162,180,${hs * 0.72})"/>`), b.push(`<circle cx="${a + r * 0.14}" cy="${i + r * 0.16}" r="${r * 0.64}" fill="rgba(90,102,122,${hs * 0.42})"/>`), b.push("</g>"), b.push(`<circle cx="${ve}" cy="${Se}" r="${So}" fill="none" stroke="rgba(255,255,255,${hs * 0.32})" stroke-width="1"/>`);
    }
    if (tn) {
      const t = S(Kh, 0, 1), e = [0.3, 0.42, 0.24], s = [0.46, 0.6, 0.38], a = [
        { y: pn * (e[0] + (s[0] - e[0]) * t), s: 0.76 * ii, dur: 38 / Math.max(0.2, ri), phase: 0.12 },
        { y: pn * (e[1] + (s[1] - e[1]) * t), s: 1 * ii, dur: 56 / Math.max(0.2, ri), phase: 0.48 },
        { y: pn * (e[2] + (s[2] - e[2]) * t), s: 0.66 * ii, dur: 76 / Math.max(0.2, ri), phase: 0.78 }
      ];
      b.push('<g clip-path="url(#sky-cloud-clip)">'), a.forEach((i) => {
        const r = 1 - 0.35 * mn, h = S(kr * r, 0, 1), u = S(kr * 0.75 * r, 0, 1);
        [-(i.phase * i.dur), -((i.phase + 0.5) * i.dur)].forEach((d) => {
          b.push(`<g transform="translate(0 ${i.y}) scale(${i.s})">`);
          const p = _a ? 6 : St ? 3 : 1, m = i.dur * p, g = St ? Math.max(1, Math.round(m * Fo)) : 0, y = -d, x = St ? an(m, y) : nn(m, y);
          b.push(`<g class="sv-sky-cloud" style="animation-duration:${m}s;--sv-phase-delay:${x.toFixed(3)}s;animation-delay:${x.toFixed(3)}s;--sv-steps:${g}">`), b.push('<g filter="url(#sky-cloud-blur)">'), b.push(`<ellipse cx="0" cy="0" rx="52" ry="20" fill="rgba(255,255,255,${h})"/>`), b.push(`<ellipse cx="28" cy="-12" rx="36" ry="17" fill="rgba(255,255,255,${u})"/>`), b.push(`<ellipse cx="-26" cy="-10" rx="30" ry="15" fill="rgba(255,255,255,${u})"/>`), b.push(`<ellipse cx="64" cy="-4" rx="24" ry="12" fill="rgba(255,255,255,${u * 0.95})"/>`), b.push("</g>"), b.push("</g>"), b.push("</g>");
        });
      }), b.push("</g>");
    }
    const u0 = () => {
      const t = Re[0] - Me[0], e = Re[1] - Me[1], s = Math.hypot(t, e);
      if (s <= 1e-3) return;
      const a = -e / s, i = t / s, r = t / s, h = e / s, u = Re[0] - r * Ce, f = Re[1] - h * Ce, d = [u + a * Ce * 0.62, f + i * Ce * 0.62], p = [u - a * Ce * 0.62, f - i * Ce * 0.62], m = Math.max(0.8, Jf * 0.55 + Qf * 0.75), g = [
        [Re[0], Re[1]],
        [p[0], p[1]],
        [d[0], d[1]]
      ], y = g.map((M) => `${M[0]},${M[1]}`).join(" "), x = Math.max(1.1, Ce * 0.16);
      if (Hr) {
        const M = ed * Gi, E = M * 0.55, A = M * 0.75, L = g.map((I) => [I[0] + E, I[1] + A]).map((I) => `${I[0]},${I[1]}`).join(" ");
        b.push(`<line x1="${Me[0] + E}" y1="${Me[1] + A}" x2="${u + E}" y2="${f + A}"
          stroke="${ge}" stroke-opacity="${S(ui, 0, 1)}" stroke-width="${m}"
          stroke-linecap="round" filter="url(#floor-pointer-shadow-blur)"/>`), b.push(`<polygon points="${L}" fill="${ge}" fill-opacity="${S(ui * 0.95, 0, 1)}"
          stroke="${ge}" stroke-opacity="${S(ui * 0.95, 0, 1)}"
          stroke-width="${x}" stroke-linejoin="round" filter="url(#floor-pointer-shadow-blur)"/>`);
      }
      b.push(`<line x1="${Me[0]}" y1="${Me[1]}" x2="${u}" y2="${f}"
        stroke="${hi}" stroke-width="${m}" stroke-linecap="round" opacity="0.92"/>`), b.push(`<polygon points="${y}" fill="${hi}" opacity="0.95"
        stroke="${hi}" stroke-width="${x}" stroke-linejoin="round"/>`);
    }, d0 = () => {
      if (!wh) return;
      const t = S(Sh, 0.8, 1.9), e = Math.max(0.08, vh), s = 1 + Mh, a = s + e, i = st + 5e-4, r = (y) => U(V(qt(y))), h = r([-t / 2, i, s]), u = r([t / 2, i, s]), f = r([t / 2, i, a]), d = r([-t / 2, i, a]);
      b.push(`<polygon points="${h[0]},${h[1]} ${u[0]},${u[1]} ${f[0]},${f[1]} ${d[0]},${d[1]}"
        fill="${Rh}" opacity="0.9"/>`);
      const p = (y, x, M) => [y[0] + (x[0] - y[0]) * M, y[1] + (x[1] - y[1]) * M];
      [0.25, 0.5, 0.75].forEach((y) => {
        const x = p(h, u, y), M = p(d, f, y);
        b.push(`<line x1="${x[0]}" y1="${x[1]}" x2="${M[0]}" y2="${M[1]}"
          stroke="${vr}" stroke-width="${Sr}" opacity="0.65"/>`);
      });
      const m = p(h, d, 0.5), g = p(u, f, 0.5);
      b.push(`<line x1="${m[0]}" y1="${m[1]}" x2="${g[0]}" y2="${g[1]}"
        stroke="${vr}" stroke-width="${Sr}" opacity="0.65"/>`);
    };
    if (Wo > 0.1 && jc.forEach((t, e) => {
      const s = t.map((i) => `${i[0]},${i[1]}`).join(" "), a = S(0.86 - e * 0.08, 0.62, 0.9);
      b.push(`<polygon points="${s}" fill="${re}" opacity="${a}"/>`);
    }), b.push(`<path d="${Wa}" fill="${ae}" stroke="${vs}" stroke-width="${Ss}"/>`), ce && ft > 1e-3 && b.push(`<path d="${Wa}" fill="url(#floor-grass-grad)"/>`), d0(), Qa && Ft && yn && $n && b.push(`<path d="${Wa}" fill="url(#sunlight-grad)"/>`), en && !Ft && _n && xn && b.push(`<path d="${Wa}" fill="url(#moonlight-grad)"/>`), Ka && Dc) {
      const t = bn ? bn.map((s) => [s[0], s[1]]) : [], e = sf(t, c0);
      if (e.length >= 3) {
        const s = e.map((i) => i[0] + "," + i[1]).join(" "), a = 1 - 0.4 * ds;
        b.push(`<polygon points="${s}" fill="${ge}" opacity="${Ch * a}" filter="url(#shadow-blur-soft)"/>`), b.push(`<polygon points="${s}" fill="${ge}" opacity="${Nh * a}" filter="url(#shadow-blur-contact)"/>`);
      }
    }
    u0(), Ja && Bi && b.push(`<polygon points="${Bi}" fill="${Ph}" opacity="${Fh}" filter="url(#base-anchor-shadow-blur)"/>`), b.push(`<polygon points="${Gf.join(" ")}" fill="none" stroke="${Pr}" stroke-width="${Dr}" stroke-linecap="round"/>`), b.push(`<polygon points="${Uf.join(" ")}" fill="none" stroke="${Iu}" stroke-width="${Ou}" stroke-linecap="round"/>`), b.push(`<polygon points="${jf.join(" ")}" fill="none" stroke="${Pr}" stroke-width="${Dr}" stroke-linecap="round"/>`), zr && Nc.forEach((t) => {
      const e = t.isMajor ? Uu : Gu;
      b.push(`<line x1="${t.pIn[0]}" y1="${t.pIn[1]}" x2="${t.pOut[0]}" y2="${t.pOut[1]}" stroke="${Vu}" stroke-width="${e}"/>`);
    }), Xf.forEach((t) => {
      b.push(`<text x="${t.x}" y="${t.y}" fill="white"
        font-size="${Xu * t.scale}"
        stroke="rgba(0,0,0,0.6)" stroke-width="${Qu * t.scale}"
        font-weight="700" text-anchor="middle">${t.t}</text>`);
    });
    const f0 = {
      front: [1, 0, 0],
      back: [1, 0, 0],
      right: [0, 0, 1],
      left: [0, 0, 1]
    };
    Fc.forEach((t) => {
      const e = f0[t.id];
      if (!e) return;
      const s = qt(e), a = qt(t.pos), i = t.id === "front" || t.id === "left" ? e.map((y) => -y) : e, r = qt(i), h = nf(a, s, af(s), r, !1);
      if (!h) return;
      const { basis: u, centerScr: f } = h, d = S(f[3] * nd, ad, id), p = sd * d, m = hd * d, g = f[1] - rd * d;
      b.push(`<text x="0" y="0"
        fill="${cd}"
        font-size="${p}"
        stroke="${ld}"
        stroke-width="${m}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
        transform="matrix(${u.bx} ${u.by} ${u.ux} ${u.uy} ${f[0]} ${g})">${t.label}</text>`);
    });
    const p0 = Number(this._cssGlobalTimeSec || Kr), m0 = Math.floor(p0 / 1.6);
    let Xc = _a ? 1 : 0;
    const Yc = (t, e = 1, s = 1) => {
      const a = t.length > 0 ? (m0 % t.length + t.length) % t.length : -1;
      t.forEach((i, r) => {
        const h = S(
          rn / (rn + i.zCam) * Vh,
          Gh,
          Uh
        ), u = Math.max(0.7, Bh * we * h), f = S(zh * s * h, 0, 1);
        b.push(`<line x1="${Mt[0]}" y1="${Mt[1]}" x2="${i.x}" y2="${i.y}"
          stroke="rgba(255,255,150,${f})" stroke-width="${u}"/>`);
        let d = !1;
        if (_a)
          d = Xc > 0 && r === a, d && (Xc -= 1);
        else {
          const p = r % 3 !== 2, m = !St || r % 2 === 0;
          d = p && m;
        }
        if (oi && Ft && d) {
          const p = Math.max(0.6, u * Oh), m = Math.max(0.2, Hh), g = r * Ih, y = St ? an(m, g) : nn(m, g), x = S(Wh * e * h, 0, 1), M = St ? Math.max(1, Math.round(m * Fo)) : 0;
          b.push(`<line x1="${Mt[0]}" y1="${Mt[1]}" x2="${i.x}" y2="${i.y}"
            class="sv-beam-flow"
            style="animation-duration:${m}s;--sv-phase-delay:${y.toFixed(3)}s;animation-delay:${y.toFixed(3)}s;--sv-steps:${M}"
            stroke="${Lh}" stroke-opacity="${x}" stroke-width="${p}"
            stroke-linecap="round" stroke-dasharray="${ei} ${si}" stroke-dashoffset="0"/>`);
        }
      });
    };
    Ft && Yc(Ki);
    const b0 = lf.map((t) => {
      const e = t.i.map((i) => Ao[i]), s = To[t.id] ?? 1, a = Ot(t.c, s);
      return { type: "cube", id: t.id, pts: e, z: $e(e), fill: a, opacity: 1 };
    }), ms = [];
    so || (hf.forEach((t) => {
      const e = Math.min(...t.pts.map((s) => s[2]));
      ms.push({
        type: "roofSide",
        pts: t.pts,
        // Use nearest point depth so side panels do not fall behind adjacent wall triangles.
        z: e - Tr,
        fill: Pi(t.wall),
        opacity: li
      });
    }), Di && ms.push({
      type: "roofCap",
      pts: Di,
      z: $e(Di) + Tr * 0.35,
      fill: mf,
      opacity: li
    }));
    let bs = $e(Ea);
    if (ms.length) {
      const t = Math.min(...ms.map((s) => s.z)), e = Math.max(...ms.map((s) => s.z));
      qo ? bs = Math.min(bs, t - 0.02) : bs = Math.max(bs, e + 0.02);
    } else
      bs += qo ? -1e-3 : 1e-3;
    const Zc = !so && pe && (qo || Du) ? {
      type: "roofPlane",
      pts: Ea,
      z: bs,
      fill: qo ? pf : ff,
      opacity: qo ? Zn : zu
    } : null, Kc = b0.concat(ms).concat(Po).concat(Zc ? [Zc] : []).sort((t, e) => {
      const s = e.z - t.z, a = String((t == null ? void 0 : t.type) || ""), i = String((e == null ? void 0 : e.type) || ""), r = a.startsWith("flatRoofEdge-"), h = i.startsWith("flatRoofEdge-"), u = a.startsWith("flatRoofSkirt-"), f = i.startsWith("flatRoofSkirt-");
      if (r && h || u && f || (a === "roofSide" || a === "roofCap") && (i === "roofSide" || i === "roofCap")) {
        if (Math.abs(s) > 1e-6) return s;
      } else if (Math.abs(s) > 0.015)
        return s;
      const m = (y) => {
        const x = String((y == null ? void 0 : y.type) || "");
        return x.startsWith("flatRoofSkirt-") ? 0.7 : x === "roofCap" ? 0.9 : x === "flatRoofTop" || x === "roofPlane" ? 1 : x === "cube" ? 1.4 : x === "roofSide" ? 1.55 : x.startsWith("flatRoofEdge-") ? 1.8 : x === "flatRoofBottom" ? 3 : 1;
      }, g = m(t) - m(e);
      return Math.abs(g) > 1e-6 ? g : s;
    }), g0 = (t, e) => {
      if (!$h || !(t === "front" || t === "right" || t === "back" || t === "left") || !e || e.length < 4) return;
      const s = e[0], a = e[1], i = e[2], r = e[3], h = (m, g, y) => [m[0] + (g[0] - m[0]) * y, m[1] + (g[1] - m[1]) * y], u = S(_h, 0.015, 0.22), f = h(s, r, u), d = h(a, i, u), p = Ot(Qt[t], (To[t] ?? 1) * S(xh, 0.2, 1.2));
      b.push(`<polygon points="${s[0]},${s[1]} ${a[0]},${a[1]} ${d[0]},${d[1]} ${f[0]},${f[1]}"
        fill="${p}" opacity="0.95"/>`);
    }, y0 = (t) => {
      if (!Vr || !ji[t]) return;
      const e = ki[t], s = yc[t];
      if (!(e != null && e.indices) || e.indices.length < 4 || !s) return;
      const [a, i, r, h] = e.indices, u = ut[a], f = ut[i], d = ut[r], p = ut[h];
      if (!u || !f || !d || !p) return;
      const m = Et(qt(s)), g = (Ne) => [
        Ne[0] + m[0] * fi,
        Ne[1] + m[1] * fi,
        Ne[2] + m[2] * fi
      ], y = Math.hypot(f[0] - u[0], f[1] - u[1], f[2] - u[2]);
      if (!isFinite(y) || y <= 1e-6) return;
      const x = S(fd, -0.9, 0.9), M = S((x + 1) / 2, 0.02, 0.98), E = g(Bt(u, p, M)), A = g(Bt(f, d, M)), B = [
        (E[0] + A[0]) * 0.5,
        (E[1] + A[1]) * 0.5,
        (E[2] + A[2]) * 0.5
      ], L = U(V(B)), I = S(L[3] * pd, md, bd), v = ba * I, w = S(M - 0.05, 0, 1), C = S(M + 0.05, 0, 1), H = Math.abs(C - w);
      if (H < 1e-5) return;
      const O = g(Bt(u, p, w)), X = g(Bt(u, p, C)), rt = U(V(O)), $t = U(V(X)), pt = Math.hypot($t[0] - rt[0], $t[1] - rt[1]), Tt = H * 2;
      if (!isFinite(pt) || pt <= 1e-6 || Tt <= 1e-6) return;
      const Ro = pt / Tt;
      if (!isFinite(Ro) || Ro <= 1e-6) return;
      const zo = S(v / Ro, 0.04, 1.2), Jo = di / Math.max(1e-6, ba) * zo, Qo = Math.max(zo * 1.6, 0.08), Bo = S(M + Qo / 2, 0, 1);
      if (Math.abs(Bo - M) < 1e-6) return;
      const Yt = g(Bt(u, p, Bo)), ao = U(V(E)), Co = U(V(A)), Lo = U(V(Yt)), Ht = [[0, 0], [y, 0], [0, -Qo]], _t = [[ao[0], ao[1]], [Co[0], Co[1]], [Lo[0], Lo[1]]], dt = bc(Ht, _t);
      if (!dt) return;
      const xt = Math.sign((Ht[1][0] - Ht[0][0]) * (Ht[2][1] - Ht[0][1]) - (Ht[1][1] - Ht[0][1]) * (Ht[2][0] - Ht[0][0])), te = Math.sign((_t[1][0] - _t[0][0]) * (_t[2][1] - _t[0][1]) - (_t[1][1] - _t[0][1]) * (_t[2][0] - _t[0][0])), io = xt !== 0 && te !== 0 && xt !== te, ke = Math.hypot(dt.a, dt.b), Ia = Math.hypot(dt.c, dt.d);
      let ys = 1;
      if (ke > 1e-6 && Ia > 1e-6) {
        const Ne = S(gd, 0, 1), Mn = Math.pow(Ia / ke, Ne);
        ys = S(Mn, yd, $d);
      }
      b.push(`<g transform="matrix(${dt.a} ${dt.b} ${dt.c} ${dt.d} ${dt.e} ${dt.f})">`), io && b.push(`<g transform="translate(${y} 0) scale(-1 1)">`), Math.abs(ys - 1) > 0.01 && b.push(`<g transform="translate(${y / 2} 0) scale(${ys} 1) translate(${-y / 2} 0)">`), b.push(`<text x="${y / 2}" y="0"
        fill="${Gr}"
        font-size="${zo}"
        stroke="${Ur}"
        stroke-width="${Jo}"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="middle">${fc(ln[t])}</text>`), Math.abs(ys - 1) > 0.01 && b.push("</g>"), io && b.push("</g>"), b.push("</g>");
    }, $0 = () => {
      if (!vd || !Ui.front) return;
      const t = -pi / 2, e = pi / 2, s = S(-1 + Sd, -1, 1), a = S(s + jr, -1, 1), i = 1 + Md, r = (A) => U(V(qt(A))), f = [
        [t, s, i],
        [e, s, i],
        [e, a, i],
        [t, a, i]
      ].map(r).map((A) => `${A[0]},${A[1]}`).join(",");
      b.push(`<polygon points="${f}" fill="${Cd}" opacity="${qr}"/>`);
      const d = Math.min(0.08, Math.max(0.04, pi * 0.14)), p = Math.min(0.08, Math.max(0.04, jr * 0.1)), y = [
        [t + d, s + p, i + 3e-3],
        [e - d, s + p, i + 3e-3],
        [e - d, a - p, i + 3e-3],
        [t + d, a - p, i + 3e-3]
      ].map(r).map((A) => `${A[0]},${A[1]}`).join(",");
      b.push(`<polygon points="${y}" fill="${Rd}" opacity="${qr}"/>`);
      const x = [e - d - 0.05, s + (a - s) * 0.45, i + 6e-3], M = r(x), E = Math.max(0.6, M[3]);
      b.push(`<circle cx="${M[0]}" cy="${M[1]}" r="${1.8 * E}" fill="${kd}" opacity="0.95"/>`);
    }, _0 = (t, e) => {
      if (!oa || !(t === "left" || t === "right" || t === "back") || !e || e.length < 4) return;
      const s = S(To[t] ?? 1, 0.2, 1), a = e[0], i = e[1], r = e[2], h = e[3], u = (C, H, O) => [C[0] + (H[0] - C[0]) * O, C[1] + (H[1] - C[1]) * O], f = (C, H) => {
        const O = u(a, h, H), X = u(i, r, H);
        return u(O, X, C);
      }, d = t === "back" ? 0.2 : 0.24, p = t === "back" ? 0.8 : 0.76, m = 0.2, g = m + (0.74 - m) * 0.75, x = [
        f(d, m),
        f(p, m),
        f(p, g),
        f(d, g)
      ].map((C) => `${C[0]},${C[1]}`).join(",");
      b.push(`<polygon points="${x}" fill="${ea}" opacity="${0.98 * s}"/>`);
      const M = 0.035, E = 0.05, B = [
        f(d + M, m + E),
        f(p - M, m + E),
        f(p - M, g - E),
        f(d + M, g - E)
      ].map((C) => `${C[0]},${C[1]}`).join(",");
      b.push(`<polygon points="${B}" fill="${sa}" opacity="${0.95 * s}"/>`);
      const L = f((d + p) * 0.5, m + E), I = f((d + p) * 0.5, g - E);
      b.push(`<line x1="${L[0]}" y1="${L[1]}" x2="${I[0]}" y2="${I[1]}"
        stroke="${na}" stroke-width="${js}" opacity="${0.9 * s}"/>`);
      const v = f(d + M * 1.4, m + E * 1.2), w = f(p - M * 1.6, g - E * 1.3);
      b.push(`<line x1="${v[0]}" y1="${v[1]}" x2="${w[0]}" y2="${w[1]}"
        stroke="rgba(255,255,255,0.32)" stroke-width="${Math.max(0.8, js * 0.9)}" opacity="${s}"/>`);
    }, Ha = dc([0, 0, -1]), Jc = Math.hypot(be, _), Qc = Math.hypot(Ha[0], Ha[2]), er = Jc > 1e-6 && Qc > 1e-6 && (be * Ha[0] + _ * Ha[2]) / (Jc * Qc) < 0;
    function tl(t, e) {
      if (!Js || !Wt) return;
      const s = (E) => U(V(E)), a = be, i = _, r = S(W, 0.4, 2.5), h = [a, st + 0.35 * r, i];
      let u = !0;
      if (er)
        u = !1;
      else if (e) {
        const E = V(h), A = U(E), B = e(A[0], A[1]);
        u = B == null || E[2] <= B - 8e-3;
      }
      if (t === "front" !== u) return;
      const f = s([a, st, i]), d = s([a, st + 0.86 * r, i]), p = Math.max(2.6, 8.5 * d[3] * r), m = S(1 + gh * 10, 0.6, 2.5), g = Math.max(2.2, p * 0.62 * m), y = Math.max(1.1, p * 0.24 * m), x = f[0], M = f[1] + y * 0.28;
      b.push(`<ellipse cx="${x}" cy="${M}" rx="${g}" ry="${y}"
        fill="${ge}" opacity="${S(Qs, 0, 1)}" filter="url(#back-tree-shadow-blur)"/>`);
    }
    function ol(t, e) {
      if (!Js) return;
      const s = (v) => U(V(v)), a = (v) => {
        if (er) return !1;
        if (!e) return !0;
        const w = V(v), C = U(w), H = e(C[0], C[1]);
        return H == null || w[2] <= H - 8e-3;
      }, i = (v, w, C, H) => {
        if (er) return !1;
        if (!e) return !0;
        const O = [
          [0.92, 0],
          [-0.92, 0],
          [0, 0.92],
          [0, -0.92],
          [0.66, 0.66],
          [-0.66, 0.66],
          [0.66, -0.66],
          [-0.66, -0.66]
        ];
        let X = 0;
        for (const [$t, pt] of O) {
          const Tt = e(w + $t * H, C + pt * H);
          (Tt == null || v <= Tt - 8e-3) && X++;
        }
        return X / O.length >= 0.4;
      }, r = be, h = _, u = S(W, 0.4, 2.5), f = S(1 - 0.55 * mn, 0.35, 1), d = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(Y) ? Ot(Y, 0.72 * f) : Y, p = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(Y) ? Ot(Y, 1.18 - 0.4 * mn) : "rgba(255,255,255,0.30)", m = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(Nt) ? Ot(Nt, 0.72 * f) : Nt, g = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(Nt) ? Ot(Nt, 1.2 - 0.45 * mn) : "rgba(255,255,255,0.25)", y = S(1 - 0.3 * mn, 0.55, 1), x = s([r, st, h]), M = s([r, st + 0.86 * u, h]), E = Math.max(2.6, 8.5 * M[3] * u), A = [
        [r, st + 0.22 * u, h],
        [r, st + 0.45 * u, h],
        [r, st + 0.72 * u, h]
      ];
      let B = 0;
      A.forEach((v) => {
        a(v) && B++;
      });
      const L = B / A.length >= 0.4;
      if (t === "front" === L) {
        const v = M[0] - x[0], w = M[1] - x[1], C = Math.max(1e-3, Math.hypot(v, w)), H = -w / C, O = v / C, X = Math.max(0.35, E * 0.12);
        b.push(`<line x1="${x[0]}" y1="${x[1]}" x2="${M[0]}" y2="${M[1]}"
          stroke="${m}" stroke-width="${E}" stroke-linecap="round" opacity="${y}"/>`), b.push(`<line x1="${x[0] + H * X}" y1="${x[1] + O * X}" x2="${M[0] + H * X}" y2="${M[1] + O * X}"
          stroke="${g}" stroke-width="${Math.max(1.1, E * 0.36)}" stroke-linecap="round" opacity="${0.55 * y}"/>`);
      }
      [
        [r, st + 1.02 * u, h, 0.28],
        [r - 0.18 * u, st + 0.9 * u, h + 0.06 * u, 0.22],
        [r + 0.2 * u, st + 0.86 * u, h - 0.07 * u, 0.2]
      ].forEach((v) => {
        const w = s([v[0], v[1], v[2]]), C = V([v[0], v[1], v[2]]), H = Math.max(6, Kt * v[3] * w[3] * 0.95), O = i(C[2], w[0], w[1], H * 0.92);
        t === "front" === O && (b.push(`<circle cx="${w[0]}" cy="${w[1]}" r="${H}" fill="${d}" opacity="${y}"/>`), b.push(`<circle cx="${w[0] - H * 0.2}" cy="${w[1] - H * 0.24}" r="${H * 0.62}" fill="${p}" opacity="${0.52 * y}"/>`), b.push(`<circle cx="${w[0] + H * 0.28}" cy="${w[1] + H * 0.22}" r="${H * 0.52}" fill="${d}" opacity="${0.26 * y}"/>`));
      });
    }
    function sr(t, e, s = "all") {
      if (!wr || !Number.isFinite(Qe) || !Number.isFinite(ts)) return;
      const a = (R) => U(V(R)), i = (R) => V(R), r = (R, P) => Math.hypot(R[0] - P[0], R[1] - P[1], R[2] - P[2]), h = (R, P) => {
        const T = a(R), D = a(P);
        return Math.max(0.35, (T[3] + D[3]) * 0.5);
      }, u = (R) => {
        if (!e) return !0;
        const P = i(R), T = U(P), D = e(T[0], T[1]);
        return D == null || P[2] <= D - 8e-3;
      }, f = (R, P, T = 0.72) => {
        if (!e) return !0;
        const D = [0.04, 0.14, 0.24, 0.34, 0.44, 0.56, 0.66, 0.76, 0.86, 0.96];
        let Z = 0;
        return D.forEach((ot) => {
          u(Bt(R, P, ot)) && Z++;
        }), Z >= Math.ceil(D.length * S(T, 0, 1));
      }, d = (R, P) => f(R, P, 0.72), p = (R, P) => f(R, P, 0.92), m = (R, P) => f(R, P, 0.72), g = 6e-3, y = (R, P) => {
        if (t !== "front" || s === "all" || !Ft || !Number.isFinite(Xo[2])) return !0;
        const T = i(R)[2], D = i(P)[2], Z = (T + D) * 0.5;
        return s === "behind_sun" ? Z > Xo[2] + g : Z <= Xo[2] + g;
      }, x = (R) => {
        if (t !== "front" || s === "all" || !Ft || !Number.isFinite(Xo[2])) return !0;
        const P = i(R)[2];
        return s === "behind_sun" ? P > Xo[2] + g : P <= Xo[2] + g;
      }, M = (R) => {
        let P = 0;
        for (let T = 0; T < R.length - 1; T++) {
          const D = R[T], Z = R[T + 1];
          P += Math.hypot(Z[0] - D[0], Z[1] - D[1]);
        }
        return P;
      }, E = (R) => R.length ? `M ${R[0][0]} ${R[0][1]} ` + R.slice(1).map((P) => `L ${P[0]} ${P[1]}`).join(" ") : "", A = {
        front: [ut[4], ut[5], ut[6], ut[7]],
        right: [ut[1], ut[5], ut[6], ut[2]],
        back: [ut[0], ut[1], ut[2], ut[3]],
        left: [ut[0], ut[4], ut[7], ut[3]]
      }, B = [Qe, st + 0.55, ts], L = [0, 0, 0], I = Object.keys(A).map((R) => {
        const P = A[R], T = P[0], D = P[1], Z = P[2], ot = P[3], K = Et([D[0] - T[0], D[1] - T[1], D[2] - T[2]]), tt = Et([ot[0] - T[0], ot[1] - T[1], ot[2] - T[2]]), wt = Math.max(1e-6, Math.hypot(D[0] - T[0], D[1] - T[1], D[2] - T[2])), bt = Math.max(1e-6, Math.hypot(ot[0] - T[0], ot[1] - T[1], ot[2] - T[2]));
        let at = Et([
          K[1] * tt[2] - K[2] * tt[1],
          K[2] * tt[0] - K[0] * tt[2],
          K[0] * tt[1] - K[1] * tt[0]
        ]);
        const It = [
          (T[0] + D[0] + Z[0] + ot[0]) / 4,
          (T[1] + D[1] + Z[1] + ot[1]) / 4,
          (T[2] + D[2] + Z[2] + ot[2]) / 4
        ], $s = [It[0] - L[0], 0, It[2] - L[2]];
        at[0] * $s[0] + at[2] * $s[2] < 0 && (at = [-at[0], -at[1], -at[2]]);
        const oe = [B[0] - T[0], B[1] - T[1], B[2] - T[2]], ko = S(Ca(oe, K), 0, wt), Rn = S(Ca(oe, tt), 0, bt), ee = [
          T[0] + K[0] * ko + tt[0] * Rn,
          T[1] + K[1] * ko + tt[1] * Rn,
          T[2] + K[2] * ko + tt[2] * Rn
        ], Va = Math.hypot(B[0] - ee[0], B[1] - ee[1], B[2] - ee[2]), Ga = [B[0] - It[0], 0, B[2] - It[2]], ql = Math.max(1e-6, Math.hypot(Ga[0], Ga[2])), Xl = [Ga[0] / ql, 0, Ga[2] / ql], D0 = at[0] * Xl[0] + at[2] * Xl[2];
        return { id: R, bl: T, br: D, tr: Z, tl: ot, uDir: K, vDir: tt, uLen: wt, vLen: bt, normal: at, center: It, dist: Va, facing: D0 };
      });
      I.sort((R, P) => P.facing - R.facing || R.dist - P.dist);
      let v = I[0];
      if ((!v || v.facing < -0.05) && (I.sort((R, P) => R.dist - P.dist), v = I[0]), !v) return;
      const w = S(To[v.id] ?? 1, 0.2, 1), C = S(
        Ca([B[0] - v.bl[0], B[1] - v.bl[1], B[2] - v.bl[2]], v.uDir) / v.uLen,
        0,
        1
      ), H = S(C <= 0.5 ? 0.12 : 0.88, 0.1, 0.9), O = 0.8, X = 0.024, rt = 0.045, pt = S(0.605 + rt, rt + 0.02, 0.92), Tt = 0.026, Ro = Bt(v.bl, v.br, H), zo = Bt(v.tl, v.tr, H), Jo = Bt(Ro, zo, O), Qo = Bt(Ro, zo, pt), Bo = v.normal, Yt = [
        Jo[0] + Bo[0] * Tt,
        Jo[1],
        Jo[2] + Bo[2] * Tt
      ], ao = [
        Qo[0] + Bo[0] * Tt,
        Qo[1],
        Qo[2] + Bo[2] * Tt
      ], Co = [Yt[0] - Qe, 0, Yt[2] - ts], Lo = Math.hypot(Co[0], Co[2]), Ht = Lo > 1e-6 ? [Co[0] / Lo, 0, Co[2] / Lo] : [0, 0, 1], _t = 2.02, dt = [Qe, st + 0.02, ts], xt = [Qe, st + _t, ts], te = 0.055, io = [
        xt[0] + Ht[0] * te,
        xt[1] - 0.02,
        xt[2] + Ht[2] * te
      ], ke = Math.hypot(Yt[0] - io[0], Yt[2] - io[2]), Ia = S(0.14 + ke * 0.1, 0.12, 0.34), ys = [
        (io[0] + Yt[0]) * 0.5,
        Math.min(io[1], Yt[1]) - Ia,
        (io[2] + Yt[2]) * 0.5
      ], Ne = (R, P, T, D) => {
        const Z = 1 - D;
        return [
          Z * Z * R[0] + 2 * Z * D * P[0] + D * D * T[0],
          Z * Z * R[1] + 2 * Z * D * P[1] + D * D * T[1],
          Z * Z * R[2] + 2 * Z * D * P[2] + D * D * T[2]
        ];
      }, Mn = [], Dl = 16;
      for (let R = 0; R <= Dl; R++) {
        const P = R / Dl;
        Mn.push(Ne(io, ys, Yt, P));
      }
      const zl = [
        ao[0],
        ao[1] + v.vLen * rt,
        ao[2]
      ], Bl = [
        Yt,
        Bt(Yt, zl, 0.5),
        zl
      ], Ll = [...Mn, ...Bl.slice(1)], ir = "rgba(118,80,46,0.98)", rr = "rgba(176,136,90,0.68)", k0 = "rgba(8,10,14,0.98)", N0 = As ? "rgba(255,206,95,0.96)" : "rgba(120,200,255,0.95)", E0 = (R, P, T, D, Z = 1, ot = d) => {
        if (!y(R, P)) return;
        const K = ot(R, P);
        if (t === "front" !== K) return;
        const tt = a(R), wt = a(P), bt = Math.max(0.9, h(R, P) * D);
        b.push(`<line x1="${tt[0]}" y1="${tt[1]}" x2="${wt[0]}" y2="${wt[1]}" stroke="${T}" stroke-width="${bt}" stroke-linecap="round" opacity="${Z}"/>`);
      }, F0 = (R, P, T, D = !1) => {
        const Z = Math.max(1, Math.ceil(r(R, P) / 0.08)), ot = D ? m : d;
        for (let K = 0; K < Z; K++) {
          const tt = K / Z, wt = (K + 1) / Z, bt = Bt(R, P, tt), at = Bt(R, P, wt);
          E0(bt, at, k0, T, 1, ot);
        }
      }, Wl = (R, P, T = !1) => {
        for (let D = 0; D < R.length - 1; D++)
          F0(R[D], R[D + 1], P, T);
      }, A0 = (R, P = d) => {
        const T = [];
        let D = [];
        for (let Z = 0; Z < R.length - 1; Z++) {
          const ot = R[Z], K = R[Z + 1];
          if (!y(ot, K)) {
            D.length && (T.push(D), D = []);
            continue;
          }
          const tt = P(ot, K);
          if (t === "front" === tt) {
            const wt = a(ot), bt = a(K);
            D.length || D.push([wt[0], wt[1]]), D.push([bt[0], bt[1]]);
          } else D.length && (T.push(D), D = []);
        }
        return D.length && T.push(D), T;
      }, ro = v.uDir, co = v.vDir, lo = v.uLen * X, ho = v.vLen * rt, uo = ao, cr = [
        [
          uo[0] - ro[0] * lo - co[0] * ho,
          uo[1] - ro[1] * lo - co[1] * ho,
          uo[2] - ro[2] * lo - co[2] * ho
        ],
        [
          uo[0] + ro[0] * lo - co[0] * ho,
          uo[1] + ro[1] * lo - co[1] * ho,
          uo[2] + ro[2] * lo - co[2] * ho
        ],
        [
          uo[0] + ro[0] * lo + co[0] * ho,
          uo[1] + ro[1] * lo + co[1] * ho,
          uo[2] + ro[2] * lo + co[2] * ho
        ],
        [
          uo[0] - ro[0] * lo + co[0] * ho,
          uo[1] - ro[1] * lo + co[1] * ho,
          uo[2] - ro[2] * lo + co[2] * ho
        ]
      ], T0 = u(ao);
      if (t === "front" === T0 && x(ao)) {
        const P = cr.map((tt) => a(tt)).map((tt) => `${tt[0]},${tt[1]}`).join(" "), T = Ot("#96a0ae", w), D = Ot("#1a1f29", Math.max(0.45, w)), Z = Ot("#f4d66e", Math.max(0.5, w));
        b.push(`<polygon points="${P}" fill="${T}" stroke="${D}" stroke-width="0.7"/>`);
        const ot = a(ao), K = Math.max(1.05, h(cr[0], cr[2]) * 0.62);
        b.push(`<circle cx="${ot[0]}" cy="${ot[1]}" r="${K}" fill="${Z}"/>`);
      }
      if (Wl(Mn, 1.9, !1), Wl(Bl, 1.55, !1), or && (t === "front" && (s === "all" || s === "front_of_sun"))) {
        const R = As ? Ll.slice().reverse() : Ll.slice(), P = [];
        let T = [], D = 0;
        for (let K = 0; K < R.length - 1; K++) {
          const tt = R[K], wt = R[K + 1], bt = Math.max(1, Math.ceil(r(tt, wt) / 0.08));
          for (let at = 0; at < bt; at++) {
            const It = at / bt, $s = (at + 1) / bt, oe = Bt(tt, wt, It), ko = Bt(tt, wt, $s), Rn = r(oe, ko);
            if (m(oe, ko)) {
              const ee = a(oe), Va = a(ko);
              T.length || T.push([ee[0], ee[1]]), T.push([Va[0], Va[1]]);
            } else if (T.length) {
              const ee = M(T);
              P.push({ pts: T, len: ee, endS: D }), T = [];
            }
            D += Rn;
          }
        }
        if (T.length) {
          const K = M(T);
          P.push({ pts: T, len: K, endS: D });
        }
        const Z = P.slice().sort((K, tt) => tt.endS - K.endS || tt.len - K.len), ot = Z.find((K) => K.len > 4) ?? Z[0] ?? null;
        if (ot && ot.pts.length >= 2 && ot.len > 3) {
          const K = E(ot.pts), tt = S(ot.len * 0.1, 7, 18), wt = ot.len + tt + 20, bt = St ? Math.max(1, Math.round(ua * Fo)) : 0, at = St ? an(ua, 0.11) : nn(ua, 0.11), It = Math.max(1, h(R[0], R[R.length - 1]) * 1.35);
          b.push(`<path class="sv-grid-pulse" d="${K}"
            style="animation-duration:${ua.toFixed(2)}s;--sv-phase-delay:${at.toFixed(3)}s;animation-delay:${at.toFixed(3)}s;--sv-steps:${bt};--grid-cycle:${wt.toFixed(2)};"
            fill="none" stroke="${N0}" stroke-opacity="0.98" stroke-width="${It}" stroke-linecap="round"
            stroke-dasharray="${tt.toFixed(2)} ${wt.toFixed(2)}" stroke-dashoffset="0"/>`);
        }
      }
      const Ol = [], Hl = 28;
      for (let R = 0; R <= Hl; R++)
        Ol.push(Bt(dt, xt, R / Hl));
      const Il = A0(Ol, p);
      if (Il.length) {
        const R = Math.max(1.2, h(dt, xt) * 7.8), P = Math.max(0.8, R * 0.26), T = a(dt), D = a(xt), Z = D[0] - T[0], ot = D[1] - T[1], K = Math.max(1e-3, Math.hypot(Z, ot)), tt = -ot / K, wt = Z / K, bt = Math.max(0.25, R * 0.15);
        if (Il.forEach((at) => {
          if (at.length < 2) return;
          const It = E(at);
          b.push(`<path d="${It}" fill="none" stroke="${ir}" stroke-width="${R}" stroke-linecap="butt" stroke-linejoin="round"/>`);
          const $s = at.map((ko) => [ko[0] + tt * bt, ko[1] + wt * bt]), oe = E($s);
          b.push(`<path d="${oe}" fill="none" stroke="${rr}" stroke-width="${P}" stroke-linecap="butt" stroke-linejoin="round" opacity="0.88"/>`);
        }), t === "front" === u(xt) && x(xt)) {
          const at = a(xt), It = R * 0.52;
          b.push(`<circle cx="${at[0]}" cy="${at[1]}" r="${It}" fill="${ir}"/>`), b.push(`<circle cx="${at[0] + tt * bt * 0.8}" cy="${at[1] + wt * bt * 0.8}" r="${Math.max(0.8, P * 0.5)}" fill="${rr}" opacity="0.82"/>`);
        }
        if (t === "front" === u(dt) && x(dt)) {
          const at = a(dt), It = R * 0.52;
          b.push(`<circle cx="${at[0]}" cy="${at[1]}" r="${It}" fill="${ir}"/>`), b.push(`<circle cx="${at[0] + tt * bt * 0.8}" cy="${at[1] + wt * bt * 0.8}" r="${Math.max(0.8, P * 0.5)}" fill="${rr}" opacity="0.82"/>`);
        }
      }
      const Vl = [Qe, st + 0.3, ts], Gl = V(Vl), Ul = U(Gl), jl = e ? e(Ul[0], Ul[1]) : null, P0 = jl == null || Gl[2] <= jl - 8e-3;
      if (t === "front" === P0 && x(Vl)) {
        const R = a(dt), P = a(xt), T = Math.max(2.4, 7.8 * P[3]), D = 1.05, Z = Math.max(2, T * 0.56 * D), ot = Math.max(1, T * 0.22 * D), K = Wt ? ' filter="url(#back-tree-shadow-blur)"' : "";
        b.push(`<ellipse cx="${R[0]}" cy="${R[1] + ot * 0.28}" rx="${Z}" ry="${ot}" fill="${ge}" opacity="${S(Qs * 0.85, 0, 1)}"${K}/>`);
      }
    }
    const el = () => {
      const t = so && Fi ? Fi : un, e = {
        front: { low: [3, 2], high: [0, 1] },
        back: { low: [0, 1], high: [3, 2] },
        left: { low: [0, 3], high: [1, 2] },
        right: { low: [1, 2], high: [0, 3] }
      }, s = e[J] ?? e.front;
      let a = t[s.low[0]], i = t[s.low[1]], r = t[s.high[0]], h = t[s.high[1]];
      if (!a || !i || !r || !h) return null;
      if (J === "front" || J === "back") {
        if (i[0] < a[0]) {
          const m = a;
          a = i, i = m;
          const g = r;
          r = h, h = g;
        }
      } else if (i[2] < a[2]) {
        const m = a;
        a = i, i = m;
        const g = r;
        r = h, h = g;
      }
      const u = Math.hypot(i[0] - a[0], i[1] - a[1], i[2] - a[2]), f = [(a[0] + i[0]) / 2, (a[1] + i[1]) / 2, (a[2] + i[2]) / 2], d = [(r[0] + h[0]) / 2, (r[1] + h[1]) / 2, (r[2] + h[2]) / 2], p = Math.hypot(d[0] - f[0], d[1] - f[1], d[2] - f[2]);
      return !isFinite(u) || !isFinite(p) || u <= 1e-6 || p <= 1e-6 ? null : { lowA: a, lowB: i, highA: r, highB: h, worldEdgeLen: u, roofHeightWorld: p };
    }, x0 = () => {
      if (!aa || !pe || !Ti) return;
      const t = el();
      if (!t) return;
      const { lowA: e, lowB: s, highA: a, highB: i } = t, r = Math.min(Xs, Ys), h = Math.max(Xs, Ys), u = la, f = ha, d = (1 - u) / 2, p = u, m = f * Math.max(0, Je - 1), g = (p - m) / Je;
      if (!isFinite(g) || g <= 0.01) return;
      const y = (B, L, I) => [B[0] + (L[0] - B[0]) * I, B[1] + (L[1] - B[1]) * I, B[2] + (L[2] - B[2]) * I], x = (B, L) => {
        const I = y(e, a, L), v = y(s, i, L), w = y(I, v, B);
        return U(V(w));
      }, M = dn(ia, S(go, 0.2, 1)), E = 0.55 + 0.4 * S(go, 0, 1), A = 0.3 + 0.5 * S(go, 0, 1);
      for (let B = 0; B < Je; B++) {
        const L = d + B * (g + f), I = L + g, v = x(L, r), w = x(I, r), C = x(I, h), H = x(L, h);
        b.push(`<polygon points="${v[0]},${v[1]} ${w[0]},${w[1]} ${C[0]},${C[1]} ${H[0]},${H[1]}"
          fill="${M}" opacity="0.96" stroke="${ra}" stroke-opacity="${E}" stroke-width="${ca}"/>`);
        const O = (X, rt, $t) => [X[0] + (rt[0] - X[0]) * $t, X[1] + (rt[1] - X[1]) * $t];
        for (let X = 1; X < Zs; X++) {
          const rt = X / Zs, $t = O(v, w, rt), pt = O(H, C, rt);
          b.push(`<line x1="${$t[0]}" y1="${$t[1]}" x2="${pt[0]}" y2="${pt[1]}"
            stroke="${qs}" stroke-opacity="${A}" stroke-width="0.7"/>`);
        }
        for (let X = 1; X < Ks; X++) {
          const rt = X / Ks, $t = O(v, H, rt), pt = O(w, C, rt);
          b.push(`<line x1="${$t[0]}" y1="${$t[1]}" x2="${pt[0]}" y2="${pt[1]}"
            stroke="${qs}" stroke-opacity="${A}" stroke-width="0.7"/>`);
        }
      }
    }, sl = () => {
      if (!Vr || !pe || !Ti) return;
      const t = el();
      if (!t) return;
      const { lowA: e, lowB: s, highA: a, highB: i, worldEdgeLen: r, roofHeightWorld: h } = t, u = fc(Ns);
      let f = -h * 0.38, d = -h * (2 / 3);
      const p = 1 / 6, m = r * (1 - 2 * p), g = "100%", y = "9.99 kW", x = Math.max(u.length, g.length);
      Math.max((Fs || "").length, y.length);
      const M = h * 0.36, E = Math.min(m / (0.6 * x), M), A = Math.min(E * _d, M * 1.05), B = di / ba * A, L = Math.min(A * xd, M * 0.85), I = di / ba * L;
      this._roofStripSeed = (this._roofStripSeed || 0) + 1;
      const v = (C, H, O) => [C[0] + (H[0] - C[0]) * O, C[1] + (H[1] - C[1]) * O, C[2] + (H[2] - C[2]) * O], w = (C, H, O, X, rt, $t, pt) => {
        if (!C) return;
        const Tt = Math.max(H * $t, h * 0.08), Ro = rt, zo = rt - Tt, Jo = S(-Ro / h, 0, 1), Qo = S(-zo / h, 0, 1), Bo = v(e, a, Jo), Yt = v(s, i, Jo), ao = v(e, a, Qo), Co = U(V(Bo)), Lo = U(V(Yt)), Ht = U(V(ao)), _t = [[0, Ro], [r, Ro], [0, zo]], dt = [[Co[0], Co[1]], [Lo[0], Lo[1]], [Ht[0], Ht[1]]], xt = bc(_t, dt);
        if (!xt) return;
        const te = Math.sign((_t[1][0] - _t[0][0]) * (_t[2][1] - _t[0][1]) - (_t[1][1] - _t[0][1]) * (_t[2][0] - _t[0][0])), io = Math.sign((dt[1][0] - dt[0][0]) * (dt[2][1] - dt[0][1]) - (dt[1][1] - dt[0][1]) * (dt[2][0] - dt[0][0])), ke = te !== 0 && io !== 0 && te !== io;
        b.push(`<g transform="matrix(${xt.a} ${xt.b} ${xt.c} ${xt.d} ${xt.e} ${xt.f})">`), ke && b.push(`<g transform="translate(${r} 0) scale(-1 1)">`), b.push(`<text x="${r / 2}" y="${rt}" fill="${X}" font-size="${H}"
          stroke="${Ur}" stroke-width="${O}" font-weight="700"
          text-anchor="middle" dominant-baseline="middle">${C}</text>`), ke && b.push("</g>"), b.push("</g>");
      };
      Oe && w(Fs, L, I, wd, f, 1.6), w(u, A, B, Gr, d, 1.6);
    }, nr = [];
    Kc.forEach((t) => {
      const e = t.pts || [];
      if (!(e.length < 3))
        if (e.length === 3)
          nr.push([e[0], e[1], e[2]]);
        else
          for (let s = 1; s < e.length - 1; s++)
            nr.push([e[0], e[s], e[s + 1]]);
    });
    const w0 = (t, e, s, a, i) => {
      const r = s[0], h = s[1], u = s[2], f = a[0], d = a[1], p = a[2], m = i[0], g = i[1], y = i[2], x = (d - g) * (r - m) + (m - f) * (h - g);
      if (Math.abs(x) < 1e-6) return null;
      const M = ((d - g) * (t - m) + (m - f) * (e - g)) / x, E = ((g - h) * (t - m) + (r - m) * (e - g)) / x, A = 1 - M - E;
      return M < -1e-4 || E < -1e-4 || A < -1e-4 ? null : M * u + E * p + A * y;
    }, Ko = (t, e) => {
      let s = 1 / 0;
      return nr.forEach(([a, i, r]) => {
        const h = w0(t, e, a, i, r);
        h != null && h < s && (s = h);
      }), Number.isFinite(s) ? s : null;
    };
    tl("back", Ko), ol("back", Ko), sr("back", Ko), Kc.forEach((t) => {
      const e = t.pts.map((r) => r[0] + "," + r[1]).join(","), a = typeof t.type == "string" && t.type.startsWith("flatRoof") ? t.fill : "#000";
      b.push(`<polygon points="${e}" fill="${t.fill}" stroke="${a}" stroke-width="${0.5}" opacity="${t.opacity}"/>`), t.type === "cube" && g0(t.id, t.pts), t.type === "cube" && t.id === "front" && $0(), t.type === "cube" && _0(t.id, t.pts), t.type === "cube" && y0(t.id), (t.type === "roofPlane" || t.type === "flatRoofTop") && x0(), t.type === "roofPlane" && !so && sl();
    }), so && Ti && sl();
    const v0 = (t) => {
      const e = [0.14, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74, 0.84, 0.92];
      let s = 0, a = 0;
      for (const i of e) {
        const r = [
          xe[0] + (t.world[0] - xe[0]) * i,
          xe[1] + (t.world[1] - xe[1]) * i,
          xe[2] + (t.world[2] - xe[2]) * i
        ], h = V(r), u = U(h), f = Ko(u[0], u[1]);
        a++, (f == null || h[2] <= f - 5e-3) && s++;
      }
      return a > 0 && s >= Math.ceil(a * 0.67);
    }, nl = Qi.filter((t) => v0(t));
    if (Ft && !yf && nl.length && Yc(nl, 1, 0.85), Ft && sr("front", Ko, "behind_sun"), Ft) {
      b.push(`<circle cx="${Mt[0]}" cy="${Mt[1]}" r="${$f}" fill="url(#sun-glow)"/>`), b.push(`<circle cx="${Mt[0]}" cy="${Mt[1]}" r="${_f}" fill="yellow" stroke="orange" stroke-width="${Math.max(1, 2 * we)}"/>`);
      const t = Math.min(ni, ai), e = Math.max(ni, ai);
      for (let s = 0; s < 8; s++) {
        const a = s * 360 / 8, i = 20 * we;
        if ($i) {
          const r = t + (e - t) * (0.5 + 0.5 * Math.sin(s * 1.71)), h = 0.18 * s + 0.07 * Math.cos(s * 2.13), u = St ? an(r, h) : nn(r, h), f = S(qh + 0.015 * Math.sin(s * 0.93), 0.2, 1), d = S(Xh - 0.02 * Math.cos(s * 1.27), 0.25, 1), p = S(Yh + 0.04 * Math.cos(s * 1.37), 0.05, 1);
          b.push(`<g transform="translate(${Mt[0]} ${Mt[1]}) rotate(${a})">`);
          const m = St ? Math.max(1, Math.round(r * Fo)) : 0;
          b.push(`<line x1="0" y1="0" x2="${i}" y2="0"
            class="sv-sun-ray"
            style="animation-duration:${r.toFixed(2)}s;--sv-phase-delay:${u.toFixed(2)}s;animation-delay:${u.toFixed(2)}s;--ray-min-scale:${f.toFixed(3)};--ray-max-scale:${d.toFixed(3)};--sv-steps:${m};"
            stroke="${Cr}" stroke-width="${1.5 * we}" stroke-linecap="round" opacity="${p.toFixed(3)}"/>`), b.push("</g>");
        } else
          b.push(`<g transform="translate(${Mt[0]} ${Mt[1]}) rotate(${a})">`), b.push(`<line x1="0" y1="0" x2="${i}" y2="0"
            stroke="${Cr}" stroke-width="${1.5 * we}" stroke-linecap="round" opacity="0.6"/>`), b.push("</g>");
      }
    }
    if (en && !Ft && vo > 0.03) {
      const t = Array.isArray(pa) ? pa : [178, 208, 255], e = S(ku * vo, 0, 1);
      b.push(`<rect x="0" y="0" width="${nt}" height="${it}"
        fill="rgb(${t.join(",")})" opacity="${e}"/>`);
    }
    sr("front", Ko, Ft ? "front_of_sun" : "all"), tl("front", Ko), ol("front", Ko);
    const S0 = ht ? ["SUN OVERRIDE ENABLED", "Solar alignment % is disabled"] : [];
    Fr && b.push(`<rect x="0" y="0" width="${nt}" height="${it}" fill="url(#vignette)"/>`);
    const al = this._autoRotateEnabled ? Number(this._autoRotateIntervalMsDynamic || no) : this._manualRotateEnabled ? Number(this._manualRotateIntervalMs || this._rotationIntervalMsFloor || no) : no, M0 = xi && al > no;
    let R0 = 0;
    const Sn = () => 18 + R0++ * 16;
    if (Fd && this._autoRotateEnabled) {
      const t = Number.isFinite(this._autoRotateFps) ? this._autoRotateFps : 0, e = this._autoRotateIntervalMsDynamic || no, s = e > no ? " LIMIT" : "";
      b.push(`<text x="10" y="${Sn()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">FPS ${t.toFixed(1)} | ${Math.round(e)}ms${s}</text>`);
    }
    if (Yr) {
      const t = Number.isFinite(this._cssFps) ? this._cssFps : 0;
      b.push(`<text x="10" y="${Sn()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">CSS FPS ${t.toFixed(1)}</text>`);
    }
    if (jd && St && b.push(`<text x="10" y="${Sn()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">CSS LIMIT ${Fo} FPS</text>`), M0) {
      const t = Math.max(1, Math.round(1e3 / al));
      b.push(`<text x="10" y="${Sn()}" fill="rgba(255,255,255,0.85)" font-size="12" font-family="monospace">ROT LIMIT ${t} FPS</text>`);
    }
    S0.forEach((t, e) => {
      const s = Sn(), a = e === 0 ? 12 : 11;
      b.push(`<text x="10" y="${s}" fill="#ff3b3b" font-size="${a}" font-family="monospace" font-weight="700">${t}</text>`);
    });
    const C0 = fa && vo > 0.03, il = vo <= 0.03, rl = !!this._energyHudNightStateActive, cl = !!this._energyHudNightForceIcon;
    let gs = cl, ar = rl;
    if (Ft ? (ar = !1, gs = !1) : rl ? cl && !Ta && il ? (gs = !1, this._energyHudExpanded = !1) : !C0 && il && yt > -0.02 && (gs = !1, this._energyHudExpanded = !1) : (ar = !0, gs = !0, this._energyHudExpanded = !1), this._energyHudNightStateActive = ar, this._energyHudNightForceIcon = gs, this._energyHudOverlay = null, On) {
      const t = nt < 300 || it < 300 || gs, e = t ? "ultra" : "full", s = 10, a = 12, i = 120, r = Hn, h = r ? 78 : 76, u = nt - s - i, f = a, d = Vo == null ? "rgba(255,255,255,0.82)" : Vo ? "#ffd95c" : "#7bb8ff", p = Vo == null ? "" : Vo ? "←" : "→", m = `rgba(20,24,30,${Vn.toFixed(3)})`, g = Vo ? "#7ee38b" : "rgba(255,255,255,0.92)", y = Jt(Ue), x = Jt(je), M = p ? `${p} ${Jt(fe)}` : Jt(fe);
      if (this._energyHudOverlay = {
        enabled: !0,
        iconOnly: t,
        panelFill: m,
        hudTop: a,
        hudRight: s,
        hudWidth: i,
        hudHeight: h,
        solarText: y,
        showRoofAlignment: r,
        roofAlignmentDisplayText: Ws,
        homeText: x,
        gridText: M,
        homeColor: g,
        gridColor: d
      }, b.push('<g pointer-events="none">'), !t) if (e === "full") {
        b.push(`<rect x="${u}" y="${f}" width="${i}" height="${h}" rx="10" ry="10" fill="${m}" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>`);
        const E = f + 20, A = u + 12, B = u + i - 10;
        b.push(`<text x="${A}" y="${E}" fill="rgba(255,255,255,0.88)" font-size="11" font-family="ui-monospace,monospace" font-weight="700">SOLAR</text>`), b.push(`<text x="${B}" y="${E}" text-anchor="end" fill="#ffe08c" font-size="11" font-family="ui-monospace,monospace" font-weight="700">${y}</text>`);
        let L = E + 12;
        r ? (b.push(`<text x="${A}" y="${L}" fill="rgba(255,255,255,0.80)" font-size="9" font-family="ui-monospace,monospace" font-weight="600">ALIGNMENT</text>`), b.push(`<text x="${B}" y="${L}" text-anchor="end" fill="rgba(255,255,255,0.86)" font-size="9" font-family="ui-monospace,monospace" font-weight="600">${Ws}</text>`), L += 16) : L += 4, b.push(`<text x="${A}" y="${L}" fill="rgba(255,255,255,0.88)" font-size="11" font-family="ui-monospace,monospace" font-weight="700">HOME</text>`), b.push(`<text x="${B}" y="${L}" text-anchor="end" fill="${g}" font-size="11" font-family="ui-monospace,monospace" font-weight="700">${x}</text>`), L += 16, b.push(`<text x="${A}" y="${L}" fill="rgba(255,255,255,0.88)" font-size="11" font-family="ui-monospace,monospace" font-weight="700">GRID</text>`), b.push(`<text x="${B}" y="${L}" text-anchor="end" fill="${d}" font-size="11" font-family="ui-monospace,monospace" font-weight="700">${M}</text>`);
      } else {
        b.push(`<rect x="${u}" y="${f}" width="${i}" height="${h}" rx="10" ry="10" fill="${m}" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>`);
        const E = f + 21, A = 4, B = u + 9, L = e === "compact" ? `S ${Jt(Ue)}` : `S${Jt(Ue)}`, I = e === "compact" ? `H ${Jt(je)}` : `H${Jt(je)}`, v = e === "compact" ? `G ${p}${Jt(fe)}` : `${p}${Jt(fe)}`, w = L.length * 6, C = I.length * 6, H = v.length * 6, O = w + C + H + A * 2, X = B + Math.max(0, (i - 18 - O) * 0.5), rt = X + w + A, $t = rt + C + A;
        b.push(`<text x="${X}" y="${E}" fill="#ffe08c" font-size="11" font-family="ui-monospace,monospace" font-weight="700">${L}</text>`), b.push(`<text x="${rt}" y="${E}" fill="${g}" font-size="11" font-family="ui-monospace,monospace" font-weight="700">${I}</text>`), b.push(`<text x="${$t}" y="${E}" fill="${d}" font-size="11" font-family="ui-monospace,monospace" font-weight="700">${v}</text>`);
      }
      b.push("</g>");
    }
    return b.push("</svg>"), b.join("");
  }
};
xr.styles = hh`
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
    .energy-hud-btn {
      position: absolute;
      top: 12px;
      right: 10px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.28);
      background: rgba(20, 24, 30, 0.55);
      color: rgba(255, 255, 255, 0.92);
      font-size: 15px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      z-index: 8;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
    }
    .energy-hud-panel {
      position: absolute;
      top: 12px;
      right: 10px;
      width: 120px;
      height: 76px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.22);
      background: rgba(20, 24, 30, 0.55);
      padding: 8px 10px;
      box-sizing: border-box;
      pointer-events: auto;
      z-index: 8;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
    }
    .energy-hud-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      font-size: 11px;
      line-height: 1.2;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.9);
      white-space: nowrap;
    }
    .energy-hud-subrow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 9px;
      line-height: 1.1;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.86);
      white-space: nowrap;
      margin-top: 0;
    }
  `;
let br = xr;
const qa = "sunlight-visualizer-card";
if (!customElements.get(qa))
  try {
    customElements.define(qa, br);
  } catch {
  }
const rh = window.customCards ?? (window.customCards = []);
rh.some((k) => k.type === qa) || rh.push({
  type: qa,
  name: "Sunlight Visualizer Card",
  description: "2.5D sunlight visualizer house card with auto-bound integration entities.",
  preview: !0,
  documentationURL: "https://github.com/NoUsername10/Sunlight_Visualizer"
});
