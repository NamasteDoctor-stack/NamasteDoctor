import React, { useEffect } from "react";
import Navbar from "../Navbar";
import "../mainstyle.css";
import { Link } from "react-router-dom";

// Import doctor images
import imgKaveriKarki from "../Images/doctors/IMG-20250716-WA0001 - Kaveri Karki.jpg";
import imgAakritiKarki from "../Images/doctors/AK headshot professional - Aakriti Karki.jpg";
import imgNikeshYadav from "../Images/doctors/IMG_1868 - nikesh yadav.jpeg";
import imgRikeshAcharya from "../Images/doctors/DSC_0240 =2.5x3.5 - Rikesh Acharya.jpg";
import imgDewasishSwar from "../Images/doctors/any.jpg";
import imgPraveenThapa from "../Images/doctors/IMG_3695 - Praveen Thapa.jpeg";
import imgSapanaChhetry from "../Images/doctors/IMG_0225 - sapana chhetry 118.jpeg";
import imgPrashantGuragain from "../Images/doctors/WhatsApp Image 2025-02-21 at 18.47.54 4 - Prashant Guragain.jpeg";
import imgIshantPatel from "../Images/doctors/DSC_9832 - Ishant Patel.jpg";
import imgAshmitaPandey from "../Images/doctors/Pi7_Tool_New Doc 12-17-2021 14.38 - Ashmita Pandey.jpg";
import imgMadanNeupane from "../Images/doctors/11716 - MR Neupane.jpg";
import imgBolbamRajak from "../Images/doctors/IMG_1994 - Bolbam Rajak.jpeg";
import imgPrakashPandey from "../Images/doctors/IMG_6178 (1) - Prakash Pandey.JPG";
import imgAratiBartaula from "../Images/doctors/45759b54-a77d-4000-a504-5195abc7e603 - Arati Bartaula.jpeg";
import imgKisanAdhikari from "../Images/doctors/any.jpg";
import imgAmritaShrestha from "../Images/doctors/1728536640626 - Amrita Shrestha.jpg";
import imgShivaKafle from "../Images/doctors/IMG_20250716_143612 - Shiva Kafle.jpg";
import imgSajalKC from "../Images/doctors/8804 - sajal kc.jpg";
import imgAjayKarn from "../Images/doctors/+25126a (1) - Ajay Karn.jpg";
import imgAnujShrestha from "../Images/doctors/IMG-20240918-WA0009 - Anuj Shrestha.jpg";
import imgShivaAryal from "../Images/doctors/Dr Shiva ERAS Photo - Shiva Sharma Aryal.jpg";
import imgSujanKhatri from "../Images/doctors/any.jpg";
import imgDhirajChaurasia from "../Images/doctors/1687442873940 - 26 Dhiraj Chaurasia.jpeg";
import imgAshaShahi from "../Images/doctors/image-600x1000.jpg 2 - Aasha Shahi.png";
import imgAaryaAdhikari from "../Images/doctors/IMG_20240530_122713 - Aarya Adhikari.jpg";
import imgNirakarShrestha from "../Images/doctors/received_461731497880850_Original - Nirakar Shrestha.jpeg";
import imgPratimaThapa from "../Images/doctors/_MG_3972 copy - Pratima Thapa.jpg";
import imgParthaBaral from "../Images/doctors/photoeras - partha.jpg";
import imgRupeshSah from "../Images/doctors/SAVE_20250126_131945 - Rupesh Sah.jpg";
import imgBishwarajAdhikari from "../Images/doctors/passport sized phuto - bishwaraj adhikari.png";
import imgAjaySah from "../Images/doctors/DSC_0795 =2(1)(1) - Ajay Sah.jpg";
import imgShamrantBaniya from "../Images/doctors/image - Shamrant Baniya.jpg";
import imgSamridhiShrestha from "../Images/doctors/Profile - Samridhi Shrestha.jpg";
import imgSuminThapa from "../Images/doctors/IMG_4855 - Sumin Thapa.jpeg";
import imgManojShahi from "../Images/doctors/IMG_0058 - Manoj Shahi.jpeg";
import imgAakashNeupane from "../Images/doctors/DSC_0692 =2.5x3.5 - Aakash Neupane.jpg";
import imgMayaUpadhyaya from "../Images/doctors/DSC_0728 - Maya Upadhyaya.jpg";
import imgAditiPajiyar from "../Images/doctors/IMG_20240812_140612 - Aditi Pajiyar.jpg";
import imgAlisha from "../Images/doctors/IMG_1262 - Alisha Shrivastav.jpeg";
import imgPradeepKhatiwada from "../Images/doctors/DSC_7701 =2.5x3.5 - Pradeep Khatiwada.jpg";
import imgSwetaSingh from "../Images/doctors/IMG_3451 - Sweta Singh.jpeg";
import imgGautamMandal from "../Images/doctors/1716081905082 (3) - Gautam Mandal.jpg";
import imgSaugatPokhrel from "../Images/doctors/Screenshot_2024-07-08-09-52-45-802_com.miui.gallery - Saugat Pokhrel.jpg";
import imgVijayaDuwadi from "../Images/doctors/IMG_0396 - Vijay Duwadi.jpeg";
import imgSomRajAwasthi from "../Images/doctors/od190917 - SomRaj Awasthi.JPG";
import imgSujanTamang from "../Images/doctors/PP Photo - Sujan Tamang.jpg";
import imgKritikaBhattarai from "../Images/doctors/Screenshot_2025-05-22-20-19-55-002_com.google.android.gm - Kritika Bhattarai.jpg";
import imgBibhaOsti from "../Images/doctors/1744996354387 - Bibha Osti.jpg";
import imgDeekshyaDevkota from "../Images/doctors/IMG_20231214_175347_961 - Deekshya Devkota.jpg";
import imgSuveksha from "../Images/doctors/IMG_20200709_202327 - Suveksha.jpg";
import imgSudhaThapa from "../Images/doctors/IMG_5748 - Sudha Thapa.jpg";
import imgDoctor1 from "../Images/Doctor-1.png";
import imgDoctor2 from "../Images/Doctor-2.png";

const OurDoctorsPage = () => {
  useEffect(() => {
    document.title = "Our Doctors - Namaste Doctor";
    window.scrollTo(0, 0);
  }, []);

  const doctorsData = [
    {
      id: 1,
      name: "Dr. Sagar Panthi",
      qualification: "MD",
      college: "Texas Tech University Health Sciences Center",
      image: imgDoctor1
    },
    {
      id: 2,
      name: "Dr. Rochana Acharya",
      qualification: "MD",
      college: "Cleveland Clinic Foundation Program",
      image: imgDoctor2
    },
    {
      id: 3,
      name: "Dr. Kaveri Karki",
      qualification: "MBBS",
      college: "Hope Hospital",
      image: imgKaveriKarki
    },
    {
      id: 4,
      name: "Dr. Aakriti Karki",
      qualification: "MBBS",
      college: "Nepal Health Insurance Board",
      image: imgAakritiKarki
    },
    {
      id: 5,
      name: "Dr. Nikesh Kumar Yadav",
      qualification: "MBBS",
      college: "Civil Service Hospital",
      image: imgNikeshYadav
    },
    {
      id: 6,
      name: "Dr. Rikesh Acharya",
      qualification: "MBBS",
      college: "Birat Medical College Teaching Hospital",
      image: imgRikeshAcharya
    },
    {
      id: 7,
      name: "Dr. Dewasish Swar",
      qualification: "MBBS",
      college: "PAHS",
      image: imgDewasishSwar
    },
    {
      id: 8,
      name: "Dr. Praveen Thapa",
      qualification: "MBBS",
      college: "Chirayu National Hospital and Medical Institute",
      image: imgPraveenThapa
    },
    {
      id: 9,
      name: "Dr. Sapana Chhetry",
      qualification: "MBBS",
      college: "Bharatpur Central Hospital",
      image: imgSapanaChhetry
    },
    {
      id: 10,
      name: "Dr. Prashant Guragain",
      qualification: "MBBS",
      college: "BPKIHS",
      image: imgPrashantGuragain
    },
    {
      id: 11,
      name: "Dr. Ishant Raj Patel",
      qualification: "MBBS",
      college: "",
      image: imgIshantPatel
    },
    {
      id: 12,
      name: "Dr. Ashmita Pandey",
      qualification: "MBBS",
      college: "TU Teaching Hospital",
      image: imgAshmitaPandey
    },
    {
      id: 13,
      name: "Dr. Madan Ratna Neupane",
      qualification: "MBBS",
      college: "PAHS",
      image: imgMadanNeupane
    },
    {
      id: 14,
      name: "Dr. Bolbam Rajak",
      qualification: "MBBS",
      college: "MBHTC, Urlabari",
      image: imgBolbamRajak
    },
    {
      id: 15,
      name: "Dr. Prakash Pandey",
      qualification: "MBBS",
      college: "TUTH, Institute of Medicine",
      image: imgPrakashPandey
    },
    {
      id: 16,
      name: "Dr. Arati Bartaula",
      qualification: "MBBS",
      college: "Nepal National Hospital",
      image: imgAratiBartaula
    },
    {
      id: 17,
      name: "Dr. Kisan Adhikari",
      qualification: "MBBS",
      college: "Aama Hospital",
      image: imgKisanAdhikari
    },
    {
      id: 18,
      name: "Dr. Amrita Shrestha",
      qualification: "MBBS",
      college: "Silverline Hospital",
      image: imgAmritaShrestha
    },
    {
      id: 19,
      name: "Dr. Shiva Prasad Kafle",
      qualification: "MBBS",
      college: "Shree Birendra Hospital, Kathmandu",
      image: imgShivaKafle
    },
    {
      id: 20,
      name: "Dr. Sajal K.C.",
      qualification: "MBBS",
      college: "",
      image: imgSajalKC
    },
    {
      id: 21,
      name: "Dr. Ajay Karn",
      qualification: "MBBS",
      college: "Bajrabarahi Chapagaun Hospital",
      image: imgAjayKarn
    },
    {
      id: 22,
      name: "Dr. Anuj Shrestha",
      qualification: "MD / Postgraduate",
      college: "Nepal Police Hospital",
      image: imgAnujShrestha
    },
    {
      id: 23,
      name: "Dr. Shiva Sharma Aryal",
      qualification: "MD Resident",
      college: "Jersey City Medical Center",
      image: imgShivaAryal
    },
    {
      id: 24,
      name: "Dr. Sujan Khatri",
      qualification: "MBBS",
      college: "Nepalese Army Institute of Health Sciences",
      image: imgSujanKhatri
    },
    {
      id: 25,
      name: "Dr. Dhiraj Chaurasia",
      qualification: "MBBS",
      college: "Himal Hospital",
      image: imgDhirajChaurasia
    },
    {
      id: 26,
      name: "Dr. Asha Shahi",
      qualification: "MBBS",
      college: "Om Hospital and Research Center",
      image: imgAshaShahi
    },
    {
      id: 27,
      name: "Dr. Aarya Adhikari",
      qualification: "MBBS",
      college: "PAHS",
      image: imgAaryaAdhikari
    },
    {
      id: 28,
      name: "Dr. Nirakar Shrestha",
      qualification: "MBBS",
      college: "Council of Community Health",
      image: imgNirakarShrestha
    },
    {
      id: 29,
      name: "Dr. Pratima Thapa",
      qualification: "MBBS",
      college: "Gandaki Medical College",
      image: imgPratimaThapa
    },
    {
      id: 30,
      name: "Dr. Partha Baral",
      qualification: "MBBS",
      college: "Kathmandu Medical College",
      image: imgParthaBaral
    },
    {
      id: 31,
      name: "Dr. Rupesh Sah",
      qualification: "MBBS",
      college: "Evergreen Lifecare Hospital",
      image: imgRupeshSah
    },
    {
      id: 32,
      name: "Dr. Bishwaraj Adhikari",
      qualification: "MBBS",
      college: "Dhulikhel Hospital",
      image: imgBishwarajAdhikari
    },
    {
      id: 33,
      name: "Dr. Ajay Sah",
      qualification: "MBBS",
      college: "Nepalese Army Institute of Health Sciences",
      image: imgAjaySah
    },
    {
      id: 34,
      name: "Dr. Shamrant Baniya",
      qualification: "MBBS",
      college: "Mediciti Hospital",
      image: imgShamrantBaniya
    },
    {
      id: 35,
      name: "Dr. Samridhi Shrestha",
      qualification: "MBBS",
      college: "Dhulikhel Hospital",
      image: imgSamridhiShrestha
    },
    {
      id: 36,
      name: "Dr. Sumin Thapa",
      qualification: "MBBS",
      college: "Peoples General Hospital",
      image: imgSuminThapa
    },
    {
      id: 37,
      name: "Dr. Manoj Shahi",
      qualification: "MBBS",
      college: "Karnali Care International Hospital",
      image: imgManojShahi
    },
    {
      id: 38,
      name: "Dr. Aakash Neupane",
      qualification: "MBBS",
      college: "B.P. Koirala Institute of Health Sciences",
      image: imgAakashNeupane
    },
    {
      id: 39,
      name: "Dr. Maya Upadhyaya",
      qualification: "MBBS",
      college: "",
      image: imgMayaUpadhyaya
    },
    {
      id: 40,
      name: "Dr. Aditi Pajiyar",
      qualification: "MBBS",
      college: "Nepalese Army Institute of Health Sciences",
      image: imgAditiPajiyar
    },
    {
      id: 41,
      name: "Dr. Alisha",
      qualification: "MBBS",
      college: "National Medical College",
      image: imgAlisha
    },
    {
      id: 42,
      name: "Dr. Pradeep Khatiwada",
      qualification: "MBBS",
      college: "Kanti Children's Hospital",
      image: imgPradeepKhatiwada
    },
    {
      id: 43,
      name: "Dr. Sweta Singh",
      qualification: "MBBS",
      college: "",
      image: imgSwetaSingh
    },
    {
      id: 44,
      name: "Dr. Gautam Mandal",
      qualification: "MBBS",
      college: "B.P. Koirala Institute of Health Sciences",
      image: imgGautamMandal
    },
    {
      id: 45,
      name: "Dr. Saugat Pokhrel",
      qualification: "MBBS",
      college: "Salyan District Hospital",
      image: imgSaugatPokhrel
    },
    {
      id: 46,
      name: "Dr. Vijaya Duwadi",
      qualification: "MBBS",
      college: "Bakulahar Ratnanagar Hospital",
      image: imgVijayaDuwadi
    },
    {
      id: 47,
      name: "Dr. Som Raj Awasthi",
      qualification: "MBBS",
      college: "HAMS Hospital",
      image: imgSomRajAwasthi
    },
    {
      id: 48,
      name: "Dr. Sujan Tamang",
      qualification: "MBBS",
      college: "",
      image: imgSujanTamang
    },
    {
      id: 49,
      name: "Dr. Kritika Bhattarai",
      qualification: "MBBS",
      college: "",
      image: imgKritikaBhattarai
    },
    {
      id: 50,
      name: "Dr. Bibha Osti",
      qualification: "MBBS",
      college: "",
      image: imgBibhaOsti
    },
    {
      id: 51,
      name: "Dr. Deekshya Devkota",
      qualification: "MBBS",
      college: "",
      image: imgDeekshyaDevkota
    },
    {
      id: 52,
      name: "Dr. Suveksha",
      qualification: "MBBS",
      college: "",
      image: imgSuveksha
    },
    {
      id: 53,
      name: "Dr. Sudha Thapa",
      qualification: "MBBS",
      college: "",
      image: imgSudhaThapa
    }
  ];

  const DoctorCard = ({ doctor }) => {
    return (
      <div className="doctor-card fade-in">
        <div className="doctor-image-container">
          <img src={doctor.image} alt={doctor.name} />
        </div>
        <div className="doctor-info">
          <h3>{doctor.name}</h3>
          <p className="qualification">{doctor.qualification}</p>
          {doctor.college && <p className="college">{doctor.college}</p>}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      
      <main>
        {/* Page Header */}
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">Our Doctors</h1>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="doctors-section">
          <div className="container">
            <div className="doctors-grid">
              {doctorsData.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy">Privacy Policy</Link></span>
      </footer>
    </>
  );
};

export default OurDoctorsPage;
