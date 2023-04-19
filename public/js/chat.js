

let usuario = null;
let socket = null;


//Validar JWT del localstorage
const validarJWT = async()=>{

    const token = localStorage.getItem('token') || '';

    if(token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay tokne en el servidor');
    }

    const resp = await fetch('http://localhost:8083/api/auth/', {
        headers: {'x-token': token}
    });

    const {usuario: userDB, token:tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();
}

const conectarSocket = async() =>{

    //Instancia de socket en el cliente
    const socket = io({
        //Informacion estra
        'extraHeaders': {
            'x-token':localStorage.getItem('token')
        }
    });
}


const main = async() =>{

    await validarJWT();
}


main();

