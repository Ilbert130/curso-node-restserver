//El archivo de ruta tiene que llamarse igual que el controlador
const { response, request } = require('express');
const Usuario = require('../models/usuario');               //Creacion de la instancia del modelo
const bcryptjs = require('bcryptjs');                       //para incriptar la password
// const { validationResult } = require('express-validator');  //para validar los errores mandados por los middlewares de validacion



//GET
const usuariosGet = (req = request, res = response) =>{  //Esto lo hacemos para tipar nuestros parametros y acceder facilmente a las funciones
    
    //Para obtener los querys que vienen en la ruta de nuestra peticion
    //api/usuarios?q=hola&nombre=ilbert&apikey=234324234 ejemplo de querys
    // const query = req.query;
    const {q, nombre = 'no name', apikey, page = 1, limit} = req.query;

    
    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

//PUT
const usuariosPut = (req, res) =>{

    //Asi se obtine el parametro mandado por la ruta en javascript
    //req.params.id //Tambien podemos acceder a ellos de manera individual
    const  {id} = req.params;

    //Respuesta en json
    res.json({
        msg: 'put API - Controlador',
        id: id
    });
}

//POST
const usuarioPost = async (req, res) =>{

    //const body = req.body;  //con este manera nos trae todo el body
    //Si lo hacemos de la manera de abajo evitamos obtener informacion inecesaria. Obteniendo solo lo que queremos.
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol}); //creamos nuestra instancia y le pasamos body del req

    //Encriptar la password
    const salt = bcryptjs.genSaltSync();  //SALT to create the pattern to encript the password
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardamos los datos en la db
    await usuario.save();

    //devolvemos una respusta de la creacion
    res.status(201).json({
        msg: 'post API - Controler',
        usuario: usuario
    });
}

//DELETE
const usuarioDelete = (req, res) =>{
    res.json({
        msg: 'delete API - Controler'
    });
}

//PATCH
const usuariosPatch = (req, res) =>{
    res.json({
        msg: 'patch API - Controler'
    });
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuarioPost,
    usuarioDelete,
    usuariosPatch
}