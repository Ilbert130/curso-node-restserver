const { request, response } = require("express");
const { Producto } = require("../models");



//GET
const obtenerProductos = async(req = request, res = response) => {

    //Crear paginacion
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    //Populations Parameters
    const populateUsuario = ['nombre', 'correo', 'rol', 'uid'];

    //Obteniendo los productos y el total
    const [productos, total] = await Promise.all([
        Producto.find(query).populate('usuario', populateUsuario).populate('categoria', 'nombre').skip(+desde).limit(+limite),
        Producto.countDocuments(query)
    ]);

    res.json({
        total,
        productos
    });
}

//GET
const obtenerProducto = async(req= request, res= response) => {

    const {id} = req.params;
    const query = {estado: true};

    //Populations Parameters
    const populateUsuario = ['nombre', 'correo', 'rol', 'uid'];

    const [producto, total] = await Promise.all([
        Producto.findById(id).populate('usuario', populateUsuario).populate('categoria', 'nombre'),
        Producto.countDocuments(query)
    ]);

    res.json({
        total,
        producto
    });
}


//POST
const crearProducto = async(req = request, res = response) => {

    //Obtener la data del producto
    const {nombre, precio, categoria, descripcion} = req.body;

    //Generar la data a guardar
    const data = {
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id,
        precio,
        categoria,
        descripcion
    }

    //Creando un producto
    const producto = new Producto(data);
    await producto.save();

    //Devolviendo el resultado de la creacion
    res.status(201).json(producto);
}

//PUT
const actualizarProducto = async(req=request, res=response) => {

    //data de los parametros
    const {id} = req.params;

    //data del body
    const {nombre, precio, categoria, descripcion, disponible} = req.body;

    const data = {
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id,
        precio,
        categoria,
        descripcion,
        disponible
    }

    //Actualiza y devuelve el producto
    const producto = await Producto.findByIdAndUpdate(id, data, {new:true});

    //respuesta
    res.json({
        producto
    });
}


//DELETE
const eleminarProducto = async(req=request, res=response) => {

    const {id} = req.params;

    //Borrar producto
    const producto = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true});

    //respuesta
    res.json({
        producto
    });
}


module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eleminarProducto
}