import client from "./client";

export const createProductImage = (
  productId: number | string,
  image: File
) => {
  const formData = new FormData();

  formData.append("image", image);

  return client.post(
    `/products/${productId}/images/`,
    formData
  );
};