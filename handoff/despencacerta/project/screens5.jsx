/* global React, DC_UI, DC_DATA */
// ────────────────────────────────────────────────────────────────────────────
// DespensaCerta — Screens (Part 5)
// OnboardingInventory · Notifications · Donate · EmptyStatesShowcase
// ────────────────────────────────────────────────────────────────────────────

const { useState, useMemo } = React;
const U5 = window.DC_UI;
const D5 = window.DC_DATA;
const { I, Pill, IconBtn, Eyebrow, Chip, ExpiryChip, Photo, PhotoBox,
        Sticker, Phone } = U5;

// ════════════════════════════════════════════════════════════════════════════
// 10. ONBOARDING INVENTORY — popular despensa em 60s
// ════════════════════════════════════════════════════════════════════════════
function ScreenOnboardingInventory({ onClose }) {
  const common = [
    { id:'arroz', name:'Arroz',     emoji:'🍚', photo:D5.PHOTO.rice,    cat:'Grãos' },
    { id:'feijao',name:'Feijão',    emoji:'🫘', photo:'',               cat:'Grãos' },
    { id:'macar', name:'Macarrão',  emoji:'🍝', photo:D5.PHOTO.pasta,   cat:'Grãos' },
    { id:'oleo',  name:'Óleo',      emoji:'🫒', photo:D5.PHOTO.olive,   cat:'Mercearia' },
    { id:'sal',   name:'Sal',       emoji:'🧂', photo:'',               cat:'Mercearia' },
    { id:'acuc',  name:'Açúcar',    emoji:'🥄', photo:'',               cat:'Mercearia' },
    { id:'cafe',  name:'Café',      emoji:'☕️', photo:'',              cat:'Mercearia' },
    { id:'leite', name:'Leite',     emoji:'🥛', photo:D5.PHOTO.milk,    cat:'Laticínios' },
    { id:'ovos',  name:'Ovos',      emoji:'🥚', photo:D5.PHOTO.egg,     cat:'Proteínas' },
    { id:'pao',   name:'Pão',       emoji:'🍞', photo:D5.PHOTO.bread,   cat:'Padaria' },
    { id:'queij', name:'Queijo',    emoji:'🧀', photo:D5.PHOTO.cheese,  cat:'Laticínios' },
    { id:'banan', name:'Banana',    emoji:'🍌', photo:D5.PHOTO.banana,  cat:'Frutas' },
    { id:'maca',  name:'Maçã',      emoji:'🍎', photo:D5.PHOTO.apple,   cat:'Frutas' },
    { id:'tomat', name:'Tomate',    emoji:'🍅', photo:D5.PHOTO.tomato,  cat:'Vegetais' },
    { id:'cebol', name:'Cebola',    emoji:'🧅', photo:D5.PHOTO.onion,   cat:'Vegetais' },
    { id:'alho',  name:'Alho',      emoji:'🧄', photo:D5.PHOTO.garlic,  cat:'Vegetais' },
  ];
  const [picked, setPicked] = useState(new Set(['arroz','oleo','sal','leite','ovos','tomat']));
  const toggle = id => { const n = new Set(picked); n.has(id)?n.delete(id):n.add(id); setPicked(n); };

  return (
    <Phone>
      <div style={{ paddingBottom:130, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'14px 18px 6px' }}>
          <button className="caption" onClick={onClose} style={{ background:0, border:0, color:'var(--muted)', cursor:'pointer' }}>PULAR</button>
          <div className="caption">2 / 3 · Popular despensa</div>
          <div style={{ width:60 }}/>
        </div>

        {/* Progress */}
        <div style={{ padding:'4px 18px 0' }}>
          <div className="row gap-4">
            <div style={{ flex:1, height:4, background:'var(--ink)', borderRadius:999 }}/>
            <div style={{ flex:1, height:4, background:'var(--ink)', borderRadius:999 }}/>
            <div style={{ flex:1, height:4, background:'var(--hairline)', borderRadius:999 }}/>
          </div>
        </div>

        <div style={{ padding:'14px 18px 10px' }}>
          <Eyebrow>· 60 segundos ·</Eyebrow>
          <h1 className="display-lg" style={{ margin:'8px 0 8px' }}>
            O que já está<br/>na sua <i>despensa?</i>
          </h1>
          <p className="body" style={{ color:'var(--muted)', fontSize:14, margin:0 }}>
            Toque os itens que você tem em casa agora. Depois você adiciona validades — ou deixa para depois.
          </p>
        </div>

        {/* Picked count */}
        <div style={{ padding:'8px 18px 6px' }}>
          <div className="row between" style={{ background:'var(--ink)', color:'var(--canvas)', padding:'10px 14px', borderRadius:999 }}>
            <div className="row gap-8">
              <span className="caption" style={{ color:'rgba(250,245,235,0.7)' }}>SELECIONADOS</span>
              <span className="display italic" style={{ fontSize:18, lineHeight:1 }}>{picked.size}</span>
            </div>
            <button onClick={()=>setPicked(new Set())} style={{ background:0, border:0, color:'rgba(250,245,235,0.7)', fontSize:11, cursor:'pointer', fontFamily:'var(--font-mono)', letterSpacing:'0.12em', textTransform:'uppercase' }}>LIMPAR</button>
          </div>
        </div>

        {/* Grid */}
        <div style={{ padding:'10px 18px 0', display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8 }}>
          {common.map(it=>{
            const on = picked.has(it.id);
            return (
              <button key={it.id} onClick={()=>toggle(it.id)} style={{
                background: on ? 'var(--ink)' : 'var(--surface)',
                color: on ? 'var(--canvas)' : 'var(--ink)',
                borderRadius:14, padding:'10px 6px 10px',
                boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--hairline)',
                border:0, cursor:'pointer',
                display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                position:'relative',
              }}>
                <div style={{ fontSize:28 }}>{it.emoji}</div>
                <div style={{ fontSize:11, fontWeight:500 }}>{it.name}</div>
                {on && (
                  <div style={{
                    position:'absolute', top:6, right:6,
                    width:18, height:18, borderRadius:999, background:'var(--block-pistachio)',
                    color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center',
                  }}><I.Check size={10}/></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Alternative */}
        <div style={{ padding:'18px 18px 0' }}>
          <div className="block cream" style={{ padding:'14px 14px' }}>
            <div className="row gap-12" style={{ alignItems:'center' }}>
              <div style={{ width:40, height:40, borderRadius:999, background:'var(--ink)', color:'var(--canvas)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <I.Scan size={18}/>
              </div>
              <div className="col grow gap-2">
                <div className="title" style={{ fontSize:13 }}>Prefere escanear?</div>
                <div className="body-sm" style={{ color:'var(--muted)', fontSize:12 }}>Cadastra com mais detalhes — até a nota fiscal</div>
              </div>
              <span className="pill pill-secondary pill-sm">Escanear →</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'16px 18px 18px',
          background:'linear-gradient(180deg, rgba(250,245,235,0) 0%, var(--canvas) 30%)' }}>
          <div className="row gap-10">
            <Pill variant="secondary" onClick={onClose}>Mais tarde</Pill>
            <Pill variant="primary" block trailing={<I.ArrowRight size={18}/>} onClick={onClose}>
              Adicionar {picked.size} itens
            </Pill>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 11. NOTIFICATIONS — preview + ajustes
// ════════════════════════════════════════════════════════════════════════════
function ScreenNotifications({ onClose }) {
  const [types, setTypes] = useState({
    expiry:  true,
    daily:   true,
    recipes: true,
    house:   false,
    weekly:  true,
  });
  const toggle = k => setTypes({ ...types, [k]: !types[k] });

  const previewNotifs = [
    { app:'DespensaCerta', when:'agora', title:'3 itens vencem hoje', body:'Tomate, pão francês e iogurte. Toque para ver receitas que aproveitam.', icon:<I.Bell size={14}/>, tone:'urgent' },
    { app:'DespensaCerta', when:'há 2h', title:'Receita do dia', body:'Que tal Bruschetta de tomate? Você tem todos os ingredientes.', icon:<I.Chef size={14}/>, tone:'safe' },
  ];

  return (
    <Phone>
      <div style={{ paddingBottom:40, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'14px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={onClose}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Notificações</div>
          <div style={{ width:40 }}/>
        </div>

        <div style={{ padding:'10px 18px 12px' }}>
          <Eyebrow>Permissões</Eyebrow>
          <h1 className="display-lg" style={{ margin:'8px 0 10px' }}>
            Como queremos<br/>te <i>avisar.</i>
          </h1>
        </div>

        {/* Preview phone (mock notification stack) */}
        <div style={{ padding:'4px 18px 16px' }}>
          <div className="block charcoal" style={{ padding:'16px 16px' }}>
            <div className="row between" style={{ marginBottom:10 }}>
              <Eyebrow dark>· como aparece ·</Eyebrow>
              <div className="caption on-dark" style={{ color:'rgba(250,245,235,0.5)' }}>preview</div>
            </div>
            <div className="col gap-8">
              {previewNotifs.map((n,i)=>(
                <div key={i} style={{
                  background:'rgba(250,245,235,0.92)', backdropFilter:'blur(8px)',
                  borderRadius:14, padding:'10px 12px',
                  display:'flex', gap:10, alignItems:'flex-start',
                }}>
                  <div style={{
                    width:30, height:30, borderRadius:8,
                    background: n.tone==='urgent' ? 'var(--urgent)' : 'var(--primary)',
                    color:'var(--canvas)', display:'flex', alignItems:'center', justifyContent:'center',
                    flexShrink:0,
                  }}>{n.icon}</div>
                  <div className="col grow gap-2" style={{ minWidth:0 }}>
                    <div className="row between" style={{ alignItems:'baseline' }}>
                      <span className="caption" style={{ fontSize:9 }}>{n.app}</span>
                      <span style={{ fontSize:10, color:'var(--muted)' }}>{n.when}</span>
                    </div>
                    <div className="title" style={{ fontSize:13 }}>{n.title}</div>
                    <div className="body-sm" style={{ fontSize:11.5, color:'var(--ink-2)' }}>{n.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Types */}
        <div style={{ padding:'4px 18px 0' }}>
          <Eyebrow>Tipos de aviso</Eyebrow>
          <div className="col gap-8" style={{ marginTop:10 }}>
            <NotifRow icon={<I.Bell size={16}/>}     title="Itens vencendo"       sub="quando algum chegar no prazo crítico" on={types.expiry}  onChange={()=>toggle('expiry')} />
            <NotifRow icon={<I.Calendar size={16}/>} title="Briefing diário"      sub="resumo às 08:00"                       on={types.daily}   onChange={()=>toggle('daily')} />
            <NotifRow icon={<I.Chef size={16}/>}     title="Receitas sugeridas"   sub="quando algo entra em alerta"           on={types.recipes} onChange={()=>toggle('recipes')} />
            <NotifRow icon={<I.User size={16}/>}     title="Atividade da casa"    sub="alguém adicionou ou consumiu"          on={types.house}   onChange={()=>toggle('house')} />
            <NotifRow icon={<I.Sparkle size={16}/>}  title="Relatório semanal"    sub="impacto de aproveitamento aos domingos" on={types.weekly}  onChange={()=>toggle('weekly')} />
          </div>
        </div>

        {/* Channel */}
        <div style={{ padding:'18px 18px 0' }}>
          <Eyebrow>Canal</Eyebrow>
          <div className="row gap-8" style={{ marginTop:8 }}>
            <ChannelTile icon={<I.Bell size={18}/>} label="Push" active />
            <ChannelTile icon={<I.Mail size={18}/>} label="Email" />
            <ChannelTile icon={<svg viewBox="0 0 24 24" width="18" height="18"><path fill="none" stroke="currentColor" strokeWidth="1.6" d="M21 11.5a8.5 8.5 0 0 1-12.3 7.7L3 21l1.8-5.7A8.5 8.5 0 1 1 21 11.5z"/></svg>} label="Whats" />
          </div>
        </div>
      </div>
    </Phone>
  );
}
function NotifRow({ icon, title, sub, on, onChange }) {
  return (
    <div className="row gap-12" style={{ background:'var(--surface)', padding:'12px 14px', borderRadius:16, boxShadow:'inset 0 0 0 1px var(--hairline)', alignItems:'center' }}>
      <div style={{ width:36, height:36, borderRadius:999, background: on ? 'var(--block-pistachio)' : 'var(--surface-soft)', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {icon}
      </div>
      <div className="col grow gap-2" style={{ minWidth:0 }}>
        <div className="title" style={{ fontSize:13 }}>{title}</div>
        <div className="body-sm" style={{ color:'var(--muted)', fontSize:11.5 }}>{sub}</div>
      </div>
      <button onClick={onChange} style={{
        width:42, height:26, borderRadius:999, border:0, cursor:'pointer',
        background: on ? 'var(--ink)' : 'var(--hairline)', position:'relative', flexShrink:0,
      }}>
        <span style={{ position:'absolute', top:3, left: on ? 19 : 3, width:20, height:20, borderRadius:999, background:'var(--canvas)', transition:'left .15s' }}/>
      </button>
    </div>
  );
}
function ChannelTile({ icon, label, active }) {
  return (
    <div style={{
      flex:1, padding:'14px 10px', borderRadius:16, textAlign:'center',
      background: active ? 'var(--ink)' : 'var(--surface)',
      color: active ? 'var(--canvas)' : 'var(--ink)',
      boxShadow: active ? 'none' : 'inset 0 0 0 1px var(--hairline)',
      cursor:'pointer',
    }}>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:6 }}>{icon}</div>
      <div className="caption" style={{ fontSize:9.5, color: active ? 'rgba(250,245,235,0.85)' : 'var(--muted)' }}>{label}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 12. DONATE — alternativa ao descarte
// ════════════════════════════════════════════════════════════════════════════
function ScreenDonate({ onClose, item: itemProp }) {
  const item = itemProp || D5.FOOD_ITEMS[1];
  const banks = [
    { name:'Banco de Alimentos SP', dist:'1.2 km', open:'aberto · até 18h',  accepts:['frescos','não-perecíveis'], score:96 },
    { name:'Mesa Brasil Sesc',      dist:'2.8 km', open:'aberto · até 17h',  accepts:['todos os tipos'],           score:92 },
    { name:'Igreja N.S. Aparecida', dist:'3.5 km', open:'amanhã · 09h-12h',  accepts:['não-perecíveis'],           score:78 },
  ];
  const [sel, setSel] = useState(0);

  return (
    <Phone>
      <div style={{ paddingBottom:120, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'14px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={onClose}><I.Close size={18}/></IconBtn>
          <div className="caption">Doar antes de vencer</div>
          <div style={{ width:40 }}/>
        </div>

        {/* Hero */}
        <div style={{ padding:'10px 18px 14px' }}>
          <div className="block pistachio" style={{ padding:'20px 18px', position:'relative', overflow:'hidden' }}>
            <Eyebrow>· uma alternativa ·</Eyebrow>
            <h1 className="display-lg" style={{ margin:'8px 0 8px', maxWidth:230 }}>
              Que tal<br/><i>doar</i> em vez<br/>de descartar?
            </h1>
            <p className="body-sm" style={{ color:'var(--ink-2)', maxWidth:240, fontSize:13 }}>
              Encontramos 3 pontos próximos que aceitam {item.category.toLowerCase()}.
            </p>
            <div style={{ position:'absolute', right:-10, bottom:-10, fontSize:90, opacity:0.18 }}>🤝</div>
          </div>
        </div>

        {/* Item */}
        <div style={{ padding:'4px 18px 14px' }}>
          <div className="row gap-12" style={{
            background:'var(--surface)', borderRadius:18, padding:'12px 14px',
            boxShadow:'inset 0 0 0 1px var(--hairline)', alignItems:'center',
          }}>
            <Photo src={item.photo} size={50} radius="md" color={D5.catColor(item.category)}/>
            <div className="col grow gap-2">
              <div className="title" style={{ fontSize:14 }}>{item.name}</div>
              <div className="row gap-8" style={{ color:'var(--muted)', fontSize:11 }}>
                <span>{item.qty} {item.unit}</span>
                <span>·</span>
                <span>{item.category}</span>
              </div>
            </div>
            <ExpiryChip date={item.expiresAt}/>
          </div>
        </div>

        {/* Banks list */}
        <div className="row between" style={{ padding:'4px 22px 8px', alignItems:'flex-end' }}>
          <div className="col gap-4">
            <Eyebrow>Pontos próximos</Eyebrow>
            <div className="display-sm" style={{ margin:0 }}>{banks.length} opções</div>
          </div>
          <span className="caption">VER MAPA →</span>
        </div>

        <div className="col gap-10" style={{ padding:'0 18px' }}>
          {banks.map((b,i)=>(
            <button key={i} onClick={()=>setSel(i)} style={{
              background:'var(--surface)', borderRadius:18, padding:'14px 16px',
              boxShadow: sel===i ? 'inset 0 0 0 1.5px var(--ink)' : 'inset 0 0 0 1px var(--hairline)',
              border:0, cursor:'pointer', textAlign:'left',
            }}>
              <div className="row between" style={{ marginBottom:8 }}>
                <div className="col gap-4 grow">
                  <div className="title" style={{ fontSize:14 }}>{b.name}</div>
                  <div className="row gap-8" style={{ color:'var(--muted)', fontSize:12 }}>
                    <span>{b.dist}</span>
                    <span>·</span>
                    <span style={{ color: b.open.includes('aberto')?'var(--safe)':'var(--muted)' }}>{b.open}</span>
                  </div>
                </div>
                <div className="display italic" style={{ fontSize:24 }}>{b.score}</div>
              </div>
              <div className="row gap-6">
                {b.accepts.map(a=>(
                  <Chip key={a} tone="neutral">{a}</Chip>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'16px 18px 18px',
          background:'linear-gradient(180deg, rgba(250,245,235,0) 0%, var(--canvas) 30%)' }}>
          <div className="row gap-10">
            <Pill variant="secondary" leading={<I.Trash size={16}/>}>Descartar</Pill>
            <Pill variant="primary" block trailing={<I.Heart size={18}/>} onClick={onClose}>
              Doar para {banks[sel].name.split(' ').slice(0,2).join(' ')}
            </Pill>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 13. EMPTY STATES — showcase de estados vazios ilustrados
// ════════════════════════════════════════════════════════════════════════════
function ScreenEmptyStates({ onClose }) {
  const states = [
    {
      key:'alerts-clear',
      eyebrow:'Alertas vazia',
      glyph: <EmptyGlyph color="var(--block-pistachio)" emoji="🌿"/>,
      title: <>Tudo em<br/><i>dia.</i></>,
      body: 'Nada vencendo nos próximos 15 dias. Aproveite para planejar uma receita nova.',
      cta: 'Explorar receitas',
    },
    {
      key:'inventory-empty',
      eyebrow:'Despensa vazia',
      glyph: <EmptyGlyph color="var(--block-cream)" emoji="📦"/>,
      title: <>Despensa<br/><i>vazia.</i></>,
      body: 'Vamos catalogar o que você tem. Escaneie códigos ou cadastre os itens-base em 60 segundos.',
      cta: 'Adicionar primeiro item',
    },
    {
      key:'shopping-empty',
      eyebrow:'Sem compras',
      glyph: <EmptyGlyph color="var(--block-peach)" emoji="🛒"/>,
      title: <>Lista <i>limpa.</i></>,
      body: 'Você não precisa de nada agora. Quando algo acabar, vamos sugerir aqui automaticamente.',
      cta: 'Adicionar manualmente',
    },
    {
      key:'recipes-none',
      eyebrow:'Receitas sem match',
      glyph: <EmptyGlyph color="var(--block-rose)" emoji="🍳"/>,
      title: <>Hmm,<br/>está <i>magro.</i></>,
      body: 'Faltam ingredientes-base para sugerir receitas. Cadastre alguns itens da despensa.',
      cta: 'Catalogar despensa',
    },
  ];
  const [idx, setIdx] = useState(0);
  const s = states[idx];

  return (
    <Phone scroll={false}>
      <div className="col" style={{ height:'100%', background:'var(--canvas)' }}>
        <div className="row between" style={{ padding:'14px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={onClose}><I.Close size={18}/></IconBtn>
          <div className="caption">Empty states · {idx+1}/{states.length}</div>
          <div style={{ width:40 }}/>
        </div>

        {/* Variant switcher */}
        <div style={{ display:'flex', gap:6, padding:'4px 18px 0', overflowX:'auto' }}>
          {states.map((st,i)=>(
            <button key={st.key} onClick={()=>setIdx(i)} style={{
              flexShrink:0, height:32, padding:'0 12px', borderRadius:999, border:0, cursor:'pointer',
              background: idx===i ? 'var(--ink)' : 'var(--surface)',
              color: idx===i ? 'var(--canvas)' : 'var(--ink)',
              boxShadow: idx===i ? 'none' : 'inset 0 0 0 1px var(--hairline)',
              fontFamily:'var(--font-sans)', fontSize:12,
            }}>{st.eyebrow}</button>
          ))}
        </div>

        {/* The state */}
        <div className="col center grow" style={{ padding:'40px 30px 20px', textAlign:'center' }}>
          {s.glyph}
          <div className="eyebrow" style={{ marginTop:24 }}>{s.eyebrow}</div>
          <h1 className="display-xl" style={{ margin:'8px 0 12px', fontSize:54, lineHeight:0.95 }}>{s.title}</h1>
          <p className="body" style={{ color:'var(--muted)', maxWidth:280, fontSize:14, marginBottom:24 }}>{s.body}</p>
          <Pill variant="primary" trailing={<I.ArrowRight size={16}/>}>{s.cta}</Pill>
        </div>
      </div>
    </Phone>
  );
}

function EmptyGlyph({ color, emoji }) {
  return (
    <div style={{ position:'relative', width:160, height:160 }}>
      <div style={{
        position:'absolute', inset:0, borderRadius:999, background: color,
      }}/>
      <div style={{
        position:'absolute', inset:'15% 15% 15% 15%', borderRadius:999,
        background:'var(--canvas)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:60,
      }}>{emoji}</div>
      {/* Decorative dots */}
      <div style={{ position:'absolute', top:0, right:-4, width:14, height:14, borderRadius:999, background:'var(--ink)' }}/>
      <div style={{ position:'absolute', bottom:8, left:-8, width:10, height:10, borderRadius:999, background:'var(--block-peach)' }}/>
      <div style={{ position:'absolute', top:'40%', right:-14, width:6, height:6, borderRadius:999, background:'var(--block-rose)' }}/>
    </div>
  );
}

Object.assign(window, {
  ScreenOnboardingInventory, ScreenNotifications, ScreenDonate, ScreenEmptyStates,
});
