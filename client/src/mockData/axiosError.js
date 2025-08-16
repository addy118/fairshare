const axiosError = {
  message: "Request failed with status code 400",
  name: "AxiosError",
  stack:
    "AxiosError: Request failed with status code 400\n    at settle (http://localhost:5173/node_modules/.vite/deps/axios.js?v=93a72d89:1218:12)\n    at XMLHttpRequest.onloadend (http://localhost:5173/node_modules/.vite/deps/axios.js?v=93a72d89:1550:7)\n    at Axios.request (http://localhost:5173/node_modules/.vite/deps/axios.js?v=93a72d89:2108:41)\n    at async handleCreateGroup (http://localhost:5173/src/components/NewGroupDialog.jsx?t=1748802936015:35:9)",
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {},
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yeHFPNmI5OEE2enRCRUxlOHFhVjZTUkRtVDEiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJleHAiOjE3NDg4MDMwMDUsImZ2YSI6WzE5ODQsLTFdLCJpYXQiOjE3NDg4MDI5NDUsImlzcyI6Imh0dHBzOi8vZW1lcmdpbmctc2Vhc25haWwtMjEuY2xlcmsuYWNjb3VudHMuZGV2IiwibmJmIjoxNzQ4ODAyOTM1LCJzaWQiOiJzZXNzXzJ4cjZXMjd4d1prb292Tkpqbmw5TjdGNXlaQyIsInN1YiI6InVzZXJfMnhyNlZ6MmhQY0F2aDBIbU1HYWNTSGFCd3NtIiwidiI6Mn0.zoRRh-oMplFVoH0iZCTIOLTeuDBUijYSssrtlsKTCjoy1A3KxXRKz8SV8R0yN4MlNaNWuLHPo5-_SUAInvcPuaR0TAaKgRWgE2cmJ0eB8PsrccER9VsV_s58K6etalRDw7apO73TtLDLBbX1EVyymnhawoWz3xjkaY3OETOMEThKYLQAkiTZMBot2k3IZwq-7W_ukPw01nDtc7RIm8povu48FW9e_KuEhTx9gWxJPNwi6gtps1NNM2UeTNVwhPUY7W1dP2v7TEoU1wf9lp2Lf52oOgExyxbDo5rueC708F01Jqu5v5VAvAVtsBacTheNNo6Ye_G8QQa4mImzuMR1JA",
    },
    baseURL: "http://localhost:3000",
    withCredentials: true,
    method: "post",
    url: "/grp/3/member/new",
    data: '{"username":"hi"}',
    allowAbsoluteUrls: true,
  },
  
  code: "ERR_BAD_REQUEST",
  status: 400,
};