import { getUserIdFromToken } from './jwt-helper';

export const createOrderRequest = (cartItems, addressId) => {
    let request = {};
    const userId = getUserIdFromToken();
    if (!userId) {
        console.error("Nie można złożyć zamówienia. Brak ID użytkownika.");
        return null; // lub obsłuż w inny sposób
    }
    request.userId = userId;
    request.addressId = addressId;
    request.orderDate = new Date().toISOString();
    let orderItems = [];
    let amount = 0;
    cartItems?.map((item) => {
        amount += item?.subTotal;
        orderItems.push({
            productId: item.productId,
            productVariantId: item?.variant?.id,
            discount: 0,
            quantity: item?.quantity,
        });
    });
    request.orderItemRequests = orderItems;
    request.totalAmount = amount?.toFixed(2);
    request.discount = 0;
    request.paymentMethod = "CARD";
    request.expectedDeliveryDate = "2024-10-05T21:11:46.202Z";
    request.currency = "usd";
    return request;
};

export const getStepCount = {
    'PENDING': 1,
    'IN_PROGRESS': 2,
    'SHIPPED': 3,
    'DELIVERED': 4
}