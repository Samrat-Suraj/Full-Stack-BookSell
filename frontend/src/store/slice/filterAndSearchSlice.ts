import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filterData: []
}

const filterAndSearch = createSlice({
    name: "filterAndSearch",
    initialState: initialState,
    reducers: {
        setFilterData : (state , action) => {
            state.filterData = action.payload
        },
    }
})

export const {setFilterData} = filterAndSearch.actions
export default filterAndSearch.reducer