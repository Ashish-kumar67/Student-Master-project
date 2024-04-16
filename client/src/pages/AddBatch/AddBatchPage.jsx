import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";

const AddBatchPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm();

  const [coursesData, setCoursesData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [batchesData, setBatchesData] = useState([]);
  const [newBatch, setNewBatch] = useState({
    batchCode: "",
    batchName: "",
    batchProposedStartDate: "",
    batchProposedEndDate: "",
    batchActualStartDate: "",
    batchActualEndDate: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const date = new Date();
        const year = date.getFullYear();
        const response = await axios.get(
          `http://localhost:3001/courses/${year}/coursesBycurrentYear`
        );
        setCoursesData(response.data);
        
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseSelect = async (e) => {
    const selectedCourseCode = e.target.value;
    setSelectedCourse(selectedCourseCode);
    try {
      const response = await axios.get(`http://localhost:3001/batches/course=${selectedCourseCode}`);
      console.log(response.data.length);
      // making batchCode value with help of number of batches present in course.
      const batchCodeValue = `${selectedCourseCode}${response.data.length + 1}`;
        setBatchesData(response.data); // putting batch details in table.


        //putting batchCode according to batches in coureses
       setValue("batchCode", batchCodeValue);
       setNewBatch({
        ...newBatch,
       batchCode:batchCodeValue
      });
     
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddBatch = async () => {
     

    const existingBatch = batchesData.find(
      (batch) => batch.batchCode === newBatch.batchCode
    );
    if (existingBatch) {
      alert(`Batch code '${newBatch.batchCode}' already exists!`);
      return;
    }
  


    try {
      const response = await axios.post("http://localhost:3001/batches", {
        courseCode: selectedCourse,
        ...newBatch,
      });
      setBatchesData([...batchesData, response.data]); // Update batchesData with newly added batch
      console.log("New batch added:", response.data);
      // Clear all input fields after adding the batch
      setNewBatch({
        batchCode: "",
        batchName: "",
        batchProposedStartDate: "",
        batchProposedEndDate: "",
        batchActualStartDate: "",
        batchActualEndDate: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleProposedStartDateChange = (e) => {
    const startDate = e.target.value;
    setValue("batchProposedStartDate", startDate);
    setValue("batchActualStartDate", startDate);
    setNewBatch({
      ...newBatch,
      batchProposedStartDate: startDate,
      batchActualStartDate: startDate,
    });
  };
  
  const handleProposedEndDateChange = (e) => {
    const endDate = e.target.value;
    setValue("batchProposedEndDate", endDate);
    setValue("batchActualEndDate", endDate);
    setNewBatch({
      ...newBatch,
      batchProposedEndDate: endDate,
      batchActualEndDate: endDate,
    });
  };


  return (
    <div className="flex items-center text-center justify-center bg-gray-800 min-h-screen">
      <div className="flex flex-col bg-gray-900 rounded-lg p-8 m shadow-sm">
        <h2 className="text-white font-bold text-lg">Add Batch</h2>

        <div className="mt-4">
          <label className="text-white" htmlFor="courseSelect">
            Select Course
          </label>
          <select
            {...register("courseSelect", {
              required: true,
              onBlur: () => trigger("courseSelect"),
            })}
            className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
            id="courseSelect"
            onChange={handleCourseSelect}
          >
            <option value="">Select Course</option>
            {coursesData.map((course) => (
              <option key={course.courseCode} value={course.courseCode}>
                {`${course.courseCode} - ${course.courseName}`}
              </option>
            ))}
          </select>
          {errors.courseSelect && (
            <span className="text-red-500">Course selection is required</span>
          )}
        </div>

        {selectedCourse && (
          <div className="mt-4">
            <h3 className="text-white font-semibold">
              Batches for {selectedCourse}
            </h3>
            <table className="w-full mt-2 border-collapse border border-gray-600">
              <thead>
                <tr>
                  <th className="border border-gray-600 px-4 py-2 text-white">
                    Batch Code
                  </th>
                  <th className="border border-gray-600 px-4 py-2 text-white">
                    Batch Name
                  </th>
                  <th className="border border-gray-600 px-4 py-2 text-white">
                    Proposed Start Date
                  </th>
                  <th className="border border-gray-600 px-4 py-2 text-white">
                    Proposed End Date
                  </th>
                  <th className="border border-gray-600 px-4 py-2 text-white">
                    Actual Start Date
                  </th>
                  <th className="border border-gray-600 px-4 py-2 text-white">
                    Actual End Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {batchesData.map((batch) => (
                  <tr key={batch.batchCode}>
                    <td className="border border-gray-600 px-4 py-2 text-white">
                      {batch.batchCode}
                    </td>
                    <td className="border border-gray-600 px-4 py-2 text-white">
                      {batch.batchName}
                    </td>
                    <td className="border border-gray-600 px-4 py-2 text-white">
                      {batch.batchProposedStartDate}
                    </td>
                    <td className="border border-gray-600 px-4 py-2 text-white">
                      {batch.batchProposedEndDate}
                    </td>
                    <td className="border border-gray-600 px-4 py-2 text-white">
                      {batch.batchActualStartDate}
                    </td>
                    <td className="border border-gray-600 px-4 py-2 text-white">
                      {batch.batchActualEndDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-white font-semibold">Add New Batch</h3>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="batchCode">
                Batch Code
              </label>
              <input
                {...register("batchCode", {
                  required: true,
                  onBlur: () => trigger("batchCode"),
                })}
                placeholder="Batch Code"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
                value={newBatch.batchCode}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, batchCode: e.target.value })
                }
              />
              {errors.batchCode && (
                <span className="text-red-500">Batch Code is required</span>
              )}
            </div>

            <div className="flex-1">
              <label className="text-white" htmlFor="batchName">
                Batch Name
              </label>
              <input
                {...register("batchName", {
                  required: true,
                  onBlur: () => trigger("batchName"),
                })}
                placeholder="Batch Name"
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
                value={newBatch.batchName}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, batchName: e.target.value })
                }
              />
              {errors.batchName && (
                <span className="text-red-500">Batch Name is required</span>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="batchProposedStartDate">
                Batch Proposed Start Date
              </label>
              <input
                {...register("batchProposedStartDate", {
                  required: true,
                  onBlur: () => trigger("batchProposedStartDate"),
                })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="date"
                value={newBatch.batchProposedStartDate}
                onChange={(e) => {
                  setNewBatch({ ...newBatch, batchProposedStartDate: e.target.value });
                  handleProposedStartDateChange(e);
                }}
              />
              {errors.batchProposedStartDate && (
                <span className="text-red-500">Batch Proposed Start Date is required</span>
              )}
            </div>

            <div className="flex-1">
              <label className="text-white" htmlFor="batchProposedEndDate">
                Batch Proposed End Date
              </label>
              <input
                {...register("batchProposedEndDate", {
                  required: true,
                  onBlur: () => trigger("batchProposedEndDate"),
                })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="date"
                value={newBatch.batchProposedEndDate}
                onChange={(e) => {
                  setNewBatch({ ...newBatch, batchProposedEndDate: e.target.value });
                  handleProposedEndDateChange(e);
                }}
              />
              {errors.batchProposedEndDate && (
                <span className="text-red-500">Batch Proposed End Date is required</span>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-white" htmlFor="batchActualStartDate">
              batch Actual Start Date
              </label>
              <input
                {...register("batchActualStartDate", {
                  required: true,
                  onBlur: () => trigger("batchActualStartDate"),
                })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="date"
                value={newBatch.batchActualStartDate}
                onChange={(e) => {
                  setNewBatch({ ...newBatch, batchActualStartDate: e.target.value });
                 
                }}
              />
              {errors.batchActualStartDate && (
                <span className="text-red-500">batch Actual Start Date is required</span>
              )}
            </div>

            <div className="flex-1">
              <label className="text-white" htmlFor="batchActualEndDate">
                Batch Actual End Date
              </label>
              <input
                {...register("batchActualEndDate", {
                  required: true,
                  onBlur: () => trigger("batchActualEndDate"),
                })}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="date"
                value={newBatch.batchActualEndDate}
                onChange={(e) => {
                  setNewBatch({ ...newBatch, batchActualEndDate: e.target.value });
                  
                }}
              />
              {errors.batchActualEndDate && (
                <span className="text-red-500">Batch Actual End Date is required</span>
              )}
            </div>
          </div>



          <button
            className="bg-white text-black rounded-md px-4 py-1 hover:bg-blue-500 hover:text-white transition-all duration-200 mt-2"
            onClick={handleAddBatch}
          >
            Add New Batch
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBatchPage;
