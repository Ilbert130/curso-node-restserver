const { request, response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivos');



//POST: Cargar archivio
const cargarArchivo = async(req=request, res= response) => {

    //Validando si hay algun archivo enviando
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      res.status(400).send('No hay archivos que subir');
      return;
    }
    
    try {
        //Subiendo archivo: resive el archivo, los tipos, donde se guardara
        const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');

        res.json({
            nombre
        });

    } catch (msg) {
        res.status(400).json({
            msg
        });
    }
    
    
}


module.exports = {
    cargarArchivo
}
