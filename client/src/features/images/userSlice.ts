import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    login: null
}


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        currentUserLogin(state, action) {
            // @ts-ignore
            state.user.login = action.payload
        }
    }
})


export const {currentUserLogin} = userSlice.actions
export default userSlice.reducer