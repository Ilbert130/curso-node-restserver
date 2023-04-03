const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/genera-jwt');   //Importando la funcion de generar token
const { googleVerify } = require("../helpers/google-verify");


//POST
const login = async(req = request, res = response) => {
    
    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        //Si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        //Verificar la password
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    } 
}

//POST: Autenticacion con google
const googleSignIn = async(req = request, res = response) => {

    const {id_token} = req.body;

    try {

        const {nombre, img, correo } = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo});

        //Si el usuario no existe crearlo
        if(!usuario){
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en db estado false
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador - usuario bloqueado'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }
}

module.exports = {
    login,
    googleSignIn
}