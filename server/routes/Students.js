const express = require('express');
const router = express.Router();

const {Students} = require('../models')

router.get("/" , async(req , res)=>{
  

    try {
        // fetching student list
        const studentList =  await Students.findAll();
         res.json(studentList);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Failed to list students" });
    }
})


// Route to fetch students enrolled in a specific course
router.get('/course/:courseCode/studentsInCourse', async (req, res) => {
    const { courseCode } = req.params;
    try {
        const students = await Students.findAll({
            where: { courseCode },
            attributes: ['studentName', 'studentRollCode', 'studentRegistrationCode'] // Specify fields to retrieve
        });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to getnumber of student in a batch

router.get('/batchCode=:batchCode/totalStudents', async (req, res) => {
    const { batchCode } = req.params;
    try {
        const totalStudents = await Students.count({
            where: { batchCode }
        });
        res.json({ totalStudents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});










router.post("/" , async(req , res)=>{
    const student = req.body;
    try {
        // Create a new course using the Students model
        const createdStudent = await Students.create(student);
        res.json(createdStudent); // Respond with the created student
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ error: "Failed to create student" });
    }
})
module.exports = router; 