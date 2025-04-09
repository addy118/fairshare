import axios from "axios";
import { useEffect, useState } from "react";

// http://localhost:3000/posts
const useFeed = (url) => {
  const [feedData, setFeedData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(url, { signal: controller.signal })
      .then((res) => {
        console.log(res.data);
        setFeedData(res.data);
      })
      .catch((err) => {
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
      })
      .finally(() => setLoading(false));

    // clean-up function
    return () => controller.abort();
  }, [url]);

  return { feedData, error, loading };
};

export default useFeed;
