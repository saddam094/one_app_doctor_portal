import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BigCard from '../../../components/card/big_card';
import DateSelector from '../../../components/date_selector/DateSelector';
import UploadSchedule from '../../../components/upload_schedule/UploadSchedule';
import DashboardTable from '../../../components/table/dashboard_table';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRegistrations: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalDoctors: 0,
    totalLeisure: 0,
    totalServiceMan: 0,
    totalCabDrivers: 0,
    totalEcomStores: 0,
    totalRealEstateAgents: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/one_app_admin_dashboard_table_items_count');
        const data = response.data['body-json']['body']; // Assuming API returns an object with relevant fields
        // console.log(data);


        setDashboardData({
          totalRegistrations: data['totalRegistration'] || 0,
          totalRevenue: data['totalRevenue'] || '00.00',
          totalUsers: data['totalUser'] || 0,
          totalDoctors: data['totalDoctor'] || 0,
          totalLeisure: data['totalLeisure'] || 0,
          totalServiceMan: data['totalServiceMan'] || 0,
          totalCabDrivers: data['totalCabDriver'] || 0,
          totalEcomStores: data['totalEcomStore'] || 0,
          totalRealEstateAgents: data['totalRealStateAgent'] || 0
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
              <BigCard title={'Appointments'} subTitle={'Number Of Appointments'} counts={dashboardData.totalRegistrations} />
              <BigCard title={'Patients'} subTitle={'Number Of Patients'} counts={dashboardData.totalRevenue} />
              <BigCard title={'Cancelled'} subTitle={'Number Of Cancelled'} counts={dashboardData.totalUsers} />
            </div>

            {/* Calender */}
            <DateSelector />

          </div>

          {/* Upload Schedule */}
          <div className="w-96 space-y-3 bg-white rounded-2xl">
            <UploadSchedule />
          </div>
        </div>

        {/* Table */}
        <DashboardTable /> 

      </div>
    </>
  );
};

export default Dashboard;
