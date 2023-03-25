//El archivo de ruta tiene que llamarse igual que el controlador
const { response, request } = require('express');
const Usuario = require('../models/usuario');               //Creacion de la instancia del modelo
const bcryptjs = require('bcryptjs');                       //para incriptar la password
// const { validationResult } = require('express-validator');  //para validar los errores mandados por los middlewares de validacion



//GET
const usuariosGet = async(req = request, res = response) =>{  //Esto lo hacemos para tipar nuestros parametros y acceder facilmente a las funciones
    
    //Para obtener los querys que vienen en la ruta de nuestra peticion
    //api/usuarios?q=hola&nombre=ilbert&apikey=234324234 ejemplo de querys
    // const query = req.query;
    // const {q, nombre = 'no name', apikey, page = 1, limit} = req.query;

    //Asi se obtinen todos los usurios
    //Creando paginacion
    const {limite =5, desde = 0} = req.query;
    const query = { estado: true};

    // const usuarios = await Usuario.find(query) //Con este metodo obtienes todos los usuario
    //     .skip(+desde)                     //Para deterimanar desde que registro empezar a mostrar los datos
    //     .limit(+limite);                 //determina el cuanto registro seran mostrados

    // const total = await Usuario.countDocuments(query);

    //ejecutando promesas de manera simultania y destructurando su resultado
    const [usuarios, total] = await Promise.all([
        Usuario.find(query).skip(+desde).limit(+desde),
        Usuario.countDocuments(query)
    ]);
    
    res.json({
        total,
        usuarios
    });
}

//PUT
const usuariosPut = async(req, res) =>{

    //Asi se obtine el parametro mandado por la ruta en javascript
    //req.params.id //Tambien podemos acceder a ellos de manera individual
    const  {id} = req.params;
    const {_id, password, google, ...resto} = req.body;

    //TODO: VALIDAR CONTRA BASE DE DATOS

    if(password){
        //Encriptar la password
        const salt = bcryptjs.genSaltSync();  //SALT to create the pattern to encript the password
        resto.password = bcryptjs.hashSync(password, salt);
    }
    
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    //Respuesta en json
    res.json({
        usuario: usuario
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
const usuarioDelete = async (req, res) =>{

    const {id} = req.params;
    
    //fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}); //Actulizando el estado para eliminar el registro sin quitarlo de la base de datos

    res.json({
        usuario
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