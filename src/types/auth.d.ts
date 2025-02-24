export type SigninCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  user_role_id: number;
  name: string;
  email: string;
  is_enabled: number;
  created_at: string;
  updated_at: string;
  user_role: any;
};

export type AuthStoreData = {
  session: string;
  user?: AuthUser;
  token: string;
};
