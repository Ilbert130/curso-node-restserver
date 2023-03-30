const { response, request } = require('express');
const jwt = require('jsonwebtoken'); 
const Usuario = require('../models/usuario'); 

//Middleware para validar el JWT en la peticion delete. Protegiendo esta ruta
const validarJWT = async(req = request, res = response, next) => {

    //Obteniendo el jwt del header del request
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        
        //Esta funcion sirve para verificar el jwt. Verificar si es valido y nos devuelve el payload como un objeto
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKY);

        const usuario = await Usuario.findOne({_id: uid}); //Buscando la informacion del usuario que hace la accion
        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe DB'
            });
        }

        //verificar si el uid tiene estado en true
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            });
        }

        //Creando un uid el objeto req y pasandole el valor del uid que hizo la accion
        // req.uid = uid;

        req.usuario = usuario; //Creamos una propiedad usuario en el objeto req
        next();
    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }
}

module.exports = {
    validarJWT
}