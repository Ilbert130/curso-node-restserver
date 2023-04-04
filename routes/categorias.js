const { Router } = require('express'); //Requerimos la funcion para rutear
const { check } = require('express-validator'); //check de express-validation para hacer las validaciones
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, esAdminRole } = require('../middlewares');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../Controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');


const router = Router();

//GET: Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Crear middleware personalizado para el id si existe existeCategoria helper
//GET: Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un Id valido en mongo').isMongoId(),
    check('id').custom(id => existeCategoria(id)), 
    validarCampos
],obtenerCategoria);

//POST: Crea una categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//PUT: Actualizar una categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un Id valido en mongo').isMongoId(),
    check('id').custom(id => existeCategoria(id)), 
    validarCampos
], actualizarCategoria);

//DELETE: Borrar una categoria - privado - solo se es un Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id valido en mongo').isMongoId(),
    check('id').custom(id => existeCategoria(id)),
    validarCampos
], borrarCategoria);


module.exports = router;