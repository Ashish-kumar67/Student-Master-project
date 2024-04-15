import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const StudentAdmission = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [batchCodeValue, setBatchCodeValue] = useState(""); // State to store batch code value
  const [batchExists, setBatchExists] = useState(false); // Initialize to false
  const [formEnabled, setFormEnabled] = useState(false); // State to track form enablement
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    mode: 'onBlur' // Run validation onBlur
  });


  const handleBatchCodeChange = async (e) => {
    const batchCode = e.target.value;
  
    try {
      if (batchCode.length > 0) {
        const response = await axios.get(`http://localhost:3001/batches/FindBatchCode=${batchCode}`);
        setBatchExists(response.data.exists);
        setBatchCodeValue(batchCode);
  
        if (response.data.exists) {
          const totalStudentsResponse = await axios.get(`http://localhost:3001/students/batchCode=${batchCode}/totalStudents`);
          const totalStudents = totalStudentsResponse.data.totalStudents;
          setTotalStudents(totalStudents);
          setValue("serialNumber", totalStudents + 1);
          setFormEnabled(true); // Enable the form
        } else {
          setFormEnabled(false); // Disable the form if batch code is invalid
        
        }
      } else {
        // If batch code is empty, reset the form and disable it
        reset();
        setFormEnabled(false);
      }
    } catch (error) {
      console.error("Error checking if batch exists:", error);
      setBatchExists(false);
      setFormEnabled(false); // Disable the form
      
      // if (batchCode.length > 0) {
      //   alert("Batch not found");
      // }
    }
  };
  
  
  
  


  


  const onSubmit = async (data) => {
    // Calculate additional fields
    const courseCode = data.batchCode.substring(0, 2);
    const studentRollCode = data.batchCode + data.serialNumber;
    const studentRegistrationCode = data.batchCode + data.serialNumber;

    // Combine data with additional fields
    const postData = {
      ...data,
      courseCode,
      studentRollCode,
      studentRegistrationCode
    };

    // Post data to backend
    try {
      const response = await axios.post('http://localhost:3001/students', postData);
      console.log("Submitted Data:", response.data);
      const batchCode = data.batchCode; // Save batch code before resetting
      reset(); // Reset form fields after successful submission
      setBatchCodeValue(batchCode); // Set batch code value back after reset
      // Fetch total number of students in the batch again to update the serial number field
      fetchTotalStudents(batchCode);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to fetch total number of students in the batch
const fetchTotalStudents = async (batchCode) => {
  try {
    const totalStudentsResponse = await axios.get(`http://localhost:3001/students/batchCode=${batchCode}/totalStudents`);
    const totalStudents = totalStudentsResponse.data.totalStudents;
    setTotalStudents(totalStudents);
    setValue("serialNumber", totalStudents + 1);
  } catch (error) {
    console.error("Error fetching total number of students:", error);
  }
};



 


  


// Add a helper function to conditionally render the disabled attribute
const isFieldDisabled = (fieldName) => {
 
  // Disable the field if the form is disabled or if batch does not exist
  return !formEnabled || (fieldName !== "batchCode" && !batchExists);
};




  return (
    <div className="text-center">
      <div className=" flex flex-col bg-gray-900 rounded-lg p-10 shadow-sm">
        <h2 className="text-white font-bold text-lg">Student Admission Form</h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Batch Code  and sl no.*/}
       





          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
            <label className="text-white" htmlFor="batchCode">
              Batch Code
            </label>
            <input
              {...register("batchCode", { required: true })}
              placeholder="Batch Code"
              className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
              type="text"
              value={batchCodeValue}
              onChange={handleBatchCodeChange}
            />
               {errors.batchCode && (
              <span className="text-red-500">Batch Code is required</span>
            )}
            </div>



            <div className="flex-1">
              <label className="text-white" htmlFor="serialNumber">
              Serial Number
            </label>
            <input
              {...register("serialNumber", { required: true })}
              placeholder="Serial Number"
              className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
              type="number"
              disabled={isFieldDisabled("serialNumber")}
              min={totalStudents + 1}
            />
            {errors.serialNumber && (
              <span className="text-red-500">Serial Number is required</span>
            )}
            </div>
          </div>




          {/* Name */}
          <div className="mt-4">
            <label className="text-white" htmlFor="studentName">
              Name
            </label>
            <input
              {...register("studentName", { required: true })}
              placeholder="Your Name"
              className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
              type="text"
             disabled={isFieldDisabled("studentName")}
            />
            {errors.studentName && (
              <span className="text-red-500">Name is required</span>
            )}
          </div>

          {/* Father and Mother Name */}
          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="studentFatherName">
                Father/Guardian Name
              </label>
              <input
                {...register("studentFatherName", { required: true })}
                placeholder="Father's Name"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
                disabled={isFieldDisabled("studentFatherName")}
              />
              {errors.studentFatherName && (
                <span className="text-red-500">
                  Father Name/Guardian Name is required
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="text-white" htmlFor="studentMotherName">
                Mother's Name
              </label>
              <input
                {...register("studentMotherName", { required: true })}
                placeholder="Mother's Name"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
                disabled={isFieldDisabled("studentMotherName")}
              />
              {errors.studentMotherName && (
                <span className="text-red-500">Mother's Name is required</span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mt-4">
            <label className="text-white" htmlFor="studentAddress">
              Address
            </label>
            <textarea
              {...register("studentAddress", { required: true })}
              placeholder="Your Address"
              className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
              rows="4"
              disabled={isFieldDisabled("studentAddress")}
            />
            {errors.studentAddress && (
              <span className="text-red-500">Address is required</span>
            )}
          </div>

          {/* District, PinCode, State */}
          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="studentDistrict">
                District
              </label>
              <input
                {...register("studentDistrict", { required: true })}
                placeholder="District"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
                disabled={isFieldDisabled("studentDistrict")}
              />
              {errors.studentDistrict && (
                <span className="text-red-500">District is required</span>
              )}
            </div>
            <div className="flex-1">
              <label className="text-white" htmlFor="studentPinCode">
                PinCode
              </label>
              <input
                {...register("studentPinCode", { required: true })}
                placeholder="PinCode"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
                disabled={isFieldDisabled("studentPinCode")}
              />
              {errors.studentPinCode && (
                <span className="text-red-500">PinCode is required</span>
              )}
            </div>
            <div className="flex-1">
              <label className="text-white" htmlFor="studentState">
                State
              </label>
              <input
                {...register("studentState", { required: true })}
                placeholder="State"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
                disabled={isFieldDisabled("studentState")}
              />
              {errors.studentState && (
                <span className="text-red-500">State is required</span>
              )}
            </div>
          </div>

          {/* BirthDate and Admission Date */}
          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="studentBirthDate">
                Date of Birth
              </label>
              <input
                {...register("studentBirthDate", { required: true })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="date"
                disabled={isFieldDisabled("studentBirthDate")}
              />
              {errors.studentBirthDate && (
                <span className="text-red-500">
                  Date of Birth is required
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="text-white" htmlFor="studentAdmissionDate">
                Admission Date
              </label>
              <input
                {...register("studentAdmissionDate", { required: true })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="date"
                disabled={isFieldDisabled("studentAdmissionDate")}
              />
              {errors.studentAdmissionDate && (
                <span className="text-red-500">
                  Admission Date is required
                </span>
              )}
            </div>
          </div>

          {/* Phone Number and Whatsapp Number */}
          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="studentPhoneNumber">
                Phone Number
              </label>
              <input
                {...register("studentPhoneNumber", { required: true })}
                placeholder="Your Phone Number"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="number"
                disabled={isFieldDisabled("studentPhoneNumber")}
              />
              {errors.studentPhoneNumber && (
                <span className="text-red-500">
                  Phone Number is required
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="text-white" htmlFor="studentWhatsappNumber">
                Whatsapp Number
              </label>
              <input
                {...register("studentWhatsappNumber", { required: true })}
                placeholder="Your Whatsapp Number"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="number"
                disabled={isFieldDisabled("studentWhatsappNumber")}
              />
              {errors.studentWhatsappNumber && (
                <span className="text-red-500">
                  Whatsapp Number is required
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mt-4">
            <label className="text-white" htmlFor="studentEmail">
              Email
            </label>
            <input
              {...register("studentEmail", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
              placeholder="Your Email"
              className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
              type="text"
              disabled={isFieldDisabled("studentEmail")}
            />
            {errors.studentEmail && errors.studentEmail.type === "required" && (
              <span className="text-red-500">Email is required</span>
            )}
            {errors.studentEmail && errors.studentEmail.type === "pattern" && (
              <span className="text-red-500">Invalid Email</span>
            )}
          </div>

          {/* Gender, Religion, Caste */}
          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="studentGender">
                Gender
              </label>
              <select
                {...register("studentGender", { required: true })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                id="studentGender"
                disabled={isFieldDisabled("studentGender")}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.studentGender && (
                <span className="text-red-500">Gender is required</span>
              )}
            </div>

            <div className="flex-1">
              <label className="text-white" htmlFor="studentReligion">
                Religion
              </label>
              <select
                {...register("studentReligion", { required: true })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                id="studentReligion"
                disabled={isFieldDisabled("studentReligion")}
              >
                <option value="">Select Religion</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Sikhism">Sikhism</option>
                <option value="Christianity">Christianity</option>
                <option value="Buddhism">Buddhism</option>
                <option value="others">Others</option>
              </select>
              {errors.studentReligion && (
                <span className="text-red-500">Religion is required</span>
              )}
            </div>

            <div className="flex-1">
              <label className="text-white" htmlFor="studentCaste">
                Caste
              </label>
              <select
                {...register("studentCaste", { required: true })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                id="studentCaste"
                disabled={isFieldDisabled("studentCaste")}
              >
                <option value="">Select Caste</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
                <option value="GENERAL">GENERAL</option>
              </select>
              {errors.studentCaste && (
                <span className="text-red-500">Caste is required</span>
              )}
            </div>
          </div>

          {/* Marital Status, Handicapped, Ex-Serviceman Status */}
          <div className="mt-4 flex flex-col  md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="studentMaritalStatus">
                Marital Status
              </label>
              <select
                {...register("studentMaritalStatus", { required: true })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                id="studentMaritalStatus"
                disabled={isFieldDisabled("studentMaritalStatus")}
              >
                <option value="">Select Marital Status</option>
                <option value="married">Married</option>
                <option value="unmarried">Unmarried</option>
              </select>
              {errors.studentMaritalStatus && (
                <span className="text-red-500">
                  Marital Status is required
                </span>
              )}
            </div>
            <div className=" md:mt-0 flex items-center">
              <span className="text-white mt-5 mr-2">Handicapped:</span>
              <input
                {...register("studentHandicappedStatus",{ value: false })}
                type="checkbox"
                className="form-checkbox h-6 w-6 mt-5 text-purple-600 bg-gray-800 border-gray-300 rounded"
                id="studentHandicappedStatus"
                disabled={isFieldDisabled("studentHandicappedStatus")}
              />
            </div>




            
            <div className=" md:mt-0 flex items-center">
              <span className="text-white mt-5 mr-2">Ex-Serviceman:</span>
              <input
                {...register("studentExServicemanStatus",{ value: false })}
                type="checkbox"
                className="form-checkbox h-6 w-6 mt-5 text-purple-600 bg-gray-800 border-gray-300 rounded"
                id="studentExServicemanStatus"
                disabled={isFieldDisabled("studentExServicemanStatus")}
              />
            </div>
          </div>

          {/* Gov Id Type and Gov Id */}
          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="studentGovIdType">
                Gov Id Type
              </label>
              <select
                {...register("studentGovIdType",{ required: true })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                id="studentGovIdType"
                disabled={isFieldDisabled("studentGovIdType")}
              >
                <option value="">Select Gov Id Type</option>
                <option value="Aadhar">Aadhar</option>
                <option value="Driving">Driving</option>
                <option value="Voter">Voter</option>
                <option value="Pan">Pan</option>
              </select>
              {errors.studentGovIdType && (
                <span className="text-red-500">
                  Gov Id Type is required
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="text-white" htmlFor="studentGovId">
                Gov Id
              </label>
              <input
                {...register("studentGovId", { required: true })}
                placeholder="Gov Id"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
                disabled={isFieldDisabled("studentGovId")}
              />
              {errors.studentGovId && (
                <span className="text-red-500">Gov Id is required</span>
              )}
            </div>
          </div>

          {/* Form Number and Student Qualification */}
          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="studentFormNumber">
                Form Number
              </label>
              <input
                {...register("studentFormNumber", { required: true })}
                placeholder="Form Number"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
                disabled={isFieldDisabled("studentFormNumber")}
              />
              {errors.studentFormNumber && (
                <span className="text-red-500">
                  Form Number is required
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="text-white" htmlFor="studentQualification">
                Student Qualification
              </label>
              <input
                {...register("studentQualification", { required: true })}
                placeholder="Student Qualification"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
                disabled={isFieldDisabled("studentQualification")}
              />
              {errors.studentQualification && (
                <span className="text-red-500">
                  Student Qualification is required
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <button
              className="bg-white text-black rounded-md px-4 py-1 hover:bg-black hover:text-white transition-all duration-200"
              type="submit"
             
            >
              Submit
            </button>
          </div>
        </form>
       
      </div>
    </div>
  );
};

export default StudentAdmission;
