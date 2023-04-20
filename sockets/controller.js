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

    //sala individual, conectar a sala especial
    //creando una sala por usuario.id
    socket.join(usuario.id);    //sala global, socket.id, usuario.id



    //Limpiar cuando alguien se desconnecta. disconnect es un evento interno
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    })

    socket.on('enviar-mensaje', ({uid, mensaje})=> {
        
        if(uid){
            //Mensaje privado
            //Enviando el mensaje a una sala especifica por usuario.id
            socket.to(uid).emit('mensaje-privados', {de: usuario.nombre, mensaje});

        }else{
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensaje', chatMensajes.ultimos10);
        }     
    });

}


module.exports = {
    socketController
}