const { Router } = require('express'); //Requerimos la funcion para rutear
const { check } = require('express-validator'); //check de express-validation para hacer las validaciones
const { usuariosGet, usuariosPut, usuarioPost, usuarioDelete, usuariosPatch } = require('../Controllers/usuarios');
const { esRoleValido, existeCorreo, existeUsuarioPorId } = require('../helpers/db-validators');
const {validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares'); //Importando el index de la carpeta middleware

// const { validarCampos } = require('../middlewares/validar-campos'); //middleware de revision
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');


const router = Router();

//TODO: Cada verbo se le pasa por parametro su ruta y un call back de lo que tiene que hacer

router.get('/', usuariosGet);

//Asi mandamos parametros en javascript configurando la ruta
router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),//validacion del id
    check('id').custom(id => existeUsuarioPorId(id)),
    check('rol').custom((rol) => esRoleValido(rol)),
    validarCampos  //Este metodo se llama luego de hacer las validaciones para validar los campos
],usuariosPut);

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

router.delete('/:id',[
    validarJWT,                                     //Agregando la validacion de que si tiene un JWT valido
    // esAdminRole,                                    //middleware para validar el rol de usuario. Resive la informacion del usuario del primer middleware
    //Esto es una funcion que devulve un middleware, por eso se puede ejecutar. Resivir argumentos en los middlewares
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),         //Validacion de multiples roles de manera simultanea
    check('id', 'No es un id valido').isMongoId(),  //validacion del id
    check('id').custom(id => existeUsuarioPorId(id)),
    validarCampos
], usuarioDelete);

router.patch('/', usuariosPatch);



module.exports = router;

