import axios from "axios";
import { X_API_KEY,BASE_URL } from "@/helpers/utils";

export const deleteDocument = async (id) => {
  if(!id) return;
  try {
    const response = await axios.delete(`${BASE_URL}/documents/${id}`, {
      headers: {
        "x-api-key": X_API_KEY,
      },
    });
    return response.data
  } catch(error) {
    console.log(error)
  }
};
