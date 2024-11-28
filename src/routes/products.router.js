import express from 'express';
import ProductManager from '../managers/ProductManager.js';
import { io } from '../app.js';

const router = express.Router();
const productManager = new ProductManager();

router.post('/', (req, res) => {
    try {
        const newProduct = productManager.addProduct(req.body);
        
        t
        io.emit('productList', productManager.getProducts());
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    
    try {
        productManager.deleteProduct(productId);
        
        
        io.emit('productList', productManager.getProducts());
        
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router