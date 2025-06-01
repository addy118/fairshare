import { createApi } from "@reduxjs/toolkit/query/react";
import api from "@/axiosInstance";

const axiosBaseQuery = () => async (args) => {
  try {
    let result;
    if (typeof args === "string") {
      // If args is a string, treat it as a GET request URL
      result = await api.get(args);
    } else {
      const { url, method = "GET", data, params } = args;
      console.log("Request URL:", url);
      console.log("Request Method:", method);
      console.log("Request Data:", JSON.stringify(data, null, 2));

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
    // Group endpoints
    getGroupInfo: builder.query({
      query: (groupId) => `/grp/${groupId}/info`,
      transformResponse: (response) => {
        // console.log("Raw group response:", response);

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

        // Safely transform members if they exist
        if (response.members && Array.isArray(response.members)) {
          transformed.members = response.members.map((memberObj) => {
            const member = memberObj.member || memberObj;
            return {
              id: member.id,
              name: member.name || "Unknown Member",
              username: member.username,
              pfp: member.pfp,
            };
          });
        }

        // Safely calculate total expenses if they exist
        if (response.expenses && Array.isArray(response.expenses)) {
          transformed.totalExpenses = response.expenses.reduce(
            (sum, exp) => sum + (Number(exp.totalAmt) || 0),
            0
          );
        }

        // console.log("Transformed group data:", transformed);
        return transformed;
      },
      providesTags: ["Group"],
    }),

    getGroupBalances: builder.query({
      query: ({ groupId }) => `/grp/${groupId}/balance`,
      transformResponse: (response) => {
        // console.log("Raw balance response:", response);

        if (!response) {
          console.log("No balance data received");
          return [];
        }

        const transformed = response.map(({ user, amount }) => {
          // console.log("Processing balance entry:", { user, amount });
          return {
            id: user.id,
            name: user.name,
            balance: amount,
          };
        });

        // console.log("Transformed balance data:", transformed);
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
      // transformResponse: (response) => {
      //   console.log("Raw history response:", response);
        
      //   if (!response) {
      //     console.log("No history data received");
      //     return [];
      //   }

      //   const transformed = response.map((entry) => {
      //     console.log("Processing history entry:", entry);
      //     return {
      //       id: entry.id,
      //       balance: entry.balance,
      //       type: entry.type, 
      //       name: entry.name,
      //       totalAmt: entry.totalAmt,
      //       timestamp: entry.timestamp,
      //       payers: entry.payers?.map((payer) => {
      //         console.log("Processing payer:", payer);
      //         return {
      //           payer: {
      //             id: payer.payer.id,
      //             name: payer.payer.name,
      //             pfp: payer.payer.pfp,
      //           },
      //           paidAmt: payer.paidAmt || 0,
      //         };
      //       }) || [],
      //     };
      //   });

      //   console.log("Transformed history data:", transformed);
      //   return transformed;
      // },
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

    // Settlement endpoints
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

    // Expense endpoints
    createExpense: builder.mutation({
      query: (expenseData) => ({
        url: "/exp/new",
        method: "POST",
        data: expenseData,
      }),
      invalidatesTags: ["Expenses", "Group", "Balances", "History"],
    }),
  }),

  tagTypes: [
    "Expenses",
    "Groups",
    "Users",
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
