import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BigCard from '../../../components/card/big_card';
import DateSelector from '../../../components/date_selector/DateSelector';
import UploadSchedule from '../../../components/upload_schedule/UploadSchedule';
import DashboardTable from '../../../components/table/dashboard_table';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalAppointments: 0,
    cancelAppointments: 0,
    completedAppointments: 0,
    timeList: []
  });

  useEffect(() => {
    const fetchData = async () => {

      try {

        const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/particular_doctor_dashboard_details',{doctor_id: "DOC-352152"} );
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
      <div className='px-10 py-6 bg-white'>
        {/* Cards, Calender and Upload Schedule */}
        <div className='flex space-x-10 mb-5 w-full'>

          <div className='flex flex-col space-y-6'>
            {/* Big Cards */}
            <div className='flex space-x-6'>
              <BigCard title={'Total Appointments'} subTitle={'Number Of Appointments'} counts={dashboardData.totalAppointments} />
              <BigCard title={'Cancel Appointments'} subTitle={'Number Of Patients'} counts={dashboardData.cancelAppointments} />
              <BigCard title={'Completed Appointments'} subTitle={'Number Of Appointments Cancelled'} counts={dashboardData.completedAppointments} />
            </div>

            {/* Calender */}
            <DateSelector />

          </div>

          {/* Upload Schedule */}
          <div className="w-96 space-y-3 bg-white rounded-2xl">
            <UploadSchedule timeList={dashboardData.timeList}/>
          </div>
        </div>

        {/* Table */}
        <DashboardTable /> 

      </div>
    </>
  );
};

export default Dashboard;
