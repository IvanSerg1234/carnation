let cart = JSON.parse(localStorage.getItem('cart')) || [];

export const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id && item.size === product.size && item.color === product.color);
    if (existingProduct) {
        existingProduct.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

export const getCart = () => {
    return cart;
}

export const removeFromCart = (productId, size, color) => {
    cart = cart.filter(item => !(item.id === productId && item.size === size && item.color === color));
    localStorage.setItem('cart', JSON.stringify(cart));
}

export const updateQuantity = (productId, size, color, quantity) => {
    const product = cart.find(item => item.id === productId && item.size === size && item.color === color);
    if (product) {
        product.quantity = quantity;
        if (product.quantity <= 0) {
            removeFromCart(productId, size, color);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
};

export const clearCart = () => {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
}