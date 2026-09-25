(function () {
  if (customElements.get('mg-map')) return;
  const D3 = 'https://unpkg.com/d3@7.9.0/dist/d3.min.js', D3I = 'sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i';
  const TJ = 'https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js', TJI = 'sha384-Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67';
  const ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';

  function load(src, integ) {
    return new Promise((res, rej) => {
      const ex = document.querySelector('script[src="' + src + '"]');
      if (ex) { if (ex.dataset.loaded) return res(); ex.addEventListener('load', res); ex.addEventListener('error', rej); return; }
      const s = document.createElement('script');
      s.src = src; s.integrity = integ; s.crossOrigin = 'anonymous';
      s.onload = () => { s.dataset.loaded = '1'; res(); }; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  let ready;
  function libs() {
    return ready || (ready = (async () => {
      if (!window.d3) await load(D3, D3I);
      if (!window.topojson) await load(TJ, TJI);
      const topo = await (await fetch(ATLAS)).json();
      const fc = window.topojson.feature(topo, topo.objects.countries);
      return fc.features.find(f => f.id === '450');
    })());
  }
  if (!document.getElementById('mg-map-css')) {
    const st = document.createElement('style'); st.id = 'mg-map-css';
    st.textContent = '@keyframes mgpulse{0%{transform:scale(.8);opacity:.9}100%{transform:scale(2.8);opacity:0}}.mg-pulse{transform-box:fill-box;transform-origin:center;animation:mgpulse 2.6s ease-out infinite}.mg-core{transition:r .3s,fill .3s}@media (prefers-reduced-motion: reduce){.mg-pulse{animation:none}}';
    document.head.appendChild(st);
  }
  const fmt = n => Number(n).toLocaleString('fr-FR');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  class MgMap extends HTMLElement {
    static get observedAttributes() { return ['filter', 'active', 'regions']; }
    connectedCallback() {
      if (this._init) return; this._init = true;
      Object.assign(this.style, { display: 'block', position: 'relative', width: '100%' });
      this.stage = document.createElement('div');
      this.stage.style.cssText = 'position:relative;width:100%;min-height:420px;display:flex;align-items:center;justify-content:center;font:500 13px "JetBrains Mono",monospace;color:#51645A;';
      this.stage.textContent = 'Chargement de la carte…';
      this.tip = document.createElement('div');
      this.tip.style.cssText = 'position:absolute;left:0;top:0;width:236px;padding:16px;border-radius:18px;background:rgba(252,251,245,0.78);backdrop-filter:blur(18px) saturate(150%);-webkit-backdrop-filter:blur(18px) saturate(150%);border:1px solid rgba(255,255,255,0.95);box-shadow:0 24px 48px -20px rgba(11,61,42,0.45),inset 0 1px 0 #fff;pointer-events:none;opacity:0;transform:translateY(6px);transition:opacity .25s,transform .25s;z-index:5;font-family:"Plus Jakarta Sans",system-ui,sans-serif;color:#10281E;';
      this.append(this.stage, this.tip);
      this.ro = new ResizeObserver(() => this.render()); this.ro.observe(this);
      libs().then(f => { this.feature = f; this.render(); }).catch(() => { this.stage.textContent = 'Carte indisponible hors connexion'; });
    }
    disconnectedCallback() { this.ro && this.ro.disconnect(); }
    attributeChangedCallback(n) { if (n === 'regions') { this._w = 0; this.render(); } else this.update(); }
    get regions() { try { return JSON.parse(this.getAttribute('regions') || '[]'); } catch (e) { return []; } }
    render() {
      if (!this.feature || !window.d3) return;
      const W = Math.max(280, this.clientWidth), H = Math.round(Math.min(W * 1.2, 660));
      if (W === this._w && H === this._h) return this.update();
      this._w = W; this._h = H;
      const proj = d3.geoMercator().fitExtent([[W * 0.06, 18], [W * 0.94, H - 24]], this.feature);
      const d = d3.geoPath(proj)(this.feature);
      const regs = this.regions; this._regs = regs;
      const markers = regs.map(r => {
        const [x, y] = proj([r.lon, r.lat]); r._x = x; r._y = y;
        const left = x > W * 0.62;
        return `<g class="m" data-id="${r.id}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})" style="cursor:pointer;transition:opacity .4s">
          <circle class="glow" r="58" fill="url(#mgG)" opacity="0" style="transition:opacity .35s"></circle>
          <circle class="mg-pulse" r="8" fill="none" stroke="#FCFBF5" stroke-width="1.5"></circle>
          <circle r="20" fill="transparent"></circle>
          <circle class="mg-core" r="6" fill="#FCFBF5" stroke="#0F6B47" stroke-width="3"></circle>
          <text class="lbl" x="${left ? -13 : 13}" y="4" text-anchor="${left ? 'end' : 'start'}" style="display:none;font:700 12px 'Plus Jakarta Sans',sans-serif;fill:#10281E;paint-order:stroke;stroke:rgba(252,251,245,0.92);stroke-width:4px;stroke-linejoin:round">${esc(r.name)}</text>
        </g>`;
      }).join('');
      this.stage.style.minHeight = H + 'px';
      this.stage.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;overflow:visible">
        <defs>
          <linearGradient id="mgF" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="#3CC58C"></stop><stop offset="1" stop-color="#0F6B47"></stop></linearGradient>
          <pattern id="mgD" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="rgba(252,251,245,0.25)"></circle></pattern>
          <radialGradient id="mgG"><stop offset="0" stop-color="#FCFBF5" stop-opacity="0.8"></stop><stop offset="1" stop-color="#FCFBF5" stop-opacity="0"></stop></radialGradient>
        </defs>
        <path d="${d}" transform="translate(0,16)" fill="rgba(11,61,42,0.13)"></path>
        <path d="${d}" fill="url(#mgF)" stroke="rgba(255,255,255,0.95)" stroke-width="1.5" stroke-linejoin="round"></path>
        <path d="${d}" fill="url(#mgD)"></path>
        ${markers}
      </svg>`;
      this.stage.querySelectorAll('g.m').forEach(g => {
        const id = g.dataset.id;
        g.addEventListener('mouseenter', () => this.hover(id));
        g.addEventListener('mouseleave', () => this.hover(null));
        g.addEventListener('click', () => this.hover(this._hover === id ? null : id));
      });
      this._drawn = true;
      this.update();
    }
    hover(id) {
      this._hover = id; this.update();
      window.dispatchEvent(new CustomEvent('mgmap:hover', { detail: id || '' }));
    }
    update() {
      if (!this._drawn) return;
      const f = this.getAttribute('filter') || 'all';
      const act = this._hover || this.getAttribute('active') || '';
      let shown = null;
      this.stage.querySelectorAll('g.m').forEach(g => {
        const r = this._regs.find(x => x.id === g.dataset.id); if (!r) return;
        const match = f === 'all' || r.cat === f, on = act === r.id && match;
        g.style.opacity = match ? 1 : 0.22;
        g.querySelector('.glow').setAttribute('opacity', on ? 1 : (match && f !== 'all' ? 0.5 : 0));
        const core = g.querySelector('.mg-core');
        core.setAttribute('r', on ? 9 : 6);
        core.setAttribute('fill', on ? '#189B67' : '#FCFBF5');
        core.setAttribute('stroke', on ? '#FCFBF5' : '#0F6B47');
        g.querySelector('.lbl').style.display = on || (match && f !== 'all') ? 'block' : 'none';
        if (on) { g.parentNode.appendChild(g); shown = r; }
      });
      const t = this.tip;
      if (!shown) { t.style.opacity = 0; t.style.transform = 'translateY(6px)'; return; }
      const r = shown, W = this._w;
      t.innerHTML = `
        <div style="font:500 11px 'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#127A51">${esc(r.city)}</div>
        <div style="font-weight:800;font-size:19px;letter-spacing:-.02em;margin-top:2px">${esc(r.name)}</div>
        <div style="display:inline-flex;margin-top:10px;padding:4px 10px;border-radius:999px;background:rgba(24,155,103,0.12);color:#0F6B47;font-weight:700;font-size:12.5px">${esc(r.crop)}</div>
        <div style="margin-top:12px;font-weight:800;font-size:26px;letter-spacing:-.03em;line-height:1">${fmt(r.tons)} <span style="font-size:13px;font-weight:600;color:#51645A;letter-spacing:0">tonnes</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;margin-top:14px;padding-top:12px;border-top:1px solid rgba(16,40,30,0.08);font-size:12px">
          <div><div style="color:#51645A">Saison</div><div style="font-weight:700;margin-top:2px">${esc(r.season)}</div></div>
          <div><div style="color:#51645A">Producteurs</div><div style="font-weight:700;margin-top:2px">${fmt(r.prod)}</div></div>
          <div style="grid-column:1/-1"><div style="color:#51645A">Disponibilité</div><div style="font-weight:700;margin-top:2px;color:#0F6B47">● ${esc(r.avail)}</div></div>
        </div>`;
      let x = r._x + 22; if (x + 236 > W) x = r._x - 22 - 236; if (x < 0) x = Math.max(0, Math.min(W - 236, r._x - 118));
      const y = Math.max(0, Math.min(this._h - 250, r._y - 70));
      t.style.left = x + 'px'; t.style.top = y + 'px';
      t.style.opacity = 1; t.style.transform = 'none';
    }
  }
  customElements.define('mg-map', MgMap);
})();
