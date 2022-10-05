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
    const {modules, gender, count} = request.query;
    console.log('module: ', modules);
    let mentorsFiltered = json.mentors;

    if(modules){
        mentorsFiltered = mentorsFiltered.filter(mentor => mentor.module.includes(modules))
    }
    if(gender){
        mentorsFiltered = mentorsFiltered.filter(mentor => mentor.gender === gender)
    }
    if(count){
        mentorsFiltered = mentorsFiltered.splice(0, count)
    }

    response.json({
        success: true,
        data: {
            koders: mentorsFiltered || json.mentors
        }
    })
})


router.post('/', async (request, response)=>{
    const newMentor = request.body
    console.log(request.body)

    const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8')
    const json = JSON.parse(dataFile)
    
    json.mentors.push(newMentor)
    
    await fs.promises.writeFile('./kodemia.json', JSON.stringify(json, null, 2), 'utf8')
    response.json({
        success: true,
        message: 'Mentor Nuevo'
    })
})


router.get('/:idKoder', async (request, response)=>{
    console.log(request.params)
    const id = parseInt(request.params.idKoder);
    const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8')
    const json = JSON.parse(dataFile)
    
    const mentorFound = json.mentors.find(mentor => mentor.id === id)

    if(!mentorFound){
        response.status(404)
        response.json({
            success: false,
            message: 'Mentor no encontrado'
        })
        return
    }

    response.json({
        success: true,
        data: {
            mentorFound
        }
    })
})


router.patch('/:idMentor', async (request, response)=>{
    const updateMentors = [request.body];
    const id = parseInt(request.params.idMentor);
    const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8');
    const json = JSON.parse(dataFile);
    const mentorsFiltered = json.mentors.filter(koder => koder.id !== id);
    console.log(updateMentors)
    json.mentors = [...mentorsFiltered, ...updateMentors]
    
    await fs.promises.writeFile('./kodemia.json', JSON.stringify(json,null,2),'utf8');

    response.json({
        mentorUpdated: updateMentors
    })
})


router.delete('/:idMentor', async (request, response)=>{
    const id = parseInt(request.params.idMentor);
    const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8');
    let json = JSON.parse(dataFile);
    const mentorDelete = json.mentors.filter(mentor => mentor.id != id);
    json.mentors = mentorDelete
    await fs.promises.writeFile('./kodemia.json', JSON.stringify(json,null,2),'utf8');
    
    response.json({
        message: 'koder Eliminado'
    })
})

export default router