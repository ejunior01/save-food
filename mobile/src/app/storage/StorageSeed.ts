import { PantryItem, Recipe, ShoppingItem } from '@app/types';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PantryStorage } from './PantryStorage';
import { RecipesStorage } from './RecipesStorage';
import { ShoppingStorage } from './ShoppingStorage';

const INITIALIZED_KEY = '@savefood:initialized_v4';

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const PHOTO = {
  tomato:   'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&q=80',
  bread:    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
  egg:      'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400&q=80',
  yogurt:   'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
  banana:   'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
  cheese:   'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80',
  chicken:  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80',
  pasta:    'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&q=80',
  avocado:  'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=400&q=80',
  apple:    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80',
  lettuce:  'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&q=80',
  milk:     'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
  fish:     'https://images.unsplash.com/photo-1535140728325-a4d3707eee94?w=400&q=80',
  carrot:   'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400&q=80',
  onion:    'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&q=80',

  recipe_pasta:  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80',
  recipe_omelet: 'https://images.unsplash.com/photo-1568625365131-079e026a927d?w=600&q=80',
  recipe_salad:  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  recipe_soup:   'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
  recipe_toast:  'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80',
  recipe_curry:  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80',
};

const PANTRY_ITEMS: PantryItem[] = [
  { id:'p1', name:'Tomate italiano',  category:'Vegetais',   expiresAt:addDays(0),  quantity:6,   unit:'un', emoji:'🍅', locationId:'loc_pantry', photo:PHOTO.tomato },
  { id:'p2', name:'Pão francês',      category:'Padaria',    expiresAt:addDays(1),  quantity:4,   unit:'un', emoji:'🍞', locationId:'loc_pantry', photo:PHOTO.bread },
  { id:'p3', name:'Iogurte natural',  category:'Laticínios', expiresAt:addDays(3),  quantity:2,   unit:'un', emoji:'🫙', locationId:'loc_fridge',  photo:PHOTO.yogurt },
  { id:'p4', name:'Banana prata',     category:'Frutas',     expiresAt:addDays(2),  quantity:5,   unit:'un', emoji:'🍌', locationId:'loc_pantry', photo:PHOTO.banana },
  { id:'p5', name:'Ovos caipira',     category:'Proteínas',  expiresAt:addDays(11), quantity:10,  unit:'un', emoji:'🥚', locationId:'loc_fridge',  photo:PHOTO.egg },
  { id:'p6', name:'Mussarela',        category:'Laticínios', expiresAt:addDays(5),  quantity:200, unit:'g',  emoji:'🧀', locationId:'loc_fridge',  photo:PHOTO.cheese },
  { id:'p7', name:'Peito de frango',  category:'Proteínas',  expiresAt:addDays(45), quantity:500, unit:'g',  emoji:'🍗', locationId:'loc_freezer', photo:PHOTO.chicken },
  { id:'p8', name:'Macarrão penne',   category:'Grãos',      expiresAt:addDays(180),quantity:500, unit:'g',  emoji:'🍝', locationId:'loc_pantry', photo:PHOTO.pasta },
  { id:'p9', name:'Abacate',          category:'Frutas',     expiresAt:addDays(4),  quantity:2,   unit:'un', emoji:'🥑', locationId:'loc_pantry', photo:PHOTO.avocado },
  { id:'p10',name:'Maçã gala',        category:'Frutas',     expiresAt:addDays(14), quantity:6,   unit:'un', emoji:'🍎', locationId:'loc_fridge',  photo:PHOTO.apple },
  { id:'p11',name:'Alface americana', category:'Vegetais',   expiresAt:addDays(-1), quantity:1,   unit:'un', emoji:'🥬', locationId:'loc_fridge',  photo:PHOTO.lettuce },
  { id:'p12',name:'Leite integral',   category:'Laticínios', expiresAt:addDays(7),  quantity:1,   unit:'L',  emoji:'🥛', locationId:'loc_fridge',  photo:PHOTO.milk },
  { id:'p13',name:'Filé de tilápia',  category:'Proteínas',  expiresAt:addDays(60), quantity:400, unit:'g',  emoji:'🐟', locationId:'loc_freezer', photo:PHOTO.fish },
  { id:'p14',name:'Cenoura',          category:'Vegetais',   expiresAt:addDays(8),  quantity:4,   unit:'un', emoji:'🥕', locationId:'loc_fridge',  photo:PHOTO.carrot },
  { id:'p15',name:'Cebola',           category:'Vegetais',   expiresAt:addDays(20), quantity:3,   unit:'un', emoji:'🧅', locationId:'loc_pantry', photo:PHOTO.onion },
];

const RECIPES: Recipe[] = [
  {
    id:'r1', title:'Macarrão ao pomodoro', duration:25, servings:3,
    category:'Massas', emoji:'🍝', photo:PHOTO.recipe_pasta,
    reason:'Usa tomate que vence hoje', have:5, total:6, level:'Fácil',
    missing:['Manjericão fresco'],
    ingredients:[
      { name:'Macarrão penne', amount:'300 g', have:true },
      { name:'Tomate italiano', amount:'6 un', have:true, urgent:true },
      { name:'Azeite', amount:'2 col', have:true },
      { name:'Alho', amount:'3 dentes', have:true },
      { name:'Cebola', amount:'1 un', have:true },
      { name:'Manjericão fresco', amount:'½ maço', have:false },
    ],
    steps:[
      'Doure o alho e a cebola no azeite, em fogo médio.',
      'Acrescente o tomate em cubos. Tempere com sal e cozinhe 15 min.',
      'Cozinhe o macarrão al dente em água fervente com sal.',
      'Misture o macarrão ao molho. Finalize com manjericão e azeite.',
    ],
  },
  {
    id:'r2', title:'Omelete de queijo', duration:10, servings:2,
    category:'Café', emoji:'🍳', photo:PHOTO.recipe_omelet,
    reason:'Aproveita ovos e mussarela', have:2, total:2, level:'Rápido',
    missing:[],
    ingredients:[
      { name:'Ovos caipira', amount:'4 un', have:true },
      { name:'Mussarela', amount:'80 g', have:true, urgent:true },
    ],
    steps:[
      'Bata os ovos com uma pitada de sal.',
      'Aqueça frigideira antiaderente com fio de azeite.',
      'Despeje os ovos. Quando firmar, adicione a mussarela.',
      'Dobre ao meio e sirva quentinho.',
    ],
  },
  {
    id:'r3', title:'Salada de abacate', duration:8, servings:2,
    category:'Saladas', emoji:'🥑', photo:PHOTO.recipe_salad,
    reason:'Abacate vence em 4 dias', have:3, total:4, level:'Cru',
    missing:['Limão'],
    ingredients:[
      { name:'Abacate', amount:'2 un', have:true, urgent:true },
      { name:'Alface americana', amount:'1 un', have:true },
      { name:'Cebola', amount:'½ un', have:true },
      { name:'Limão', amount:'1 un', have:false },
    ],
    steps:[
      'Corte o abacate em fatias finas.',
      'Lave e rasgue a alface em pedaços.',
      'Pique a cebola em fatias finas.',
      'Tempere com limão, sal e azeite.',
    ],
  },
  {
    id:'r4', title:'Sopa de legumes', duration:35, servings:4,
    category:'Sopas', emoji:'🥕', photo:PHOTO.recipe_soup,
    reason:'Aproveita cenoura e cebola', have:3, total:5, level:'Fácil',
    missing:['Batata', 'Caldo'],
    ingredients:[
      { name:'Cenoura', amount:'4 un', have:true },
      { name:'Cebola', amount:'1 un', have:true },
      { name:'Alho', amount:'2 dentes', have:true },
      { name:'Batata', amount:'2 un', have:false },
      { name:'Caldo de legumes', amount:'1 L', have:false },
    ],
    steps:[
      'Refogue cebola e alho.',
      'Acrescente cenoura e batata em cubos.',
      'Cubra com caldo e cozinhe 25 min.',
      'Bata no liquidificador se preferir cremosa.',
    ],
  },
  {
    id:'r5', title:'Bruschetta de tomate', duration:12, servings:2,
    category:'Entradas', emoji:'🍞', photo:PHOTO.recipe_toast,
    reason:'Pão e tomate em alerta', have:3, total:3, level:'Rápido',
    missing:[],
    ingredients:[
      { name:'Pão francês', amount:'4 un', have:true, urgent:true },
      { name:'Tomate italiano', amount:'3 un', have:true, urgent:true },
      { name:'Alho', amount:'1 dente', have:true },
    ],
    steps:[
      'Toste o pão cortado ao meio.',
      'Esfregue alho na superfície.',
      'Cubra com tomate picado e azeite.',
      'Finalize com sal grosso.',
    ],
  },
  {
    id:'r6', title:'Frango ao curry', duration:40, servings:4,
    category:'Carnes', emoji:'🍛', photo:PHOTO.recipe_curry,
    reason:'Você tem frango no freezer', have:4, total:6, level:'Médio',
    missing:['Leite de coco', 'Curry em pó'],
    ingredients:[
      { name:'Peito de frango', amount:'500 g', have:true },
      { name:'Cebola', amount:'1 un', have:true },
      { name:'Alho', amount:'2 dentes', have:true },
      { name:'Leite de coco', amount:'200 ml', have:false },
      { name:'Curry em pó', amount:'2 col', have:false },
    ],
    steps:[
      'Tempere e doure o frango.',
      'Refogue cebola e alho.',
      'Adicione curry e leite de coco.',
      'Sirva com arroz branco.',
    ],
  },
];

const INITIAL_SHOPPING: ShoppingItem[] = [
  { id:'s1', name:'Manjericão fresco', quantity:1, unit:'maço',   category:'Vegetais',  checked:false, source:'recipe' },
  { id:'s2', name:'Limão tahiti',      quantity:4, unit:'un',     category:'Frutas',    checked:false, source:'recipe' },
  { id:'s3', name:'Leite de coco',     quantity:1, unit:'lata',   category:'Mercearia', checked:false, source:'recipe' },
  { id:'s4', name:'Sabão em pó',       quantity:1, unit:'caixa',  category:'Limpeza',   checked:true,  source:'manual' },
  { id:'s5', name:'Café em grão',      quantity:1, unit:'kg',     category:'Mercearia', checked:false, source:'manual' },
  { id:'s6', name:'Iogurte natural',   quantity:6, unit:'un',     category:'Laticínios',checked:false, source:'replenishment', duplicate:true },
  { id:'s7', name:'Maçã gala',         quantity:1, unit:'kg',     category:'Frutas',    checked:true,  source:'manual' },
  { id:'s8', name:'Aveia em flocos',   quantity:1, unit:'pacote', category:'Mercearia', checked:false, source:'manual' },
];

export async function seed(): Promise<void> {
  const initialized = await AsyncStorage.getItem(INITIALIZED_KEY);
  if (initialized) return;
  await PantryStorage.save(PANTRY_ITEMS);
  await ShoppingStorage.save(INITIAL_SHOPPING);
  await RecipesStorage.save(RECIPES);
  await AsyncStorage.setItem(INITIALIZED_KEY, 'true');
}
