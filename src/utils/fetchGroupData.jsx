import api from "@/axiosInstance";
import format from "./formatGroup";

export const fetchGroupData = async (groupId, userId) => {
  const [groupRes, balancesRes, expensesRes, historyRes] = await Promise.all([
    api.get(`/grp/${groupId}/info`),
    api.get(`/grp/${groupId}/balance`),
    api.get(`/grp/${groupId}/expenses`),
    api.get(`/grp/${groupId}/history`),
  ]);

  const groupData = format.groupData(groupRes.data);
  const balanceData = format.balanceData(balancesRes.data, userId);
  const settlementsData = format.settlementsData(expensesRes.data.splits);

  return {
    group: groupData,
    balances: balanceData,
    expenses: expensesRes.data,
    settlements: settlementsData,
    history: historyRes.data,
  };
};

export const fetchGroup = async (groupId) => {
  const response = await api.get(`/grp/${groupId}/info`);
  const groupData = format.groupData(response.data);
  return groupData;
};

export const fetchBalances = async (groupId, userId) => {
  const response = await api.get(`/grp/${groupId}/balance`);
  const balanceData = format.balanceData(response.data, userId);
  return balanceData;
};

export const fetchExpensesAndSettlments = async (groupId) => {
  const response = await api.get(`/grp/${groupId}/expenses`);
  const expensesData = response.data;
  const settlementsData = format.settlementsData(expensesData.splits);
  return { expensesData, settlementsData };
};

export const fetchHistory = async (groupId) => {
  const response = await api.get(`/grp/${groupId}/history`);
  return response.data;
};

