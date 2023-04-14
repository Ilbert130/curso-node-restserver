const { v4: uuidv4 } = require('uuid');
const path = require('path');

const subirArchivo = (files, extencionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'img'], carpeta = '') => {

    //Creando una promesa para manejar la creacion de archivo
    return new Promise((resolve, reject) => {
        //Obtenemos el archivo
        const { archivo } = files;

        //Obteniendo la extencion
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        //validar la extencion
        if(!extencionesValidas.includes(extension)){
            return reject(`La extension ${extension} no es permitida - ${extencionesValidas}`);
        }

        //Asignandole un numbre randon al archivo
        const nombreTemp = uuidv4() + '.' + extension;
        //Creamos el path/ la ruta donde se guardara
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        //Movemos el archivo a esa ruta
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
        });
    });
}

module.exports = {
    subirArchivo
}