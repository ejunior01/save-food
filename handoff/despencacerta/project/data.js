/* global window */
// ────────────────────────────────────────────────────────────────────────────
// DespensaCerta — seed data & helpers
// ────────────────────────────────────────────────────────────────────────────

const PHOTO = {
  // Reliable Unsplash photos (food). The CDN supports ?w= sizing param.
  tomato:    "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=600&q=80",
  bread:     "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  egg:       "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=600&q=80",
  yogurt:    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
  banana:    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80",
  cheese:    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80",
  chicken:   "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
  pasta:     "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600&q=80",
  olive:     "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
  avocado:   "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80",
  apple:     "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80",
  lettuce:   "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&q=80",
  milk:      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80",
  fish:      "https://images.unsplash.com/photo-1535140728325-a4d3707eee94?w=600&q=80",
  rice:      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
  carrot:    "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&q=80",
  onion:     "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=600&q=80",
  garlic:    "https://images.unsplash.com/photo-1615477550927-6ec8444b1407?w=600&q=80",
  basil:     "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80",
  // Recipes
  recipe_pasta:   "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
  recipe_omelet:  "https://images.unsplash.com/photo-1568625365131-079e026a927d?w=800&q=80",
  recipe_salad:   "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  recipe_soup:    "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
  recipe_toast:   "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
  recipe_curry:   "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
  // Hero / brand
  hero_pantry:    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80",
  hero_market:    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&q=80",
  hero_cook:      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=900&q=80",
  avatar:         "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
};

// ── Today reference (deterministic for prototype) ──────────────────────────
const TODAY = new Date(2026, 4, 24); // May 24, 2026
function addDays(n) { const d = new Date(TODAY); d.setDate(d.getDate() + n); return d; }
function daysUntil(d) {
  const ms = new Date(d).setHours(0,0,0,0) - TODAY.setHours(0,0,0,0);
  return Math.round(ms / 86400000);
}
function expiryStatus(d) {
  const x = daysUntil(d);
  if (x <= 0) return 'expired';
  if (x <= 5) return 'urgent';
  if (x <= 15) return 'soon';
  if (x <= 30) return 'planned';
  return 'safe';
}
function expiryLabel(d) {
  const x = daysUntil(d);
  if (x < 0)  return `Venceu há ${Math.abs(x)}d`;
  if (x === 0) return 'Vence hoje';
  if (x === 1) return 'Vence amanhã';
  if (x <= 30) return `${x} dias`;
  return `${Math.round(x/30)} mês`;
}
function fmtDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
}
function chipToneFor(status) {
  return ({
    expired: 'chip-danger',
    urgent:  'chip-urgent',
    soon:    'chip-soon',
    planned: 'chip-neutral',
    safe:    'chip-safe',
  })[status] || 'chip-neutral';
}

// ── Storage Locations ─────────────────────────────────────────────────────
const LOCATIONS = [
  { id: 'pantry', name: 'Despensa',  icon: 'pantry' },
  { id: 'fridge', name: 'Geladeira', icon: 'fridge' },
  { id: 'freezer', name: 'Freezer',  icon: 'freezer' },
];

// ── Inventory (Food Items) ─────────────────────────────────────────────────
const FOOD_ITEMS = [
  { id:'f1', name:'Tomate italiano',    qty:6,  unit:'un',  category:'Vegetais',  locationId:'fridge', expiresAt:addDays(0),  photo:PHOTO.tomato },
  { id:'f2', name:'Pão francês',         qty:4,  unit:'un',  category:'Padaria',   locationId:'pantry', expiresAt:addDays(1),  photo:PHOTO.bread },
  { id:'f3', name:'Iogurte natural',     qty:2,  unit:'un',  category:'Laticínios',locationId:'fridge', expiresAt:addDays(3),  photo:PHOTO.yogurt },
  { id:'f4', name:'Banana prata',        qty:5,  unit:'un',  category:'Frutas',    locationId:'pantry', expiresAt:addDays(2),  photo:PHOTO.banana },
  { id:'f5', name:'Ovos caipira',        qty:10, unit:'un',  category:'Proteínas', locationId:'fridge', expiresAt:addDays(11), photo:PHOTO.egg },
  { id:'f6', name:'Mussarela fatiada',   qty:200,unit:'g',   category:'Laticínios',locationId:'fridge', expiresAt:addDays(5),  photo:PHOTO.cheese },
  { id:'f7', name:'Peito de frango',     qty:500,unit:'g',   category:'Proteínas', locationId:'freezer',expiresAt:addDays(45), photo:PHOTO.chicken },
  { id:'f8', name:'Macarrão penne',      qty:500,unit:'g',   category:'Grãos',     locationId:'pantry', expiresAt:addDays(180),photo:PHOTO.pasta },
  { id:'f9', name:'Azeite extra virgem', qty:500,unit:'ml',  category:'Mercearia', locationId:'pantry', expiresAt:addDays(240),photo:PHOTO.olive },
  { id:'f10',name:'Abacate',             qty:2,  unit:'un',  category:'Frutas',    locationId:'pantry', expiresAt:addDays(4),  photo:PHOTO.avocado },
  { id:'f11',name:'Maçã gala',           qty:6,  unit:'un',  category:'Frutas',    locationId:'fridge', expiresAt:addDays(14), photo:PHOTO.apple },
  { id:'f12',name:'Alface americana',    qty:1,  unit:'un',  category:'Vegetais',  locationId:'fridge', expiresAt:addDays(-1), photo:PHOTO.lettuce },
  { id:'f13',name:'Leite integral',      qty:1,  unit:'L',   category:'Laticínios',locationId:'fridge', expiresAt:addDays(7),  photo:PHOTO.milk },
  { id:'f14',name:'Filé de tilápia',     qty:400,unit:'g',   category:'Proteínas', locationId:'freezer',expiresAt:addDays(60), photo:PHOTO.fish },
  { id:'f15',name:'Arroz branco',        qty:1,  unit:'kg',  category:'Grãos',     locationId:'pantry', expiresAt:addDays(150),photo:PHOTO.rice },
  { id:'f16',name:'Cenoura',             qty:4,  unit:'un',  category:'Vegetais',  locationId:'fridge', expiresAt:addDays(8),  photo:PHOTO.carrot },
  { id:'f17',name:'Cebola',              qty:3,  unit:'un',  category:'Vegetais',  locationId:'pantry', expiresAt:addDays(20), photo:PHOTO.onion },
  { id:'f18',name:'Alho',                qty:1,  unit:'un',  category:'Vegetais',  locationId:'pantry', expiresAt:addDays(30), photo:PHOTO.garlic },
];

// ── Recipes ────────────────────────────────────────────────────────────────
const RECIPES = [
  {
    id:'r1', title:'Macarrão ao pomodoro', emoji:'🍝',
    photo: PHOTO.recipe_pasta,
    duration:25, servings:3, level:'Fácil',
    reason: 'Usa tomate que vence hoje',
    matchedIds:['f1','f8','f9','f18','f17'],
    have: 5, total: 6,
    missing: ['Manjericão fresco'],
    ingredients:[
      { name:'Macarrão penne', qty:'300 g', have:true },
      { name:'Tomate italiano', qty:'6 un', have:true, urgent:true },
      { name:'Azeite extra virgem', qty:'2 colheres', have:true },
      { name:'Alho', qty:'3 dentes', have:true },
      { name:'Cebola', qty:'1 un', have:true },
      { name:'Manjericão fresco', qty:'½ maço', have:false },
    ],
    steps:[
      'Doure o alho e a cebola no azeite, em fogo médio.',
      'Acrescente o tomate em cubos. Tempere com sal e cozinhe 15 minutos.',
      'Cozinhe o macarrão al dente em água fervente com sal.',
      'Misture o macarrão ao molho. Finalize com manjericão e azeite.',
    ],
  },
  {
    id:'r2', title:'Omelete de queijo', emoji:'🍳',
    photo: PHOTO.recipe_omelet,
    duration:10, servings:2, level:'Rápido',
    reason: 'Aproveita ovos e mussarela',
    matchedIds:['f5','f6'],
    have:2, total:2, missing:[],
    ingredients:[
      { name:'Ovos caipira', qty:'4 un', have:true },
      { name:'Mussarela fatiada', qty:'80 g', have:true, urgent:true },
    ],
    steps:[
      'Bata os ovos com uma pitada de sal.',
      'Aqueça uma frigideira antiaderente com fio de azeite.',
      'Despeje os ovos. Quando começar a firmar, adicione a mussarela.',
      'Dobre ao meio e sirva quentinho.',
    ],
  },
  {
    id:'r3', title:'Salada de abacate', emoji:'🥑',
    photo: PHOTO.recipe_salad,
    duration:8, servings:2, level:'Cru',
    reason: 'Abacate vence em 4 dias',
    matchedIds:['f10','f12','f17'],
    have:3, total:4, missing:['Limão'],
    ingredients:[
      { name:'Abacate', qty:'2 un', have:true, urgent:true },
      { name:'Alface americana', qty:'1 un', have:true },
      { name:'Cebola roxa', qty:'½ un', have:true },
      { name:'Limão', qty:'1 un', have:false },
    ],
    steps:[
      'Corte o abacate em fatias finas.',
      'Lave e rasgue a alface em pedaços.',
      'Pique a cebola roxa em fatias bem finas.',
      'Tempere com limão, sal e azeite.',
    ],
  },
  {
    id:'r4', title:'Sopa de legumes', emoji:'🥕',
    photo: PHOTO.recipe_soup,
    duration:35, servings:4, level:'Fácil',
    reason: 'Aproveita cenoura e cebola',
    matchedIds:['f16','f17','f18'],
    have:3, total:5, missing:['Batata', 'Caldo de legumes'],
    ingredients:[
      { name:'Cenoura', qty:'4 un', have:true },
      { name:'Cebola', qty:'1 un', have:true },
      { name:'Alho', qty:'2 dentes', have:true },
      { name:'Batata', qty:'2 un', have:false },
      { name:'Caldo de legumes', qty:'1 L', have:false },
    ],
    steps:['Refogue cebola e alho.','Acrescente cenoura e batata em cubos.','Cubra com caldo e cozinhe 25 min.','Bata no liquidificador se preferir cremosa.'],
  },
  {
    id:'r5', title:'Bruschetta de tomate', emoji:'🍞',
    photo: PHOTO.recipe_toast,
    duration:12, servings:2, level:'Rápido',
    reason: 'Pão e tomate em alerta',
    matchedIds:['f1','f2','f18'],
    have:3, total:3, missing:[],
    ingredients:[
      { name:'Pão francês', qty:'4 un', have:true, urgent:true },
      { name:'Tomate italiano', qty:'3 un', have:true, urgent:true },
      { name:'Alho', qty:'1 dente', have:true },
    ],
    steps:['Toste o pão cortado ao meio.','Esfregue alho na superfície.','Cubra com tomate picado e azeite.','Finalize com sal grosso.'],
  },
  {
    id:'r6', title:'Frango ao curry', emoji:'🍛',
    photo: PHOTO.recipe_curry,
    duration:40, servings:4, level:'Médio',
    reason: 'Você tem frango no freezer',
    matchedIds:['f7','f17','f18','f15'],
    have:4, total:6, missing:['Leite de coco', 'Curry em pó'],
    ingredients:[
      { name:'Peito de frango', qty:'500 g', have:true },
      { name:'Arroz branco', qty:'2 xícaras', have:true },
      { name:'Cebola', qty:'1 un', have:true },
      { name:'Alho', qty:'2 dentes', have:true },
      { name:'Leite de coco', qty:'200 ml', have:false },
      { name:'Curry em pó', qty:'2 colheres', have:false },
    ],
    steps:['Tempere e doure o frango.','Refogue cebola e alho.','Adicione curry e leite de coco.','Sirva com arroz branco.'],
  },
];

// ── Shopping list ─────────────────────────────────────────────────────────
const SHOPPING_ITEMS = [
  { id:'s1', name:'Manjericão fresco',  qty:1, unit:'maço',   category:'Vegetais',  checked:false, source:'recipe', recipeId:'r1' },
  { id:'s2', name:'Limão tahiti',       qty:4, unit:'un',     category:'Frutas',    checked:false, source:'recipe', recipeId:'r3' },
  { id:'s3', name:'Leite de coco',      qty:1, unit:'lata',   category:'Mercearia', checked:false, source:'recipe', recipeId:'r6' },
  { id:'s4', name:'Sabão em pó',        qty:1, unit:'caixa',  category:'Limpeza',   checked:true,  source:'manual' },
  { id:'s5', name:'Café em grão',       qty:1, unit:'kg',     category:'Mercearia', checked:false, source:'manual' },
  { id:'s6', name:'Iogurte natural',    qty:6, unit:'un',     category:'Laticínios',checked:false, source:'replenishment', duplicate:true },
  { id:'s7', name:'Maçã gala',          qty:1, unit:'kg',     category:'Frutas',    checked:true,  source:'manual' },
  { id:'s8', name:'Aveia em flocos',    qty:1, unit:'pacote', category:'Mercearia', checked:false, source:'manual' },
];

// ── Categories ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name:'Vegetais',    color:'var(--block-sage)',     emoji:'🥬' },
  { name:'Frutas',      color:'var(--block-peach)',    emoji:'🍎' },
  { name:'Laticínios',  color:'var(--block-cream)',    emoji:'🥛' },
  { name:'Proteínas',   color:'var(--block-rose)',     emoji:'🍗' },
  { name:'Grãos',       color:'var(--block-pistachio)',emoji:'🌾' },
  { name:'Padaria',     color:'#E8D2A8',               emoji:'🍞' },
  { name:'Mercearia',   color:'#DCC9A3',               emoji:'🫒' },
  { name:'Limpeza',     color:'#D6D6CC',               emoji:'🧴' },
];

function catColor(name) {
  return (CATEGORIES.find(c=>c.name===name) || {}).color || 'var(--surface-soft)';
}
function catEmoji(name) {
  return (CATEGORIES.find(c=>c.name===name) || {}).emoji || '🍽️';
}
function locName(id) { return (LOCATIONS.find(l=>l.id===id)||{}).name || ''; }

// Expose
Object.assign(window, {
  DC_DATA: {
    PHOTO, TODAY, LOCATIONS, FOOD_ITEMS, RECIPES, SHOPPING_ITEMS, CATEGORIES,
    addDays, daysUntil, expiryStatus, expiryLabel, fmtDate, chipToneFor,
    catColor, catEmoji, locName,
  },
});
