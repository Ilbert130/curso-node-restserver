const { Router } = require('express'); //Requerimos la funcion para rutear
const { check } = require('express-validator'); //check de express-validation para hacer las validaciones
const { login, googleSignIn } = require('../Controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

//POST
router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La password es obligatorio').not().isEmpty(),
    validarCampos
], login);

//POST
router.post('/google', [
    check('id_token', 'Token de google es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;