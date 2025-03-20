import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const hotelProfileApi = createApi({
    reducerPath: "hotelProfileApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEDN_URL}/api/v1/hotel`, credentials: "include" }),
    tagTypes: ["hotelApi"],
    endpoints: (builder) => {
        return {
            getSingleHotel: builder.query({
                query: () => ({
                    url: "/getSingleHotel",
                    method: "GET",
                }),
                providesTags: ["hotelApi"],
            }),
        }
    }
})

export const { useGetSingleHotelQuery } = hotelProfileApi
