/* global React, ReactDOM */
// ────────────────────────────────────────────────────────────────────────────
// DespensaCerta — Root app: navigable Prototype + Design Canvas + Tweaks
// ────────────────────────────────────────────────────────────────────────────

const { useState, useEffect, useRef, useMemo } = React;
const U = window.DC_UI;
const D = window.DC_DATA;

// ════════════════════════════════════════════════════════════════════════════
// usePremium — subscribes to tweak changes
// ════════════════════════════════════════════════════════════════════════════
function usePremium() {
  const [p, setP] = useState(() => window.__premium !== false);
  useEffect(() => {
    const h = e => setP(!!e.detail);
    window.addEventListener('premiumchange', h);
    return () => window.removeEventListener('premiumchange', h);
  }, []);
  return p;
}

// ════════════════════════════════════════════════════════════════════════════
// Navigable Prototype — single phone, switches screens
// ════════════════════════════════════════════════════════════════════════════
function Prototype({ start = 'home', showTab = true, height = 820, width = 380 }) {
  const [route, setRoute] = useState({ name: start });
  const [sheet, setSheet] = useState(null); // food action sheet
  const [addOpen, setAddOpen] = useState(false);
  const [storageTip, setStorageTip] = useState(null); // { foodId, premium }
  const histRef = useRef([]);
  const premium = usePremium();

  function goto(next) {
    if (typeof next === 'string') next = { name: next };
    histRef.current.push(route);
    setRoute(next);
  }
  function back() {
    const last = histRef.current.pop();
    if (last) setRoute(last);
  }
  function onTab(tab) {
    // Tab keys → screen names
    const map = { home:'home', alerts:'alerts', inventory:'inventory', shopping:'shopping', recipes:'recipes' };
    goto({ name: map[tab] || tab });
  }
  function openSheet(item) { setSheet(item); }

  const isTabScreen = ['home','alerts','inventory','shopping','recipes','recipeDetail'].includes(route.name);
  const tabFor = ({ home:'home', alerts:'alerts', inventory:'inventory', shopping:'shopping', recipes:'recipes', recipeDetail:'recipes' })[route.name];

  function renderScreen() {
    const props = { goto, onTab, onAdd: ()=>setAddOpen(true), openSheet };
    switch (route.name) {
      case 'splash':       return <window.ScreenSplash goto={goto} />;
      case 'biometric':    return <window.ScreenBiometric goto={goto} />;
      case 'onboarding':   return <window.ScreenOnboarding goto={goto} />;
      case 'login':        return <window.ScreenLogin goto={goto} />;
      case 'signup':       return <window.ScreenSignUp goto={goto} />;
      case 'home':         return <window.ScreenHome {...props} />;
      case 'alerts':       return <window.ScreenAlerts {...props} />;
      case 'inventory':    return <window.ScreenInventory {...props} />;
      case 'shopping':     return <window.ScreenShopping {...props} />;
      case 'recipes':      return <window.ScreenRecipes {...props} />;
      case 'recipeDetail': return <window.ScreenRecipeDetail recipeId={route.recipeId} {...props} />;
      default:             return <window.ScreenHome {...props} />;
    }
  }

  // Auth-y screens hide the tab bar
  const isAuth = ['splash','biometric','onboarding','login','signup'].includes(route.name);

  return (
    <div data-screen-label={`Prototype — ${route.name}`} style={{ position:'relative' }}>
      <window.AndroidDevice width={width} height={height}>
        <div style={{ position:'relative', height:'100%' }}>
          {renderScreen()}

          {/* Tab bar (on app screens) */}
          {!isAuth && showTab && (
            <window.DC_UI.TabBar
              active={tabFor}
              onChange={onTab}
              onAdd={()=>setAddOpen(true)}
            />
          )}

          {/* Action sheet */}
          {sheet && (
            <window.ActionSheet
              item={sheet}
              onClose={()=>setSheet(null)}
              goto={goto}
              premium={premium}
              openStorageTip={(item, isPremium) => {
                // Map item name → tip id (best-effort)
                const name = (item.name || '').toLowerCase();
                let id = 'tomato';
                if (name.includes('banana')) id = 'banana';
                else if (name.includes('abacate')) id = 'avocado';
                else if (name.includes('alface')) id = 'lettuce';
                else if (name.includes('maçã')) id = 'apple';
                else if (name.includes('tomate')) id = 'tomato';
                setStorageTip({ foodId: id, premium: isPremium });
              }}
            />
          )}

          {/* Storage tip overlay */}
          {storageTip && (
            <div style={{ position:'absolute', inset:0, zIndex:55 }}>
              <window.ScreenStorageTip
                foodId={storageTip.foodId}
                premium={storageTip.premium}
                onClose={()=>setStorageTip(null)}
              />
            </div>
          )}

          {/* Add overlay */}
          {addOpen && (
            <div style={{ position:'absolute', inset:0, zIndex:60 }}>
              <window.ScreenAddFood onClose={()=>setAddOpen(false)} goto={goto} premium={premium} />
            </div>
          )}
        </div>
      </window.AndroidDevice>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Single-screen artboard — for the design canvas
// ════════════════════════════════════════════════════════════════════════════
function FrameArtboard({ screen, label, sheet=false, addOpen=false, recipeId='r1' }) {
  // Simplified: render a static screen (no real nav state)
  const noop = ()=>{};
  const premium = usePremium();
  const props = { goto: noop, onTab: noop, onAdd: noop, openSheet: noop };
  let S;
  switch (screen) {
    case 'splash':       S = <window.ScreenSplash goto={noop} />; break;
    case 'biometric':    S = <window.ScreenBiometric goto={noop} />; break;
    case 'onboarding':   S = <window.ScreenOnboarding goto={noop} />; break;
    case 'login':        S = <window.ScreenLogin goto={noop} />; break;
    case 'signup':       S = <window.ScreenSignUp goto={noop} />; break;
    case 'home':         S = <window.ScreenHome {...props} />; break;
    case 'alerts':       S = <window.ScreenAlerts {...props} />; break;
    case 'inventory':    S = <window.ScreenInventory {...props} />; break;
    case 'shopping':     S = <window.ScreenShopping {...props} />; break;
    case 'recipes':      S = <window.ScreenRecipes {...props} />; break;
    case 'recipeDetail': S = <window.ScreenRecipeDetail recipeId={recipeId} {...props} />; break;
    case 'addfood':      S = <window.ScreenAddFood onClose={noop} premium={premium}/>; break;
    case 'aiRecognize':  S = <window.ScreenAIRecognize onClose={noop} premium={true} startState="detected"/>; break;
    case 'aiGate':       S = <window.ScreenAIRecognize onClose={noop} premium={false}/>; break;
    case 'storageTip':   S = <window.ScreenStorageTip onClose={noop} foodId="banana" premium={true}/>; break;
    case 'storageLibrary': S = <window.ScreenStorageLibrary onClose={noop} premium={true}/>; break;
    case 'storageGate':  S = <window.ScreenStorageTip onClose={noop} foodId="banana" premium={false}/>; break;
    case 'consume':      S = <window.ScreenConsumeDiscard onClose={noop} item={D.FOOD_ITEMS[3]}/>; break;
    case 'insights':     S = <window.ScreenInsights {...props} />; break;
    case 'household':    S = <window.ScreenHousehold {...props} />; break;
    case 'replenish':    S = <window.ScreenReplenishment {...props} onClose={noop}/>; break;
    case 'alertSettings': S = <window.ScreenAlertSettings onClose={noop}/>; break;
    case 'houseProfile': S = <window.ScreenHouseholdProfile onClose={noop}/>; break;
    case 'nfe':          S = <window.ScreenNFeImport onClose={noop}/>; break;
    case 'mealPlanner':  S = <window.ScreenMealPlanner onClose={noop}/>; break;
    case 'search':       S = <window.ScreenSearch onClose={noop}/>; break;
    case 'onboardInv':   S = <window.ScreenOnboardingInventory onClose={noop}/>; break;
    case 'notifications':S = <window.ScreenNotifications onClose={noop}/>; break;
    case 'donate':       S = <window.ScreenDonate onClose={noop} item={D.FOOD_ITEMS[0]}/>; break;
    case 'emptyStates':  S = <window.ScreenEmptyStates onClose={noop}/>; break;
    default:             S = <div/>;
  }

  const isAuth = ['splash','biometric','onboarding','login','signup','addfood','consume','onboardInv','donate','nfe','emptyStates','search','notifications','alertSettings','houseProfile','mealPlanner','replenish','insights','household','aiRecognize','aiGate','storageTip','storageLibrary','storageGate'].includes(screen);
  const tabFor = ({ home:'home', alerts:'alerts', inventory:'inventory', shopping:'shopping', recipes:'recipes', recipeDetail:'recipes' })[screen];

  return (
    <window.AndroidDevice width={380} height={820}>
      <div style={{ position:'relative', height:'100%' }}>
        {S}
        {!isAuth && (
          <window.DC_UI.TabBar active={tabFor} onChange={noop} onAdd={noop} />
        )}
        {sheet && <window.ActionSheet item={D.FOOD_ITEMS[0]} onClose={noop} goto={noop} />}
      </div>
    </window.AndroidDevice>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Tweaks panel
// ════════════════════════════════════════════════════════════════════════════
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "forest",
  "fontDisplay": "Instrument Serif",
  "fontSans": "Geist",
  "density": "cozy",
  "cards": "hairline",
  "radius": "pill",
  "premium": true
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const root = document.documentElement;

  // Expose premium globally so all screens can read it reactively
  window.__premium = !!t.premium;
  window.dispatchEvent(new CustomEvent('premiumchange', { detail: t.premium }));

  // Palette swap (primary + key accents)
  const palettes = {
    forest: {
      primary: '#1F4D2E',
      canvas:  '#FAF5EB',
      block_pistachio: '#D5E2A8',
      block_peach:     '#F2C57C',
      block_rose:      '#EAB5A8',
    },
    olive: {
      primary: '#3A4A1F',
      canvas:  '#F2EFDF',
      block_pistachio: '#CFE0A6',
      block_peach:     '#E8B673',
      block_rose:      '#D8A498',
    },
    rust: {
      primary: '#7A3320',
      canvas:  '#FBF1E5',
      block_pistachio: '#D7E2A8',
      block_peach:     '#F3B97A',
      block_rose:      '#E89E8A',
    },
    indigo: {
      primary: '#1E2B5C',
      canvas:  '#F4F2EC',
      block_pistachio: '#CFD9F4',
      block_peach:     '#F0C679',
      block_rose:      '#E9AEB0',
    },
  };
  const p = palettes[t.palette] || palettes.forest;
  root.style.setProperty('--primary', p.primary);
  root.style.setProperty('--canvas', p.canvas);
  root.style.setProperty('--block-pistachio', p.block_pistachio);
  root.style.setProperty('--block-peach', p.block_peach);
  root.style.setProperty('--block-rose', p.block_rose);

  // Fonts
  const dispFonts = {
    'Instrument Serif': "'Instrument Serif', Georgia, serif",
    'Fraunces':         "'Fraunces', Georgia, serif",
    'DM Serif Display': "'DM Serif Display', Georgia, serif",
    'PP Editorial':     "'Bricolage Grotesque', Georgia, serif",
  };
  const sansFonts = {
    'Geist':    "'Geist', system-ui, sans-serif",
    'DM Sans':  "'DM Sans', system-ui, sans-serif",
    'Inter':    "'Inter', system-ui, sans-serif",
    'Manrope':  "'Manrope', system-ui, sans-serif",
  };
  root.style.setProperty('--font-display', dispFonts[t.fontDisplay] || dispFonts['Instrument Serif']);
  root.style.setProperty('--font-sans', sansFonts[t.fontSans] || sansFonts['Geist']);

  // Density + cards + radius (scope classes on body)
  document.body.classList.remove('density-compact','density-cozy','density-roomy');
  document.body.classList.add(`density-${t.density}`);
  document.body.classList.remove('cards-hairline','cards-shadow','cards-block');
  document.body.classList.add(`cards-${t.cards}`);
  document.body.classList.remove('radius-pill','radius-rounded','radius-sharp');
  document.body.classList.add(`radius-${t.radius}`);
}

function TweaksUI() {
  if (!window.useTweaks || !window.TweaksPanel) return null;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  useEffect(() => { applyTweaks(t); }, [t]);

  const TP = window.TweaksPanel;
  const TSection = window.TweakSection;
  const TRadio = window.TweakRadio;
  const TSelect = window.TweakSelect;
  const TToggle = window.TweakToggle;

  return (
    <TP>
      <TSection title="Conta">
        <TToggle
          label="Conta Premium"
          value={t.premium}
          onChange={v=>setTweak('premium', v)}
        />
      </TSection>

      <TSection title="Paleta">
        <TRadio
          label="Atalho"
          value={t.palette}
          onChange={v=>setTweak('palette', v)}
          options={[
            { label:'Forest', value:'forest' },
            { label:'Olive',  value:'olive' },
            { label:'Rust',   value:'rust' },
            { label:'Indigo', value:'indigo' },
          ]}
        />
      </TSection>

      <TSection title="Tipografia">
        <TSelect
          label="Display (serif)"
          value={t.fontDisplay}
          onChange={v=>setTweak('fontDisplay', v)}
          options={['Instrument Serif','Fraunces','DM Serif Display','PP Editorial']}
        />
        <TSelect
          label="Sans (body)"
          value={t.fontSans}
          onChange={v=>setTweak('fontSans', v)}
          options={['Geist','DM Sans','Inter','Manrope']}
        />
      </TSection>

      <TSection title="Layout">
        <TRadio
          label="Densidade"
          value={t.density}
          onChange={v=>setTweak('density', v)}
          options={[
            { label:'Compacto', value:'compact' },
            { label:'Cozy',     value:'cozy' },
            { label:'Arejado',  value:'roomy' },
          ]}
        />
        <TRadio
          label="Cantos"
          value={t.radius}
          onChange={v=>setTweak('radius', v)}
          options={[
            { label:'Pill',     value:'pill' },
            { label:'Rounded',  value:'rounded' },
            { label:'Sharp',    value:'sharp' },
          ]}
        />
        <TRadio
          label="Cards"
          value={t.cards}
          onChange={v=>setTweak('cards', v)}
          options={[
            { label:'Hairline', value:'hairline' },
            { label:'Shadow',   value:'shadow' },
            { label:'Block',    value:'block' },
          ]}
        />
      </TSection>
    </TP>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Root canvas — Prototype hero + smaller showcase frames
// ════════════════════════════════════════════════════════════════════════════
function App() {
  const { DCArtboard, DCSection } = window;
  const DesignCanvas = window.DesignCanvas;
  if (!DesignCanvas) return <div>Loading design canvas…</div>;

  return (
    <React.Fragment>
      <DesignCanvas
        title="DespensaCerta — Redesign"
        subtitle="Editorial doméstico · serif + cremes · fotografia real · estrutura color-block do DESIGN.md"
      >
        <DCSection id="proto" title="Protótipo navegável">
          <DCArtboard id="proto-home" label="Use o protótipo (toque nas tabs e cards)" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100%', padding:20 }}>
              <Prototype start="home" />
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection id="entry" title="Entrada — primeiro contato e retorno">
          <DCArtboard id="splash"     label="Splash · primeira abertura" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="splash" /></div>
          </DCArtboard>
          <DCArtboard id="biometric" label="Biometric · usuário recorrente (estilo Nubank)" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="biometric" /></div>
          </DCArtboard>
          <DCArtboard id="onboarding" label="Onboarding · só para novos usuários" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="onboarding" /></div>
          </DCArtboard>
          <DCArtboard id="login"      label="Login · com opção biometria" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="login" /></div>
          </DCArtboard>
          <DCArtboard id="signup"     label="Cadastro · LGPD" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="signup" /></div>
          </DCArtboard>
        </DCSection>

        <DCSection id="core" title="Núcleo da rotina">
          <DCArtboard id="home"      label="Home · Use primeiro" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="home" /></div>
          </DCArtboard>
          <DCArtboard id="alerts"    label="Alertas · fila de decisão" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="alerts" /></div>
          </DCArtboard>
          <DCArtboard id="inventory" label="Despensa · por local" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="inventory" /></div>
          </DCArtboard>
          <DCArtboard id="add"       label="Adicionar · scanner + manual" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="addfood" /></div>
          </DCArtboard>
          <DCArtboard id="ai-recognize" label="IA · reconhecimento de frutas e verduras (Premium)" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="aiRecognize" /></div>
          </DCArtboard>
          <DCArtboard id="ai-gate" label="IA · paywall (usuário sem Premium)" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="aiGate" /></div>
          </DCArtboard>
          <DCArtboard id="storage-library" label="Onde guardar · biblioteca (Premium)" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="storageLibrary" /></div>
          </DCArtboard>
          <DCArtboard id="storage-tip" label="Onde guardar · dica detalhada (banana)" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="storageTip" /></div>
          </DCArtboard>
          <DCArtboard id="storage-gate" label="Onde guardar · paywall (Free)" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="storageGate" /></div>
          </DCArtboard>
        </DCSection>

        <DCSection id="meal" title="Aproveitamento">
          <DCArtboard id="recipes"   label="Receitas · sugeridas pelo inventário" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="recipes" /></div>
          </DCArtboard>
          <DCArtboard id="recipe-detail" label="Receita · detalhe" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="recipeDetail" recipeId="r1" /></div>
          </DCArtboard>
          <DCArtboard id="shopping"  label="Compras · com aviso de duplicidade" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="shopping" /></div>
          </DCArtboard>
          <DCArtboard id="meal-planner" label="Planejador semanal de refeições" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="mealPlanner" /></div>
          </DCArtboard>
        </DCSection>

        <DCSection id="impact" title="Impacto · fechando o loop">
          <DCArtboard id="consume"   label="Consumir / Descartar · tela dedicada" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="consume" /></div>
          </DCArtboard>
          <DCArtboard id="insights"  label="Insights · desperdício e economia" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="insights" /></div>
          </DCArtboard>
          <DCArtboard id="donate"    label="Doação · alternativa ao descarte" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="donate" /></div>
          </DCArtboard>
          <DCArtboard id="replenish" label="Reposição inteligente" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="replenish" /></div>
          </DCArtboard>
        </DCSection>

        <DCSection id="household" title="Casa compartilhada">
          <DCArtboard id="household-home" label="Casa · membros + atividade" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="household" /></div>
          </DCArtboard>
          <DCArtboard id="house-profile" label="Perfil da casa · restrições + orçamento" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="houseProfile" /></div>
          </DCArtboard>
        </DCSection>

        <DCSection id="power" title="Power features">
          <DCArtboard id="nfe"      label="Importar NFe · popular despensa via QR" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="nfe" /></div>
          </DCArtboard>
          <DCArtboard id="search"   label="Busca global · inventário + receitas + lista" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="search" /></div>
          </DCArtboard>
          <DCArtboard id="alerts-settings" label="Alertas por categoria" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="alertSettings" /></div>
          </DCArtboard>
          <DCArtboard id="notifs"   label="Notificações · preview + ajustes" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="notifications" /></div>
          </DCArtboard>
        </DCSection>

        <DCSection id="first-time" title="Primeira experiência + estados vazios">
          <DCArtboard id="onboard-inv" label="Onboarding · popular despensa em 60s" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="onboardInv" /></div>
          </DCArtboard>
          <DCArtboard id="empty"    label="Empty states · 4 variantes" width={420} height={860}>
            <div style={{ display:'flex', justifyContent:'center', padding:20 }}><FrameArtboard screen="emptyStates" /></div>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksUI />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
