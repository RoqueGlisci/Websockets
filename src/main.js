const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const ContenedorMemoria = require('../contenedores/ContenedorMemoria.js')
const ContenedorArchivo = require('../contenedores/ContenedorArchivo.js')

//--------------------------------------------
// instancio servidor, socket y api
const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);
const memoria = new ContenedorMemoria();
const archivo = new ContenedorArchivo('../mensajes.txt');

app.use(express.static('../public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
})

//--------------------------------------------
// configuro el socket

const guardarTxt = async (obj) => {
    await archivo.guardar(obj)
}

io.on('connection', async socket => {
    //tabla de productos
    socket.on('producto', data => {
        memoria.guardar(data);
        console.log(data)
    });
    const todosProductos = memoria.listarAll();
    socket.emit('productos', todosProductos);

    //chat global
    
    const mensajes = await archivo.listarAll()
    console.log(mensajes)
    socket.emit('mensajes', mensajes);

    socket.on('nuevoMensaje', async (data) => {
        await guardarTxt(data)
        io.sockets.emit('mensajes', mensajes);
    });
 
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
