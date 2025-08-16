export type UserProp = {
  id?: number;
  google_id?: string;
  email?: string;
  password?: string;
  name?: string;
  created?: string;
  last_login?: string;
  status?: boolean;
};

export type BasicUserProp = {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
};

export type UserSessionProp = {
  user_id?: number;
  token?: string;
  hostname?: string;
  created_at?: string;
};

export type UserProfileProp = {
  id?: number;
  user_id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  social_fb?: string;
  social_linkdin?: string;
  social_insta?: string;
  created?: string;
};

export type UserAddressProp = {
  user_id?: string;
  email?: string;
  country?: string;
  state?: string;
  postal?: string;
  city?: string;
};

export type RolesProp = {
  role_id?: number;
  role_name?: string;
};

export type RolesUsersProp = {
  user_id?: number;
  email?: string;
  role_id?: number;
  status?: boolean;
};
