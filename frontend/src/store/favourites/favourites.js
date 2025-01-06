import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    favourites: JSON.parse(localStorage.getItem("favourites")) || [],
};

const favouritesSlice = createSlice({
    name: "favouritesState",
    initialState: initialState,
    reducers: {
        addToFavourites: (state, action) => {
            const existingProductIndex = state.favourites.findIndex(
                (item) => item.productId === action.payload.productId
            );

            if (existingProductIndex === -1) {
                state.favourites.push(action.payload);
            } else {
                console.warn("Produkt już znajduje się w polubionych.");
            }
        },
        removeFromFavourites: (state, action) => {
            return {
                ...state,
                favourites: state.favourites.filter(
                    (item) => item.productId !== action.payload.productId
                ),
            };
        },
        clearFavourites: (state) => {
            return {
                ...state,
                favourites: [],
            };
        },
    },
});

export const { addToFavourites, removeFromFavourites, clearFavourites } = favouritesSlice.actions;

export const countFavouritesItems = (state) => state.favouritesState.favourites.length;
export const selectFavouritesItems = (state) => state.favouritesState.favourites ?? [];
export default favouritesSlice.reducer;
