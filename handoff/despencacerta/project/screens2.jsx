/* global React, DC_UI, DC_DATA */
// ────────────────────────────────────────────────────────────────────────────
// DespensaCerta — Screens (Part 2)
// AddFood (Scanner) · Inventory · Recipes · RecipeDetail · ShoppingList · ActionSheet
// ────────────────────────────────────────────────────────────────────────────

const { useState, useEffect, useRef, useMemo } = React;
const U = window.DC_UI;
const D = window.DC_DATA;
const { I, Pill, IconBtn, Eyebrow, Chip, ExpiryChip, Photo, PhotoBox,
        Stat, SegBar, Stepper, FoodRow, FoodTile,
        SectionHead, TabBar, Phone, greeting } = U;

// ────────────────────────────────────────────────────────────────────────────
// ADD FOOD — Scanner with bottom sheet (product found)
// ────────────────────────────────────────────────────────────────────────────
function ScreenAddFood({ onClose, goto, premium = true }) {
  const [mode, setMode] = useState('scan'); // scan | ai | manual
  const [scanState, setScanState] = useState('scanning'); // scanning | found
  const [presetDays, setPresetDays] = useState(15);
  const [tipOpen, setTipOpen] = useState(null); // food id when storage tip overlay is open
  // Photo: 'placeholder' | 'gallery' | 'camera' | 'product'
  const [scanPhoto, setScanPhoto] = useState('product');
  const [manualPhoto, setManualPhoto] = useState('placeholder');
  const [scanLote, setScanLote] = useState('L2613');
  const [manualLote, setManualLote] = useState('');

  useEffect(() => {
    if (mode !== 'scan') return;
    setScanState('scanning');
    const t = setTimeout(()=>setScanState('found'), 1800);
    return ()=> clearTimeout(t);
  }, [mode]);

  return (
    <Phone scroll={false}>
      <div className="col" style={{ height:'100%', background: mode==='scan' ? '#0d1411' : 'var(--canvas)' }}>

        {/* Top bar */}
        <div className="row between" style={{ padding:'14px 16px 0', zIndex:10 }}>
          <IconBtn variant={mode==='scan'?'dark':'hairline'} onClick={onClose}><I.Close size={18}/></IconBtn>
          <div className="seg" style={{ background: mode==='manual'?'var(--surface-soft)':'rgba(255,255,255,0.10)' }}>
            <button className={'seg-btn'+(mode==='scan'?' active':'')} onClick={()=>setMode('scan')} style={{ color: mode==='scan'?'var(--ink)':(mode==='manual'?'var(--muted)':'rgba(255,255,255,0.7)') }}>
              <I.Scan size={13}/> Código
            </button>
            <button className={'seg-btn'+(mode==='ai'?' active':'')} onClick={()=>setMode('ai')} style={{ color: mode==='ai'?'var(--ink)':(mode==='manual'?'var(--muted)':'rgba(255,255,255,0.7)') }}>
              <I.Sparkle size={13}/> IA <span style={{ marginLeft:4, fontSize:9, padding:'1px 5px', borderRadius:999, background: mode==='ai'?'var(--block-pistachio)':'var(--block-peach)', color:'var(--ink)' }}>PRO</span>
            </button>
            <button className={'seg-btn'+(mode==='manual'?' active':'')} onClick={()=>setMode('manual')} style={{ color: mode==='manual'?'var(--canvas)':(mode==='manual'?'var(--canvas)':'var(--muted)') }}>
              <I.Edit size={13}/> Manual
            </button>
          </div>
          <IconBtn variant={mode==='scan'?'dark':'hairline'}><I.Sparkle size={18}/></IconBtn>
        </div>

        {/* SCANNER VIEW */}
        {mode === 'scan' && (
          <div className="col grow" style={{ position:'relative' }}>
            {/* Faux camera background — uses a market photo */}
            <div style={{
              position:'absolute', inset:0,
              backgroundImage:`url("${D.PHOTO.hero_market}")`,
              backgroundSize:'cover', backgroundPosition:'center',
              filter:'brightness(0.55) saturate(0.85)',
            }}/>
            {/* Vignette */}
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)' }}/>

            <div className="col" style={{ position:'absolute', inset:0, padding:'80px 28px 0' }}>
              <div className="col gap-6" style={{ color:'var(--canvas)' }}>
                <div className="eyebrow on-dark">Adicionar alimento</div>
                <h2 className="display-md" style={{ margin:0, color:'var(--canvas)' }}>
                  Aponte para o<br/><i>código de barras.</i>
                </h2>
              </div>
            </div>

            {/* Scanning frame */}
            <div style={{
              position:'absolute', left:'50%', top:'52%', transform:'translate(-50%,-50%)',
              width:260, height:160,
            }}>
              {/* corners */}
              {['tl','tr','bl','br'].map(c => (
                <div key={c} style={{
                  position:'absolute', width:30, height:30,
                  borderColor:'var(--canvas)', borderStyle:'solid', borderWidth:0,
                  borderTopWidth: c.startsWith('t') ? 3 : 0,
                  borderBottomWidth: c.startsWith('b') ? 3 : 0,
                  borderLeftWidth: c.endsWith('l') ? 3 : 0,
                  borderRightWidth: c.endsWith('r') ? 3 : 0,
                  top: c.startsWith('t') ? -2 : 'auto',
                  bottom: c.startsWith('b') ? -2 : 'auto',
                  left: c.endsWith('l') ? -2 : 'auto',
                  right: c.endsWith('r') ? -2 : 'auto',
                  borderRadius: c==='tl'?'8px 0 0 0' : c==='tr'?'0 8px 0 0' : c==='bl'?'0 0 0 8px' : '0 0 8px 0',
                }}/>
              ))}
              {/* scan line */}
              {scanState==='scanning' && (
                <div style={{
                  position:'absolute', left:8, right:8, top:'50%',
                  height:2, background:'var(--block-peach)',
                  boxShadow:'0 0 16px var(--block-peach)',
                  animation:'pulse 1.6s ease-in-out infinite',
                }}/>
              )}
              {scanState==='found' && (
                <div className="row center" style={{
                  position:'absolute', inset:0,
                  background:'rgba(213,226,168,0.95)', borderRadius:8,
                  color:'var(--ink)',
                }}>
                  <div className="col center gap-6">
                    <I.Check size={36}/>
                    <div className="caption">· Produto encontrado ·</div>
                  </div>
                </div>
              )}
            </div>

            {/* Hint */}
            <div className="col center" style={{ position:'absolute', left:0, right:0, bottom:200, color:'rgba(250,245,235,0.7)', fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.16em' }}>
              {scanState==='scanning' ? '— BUSCANDO CÓDIGO —' : '— IOGURTE NATURAL · 200G —'}
            </div>

            {/* Manual link */}
            <div className="row" style={{ position:'absolute', left:0, right:0, bottom:140, justifyContent:'center' }}>
              <Pill variant="on-dark" size="sm" leading={<I.Edit size={14}/>} onClick={()=>setMode('manual')}>
                Não consegui ler · cadastrar manualmente
              </Pill>
            </div>

            {/* Bottom sheet — product found */}
            {scanState==='found' && (
              <div className="fade-up" style={{
                position:'absolute', left:0, right:0, bottom:0,
                background:'var(--canvas)', borderRadius:'28px 28px 0 0',
                padding:'18px 18px 22px',
                boxShadow:'0 -20px 50px rgba(0,0,0,0.30)',
              }}>
                <div style={{ width:38, height:4, background:'var(--hairline)', borderRadius:999, margin:'0 auto 14px' }}/>
                <div className="row between" style={{ marginBottom:12 }}>
                  <div>
                    <Eyebrow>Produto encontrado</Eyebrow>
                    <div className="display-md" style={{ margin:'4px 0 0' }}>Iogurte <i>natural</i></div>
                    <div className="body-sm" style={{ color:'var(--muted)', marginTop:2 }}>Vigor · 170g · Laticínios</div>
                  </div>
                  <Photo src={D.PHOTO.yogurt} size={64} radius="md"/>
                </div>

                {/* Photo + Lote */}
                <div className="row gap-10" style={{ marginTop:14, marginBottom:14 }}>
                  <PhotoCapture value={scanPhoto} onChange={setScanPhoto} src={D.PHOTO.yogurt} />
                  <div className="col grow gap-6">
                    <label className="field-label">Lote / fabricação</label>
                    <div className="row gap-6">
                      <input className="input" placeholder="Ex: L2613" value={scanLote} onChange={e=>setScanLote(e.target.value)} style={{ flex:1 }}/>
                      <IconBtn variant="hairline" ariaLabel="Ler lote"><I.Scan size={16}/></IconBtn>
                    </div>
                    <div className="caption" style={{ fontSize:9.5, textTransform:'none', letterSpacing:'0.02em', fontFamily:'var(--font-sans)', color:'var(--muted)' }}>Útil para recall e rastreio</div>
                  </div>
                </div>

                <Eyebrow>Quando vence?</Eyebrow>
                <div className="row gap-6" style={{ marginTop:8, marginBottom:10, flexWrap:'wrap' }}>
                  {[5,15,30].map(d=>(
                    <button key={d} onClick={()=>setPresetDays(d)} style={{
                      height:42, padding:'0 14px', borderRadius:999, border:0, cursor:'pointer',
                      background: presetDays===d ? 'var(--ink)' : 'var(--surface)',
                      color: presetDays===d ? 'var(--canvas)' : 'var(--ink)',
                      boxShadow: presetDays===d ? 'none' : 'inset 0 0 0 1px var(--hairline)',
                      fontFamily:'var(--font-sans)', fontSize:13, fontWeight:500,
                    }}>{d} dias</button>
                  ))}
                  <button style={{
                    height:42, padding:'0 14px', borderRadius:999, border:0, cursor:'pointer',
                    background:'var(--surface)', color:'var(--ink)',
                    boxShadow:'inset 0 0 0 1px var(--hairline)',
                    fontFamily:'var(--font-sans)', fontSize:13, fontWeight:500,
                    display:'inline-flex', alignItems:'center', gap:6,
                  }}><I.Calendar size={14}/> Data específica</button>
                </div>

                <div className="row gap-8" style={{ marginTop:6 }}>
                  <div style={{ flex:1 }}>
                    <Eyebrow>Onde guardar</Eyebrow>
                    <div className="seg" style={{ marginTop:6 }}>
                      <button className="seg-btn active"><I.Fridge size={14}/> Geladeira</button>
                      <button className="seg-btn"><I.Pantry size={14}/> Despensa</button>
                      <button className="seg-btn"><I.Freezer size={14}/> Freezer</button>
                    </div>
                  </div>
                </div>

                <div className="row gap-10" style={{ marginTop:18 }}>
                  <Pill variant="secondary" onClick={()=>setMode('manual')}>Editar</Pill>
                  <Pill variant="primary" block trailing={<I.Check size={18}/>} onClick={()=>onClose && onClose()}>
                    Salvar na despensa
                  </Pill>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI MODE — delegates to dedicated screen */}
        {mode === 'ai' && (
          <div style={{ position:'absolute', inset:0 }}>
            <window.ScreenAIRecognize
              onClose={onClose}
              premium={premium}
              startState={premium ? 'aiming' : 'gate'}
            />
          </div>
        )}

        {/* MANUAL ENTRY */}
        {mode === 'manual' && (
          <div className="col grow scroll" style={{ padding:'12px 18px 24px', overflowY:'auto' }}>
            <div className="row between" style={{ alignItems:'flex-start' }}>
              <div className="col gap-6">
                <Eyebrow style={{ marginTop:8 }}>Cadastro manual</Eyebrow>
                <h1 className="display-lg" style={{ margin:'2px 0 0', fontSize:36 }}>
                  Novo <i>alimento.</i>
                </h1>
              </div>
              <button className="pill pill-secondary pill-sm" onClick={()=>setMode('scan')} style={{ marginTop:14 }}>
                <I.Scan size={14}/> Escanear código
              </button>
            </div>
            <p className="body-sm" style={{ color:'var(--muted)', margin:'10px 0 18px' }}>
              Cadastre alimentos sem código de barras — itens a granel, da feira ou caseiros.
            </p>

            {/* Photo upload — prominent */}
            <PhotoUploadHero value={manualPhoto} onChange={setManualPhoto} src={manualPhoto==='product' ? D.PHOTO.tomato : null} />

            <div style={{ height:14 }}/>

            {/* Name */}
            <div className="field" style={{ marginBottom:14 }}>
              <label className="field-label">Nome do alimento</label>
              <input className="input" placeholder="Ex: Tomate italiano" defaultValue="Tomate italiano" />
            </div>

            {/* Quantity row */}
            <div className="row gap-12" style={{ marginBottom:14 }}>
              <div className="field" style={{ flex:1 }}>
                <label className="field-label">Quantidade</label>
                <input className="input" defaultValue="6" />
              </div>
              <div className="field" style={{ flex:1 }}>
                <label className="field-label">Unidade</label>
                <input className="input" defaultValue="un" />
              </div>
            </div>

            {/* Category */}
            <div className="field" style={{ marginBottom:14 }}>
              <label className="field-label">Categoria</label>
              <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
                {D.CATEGORIES.slice(0,6).map(c=>(
                  <button key={c.name} style={{
                    flexShrink:0, height:42, padding:'0 12px', borderRadius:999, border:0, cursor:'pointer',
                    background: c.name==='Vegetais' ? 'var(--ink)' : c.color,
                    color: c.name==='Vegetais' ? 'var(--canvas)' : 'var(--ink)',
                    fontFamily:'var(--font-sans)', fontSize:13, fontWeight:500,
                    display:'inline-flex', alignItems:'center', gap:6,
                  }}>
                    <span>{c.emoji}</span>{c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div className="field" style={{ marginBottom:14 }}>
              <label className="field-label">Onde guardar</label>
              <div className="seg" style={{ marginTop:2 }}>
                <button className="seg-btn active"><I.Fridge size={14}/> Geladeira</button>
                <button className="seg-btn"><I.Pantry size={14}/> Despensa</button>
                <button className="seg-btn"><I.Freezer size={14}/> Freezer</button>
              </div>
            </div>

            {/* Expiry */}
            <div className="field" style={{ marginBottom:14 }}>
              <label className="field-label">Data de validade</label>
              <div className="row gap-8" style={{ flexWrap:'wrap' }}>
                {[5,15,30].map(d=>(
                  <button key={d} onClick={()=>setPresetDays(d)} style={{
                    height:42, padding:'0 14px', borderRadius:999, border:0, cursor:'pointer',
                    background: presetDays===d ? 'var(--ink)' : 'var(--surface)',
                    color: presetDays===d ? 'var(--canvas)' : 'var(--ink)',
                    boxShadow: presetDays===d ? 'none' : 'inset 0 0 0 1px var(--hairline)',
                    fontFamily:'var(--font-sans)', fontSize:13, fontWeight:500,
                  }}>{d} dias</button>
                ))}
                <div style={{ flex:'1 0 100%', display:'flex', gap:10, alignItems:'center', marginTop:6 }}>
                  <input className="input" defaultValue="29 mai 2026" style={{ flex:1 }}/>
                  <IconBtn variant="hairline"><I.Calendar size={18}/></IconBtn>
                </div>
              </div>
            </div>

            {/* Lote / Marca */}
            <div className="row gap-12" style={{ marginBottom:14 }}>
              <div className="field" style={{ flex:1 }}>
                <label className="field-label">Lote / fabricação</label>
                <div className="row gap-6">
                  <input className="input" placeholder="Ex: L2613" value={manualLote} onChange={e=>setManualLote(e.target.value)} style={{ flex:1 }}/>
                  <IconBtn variant="hairline" ariaLabel="Ler lote pela foto"><I.Scan size={16}/></IconBtn>
                </div>
              </div>
              <div className="field" style={{ flex:1 }}>
                <label className="field-label">Marca <span style={{ textTransform:'none', letterSpacing:0, color:'var(--muted-2)' }}>(opcional)</span></label>
                <input className="input" placeholder="Ex: Feira" defaultValue="" />
              </div>
            </div>

            {/* Notes / origem */}
            <div className="field" style={{ marginBottom:14 }}>
              <label className="field-label">Observações <span style={{ textTransform:'none', letterSpacing:0, color:'var(--muted-2)' }}>(opcional)</span></label>
              <input className="input" placeholder="Ex: Comprado na feira de sábado" defaultValue="" />
            </div>

            {/* Storage tip (Premium) */}
            <div style={{ marginBottom:14 }}>
              <window.StorageHintCard
                premium={premium}
                foodId="tomato"
                onOpen={()=>setTipOpen('tomato')}
                onUpgrade={()=>setTipOpen('gate')}
              />
            </div>

            {/* Alerts */}
            <div className="card" style={{ padding:'14px 16px', marginTop:6, background:'var(--block-cream)', boxShadow:'none' }}>
              <div className="row between" style={{ alignItems:'center' }}>
                <div className="col gap-2">
                  <Eyebrow>Alertas automáticos</Eyebrow>
                  <div className="body-sm" style={{ color:'var(--ink)' }}>30, 15 e 5 dias antes de vencer</div>
                </div>
                <div className="row gap-2">
                  {[30,15,5].map(d=>(
                    <div key={d} className="chip chip-ink" style={{ background:'var(--ink)' }}>{d}d</div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ height:14 }}/>
            <Pill variant="primary" block size="lg" trailing={<I.Check size={18}/>} onClick={()=>onClose && onClose()}>
              Salvar alimento
            </Pill>
          </div>
        )}

        {/* Storage tip overlay (Premium feature) */}
        {tipOpen && (
          <div style={{ position:'absolute', inset:0, zIndex:70 }}>
            <window.ScreenStorageTip
              foodId={tipOpen==='gate' ? 'banana' : tipOpen}
              premium={tipOpen!=='gate'}
              onClose={()=>setTipOpen(null)}
            />
          </div>
        )}
      </div>
    </Phone>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// INVENTORY — Despensa, Geladeira, Freezer
// ────────────────────────────────────────────────────────────────────────────
function ScreenInventory({ onTab, onAdd, openSheet }) {
  const [loc, setLoc] = useState('all');
  const [view, setView] = useState('grid'); // grid | list
  const [cat, setCat] = useState('all');

  const items = D.FOOD_ITEMS;
  const byLoc = loc==='all' ? items : items.filter(i=>i.locationId===loc);
  const byCat = cat==='all' ? byLoc : byLoc.filter(i=>i.category===cat);

  const locMeta = {
    pantry:  { icon:<I.Pantry size={14}/>,  label:'Despensa', count: items.filter(i=>i.locationId==='pantry').length },
    fridge:  { icon:<I.Fridge size={14}/>,  label:'Geladeira', count: items.filter(i=>i.locationId==='fridge').length },
    freezer: { icon:<I.Freezer size={14}/>, label:'Freezer',   count: items.filter(i=>i.locationId==='freezer').length },
  };

  const presentCats = useMemo(()=> Array.from(new Set(byLoc.map(i=>i.category))), [byLoc]);

  return (
    <Phone>
      <div style={{ paddingBottom:96, background:'var(--canvas)', minHeight:'100%' }}>
        {/* Header */}
        <div className="row between" style={{ padding:'14px 18px 4px' }}>
          <div className="col gap-2">
            <Eyebrow>Sua casa</Eyebrow>
            <div className="title" style={{ fontSize:15 }}>Despensa de Marina</div>
          </div>
          <div className="row gap-8">
            <IconBtn variant="hairline"><I.Search size={18}/></IconBtn>
            <IconBtn variant="hairline" onClick={onAdd}><I.Plus size={18}/></IconBtn>
          </div>
        </div>

        {/* Hero title */}
        <div style={{ padding:'12px 18px 6px' }}>
          <h1 className="display-lg" style={{ margin:'4px 0 16px', fontSize:40 }}>
            {byLoc.length} itens<br/>em <i>{loc==='all' ? '3 locais' : locMeta[loc].label.toLowerCase()}.</i>
          </h1>
        </div>

        {/* Location segmented */}
        <div style={{ padding:'0 18px 14px' }}>
          <div className="seg" style={{ background:'var(--surface)' }}>
            <button className={'seg-btn'+(loc==='all'?' active':'')} onClick={()=>setLoc('all')}>
              Todos · {items.length}
            </button>
            <button className={'seg-btn'+(loc==='pantry'?' active':'')} onClick={()=>setLoc('pantry')}>
              <I.Pantry size={14}/> {locMeta.pantry.count}
            </button>
            <button className={'seg-btn'+(loc==='fridge'?' active':'')} onClick={()=>setLoc('fridge')}>
              <I.Fridge size={14}/> {locMeta.fridge.count}
            </button>
            <button className={'seg-btn'+(loc==='freezer'?' active':'')} onClick={()=>setLoc('freezer')}>
              <I.Freezer size={14}/> {locMeta.freezer.count}
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'0 18px 14px' }}>
          <button onClick={()=>setCat('all')} style={chipBtnStyle(cat==='all')}>Todas</button>
          {presentCats.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={chipBtnStyle(cat===c)}>
              <span style={{ marginRight:4 }}>{D.catEmoji(c)}</span> {c}
            </button>
          ))}
        </div>

        {/* Sort + view toggle */}
        <div className="row between" style={{ padding:'0 18px 14px', alignItems:'center' }}>
          <div className="caption">Ordenado por validade</div>
          <div className="row gap-6">
            <IconBtn variant={view==='grid'?'hairline':'ghost'} size={32} onClick={()=>setView('grid')}>
              <svg viewBox="0 0 24 24" width="16" height="16"><path fill="none" stroke="currentColor" strokeWidth="1.6" d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z"/></svg>
            </IconBtn>
            <IconBtn variant={view==='list'?'hairline':'ghost'} size={32} onClick={()=>setView('list')}>
              <svg viewBox="0 0 24 24" width="16" height="16"><path fill="none" stroke="currentColor" strokeWidth="1.6" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </IconBtn>
          </div>
        </div>

        {/* Items */}
        {view==='grid' ? (
          <div style={{ padding:'0 18px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {byCat.slice().sort((a,b)=>D.daysUntil(a.expiresAt)-D.daysUntil(b.expiresAt)).map(item => (
              <button key={item.id} onClick={()=>openSheet && openSheet(item)} style={{
                background:'var(--surface)', borderRadius:20, padding:12,
                boxShadow:'inset 0 0 0 1px var(--hairline)', border:0, cursor:'pointer',
                textAlign:'left',
              }}>
                <Photo src={item.photo} size={130} radius="md" style={{ width:'100%' }} color={D.catColor(item.category)} />
                <div className="col gap-4" style={{ marginTop:10 }}>
                  <div className="title" style={{ fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                  <div className="row between" style={{ alignItems:'center' }}>
                    <span style={{ fontSize:11, color:'var(--muted)' }}>{item.qty} {item.unit}</span>
                    <ExpiryChip date={item.expiresAt}/>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="col gap-8" style={{ padding:'0 18px' }}>
            {byCat.slice().sort((a,b)=>D.daysUntil(a.expiresAt)-D.daysUntil(b.expiresAt)).map(item => (
              <FoodRow key={item.id} item={item} onPress={()=>openSheet && openSheet(item)}/>
            ))}
          </div>
        )}

        <div style={{ height:20 }}/>
      </div>
    </Phone>
  );
}

function chipBtnStyle(active) {
  return {
    flexShrink:0, height:36, padding:'0 13px', borderRadius:999, border:0, cursor:'pointer',
    background: active ? 'var(--ink)' : 'var(--surface)',
    color: active ? 'var(--canvas)' : 'var(--ink)',
    boxShadow: active ? 'none' : 'inset 0 0 0 1px var(--hairline)',
    fontFamily:'var(--font-sans)', fontSize:12.5, fontWeight:500,
    display:'inline-flex', alignItems:'center',
  };
}

// ────────────────────────────────────────────────────────────────────────────
// RECIPES
// ────────────────────────────────────────────────────────────────────────────
function ScreenRecipes({ goto, onTab }) {
  const [filter, setFilter] = useState('priority');
  const recipes = D.RECIPES;
  const featured = recipes[0];
  const list = recipes.slice(1);

  return (
    <Phone>
      <div style={{ paddingBottom:96, background:'var(--canvas)', minHeight:'100%' }}>
        {/* Header */}
        <div className="row between" style={{ padding:'14px 18px 4px' }}>
          <IconBtn variant="hairline" onClick={()=>onTab('home')}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Receitas</div>
          <IconBtn variant="hairline"><I.Search size={18}/></IconBtn>
        </div>

        {/* Hero */}
        <div style={{ padding:'10px 18px 4px' }}>
          <Eyebrow>Cozinhe com o que tem</Eyebrow>
          <h1 className="display-lg" style={{ margin:'6px 0 14px' }}>
            Aproveite<br/>antes de <i>vencer.</i>
          </h1>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'4px 18px 14px' }}>
          {[
            { id:'priority', label:'Em alerta', emoji:'🔥' },
            { id:'all',      label:'Você tem tudo' },
            { id:'quick',    label:'Até 15 min' },
            { id:'veggie',   label:'Vegetarianas' },
          ].map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={chipBtnStyle(filter===f.id)}>
              {f.emoji && <span style={{ marginRight:4 }}>{f.emoji}</span>}{f.label}
            </button>
          ))}
        </div>

        {/* Featured */}
        <div style={{ padding:'0 18px 18px' }}>
          <button onClick={()=>goto({ name:'recipeDetail', recipeId: featured.id })} style={{
            display:'block', width:'100%', textAlign:'left',
            background:'var(--ink)', color:'var(--canvas)',
            borderRadius:26, overflow:'hidden', position:'relative',
            border:0, cursor:'pointer', padding:0,
          }}>
            <PhotoBox src={featured.photo} height={220} radius={0} style={{ width:'100%' }}>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)' }} />
              <div style={{ position:'absolute', top:14, left:14 }}>
                <Sticker style={{ background:'var(--block-peach)', color:'var(--ink)' }}>
                  <I.Flame size={12}/> Use primeiro
                </Sticker>
              </div>
              <div style={{ position:'absolute', bottom:14, left:14, right:14 }}>
                <div className="caption" style={{ color:'rgba(250,245,235,0.75)' }}>Destaque · hoje</div>
                <div className="display-md" style={{ color:'var(--canvas)', marginTop:6 }}>{featured.title}</div>
              </div>
            </PhotoBox>
            <div className="col gap-10" style={{ padding:'14px 16px 16px' }}>
              <div className="body-sm" style={{ color:'rgba(250,245,235,0.78)' }}>{featured.reason}</div>
              <div className="row between" style={{ alignItems:'center' }}>
                <div className="row gap-12" style={{ color:'rgba(250,245,235,0.75)', fontSize:12 }}>
                  <span className="row gap-4"><I.Clock size={12}/> {featured.duration} min</span>
                  <span className="row gap-4"><I.Sparkle size={12}/> {featured.have}/{featured.total} itens</span>
                  <span>{featured.level}</span>
                </div>
                <span className="pill pill-on-dark pill-sm" style={{ background:'var(--canvas)', color:'var(--ink)' }}>Ver receita →</span>
              </div>
            </div>
          </button>
        </div>

        {/* List header */}
        <div className="row between" style={{ padding:'0 18px 10px', alignItems:'flex-end' }}>
          <div className="col gap-4">
            <Eyebrow>Para você</Eyebrow>
            <div className="display-sm" style={{ margin:0 }}>{list.length} sugestões</div>
          </div>
          <div className="caption">Match score ↓</div>
        </div>

        {/* Recipe list */}
        <div className="col gap-12" style={{ padding:'0 18px' }}>
          {list.map(r => (
            <button key={r.id} onClick={()=>goto({ name:'recipeDetail', recipeId:r.id })} style={{
              display:'flex', alignItems:'stretch', gap:14,
              background:'var(--surface)', borderRadius:20,
              boxShadow:'inset 0 0 0 1px var(--hairline)',
              border:0, cursor:'pointer', padding:12, textAlign:'left', width:'100%',
            }}>
              <PhotoBox src={r.photo} width={94} height={94} radius={14} />
              <div className="col grow gap-6" style={{ minWidth:0, justifyContent:'space-between' }}>
                <div className="col gap-4">
                  <div className="title" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.title}</div>
                  <div className="body-sm" style={{ color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:12 }}>{r.reason}</div>
                </div>
                <div className="row gap-6" style={{ flexWrap:'wrap' }}>
                  <Chip tone={r.missing.length===0 ? 'safe' : 'soon'}>
                    {r.missing.length===0 ? 'Você tem tudo' : `Falta ${r.missing.length}`}
                  </Chip>
                  <Chip tone="neutral"><I.Clock size={10}/> {r.duration} min</Chip>
                </div>
              </div>
              <div className="col" style={{ alignItems:'flex-end', justifyContent:'space-between' }}>
                <div className="display italic" style={{ fontSize:30, lineHeight:1 }}>{r.have}<span style={{ fontSize:14, color:'var(--muted)' }}>/{r.total}</span></div>
                <I.ArrowUpRight size={18} />
              </div>
            </button>
          ))}
        </div>

        <div style={{ height:20 }}/>
      </div>
    </Phone>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// RECIPE DETAIL
// ────────────────────────────────────────────────────────────────────────────
function ScreenRecipeDetail({ recipeId, goto, onTab }) {
  const r = D.RECIPES.find(x=>x.id===recipeId) || D.RECIPES[0];
  return (
    <Phone>
      <div style={{ background:'var(--canvas)', minHeight:'100%', paddingBottom:120 }}>
        {/* Hero photo */}
        <div style={{ position:'relative' }}>
          <PhotoBox src={r.photo} height={320} radius={0} style={{ width:'100%' }}>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)' }}/>
            <div className="row between" style={{ position:'absolute', top:14, left:14, right:14 }}>
              <IconBtn variant="dark" onClick={()=>onTab('recipes')}><I.ArrowLeft size={18}/></IconBtn>
              <div className="row gap-8">
                <IconBtn variant="dark"><I.Bookmark size={18}/></IconBtn>
                <IconBtn variant="dark"><I.More size={18}/></IconBtn>
              </div>
            </div>
            <div style={{ position:'absolute', bottom:18, left:18, right:18, color:'var(--canvas)' }}>
              <div className="row gap-8">
                <Sticker style={{ background:'var(--block-peach)', color:'var(--ink)' }}>
                  <I.Flame size={12}/> Use primeiro
                </Sticker>
              </div>
              <div className="eyebrow on-dark" style={{ marginTop:14 }}>Almoço · 3 porções</div>
              <h1 className="display-xl" style={{ color:'var(--canvas)', margin:'8px 0 0', fontSize:42 }}>{r.title}</h1>
            </div>
          </PhotoBox>
        </div>

        {/* Match block */}
        <div style={{ padding:'14px 18px 0' }}>
          <div className="block pistachio" style={{ padding:'16px 16px' }}>
            <div className="row between" style={{ alignItems:'center' }}>
              <div className="col gap-4">
                <Eyebrow>Por que sugerimos</Eyebrow>
                <div className="title" style={{ fontSize:14 }}>{r.reason}</div>
              </div>
              <div className="display italic" style={{ fontSize:36, lineHeight:1 }}>
                {r.have}<span style={{ fontSize:16, color:'var(--muted)' }}>/{r.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="row between" style={{ padding:'18px 22px 14px' }}>
          <MiniStat icon={<I.Clock size={16}/>}    n={r.duration}        l="minutos" />
          <div style={{ width:1, background:'var(--hairline)' }}/>
          <MiniStat icon={<I.User size={16}/>}     n={r.servings}        l="porções" />
          <div style={{ width:1, background:'var(--hairline)' }}/>
          <MiniStat icon={<I.Flame size={16}/>}    n={r.level}           l="dificuldade" />
        </div>

        {/* Ingredients */}
        <div style={{ padding:'4px 18px 0' }}>
          <div className="row between" style={{ alignItems:'flex-end', marginBottom:10 }}>
            <div className="col gap-4">
              <Eyebrow>Ingredientes</Eyebrow>
              <div className="display-sm" style={{ margin:0 }}>O que você precisa</div>
            </div>
            {r.missing.length>0 && (
              <button className="pill pill-secondary pill-sm" onClick={()=>onTab('shopping')}>
                <I.Plus size={14}/> Adicionar à lista
              </button>
            )}
          </div>
          <div className="col gap-8">
            {r.ingredients.map((ing,i)=>(
              <div key={i} className="row gap-12" style={{
                background:'var(--surface)', padding:'10px 14px', borderRadius:14,
                boxShadow:'inset 0 0 0 1px var(--hairline)', alignItems:'center',
              }}>
                <div style={{
                  width:24, height:24, borderRadius:999,
                  background: ing.have ? 'var(--safe-soft)' : 'var(--danger-soft)',
                  color: ing.have ? 'var(--safe)' : 'var(--danger)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {ing.have ? <I.Check size={14}/> : <I.Plus size={14}/>}
                </div>
                <div className="col grow gap-2">
                  <div className="title" style={{ fontSize:14 }}>{ing.name}</div>
                  <div className="body-sm" style={{ color:'var(--muted)', fontSize:12 }}>
                    {ing.qty} · {ing.have ? (ing.urgent ? 'você tem — usa antes de vencer' : 'você tem em casa') : 'precisa comprar'}
                  </div>
                </div>
                {ing.urgent && <Chip tone="urgent" withDot>urgente</Chip>}
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div style={{ padding:'24px 18px 0' }}>
          <Eyebrow>Modo de preparo</Eyebrow>
          <div className="display-sm" style={{ margin:'4px 0 14px' }}>Passo a passo</div>
          <div className="col gap-12">
            {r.steps.map((step,i)=>(
              <div key={i} className="row gap-14" style={{ alignItems:'flex-start' }}>
                <div className="display italic" style={{ fontSize:32, lineHeight:1, color:'var(--primary)', width:28, flexShrink:0 }}>
                  {String(i+1).padStart(2,'0')}
                </div>
                <div className="body" style={{ paddingTop:4, fontSize:14 }}>{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed CTA */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'16px 18px 18px',
          background:'linear-gradient(180deg, rgba(250,245,235,0) 0%, var(--canvas) 30%)' }}>
          <Pill variant="primary" block size="lg" trailing={<I.Fire size={18}/>}>
            Cozinhar agora
          </Pill>
        </div>
      </div>
    </Phone>
  );
}

function MiniStat({ icon, n, l }) {
  return (
    <div className="col gap-4" style={{ alignItems:'center', flex:1 }}>
      <div className="row gap-6" style={{ color:'var(--ink)' }}>
        {icon}
        <div className="display italic" style={{ fontSize:22 }}>{n}</div>
      </div>
      <div className="caption" style={{ fontSize:9.5 }}>{l}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SHOPPING LIST
// ────────────────────────────────────────────────────────────────────────────
function ScreenShopping({ onTab, onAdd }) {
  const [items, setItems] = useState(D.SHOPPING_ITEMS);
  const checked = items.filter(i=>i.checked).length;
  const pct = Math.round((checked/items.length)*100);
  const groups = useMemo(()=>{
    const g = {};
    items.forEach(i => { (g[i.category] ??= []).push(i); });
    return g;
  }, [items]);

  function toggle(id) {
    setItems(items.map(i => i.id===id ? { ...i, checked:!i.checked } : i));
  }
  function setQty(id, qty) {
    setItems(items.map(i => i.id===id ? { ...i, qty } : i));
  }

  return (
    <Phone>
      <div style={{ paddingBottom:96, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'14px 18px 4px' }}>
          <IconBtn variant="hairline" onClick={()=>onTab('home')}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Compras</div>
          <IconBtn variant="hairline" onClick={onAdd}><I.Plus size={18}/></IconBtn>
        </div>

        {/* Hero — color block with progress */}
        <div style={{ padding:'10px 18px 14px' }}>
          <div className="block charcoal" style={{ padding:'22px 22px 20px' }}>
            <Eyebrow dark>· lista da semana ·</Eyebrow>
            <h1 className="display-lg" style={{ margin:'8px 0 16px', color:'var(--canvas)' }}>
              {items.length-checked} itens<br/>para <i>comprar.</i>
            </h1>
            <div className="row between" style={{ alignItems:'flex-end' }}>
              <div className="col gap-4">
                <div className="caption" style={{ color:'rgba(250,245,235,0.65)' }}>Progresso</div>
                <div className="row gap-6" style={{ color:'var(--canvas)', alignItems:'baseline' }}>
                  <span className="display italic" style={{ fontSize:36 }}>{checked}</span>
                  <span style={{ color:'rgba(250,245,235,0.6)' }}>/ {items.length}</span>
                </div>
              </div>
              {/* circular progress */}
              <div style={{ position:'relative', width:70, height:70 }}>
                <svg viewBox="0 0 100 100" width="70" height="70" style={{ position:'absolute' }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(250,245,235,0.18)" strokeWidth="10"/>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--block-peach)" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${pct*2.64} 1000`} transform="rotate(-90 50 50)"/>
                </svg>
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--canvas)', fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:18 }}>
                  {pct}%
                </div>
              </div>
            </div>
            <div style={{ height:14 }}/>
            <div className="row gap-8">
              <Pill variant="on-dark" size="sm" leading={<I.Plus size={14}/>} onClick={onAdd}>Adicionar item</Pill>
              <Pill variant="on-dark" size="sm" style={{ background:'var(--canvas)', color:'var(--ink)' }} leading={<I.Chef size={14}/>}>Das receitas</Pill>
            </div>
          </div>
        </div>

        {/* Duplicate warning (if any) */}
        {items.find(i=>i.duplicate && !i.checked) && (
          <div style={{ padding:'0 18px 14px' }}>
            <div className="block" style={{ background:'var(--block-cream)', padding:'14px 16px' }}>
              <div className="row gap-12" style={{ alignItems:'flex-start' }}>
                <div style={{ width:36, height:36, borderRadius:999, background:'var(--ink)', color:'var(--canvas)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <I.Bell size={18}/>
                </div>
                <div className="col grow gap-2">
                  <Eyebrow>· cuidado com duplicidade ·</Eyebrow>
                  <div className="body-sm" style={{ fontSize:13 }}>
                    Você já tem <b>Iogurte natural</b> ativo na geladeira. Tem certeza?
                  </div>
                </div>
                <button className="pill pill-secondary pill-sm">Ver</button>
              </div>
            </div>
          </div>
        )}

        {/* Groups */}
        <div className="col gap-18" style={{ padding:'0 18px' }}>
          {Object.entries(groups).map(([cat, list]) => (
            <div key={cat} className="col gap-10">
              <div className="row between" style={{ alignItems:'center' }}>
                <div className="row gap-10">
                  <div style={{
                    width:32, height:32, borderRadius:10,
                    background: D.catColor(cat),
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:16,
                  }}>{D.catEmoji(cat)}</div>
                  <div className="col gap-2">
                    <div className="title" style={{ fontSize:14 }}>{cat}</div>
                    <div className="caption" style={{ fontSize:9.5 }}>{list.length} · {list.filter(x=>x.checked).length} feitos</div>
                  </div>
                </div>
                <I.More size={18}/>
              </div>
              <div className="col gap-8">
                {list.map(item => (
                  <div key={item.id} className="row gap-12" style={{
                    background:'var(--surface)', padding:'10px 14px',
                    borderRadius:16, boxShadow:'inset 0 0 0 1px var(--hairline)',
                    alignItems:'center',
                  }}>
                    <button onClick={()=>toggle(item.id)} style={{
                      width:26, height:26, borderRadius:8, border:0, cursor:'pointer',
                      background: item.checked ? 'var(--ink)' : 'var(--surface)',
                      color: item.checked ? 'var(--canvas)' : 'transparent',
                      boxShadow: item.checked ? 'none' : 'inset 0 0 0 1.5px var(--hairline)',
                      flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                    }}><I.Check size={14}/></button>

                    <div className="col grow gap-2" style={{ minWidth:0 }}>
                      <div className="title" style={{
                        fontSize:14,
                        textDecoration: item.checked ? 'line-through' : 'none',
                        color: item.checked ? 'var(--muted)' : 'var(--ink)',
                      }}>{item.name}</div>
                      <div className="row gap-8" style={{ color:'var(--muted)', fontSize:11.5 }}>
                        {item.source === 'recipe'   && <span className="row gap-4"><I.Chef size={10}/> Receita</span>}
                        {item.source === 'replenishment' && <span className="row gap-4"><I.Bell size={10}/> Reposição</span>}
                        {item.duplicate && <span style={{ color:'var(--urgent)' }}>· já tem em casa</span>}
                      </div>
                    </div>

                    <Stepper value={item.qty} onChange={v=>setQty(item.id, v)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ height:8 }}/>
        </div>
      </div>
    </Phone>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// ACTION SHEET (on FoodItem tap)
// ────────────────────────────────────────────────────────────────────────────
function ActionSheet({ item, onClose, goto, premium = true, openStorageTip }) {
  if (!item) return null;
  const status = D.expiryStatus(item.expiresAt);
  return (
    <div style={{
      position:'absolute', inset:0, zIndex:50,
      background:'rgba(26,43,31,0.45)',
      display:'flex', alignItems:'flex-end',
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="fade-up" style={{
        width:'100%', background:'var(--canvas)',
        borderRadius:'28px 28px 0 0', padding:'14px 18px 22px',
      }}>
        <div style={{ width:38, height:4, background:'var(--hairline)', borderRadius:999, margin:'0 auto 14px' }}/>
        <div className="row gap-14" style={{ marginBottom:16 }}>
          <Photo src={item.photo} size={64} radius="md" color={D.catColor(item.category)}/>
          <div className="col grow gap-4" style={{ minWidth:0 }}>
            <div className="caption" style={{ fontSize:9.5 }}>{item.category} · {D.locName(item.locationId)}</div>
            <div className="display-sm" style={{ margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
            <div className="row gap-8">
              <ExpiryChip date={item.expiresAt}/>
              <span style={{ fontSize:12, color:'var(--muted)' }}>{item.qty} {item.unit}</span>
            </div>
          </div>
        </div>

        <div className="col gap-8">
          <ActionRow icon={<I.Check size={16}/>}   label="Marcar como consumido"      tone="safe" />
          <ActionRow icon={<I.Chef size={16}/>}    label="Ver receitas que aproveitam" tone="ink" onClick={()=>{ onClose(); goto && goto({ name:'recipes' }); }} />
          <ActionRow icon={<I.Sparkle size={16}/>} label="Dica de armazenamento"     tone="ink" badge="PREMIUM" onClick={()=>{ onClose(); openStorageTip && openStorageTip(item, premium); }} />
          <ActionRow icon={<I.Cart size={16}/>}    label="Adicionar reposição" />
          <ActionRow icon={<I.Calendar size={16}/>} label="Editar validade ou local" />
          <ActionRow icon={<I.Trash size={16}/>}   label="Descartar" tone="danger" />
        </div>
      </div>
    </div>
  );
}
function ActionRow({ icon, label, tone, onClick, badge }) {
  const color = tone==='danger' ? 'var(--danger)' : tone==='safe' ? 'var(--safe)' : 'var(--ink)';
  return (
    <button onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:14,
      background:'var(--surface)', padding:'14px 16px',
      borderRadius:14, boxShadow:'inset 0 0 0 1px var(--hairline)',
      border:0, cursor:'pointer', textAlign:'left', width:'100%',
      color,
    }}>
      <div style={{
        width:32, height:32, borderRadius:999,
        background: tone==='danger' ? 'var(--danger-soft)' : tone==='safe' ? 'var(--safe-soft)' : 'var(--surface-soft)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>{icon}</div>
      <div className="title" style={{ flex:1, color }}>{label}</div>
      {badge && (
        <span style={{
          fontFamily:'var(--font-mono)', fontSize:8.5, letterSpacing:'0.12em',
          padding:'3px 7px', borderRadius:999,
          background:'var(--ink)', color:'var(--block-pistachio)',
        }}>★ {badge}</span>
      )}
      <I.ArrowRight size={16} />
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// PhotoCapture — compact 80×80 thumb with edit overlay (scanner sheet)
// ────────────────────────────────────────────────────────────────────────────
function PhotoCapture({ value, onChange, src }) {
  const hasPhoto = value === 'product' || value === 'camera' || value === 'gallery';
  return (
    <div className="col gap-6" style={{ flexShrink:0 }}>
      <label className="field-label">Foto</label>
      <div style={{ position:'relative' }}>
        <div style={{
          width:80, height:80, borderRadius:14,
          background: hasPhoto ? `url("${src}") center/cover` : 'var(--surface)',
          boxShadow: hasPhoto ? 'inset 0 0 0 1px var(--hairline)' : 'inset 0 0 0 1.5px var(--hairline)',
          backgroundImage: hasPhoto ? `url("${src}")` : 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(26,43,31,0.05) 6px 7px)',
          backgroundColor: 'var(--surface-soft)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'var(--muted)',
        }}>
          {!hasPhoto && <I.Camera size={22}/>}
        </div>
        {/* Floating edit button */}
        <button onClick={()=>onChange(hasPhoto ? 'placeholder' : 'product')} style={{
          position:'absolute', right:-6, bottom:-6,
          width:28, height:28, borderRadius:999,
          background:'var(--ink)', color:'var(--canvas)',
          border:'2px solid var(--canvas)', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {hasPhoto ? <I.Edit size={12}/> : <I.Plus size={14}/>}
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// PhotoUploadHero — big upload zone with Camera / Gallery actions (manual)
// ────────────────────────────────────────────────────────────────────────────
function PhotoUploadHero({ value, onChange, src }) {
  const hasPhoto = value === 'product' || value === 'camera' || value === 'gallery';

  if (hasPhoto) {
    return (
      <div style={{ position:'relative' }}>
        <PhotoBox src={src} height={180} radius={20} style={{ width:'100%' }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)' }}/>
          <div style={{ position:'absolute', top:10, left:10 }}>
            <Sticker style={{ background:'var(--canvas)', color:'var(--ink)' }}>
              <I.Check size={12}/> Foto adicionada
            </Sticker>
          </div>
          <div className="row gap-8" style={{ position:'absolute', bottom:10, right:10 }}>
            <button onClick={()=>onChange('camera')} className="icon-btn on-dark" style={{ width:34, height:34 }} aria-label="Tirar outra foto">
              <I.Camera size={16}/>
            </button>
            <button onClick={()=>onChange('placeholder')} className="icon-btn on-dark" style={{ width:34, height:34 }} aria-label="Remover">
              <I.Trash size={16}/>
            </button>
          </div>
        </PhotoBox>
      </div>
    );
  }

  return (
    <div style={{
      background:'var(--surface)',
      borderRadius:20,
      boxShadow:'inset 0 0 0 1.5px var(--hairline)',
      backgroundImage:'repeating-linear-gradient(45deg, transparent 0 8px, rgba(26,43,31,0.04) 8px 9px)',
      padding:'22px 18px',
      display:'flex', flexDirection:'column', alignItems:'center', gap:12,
    }}>
      <div style={{
        width:56, height:56, borderRadius:999,
        background:'var(--block-cream)', color:'var(--ink)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <I.Camera size={26}/>
      </div>
      <div className="col gap-2" style={{ alignItems:'center', textAlign:'center' }}>
        <div className="title" style={{ fontSize:14 }}>Adicione uma foto do produto</div>
        <div className="body-sm" style={{ color:'var(--muted)', fontSize:12, maxWidth:240 }}>
          Ajuda a identificar o item na despensa e a ler o lote depois.
        </div>
      </div>
      <div className="row gap-8">
        <Pill variant="primary" size="sm" leading={<I.Camera size={14}/>} onClick={()=>onChange('camera')}>
          Tirar foto
        </Pill>
        <Pill variant="secondary" size="sm" leading={<I.Plus size={14}/>} onClick={()=>onChange('gallery')}>
          Da galeria
        </Pill>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenAddFood, ScreenInventory, ScreenRecipes, ScreenRecipeDetail, ScreenShopping, ActionSheet,
  PhotoCapture, PhotoUploadHero,
});
