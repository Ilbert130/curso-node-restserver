const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { cargarArchivo } = require('../controllers/uploads');


const router = Router();

//POST
router.post('/', cargarArchivo);



module.exports = router;