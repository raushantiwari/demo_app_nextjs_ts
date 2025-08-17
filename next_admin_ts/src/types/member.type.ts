export type BasicUserType = {
  email?: string;
  last_login?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
};
export type BasicUserProp = {
  status: number;
  message: string;
  data: BasicUserType;
};
