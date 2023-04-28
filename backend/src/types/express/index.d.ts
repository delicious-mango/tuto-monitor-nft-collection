import { JwtPayload } from 'src/auth/jwt-payload/jwt-payload.interface';

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}
