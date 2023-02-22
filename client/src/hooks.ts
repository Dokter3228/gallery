import {useDispatch} from "react-redux";
import {AppDispatch} from "./App/store";
export const useAppDispatch = () => useDispatch<AppDispatch>()