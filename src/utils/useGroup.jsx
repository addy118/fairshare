import api from "@/axiosInstance";
import React, { useEffect, useState } from "react";
import format from "./formatGroup";
import { useAuth } from "@/authProvider";

export default function useGroupData(groupId) {
  const { user } = useAuth();
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

        const groupData = format.groupData(groupRes.data);
        const balanceData = format.balanceData(balancesRes.data, user.id);
        // console.log(balanceData);
        // console.log(expensesRes.data);
        // console.log(historyRes.data);

        setData({
          group: groupData,
          balances: balanceData,
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
