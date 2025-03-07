let orders = JSON.parse(localStorage.getItem('orders')) || [];

export const addOrder = (order) => {
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
};

export const getOrders = () => {
    return orders;
};

export const clearOrders = () => {
    orders = [];
    localStorage.setItem('orders', JSON.stringify(orders));
};