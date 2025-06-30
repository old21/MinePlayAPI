export interface UserAssets {
  SKIN: UserAsset;
  AVATAR: UserAsset;
  CAPE?: UserAsset;
}

interface AssetMeta {
  model: string;
}
interface UserAsset {
  url: string;
  metadata?: AssetMeta;
  digest: string;
}

export interface HttpUser {
  username: string;
  uuid: string;
  accessToken: string;
  assets: UserAssets;
}

export interface HttpUserSession {
  id: string;
  user: HttpUser;
  expireIn: number;
}
