const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            await fs.writeFile(this.path, '[]');
            this.products = [];
        }
    }

    async saveProducts() {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }

    async addProduct(productData) {
        const id = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
        const newProduct = { id, ...productData };
        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    async updateProduct(id, updateData) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return null;
        
        this.products[index] = { ...this.products[index], ...updateData, id };
        await this.saveProducts();
        return this.products[index];
    }

    async deleteProduct(id) {
        const initialLength = this.products.length;
        this.products = this.products.filter(p => p.id !== id);
        await this.saveProducts();
        return initialLength > this.products.length;
    }
}

module.exports = ProductManager;

