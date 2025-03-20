import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BookingAPI = createApi({
  reducerPath: "BookingAPI",
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${import.meta.env.VITE_BACKEDN_URL}/api/v1/user`,
    credentials: "include", 
  }),
  tagTypes: ["Bookings"], 
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: () => ({
        url: "/getbookings",
        method: "GET",
      }),
      providesTags: ["Bookings"], 
    }),

    createBooking: builder.mutation({
      query: (newBooking) => ({
        url: "/create-booking", 
        method: "POST",
        body: newBooking, 
      }),

      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const { useGetBookingsQuery, useCreateBookingMutation } = BookingAPI;
