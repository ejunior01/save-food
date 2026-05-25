/* global React, DC_UI, DC_DATA */
// ────────────────────────────────────────────────────────────────────────────
// DespensaCerta — Screens (Part 3)
// ConsumeDiscard · Insights · Household · Replenishment
// ────────────────────────────────────────────────────────────────────────────

const { useState, useMemo } = React;
const U3 = window.DC_UI;
const D3 = window.DC_DATA;
const { I, Pill, IconBtn, Eyebrow, Chip, ExpiryChip, Photo, PhotoBox,
        Sticker, Stepper, FoodRow, FoodTile, SectionHead, Phone } = U3;

// ════════════════════════════════════════════════════════════════════════════
// 1. CONSUME / DISCARD — what happened to this item?
// ════════════════════════════════════════════════════════════════════════════
function ScreenConsumeDiscard({ onClose, item: itemProp }) {
  const item = itemProp || D3.FOOD_ITEMS[0];
  const [amount, setAmount] = useState(75); // % consumed
  const [reason, setReason] = useState('all');
  const [reposicao, setReposicao] = useState(true);

  const isWaste = reason==='spoiled' || reason==='expired';
  const reasons = [
    { id:'all',     label:'Consumi tudo',  tone:'safe',   icon:<I.Check size={14}/> },
    { id:'partial', label:'Sobrou um pouco', tone:'soon', icon:<I.Sparkle size={14}/> },
    { id:'expired', label:'Vencido',       tone:'danger', icon:<I.Trash size={14}/> },
    { id:'spoiled', label:'Estragou',      tone:'danger', icon:<I.Flame size={14}/> },
    { id:'donate',  label:'Doei',          tone:'ink',    icon:<I.Heart size={14}/> },
  ];

  return (
    <Phone>
      <div className="col" style={{ minHeight:'100%', background:'var(--canvas)', paddingBottom:120 }}>
        {/* Header */}
        <div className="row between" style={{ padding:'14px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={onClose}><I.Close size={18}/></IconBtn>
          <div className="caption">Atualizar item</div>
          <div style={{ width:40 }}/>
        </div>

        {/* Hero card */}
        <div style={{ padding:'8px 18px 14px' }}>
          <div style={{ background:'var(--surface)', borderRadius:24, padding:18, boxShadow:'inset 0 0 0 1px var(--hairline)' }}>
            <div className="row gap-14" style={{ alignItems:'center' }}>
              <Photo src={item.photo} size={80} radius="md" color={D3.catColor(item.category)} />
              <div className="col grow gap-4">
                <Eyebrow>{item.category}</Eyebrow>
                <div className="display-md" style={{ margin:0 }}>{item.name}</div>
                <div className="row gap-8">
                  <ExpiryChip date={item.expiresAt}/>
                  <span style={{ fontSize:12, color:'var(--muted)' }}>{item.qty} {item.unit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amount slider */}
        <div style={{ padding:'4px 22px 18px' }}>
          <Eyebrow>Quanto você usou?</Eyebrow>
          <div className="row between" style={{ alignItems:'baseline', margin:'8px 0 6px' }}>
            <div className="display italic" style={{ fontSize:56 }}>{amount}<span style={{ fontSize:24, color:'var(--muted)' }}>%</span></div>
            <div className="caption">{Math.round(item.qty * amount/100)} {item.unit} de {item.qty}</div>
          </div>

          <input type="range" min={0} max={100} step={5} value={amount} onChange={e=>setAmount(+e.target.value)} style={{
            width:'100%', accentColor:'var(--ink)', height:32,
          }}/>
          <div className="row gap-8" style={{ marginTop:6 }}>
            {[25,50,75,100].map(v => (
              <button key={v} onClick={()=>setAmount(v)} style={{
                flex:1, height:34, borderRadius:999, border:0, cursor:'pointer',
                background: amount===v ? 'var(--ink)' : 'var(--surface)',
                color: amount===v ? 'var(--canvas)' : 'var(--ink)',
                boxShadow: amount===v ? 'none' : 'inset 0 0 0 1px var(--hairline)',
                fontFamily:'var(--font-sans)', fontSize:12.5, fontWeight:500,
              }}>{v}%</button>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div style={{ padding:'4px 22px 14px' }}>
          <Eyebrow>O que aconteceu?</Eyebrow>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10 }}>
            {reasons.map(r => (
              <button key={r.id} onClick={()=>setReason(r.id)} style={{
                height:42, padding:'0 14px', borderRadius:999, border:0, cursor:'pointer',
                background: reason===r.id ? 'var(--ink)' : 'var(--surface)',
                color: reason===r.id ? 'var(--canvas)' : 'var(--ink)',
                boxShadow: reason===r.id ? 'none' : 'inset 0 0 0 1px var(--hairline)',
                display:'inline-flex', alignItems:'center', gap:6,
                fontFamily:'var(--font-sans)', fontSize:13, fontWeight:500,
              }}>
                {r.icon} {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Consequence block */}
        <div style={{ padding:'4px 18px 14px' }}>
          {isWaste ? (
            <div className="block rose" style={{ padding:'18px 18px' }}>
              <Eyebrow>· o que isso significa ·</Eyebrow>
              <h3 className="display-md" style={{ margin:'8px 0 6px' }}>
                Cerca de <i>R$ 4,80</i><br/>foram para o lixo.
              </h3>
              <p className="body-sm" style={{ color:'var(--ink-2)', margin:0 }}>
                Vamos ajustar seus alertas para te avisar antes da próxima vez.
              </p>
            </div>
          ) : reason==='donate' ? (
            <div className="block pistachio" style={{ padding:'18px 18px' }}>
              <Eyebrow>· obrigado ·</Eyebrow>
              <h3 className="display-md" style={{ margin:'8px 0 6px' }}>
                Você <i>doou</i><br/>antes de vencer.
              </h3>
              <p className="body-sm" style={{ color:'var(--ink-2)', margin:0 }}>
                Quer registrar para qual instituição? Aparece no seu histórico de impacto.
              </p>
            </div>
          ) : (
            <div className="block pistachio" style={{ padding:'18px 18px' }}>
              <Eyebrow>· bem feito ·</Eyebrow>
              <h3 className="display-md" style={{ margin:'8px 0 6px' }}>
                Você salvou cerca de<br/><i>R$ 4,80</i> de desperdício.
              </h3>
              <p className="body-sm" style={{ color:'var(--ink-2)', margin:0 }}>
                Conta para o seu balanço de maio.
              </p>
            </div>
          )}
        </div>

        {/* Replenishment toggle */}
        <div style={{ padding:'0 18px 14px' }}>
          <div className="row between" style={{
            background:'var(--surface)', borderRadius:18, padding:'14px 16px',
            boxShadow:'inset 0 0 0 1px var(--hairline)',
          }}>
            <div className="col gap-2 grow">
              <div className="title" style={{ fontSize:14 }}>Adicionar à lista de compras</div>
              <div className="body-sm" style={{ color:'var(--muted)', fontSize:12 }}>
                Você compra esse item a cada ~6 dias
              </div>
            </div>
            <button onClick={()=>setReposicao(!reposicao)} style={{
              width:46, height:28, borderRadius:999, border:0, cursor:'pointer',
              background: reposicao ? 'var(--ink)' : 'var(--hairline)',
              position:'relative', transition:'background .15s',
            }}>
              <span style={{
                position:'absolute', top:3, left: reposicao ? 22 : 3,
                width:22, height:22, borderRadius:999, background:'var(--canvas)',
                transition:'left .15s',
              }}/>
            </button>
          </div>
        </div>

        {/* CTA */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'16px 18px 18px',
          background:'linear-gradient(180deg, rgba(250,245,235,0) 0%, var(--canvas) 30%)' }}>
          <Pill variant="primary" block size="lg" trailing={<I.Check size={18}/>} onClick={onClose}>
            Confirmar
          </Pill>
        </div>
      </div>
    </Phone>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. INSIGHTS — waste/impact dashboard
// ════════════════════════════════════════════════════════════════════════════
function ScreenInsights({ onTab }) {
  // Synthetic monthly data
  const months = [
    { m:'Dez', saved:6.2, wasted:3.1 },
    { m:'Jan', saved:8.4, wasted:2.6 },
    { m:'Fev', saved:9.1, wasted:2.0 },
    { m:'Mar', saved:7.8, wasted:2.8 },
    { m:'Abr', saved:10.5, wasted:1.9 },
    { m:'Mai', saved:12.3, wasted:1.5 },
  ];
  const max = Math.max(...months.flatMap(m=>[m.saved+m.wasted]));
  const current = months[months.length-1];
  const rate = Math.round(current.saved/(current.saved+current.wasted)*100);

  const topCats = [
    { name:'Vegetais',   value:0.6, color:'var(--block-sage)' },
    { name:'Laticínios', value:0.45, color:'var(--block-cream)' },
    { name:'Frutas',     value:0.3, color:'var(--block-peach)' },
    { name:'Padaria',    value:0.2, color:'#E8D2A8' },
  ];

  const achievements = [
    { emoji:'🌿', title:'30 dias sem desperdiçar', tone:'safe' },
    { emoji:'🥬', title:'5 receitas com alerta', tone:'soon' },
    { emoji:'📦', title:'Despensa 100% catalogada', tone:'ink' },
  ];

  return (
    <Phone>
      <div style={{ paddingBottom:96, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'14px 18px 4px' }}>
          <IconBtn variant="hairline" onClick={()=>onTab && onTab('home')}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Maio · 2026</div>
          <IconBtn variant="hairline"><I.Calendar size={18}/></IconBtn>
        </div>

        {/* Hero */}
        <div style={{ padding:'10px 18px 14px' }}>
          <Eyebrow>Seu impacto</Eyebrow>
          <h1 className="display-xl" style={{ margin:'8px 0 8px', fontSize:48, lineHeight:0.95 }}>
            Em maio,<br/>você <i style={{ color:'var(--primary)' }}>salvou</i><br/>{current.saved} kg.
          </h1>
          <p className="body" style={{ color:'var(--muted)', fontSize:14 }}>
            ≈ R$ 64,80 economizados · {rate}% de aproveitamento da sua despensa
          </p>
        </div>

        {/* Stats grid */}
        <div style={{ padding:'0 18px 14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <StatTile big={`${rate}%`} label="Aproveitamento" sub="meta 90%" accent="var(--safe)" />
          <StatTile big={`${current.saved}kg`} label="Consumidos" sub="+17% vs abril" accent="var(--ink)" />
          <StatTile big={`${current.wasted}kg`} label="Descartados" sub="-21% vs abril" accent="var(--danger)" />
          <StatTile big="R$ 64" label="Economia" sub="estimativa" accent="var(--primary)" />
        </div>

        {/* Monthly chart */}
        <div style={{ padding:'4px 18px 14px' }}>
          <div className="block charcoal" style={{ padding:'18px 18px' }}>
            <div className="row between" style={{ alignItems:'flex-end', marginBottom:14 }}>
              <div>
                <Eyebrow dark>histórico · 6 meses</Eyebrow>
                <h2 className="display-sm" style={{ color:'var(--canvas)', margin:'6px 0 0' }}>
                  Tendência de <i>aproveitamento</i>
                </h2>
              </div>
              <div className="row gap-12" style={{ color:'rgba(250,245,235,0.65)', fontSize:11 }}>
                <span className="row gap-4"><span style={{ width:8, height:8, borderRadius:2, background:'var(--block-pistachio)' }}/> Salvos</span>
                <span className="row gap-4"><span style={{ width:8, height:8, borderRadius:2, background:'var(--block-peach)' }}/> Perdidos</span>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:14, height:140, justifyContent:'space-between' }}>
              {months.map(m => (
                <div key={m.m} className="col gap-6" style={{ alignItems:'center', flex:1 }}>
                  <div className="col" style={{ height:120, width:'100%', justifyContent:'flex-end', gap:2 }}>
                    <div style={{ height:(m.wasted/max)*120, background:'var(--block-peach)', borderRadius:'4px 4px 0 0' }}/>
                    <div style={{ height:(m.saved/max)*120, background:'var(--block-pistachio)', borderRadius:0 }}/>
                  </div>
                  <div className="caption" style={{ color:'rgba(250,245,235,0.7)', fontSize:9 }}>{m.m}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top categorias */}
        <div style={{ padding:'4px 18px 14px' }}>
          <Eyebrow>Onde estão suas perdas</Eyebrow>
          <h3 className="display-sm" style={{ margin:'6px 0 12px' }}>Top categorias que vencem</h3>
          <div className="col gap-10">
            {topCats.map(c=>(
              <div key={c.name} className="col gap-4">
                <div className="row between">
                  <span className="title" style={{ fontSize:13 }}>{D3.catEmoji(c.name)} {c.name}</span>
                  <span className="caption" style={{ fontSize:10 }}>{Math.round(c.value*100)}% das perdas</span>
                </div>
                <div style={{ height:8, background:'var(--surface)', borderRadius:999, boxShadow:'inset 0 0 0 1px var(--hairline)', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${c.value*100}%`, background: c.color, borderRadius:999 }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div style={{ padding:'4px 18px 18px' }}>
          <Eyebrow>Conquistas</Eyebrow>
          <h3 className="display-sm" style={{ margin:'6px 0 12px' }}>O que você desbloqueou</h3>
          <div style={{ display:'flex', gap:10, overflowX:'auto' }}>
            {achievements.map((a,i)=>(
              <div key={i} style={{
                flexShrink:0, width:160, padding:'14px 14px 16px',
                background:'var(--surface)', borderRadius:18,
                boxShadow:'inset 0 0 0 1px var(--hairline)',
              }}>
                <div style={{ fontSize:30, marginBottom:8 }}>{a.emoji}</div>
                <div className="title" style={{ fontSize:13 }}>{a.title}</div>
                <div className="caption" style={{ fontSize:9, marginTop:4 }}>· desbloqueado ·</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}

function StatTile({ big, label, sub, accent }) {
  return (
    <div style={{ background:'var(--surface)', borderRadius:18, padding:'14px 14px 16px', boxShadow:'inset 0 0 0 1px var(--hairline)' }}>
      <div className="row gap-6" style={{ alignItems:'center', marginBottom:6 }}>
        <div style={{ width:8, height:8, borderRadius:999, background: accent }}/>
        <div className="caption" style={{ fontSize:9.5 }}>{label}</div>
      </div>
      <div className="display italic" style={{ fontSize:32, color:'var(--ink)' }}>{big}</div>
      <div className="body-sm" style={{ color:'var(--muted)', marginTop:2, fontSize:11 }}>{sub}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. HOUSEHOLD — shared home
// ════════════════════════════════════════════════════════════════════════════
function ScreenHousehold({ onTab }) {
  const members = [
    { id:'m1', name:'Marina',   role:'Admin',     items:8, avatar:D3.PHOTO.avatar, color:'var(--block-pistachio)' },
    { id:'m2', name:'Pedro',    role:'Membro',    items:5, avatar:null,           color:'var(--block-peach)' },
    { id:'m3', name:'Luiza',    role:'Convidada', items:2, avatar:null,           color:'var(--block-rose)' },
  ];
  const activity = [
    { who:'Pedro',  what:'adicionou',       item:'Iogurte natural', when:'há 12 min', icon:<I.Plus size={12}/>,  tone:'safe' },
    { who:'Marina', what:'marcou consumido', item:'Leite integral',  when:'há 2h',     icon:<I.Check size={12}/>, tone:'ink' },
    { who:'Pedro',  what:'descartou',       item:'Alface (vencido)',when:'há 5h',     icon:<I.Trash size={12}/>, tone:'danger' },
    { who:'Luiza',  what:'comprou da lista', item:'Manjericão fresco',when:'ontem',    icon:<I.Cart size={12}/>,  tone:'soon' },
    { who:'Marina', what:'cozinhou',        item:'Bruschetta de tomate', when:'ontem',icon:<I.Chef size={12}/>,  tone:'ink' },
  ];

  return (
    <Phone>
      <div style={{ paddingBottom:96, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'14px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={()=>onTab && onTab('home')}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Casa compartilhada</div>
          <IconBtn variant="hairline"><I.Settings size={18}/></IconBtn>
        </div>

        {/* Hero */}
        <div style={{ padding:'10px 18px 14px' }}>
          <Eyebrow>Nossa casa</Eyebrow>
          <h1 className="display-lg" style={{ margin:'6px 0 14px' }}>
            Casa dos<br/><i>Pires</i>
          </h1>
          {/* Avatars stack */}
          <div className="row between" style={{ alignItems:'center' }}>
            <div className="row" style={{ marginLeft:0 }}>
              {members.map((m,i)=>(
                <div key={m.id} style={{
                  width:48, height:48, borderRadius:999,
                  background: m.avatar ? `url("${m.avatar}") center/cover` : m.color,
                  marginLeft: i===0 ? 0 : -12,
                  border:'3px solid var(--canvas)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'var(--ink)', fontFamily:'var(--font-display)', fontSize:18, fontStyle:'italic',
                }}>
                  {!m.avatar && m.name[0]}
                </div>
              ))}
              <div style={{
                width:48, height:48, borderRadius:999, marginLeft:-12,
                background:'var(--ink)', color:'var(--canvas)',
                border:'3px solid var(--canvas)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}><I.Plus size={20}/></div>
            </div>
            <div className="caption">3 pessoas</div>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ padding:'0 18px 14px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          <MiniHCard n="18" label="itens" />
          <MiniHCard n="5" label="receitas salvas" />
          <MiniHCard n="12.3kg" label="salvos em maio" tone="safe" />
        </div>

        {/* Membros */}
        <div className="row between" style={{ padding:'4px 18px 8px', alignItems:'flex-end' }}>
          <div className="col gap-4">
            <Eyebrow>Quem mora aqui</Eyebrow>
            <div className="display-sm" style={{ margin:0 }}>3 membros</div>
          </div>
          <button className="pill pill-secondary pill-sm" leading={<I.Plus size={14}/>}>Convidar</button>
        </div>
        <div className="col gap-8" style={{ padding:'0 18px 14px' }}>
          {members.map(m=>(
            <div key={m.id} className="row gap-14" style={{
              background:'var(--surface)', padding:'12px 14px', borderRadius:18,
              boxShadow:'inset 0 0 0 1px var(--hairline)', alignItems:'center',
            }}>
              <div style={{
                width:46, height:46, borderRadius:999,
                background: m.avatar ? `url("${m.avatar}") center/cover` : m.color,
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'var(--ink)', fontFamily:'var(--font-display)', fontSize:20, fontStyle:'italic',
              }}>{!m.avatar && m.name[0]}</div>
              <div className="col grow gap-2">
                <div className="title" style={{ fontSize:14 }}>{m.name}</div>
                <div className="body-sm" style={{ color:'var(--muted)', fontSize:12 }}>{m.role} · {m.items} itens cadastrados</div>
              </div>
              <I.More size={16} />
            </div>
          ))}
        </div>

        {/* Atividade */}
        <div className="col gap-10" style={{ padding:'4px 18px 18px' }}>
          <div className="row between" style={{ alignItems:'flex-end' }}>
            <div className="col gap-4">
              <Eyebrow>Atividade recente</Eyebrow>
              <div className="display-sm" style={{ margin:0 }}>O que rolou hoje</div>
            </div>
            <span className="caption">VER TUDO →</span>
          </div>
          <div className="col">
            {activity.map((a,i)=>(
              <div key={i} className="row gap-12" style={{ padding:'10px 0', borderBottom: i<activity.length-1 ? '1px solid var(--hairline-soft)' : 'none', alignItems:'center' }}>
                <div style={{
                  width:32, height:32, borderRadius:999,
                  background: a.tone==='danger'?'var(--danger-soft)' : a.tone==='safe'?'var(--safe-soft)' : a.tone==='soon'?'var(--soon-soft)' : 'var(--surface-soft)',
                  color: a.tone==='danger'?'var(--danger)' : a.tone==='safe'?'var(--safe)' : a.tone==='soon'?'#8a6f10' : 'var(--ink)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0,
                }}>{a.icon}</div>
                <div className="col grow gap-2">
                  <div className="body-sm" style={{ fontSize:13 }}>
                    <b>{a.who}</b> {a.what} <i style={{ fontFamily:'var(--font-display)' }}>{a.item}</i>
                  </div>
                  <div className="caption" style={{ fontSize:9.5 }}>{a.when}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}

function MiniHCard({ n, label, tone='ink' }) {
  return (
    <div style={{ background:'var(--surface)', borderRadius:14, padding:'12px 12px', boxShadow:'inset 0 0 0 1px var(--hairline)' }}>
      <div className="display italic" style={{ fontSize:24, color: tone==='safe'?'var(--safe)':'var(--ink)' }}>{n}</div>
      <div className="caption" style={{ fontSize:9 }}>{label}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. REPLENISHMENT — itens que acabaram (smart shopping)
// ════════════════════════════════════════════════════════════════════════════
function ScreenReplenishment({ onTab, onClose }) {
  const items = [
    { id:'r1', name:'Leite integral',    cat:'Laticínios',  freq:6,  last:5,  photo:D3.PHOTO.milk,    sel:true },
    { id:'r2', name:'Iogurte natural',   cat:'Laticínios',  freq:7,  last:7,  photo:D3.PHOTO.yogurt,  sel:true },
    { id:'r3', name:'Pão francês',       cat:'Padaria',     freq:2,  last:2,  photo:D3.PHOTO.bread,   sel:true },
    { id:'r4', name:'Banana prata',      cat:'Frutas',      freq:9,  last:10, photo:D3.PHOTO.banana,  sel:false },
    { id:'r5', name:'Ovos caipira',      cat:'Proteínas',   freq:14, last:13, photo:D3.PHOTO.egg,     sel:false },
    { id:'r6', name:'Café em grão',      cat:'Mercearia',   freq:30, last:28, photo:'',               sel:false },
  ];
  const [state, setState] = useState(Object.fromEntries(items.map(i=>[i.id, i.sel])));
  const count = Object.values(state).filter(Boolean).length;
  const t = v => setState(s=>({ ...s, [v]: !s[v] }));

  return (
    <Phone>
      <div style={{ paddingBottom:120, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'14px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={onClose || (()=>onTab && onTab('shopping'))}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Reposição inteligente</div>
          <IconBtn variant="hairline"><I.Settings size={18}/></IconBtn>
        </div>

        {/* Hero */}
        <div style={{ padding:'10px 18px 16px' }}>
          <Eyebrow>· o que está acabando ·</Eyebrow>
          <h1 className="display-lg" style={{ margin:'8px 0 12px' }}>
            Hora de <i>repor.</i>
          </h1>
          <p className="body" style={{ color:'var(--muted)', fontSize:14, margin:0 }}>
            Itens que você compra com frequência e cujo prazo médio acabou. Marque os que entram na próxima lista.
          </p>
        </div>

        {/* Items */}
        <div className="col gap-10" style={{ padding:'0 18px' }}>
          {items.map(item => {
            const overdue = item.last >= item.freq;
            return (
              <div key={item.id} className="row gap-12" style={{
                background:'var(--surface)', padding:'12px 14px', borderRadius:18,
                boxShadow: state[item.id] ? 'inset 0 0 0 1.5px var(--ink)' : 'inset 0 0 0 1px var(--hairline)',
                alignItems:'center', transition:'box-shadow .15s',
              }}>
                <Photo src={item.photo} size={50} radius="md" color={D3.catColor(item.cat)}/>
                <div className="col grow gap-4" style={{ minWidth:0 }}>
                  <div className="title" style={{ fontSize:14 }}>{item.name}</div>
                  <div className="row gap-8" style={{ color:'var(--muted)', fontSize:11.5 }}>
                    <span>compra a cada {item.freq}d</span>
                    <span>·</span>
                    <span style={{ color: overdue ? 'var(--urgent)' : 'var(--muted)' }}>
                      {overdue ? `${item.last - item.freq}d atrasado` : `há ${item.last}d`}
                    </span>
                  </div>
                </div>
                <button onClick={()=>t(item.id)} style={{
                  width:32, height:32, borderRadius:999, border:0, cursor:'pointer',
                  background: state[item.id] ? 'var(--ink)' : 'var(--surface)',
                  color: state[item.id] ? 'var(--canvas)' : 'transparent',
                  boxShadow: state[item.id] ? 'none' : 'inset 0 0 0 1.5px var(--hairline)',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  <I.Check size={16}/>
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'16px 18px 18px',
          background:'linear-gradient(180deg, rgba(250,245,235,0) 0%, var(--canvas) 30%)' }}>
          <div className="row gap-10">
            <Pill variant="secondary" onClick={onClose || (()=>onTab && onTab('shopping'))}>Pular</Pill>
            <Pill variant="primary" block trailing={<I.Cart size={18}/>} onClick={onClose || (()=>onTab && onTab('shopping'))}>
              Adicionar {count} {count===1?'item':'itens'}
            </Pill>
          </div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  ScreenConsumeDiscard, ScreenInsights, ScreenHousehold, ScreenReplenishment,
});
