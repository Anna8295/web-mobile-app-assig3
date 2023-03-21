import { configureStore } from "@reduxjs/toolkit";
import navReducer from './slices/navSlice'

export const mapStore = configureStore({
    reducer: {
        nav: navReducer
    }
})