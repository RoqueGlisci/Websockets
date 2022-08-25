const socket = io.connect();
//------------------------------------------------------------------------------------

//form
const formAgregarProducto = document.getElementById('formAgregarProducto');

formAgregarProducto.addEventListener('submit', () => {
    const nombre = document.querySelector("#nombre").value;
    const precio = document.querySelector("#precio").value;
    const foto = document.querySelector("#foto").value;

    const producto = {
        nombre: nombre,
        precio: precio,
        foto: foto
    };
   socket.emit('producto', producto);
});

socket.on("productos", async productos => {
    const info = makeHtmlTable(productos);
    const div = document.querySelector("#productos");
    div.innerHTML = await info
});

function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
};

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', () => {

    //Armar el objeto de mensaje y luego emitir mensaje al evento nuevoMensaje con sockets
    const text = inputMensaje.value;
    const autor = inputUsername.value;
    const date = Date.now();
    const newDate = new Date(date);
    const fecha = newDate.toLocaleString();
    const mensaje = {
        mensaje: text, 
        autor: autor, 
        fecha: fecha
    }
    socket.emit('nuevoMensaje', mensaje);
    
    formPublicarMensaje.reset()
    inputMensaje.focus()
})

socket.on('mensajes', async data => {
    console.log(data)
    const info = makeHtmlList(data);
    const div = document.getElementById('mensajes');
    div.innerHTML = await info;
})

const makeHtmlList = async (mensajes) => {
    const html = mensajes.map((el) => {
        return(`<div><span class="autor">${el.autor}</span> <span class="fecha">${el.fecha}:</span>  <span class="mensaje">${el.mensaje}</span></div>`)
    }).join(" ");
    return html
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})
