import { PrismaClient } from '@prisma/client';
import { pathToFileURL } from 'url';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Get the directory name of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

async function main() {
    // Dynamically import data using ES module imports
    const productsPath = pathToFileURL(join(__dirname, 'data/products.js')).href;
    const usersPath = pathToFileURL(join(__dirname, 'data/users.js')).href;
    const ordersPath = pathToFileURL(join(__dirname, 'data/orders.js')).href;

    const productsData = (await import(productsPath)).default;
    const usersData = (await import(usersPath)).default;
    const ordersData = (await import(ordersPath)).default;

    // Adding users
    for (const user of usersData) {
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
        });

        if (!existingUser) {
            await prisma.user.create({
                data: user,
            });
        } else {
            console.log(`User with email ${user.email} already exists.`);
        }
    }

    // Adding products
    for (const product of productsData) {
        // Handling categories
        const categoryIds = await Promise.all(
            product.categories.map(async (categoryName) => {
                let category = await prisma.category.findFirst({
                    where: { name: categoryName },
                });
                if (!category) {
                    category = await prisma.category.create({
                        data: { name: categoryName },
                    });
                }
                return category.id;
            })
        );

        // Creating the product and linking categories
        const createdProduct = await prisma.product.create({
            data: {
                name: product.name,
                price: product.price,
                image: product.image,
                stock: 100,  // Example stock value
                categories: {
                    connect: categoryIds.map((id) => ({ id })),
                },
            },
        });

        // Handling images
        for (const imageUrl of product.images) {
            await prisma.image.create({
                data: {
                    url: imageUrl,
                    product: {
                        connect: { id: createdProduct.id },
                    },
                },
            });
        }

        console.log(`Product ${product.name} created`);
    }

    // Adding orders
    for (const order of ordersData) {
        const user = await prisma.user.findUnique({
            where: { id: order.userId },
        });

        if (!user) {
            console.log(`User with id ${order.userId} does not exist. Skipping order creation.`);
            continue; // Skip this order if the user doesn't exist
        }

        // Creating the order
        await prisma.order.create({
            data: {
                userId: order.userId,
                products: JSON.parse(order.products), // Convert JSON string back to object
                total: order.total,
                createdAt: order.createdAt,
            },
        });

        console.log(`Order for user ${order.userId} created`);
    }

    console.log('Data migration completed');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });