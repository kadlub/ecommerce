import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    userInfo: {}, // Przechowywanie informacji o użytkowniku
    orders: [], // Lista zamówień użytkownika
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        loadUserInfo: (state, action) => {
            console.log("Redux loadUserInfo Payload:", action?.payload); // Logowanie payload
            return {
                ...state,
                userInfo: {
                    ...action?.payload,
                    isAdmin: action?.payload?.roles?.includes('ROLE_ADMIN'), // Dodaj flagę isAdmin
                },
            };
        },
        saveAddress: (state, action) => {
            const addresses = [...state?.userInfo?.addressList] ?? [];
            addresses.push(action?.payload);
            return {
                ...state,
                userInfo: {
                    ...state?.userInfo,
                    addressList: addresses,
                },
            };
        },
        removeAddress: (state, action) => {
            return {
                ...state,
                userInfo: {
                    ...state?.userInfo,
                    addressList: state?.userInfo?.addressList?.filter(
                        (address) => address?.id !== action?.payload
                    ),
                },
            };
        },
        loadOrders: (state, action) => {
            return {
                ...state,
                orders: action?.payload,
            };
        },
        cancelOrder: (state, action) => {
            return {
                ...state,
                orders: state?.orders?.map((order) => {
                    if (order?.id === action?.payload) {
                        return {
                            ...order,
                            orderStatus: 'CANCELLED',
                        };
                    }
                    return order;
                }),
            };
        },
        updateUserInfo: (state, action) => {
            // Aktualizacja danych użytkownika
            return {
                ...state,
                userInfo: {
                    ...state?.userInfo,
                    ...action?.payload, // Nadpisz tylko zmienione pola
                },
            };
        },
    },
});

export const {
    loadUserInfo,
    saveAddress,
    removeAddress,
    loadOrders,
    cancelOrder,
    updateUserInfo, // Eksport nowej akcji
} = userSlice?.actions;

// Selektory dla różnych części danych
export const selectUserInfo = (state) => state?.userState?.userInfo ?? {};
export const selectAllOrders = (state) => state?.userState?.orders ?? [];
export const selectIsUserAdmin = (state) =>
    state?.userState?.userInfo?.isAdmin ?? false;
export const selectUserRole = (state) =>
    state?.userState?.userInfo?.authorityList?.map((auth) => auth.roleCode) ?? [];

export default userSlice?.reducer;
