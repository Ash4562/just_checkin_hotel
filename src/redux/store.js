import { configureStore } from "@reduxjs/toolkit";
import { AuthAPI } from "./api/AuthAPI";
import { BookingAPI } from "./api/BookingAPI";
import { hotelProfileApi } from "./api/hotelProfileApi";

const reduxStore = configureStore({
  reducer: {
    [AuthAPI.reducerPath]: AuthAPI.reducer,
    [BookingAPI.reducerPath]: BookingAPI.reducer,
    [hotelProfileApi.reducerPath]: hotelProfileApi.reducer,
  },

  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    AuthAPI.middleware,
    BookingAPI.middleware,
    hotelProfileApi.middleware,
  ],
});

export default reduxStore;
