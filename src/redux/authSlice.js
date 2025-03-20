import { createSlice } from "@reduxjs/toolkit";
import { AuthAPI } from "./api/AuthAPI";

const authSlice= createSlice({
    name: "authSlice",
    initialState: {},
    reducers: {
        invalidate: (state, { payload }) => {
            payload.forEach(item => {
                state[item] = false
            })
        }
    },
    extraReducers: builder => builder
        .addMatcher(AuthAPI.endpoints.Login.matchFulfilled, (state, { payload }) => {
            state.hotel = payload
        })
       
       
})

export const { invalidate } = authSlice.actions
export default authSlice.reducer