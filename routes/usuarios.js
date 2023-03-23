const { Router } = require('express'); //Requerimos la funcion para rutear
const { check } = require('express-validator'); //check de express-validation para hacer las validaciones
const { usuariosGet, usuariosPut, usuarioPost, usuarioDelete, usuariosPatch } = require('../Controllers/usuarios');
const { esRoleValido, existeCorreo } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos'); //middleware de revision


const router = Router();

//TODO: Cada verbo se le pasa por parametro su ruta y un call back de lo que tiene que hacer

router.get('/', usuariosGet);

//Asi mandamos parametros en javascript configurando la ruta
router.put('/:id', usuariosPut);

//con dos parametros el sugundo es el callback del endpoint 
//con tres parametros el segundo es middleware de validacion
router.post('/', [
    //middleware que validad las propiedades enviadas. Check verifica la propiedad y isEmail la valida
    check('correo', 'El correo no es valido').isEmail(), //valida el email 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), //valida sea obligatorio
    check('password', 'El password debe ser mas de 6 letras').isLength({min:6}),  //valida la longitud
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']), //valida que sea uno de esos
    //Crear una validacion cotumizada para poder acceder y comparar valores en la base de datos
    check('rol').custom((rol) => esRoleValido(rol)),
    check('correo').custom((correo) => existeCorreo(correo)),
    validarCampos
], usuarioPost);

router.delete('/', usuarioDelete);

router.patch('/', usuariosPatch);



module.exports = router;

