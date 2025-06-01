import { createApi } from "@reduxjs/toolkit/query/react";
import api from "@/axiosInstance";

const axiosBaseQuery = () => async (args) => {
  try {
    let result;
    if (typeof args === "string") {
      // treat string as a GET request URL
      result = await api.get(args);
    } else {
      const { url, method = "GET", data, params } = args;
      result = await api({
        url,
        method,
        data,
        params,
      });
    }
    return { data: result.data };
  } catch (error) {
    console.error("API Error:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    return {
      error: {
        status: error.response?.status,
        data: error.response?.data || error.message,
      },
    };
  }
};

export const fsApi = createApi({
  reducerPath: "fsApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    // group endpoints
    getGroupInfo: builder.query({
      query: (groupId) => `/grp/${groupId}/info`,
      transformResponse: (response) => {
        if (!response) {
          return null;
        }

        const transformed = {
          id: response.id,
          name: response.name || "Untitled Group",
          memberCount: response.members?.length || 0,
          expenses: response.expenses || [],
          totalExpenses: 0,
          members: [],
          createdAt: response.createdAt,
        };

        // safely transform members if they exist
        if (response.members && Array.isArray(response.members)) {
          transformed.members = response.members.map((memberObj) => {
            const member = memberObj.member || memberObj;
            return {
              id: member.id,
              name: member.name || "Unknown Member",
              username: member.username,
              pfp: member.pfp,
              upi: member.upi || "",
            };
          });
        }

        // safely calculate total expenses if they exist
        if (response.expenses && Array.isArray(response.expenses)) {
          transformed.totalExpenses = response.expenses.reduce(
            (sum, exp) => sum + (Number(exp.totalAmt) || 0),
            0
          );
        }

        return transformed;
      },
      providesTags: ["Group"],
    }),

    getGroupBalances: builder.query({
      query: ({ groupId }) => `/grp/${groupId}/balance`,
      transformResponse: (response) => {
        if (!response) {
          return [];
        }

        const transformed = response.map(({ user, amount }) => {
          return {
            id: user.id,
            name: user.name,
            pfp: user.pfp || "",
            balance: amount,
          };
        });

        return transformed;
      },
      providesTags: ["Balances"],
    }),

    getGroupExpenses: builder.query({
      query: (groupId) => `/grp/${groupId}/expenses`,
      providesTags: ["Expenses"],
    }),

    getGroupHistory: builder.query({
      query: (groupId) => `/grp/${groupId}/history`,
      providesTags: ["History"],
    }),

    getGroupSettlements: builder.query({
      query: (groupId) => `/grp/${groupId}/expenses`,
      transformResponse: (response) =>
        response.splits?.map((split) => ({
          ...split,
          from: split.debtor,
          to: split.creditor,
        })) || [],
      providesTags: ["Settlements"],
    }),

    addGroupMember: builder.mutation({
      query: ({ groupId, username }) => ({
        url: `/grp/${groupId}/member/new`,
        method: "POST",
        data: { username },
      }),
      invalidatesTags: ["Group", "Balances"],
    }),

    removeGroupMember: builder.mutation({
      query: ({ groupId, memberId }) => ({
        url: `/grp/${groupId}/member/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Group", "Balances"],
    }),

    // settlement endpoints
    optimizeSettlements: builder.mutation({
      query: (groupId) => ({
        url: `/grp/${groupId}/splits/min`,
        method: "GET",
      }),
      invalidatesTags: ["Settlements", "Balances"],
    }),

    settlePayment: builder.mutation({
      query: (settlementId) => ({
        url: `/exp/${settlementId}/settle`,
        method: "PUT",
      }),
      invalidatesTags: ["Settlements", "Balances"],
    }),

    confirmSettlement: builder.mutation({
      query: ({ settlementId, status }) => ({
        url: `/exp/${settlementId}/${status ? "confirm" : "not-confirm"}`,
        method: "PUT",
      }),
      invalidatesTags: ["Settlements", "Balances"],
    }),

    remindSettlement: builder.mutation({
      query: (settlementId) => ({
        url: `/exp/${settlementId}/remind`,
        method: "POST",
      }),
    }),

    // expense endpoints
    createExpense: builder.mutation({
      query: (expenseData) => ({
        url: "/exp/new",
        method: "POST",
        data: expenseData,
      }),
      invalidatesTags: [
        "Expenses",
        "Group",
        "Balances",
        "History",
        "Settlements",
      ],
    }),
  }),

  tagTypes: [
    "Expenses",
    // "Groups",
    // "Users",
    "Group",
    "Balances",
    "History",
    "Settlements",
  ],
});

export const {
  useGetGroupInfoQuery,
  useGetGroupBalancesQuery,
  useGetGroupExpensesQuery,
  useGetGroupHistoryQuery,
  useGetGroupSettlementsQuery,
  useAddGroupMemberMutation,
  useRemoveGroupMemberMutation,
  useOptimizeSettlementsMutation,
  useSettlePaymentMutation,
  useConfirmSettlementMutation,
  useRemindSettlementMutation,
  useCreateExpenseMutation,
} = fsApi;
