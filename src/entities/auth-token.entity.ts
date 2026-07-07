export interface AuthTokenEntity {
  id: string;
  status: string;
  email: string;
  password: string;
  token: string;
  expires_at: Date;
  revoked: boolean;
  created_at: Date;
}
