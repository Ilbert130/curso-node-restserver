const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { request, response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivos');
const { Usuario, Producto } = require('../models');

//Configurandor cloudinary
cloudinary.config(process.env.CLOUDINARY_URL);


//GET: Obteniendo la imagen
const mostrarImagen = async(req=request, res= response) => {

    const { id, coleccion } = req.params;

    let pathImagen;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    //Validando si tiene alguna imagen
    if(modelo.img){
        //Devolviendo la imagen
        console.log(__dirname);
        pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen);
        }
    }

    pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);
}


//POST: Cargar archivio
const cargarArchivo = async(req=request, res= response) => {
    
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

//PUT: Actualizar archivo local
const actualizarImagen = async(req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    //Limpiar imagenes previas
    if(modelo.img){
        //Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

    modelo.img = await subirArchivo(req.files, undefined, coleccion);

    await modelo.save();

    res.json({
        modelo
    });
}

//PUT: Actualizar imagen
const actualizarImagenCloudinary = async(req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    //Limpiar imagenes previas
    if(modelo.img){
        //Hay que borrar la imagen del servidor cloudinary
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    //Subiendo la foto a cloudinary
    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    
    modelo.img = secure_url;
    await modelo.save();

    res.json({
        modelo
    });
}



module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
