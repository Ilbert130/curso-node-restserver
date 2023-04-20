
//Referencias HTML
const miFormulario = document.querySelector('form');




//Autenticacion manual
miFormulario.addEventListener('submit', ev => {
    //Evetiar el refresh
    ev.preventDefault();

    const formData = {};

    //Leyendo los inputs 
    for(let el of miFormulario.elements){
        if(el.name.length > 0){
            formData[el.name] = el.value;
        }
    }

    fetch('http://localhost:8083/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json'}
    })
    .then(resp => resp.json())
    .then(({msg, token}) => {
        
        if(msg){
            return console.error(msg);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html'; //Redireccionando
    })
    .catch(err => {
        console.log(err);
    });

});


//Actenticacion con google
function handleCredentialResponse(response) {

    const body = {id_token: response.credential};

    //console.log(response.credential);
    //Usando fetch api para comunicarnos con nuestro back end para mandar la data
    fetch('http://localhost:8083/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(({token}) => {
            
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);
}

//Proceso para deslogearse
const button = document.getElementById('google_signout');
button.onclick = () => {
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}