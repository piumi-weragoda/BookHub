import express from 'express';

const router = express.Router();

//------------------------------------------------------------
//create
//delete
//update
//------------------------------------------------------------

router.post('/', async(req, res) => {
    try {
       const { title, caption, rating, image } = req.body;
       
       if(!image || !title || !caption || !rating){ {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        //upload image to cloudinary and save that in to the MongoDB

    

    }} catch (error) {
        
    }})

export default router;

