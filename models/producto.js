const  {Schema, model} = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String, 
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean, 
        default: true,
        require: true
    },
    usuario: {                          //Asi es como se relacionan las tablas en mongo con mongoose
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',                 //Se pone el nombre de los esquemas en singular tal como se le asigno cuando se creo
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion:{
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    }
});


module.exports  = model('Producto', ProductoSchema);