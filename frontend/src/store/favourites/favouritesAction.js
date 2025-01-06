import { addToFavourites, removeFromFavourites, clearFavourites } from "./favourites";

export const addItemToFavouritesAction = (productItem) => {
    return (dispatch, getState) => {
        dispatch(addToFavourites(productItem));
        updateLocalStorage(getState);
    };
};

export const removeItemFromFavouritesAction = (payload) => {
    return (dispatch, getState) => {
        dispatch(removeFromFavourites(payload));
        updateLocalStorage(getState);
    };
};

export const clearFavouritesAction = () => {
    return (dispatch) => {
        dispatch(clearFavourites());
        localStorage.removeItem("favourites");
    };
};

const updateLocalStorage = (getState) => {
    const { favouritesState } = getState();
    localStorage.setItem("favourites", JSON.stringify(favouritesState?.favourites));
};
