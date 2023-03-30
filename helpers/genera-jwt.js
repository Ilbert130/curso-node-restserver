const jwt = require('jsonwebtoken');

//Generando el JWT
const generarJWT = ( uid = '') => {

    //Retornanado una promesa
    return new Promise((resolve, reject) => {

        const payload = {uid};

        //Creando el JWT con el metodo sign
        jwt.sign(payload, process.env.SECRETORPRIVATEKY, {
            expiresIn: '4h'    //determinamos tambien cuando expira el token
        }, (err, token) => {   //Mandamos un callback con el err y el token

            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            }else{
                resolve(token);
            }
        });
    });
}

module.exports ={
    generarJWT
}