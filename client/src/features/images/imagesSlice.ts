import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";

const imagesAdapter = createEntityAdapter({
// @ts-ignore
    selectId: image => image.uuid
})

const imagesSlice = createSlice({
    name: "Images",
    initialState: imagesAdapter.getInitialState(),
    reducers: {
        setAllImages: imagesAdapter.setAll,
        addImage: imagesAdapter.addOne,
        setComments: imagesAdapter.upsertOne
    },
})

export const { setAllImages, addImage, setComments } = imagesSlice.actions
export default imagesSlice.reducer





// import { createEntityAdapter, createSlice, EntityId } from "@reduxjs/toolkit";
// import {RootState} from "../../App/store";
// export interface ImagesState {
//   imagesArray: string[];
// }
//
// export type Image = {
//   author: string;
//   uuid: EntityId;
//   src: string;
//   // comments : array of uniq comments from entityProvider of Comment
//   comments: EntityId[],
//   creationDate: string
// };
//
// export type Comment = {
//   author: string;
//   text: string;
//   _id: EntityId;
// };
//
// export const commentEntityAdapter = createEntityAdapter<Comment>({
//   selectId: (comment) => comment._id,
// });
//
// export const imageEntityAdapter = createEntityAdapter<Image>({
//   selectId: (image) => image.uuid,
// });
//
// const initialState: ImagesState = {
//   imagesArray: ["124141"
//   ],
// };
//
// export const imagesSlice = createSlice({
//   name: "images",
//   initialState,
//   reducers: {
// // @ts-ignore
//     addImage: imageEntityAdapter.addOne,
//     setImages(state, action) {
//       // @ts-ignore
//       imageEntityAdapter.setAll(state, action.payload.imagesArray)
//     }
//   },
// });
//
// export const imagesSelectors = imageEntityAdapter.getSelectors<RootState>(
// // @ts-ignore
//     state => state.imagesArray
// )
// export const { addImage } = imagesSlice.actions;
//
// export default imagesSlice.reducer;
