import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DateSelector = () => {
  const [dates, setDates] = useState([]);

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const scrollRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    const temp = [];

    for (let i = 0; i < 15; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      temp.push({
        day: nextDay.toLocaleDateString("en-US", { weekday: "short" }),
        date: nextDay.getDate(),
        fullDate: nextDay.toDateString(),
      });
    }

    setDates(temp);
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -100 : 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-[#fffbea] px-4 py-2 rounded-xl flex items-center justify-between">
      <button onClick={() => scroll("left")}>
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide px-2">
        {dates.map(({ day, date, fullDate }) => (
          <div
            key={fullDate}
            onClick={() => setSelectedDate(fullDate)}
            className={`flex flex-col items-center min-w-[40px] cursor-pointer py-2 px-3 rounded-md ${
              selectedDate === fullDate ? "bg-orange-100 text-black" : "hover:bg-gray-100"
            }`}
          >
            <span className="text-sm text-gray-500">{day}</span>
            <span className="text-lg font-semibold">{date}</span>
          </div>
        ))}
      </div>

      <button onClick={() => scroll("right")}>
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default DateSelector;

// import React, { useState, useRef, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const DateSelector = () => {
//   const [dates, setDates] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const today = new Date();
//     const temp = [];

//     for (let i = 0; i < 30; i++) {
//       const nextDay = new Date(today);
//       nextDay.setDate(today.getDate() + i);
//       temp.push({
//         day: nextDay.toLocaleDateString("en-US", { weekday: "short" }),
//         date: nextDay.getDate(),
//         fullDate: nextDay.toDateString(),
//       });
//     }

//     setDates(temp);
//   }, []);

//   const scroll = (dir) => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({
//         left: dir === "left" ? -200 : 200,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <div className="w-1/2 bg-[#fffbea] px-2 py-3 rounded-xl flex items-center space-x-2">
//       {/* Left Scroll Button */}
//       <button onClick={() => scroll("left")} className="p-1">
//         <ChevronLeft className="w-5 h-5 text-gray-600" />
//       </button>

//       {/* Scrollable Container */}
//       <div
//         ref={scrollRef}
//         className="flex-1 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide"
//       >
//         <div className="flex gap-3">
//           {dates.map(({ day, date, fullDate }) => (
//             <div
//               key={fullDate}
//               onClick={() => setSelectedDate(fullDate)}
//               className={`flex flex-col items-center justify-center flex-shrink-0 w-14 py-2 px-2 rounded-md cursor-pointer ${
//                 selectedDate === fullDate
//                   ? "bg-orange-100 text-black"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               <span className="text-sm text-gray-500">{day}</span>
//               <span className="text-lg font-semibold">{date}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right Scroll Button */}
//       <button onClick={() => scroll("right")} className="p-1">
//         <ChevronRight className="w-5 h-5 text-gray-600" />
//       </button>
//     </div>
//   );
// };

// export default DateSelector;
