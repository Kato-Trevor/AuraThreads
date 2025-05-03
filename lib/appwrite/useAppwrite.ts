import { useToast } from "@/components/ToastProvider";
import { useEffect, useState } from "react";

const useAppwrite = (fn: () => Promise<any>) => {
  const { showToast } = useToast();
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fn();
      setData(response);
    } catch (error: any) {
      setError(error.message);
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, error, refetch, setLoading };
};

export default useAppwrite;
