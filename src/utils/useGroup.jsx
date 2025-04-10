import api from "@/axiosInstance";
import React, { useEffect, useState } from "react";

export default function useGroupData(groupId) {
  const [data, setData] = useState({
    group: null,
    balances: [],
    expenses: [],
    history: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [groupRes, balancesRes, expensesRes, historyRes] =
          await Promise.all([
            api.get(`/grp/${groupId}/info`),
            api.get(`/grp/${groupId}/balance`),
            api.get(`/grp/${groupId}/expenses`),
            api.get(`/grp/${groupId}/history`),
          ]);

        console.log(groupRes.data);
        console.log(balancesRes.data);
        console.log(expensesRes.data);
        console.log(historyRes.data);

        setData({
          group: groupRes.data,
          balances: balancesRes.data,
          expenses: expensesRes.data,
          history: historyRes.data,
        });
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
        console.log("loading set to false");
      }
    };

    fetchData();
  }, [groupId]);

  return { ...data, loading, error };
}
