import { HttpUserSession } from '../users.interfaces';

export interface AuthReport {
  oauthAccessToken: string;
  oauthExpire: number;
  session: HttpUserSession;
}
