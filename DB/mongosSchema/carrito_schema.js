import mongoose from 'mongoose';

const CarritosCollection = 'carritos';

const CarritoSchema = new mongoose.Schema({
    // productos: [{ type: Object, }],
    productos: [{
        nombre: { type: String, required: true, maxLength: 100 },
        descripcion: { type: String, required: true, maxLength: 255 },
        codigo: { type: String, required: true, maxLength: 100 },
        foto: { type: String, required: true, maxLength: 255 },
        precio: { type: Number, required: true, maxLength: 5 },
        stock: { type: Number, required: true, maxLength: 10 }
    }
    ],
    timestamp: { type: Number, required: true, maxLength: 15 },
})


export const carrito_schema = mongoose.model(CarritosCollection, CarritoSchema);