module.exports = (sequelize , DataTypes)=>{

    const Students = sequelize.define("Students" , {
       
        studentName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        studentFatherName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        studentMotherName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        studentAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        studentDistrict: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        studentState: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        studentPinCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        studentBirthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        studentAdmissionDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        studentPhoneNumber: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        studentWhatsappNumber: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        studentEmail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        studentFormNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        studentQualification:{
            type:DataTypes.STRING,
            allowNull:false
        },
        studentGender:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                isIn : [["male", "female" , "other"]]
            }
        },
        studentReligion:{
            type:DataTypes.STRING,
            allowNull:false
        },
        studentCaste:{
            type:DataTypes.STRING,
            allowNull:false
        },
        studentMaritalStatus:{
            type:DataTypes.STRING,
            allowNull:false
        },
        studentHandicappedStatus:{
            type:DataTypes.BOOLEAN,
            allowNull:false
        },
        studentExServicemanStatus:{
            type:DataTypes.BOOLEAN,
            allowNull:false
        },
        studentGovIdType:{
            type:DataTypes.STRING,
            allowNull:false
        },
        studentGovId:{
            type:DataTypes.STRING,
            allowNull:false
        },
        studentRollCode:{
            type:DataTypes.STRING,
            allowNull:false,
            primaryKey: true, // Set as the primary key
            unique : true
        },
        studentRegistrationCode:{
            type:DataTypes.STRING,
            allowNull:false
        },
        batchCode:{
            type:DataTypes.STRING,
            allowNull:false
        },
        courseCode:{
            type:DataTypes.STRING,
            allowNull:false
        }
       


    })



    Students.associate = (models) => {
        Students.belongsTo(models.Courses, {
            foreignKey: 'courseCode', // Reference courseCode of Courses table
            targetKey: 'courseCode', // Target the courseCode column
        });
        Students.belongsTo(models.Batches, {
            foreignKey: 'batchCode', // Reference courseCode of Courses table
            targetKey: 'batchCode', // Target the courseCode column
        });
        Students.hasMany(models.Marks,{
            foreignKey: ' studentRollCode', // Use courseCode as the foreign key
            onDelete: "cascade",
        });
    };

    
   return Students;
}