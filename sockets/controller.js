const { Socket } = require("socket.io");
const { comprobarJWT } = require("../middlewares/validar-jwt");




//Este tipo de tipado no se hace con los sockets
const socketController = async(socket = new Socket()) => {

    //Obteniendo el token de los headers
    // console.log('Cliente conectado', socket.id);
    const token = socket.handshake.headers['x-token'];
    //conprovando el token
    const usuario = await comprobarJWT(token);
    
    if(!usuario){
        return socket.disconnect();
    }

    console.log('Se conecto', usuario.nombre);
}


module.exports = {
    socketController
}