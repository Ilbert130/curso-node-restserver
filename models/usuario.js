const  {Schema, model} = require('mongoose');

//Modelo para la base datos
const UsuarioSchema = Schema({
    //Propiedades
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'] //Que sea obligatorio
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true  //Que sea unico
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    password: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE'] //Solo las opciones determinadas
    },
    estado: {
        type: Boolean,
        default: true  //valor por defecto de la propiedad
    },
    google:{
        type: Boolean,
        default: false
    }
});

//Con este metodo sacamos la propiedad version y password de nuestro retorno
//Esto pasa cuando se llama el metodo toJSON, porque sobre escribimos este
UsuarioSchema.methods.toJSON = function() {
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id; //Cambiando el nombre de _id por uid / creando la propiedad de uid
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);