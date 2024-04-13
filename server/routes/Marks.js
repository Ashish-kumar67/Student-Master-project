const express = require('express');
const router = express.Router();

const {Marks} = require('../models')

router.get("/" , async(req , res)=>{
  

    try {
        // fetching marks list
        const marksList =  await Marks.findAll();
         res.json(marksList);
    } catch (error) {
        console.error("Error fetching marks:", error);
        res.status(500).json({ error: "Failed to list marks" });
    }
})

router.post("/" , async(req , res)=>{
    const mark = req.body;
    try {
        // Create a new course using the  marks model
        const createdMarks = await Marks.create(mark);
        res.json(createdMarks); // Respond with the created  marks
    } catch (error) {
        console.error("Error creating  marks:", error);
        res.status(500).json({ error: "Failed to create marks" });
    }
})
module.exports = router; 