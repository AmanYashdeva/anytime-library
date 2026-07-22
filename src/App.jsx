import React, { useState, useEffect } from "react";

import { db } from "./firebase";
import { collection, addDoc, doc, setDoc, getDocs, updateDoc } from "firebase/firestore";


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Buttons from "./components/Buttons";
import StudentRegistration from "./components/StudentRegistration";
import StudentLogin from "./components/StudentLogin";
import StudentDashboard from "./components/StudentDashboard";
import Plans from "./components/Plans";


// --- Icons (SVG) ---
const PhoneIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const MailIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>;
const CalendarIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>;
const UserIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SearchIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>;
const ChevronRightIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"></path></svg>;
const ChevronLeftIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"></path></svg>;
const MenuIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>;
const BellIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>;
const LogOutIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>;
const InfoIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>;

// --- Helper Components for Forms ---
const FormInput = ({ icon, label, type = "text", value, onChange, onFocus, placeholder }) => (
  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white shadow-sm">
    <div className="px-3 py-3 text-gray-400 border-r border-gray-100 bg-gray-50 flex-shrink-0">
      {icon}
    </div>
    <div className="flex flex-col flex-1 px-3 py-1.5">
      <label className="text-[10px] text-gray-500 font-semibold">{label}</label>
      <input type={type} value={value} onChange={onChange} onFocus={onFocus} placeholder={placeholder} className="w-full text-sm font-medium text-gray-800 outline-none bg-transparent mt-0.5" />
    </div>
  </div>
);

const FormSelect = ({ label, value, onChange, onFocus, options }) => (
  <div className="flex flex-col border border-gray-200 rounded-xl px-4 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white shadow-sm relative">
    <label className="text-[10px] text-gray-500 font-semibold">{label}</label>
    <select value={value} onChange={onChange} onFocus={onFocus} className="w-full text-sm font-medium text-gray-800 outline-none bg-transparent mt-0.5 appearance-none cursor-pointer">
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
    </div>
  </div>
);

export default function App() {
  // ============================================================================
  // 📍 1. INITIAL DATA (Yaha se aapki 100 seats ka default dummy data ban raha hai)
  // ============================================================================
  const initialSeats = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    status: i % 4 === 0 ? 'Full Day' : i % 4 === 1 ? 'Half Day' : i % 4 === 2 ? '24 Hours' : 'Available',
    morningPayment: i % 2 === 0 ? 'Submitted' : 'Pending',
    afternoonPayment: i % 3 === 0 ? 'Pending' : 'Submitted',
    nightPayment: i % 4 === 0 ? 'Pending' : 'Submitted',
    morningFrom: '2026-05-11', morningTo: '2026-06-11',
    afternoonFrom: '2026-05-12', afternoonTo: '2026-06-12',
    nightFrom: '2026-05-13', nightTo: '2026-06-13',
    fromDate: '2026-05-11', toDate: '2026-06-11', // Added default general dates
    phone: '+91', email: '@gmail.com', // Added mock details based on image
    morningStudent: i % 4 === 1 ? `Morning ${i + 1}` : i % 4 === 0 ? `Day ${i + 1}` : '',
    afternoonStudent: i % 4 === 1 ? `Afternoon ${i + 1}` : '',
    nightStudent: i % 4 === 0 || i % 4 === 2 ? (i === 2 ? 'Name' : `Night ${i + 1}`) : '',
    timing: i % 4 === 0 ? '8 AM - 2 PM' : i % 4 === 1 ? '2 PM - 8 PM' : i % 4 === 2 ? '24 Hours' : 'Available'
  }));

  // ============================================================================
  // 📍 2. APP STATE (Ye saare variables app ka current status/data store karte hain)
  // ============================================================================
  const [seats, setSeats] = useState(initialSeats);
  const [loading, setLoading] = useState(true);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [activeAdminSection, setActiveAdminSection] = useState("seats");
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  const [studentUser, setStudentUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");
const [selectedTiming, setSelectedTiming] = useState("");
const [lockerOption, setLockerOption] = useState("");
const [totalAmount, setTotalAmount] = useState(0);


  const uploadSeatsToFirebase = async () => {
    try {
      for (const seat of initialSeats) {
        await setDoc(doc(db, "seats", String(seat.id)), seat);
      }

      alert("All seats uploaded to Firebase successfully!");
    } catch (error) {
      console.error("Seat upload error:", error);
      alert("Seats upload failed");
    }
  };

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bookings"));

        const firebaseSeats = [];

        querySnapshot.forEach((doc) => {
          firebaseSeats.push({
            ...doc.data(),
            firebaseDocId: doc.id,
          });
        });

        if (firebaseSeats.length > 0) {
          setSeats((prevSeats) =>
            prevSeats.map((seat) => {
              const savedSeat = firebaseSeats.find(
                (item) => item.id === seat.id
              );

              return savedSeat
                ? { ...seat, ...savedSeat }
                : seat;
            })
          );
        }

      } catch (error) {
        console.log("Firebase Fetch Error:", error);
        setLoading(false);
      }
    };

    fetchSeats();
  }, []);

  // Quick view map popup ke liye state

  // ============================================================================
  // 📍 3. PAGINATION & SEARCH (Admin sidebar mein search aur page change ka logic)
  // ============================================================================
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const seatsPerPage = 34;

  const filteredSeats = seats.filter(seat =>
    searchQuery === '' ||
    seat.id.toString().includes(searchQuery) ||
    seat.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastSeat = currentPage * seatsPerPage;
  const indexOfFirstSeat = indexOfLastSeat - seatsPerPage;
  const currentSeats = filteredSeats.slice(indexOfFirstSeat, indexOfLastSeat);
  const totalPages = Math.ceil(filteredSeats.length / seatsPerPage);

  // ============================================================================
  // 📍 4. AUTO TIME UPDATER (Public view mein time ke hisaab se shift auto-change)
  // ============================================================================
  useEffect(() => {
    const updateSeatTimingAutomatically = () => {
      const hour = new Date().getHours();
      setSeats((prevSeats) =>
        prevSeats.map((seat) => {
          if (seat.status === 'Available') return seat;
          let newTiming = '';
          if (hour >= 8 && hour < 14) newTiming = '8 AM - 2 PM';
          else if (hour >= 14 && hour < 20) newTiming = '2 PM - 8 PM';
          else newTiming = '8 PM - 8 AM';

          return { ...seat, timing: seat.status === '24 Hours' ? '24 Hours' : newTiming };
        })
      );
    };
    updateSeatTimingAutomatically();
    const interval = setInterval(updateSeatTimingAutomatically, 60000);
    return () => clearInterval(interval);
  }, []);

  // ============================================================================
  // 📍 5. ADMIN LOGIN CREDENTIALS (Yaha se aap Apna Admin Username/Password badal sakte hain)
  // ============================================================================
  const adminUser = 'Anant Singh';
  const adminPass = 'Kamlesh@123';

  const handleLogin = () => {
    if (username === adminUser && password === adminPass) {
      setAdminLoggedIn(true);
      setSelectedSeat(seats[0]); // Auto select first seat on login
    } else {
      alert('Wrong Username or Password');
    }
  };

  // ============================================================================
  // 📍 6. UPDATE SEAT LOGIC (Admin form mein details badalne aur save karne ka code)
  // ============================================================================
  const updateSeat = (field, value) => {
    if (!selectedSeat) return;

    if (field === 'status') {
      const is24Hr = value === '24 Hours';
      const isFullDay = value === 'Full Day';

      const newStatusUpdates = {
        status: value,
        timing: is24Hr ? '24 Hours' : (isFullDay ? '8 AM - 8 PM' : selectedSeat.timing),
        morningStudent: is24Hr ? '' : (selectedSeat.morningStudent || ''),
        afternoonStudent: is24Hr ? '' : (selectedSeat.afternoonStudent || ''),
        nightStudent: selectedSeat.nightStudent || '',
        morningPayment: is24Hr ? 'Disabled' : (selectedSeat.morningPayment || 'Pending'),
        afternoonPayment: is24Hr ? 'Disabled' : (selectedSeat.afternoonPayment || 'Pending'),
        nightPayment: is24Hr ? 'Disabled' : (selectedSeat.nightPayment || 'Pending')
      };

      setSeats((prev) => prev.map((seat) => seat.id === selectedSeat.id ? { ...seat, ...newStatusUpdates } : seat));
      setSelectedSeat((prev) => ({ ...prev, ...newStatusUpdates }));
      return;
    };
    // yahan updateSeat ke baad

    const toggleSeatVisibility = async (seatId) => {
      const seat = seats.find((s) => s.id === seatId);

      if (!seat) return;

      const newVisibility = seat.isVisible === false;

      try {
        const seatRef = doc(db, "bookings", seat.firebaseDocId);

        await updateDoc(seatRef, {
          isVisible: newVisibility,
        });

        setSeats((prevSeats) =>
          prevSeats.map((s) =>
            s.id === seatId
              ? { ...s, isVisible: newVisibility }
              : s
          )
        );

      } catch (error) {
        console.error("Seat visibility update failed:", error);
      }
    };

    setSeats((prev) => prev.map((seat) => seat.id === selectedSeat.id ? { ...seat, [field]: value } : seat));
    setSelectedSeat((prev) => ({ ...prev, [field]: value }));
    setTimeout(() => saveSeatToFirebase(), 100);
  };

  const toggleSeatVisibility = async (seatId) => {
    const seat = seats.find((s) => s.id === seatId);

    if (!seat) return;

    const newVisibility = seat.isVisible === false;

    try {
      const seatRef = doc(db, "bookings", seat.firebaseDocId);

      await updateDoc(seatRef, {
        isVisible: newVisibility,
      });

      setSeats((prevSeats) =>
        prevSeats.map((s) =>
          s.id === seatId
            ? { ...s, isVisible: newVisibility }
            : s
        )
      );

    } catch (error) {
      console.error("Seat visibility update failed:", error);
    }
  };

  const saveSeatToFirebase = async () => {
    try {
      await setDoc(
        doc(db, "bookings", `seat-${selectedSeat.id}`),
        selectedSeat
      );

      console.log("Saved");
    } catch (error) {
      console.log(error);
      alert("Error saving data");
    }
  };

  // fees dues indicator ke liye color logic

  const getDueStatus = (toDate) => {
    if (!toDate) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = new Date(toDate);
    end.setHours(0, 0, 0, 0);

    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    if (diff > 0) return "✅";
    if (diff === 0) return "🟠 Due Today";

    return `🔴 Overdue by ${Math.abs(diff)} day${Math.abs(diff) > 1 ? "s" : ""}`;
  };

  const getSeatColor = (status) => {
    switch (status) {
      case 'Full Day': return 'bg-red-500';
      case 'Half Day': return 'bg-yellow-400 text-black';
      case '24 Hours': return 'bg-blue-500';
      default: return 'bg-green-500';
    }
  };

  const getOverallSeatStatus = (seat) => {

    if (!seat) return null;

    // 24 Hours
    if (seat.status === "24 Hours") {
      return seat.nightPayment === "Submitted" ? (
        <span className="text-green-500 text-xl">✅</span>
      ) : (
        <span className="text-red-500 text-xl">❌</span>
      );
    }

    // Full Day
    if (seat.status === "Full Day") {
      const fullDayOk =
        seat.morningPayment === "Submitted" &&
        seat.nightPayment === "Submitted";

      return fullDayOk ? (
        <span className="text-green-500 text-xl">✅</span>
      ) : (
        <span className="text-red-500 text-xl">❌</span>
      );
    }

    // Half Day
    if (seat.status === "Half Day") {
      const shifts = [
        seat.morningPayment,
        seat.afternoonPayment,
        seat.nightPayment,
      ].filter((s) => s !== "Available");

      if (shifts.length === 0) {
        return <span className="text-gray-400 text-xl">➖</span>;
      }

      return shifts.every((s) => s === "Submitted") ? (
        <span className="text-green-500 text-xl">✅</span>
      ) : (
        <span className="text-red-500 text-xl">❌</span>
      );
    }

    return <span className="text-gray-400 text-xl">➖</span>;
  };

  // ============================================================================
  // 🛠️ 7. ADMIN PANEL UI (Login hone ke baad ka view yaha se shuru hota hai)
  // ============================================================================

  if (adminLoggedIn) {
    return (
      <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden text-gray-800">



        {/* ---> ADMIN: LEFT SIDEBAR (Seats ki list aur search box) <--- */}
        <div
          className={`${isSidebarOpen ? "w-[320px]" : "w-0"
            } bg-[#0f172a] text-white flex flex-col border-r border-gray-800 flex-shrink-0 overflow-hidden transition-all duration-300`}>
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-yellow-400 font-black text-xl leading-tight tracking-wide">ANY TIME LIBRARY</h2>
            <p className="text-[10px] text-gray-400 tracking-[0.2em] font-bold mt-1 uppercase">Management System</p>
          </div>
          <div className="p-4 border-b border-gray-800 space-y-2">
            <button
              onClick={() => setActiveAdminSection("seats")}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${activeAdminSection === "seats"
                ? "bg-yellow-400 text-black font-bold"
                : "text-gray-300 hover:bg-[#1e293b]"
                }`}
            >
              💺 Seat Management
            </button>
            <button
              onClick={() => setActiveAdminSection("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${activeAdminSection === "dashboard"
                ? "bg-yellow-400 text-black font-bold"
                : "text-gray-300 hover:bg-[#1e293b]"
                }`}
            >
              📊 Dashboard
            </button>



          </div>
          <div className="p-5 pb-2">
            <h3 className="text-sm font-bold mb-4">All Seats ({filteredSeats.length})</h3>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search seat number..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#1e293b] text-sm text-white rounded-lg pl-9 pr-3 py-2.5 outline-none border border-gray-700 focus:border-blue-500 transition-colors placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {currentSeats.map((seat) => (
              <div
                key={seat.id}
                onClick={() => setSelectedSeat(seat)}
                className={`p-3.5 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${selectedSeat?.id === seat.id ? 'bg-[#1e293b] border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-transparent border-transparent hover:bg-[#1e293b]/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${seat.status === 'Available' ? 'bg-green-500' :
                    seat.status === 'Full Day' ? 'bg-red-500' :
                      seat.status === 'Half Day' ? 'bg-yellow-400' : 'bg-blue-500'
                    }`}></div>
                  <div>
                    <p className="text-sm font-bold text-white">Seat {seat.id}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{seat.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${seat.status === 'Available' ? 'text-green-400 bg-green-400/10 border border-green-400/20' :
                    'text-blue-400 bg-blue-400/10 border border-blue-400/20'
                    }`}>
                    {seat.status === 'Available' ? 'AVAILABLE' : 'BOOKED'}
                  </span>
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-800 flex flex-col items-center gap-3 bg-[#0b1120]">
            <div className="flex gap-1.5">
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="w-8 h-8 rounded bg-[#1e293b] flex items-center justify-center hover:bg-gray-700 transition"><ChevronLeftIcon className="w-4 h-4" /></button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum = currentPage;
                if (currentPage === totalPages && totalPages > 2) pageNum = totalPages - 2 + i;
                else if (currentPage > 1) pageNum = currentPage - 1 + i;
                else pageNum = i + 1;

                if (pageNum > totalPages) return null;
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded text-sm font-semibold transition ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-[#1e293b] hover:bg-gray-700'}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="w-8 h-8 rounded bg-[#1e293b] flex items-center justify-center hover:bg-gray-700 transition"><ChevronRightIcon className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-gray-500">Showing {indexOfFirstSeat + 1} to {Math.min(indexOfLastSeat, filteredSeats.length)} of {filteredSeats.length} seats</p>
          </div>
        </div>

        {/* ---> ADMIN: MAIN CONTENT AREA (Edit Form + Live Preview) <--- */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">

          {/* ---> ADMIN: TOP NAVBAR (Logout button wagera) <--- */}
          <div className="h-16 bg-white border-b px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <MenuIcon className="w-5 h-5 text-gray-500 hover:text-black transition" />
            </button>
            <div className="flex items-center gap-6">
              <div className="relative cursor-pointer hover:text-blue-600 transition">
                <BellIcon className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] text-white flex items-center justify-center font-bold">3</span>
              </div>
              <button onClick={() => setAdminLoggedIn(false)} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-100 transition shadow-sm border border-red-100">
                <LogOutIcon className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>

          {/* ---> ADMIN: EDIT & PREVIEW CONTAINER <--- */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">

            {activeAdminSection === "dashboard" ? (
              <Dashboard
                seats={seats}
                onToggleSeatVisibility={toggleSeatVisibility}
              />
            ) : selectedSeat ? (

              <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

                {/* ---> ADMIN: EDIT FORM (Left Side form jaha details bharte hain) <--- */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Editing Seat {selectedSeat.id}</h3>

                  <div className="space-y-5">

                    <FormSelect
                      label="Seat Type / Status"
                      value={selectedSeat.status}
                      onChange={(e) => updateSeat('status', e.target.value)}
                      options={['Available', 'Half Day', 'Full Day', '24 Hours']}
                    />

                    {/* Dynamic Student Fields based on Status */}
                    {selectedSeat.status === "24 Hours" ? (
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">

                        <h4 className="font-bold text-lg">24 Hours Student</h4>

                        <FormInput
                          icon={<UserIcon className="w-4 h-4" />}
                          label="Student Name"
                          value={selectedSeat.nightStudent || ""}
                          onChange={(e) => updateSeat("nightStudent", e.target.value)}
                        />

                        <FormInput
                          icon={<PhoneIcon className="w-4 h-4" />}
                          label="Mobile Number"
                          value={selectedSeat.nightPhone || ""}
                          onChange={(e) => updateSeat("nightPhone", e.target.value)}
                        />

                        <FormInput
                          icon={<MailIcon className="w-4 h-4" />}
                          label="Email"
                          type="email"
                          value={selectedSeat.nightEmail || ""}
                          onChange={(e) => updateSeat("nightEmail", e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormInput
                            icon={<CalendarIcon className="w-4 h-4" />}
                            label="From Date"
                            type="date"
                            value={selectedSeat.nightFrom || ""}
                            onChange={(e) => updateSeat("nightFrom", e.target.value)}
                          />

                          <FormInput
                            icon={<CalendarIcon className="w-4 h-4" />}
                            label="To Date"
                            type="date"
                            value={selectedSeat.nightTo || ""}
                            onChange={(e) => updateSeat("nightTo", e.target.value)}
                          />
                        </div>

                        <FormSelect
                          label="Fees Status"
                          value={selectedSeat.nightPayment || "Available"}
                          onChange={(e) => updateSeat("nightPayment", e.target.value)}
                          options={["Available", "Submitted", "Pending"]}
                        />

                        {selectedSeat.nightTo && (
                          <div className="text-sm font-semibold text-red-600">
                            {getDueStatus(selectedSeat.nightTo)}
                          </div>
                        )}
                      </div>
                    ) : selectedSeat.status !== "Available" ? (
                      <div className="p-4 border rounded-xl bg-gray-50 space-y-5">

                        <h4 className="text-lg font-bold">
                          Student Details
                        </h4>

                        {/* ================= HALF DAY ================= */}

                        {selectedSeat.status === "Half Day" && (
                          <>

                            {/* Morning Shift */}
                            <div className="flex justify-between items-center">
                              <h5 className="font-bold text-green-600">
                                🌅 Morning Shift
                              </h5>

                              {selectedSeat.morningPayment !== "Available" && (
                                <span className="text-sm font-semibold text-red-500">
                                  {getDueStatus(selectedSeat.morningTo)}
                                </span>
                              )}
                            </div>

                            <FormSelect
                              label="Fees Status"
                              value={selectedSeat.morningPayment || "Available"}
                              onChange={(e) => updateSeat("morningPayment", e.target.value)}
                              options={["Available", "Submitted", "Pending"]}
                            />

                            {selectedSeat.morningPayment !== "Available" && (

                              <div className="grid md:grid-cols-2 gap-4">

                                <FormInput
                                  icon={<UserIcon className="w-4 h-4" />}
                                  label="Student Name"
                                  value={selectedSeat.morningStudent || ""}
                                  onChange={(e) => updateSeat("morningStudent", e.target.value)}
                                />

                                <FormInput
                                  icon={<PhoneIcon className="w-4 h-4" />}
                                  label="Mobile Number"
                                  value={selectedSeat.morningPhone || ""}
                                  onChange={(e) => updateSeat("morningPhone", e.target.value)}
                                />



                                <FormInput
                                  icon={<CalendarIcon className="w-4 h-4" />}
                                  label="From Date"
                                  type="date"
                                  value={selectedSeat.morningFrom || ""}
                                  onChange={(e) => updateSeat("morningFrom", e.target.value)}
                                />

                                <FormInput
                                  icon={<CalendarIcon className="w-4 h-4" />}
                                  label="To Date"
                                  type="date"
                                  value={selectedSeat.morningTo || ""}
                                  onChange={(e) => updateSeat("morningTo", e.target.value)}
                                />

                                <FormInput
                                  icon={<MailIcon className="w-4 h-4" />}
                                  label="Email"
                                  value={selectedSeat.morningEmail || ""}
                                  onChange={(e) => updateSeat("morningEmail", e.target.value)}
                                />

                              </div>

                            )}
                            {/* Afternoon Shift */}

                            <div className="bg-white border rounded-xl p-4 space-y-3">

                              <div className="flex justify-between items-center">
                                <h5 className="font-bold text-orange-600">
                                  ☀️ Afternoon Shift
                                </h5>

                                {selectedSeat.afternoonPayment !== "Available" && (
                                  <span className="text-sm font-semibold text-red-500">
                                    {getDueStatus(selectedSeat.afternoonTo)}
                                  </span>
                                )}
                              </div>

                              <FormSelect
                                label="Fees Status"
                                value={selectedSeat.afternoonPayment || "Available"}
                                onChange={(e) => updateSeat("afternoonPayment", e.target.value)}
                                options={["Available", "Submitted", "Pending"]}
                              />

                              {selectedSeat.afternoonPayment !== "Available" && (

                                <div className="grid md:grid-cols-2 gap-4">

                                  <FormInput
                                    icon={<UserIcon className="w-4 h-4" />}
                                    label="Student Name"
                                    value={selectedSeat.afternoonStudent || ""}
                                    onChange={(e) => updateSeat("afternoonStudent", e.target.value)}
                                  />

                                  <FormInput
                                    icon={<PhoneIcon className="w-4 h-4" />}
                                    label="Mobile Number"
                                    value={selectedSeat.afternoonPhone || ""}
                                    onChange={(e) => updateSeat("afternoonPhone", e.target.value)}
                                  />



                                  <FormInput
                                    icon={<CalendarIcon className="w-4 h-4" />}
                                    label="From Date"
                                    type="date"
                                    value={selectedSeat.afternoonFrom || ""}
                                    onChange={(e) => updateSeat("afternoonFrom", e.target.value)}
                                  />

                                  <FormInput
                                    icon={<CalendarIcon className="w-4 h-4" />}
                                    label="To Date"
                                    type="date"
                                    value={selectedSeat.afternoonTo || ""}
                                    onChange={(e) => updateSeat("afternoonTo", e.target.value)}
                                  />

                                  <FormInput
                                    icon={<MailIcon className="w-4 h-4" />}
                                    label="Email"
                                    value={selectedSeat.afternoonEmail || ""}
                                    onChange={(e) => updateSeat("afternoonEmail", e.target.value)}
                                  />

                                </div>

                              )}

                            </div>
                            {/* Night Shift */}

                            <div className="bg-white border rounded-xl p-4 space-y-3">

                              <div className="flex justify-between items-center">
                                <h5 className="font-bold text-blue-600">
                                  🌙 Night Shift
                                </h5>

                                {selectedSeat.nightPayment !== "Available" && (
                                  <span className="text-sm font-semibold text-red-500">
                                    {getDueStatus(selectedSeat.nightTo)}
                                  </span>
                                )}
                              </div>

                              <FormSelect
                                label="Fees Status"
                                value={selectedSeat.nightPayment || "Available"}
                                onChange={(e) => updateSeat("nightPayment", e.target.value)}
                                options={["Available", "Submitted", "Pending"]}
                              />

                              {selectedSeat.nightPayment !== "Available" && (

                                <div className="grid md:grid-cols-2 gap-4">

                                  <FormInput
                                    icon={<UserIcon className="w-4 h-4" />}
                                    label="Student Name"
                                    value={selectedSeat.nightStudent || ""}
                                    onChange={(e) => updateSeat("nightStudent", e.target.value)}
                                  />

                                  <FormInput
                                    icon={<PhoneIcon className="w-4 h-4" />}
                                    label="Mobile Number"
                                    value={selectedSeat.nightPhone || ""}
                                    onChange={(e) => updateSeat("nightPhone", e.target.value)}
                                  />


                                  <FormInput
                                    icon={<CalendarIcon className="w-4 h-4" />}
                                    label="From Date"
                                    type="date"
                                    value={selectedSeat.nightFrom || ""}
                                    onChange={(e) => updateSeat("nightFrom", e.target.value)}
                                  />

                                  <FormInput
                                    icon={<CalendarIcon className="w-4 h-4" />}
                                    label="To Date"
                                    type="date"
                                    value={selectedSeat.nightTo || ""}
                                    onChange={(e) => updateSeat("nightTo", e.target.value)}
                                  />

                                  <FormInput
                                    icon={<MailIcon className="w-4 h-4" />}
                                    label="Email"
                                    value={selectedSeat.nightEmail || ""}
                                    onChange={(e) => updateSeat("nightEmail", e.target.value)}
                                  />


                                </div>

                              )}

                            </div>

                          </>
                        )}
                        {/* ================= FULL DAY ================= */}

                        {selectedSeat.status === "Full Day" && (
                          <>
                            {/* Full Day */}
                            <div className="bg-white border rounded-xl p-4 space-y-3">

                              <div className="flex justify-between items-center">
                                <h5 className="font-bold text-red-600">
                                  ☀️ Full Day (8 AM - 8 PM)
                                </h5>
                                {selectedSeat.fullDayPayment !== "Available" && (
                                  <span className="text-sm font-semibold text-red-500">
                                    {getDueStatus(selectedSeat.fullDayTo)}
                                  </span>
                                )}
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">

                                <FormInput
                                  icon={<UserIcon className="w-4 h-4" />}
                                  label="Student Name"
                                  value={selectedSeat.fullDayStudent || ""}
                                  onChange={(e) => updateSeat("fullDayStudent", e.target.value)}
                                />

                                <FormInput
                                  icon={<PhoneIcon className="w-4 h-4" />}
                                  label="Mobile Number"
                                  value={selectedSeat.fullDayPhone || ""}
                                  onChange={(e) => updateSeat("fullDayPhone", e.target.value)}
                                />

                                <FormInput
                                  icon={<MailIcon className="w-4 h-4" />}
                                  label="Email"
                                  value={selectedSeat.fullDayEmail || ""}
                                  onChange={(e) => updateSeat("fullDayEmail", e.target.value)}
                                />

                                <FormSelect
                                  label="Fees Status"
                                  value={selectedSeat.fullDayPayment || "Available"}
                                  onChange={(e) => updateSeat("fullDayPayment", e.target.value)}
                                  options={["Available", "Submitted", "Pending"]}
                                />

                                <FormInput
                                  icon={<CalendarIcon className="w-4 h-4" />}
                                  label="From Date"
                                  type="date"
                                  value={selectedSeat.fullDayFrom || ""}
                                  onChange={(e) => updateSeat("fullDayFrom", e.target.value)}
                                />

                                <FormInput
                                  icon={<CalendarIcon className="w-4 h-4" />}
                                  label="To Date"
                                  type="date"
                                  value={selectedSeat.fullDayTo || ""}
                                  onChange={(e) => updateSeat("fullDayTo", e.target.value)}
                                />

                              </div>

                            </div>

                            {/* Night Shift */}
                            <div className="bg-white border rounded-xl p-4 space-y-3">

                              <div className="flex justify-between items-center">
                                <h5 className="font-bold text-blue-600">
                                  🌙 Night Shift
                                </h5>

                                {selectedSeat.nightPayment !== "Available" && (
                                  <span className="text-sm font-semibold text-red-500">
                                    {getDueStatus(selectedSeat.nightTo)}
                                  </span>
                                )}
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">

                                <FormInput
                                  icon={<UserIcon className="w-4 h-4" />}
                                  label="Student Name"
                                  value={selectedSeat.nightStudent || ""}
                                  onChange={(e) => updateSeat("nightStudent", e.target.value)}
                                />

                                <FormInput
                                  icon={<PhoneIcon className="w-4 h-4" />}
                                  label="Mobile Number"
                                  value={selectedSeat.nightPhone || ""}
                                  onChange={(e) => updateSeat("nightPhone", e.target.value)}
                                />

                                <FormInput
                                  icon={<MailIcon className="w-4 h-4" />}
                                  label="Email"
                                  value={selectedSeat.nightEmail || ""}
                                  onChange={(e) => updateSeat("nightEmail", e.target.value)}
                                />

                                <FormSelect
                                  label="Fees Status"
                                  value={selectedSeat.nightPayment || "Available"}
                                  onChange={(e) => updateSeat("nightPayment", e.target.value)}
                                  options={["Available", "Submitted", "Pending"]}
                                />

                                <FormInput
                                  icon={<CalendarIcon className="w-4 h-4" />}
                                  label="From Date"
                                  type="date"
                                  value={selectedSeat.nightFrom || ""}
                                  onChange={(e) => updateSeat("nightFrom", e.target.value)}
                                />

                                <FormInput
                                  icon={<CalendarIcon className="w-4 h-4" />}
                                  label="To Date"
                                  type="date"
                                  value={selectedSeat.nightTo || ""}
                                  onChange={(e) => updateSeat("nightTo", e.target.value)}
                                />

                              </div>

                            </div>
                          </>
                        )}

                      </div>
                    ) : null}

                    <button
                      onClick={saveSeatToFirebase}
                      className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-3.5 rounded-xl font-bold shadow-md shadow-green-500/20 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      <CalendarIcon className="w-5 h-5" /> SAVE SEAT DETAILS
                    </button>

                    {/* ---> ADMIN: NOTE / INSTRUCTIONS SECTION <--- */}
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex gap-3 text-sm mt-4 border border-blue-100">
                      <InfoIcon className="w-5 h-5 shrink-0 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-bold mb-1">Note:</p>
                        <p className="opacity-90 leading-relaxed">
                          {selectedSeat.status === '24 Hours'
                            ? 'In 24 Hours booking, only one student will be assigned for the full 24 hours.'
                            : 'Ensure student timings do not overlap. Update fee status accurately upon payment.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ---> ADMIN: LIVE PREVIEW CARD (Right Side black card) <--- */}
                <div className="bg-[#0f172a] rounded-2xl shadow-xl p-6 text-white border border-gray-800 xl:sticky xl:top-6">
                  <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
                    <h3 className="text-xl font-black text-yellow-400">Live Seat Preview</h3>
                    <div className="mt-3 rounded-lg bg-black/20 border border-yellow-500/20 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        Fees Due Status
                      </p>

                      <p className="text-sm font-bold mt-1">
                        {getOverallSeatStatus(selectedSeat)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Seat Number Box */}
                    <div className="bg-[#1e293b] rounded-xl p-4 border border-gray-800">
                      <p className="text-[10px] text-gray-400 tracking-wider uppercase mb-1">Seat Number</p>
                      <h4 className="text-3xl font-black">{selectedSeat.id}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#1e293b] rounded-xl p-4 border border-gray-800">
                        <p className="text-[10px] text-gray-400 tracking-wider uppercase mb-1">Seat Type</p>
                        <p className="font-bold text-sm">{selectedSeat.status}</p>
                        <p className="text-xs mt-1 text-gray-400">{selectedSeat.timing}</p>
                      </div>

                      <div className="bg-[#1e293b] rounded-xl p-4 border border-gray-800">
                        <p className="text-[10px] text-gray-400 tracking-wider uppercase mb-2">Fee Status ({selectedSeat.status})</p>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${selectedSeat.nightPayment === 'Submitted' || selectedSeat.morningPayment === 'Submitted' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <p className="font-bold text-sm">
                            {selectedSeat.status === '24 Hours' ? selectedSeat.nightPayment : 'Mixed/Partial'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Student Record Card (Dark blue theme like image) */}
                    <div className="border border-gray-800 rounded-xl overflow-hidden mt-2">
                      <div className="px-4 py-3 bg-[#0f172a] border-b border-gray-800">
                        <p className="text-[10px] text-gray-400 tracking-wider uppercase">Student Records ({selectedSeat.status})</p>
                      </div>

                      {selectedSeat.status === '24 Hours' && selectedSeat.nightStudent ? (
                        <div className="p-4 bg-[#1e293b]/50">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shrink-0">
                              <UserIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{selectedSeat.nightStudent}</h4>
                              <p className="text-xs text-gray-400 mt-0.5">Fees: <span className={selectedSeat.nightPayment === 'Submitted' ? 'text-green-400' : 'text-red-400'}>{selectedSeat.nightPayment}</span></p>
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-700/50 flex items-center gap-2 text-xs text-gray-300">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            {selectedSeat.fromDate} → {selectedSeat.toDate}
                          </div>
                        </div>
                      ) : selectedSeat.status !== 'Available' ? (
                        <div className="p-4 bg-[#1e293b]/50 space-y-4">
                          {selectedSeat.morningStudent && (
                            <div>
                              <p className="text-sm">🌅 {selectedSeat.morningStudent} <span className="text-xs text-gray-400">({selectedSeat.morningPayment})</span></p>
                              <p className="text-[10px] text-gray-400 mt-1 ml-5 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {selectedSeat.morningFrom} → {selectedSeat.morningTo}</p>
                            </div>
                          )}
                          {selectedSeat.afternoonStudent && (
                            <div>
                              <p className="text-sm">☀️ {selectedSeat.afternoonStudent} <span className="text-xs text-gray-400">({selectedSeat.afternoonPayment})</span></p>
                              <p className="text-[10px] text-gray-400 mt-1 ml-5 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {selectedSeat.afternoonFrom} → {selectedSeat.afternoonTo}</p>
                            </div>
                          )}
                          {selectedSeat.nightStudent && (
                            <div>
                              <p className="text-sm">🌙 {selectedSeat.nightStudent} <span className="text-xs text-gray-400">({selectedSeat.nightPayment})</span></p>
                              <p className="text-[10px] text-gray-400 mt-1 ml-5 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {selectedSeat.nightFrom} → {selectedSeat.nightTo}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-500 text-sm bg-[#1e293b]/50">No students assigned.</div>
                      )}
                    </div>



                    {/* Contact Information */}

                    <div className="pt-2 text-xs text-gray-500">
                      <p>Developer- Aman Yashdeva</p>
                      <p>May 11, 2026</p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4 bg-white rounded-3xl border border-gray-200">
                <SearchIcon className="w-16 h-16 opacity-20" />
                <p className="text-lg font-medium">Kripya sidebar se koi seat select karein.</p>
              </div>
            )}

            {/* ---> ADMIN: FOOTER <--- */}
            <div className="mt-8 text-center text-xs text-gray-500 pb-4">
              © 2026 Any Time Library. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 🌍 8. PUBLIC USER VIEW (Bina login kiye website aisi dikhegi)
  // ============================================================================
  return (
    <>

      {studentUser ? (

        <StudentDashboard
          user={studentUser}
          onLogout={() => setStudentUser(null)}
        />

      ) : (
        <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">



          {/* ---> PUBLIC: MAIN HEADER <--- */}
          <Header />
          
          
          {/* {showRegistration && (
            <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm overflow-y-auto p-4">

              <div className="relative min-h-full flex items-center justify-center">

                <button
                  onClick={() => setShowRegistration(false)}
                  className="fixed top-5 right-5 z-[110] bg-white text-black w-10 h-10 rounded-full font-bold text-xl shadow-lg"
                >
                  ✕
                </button>

                <StudentRegistration
                  onRegistrationComplete={() => {
                    setShowRegistration(false);
                    setShowStudentLogin(true);
                  }}
                />

              </div>

            </div>
          )}
          {showStudentLogin && (
            <StudentLogin
              onClose={() => setShowStudentLogin(false)}
              onLoginSuccess={(user) => {
                setStudentUser(user);
                setShowStudentLogin(false);
              }}
            />
          )} */}
          {/* ---> PUBLIC: ADMIN LOGIN BUTTON (Top Right) <--- */}
          <Buttons
            onSignUp={() => setShowRegistration(true)}
            onSignIn={() => setShowStudentLogin(true)}
            onAdminLoginClick={() =>
              document
                .getElementById("adminLoginPanel")
                ?.classList.remove("hidden")
            }
          />
          {/* Nav bar for all info about library, facilities, timings, contact, etc. (Top Right) */}
          {/* <nav className=" text-grey-100 py-3 px-6 flex justify-between items-center">
            <a href="#" className="text-lg font-bold">Resources</a>
            <a href="#" className="text-lg font-bold">Contact</a>
            <a href="#" className="text-lg font-bold">Plans</a>
            <a href="#" className="text-lg font-bold">Reviews</a>
            <a href="#" className="text-lg font-bold">About Us</a>

          </nav> */}

          {/* ---> PUBLIC: ADMIN LOGIN POPUP MODAL <--- */}
          <div id="adminLoginPanel" className="hidden fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-[90%] max-w-md relative">
              <button
                onClick={() => document.getElementById('adminLoginPanel')?.classList.add('hidden')}
                className="absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-black transition"
              >
                ✕
              </button>
              <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button
                onClick={() => {
                  handleLogin();
                  if (username === adminUser && password === adminPass) {
                    document.getElementById('adminLoginPanel')?.classList.add('hidden');
                  }
                }}
                className="w-full bg-indigo-700 hover:bg-indigo-600 transition text-white py-3 rounded-xl font-bold"
              >
                Login
              </button>
            </div>
          </div>

          {/* ---> PUBLIC: HERO SECTION (Premium Digital Library text) <--- */}
          <section className="max-w-6xl mx-auto px-6 py-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Premium Digital Library</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Smart seat tracking, peaceful study environment, WiFi, CCTV security and modern digital monitoring.
              </p>
              <div className="border-t border-gray-800 mt-10 pt-8">

                <h2 className="text-xl font-bold text-black-300 mb-5 text-center">
                  ⭐ Library Facilities
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">

                  <div>🔒 Personal Locker</div>
                  <div>📶 Free WiFi</div>
                  <div>❄️ Air Conditioned</div>
                  <div>💧 RO Water</div>
                  <div>🎥 CCTV Security</div>
                  <div>🔋 Power Backup</div>
                  <div>🤫 Silent Study Zone</div>
                  <div>🪑 Comfortable Seating</div>

                </div>

              </div>
            </div>
          </section>

          {/* ---> PUBLIC: LIVE SEAT AVAILABILITY SECTION <--- */}

          <section className="max-w-7xl mx-auto px-6 pb-14">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <div>
                <h2 className="text-4xl font-black">LIVE SMART SEAT AVAILABILITY</h2>
                <p className="text-gray-500 mt-2">Total 100 Premium Smart Seats Available</p>
              </div>

              {/* ---> PUBLIC: SEAT BOOKING CTA <--- */}
              <div className="flex justify-center mb-10">

                <button
                  onClick={() => setShowBookingPopup(true)}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 px-8 py-4 text-white shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
                >

                  {/* Shining Animation */}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>

                  <span className="relative flex items-center gap-3">

                    <span className="text-2xl animate-bounce">
                      🚀
                    </span>

                    <span className="text-left">
                      <span className="block text-xs font-bold uppercase tracking-widest text-yellow-300">
                        Hurry Up!
                      </span>

                      <span className="block text-lg font-black">
                        Book Your Seat Now
                      </span>
                    </span>

                    <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>

                  </span>

                </button>

              </div>

              {/* ---> PUBLIC: TOTAL SEATS BUTTON (Click karne pe quick view map khulega) <--- */}
              <div
                onClick={() => setShowQuickView(true)}
                className="bg-gradient-to-r from-yellow-200 to-yellow-500 text-black px-8 py-5 rounded-3xl shadow-2xl border-4 border-black min-w-[180px] text-center cursor-pointer hover:scale-105 transition-all"
              >
                <h3 className=" font-black">Total Seats</h3>
                <div className="mt-2 bg-black text-yellow-500 text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider animate-pulse inline-block shadow-lg">
                  CLICK TO VIEW  SEAT MAP
                </div>
              </div>
            </div>

            {/* ---> PUBLIC: QUICK VIEW 100 SEATS MODAL (POPUP MAP GRID) <--- */}
            {showQuickView && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
                <div className="bg-[#0f172a] p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-2xl relative border border-gray-700 max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setShowQuickView(false)}
                    className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-white transition"
                  >
                    ✕
                  </button>

                  <div className="mb-6">
                    <h4 className="text-2xl font-black text-yellow-400">Live Quick View Map</h4>
                    <p className="text-sm text-gray-400 mt-1">Check availability of all 100 seats at a single glance.</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-300 bg-black/40 p-3 rounded-xl border border-gray-800 mb-6 w-fit">
                    <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-green-500 rounded-sm shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div> Available / Partial</div>
                    <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-red-500 rounded-sm shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div> Fully Booked</div>
                  </div>

                  <div className="grid grid-cols-10 gap-2 sm:gap-3">
                    {seats.map(seat => {
                      const isFullyBooked = seat.status === '24 Hours' || (seat.status !== 'Available' && seat.morningStudent && seat.afternoonStudent && seat.nightStudent);
                      const bgClass = isFullyBooked ? 'bg-red-500 hover:bg-red-400 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4)]' : 'bg-green-500 hover:bg-green-400 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]';

                      return (
                        <div
                          key={`quick-${seat.id}`}
                          className={`aspect-square flex items-center justify-center rounded-md sm:rounded-lg text-xs sm:text-sm font-black text-white cursor-pointer transition-all border border-black/20 ${bgClass}`}
                          title={`Seat ${seat.id} - ${seat.status}`}
                          onClick={() => {
                            setShowQuickView(false); // Map band karke particular seat list me scroll karne ke liye
                          }}
                        >
                          {seat.id}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ---> PUBLIC: DETAILED SEAT MAP (Niche wala bada grid with student details) <--- */}
            <div className="bg-gradient-to-br from-[#0f172a] via-black to-[#111827] p-8 rounded-[40px] border border-yellow-500/20 shadow-[0_20px_80px_rgba(0,0,0,0.7)] relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_gold,_transparent_30%)]"></div>
              <div className="flex items-center justify-between flex-wrap gap-4 mb-8 relative z-10">
                <div>
                  <h3 className="text-3xl font-black text-yellow-400 tracking-[3px]">SMART SEAT MAP</h3>
                  <p className="text-gray-400 mt-2 text-sm">Real-time AI powered seat monitoring dashboard</p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-bold">
                  <div className="bg-green-500/20 border border-green-400 text-green-300 px-4 py-2 rounded-full">AVAILABLE</div>
                  <div className="bg-yellow-500/20 border border-yellow-400 text-yellow-300 px-4 py-2 rounded-full">HALF DAY</div>
                  <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-2 rounded-full">FULL DAY</div>
                  <div className="bg-blue-500/20 border border-blue-400 text-blue-300 px-4 py-2 rounded-full">24 HOURS</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 relative z-10">
                {currentSeats.map((seat) => (
                  <div key={seat.id} className={`${getSeatColor(seat.status)} rounded-[32px] p-6 min-h-[180px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-white border border-white/10 transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer relative overflow-hidden group`}>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-[2px] opacity-70">Seat</p>
                          <h4 className="text-4xl font-black leading-none">{seat.id}</h4>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-lg backdrop-blur-md border border-white/20">
                          {seat.status === 'Available' ? '✓' : '📘'}
                        </div>
                      </div>

                      <div className="mt-5 bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <p className="text-[10px] uppercase tracking-[1px] opacity-70 mb-1">Current Status</p>
                            <p className="font-bold text-lg leading-tight">{seat.status}</p>
                          </div>
                          <p className="text-xs opacity-90 text-right max-w-[50%]">{seat.timing}</p>
                        </div>

                        {seat.status !== 'Available' && (
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 text-[11px]">
                            {seat.status === '24 Hours' ? (
                              <div className="bg-black/30 p-2 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="opacity-80">🔒 24 Hours:</span>
                                  <span className="font-bold text-white truncate ml-2" title={seat.nightStudent || "Booked"}>
                                    {seat.nightStudent || "Booked"}
                                  </span>
                                </div>
                                {seat.nightStudent && (
                                  <div className="mt-1.5 text-[9px] text-gray-400 text-right opacity-80 border-t border-white/5 pt-1">
                                    🗓 {seat.fromDate} To {seat.toDate}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <>
                                <div className="bg-black/30 p-2 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <span className="opacity-80 whitespace-nowrap">🌅 8 AM - 2 PM:</span>
                                    <span className={seat.morningStudent ? "font-bold text-white truncate ml-2" : "text-green-400 font-bold ml-2"}>
                                      {seat.morningStudent || "Available"}
                                    </span>
                                  </div>
                                  {seat.morningStudent && (
                                    <div className="mt-1.5 text-[9px] text-gray-400 text-right opacity-80 border-t border-white/5 pt-1">
                                      🗓 {seat.morningFrom} To {seat.morningTo}
                                    </div>
                                  )}
                                </div>
                                <div className="bg-black/30 p-2 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <span className="opacity-80 whitespace-nowrap">☀️ 2 PM - 8 PM:</span>
                                    <span className={seat.afternoonStudent ? "font-bold text-white truncate ml-2" : "text-green-400 font-bold ml-2"}>
                                      {seat.afternoonStudent || "Available"}
                                    </span>
                                  </div>
                                  {seat.afternoonStudent && (
                                    <div className="mt-1.5 text-[9px] text-gray-400 text-right opacity-80 border-t border-white/5 pt-1">
                                      🗓 {seat.afternoonFrom} To {seat.afternoonTo}
                                    </div>
                                  )}
                                </div>
                                <div className="bg-black/30 p-2 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <span className="opacity-80 whitespace-nowrap">🌙 8 PM - 8 AM:</span>
                                    <span className={seat.nightStudent ? "font-bold text-white truncate ml-2" : "text-green-400 font-bold ml-2"}>
                                      {seat.nightStudent || "Available"}
                                    </span>
                                  </div>
                                  {seat.nightStudent && (
                                    <div className="mt-1.5 text-[9px] text-gray-400 text-right opacity-80 border-t border-white/5 pt-1">
                                      🗓 {seat.nightFrom} To {seat.nightTo}
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>



              {/* ---> PUBLIC: BOTTOM PAGINATION (Page badalne ke buttons) <--- */}
              <div className="sticky bottom-6 z-40 flex flex-wrap justify-center gap-4 mt-10 bg-black/40 backdrop-blur-xl p-4 rounded-[30px] border border-yellow-400/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] max-w-fit mx-auto">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`${currentPage === i + 1 ? 'bg-yellow-400 text-black scale-105' : 'bg-gray-800 text-white'} min-w-[190px] px-7 py-5 rounded-3xl font-black shadow-2xl transition-all duration-300 hover:scale-105 border border-yellow-400/30`}>
                    <p className="text-sm uppercase tracking-[2px] opacity-80 mb-1">Explore Seats</p>
                    <h3 className="text-2xl">{i * seatsPerPage + 1} - {Math.min((i + 1) * seatsPerPage, seats.length)}</h3>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <Plans /> 

{showBookingPopup && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

    <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

      {/* CLOSE BUTTON */}
      <button
        onClick={() => {
          setShowBookingPopup(false);
          setSelectedPlan("");
          setSelectedTiming("");
          setLockerOption("");
          setTotalAmount(0);
        }}
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl font-black text-gray-600 hover:bg-red-100 hover:text-red-600"
      >
        ✕
      </button>

      {/* HEADER */}
      <div className="mb-7 pr-10">
        <p className="text-sm font-black uppercase tracking-widest text-indigo-600">
          Any Time Library
        </p>

        <h2 className="mt-2 text-3xl font-black text-gray-900">
          Book Your Seat 🪑
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Select your plan, seat and timing.
        </p>
      </div>

      {/* STUDENT DETAILS */}
      <div className="grid gap-4 sm:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Your Name
          </label>

          <input
            type="text"
            id="bookingName"
            placeholder="Enter your name"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            WhatsApp Number
          </label>

          <input
            type="tel"
            id="bookingPhone"
            placeholder="Enter WhatsApp number"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

      </div>


      {/* PLAN SELECTION */}
      <div className="mt-6">

        <label className="mb-3 block text-sm font-black text-gray-700">
          Select Your Plan
        </label>

        <div className="grid gap-3 sm:grid-cols-2">

          {/* HALF DAY */}
          <button
            type="button"
            onClick={() => {
              setSelectedPlan("Half Day");
              setSelectedTiming("");
              setLockerOption("");
              setTotalAmount(0);
            }}
            className={`rounded-2xl border p-4 text-left transition ${
              selectedPlan === "Half Day"
                ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500"
                : "border-gray-200 bg-gray-50 hover:border-indigo-400"
            }`}
          >
            <p className="font-black text-gray-900">
              Half Day
            </p>

            <p className="mt-1 text-sm text-gray-500">
              ₹500 Without Locker
            </p>

            <p className="mt-1 text-sm font-bold text-indigo-600">
              ₹600 With Locker
            </p>
          </button>


          {/* FULL DAY */}
          <button
            type="button"
            onClick={() => {
              setSelectedPlan("Full Day");
              setSelectedTiming("");
              setLockerOption("");
              setTotalAmount(0);
            }}
            className={`rounded-2xl border p-4 text-left transition ${
              selectedPlan === "Full Day"
                ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500"
                : "border-gray-200 bg-gray-50 hover:border-indigo-400"
            }`}
          >
            <p className="font-black text-gray-900">
              Full Day
            </p>

            <p className="mt-1 text-sm text-gray-500">
              ₹700 Without Locker
            </p>

            <p className="mt-1 text-sm font-bold text-indigo-600">
              ₹800 With Locker
            </p>
          </button>


          {/* NIGHT */}
          <button
            type="button"
            onClick={() => {
              setSelectedPlan("Night");
              setSelectedTiming("");
              setLockerOption("");
              setTotalAmount(0);
            }}
            className={`rounded-2xl border p-4 text-left transition ${
              selectedPlan === "Night"
                ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500"
                : "border-gray-200 bg-gray-50 hover:border-indigo-400"
            }`}
          >
            <p className="font-black text-gray-900">
              Night
            </p>

            <p className="mt-1 text-sm text-gray-500">
              ₹500 Without Locker
            </p>

            <p className="mt-1 text-sm font-bold text-indigo-600">
              ₹600 With Locker
            </p>
          </button>


          {/* 24 HOURS */}
          <button
            type="button"
            onClick={() => {
              setSelectedPlan("24 Hours");
              setSelectedTiming("24 Hours");
              setLockerOption("Free Locker Included");
              setTotalAmount(1000);
            }}
            className={`rounded-2xl border p-4 text-left transition ${
              selectedPlan === "24 Hours"
                ? "border-green-600 bg-green-50 ring-2 ring-green-500"
                : "border-gray-200 bg-gray-50 hover:border-green-400"
            }`}
          >
            <p className="font-black text-gray-900">
              24 Hours
            </p>

            <p className="mt-1 text-lg font-black text-green-600">
              ₹1000
            </p>

            <p className="mt-1 text-sm font-bold text-green-600">
              🎁 Free Locker Included
            </p>
          </button>

        </div>

      </div>


      {/* LOCKER OPTION */}
      {selectedPlan && selectedPlan !== "24 Hours" && (

        <div className="mt-5">

          <label className="mb-2 block text-sm font-bold text-gray-700">
            Locker Option
          </label>

          <select
            value={lockerOption}
            onChange={(e) => {

              const value = e.target.value;

              setLockerOption(value);

              if (selectedPlan === "Half Day") {
                setTotalAmount(value === "With Locker" ? 600 : 500);
              }

              if (selectedPlan === "Full Day") {
                setTotalAmount(value === "With Locker" ? 800 : 700);
              }

              if (selectedPlan === "Night") {
                setTotalAmount(value === "With Locker" ? 600 : 500);
              }

            }}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-bold outline-none focus:border-indigo-500"
          >

            <option value="">
              Select Locker Option
            </option>

            <option value="Without Locker">
              Without Locker
            </option>

            <option value="With Locker">
              With Locker (+₹100)
            </option>

          </select>

        </div>

      )}


      {/* TIMING */}
      {selectedPlan && selectedPlan !== "24 Hours" && (

        <div className="mt-5">

          <label className="mb-2 block text-sm font-bold text-gray-700">
            Select Timing
          </label>

          <select
            value={selectedTiming}
            onChange={(e) => setSelectedTiming(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-bold outline-none focus:border-indigo-500"
          >

            <option value="">
              Select Timing
            </option>

            {selectedPlan === "Half Day" && (
              <>
                <option value="Morning (8 AM - 2 PM)">
                  Morning — 8 AM - 2 PM
                </option>

                <option value="Afternoon (2 PM - 7 PM)">
                  Afternoon — 2 PM - 7 PM
                </option>
              </>
            )}

            {selectedPlan === "Full Day" && (
              <option value="Full Day (8 AM - 7 PM)">
                Full Day — 8 AM - 7 PM
              </option>
            )}

            {selectedPlan === "Night" && (
              <option value="Night (9 PM - 6 AM)">
                Night — 9 PM - 6 AM
              </option>
            )}

          </select>

        </div>

      )}


      {/* 24 HOURS TIMING DISPLAY */}
      {selectedPlan === "24 Hours" && (

        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">

          <p className="font-bold text-green-800">
            ⏰ Timing: 24 Hours
          </p>

          <p className="mt-1 text-sm text-green-700">
            🎁 Free Locker Included
          </p>

        </div>

      )}


      {/* SEAT NUMBER */}
      <div className="mt-5">

        <label className="mb-2 block text-sm font-bold text-gray-700">
          Seat Number
        </label>

        <input
          type="number"
          min="1"
          max="100"
          id="bookingSeat"
          placeholder="Enter seat number"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-indigo-500"
        />

      </div>


      {/* TOTAL */}
      {totalAmount > 0 && (

        <div className="mt-5 rounded-2xl bg-indigo-50 p-5 text-center">

          <p className="text-sm font-bold text-gray-500">
            Total Payable Amount
          </p>

          <p className="mt-1 text-4xl font-black text-indigo-700">
            ₹{totalAmount}
          </p>

          <p className="mt-2 text-sm font-bold text-gray-600">
            {selectedPlan} • {lockerOption}
          </p>

        </div>

      )}


      {/* PAYMENT */}
      <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

        <h3 className="text-lg font-black text-green-800">
          💳 Payment Details
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">

          <div className="rounded-xl bg-white p-4">

            <p className="text-xs font-bold text-gray-500">
              Payment Number
            </p>

            <p className="mt-1 text-lg font-black text-gray-900">
              9219384600
            </p>

          </div>

          <div className="rounded-xl bg-white p-4">

            <p className="text-xs font-bold text-gray-500">
              UPI ID
            </p>

            <p className="mt-1 break-all font-black text-indigo-700">
              YOUR_UPI_ID_HERE
            </p>

          </div>

        </div>

        <p className="mt-4 text-sm leading-6 text-gray-600">
          Payment karne ke baad WhatsApp par booking details bhejein aur
          payment ka screenshot bhi attach karein.
        </p>

      </div>


      {/* WHATSAPP BUTTON */}
      <button
        onClick={() => {

          const name = document.getElementById("bookingName").value;
          const phone = document.getElementById("bookingPhone").value;
          const seat = document.getElementById("bookingSeat").value;

          if (
            !name ||
            !phone ||
            !seat ||
            !selectedPlan ||
            !selectedTiming ||
            !lockerOption ||
            !totalAmount
          ) {
            alert("Please fill all booking details first.");
            return;
          }

          const message = `
*🔥 ANY TIME LIBRARY - SEAT BOOKING REQUEST 🔥*

👤 *Name:* ${name}
📱 *WhatsApp Number:* ${phone}

💺 *Seat Number:* ${seat}

📋 *Plan:* ${selectedPlan}
⏰ *Timing:* ${selectedTiming}
🔐 *Locker:* ${lockerOption}

💰 *Total Amount:* ₹${totalAmount}

💳 *Payment Number:* 9219384600
🆔 *UPI ID:* YOUR_UPI_ID_HERE

📸 *Payment Screenshot:*
I will attach the payment screenshot here.

Please check and confirm my seat booking.
          `;

          const whatsappUrl =
            `https://wa.me/919219384600?text=${encodeURIComponent(message)}`;

          window.open(whatsappUrl, "_blank");

        }}
        className="mt-6 w-full rounded-2xl bg-green-600 py-4 text-lg font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-700"
      >
        💬 Send Booking Request on WhatsApp
      </button>

      <p className="mt-3 text-center text-xs text-gray-500">
        WhatsApp open hone ke baad payment screenshot attach karke send karein.
      </p>

    </div>

  </div>
)}
          


          {/* ================= FEATURES SECTION ================= */}
          <section id="features" className="relative bg-[#0f172a] px-6 py-24 text-white">

  <div className="mx-auto max-w-6xl">

    {/* HEADER */}
    <div className="mb-14">

      <h2 className="inline-flex items-center gap-3 border-b-4 border-yellow-400 pb-2 text-3xl font-black sm:text-4xl">

        <span className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-yellow-400 text-xl text-yellow-400">
          ◇
        </span>

        Resource Hub & Updates

      </h2>

    </div>


    {/* CARDS */}
    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">


      {/* UPSC CURRENT AFFAIRS */}
      <a
        href="https://visionias.in/current-affairs/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border-l-4 border-blue-500 bg-[#1e293b] p-7 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#263449]"
      >

        <div className="mb-5 text-5xl text-blue-400">
          📰
        </div>

        <h3 className="text-xl font-black">
          UPSC Current Affairs
        </h3>

        <p className="mt-4 text-base text-slate-400">
          Daily news and analysis from Vision IAS.
        </p>

      </a>


      {/* EMPLOYMENT NEWS */}
      <a
        href="https://employmentnews.gov.in/NewEmp/Home.aspx"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border-l-4 border-purple-500 bg-[#1e293b] p-7 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#263449]"
      >

        <div className="mb-5 text-5xl text-purple-400">
          📰
        </div>

        <h3 className="text-xl font-black">
          Employment News
        </h3>

        <p className="mt-4 text-base text-slate-400">
          Official government source for job listings.
        </p>

      </a>


      {/* LATEST JOB UPDATES */}
      <a
        href="https://sarkariresult.com.cm/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border-l-4 border-pink-500 bg-[#1e293b] p-7 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#263449]"
      >

        <div className="mb-5 text-5xl text-pink-400">
          💼
        </div>

        <h3 className="text-xl font-black">
          Latest Job Updates
        </h3>

        <p className="mt-4 text-base text-slate-400">
          Latest government job updates from Sarkari Result.
        </p>

      </a>


      {/* UPSC PDF MATERIALS */}
      <a
        href="https://www.pdfnotes.co/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border-l-4 border-green-500 bg-[#1e293b] p-7 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#263449]"
      >

        <div className="mb-5 text-5xl text-green-400">
          📄
        </div>

        <h3 className="text-xl font-black">
          UPSC PDF Materials
        </h3>

        <p className="mt-4 text-base text-slate-400">
          Downloadable PDFs and study resources.
        </p>

      </a>


      {/* UPSC FORMS & DOWNLOADS */}
      <a
        href="https://www.upsc.gov.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border-l-4 border-yellow-400 bg-[#1e293b] p-7 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#263449]"
      >

        <div className="mb-5 text-5xl text-yellow-400">
          📋
        </div>

        <h3 className="text-xl font-black">
          UPSC Forms & Downloads
        </h3>

        <p className="mt-4 text-base text-slate-400">
          Official forms from the UPSC website.
        </p>

      </a>


      {/* INTERNET ARCHIVE */}
      <a
        href="https://archive.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border-l-4 border-indigo-500 bg-[#1e293b] p-7 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#263449]"
      >

        <div className="mb-5 text-5xl text-indigo-400">
          🗃️
        </div>

        <h3 className="text-xl font-black">
          Internet Archive
        </h3>

        <p className="mt-4 text-base text-slate-400">
          A digital library of free books, movies, and more.
        </p>

      </a>


    </div>

  </div>

</section>

          {/* ---> PUBLIC: FOOTER <--- */}

          <Footer />
          {/* FLOATING WHATSAPP INQUIRY BUTTON */}
{/* FLOATING WHATSAPP INQUIRY BUTTON */}
<a
  href="https://wa.me/919219384600?text=Hello%20Any%20Time%20Library%2C%20I%20want%20to%20make%20an%20inquiry."
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-4 right-4 z-[100] transition duration-300 hover:scale-110 sm:bottom-6 sm:right-6"
  aria-label="WhatsApp Inquiry"
>
  <img
    src="https:/cdn-icons-png.flaticon.com/128/1384/1384055.png"
    alt="✆"
    className="h-10 w-10 object-contain sm:h-14 sm:w-14"
  />
</a>

        </div>
        
      )}

    </>
  );
}