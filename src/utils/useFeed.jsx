import api from "@/axiosInstance";
import { useEffect, useState } from "react";

const useGroup = (url) => {
  const [groupData, setGroupData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // step 1 - initialize controller and config it
    const controller = new AbortController();
    const config = { signal: controller.signal };

    const fetchGroup = async () => {
      try {
        // step 2 - add controller config
        const response = await api.get(url, config);
        console.log(response.data);
        setGroupData(response.data);
      } catch (err) {
        if (err.response) {
          console.log(`HTTP Error: ${err.response.status}`);
          setError(err.response);
        } else if (err.request) {
          console.log("Request Error: No response received");
          setError(err.request);
        } else {
          console.log(`Error: ${err.message}`);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();

    // step 3 - clean-up function
    return () => controller.abort();
  }, [url]);

  return { groupData, error, loading };
};

export default useGroup;
