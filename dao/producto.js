import { } from 'dotenv/config';

import express from 'express';
const { Router } = express;
const routerProducto = Router();

async function inicio() {
    let ar;

    switch (process.env.DAO) {
        case "MongoDB":
            await import('./productos/ProductoDaoMongo.js')
                .then(({ default: ProductoDaoMongo }) => {
                    ar = new ProductoDaoMongo;
                    ar.abrir();
                })
                .catch(
                    function (err) {
                        console.log(err);
                    }
                )
            break;
        case "Firebase":
            await import('./productos/ProductoDaoFirebase.js')
                .then(({ default: ProductoDaoFirebase }) => {
                    ar = new ProductoDaoFirebase;
                    ar.abrir("Productos");
                })
                .catch(
                    function (err) {
                        console.log(err);
                    }
                )
            break;                    
        case "Archivo":
            await import('./productos/ProductoDaoArchivo.js')
                .then(({ default: ProductoDaoArchivo }) => {
                    ar = new ProductoDaoArchivo;
                    ar.abrir();
                })
                .catch(
                    function (err) {
                        console.log(err);
                    }
                )
            break;
        case "Memoria":
        default:
           await import('./productos/ProductoDaoMemoria.js')
                .then(({ default: ProductoDaoMemoria }) => {

                    ar = new ProductoDaoMemoria;
                })
                .catch(
                    function (err) {
                        console.log(err);
                    }
                )
            break;                
    }   

    return ar;
}

class Producto {
    constructor(nombre, descripcion, codigo, foto, precio, stock, timestamp, id) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.foto = foto;
        this.precio = precio;
        this.stock = stock;
        this.timestamp = timestamp || Date.now();
        this.id = id ;
    }
};

const archivo = await inicio();

routerProducto.get('/', async (req, res) => {
    const arr = await archivo.obtenerRegistros();    
    res.status(201).send(arr);
});

routerProducto.get('/:id', async (req, res) => {    
    const el = await archivo.obtenerRegistrosPorID(req.params.id);
    console.log(el);
    res.status(201).send(el);
    
});

routerProducto.get('/admin/cambio', (req, res) => {
    const admin = archivo.cambiaAdmin();
    res.status(201).send(admin);
});

routerProducto.post('/', async (req, res) => {
    const nuevo = req.body;
    if (archivo.soyAdmin() == true) {
        const id = await archivo.guardar(new Producto(nuevo.nombre, nuevo.descripcion, nuevo.codigo, nuevo.foto, parseFloat(nuevo.precio), parseFloat(nuevo.stock)));
        res.status(201).send({ 'status': 'Ok', 'nuevo id': id });
    } else {
        res.status(501).send({ 'error': '-1', 'descripcion': `la ruta ${req.path} metodo ${req.method} no se encuentra autorizada` });
    }
});

routerProducto.put('/:id', async (req, res) => {
    const nuevo = req.body;        
    if (archivo.soyAdmin() == true) {
        const id = await archivo.actualizar(new Producto(nuevo.nombre, nuevo.descripcion, nuevo.codigo, nuevo.foto, parseFloat(nuevo.precio), parseFloat(nuevo.stock), nuevo.timestamp, nuevo.id));
        res.status(201).send({ 'status': 'Ok', 'id actualizado': id })
    } else {
        res.status(501).send({ 'error': '-1', 'descripcion': `la ruta ${req.path} metodo ${req.method} no se encuentra autorizada` });
    }

});

routerProducto.delete('/:id', async (req, res) => {
    if (archivo.soyAdmin() == true) {
        const el = await archivo.borrarRegistro(req.params.id);
        res.status(201).send({ 'status': 'Ok', 'registro eliminado': el })
    } else {
        res.status(501).send({ 'error': '-1', 'descripcion': `la ruta ${req.path} metodo ${req.method} no se encuentra autorizada` });
    }
});

export {routerProducto as default, archivo};




