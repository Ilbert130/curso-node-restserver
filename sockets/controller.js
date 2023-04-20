const { Socket } = require("socket.io");
const { comprobarJWT } = require("../middlewares/validar-jwt");
const ChatMensajes = require("../models/chat-mensajes");


const chatMensajes = new ChatMensajes();

//Este tipo de tipado no se hace con los sockets
const socketController = async(socket = new Socket(), io) => {

    //Obteniendo el token de los headers
    // console.log('Cliente conectado', socket.id);
    const token = socket.handshake.headers['x-token'];
    //conprovando el token
    const usuario = await comprobarJWT(token);
    
    if(!usuario){
        return socket.disconnect();
    }
    
    //Usamos directamente io para emitir el mensaje o evento a todo el mundo incluso quien lo envia
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    io.emit('recibir-mensaje', chatMensajes.ultimos10);

    //Limpiar cuando alguien se desconnecta. disconnect es un evento interno
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    })

    socket.on('enviar-mensaje', ({uid, mensaje})=> {
        
        chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
        io.emit('recibir-mensaje', chatMensajes.ultimos10);
    });

}


module.exports = {
    socketController
}