import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    value: number
}

const initialState: CounterState = {
    value: 0,
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        addImage: (state) => {
            state.value += 1
        },
    },
})

// Action creators are generated for each case reducer function
export const { addImage } = counterSlice.actions

export default counterSlice.reducer