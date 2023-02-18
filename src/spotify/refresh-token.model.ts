export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: 3600;
  scope: string;
}
