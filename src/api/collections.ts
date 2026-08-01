import client from "./client";
import type { Collection } from "../types";

export const getCollections = () => {
  return client.get<Collection[]>("/collections/");
};