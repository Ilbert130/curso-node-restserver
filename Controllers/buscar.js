const { request, response } = require("express");
const {ObjectId} = require('mongoose').Types;
const {Usuario, Categoria, Producto} = require('../models');

//Colecciones
const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
]

//Buscar usuarios
const buscarUsuarios = async(termino = '', res = response) => {

    //Validando si es un id valido de mongo
    const esMongoID = ObjectId.isValid(termino)

    if(esMongoID){
        //busqueda por id
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    //Creando expresion regular para que no sea sencible a mayuscula en las buquedas
    const regex = new RegExp(termino, 'i');

    //busqueda por nombre
    const usuarios = await Usuario.find({
        //Bandera en node js para usar el or dentro del find
        $or: [{nombre: regex}, {correo: regex}],
        //Utilizando el and
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios
    });
}

//Buscar categoria
const buscarCategoria = async(termino = '', res = response) => {
    
    //Validando si es un id valido de mongo
    const esMongoID = ObjectId.isValid(termino)

    if(esMongoID){
        //busqueda por id
        const categoria = await Categoria.findById(termino).populate('usuario');
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    //Creando expresion regular para que no sea sencible a mayuscula en las buquedas
    const regex = new RegExp(termino, 'i');

    //busqueda por nombre
    const categorias = await Categoria.find({nombre: regex, estado: true}).populate('usuario');

    res.json({
        results: categorias
    });
}

//Buscar producto
const buscarProducto = async(termino = '', res = response) => {
    
    //Validando si es un id valido de mongo
    const esMongoID = ObjectId.isValid(termino)

    if(esMongoID){
        //busqueda por id
        const producto = await Producto.findById(termino).populate('categoria').populate('usuario');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    //Creando expresion regular para que no sea sencible a mayuscula en las buquedas
    const regex = new RegExp(termino, 'i');

    //busqueda por nombre
    const productos = await Producto.find({nombre: regex, estado: true}).populate('categoria').populate('usuario');

    res.json({
        results: productos
    });
}


//Buscar
const buscar = (req = request, res = response) => {

    const {coleccion, termino} = req.params;

    //Validando si existe la coleccion enviada
    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categoria':
            buscarCategoria(termino, res);
            break;
        case 'productos':
            buscarProducto(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            });
            break;
    }
}

module.exports = {
    buscar
}