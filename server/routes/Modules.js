const express = require('express');
const router = express.Router();

const {Modules} = require('../models')

router.get("/" , async(req , res)=>{
  

    try {
        // fetching module list
        const moduleList =  await Modules.findAll();
         res.json(moduleList);
    } catch (error) {
        console.error("Error fetching modules:", error);
        res.status(500).json({ error: "Failed to list modules" });
    }
})

router.post("/" , async(req , res)=>{
    const module = req.body;
    try {
        // Create a new course using the  Bmodules model
        const createdModule = await Modules.create(module);
        res.json(createdModule); // Respond with the created  module
    } catch (error) {
        console.error("Error creating  module:", error);
        res.status(500).json({ error: "Failed to create module" });
    }
})
module.exports = router; 