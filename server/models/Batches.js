module.exports = (sequelize , DataTypes)=>{

    const Batches = sequelize.define("Batches" , {
       
        batchName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        batchProposedStartDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        batchProposedEndDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        batchActualStartDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        batchActualEndDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        batchCode: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true, // Set as the primary key
            unique : true
        },
        courseCode: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },


    })

    
    Batches.associate = (models) => {
        Batches.belongsTo(models.Courses, {
            foreignKey: 'courseCode', // Reference courseCode of Courses table
            targetKey: 'courseCode', // Target the courseCode column
        });
        Batches.hasMany(models.Students,{
            foreignKey: 'batchCode', // Use courseCode as the foreign key
            onDelete: "cascade",
        });
      
    };

 


   return Batches;
}