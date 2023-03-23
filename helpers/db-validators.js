const Role = require('../models/role'); //Requiriendo el modelo rol para hacer las comparaciones
const Usuario = require('../models/usuario');  //Requiriendo el modelo usuario para hacer la comparacion

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

module.exports = {
    esRoleValido,
    existeCorreo
}