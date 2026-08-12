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

export const deleteProductImage = (
  productId: number | string,
  imageId: number | string
) => {
  return client.delete(
    `/products/${productId}/images/${imageId}/`
  );
};