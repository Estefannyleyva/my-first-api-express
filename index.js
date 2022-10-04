// 
// require()

// import_ from ''; modules
// "type": "module" // 

import express from 'express'
import fs from 'fs'

const server = express() // creando nuestro server


//middleware convertir lo que llega en texto/json
server.use(express.json())

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

server.get('/hola', (request, response) =>{
    response.write('GET /hola');
    response.end();
})


server.post('/', (request, response) =>{
    response.write('POST /');
    response.end();
})

// server.patch('/', (request, response) =>{
//     response.write('PATCH /');
//     response.end();
// })

/*
Ejercicio:
    - GET /koders -> Response json : {message: 'Aquí estarán todos los koders'}
    - POST /koders -> Response json : {message: 'Aquí se crearán koders'}
    - PATCH /koders -> Response json : {message: 'Aquí se actualizarán koders'}
    - DELETE /koders -> Response json : {message: 'Aquí se eliminarán koders'}

*/

// practica koders
// server.get('/koders', (request, response)=>{
//     response.json({message: 'Aquí estarán todos los koders'})
// })

// server.post('/koders', (request, response)=>{
//     response.json({message: 'Aquí se crearán koders'})
// })

// server.patch('/koders', (request, response)=>{
//     response.json({message: 'Aquí se actualizarán koders'})
// })

// server.delete('/koders', (request, response)=>{
//     response.json({message: 'Aquí se eliminarán koders'})
// })


server.get('/koders', async (request, response)=>{
    const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8')
    const json = JSON.parse(dataFile)
    const koders = json.koders
    response.json({
        success: true,
        data: {
            koders
        }
    })
})

server.post('/koders', async (request, response)=>{
    const newKoder = request.body
    console.log(request.body)

    const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8')
    const json = JSON.parse(dataFile)
    
    json.koders.push(newKoder)
    
    await fs.promises.writeFile('./kodemia.json', JSON.stringify(json, null, 2), 'utf8')
    response.json({
        success: true,
        message: 'Koder creado'
    })
})

server.get('/koders/:idKoder', async (request, response)=>{
    console.log(request.params)
    const id = parseInt(request.params.idKoder);
    const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8')
    const json = JSON.parse(dataFile)

    const koderFound = json.koders.find(koder => koder.id === id)

    if(!koderFound){
        response.status(404)
        response.json({
            success: false,
            message: 'koder no encontrado'
        })
        return
    }

    response.json({
        success: true,
        data: {
            koderFound
        }
    })
})
server.patch('/koders/:idKoder', async (request, response)=>{
    const updateKoder = request.body;
    const id = parseInt(request.params.idKoder);
    const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8');
    const json = JSON.parse(dataFile);
    const koderFound = json.koders.find(koder => koder.id === id);
    koderFound.id = updateKoder.id;
    koderFound.name = updateKoder.name;
    koderFound.gender = updateKoder.gender;   
    koderFound.generation = updateKoder.generation;
    console.log(koderFound);
    await fs.promises.writeFile('./kodemia.json', JSON.stringify(json,null,2),'utf8');

    response.json({
        koderUpdate: koderFound
    });
})

server.delete('/koders/:idKoder', async (request, response)=>{
    const id = parseInt(request.params.idKoder);
    const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8');
    const json = JSON.parse(dataFile);
    const koderDelete = json.koders.filter(koder => koder.id != id);
    await fs.promises.writeFile('./kodemia.json', JSON.stringify(koderDelete,null,2),'utf8');
    
    response.json({
        message: 'koder Eliminado'
    })
})


// Poner a escuchar a nuestro server

server.listen(8080, () =>{
    console.log('Server Listening on port 8080')
})

