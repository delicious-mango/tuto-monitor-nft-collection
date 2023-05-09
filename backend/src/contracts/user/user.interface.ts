/*
| Developed by Starton
| Filename : user.interface.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

/*
|--------------------------------------------------------------------------
| USER INTERFACE
|--------------------------------------------------------------------------
*/
export interface User {
  id: string;
  email: string;
  password?: string;
  publicAddress: string;
  itemsIds: string[];
  createdAt: Date;
}
