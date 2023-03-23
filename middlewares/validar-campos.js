const { validationResult } = require("express-validator");


const validarCampos = (req, res, next) => {
    const errors = validationResult(req);   //Para retornar el error de la validacion del middleware
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    next(); //para validar todo los middleware de validaciones
}


module.exports = {
    validarCampos
}