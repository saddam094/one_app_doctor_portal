import { useState, useEffect } from 'react'
import axios from 'axios';
import BigCard from '../../../components/card/big_card';
import PatientsTable from '../../../components/table/PatientsTable'

const Patients = () => {

  const [selectedDate, setSelectedDate] = useState('All');

  const [PatientData, setPatientData] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    cancelAppointments: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

        const doctor_id = localStorage.getItem('doctorId');

        const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/till_today_patients_counts', { doctor_id: doctor_id });
        const data = response.data['body-json']['body'];


        setPatientData({
          totalAppointments: data['totalAppointments'] || 0,
          completedAppointments: data['completedAppointments'] || 0,
          pendingAppointments: data['pendingAppointments'] || 0,
          cancelAppointments: data['cancelAppointments'] || 0,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);


  const handleChange = (e) => {
    setSelectedDate(e.target.value);
    console.log(selectedDate);
  };

  return (
    <>
      <div className='px-4 sm:px-6 md:px-10 py-6 bg-white pt-24 md:pt-6'>
        {/* Cards */}
        <div className='flex-row md:flex  space-y-4 md:space-y-0 md:space-x-6 mb-5'>
          <BigCard title={'Total Appointment'} subTitle={'Number Of All Appointment'} counts={PatientData.totalAppointments} />
          <BigCard title={'Confirmed Patients'} subTitle={'Number Of Completed Appointment'} counts={PatientData.completedAppointments} />
          <BigCard title={'Pending Patients'} subTitle={'Number Of Pending Appointment'} counts={PatientData.pendingAppointments} />
          <BigCard title={'Cancelled Patients'} subTitle={'Number Of Cancelled Appointment'} counts={PatientData.cancelAppointments} />

          <div className="flex flex-col justify-between h-32 bg-indigo-50 rounded-xl p-4">
            <h2 className="text-md font-serif text-slate-700">Select a Date</h2>

            <input
              type="date"
              value={selectedDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Patient Table */}
        <PatientsTable selectedDate={selectedDate} />
      </div>
    </>
  )
}

export default Patients