import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UserState {
    user: any | null,
    errorMessage : boolean,
}

const initialState: UserState = {
    user: null,
    errorMessage : false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any | null>) => {
            state.user = action.payload.user
        },
        setErrorMessage : (state , action : PayloadAction<any | null>) =>{
            state.errorMessage = action.payload
        }
    },
})

export const { setUser , setErrorMessage} = authSlice.actions
export default authSlice.reducer
