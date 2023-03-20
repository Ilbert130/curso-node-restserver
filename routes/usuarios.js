const {Router} = require('express');
const { usuariosGet, usuariosPut, usuarioPost, usuarioDelete, usuariosPatch } = require('../Controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

//Asi mandamos parametros en javascript configurando la ruta
router.put('/:id', usuariosPut);

router.post('/', usuarioPost);

router.delete('/', usuarioDelete);

router.patch('/', usuariosPatch);



module.exports = router;

