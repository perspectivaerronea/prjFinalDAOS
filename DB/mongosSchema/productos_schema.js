import mongoose from 'mongoose';

const ProductosCollection = 'productos';

const ProductoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, maxLength: 100 },
    descripcion: { type: String, required: true, maxLength: 255},
    codigo: { type: String, required: true, maxLength: 100 },
    foto: { type: String, required: true, maxLength: 255 },
    precio: { type: Number, required: true, maxLength: 5 },
    stock: { type: Number, required: true, maxLength: 10 },    
})


export const productos_schema = mongoose.model(ProductosCollection, ProductoSchema);