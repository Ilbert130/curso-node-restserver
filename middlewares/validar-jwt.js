const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

//Middleware
const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.secretOrPrivateKey );

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }

        // Verificar si el uid tiene estado true
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            })
        }
        
        
        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}

//Validar el JWT en el socket
const comprobarJWT = async( token = '') => {

    try {

        if(token.length < 10){
            return null;
        }

        const { uid } = jwt.verify( token, process.env.secretOrPrivateKey );

        const usuario = await Usuario.findById(uid);

        if(usuario){
            if(usuario.estado){
                return usuario;

            }else{
                return null
            }
        }else{
            return null;
        }
        
    } catch (error) {
        return null;
    }
}



module.exports = {
    validarJWT,
    comprobarJWT
}