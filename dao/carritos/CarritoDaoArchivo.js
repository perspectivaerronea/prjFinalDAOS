
import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js";

class CarritoDaoArchivo extends ContenedorArchivo{
    constructor(){
        super('./docs/carritoDao.txt')
    }

    
}

export default CarritoDaoArchivo;