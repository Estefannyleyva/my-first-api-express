import express from 'express';
import fs from 'fs'
const router = express.Router();

router.get('/', async (request, response)=>{
    const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8')
    const json = JSON.parse(dataFile)
    // const koders = json.koders

    // accedo a los query params directamente en el request
    const queries = request.query;
    console.log('queries: ', queries);
    const {generation, gender, count} = request.query;
    console.log('generation: ', generation);
    let kodersFiltered = json.koders;

    if(generation){
        kodersFiltered = kodersFiltered.filter(koder => koder.generation === parseInt(generation))
    }
    if(gender){
        kodersFiltered = kodersFiltered.filter(koder => koder.gender === gender)
    }
    if(count){
        kodersFiltered = kodersFiltered.splice(0, count)
    }

    response.json({
        success: true,
        data: {
            koders: kodersFiltered || json.koders
        }
    })
})


router.post('/', async (request, response)=>{
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


router.get('/:idKoder', async (request, response)=>{
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


router.patch('/:idKoder', async (request, response)=>{
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


router.delete('/:idKoder', async (request, response)=>{
    const id = parseInt(request.params.idKoder);
    const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8');
    let json = JSON.parse(dataFile);
    const koderDelete = json.koders.filter(koder => koder.id != id);
    json.koders = koderDelete
    await fs.promises.writeFile('./kodemia.json', JSON.stringify(json,null,2),'utf8');
    
    response.json({
        message: 'koder Eliminado'
    })
})

export default router