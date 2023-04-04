const  {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
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
});


module.exports  = model('Categoria', CategoriaSchema);