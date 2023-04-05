const { Router } = require('express'); //Requerimos la funcion para rutear
const { buscar } = require('../Controllers/buscar');

const router = Router();

//GET: Ruta para hacer las busquedas en nuestra api
router.get('/:coleccion/:termino', buscar)



module.exports = router;