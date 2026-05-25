/* global React, DC_UI, DC_DATA */
// ────────────────────────────────────────────────────────────────────────────
// DespensaCerta — Screens (Part 6)
// AI Recognition — premium feature: aponte a câmera, IA identifica + quantidade
// ────────────────────────────────────────────────────────────────────────────

const { useState, useEffect, useMemo } = React;
const U6 = window.DC_UI;
const D6 = window.DC_DATA;
const { I, Pill, IconBtn, Eyebrow, Chip, Photo, PhotoBox, Sticker, Stepper, Phone } = U6;

// ────────────────────────────────────────────────────────────────────────────
// Detected items mock — fruits/veggies the AI "sees"
// ────────────────────────────────────────────────────────────────────────────
const DETECTED = [
  { id:'d1', name:'Tomate italiano', qty:6, unit:'un', cat:'Vegetais', photo:D6.PHOTO.tomato,  conf:0.97, validity:'5 dias',  box:{ x:18, y:24, w:36, h:30 } },
  { id:'d2', name:'Banana prata',    qty:5, unit:'un', cat:'Frutas',   photo:D6.PHOTO.banana,  conf:0.94, validity:'7 dias',  box:{ x:56, y:14, w:34, h:24 } },
  { id:'d3', name:'Abacate',         qty:2, unit:'un', cat:'Frutas',   photo:D6.PHOTO.avocado, conf:0.89, validity:'5 dias',  box:{ x:8,  y:58, w:28, h:24 } },
  { id:'d4', name:'Alface americana',qty:1, unit:'un', cat:'Vegetais', photo:D6.PHOTO.lettuce, conf:0.92, validity:'5 dias',  box:{ x:40, y:54, w:30, h:32 } },
  { id:'d5', name:'Cenoura',         qty:4, unit:'un', cat:'Vegetais', photo:D6.PHOTO.carrot,  conf:0.86, validity:'15 dias', box:{ x:70, y:60, w:24, h:24 } },
];

// ════════════════════════════════════════════════════════════════════════════
// MAIN — AI Recognize screen with internal states
//   gate (non-premium) → scanning → detected
// ════════════════════════════════════════════════════════════════════════════
function ScreenAIRecognize({ onClose, premium = true, startState = 'detected' }) {
  // States: 'gate' | 'aiming' | 'scanning' | 'detected'
  const [state, setState] = useState(premium ? startState : 'gate');
  const [items, setItems] = useState(DETECTED);

  function startScan() {
    setState('aiming');
    setTimeout(()=>setState('scanning'), 800);
    setTimeout(()=>setState('detected'), 2400);
  }

  if (state === 'gate') return <PremiumGate onClose={onClose} onUnlock={()=>{ /* unlock flow */ setState('aiming'); setTimeout(()=>setState('detected'), 1200); }} />;

  return (
    <Phone scroll={false}>
      <div className="col" style={{ height:'100%', background:'#0a0f0c', position:'relative', overflow:'hidden' }}>

        {/* Camera background — use a colorful market photo */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`url("${D6.PHOTO.hero_market}")`,
          backgroundSize:'cover', backgroundPosition:'center',
          filter: state==='aiming' ? 'brightness(0.7) saturate(1.1)' : 'brightness(0.55) saturate(0.95)',
          transition:'filter .4s',
        }}/>
        {/* Vignette */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.45) 100%)' }}/>

        {/* Top bar */}
        <div className="row between" style={{ position:'relative', zIndex:5, padding:'14px 16px 0' }}>
          <IconBtn variant="dark" onClick={onClose}><I.Close size={18}/></IconBtn>
          <Sticker style={{ background:'var(--ink)', color:'var(--canvas)', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.15)' }}>
            <I.Sparkle size={12}/> IA · PREMIUM
          </Sticker>
          <IconBtn variant="dark"><I.Settings size={18}/></IconBtn>
        </div>

        {/* Title block */}
        <div style={{ position:'relative', zIndex:5, padding:'24px 24px 0', color:'var(--canvas)' }}>
          <Eyebrow dark>· visão computacional ·</Eyebrow>
          <h2 className="display-md" style={{ color:'var(--canvas)', margin:'8px 0 0', fontSize:30 }}>
            {state==='detected' ? <><span style={{ color:'var(--block-pistachio)' }}>{items.length}</span> alimentos<br/>identificados.</>
             : state==='scanning' ? <>Identificando<br/><i>alimentos…</i></>
             : <>Aponte para suas<br/><i>frutas e verduras.</i></>}
          </h2>
        </div>

        {/* Bounding boxes overlay */}
        <div style={{ position:'absolute', inset:'150px 24px 280px', zIndex:3 }}>
          {(state==='scanning' || state==='detected') && items.map((it,i) => (
            <BoundingBox key={it.id}
              box={it.box}
              label={state==='detected' ? `${it.name} · ${it.qty}` : '…'}
              conf={state==='detected' ? it.conf : null}
              color="var(--block-pistachio)"
              delay={i * 0.15}
            />
          ))}
        </div>

        {/* Scan grid — animated */}
        {state==='aiming' && (
          <div style={{ position:'absolute', left:'50%', top:'45%', transform:'translate(-50%,-50%)', width:240, height:240, zIndex:4 }}>
            <div className="pulse" style={{
              position:'absolute', inset:0, borderRadius:24,
              border:'2px solid var(--block-pistachio)',
              boxShadow:'0 0 28px rgba(213,226,168,0.45)',
            }}/>
            <div className="caption" style={{ position:'absolute', bottom:-30, left:'50%', transform:'translateX(-50%)', color:'var(--block-pistachio)', whiteSpace:'nowrap' }}>
              · APROXIMANDO ·
            </div>
          </div>
        )}

        {/* Scanning HUD bar */}
        {state==='scanning' && (
          <div style={{
            position:'absolute', left:24, right:24, top:200, zIndex:5,
            background:'rgba(10,15,12,0.7)', backdropFilter:'blur(8px)',
            borderRadius:14, padding:'10px 14px',
            color:'var(--canvas)',
          }}>
            <div className="row gap-10" style={{ alignItems:'center' }}>
              <div className="pulse" style={{ width:8, height:8, borderRadius:999, background:'var(--block-pistachio)' }}/>
              <div className="caption on-dark" style={{ flex:1, color:'var(--canvas)' }}>· ANALISANDO IMAGEM ·</div>
              <div className="display italic" style={{ fontSize:18, color:'var(--block-pistachio)' }}>{items.length}</div>
            </div>
            <div style={{ height:3, background:'rgba(255,255,255,0.12)', borderRadius:999, marginTop:8, overflow:'hidden' }}>
              <div style={{ height:'100%', width:'76%', background:'var(--block-pistachio)', borderRadius:999, animation:'pulse 1.4s ease-in-out infinite' }}/>
            </div>
          </div>
        )}

        {/* Aim state — capture button */}
        {state==='aiming' && (
          <div style={{ position:'absolute', left:0, right:0, bottom:48, zIndex:5, display:'flex', justifyContent:'center' }}>
            <button onClick={startScan} style={{
              width:74, height:74, borderRadius:999,
              background:'var(--canvas)', border:'4px solid rgba(255,255,255,0.4)',
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 8px 24px rgba(0,0,0,0.4)',
            }}>
              <div style={{ width:54, height:54, borderRadius:999, background:'var(--ink)' }}/>
            </button>
          </div>
        )}

        {/* Detected — bottom sheet with results */}
        {state==='detected' && (
          <DetectedSheet items={items} setItems={setItems} onClose={onClose} onRescan={()=>setState('aiming')} />
        )}

        {/* Hint footer when aiming */}
        {state==='aiming' && (
          <div style={{ position:'absolute', left:0, right:0, bottom:160, zIndex:5, textAlign:'center' }}>
            <span className="pill pill-on-dark pill-sm" style={{ background:'rgba(0,0,0,0.5)', backdropFilter:'blur(6px)' }}>
              <I.Sparkle size={12}/> Frutas, legumes e verduras
            </span>
          </div>
        )}

        {/* Initial — auto-start camera */}
        {state==='aiming' && false /* prevent auto */}
      </div>
    </Phone>
  );
}

// Bounding box with corner brackets + floating label
function BoundingBox({ box, label, conf, color, delay = 0 }) {
  const style = {
    position:'absolute',
    left: `${box.x}%`, top: `${box.y}%`,
    width: `${box.w}%`, height: `${box.h}%`,
    animation: `fadeUp .35s ease both`,
    animationDelay: `${delay}s`,
  };
  return (
    <div style={style}>
      {/* Corner brackets */}
      {['tl','tr','bl','br'].map(c=>(
        <div key={c} style={{
          position:'absolute', width:14, height:14,
          borderColor: color, borderStyle:'solid',
          borderTopWidth: c.startsWith('t') ? 2.5 : 0,
          borderBottomWidth: c.startsWith('b') ? 2.5 : 0,
          borderLeftWidth: c.endsWith('l') ? 2.5 : 0,
          borderRightWidth: c.endsWith('r') ? 2.5 : 0,
          top: c.startsWith('t') ? -2 : 'auto',
          bottom: c.startsWith('b') ? -2 : 'auto',
          left: c.endsWith('l') ? -2 : 'auto',
          right: c.endsWith('r') ? -2 : 'auto',
        }}/>
      ))}
      {/* faint fill */}
      <div style={{ position:'absolute', inset:0, background:'rgba(213,226,168,0.10)', borderRadius:4 }}/>
      {/* Label tab */}
      {label && (
        <div style={{
          position:'absolute', left:-2, top:-26,
          background: color, color:'var(--ink)',
          padding:'3px 8px', borderRadius:'6px 6px 6px 0',
          fontFamily:'var(--font-sans)', fontSize:11, fontWeight:600,
          whiteSpace:'nowrap',
          display:'flex', alignItems:'center', gap:4,
          boxShadow:'0 2px 6px rgba(0,0,0,0.25)',
        }}>
          <I.Check size={10}/> {label}
          {conf != null && <span style={{ opacity:0.65, fontWeight:500, marginLeft:2 }}>· {Math.round(conf*100)}%</span>}
        </div>
      )}
    </div>
  );
}

// Bottom sheet listing detected items, editable
function DetectedSheet({ items, setItems, onClose, onRescan }) {
  function setQty(id, qty) { setItems(items.map(i=>i.id===id?{...i, qty}:i)); }
  function remove(id) { setItems(items.filter(i=>i.id!==id)); }
  const avgConf = items.reduce((a,i)=>a+i.conf,0)/Math.max(items.length,1);

  return (
    <div className="fade-up" style={{
      position:'absolute', left:0, right:0, bottom:0, zIndex:8,
      background:'var(--canvas)', borderRadius:'28px 28px 0 0',
      padding:'14px 18px 18px',
      maxHeight:'62%', display:'flex', flexDirection:'column',
      boxShadow:'0 -20px 50px rgba(0,0,0,0.40)',
    }}>
      <div style={{ width:38, height:4, background:'var(--hairline)', borderRadius:999, margin:'0 auto 12px' }}/>

      <div className="row between" style={{ alignItems:'center', marginBottom:10 }}>
        <div className="col gap-2">
          <Eyebrow>· IA identificou ·</Eyebrow>
          <div className="display-md" style={{ margin:'2px 0 0' }}>{items.length} alimentos</div>
        </div>
        <div className="col" style={{ alignItems:'flex-end', gap:2 }}>
          <div className="display italic" style={{ fontSize:24, lineHeight:1 }}>{Math.round(avgConf*100)}%</div>
          <div className="caption" style={{ fontSize:9 }}>confiança média</div>
        </div>
      </div>

      <div style={{ overflowY:'auto', flex:1, marginTop:4 }}>
        <div className="col gap-8">
          {items.map(it => (
            <div key={it.id} className="row gap-12" style={{
              background:'var(--surface)', padding:'10px 12px', borderRadius:16,
              boxShadow:'inset 0 0 0 1px var(--hairline)', alignItems:'center',
            }}>
              <Photo src={it.photo} size={44} radius="md" color={D6.catColor(it.cat)} />
              <div className="col grow gap-2" style={{ minWidth:0 }}>
                <div className="row between" style={{ alignItems:'baseline' }}>
                  <div className="title" style={{ fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{it.name}</div>
                  <div className="caption" style={{ fontSize:9, color: it.conf>0.9 ? 'var(--safe)' : '#b5901e' }}>{Math.round(it.conf*100)}%</div>
                </div>
                <div className="row gap-6" style={{ color:'var(--muted)', fontSize:11, alignItems:'center' }}>
                  <span>{it.cat}</span>
                  <span>·</span>
                  <span>val. ~{it.validity}</span>
                </div>
              </div>
              <Stepper value={it.qty} onChange={v=>setQty(it.id, v)}/>
              <button onClick={()=>remove(it.id)} className="icon-btn ghost" style={{ width:30, height:30, color:'var(--muted)' }} aria-label="Remover">
                <I.Close size={14}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="row gap-10" style={{ marginTop:14 }}>
        <Pill variant="secondary" leading={<I.Sparkle size={14}/>} onClick={onRescan}>Refazer</Pill>
        <Pill variant="primary" block trailing={<I.Check size={18}/>} onClick={onClose}>
          Adicionar {items.length} itens
        </Pill>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PREMIUM GATE — paywall when user doesn't have premium
// ════════════════════════════════════════════════════════════════════════════
function PremiumGate({ onClose, onUnlock }) {
  return (
    <Phone scroll={false}>
      <div className="col" style={{ height:'100%', background:'var(--ink)', color:'var(--canvas)', position:'relative', overflow:'hidden' }}>
        {/* Decorative photo strip top */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:280, overflow:'hidden' }}>
          <div style={{
            position:'absolute', inset:0,
            backgroundImage:`url("${D6.PHOTO.hero_market}")`,
            backgroundSize:'cover', backgroundPosition:'center',
            filter:'brightness(0.7) saturate(1.1)',
          }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(26,43,31,0) 0%, var(--ink) 95%)' }}/>

          {/* Decorative bounding boxes */}
          <div style={{ position:'absolute', inset:'18% 12% 18% 12%' }}>
            <BoundingBox box={{ x:5,  y:30, w:32, h:36 }} label="Tomate · 6" conf={0.97} color="var(--block-pistachio)" delay={0.1}/>
            <BoundingBox box={{ x:45, y:18, w:30, h:28 }} label="Banana · 5" conf={0.94} color="var(--block-peach)" delay={0.25}/>
            <BoundingBox box={{ x:62, y:54, w:26, h:30 }} label="Alface · 1" conf={0.92} color="var(--block-pistachio)" delay={0.4}/>
          </div>
        </div>

        {/* Top bar */}
        <div className="row between" style={{ position:'relative', zIndex:5, padding:'14px 16px 0' }}>
          <IconBtn variant="dark" onClick={onClose}><I.Close size={18}/></IconBtn>
          <div className="caption on-dark" style={{ color:'rgba(250,245,235,0.65)' }}>Recurso Premium</div>
          <div style={{ width:40 }}/>
        </div>

        {/* Spacer for photo */}
        <div style={{ height:240 }}/>

        {/* Content */}
        <div className="col grow" style={{ position:'relative', zIndex:5, padding:'10px 24px 0', justifyContent:'flex-start' }}>
          <Sticker style={{ background:'var(--block-pistachio)', color:'var(--ink)', alignSelf:'flex-start' }}>
            <I.Sparkle size={12}/> PREMIUM
          </Sticker>
          <h1 className="display-xl" style={{ color:'var(--canvas)', margin:'12px 0 10px', fontSize:46, lineHeight:0.95 }}>
            Aponte. A IA<br/><i style={{ color:'var(--block-pistachio)' }}>reconhece.</i>
          </h1>
          <p className="body" style={{ color:'rgba(250,245,235,0.75)', maxWidth:300, fontSize:14, margin:0 }}>
            Aponte a câmera para suas frutas, legumes e verduras. A gente identifica o que é, conta a quantidade e sugere a validade.
          </p>

          {/* Features */}
          <div className="col gap-10" style={{ marginTop:22 }}>
            <FeatureRow icon={<I.Sparkle size={16}/>}  title="Reconhece dezenas de itens"   sub="Frutas, legumes e verduras frescos" />
            <FeatureRow icon={<I.Eye size={16}/>}      title="Conta a quantidade"           sub="Detecta múltiplos itens na foto" />
            <FeatureRow icon={<I.Calendar size={16}/>} title="Sugere validade automática"   sub="Baseada na categoria e estado" />
            <FeatureRow icon={<I.Camera size={16}/>}   title="Funciona com a foto da sacola" sub="Direto do mercado, sem cadastrar 1 a 1" />
          </div>
        </div>

        {/* CTA */}
        <div style={{ position:'relative', zIndex:5, padding:'18px 24px 24px' }}>
          <div className="row between" style={{ marginBottom:12, alignItems:'baseline' }}>
            <div className="col gap-2">
              <div className="caption on-dark" style={{ color:'rgba(250,245,235,0.6)' }}>Premium · anual</div>
              <div className="row gap-6" style={{ alignItems:'baseline' }}>
                <span className="display italic" style={{ fontSize:32, color:'var(--canvas)' }}>R$ 8,90</span>
                <span style={{ color:'rgba(250,245,235,0.55)', fontSize:13 }}>/mês</span>
              </div>
            </div>
            <Chip tone="ink" style={{ background:'var(--block-pistachio)', color:'var(--ink)' }}>14 dias grátis</Chip>
          </div>
          <Pill variant="primary" block size="lg" trailing={<I.ArrowRight size={18}/>}
            style={{ background:'var(--block-pistachio)', color:'var(--ink)' }}
            onClick={onUnlock}>
            Experimentar 14 dias grátis
          </Pill>
          <div className="caption" style={{ textAlign:'center', marginTop:10, color:'rgba(250,245,235,0.5)' }}>
            Cancele a qualquer momento · sem renovação automática
          </div>
        </div>
      </div>
    </Phone>
  );
}

function FeatureRow({ icon, title, sub }) {
  return (
    <div className="row gap-12" style={{ alignItems:'flex-start' }}>
      <div style={{
        width:36, height:36, borderRadius:10,
        background:'rgba(213,226,168,0.18)', color:'var(--block-pistachio)',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>{icon}</div>
      <div className="col gap-2" style={{ paddingTop:4 }}>
        <div className="title" style={{ color:'var(--canvas)', fontSize:14 }}>{title}</div>
        <div className="body-sm" style={{ color:'rgba(250,245,235,0.65)', fontSize:12 }}>{sub}</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenAIRecognize, PremiumGate,
});
