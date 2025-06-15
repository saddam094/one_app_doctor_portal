import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

const PatientsTable = ({ selectedDate }) => {

  const [PatientTableData, setPatientTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);




  // useEffect(() => {
  //   if(PatientTableData.length === 0){
  //     fetchData();
  //   }
  // });

  useEffect(() => {
    // Fetch API data using Axios  
    const fetchData = async () => {

      try {

        const doctor_id = localStorage.getItem('doctorId');

        const response = await axios.post("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/till_today_patients_lists", { doctor_id: doctor_id, date: selectedDate === 'All' ? '' : selectedDate });

        if (response.data && response.data['body-json'].statusCode === 200) {
          setPatientTableData(response.data['body-json'].body);
        } else if (response.data['body-json']['statusCode'] === 400) {
          notifyError(response.data['body-json'].body.message);
        } else {
          console.error("Unexpected response format:", response.data['body-json']);
          throw new Error("Failed to fetch data");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      setLoading(true);     // Reset loading state before fetching
      fetchData();
    }
  }, [selectedDate]);



  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-4 py-2 border text-center">Appointment ID</th>
            <th className="px-4 py-2 border text-center">P Name</th>
            <th className="px-4 py-2 border text-center">P Phone</th>
            <th className="px-4 py-2 border text-center">P Email</th>
            <th className="px-4 py-2 border text-center">Doctor</th>
            <th className="px-4 py-2 border text-center">Treatment</th>
            <th className="px-4 py-2 border text-center">Address</th>
            <th className="px-4 py-2 border text-center">Date</th>
            <th className="px-4 py-2 border text-center">Time</th>
            <th className="px-4 py-2 border text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {PatientTableData.map((item) => (
            <tr key={item.appointment_id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-slate-700">{item.appointment_id}</td>
              <td className="px-4 py-2 border text-slate-700">{item.patientName || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700">{item.PhoneNumber || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700">{item.email || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700">{item.doctorCategory || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700">{item.patientProblem || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700">{item.address || "N/A"}</td>
              <td className="px-4 py-2 border">{item.date || "N/A"}</td>
              <td className="px-4 py-2 border">{item.time || "N/A"}</td>
              <td className={`px-4 py-2 border text-white ${item.cancelled ? 'bg-red-500' : 'bg-green-500'}`}>{item.cancelled ? "Cancelled" : "Appointed" || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsTable;
