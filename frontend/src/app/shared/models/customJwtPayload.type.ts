import { JwtPayload } from 'jwt-decode';

export type customJwtPayload = JwtPayload & {
  userId: number;
  username: string;
  isAdmin: boolean;
};
