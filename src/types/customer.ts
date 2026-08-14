export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  birth_date: string | null;
  membership: string;
  profile_image: string | null;
}

export type MembershipCode = "B" | "S" | "G";
 
export interface CustomerAdmin {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  birth_date: string | null;
  membership: MembershipCode;
}
 
export interface UpdateCustomerMembershipData {
  membership: MembershipCode;
}