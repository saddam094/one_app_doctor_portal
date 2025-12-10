import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BigCard from '../../../components/card/big_card';
import DashboardTable from '../../../components/table/dashboard_table';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalAppointments: 0,
    cancelAppointments: 0,
    completedAppointments: 0,
    timeList: []
  });

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(formattedDate);

  function formateDatePattern(dateStr) {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }

  const handleChange = (e) => {
    setSelectedDate(formateDatePattern(e.target.value));
    console.log(selectedDate);
  };

  useEffect(() => {
    const fetchData = async () => {

      try {

        const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/particular_doctor_dashboard_details', { doctor_id: "DOC-352152" });
        const data = response.data['body-json']['body'];


        setDashboardData({
          totalAppointments: data['totalAppointments'] || 0,
          cancelAppointments: data['cancelAppointments'] || 0,
          completedAppointments: data['completedAppointments'] || 0,
          timeList: data['timeList'] || [],
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className='px-4 sm:px-6 md:px-10 py-6 bg-white pt-24 md:pt-6'>

        <div className='flex-row md:flex  space-y-4 md:space-y-0 md:space-x-6 mb-5'>
          <BigCard title={'Total Appointments'} subTitle={'Number Of Appointments'} counts={dashboardData.totalAppointments} />
          <BigCard title={'Cancel Appointments'} subTitle={'Number Of Patients'} counts={dashboardData.cancelAppointments} />
          <BigCard title={'Completed Appointments'} subTitle={'Number Of Appointments Cancelled'} counts={dashboardData.completedAppointments} />

          {/* Upload Schedule */}
          <div className="flex flex-col justify-between h-32 bg-indigo-50 rounded-xl p-4">
            <h2 className="text-md font-serif text-slate-700">Upload Schedule</h2>

            <button className="bg-black hover:bg-blue-600 text-white px-10 py-2 mx-3 rounded-lg shadow">
              UPLOAD
            </button>

          </div>

          {/* Date Selecter */}
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

        {/* Table */}
        <DashboardTable selectedDate={selectedDate} />

      </div>
    </>
  );
};

export default Dashboard;