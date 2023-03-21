const {Router} = require('express'); //Requerimos la funcion para rutear
const { usuariosGet, usuariosPut, usuarioPost, usuarioDelete, usuariosPatch } = require('../Controllers/usuarios');


const router = Router();

//TODO: Cada verbo se le pasa por parametro su ruta y un call back de lo que tiene que hacer

router.get('/', usuariosGet);

//Asi mandamos parametros en javascript configurando la ruta
router.put('/:id', usuariosPut);

router.post('/', usuarioPost);

router.delete('/', usuarioDelete);

router.patch('/', usuariosPatch);



module.exports = router;

