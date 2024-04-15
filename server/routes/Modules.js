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


// inserting all modules of a course.
router.post("/createCourseModules", async (req, res) => {
    const modules = req.body.modules; // Assuming req.body contains an array of modules
    try {
        // Insert multiple modules into the database
        const createdModules = await Modules.bulkCreate(modules);
        res.json(createdModules); // Respond with the created modules
    } catch (error) {
        console.error("Error creating modules:", error);
        res.status(500).json({ error: "Failed to create modules" });
    }
});




module.exports = router; 