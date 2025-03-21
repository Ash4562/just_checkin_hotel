import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AuthAPI = createApi({
  reducerPath: "AuthAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEDN_URL}/api/v1/hotel`,
    credentials: "include", // Include credentials like cookies
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // Fetch token from localStorage
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Add Authorization header
      }
      return headers;
    },
  }),
  tagTypes: ["auth", "Profile"], // Define tag types for cache invalidation
  endpoints: (builder) => ({
    RegisterHotel: builder.mutation({
      query: (userData) => ({
        url: "/registerhotel",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["auth"], // Invalidate tags
    }),

    VerifyOTP: builder.mutation({
      query: (otpData) => ({
        url: "/verify-otp",
        method: "POST",
        body: otpData,
      }),
      invalidatesTags: ["auth"],
    }),

    ForgotPassword: builder.mutation({
      query: (emailData) => ({
        url: "/forgotPassword",
        method: "POST",
        body: emailData,
      }),
    }),

    ResetPassword: builder.mutation({
      query: (resetData) => ({
        url: "/resetPassword",
        method: "POST",
        body: resetData,
      }),
    }),
    ResendOtp: builder.mutation({
      query: (resendData) => ({
        url: "/resend",
        method: "POST",
        body: resendData,
      }),
    }),

    Login: builder.mutation({
      query: (loginData) => ({
        url: "/loginHotel",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: loginData,
      })
    }),

    LogoutHotel: builder.mutation({
      query: () => {
        return {
          url: "/logoutHotel",
          method: "POST",
        };
      },
    }),

    AddVerifiedData: builder.mutation({
      query: (verifiedData) => {
        return {
          url: "/verify/add-verify",
          method: "POST",
          body: verifiedData
        };
      },
    }),

  }),
});

export const {
  useRegisterHotelMutation,
  useVerifyOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
  useLoginMutation,
  useLogoutHotelMutation,
  useAddVerifiedDataMutation
} = AuthAPI;
