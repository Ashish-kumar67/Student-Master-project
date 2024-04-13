const express = require('express');
const app= express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const  db = require('./models')



//Routers 


//courseRouter
const courseRouter = require('./routes/Courses');
app.use('/courses' , courseRouter);


//batchRouter
const batchRouter = require('./routes/Batches');
app.use('/batches' , batchRouter);



//studentsRouter
const studentRouter = require('./routes/Students');
app.use('/students' , studentRouter);


//modulesRouter
const moduleRouter = require('./routes/Modules');
app.use('/modules' , moduleRouter);


//markssRouter
const marksRouter = require('./routes/Marks');
app.use('/marks' , marksRouter);

db.sequelize.sync().then(()=>{
     app.listen(3001 , ()=>{
          console.log("server listening at 3001");
     })
})


