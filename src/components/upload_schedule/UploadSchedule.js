// import React, { useState } from 'react';

const UploadSchedule = ({ timeList }) => {

  // const [selectedTab, setSelectedTab] = useState('Morning');
  // const [selectedTime, setSelectedTime] = useState('');

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-indigo-50 rounded-2xl shadow">
      <h2 className="text-xl font-serif mb-4">Upload Schedule</h2>

      {/* Tabs */}
      {/* <div className="flex space-x-6 mb-2 border-b border-gray-200">
        {['Morning', 'Afternoon', 'Evening'].map((tab) => (
          <button
            key={tab}
            className={`pb-2 font-medium transition-all ${selectedTab === tab
                ? 'text-white bg-purple-400 px-4 py-1 rounded-full'
                : 'text-gray-700'
              }`}
            onClick={() => {
              setSelectedTab(tab);
              setSelectedTime('');
            }}
          >
            {tab}
          </button>
        ))}
      </div> */}

      {/* Time Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1">
        {(timeList || []).map((time, index) => (
          <div
            key={index}
            className="h-10 px-2 py-1 bg-white text-indigo-700 border border-indigo-300 rounded-xl shadow-sm text-center text-xs font-medium transition-transform transform hover:scale-105 hover:bg-indigo-100 cursor-pointer"
          >
            {time}
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <div className="mt-6 text-right">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow">
          UPLOAD
        </button>
      </div>
    </div>
  );
};

export default UploadSchedule;
