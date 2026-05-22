import { PantryItem, Recipe, ShoppingItem } from '@app/types';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PantryStorage } from './PantryStorage';
import { RecipesStorage } from './RecipesStorage';
import { ShoppingStorage } from './ShoppingStorage';

const INITIALIZED_KEY = '@savefood:initialized_v3';

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const PANTRY_ITEMS: PantryItem[] = [
  { id: 'p1', name: 'Leite', category: 'Laticínios', expiresAt: addDays(-1), quantity: 1, unit: 'L', emoji: '🥛', locationId: 'loc_pantry' },
  { id: 'p2', name: 'Tomate', category: 'Legumes', expiresAt: addDays(0), quantity: 4, unit: 'un', emoji: '🍅', locationId: 'loc_pantry' },
  { id: 'p3', name: 'Queijo', category: 'Laticínios', expiresAt: addDays(1), quantity: 200, unit: 'g', emoji: '🧀', locationId: 'loc_pantry' },
  { id: 'p4', name: 'Pão', category: 'Padaria', expiresAt: addDays(2), quantity: 1, unit: 'un', emoji: '🍞', locationId: 'loc_pantry' },
  { id: 'p5', name: 'Alface', category: 'Folhosas', expiresAt: addDays(3), quantity: 1, unit: 'un', emoji: '🥬', locationId: 'loc_pantry' },
  { id: 'p6', name: 'Banana', category: 'Frutas', expiresAt: addDays(4), quantity: 5, unit: 'un', emoji: '🍌', locationId: 'loc_pantry' },
  { id: 'p7', name: 'Maçã', category: 'Frutas', expiresAt: addDays(5), quantity: 6, unit: 'un', emoji: '🍎', locationId: 'loc_pantry' },
  { id: 'p8', name: 'Iogurte', category: 'Laticínios', expiresAt: addDays(6), quantity: 2, unit: 'un', emoji: '🫙', locationId: 'loc_pantry' },
  { id: 'p9', name: 'Ovo', category: 'Proteínas', expiresAt: addDays(7), quantity: 12, unit: 'un', emoji: '🥚', locationId: 'loc_pantry' },
  { id: 'p10', name: 'Frango', category: 'Proteínas', expiresAt: addDays(1), quantity: 500, unit: 'g', emoji: '🍗', locationId: 'loc_pantry' },
  { id: 'p11', name: 'Cenoura', category: 'Legumes', expiresAt: addDays(3), quantity: 3, unit: 'un', emoji: '🥕', locationId: 'loc_pantry' },
  { id: 'p12', name: 'Peixe', category: 'Proteínas', expiresAt: addDays(10), quantity: 300, unit: 'g', emoji: '🐟', locationId: 'loc_pantry' },
];

const RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Macarrão ao Tomate',
    duration: 20,
    servings: 2,
    category: 'Massas',
    emoji: '🍝',
    imageUrl: 'https://todeschinialimentos.com.br/images/receitas/22/todeschini-imagem-receitas-macarrao-com-tomate-cereja-e-queijo-1-xl.webp',
    ingredients: [
      { name: 'Macarrão', amount: '200g' },
      { name: 'Tomate', amount: '3 un' },
      { name: 'Queijo', amount: '50g' },
      { name: 'Alho', amount: '2 dentes' },
    ],
    steps: [
      'Cozinhe o macarrão em água com sal por 8 minutos.',
      'Refogue o alho picado no azeite até dourar.',
      'Adicione o tomate em cubos e cozinhe por 5 minutos.',
      'Misture o macarrão ao molho e sirva com queijo ralado.',
    ],
  },
  {
    id: 'r2',
    title: 'Panqueca de Banana',
    duration: 15,
    servings: 4,
    category: 'Café da manhã',
    emoji: '🥞',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      { name: 'Banana', amount: '2 un' },
      { name: 'Ovo', amount: '2 un' },
      { name: 'Leite', amount: '100ml' },
      { name: 'Farinha', amount: '1 xícara' },
    ],
    steps: [
      'Amasse as bananas com um garfo até virar purê.',
      'Misture os ovos, o leite e a farinha até obter uma massa homogênea.',
      'Adicione o purê de banana à massa.',
      'Cozinhe em frigideira antiaderente por 2 minutos de cada lado.',
    ],
  },
  {
    id: 'r3',
    title: 'Salada Verde',
    duration: 10,
    servings: 2,
    category: 'Saladas',
    emoji: '🥗',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      { name: 'Alface', amount: '1 pé' },
      { name: 'Tomate', amount: '2 un' },
      { name: 'Cenoura', amount: '1 un' },
    ],
    steps: [
      'Higienize e rasgue a alface em pedaços.',
      'Corte o tomate em rodelas e a cenoura em julienne.',
      'Misture tudo numa tigela e tempere com azeite, sal e limão.',
    ],
  },
  {
    id: 'r4',
    title: 'Sopa de Legumes',
    duration: 30,
    servings: 4,
    category: 'Sopas',
    emoji: '🍲',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      { name: 'Cenoura', amount: '2 un' },
      { name: 'Frango', amount: '300g' },
      { name: 'Alface', amount: 'folhas' },
      { name: 'Cebola', amount: '1 un' },
    ],
    steps: [
      'Refogue a cebola em azeite até ficar transparente.',
      'Adicione o frango em cubos e doure levemente.',
      'Acrescente a cenoura em rodelas e cubra com água.',
      'Cozinhe em fogo baixo por 20 minutos. Ajuste o sal.',
    ],
  },
  {
    id: 'r5',
    title: 'Torrada com Ovo',
    duration: 10,
    servings: 1,
    category: 'Café da manhã',
    emoji: '🍳',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      { name: 'Pão', amount: '2 fatias' },
      { name: 'Ovo', amount: '2 un' },
      { name: 'Queijo', amount: '30g' },
    ],
    steps: [
      'Torre as fatias de pão na torradeira.',
      'Frite os ovos na manteiga ao gosto.',
      'Monte as torradas com queijo e o ovo por cima.',
    ],
  },
];

const INITIAL_SHOPPING: ShoppingItem[] = [
  { id: 's1', name: 'Arroz', quantity: 2, unit: 'kg', category: 'Grãos', checked: false },
  { id: 's2', name: 'Feijão', quantity: 1, unit: 'kg', category: 'Grãos', checked: false },
  { id: 's3', name: 'Azeite', quantity: 1, unit: 'L', category: 'Temperos', checked: false },
  { id: 's4', name: 'Sal', quantity: 1, unit: 'kg', category: 'Temperos', checked: true },
  { id: 's5', name: 'Detergente', quantity: 2, unit: 'un', category: 'Limpeza', checked: false },
  { id: 's6', name: 'Esponja', quantity: 1, unit: 'un', category: 'Limpeza', checked: true },
];

export async function seed(): Promise<void> {
  const initialized = await AsyncStorage.getItem(INITIALIZED_KEY);
  if (initialized) { return; }
  await PantryStorage.save(PANTRY_ITEMS);
  await ShoppingStorage.save(INITIAL_SHOPPING);
  await RecipesStorage.save(RECIPES);
  await AsyncStorage.setItem(INITIALIZED_KEY, 'true');
}
