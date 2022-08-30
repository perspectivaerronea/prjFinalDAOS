
import ContenedorMongo from "../../contenedores/ContenedorMongo.js";
import { carrito_schema } from "../../DB/mongosSchema/carrito_schema.js";

class CarritoDaoMongo extends ContenedorMongo {
    constructor() {
        super();
        this.tabla = carrito_schema;
    }

    async actualizar(elemento) {
        const arr = await this.obtenerRegistros();

        try {
            const index = arr.findIndex((el) => (el.id == elemento.id));
            await this.tabla.updateOne({ _id: arr[index].id }, {
                $set: {
                    productos: elemento.productos,                    
                }
            });
            return elemento.id;
        } catch (err) {
            return { error: ' ID No Encontrado' };
        }
    }
}

export default CarritoDaoMongo;
