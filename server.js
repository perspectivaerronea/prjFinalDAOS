import {} from 'dotenv/config';

import express from 'express';
import routerProducto from './dao/producto.js';
import routerCarrito from './dao/carrito.js';

const app = express();
const PORT = process.env.PORT;

const productoDao = routerProducto;
const carritoDao = routerCarrito;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', express.static('public'));
app.get('/productos', function (req, res) {
    res.status(201).render('./productos.html');
});
app.get('/carrito', function (req, res) {
    res.status(201).render('./carrito.html');
});

app.use('/api/carrito', carritoDao);
app.use('/api/productos', productoDao);

app.get('*', function (req, res) {
    res.status(501).send({ 'error': '-2', 'descripcion': `la ruta ${req.path} metodo ${req.method} no implementada` });
});

const server = app.listen(PORT, (req, res) => {
    console.log(` - El servidor se encuentra activo. Escucha en el puerto ${PORT} - `);
})

server.on("error", e => console.log(`Error en el servidor ${e}`));

