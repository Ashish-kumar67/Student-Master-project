module.exports = (sequelize , DataTypes)=>{

    const Marks = sequelize.define("Marks" , {
       
        moduleName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
       
        moduleCode: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
        moduleMarks: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        moduleGrades: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        courseCode:{
            type:DataTypes.STRING,
            allowNull:false
        },
        batchCode:{
            type:DataTypes.STRING,
            allowNull:false
        },
        studentRollCode:{
            type:DataTypes.STRING,
            allowNull:false
        },
        studentRegistrationCode:{
            type:DataTypes.STRING,
            allowNull:false
        },
        marksUniqueCode: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true, // Set as the primary key
            unique : true
        },

    })

    
    Marks.associate = (models) => {
        Marks.belongsTo(models.Modules, {
            foreignKey: 'moduleUniqueCode', // Reference courseCode of Courses table
            targetKey: 'moduleUniqueCode', // Target the courseCode column
        });
        Marks.belongsTo(models.Students, {
            foreignKey: 'studentRollCode', // Reference courseCode of Courses table
            targetKey: 'studentRollCode', // Target the courseCode column
        });
       
    };

   return Marks;
}