const { Router } = require('express'); //Requerimos la funcion para rutear
const { check } = require('express-validator'); //check de express-validation para hacer las validaciones
const { login } = require('../Controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

//POST
router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La password es obligatorio').not().isEmpty(),
    validarCampos
], login);

module.exports = router;