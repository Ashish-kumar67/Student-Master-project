import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import axios from 'axios'
const AddCoursePage = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
    getValues,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "modules",
  });

  const [moduleData, setModuleData] = useState([]);
  const [isShortTerm, setIsShortTerm] = useState(false);
  const [moduleCount, setModuleCount] = useState(0);


  const oModules = [
    { moduleName: "Mod1", moduleCode: "Mod1", moduleUniqueCode: "" },
    { moduleName: "Mod2", moduleCode: "Mod2", moduleUniqueCode: "" },
    { moduleName: "Mod3", moduleCode: "Mod3", moduleUniqueCode: "" },
    { moduleName: "Mod4", moduleCode: "Mod4", moduleUniqueCode: "" },
    { moduleName: "Pro1", moduleCode: "Pro1", moduleUniqueCode: "" },
  ];

  const aModules = [
    { moduleName: "Mod1", moduleCode: "Mod1", moduleUniqueCode: "" },
    { moduleName: "Mod2", moduleCode: "Mod2", moduleUniqueCode: "" },
    { moduleName: "Mod3", moduleCode: "Mod3", moduleUniqueCode: "" },
    { moduleName: "Mod4", moduleCode: "Mod4", moduleUniqueCode: "" },
    { moduleName: "Mod5", moduleCode: "Mod5", moduleUniqueCode: "" },
    { moduleName: "Mod6", moduleCode: "Mod6", moduleUniqueCode: "" },
    { moduleName: "Mod7", moduleCode: "Mod7", moduleUniqueCode: "" },
    { moduleName: "Mod8", moduleCode: "Mod8", moduleUniqueCode: "" },
    { moduleName: "Mod9", moduleCode: "Mod9", moduleUniqueCode: "" },
    { moduleName: "Mod10", moduleCode: "Mod10", moduleUniqueCode: "" },
    // Add more modules for course A if needed
  ];






  const onSubmit = async(data) => {
    console.log(data);
    console.log(data.courseType)
    // You can perform form submission logic here
   let extraData
  
    if (isShortTerm) {
      const shortTermModules = []; // Initialize empty array for short-term modules
      // Iterate through form data to collect short-term modules
      for (let i = 0; i < moduleCount; i++) {
        const module = data.modules[i];
        // Generate moduleUniqueCode based on moduleCode and courseCode and also inserting course code
        const moduleUniqueCode = `${module.moduleCode}${data.courseCode}`;
        const courseCode = `${data.courseCode}`;
        // Add module to short-term modules array with moduleUniqueCode
        shortTermModules.push({ ...module, moduleUniqueCode , courseCode});
      }
      // Set moduleData state with short-term modules
      setModuleData(shortTermModules);
       extraData = {
        modules: shortTermModules,
      };
      console.log("Extra Data:", extraData);
    }
     else if (data.courseType==="O" || data.courseType==="A") {
      const courseCode = data.courseCode;
      const defaultModules = data.courseType === "O" ? oModules : aModules;
      defaultModules.forEach((module) => {
        module.moduleUniqueCode = module.moduleCode + courseCode; // adding unique code 
        module.courseCode = courseCode; // adding coursecode 
      });
     
      setModuleData(defaultModules);
      
       extraData = {
        modules: defaultModules,
      };
      console.log("Extra Data:", extraData);
    }
     



    try {
      // Extracting data for course insertion
      const courseData = {
        courseType: data.courseType,
        courseName: data.courseName,
        courseCode: data.courseCode,
        courseStartDate: data.courseStartDate,
        courseEndDate: data.courseEndDate,
        courseFee: data.courseFee
      };

      // Sending course data to course route
      const courseResponse = await axios.post('http://localhost:3001/courses', courseData);
      console.log('Course inserted:', courseResponse.data);

     
      const moduleResponse = await axios.post('http://localhost:3001/modules/createCourseModules', extraData);
      console.log('Modules inserted:', moduleResponse.data);

      // Resetting form after successful submission
      setModuleCount(0);
      setIsShortTerm(false);
      setValue("courseName", "");
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }



    
  };
  

  const handleCourseTypeChange = (e) => {
    const value = e.target.value;
  if (value === "O" || value === "A") {
    setValue("courseName", value); // Set courseName field value
    setIsShortTerm(false);
    setModuleCount(0);
    remove(); // Remove existing modules
  } else if (value === "shortTerm") {
    setValue("courseName", ""); // Clear courseName field value
    setIsShortTerm(true);
    setModuleData([]); // Clear moduleData when switching to short term
  }
  };

  const handleModuleCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    if (count > 20) {
      setModuleCount(20);
      console.log("Module count cannot exceed 20"); // Module count limit error
    } else if (count < 1) {
      setModuleCount(0);
      remove(); // Remove existing modules
      console.log("Module count should be at least 1"); // Module count minimum error
    } else {
      setModuleCount(count);
      // Calculate the difference between the current count and the previous count
      const diff = count - fields.length;
      if (diff > 0) {
        // Append new modules if the count increased
        append(Array(diff).fill({ moduleName: "", moduleCode: "" }));
      } else if (diff < 0) {
        // Remove modules if the count decreased
        for (let i = 0; i < Math.abs(diff); i++) {
          remove(fields.length - 1 - i);
        }
      }
    }
  };

  const saveModules = () => {
    const formData = getValues();
    const shortTermModules = formData.modules.map((module, index) => ({
      ...module,
      moduleUniqueCode: `${module.moduleCode}${formData.courseCode}${index + 1}`,
    }));
    setModuleData(shortTermModules);
  
    // You can perform further processing or saving of the module data here
  };
  

  return (
    <div className="flex items-center text-center justify-center bg-gray-800 min-h-screen">
      <div className="flex flex-col bg-gray-900 rounded-lg p-8 m shadow-sm">
        <h2 className="text-white font-bold text-lg">Add Course</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            {/* courseType and course name */}

            <div className="flex-1">
              <label className="text-white" htmlFor="courseType">
                Course Type
              </label>
              <select
                {...register("courseType", {
                  required: true,
                  onBlur: () => trigger("courseType"),
                })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                id="courseType"
                onChange={handleCourseTypeChange}
              >
                <option value="">Select Course Type</option>
                <option value="A">A</option>
                <option value="O">O</option>
                <option value="shortTerm">Short Term</option>
              </select>
              {errors.courseType && (
                <span className="text-red-500">Course Type is required</span>
              )}
            </div>

            <div className="flex-1">
              <label className="text-white" htmlFor="courseName">
                Course Name
              </label>
              <input
                {...register("courseName", {
                  required: true,
                  onBlur: () => trigger("courseName"),
                })}
                placeholder="Course Name"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
              />

              {errors.courseName && (
                <span className="text-red-500">Course Name is required</span>
              )}
            </div>
          </div>

          {/* CourseStartDate and CourseEndDate */}
          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="courseStartDate">
                Course Start Date
              </label>
              <input
                {...register("courseStartDate", {
                  required: true,
                  onBlur: () => trigger("courseStartDate"),
                })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="date"
              />
              {errors.courseStartDate && (
                <span className="text-red-500">
                  Course Start Date is required
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="text-white" htmlFor="courseEndDate">
                Course End Date
              </label>
              <input
                {...register("courseEndDate", {
                  required: true,
                  onBlur: () => trigger("courseEndDate"),
                })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="date"
              />
              {errors.courseEndDate && (
                <span className="text-red-500">
                  Course End Date is required
                </span>
              )}
            </div>
          </div>

          {/* Course Code and Course Fee */}
          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="courseCode">
                Course Code
              </label>
              <input
                {...register("courseCode", {
                  required: true,
                  onBlur: () => trigger("courseCode"),
                })}
                placeholder="Course Code"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
              />
              {errors.courseCode && (
                <span className="text-red-500">Course Code is required</span>
              )}
            </div>

            <div className="flex-1">
              <label className="text-white" htmlFor="courseFee">
                Course Fee
              </label>
              <input
                {...register("courseFee", {
                  required: {
                    value: true,
                    message: "please enter the course fee in numbers!",
                  },
                  valueAsNumber: {
                    value: true,
                    message: "please enter numbers only!",
                  },
                  onBlur: () => trigger("courseFee"),
                })}
                placeholder="Course Fee"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="number"
                step="0.01"
              />
              {errors.courseFee && (
                <span className="text-red-500">{errors.courseFee.message}</span>
              )}
            </div>
          </div>

          {/* Module Count for Short Term Course */}
          {isShortTerm && (
            <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label className="text-white" htmlFor="moduleCount">
                  Number of Modules
                </label>
                <input
                  {...register("moduleCount", {
                    required: {
                      value: true,
                      message: "enter the modulecount please!",
                    },
                    valueAsNumber: {
                      value: true,
                      message: "please enter numbers only!",
                    },
                    max: {
                      value: 20,
                      message: "Number of Modules cannot exceed 20",
                    },
                    min: {
                      value: 1,
                      message: "Number of Modules should be at least 1",
                    },
                    onBlur: () => trigger("moduleCount"),
                  })}
                  placeholder="Number of Modules"
                  className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                  type="number"
                  onChange={handleModuleCountChange}
                />
                {errors.moduleCount && (
                  <span className="text-red-500">
                    {errors.moduleCount.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Modules for Short Term Course */}
          {isShortTerm && moduleCount > 0 && (
            <>
              <div className="mt-4">
                <h3 className="text-white font-semibold">Modules</h3>
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="mt-4 flex flex-col md:flex-row md:space-x-4"
                  >
                    <div className="flex-1">
                      <label
                        className="text-white"
                        htmlFor={`modules[${index}].moduleName`}
                      >
                        Module Name
                      </label>
                      <input
                        {...register(`modules[${index}].moduleName`, {
                          required: {
                            value: true,
                            message: "Module Name is required",
                          },
                          onBlur: () =>
                            trigger(`modules[${index}].moduleName`),
                        })}
                        placeholder="Module Name"
                        className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                        type="text"
                      />
                      {errors.modules?.[index]?.moduleName && (
                        <span className="text-red-500">
                          {errors.modules?.[index]?.moduleName.message}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <label
                        className="text-white"
                        htmlFor={`modules[${index}].moduleCode`}
                      >
                        Module Code
                      </label>
                      <input
                        {...register(`modules[${index}].moduleCode`, {
                          required: {
                            value: true,
                            message: "Module Code is required",
                          },
                          onBlur: () => trigger(`modules[${index}].moduleCode`),
                        })}
                        placeholder="Module Code"
                        className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                        type="text"
                      />
                      {errors.modules?.[index]?.moduleCode && (
                        <span className="text-red-500">
                          {errors.modules?.[index]?.moduleCode.message}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-white text-black rounded-md px-4 py-1 hover:bg-blue-500 hover:text-white transition-all duration-200"
                  type="button"
                  onClick={saveModules}
                >
                  Save Modules
                </button>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <button
              className="bg-white text-black rounded-md px-4 py-1 hover:bg-blue-500 hover:text-white transition-all duration-200"
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

export default AddCoursePage;
