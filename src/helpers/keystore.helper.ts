import * as fs from 'fs';

const keystorePath = 'keystore/jwt';

export const JwtAPIKeypair = {
  public: fs.readFileSync(`${keystorePath}/api/public.key`, 'ascii'),
  private: fs.readFileSync(`${keystorePath}/api/private.key`, 'ascii'),
};

export const JwtLauncherKeypair = {
  public: fs.readFileSync(`${keystorePath}/launcher/public.key`, 'ascii'),
  private: fs.readFileSync(`${keystorePath}/launcher/private.key`, 'ascii'),
};
