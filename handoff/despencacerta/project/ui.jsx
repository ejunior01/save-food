/* global React */
// ────────────────────────────────────────────────────────────────────────────
// DespensaCerta — UI primitives, icons, atoms
// ────────────────────────────────────────────────────────────────────────────

const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;
const D = window.DC_DATA;

// ─── Icons (stroke 1.6) ────────────────────────────────────────────────────
const stroke = { fill:'none', stroke:'currentColor', strokeWidth:1.6, strokeLinecap:'round', strokeLinejoin:'round' };

const Icon = ({ children, size=20, style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={style}>{children}</svg>
);

const I = {
  Home: (p={}) => <Icon {...p}><path {...stroke} d="M3 11L12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></Icon>,
  Bell: (p={}) => <Icon {...p}><path {...stroke} d="M6 8a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7"/><path {...stroke} d="M10 19a2 2 0 0 0 4 0"/></Icon>,
  Plus: (p={}) => <Icon {...p}><path {...stroke} d="M12 5v14M5 12h14"/></Icon>,
  Chef: (p={}) => <Icon {...p}><path {...stroke} d="M7 14h10v6H7zM8 14a4 4 0 1 1 1.7-7.6 3 3 0 0 1 4.6 0A4 4 0 1 1 16 14"/></Icon>,
  Cart: (p={}) => <Icon {...p}><path {...stroke} d="M3 4h2l2.4 11.4a1 1 0 0 0 1 .8h8.5a1 1 0 0 0 1-.8L20 8H6"/><circle cx="9" cy="20" r="1.3" {...stroke}/><circle cx="17" cy="20" r="1.3" {...stroke}/></Icon>,
  Box: (p={}) => <Icon {...p}><path {...stroke} d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path {...stroke} d="M3 7l9 4 9-4M12 11v10"/></Icon>,
  Search: (p={}) => <Icon {...p}><circle cx="11" cy="11" r="6.5" {...stroke}/><path {...stroke} d="M20 20l-3.5-3.5"/></Icon>,
  Scan: (p={}) => <Icon {...p}><path {...stroke} d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><path {...stroke} d="M7 8v8M11 8v8M15 8v8"/></Icon>,
  ArrowLeft: (p={}) => <Icon {...p}><path {...stroke} d="M15 5l-7 7 7 7M8 12h13"/></Icon>,
  ArrowRight: (p={}) => <Icon {...p}><path {...stroke} d="M9 5l7 7-7 7M16 12H3"/></Icon>,
  ArrowUpRight: (p={}) => <Icon {...p}><path {...stroke} d="M7 17L17 7M9 7h8v8"/></Icon>,
  Close: (p={}) => <Icon {...p}><path {...stroke} d="M6 6l12 12M18 6L6 18"/></Icon>,
  More: (p={}) => <Icon {...p}><circle cx="5" cy="12" r="1.4" {...stroke}/><circle cx="12" cy="12" r="1.4" {...stroke}/><circle cx="19" cy="12" r="1.4" {...stroke}/></Icon>,
  Check: (p={}) => <Icon {...p}><path {...stroke} d="M5 12l4.5 4.5L20 6"/></Icon>,
  Clock: (p={}) => <Icon {...p}><circle cx="12" cy="12" r="8.5" {...stroke}/><path {...stroke} d="M12 7v5l3.5 2"/></Icon>,
  Trash: (p={}) => <Icon {...p}><path {...stroke} d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1.4 13a2 2 0 0 0 2 1.8h5.2a2 2 0 0 0 2-1.8L18 7"/></Icon>,
  Pantry:  (p={}) => <Icon {...p}><path {...stroke} d="M5 4h14v17a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path {...stroke} d="M5 10h14M5 16h14M9 7v0M9 13v0M9 19v0"/></Icon>,
  Fridge:  (p={}) => <Icon {...p}><rect x="6" y="3" width="12" height="18" rx="2" {...stroke}/><path {...stroke} d="M6 11h12M9 6v3M9 14v3"/></Icon>,
  Freezer: (p={}) => <Icon {...p}><path {...stroke} d="M12 3v18M3 12h18M5 5l14 14M19 5L5 19"/></Icon>,
  Sparkle: (p={}) => <Icon {...p}><path {...stroke} d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></Icon>,
  Calendar:(p={}) => <Icon {...p}><rect x="4" y="5" width="16" height="16" rx="2" {...stroke}/><path {...stroke} d="M4 10h16M9 3v4M15 3v4"/></Icon>,
  Lock:    (p={}) => <Icon {...p}><rect x="5" y="11" width="14" height="10" rx="2" {...stroke}/><path {...stroke} d="M8 11V8a4 4 0 0 1 8 0v3"/></Icon>,
  Mail:    (p={}) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" {...stroke}/><path {...stroke} d="M3 7l9 6 9-6"/></Icon>,
  User:    (p={}) => <Icon {...p}><circle cx="12" cy="8" r="4" {...stroke}/><path {...stroke} d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></Icon>,
  Bookmark:(p={}) => <Icon {...p}><path {...stroke} d="M6 4h12v17l-6-4-6 4z"/></Icon>,
  Filter:  (p={}) => <Icon {...p}><path {...stroke} d="M4 5h16l-6 8v6l-4-2v-4z"/></Icon>,
  Fire:    (p={}) => <Icon {...p}><path {...stroke} d="M12 3c0 4-5 5-5 10a5 5 0 0 0 10 0c0-2-1-3-2-5 0 2-1 3-2 3 1-3-1-5-1-8z"/></Icon>,
  Flame:   (p={}) => <Icon {...p}><path {...stroke} d="M12 2c1 4 5 5 5 10a5 5 0 1 1-10 0c0-3 2-4 3-7 0 2 1 3 2 3 0-2-1-3 0-6z"/></Icon>,
  Leaf:    (p={}) => <Icon {...p}><path {...stroke} d="M20 4c-9 0-16 6-16 14 0 1 .3 2 1 2 7 0 15-6 15-16zM4 20c4-5 8-7 14-9"/></Icon>,
  Heart:   (p={}) => <Icon {...p}><path {...stroke} d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></Icon>,
  Eye:     (p={}) => <Icon {...p}><path {...stroke} d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="2.5" {...stroke}/></Icon>,
  Camera:  (p={}) => <Icon {...p}><path {...stroke} d="M5 8h3l1.5-2h5L16 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5" {...stroke}/></Icon>,
  Edit:    (p={}) => <Icon {...p}><path {...stroke} d="M14 5l5 5-10 10H4v-5z"/><path {...stroke} d="M13 6l5 5"/></Icon>,
  Settings:(p={}) => <Icon {...p}><circle cx="12" cy="12" r="3" {...stroke}/><path {...stroke} d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></Icon>,
  FingerPrint:({ size=28 }={}) => <Icon size={size}>
    <path {...stroke} d="M7.5 12.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 1-.2 2-.6 3"/>
    <path {...stroke} d="M5 11a7 7 0 0 1 14 0c0 1.5-.3 3-.8 4.5"/>
    <path {...stroke} d="M9.5 14.5c.3 1.5 1.2 3 1.8 4.5"/>
    <path {...stroke} d="M14.5 13.5c0 2-1 4-1 6"/>
    <path {...stroke} d="M3 14c1.4-.5 2.5-1.5 2.5-3"/>
    <path {...stroke} d="M21 14c-1.4-.5-2.5-1.5-2.5-3"/>
  </Icon>,
  Logo:    ({ size=20 }={}) => (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path fill="currentColor" d="M12 2c2.5 3 4 6 4 9a4 4 0 1 1-8 0c0-3 1.5-6 4-9z"/>
      <circle cx="12" cy="11.5" r="1.2" fill="var(--canvas)"/>
    </svg>
  ),
};

// ─── Atoms ─────────────────────────────────────────────────────────────────

function Pill({ children, variant='primary', size='', block=false, leading, trailing, onClick, style }) {
  const cls = [
    'pill',
    `pill-${variant}`,
    size && `pill-${size}`,
    block && 'pill-block',
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} style={style} onClick={onClick}>
      {leading}{children}{trailing}
    </button>
  );
}

function IconBtn({ children, variant='default', size=40, onClick, ariaLabel, style }) {
  const cls = ['icon-btn', variant==='dark' && 'on-dark', variant==='ghost' && 'ghost', variant==='hairline' && 'hairline'].filter(Boolean).join(' ');
  return (
    <button aria-label={ariaLabel} className={cls} style={{ width:size, height:size, ...style }} onClick={onClick}>
      {children}
    </button>
  );
}

function Eyebrow({ children, dark=false, style }) {
  return <div className={'eyebrow' + (dark ? ' on-dark':'')} style={style}>{children}</div>;
}

function Chip({ tone='neutral', children, withDot=false }) {
  return (
    <span className={`chip chip-${tone}`}>
      {withDot && <span className="dot" />}
      {children}
    </span>
  );
}

function ExpiryChip({ date, dense=false }) {
  const status = D.expiryStatus(date);
  const label = D.expiryLabel(date);
  const tone = ({ expired:'danger', urgent:'urgent', soon:'soon', planned:'neutral', safe:'safe' })[status];
  return <Chip tone={tone} withDot>{label}</Chip>;
}

function Photo({ src, size=56, radius='md', style, children, color }) {
  const r = radius==='full' ? 999 : radius==='lg' ? 22 : radius==='sm' ? 10 : 14;
  return (
    <div style={{
      width: typeof size==='number' ? size : size,
      height: typeof size==='number' ? size : size,
      borderRadius: r,
      backgroundImage: src ? `url("${src}")` : undefined,
      backgroundSize:'cover', backgroundPosition:'center',
      backgroundColor: color || 'var(--block-sage)',
      flexShrink: 0,
      ...style,
    }}>{children}</div>
  );
}

// Image with width/height
function PhotoBox({ src, width='100%', height=180, radius=22, style, children, color }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      backgroundImage: src ? `url("${src}")` : undefined,
      backgroundSize:'cover', backgroundPosition:'center',
      backgroundColor: color || 'var(--block-sage)',
      position:'relative', overflow:'hidden',
      ...style,
    }}>{children}</div>
  );
}

function Stat({ value, label, big=false }) {
  return (
    <div className="col gap-4">
      <div className="display" style={{ fontSize: big ? 48 : 36 }}>{value}</div>
      <div className="caption" style={{ letterSpacing:'0.12em' }}>{label}</div>
    </div>
  );
}

function Sticker({ children, style }) {
  return <span className="sticker" style={style}>{children}</span>;
}

function SegBar({ options, value, onChange }) {
  return (
    <div className="seg">
      {options.map(o => (
        <button key={o.value} className={'seg-btn' + (o.value===value?' active':'')} onClick={()=>onChange(o.value)}>
          {o.icon}{o.label}
          {o.count != null && <span style={{ opacity:0.65, fontSize:11 }}>· {o.count}</span>}
        </button>
      ))}
    </div>
  );
}

function Stepper({ value, onChange, min=1, max=99 }) {
  return (
    <div className="stepper">
      <button className="stepper-btn" onClick={()=>onChange(Math.max(min, value-1))}>−</button>
      <span className="stepper-val">{value}</span>
      <button className="stepper-btn" onClick={()=>onChange(Math.min(max, value+1))}>+</button>
    </div>
  );
}

// Decorative editorial number
function BigNumber({ n, label, tone='ink' }) {
  return (
    <div className="col gap-4" style={{ alignItems:'flex-start' }}>
      <div className="display italic" style={{ fontSize:64, color: tone==='ink'?'var(--ink)':'var(--canvas)' }}>{n}</div>
      <div className="caption">{label}</div>
    </div>
  );
}

// FoodCard — list row variant
function FoodRow({ item, onPress, compact=false }) {
  return (
    <button onClick={onPress} style={{
      display:'flex', alignItems:'center', gap:14,
      background:'var(--surface)', padding: compact ? '10px 12px' : '12px 14px',
      borderRadius: 18, boxShadow:'inset 0 0 0 1px var(--hairline)',
      width:'100%', border:0, textAlign:'left', cursor:'pointer',
    }}>
      <Photo src={item.photo} size={compact?44:52} radius="md" color={D.catColor(item.category)} />
      <div className="col grow gap-4" style={{ minWidth:0 }}>
        <div className="title" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
        <div className="row gap-8" style={{ color:'var(--muted)', fontSize:12 }}>
          <span>{item.qty} {item.unit}</span>
          <span>·</span>
          <span>{D.locName(item.locationId)}</span>
        </div>
      </div>
      <ExpiryChip date={item.expiresAt} />
    </button>
  );
}

// FoodCard — visual tile variant (for Home Use Primeiro)
function FoodTile({ item, onPress }) {
  return (
    <button onClick={onPress} style={{
      width: 168, padding: 14,
      background:'var(--surface)', borderRadius: 22,
      boxShadow:'inset 0 0 0 1px var(--hairline)',
      display:'flex', flexDirection:'column', gap:10,
      border:0, textAlign:'left', cursor:'pointer', flexShrink:0,
    }}>
      <Photo src={item.photo} size={140} radius="md" color={D.catColor(item.category)} style={{ width:'100%' }} />
      <div className="col gap-4">
        <div className="title" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
        <div className="row between" style={{ alignItems:'center' }}>
          <span className="caption" style={{ letterSpacing:'0.06em', textTransform:'none', fontFamily:'var(--font-sans)', fontSize:12, color:'var(--muted)' }}>{D.locName(item.locationId)}</span>
          <ExpiryChip date={item.expiresAt} />
        </div>
      </div>
    </button>
  );
}

// Status bar safe spacer (since AndroidFrame already shows status bar)
function PhonePadTop({ height=8 }) { return <div style={{ height }} />; }

// Section header with eyebrow + title row
function SectionHead({ eyebrow, title, action, dark=false }) {
  return (
    <div className="col gap-6" style={{ padding:'4px 18px 12px' }}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <div className="row between" style={{ alignItems:'flex-end', gap:12 }}>
        <h2 className="display-sm" style={{ margin:0, color: dark ? 'var(--canvas)' : 'var(--ink)' }}>{title}</h2>
        {action}
      </div>
    </div>
  );
}

// Bottom tabbar
function TabBar({ active, onChange, onAdd }) {
  const tab = (id, label, icon) => (
    <button className={'tab' + (active===id?' active':'')} onClick={()=>onChange(id)}>
      <div className="tab-icon-wrap">{icon}</div>
      <span>{label}</span>
    </button>
  );
  return (
    <div className="tabbar">
      {tab('home',      'Início',    <I.Home size={22} />)}
      {tab('alerts',    'Alertas',   <I.Bell size={22} />)}
      <button className="tab add" onClick={onAdd}>
        <div className="tab-add-circle"><I.Plus size={26} /></div>
      </button>
      {tab('inventory', 'Despensa',  <I.Box size={22} />)}
      {tab('shopping',  'Compras',   <I.Cart size={22} />)}
    </div>
  );
}

// Phone screen container — fills the AndroidDevice content area
function Phone({ children, dark=false, scroll=true, bg }) {
  return (
    <div className={'phone' + (dark?' phone-dark':'')} style={{ background: bg, height:'100%' }}>
      <div className={scroll ? 'scroll' : ''} style={{ height:'100%' }}>
        {children}
      </div>
    </div>
  );
}

// Greeting helper
function greeting() {
  const h = new Date().getHours();
  if (h < 6) return 'Boa noite';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

// ─── Expose ────────────────────────────────────────────────────────────────
Object.assign(window, {
  DC_UI: {
    I, Icon, Pill, IconBtn, Eyebrow, Chip, ExpiryChip, Photo, PhotoBox,
    Stat, BigNumber, Sticker, SegBar, Stepper, FoodRow, FoodTile,
    PhonePadTop, SectionHead, TabBar, Phone, greeting,
  },
});
