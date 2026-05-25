/* global React, DC_UI, DC_DATA */
// ────────────────────────────────────────────────────────────────────────────
// DespensaCerta — Screens (Part 1)
// Splash · Biometric · Onboarding · Login · SignUp · Home · Alerts
// ────────────────────────────────────────────────────────────────────────────

const { useState, useEffect, useRef, useMemo } = React;
const U = window.DC_UI;
const D = window.DC_DATA;
const { I, Pill, IconBtn, Eyebrow, Chip, ExpiryChip, Photo, PhotoBox,
        Stat, BigNumber, Sticker, SegBar, Stepper, FoodRow, FoodTile,
        SectionHead, TabBar, Phone, greeting } = U;

// ────────────────────────────────────────────────────────────────────────────
// SPLASH
// ────────────────────────────────────────────────────────────────────────────
function ScreenSplash({ goto }) {
  return (
    <Phone scroll={false}>
      <div className="col" style={{ height:'100%', background:'var(--canvas)' }}>
        {/* Top brand mark */}
        <div className="row" style={{ padding:'28px 20px 0', justifyContent:'space-between' }}>
          <div className="row gap-8" style={{ color:'var(--ink)' }}>
            <I.Logo size={22}/>
            <div style={{ fontFamily:'var(--font-display)', fontSize:20, letterSpacing:'-0.01em' }}>
              Despensa<i>Certa</i>
            </div>
          </div>
          <div className="caption">v 1.0 · BR</div>
        </div>

        {/* Hero editorial */}
        <div className="col grow" style={{ padding:'60px 24px 0', gap:24, justifyContent:'center' }}>
          <div className="eyebrow">Cuide do que está em casa</div>
          <h1 className="display-xl" style={{ margin:0 }}>
            Sua despensa,<br/>
            <i style={{ color:'var(--primary)' }}>com cabeça.</i>
          </h1>
          <p className="body" style={{ color:'var(--muted)', maxWidth:280, fontSize:15 }}>
            Acompanhe validades, planeje compras e cozinhe com o que vence primeiro.
          </p>
        </div>

        {/* Floating food collage */}
        <div style={{ position:'relative', height:200, margin:'24px 0' }}>
          <PhotoBox src={D.PHOTO.tomato}   width={120} height={150} radius={20} style={{ position:'absolute', left:18, top:10, transform:'rotate(-6deg)', boxShadow:'0 12px 32px rgba(26,43,31,0.18)' }} />
          <PhotoBox src={D.PHOTO.avocado}  width={108} height={130} radius={20} style={{ position:'absolute', left:140, top:50, transform:'rotate(4deg)', boxShadow:'0 12px 32px rgba(26,43,31,0.16)' }} />
          <PhotoBox src={D.PHOTO.bread}    width={92}  height={110} radius={18} style={{ position:'absolute', right:14, top:0, transform:'rotate(8deg)', boxShadow:'0 12px 32px rgba(26,43,31,0.16)' }} />
          <div style={{
            position:'absolute', left:130, bottom:6, transform:'rotate(-3deg)',
            background:'var(--ink)', color:'var(--canvas)', borderRadius:999,
            padding:'8px 14px', fontFamily:'var(--font-mono)', fontSize:10,
            letterSpacing:'0.18em', textTransform:'uppercase',
          }}>· 3 itens vencem hoje ·</div>
        </div>

        {/* CTAs */}
        <div className="col gap-10" style={{ padding:'0 22px 32px' }}>
          <Pill variant="primary" block size="lg" onClick={()=>goto('onboarding')}>Começar agora</Pill>
          <Pill variant="ghost" block onClick={()=>goto('biometric')}>Já tenho conta</Pill>
        </div>
      </div>
    </Phone>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// BIOMETRIC LOCK (returning user — like Nubank)
// ────────────────────────────────────────────────────────────────────────────
function ScreenBiometric({ goto }) {
  const [state, setState] = useState('idle'); // idle, scanning, success
  function handlePress() {
    setState('scanning');
    setTimeout(()=>{ setState('success'); }, 900);
    setTimeout(()=>{ goto('home'); }, 1500);
  }
  const ringColor = state==='success' ? 'var(--safe)' : state==='scanning' ? 'var(--block-peach)' : 'var(--hairline)';
  return (
    <Phone scroll={false}>
      <div className="col" style={{ height:'100%', background:'var(--canvas)' }}>
        <div className="row between" style={{ padding:'22px 22px 0' }}>
          <div className="row gap-8">
            <I.Logo size={20} />
            <div style={{ fontFamily:'var(--font-display)', fontSize:18 }}>DespensaCerta</div>
          </div>
          <button className="pill pill-ghost pill-sm" onClick={()=>goto('login')}>Outra conta</button>
        </div>

        <div className="col grow" style={{ justifyContent:'center', alignItems:'center', gap:28, padding:'0 28px' }}>
          <Photo src={D.PHOTO.avatar} size={72} radius="full" />
          <div className="col gap-6" style={{ alignItems:'center', textAlign:'center' }}>
            <div className="eyebrow">Bem-vinda de volta</div>
            <h1 className="display-lg" style={{ margin:0 }}>Olá, <i>Marina</i></h1>
            <p className="body" style={{ color:'var(--muted)', maxWidth:240 }}>
              Toque para entrar com biometria
            </p>
          </div>

          {/* Fingerprint */}
          <button onClick={handlePress} style={{
            width:140, height:140, borderRadius:999,
            background:'var(--surface)',
            boxShadow:`inset 0 0 0 2px ${ringColor}, 0 12px 30px rgba(26,43,31,0.10)`,
            border:0, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            color: state==='success' ? 'var(--safe)' : 'var(--ink)',
            transition:'all .2s ease',
          }}
          className={state==='scanning' ? 'pulse' : ''}>
            {state==='success' ? <I.Check size={56} /> : <I.FingerPrint size={64} />}
          </button>
          <div className="caption" style={{ color: state==='success'?'var(--safe)':'var(--muted)' }}>
            {state==='idle' ? '· Toque o sensor para continuar ·' : state==='scanning' ? '· Identificando ·' : '· Bem-vinda ·'}
          </div>
        </div>

        <div className="col gap-8" style={{ padding:'0 22px 32px', alignItems:'center' }}>
          <Pill variant="ghost" leading={<I.Lock size={16}/>} onClick={()=>{}}>
            Entrar com senha
          </Pill>
        </div>
      </div>
    </Phone>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// ONBOARDING
// ────────────────────────────────────────────────────────────────────────────
const ONBOARDING_SLIDES = [
  {
    eyebrow:'01 / Prevenir',
    title: <>Menos<br/><i>desperdício,</i><br/>mais economia.</>,
    body: 'Veja o que vence primeiro antes de virar lixo. Alertas inteligentes em 30, 15 e 5 dias.',
    block:'pistachio',
    photo: D.PHOTO.hero_pantry,
  },
  {
    eyebrow:'02 / Organizar',
    title: <>Escaneie<br/>e organize<br/>num <i>toque.</i></>,
    body: 'Aponte para o código de barras: nome, marca e categoria preenchidos. Você só confirma a validade.',
    block:'peach',
    photo: D.PHOTO.hero_market,
  },
  {
    eyebrow:'03 / Aproveitar',
    title: <>Cozinhe<br/>com o que<br/>você <i>tem.</i></>,
    body: 'Receitas sugeridas pelos itens em alerta. Lista de compras sem comprar repetido.',
    block:'rose',
    photo: D.PHOTO.hero_cook,
  },
];

function ScreenOnboarding({ goto }) {
  const [step, setStep] = useState(0);
  const slide = ONBOARDING_SLIDES[step];
  const isLast = step === ONBOARDING_SLIDES.length - 1;

  return (
    <Phone scroll={false}>
      <div className="col" style={{ height:'100%', background:'var(--canvas)' }}>
        {/* Top bar */}
        <div className="row between" style={{ padding:'14px 20px 8px' }}>
          <div className="row gap-8" style={{ color:'var(--ink)' }}>
            <I.Logo size={18}/>
            <div style={{ fontFamily:'var(--font-display)', fontSize:17 }}>DespensaCerta</div>
          </div>
          <button className="pill pill-ghost pill-sm" onClick={()=>goto('signup')}>Pular</button>
        </div>

        {/* Hero color block with photo */}
        <div style={{ padding:'8px 18px 0' }}>
          <div className={`block ${slide.block}`} style={{ padding:0, overflow:'hidden', borderRadius:24, position:'relative' }}>
            <PhotoBox src={slide.photo} height={260} radius={24} style={{ width:'100%' }}>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(26,43,31,0) 40%, rgba(26,43,31,0.55) 100%)' }} />
              <div style={{ position:'absolute', left:16, top:14 }}>
                <Sticker style={{ background:'var(--canvas)', color:'var(--ink)' }}>{slide.eyebrow}</Sticker>
              </div>
              <div style={{ position:'absolute', right:14, bottom:14, color:'var(--canvas)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.16em' }}>
                {String(step+1).padStart(2,'0')} / 03
              </div>
            </PhotoBox>
          </div>
        </div>

        {/* Copy */}
        <div className="col grow" style={{ padding:'24px 22px 8px', gap:14, justifyContent:'flex-start' }}>
          <h1 className="display-xl" style={{ margin:0, fontSize:50, lineHeight:0.95 }}>{slide.title}</h1>
          <p className="body" style={{ color:'var(--muted)', fontSize:15, maxWidth:300 }}>{slide.body}</p>
        </div>

        {/* Pagination + CTA */}
        <div className="col gap-14" style={{ padding:'12px 22px 32px' }}>
          <div className="row between" style={{ alignItems:'center' }}>
            <div className="row gap-6">
              {ONBOARDING_SLIDES.map((_,i)=>(
                <div key={i} style={{
                  height:6, width: i===step ? 24 : 6, borderRadius:999,
                  background: i===step ? 'var(--ink)' : 'rgba(26,43,31,0.2)',
                  transition:'width .25s ease',
                }} />
              ))}
            </div>
            <div className="row gap-8">
              {step>0 && (
                <IconBtn variant="hairline" onClick={()=>setStep(step-1)} ariaLabel="Voltar"><I.ArrowLeft size={18}/></IconBtn>
              )}
              <Pill
                variant="primary"
                trailing={<I.ArrowRight size={18}/>}
                onClick={()=> isLast ? goto('signup') : setStep(step+1)}>
                {isLast ? 'Criar conta' : 'Próximo'}
              </Pill>
            </div>
          </div>
          <div className="caption" style={{ textAlign:'center' }}>
            Já tem conta? <button onClick={()=>goto('login')} style={{ background:0, border:0, padding:0, color:'var(--ink)', fontFamily:'inherit', textTransform:'uppercase', letterSpacing:'0.12em', cursor:'pointer' }}>Entrar →</button>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// LOGIN
// ────────────────────────────────────────────────────────────────────────────
function ScreenLogin({ goto }) {
  return (
    <Phone>
      <div className="col" style={{ minHeight:'100%', background:'var(--canvas)' }}>
        <div className="row between" style={{ padding:'18px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={()=>goto('splash')}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Entrar</div>
          <div style={{ width:40 }}/>
        </div>

        <div className="col gap-20" style={{ padding:'18px 22px 0' }}>
          <div className="col gap-10">
            <Eyebrow>Bem-vindo de volta</Eyebrow>
            <h1 className="display-lg" style={{ margin:0 }}>Entre na sua <i>despensa.</i></h1>
          </div>

          <div className="col gap-14">
            <div className="field">
              <label className="field-label">Email</label>
              <div style={{ position:'relative' }}>
                <input className="input" placeholder="seu@email.com" defaultValue="marina@email.com" style={{ paddingLeft:46 }} />
                <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}><I.Mail size={18}/></span>
              </div>
            </div>
            <div className="field">
              <label className="field-label">Senha</label>
              <div style={{ position:'relative' }}>
                <input className="input" placeholder="••••••••" type="password" defaultValue="********" style={{ paddingLeft:46 }} />
                <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}><I.Lock size={18}/></span>
              </div>
            </div>
            <div className="row between" style={{ padding:'2px 4px' }}>
              <div className="row gap-8" style={{ color:'var(--muted)', fontSize:13 }}>
                <div style={{ width:16, height:16, borderRadius:4, background:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--canvas)' }}>
                  <I.Check size={12}/>
                </div>
                Manter conectado
              </div>
              <a style={{ color:'var(--ink)', fontSize:13, textDecoration:'none', borderBottom:'1px solid var(--ink)' }}>Esqueci a senha</a>
            </div>
          </div>

          <div className="col gap-10">
            <Pill variant="primary" block size="lg" onClick={()=>goto('home')}>Entrar</Pill>
            <div className="sep caption">ou</div>
            <Pill variant="secondary" block leading={<I.FingerPrint size={20}/>} onClick={()=>goto('biometric')}>
              Usar biometria
            </Pill>
          </div>
        </div>

        <div className="grow"/>
        <div className="caption" style={{ textAlign:'center', padding:'20px 22px 28px' }}>
          Novo por aqui? <button onClick={()=>goto('signup')} style={{ background:0, border:0, padding:0, color:'var(--ink)', fontFamily:'inherit', textTransform:'uppercase', letterSpacing:'0.12em', cursor:'pointer' }}>Criar conta →</button>
        </div>
      </div>
    </Phone>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SIGNUP
// ────────────────────────────────────────────────────────────────────────────
function ScreenSignUp({ goto }) {
  return (
    <Phone>
      <div className="col" style={{ minHeight:'100%', background:'var(--canvas)' }}>
        <div className="row between" style={{ padding:'18px 18px 6px' }}>
          <IconBtn variant="hairline" onClick={()=>goto('onboarding')}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Criar conta</div>
          <div style={{ width:40 }}/>
        </div>

        <div className="col gap-20" style={{ padding:'18px 22px 0' }}>
          <div className="col gap-10">
            <Eyebrow>Comece em 1 minuto</Eyebrow>
            <h1 className="display-lg" style={{ margin:0 }}>Crie sua <i>despensa.</i></h1>
          </div>

          <div className="col gap-14">
            <div className="field">
              <label className="field-label">Nome</label>
              <input className="input" placeholder="Como podemos te chamar" defaultValue="Marina Pires" />
            </div>
            <div className="field">
              <label className="field-label">Email</label>
              <input className="input" placeholder="seu@email.com" defaultValue="marina@email.com" />
            </div>
            <div className="field">
              <label className="field-label">Senha</label>
              <input className="input" placeholder="Mínimo 8 caracteres" type="password" defaultValue="********" />
            </div>
          </div>

          {/* terms */}
          <div className="row gap-10" style={{ alignItems:'flex-start', color:'var(--muted)', fontSize:12.5, lineHeight:1.5 }}>
            <div style={{ flexShrink:0, width:18, height:18, borderRadius:4, background:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--canvas)' }}>
              <I.Check size={14}/>
            </div>
            <span>Concordo com os <u>termos de uso</u> e a <u>política de privacidade</u> alinhada à LGPD.</span>
          </div>

          <Pill variant="primary" block size="lg" trailing={<I.ArrowRight size={18}/>} onClick={()=>goto('home')}>Criar conta</Pill>
        </div>

        <div className="grow"/>
        <div className="caption" style={{ textAlign:'center', padding:'20px 22px 28px' }}>
          Já tem conta? <button onClick={()=>goto('login')} style={{ background:0, border:0, padding:0, color:'var(--ink)', fontFamily:'inherit', textTransform:'uppercase', letterSpacing:'0.12em', cursor:'pointer' }}>Entrar →</button>
        </div>
      </div>
    </Phone>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// HOME
// ────────────────────────────────────────────────────────────────────────────
function ScreenHome({ goto, onTab, onAdd }) {
  const items = D.FOOD_ITEMS;
  const isPremium = typeof window !== 'undefined' && window.__premium !== false;
  const urgent  = items.filter(i => ['expired','urgent'].includes(D.expiryStatus(i.expiresAt)))
                       .sort((a,b)=> D.daysUntil(a.expiresAt)-D.daysUntil(b.expiresAt));
  const counts = {
    expired:  items.filter(i=>D.expiryStatus(i.expiresAt)==='expired').length,
    urgent:   items.filter(i=>D.expiryStatus(i.expiresAt)==='urgent').length,
    soon:     items.filter(i=>D.expiryStatus(i.expiresAt)==='soon').length,
    safe:     items.filter(i=>['planned','safe'].includes(D.expiryStatus(i.expiresAt))).length,
  };
  const featured = urgent[0]; // first urgent
  const suggested = D.RECIPES.slice(0,3);
  const shopping = D.SHOPPING_ITEMS;
  const shopChecked = shopping.filter(s=>s.checked).length;

  return (
    <Phone>
      <div style={{ paddingBottom:96, background:'var(--canvas)', minHeight:'100%' }}>
        {/* Header */}
        <div className="row between" style={{ padding:'14px 18px 4px', alignItems:'center' }}>
          <div className="row gap-12" style={{ alignItems:'center' }}>
            <Photo src={D.PHOTO.avatar} size={42} radius="full" />
            <div className="col gap-2">
              <div className="row gap-6" style={{ alignItems:'center' }}>
                <div className="caption">{greeting()}</div>
                <span style={{
                  fontFamily:'var(--font-mono)', fontSize:8.5, letterSpacing:'0.12em',
                  textTransform:'uppercase', padding:'2px 6px', borderRadius:999,
                  background: isPremium ? 'var(--ink)' : 'var(--surface-soft)',
                  color: isPremium ? 'var(--block-pistachio)' : 'var(--muted)',
                }}>
                  {isPremium ? '✰ Premium' : 'Free'}
                </span>
              </div>
              <div className="title" style={{ fontSize:15 }}>Marina</div>
            </div>
          </div>
          <div className="row gap-8">
            <IconBtn variant="hairline" ariaLabel="Buscar"><I.Search size={18}/></IconBtn>
            <div style={{ position:'relative' }}>
              <IconBtn variant="hairline" ariaLabel="Alertas" onClick={()=>onTab('alerts')}><I.Bell size={18}/></IconBtn>
              <div style={{ position:'absolute', top:6, right:6, width:8, height:8, borderRadius:999, background:'var(--danger)', boxShadow:'0 0 0 2px var(--canvas)' }}/>
            </div>
          </div>
        </div>

        {/* Hero — Use primeiro */}
        <div style={{ padding:'14px 18px 6px' }}>
          <Eyebrow>Use primeiro</Eyebrow>
          <h1 className="display-lg" style={{ margin:'8px 0 14px', fontSize:38 }}>
            {counts.expired + counts.urgent} itens<br/>
            pedem <i>cuidado.</i>
          </h1>

          {/* Featured urgent card */}
          {featured && (
            <button onClick={()=>onTab('alerts')} style={{
              display:'block', width:'100%', textAlign:'left',
              background:'var(--ink)', color:'var(--canvas)',
              borderRadius:24, overflow:'hidden', position:'relative',
              border:0, cursor:'pointer', padding:0,
            }}>
              <PhotoBox src={featured.photo} height={140} radius={0} style={{ width:'100%' }}>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)' }} />
                <div style={{ position:'absolute', top:12, left:12 }}>
                  <ExpiryChip date={featured.expiresAt} />
                </div>
              </PhotoBox>
              <div className="col gap-10" style={{ padding:'14px 16px 16px' }}>
                <div className="col gap-4">
                  <Eyebrow dark>O mais urgente</Eyebrow>
                  <div className="display-md" style={{ color:'var(--canvas)' }}>{featured.name}</div>
                  <div className="body-sm" style={{ color:'rgba(250,245,235,0.7)' }}>
                    {featured.qty} {featured.unit} · {D.locName(featured.locationId)}
                  </div>
                </div>
                <div className="row gap-8">
                  <span className="pill pill-on-dark pill-sm">Marcar como consumido</span>
                  <span className="pill pill-on-dark pill-sm" style={{ background:'var(--canvas)', color:'var(--ink)' }}>Ver receita</span>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Urgent list horizontal */}
        <div className="col gap-10" style={{ padding:'18px 0 6px' }}>
          <div className="row between" style={{ padding:'0 18px' }}>
            <Eyebrow>· Próximos da fila ·</Eyebrow>
            <button onClick={()=>onTab('alerts')} style={{ background:0, border:0, color:'var(--ink)', fontSize:13, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:3 }}>Ver todos</button>
          </div>
          <div style={{ display:'flex', gap:12, overflowX:'auto', padding:'4px 18px 12px' }}>
            {urgent.slice(1,6).map(item => <FoodTile key={item.id} item={item} />)}
            {urgent.length<2 && <FoodTile item={items[0]} />}
          </div>
        </div>

        {/* Resumo de validade — color block */}
        <div style={{ padding:'10px 18px' }}>
          <div className="block pistachio" style={{ padding:'22px 20px' }}>
            <div className="row between" style={{ alignItems:'flex-start', marginBottom:16 }}>
              <Eyebrow>Resumo</Eyebrow>
              <I.Leaf size={20} />
            </div>
            <h2 className="display-md" style={{ margin:'0 0 16px' }}>
              Sua despensa em <i>números.</i>
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <ResumeBox n={counts.expired+counts.urgent} label="Em risco" sub={`${counts.expired} vencidos · ${counts.urgent} urgentes`} accent="var(--danger)" />
              <ResumeBox n={counts.soon} label="Próximos" sub="6–15 dias" accent="#b5901e" />
              <ResumeBox n={counts.safe} label="Seguros" sub="+15 dias" accent="var(--safe)" />
              <ResumeBox n={items.length} label="Total" sub={`em ${D.LOCATIONS.length} locais`} accent="var(--ink)" />
            </div>
          </div>
        </div>

        {/* Receitas sugeridas */}
        <div style={{ paddingTop:18 }}>
          <SectionHead
            eyebrow="Cozinhe com o que tem"
            title={<>Receitas <i>sugeridas</i></>}
            action={<button onClick={()=>onTab('recipes')} className="caption" style={{ background:0, border:0, color:'var(--ink)', cursor:'pointer' }}>VER TODAS →</button>}
          />
          <div style={{ display:'flex', gap:12, overflowX:'auto', padding:'4px 18px 16px' }}>
            {suggested.map(r => (
              <button key={r.id} onClick={()=>goto({ name:'recipeDetail', recipeId:r.id })} style={{
                width:240, background:'var(--surface)', borderRadius:22, boxShadow:'inset 0 0 0 1px var(--hairline)',
                border:0, cursor:'pointer', padding:0, textAlign:'left', flexShrink:0, overflow:'hidden',
              }}>
                <PhotoBox src={r.photo} height={140} radius={0} style={{ width:'100%' }}>
                  <div style={{ position:'absolute', top:10, left:10 }}>
                    <Sticker style={{ background:'var(--canvas)', color:'var(--ink)' }}>
                      <I.Sparkle size={12}/> {r.have}/{r.total} itens
                    </Sticker>
                  </div>
                </PhotoBox>
                <div className="col gap-6" style={{ padding:'12px 14px 14px' }}>
                  <div className="title">{r.title}</div>
                  <div className="body-sm" style={{ color:'var(--muted)' }}>{r.reason}</div>
                  <div className="row gap-10" style={{ color:'var(--muted)', fontSize:12, marginTop:2 }}>
                    <span className="row gap-4"><I.Clock size={12}/> {r.duration} min</span>
                    <span>·</span>
                    <span>{r.servings} porções</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lista de compras resumo */}
        <div style={{ padding:'4px 18px 16px' }}>
          <button onClick={()=>onTab('shopping')} style={{
            width:'100%', textAlign:'left', border:0, cursor:'pointer',
            background:'var(--surface)', borderRadius:22, padding:18,
            boxShadow:'inset 0 0 0 1px var(--hairline)',
          }}>
            <div className="row between" style={{ marginBottom:12 }}>
              <Eyebrow>Lista de compras</Eyebrow>
              <I.ArrowUpRight size={16} />
            </div>
            <div className="row between" style={{ alignItems:'flex-end' }}>
              <div className="col gap-4">
                <div className="display-md" style={{ margin:0 }}><i>{shopChecked}</i> / {shopping.length}</div>
                <div className="caption">itens comprados</div>
              </div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:4 }}>
                {shopping.slice(0,6).map((s,i)=>(
                  <div key={i} style={{
                    width:8, height: 14 + (s.checked?14:0),
                    background: s.checked ? 'var(--ink)' : 'var(--hairline)',
                    borderRadius:4,
                  }}/>
                ))}
              </div>
            </div>
            <div className="row gap-6" style={{ marginTop:14, flexWrap:'wrap' }}>
              {shopping.filter(s=>!s.checked).slice(0,3).map(s=>(
                <Chip key={s.id} tone={s.duplicate?'urgent':'neutral'}>{s.name}</Chip>
              ))}
              <Chip tone="neutral">+{shopping.filter(s=>!s.checked).length-3} mais</Chip>
            </div>
          </button>
        </div>

        <div style={{ height:20 }}/>
      </div>
    </Phone>
  );
}

function ResumeBox({ n, label, sub, accent }) {
  return (
    <div style={{ background:'var(--canvas)', borderRadius:18, padding:'14px 14px 16px' }}>
      <div className="row gap-6" style={{ alignItems:'center', marginBottom:8 }}>
        <div style={{ width:8, height:8, borderRadius:999, background: accent }}/>
        <div className="caption" style={{ fontSize:9.5 }}>{label}</div>
      </div>
      <div className="display" style={{ fontSize:40, fontStyle:'italic', color:'var(--ink)' }}>{n}</div>
      <div className="body-sm" style={{ color:'var(--muted)', marginTop:2, fontSize:11 }}>{sub}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// ALERTS
// ────────────────────────────────────────────────────────────────────────────
function ScreenAlerts({ onTab, onAdd, openSheet }) {
  const items = D.FOOD_ITEMS;
  const [filter, setFilter] = useState('all');
  const all = items.slice().sort((a,b)=>D.daysUntil(a.expiresAt)-D.daysUntil(b.expiresAt));
  const filtered = filter==='all' ? all : all.filter(i => {
    const s = D.expiryStatus(i.expiresAt);
    return s===filter;
  });

  const groups = useMemo(() => {
    const g = { expired:[], urgent:[], soon:[], planned:[], safe:[] };
    filtered.forEach(i => { g[D.expiryStatus(i.expiresAt)].push(i); });
    return g;
  }, [filtered]);

  const groupMeta = {
    expired: { title: 'Vencidos',  caption: 'descarte ou registre', accent:'var(--danger)', tone:'rose' },
    urgent:  { title: 'Urgentes',  caption: '1 a 5 dias',           accent:'var(--urgent)', tone:'peach' },
    soon:    { title: 'Próximos',  caption: '6 a 15 dias',          accent:'#b5901e',       tone:'cream' },
    planned: { title: 'Programados',caption: '16 a 30 dias',         accent:'var(--ink)',    tone:'sage' },
    safe:    { title: 'Seguros',   caption: 'mais de 30 dias',      accent:'var(--safe)',   tone:'pistachio' },
  };

  return (
    <Phone>
      <div style={{ paddingBottom:96, background:'var(--canvas)', minHeight:'100%' }}>
        <div className="row between" style={{ padding:'14px 18px 4px' }}>
          <IconBtn variant="hairline" onClick={()=>onTab('home')}><I.ArrowLeft size={18}/></IconBtn>
          <div className="caption">Fila de validade</div>
          <IconBtn variant="hairline"><I.Filter size={18}/></IconBtn>
        </div>

        <div style={{ padding:'10px 18px 0' }}>
          <Eyebrow>Alertas</Eyebrow>
          <h1 className="display-lg" style={{ margin:'6px 0 12px' }}>
            O que decidir <i>hoje.</i>
          </h1>
          <p className="body" style={{ color:'var(--muted)', marginTop:0, marginBottom:14, fontSize:14 }}>
            Itens ordenados do mais urgente para o seguro. Toque para ver as ações disponíveis.
          </p>
        </div>

        {/* Filter chips */}
        <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'4px 18px 14px' }}>
          {[
            { id:'all',     label:'Todos',      count: all.length, tone:'ink' },
            { id:'expired', label:'Vencidos',   count: groups.expired.length, tone:'danger' },
            { id:'urgent',  label:'Urgentes',   count: groups.urgent.length, tone:'urgent' },
            { id:'soon',    label:'Próximos',   count: groups.soon.length, tone:'soon' },
            { id:'safe',    label:'Seguros',    count: items.filter(i=>['planned','safe'].includes(D.expiryStatus(i.expiresAt))).length, tone:'safe' },
          ].map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{
              flexShrink:0, height:38, padding:'0 14px',
              background: filter===f.id ? 'var(--ink)' : 'var(--surface)',
              color: filter===f.id ? 'var(--canvas)' : 'var(--ink)',
              boxShadow: filter===f.id ? 'none' : 'inset 0 0 0 1px var(--hairline)',
              border:0, borderRadius:999, cursor:'pointer',
              display:'inline-flex', alignItems:'center', gap:8,
              fontFamily:'var(--font-sans)', fontSize:13, fontWeight:500,
            }}>
              {f.label}
              <span style={{
                fontSize:11, padding:'2px 7px', borderRadius:999,
                background: filter===f.id ? 'rgba(250,245,235,0.2)' : 'var(--canvas)',
                color: filter===f.id ? 'var(--canvas)' : 'var(--muted)',
              }}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Groups */}
        <div className="col gap-18" style={{ padding:'0 18px' }}>
          {['expired','urgent','soon','planned','safe'].map(key => {
            const g = groups[key];
            if (!g.length) return null;
            const meta = groupMeta[key];
            return (
              <div key={key} className="col gap-10">
                <div className="row between" style={{ alignItems:'flex-end', paddingTop:6 }}>
                  <div className="col gap-2">
                    <div className="row gap-8" style={{ alignItems:'center' }}>
                      <div style={{ width:8, height:8, borderRadius:999, background: meta.accent }} />
                      <div className="title" style={{ fontSize:14 }}>{meta.title}</div>
                    </div>
                    <div className="body-sm" style={{ color:'var(--muted)', fontSize:12 }}>{meta.caption}</div>
                  </div>
                  <div className="display italic" style={{ fontSize:30 }}>{g.length}</div>
                </div>
                <div className="col gap-8">
                  {g.map(item => (
                    <FoodRow key={item.id} item={item} onPress={()=>openSheet && openSheet(item)} />
                  ))}
                </div>
              </div>
            );
          })}
          <div style={{ height:8 }}/>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  ScreenSplash, ScreenBiometric, ScreenOnboarding, ScreenLogin, ScreenSignUp,
  ScreenHome, ScreenAlerts,
});
