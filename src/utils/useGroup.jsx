import api from "@/axiosInstance";
import React, { useEffect, useState } from "react";
import format from "./formatGroup";
import { useAuth } from "@/authProvider";
import { fetchGroupData } from "./fetchGroupData";

export default function useGroupData(groupId) {
  const { user } = useAuth();
  const [data, setData] = useState({
    group: {},
    balances: [],
    expenses: [],
    settlements: [],
    history: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const groupInfo = await fetchGroupData(groupId, user.id);
        setData(groupInfo);
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

    fetchData();
  }, [groupId]);

  return { ...data, loading, error };
}
