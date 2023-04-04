const { Router } = require('express'); //Requerimos la funcion para rutear
const { check } = require('express-validator'); //check de express-validation para hacer las validaciones
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, esAdminRole } = require('../middlewares');
const { existeCategoria, existeProducto, existeProductoNombre } = require('../helpers/db-validators');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, eleminarProducto } = require('../Controllers/productos');
const { route } = require('./auth');

const router = Router();

//GET
router.get('/', obtenerProductos);

//GET
router.get('/:id', [
    check('id', 'No es un Id valido en mongo').isMongoId(),
    check('id').custom(id => existeProducto(id)),
    validarCampos
], obtenerProducto);

//POST
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(nombre => existeProductoNombre(nombre)),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('descripcion', 'El descripcion es obligatorio').not().isEmpty(),
    check('categoria').custom(categoria => existeCategoria(categoria)),
    validarCampos
], crearProducto);

//PUT
router.put('/:id', [
    validarJWT,
    check('id', 'No es un Id valido en mongo').isMongoId(),
    check('id').custom(id => existeProducto(id)),
    validarCampos
], actualizarProducto);

//DELETE
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id valido en mongo').isMongoId(),
    check('id').custom(id => existeProducto(id)),
    validarCampos
], eleminarProducto);

module.exports = router;