const { response, request } = require('express');


//GET
const usuariosGet = (req = request, res = response) =>{
    
    //Para obtener los querys que vienen en la ruta de nuestra peticion
    //api/usuarios?q=hola&nombre=ilbert&apikey=234324234 ejemplo de querys
    // const query = req.query;
    const {q, nombre = 'no name', apikey, page = 1, limit} = req.query;

    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

//PUT
const usuariosPut = (req, res) =>{

    //Asi se obtine el parametro mandado por la ruta en javascript
    //req.params.id //Tambien podemos acceder a ellos de manera individual
    const  {id} = req.params;

    res.json({
        msg: 'put API - Controlador',
        id: id
    });
}

//POST
const usuarioPost = (req, res) =>{

    //const body = req.body;  //con este manera nos trae todo el body
    //Si lo hacemos de la manera de abajo evitamos obtener informacion inecesaria. Obteniendo solo lo que queremos.
    const {nombre, edad} = req.body;

    res.status(201).json({
        msg: 'post API - Controler',
        nombre: nombre,
        edad: edad
    });
}

//DELETE
const usuarioDelete = (req, res) =>{
    res.json({
        msg: 'delete API - Controler'
    });
}

//PATCH
const usuariosPatch = (req, res) =>{
    res.json({
        msg: 'patch API - Controler'
    });
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuarioPost,
    usuarioDelete,
    usuariosPatch
}