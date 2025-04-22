import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
    name: "address",
    initialState: {
        address: null
    },
    reducers: {
        setAddress: (state, action) => {
            state.address = action.payload
        }
    }
})

export const { setAddress } = addressSlice.actions
export default addressSlice.reducer