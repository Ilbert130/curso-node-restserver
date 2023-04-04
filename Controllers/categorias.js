const { response, request } = require("express");
const { Categoria } = require("../models");


//GET: obtenerCategorias - paginado - tatal - populate mostrar el ultimo usuario que lo ha modificado
const obtenerCategorias = async(req = request, res = response) => {

    //Creando paginacion
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    //Populations parameters
    const populateParameters = ['nombre', 'correo', 'rol', 'uid'];

    //Obteniendo las categorias y el total
    const [categorias, total] = await Promise.all([
        //para el populate, se colacal el nombre de la propiead en el schema y los parametros que se quieren ver del otro schema
        Categoria.find(query).populate('usuario', populateParameters).skip(+desde).limit(+limite),
        Categoria.countDocuments(query)
    ]);

    res.json({
        total,
        categorias
    });
}


//GET: ObternerCategoria - populate
const obtenerCategoria = async(req = request, res = response) => {

    const {id} = req.params;
    const query = {estado: true};

    //Populations parameters
    const populateParameters = ['nombre', 'correo', 'rol', 'uid'];

    const [categoria, total] = await Promise.all([
        Categoria.findById(id).populate('usuario', populateParameters),
        Categoria.countDocuments(query)
    ]);

    res.json({
        total,
        categoria
    });
}


//POST
const crearCategoria = async(req = request, res = response) => {

    //Obtener el nombre de la categoria en mayuscula
    const nombre = req.body.nombre.toUpperCase();

    //Verificando si exite una categoria con el mismo nombre
    const categoriaDB = await Categoria.findOne({nombre});

    //Haciendo la verificacion si existe una categoria igual
    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id                //El usuario viene de la validacion del jwt en middlewares
    }

    //Creamons la nueva categoria
    const categoria = new Categoria(data);
    await categoria.save();

    //Devolviendo el resultado de la creacion
    res.status(201).json(categoria);
}


//PUT: ACTUALIZAR CATEGORIA
const actualizarCategoria = async(req=request, res= response) => {

    //data de los parametros
    const {id} = req.params;
    
    //data del body
    const {nombre} = req.body;

    const data = {
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true}); //Para que devuelva el nuevo documento actualizado

    //respuesta
    res.json({
        categoria
    });
}

//BORRAR CATEGORIA
const borrarCategoria = async(req=request, res=response) => {

    const {id} = req.params;

    //Borrando la categoria
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        categoria
    });
}




module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}