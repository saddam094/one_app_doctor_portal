import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

const DashboardTable = () => {

  const [eComTableData, setEComTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  // Fetch API data using Axios  
  const fetchData = async () => {
    try {
      const response = await axios.get("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecommerce_all_shops_get");

      if (response.data && response.data['body-json'].statusCode === 200) {
        setEComTableData(response.data['body-json'].body.info);
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


  useEffect(() => {
    if(eComTableData.length === 0){
      fetchData();
    }
  });



  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-4 py-2 border text-center">ID</th>
            <th className="px-4 py-2 border text-center">P Name</th>
            <th className="px-4 py-2 border text-center">P Phone</th>
            <th className="px-4 py-2 border text-center">P Email</th>
            <th className="px-4 py-2 border text-center">Doctor</th>
            <th className="px-4 py-2 border text-center">Treatment</th>
            <th className="px-4 py-2 border text-center">Address</th>
            <th className="px-4 py-2 border text-center">Date</th>
          </tr>
        </thead>
        <tbody>
          {eComTableData.map((item) => (
            <tr key={item.shop_id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-slate-700">{item.shop_id}</td>
              <td className="px-4 py-2 border text-slate-700">{item.ownerName || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700">{item.ownerPhone || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700">{item.ownerEmail || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700">{item.category || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700">{item.shopName || "N/A"}</td>
              <td className="px-4 py-2 border text-slate-700">{item.address || "N/A"}</td>
              <td className="px-4 py-2 border">{item.regDate || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
