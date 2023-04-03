const { response, request } = require('express');

//Middleware para validar el rol del usuario para hacer la accion
const esAdminRole = (req = request, res = response, next) => {

    //El req contiene la informacion del usuario por que esta de obtine en el primer middleware
    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    //Se estrae el rol y el nombre
    const { rol, nombre} = req.usuario;

    //Se valida el rol
    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        });
    }

    next();
}

//Verificando varios roles de manera simultanea
const tieneRole = (...roles) => {  //mandamos los roles

    //Y como es una cadena de meddlewares, la funcion debe retornar un middleware
    return (req = request, res = response, next) => {

        //El req contiene la informacion del usuario por que esta de obtine en el primer middleware
        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        //verificando si el rol del usuario es igual que uno de los roles expecificados
        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}