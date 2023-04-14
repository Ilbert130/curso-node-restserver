const { request, response } = require("express")



const validarArchivo = (req = request, res = response, next) => {
    
    //Validando si hay algun archivo enviando
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivos que subir - validarArchivoSubir'
        });
    }

    next();
}

module.exports = {
    validarArchivo
}