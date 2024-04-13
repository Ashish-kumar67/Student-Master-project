const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');



const {Courses} = require('../models')

router.get("/" , async(req , res)=>{
  

    try {
        // fetching course list
        const courseList =  await Courses.findAll();
         res.json(courseList);
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ error: "Failed to list course" });
    }
})

// Route to fetch courses between start and end year
router.get('/:startYear-:endYear/coursesByYear', async (req, res) => {
    const { startYear, endYear } = req.params;
    try {
        const courses = await Courses.findAll({
            where: {
                courseStartDate: { [Op.between]: [`${startYear}-01-01`, `${endYear}-12-31`] }
            }
        });
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to fetch courses with current year


router.get('/:currentYear/coursesByCurrentYear', async (req, res) => {
    const { currentYear } = req.params;

    // Get the start date for the current year
    const startDate = `${currentYear}-01-01`; // Start of the current year

    try {
        const courses = await Courses.findAll({
            attributes: ['courseCode', 'courseName'],
            where: {
                courseStartDate: {
                    [Op.gte]: startDate // Filter courses where the start date is greater than or equal to the start of the current year
                }
            }
        });
        console.log(courses);
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});













router.post("/" , async(req , res)=>{
    const course = req.body;
    try {
        // Create a new course using the Courses model
        const createdCourse = await Courses.create(course);
        res.json(createdCourse); // Respond with the created course
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "Failed to create course" });
    }
})
module.exports = router; 