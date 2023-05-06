export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  username?: string;
  role: RoleType;
  avatar: string;
}
