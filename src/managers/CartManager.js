const fs = require('fs').promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            await fs.writeFile(this.path, '[]');
            this.carts = [];
        }
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        const id = this.carts.length > 0 ? Math.max(...this.carts.map(c => c.id)) + 1 : 1;
        const newCart = { id, products: [] };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(id) {
        return this.carts.find(c => c.id === id);
    }

    async addProductToCart(cartId, productId) {
        const cartIndex = this.carts.findIndex(c => c.id === cartId);
        if (cartIndex === -1) return null;

        const productIndex = this.carts[cartIndex].products.findIndex(p => p.product === productId);
        
        if (productIndex === -1) {
            this.carts[cartIndex].products.push({ product: productId, quantity: 1 });
        } else {
            this.carts[cartIndex].products[productIndex].quantity++;
        }

        await this.saveCarts();
        return this.carts[cartIndex];
    }
}

module.exports = CartManager;