module.exports = (sequelize , DataTypes)=>{

    const Modules = sequelize.define("Modules" , {
       
        moduleName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
       
        moduleCode: {
            type: DataTypes.STRING,
            allowNull: false,
        
        },
        moduleUniqueCode: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true, // Set as the primary key
            unique : true
        },
       
        courseCode:{
            type:DataTypes.STRING,
            allowNull:false
        },
       

    })

    
    Modules.associate = (models) => {
        Modules.belongsTo(models.Courses, {
            foreignKey: 'courseCode', // Reference courseCode of Courses table
            targetKey: 'courseCode', // Target the courseCode column
        });
        Modules.hasMany(models.Marks,{
            foreignKey: 'moduleCode', // Use courseCode as the foreign key
            onDelete: "cascade",
        });
       
    };

   return Modules;
}