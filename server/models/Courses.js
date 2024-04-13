module.exports = (sequelize , DataTypes)=>{

    const Courses = sequelize.define("Courses" , {
        courseType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        courseName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        courseStartDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        courseEndDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        courseCode: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true, // Set courseCode as the primary key
            unique : true
        },
        courseFee: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        }


    })

    Courses.associate = (models)=>{
        Courses.hasMany(models.Batches,{
            foreignKey: 'courseCode', // Use courseCode as the foreign key
            onDelete: "cascade",
        });
        Courses.hasMany(models.Students,{
            foreignKey: 'courseCode', // Use courseCode as the foreign key
            onDelete: "cascade",
        });
        Courses.hasMany(models.Modules,{
            foreignKey: 'courseCode', // Use courseCode as the foreign key
            onDelete: "cascade",
        });
    }
   return Courses;
}