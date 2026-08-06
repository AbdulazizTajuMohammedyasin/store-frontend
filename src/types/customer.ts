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