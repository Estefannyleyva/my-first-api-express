// 
// require()

// import_ from ''; modules
// "type": "module" // 

import express from 'express'
import mentorsRouter from './routers/mentores.router.js'
import kodersRouter from './routers/koders.router.js'
const server = express() // creando nuestro server


//middleware convertir lo que llega en texto/json
server.use(express.json())
server.use('/koders', kodersRouter)
server.use('/mentors', mentorsRouter)
server.get('/', (request, response) =>{
    // response.setHeader('Content-Type', 'application/json');
    // const message = {
    //     message: 'Hola desde GET /'
    // }
    // const jsonString = JSON.stringify(message);
    // response.write('GET /');
    // response.end();

    //express
    response.json({
        menssage: 'Hola desde GET /'
    })
})



// Poner a escuchar a nuestro server

server.listen(8080, () =>{
    console.log('Server Listening on port 8080')
})

