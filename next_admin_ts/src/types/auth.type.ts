export type LoginAuthProp = {
  status: number;
  message: string;
  data: string;
};

export type RegisterFormValues = {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  term_condition: boolean;
};

export type RegisterApiRes = {
  email?: string;
  name?: string;
  token?: string;
  created?: string;
  last_login?: string;
};

export type RegisterAuthProp = {
  status: number;
  message: string;
  data: RegisterApiRes;
};