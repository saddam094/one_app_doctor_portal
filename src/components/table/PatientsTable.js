import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

const PatientsTable = ({ selectedDate }) => {

  const [PatientTableData, setPatientTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState('');

  const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const fetchData = useCallback(async () => {

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
  }, [selectedDate]);

  useEffect(() => {

    if (selectedDate) {
      setLoading(true);
      fetchData();
    }
  }, [fetchData, selectedDate]);

  const openModal = (appointment_id, status) => {

    if (status.toLowerCase() === 'appointed') {
      setAppointmentId(appointment_id);

      setShowModal(true);

    }

    if (status.toLowerCase() === 'pending') {
      if (window.confirm("UPDATE STATUS : COMPLETED")) {
        updateStatus(appointment_id, 'completed');
      }
    }

  };



  const updateStatus = async (appointment_id, status) => {
    try {

      const data = {
        appointment_id: appointment_id,
        status: status.toLowerCase()
      };
      console.log('Data', data);

      const response = await axios.post("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/updateAppointmentStatus_byDoctor", data);

      console.log('Dashboard Table Status Response', response);

      if (response.data && response.data['body-json'].statusCode === 200) {
        notify(response.data['body-json'].body.message);
      } else if (response.data['body-json']?.statusCode === 400) {
        notifyError(response.data['body-json'].body.message);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setShowModal(false);
      fetchData();
    }
  };


  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-indigo-50">
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
              <td className={`px-4 py-2 border text-center ${item.status.toLowerCase() === 'appointed' ? 'cursor-pointer bg-blue-500 hover:bg-blue-600 text-white' : item.status.toLowerCase() === 'pending' ? 'bg-yellow-300 hover:bg-yellow-400 text-black cursor-pointer' : item.status.toLowerCase() === 'completed' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                key={item.appointment_id}
                onClick={() => openModal(item.appointment_id, item.status)}
              >
                {item.status || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">UPDATE STATUS</h2>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => updateStatus(appointmentId, 'pending')}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Pending
              </button>

              <button
                onClick={() => updateStatus(appointmentId, 'completed')}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Completed
              </button>

              <button
                onClick={() => setShowModal(false)}
                className={`px-4 py-2 text-white rounded bg-red-600 hover:bg-red-700`}
              >
                close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientsTable;
