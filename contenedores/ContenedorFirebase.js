import { } from 'dotenv/config';
import admin from 'firebase-admin';
const serviceAccount = JSON.parse(process.env.FIREBASE);

export class ContenedorFirebase {

    /*
        C   -   CREATE
        R   -   READ
        U   -   UPDATE  
        D   -   DELETE
    */

    constructor() {
        this.admin = true;
        this.serviceAccount = serviceAccount;
        this.firebaseAdmin = admin;
        try {
            this.firebaseAdmin.initializeApp({
                credential: this.firebaseAdmin.credential.cert(this.serviceAccount),
                databaseURL: "https://coder-pry-fn-default-rtdb.firebaseio.com",
            });
        }
        catch { }
        this.db = this.firebaseAdmin.firestore();
    }

    cambiaAdmin() {
        this.admin = !this.admin
        return this.admin;
    }

    soyAdmin() {
        return this.admin;
    }

    armaRegistro(doc) {
        return { id: doc.id, ...doc.data() };
    }

    //  C   -   CREATE

    async abrir(tabla) {

        const registros = [];

        try {
            this.tabla = this.db.collection(tabla);

            return this.obtenerRegistros() || [];

        }
        catch (err) {

            console.log(err);
        }
    }

    //  R   -   READ

    async obtenerRegistros() {
        const registros = [];

        try {
            await this.tabla
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        registros.push(this.armaRegistro(doc));
                    });
                })
                .catch((err) => {
                    console.log("Error getting documents", err);
                });

            return registros;
        }
        catch (err) {
            console.log(err);
        }
    }

    async obtenerRegistrosPorID(id) {

        let reg = {};
        try {
            const registros = await this.obtenerRegistros();

            registros.forEach((registro) => {
                if (registro.id == id) {
                    reg = registro;
                }
            })

        }
        catch (err) {
            return { error: ' ID No Encontrado' };
        }

        return reg;
    }

    //  U   -   Update

    async guardar(elemento) {
        try {
            delete elemento["id"];
            let doc = this.tabla.doc();
            await doc.create(JSON.parse(JSON.stringify(elemento)));

            return doc.id;

        }
        catch (error) {
            console.log("No se pudo agregar el objeto al archivo.");
            return null;
        }
    }

    async actualizar(elemento) {

        let reg = {};

        await this.tabla
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.id == elemento.id) {
                        let docu = doc.data();
                        for (const propiedadElementoArchivo in docu) {
                            for (const propiedadElemento in elemento) {
                                if (propiedadElemento == propiedadElementoArchivo && propiedadElementoArchivo != 'id' && propiedadElementoArchivo != 'timestamp') {
                                    if (docu[propiedadElementoArchivo] != elemento[propiedadElemento] && elemento[propiedadElemento] != 0 && elemento[propiedadElemento] != '') {
                                        reg[propiedadElementoArchivo] = elemento[propiedadElemento]
                                    }
                                }
                            }
                        }

                        doc.ref.update(reg);

                        return elemento.id;
                    }
                });
            })
            .catch((err) => {
                console.log("Error getting documents", err);
            });
    }

    //  D   -   DELETE

    async borrarRegistro(id) {
        try {
            await this.tabla
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        if ((this.armaRegistro(doc)).id == id) {
                            doc.ref.delete();
                        }
                    });
                })
                .catch((err) => {
                    console.log("No se pudo eliminar el registro", err);
                });
        }
        catch (error) {
            return { 'No se pudo eliminar el registro': id }
        }
    }

    async borrarTodo() {
        try {
            await this.tabla
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                })
                .catch((err) => {
                    console.log("No se pudieron eliminar los registros", err);
                });
        }
        catch (err) {
            return { error: "No se pudieron borrar los registros" };
        }
    }

}

export default ContenedorFirebase;
