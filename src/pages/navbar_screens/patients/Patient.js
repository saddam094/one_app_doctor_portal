import { useState, useEffect } from 'react'
import axios from 'axios';
import BigCard from '../../../components/card/big_card';
import PatientsTable from '../../../components/table/PatientsTable'

const Patients = () => {

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
          totalRevenue: data['totalRevenue'] || 0,
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
      <div className='px-6 bg-white mb-5'>
        {/* Cards */}
        <div className='flex space-x-6 justify-between mb-5 mt-5'>
              <BigCard title={'All Patients'} subTitle={'Number Of All Patients'} counts={dashboardData.totalRegistrations} />
              <BigCard title={'Confirmed Patients'} subTitle={'Number Of Confirmed Patients'} counts={dashboardData.totalRevenue} />
              <BigCard title={'Pending Patients'} subTitle={'Number Of Pending Patients'} counts={dashboardData.totalUsers} />
              <BigCard title={'Cancelled Patients'} subTitle={'Number Of Cancelled Patients'} counts={dashboardData.totalUsers} />
            </div>

        {/* Patient Table */}
        <PatientsTable />
      </div>
    </>
  )
}

export default Patients