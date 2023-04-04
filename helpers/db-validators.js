const { Categoria, Usuario, Role, Producto } = require('../models'); //Requiriendo los modelos para hacer la comparacion

//Validacion rol
const esRoleValido =  async(rol = '') => {
    const existeRol = await Role.findOne({rol: rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta definido en la base de datos`);
    }
}

//Validacion usuario
const existeCorreo =  async(correo = '') => {
    const existeEmail = await Usuario.findOne({correo: correo});
    if(existeEmail){
        throw new Error(`El correo ${correo} ya esta registrado`);
    }
}

//Validar si el usuario existe por id
const existeUsuarioPorId = async( id) => {
    const existeUsuarioPorId = await Usuario.findById(id); //No es necesario poner el id como parametro
    if(!existeUsuarioPorId){
        throw new Error(`El usuario con id ${id} no existe`);
    }
}

//validar si la categoria existe por id
const existeCategoria = async(id) => {
    const existCategoriaPorId = await Categoria.findById(id);
    if(!existCategoriaPorId || !existCategoriaPorId.estado){
        throw new Error(`La categoria con id ${id} no existe`);
    }
}

//validar si el producto existe por id
const existeProducto = async(id) => {
    const existProductoPorId = await Producto.findById(id);
    if(!existProductoPorId || !existProductoPorId.estado){
        throw new Error(`El producto con id ${id} no existe`);
    }
}

//validar si el producto existe por nombre
const existeProductoNombre = async(nombre) => {
    const existeProducto = await Producto.find({nombre: nombre.toUpperCase()});
    if(existeProducto){
        throw new Error(`El producto ${nombre} ya existe`);
    }
}

module.exports = {
    esRoleValido,
    existeCorreo,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    existeProductoNombre
}