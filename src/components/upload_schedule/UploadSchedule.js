import React, { useState } from 'react';

const UploadSchedule = () => {
  const [selectedTab, setSelectedTab] = useState('Morning');
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = {
    Morning: ['9 - 10 AM', '10 - 11 AM', '11 - 12 PM'],
    Afternoon: ['12 - 1 PM', '1 - 2 PM', '2 - 3 PM'],
    Evening: ['4 - 5 PM', '5 - 6 PM', '6 - 7 PM'],
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-indigo-50 rounded-2xl shadow">
      <h2 className="text-xl font-serif mb-4">Upload Schedule</h2>

      {/* Tabs */}
      <div className="flex space-x-6 mb-2 border-b border-gray-200">
        {['Morning', 'Afternoon', 'Evening'].map((tab) => (
          <button
            key={tab}
            className={`pb-2 font-medium transition-all ${
              selectedTab === tab
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
      </div>

      {/* Time Slots */}
      <div className="flex flex-wrap gap-2 mt-4">
        {timeSlots[selectedTab].map((time) => (
          <div
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${
              selectedTime === time
                ? 'bg-blue-100 text-blue-800 font-semibold'
                : selectedTab === 'Morning'
                ? 'bg-red-100 text-gray-800'
                : selectedTab === 'Afternoon'
                ? 'bg-purple-100 text-gray-800'
                : 'bg-blue-100 text-gray-800'
            }`}
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
