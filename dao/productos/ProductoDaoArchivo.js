import {ContenedorArchivo } from "../../contenedores/ContenedorArchivo.js";

class ProductoDaoArchivo extends ContenedorArchivo{
    constructor(){
        super('./docs/productoDao.txt')
    }
   
}

export default ProductoDaoArchivo;