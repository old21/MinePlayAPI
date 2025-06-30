import { Injectable } from '@nestjs/common';
import * as Client from 'discord-oauth2';

@Injectable()
export class DiscordProvider {
  private CLIENT = new Client({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_SECRET_KEY,
    redirectUri: process.env.DISCORD_REDIRECT_URI,
  });

  private scopes = ['identify', 'email'];

  getRedirectURL() {
    return this.CLIENT.generateAuthUrl({ scope: this.scopes });
  }

  async callback(request) {
    try {
      const token = await this.CLIENT.tokenRequest({
        code: request.code,
        grantType: 'authorization_code',
        scope: this.scopes,
      });
      console.log(token);
      const userInfo = await this.CLIENT.getUser(
        'Bearer ' + token.access_token,
      );
      console.log(userInfo);
      return userInfo;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
