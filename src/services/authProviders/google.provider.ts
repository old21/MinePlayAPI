import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleProvider {
  private CLIENT = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET_KEY,
    process.env.GOOGLE_REDIRECT_URI,
  );

  private scopes = ['openid', 'profile', 'email'];

  async getRedirectURL(clientId: string) {
    return this.CLIENT.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      include_granted_scopes: true,
      state: clientId,
    });
  }

  /**
     * Sample data
     * 
     *  data: {
            id: '110259293601717232340',
            email: 'winvertg@gmail.com',
            verified_email: true,
            name: 'old.',
            given_name: 'old.',
            picture: 'https://lh3.googleusercontent.com/a/ACg8ocIpnGx5IiRxZW1sQcczkU9d2l_o3wOp07xfEaBgNFnaCIxGVavN=s96-c',
            locale: 'ru'
        },
     */
  async callback(request) {
    const { tokens } = await this.CLIENT.getToken(request.code);
    this.CLIENT.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: this.CLIENT });
    const userInfo = await oauth2.userinfo.get();

    return userInfo.data;
  }
}
