import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
// import DatePicker from 'react-datepicker';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const RegisterPatient = () => {
    const notify = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const initialformData = {
        email: '',
        date: new Date(),
        PhoneNumber: '',
        patientName: '',
        patientProblem: '',
        address: '',
        doctorCategory: '',
        pdfImageUrl: '',
        City: '',
        District: '',
        State: '',
        Country: '',
        Dob: '',
        Age: '',
        year: new Date().getFullYear(),
        Pincode: '',
    };

    const [formData, setFormData] = useState(initialformData);

    const [timeList, setTimeList] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [doctorCategory, setDoctorCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [flag, setFlag] = useState(true);


    const fetchDoctorDetails = async () => {

        const doctor_id = localStorage.getItem('doctorId');

        const data = {
            doctor_id: doctor_id
        };

        try {
            const response = await axios.post(
                'https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_details_using_doctorId',
                data
            );

            setLoading(false);

            // console.log('Doctor Details', response);

            if (response.data['body-json']?.statusCode === 200) {

                setDoctorCategory(response.data['body-json'].body.data.category);
                setTimeList(response.data['body-json'].body.data.timeList || []);
                setSelectedTime(response.data['body-json'].body.data.timeList[0] || '');

                if(timeList.length > 0){
                    setFlag(false);
                }

            } else if (response.data['body-json']?.statusCode === 400) {
                notifyError(response.data['body-json'].body.message);
            } else {
                console.log(`API Response: ${response.data['body-json']['statusCode']}`);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            setError(error.message);
            notifyError("Unable to get time slot");
        }
    };

    useEffect(() => {

        if (timeList.length === 0 && flag) {
            // setLoading(true);
            fetchDoctorDetails();
        }

    });

    const patientFields = [
        { name: 'email', placeholder: 'Email', type: 'email' },
        { name: 'PhoneNumber', placeholder: 'Phone Number' },
        { name: 'patientName', placeholder: 'Patient Name' },
        { name: 'patientProblem', placeholder: 'Problem' },
        { name: 'address', placeholder: 'Address', type: 'textarea' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTime = (e) => {
        setSelectedTime(e.target.value);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileName = `${Date.now()}_${file.name}`;

        try {
            // 1. Get presigned URL
            const presignedRes = await axios.post(
                'https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/emergency_doctor_appointment_booking_upload_pdfImage',
                { fileName }
            );

            const uploadDetails = presignedRes.data['body-json'].body.uploadDetails[0];

            // 2. Upload file to S3
            await axios.put(uploadDetails.signedUrl, file, {
                headers: {
                    'Content-Type': uploadDetails.contentType,
                },
            });

            // 3. save public URL in form
            setFormData(prev => ({
                ...prev,
                pdfImageUrl: uploadDetails.key,
            }))

            notify("File uploaded successfully");
        } catch (err) {
            console.log("Upload error:", err);
            notifyError("Failed to upload file");
        }
    };
               

    const handleClear = () => {
        setFormData(initialformData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const doctor_id = localStorage.getItem('doctorId');

        var data = {
            email: formData.email,
            doctor_id: doctor_id,
            date: formData.date.toISOString().split('T')[0],
            time: selectedTime,
            PhoneNumber: formData.PhoneNumber,
            patientName: formData.patientName,
            patientProblem: formData.patientProblem,
            address: formData.address,
            doctorCategory: doctorCategory,
            pdfImageUrl: formData.pdfImageUrl || '', 
            City: formData.City,
            District: formData.District,
            State: formData.State,
            Country: formData.Country,
            Dob: formData.Dob,
            Age: formData.Age,
            Year: formData.Year,
            Pincode: formData.Pincode
        };

        // console.log('Data', data);

        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/emergency_doctor_appointment_booking', data);

            // console.log('response', response);

            if (response.data['body-json']['statusCode'] === 200) {
                notify("Patient Registered Successfully");
                handleClear();
                console.log('Doctor Added Successfully');
            } else if (response.data['body-json']['statusCode'] === 400) {
                notifyError(response.data['body-json'].body.message);
            } else {
                console.log(`API Response: ${response.data['body-json']['statusCode']}`);
            }

        } catch (error) {
            console.error('Error submitting data:', error.response ? error.response.data : error.message);
        }
    };


    if (loading) return <p className="text-center pt-24 md:pt-5">Loading...</p>;
    if (error) return <p className="text-center text-red-500 pt-24 md:pt-5">Error: {error}</p>;


    return (
        <div className="w-full bg-white px-10 mt-24 md:mt-5">
            <h2 className="text-xl font-semibold mb-5 text-center">Patient Appointment</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Date Picker Field */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Appointment Date
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date.toISOString().split('T')[0]}
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


                {/* Time Slot Dropdown */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Time Slot</label>
                    <select
                        name="time"
                        value={selectedTime}
                        onChange={handleTime}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Select Time</option>
                        {timeList.map((time, index) => (
                            <option key={index} value={time}>{time}</option>
                        ))}
                    </select>
                </div>

                {/* Other Fields */}
                {/* {patientFields.map((field) =>
                    field.type === 'textarea' ? (
                        <textarea
                            key={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                            rows="2"
                            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    ) : (
                        <input
                            key={field.name}
                            type={field.type || 'text'}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    )
                )} */}

                {patientFields.map((field) => (
                <div key={field.name} className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.placeholder} <span className="text-red-500">*</span>
                    </label>
                    {field.type === 'textarea' ? (
                        <textarea
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            rows="2"
                            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    ) : (
                        <input
                            type={field.type || 'text'}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    )}
                </div>
            ))}


                {/* File Upload  */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1"> Upload Patient Reports </label>
                    <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="w-full border border-gray-300 rounded-md p-2"
                        // className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.pdfImageUrl && (
                        // <a href={formData.pdfImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        <a href={formData.pdfImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm mt-1 block">
                            View Uploaded File
                        </a>
                    )}
                    {/* <input
                        type="file"
                        name="patientReports"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        multiple
                    /> */}
                </div>

                {/* Dynamic Fields */}
                <div className="col-span-1">
                    <input
                        type="text"
                        name="City"
                        placeholder="City"
                        value={formData.City}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="col-span-1">
                    <input
                        type="text"
                        name="District"
                        placeholder="District"
                        value={formData.District}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="col-span-1">
                    <input
                        type="text"
                        name="State"
                        placeholder="State"
                        value={formData.State}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="col-span-1">
                    <input
                        type="text"
                        name="Country"
                        placeholder="Country"
                        value={formData.Country}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="col-span-1">
                    <input
                        type="text"
                        name="Dob"
                        placeholder="Date of Birth"
                        value={formData.Dob}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="Age"
                        placeholder="Age"
                        value={formData.Age}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                <div className="col-span-1">
                    <input
                        type="text"
                        name="Pincode"
                        placeholder="Pincode"
                        value={formData.Pincode}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterPatient;