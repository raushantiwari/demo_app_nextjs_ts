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

type AddtionalProp = {
  created?: string;
  status?: boolean;
};

export type MemberListingProp = {
  status: number;
  message: string;
  data: (BasicUserType & AddtionalProp)[];
};
