/*
| Developed by Starton
| Filename : transfer-single.interface.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

/*
|--------------------------------------------------------------------------
| SINGLE NFT TRANSFER INTERFACE
|--------------------------------------------------------------------------
*/
export interface TransferSingle {
  from: string;
  to: string;
  id: {
    hex: string;
    raw: string;
  };
}
