const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (error, user) => {
        if (error) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Registration
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json({ message: 'User registered', userId: user.id });
    } catch (error) {
        res.status(400).json({ error: 'User registration failed' });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
});

// Add to cart
app.post('/cart', authenticateToken, async (req, res) => {
    const { productId, quantity, size, color } = req.body;

    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Product out of stock' });
        }

        await prisma.cart.create({
            data: {
                userId: req.user.userId,
                productId,
                quantity,
                size,
                color,
            },
        });

        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to add product to cart' });
    }
});

// Get cart items
app.get('/cart', authenticateToken, async (req, res) => {
    try {
        const cartItems = await prisma.cart.findMany({
            where: { userId: req.user.userId },
            include: {
                product: true,
            },
        });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch cart items' });
    }
});

// Clear cart
app.delete('/cart/clear', authenticateToken, async (req, res) => {
    try {
        await prisma.cart.deleteMany({
            where: { userId: req.user.userId },
        });
        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to clear cart' });
    }
});

// Remove item from cart
app.post('/cart/remove', authenticateToken, async (req, res) => {
    const { productId, size, color } = req.body;

    try {
        await prisma.cart.deleteMany({
            where: {
                userId: req.user.userId,
                productId,
                size,
                color,
            },
        });
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to remove item from cart' });
    }
});

// Update item quantity in cart
app.post('/cart/update', authenticateToken, async (req, res) => {
    const { productId, size, color, quantity } = req.body;

    try {
        const cartItem = await prisma.cart.findFirst({
            where: {
                userId: req.user.userId,
                productId,
                size,
                color,
            },
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        await prisma.cart.update({
            where: { id: cartItem.id },
            data: { quantity },
        });

        res.status(200).json({ message: 'Item quantity updated' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to update item quantity' });
    }
});

// Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                images: true,
                categories: true,
            },
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch products' });
    }
});

// Get product by category
app.get('/products/category/:category', async (req, res) => {
    const { category } = req.params;
    try {
        const products = await prisma.product.findMany({
            where: {
                categories: {
                    some: {
                        name: category,
                    },
                },
            },
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch products by category' });
    }
});

// Post order
app.post('/order', authenticateToken, async (req, res) => {
    const { products } = req.body;

    try {
        const orderData = [];
        let totalAmount = 0;

        for (let product of products) {
            const { productId, quantity, size, color } = product;
            const productData = await prisma.product.findUnique({
                where: { id: productId },
            });

            if (!productData || productData.stock < quantity) {
                return res.status(400).json({ error: 'Product out of stock' });
            }

            productData.stock -= quantity;
            await prisma.product.update({
                where: { id: productId },
                data: { stock: productData.stock },
            });

            totalAmount += productData.price * quantity;

            orderData.push({ productId, quantity, size, color });
        }

        const order = await prisma.order.create({
            data: {
                products: JSON.stringify(orderData),
                total: totalAmount,
                userId: req.user.userId,
            },
        });

        res.status(200).json({ message: 'Order placed successfully', order: order });
    } catch (error) {
        res.status(400).json({ error: 'Failed to place order' });
    }
});

// Get all orders
app.get('/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.userId },
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to fetch orders' });
    }
});

// Search products 
app.get('/products/search', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: q,
                    mode: 'insensitive',
                },
            },
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to search products' });
    }
});

// Me
app.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch user' });
    }
});

// Logout
app.post('/logout', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});