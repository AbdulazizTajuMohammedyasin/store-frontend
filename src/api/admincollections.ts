import apiClient from "./client";

export interface FeaturedProductDetails {
  title: string;
  image: string | null;
}

export interface AdminCollection {
  id: number;
  title: string;
  featured_product: number | null;
  featured_product_details: FeaturedProductDetails | null;
  products_count: number;
}

export interface CollectionInput {
  title: string;
  featured_product: number | null;
}

export const getAdminCollections = async () => {
  const response = await apiClient.get<AdminCollection[]>(
    "/admin-collections/"
  );

  return response.data;
};

export const createAdminCollection = async (
  data: CollectionInput
) => {
  const response = await apiClient.post<AdminCollection>(
    "/admin-collections/",
    data
  );

  return response.data;
};

export const updateAdminCollection = async (
  id: number,
  data: CollectionInput
) => {
  const response = await apiClient.patch<AdminCollection>(
    `/admin-collections/${id}/`,
    data
  );

  return response.data;
};

export const deleteAdminCollection = async (id: number) => {
  await apiClient.delete(`/admin-collections/${id}/`);
};