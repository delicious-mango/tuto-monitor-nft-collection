/*
| Developed by Starton
| Filename : cryptoquartz-contract.axios-instance.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import axios from 'axios';

import {
  cryptoquartzCollectionAddress,
  network,
} from 'src/contracts/constants';

/*
|--------------------------------------------------------------------------
| AXIOS INSTANCE FOR SMART CONTRACT CALLS
|--------------------------------------------------------------------------
*/
export const contract = axios.create({
  baseURL:
    'https://api.starton.com/v3/smart-contract/' +
    network +
    '/' +
    cryptoquartzCollectionAddress +
    '/',
  headers: {
    'x-api-key': process.env.STARTON_API_KEY,
  },
});
