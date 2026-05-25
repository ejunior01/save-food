/* global React, DC_UI, DC_DATA */
// ────────────────────────────────────────────────────────────────────────────
// DespensaCerta — Screens (Part 4)
// AlertSettings · HouseholdProfile · NFeImport · MealPlanner · Search
// ────────────────────────────────────────────────────────────────────────────

const { useState, useMemo } = React;
const U4 = window.DC_UI;
const D4 = window.DC_DATA;
const { I, Pill, IconBtn, Eyebrow, Chip, ExpiryChip, Photo, PhotoBox,
        Sticker, FoodRow, FoodTile, SectionHead, Phone } = U4;

// ════════════════════════════════════════════════════════════════════════════
// 5. ALERT SETTINGS — alertas por categoria
// ════════════════════════════════════════════════════════════════════════════
function ScreenAlertSettings({ onClose }) {
  const presets = {
    dairy:    { name:'Laticínios',   emoji:'🥛', days:[7,3,1],    color:'var(--block-cream)' },
    proteins: { name:'Proteínas',    emoji:'🍗', days:[5,2,1],    color:'var(--block-rose)' },
    veggies:  { name:'Vegetais',     emoji:'🥬', days:[5,3,1],    color:'var(--block-sage)' },
    fruits:   { name:'Frutas',       emoji:'🍎', days:[7,3,1],    color:'var(--block-peach)' },
    grains:   { name:'Grãos',        emoji:'🌾', days:[30,15,5],  color:'var(--block-pistachio)' },
    frozen:   { name:'Congelados',   emoji:'❄️', days:[60,30,7],  color:'#CFE0EA' },
    bakery:   { name:'Padaria',      emoji:'🍞', days:[3,2,1],    color:'#E8D2A8' },
    grocery:  { name:'Mercearia',    emoji:'🫒', days:[30,15,5],  color:'#DCC9A3' },
  };
  const [quietHours, setQuietHours] = useState(true);
  const [pushEnabled, setPush] = useState(true);

  return (
    <Phone>
      <div style={{ paddingBottom:40, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'14px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={onClose}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Alertas</div>
          <div style={{ width:40 }}/>
        </div>

        <div style={{ padding:'10px 18px 12px' }}>
          <Eyebrow>Configurações</Eyebrow>
          <h1 className="display-lg" style={{ margin:'6px 0 10px' }}>
            Quando<br/><i>te avisar.</i>
          </h1>
          <p className="body" style={{ color:'var(--muted)', fontSize:14, margin:0 }}>
            O ritmo de validade muda por categoria. Iogurte é diferente de arroz.
          </p>
        </div>

        {/* Master toggle */}
        <div style={{ padding:'8px 18px 14px' }}>
          <div className="row between" style={{
            background:'var(--ink)', borderRadius:18, padding:'14px 16px',
            color:'var(--canvas)',
          }}>
            <div className="col gap-2 grow">
              <Eyebrow dark>· status global ·</Eyebrow>
              <div className="title" style={{ color:'var(--canvas)', fontSize:14 }}>Notificações ativas</div>
            </div>
            <button onClick={()=>setPush(!pushEnabled)} style={{
              width:46, height:28, borderRadius:999, border:0, cursor:'pointer',
              background: pushEnabled ? 'var(--block-pistachio)' : 'rgba(255,255,255,0.2)',
              position:'relative',
            }}>
              <span style={{ position:'absolute', top:3, left: pushEnabled ? 22 : 3, width:22, height:22, borderRadius:999, background:'var(--canvas)', transition:'left .15s' }}/>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="col gap-10" style={{ padding:'0 18px' }}>
          <Eyebrow>Por categoria</Eyebrow>
          {Object.entries(presets).map(([k,c])=>(
            <CategoryAlertRow key={k} cat={c} />
          ))}
        </div>

        {/* Quiet hours */}
        <div style={{ padding:'18px 18px 0' }}>
          <Eyebrow>Modo silencioso</Eyebrow>
          <div style={{ marginTop:8, background:'var(--surface)', borderRadius:18, padding:'14px 16px', boxShadow:'inset 0 0 0 1px var(--hairline)' }}>
            <div className="row between" style={{ alignItems:'center' }}>
              <div className="col gap-2 grow">
                <div className="title" style={{ fontSize:14 }}>Não perturbe</div>
                <div className="body-sm" style={{ color:'var(--muted)', fontSize:12 }}>22:00 → 07:00 · todos os dias</div>
              </div>
              <button onClick={()=>setQuietHours(!quietHours)} style={{
                width:46, height:28, borderRadius:999, border:0, cursor:'pointer',
                background: quietHours ? 'var(--ink)' : 'var(--hairline)',
                position:'relative',
              }}>
                <span style={{ position:'absolute', top:3, left: quietHours ? 22 : 3, width:22, height:22, borderRadius:999, background:'var(--canvas)', transition:'left .15s' }}/>
              </button>
            </div>
          </div>
        </div>

        {/* Resumo diário */}
        <div style={{ padding:'14px 18px' }}>
          <div className="block pistachio" style={{ padding:'16px 16px' }}>
            <div className="row between" style={{ alignItems:'flex-start' }}>
              <div className="col gap-4">
                <Eyebrow>Resumo diário</Eyebrow>
                <div className="title" style={{ fontSize:14 }}>Briefing das 08:00</div>
                <div className="body-sm" style={{ color:'var(--muted)', fontSize:12, marginTop:2 }}>
                  Você recebe um único alerta no início do dia com tudo que precisa decidir
                </div>
              </div>
              <button style={{ width:46, height:28, borderRadius:999, border:0, cursor:'pointer', background:'var(--ink)', position:'relative' }}>
                <span style={{ position:'absolute', top:3, left:22, width:22, height:22, borderRadius:999, background:'var(--canvas)' }}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

function CategoryAlertRow({ cat }) {
  const [days, setDays] = useState(cat.days);
  return (
    <div style={{ background:'var(--surface)', borderRadius:18, padding:'14px 14px', boxShadow:'inset 0 0 0 1px var(--hairline)' }}>
      <div className="row between" style={{ alignItems:'center', marginBottom:10 }}>
        <div className="row gap-10">
          <div style={{ width:34, height:34, borderRadius:10, background: cat.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>
            {cat.emoji}
          </div>
          <div className="title" style={{ fontSize:13 }}>{cat.name}</div>
        </div>
        <div className="caption" style={{ fontSize:9.5 }}>{days.join(' · ')} dias</div>
      </div>
      <div className="row gap-6">
        {days.map((d,i)=>(
          <div key={i} style={{ flex:1, height:32, background:'var(--canvas)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:16, color:'var(--ink)' }}>
            {d}d
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6. HOUSEHOLD PROFILE — perfil da casa
// ════════════════════════════════════════════════════════════════════════════
function ScreenHouseholdProfile({ onClose }) {
  const restrictions = ['Sem lactose', 'Vegetariano', 'Sem glúten', 'Diabético', 'Vegano', 'Halal', 'Kosher'];
  const [selected, setSelected] = useState(['Sem lactose']);
  const t = v => setSelected(s => s.includes(v) ? s.filter(x=>x!==v) : [...s, v]);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(1);
  const [pets, setPets] = useState(1);

  return (
    <Phone>
      <div style={{ paddingBottom:120, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'14px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={onClose}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Perfil da casa</div>
          <IconBtn variant="ghost"><I.Check size={18}/></IconBtn>
        </div>

        {/* Hero photo */}
        <div style={{ padding:'10px 18px 16px' }}>
          <Eyebrow>Sobre vocês</Eyebrow>
          <h1 className="display-lg" style={{ margin:'6px 0 14px' }}>
            Sua casa,<br/>nossas <i>sugestões.</i>
          </h1>
          <PhotoBox src={D4.PHOTO.hero_cook} height={140} radius={20} style={{ width:'100%' }}>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%)' }}/>
            <div style={{ position:'absolute', bottom:12, left:14, color:'var(--canvas)' }}>
              <div className="caption" style={{ color:'rgba(250,245,235,0.7)' }}>Casa dos</div>
              <div className="display-md" style={{ color:'var(--canvas)', margin:'2px 0 0', fontStyle:'italic' }}>Pires</div>
            </div>
            <IconBtn variant="dark" style={{ position:'absolute', top:12, right:12 }}><I.Camera size={16}/></IconBtn>
          </PhotoBox>
        </div>

        {/* Composição */}
        <div style={{ padding:'4px 18px 14px' }}>
          <Eyebrow>Quem mora aqui</Eyebrow>
          <div className="row gap-10" style={{ marginTop:10 }}>
            <CompTile emoji="🧑" label="Adultos" value={adults} onChange={setAdults}/>
            <CompTile emoji="🧒" label="Crianças" value={kids} onChange={setKids}/>
            <CompTile emoji="🐶" label="Pets" value={pets} onChange={setPets}/>
          </div>
        </div>

        {/* Restrições */}
        <div style={{ padding:'4px 18px 14px' }}>
          <Eyebrow>Restrições alimentares</Eyebrow>
          <p className="body-sm" style={{ color:'var(--muted)', margin:'6px 0 10px', fontSize:12 }}>
            Filtramos receitas que respeitam estas preferências
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {restrictions.map(r=>(
              <button key={r} onClick={()=>t(r)} style={{
                height:38, padding:'0 14px', borderRadius:999, border:0, cursor:'pointer',
                background: selected.includes(r) ? 'var(--ink)' : 'var(--surface)',
                color: selected.includes(r) ? 'var(--canvas)' : 'var(--ink)',
                boxShadow: selected.includes(r) ? 'none' : 'inset 0 0 0 1px var(--hairline)',
                fontFamily:'var(--font-sans)', fontSize:13, fontWeight:500,
              }}>{r}</button>
            ))}
          </div>
        </div>

        {/* Despensa */}
        <div style={{ padding:'4px 18px 14px' }}>
          <Eyebrow>Equipamentos</Eyebrow>
          <div className="row gap-10" style={{ marginTop:10 }}>
            <CapTile icon={<I.Pantry size={20}/>} label="Despensa" value="Média" />
            <CapTile icon={<I.Fridge size={20}/>} label="Geladeira" value="Grande" />
            <CapTile icon={<I.Freezer size={20}/>} label="Freezer" value="Pequena" />
          </div>
        </div>

        {/* Budget */}
        <div style={{ padding:'4px 18px 18px' }}>
          <Eyebrow>Orçamento mensal</Eyebrow>
          <div className="block cream" style={{ padding:'14px 16px', marginTop:8 }}>
            <div className="row between" style={{ alignItems:'baseline' }}>
              <div className="display italic" style={{ fontSize:36 }}>R$ 1.200</div>
              <div className="caption">para mercado</div>
            </div>
            <div style={{ height:6, background:'rgba(26,43,31,0.1)', borderRadius:999, marginTop:10, overflow:'hidden' }}>
              <div style={{ width:'64%', height:'100%', background:'var(--ink)' }}/>
            </div>
            <div className="row between" style={{ marginTop:6, fontSize:11, color:'var(--muted)' }}>
              <span>R$ 768 usados</span>
              <span>R$ 432 restantes</span>
            </div>
          </div>
        </div>

        <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'16px 18px 18px',
          background:'linear-gradient(180deg, rgba(250,245,235,0) 0%, var(--canvas) 30%)' }}>
          <Pill variant="primary" block size="lg" trailing={<I.Check size={18}/>} onClick={onClose}>
            Salvar perfil
          </Pill>
        </div>
      </div>
    </Phone>
  );
}
function CompTile({ emoji, label, value, onChange }) {
  return (
    <div style={{ flex:1, background:'var(--surface)', borderRadius:18, padding:'12px 12px', boxShadow:'inset 0 0 0 1px var(--hairline)' }}>
      <div style={{ fontSize:22 }}>{emoji}</div>
      <div className="display italic" style={{ fontSize:28, lineHeight:1, marginTop:4 }}>{value}</div>
      <div className="caption" style={{ fontSize:9, marginTop:2 }}>{label}</div>
      <div className="row gap-4" style={{ marginTop:8 }}>
        <button onClick={()=>onChange(Math.max(0,value-1))} style={{ flex:1, height:28, borderRadius:999, border:0, background:'var(--canvas)', cursor:'pointer' }}>−</button>
        <button onClick={()=>onChange(value+1)} style={{ flex:1, height:28, borderRadius:999, border:0, background:'var(--canvas)', cursor:'pointer' }}>+</button>
      </div>
    </div>
  );
}
function CapTile({ icon, label, value }) {
  return (
    <div style={{ flex:1, background:'var(--surface)', borderRadius:18, padding:'12px 12px', boxShadow:'inset 0 0 0 1px var(--hairline)' }}>
      <div style={{ color:'var(--ink)' }}>{icon}</div>
      <div className="title" style={{ fontSize:13, marginTop:8 }}>{label}</div>
      <div className="caption" style={{ fontSize:9, marginTop:2 }}>{value}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 7. NFe IMPORT — escanear nota fiscal e popular
// ════════════════════════════════════════════════════════════════════════════
function ScreenNFeImport({ onClose }) {
  const [step, setStep] = useState('scan'); // scan | review | done
  const detected = [
    { name:'Tomate italiano',  qty:'500g',  cat:'Vegetais',  validity:'5 dias',  photo:D4.PHOTO.tomato,  selected:true },
    { name:'Leite integral',   qty:'1L',    cat:'Laticínios',validity:'7 dias',  photo:D4.PHOTO.milk,    selected:true },
    { name:'Pão de forma',     qty:'500g',  cat:'Padaria',   validity:'8 dias',  photo:D4.PHOTO.bread,   selected:true },
    { name:'Ovos brancos',     qty:'12un',  cat:'Proteínas', validity:'25 dias', photo:D4.PHOTO.egg,     selected:true },
    { name:'Banana prata',     qty:'1kg',   cat:'Frutas',    validity:'5 dias',  photo:D4.PHOTO.banana,  selected:true },
    { name:'Azeite extra',     qty:'500ml', cat:'Mercearia', validity:'8 meses', photo:D4.PHOTO.olive,   selected:true },
    { name:'Detergente neutro',qty:'500ml', cat:'Limpeza',   validity:'—',       photo:'',               selected:false },
  ];
  const [items, setItems] = useState(detected);
  const sel = items.filter(i=>i.selected).length;

  if (step==='scan') {
    return (
      <Phone scroll={false}>
        <div className="col" style={{ height:'100%', background:'#0d1411', position:'relative' }}>
          <div className="row between" style={{ padding:'14px 16px 0', zIndex:10 }}>
            <IconBtn variant="dark" onClick={onClose}><I.Close size={18}/></IconBtn>
            <div className="caption on-dark" style={{ color:'rgba(250,245,235,0.7)' }}>NFe / Cupom</div>
            <IconBtn variant="dark"><I.Sparkle size={18}/></IconBtn>
          </div>

          <div style={{
            position:'absolute', inset:0,
            backgroundImage:`url("${D4.PHOTO.hero_market}")`,
            backgroundSize:'cover', filter:'brightness(0.45) saturate(0.7)',
            zIndex:0,
          }}/>

          <div className="col grow" style={{ position:'relative', zIndex:2, padding:'70px 28px 0' }}>
            <Eyebrow dark>Importar do mercado</Eyebrow>
            <h2 className="display-md" style={{ color:'var(--canvas)', margin:'8px 0 0' }}>
              Aponte para o<br/><i>QR da nota fiscal.</i>
            </h2>
            <p className="body" style={{ color:'rgba(250,245,235,0.75)', marginTop:14, maxWidth:280, fontSize:13 }}>
              A gente lê todos os itens e categoriza automaticamente. Você só confirma as validades.
            </p>
          </div>

          {/* QR target */}
          <div style={{ position:'absolute', left:'50%', top:'58%', transform:'translate(-50%,-50%)', width:200, height:200 }}>
            {['tl','tr','bl','br'].map(c => (
              <div key={c} style={{
                position:'absolute', width:36, height:36,
                borderColor:'var(--block-pistachio)', borderStyle:'solid', borderWidth:0,
                borderTopWidth: c.startsWith('t') ? 3 : 0,
                borderBottomWidth: c.startsWith('b') ? 3 : 0,
                borderLeftWidth: c.endsWith('l') ? 3 : 0,
                borderRightWidth: c.endsWith('r') ? 3 : 0,
                top: c.startsWith('t') ? -2 : 'auto',
                bottom: c.startsWith('b') ? -2 : 'auto',
                left: c.endsWith('l') ? -2 : 'auto',
                right: c.endsWith('r') ? -2 : 'auto',
              }}/>
            ))}
            <div style={{
              position:'absolute', inset:'45% 8% auto 8%', height:2,
              background:'var(--block-pistachio)', boxShadow:'0 0 16px var(--block-pistachio)',
              animation:'pulse 1.6s ease-in-out infinite',
            }}/>
          </div>

          <div style={{ position:'absolute', left:0, right:0, bottom:80, textAlign:'center', color:'rgba(250,245,235,0.7)' }}>
            <Pill variant="on-dark" size="sm" onClick={()=>setStep('review')}>
              Simular: 7 itens detectados →
            </Pill>
          </div>

          <div style={{ position:'absolute', left:0, right:0, bottom:30, textAlign:'center' }}>
            <button onClick={()=>setStep('review')} className="caption on-dark" style={{ background:0, border:0, color:'rgba(250,245,235,0.65)', cursor:'pointer' }}>
              ESCREVER CÓDIGO MANUALMENTE
            </button>
          </div>
        </div>
      </Phone>
    );
  }

  // Review
  return (
    <Phone>
      <div style={{ paddingBottom:120, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'14px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={()=>setStep('scan')}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Revisar importação</div>
          <IconBtn variant="hairline"><I.Edit size={18}/></IconBtn>
        </div>

        <div style={{ padding:'10px 18px 12px' }}>
          <Eyebrow>· nota detectada ·</Eyebrow>
          <h1 className="display-lg" style={{ margin:'8px 0 6px' }}>
            {sel} itens<br/>para <i>adicionar.</i>
          </h1>
          <div className="body-sm" style={{ color:'var(--muted)' }}>
            Supermercado Aurora · 23 mai 2026 · R$ 87,40
          </div>
        </div>

        {/* Sticker — validity confidence */}
        <div style={{ padding:'4px 18px 10px' }}>
          <div className="block pistachio" style={{ padding:'12px 14px' }}>
            <div className="row gap-10" style={{ alignItems:'center' }}>
              <I.Sparkle size={18}/>
              <div className="body-sm" style={{ fontSize:12.5, flex:1 }}>
                Validades estimadas pela categoria. Confira itens marcados como <Chip tone="soon">verificar</Chip>
              </div>
            </div>
          </div>
        </div>

        {/* Items list */}
        <div className="col gap-8" style={{ padding:'8px 18px 0' }}>
          {items.map((it,i)=>(
            <div key={i} className="row gap-12" style={{
              background:'var(--surface)', padding:'12px 14px', borderRadius:18,
              boxShadow: it.selected ? 'inset 0 0 0 1.5px var(--ink)' : 'inset 0 0 0 1px var(--hairline)',
              alignItems:'center', opacity: it.selected?1:0.55,
            }}>
              <Photo src={it.photo} size={46} radius="md" color={D4.catColor(it.cat)}/>
              <div className="col grow gap-2" style={{ minWidth:0 }}>
                <div className="title" style={{ fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{it.name}</div>
                <div className="row gap-6" style={{ color:'var(--muted)', fontSize:11, alignItems:'center', flexWrap:'wrap' }}>
                  <span>{it.qty}</span>
                  <span>·</span>
                  <span>{it.cat}</span>
                </div>
                <div className="row gap-6">
                  <Chip tone={it.validity==='—' ? 'neutral' : it.validity.includes('mes') || it.validity.includes('25') ? 'safe' : 'soon'}>
                    {it.validity==='—' ? 'não perecível' : `~${it.validity}`}
                  </Chip>
                  {it.cat==='Limpeza' && <Chip tone="neutral">não comestível</Chip>}
                </div>
              </div>
              <button onClick={()=>setItems(items.map((x,j)=>j===i?{...x,selected:!x.selected}:x))} style={{
                width:30, height:30, borderRadius:999, border:0, cursor:'pointer',
                background: it.selected ? 'var(--ink)' : 'var(--surface)',
                color: it.selected ? 'var(--canvas)' : 'transparent',
                boxShadow: it.selected ? 'none' : 'inset 0 0 0 1.5px var(--hairline)',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}><I.Check size={14}/></button>
            </div>
          ))}
        </div>

        <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'16px 18px 18px',
          background:'linear-gradient(180deg, rgba(250,245,235,0) 0%, var(--canvas) 30%)' }}>
          <Pill variant="primary" block size="lg" trailing={<I.Check size={18}/>} onClick={onClose}>
            Adicionar {sel} itens à despensa
          </Pill>
        </div>
      </div>
    </Phone>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 8. MEAL PLANNER — calendário semanal
// ════════════════════════════════════════════════════════════════════════════
function ScreenMealPlanner({ onClose }) {
  const week = [
    { d:'SEG', n:19, plans:[{ m:'Almoço', r:D4.RECIPES[0], urgent:true }, { m:'Jantar', r:D4.RECIPES[4] }] },
    { d:'TER', n:20, plans:[{ m:'Almoço', r:D4.RECIPES[3] }] },
    { d:'QUA', n:21, plans:[{ m:'Jantar', r:D4.RECIPES[1], urgent:true }] },
    { d:'QUI', n:22, plans:[] },
    { d:'SEX', n:23, plans:[{ m:'Almoço', r:D4.RECIPES[5] }] },
    { d:'SÁB', n:24, plans:[{ m:'Brunch', r:D4.RECIPES[2] }] },
    { d:'DOM', n:25, plans:[] },
  ];
  const [day, setDay] = useState(2); // QUA selected
  const sel = week[day];

  return (
    <Phone>
      <div style={{ paddingBottom:96, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'14px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={onClose}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Semana 19–25 mai</div>
          <IconBtn variant="hairline"><I.Sparkle size={18}/></IconBtn>
        </div>

        <div style={{ padding:'10px 18px 14px' }}>
          <Eyebrow>Planejador</Eyebrow>
          <h1 className="display-lg" style={{ margin:'8px 0 12px' }}>
            O que vamos<br/><i>cozinhar?</i>
          </h1>
        </div>

        {/* Week strip */}
        <div style={{ display:'flex', gap:6, overflowX:'auto', padding:'0 18px 14px' }}>
          {week.map((w,i)=>(
            <button key={i} onClick={()=>setDay(i)} style={{
              flexShrink:0, width:48, padding:'8px 0 10px', borderRadius:14, border:0, cursor:'pointer',
              background: day===i ? 'var(--ink)' : 'var(--surface)',
              color: day===i ? 'var(--canvas)' : 'var(--ink)',
              boxShadow: day===i ? 'none' : 'inset 0 0 0 1px var(--hairline)',
              display:'flex', flexDirection:'column', alignItems:'center', gap:4, position:'relative',
            }}>
              <span className="caption" style={{ fontSize:9, color: day===i ? 'rgba(250,245,235,0.65)' : 'var(--muted)' }}>{w.d}</span>
              <span className="display italic" style={{ fontSize:20, lineHeight:1 }}>{w.n}</span>
              {w.plans.length>0 && (
                <div className="row gap-2" style={{ marginTop:2 }}>
                  {w.plans.map((p,j)=>(
                    <div key={j} style={{ width:4, height:4, borderRadius:999,
                      background: day===i ? 'var(--block-peach)' : p.urgent ? 'var(--urgent)' : 'var(--ink)' }}/>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Selected day */}
        <div className="row between" style={{ padding:'4px 22px 10px', alignItems:'flex-end' }}>
          <div className="col gap-4">
            <Eyebrow>Quarta · 21 mai</Eyebrow>
            <div className="display-sm" style={{ margin:0 }}>{sel.plans.length} refeição planejada</div>
          </div>
          <button className="pill pill-primary pill-sm" leading={<I.Plus size={14}/>}>Adicionar</button>
        </div>

        {/* Plans */}
        <div className="col gap-10" style={{ padding:'0 18px 14px' }}>
          {sel.plans.length===0 ? (
            <div style={{ background:'var(--surface)', borderRadius:18, padding:'24px 16px', boxShadow:'inset 0 0 0 1px var(--hairline)', textAlign:'center' }}>
              <div style={{ fontSize:30 }}>🍽️</div>
              <div className="title" style={{ fontSize:14, marginTop:8 }}>Nada planejado</div>
              <div className="body-sm" style={{ color:'var(--muted)', fontSize:12, marginTop:4 }}>Arraste uma receita das sugestões abaixo</div>
            </div>
          ) : sel.plans.map((p,i)=>(
            <div key={i} className="row gap-12" style={{
              background:'var(--surface)', borderRadius:18, padding:12,
              boxShadow:'inset 0 0 0 1px var(--hairline)', alignItems:'center',
            }}>
              <PhotoBox src={p.r.photo} width={68} height={68} radius={12}/>
              <div className="col grow gap-4" style={{ minWidth:0 }}>
                <div className="caption" style={{ fontSize:9.5 }}>{p.m}</div>
                <div className="title" style={{ fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.r.title}</div>
                <div className="row gap-8">
                  <Chip tone={p.r.missing.length===0?'safe':'soon'}>
                    {p.r.missing.length===0 ? 'Tem tudo' : `Falta ${p.r.missing.length}`}
                  </Chip>
                  {p.urgent && <Chip tone="urgent" withDot>usa item em alerta</Chip>}
                </div>
              </div>
              <I.More size={16}/>
            </div>
          ))}
        </div>

        {/* Suggestions strip */}
        <div className="row between" style={{ padding:'10px 22px 8px', alignItems:'flex-end' }}>
          <div className="col gap-4">
            <Eyebrow>Sugestões inteligentes</Eyebrow>
            <div className="display-sm" style={{ margin:0 }}>Usa o que vence</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, overflowX:'auto', padding:'0 18px 16px' }}>
          {D4.RECIPES.slice(0,4).map(r=>(
            <div key={r.id} style={{
              flexShrink:0, width:160, background:'var(--surface)', borderRadius:18,
              boxShadow:'inset 0 0 0 1px var(--hairline)', overflow:'hidden',
            }}>
              <PhotoBox src={r.photo} height={90} radius={0}>
                <div style={{ position:'absolute', top:8, left:8 }}>
                  <Sticker style={{ background:'var(--canvas)', color:'var(--ink)', padding:'4px 8px', fontSize:9 }}>
                    {r.have}/{r.total}
                  </Sticker>
                </div>
              </PhotoBox>
              <div className="col gap-4" style={{ padding:'10px 12px 12px' }}>
                <div className="title" style={{ fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.title}</div>
                <div className="caption" style={{ fontSize:9 }}>{r.duration} MIN · {r.level}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Generated shopping link */}
        <div style={{ padding:'0 18px 18px' }}>
          <div className="block charcoal" style={{ padding:'16px 16px' }}>
            <div className="row between" style={{ alignItems:'center' }}>
              <div className="col gap-2">
                <Eyebrow dark>· lista gerada ·</Eyebrow>
                <div className="title" style={{ color:'var(--canvas)', fontSize:14 }}>5 itens para o plano da semana</div>
              </div>
              <span className="pill pill-on-dark pill-sm" style={{ background:'var(--canvas)', color:'var(--ink)' }}>Ver →</span>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 9. SEARCH — global search
// ════════════════════════════════════════════════════════════════════════════
function ScreenSearch({ onClose }) {
  const [q, setQ] = useState('tom');
  const allItems = D4.FOOD_ITEMS.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
  const allRecipes = D4.RECIPES.filter(r => r.title.toLowerCase().includes(q.toLowerCase()) || r.ingredients.some(ing => ing.name.toLowerCase().includes(q.toLowerCase())));
  const allShop = D4.SHOPPING_ITEMS.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));

  const recent = ['Tomate', 'Iogurte', 'Manjericão', 'Pão'];

  return (
    <Phone>
      <div style={{ paddingBottom:40, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'12px 18px 10px', alignItems:'center', gap:10 }}>
          <IconBtn variant="hairline" onClick={onClose}><I.ArrowLeft size={18}/></IconBtn>
          <div style={{ flex:1, position:'relative' }}>
            <input className="input" placeholder="Buscar item, receita ou ingrediente"
              value={q} onChange={e=>setQ(e.target.value)}
              style={{ paddingLeft:42, paddingRight:42 }}/>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}><I.Search size={16}/></span>
            {q && <button onClick={()=>setQ('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', border:0, background:0, color:'var(--muted)', cursor:'pointer' }}><I.Close size={16}/></button>}
          </div>
        </div>

        {!q ? (
          <div className="col gap-18" style={{ padding:'10px 18px' }}>
            <div>
              <Eyebrow>Buscas recentes</Eyebrow>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:10 }}>
                {recent.map(r=>(
                  <button key={r} onClick={()=>setQ(r.toLowerCase())} style={{
                    height:34, padding:'0 12px', borderRadius:999, border:0, cursor:'pointer',
                    background:'var(--surface)', boxShadow:'inset 0 0 0 1px var(--hairline)',
                    display:'inline-flex', alignItems:'center', gap:6,
                    fontFamily:'var(--font-sans)', fontSize:12.5,
                  }}><I.Clock size={12}/> {r}</button>
                ))}
              </div>
            </div>
            <div>
              <Eyebrow>Atalhos</Eyebrow>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10 }}>
                <ShortcutTile icon={<I.Flame size={18}/>}  title="Em alerta"   sub="3 itens" />
                <ShortcutTile icon={<I.Chef size={18}/>}   title="Receitas rápidas" sub="≤ 15 min" />
                <ShortcutTile icon={<I.Heart size={18}/>}  title="Favoritas"   sub="8 salvas" />
                <ShortcutTile icon={<I.Leaf size={18}/>}   title="Vegetarianas" sub="filtro" />
              </div>
            </div>
          </div>
        ) : (
          <div className="col gap-16" style={{ padding:'4px 18px' }}>
            <div className="caption">{allItems.length + allRecipes.length + allShop.length} resultados para "{q}"</div>

            {/* Inventário */}
            {allItems.length>0 && (
              <div className="col gap-8">
                <div className="row between" style={{ alignItems:'flex-end' }}>
                  <Eyebrow>Despensa · {allItems.length}</Eyebrow>
                  <span className="caption">VER TODOS</span>
                </div>
                {allItems.slice(0,3).map(item => <FoodRow key={item.id} item={item}/>)}
              </div>
            )}

            {/* Receitas */}
            {allRecipes.length>0 && (
              <div className="col gap-8">
                <Eyebrow>Receitas · {allRecipes.length}</Eyebrow>
                {allRecipes.slice(0,2).map(r=>(
                  <div key={r.id} className="row gap-12" style={{ background:'var(--surface)', borderRadius:18, padding:12, boxShadow:'inset 0 0 0 1px var(--hairline)' }}>
                    <PhotoBox src={r.photo} width={64} height={64} radius={12}/>
                    <div className="col grow gap-4" style={{ minWidth:0 }}>
                      <div className="title" style={{ fontSize:14 }}>{r.title}</div>
                      <div className="body-sm" style={{ color:'var(--muted)', fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Compras */}
            {allShop.length>0 && (
              <div className="col gap-8">
                <Eyebrow>Lista de compras · {allShop.length}</Eyebrow>
                {allShop.slice(0,2).map(s=>(
                  <div key={s.id} className="row gap-12" style={{ background:'var(--surface)', borderRadius:14, padding:'10px 12px', boxShadow:'inset 0 0 0 1px var(--hairline)' }}>
                    <I.Cart size={16}/>
                    <span className="title" style={{ fontSize:13, flex:1 }}>{s.name}</span>
                    <span className="caption" style={{ fontSize:9 }}>{s.qty} {s.unit}</span>
                  </div>
                ))}
              </div>
            )}

            {allItems.length===0 && allRecipes.length===0 && allShop.length===0 && (
              <div style={{ textAlign:'center', padding:'40px 20px' }}>
                <div style={{ fontSize:36 }}>🔍</div>
                <div className="title" style={{ fontSize:14, marginTop:10 }}>Nada por aqui</div>
                <div className="body-sm" style={{ color:'var(--muted)', fontSize:12 }}>Tente outro termo ou adicione um novo item</div>
              </div>
            )}
          </div>
        )}
      </div>
    </Phone>
  );
}
function ShortcutTile({ icon, title, sub }) {
  return (
    <button style={{
      background:'var(--surface)', borderRadius:16, padding:'14px 14px',
      boxShadow:'inset 0 0 0 1px var(--hairline)', border:0, cursor:'pointer',
      textAlign:'left', display:'flex', alignItems:'flex-start', gap:10,
    }}>
      <div style={{ width:34, height:34, borderRadius:10, background:'var(--block-pistachio)', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {icon}
      </div>
      <div className="col gap-2">
        <div className="title" style={{ fontSize:13 }}>{title}</div>
        <div className="caption" style={{ fontSize:9 }}>{sub}</div>
      </div>
    </button>
  );
}

Object.assign(window, {
  ScreenAlertSettings, ScreenHouseholdProfile, ScreenNFeImport, ScreenMealPlanner, ScreenSearch,
});
