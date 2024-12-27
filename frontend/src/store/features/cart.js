import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartSlice = createSlice({
    name: "cartState",
    initialState: initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingProductIndex = state.cart.findIndex(
                (item) => item.productId === action.payload.productId && item.variant?.id === action.payload.variant?.id
            );

            if (existingProductIndex !== -1) {
                // Jeśli produkt istnieje, zwiększ ilość
                state.cart[existingProductIndex].quantity += action.payload.quantity;
                state.cart[existingProductIndex].subTotal =
                    state.cart[existingProductIndex].quantity * state.cart[existingProductIndex].price;
            } else {
                // Jeśli produkt nie istnieje, dodaj do koszyka
                state.cart.push(action.payload);
            }

            return state;
        },
        removeFromCart: (state, action) => {
            return {
                ...state,
                cart: state?.cart?.filter(
                    (item) =>
                        item.productId !== action?.payload?.productId || item?.variant?.id !== action?.payload?.variantId
                ),
            };
        },
        updateQuantity: (state, action) => {
            return {
                ...state,
                cart: state?.cart?.map((item) => {
                    if (item?.variant?.id === action?.payload?.variant_id) {
                        return {
                            ...item,
                            quantity: action?.payload?.quantity,
                            subTotal: action?.payload?.quantity * item.price,
                        };
                    }
                    return item;
                }),
            };
        },
        deleteCart: (state) => {
            return {
                ...state,
                cart: [],
            };
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, deleteCart } = cartSlice?.actions;

export const countCartItems = (state) => state?.cartState?.cart?.length;
export const selectCartItems = (state) => state?.cartState?.cart ?? [];
export default cartSlice.reducer;
