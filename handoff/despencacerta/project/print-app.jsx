/* global React, ReactDOM */
// ────────────────────────────────────────────────────────────────────────────
// DespensaCerta — Print/PDF version
// Renders every screen as its own page (no canvas chrome)
// ────────────────────────────────────────────────────────────────────────────

const { useState } = React;
const Dp = window.DC_DATA;

const SECTIONS = [
  {
    id: 'cover',
    title: 'DespensaCerta',
    sub: 'Sistema de gestão doméstica de alimentos',
    screens: [], // cover page is special
  },
  {
    id: 'entry',
    title: 'Entrada',
    sub: 'Primeiro contato e retorno do usuário',
    screens: [
      { key:'splash',     label:'Splash · primeira abertura' },
      { key:'biometric',  label:'Biometric · usuário recorrente' },
      { key:'onboarding', label:'Onboarding · 3 slides editoriais' },
      { key:'login',      label:'Login · com biometria' },
      { key:'signup',     label:'Cadastro · LGPD' },
    ],
  },
  {
    id: 'core',
    title: 'Núcleo da rotina',
    sub: 'Telas usadas todos os dias',
    screens: [
      { key:'home',          label:'Home · Use primeiro' },
      { key:'alerts',        label:'Alertas · fila de decisão' },
      { key:'inventory',     label:'Despensa · por local' },
      { key:'addfood',       label:'Adicionar · scanner + manual' },
      { key:'aiRecognize',   label:'IA · reconhecimento (Premium)' },
      { key:'aiGate',        label:'IA · paywall (usuário Free)' },
    ],
  },
  {
    id: 'meal',
    title: 'Aproveitamento',
    sub: 'Cozinhe e planeje com o que você tem',
    screens: [
      { key:'recipes',       label:'Receitas · sugeridas pelo inventário' },
      { key:'recipeDetail',  label:'Receita · detalhe' },
      { key:'shopping',      label:'Compras · com aviso de duplicidade' },
      { key:'mealPlanner',   label:'Planejador semanal' },
    ],
  },
  {
    id: 'impact',
    title: 'Impacto · fechando o loop',
    sub: 'Consumo, descarte e métricas',
    screens: [
      { key:'consume',       label:'Consumir / Descartar' },
      { key:'insights',      label:'Insights · desperdício e economia' },
      { key:'donate',        label:'Doação · alternativa ao descarte' },
      { key:'replenish',     label:'Reposição inteligente' },
    ],
  },
  {
    id: 'household',
    title: 'Casa compartilhada',
    sub: 'Múltiplas pessoas, uma despensa',
    screens: [
      { key:'household',     label:'Casa · membros + atividade' },
      { key:'houseProfile',  label:'Perfil da casa · restrições + orçamento' },
    ],
  },
  {
    id: 'power',
    title: 'Power features',
    sub: 'Recursos avançados',
    screens: [
      { key:'nfe',           label:'Importar NFe · QR da nota fiscal' },
      { key:'search',        label:'Busca global' },
      { key:'alertSettings', label:'Alertas por categoria' },
      { key:'notifications', label:'Notificações · preview + ajustes' },
    ],
  },
  {
    id: 'first',
    title: 'Primeira experiência + estados',
    sub: 'Onboarding contextual e empty states',
    screens: [
      { key:'onboardInv',    label:'Onboarding · popular despensa em 60s' },
      { key:'emptyStates',   label:'Empty states · 4 variantes' },
    ],
  },
];

function PrintScreen({ keyName, recipeId='r1' }) {
  const noop = ()=>{};
  const props = { goto: noop, onTab: noop, onAdd: noop, openSheet: noop };
  switch (keyName) {
    case 'splash':       return <window.ScreenSplash goto={noop} />;
    case 'biometric':    return <window.ScreenBiometric goto={noop} />;
    case 'onboarding':   return <window.ScreenOnboarding goto={noop} />;
    case 'login':        return <window.ScreenLogin goto={noop} />;
    case 'signup':       return <window.ScreenSignUp goto={noop} />;
    case 'home':         return <window.ScreenHome {...props} />;
    case 'alerts':       return <window.ScreenAlerts {...props} />;
    case 'inventory':    return <window.ScreenInventory {...props} />;
    case 'shopping':     return <window.ScreenShopping {...props} />;
    case 'recipes':      return <window.ScreenRecipes {...props} />;
    case 'recipeDetail': return <window.ScreenRecipeDetail recipeId={recipeId} {...props} />;
    case 'addfood':      return <window.ScreenAddFood onClose={noop} premium={true}/>;
    case 'aiRecognize':  return <window.ScreenAIRecognize onClose={noop} premium={true} startState="detected"/>;
    case 'aiGate':       return <window.ScreenAIRecognize onClose={noop} premium={false}/>;
    case 'consume':      return <window.ScreenConsumeDiscard onClose={noop} item={Dp.FOOD_ITEMS[3]}/>;
    case 'insights':     return <window.ScreenInsights {...props}/>;
    case 'household':    return <window.ScreenHousehold {...props}/>;
    case 'replenish':    return <window.ScreenReplenishment {...props} onClose={noop}/>;
    case 'alertSettings':return <window.ScreenAlertSettings onClose={noop}/>;
    case 'houseProfile': return <window.ScreenHouseholdProfile onClose={noop}/>;
    case 'nfe':          return <window.ScreenNFeImport onClose={noop}/>;
    case 'mealPlanner':  return <window.ScreenMealPlanner onClose={noop}/>;
    case 'search':       return <window.ScreenSearch onClose={noop}/>;
    case 'onboardInv':   return <window.ScreenOnboardingInventory onClose={noop}/>;
    case 'notifications':return <window.ScreenNotifications onClose={noop}/>;
    case 'donate':       return <window.ScreenDonate onClose={noop} item={Dp.FOOD_ITEMS[0]}/>;
    case 'emptyStates':  return <window.ScreenEmptyStates onClose={noop}/>;
    default: return <div/>;
  }
}

// Determine tab visibility
const NO_TAB = new Set([
  'splash','biometric','onboarding','login','signup','addfood','aiRecognize','aiGate',
  'consume','onboardInv','donate','nfe','emptyStates','search','notifications',
  'alertSettings','houseProfile','mealPlanner','replenish',
]);

// Translate screen key → bottom-tab key (when shown)
const TAB_FOR = {
  home:'home', alerts:'alerts', inventory:'inventory',
  shopping:'shopping', recipes:'recipes', recipeDetail:'recipes',
  insights:'home', household:'home',
};

function PhonePage({ screen, sectionTitle, idx, total }) {
  return (
    <div className="print-page">
      <header className="page-head">
        <div className="head-left">
          <div className="head-section">{sectionTitle}</div>
          <h2 className="head-title">{screen.label}</h2>
        </div>
        <div className="head-right">
          <div className="head-brand">
            <strong>DespensaCerta</strong> <span>· redesign 2026</span>
          </div>
          <div className="head-page">{String(idx).padStart(2,'0')} / {String(total).padStart(2,'0')}</div>
        </div>
      </header>

      <div className="phone-stage">
        <window.AndroidDevice width={380} height={820}>
          <div style={{ position:'relative', height:'100%' }}>
            <PrintScreen keyName={screen.key} />
            {!NO_TAB.has(screen.key) && (
              <window.DC_UI.TabBar active={TAB_FOR[screen.key]} onChange={()=>{}} onAdd={()=>{}} />
            )}
          </div>
        </window.AndroidDevice>
      </div>

      <footer className="page-foot">
        <span>despensacerta.app</span>
        <span>{screen.key}</span>
      </footer>
    </div>
  );
}

function CoverPage() {
  const sections = SECTIONS.filter(s => s.screens.length > 0);
  const total = sections.reduce((n,s)=>n+s.screens.length, 0);
  return (
    <div className="print-page cover">
      <div className="cover-eyebrow">· redesign · 2026 ·</div>
      <h1 className="cover-title">
        Despensa<i>Certa</i>
      </h1>
      <p className="cover-sub">
        Sistema editorial-doméstico de gestão de alimentos.<br/>
        Cuide do que está em casa antes de virar lixo.
      </p>

      <div className="cover-stat-row">
        <div className="cover-stat">
          <div className="n">{total}</div>
          <div className="l">Telas redesenhadas</div>
        </div>
        <div className="cover-stat">
          <div className="n">{sections.length}</div>
          <div className="l">Seções funcionais</div>
        </div>
        <div className="cover-stat">
          <div className="n">100%</div>
          <div className="l">Native Android</div>
        </div>
      </div>

      <div className="cover-toc">
        <div className="toc-head">Sumário</div>
        {sections.map((s, i) => (
          <div key={s.id} className="toc-row">
            <span className="toc-num">{String(i+1).padStart(2,'0')}</span>
            <span className="toc-title">{s.title}</span>
            <span className="toc-leader"></span>
            <span className="toc-count">{s.screens.length} {s.screens.length===1?'tela':'telas'}</span>
          </div>
        ))}
      </div>

      <footer className="cover-foot">
        <span>despensacerta.app</span>
        <span>Maio · 2026</span>
      </footer>
    </div>
  );
}

function PrintApp() {
  // Flatten screens with page numbers
  const sections = SECTIONS.filter(s => s.screens.length > 0);
  const flatScreens = sections.flatMap(s => s.screens.map(scr => ({ ...scr, section: s.title })));
  const total = flatScreens.length;

  return (
    <>
      <CoverPage />
      {flatScreens.map((scr, i) => (
        <PhonePage key={scr.key} screen={scr} sectionTitle={scr.section} idx={i+1} total={total} />
      ))}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PrintApp/>);

// Auto-print: wait for fonts + render
(async () => {
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch(e){}
  await new Promise(r => setTimeout(r, 800));
  if (!window.__printed) {
    window.__printed = true;
    window.print();
  }
})();
