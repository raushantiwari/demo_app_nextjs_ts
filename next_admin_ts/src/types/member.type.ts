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

export type AddressProp = {
  country: string;
  state: string;
  postal: string;
  city: string;
};

export type MemberShortProfile = {
  phone?: string;
  bio?: string;
  social_fb?: string;
  social_linkdin?: string;
  social_insta?: string;
};

export type MemberProfileProp = {
  status: number;
  message: string;
  data: BasicUserType & AddressProp & MemberShortProfile;
};

