import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ImagesState {
    imagesArray: string[]
}

const initialState: ImagesState = {
    imagesArray: [],
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        addImage: (state, action) => {
            state.imagesArray.push(action.payload)
        },
    },
})

// Action creators are generated for each case reducer function
export const { addImage} = counterSlice.actions

export default counterSlice.reducer