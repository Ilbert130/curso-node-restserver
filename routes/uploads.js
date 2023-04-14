const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarArchivo } = require('../middlewares');


const router = Router();

//GET
router.get('/:coleccion/:id',[
    check('id', 'El id debe ser de mongo').isMongoId(),
    //Como esta validacion resive dos valores por parametros debemos devolver true, coleccionesPermitidas
    check('coleccion').custom(c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);

//POST
router.post('/', validarArchivo, cargarArchivo);

//PUT
router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser de mongo').isMongoId(),
    //Como esta validacion resive dos valores por parametros debemos devolver true, coleccionesPermitidas
    check('coleccion').custom(c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos
],actualizarImagenCloudinary);
// ], actualizarImagen);

module.exports = router;