import { addToCart, deleteCart, removeFromCart, updateQuantity } from "../features/cart";

export const addItemToCartAction = (productItem) => {
    return (dispatch, getState) => {
        dispatch(addToCart(productItem));
        updateLocalStorage(getState);
    };
};

export const updateItemToCartAction = (productItem) => {
    return (dispatch, getState) => {
        dispatch(
            updateQuantity({
                variant_id: productItem?.variant_id,
                quantity: productItem?.quantity,
            })
        );
        updateLocalStorage(getState);
    };
};

export const delteItemFromCartAction = (payload) => {
    return (dispatch, getState) => {
        dispatch(removeFromCart(payload));
        updateLocalStorage(getState);
    };
};

const updateLocalStorage = (getState) => {
    const { cartState } = getState(); // Wywołanie funkcji getState()
    localStorage.setItem("cart", JSON.stringify(cartState?.cart));
};

export const clearCart = () => {
    return (dispatch) => {
        dispatch(deleteCart());
        localStorage.removeItem("cart");
    };
};
