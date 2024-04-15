const express = require('express');
const router = express.Router();

const {Batches} = require('../models')

router.get("/" , async(req , res)=>{
  

    try {
        // fetching batch list
        const batchList =  await Batches.findAll();
         res.json(batchList);
    } catch (error) {
        console.error("Error fetching batches:", error);
        res.status(500).json({ error: "Failed to list batches" });
    }
})


//getting all the batches of that course code

router.get("/course=:courseCode" , async(req , res)=>{
    const { courseCode } = req.params;

    try {
        const batches = await Batches.findAll({
           
            where: {
                courseCode:courseCode
            }
        });
       
        res.json(batches);
    } catch (error) {
        console.error("Error fetching batches by courseCode:", error);
        res.status(500).json({ error: "Failed to list batches by courseCode" });
    }
})

router.get("/FindBatchCode=:batchCode", async (req, res) => {
  const { batchCode } = req.params;

  try {
    const batch = await Batches.findAll({
      where: {
        batchCode: batchCode
      }
    });

    // If batch exists, return true; otherwise, return false
    if (batch.length==1) {
      res.json({ exists: true});
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking if batch exists:", error);
    res.status(500).json({ error: "Failed to check if batch exists" });
  }
});







router.post("/", async (req, res) => {
    const batch = req.body;
  
    try {
      // Find all batches for the given courseCode
      const existingBatches = await Batches.findAll({ where: { courseCode: batch.courseCode } });
  
      // Check if the batchCode already exists for the given courseCode
      const existingBatch = existingBatches.find(b => b.batchCode === batch.batchCode);
      if (existingBatch) {
        return res.status(400).json({ error: `Batch code '${batch.batchCode}' already exists for course '${batch.courseCode}'` });
      }
  
      // Create a new batch using the Batches model
      const createdBatch = await Batches.create(batch);
      res.json(createdBatch); // Respond with the created batch
    } catch (error) {
      console.error("Error creating batch:", error);
      res.status(500).json({ error: "Failed to create batch" });
    }
  });
module.exports = router; 