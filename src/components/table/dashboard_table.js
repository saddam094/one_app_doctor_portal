import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

const DashboardTable = ({ selectedDate }) => {
  const [dashboardTableData, setDashboardTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctor_id = localStorage.getItem('doctorId');
        console.log(`doctorId : ${doctor_id} and date : ${selectedDate}`);

        const response = await axios.post(
          "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/today_patients_list",
          { doctor_id: doctor_id, date: selectedDate }
        );

        console.log('Dashboard Table Data', response);

        if (response.data && response.data['body-json'].statusCode === 200) {
          setDashboardTableData(response.data['body-json'].body);
        } else if (response.data['body-json']?.statusCode === 400) {
          notifyError(response.data['body-json'].body.message);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    setDashboardTableData([]);
    fetchData();
  }, [selectedDate]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-[1000px] text-left border-collapse text-sm md:text-base">
        <thead className="bg-indigo-50 text-slate-600">
          <tr>
            <th className="px-4 py-2 border text-center whitespace-nowrap">Appointment ID</th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">P Name</th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">P Phone</th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">P Email</th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">Doctor</th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">Treatment</th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">Address</th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">Date</th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">Time</th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {dashboardTableData.map((item) => (
            <tr key={item.appointment_id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-slate-700 text-center">{item.appointment_id}</td>
              <td className="px-4 py-2 border text-slate-700 text-center">{item.patientName || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700 text-center">{item.PhoneNumber || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700 text-center">{item.email || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700 text-center">{item.doctorCategory || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700 text-center">{item.patientProblem || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700 text-center">{item.address || "N/A"}</td>
              <td className="px-4 py-2 border text-center">{item.date || "N/A"}</td>
              <td className="px-4 py-2 border text-center">{item.time || "N/A"}</td>
              <td className={`px-4 py-2 border text-white text-center ${item.cancelled ? 'bg-red-500' : 'bg-green-500'}`}>
                {item.cancelled ? "Cancelled" : "Appointed"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;

