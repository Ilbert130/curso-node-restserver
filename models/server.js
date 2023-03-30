const express = require('express');  //Express and cors require
const cors = require('cors');
const {dbConnection} = require('../database/config');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';                //Ruta de autenticacion

        //Conectar a la base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    //Conexion a base de datos
    async conectarDB(){
        await dbConnection();
    }

    //Configuracion de middlewars
    middlewares(){

        //CORS
        this.app.use(cors());

        //Parseo y lectura del body a JSON
        this.app.use(express.json());

        //Directorio Publico, determinandolo como principal en la ruta / del proyecto
        //recursos staticos
        this.app.use(express.static('public'));
    }

    //Configuracion de rutas
    routes(){
        
        //Determinando la ruta de autenticacion
        this.app.use(this.authPath, require('../routes/auth'));
        //Determinando la ruta de ese controlador
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }
    
    //Escucha de nuestra applicacion
    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;
