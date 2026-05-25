/* global React, DC_UI, DC_DATA */
// ────────────────────────────────────────────────────────────────────────────
// DespensaCerta — Screens (Part 7)
// StorageTipDetail · StorageTipsLibrary (Premium · feature de armazenamento)
// ────────────────────────────────────────────────────────────────────────────

const { useState, useMemo } = React;
const U7 = window.DC_UI;
const D7 = window.DC_DATA;
const { I, Pill, IconBtn, Eyebrow, Chip, ExpiryChip, Photo, PhotoBox, Sticker, Phone } = U7;

// ────────────────────────────────────────────────────────────────────────────
// Knowledge base — curated tips per food
// ────────────────────────────────────────────────────────────────────────────
const STORAGE_TIPS = {
  banana: {
    food: 'Banana prata',
    cat:  'Frutas',
    emoji:'🍌',
    photo: D7.PHOTO.banana,
    location: 'Temperatura ambiente',
    locIcon: 'pantry',
    temp: '18–22 °C',
    lifespan: { ambient: '4–6 dias', fridge:'1 semana (após madura)', freezer:'3 meses' },
    sensitive: 'alta',
    summary: 'Guarde em fruteira aberta e ventilada, longe do sol e de fontes de calor como o fogão.',
    tips: [
      'Embale os talos com filme plástico — reduz a liberação de etileno e atrasa o amadurecimento.',
      'Separe de maçãs, abacates e tomates: essas frutas aceleram o ponto.',
      'Se quiser madurar mais rápido, junte com outras frutas em saco de papel.',
      'Já passou do ponto? Descasque e congele em pedaços para vitaminas e bolos.',
    ],
    avoid: [
      { name:'Maçã',     reason:'libera muito etileno', emoji:'🍎' },
      { name:'Abacate',  reason:'amadurece junto',      emoji:'🥑' },
      { name:'Tomate',   reason:'transfere odor',       emoji:'🍅' },
    ],
    overripe: [
      'Pão de banana, panqueca, bolo úmido',
      'Smoothie congelado com leite vegetal',
      'Banana caramelizada para sobremesa',
    ],
    relatedRecipes: ['r5'],
  },
  potato: {
    food: 'Batata inglesa',
    cat:  'Vegetais',
    emoji:'🥔',
    photo: D7.PHOTO.onion, // placeholder; would be batata
    location: 'Despensa escura',
    locIcon: 'pantry',
    temp: '7–10 °C',
    lifespan: { ambient:'2–3 semanas', fridge:'não recomendado', freezer:'pré-cozida · 6 meses' },
    sensitive: 'baixa',
    summary: 'Guarde em local seco, escuro e ventilado. A luz forma cloreto verde e o frio converte o amido em açúcar.',
    tips: [
      'Use saco de papel ou caixa furada — nunca plástico fechado.',
      'Não lave antes de guardar: a umidade acelera o brotamento.',
      'Separe das cebolas: cada uma libera gases que estragam a outra.',
      'Brotos pequenos? Remova e use; brotos grandes ou casca verde, descarte.',
    ],
    avoid: [
      { name:'Cebola', reason:'gases mútuos', emoji:'🧅' },
      { name:'Maçã',   reason:'acelera brotamento', emoji:'🍎' },
    ],
    overripe: [
      'Purê congelado em porções',
      'Batata rosti / nhoque para freezer',
      'Sopa cremosa de batata',
    ],
    relatedRecipes: ['r4'],
  },
  tomato: {
    food: 'Tomate italiano',
    cat:  'Vegetais',
    emoji:'🍅',
    photo: D7.PHOTO.tomato,
    location: 'Temperatura ambiente',
    locIcon: 'pantry',
    temp: '15–20 °C',
    lifespan: { ambient:'5–7 dias', fridge:'2 dias (estraga textura)', freezer:'6 meses · cozido' },
    sensitive: 'alta',
    summary: 'Fora da geladeira até amadurecer. O frio deixa a textura farinhenta e mata o sabor.',
    tips: [
      'Coloque com o cabinho para baixo: prolonga a vida em 2 dias.',
      'Já maduros? Geladeira por no máximo 2 dias.',
      'Para freezer: branqueie 30s, descasque, congele inteiros.',
      'Passados, viram molho de pomodoro em 20 minutos.',
    ],
    avoid: [
      { name:'Banana', reason:'transfere sabor', emoji:'🍌' },
    ],
    overripe: [
      'Molho pomodoro caseiro',
      'Tomate seco no forno',
      'Sopa de tomate assado',
    ],
    relatedRecipes: ['r1','r5'],
  },
  avocado: {
    food: 'Abacate',
    cat:  'Frutas',
    emoji:'🥑',
    photo: D7.PHOTO.avocado,
    location: 'Ambiente até maduro',
    locIcon: 'pantry',
    temp: '20 °C',
    lifespan: { ambient:'3–5 dias', fridge:'1 semana após maduro', freezer:'polpa · 4 meses' },
    sensitive: 'alta',
    summary: 'Madura em temperatura ambiente; vai para a geladeira só quando estiver no ponto.',
    tips: [
      'Junto com banana ou maçã num saco de papel madura em 1 dia.',
      'Cortado? Mantenha o caroço, regue com limão e cubra com plástico.',
      'Congele a polpa amassada com limão para guacamole futuro.',
    ],
    avoid: [],
    overripe: [
      'Guacamole para freezer',
      'Mousse de abacate',
      'Smoothie verde com limão',
    ],
    relatedRecipes: ['r3'],
  },
  lettuce: {
    food: 'Alface americana',
    cat:  'Vegetais',
    emoji:'🥬',
    photo: D7.PHOTO.lettuce,
    location: 'Geladeira · gaveta',
    locIcon: 'fridge',
    temp: '2–4 °C',
    lifespan: { ambient:'12 horas', fridge:'5–7 dias', freezer:'não recomendado' },
    sensitive: 'média',
    summary: 'Geladeira na gaveta de verduras, envolta em papel-toalha para absorver umidade.',
    tips: [
      'Não lave antes de guardar — só na hora do consumo.',
      'Folhas murchas? Mergulhe em água gelada por 15 min para reidratar.',
      'Use recipiente com fundo seco e papel-toalha trocado a cada 2 dias.',
    ],
    avoid: [
      { name:'Banana', reason:'etileno faz amarelar', emoji:'🍌' },
    ],
    overripe: [
      'Sopa cremosa de alface',
      'Risoto verde',
    ],
    relatedRecipes: ['r3'],
  },
  apple: {
    food: 'Maçã gala',
    cat:  'Frutas',
    emoji:'🍎',
    photo: D7.PHOTO.apple,
    location: 'Geladeira ou ambiente',
    locIcon: 'fridge',
    temp: '0–4 °C',
    lifespan: { ambient:'5–7 dias', fridge:'3–4 semanas', freezer:'fatias · 8 meses' },
    sensitive: 'alta',
    summary: 'Dura 4× mais na geladeira. Mantenha separada — libera muito etileno.',
    tips: [
      'Guarde em saco perfurado na gaveta da geladeira.',
      'Separe de bananas, verduras e tomates.',
      'Fatias com casca duram 2h sem oxidar com limão.',
    ],
    avoid: [
      { name:'Banana',  reason:'amadurece tudo perto', emoji:'🍌' },
      { name:'Alface',  reason:'verdes amarelam',      emoji:'🥬' },
    ],
    overripe: [
      'Compota de maçã',
      'Torta rústica',
      'Maçã assada com canela',
    ],
    relatedRecipes: [],
  },
};

const TIPS_LIST = Object.entries(STORAGE_TIPS).map(([k,v]) => ({ id:k, ...v }));

// ════════════════════════════════════════════════════════════════════════════
// STORAGE TIP — Detail screen for a single food
// ════════════════════════════════════════════════════════════════════════════
function ScreenStorageTip({ onClose, foodId = 'banana', premium = true }) {
  if (!premium) {
    return <StorageTipGate onClose={onClose} onUnlock={onClose} />;
  }

  const t = STORAGE_TIPS[foodId] || STORAGE_TIPS.banana;
  const locIcon = ({ pantry:<I.Pantry size={16}/>, fridge:<I.Fridge size={16}/>, freezer:<I.Freezer size={16}/> })[t.locIcon];

  return (
    <Phone>
      <div style={{ background:'var(--canvas)', minHeight:'100%', paddingBottom:30 }}>
        {/* Hero */}
        <div style={{ position:'relative' }}>
          <PhotoBox src={t.photo} height={260} radius={0} style={{ width:'100%' }}>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)' }}/>
            <div className="row between" style={{ position:'absolute', top:14, left:14, right:14 }}>
              <IconBtn variant="dark" onClick={onClose}><I.ArrowLeft size={18}/></IconBtn>
              <div className="row gap-8">
                <Sticker style={{ background:'var(--block-pistachio)', color:'var(--ink)' }}>
                  <I.Sparkle size={12}/> IA · PREMIUM
                </Sticker>
                <IconBtn variant="dark"><I.Bookmark size={18}/></IconBtn>
              </div>
            </div>
            <div style={{ position:'absolute', bottom:14, left:18, right:18, color:'var(--canvas)' }}>
              <div className="eyebrow on-dark">Dica de armazenamento · {t.cat}</div>
              <h1 className="display-xl" style={{ color:'var(--canvas)', margin:'6px 0 0', fontSize:42 }}>
                {t.food.split(' ')[0]}<br/><i>{t.food.split(' ').slice(1).join(' ') || ''}</i>
              </h1>
            </div>
          </PhotoBox>
        </div>

        {/* Quick stats row */}
        <div style={{ padding:'18px 18px 14px' }}>
          <div className="block pistachio" style={{ padding:'18px 16px' }}>
            <Eyebrow>· o essencial ·</Eyebrow>
            <h2 className="display-md" style={{ margin:'8px 0 12px' }}>{t.summary}</h2>
            <div className="row gap-6" style={{ flexWrap:'wrap' }}>
              <Chip tone="ink">{locIcon} {t.location}</Chip>
              <Chip tone="neutral">🌡 {t.temp}</Chip>
              <Chip tone="neutral">⏱ {t.lifespan.ambient}</Chip>
            </div>
          </div>
        </div>

        {/* Lifespan table */}
        <div style={{ padding:'4px 18px 14px' }}>
          <Eyebrow>Quanto dura</Eyebrow>
          <div style={{ marginTop:8, background:'var(--surface)', borderRadius:18, padding:'4px 4px', boxShadow:'inset 0 0 0 1px var(--hairline)' }}>
            <LifeRow icon={<I.Pantry size={16}/>}  label="Ambiente"  value={t.lifespan.ambient} tone="ink"/>
            <LifeRow icon={<I.Fridge size={16}/>}  label="Geladeira" value={t.lifespan.fridge}  tone="safe" />
            <LifeRow icon={<I.Freezer size={16}/>} label="Freezer"   value={t.lifespan.freezer} tone="ink" last/>
          </div>
        </div>

        {/* Como prolongar */}
        <div style={{ padding:'4px 18px 14px' }}>
          <Eyebrow>Como prolongar</Eyebrow>
          <div className="display-sm" style={{ margin:'4px 0 12px' }}>4 truques que funcionam</div>
          <div className="col">
            {t.tips.map((tip,i)=>(
              <div key={i} className="row gap-14" style={{ padding:'10px 0', borderBottom: i<t.tips.length-1 ? '1px solid var(--hairline-soft)' : 'none', alignItems:'flex-start' }}>
                <div className="display italic" style={{ fontSize:24, lineHeight:1, color:'var(--primary)', width:32, flexShrink:0 }}>
                  {String(i+1).padStart(2,'0')}
                </div>
                <div className="body" style={{ fontSize:13.5, paddingTop:3, color:'var(--ink)' }}>{tip}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cuidado com */}
        {t.avoid.length>0 && (
          <div style={{ padding:'4px 18px 14px' }}>
            <div className="block rose" style={{ padding:'16px 16px' }}>
              <div className="row between" style={{ alignItems:'flex-start', marginBottom:10 }}>
                <div>
                  <Eyebrow>· longe de ·</Eyebrow>
                  <div className="display-sm" style={{ margin:'4px 0 0' }}>Não guarde junto</div>
                </div>
                <div style={{ fontSize:24 }}>⚠️</div>
              </div>
              <div className="col gap-6">
                {t.avoid.map((a,i)=>(
                  <div key={i} className="row gap-10" style={{ alignItems:'center' }}>
                    <div style={{ width:32, height:32, borderRadius:10, background:'rgba(255,255,255,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{a.emoji}</div>
                    <div className="col gap-2 grow">
                      <div className="title" style={{ fontSize:13 }}>{a.name}</div>
                      <div className="body-sm" style={{ fontSize:11.5, color:'var(--ink-2)' }}>{a.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quando passar do ponto */}
        <div style={{ padding:'4px 18px 14px' }}>
          <Eyebrow>Se passar do ponto</Eyebrow>
          <div className="display-sm" style={{ margin:'4px 0 10px' }}>Aproveite assim</div>
          <div className="col gap-8">
            {t.overripe.map((o,i)=>(
              <div key={i} className="row gap-10" style={{ background:'var(--surface)', padding:'10px 14px', borderRadius:14, boxShadow:'inset 0 0 0 1px var(--hairline)', alignItems:'center' }}>
                <div style={{ width:26, height:26, borderRadius:999, background:'var(--block-pistachio)', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <I.Chef size={13}/>
                </div>
                <span className="body-sm" style={{ fontSize:13 }}>{o}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Source footer */}
        <div style={{ padding:'10px 18px 18px' }}>
          <div className="row gap-8" style={{
            background:'var(--ink)', color:'var(--canvas)',
            padding:'10px 14px', borderRadius:14, alignItems:'center',
          }}>
            <I.Sparkle size={14}/>
            <div className="caption on-dark" style={{ flex:1, color:'rgba(250,245,235,0.85)' }}>
              GERADO POR IA · CURADO POR NUTRICIONISTAS
            </div>
            <span className="pill pill-on-dark pill-sm" style={{ background:'var(--block-pistachio)', color:'var(--ink)' }}>Útil?</span>
          </div>
        </div>
      </div>
    </Phone>
  );
}

function LifeRow({ icon, label, value, tone, last }) {
  return (
    <div className="row gap-12" style={{
      padding:'12px 14px',
      borderBottom: last ? 'none' : '1px solid var(--hairline-soft)',
      alignItems:'center',
    }}>
      <div style={{ width:34, height:34, borderRadius:10, background:'var(--canvas)', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {icon}
      </div>
      <div className="title grow" style={{ fontSize:13 }}>{label}</div>
      <div className="row gap-6" style={{ alignItems:'center' }}>
        {value === 'não recomendado' && <span style={{ width:6, height:6, borderRadius:999, background:'var(--danger)' }}/>}
        <span className="body-sm" style={{ fontSize:13, color: value==='não recomendado' ? 'var(--danger)' : 'var(--ink)' }}>{value}</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// STORAGE LIBRARY — Browse tips by category
// ════════════════════════════════════════════════════════════════════════════
function ScreenStorageLibrary({ onClose, onOpen, premium = true }) {
  if (!premium) return <StorageTipGate onClose={onClose} onUnlock={onClose}/>;
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    return TIPS_LIST.filter(t => {
      if (cat !== 'all' && t.cat !== cat) return false;
      if (q && !t.food.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [cat, q]);
  const categories = ['all', ...new Set(TIPS_LIST.map(t=>t.cat))];

  return (
    <Phone>
      <div style={{ background:'var(--canvas)', minHeight:'100%', paddingBottom:30 }}>
        <div className="row between" style={{ padding:'14px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={onClose}><I.ArrowLeft size={18}/></IconBtn>
          <Sticker style={{ background:'var(--block-pistachio)', color:'var(--ink)' }}>
            <I.Sparkle size={12}/> PREMIUM
          </Sticker>
          <IconBtn variant="hairline"><I.Bookmark size={18}/></IconBtn>
        </div>

        <div style={{ padding:'10px 18px 14px' }}>
          <Eyebrow>· biblioteca de armazenamento ·</Eyebrow>
          <h1 className="display-lg" style={{ margin:'8px 0 8px' }}>
            Onde guardar<br/>cada <i>alimento.</i>
          </h1>
          <p className="body" style={{ color:'var(--muted)', fontSize:14, margin:0 }}>
            Dicas de armazenamento, durabilidade e o que evitar — selecionadas para o clima brasileiro.
          </p>
        </div>

        {/* Search */}
        <div style={{ padding:'4px 18px 12px' }}>
          <div style={{ position:'relative' }}>
            <input className="input" placeholder="Buscar alimento" value={q} onChange={e=>setQ(e.target.value)} style={{ paddingLeft:42 }} />
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}><I.Search size={16}/></span>
          </div>
        </div>

        {/* Category filter */}
        <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'4px 18px 14px' }}>
          {categories.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{
              flexShrink:0, height:36, padding:'0 13px', borderRadius:999, border:0, cursor:'pointer',
              background: cat===c ? 'var(--ink)' : 'var(--surface)',
              color: cat===c ? 'var(--canvas)' : 'var(--ink)',
              boxShadow: cat===c ? 'none' : 'inset 0 0 0 1px var(--hairline)',
              fontFamily:'var(--font-sans)', fontSize:12.5, fontWeight:500,
            }}>{c==='all'?'Todos':c}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ padding:'0 18px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {filtered.map(t => (
            <button key={t.id} onClick={()=>onOpen && onOpen(t.id)} style={{
              background:'var(--surface)', borderRadius:20, padding:12, border:0, cursor:'pointer',
              boxShadow:'inset 0 0 0 1px var(--hairline)', textAlign:'left',
            }}>
              <Photo src={t.photo} size={130} radius="md" style={{ width:'100%' }} color={D7.catColor(t.cat)} />
              <div className="col gap-6" style={{ marginTop:10 }}>
                <div className="title" style={{ fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.food}</div>
                <div className="row gap-4">
                  <Chip tone={t.locIcon==='fridge'?'safe':'neutral'}>
                    {t.locIcon==='fridge' ? '❄ Geladeira' : t.locIcon==='freezer' ? '❄❄ Freezer' : '◼ Despensa'}
                  </Chip>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ padding:'16px 18px' }}>
          <div className="block charcoal" style={{ padding:'14px 14px' }}>
            <div className="row gap-10" style={{ alignItems:'center' }}>
              <I.Sparkle size={18} />
              <div className="col gap-2 grow">
                <Eyebrow dark>· novidade ·</Eyebrow>
                <div className="body-sm" style={{ color:'var(--canvas)', fontSize:12.5 }}>
                  Não achou um alimento? Pergunte à IA — geramos uma dica personalizada em segundos.
                </div>
              </div>
              <span className="pill pill-on-dark pill-sm" style={{ background:'var(--block-pistachio)', color:'var(--ink)', flexShrink:0 }}>Perguntar</span>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PAYWALL — when feature requested by Free user
// ════════════════════════════════════════════════════════════════════════════
function StorageTipGate({ onClose, onUnlock }) {
  return (
    <Phone scroll={false}>
      <div className="col" style={{ height:'100%', background:'var(--ink)', color:'var(--canvas)', position:'relative', overflow:'hidden' }}>
        {/* Decorative hero photo */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:300, overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:`url("${D7.PHOTO.banana}")`, backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.6) saturate(1.1)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(26,43,31,0) 0%, var(--ink) 95%)' }}/>
        </div>

        <div className="row between" style={{ position:'relative', zIndex:5, padding:'14px 16px 0' }}>
          <IconBtn variant="dark" onClick={onClose}><I.Close size={18}/></IconBtn>
          <div className="caption on-dark" style={{ color:'rgba(250,245,235,0.65)' }}>Recurso Premium</div>
          <div style={{ width:40 }}/>
        </div>

        <div style={{ height:240 }}/>

        <div className="col grow" style={{ position:'relative', zIndex:5, padding:'10px 24px 0' }}>
          <Sticker style={{ background:'var(--block-pistachio)', color:'var(--ink)', alignSelf:'flex-start' }}>
            <I.Sparkle size={12}/> PREMIUM
          </Sticker>
          <h1 className="display-xl" style={{ color:'var(--canvas)', margin:'12px 0 10px', fontSize:42, lineHeight:0.95 }}>
            Onde guardar<br/><i style={{ color:'var(--block-pistachio)' }}>cada coisa.</i>
          </h1>
          <p className="body" style={{ color:'rgba(250,245,235,0.75)', maxWidth:320, fontSize:14, margin:0 }}>
            Dicas curadas por nutricionistas para frutas, legumes e verduras: temperatura, durabilidade e o que evitar.
          </p>

          <div className="col gap-10" style={{ marginTop:22 }}>
            <FeatureRowSt icon={<I.Pantry size={16}/>}   title="Despensa, geladeira ou freezer"  sub="A escolha certa para cada alimento" />
            <FeatureRowSt icon={<I.Clock size={16}/>}    title="Quanto tempo dura"               sub="Por local de armazenamento" />
            <FeatureRowSt icon={<I.Sparkle size={16}/>}  title="O que evitar guardar junto"      sub="Etileno, odores, umidade" />
            <FeatureRowSt icon={<I.Chef size={16}/>}     title="Receitas para o que passou"      sub="Aproveitar antes de descartar" />
          </div>
        </div>

        <div style={{ position:'relative', zIndex:5, padding:'18px 24px 24px' }}>
          <Pill variant="primary" block size="lg" trailing={<I.ArrowRight size={18}/>}
            style={{ background:'var(--block-pistachio)', color:'var(--ink)' }}
            onClick={onUnlock}>
            Experimentar 14 dias grátis
          </Pill>
          <div className="caption" style={{ textAlign:'center', marginTop:10, color:'rgba(250,245,235,0.5)' }}>
            R$ 8,90/mês · cancele a qualquer momento
          </div>
        </div>
      </div>
    </Phone>
  );
}

function FeatureRowSt({ icon, title, sub }) {
  return (
    <div className="row gap-12" style={{ alignItems:'flex-start' }}>
      <div style={{ width:36, height:36, borderRadius:10, background:'rgba(213,226,168,0.18)', color:'var(--block-pistachio)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
      <div className="col gap-2" style={{ paddingTop:4 }}>
        <div className="title" style={{ color:'var(--canvas)', fontSize:14 }}>{title}</div>
        <div className="body-sm" style={{ color:'rgba(250,245,235,0.65)', fontSize:12 }}>{sub}</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// StorageHintCard — small Premium teaser to embed inside AddFood / ActionSheet
// ────────────────────────────────────────────────────────────────────────────
function StorageHintCard({ premium = true, foodId, onOpen, onUpgrade }) {
  const tip = STORAGE_TIPS[foodId] || STORAGE_TIPS.tomato;
  if (!premium) {
    return (
      <button onClick={onUpgrade} style={{
        width:'100%', textAlign:'left', border:0, cursor:'pointer',
        background:'var(--ink)', color:'var(--canvas)', borderRadius:18, padding:'14px 16px',
        display:'flex', gap:12, alignItems:'center',
      }}>
        <div style={{ width:36, height:36, borderRadius:10, background:'var(--block-pistachio)', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <I.Sparkle size={16}/>
        </div>
        <div className="col gap-2 grow">
          <div className="row gap-6" style={{ alignItems:'center' }}>
            <span className="caption on-dark" style={{ color:'var(--block-pistachio)', fontSize:9.5 }}>PREMIUM</span>
            <span className="title" style={{ color:'var(--canvas)', fontSize:13 }}>Onde guardar este alimento?</span>
          </div>
          <div className="body-sm" style={{ color:'rgba(250,245,235,0.7)', fontSize:11.5 }}>
            Dicas curadas: temperatura, durabilidade e o que evitar
          </div>
        </div>
        <I.ArrowRight size={16} />
      </button>
    );
  }
  return (
    <button onClick={onOpen} style={{
      width:'100%', textAlign:'left', border:0, cursor:'pointer',
      background:'var(--block-pistachio)', color:'var(--ink)', borderRadius:18, padding:'14px 16px',
      display:'flex', gap:12, alignItems:'center',
    }}>
      <div style={{ width:36, height:36, borderRadius:10, background:'var(--ink)', color:'var(--block-pistachio)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <I.Sparkle size={16}/>
      </div>
      <div className="col gap-2 grow">
        <div className="row gap-6" style={{ alignItems:'center' }}>
          <span className="caption" style={{ fontSize:9.5 }}>· IA ·</span>
          <span className="title" style={{ fontSize:13 }}>Dica de armazenamento</span>
        </div>
        <div className="body-sm" style={{ fontSize:12, color:'var(--ink-2)', overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:1, WebkitBoxOrient:'vertical' }}>
          {tip.summary}
        </div>
      </div>
      <I.ArrowRight size={16} />
    </button>
  );
}

Object.assign(window, {
  ScreenStorageTip, ScreenStorageLibrary, StorageTipGate, StorageHintCard,
  STORAGE_TIPS, TIPS_LIST,
});
