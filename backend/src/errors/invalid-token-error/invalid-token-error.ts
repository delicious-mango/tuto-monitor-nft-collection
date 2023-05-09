/*
| Developed by Starton
| Filename : invalid-token-error.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

/*
|--------------------------------------------------------------------------
| INVALID TOKEN ERROR
|--------------------------------------------------------------------------
*/
export class InvalidTokenError extends Error {
  constructor(message?: string) {
    super(message);

    this.name = 'InvalidTokenError';
  }
}
