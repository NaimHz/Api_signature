import { UUID } from 'crypto';

export type AccessTokenPayload = {
  userId: number;
  email: string;
};
