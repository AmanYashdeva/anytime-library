import React, { useState, useEffect } from "react";

import { db } from "./firebase";
import { collection, addDoc, doc, setDoc, getDocs, updateDoc, onSnapshot } from "firebase/firestore";

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
import qr from "./assets/QR.jpeg";
import logo from "./assets/lib-logo-copy.png";
import AccountsFinance from "./components/AccountsFinance";

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
const LogOutIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const InfoIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>;
const CurrencyRupeeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 3h12"></path><path d="M6 8h12"></path><path d="M6 13h12"></path><path d="M6 18h12"></path></svg>;

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

const FormSelect = ({ label, value, onChange, onFocus, options, disabled = false }) => (
  <div className="flex flex-col border border-gray-200 rounded-xl px-4 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white shadow-sm relative">
    <label className="text-[10px] text-gray-500 font-semibold">{label}</label>
    <select
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      disabled={disabled}
      className={`w-full text-sm font-medium text-gray-800 outline-none bg-transparent mt-0.5 appearance-none cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
    </div>
  </div>
);

const lockerSeats = [
  1, 2, 3, 4, 5, 6, 7, 8,
  33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48,
  57, 58, 59, 60, 61, 62, 63, 64
];

const HallSeat = ({ seat, setShowQuickView, vertical = false }) => {
  let isFullyBooked = false;
  let onlyNightAvailable = false;
  let halfDayPartial = false;

  // 24 HOURS
  if (seat.status === '24 Hours') {
    isFullyBooked = !!seat.nightStudent;
  }
  // FULL DAY
  else if (seat.status === 'Full Day') {
    const dayFull = !!seat.fullDayStudent;
    const nightFull = !!seat.nightStudent;
    isFullyBooked = dayFull && nightFull;
    if (dayFull && !nightFull) {
      onlyNightAvailable = true;
    }
  }
  // HALF DAY
  else if (seat.status === 'Half Day') {
    const morningFull = !!seat.morningStudent;
    const afternoonFull = !!seat.afternoonStudent;
    const nightFull = !!seat.nightStudent;

    isFullyBooked = morningFull && afternoonFull && nightFull;

    if (morningFull && afternoonFull && !nightFull) {
      onlyNightAvailable = true;
    }

    if (morningFull !== afternoonFull) {
      halfDayPartial = true;
    }
  }

  // COLORS
  const bgClass = isFullyBooked
    ? 'bg-red-500 border-red-500/50 shadow-[0_0_14px_rgba(239,68,68,0.25)]'
    : halfDayPartial
      ? 'bg-gradient-to-br from-green-500 via-yellow-400 to-red-500 border-yellow-500/50 shadow-[0_0_14px_rgba(250,204,21,0.25)]'
      : onlyNightAvailable
        ? 'bg-gradient-to-br from-green-400 via-red-600 to-[#07130c] border-green-300/40 shadow-[0_0_14px_rgba(34,197,94,0.22)]'
        : 'bg-gradient-to-br from-green-400 via-green-600 to-green-700 border-green-300/40 shadow-[0_0_12px_rgba(34,197,94,0.18)]';

  return (
    <div
      title={`Seat ${seat.id} • ${seat.status}`}
      onClick={() => setShowQuickView && setShowQuickView(false)}
      className={`
        group relative
        flex items-center justify-center
        ${vertical ? 'min-h-[42px]' : 'aspect-[1.35/1]'}
        cursor-pointer
        overflow-hidden
        rounded-md sm:rounded-lg
        border
        ${bgClass}
        text-[10px] font-black text-white
        transition-all duration-200
        hover:-translate-y-0.5
        hover:scale-[1.04]
        hover:brightness-110
        active:scale-95
      `}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent"></span>
      <div className="relative z-10 flex items-center gap-0.5">
        <span className="drop-shadow-md">{seat.id}</span>
        {lockerSeats.includes(seat.id) && (
          <span className="text-[7px] sm:text-[8px]" title="Locker Available">
            🔒
          </span>
        )}
      </div>
      <span
        className={`
          absolute bottom-1 right-1
          h-1 w-1 rounded-full
          ${isFullyBooked ? 'bg-red-200' : 'bg-green-100'}
          opacity-80
        `}
      ></span>
    </div>
  );
};

export default function App() {
  // ============================================================================
  // 📍 1. INITIAL DATA
  // ============================================================================
  const initialSeats = Array.from({ length: 66 }, (_, i) => ({
    id: i + 1,
    status: i % 4 === 0 ? 'Full Day' : i % 4 === 1 ? 'Half Day' : i % 4 === 2 ? '24 Hours' : 'Available',
    morningPayment: i % 2 === 0 ? 'Submitted' : 'Pending',
    afternoonPayment: i % 3 === 0 ? 'Pending' : 'Submitted',
    nightPayment: i % 4 === 0 ? 'Pending' : 'Submitted',
    morningFrom: '0-0-0', morningTo: '0-0-0',
    afternoonFrom: '0-0-0', afternoonTo: '0-0-0',
    nightFrom: '0-0-0', nightTo: '0-0-0',
    fromDate: '0-0-0', toDate: '0-0-0',
    phone: '+91', email: '@gmail.com',
    morningStudent: i % 4 === 1 ? `Morning ${i + 1}` : i % 4 === 0 ? `Day ${i + 1}` : '',
    afternoonStudent: i % 4 === 1 ? `Afternoon ${i + 1}` : '',
    nightStudent: i % 4 === 0 || i % 4 === 2 ? (i === 2 ? 'Name' : `Night ${i + 1}`) : '',
    timing: i % 4 === 0 ? '8 AM - 2 PM' : i % 4 === 1 ? '2 PM - 8 PM' : i % 4 === 2 ? '24 Hours' : 'Available',
    morningAddress: '', afternoonAddress: '', nightAddress: '', fullDayAddress: '', address: ''
  }));

  // ============================================================================
  // 📍 2. APP STATE
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

  // --- SEAT TRANSFER STATES ---
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferShift, setTransferShift] = useState("");
  const [targetSeatId, setTargetSeatId] = useState("");
  const [targetShift, setTargetShift] = useState("");

  // =====================================================
  // 🔄 ACCOUNTS MONTH & YEAR NAVIGATION STATE
  // =====================================================
  const [accountsSelectedMonth, setAccountsSelectedMonth] = useState(new Date().getMonth());
  const [accountsSelectedYear, setAccountsSelectedYear] = useState(new Date().getFullYear());

  const handleNavigateToAccounts = (monthIndex, year) => {
    setAccountsSelectedMonth(monthIndex);
    if (year) setAccountsSelectedYear(year);
    setActiveAdminSection("accounts");
  };

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

  // =====================================================
  // ⚡ LIVE REAL-TIME DATA SYNC
  // =====================================================
  useEffect(() => {
    const bookingsRef = collection(db, "bookings");

    const unsubscribe = onSnapshot(
      bookingsRef,
      (snapshot) => {
        const firestoreData = {};
        snapshot.forEach((docSnap) => {
          firestoreData[docSnap.id] = docSnap.data();
        });

        setSeats((prevSeats) =>
          prevSeats.map((seat) => {
            const savedSeat = firestoreData[`seat-${seat.id}`];
            return savedSeat ? { ...seat, ...savedSeat } : seat;
          })
        );
      },
      (error) => {
        console.error("Real-time sync error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // ============================================================================
  // 📍 3. PAGINATION & SEARCH
  // ============================================================================
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const seatsPerPage = 34;

  const filteredSeats = seats.filter((seat) => {
    if (searchQuery.trim() === "") return true;

    const query = searchQuery.toLowerCase().trim();
    const matchId = seat.id.toString().includes(query);
    const matchStatus = seat.status?.toLowerCase().includes(query);
    const matchStudent = [
      seat.morningStudent,
      seat.afternoonStudent,
      seat.nightStudent,
      seat.fullDayStudent,
    ].some((name) => name && name.toLowerCase().includes(query));

    return matchId || matchStatus || matchStudent;
  });

  const indexOfLastSeat = currentPage * seatsPerPage;
  const indexOfFirstSeat = indexOfLastSeat - seatsPerPage;
  const currentSeats = filteredSeats.slice(indexOfFirstSeat, indexOfLastSeat);
  const totalPages = Math.ceil(filteredSeats.length / seatsPerPage);

  // ============================================================================
  // 📍 4. AUTO TIME UPDATER
  // ============================================================================
  useEffect(() => {
    const updateSeatTimingAutomatically = () => {
      const hour = new Date().getHours();

      setSeats((prevSeats) =>
        prevSeats.map((seat) => {
          if (seat.status === 'Available') return seat;

          if (seat.status === '24 Hours') {
            return { ...seat, timing: '24 Hours' };
          }

          if (seat.status === 'Full Day') {
            return { ...seat, timing: '8 AM - 8 PM' };
          }

          let newTiming = '';
          if (hour >= 8 && hour < 14) {
            newTiming = '8 AM - 2 PM';
          } else if (hour >= 14 && hour < 20) {
            newTiming = '2 PM - 8 PM';
          } else {
            newTiming = '8 PM - 8 AM';
          }

          return { ...seat, timing: newTiming };
        })
      );
    };

    updateSeatTimingAutomatically();
    const interval = setInterval(updateSeatTimingAutomatically, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkExpiredPayments = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const paymentFields = [
        ["morningPayment", "morningTo"],
        ["afternoonPayment", "afternoonTo"],
        ["nightPayment", "nightTo"],
        ["fullDayPayment", "fullDayTo"],
      ];

      for (const seat of seats) {
        let updatedSeat = { ...seat };
        let changed = false;

        paymentFields.forEach(([paymentField, dateField]) => {
          if (
            updatedSeat[paymentField] === "Submitted" &&
            updatedSeat[dateField]
          ) {
            const endDate = new Date(updatedSeat[dateField]);
            endDate.setHours(0, 0, 0, 0);

            if (today >= endDate) {
              updatedSeat[paymentField] = "Pending";
              changed = true;
            }
          }
        });

        if (!changed) continue;

        setSeats((prevSeats) =>
          prevSeats.map((s) => (s.id === seat.id ? updatedSeat : s))
        );

        try {
          await setDoc(doc(db, "bookings", `seat-${seat.id}`), updatedSeat);
        } catch (error) {
          console.error("Auto payment expiry failed:", error);
        }
      }
    };

    checkExpiredPayments();
    const interval = setInterval(checkExpiredPayments, 60000);
    return () => clearInterval(interval);
  }, [seats]);

  // ============================================================================
  // 📍 5. ADMIN LOGIN CREDENTIALS
  // ============================================================================
  const adminUser = 'Anant Singh';
  const adminPass = 'Kamlesh@123';

  const handleLogin = () => {
    if (username === adminUser && password === adminPass) {
      setAdminLoggedIn(true);
      setSelectedSeat(seats[0]);
    } else {
      alert('Wrong Username or Password');
    }
  };

  // ============================================================================
  // 📍 6. UPDATE SEAT LOGIC (FIXED: CLEAR SHIFTS WHEN STATUS IS AVAILABLE)
  // ============================================================================
  const updateSeat = (field, value) => {
    if (!selectedSeat) return;

    if (field === 'status' && value === 'Available') {
      const clearedSeat = {
        ...selectedSeat,
        status: 'Available',
        timing: 'Available',
        morningStudent: '', afternoonStudent: '', nightStudent: '', fullDayStudent: '',
        morningPhone: '', afternoonPhone: '', nightPhone: '', fullDayPhone: '',
        morningEmail: '', afternoonEmail: '', nightEmail: '', fullDayEmail: '',
        morningAddress: '', afternoonAddress: '', nightAddress: '', fullDayAddress: '',
        morningPayment: '', afternoonPayment: '', nightPayment: '', fullDayPayment: '',
        morningPaymentMode: '', afternoonPaymentMode: '', nightPaymentMode: '', fullDayPaymentMode: '',
        morningFrom: '', morningTo: '', afternoonFrom: '', afternoonTo: '', nightFrom: '', nightTo: '',
        fromDate: '', toDate: '', phone: '', email: '', amount: '', morningAmount: '', afternoonAmount: '', nightAmount: '', fullDayAmount: ''
      };

      setSeats((prev) =>
        prev.map((seat) => (seat.id === selectedSeat.id ? clearedSeat : seat))
      );
      setSelectedSeat(clearedSeat);
      setTimeout(() => saveSeatToFirebase(clearedSeat), 100);
      return;
    }

    if (field === 'status') {
      const is24Hr = value === '24 Hours';
      const isFullDay = value === 'Full Day';

      const newStatusUpdates = {
        ...selectedSeat,
        status: value,
        timing: is24Hr ? '24 Hours' : isFullDay ? '8 AM - 8 PM' : selectedSeat.timing,
        morningStudent: is24Hr ? '' : (selectedSeat.morningStudent || ''),
        afternoonStudent: is24Hr ? '' : (selectedSeat.afternoonStudent || ''),
        nightStudent: selectedSeat.nightStudent || '',
        fullDayStudent: isFullDay ? (selectedSeat.fullDayStudent || '') : '',
        morningPayment: is24Hr ? 'Disabled' : (selectedSeat.morningPayment || 'Available'),
        afternoonPayment: is24Hr ? 'Disabled' : (selectedSeat.afternoonPayment || 'Available'),
        nightPayment: selectedSeat.nightPayment || 'Available',
        fullDayPayment: isFullDay ? (selectedSeat.fullDayPayment || 'Available') : '',
      };

      setSeats((prev) =>
        prev.map((seat) => (seat.id === selectedSeat.id ? newStatusUpdates : seat))
      );
      setSelectedSeat(newStatusUpdates);
      return;
    }

    let autoUpdates = { [field]: value };
    if (field.endsWith("Payment") && value === "Submitted") {
      const prefix = field.replace("Payment", "");
      const d = new Date();
      const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      autoUpdates[`${prefix}PaidDate`] = todayStr;

      if (!selectedSeat[`${prefix}PaymentMode`]) {
        autoUpdates[`${prefix}PaymentMode`] = "Cash";
      }

      if (selectedSeat[`${prefix}EntryType`] !== "Renewal") {
        autoUpdates[`${prefix}EntryType`] = "New Admission";
      }
    }

    // FIX: Agar Fees Status ko "Available" kiya jaye, toh us specific shift ka data bhi clear kar do
    if (field.endsWith("Payment") && value === "Available") {
      const prefix = field.replace("Payment", "");
      autoUpdates[`${prefix}Student`] = "";
      autoUpdates[`${prefix}Phone`] = "";
      autoUpdates[`${prefix}Email`] = "";
      autoUpdates[`${prefix}Address`] = "";
      autoUpdates[`${prefix}Amount`] = "";
      autoUpdates[`${prefix}From`] = "";
      autoUpdates[`${prefix}To`] = "";
      autoUpdates[`${prefix}PaymentMode`] = "";
    }

    const nextSeatState = { ...selectedSeat, ...autoUpdates };
    setSeats((prev) => prev.map((seat) => (seat.id === selectedSeat.id ? nextSeatState : seat)));
    setSelectedSeat(nextSeatState);
    setTimeout(() => saveSeatToFirebase(nextSeatState), 100);
  };

  const toggleSeatVisibility = async (seatId) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat) return;

    const newVisibility = seat.isVisible === false;

    try {
      const seatRef = doc(db, "bookings", seat.firebaseDocId);
      await updateDoc(seatRef, { isVisible: newVisibility });

      setSeats((prevSeats) =>
        prevSeats.map((s) => (s.id === seatId ? { ...s, isVisible: newVisibility } : s))
      );
    } catch (error) {
      console.error("Seat visibility update failed:", error);
    }
  };

  // =====================================================
  // 🔄 SMART TRANSFER & SWAP
  // =====================================================
  const handleSeatTransfer = async (fromSeatId, toSeatId, fromShiftType, toShiftType) => {
    if (!fromSeatId || !toSeatId || !fromShiftType || !toShiftType) {
      alert("Kripya source shift, target seat aur target shift teeno select karein.");
      return;
    }

    const fromSeat = seats.find((s) => s.id === Number(fromSeatId));
    const toSeat = seats.find((s) => s.id === Number(toSeatId));
    if (!fromSeat || !toSeat) return;

    const shiftMap = {
      Morning: { student: "morningStudent", phone: "morningPhone", email: "morningEmail", address: "morningAddress", from: "morningFrom", to: "morningTo", payment: "morningPayment", amount: "morningAmount", mode: "morningPaymentMode" },
      Afternoon: { student: "afternoonStudent", phone: "afternoonPhone", email: "afternoonEmail", address: "afternoonAddress", from: "afternoonFrom", to: "afternoonTo", payment: "afternoonPayment", amount: "afternoonAmount", mode: "afternoonPaymentMode" },
      Night: { student: "nightStudent", phone: "nightPhone", email: "nightEmail", address: "nightAddress", from: "nightFrom", to: "nightTo", payment: "nightPayment", amount: "nightAmount", mode: "nightPaymentMode" },
      "Full Day": { student: "fullDayStudent", phone: "fullDayPhone", email: "fullDayEmail", address: "fullDayAddress", from: "fullDayFrom", to: "fullDayTo", payment: "fullDayPayment", amount: "fullDayAmount", mode: "fullDayPaymentMode" },
      "24 Hours": { student: "nightStudent", phone: "nightPhone", email: "nightEmail", address: "nightAddress", from: "nightFrom", to: "nightTo", payment: "nightPayment", amount: "nightAmount", mode: "nightPaymentMode" },
    };

    const fromFields = shiftMap[fromShiftType];
    const toFields = shiftMap[toShiftType];
    if (!fromFields || !toFields) return;

    const isOccupied = !!toSeat[toFields.student];
    const targetStudentName = toSeat[toFields.student];

    let updatedFromSeat = { ...fromSeat };
    let updatedToSeat = { ...toSeat };

    if (isOccupied) {
      const tempFromData = {
        student: fromSeat[fromFields.student] || "",
        phone: fromSeat[fromFields.phone] || "",
        email: fromSeat[fromFields.email] || "",
        address: fromSeat[fromFields.address] || "",
        from: fromSeat[fromFields.from] || "",
        to: fromSeat[fromFields.to] || "",
        payment: fromSeat[fromFields.payment] || "Available",
        amount: fromSeat[fromFields.amount] || "",
        mode: fromSeat[fromFields.mode] || "Cash",
      };

      const tempToData = {
        student: toSeat[toFields.student] || "",
        phone: toSeat[toFields.phone] || "",
        email: toSeat[toFields.email] || "",
        address: toSeat[toFields.address] || "",
        from: toFields.from ? toSeat[toFields.from] || "" : "",
        to: toFields.to ? toSeat[toFields.to] || "" : "",
        payment: toSeat[toFields.payment] || "Available",
        amount: toSeat[toFields.amount] || "",
        mode: toSeat[toFields.mode] || "Cash",
      };

      updatedToSeat[toFields.student] = tempFromData.student;
      updatedToSeat[toFields.phone] = tempFromData.phone;
      updatedToSeat[toFields.email] = tempFromData.email;
      updatedToSeat[toFields.address] = tempFromData.address;
      updatedToSeat[toFields.from] = tempFromData.from;
      updatedToSeat[toFields.to] = tempFromData.to;
      updatedToSeat[toFields.payment] = tempFromData.payment;
      updatedToSeat[toFields.amount] = tempFromData.amount;
      updatedToSeat[toFields.mode] = tempFromData.mode;

      updatedFromSeat[fromFields.student] = tempToData.student;
      updatedFromSeat[fromFields.phone] = tempToData.phone;
      updatedFromSeat[fromFields.email] = tempToData.email;
      updatedFromSeat[fromFields.address] = tempToData.address;
      updatedFromSeat[fromFields.from] = tempToData.from;
      updatedFromSeat[fromFields.to] = tempToData.to;
      updatedFromSeat[fromFields.payment] = tempToData.payment;
      updatedFromSeat[fromFields.amount] = tempToData.amount;
      updatedFromSeat[fromFields.mode] = tempToData.mode;
    } else {
      updatedToSeat[toFields.student] = fromSeat[fromFields.student] || "";
      updatedToSeat[toFields.phone] = fromSeat[fromFields.phone] || "";
      updatedToSeat[toFields.email] = fromSeat[fromFields.email] || "";
      updatedToSeat[toFields.address] = fromSeat[fromFields.address] || "";
      updatedToSeat[toFields.from] = fromSeat[fromFields.from] || "";
      updatedToSeat[toFields.to] = fromSeat[fromFields.to] || "";
      updatedToSeat[toFields.payment] = fromSeat[fromFields.payment] || "Submitted";
      updatedToSeat[toFields.amount] = fromSeat[fromFields.amount] || "";
      updatedToSeat[toFields.mode] = fromSeat[fromFields.mode] || "Cash";

      if (updatedToSeat.status === "Available") {
        if (toShiftType === "Full Day") {
          updatedToSeat.status = "Full Day";
          updatedToSeat.timing = "8 AM - 8 PM";
        } else if (toShiftType === "24 Hours") {
          updatedToSeat.status = "24 Hours";
          updatedToSeat.timing = "24 Hours";
        } else {
          updatedToSeat.status = "Half Day";
        }
      }

      updatedFromSeat[fromFields.student] = "";
      updatedFromSeat[fromFields.phone] = "";
      updatedFromSeat[fromFields.email] = "";
      updatedFromSeat[fromFields.address] = "";
      updatedFromSeat[fromFields.from] = "";
      updatedFromSeat[fromFields.to] = "";
      updatedFromSeat[fromFields.payment] = "Available";
      updatedFromSeat[fromFields.amount] = "";
      updatedFromSeat[fromFields.mode] = "";

      const hasStudents = [
        updatedFromSeat.morningStudent,
        updatedFromSeat.afternoonStudent,
        updatedFromSeat.nightStudent,
        updatedFromSeat.fullDayStudent,
      ].some(Boolean);

      if (!hasStudents) {
        updatedFromSeat.status = "Available";
        updatedFromSeat.timing = "Available";
      }
    }

    setSeats((prev) =>
      prev.map((s) => {
        if (s.id === fromSeat.id) return updatedFromSeat;
        if (s.id === toSeat.id) return updatedToSeat;
        return s;
      })
    );
    setSelectedSeat(updatedToSeat);

    try {
      await setDoc(doc(db, "bookings", `seat-${fromSeat.id}`), updatedFromSeat);
      await setDoc(doc(db, "bookings", `seat-${toSeat.id}`), updatedToSeat);
      if (isOccupied) {
        alert(`🔄 SWAP SUCCESS!\n${fromSeat[fromFields.student]} (Seat ${fromSeat.id}) ⇄ ${targetStudentName} (Seat ${toSeat.id}) aapas me badal gaye.`);
      } else {
        alert(`✅ TRANSFER SUCCESS!\nStudent Seat ${fromSeat.id} (${fromShiftType}) se Seat ${toSeat.id} (${toShiftType}) par successfully move ho gaya.`);
      }
    } catch (error) {
      console.error("Transfer Error:", error);
      alert("Firebase update me problem aayi.");
    }
  };

  // =====================================================
  // ⚡ 1-CLICK RENEW NEXT 30 DAYS FUNCTION
  // =====================================================
  const renewSeatShift = (fromField, toField, paymentField) => {
    if (!selectedSeat) return;

    const currentTo = selectedSeat[toField];
    let baseDate = new Date();

    if (currentTo) {
      const parsed = new Date(currentTo);
      if (!isNaN(parsed.getTime())) {
        baseDate = parsed;
      }
    }

    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const newFrom = formatDate(baseDate);
    const nextDate = new Date(baseDate);
    nextDate.setDate(nextDate.getDate() + 30);
    const newTo = formatDate(nextDate);

    const todayPaidDate = formatDate(new Date());
    const prefix = fromField.replace("From", "");

    const updates = {
      [fromField]: newFrom,
      [toField]: newTo,
      [paymentField]: "Submitted",
      [`${prefix}PaidDate`]: todayPaidDate,
      [`${prefix}EntryType`]: "Renewal",
      [`${prefix}PaymentMode`]: selectedSeat[`${prefix}PaymentMode`] || "Cash",
    };

    setSeats((prev) =>
      prev.map((s) => (s.id === selectedSeat.id ? { ...s, ...updates } : s))
    );
    setSelectedSeat((prev) => ({ ...prev, ...updates }));

    alert(`✅ Seat ${selectedSeat.id} Renewed (+30 Days)!\nFrom: ${newFrom}\nTo: ${newTo}\nPaid Date: ${todayPaidDate}\nType: Renewal\n\n(Save button dabakar data confirm karein)`);
  };

  // =====================================================
  // 🧾 1-CLICK PRINTABLE FEE RECEIPT SLIP
  // =====================================================
  const printFeeReceipt = (student) => {
    if (!student.name || student.name.trim() === "") {
      alert("Please enter a student name first to generate the receipt.");
      return;
    }

    const receiptNo = `ATL-${new Date().getFullYear()}-${student.seat}-${Math.floor(1000 + Math.random() * 9000)}`;
    const printWindow = window.open("", "", "width=800,height=750");
    if (!printWindow) {
      alert("Please allow popups to print the fee receipt.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fee Receipt - ${student.name}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 35px; color: #0f172a; background: #fff; }
          .receipt-box { border: 2px solid #0f172a; border-radius: 18px; padding: 30px; max-width: 620px; margin: auto; position: relative; }
          .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 18px; margin-bottom: 18px; }
          .title { font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #0f172a; }
          .subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: bold; margin-top: 4px; }
          .meta-bar { display: flex; justify-content: space-between; font-size: 12px; color: #475569; margin-bottom: 15px; font-family: monospace; }
          .receipt-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
          .receipt-table td { padding: 9px 10px; border-bottom: 1px solid #f1f5f9; }
          .receipt-table td.label { font-weight: 700; color: #64748b; width: 38%; }
          .receipt-table td.val { font-weight: 700; color: #0f172a; }
          .amount-row { background: #f8fafc; border: 1.5px solid #0f172a; border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; margin-top: 22px; }
          .amount-val { font-size: 22px; font-weight: 900; color: #059669; font-family: monospace; }
          .badge { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
          .badge-paid { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
          .badge-pending { background: #fef9c3; color: #a16207; border: 1px solid #fde047; }
          .footer { margin-top: 35px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; }
          .sign { text-align: center; border-top: 1px solid #0f172a; width: 150px; padding-top: 6px; font-weight: bold; color: #0f172a; }
          @media print { body { padding: 0; } .receipt-box { border-width: 1.5px; } }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="header">
            <div class="title">ANY TIME LIBRARY</div>
            <div class="subtitle">Official Membership Fee Receipt</div>
          </div>
          <div class="meta-bar">
            <div><strong>Receipt No:</strong> ${receiptNo}</div>
            <div><strong>Date:</strong> ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
          </div>
          <table class="receipt-table">
            <tr><td class="label">Student Name</td><td class="val">${student.name}</td></tr>
            <tr><td class="label">Seat Number</td><td class="val">Seat ${student.seat}</td></tr>
            <tr><td class="label">Plan / Shift</td><td class="val">${student.plan}</td></tr>
            <tr><td class="label">Contact Phone</td><td class="val">${student.phone || "-"}</td></tr>
            <tr><td class="label">Address / City</td><td class="val">${student.address || "-"}</td></tr>
            <tr><td class="label">Validity Period</td><td class="val">${student.fromDate || "-"} to ${student.toDate || "-"}</td></tr>
            <tr><td class="label">Payment Mode</td><td class="val">${student.paymentMode || "Cash"}</td></tr>
            <tr><td class="label">Status</td><td class="val"><span class="badge ${student.payment === "Submitted" ? "badge-paid" : "badge-pending"}">${student.payment === "Submitted" ? "Paid & Confirmed" : "Pending / Reserved"}</span></td></tr>
          </table>
          <div class="amount-row">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b;">Total Amount</span>
            <span class="amount-val">₹${Number(student.amount || 0).toLocaleString("en-IN")}</span>
          </div>
          <div class="footer">
            <div>Thank you for choosing Any Time Library!<br/>Peaceful Environment • Smart Seat Tracking</div>
            <div class="sign">Authorized Seal & Sign</div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  // =====================================================
  // 💬 DYNAMIC WHATSAPP NOTIFICATION (BOOKED VS RESERVED)
  // =====================================================
  const sendStudentWhatsAppUpdate = (student) => {
    if (!student.name || student.name.trim() === "") {
      alert("Please enter a student name first.");
      return;
    }

    let cleanPhone = (student.phone || "").replace(/\D/g, "");
    if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;

    if (!cleanPhone || cleanPhone.length < 10) {
      alert(`Student (${student.name}) does not have a valid 10-digit mobile number saved!`);
      return;
    }

    const isPaid = student.payment === "Submitted";
    let message = "";

    if (isPaid) {
      message = `*Dear ${student.name},*

🎉 *SEAT BOOKING CONFIRMATION* - *ANY TIME LIBRARY* 📚

We are pleased to inform you that your library seat subscription is *CONFIRMED & ACTIVE*.

📌 *Membership Details:*
• *Seat Number:* Seat ${student.seat}
• *Shift / Plan:* ${student.plan}
• *Amount Paid:* ₹${student.amount || 0} (${student.paymentMode || "Cash"})
• *Valid Period:* ${student.fromDate || "N/A"} to ${student.toDate || "N/A"}
${student.address ? `• *Address:* ${student.address}\n` : ""}
Welcome to a peaceful and productive study environment at Any Time Library!

Warm regards,  
*Management Team*  
*Any Time Library*`;
    } else {
      message = `*Dear ${student.name},*

⏳ *SEAT RESERVATION NOTICE* - *ANY TIME LIBRARY* 📚

Your library seat has been provisionally *RESERVED*, awaiting fee payment confirmation.

📌 *Reservation Details:*
• *Seat Number:* Seat ${student.seat}
• *Shift / Plan:* ${student.plan}
• *Amount Due:* ₹${student.amount || 0}
• *Valid Until:* ${student.toDate || "Immediate"}
${student.address ? `• *Address:* ${student.address}\n` : ""}
Kindly complete your payment at the earliest to confirm your permanent seat allocation.

💳 *Payment Methods:*
• *UPI ID:* gurpratap2611-@okhdfcbank
• *GPay / PhonePe / Paytm:* 9219384600
• *Cash:* Directly at library reception

Thank you for choosing Any Time Library!

Warm regards,  
*Management Team*  
*Any Time Library*`;
    }

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // =========================================================================
  // ⚡ 7. SAVE SEAT & PERMANENT FEE HISTORY ARCHIVE ENGINE (ROBUST & ERROR-FREE)
  // =========================================================================
  const saveSeatToFirebase = async (seatToSave = selectedSeat) => {
    if (!seatToSave || !seatToSave.id) return;
    try {
      const cleanData = JSON.parse(JSON.stringify(seatToSave));

      await setDoc(
        doc(db, "bookings", `seat-${cleanData.id}`),
        cleanData
      );

      const shifts = ["morning", "afternoon", "night", "fullDay"];
      for (const p of shifts) {
        if (cleanData[`${p}Payment`] === "Submitted" && cleanData[`${p}Student`]) {
          const sName = cleanData[`${p}Student`];
          const amt = Number(cleanData[`${p}Amount`]) || 0;
          const pDate = cleanData[`${p}PaidDate`] || cleanData[`${p}From`] || new Date().toISOString().split("T")[0];

          const historyDocId = `${cleanData.id}-${p}-${pDate}-${sName.trim().replace(/\s+/g, '_')}`;

          await setDoc(
            doc(db, "fee_history", historyDocId),
            {
              seatId: cleanData.id,
              plan: cleanData.status === "24 Hours" ? "24 Hours" : `${p.charAt(0).toUpperCase() + p.slice(1)} Shift`,
              studentName: sName,
              phone: cleanData[`${p}Phone`] || "",
              email: cleanData[`${p}Email`] || "",
              address: cleanData[`${p}Address`] || "",
              amount: amt,
              paidDate: pDate,
              fromDate: cleanData[`${p}From`] || "",
              toDate: cleanData[`${p}To`] || "",
              paymentMode: cleanData[`${p}PaymentMode`] || "Cash",
              entryType: cleanData[`${p}EntryType`] || "New Admission",
              status: "Submitted",
              archivedAt: Date.now(),
            },
            { merge: true }
          );
        }
      }

      console.log("Saved and permanent fee history updated successfully");
    } catch (error) {
      console.error("Firebase save error:", error);
      alert("Error saving data to Firebase. Please check console.");
    }
  };

  const isDateExpired = (toDate) => {
    if (!toDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(toDate);
    end.setHours(0, 0, 0, 0);
    return today > end;
  };

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
      case 'Full Day': return 'bg-rose-600/90 hover:bg-rose-500';
      case 'Half Day': return 'bg-amber-500/95 text-slate-950 hover:bg-amber-400';
      case '24 Hours': return 'bg-indigo-600/90 hover:bg-indigo-500';
      default: return 'bg-emerald-600/90 hover:bg-emerald-500';
    }
  };

  const getOverallSeatStatus = (seat) => {
    if (!seat) return null;

    if (seat.status === "24 Hours") {
      return seat.nightPayment === "Submitted" ? (
        <span className="text-green-500 text-xl">✅</span>
      ) : (
        <span className="text-red-500 text-xl">❌</span>
      );
    }

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
  // 🛠️ 8. ADMIN PANEL UI
  // ============================================================================
  if (adminLoggedIn) {
    return (
      <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden text-gray-800">

        {/* ---> ADMIN: LEFT SIDEBAR <--- */}
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
            <button
              onClick={() => setActiveAdminSection("accounts")}
              className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm tracking-wider transition-all duration-200 flex items-center gap-3 ${activeAdminSection === "accounts"
                  ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-[0_0_20px_rgba(251,191,36,0.25)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
            >
              <span className="text-sm">💰</span> Accounts & Expenses
            </button>
          </div>

          <div className="p-5 pb-2">
            <h3 className="text-sm font-bold mb-4">All Seats ({filteredSeats.length})</h3>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Seat No. or Name"
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
                onClick={() => {
                  setSelectedSeat(seat);
                  setActiveAdminSection("seats");
                }}
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

        {/* ---> ADMIN: MAIN CONTENT AREA <--- */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">

          {/* ---> ADMIN: TOP NAVBAR <--- */}
          <div className="h-16 bg-[#1e273c] border-b px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
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
              <button
                onClick={() => setAdminLoggedIn(false)}
                className="group relative overflow-hidden flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-black tracking-wider text-rose-500 bg-rose-500/10 border border-rose-500/30 transition-all duration-300 hover:bg-rose-600 hover:text-white hover:border-rose-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.45)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:stroke-white group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="relative z-10 transition-colors duration-300">Logout</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 group-hover:bg-white animate-pulse transition-colors"></span>
              </button>
            </div>
          </div>

          {/* ---> ADMIN: EDIT & PREVIEW CONTAINER <--- */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#0d1017]">

            {activeAdminSection === "dashboard" ? (
              <Dashboard
                seats={seats}
                onToggleSeatVisibility={toggleSeatVisibility}
                onNavigateToAccounts={handleNavigateToAccounts}
              />
            ) : activeAdminSection === "accounts" ? (
              <AccountsFinance
                seats={seats}
                selectedMonth={accountsSelectedMonth}
                setSelectedMonth={setAccountsSelectedMonth}
                selectedYear={accountsSelectedYear}
                setSelectedYear={setAccountsSelectedYear}
              />
            ) : selectedSeat ? (

              <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

                {/* ---> ADMIN: EDIT FORM <--- */}
                <div className="xl:col-span-2 bg-[#282f3d] rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold mb-6 text-slate-100">Editing Seat {selectedSeat.id}</h3>

                  <div className="space-y-5">

                    <FormSelect
                      label="Seat Type / Status"
                      value={selectedSeat.status}
                      onChange={(e) => updateSeat('status', e.target.value)}
                      options={['Available', 'Half Day', 'Full Day', '24 Hours']}
                    />

                    {/* 24 HOURS PLAN SECTION */}
                    {selectedSeat.status === "24 Hours" ? (
                      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">

                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <h4 className="font-bold text-lg text-slate-800">24 Hours Student</h4>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => renewSeatShift("nightFrom", "nightTo", "nightPayment")}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                            >
                              ⚡️ Renew (+30 Days)
                            </button>
                          </div>
                        </div>

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

                        <FormInput
                          icon={<CalendarIcon className="w-4 h-4" />}
                          label="Student Address / City"
                          value={selectedSeat.nightAddress || ""}
                          onChange={(e) => updateSeat("nightAddress", e.target.value)}
                          placeholder="Enter student address"
                        />

                        <FormInput
                          icon={<CurrencyRupeeIcon className="w-4 h-4" />}
                          label="Actual Fees Received (₹)"
                          type="number"
                          value={selectedSeat.nightAmount || ""}
                          onChange={(e) =>
                            updateSeat("nightAmount", e.target.value)
                          }
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

                        <div className="grid grid-cols-2 gap-4">
                          <FormSelect
                            label="Fees Status"
                            value={selectedSeat.nightPayment || "Available"}
                            onChange={(e) => updateSeat("nightPayment", e.target.value)}
                            options={isDateExpired(selectedSeat.nightTo) ? ["Pending"] : ["Available", "Submitted", "Pending"]}
                            disabled={isDateExpired(selectedSeat.nightTo)}
                          />

                          <FormSelect
                            label="Payment Mode"
                            value={selectedSeat.nightPaymentMode || "Cash"}
                            onChange={(e) => updateSeat("nightPaymentMode", e.target.value)}
                            options={["Cash", "Online (UPI)"]}
                          />
                        </div>

                        {/* 🧾 RECEIPT & WHATSAPP BUTTONS (24 HOURS) */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => printFeeReceipt({
                              name: selectedSeat.nightStudent,
                              seat: selectedSeat.id,
                              plan: "24 Hours",
                              phone: selectedSeat.nightPhone,
                              address: selectedSeat.nightAddress,
                              amount: selectedSeat.nightAmount,
                              fromDate: selectedSeat.nightFrom,
                              toDate: selectedSeat.nightTo,
                              payment: selectedSeat.nightPayment,
                              paymentMode: selectedSeat.nightPaymentMode
                            })}
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/30 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            🧾 Print Fee Receipt
                          </button>
                          <button
                            type="button"
                            onClick={() => sendStudentWhatsAppUpdate({
                              name: selectedSeat.nightStudent,
                              seat: selectedSeat.id,
                              plan: "24 Hours",
                              phone: selectedSeat.nightPhone,
                              address: selectedSeat.nightAddress,
                              amount: selectedSeat.nightAmount,
                              fromDate: selectedSeat.nightFrom,
                              toDate: selectedSeat.nightTo,
                              payment: selectedSeat.nightPayment,
                              paymentMode: selectedSeat.nightPaymentMode
                            })}
                            className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-slate-950 border border-[#25D366]/30 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            💬 WhatsApp Status Slip
                          </button>
                        </div>

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
                            <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
                              <div className="flex justify-between items-center">
                                <h4 className="font-bold text-blue-600">🌤️ Morning Shift</h4>
                                <button
                                  type="button"
                                  onClick={() => renewSeatShift("morningFrom", "morningTo", "morningPayment")}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm ml-auto mr-2"
                                >
                                  ⚡️ Renew (+30 Days)
                                </button>

                                {selectedSeat.morningPayment !== "Available" && (
                                  <span className="text-sm font-semibold text-red-500">
                                    {getDueStatus(selectedSeat.morningTo)}
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <FormSelect
                                  label="Fees Status"
                                  value={selectedSeat.morningPayment || "Available"}
                                  onChange={(e) => updateSeat("morningPayment", e.target.value)}
                                  options={isDateExpired(selectedSeat.morningTo) ? ["Pending"] : ["Available", "Submitted", "Pending"]}
                                  disabled={isDateExpired(selectedSeat.morningTo)}
                                />

                                <FormSelect
                                  label="Payment Mode"
                                  value={selectedSeat.morningPaymentMode || "Cash"}
                                  onChange={(e) => updateSeat("morningPaymentMode", e.target.value)}
                                  options={["Cash", "Online (UPI)"]}
                                />
                              </div>

                              {selectedSeat.morningPayment !== "Available" && (
                                <>
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

                                    <FormInput
                                      icon={<CalendarIcon className="w-4 h-4" />}
                                      label="Student Address / City"
                                      value={selectedSeat.morningAddress || ""}
                                      onChange={(e) => updateSeat("morningAddress", e.target.value)}
                                      placeholder="Enter student address"
                                    />

                                    <FormInput
                                      icon={<CurrencyRupeeIcon className="w-4 h-4" />}
                                      label="Actual Fees Received (₹)"
                                      type="number"
                                      value={selectedSeat.morningAmount || ""}
                                      onChange={(e) =>
                                        updateSeat("morningAmount", e.target.value)
                                      }
                                    />
                                  </div>

                                  <div className="flex flex-wrap gap-2 pt-2">
                                    <button
                                      type="button"
                                      onClick={() => printFeeReceipt({
                                        name: selectedSeat.morningStudent,
                                        seat: selectedSeat.id,
                                        plan: "Morning Shift",
                                        phone: selectedSeat.morningPhone,
                                        address: selectedSeat.morningAddress,
                                        amount: selectedSeat.morningAmount,
                                        fromDate: selectedSeat.morningFrom,
                                        toDate: selectedSeat.morningTo,
                                        payment: selectedSeat.morningPayment,
                                        paymentMode: selectedSeat.morningPaymentMode
                                      })}
                                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/30 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                      🧾 Print Fee Receipt
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => sendStudentWhatsAppUpdate({
                                        name: selectedSeat.morningStudent,
                                        seat: selectedSeat.id,
                                        plan: "Morning Shift",
                                        phone: selectedSeat.morningPhone,
                                        address: selectedSeat.morningAddress,
                                        amount: selectedSeat.morningAmount,
                                        fromDate: selectedSeat.morningFrom,
                                        toDate: selectedSeat.morningTo,
                                        payment: selectedSeat.morningPayment,
                                        paymentMode: selectedSeat.morningPaymentMode
                                      })}
                                      className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-slate-950 border border-[#25D366]/30 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                      💬 WhatsApp Status Slip
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Afternoon Shift */}
                            <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
                              <div className="flex justify-between items-center">
                                <h4 className="font-bold text-blue-600">☀️ Afternoon Shift</h4>
                                <button
                                  type="button"
                                  onClick={() => renewSeatShift("afternoonFrom", "afternoonTo", "afternoonPayment")}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm ml-auto mr-2"
                                >
                                  ⚡️ Renew (+30 Days)
                                </button>

                                {selectedSeat.afternoonPayment !== "Available" && (
                                  <span className="text-sm font-semibold text-red-500">
                                    {getDueStatus(selectedSeat.afternoonTo)}
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <FormSelect
                                  label="Fees Status"
                                  value={selectedSeat.afternoonPayment || "Available"}
                                  onChange={(e) => updateSeat("afternoonPayment", e.target.value)}
                                  options={isDateExpired(selectedSeat.afternoonTo) ? ["Pending"] : ["Available", "Submitted", "Pending"]}
                                  disabled={isDateExpired(selectedSeat.afternoonTo)}
                                />

                                <FormSelect
                                  label="Payment Mode"
                                  value={selectedSeat.afternoonPaymentMode || "Cash"}
                                  onChange={(e) => updateSeat("afternoonPaymentMode", e.target.value)}
                                  options={["Cash", "Online (UPI)"]}
                                />
                              </div>

                              {selectedSeat.afternoonPayment !== "Available" && (
                                <>
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

                                    <FormInput
                                      icon={<CalendarIcon className="w-4 h-4" />}
                                      label="Student Address / City"
                                      value={selectedSeat.afternoonAddress || ""}
                                      onChange={(e) => updateSeat("afternoonAddress", e.target.value)}
                                      placeholder="Enter student address"
                                    />

                                    <FormInput
                                      icon={<CurrencyRupeeIcon className="w-4 h-4" />}
                                      label="Actual Fees Received (₹)"
                                      type="number"
                                      value={selectedSeat.afternoonAmount || ""}
                                      onChange={(e) => updateSeat("afternoonAmount", e.target.value)}
                                    />
                                  </div>

                                  <div className="flex flex-wrap gap-2 pt-2">
                                    <button
                                      type="button"
                                      onClick={() => printFeeReceipt({
                                        name: selectedSeat.afternoonStudent,
                                        seat: selectedSeat.id,
                                        plan: "Afternoon Shift",
                                        phone: selectedSeat.afternoonPhone,
                                        address: selectedSeat.afternoonAddress,
                                        amount: selectedSeat.afternoonAmount,
                                        fromDate: selectedSeat.afternoonFrom,
                                        toDate: selectedSeat.afternoonTo,
                                        payment: selectedSeat.afternoonPayment,
                                        paymentMode: selectedSeat.afternoonPaymentMode
                                      })}
                                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/30 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                      🧾 Print Fee Receipt
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => sendStudentWhatsAppUpdate({
                                        name: selectedSeat.afternoonStudent,
                                        seat: selectedSeat.id,
                                        plan: "Afternoon Shift",
                                        phone: selectedSeat.afternoonPhone,
                                        address: selectedSeat.afternoonAddress,
                                        amount: selectedSeat.afternoonAmount,
                                        fromDate: selectedSeat.afternoonFrom,
                                        toDate: selectedSeat.afternoonTo,
                                        payment: selectedSeat.afternoonPayment,
                                        paymentMode: selectedSeat.afternoonPaymentMode
                                      })}
                                      className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-slate-950 border border-[#25D366]/30 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                      💬 WhatsApp Status Slip
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Night Shift */}
                            <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
                              <div className="flex justify-between items-center">
                                <h4 className="font-bold text-blue-600">🌙 Night Shift</h4>
                                <button
                                  type="button"
                                  onClick={() => renewSeatShift("nightFrom", "nightTo", "nightPayment")}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm ml-auto mr-2"
                                >
                                  ⚡️ Renew (+30 Days)
                                </button>

                                {selectedSeat.nightPayment !== "Available" && (
                                  <span className="text-sm font-semibold text-red-500">
                                    {getDueStatus(selectedSeat.nightTo)}
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <FormSelect
                                  label="Fees Status"
                                  value={selectedSeat.nightPayment || "Available"}
                                  onChange={(e) => updateSeat("nightPayment", e.target.value)}
                                  options={isDateExpired(selectedSeat.nightTo) ? ["Pending"] : ["Available", "Submitted", "Pending"]}
                                  disabled={isDateExpired(selectedSeat.nightTo)}
                                />

                                <FormSelect
                                  label="Payment Mode"
                                  value={selectedSeat.nightPaymentMode || "Cash"}
                                  onChange={(e) => updateSeat("nightPaymentMode", e.target.value)}
                                  options={["Cash", "Online (UPI)"]}
                                />
                              </div>

                              {selectedSeat.nightPayment !== "Available" && (
                                <>
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

                                    <FormInput
                                      icon={<CalendarIcon className="w-4 h-4" />}
                                      label="Student Address / City"
                                      value={selectedSeat.nightAddress || ""}
                                      onChange={(e) => updateSeat("nightAddress", e.target.value)}
                                      placeholder="Enter student address"
                                    />

                                    <FormInput
                                      icon={<CurrencyRupeeIcon className="w-4 h-4" />}
                                      label="Actual Fees Received (₹)"
                                      type="number"
                                      value={selectedSeat.nightAmount || ""}
                                      onChange={(e) => updateSeat("nightAmount", e.target.value)}
                                    />
                                  </div>

                                  <div className="flex flex-wrap gap-2 pt-2">
                                    <button
                                      type="button"
                                      onClick={() => printFeeReceipt({
                                        name: selectedSeat.nightStudent,
                                        seat: selectedSeat.id,
                                        plan: "Night Shift",
                                        phone: selectedSeat.nightPhone,
                                        address: selectedSeat.nightAddress,
                                        amount: selectedSeat.nightAmount,
                                        fromDate: selectedSeat.nightFrom,
                                        toDate: selectedSeat.nightTo,
                                        payment: selectedSeat.nightPayment,
                                        paymentMode: selectedSeat.nightPaymentMode
                                      })}
                                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/30 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                      🧾 Print Fee Receipt
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => sendStudentWhatsAppUpdate({
                                        name: selectedSeat.nightStudent,
                                        seat: selectedSeat.id,
                                        plan: "Night Shift",
                                        phone: selectedSeat.nightPhone,
                                        address: selectedSeat.nightAddress,
                                        amount: selectedSeat.nightAmount,
                                        fromDate: selectedSeat.nightFrom,
                                        toDate: selectedSeat.nightTo,
                                        payment: selectedSeat.nightPayment,
                                        paymentMode: selectedSeat.nightPaymentMode
                                      })}
                                      className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-slate-950 border border-[#25D366]/30 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                      💬 WhatsApp Status Slip
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        )}

                        {/* ================= FULL DAY ================= */}
                        {selectedSeat.status === "Full Day" && (
                          <>
                            {/* Full Day Shift */}
                            <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
                              <div className="flex justify-between items-center">
                                <h5 className="font-bold text-blue-600">
                                  🌞 Full Day Shift
                                </h5>
                                <button
                                  type="button"
                                  onClick={() => renewSeatShift("fullDayFrom", "fullDayTo", "fullDayPayment")}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm ml-auto mr-2"
                                >
                                  ⚡️ Renew (+30 Days)
                                </button>
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

                                <FormInput
                                  icon={<CalendarIcon className="w-4 h-4" />}
                                  label="Student Address / City"
                                  value={selectedSeat.fullDayAddress || ""}
                                  onChange={(e) => updateSeat("fullDayAddress", e.target.value)}
                                  placeholder="Enter student address"
                                />

                                <FormInput
                                  icon={<CurrencyRupeeIcon className="w-4 h-4" />}
                                  label="Actual Fees Received (₹)"
                                  type="number"
                                  value={selectedSeat.fullDayAmount || ""}
                                  onChange={(e) => updateSeat("fullDayAmount", e.target.value)}
                                />

                                <FormSelect
                                  label="Fees Status"
                                  value={selectedSeat.fullDayPayment || "Available"}
                                  onChange={(e) => updateSeat("fullDayPayment", e.target.value)}
                                  options={isDateExpired(selectedSeat.fullDayTo) ? ["Pending"] : ["Available", "Submitted", "Pending"]}
                                  disabled={isDateExpired(selectedSeat.fullDayTo)}
                                />

                                <FormSelect
                                  label="Payment Mode"
                                  value={selectedSeat.fullDayPaymentMode || "Cash"}
                                  onChange={(e) => updateSeat("fullDayPaymentMode", e.target.value)}
                                  options={["Cash", "Online (UPI)"]}
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

                              <div className="flex flex-wrap gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => printFeeReceipt({
                                    name: selectedSeat.fullDayStudent,
                                    seat: selectedSeat.id,
                                    plan: "Full Day Shift",
                                    phone: selectedSeat.fullDayPhone,
                                    address: selectedSeat.fullDayAddress,
                                    amount: selectedSeat.fullDayAmount,
                                    fromDate: selectedSeat.fullDayFrom,
                                    toDate: selectedSeat.fullDayTo,
                                    payment: selectedSeat.fullDayPayment,
                                    paymentMode: selectedSeat.fullDayPaymentMode
                                  })}
                                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/30 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  🧾 Print Fee Receipt
                                </button>
                                <button
                                  type="button"
                                  onClick={() => sendStudentWhatsAppUpdate({
                                    name: selectedSeat.fullDayStudent,
                                    seat: selectedSeat.id,
                                    plan: "Full Day Shift",
                                    phone: selectedSeat.fullDayPhone,
                                    address: selectedSeat.fullDayAddress,
                                    amount: selectedSeat.fullDayAmount,
                                    fromDate: selectedSeat.fullDayFrom,
                                    toDate: selectedSeat.fullDayTo,
                                    payment: selectedSeat.fullDayPayment,
                                    paymentMode: selectedSeat.fullDayPaymentMode
                                  })}
                                  className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-slate-950 border border-[#25D366]/30 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  💬 WhatsApp Status Slip
                                </button>
                              </div>
                            </div>

                            {/* Night Shift (under Full Day) */}
                            <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
                              <div className="flex justify-between items-center">
                                <h5 className="font-bold text-blue-600">
                                  🌙 Night Shift
                                </h5>
                                <button
                                  type="button"
                                  onClick={() => renewSeatShift("nightFrom", "nightTo", "nightPayment")}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm ml-auto mr-2"
                                >
                                  ⚡️ Renew (+30 Days)
                                </button>

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

                                <FormInput
                                  icon={<CalendarIcon className="w-4 h-4" />}
                                  label="Student Address / City"
                                  value={selectedSeat.nightAddress || ""}
                                  onChange={(e) => updateSeat("nightAddress", e.target.value)}
                                  placeholder="Enter student address"
                                />

                                <FormInput
                                  icon={<CurrencyRupeeIcon className="w-4 h-4" />}
                                  label="Actual Fees Received (₹)"
                                  type="number"
                                  value={selectedSeat.nightAmount || ""}
                                  onChange={(e) => updateSeat("nightAmount", e.target.value)}
                                />

                                <FormSelect
                                  label="Fees Status"
                                  value={selectedSeat.nightPayment || "Available"}
                                  onChange={(e) => updateSeat("nightPayment", e.target.value)}
                                  options={isDateExpired(selectedSeat.nightTo) ? ["Pending"] : ["Available", "Submitted", "Pending"]}
                                  disabled={isDateExpired(selectedSeat.nightTo)}
                                />

                                <FormSelect
                                  label="Payment Mode"
                                  value={selectedSeat.nightPaymentMode || "Cash"}
                                  onChange={(e) => updateSeat("nightPaymentMode", e.target.value)}
                                  options={["Cash", "Online (UPI)"]}
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

                              <div className="flex flex-wrap gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => printFeeReceipt({
                                    name: selectedSeat.nightStudent,
                                    seat: selectedSeat.id,
                                    plan: "Night Shift",
                                    phone: selectedSeat.nightPhone,
                                    address: selectedSeat.nightAddress,
                                    amount: selectedSeat.nightAmount,
                                    fromDate: selectedSeat.nightFrom,
                                    toDate: selectedSeat.nightTo,
                                    payment: selectedSeat.nightPayment,
                                    paymentMode: selectedSeat.nightPaymentMode
                                  })}
                                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/30 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  🧾 Print Fee Receipt
                                </button>
                                <button
                                  type="button"
                                  onClick={() => sendStudentWhatsAppUpdate({
                                    name: selectedSeat.nightStudent,
                                    seat: selectedSeat.id,
                                    plan: "Night Shift",
                                    phone: selectedSeat.nightPhone,
                                    address: selectedSeat.nightAddress,
                                    amount: selectedSeat.nightAmount,
                                    fromDate: selectedSeat.nightFrom,
                                    toDate: selectedSeat.nightTo,
                                    payment: selectedSeat.nightPayment,
                                    paymentMode: selectedSeat.nightPaymentMode
                                  })}
                                  className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-slate-950 border border-[#25D366]/30 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  💬 WhatsApp Status Slip
                                </button>
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

                    <button
                      type="button"
                      onClick={() => {
                        setTargetSeatId("");
                        let defaultShift = "Morning";
                        if (selectedSeat.status === "24 Hours") {
                          defaultShift = "24 Hours";
                        } else if (selectedSeat.status === "Full Day") {
                          defaultShift = selectedSeat.fullDayStudent ? "Full Day" : "Night";
                        } else {
                          defaultShift = selectedSeat.morningStudent
                            ? "Morning"
                            : selectedSeat.afternoonStudent
                              ? "Afternoon"
                              : "Night";
                        }
                        setTransferShift(defaultShift);
                        setTargetShift(defaultShift);
                        setShowTransferModal(true);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-3"
                    >
                      🔄 TRANSFER THIS SEAT / SHIFT
                    </button>

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

                {/* ---> ADMIN: LIVE PREVIEW CARD <--- */}
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
                              <p className="text-xs text-gray-400 mt-0.5">
                                Fees: <span className={selectedSeat.nightPayment === 'Submitted' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{selectedSeat.nightPayment}</span>
                                {selectedSeat.nightPaymentMode && <span className="ml-2 text-yellow-400 font-bold">• {selectedSeat.nightPaymentMode}</span>}
                              </p>
                              {selectedSeat.nightAddress && (
                                <p className="text-[11px] text-slate-300 mt-1">📍 {selectedSeat.nightAddress}</p>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-700/50 flex items-center gap-2 text-xs text-gray-300">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            {selectedSeat.fromDate} → {selectedSeat.toDate}
                          </div>
                        </div>
                      ) : selectedSeat.status !== 'Available' ? (
                        <div className="p-4 bg-[#1e293b]/50 space-y-4">
                          {selectedSeat.fullDayStudent && (
                            <div>
                              <p className="text-sm">
                                🌞 {selectedSeat.fullDayStudent}{" "}
                                <span className="text-xs text-gray-400 font-bold">
                                  ({selectedSeat.fullDayPayment || "Pending"}
                                  {selectedSeat.fullDayPaymentMode ? ` • ${selectedSeat.fullDayPaymentMode}` : ""})
                                </span>
                              </p>
                              {selectedSeat.fullDayAddress && (
                                <p className="text-[11px] text-slate-300 mt-0.5 ml-5">📍 {selectedSeat.fullDayAddress}</p>
                              )}
                              <p className="text-[10px] text-gray-400 mt-1 ml-5 flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" /> {selectedSeat.fullDayFrom} → {selectedSeat.fullDayTo}
                              </p>
                            </div>
                          )}
                          {selectedSeat.morningStudent && (
                            <div>
                              <p className="text-sm">
                                🌅 {selectedSeat.morningStudent}{" "}
                                <span className="text-xs text-gray-400 font-bold">
                                  ({selectedSeat.morningPayment}
                                  {selectedSeat.morningPaymentMode ? ` • ${selectedSeat.morningPaymentMode}` : ""})
                                </span>
                              </p>
                              {selectedSeat.morningAddress && (
                                <p className="text-[11px] text-slate-300 mt-0.5 ml-5">📍 {selectedSeat.morningAddress}</p>
                              )}
                              <p className="text-[10px] text-gray-400 mt-1 ml-5 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {selectedSeat.morningFrom} → {selectedSeat.morningTo}</p>
                            </div>
                          )}
                          {selectedSeat.afternoonStudent && (
                            <div>
                              <p className="text-sm">
                                ☀️ {selectedSeat.afternoonStudent}{" "}
                                <span className="text-xs text-gray-400 font-bold">
                                  ({selectedSeat.afternoonPayment}
                                  {selectedSeat.afternoonPaymentMode ? ` • ${selectedSeat.afternoonPaymentMode}` : ""})
                                </span>
                              </p>
                              {selectedSeat.afternoonAddress && (
                                <p className="text-[11px] text-slate-300 mt-0.5 ml-5">📍 {selectedSeat.afternoonAddress}</p>
                              )}
                              <p className="text-[10px] text-gray-400 mt-1 ml-5 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {selectedSeat.afternoonFrom} → {selectedSeat.afternoonTo}</p>
                            </div>
                          )}
                          {selectedSeat.nightStudent && (
                            <div>
                              <p className="text-sm">
                                🌙 {selectedSeat.nightStudent}{" "}
                                <span className="text-xs text-gray-400 font-bold">
                                  ({selectedSeat.nightPayment}
                                  {selectedSeat.nightPaymentMode ? ` • ${selectedSeat.nightPaymentMode}` : ""})
                                </span>
                              </p>
                              {selectedSeat.nightAddress && (
                                <p className="text-[11px] text-slate-300 mt-0.5 ml-5">📍 {selectedSeat.nightAddress}</p>
                              )}
                              <p className="text-[10px] text-gray-400 mt-1 ml-5 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {selectedSeat.nightFrom} → {selectedSeat.nightTo}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-500 text-sm bg-[#1e293b]/50">No students assigned.</div>
                      )}
                    </div>

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

            {/* ---> SEAT TRANSFER & SWAP MODAL POPUP <--- */}
            {showTransferModal && selectedSeat && (
              <div className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl relative border border-gray-100">

                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="absolute top-5 right-5 text-gray-400 hover:text-black text-xl font-bold"
                  >
                    ✕
                  </button>

                  <h3 className="text-xl font-black text-gray-900 mb-1">
                    Transfer / Swap Seat {selectedSeat.id}
                  </h3>

                  <div className="mb-4">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      1. Student to Move (From Seat {selectedSeat.id})
                    </label>
                    <select
                      value={transferShift}
                      onChange={(e) => {
                        setTransferShift(e.target.value);
                        setTargetShift(e.target.value);
                      }}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 outline-none focus:border-blue-500 font-semibold cursor-pointer"
                    >
                      {selectedSeat.status === "Half Day" && (
                        <>
                          {selectedSeat.morningStudent && (
                            <option value="Morning">🌅 Morning — {selectedSeat.morningStudent}</option>
                          )}
                          {selectedSeat.afternoonStudent && (
                            <option value="Afternoon">☀️ Afternoon — {selectedSeat.afternoonStudent}</option>
                          )}
                          {selectedSeat.nightStudent && (
                            <option value="Night">🌙 Night — {selectedSeat.nightStudent}</option>
                          )}
                        </>
                      )}
                      {selectedSeat.status === "Full Day" && (
                        <>
                          {selectedSeat.fullDayStudent && (
                            <option value="Full Day">🌞 Full Day — {selectedSeat.fullDayStudent}</option>
                          )}
                          {selectedSeat.nightStudent && (
                            <option value="Night">🌙 Night — {selectedSeat.nightStudent}</option>
                          )}
                        </>
                      )}
                      {selectedSeat.status === "24 Hours" && (
                        <option value="24 Hours">🔒 24 Hours — {selectedSeat.nightStudent}</option>
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        2. Target Seat
                      </label>
                      <select
                        value={targetSeatId}
                        onChange={(e) => setTargetSeatId(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 outline-none focus:border-blue-500 font-semibold cursor-pointer"
                      >
                        <option value="">-- Choose Seat --</option>
                        {seats
                          .filter((s) => s.id !== selectedSeat.id)
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              Seat {s.id} ({s.status})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        3. Target Shift
                      </label>
                      <select
                        value={targetShift}
                        onChange={(e) => setTargetShift(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 outline-none focus:border-blue-500 font-semibold cursor-pointer"
                      >
                        <option value="Morning">🌅 Morning Shift</option>
                        <option value="Afternoon">☀️ Afternoon Shift</option>
                        <option value="Night">🌙 Night Shift</option>
                        <option value="Full Day">🌞 Full Day Shift</option>
                        <option value="24 Hours">🔒 24 Hours Plan</option>
                      </select>
                    </div>
                  </div>

                  {targetSeatId && targetShift && (() => {
                    const tSeat = seats.find((s) => s.id === Number(targetSeatId));
                    if (!tSeat) return null;
                    const keyMap = { Morning: "morningStudent", Afternoon: "afternoonStudent", Night: "nightStudent", "Full Day": "fullDayStudent", "24 Hours": "nightStudent" };
                    const occupant = tSeat[keyMap[targetShift]];

                    return (
                      <div className={`p-3 rounded-xl border text-xs font-semibold mb-5 ${occupant ? "bg-amber-50 text-amber-900 border-amber-200" : "bg-emerald-50 text-emerald-900 border-emerald-200"}`}>
                        {occupant ? (
                          <p>🔄 <b>SWAP MODE:</b> Seat {targetSeatId} ({targetShift}) par pehle se <b>{occupant}</b> hain. Dono students aapas me badal jayenge.</p>
                        ) : (
                          <p>🟢 <b>TRANSFER MODE:</b> Seat {targetSeatId} ({targetShift}) khali hai. Student direct move ho jayega.</p>
                        )}
                      </div>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={async () => {
                      if (!targetSeatId) {
                        alert("Kripya target seat select karein.");
                        return;
                      }
                      await handleSeatTransfer(selectedSeat.id, targetSeatId, transferShift, targetShift);
                      setShowTransferModal(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all text-sm"
                  >
                    Confirm & Execute
                  </button>

                </div>
              </div>
            )}

            <div className="mt-8 text-center text-xs text-gray-500 pb-4">
              © 2026 Any Time Library. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 🌍 9. PUBLIC USER VIEW (LUXURY ANIMATED HOME PAGE)
  // ============================================================================
  return (
    <>
      {studentUser ? (
        <StudentDashboard
          user={studentUser}
          onLogout={() => setStudentUser(null)}
        />
      ) : (
        <div className="relative min-h-screen bg-[#050811] text-slate-100 font-sans selection:bg-amber-400 selection:text-black overflow-x-hidden">

          {/* BACKGROUND AMBIENT GLOW EFFECTS */}
          <div className="pointer-events-none fixed -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] z-0"></div>
          <div className="pointer-events-none fixed top-1/3 -right-40 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] z-0"></div>
          <div className="pointer-events-none fixed bottom-10 left-1/3 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] z-0"></div>

          <div className="relative z-10">
            {/* ---> PUBLIC: MAIN HEADER <--- */}
            <Header />

            {/* ---> PUBLIC: ADMIN LOGIN BUTTON <--- */}
            <Buttons
              onSignUp={() => setShowRegistration(true)}
              onSignIn={() => setShowStudentLogin(true)}
              onAdminLoginClick={() =>
                document
                  .getElementById("adminLoginPanel")
                  ?.classList.remove("hidden")
              }
            />

            {/* ---> PUBLIC: ADMIN LOGIN POPUP MODAL <--- */}
            <div id="adminLoginPanel" className="hidden fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[150] p-4">
              <div className="bg-[#0b1220] border border-slate-700/80 p-8 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.9)] w-full max-w-md relative text-white">
                <button
                  onClick={() => document.getElementById('adminLoginPanel')?.classList.add('hidden')}
                  className="absolute top-5 right-5 text-xl font-bold text-gray-400 hover:text-white transition w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"
                >
                  ✕
                </button>
                <div className="text-center mb-6">
                  <div className="inline-flex p-3 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 text-2xl mb-3 shadow-lg">
                    🔒
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white">Administrator Access</h2>
                  <p className="text-xs text-slate-400 mt-1">Management Portal Verification</p>
                </div>
                <input
                  type="text"
                  placeholder="Admin Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-700 p-3.5 rounded-xl mb-3.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-semibold"
                />
                <input
                  type="password"
                  placeholder="Master Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-700 p-3.5 rounded-xl mb-5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-semibold"
                />
                <button
                  onClick={() => {
                    handleLogin();
                    if (username === adminUser && password === adminPass) {
                      document.getElementById('adminLoginPanel')?.classList.add('hidden');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 transition text-slate-950 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-400/20 active:scale-95"
                >
                  Authenticate &amp; Enter
                </button>
              </div>
            </div>

            {/* ---> PUBLIC: HERO SECTION (MODERN LUXURY HIGH-TECH) <--- */}
            <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
              <div className="relative overflow-hidden rounded-[36px] border border-slate-800/90 bg-gradient-to-b from-[#0e1629] via-[#090f1d] to-[#070c18] p-6 sm:p-10 md:p-14 text-center shadow-[0_20px_80px_rgba(0,0,0,0.75)]">

                {/* Golden Beam Top Accent */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-28 bg-amber-400/15 blur-3xl rounded-full"></div>

                {/* Floating Status Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] bg-amber-400/10 text-amber-400 border border-amber-400/30 mb-5 shadow-[0_0_20px_rgba(251,191,36,0.15)] animate-pulse">
                  <span>✨</span> Bachhrawan's Premier Smart Library
                </div>

                {/* Main Heading */}
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
                  Premium Digital{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400">
                    Study Lounge
                  </span>
                </h2>

                {/* Subtitle description (FIXED: 100% FORCED CENTER ON LAPTOP & MOBILE) */}
                <p
                  className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-slate-300 max-w-2xl mx-auto font-medium text-center !text-center w-full"
                  style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto", display: "block" }}
                >
                  Smart seat tracking, peaceful study environment, high-speed WiFi, CCTV security, and dedicated silent monitoring for competitive aspirants.
                </p>

                {/* FACILITIES SHOWCASE */}
                <div className="border-t border-slate-800/90 mt-10 pt-8">
                  <div className="inline-flex items-center gap-2 mb-6">
                    <span className="text-amber-400 text-lg">⭐</span>
                    <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-200">
                      Standard Library Facilities
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-4xl mx-auto text-xs sm:text-sm font-bold text-slate-200">
                    <div className="p-3.5 rounded-2xl bg-[#080e1a]/90 border border-slate-800/90 hover:border-amber-400/40 hover:bg-[#0e172a] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm hover:-translate-y-1">
                      <span className="text-base">🔒</span>
                      <span>Personal Locker</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#080e1a]/90 border border-slate-800/90 hover:border-amber-400/40 hover:bg-[#0e172a] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm hover:-translate-y-1">
                      <span className="text-base">📶</span>
                      <span>Free WiFi</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#080e1a]/90 border border-slate-800/90 hover:border-amber-400/40 hover:bg-[#0e172a] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm hover:-translate-y-1">
                      <span className="text-base">❄️</span>
                      <span>Air Conditioned</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#080e1a]/90 border border-slate-800/90 hover:border-amber-400/40 hover:bg-[#0e172a] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm hover:-translate-y-1">
                      <span className="text-base">💧</span>
                      <span>RO Water</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#080e1a]/90 border border-slate-800/90 hover:border-amber-400/40 hover:bg-[#0e172a] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm hover:-translate-y-1">
                      <span className="text-base">🎥</span>
                      <span>CCTV Security</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#080e1a]/90 border border-slate-800/90 hover:border-amber-400/40 hover:bg-[#0e172a] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm hover:-translate-y-1">
                      <span className="text-base">🔋</span>
                      <span>Power Backup</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#080e1a]/90 border border-slate-800/90 hover:border-amber-400/40 hover:bg-[#0e172a] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm hover:-translate-y-1">
                      <span className="text-base">🤫</span>
                      <span>Silent Study Zone</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#080e1a]/90 border border-slate-800/90 hover:border-amber-400/40 hover:bg-[#0e172a] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm hover:-translate-y-1">
                      <span className="text-base">🪑</span>
                      <span>Comfortable Seating</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* ---> PUBLIC: LIVE SEAT AVAILABILITY SECTION <--- */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 pb-16">

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-400 font-mono">
                      Live Occupancy Radar
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    LIVE SMART SEAT AVAILABILITY
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Real-time automated seat occupancy &amp; slot tracking
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {/* PUBLIC: SEAT BOOKING CTA */}
                  <button
                    onClick={() => setShowBookingPopup(true)}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 px-7 py-3.5 text-white shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 border border-indigo-400/30"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>
                    <span className="relative flex items-center gap-3">
                      <span className="text-xl animate-bounce">🚀</span>
                      <span className="text-left">
                        <span className="block text-[15px] font-black uppercase tracking-widest text-amber-300">hurry up!</span>
                        <span className="block text-sm sm:text-base font-black">Book Your Seat Now</span>
                      </span>
                      <span className="text-base transition-transform duration-300 group-hover:translate-x-1 font-bold">→</span>
                    </span>
                  </button>

                  {/* PUBLIC: TOTAL SEATS BUTTON */}
                  <div
                    onClick={() => setShowQuickView(true)}
                    role="button"
                    tabIndex={0}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-0.5 shadow-xl shadow-amber-400/20 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                  >
                    <div className="rounded-[22px] bg-[#070c18] px-6 py-3 transition-colors group-hover:bg-[#070c18]/80 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Seats Hall</p>
                      <h3 className="text-lg font-black text-white font-mono mt-0.5">MAP</h3>
                      <div className="mt-1 bg-amber-400 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse inline-block shadow">
                        Click for Map ↗
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================================
                            PUBLIC: PROFESSIONAL HALL SEAT MAP MODAL
                  ========================================================= */}
              {showQuickView && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
                  <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-amber-400/30 bg-[#080d18] shadow-[0_25px_100px_rgba(0,0,0,0.9)]">

                    {/* TOP HEADER */}
                    <div className="shrink-0 border-b border-white/10 bg-gradient-to-r from-[#0b1220] via-[#111827] to-[#0b1220] px-5 py-4 sm:px-7 sm:py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-xl font-black tracking-tight text-amber-400 sm:text-2xl flex items-center gap-2">
                            <span>🗺️</span> Live Hall Seat Occupancy Map
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 font-mono">
                            Interactive visual seating architecture • Bachhrawan Library
                          </p>
                        </div>

                        <button
                          onClick={() => setShowQuickView(false)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl font-bold text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                        >
                          ✕
                        </button>
                      </div>

                      {/* LEGEND */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1 text-[10px] font-bold text-gray-300">
                          <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                          Available
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1 text-[10px] font-bold text-gray-300">
                          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>
                          Morning Available
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1 text-[10px] font-bold text-gray-300">
                          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>
                          Afternoon Available
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1 text-[10px] font-bold text-gray-300">
                          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-green-500 to-black"></span>
                          Night Available
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1 text-[10px] font-bold text-gray-300">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                          Fully Booked
                        </div>
                      </div>
                    </div>

                    {/* HALL AREA */}
                    <div className="min-h-0 flex-1 overflow-auto bg-[#050914] p-3 sm:p-5">
                      <div className="mx-auto min-w-[650px] max-w-5xl">
                        <div className="relative overflow-hidden rounded-[24px] border-2 border-gray-700 bg-gradient-to-br from-[#151d2b] via-[#0c1422] to-[#080d17] p-4 shadow-[inset_0_0_60px_rgba(0,0,0,0.55)] sm:p-6">
                          <div className="pointer-events-none absolute inset-2 rounded-[20px] border border-yellow-500/5"></div>

                          {/* WASHROOM */}
                          <div className="flex justify-between sm:mb-6">
                            <div className="relative left-17 rounded-xl border border-blue-400/20 bg-blue-500/5 px-10 py-4 text-center shadow-lg">
                              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-300">Washroom</div>
                              <div className="mt-1 text-lg">🚻</div>
                            </div>

                            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/5 px-25 py-6 text-center shadow-lg">
                              <div className="text-[12px] font-black uppercase tracking-[0.3em] text-blue-300 mt-1">Discussion Hall 💬</div>
                              <div className="text-[12px] font-black uppercase tracking-[0.3em] text-blue-300 mt-1">Lunch Area 🍽️</div>
                            </div>
                          </div>

                          {/* MAIN HALL MAP */}
                          <div className="relative aspect-[1.08/1] w-full">
                            <div className="pointer-events-none absolute left-[46%] top-[10%] h-[75%] w-[8%] rounded-full bg-gradient-to-b from-white/[0.02] via-yellow-500/[0.025] to-transparent"></div>
                            <div className="pointer-events-none absolute left-[45.5%] top-[48%] -rotate-90 text-[7px] font-black uppercase tracking-[0.4em] text-gray-700 sm:text-[8px]">
                              WALKWAY
                            </div>

                            {/* LEFT SIDE */}
                            <div className="absolute left-[3%] top-[5%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                              {[40, 39, 38, 37].map(id => {
                                const seat = seats.find(s => s.id === id);
                                if (!seat) return null;
                                return <HallSeat key={id} seat={seat} setShowQuickView={setShowQuickView} />;
                              })}
                            </div>

                            <div className="absolute left-[3%] top-[17%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                              {[36, 35, 34, 33, 32, 31, 30, 29].map(id => {
                                const seat = seats.find(s => s.id === id);
                                if (!seat) return null;
                                return <HallSeat key={id} seat={seat} setShowQuickView={setShowQuickView} />;
                              })}
                            </div>

                            <div className="absolute left-[3%] top-[36%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                              {[28, 27, 26, 25, 24, 23, 22, 21].map(id => {
                                const seat = seats.find(s => s.id === id);
                                if (!seat) return null;
                                return <HallSeat key={id} seat={seat} setShowQuickView={setShowQuickView} />;
                              })}
                            </div>

                            <div className="absolute left-[3%] top-[55%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                              {[20, 19, 18, 17, 16, 15, 14, 13].map(id => {
                                const seat = seats.find(s => s.id === id);
                                if (!seat) return null;
                                return <HallSeat key={id} seat={seat} setShowQuickView={setShowQuickView} />;
                              })}
                            </div>

                            <div className="absolute left-[3%] top-[74%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                              {[12, 11, 10, 9, 8, 7, 6, 5].map(id => {
                                const seat = seats.find(s => s.id === id);
                                if (!seat) return null;
                                return <HallSeat key={id} seat={seat} setShowQuickView={setShowQuickView} />;
                              })}
                            </div>

                            <div className="absolute bottom-[0%] left-[3%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                              {[4, 3, 2, 1].map(id => {
                                const seat = seats.find(s => s.id === id);
                                if (!seat) return null;
                                return <HallSeat key={id} seat={seat} setShowQuickView={setShowQuickView} />;
                              })}
                            </div>

                            {/* RIGHT SIDE */}
                            <div className="absolute right-[32%] top-[14%] flex w-[10%] flex-col gap-1.5 sm:gap-2">
                              {[66, 65].map(id => {
                                const seat = seats.find(s => s.id === id);
                                if (!seat) return null;
                                return <HallSeat key={id} seat={seat} setShowQuickView={setShowQuickView} vertical />;
                              })}
                            </div>

                            <div className="absolute right-[3%] top-[39%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                              {[61, 62, 63, 64].map(id => {
                                const seat = seats.find(s => s.id === id);
                                if (!seat) return null;
                                return <HallSeat key={id} seat={seat} setShowQuickView={setShowQuickView} />;
                              })}
                            </div>

                            <div className="absolute right-[3%] top-[52%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                              {[57, 58, 59, 60, 53, 54, 55, 56].map(id => {
                                const seat = seats.find(s => s.id === id);
                                if (!seat) return null;
                                return <HallSeat key={id} seat={seat} setShowQuickView={setShowQuickView} />;
                              })}
                            </div>

                            <div className="absolute right-[3%] top-[72%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                              {[49, 50, 51, 52, 45, 46, 47, 48].map(id => {
                                const seat = seats.find(s => s.id === id);
                                if (!seat) return null;
                                return <HallSeat key={id} seat={seat} setShowQuickView={setShowQuickView} />;
                              })}
                            </div>

                            <div className="absolute bottom-[0%] right-[3%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                              {[41, 42, 43, 44].map(id => {
                                const seat = seats.find(s => s.id === id);
                                if (!seat) return null;
                                return <HallSeat key={id} seat={seat} setShowQuickView={setShowQuickView} />;
                              })}
                            </div>

                            {/* ENTRY */}
                            <div className="absolute bottom-[2%] left-1/2 z-20 -translate-x-1/2 translate-y-1/2">
                              <div className="flex flex-col items-center">
                                <div className="mb-1 h-8 w-16 rounded-t-xl border-x-2 border-t-2 border-yellow-500/40 bg-yellow-500/10"></div>
                                <div className="rounded-full border border-yellow-500/30 bg-[#0b1220] px-5 py-1.5 text-[8px] font-black uppercase tracking-[0.3em] text-yellow-400 shadow-lg">
                                  ↑ Entry
                                </div>
                              </div>
                            </div>

                            {/* STAIRS */}
                            <div className="absolute right-[4%] top-[6%] hidden rounded-xl border border-purple-500/10 bg-purple-500/5 px-20 py-20 text-center lg:block">
                              <div className="mt-1 text-[7px] font-black uppercase tracking-widest text-purple-300">
                                Stairs
                              </div>
                            </div>
                          </div>

                          {/* FUTURE EXPANSION */}
                          {seats.some(seat => seat.id > 66) && (
                            <div className="mt-8 rounded-2xl border border-dashed border-yellow-500/20 bg-yellow-500/[0.03] p-4">
                              <div className="mb-3 flex items-center gap-2">
                                <span className="text-lg">＋</span>
                                <div>
                                  <p className="text-xs font-black uppercase tracking-widest text-yellow-400">
                                    New Seating Area
                                  </p>
                                  <p className="text-[10px] text-gray-500">
                                    Future added seats
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {seats
                                  .filter(seat => seat.id > 66)
                                  .map(seat => (
                                    <HallSeat
                                      key={seat.id}
                                      seat={seat}
                                      setShowQuickView={setShowQuickView}
                                    />
                                  ))}
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ---> PUBLIC: DETAILED SMART SEAT MAP (LUXURY GLASS ARCHITECTURE) <--- */}
              <div className="relative overflow-hidden rounded-[38px] border border-slate-800/90 bg-gradient-to-br from-[#0c1322] via-[#070b14] to-[#090f1d] p-6 sm:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.85)]">

                {/* Ambient Top Glow */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
                <div className="pointer-events-none absolute -top-24 right-10 w-96 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>

                <div className="flex items-center justify-between flex-wrap gap-4 mb-8 relative z-10">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-[3px] flex items-center gap-2.5">
                      <span>💺</span> SMART SEAT MAP
                    </h3>
                    <p className="text-slate-400 mt-1 text-xs sm:text-sm">Real-time intelligent seat monitoring &amp; validity dashboard</p>
                  </div>

                  {/* Legend Badges */}
                  <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs font-bold font-mono">
                    <div className="bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> AVAILABLE
                    </div>
                    <div className="bg-amber-500/10 border border-amber-400/40 text-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span> HALF DAY
                    </div>
                    <div className="bg-rose-500/10 border border-rose-400/40 text-rose-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span> FULL DAY
                    </div>
                    <div className="bg-indigo-500/10 border border-indigo-400/40 text-indigo-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span> 24 HOURS
                    </div>
                  </div>
                </div>

                {/* Grid of Seat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 relative z-10">
                  {currentSeats.map((seat) => (
                    <div
                      key={seat.id}
                      className={`group relative overflow-hidden rounded-[28px] p-5.5 min-h-[190px] text-white border border-white/10 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1.5 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${getSeatColor(seat.status)}`}
                    >
                      <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300"></span>

                      <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-[2px] opacity-80 font-bold font-mono">SEAT NUMBER</p>
                            <h4 className="text-3xl font-black leading-none font-mono mt-1 drop-shadow-md">{seat.id}</h4>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-black/25 backdrop-blur-md flex items-center justify-center text-base border border-white/20 shadow-inner">
                            {seat.status === 'Available' ? '✓' : '📘'}
                          </div>
                        </div>

                        <div className="mt-4 bg-black/35 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 shadow-inner">
                          <div className="flex justify-between items-end mb-2">
                            <div>
                              <p className="text-[9px] uppercase tracking-[1.5px] opacity-75 font-bold">Status</p>
                              <p className="font-black text-base leading-tight mt-0.5">{seat.status}</p>
                            </div>
                            <p className="text-[11px] opacity-90 text-right font-mono font-medium max-w-[55%] truncate">{seat.timing}</p>
                          </div>

                          {seat.status !== 'Available' && (
                            <div className="mt-2.5 pt-2.5 border-t border-white/15 space-y-1.5 text-[11px]">
                              {/* 24 HOURS */}
                              {seat.status === '24 Hours' ? (
                                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                                  <div className="flex justify-between items-center">
                                    <span className="opacity-80 whitespace-nowrap text-[10px]">🔒 24 Hours:</span>
                                    <span className="font-bold text-white truncate ml-2">
                                      {seat.nightStudent || "Booked"}
                                    </span>
                                  </div>
                                  {seat.nightStudent && (
                                    <div className="mt-1 text-[9px] text-slate-300 text-right opacity-80 border-t border-white/10 pt-1 font-mono">
                                      🗓 {seat.fromDate} To {seat.toDate}
                                    </div>
                                  )}
                                </div>
                              ) : seat.status === 'Full Day' ? (
                                <>
                                  <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center">
                                      <span className="opacity-80 whitespace-nowrap text-[10px]">🌅 Day (8 AM - 8 PM):</span>
                                      <span className="font-bold text-white truncate ml-2">
                                        {seat.fullDayStudent || "Available"}
                                      </span>
                                    </div>
                                    {seat.fullDayStudent && (
                                      <div className="mt-1 text-[9px] text-slate-300 text-right opacity-80 border-t border-white/10 pt-1 font-mono">
                                        🗓 {seat.fullDayFrom} To {seat.fullDayTo}
                                      </div>
                                    )}
                                  </div>

                                  <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center">
                                      <span className="opacity-80 whitespace-nowrap text-[10px]">🌙 Night (8 PM - 8 AM):</span>
                                      <span className={seat.nightStudent ? "font-bold text-white truncate ml-2" : "text-emerald-300 font-bold ml-2"}>
                                        {seat.nightStudent || "Available"}
                                      </span>
                                    </div>
                                    {seat.nightStudent && (
                                      <div className="mt-1 text-[9px] text-slate-300 text-right opacity-80 border-t border-white/10 pt-1 font-mono">
                                        🗓 {seat.nightFrom} To {seat.nightTo}
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center">
                                      <span className="opacity-80 whitespace-nowrap text-[10px]">🌅 8 AM - 2 PM:</span>
                                      <span className={seat.morningStudent ? "font-bold text-white truncate ml-2" : "text-emerald-300 font-bold ml-2"}>
                                        {seat.morningStudent || "Available"}
                                      </span>
                                    </div>
                                    {seat.morningStudent && (
                                      <div className="mt-1 text-[9px] text-slate-300 text-right opacity-80 border-t border-white/10 pt-1 font-mono">
                                        🗓 {seat.morningFrom} To {seat.morningTo}
                                      </div>
                                    )}
                                  </div>

                                  <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center">
                                      <span className="opacity-80 whitespace-nowrap text-[10px]">☀️ 2 PM - 8 PM:</span>
                                      <span className={seat.afternoonStudent ? "font-bold text-white truncate ml-2" : "text-emerald-300 font-bold ml-2"}>
                                        {seat.afternoonStudent || "Available"}
                                      </span>
                                    </div>
                                    {seat.afternoonStudent && (
                                      <div className="mt-1 text-[9px] text-slate-300 text-right opacity-80 border-t border-white/10 pt-1 font-mono">
                                        🗓 {seat.afternoonFrom} To {seat.afternoonTo}
                                      </div>
                                    )}
                                  </div>

                                  <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center">
                                      <span className="opacity-80 whitespace-nowrap text-[10px]">🌙 8 PM - 8 AM:</span>
                                      <span className={seat.nightStudent ? "font-bold text-white truncate ml-2" : "text-emerald-300 font-bold ml-2"}>
                                        {seat.nightStudent || "Available"}
                                      </span>
                                    </div>
                                    {seat.nightStudent && (
                                      <div className="mt-1 text-[9px] text-slate-300 text-right opacity-80 border-t border-white/10 pt-1 font-mono">
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

                {/* ---> PUBLIC: BOTTOM PAGINATION (ELEGANT FLOATING BAR) <--- */}
                <div className="sticky bottom-6 z-40 flex flex-wrap justify-center gap-3.5 mt-10 bg-[#070b14]/90 backdrop-blur-xl p-3.5 rounded-3xl border border-amber-400/30 shadow-[0_15px_50px_rgba(0,0,0,0.85)] max-w-fit mx-auto">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`${currentPage === i + 1
                          ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black scale-105 shadow-[0_0_20px_rgba(251,191,36,0.35)]"
                          : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white"
                        } min-w-[170px] px-6 py-3.5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95`}
                    >
                      <p className="text-[10px] uppercase tracking-[2px] opacity-80 font-bold">Explore Seats</p>
                      <h3 className="text-xl font-black font-mono">
                        {i * seatsPerPage + 1} - {Math.min((i + 1) * seatsPerPage, seats.length)}
                      </h3>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* ---> PUBLIC: PLANS SECTION <--- */}
            <Plans />

            {/* ---> PUBLIC: BOOKING MODAL POPUP <--- */}
            {showBookingPopup && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
                <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-10 border border-slate-100 text-slate-900">

                  {/* CLOSE BUTTON */}
                  <button
                    onClick={() => {
                      setShowBookingPopup(false);
                      setSelectedPlan("");
                      setSelectedTiming("");
                      setLockerOption("");
                      setTotalAmount(0);
                    }}
                    className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition"
                  >
                    ✕
                  </button>

                  {/* HEADER */}
                  <div className="mb-7 pr-10">
                    <p className="text-xs font-black uppercase tracking-widest text-indigo-600">
                      Any Time Library • Seat Concierge
                    </p>
                    <h2 className="mt-1 text-3xl font-black text-gray-900 tracking-tight">
                      Book Your Study Seat 🪑
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                      Select your preferred shift, plan, and timing to request instant seat booking.
                    </p>
                  </div>

                  {/* STUDENT DETAILS */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">Your Full Name</label>
                      <input
                        type="text"
                        id="bookingName"
                        placeholder="e.g., Aman Singh"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-indigo-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">WhatsApp Mobile Number</label>
                      <input
                        type="tel"
                        id="bookingPhone"
                        placeholder="10-digit mobile number"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-indigo-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        id="bookingEmail"
                        placeholder="yourname@gmail.com"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-indigo-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">Address / City</label>
                      <input
                        type="text"
                        id="bookingAddress"
                        placeholder="e.g., Bachhrawan, Raebareli"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-indigo-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* PLAN SELECTION */}
                  <div className="mt-6">
                    <label className="mb-2.5 block text-xs font-black uppercase tracking-wider text-gray-700">Select Subscription Plan</label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlan("Half Day");
                          setSelectedTiming("");
                          setLockerOption("");
                          setTotalAmount(0);
                        }}
                        className={`rounded-2xl border p-4 text-left transition ${selectedPlan === "Half Day"
                          ? "border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500 shadow-sm"
                          : "border-gray-200 bg-gray-50 hover:border-indigo-300"
                          }`}
                      >
                        <p className="font-black text-gray-900">Half Day (6 Hours)</p>
                        <p className="mt-1 text-xs text-gray-500">₹500 Without Locker</p>
                        <p className="mt-0.5 text-xs font-bold text-indigo-600">₹600 With Locker</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlan("Full Day");
                          setSelectedTiming("");
                          setLockerOption("");
                          setTotalAmount(0);
                        }}
                        className={`rounded-2xl border p-4 text-left transition ${selectedPlan === "Full Day"
                          ? "border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500 shadow-sm"
                          : "border-gray-200 bg-gray-50 hover:border-indigo-300"
                          }`}
                      >
                        <p className="font-black text-gray-900">Full Day (12 Hours)</p>
                        <p className="mt-1 text-xs text-gray-500">₹700 Without Locker</p>
                        <p className="mt-0.5 text-xs font-bold text-indigo-600">₹800 With Locker</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlan("Night");
                          setSelectedTiming("");
                          setLockerOption("");
                          setTotalAmount(0);
                        }}
                        className={`rounded-2xl border p-4 text-left transition ${selectedPlan === "Night"
                          ? "border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500 shadow-sm"
                          : "border-gray-200 bg-gray-50 hover:border-indigo-300"
                          }`}
                      >
                        <p className="font-black text-gray-900">Night Shift (8 PM - 8 AM)</p>
                        <p className="mt-1 text-xs text-gray-500">₹500 Without Locker</p>
                        <p className="mt-0.5 text-xs font-bold text-indigo-600">₹600 With Locker</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlan("24 Hours");
                          setSelectedTiming("24 Hours");
                          setLockerOption("Free Locker Included");
                          setTotalAmount(1000);
                        }}
                        className={`rounded-2xl border p-4 text-left transition ${selectedPlan === "24 Hours"
                          ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500 shadow-sm"
                          : "border-gray-200 bg-gray-50 hover:border-emerald-300"
                          }`}
                      >
                        <p className="font-black text-gray-900">24 Hours All Access</p>
                        <p className="mt-1 text-base font-black text-emerald-600">₹1000</p>
                        <p className="mt-0.5 text-xs font-bold text-emerald-600">🎁 Free Locker Included</p>
                      </button>
                    </div>
                  </div>

                  {/* LOCKER OPTION */}
                  {selectedPlan && selectedPlan !== "24 Hours" && (
                    <div className="mt-4">
                      <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">Locker Facility</label>
                      <select
                        value={lockerOption}
                        onChange={(e) => {
                          const value = e.target.value;
                          setLockerOption(value);
                          if (selectedPlan === "Half Day") setTotalAmount(value === "With Locker" ? 600 : 500);
                          if (selectedPlan === "Full Day") setTotalAmount(value === "With Locker" ? 800 : 700);
                          if (selectedPlan === "Night") setTotalAmount(value === "With Locker" ? 600 : 500);
                        }}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="">-- Choose Locker Option --</option>
                        <option value="Without Locker">Without Locker</option>
                        <option value="With Locker">With Locker (+₹100)</option>
                      </select>
                    </div>
                  )}

                  {/* TIMING */}
                  {selectedPlan && selectedPlan !== "24 Hours" && (
                    <div className="mt-4">
                      <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">Select Slot Timing</label>
                      <select
                        value={selectedTiming}
                        onChange={(e) => setSelectedTiming(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="">-- Choose Timing --</option>
                        {selectedPlan === "Half Day" && (
                          <>
                            <option value="Morning (8 AM - 2 PM)">Morning — 8 AM - 2 PM</option>
                            <option value="Afternoon (2 PM - 8 PM)">Afternoon — 2 PM - 8 PM</option>
                          </>
                        )}
                        {selectedPlan === "Full Day" && (
                          <option value="Full Day (8 AM - 8 PM)">Full Day — 8 AM - 8 PM</option>
                        )}
                        {selectedPlan === "Night" && (
                          <option value="Night (8 PM - 8 AM)">Night — 8 PM - 8 AM</option>
                        )}
                      </select>
                    </div>
                  )}

                  {/* 24 HOURS TIMING DISPLAY */}
                  {selectedPlan === "24 Hours" && (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="font-bold text-emerald-800 text-sm">⏰ Timing: 24 Hours Unrestricted Access</p>
                      <p className="mt-0.5 text-xs text-emerald-700">🎁 Free Locker Included With This Plan</p>
                    </div>
                  )}

                  {/* SEAT NUMBER */}
                  <div className="mt-4">
                    <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">Desired Seat Number (1 - 66)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      id="bookingSeat"
                      placeholder="e.g., 14"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* TOTAL PAYABLE */}
                  {totalAmount > 0 && (
                    <div className="mt-5 rounded-2xl bg-indigo-50/90 border border-indigo-100 p-5 text-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Payable Amount</p>
                      <p className="mt-1 text-3xl font-black text-indigo-700 font-mono">₹{totalAmount}</p>
                      <p className="mt-1 text-xs font-bold text-slate-600">{selectedPlan} • {lockerOption}</p>
                    </div>
                  )}

                  {/* PAYMENT DETAILS */}
                  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
                    <h3 className="text-sm font-black uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                      <span>💳</span> Payment Gateway Details
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 items-center">
                      <div className="bg-white p-4 rounded-xl border border-emerald-100 text-center shadow-sm">
                        <p className="text-xs font-bold text-gray-500 uppercase">Payment Phone Number</p>
                        <p className="mt-1 text-lg font-black text-gray-900 font-mono">9219384600</p>
                        <img className="mt-2 h-14 mx-auto object-contain" src={logo} alt="Library Logo" />
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-emerald-100 text-center shadow-sm">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Scan QR Code to Pay</p>
                        <img src={qr} alt="UPI QR Code" className="max-h-36 mx-auto rounded-xl shadow-sm" />
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-emerald-800 text-center font-medium">
                      Payment karne ke baad WhatsApp par screenshot aur details bhej kar seat confirm karwayein.
                    </p>
                  </div>

                  {/* WHATSAPP SUBMISSION BUTTON */}
                  <button
                    onClick={() => {
                      const name = document.getElementById("bookingName").value.trim();
                      const phone = document.getElementById("bookingPhone").value.trim();
                      const email = document.getElementById("bookingEmail").value.trim();
                      const address = document.getElementById("bookingAddress").value.trim();
                      const seat = document.getElementById("bookingSeat").value.trim();

                      if (
                        !name ||
                        !phone ||
                        !email ||
                        !address ||
                        !seat ||
                        !selectedPlan ||
                        !selectedTiming ||
                        !lockerOption ||
                        !totalAmount
                      ) {
                        alert("Please fill all booking details first.");
                        return;
                      }

                      const phoneRegex = /^[0-9]{10}$/;
                      if (!phoneRegex.test(phone)) {
                        alert("Enter a valid 10-digit mobile number.");
                        return;
                      }

                      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
                      if (!gmailRegex.test(email)) {
                        alert("Enter a valid Gmail address (Ex: yourname@gmail.com).");
                        return;
                      }

                      const message = `
*🔥 ANY TIME LIBRARY - SEAT BOOKING REQUEST 🔥*

👤 *Name:* ${name}
📱 *WhatsApp Number:* ${phone}
📧 *Email:* ${email}
🏠 *Address:* ${address}

💺 *Seat Number:* ${seat}

📋 *Plan:* ${selectedPlan}
⏰ *Timing:* ${selectedTiming}
🔐 *Locker:* ${lockerOption}

💰 *Total Amount:* ₹${totalAmount}

💳 *Payment Number:* 9161310909
🆔 *UPI ID:* gurpratap2611-@okhdfcbank

📸 *Payment Screenshot:*
I will attach the payment screenshot here.

Please check and confirm my seat booking.
                      `;

                      const whatsappUrl = `https://wa.me/9161310909?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                    className="mt-6 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-4 text-base font-black text-white shadow-xl shadow-emerald-600/30 transition hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>💬</span> Send Booking Request on WhatsApp
                  </button>

                </div>
              </div>
            )}

            {/* ================= RESOURCE HUB & UPDATES ================= */}
            <section id="features" className="relative bg-[#080d18] px-4 md:px-6 py-20 text-white border-t border-slate-800/80">
              <div className="mx-auto max-w-5xl">
                <div className="mb-12 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-3">
                    Curated Materials
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                    Resource Hub &amp; Student Updates
                  </h2>
                  
                  {/* Resource Hub Subtitle (FIXED: 100% FORCED CENTER ON LAPTOP & MOBILE) */}
                  <p 
                    className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto text-center !text-center w-full"
                    style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto", display: "block" }}
                  >
                    Direct access to official examination portals, daily current affairs, and archival knowledge.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* UPSC CURRENT AFFAIRS */}
                  <a
                    href="https://visionias.in/current-affairs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-slate-800 bg-[#0c1424] p-7 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/50 hover:bg-[#111b30] flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-4 text-4xl group-hover:scale-110 transition-transform inline-block">📰</div>
                      <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">UPSC Current Affairs</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">Daily news and analytical editorial digests from Vision IAS.</p>
                    </div>
                    <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1 font-mono">Open Portal ↗</span>
                  </a>

                  {/* EMPLOYMENT NEWS */}
                  <a
                    href="https://employmentnews.gov.in/NewEmp/Home.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-slate-800 bg-[#0c1424] p-7 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/50 hover:bg-[#111b30] flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-4 text-4xl group-hover:scale-110 transition-transform inline-block">🗞️</div>
                      <h3 className="text-lg font-black text-white group-hover:text-purple-400 transition-colors">Employment News</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">Official government gazette and central notifications.</p>
                    </div>
                    <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1 font-mono">Open Portal ↗</span>
                  </a>

                  {/* LATEST JOB UPDATES */}
                  <a
                    href="https://sarkariresult.com.cm/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-slate-800 bg-[#0c1424] p-7 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-pink-500/50 hover:bg-[#111b30] flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-4 text-4xl group-hover:scale-110 transition-transform inline-block">💼</div>
                      <h3 className="text-lg font-black text-white group-hover:text-pink-400 transition-colors">Latest Job Updates</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">Real-time state and central recruitment tracking alerts.</p>
                    </div>
                    <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1 font-mono">Open Portal ↗</span>
                  </a>

                  {/* UPSC PDF MATERIALS */}
                  <a
                    href="https://www.pdfnotes.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-slate-800 bg-[#0c1424] p-7 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:bg-[#111b30] flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-4 text-4xl group-hover:scale-110 transition-transform inline-block">📄</div>
                      <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">UPSC PDF Materials</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">Direct repository of standard book notes and test series.</p>
                    </div>
                    <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 font-mono">Open Portal ↗</span>
                  </a>

                  {/* UPSC FORMS & DOWNLOADS */}
                  <a
                    href="https://www.upsc.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-slate-800 bg-[#0c1424] p-7 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/50 hover:bg-[#111b30] flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-4 text-4xl group-hover:scale-110 transition-transform inline-block">📋</div>
                      <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">UPSC Forms &amp; Downloads</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">Official application guidelines, admit cards, and notices.</p>
                    </div>
                    <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 font-mono">Open Portal ↗</span>
                  </a>

                  {/* INTERNET ARCHIVE */}
                  <a
                    href="https://archive.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-slate-800 bg-[#0c1424] p-7 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/50 hover:bg-[#111b30] flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-4 text-4xl group-hover:scale-110 transition-transform inline-block">🗃️</div>
                      <h3 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors">Internet Archive</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">Global non-profit digital library of millions of free books.</p>
                    </div>
                    <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1 font-mono">Open Portal ↗</span>
                  </a>
                </div>
              </div>
            </section>

            {/* ---> PUBLIC: FOOTER <--- */}
            <Footer />

            {/* FLOATING WHATSAPP INQUIRY BUTTON */}
            <a
              href="https://wa.me/9161310909?text=Hi%20Anytime%20Library%2C%20I%20want%20to%20know%20more%20about%20the%20library."
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-emerald-400/40 bg-[#0b1220]/95 backdrop-blur-md px-4 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-emerald-400 sm:bottom-6 sm:right-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366] shadow-lg shadow-emerald-500/30">
                <svg
                  viewBox="0 0 32 32"
                  className="h-6 w-6 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 3C8.83 3 3 8.83 3 16c0 2.3.6 4.55 1.74 6.53L3 29l6.67-1.7A12.94 12.94 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16 3Zm0 23.64c-2.04 0-4.03-.55-5.77-1.59l-.41-.24-3.96 1.01 1.06-3.86-.27-.4A10.6 10.6 0 0 1 5.36 16C5.36 10.12 10.12 5.36 16 5.36S26.64 10.12 26.64 16 21.88 26.64 16 26.64Zm5.83-7.94c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.68.08-1.89-.94-3.13-1.68-4.38-3.81-.33-.57.33-.53.94-1.76.1-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.76.75.32 1.34.51 1.8.65.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
                </svg>
              </div>

              <div className="hidden pr-1 sm:block text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct WhatsApp</p>
                <p className="text-xs font-black text-white">Anytime Inquiry</p>
              </div>
            </a>
          </div>

        </div>
      )}
    </>
  );
}