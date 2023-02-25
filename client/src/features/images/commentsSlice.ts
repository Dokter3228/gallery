import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    comments: []
}


const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
// @ts-ignore
        addComment(state, action) {
// @ts-ignore
            state.comments.push(action.payload)
        },
        reset: () => initialState
    }
})


export const {addComment, reset} = commentsSlice.actions
export default commentsSlice.reducer