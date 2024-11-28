import express from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import __dirname from './utils.js';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

const io = new Server(httpServer);
const productManager = new ProductManager();

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.emit('productList', productManager.getProducts());

    socket.on('addProduct', (productData) => {
        const newProduct = productManager.addProduct(productData);
        io.emit('productList', productManager.getProducts());
    });

    socket.on('deleteProduct', (productId) => {
        productManager.deleteProduct(productId);
        io.emit('productList', productManager.getProducts());
    });
});

export { io }; 