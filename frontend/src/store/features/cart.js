import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartSlice = createSlice({
    name: "cartState",
    initialState: initialState,
    reducers: {
        addToCart: (state, action) => {
            if (!action.payload.productId) {
                console.error("Brak productId w dodawanym produkcie:", action.payload);
                return;
            }

            const existingProductIndex = state.cart.findIndex(
                (item) => item.productId === action.payload.productId
            );

            if (existingProductIndex !== -1) {
                console.warn("Produkt już znajduje się w koszyku.");
            } else {
                state.cart.push({
                    ...action.payload,
                    quantity: 1,
                    subTotal: action.payload.price,
                });
            }
        },
        removeFromCart: (state, action) => {
            return {
                ...state,
                cart: state.cart.filter(
                    (item) => item.productId !== action.payload.productId
                ),
            };
        },
        updateQuantity: (state, action) => {
            return {
                ...state,
                cart: state.cart.map((item) => {
                    if (item.productId === action.payload.productId) {
                        return {
                            ...item,
                            quantity: action.payload.quantity,
                            subTotal: action.payload.quantity * item.price, // Choć ilość zawsze będzie 1
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

export const { addToCart, removeFromCart, updateQuantity, deleteCart } = cartSlice.actions;

export const countCartItems = (state) => state.cartState.cart.length;
export const selectCartItems = (state) => state.cartState.cart ?? [];
export default cartSlice.reducer;
