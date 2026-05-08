import axios from 'axios';

export const openFoodFactsApi = axios.create({
  baseURL: 'https://br.openfoodfacts.org/api/v2',
  timeout: 10000,
});
