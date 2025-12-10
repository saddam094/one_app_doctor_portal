import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Close, History } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { UploadFile, Edit, Print } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import Doctorlogo from "../../assets/images/doctor-logo.png";

const PatientsTable = ({ selectedDate }) => {
  const [PatientTableData, setPatientTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");

  const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  // Status Update new code
  const [followUpModal, setFollowUpModal] = useState(false);
  const [pendingModal, setPendingModal] = useState(false);
  const [completedModal, setCompletedModal] = useState(false);

  const [formData, setFormData] = useState({ date: new Date() });
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeList, setTimeList] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPatientData, setEditPatientData] = useState(null);

  // ** New for history dialog **
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [historyStatus, setHistoryStatus] = useState(""); // 'follow_up' or 'completed'
  const [historyPrescriptions, setHistoryPrescriptions] = useState([]);

  const fetchDoctorDetails = async () => {
    const doctor_id = localStorage.getItem("doctorId");

    const data = {
      doctor_id: doctor_id,
    };

    try {
      const response = await axios.post(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_details_using_doctorId",
        data
      );

      if (response.data["body-json"]?.statusCode === 200) {
        const apiTimeList = response.data["body-json"].body.data.timeList || [];
        setTimeList(apiTimeList);
        setSelectedTime(apiTimeList[0] || "");
      } else if (response.data["body-json"]?.statusCode === 400) {
        notifyError(response.data["body-json"].body.message);
      } else {
        console.log(
          `API Response: ${response.data["body-json"]["statusCode"]}`
        );
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      notifyError("Unable to get time slots.");
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const doctor_id = localStorage.getItem("doctorId");

      const response = await axios.post(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/till_today_patients_lists",
        {
          doctor_id: doctor_id,
          date: selectedDate === "All" ? "" : selectedDate,
        }
      );

      if (response.data && response.data["body-json"].statusCode === 200) {
        setPatientTableData(response.data["body-json"].body);
      } else if (response.data["body-json"]["statusCode"] === 400) {
        notifyError(response.data["body-json"].body.message);
      } else {
        console.error(
          "Unexpected response format:",
          response.data["body-json"]
        );
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

  const openModal = async (appointment_id, status) => {
    if (status.toLowerCase() === "appointed") {
      setAppointmentId(appointment_id);
      setShowModal(true);
    }

    if (status.toLowerCase() === "pending") {
      if (window.confirm("UPDATE STATUS : COMPLETED")) {
        updateStatus(appointment_id, "completed");
      }
    }
  };

  const updateStatus = async (appointment_id, status) => {
    try {
      const data = {
        appointment_id: appointment_id,
        status: status.toLowerCase(),
      };
      console.log("Data", data);

      const response = await axios.post(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/updateAppointmentStatus_byDoctor",
        data
      );

      console.log("Dashboard Table Status Response", response);

      if (response.data && response.data["body-json"].statusCode === 200) {
        notify(response.data["body-json"].body.message);
      } else if (response.data["body-json"]?.statusCode === 400) {
        notifyError(response.data["body-json"].body.message);
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

  // Status Update submit function new code
  const handleTime = (e) => setSelectedTime(e.target.value);

  // const handleFollowUpSubmit = () => {
  //   setSubmitting(true);
  //   setTimeout(() => {
  //     setSubmitting(false);
  //     setFollowUpModal(false);
  //     setFile(null); // Clear file
  //     toast.success("Follow-up scheduled!");
  //   }, 1500);
  // };

  // const handlePendingSubmit = () => {
  //   setSubmitting(true);
  //   setTimeout(() => {
  //     setSubmitting(false);
  //     setPendingModal(false);
  //     toast.success("Pending message saved!");
  //   }, 1500);
  // };

  // const handleCompletedSubmit = async () => {
  //   if (!file) {
  //     toast.error("Please upload a file before submitting.");
  //     return;
  //   }

  //   setSubmitting(true);

  //   try {
  //     const formData = new FormData();
  //     formData.append("appointment_id", appointmentId);
  //     formData.append("file", file);

  //     const response = await axios.post(
  //       "https://your-api-url/upload", // replace with actual upload URL
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (response.data.statusCode === 200) {
  //       toast.success("File uploaded successfully!");
  //     } else {
  //       toast.error("Upload failed.");
  //     }
  //   } catch (error) {
  //     console.error("File upload error:", error);
  //     toast.error("An error occurred while uploading the file.");
  //   } finally {
  //     setSubmitting(false);
  //     setCompletedModal(false);
  //     setFile(null);
  //   }
  // };

  // COMPLETED STATUS SUBMIT
  const handleCompletedSubmit = async () => {
    if (!file) {
      toast.error("Please upload a file before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Request Presigned URL
      const presignRes = await axios.post(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_appointment_completed_status_presigned",
        { fileName: file.name }
      );

      const uploadDetails = presignRes.data["body-json"].body.uploadDetails[0];
      const { signedUrl, key } = uploadDetails;

      // Step 2: Upload file to S3
      await axios.put(signedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      // Step 3: Call Completed API with pdfUrl
      const res = await axios.post(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/set_doctor_appointment_status_completed",
        {
          appointment_id: appointmentId,
          prescriptions: [{ pdfUrl: key, type: "completed" }],
        }
      );

      if (res.data["body-json"].statusCode === 200) {
        toast.success("Status updated to Completed!");
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error("Completed Status Error:", err);
      toast.error("Error updating status.");
    } finally {
      setSubmitting(false);
      setCompletedModal(false);
      setFile(null);
      fetchData(); // refresh table
    }
  };

  // FOLLOW-UP STATUS SUBMIT
  const handleFollowUpSubmit = async () => {
    setSubmitting(true);
    try {
      let pdfUrl = "";

      if (file) {
        // Step 1: Presigned URL
        const presignRes = await axios.post(
          "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_appointment_followup_status_presigned",
          { fileName: file.name }
        );

        const uploadDetails =
          presignRes.data["body-json"].body.uploadDetails[0];
        const { signedUrl, key } = uploadDetails;

        // Step 2: Upload file
        await axios.put(signedUrl, file, {
          headers: { "Content-Type": file.type },
        });
        pdfUrl = key;
      }

      // Step 3: Follow-up API
      const res = await axios.post(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/set_doctor_appointment_status_to_followup",
        {
          appointment_id: appointmentId,
          date: formData.date.toISOString().split("T")[0],
          time: selectedTime,
          prescriptions: pdfUrl
            ? [
                {
                  date: formData.date,
                  time: selectedTime,
                  pdfUrl,
                  type: "follow_up",
                },
              ]
            : [],
        }
      );

      // if (res.data["body-json"].statusCode === 200) {
      if (res.data.statusCode === 200) {
        toast.success("Follow-up scheduled successfully!");
      } else {
        toast.error("Failed to schedule follow-up.");
      }
    } catch (err) {
      console.error("FollowUp Error:", err);
      toast.error("Error scheduling follow-up.");
    } finally {
      setSubmitting(false);
      setFollowUpModal(false);
      setFile(null);
      fetchData();
    }
  };

  // PENDING STATUS SUBMIT
  const handlePendingSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a pending message.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/set_doctor_appointment_status_pending",
        {
          appointment_id: appointmentId,
          pendingRemark: message,
        }
      );

      if (res.data["body-json"].statusCode === 200) {
        toast.success("Pending status updated!");
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error("Pending Error:", err);
      toast.error("Error updating pending status.");
    } finally {
      setSubmitting(false);
      setPendingModal(false);
      setMessage("");
      fetchData();
    }
  };

  const fetchDoctorDetailsForPrint = async () => {
    try {
      const doctor_id = localStorage.getItem("doctorId");

      const response = await axios.post(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_details_using_doctorId",
        { doctor_id }
      );

      if (response.data["body-json"]?.statusCode === 200) {
        setDoctorDetails(response.data["body-json"].body.data);
        return response.data["body-json"].body.data;
      } else {
        notifyError("Failed to fetch doctor details");
        return null;
      }
    } catch (error) {
      console.error("Doctor Fetch Error", error);
      notifyError("Error fetching doctor data");
      return null;
    }
  };

  const handlePrint = async (patientData) => {
    const doctor = await fetchDoctorDetailsForPrint();
    if (!doctor) return;

    const printContainer = document.createElement("div");
    printContainer.style.width = "210mm"; // A4 width
    printContainer.style.minHeight = "297mm"; // A4 height
    printContainer.style.padding = "20px";
    printContainer.style.fontFamily = "Arial, sans-serif";
    printContainer.style.fontSize = "13px";
    printContainer.style.border = "1px solid #ccc";
    printContainer.style.background = "#fff";

    printContainer.innerHTML = `
    <div style="text-align:center; margin-bottom:20px;">
      ${
        doctor.image
          ? `<img src="${doctor.image}" alt="Doctor Logo" style="width:90px;height:90px;margin-bottom:5px;border-radius:50%"/>`
          : ""
      }
      <h2 style="margin:0;color:#2c3e50;">${
        doctor.clinicName || "Clinic Name"
      }</h2>
      <p style="margin:2px 0;font-weight:bold;">${doctor.name || "Dr. Name"}, ${
      doctor.specialist || ""
    }</p>
      <p style="margin:2px 0;">${doctor.degree || ""}</p>
      <p style="margin:2px 0;font-size:12px;color:#555;">${
        doctor.address || ""
      }</p>
      <p style="margin:2px 0;font-size:12px;">📧 ${doctor.email || ""} | 📞 ${
      doctor.phone || ""
    }</p>
      <hr style="margin:15px 0;border:1px solid #333"/>
    </div>

    <div style="margin-bottom:20px;">
      <h3 style="margin:0 0 10px 0;color:#34495e;">Patient Details</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr>
          <td style="border:1px solid #ccc;padding:6px;"><strong>Reg. No:</strong></td>
          <td style="border:1px solid #ccc;padding:6px;">${
            patientData.appointment_id || ""
          }</td>
          <td style="border:1px solid #ccc;padding:6px;"><strong>Patient Name:</strong></td>
          <td style="border:1px solid #ccc;padding:6px;">${
            patientData.patientName || ""
          }</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:6px;"><strong>Age:</strong></td>
          <td style="border:1px solid #ccc;padding:6px;">${
            patientData.age || ""
          }</td>
          <td style="border:1px solid #ccc;padding:6px;"><strong>Gender:</strong></td>
          <td style="border:1px solid #ccc;padding:6px;">${
            patientData.gender || ""
          }</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:6px;"><strong>Date:</strong></td>
          <td style="border:1px solid #ccc;padding:6px;">${
            patientData.date || ""
          }</td>
          <td style="border:1px solid #ccc;padding:6px;"><strong>Time:</strong></td>
          <td style="border:1px solid #ccc;padding:6px;">${
            patientData.time || ""
          }</td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom:20px;">
      <h3 style="margin:0 0 10px 0;color:#34495e;">Appointment / Prescription</h3>
      <p style="border:1px solid #000;padding:8px;margin:0;background:#f9f9f9;">
        1. Appointment Fee <span style="float:right">Rs. 500/-</span>
      </p>
    </div>

    <div style="text-align:right;margin-top:15px;">
      <p style="margin:0;font-weight:bold;">Total: Rs. 500/- (Five Hundred Only)</p>
    </div>

    <div style="margin-top:25px;">
      <span style="border:2px solid green;padding:6px 15px;color:green;font-weight:bold;">PAID</span>
    </div>

    <div style="margin-top:25px;">
      <p><strong>Follow-up:</strong> Date: __________ &nbsp;&nbsp; Time: __________</p>
    </div>
  `;

    document.body.appendChild(printContainer);

    // Open print preview instead of auto download
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>Prescription</title>
      </head>
      <body>
        ${printContainer.outerHTML}
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    document.body.removeChild(printContainer);
  };

  const openEditModal = (patientData) => {
    setEditPatientData(patientData);
    setEditModalOpen(true);
  };

  // ... fetchDoctorDetails, fetchData etc. unchanged

  const fetchHistory = async (status) => {
    setHistoryLoading(true);
    setHistoryError(null);
    setHistoryPrescriptions([]);
    setHistoryStatus(status);

    try {
      const payload = {
        appointment_id: appointmentId,
        status: status,
      };
      const url =
        // "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/fetch_doctor_appointment_status_data";
        // "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/get_doctor_appointment_status_data";
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/get_doctor_appointment_status_data";
      const response = await axios.post(url, payload);
      const data = response.data["body-json"];
      // if (data.statusCode === 200) {
      //   const prescriptions = data.body.prescriptions || [];
      //   setHistoryPrescriptions(prescriptions);
      // } else {
      //   setHistoryError("Failed to fetch data");
      // }

      // if (data.statusCode === 200) {
      //   if (status === "pending") {
      //     // ✅ Handle pending differently
      //     setHistoryPrescriptions([
      //       { type: "pending", remark: data.body.pendingRemark },
      //     ]);
      //   } else {
      //     const prescriptions = data.body.prescriptions || [];
      //     setHistoryPrescriptions(prescriptions);
      //   }
      // } else {
      //   setHistoryError("Failed to fetch data");
      // }

      if (data.statusCode === 200) {
      if (status === "pending") {
        setHistoryPrescriptions({ pendingRemark: data.body.pendingRemark });
      } else {
        setHistoryPrescriptions(data.body.prescriptions || []);
      }
    } else {
      setHistoryError("Failed to fetch data");
    }
    } catch (err) {
      console.error("History fetch error:", err);
      setHistoryError("Error fetching data");
    } finally {
      setHistoryLoading(false);
    }
  };

  // const fetchHistory = async (status) => {
  //   setHistoryLoading(true);
  //   setHistoryError(null);
  //   setHistoryPrescriptions([]);
  //   setHistoryStatus(status);

  //   try {
  //     const url = `https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/fetch_doctor_appointment_status_data?appointment_id=${appointmentId}&status=${status}`;

  //     const response = await axios.get(url);
  //     const data = response.data["body-json"];

  //     if (data.statusCode === 200) {
  //       const prescriptions = data.body.prescriptions || [];
  //       setHistoryPrescriptions(prescriptions);
  //     } else {
  //       setHistoryError("Failed to fetch data");
  //     }
  //   } catch (err) {
  //     console.error("History fetch error:", err);
  //     setHistoryError("Error fetching data");
  //   } finally {
  //     setHistoryLoading(false);
  //   }
  // };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-4 py-2 border text-center whitespace-nowrap">
              Appointment ID
            </th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">
              P Name
            </th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">
              P Phone
            </th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">
              P Email
            </th>
            {/* <th className="px-4 py-2 border text-center whitespace-nowrap">Doctor</th> */}
            <th className="px-4 py-2 border text-center whitespace-nowrap">
              Treatment
            </th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">
              Address
            </th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">
              Date
            </th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">
              Time
            </th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">
              Status
            </th>
            <th className="px-4 py-2 border text-center whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {PatientTableData.map((item) => (
            <tr key={item.appointment_id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-slate-700">
                {item.appointment_id}
              </td>
              <td className="px-4 py-2 border text-slate-700">
                {item.patientName || "N/A"}
              </td>
              <td className="px-4 py-2 border text-slate-700">
                {item.PhoneNumber || "N/A"}
              </td>
              <td className="px-4 py-2 border text-slate-700">
                {item.email || "N/A"}
              </td>
              {/* <td className="px-4 py-2 border text-slate-700">{item.doctorCategory || "N/A"}</td> */}
              <td className="px-4 py-2 border text-slate-700">
                {item.patientProblem || "N/A"}
              </td>
              <td className="px-4 py-2 border text-slate-700">
                {item.address || "N/A"}
              </td>
              <td className="px-4 py-2 border">{item.date || "N/A"}</td>
              <td className="px-4 py-2 border">{item.time || "N/A"}</td>
              {/* <td
                className={`px-4 py-2 border text-center ${
                  item.status.toLowerCase() === "appointed"
                    ? "cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                    : item.status.toLowerCase() === "pending"
                    ? "bg-yellow-300 hover:bg-yellow-400 text-black cursor-pointer"
                    : item.status.toLowerCase() === "completed"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
                key={item.appointment_id}
                onClick={() => openModal(item.appointment_id, item.status)}
              >
                {item.status || "N/A"}
              </td> */}
              <td
                className={`px-4 py-2 border text-center ${
                  item.status.toLowerCase() === "appointed"
                    ? "cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                    : item.status.toLowerCase() === "completed"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : item.status.toLowerCase() === "pending"
                    ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                    : item.status.toLowerCase() === "follow_up"
                    ? "bg-yellow-300 hover:bg-yellow-400 text-black cursor-pointer"
                    : "bg-gray-300 text-black"
                }`}
                key={item.appointment_id}
                onClick={() => openModal(item.appointment_id, item.status)}
              >
                {item.status || "N/A"}
              </td>

              {/* Action Buttons */}
              <td className="px-4 py-2 border text-center">
                <div className="flex items-center space-x-2">
                  {/* <Tooltip title="Follow-up / Upload / View History">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setAppointmentId(item.appointment_id);
                      setShowModal(true);
                    }}
                  >
                    <UploadFile />
                  </IconButton>
                </Tooltip> */}

                  <Tooltip title="View History (Follow-up / Completed / Pending)">
                    <IconButton
                      color="info"
                      onClick={() => {
                        setAppointmentId(item.appointment_id);
                        setShowHistoryModal(true);
                      }}
                    >
                      <History />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit Details">
                    <IconButton
                      color="secondary"
                      onClick={() => openEditModal(item)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print Record">
                    <IconButton
                      color="success"
                      onClick={() => handlePrint(item)}
                    >
                      <Print />
                    </IconButton>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-6 relative">
            {/* Cross Icon */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <Close />
            </button>

            <h2 className="text-xl font-semibold text-gray-800">
              Update Status
            </h2>

            <div className="flex flex-col space-y-3">
              <button
                onClick={async () => {
                  await fetchDoctorDetails(); // Fetch dynamic time slots
                  setFollowUpModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Follow Up
              </button>

              <button
                onClick={() => setPendingModal(true)}
                className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
              >
                Pending
              </button>
              <button
                onClick={() => setCompletedModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {followUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 relative">
            <button
              onClick={() => setFollowUpModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <Close />
            </button>

            <h2 className="text-lg font-semibold text-gray-800">
              Schedule Follow-Up
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date.toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    date: new Date(e.target.value),
                  }))
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Time Slot
              </label>
              <select
                name="time"
                value={selectedTime}
                onChange={handleTime}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Time</option>
                {timeList.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload PDF / Image (optional)
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {file && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleFollowUpSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              >
                {submitting && <CircularProgress size={20} className="mr-2" />}
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 relative">
            <button
              onClick={() => setPendingModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <Close />
            </button>

            <h2 className="text-lg font-semibold text-gray-800">
              Add Message for Pending
            </h2>

            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
            />

            <div className="flex justify-end">
              <button
                onClick={handlePendingSubmit}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center"
              >
                {submitting && <CircularProgress size={20} className="mr-2" />}
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {completedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 relative">
            <button
              onClick={() => setCompletedModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <Close />
            </button>

            <h2 className="text-lg font-semibold text-gray-800">
              Upload PDF or Image
            </h2>

            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            <div className="flex justify-end">
              <button
                onClick={handleCompletedSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
              >
                {submitting && <CircularProgress size={20} className="mr-2" />}
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && editPatientData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <Close />
            </button>

            <h2 className="text-lg font-semibold text-gray-800">
              Edit Patient Details
            </h2>

            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Patient Name"
              value={editPatientData.patientName}
              onChange={(e) =>
                setEditPatientData({
                  ...editPatientData,
                  patientName: e.target.value,
                })
              }
            />
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Phone"
              value={editPatientData.PhoneNumber}
              onChange={(e) =>
                setEditPatientData({
                  ...editPatientData,
                  PhoneNumber: e.target.value,
                })
              }
            />
            <input
              type="email"
              className="w-full border rounded p-2"
              placeholder="Email"
              value={editPatientData.email}
              onChange={(e) =>
                setEditPatientData({
                  ...editPatientData,
                  email: e.target.value,
                })
              }
            />
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Problem"
              value={editPatientData.patientProblem}
              onChange={(e) =>
                setEditPatientData({
                  ...editPatientData,
                  patientProblem: e.target.value,
                })
              }
            />

            <div className="flex justify-end">
              <button
                onClick={() => {
                  // API will be added later
                  toast.success("Patient data updated (placeholder)");
                  setEditModalOpen(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- History Modal ---------- */}
      {/* {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4 relative">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <Close />
            </button>

            <h2 className="text-xl font-semibold text-gray-800">
              View Prescription History
            </h2>

            <div className="flex space-x-2">
              <button
                onClick={() => fetchHistory("follow_up")}
                className={`px-4 py-2 rounded ${
                  historyStatus === "follow_up"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                Follow Up Data
              </button>
              <button
                onClick={() => fetchHistory("completed")}
                className={`px-4 py-2 rounded ${
                  historyStatus === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-green-200 text-green-800"
                }`}
              >
                Completed Data
              </button>
              <button
                onClick={() => fetchHistory("pending")}
                className={`px-4 py-2 rounded ${
                  historyStatus === "pending"
                    ? "bg-red-600 text-white"
                    : "bg-red-200 text-red-800"
                }`}
              >
                Pending Data
              </button>
            </div>

            <div className="mt-4">
              {historyLoading && (
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              )}

              {historyError && (
                <p className="text-red-500 text-center">{historyError}</p>
              )}

              {!historyLoading &&
                !historyError &&
                historyPrescriptions.length === 0 && (
                  <p className="text-gray-600 text-center">
                    No data to display.
                  </p>
                )}

              {!historyLoading &&
                historyPrescriptions.map((presc, idx) => (
                  <div key={idx} className="border p-3 rounded mb-2 bg-gray-50">
                    <p>
                      <strong>Date: </strong>
                      {presc.date
                        ? new Date(presc.date).toLocaleDateString()
                        : "N/A"}
                    </p>
                    {presc.time && (
                      <p>
                        <strong>Time: </strong>
                        {presc.time}
                      </p>
                    )}
                    <p>
                      <strong>Type: </strong>
                      {presc.type}
                    </p>
                    {presc.pdfUrl && (
                      <p>
                        <a
                          href={presc.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View PDF / File
                        </a>
                      </p>
                    )}
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 space-y-6 relative">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <Close />
            </button>

            <h2 className="text-xl font-semibold text-gray-800">
              Prescription History
            </h2>

            {/* Status Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => fetchHistory("follow_up")}
                className={`px-4 py-2 rounded ${
                  historyStatus === "follow_up"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Follow-Up
              </button>

              <button
                onClick={() => fetchHistory("completed")}
                className={`px-4 py-2 rounded ${
                  historyStatus === "completed"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Completed
              </button>

              <button
                onClick={() => fetchHistory("pending")}
                className={`px-4 py-2 rounded ${
                  historyStatus === "pending"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Pending
              </button>
            </div>

            {/* Loader */}
            {historyLoading && <p className="text-center">Loading...</p>}

            {/* Error */}
            {historyError && (
              <p className="text-center text-red-500">{historyError}</p>
            )}

            {/* Render Data */}
            {!historyLoading && !historyError && (
              <div className="space-y-4">
                {historyStatus === "pending" ? (
                  <div className="p-4 bg-red-50 border border-red-300 rounded">
                    <h3 className="font-semibold text-red-700 mb-2">
                      Pending Remark
                    </h3>
                    <p className="text-gray-800">
                      {historyPrescriptions.pendingRemark ||
                        "No pending remark available."}
                    </p>
                  </div>
                ) : (
                  <>
                    {historyPrescriptions.length > 0 ? (
                      historyPrescriptions.map((p, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-300 rounded"
                        >
                          <p>
                            <strong>Date:</strong> {p.date || "N/A"}
                          </p>
                          <p>
                            <strong>Time:</strong> {p.time || "N/A"}
                          </p>
                          {p.pdfUrl && (
                            <a
                              href={p.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              View Prescription
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">
                        No records found.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsTable;

// import { useCallback, useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Close } from "@mui/icons-material";
// import CircularProgress from "@mui/material/CircularProgress";
// import { UploadFile, Edit, Print } from "@mui/icons-material";
// import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";
// // import jsPDF from "jspdf";
// // import html2canvas from "html2canvas";
// // import Doctorlogo from "../../assets/images/doctor-logo.png";

// // const PatientsTable = ({ selectedDate }) => {
// const PatientsTable = ({ dateFrom, dateTo, filterApplied }) => {
//   const [PatientTableData, setPatientTableData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showModal, setShowModal] = useState(false);
//   const [appointmentId, setAppointmentId] = useState("");

//   const notify = (message) => toast.success(message);
//   const notifyError = (message) => toast.error(message);

//   // Status Update new code
//   const [followUpModal, setFollowUpModal] = useState(false);
//   const [pendingModal, setPendingModal] = useState(false);
//   const [completedModal, setCompletedModal] = useState(false);

//   const [formData, setFormData] = useState({ date: new Date() });
//   const [selectedTime, setSelectedTime] = useState("");
//   const [message, setMessage] = useState("");
//   const [file, setFile] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [timeList, setTimeList] = useState([]);
//   const [doctorDetails, setDoctorDetails] = useState(null);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editPatientData, setEditPatientData] = useState(null);

//   const fetchDoctorDetails = async () => {
//     const doctor_id = localStorage.getItem("doctorId");

//     const data = {
//       doctor_id: doctor_id,
//     };

//     try {
//       const response = await axios.post(
//         "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_details_using_doctorId",
//         data
//       );

//       if (response.data["body-json"]?.statusCode === 200) {
//         const apiTimeList = response.data["body-json"].body.data.timeList || [];
//         setTimeList(apiTimeList);
//         setSelectedTime(apiTimeList[0] || "");
//       } else if (response.data["body-json"]?.statusCode === 400) {
//         notifyError(response.data["body-json"].body.message);
//       } else {
//         console.log(
//           `API Response: ${response.data["body-json"]["statusCode"]}`
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching doctor details:", error);
//       notifyError("Unable to get time slots.");
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const doctor_id = localStorage.getItem("doctorId");

//       // Format date function
//       const formatDate = (input) => {
//         const [year, month, day] = input.split("-");
//         return `${day}-${month}-${year}`;
//       };

//       const response = await axios.post(
//         "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/patients_fromDate_toDate_in_doctor_portal",
//         {
//           doctor_id,
//           dateFrom: formatDate(dateFrom),
//           dateTo: formatDate(dateTo),
//         }
//       );

//       const body = response.data["body-json"];

//       if (body?.statusCode === 200) {
//         setPatientTableData(body.body); // ← Make sure setPatientTableData exists
//       } else {
//         console.error("Failed to fetch data", body);
//       }
//     } catch (error) {
//       console.error("Error fetching patient data:", error);
//     }
//   };

//   useEffect(() => {
//     if (filterApplied && dateFrom && dateTo) {
//       fetchData();
//     }
//   }, [dateFrom, dateTo, filterApplied]);

//   // const fetchData = useCallback(async () => {
//   //   try {
//   //     const doctor_id = localStorage.getItem("doctorId");

//   //     const response = await axios.post(
//   //       "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/till_today_patients_lists",
//   //       {
//   //         doctor_id: doctor_id,
//   //         date: selectedDate === "All" ? "" : selectedDate,
//   //       }
//   //     );

//   //     if (response.data && response.data["body-json"].statusCode === 200) {
//   //       setPatientTableData(response.data["body-json"].body);
//   //     } else if (response.data["body-json"]["statusCode"] === 400) {
//   //       notifyError(response.data["body-json"].body.message);
//   //     } else {
//   //       console.error(
//   //         "Unexpected response format:",
//   //         response.data["body-json"]
//   //       );
//   //       throw new Error("Failed to fetch data");
//   //     }
//   //   } catch (err) {
//   //     console.error("Fetch Error:", err);
//   //     setError(err.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }, [selectedDate]);

//   // useEffect(() => {
//   //   if (selectedDate) {
//   //     setLoading(true);
//   //     fetchData();
//   //   }
//   // }, [fetchData, selectedDate]);

//   const openModal = async (appointment_id, status) => {
//     if (status.toLowerCase() === "appointed") {
//       setAppointmentId(appointment_id);
//       setShowModal(true);
//     }

//     if (status.toLowerCase() === "pending") {
//       if (window.confirm("UPDATE STATUS : COMPLETED")) {
//         updateStatus(appointment_id, "completed");
//       }
//     }
//   };

//   const updateStatus = async (appointment_id, status) => {
//     try {
//       const data = {
//         appointment_id: appointment_id,
//         status: status.toLowerCase(),
//       };
//       console.log("Data", data);

//       const response = await axios.post(
//         "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/updateAppointmentStatus_byDoctor",
//         data
//       );

//       console.log("Dashboard Table Status Response", response);

//       if (response.data && response.data["body-json"].statusCode === 200) {
//         notify(response.data["body-json"].body.message);
//       } else if (response.data["body-json"]?.statusCode === 400) {
//         notifyError(response.data["body-json"].body.message);
//       } else {
//         throw new Error("Unexpected response format");
//       }
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     } finally {
//       setShowModal(false);
//       fetchData();
//     }
//   };

//   // Status Update submit function new code
//   const handleTime = (e) => setSelectedTime(e.target.value);

//   // const handleFollowUpSubmit = () => {
//   //   setSubmitting(true);
//   //   setTimeout(() => {
//   //     setSubmitting(false);
//   //     setFollowUpModal(false);
//   //     setFile(null); // Clear file
//   //     toast.success("Follow-up scheduled!");
//   //   }, 1500);
//   // };

//   // const handlePendingSubmit = () => {
//   //   setSubmitting(true);
//   //   setTimeout(() => {
//   //     setSubmitting(false);
//   //     setPendingModal(false);
//   //     toast.success("Pending message saved!");
//   //   }, 1500);
//   // };

//   // const handleCompletedSubmit = async () => {
//   //   if (!file) {
//   //     toast.error("Please upload a file before submitting.");
//   //     return;
//   //   }

//   //   setSubmitting(true);

//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("appointment_id", appointmentId);
//   //     formData.append("file", file);

//   //     const response = await axios.post(
//   //       "https://your-api-url/upload", // replace with actual upload URL
//   //       formData,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //         },
//   //       }
//   //     );

//   //     if (response.data.statusCode === 200) {
//   //       toast.success("File uploaded successfully!");
//   //     } else {
//   //       toast.error("Upload failed.");
//   //     }
//   //   } catch (error) {
//   //     console.error("File upload error:", error);
//   //     toast.error("An error occurred while uploading the file.");
//   //   } finally {
//   //     setSubmitting(false);
//   //     setCompletedModal(false);
//   //     setFile(null);
//   //   }
//   // };

//   // COMPLETED STATUS SUBMIT
//   const handleCompletedSubmit = async () => {
//     if (!file) {
//       toast.error("Please upload a file before submitting.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       // Step 1: Request Presigned URL
//       const presignRes = await axios.post(
//         "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_appointment_completed_status_presigned",
//         { fileName: file.name }
//       );

//       const uploadDetails = presignRes.data["body-json"].body.uploadDetails[0];
//       const { signedUrl, key } = uploadDetails;

//       // Step 2: Upload file to S3
//       await axios.put(signedUrl, file, {
//         headers: { "Content-Type": file.type },
//       });

//       // Step 3: Call Completed API with pdfUrl
//       const res = await axios.post(
//         "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/set_doctor_appointment_status_completed",
//         {
//           appointment_id: appointmentId,
//           prescriptions: [{ pdfUrl: key, type: "completed" }],
//         }
//       );

//       if (res.data["body-json"].statusCode === 200) {
//         toast.success("Status updated to Completed!");
//       } else {
//         toast.error("Failed to update status.");
//       }
//     } catch (err) {
//       console.error("Completed Status Error:", err);
//       toast.error("Error updating status.");
//     } finally {
//       setSubmitting(false);
//       setCompletedModal(false);
//       setFile(null);
//       fetchData(); // refresh table
//     }
//   };

//   // FOLLOW-UP STATUS SUBMIT
//   const handleFollowUpSubmit = async () => {
//     setSubmitting(true);
//     try {
//       let pdfUrl = "";

//       if (file) {
//         // Step 1: Presigned URL
//         const presignRes = await axios.post(
//           "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_appointment_followup_status_presigned",
//           { fileName: file.name }
//         );

//         const uploadDetails =
//           presignRes.data["body-json"].body.uploadDetails[0];
//         const { signedUrl, key } = uploadDetails;

//         // Step 2: Upload file
//         await axios.put(signedUrl, file, {
//           headers: { "Content-Type": file.type },
//         });
//         pdfUrl = key;
//       }

//       // Step 3: Follow-up API
//       const res = await axios.post(
//         "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/set_doctor_appointment_status_to_followup",
//         {
//           appointment_id: appointmentId,
//           date: formData.date.toISOString().split("T")[0],
//           time: selectedTime,
//           prescriptions: pdfUrl
//             ? [
//                 {
//                   date: formData.date,
//                   time: selectedTime,
//                   pdfUrl,
//                   type: "follow_up",
//                 },
//               ]
//             : [],
//         }
//       );

//       // if (res.data["body-json"].statusCode === 200) {
//       if (res.data.statusCode === 200) {
//         toast.success("Follow-up scheduled successfully!");
//       } else {
//         toast.error("Failed to schedule follow-up.");
//       }
//     } catch (err) {
//       console.error("FollowUp Error:", err);
//       toast.error("Error scheduling follow-up.");
//     } finally {
//       setSubmitting(false);
//       setFollowUpModal(false);
//       setFile(null);
//       fetchData();
//     }
//   };

//   // PENDING STATUS SUBMIT
//   const handlePendingSubmit = async () => {
//     if (!message.trim()) {
//       toast.error("Please enter a pending message.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const res = await axios.post(
//         "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/set_doctor_appointment_status_pending",
//         {
//           appointment_id: appointmentId,
//           pendingRemark: message,
//         }
//       );

//       if (res.data["body-json"].statusCode === 200) {
//         toast.success("Pending status updated!");
//       } else {
//         toast.error("Failed to update status.");
//       }
//     } catch (err) {
//       console.error("Pending Error:", err);
//       toast.error("Error updating pending status.");
//     } finally {
//       setSubmitting(false);
//       setPendingModal(false);
//       setMessage("");
//       fetchData();
//     }
//   };

//   const fetchDoctorDetailsForPrint = async () => {
//     try {
//       const doctor_id = localStorage.getItem("doctorId");

//       const response = await axios.post(
//         "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_details_using_doctorId",
//         { doctor_id }
//       );

//       if (response.data["body-json"]?.statusCode === 200) {
//         setDoctorDetails(response.data["body-json"].body.data);
//         return response.data["body-json"].body.data;
//       } else {
//         notifyError("Failed to fetch doctor details");
//         return null;
//       }
//     } catch (error) {
//       console.error("Doctor Fetch Error", error);
//       notifyError("Error fetching doctor data");
//       return null;
//     }
//   };

//   const handlePrint = async (patientData) => {
//     const doctor = await fetchDoctorDetailsForPrint();
//     if (!doctor) return;

//     const printContainer = document.createElement("div");
//     printContainer.style.width = "210mm"; // A4 width
//     printContainer.style.minHeight = "297mm"; // A4 height
//     printContainer.style.padding = "20px";
//     printContainer.style.fontFamily = "Arial, sans-serif";
//     printContainer.style.fontSize = "13px";
//     printContainer.style.border = "1px solid #ccc";
//     printContainer.style.background = "#fff";

//     printContainer.innerHTML = `
//     <div style="text-align:center; margin-bottom:20px;">
//       ${
//         doctor.image
//           ? `<img src="${doctor.image}" alt="Doctor Logo" style="width:90px;height:90px;margin-bottom:5px;border-radius:50%"/>`
//           : ""
//       }
//       <h2 style="margin:0;color:#2c3e50;">${
//         doctor.clinicName || "Clinic Name"
//       }</h2>
//       <p style="margin:2px 0;font-weight:bold;">${doctor.name || "Dr. Name"}, ${
//       doctor.specialist || ""
//     }</p>
//       <p style="margin:2px 0;">${doctor.degree || ""}</p>
//       <p style="margin:2px 0;font-size:12px;color:#555;">${
//         doctor.address || ""
//       }</p>
//       <p style="margin:2px 0;font-size:12px;">📧 ${doctor.email || ""} | 📞 ${
//       doctor.phone || ""
//     }</p>
//       <hr style="margin:15px 0;border:1px solid #333"/>
//     </div>

//     <div style="margin-bottom:20px;">
//       <h3 style="margin:0 0 10px 0;color:#34495e;">Patient Details</h3>
//       <table style="width:100%;border-collapse:collapse;font-size:13px;">
//         <tr>
//           <td style="border:1px solid #ccc;padding:6px;"><strong>Reg. No:</strong></td>
//           <td style="border:1px solid #ccc;padding:6px;">${
//             patientData.appointment_id || ""
//           }</td>
//           <td style="border:1px solid #ccc;padding:6px;"><strong>Patient Name:</strong></td>
//           <td style="border:1px solid #ccc;padding:6px;">${
//             patientData.patientName || ""
//           }</td>
//         </tr>
//         <tr>
//           <td style="border:1px solid #ccc;padding:6px;"><strong>Age:</strong></td>
//           <td style="border:1px solid #ccc;padding:6px;">${
//             patientData.age || ""
//           }</td>
//           <td style="border:1px solid #ccc;padding:6px;"><strong>Gender:</strong></td>
//           <td style="border:1px solid #ccc;padding:6px;">${
//             patientData.gender || ""
//           }</td>
//         </tr>
//         <tr>
//           <td style="border:1px solid #ccc;padding:6px;"><strong>Date:</strong></td>
//           <td style="border:1px solid #ccc;padding:6px;">${
//             patientData.date || ""
//           }</td>
//           <td style="border:1px solid #ccc;padding:6px;"><strong>Time:</strong></td>
//           <td style="border:1px solid #ccc;padding:6px;">${
//             patientData.time || ""
//           }</td>
//         </tr>
//       </table>
//     </div>

//     <div style="margin-bottom:20px;">
//       <h3 style="margin:0 0 10px 0;color:#34495e;">Appointment / Prescription</h3>
//       <p style="border:1px solid #000;padding:8px;margin:0;background:#f9f9f9;">
//         1. Appointment Fee <span style="float:right">Rs. 500/-</span>
//       </p>
//     </div>

//     <div style="text-align:right;margin-top:15px;">
//       <p style="margin:0;font-weight:bold;">Total: Rs. 500/- (Five Hundred Only)</p>
//     </div>

//     <div style="margin-top:25px;">
//       <span style="border:2px solid green;padding:6px 15px;color:green;font-weight:bold;">PAID</span>
//     </div>

//     <div style="margin-top:25px;">
//       <p><strong>Follow-up:</strong> Date: __________ &nbsp;&nbsp; Time: __________</p>
//     </div>
//   `;

//     document.body.appendChild(printContainer);

//     // Open print preview instead of auto download
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//     <html>
//       <head>
//         <title>Prescription</title>
//       </head>
//       <body>
//         ${printContainer.outerHTML}
//       </body>
//     </html>
//   `);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();

//     document.body.removeChild(printContainer);
//   };

//   const openEditModal = (patientData) => {
//     setEditPatientData(patientData);
//     setEditModalOpen(true);
//   };

//   if (loading) return <p className="text-center">Loading...</p>;
//   if (error) return <p className="text-center text-red-500">Error: {error}</p>;

//   return (
//     <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//       <table className="min-w-full text-left border-collapse">
//         <thead className="bg-indigo-50">
//           <tr>
//             <th className="px-4 py-2 border text-center whitespace-nowrap">
//               Appointment ID
//             </th>
//             <th className="px-4 py-2 border text-center whitespace-nowrap">
//               P Name
//             </th>
//             <th className="px-4 py-2 border text-center whitespace-nowrap">
//               P Phone
//             </th>
//             <th className="px-4 py-2 border text-center whitespace-nowrap">
//               P Email
//             </th>
//             {/* <th className="px-4 py-2 border text-center whitespace-nowrap">Doctor</th> */}
//             <th className="px-4 py-2 border text-center whitespace-nowrap">
//               Treatment
//             </th>
//             <th className="px-4 py-2 border text-center whitespace-nowrap">
//               Address
//             </th>
//             <th className="px-4 py-2 border text-center whitespace-nowrap">
//               Date
//             </th>
//             <th className="px-4 py-2 border text-center whitespace-nowrap">
//               Time
//             </th>
//             <th className="px-4 py-2 border text-center whitespace-nowrap">
//               Status
//             </th>
//             <th className="px-4 py-2 border text-center whitespace-nowrap">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {PatientTableData.map((item) => (
//             <tr key={item.appointment_id} className="hover:bg-gray-50">
//               <td className="px-4 py-2 border text-slate-700">
//                 {item.appointment_id}
//               </td>
//               <td className="px-4 py-2 border text-slate-700">
//                 {item.patientName || "N/A"}
//               </td>
//               <td className="px-4 py-2 border text-slate-700">
//                 {item.PhoneNumber || "N/A"}
//               </td>
//               <td className="px-4 py-2 border text-slate-700">
//                 {item.email || "N/A"}
//               </td>
//               {/* <td className="px-4 py-2 border text-slate-700">{item.doctorCategory || "N/A"}</td> */}
//               <td className="px-4 py-2 border text-slate-700">
//                 {item.patientProblem || "N/A"}
//               </td>
//               <td className="px-4 py-2 border text-slate-700">
//                 {item.address || "N/A"}
//               </td>
//               <td className="px-4 py-2 border">{item.date || "N/A"}</td>
//               <td className="px-4 py-2 border">{item.time || "N/A"}</td>
//               <td
//                 className={`px-4 py-2 border text-center ${
//                   item.status.toLowerCase() === "appointed"
//                     ? "cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
//                     : item.status.toLowerCase() === "pending"
//                     ? "bg-yellow-300 hover:bg-yellow-400 text-black cursor-pointer"
//                     : item.status.toLowerCase() === "completed"
//                     ? "bg-green-500 hover:bg-green-600 text-white"
//                     : "bg-red-500 hover:bg-red-600 text-white"
//                 }`}
//                 key={item.appointment_id}
//                 onClick={() => openModal(item.appointment_id, item.status)}
//               >
//                 {item.status || "N/A"}
//               </td>
//               {/* Action Buttons */}
//               <td className="px-4 py-2 border text-center">
//                 <Tooltip title="Follow-up / Upload / View History">
//                   <IconButton
//                     color="primary"
//                     onClick={() => {
//                       setAppointmentId(item.appointment_id);
//                       setShowModal(true);
//                     }}
//                   >
//                     <UploadFile />
//                   </IconButton>
//                 </Tooltip>

//                 <Tooltip title="Edit Details">
//                   <IconButton
//                     color="secondary"
//                     onClick={() => openEditModal(item)}
//                   >
//                     <Edit />
//                   </IconButton>
//                 </Tooltip>

//                 <Tooltip title="Print Record">
//                   <IconButton color="success" onClick={() => handlePrint(item)}>
//                     <Print />
//                   </IconButton>
//                 </Tooltip>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-6 relative">
//             {/* Cross Icon */}
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               <Close />
//             </button>

//             <h2 className="text-xl font-semibold text-gray-800">
//               Update Status
//             </h2>

//             <div className="flex flex-col space-y-3">
//               <button
//                 onClick={async () => {
//                   await fetchDoctorDetails(); // Fetch dynamic time slots
//                   setFollowUpModal(true);
//                 }}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Follow Up
//               </button>

//               <button
//                 onClick={() => setPendingModal(true)}
//                 className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
//               >
//                 Pending
//               </button>
//               <button
//                 onClick={() => setCompletedModal(true)}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               >
//                 Completed
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {followUpModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 relative">
//             <button
//               onClick={() => setFollowUpModal(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               <Close />
//             </button>

//             <h2 className="text-lg font-semibold text-gray-800">
//               Schedule Follow-Up
//             </h2>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Appointment Date
//               </label>
//               <input
//                 type="date"
//                 name="date"
//                 value={formData.date.toISOString().split("T")[0]}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     date: new Date(e.target.value),
//                   }))
//                 }
//                 className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Time Slot
//               </label>
//               <select
//                 name="time"
//                 value={selectedTime}
//                 onChange={handleTime}
//                 className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               >
//                 <option value="">Select Time</option>
//                 {timeList.map((time, index) => (
//                   <option key={index} value={time}>
//                     {time}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Upload PDF / Image (optional)
//               </label>
//               <input
//                 type="file"
//                 accept=".pdf,image/*"
//                 onChange={(e) => setFile(e.target.files[0])}
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//               />
//               {file && (
//                 <p className="text-sm text-gray-600 mt-1">
//                   Selected: {file.name}
//                 </p>
//               )}
//             </div>

//             <div className="flex justify-end">
//               <button
//                 onClick={handleFollowUpSubmit}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
//               >
//                 {submitting && <CircularProgress size={20} className="mr-2" />}
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {pendingModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 relative">
//             <button
//               onClick={() => setPendingModal(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               <Close />
//             </button>

//             <h2 className="text-lg font-semibold text-gray-800">
//               Add Message for Pending
//             </h2>

//             <textarea
//               rows="4"
//               className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Enter message"
//             />

//             <div className="flex justify-end">
//               <button
//                 onClick={handlePendingSubmit}
//                 className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center"
//               >
//                 {submitting && <CircularProgress size={20} className="mr-2" />}
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {completedModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 relative">
//             <button
//               onClick={() => setCompletedModal(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               <Close />
//             </button>

//             <h2 className="text-lg font-semibold text-gray-800">
//               Upload PDF or Image
//             </h2>

//             <input
//               type="file"
//               accept=".pdf,image/*"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />

//             <div className="flex justify-end">
//               <button
//                 onClick={handleCompletedSubmit}
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
//               >
//                 {submitting && <CircularProgress size={20} className="mr-2" />}
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {editModalOpen && editPatientData && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 relative">
//             <button
//               onClick={() => setEditModalOpen(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               <Close />
//             </button>

//             <h2 className="text-lg font-semibold text-gray-800">
//               Edit Patient Details
//             </h2>

//             <input
//               type="text"
//               className="w-full border rounded p-2"
//               placeholder="Patient Name"
//               value={editPatientData.patientName}
//               onChange={(e) =>
//                 setEditPatientData({
//                   ...editPatientData,
//                   patientName: e.target.value,
//                 })
//               }
//             />
//             <input
//               type="text"
//               className="w-full border rounded p-2"
//               placeholder="Phone"
//               value={editPatientData.PhoneNumber}
//               onChange={(e) =>
//                 setEditPatientData({
//                   ...editPatientData,
//                   PhoneNumber: e.target.value,
//                 })
//               }
//             />
//             <input
//               type="email"
//               className="w-full border rounded p-2"
//               placeholder="Email"
//               value={editPatientData.email}
//               onChange={(e) =>
//                 setEditPatientData({
//                   ...editPatientData,
//                   email: e.target.value,
//                 })
//               }
//             />
//             <input
//               type="text"
//               className="w-full border rounded p-2"
//               placeholder="Problem"
//               value={editPatientData.patientProblem}
//               onChange={(e) =>
//                 setEditPatientData({
//                   ...editPatientData,
//                   patientProblem: e.target.value,
//                 })
//               }
//             />

//             <div className="flex justify-end">
//               <button
//                 onClick={() => {
//                   // API will be added later
//                   toast.success("Patient data updated (placeholder)");
//                   setEditModalOpen(false);
//                 }}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatientsTable;
