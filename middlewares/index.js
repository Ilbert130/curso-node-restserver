const validarCampos = require('../middlewares/validar-campos'); //middleware de revision
const validarJWT  = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');

//Exportando todo lo que se exporta en cada require
module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles
}