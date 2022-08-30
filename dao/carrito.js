import { } from 'dotenv/config';

import express from 'express';
const { Router } = express;
const routerCarrito = Router();

import {archivo as archivoProd} from './producto.js';

async function inicio() {
    let ar;

    switch (process.env.DAO) {
        case "MongoDB":
            await import('./carritos/CarritoDaoMongo.js')
                .then(({ default: CarritoDaoMongo }) => {
                    ar = new CarritoDaoMongo;
                    ar.abrir();
                })
                .catch(
                    function (err) {
                        console.log(err);
                    }
                )
            break;
        case "Firebase":
            await import('./carritos/CarritoDaoFirebase.js')
                .then(({ default: CarritoDaoFirebase}) => {
                    ar = new CarritoDaoFirebase;
                    ar.abrir("Carritos");
                })
                .catch(
                    function (err) {
                        console.log(err);
                    }
                )
            break;           
        case "Archivo":
            await import('./carritos/CarritoDaoArchivo.js')
                .then(({ default: CarritoDaoArchivo }) => {
                    ar = new CarritoDaoArchivo;
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
            await import('./carritos/CarritoDaoMemoria.js')
                .then(({ default: CarritoDaoMemorio }) => {
                    ar = new CarritoDaoMemorio;
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

class Carrito {
    constructor(id) {
        this.productos = [];
        this.timestamp = Date.now();   
        this.id = id ;     
    }
}

const archivo = await inicio();
const archivoProductos = archivoProd;

const cargaCarrito = async (carrito, producto) => {

    const listaProductos = carrito.productos ;    
    if (listaProductos != undefined) {
        const encontrado = listaProductos.find(prod => prod.id == producto.id) || false;                 
        if (!encontrado) {
            // listaProductos.push(producto)   
            carrito.productos.push(producto)                    
            const id = await archivo.actualizar(carrito);
        } else {
            console.log("El producto ya existe en el carrito");
        }
    }
}

const eliminarProducto = async (carrito, idProd) => {
    const listaProductos = carrito.productos;
    let encontrado = false;
    for (let i = 0; i < listaProductos.length; i++) {
        if (listaProductos[i].id == idProd) {
            encontrado = true;
            listaProductos.splice(i, 1);
        }
    }
    if (!encontrado) {
        console.log("El producto no está dentro del carrito");
    }
    const id = await archivo.actualizar(carrito);
}

routerCarrito.get('/', async (req, res) => {
    const arr = await archivo.obtenerRegistros();
    res.status(201).send(arr);
});

routerCarrito.get('/:id/productos', async (req, res) => {
    const el = await archivo.obtenerRegistrosPorID(req.params.id);
    const listaProductos = el.productos;
    if (listaProductos == undefined) {
        res.status(501).send(el);
    } else {
        res.status(201).send(listaProductos);
    }

});

routerCarrito.post('/', async (req, res) => {
    const nuevo = req.body;
    const id = await archivo.guardar(new Carrito());
    res.status(201).send({ 'status': 'Ok', 'nuevo id': id });
});

// Carga Producto en el carrito
routerCarrito.post('/:id/productos', async (req, res) => {
    const nuevo = req.body;
    const el = await archivo.obtenerRegistrosPorID(req.params.id);
    const prod = await archivoProductos.obtenerRegistrosPorID(nuevo.id);

    
    if (prod == undefined) {        
 // if (prod.id == undefined) { 
        res.status(501).send({ 'error': `El carrito ${req.params.id} no existe` });
    } else {        
        await cargaCarrito(el, prod);
        res.status(201).send({ 'status': 'Ok', 'carrito actualizado': el });
    }
});

routerCarrito.delete('/:id', async (req, res) => {
    const el = await archivo.borrarRegistro(req.params.id);
    res.status(201).send({ 'status': 'Ok', 'registro eliminado': el })
});

routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
    const el = await archivo.obtenerRegistrosPorID(req.params.id);
    const id_prod = req.params.id_prod;
    await eliminarProducto(el, id_prod);
    res.status(201).send({ 'status': 'Ok', 'registro eliminado del carrito': el })
});


export {routerCarrito as default, archivo};
