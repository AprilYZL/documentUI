import { useEffect, useState } from "react";
import axios from "axios";
import {
  X_API_KEY,
  BASE_URL,
} from "@/helpers/utils";

export const useDocuments = ({ page, limit }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const getDocuments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/documents`, {
          params: { page, limit },
          headers: { "X-API-Key": X_API_KEY },
        });
        setDocs(res.data.results || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    getDocuments();
  }, [page, limit]);

  return { docs, loading, error, setDocs };
};

export default useDocuments