// const fs = require('fs');
import {promises as fs} from 'fs';

export class ContenedorArchivo {

    /*
        C   -   CREATE
        R   -   READ
        U   -   UPDATE  
        D   -   DELETE
    */

    constructor(nombreArchivo) {
        this.archivo = nombreArchivo;
        this.admin = true;
    }

    cambiaAdmin() {
        this.admin = !this.admin
        return this.admin;
    }

    soyAdmin() {
        return this.admin;
    }

    async nuevoID() {
        let maximo = 0;
        const arr = await this.obtenerRegistros();
        arr.forEach(el => {
            if (parseInt(el.id) > maximo) {
                maximo = parseInt(el.id);
            }
        })        
        return ++maximo;
    }

    //  C   -   CREATE

    async abrir() {
        try {
            const archivo = await fs.readFile(this.archivo, 'utf-8');
            return JSON.parse(archivo);
        }
        catch (err) {
            await fs.writeFile(this.archivo, JSON.stringify([], null, 2));
            const archivo = await fs.readFile(this.archivo, 'utf-8');
            return JSON.parse(archivo);
        }
    }

    //  R   -   READ

    async obtenerRegistros() {
        try {
            const archivo = await fs.readFile(this.archivo, 'utf-8');
            return JSON.parse(archivo);
        }
        catch (err) {
            console.log(err);
        }
    }

    async obtenerRegistrosPorID(id) {
        try {
            const arr = await this.obtenerRegistros();
            const registro = arr.find(el => (parseInt(el.id) == parseInt(id)));
            return registro;
        }
        catch (err) {
            return { error: ' ID No Encontrado' };
        }
    }

    //  U   -   Update

    async guardar(elemento) {
        try {
            const arr = await this.obtenerRegistros();
            elemento.id = await this.nuevoID();
            arr.push(elemento);
            await fs.writeFile(this.archivo, JSON.stringify(arr, null, 2));
            return elemento.id;
        }
        catch (error) {
            console.log("No se pudo agregar el objeto al archivo.");
            return null;
        }
    }

    async actualizar(elemento) {
        const arr = await this.obtenerRegistros();
        try {
            const index = arr.findIndex((el) => (parseInt(el.id) == parseInt(elemento.id)));
            if (index >= 0) {
                for (const propiedadElementoArchivo in arr[index]) {
                    for (const propiedadElemento in elemento) {
                        if (propiedadElemento == propiedadElementoArchivo && propiedadElementoArchivo != 'id' && propiedadElementoArchivo != 'timestamp') {
                            if (arr[index][propiedadElementoArchivo] != elemento[propiedadElemento] && elemento[propiedadElemento] != 0 && elemento[propiedadElemento] != '') {
                                arr[index][propiedadElementoArchivo] = elemento[propiedadElemento]
                            }
                        }
                    }
                }
            }
            await fs.writeFile(this.archivo, JSON.stringify(arr, null, 2));
            return elemento.id;
        } catch (err) {
            return { error: ' ID No Encontrado' };
        }
    }

    //  D   -   DELETE

    async borrarRegistro(id) {
        let encontrado = false;
        let i = 0;

        try {
            const arr = await this.obtenerRegistros();
            while (!encontrado && i < arr.length) {
                if (parseInt(arr[i].id) === parseInt(id)) {
                    const eliminado = arr.splice(i, 1);                    
                    await fs.writeFile(this.archivo, JSON.stringify(arr, null, 2));                    
                    encontrado = true;
                    return eliminado;
                } else {
                    i++;
                }
            }
            if (!encontrado) {                
                return { 'No existe ese registro': id }
            }
        }
        catch (error) {            
            return { 'No se pudo eliminar el registro': id }
        }
    }

    async borrarTodo(){
        try {
            await fs.writeFile(this.archivo, JSON.stringify([], null, 2));
            return JSON.parse(this.obtenerRegistros());
        }
        catch (err) {
            return { error: "No se pudieron borrar los registros"};
        }        
    }

}

export default ContenedorArchivo;
