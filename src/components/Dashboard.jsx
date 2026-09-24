import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

// =====================================================
// 🔒 LOCKER SEAT NUMBERS
// =====================================================
const lockerSeats = [
  1, 2, 3, 4, 5, 6, 7, 8,
  33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48,
  57, 58, 59, 60, 61, 62, 63, 64
];

// =====================================================
// 💺 HALL SEAT COMPONENT (MAP VIEW)
// =====================================================
const HallSeat = ({ seat, vertical = false }) => {
  let isFullyBooked = false;
  let onlyNightAvailable = false;
  let halfDayPartial = false;

  if (seat.status === "24 Hours") {
    isFullyBooked = !!seat.nightStudent;
  } else if (seat.status === "Full Day") {
    const dayFull = !!seat.fullDayStudent;
    const nightFull = !!seat.nightStudent;
    isFullyBooked = dayFull && nightFull;
    if (dayFull && !nightFull) {
      onlyNightAvailable = true;
    }
  } else if (seat.status === "Half Day") {
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

  const bgClass = isFullyBooked
    ? "bg-red-500 border-red-500/50 shadow-[0_0_14px_rgba(239,68,68,0.3)]"
    : halfDayPartial
      ? "bg-gradient-to-br from-green-500 via-yellow-400 to-red-500 border-yellow-500/50 shadow-[0_0_14px_rgba(250,204,21,0.25)]"
      : onlyNightAvailable
        ? "bg-gradient-to-br from-green-400 via-red-600 to-[#07130c] border-green-300/40 shadow-[0_0_14px_rgba(34,197,94,0.22)]"
        : "bg-gradient-to-br from-green-400 via-green-600 to-green-700 border-green-300/40 shadow-[0_0_12px_rgba(34,197,94,0.2)]";

  return (
    <div
      title={`Seat ${seat.id} • ${seat.status}`}
      className={`
        group relative
        flex items-center justify-center
        ${vertical ? "min-h-[42px]" : "aspect-[1.35/1]"}
        cursor-pointer
        overflow-hidden
        rounded-md sm:rounded-lg
        border
        ${bgClass}
        text-[10px] font-black text-white
        transition-all duration-200
        hover:-translate-y-0.5
        hover:scale-[1.05]
        hover:brightness-110
        active:scale-95
      `}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent"></span>
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
          ${isFullyBooked ? "bg-red-200" : "bg-green-100"}
          opacity-80
        `}
      ></span>
    </div>
  );
};

const Dashboard = ({ seats = [], onToggleSeatVisibility, onNavigateToAccounts, theme = "dark" }) => {
  const isLight = theme === "light";

  // State for Seat Map Popup Modal
  const [showSeatMapModal, setShowSeatMapModal] = useState(false);
  // State for highlighting pending section on jump
  const [highlightPending, setHighlightPending] = useState(false);

  // =====================================================
  // ⭐ REAL-TIME REVIEWS & TESTIMONIALS STATE
  // =====================================================
  const [dashboardFeedbacks, setDashboardFeedbacks] = useState([]);

  useEffect(() => {
    try {
      const feedbackRef = collection(db, "feedbacks");
      const unsubscribe = onSnapshot(feedbackRef, (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        // Sort newest first
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setDashboardFeedbacks(list);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Feedback fetch error:", err);
    }
  }, []);

  const handleToggleFeedbackLive = async (feedbackId, currentStatus) => {
    try {
      const fbRef = doc(db, "feedbacks", feedbackId);
      await updateDoc(fbRef, { isApproved: !currentStatus });
    } catch (err) {
      console.error("Toggle live error:", err);
      alert("Status update karne me problem aayi.");
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Kya aap is review ko hamesha ke liye delete karna chahte hain?")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "feedbacks", feedbackId));
    } catch (err) {
      console.error("Delete review error:", err);
      alert("Review delete karne me error aayi.");
    }
  };

  // =====================================================
  // VISIBLE SEATS
  // =====================================================
  const visibleSeats = seats.filter(
    (seat) => seat.isVisible !== false
  );

  // =====================================================
  // BASIC SEAT DATA
  // =====================================================
  const totalSeats = visibleSeats.length;

  const availableSeats = visibleSeats.filter(
    (seat) => seat.status === "Available"
  ).length;

  const occupiedSeats = totalSeats - availableSeats;

  // =====================================================
  // ACTIVE STUDENTS (Exact: Submitted + Pending Only)
  // =====================================================
  const activeStudents = visibleSeats.reduce((total, seat) => {
    if (seat.status === "Available") return total;

    const shifts = [
      { name: seat.morningStudent, payment: seat.morningPayment },
      { name: seat.afternoonStudent, payment: seat.afternoonPayment },
      { name: seat.nightStudent, payment: seat.nightPayment },
      { name: seat.fullDayStudent, payment: seat.fullDayPayment },
    ];

    const validCount = shifts.filter(
      (s) =>
        s.name &&
        s.name.trim() !== "" &&
        (s.payment === "Submitted" || s.payment === "Pending")
    ).length;

    return total + validCount;
  }, 0);

  // =====================================================
  // FEES DUE
  // =====================================================
  const feesDue = visibleSeats.reduce((total, seat) => {
    const payments = [
      seat.morningPayment,
      seat.afternoonPayment,
      seat.nightPayment,
      seat.fullDayPayment,
    ];

    return (
      total +
      payments.filter(
        (payment) => payment === "Pending"
      ).length
    );
  }, 0);

  // =====================================================
  // PLAN COUNTS
  // =====================================================
  const halfDaySeats = visibleSeats.filter(
    (seat) => seat.status === "Half Day"
  ).length;

  const fullDaySeats = visibleSeats.filter(
    (seat) => seat.status === "Full Day"
  ).length;

  const twentyFourSeats = visibleSeats.filter(
    (seat) => seat.status === "24 Hours"
  ).length;

  // =====================================================
  // MONTH AND YEAR INFORMATION
  // =====================================================
  const today = new Date();
  const currentMonthIndex = today.getMonth();
  const currentYear = today.getFullYear();
  const currentMonthName = today.toLocaleString("default", {
    month: "long",
  });

  // =====================================================
  // ALL STUDENTS COLLECTION DATA (Submitted fees only)
  // =====================================================
  const allCollections = [];

  visibleSeats.forEach((seat) => {
    const addCollection = (name, plan, payment, amount, paidDate, fromDate, toDate, phone, entryType) => {
      if (!name || payment !== "Submitted") return;

      allCollections.push({
        name,
        seat: seat.id,
        plan,
        amount: Number(amount) || 0,
        date: paidDate || fromDate || "",
        fromDate: fromDate || "",
        toDate: toDate || "",
        phone: phone || "",
        payment,
        entryType: entryType || "New Admission",
      });
    };

    // Morning Shift
    addCollection(
      seat.morningStudent,
      "Morning",
      seat.morningPayment,
      seat.morningAmount || seat.morningFee,
      seat.morningPaidDate,
      seat.morningFrom,
      seat.morningTo,
      seat.morningPhone,
      seat.morningEntryType
    );

    // Afternoon Shift
    addCollection(
      seat.afternoonStudent,
      "Afternoon",
      seat.afternoonPayment,
      seat.afternoonAmount || seat.afternoonFee,
      seat.afternoonPaidDate,
      seat.afternoonFrom,
      seat.afternoonTo,
      seat.afternoonPhone,
      seat.afternoonEntryType
    );

    // Night Shift & 24 Hours Plan
    addCollection(
      seat.nightStudent,
      seat.status === "24 Hours" ? "24 Hours" : "Night",
      seat.nightPayment,
      seat.nightAmount || seat.nightFee,
      seat.nightPaidDate,
      seat.nightFrom,
      seat.nightTo,
      seat.nightPhone,
      seat.nightEntryType
    );

    // Full Day Shift
    addCollection(
      seat.fullDayStudent,
      "Full Day",
      seat.fullDayPayment,
      seat.fullDayAmount || seat.fullDayFee,
      seat.fullDayPaidDate,
      seat.fullDayFrom,
      seat.fullDayTo,
      seat.fullDayPhone,
      seat.fullDayEntryType
    );
  });

  // STRICT FILTER: Current month collection
  const monthlyCollections = allCollections.filter((student) => {
    if (!student.date || student.date === "0-0-0") return false;

    const collectionDate = new Date(student.date);
    return (
      collectionDate.getMonth() === currentMonthIndex &&
      collectionDate.getFullYear() === currentYear
    );
  });

  const monthlyTotal = monthlyCollections.reduce(
    (total, student) => total + student.amount,
    0
  );

  // =====================================================
  // MONTH NAMES & YEARLY COLLECTIONS
  // =====================================================
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const yearlyCollections = monthNames
    .map((month, monthIndex) => {
      const monthTotal = allCollections
        .filter((student) => {
          if (!student.date) {
            return monthIndex === currentMonthIndex;
          }
          const collectionDate = new Date(student.date);
          return (
            collectionDate.getMonth() === monthIndex &&
            collectionDate.getFullYear() === currentYear
          );
        })
        .reduce((total, student) => total + student.amount, 0);

      const monthYear = `${month} ${currentYear}`;
      return {
        month: monthYear,
        monthIndex: monthIndex,
        year: currentYear,
        amount: monthTotal,
      };
    })
    .filter((item) => item.amount > 0);

  const totalYearlyCollection = yearlyCollections.reduce(
    (total, item) => total + item.amount,
    0
  );

  const yearlyTotal = yearlyCollections.reduce(
    (total, item) => total + item.amount,
    0
  );

  // =====================================================
  // PENDING STUDENTS LIST
  // =====================================================
  const pendingStudents = [];

  visibleSeats.forEach((seat) => {
    // MORNING SHIFT
    if (seat.morningPayment === "Pending") {
      pendingStudents.push({
        name: seat.morningStudent || `Seat ${seat.id} - Morning`,
        seat: seat.id,
        plan: "Morning",
        phone: seat.morningPhone || seat.phone || "",
        toDate: seat.morningTo || "",
        amount: seat.morningAmount || "",
      });
    }

    // AFTERNOON SHIFT
    if (seat.afternoonPayment === "Pending") {
      pendingStudents.push({
        name: seat.afternoonStudent || `Seat ${seat.id} - Afternoon`,
        seat: seat.id,
        plan: "Afternoon",
        phone: seat.afternoonPhone || seat.phone || "",
        toDate: seat.afternoonTo || "",
        amount: seat.afternoonAmount || "",
      });
    }

    // NIGHT SHIFT (Half Day / Full Day)
    if (seat.nightPayment === "Pending" && seat.status !== "24 Hours") {
      pendingStudents.push({
        name: seat.nightStudent || `Seat ${seat.id} - Night`,
        seat: seat.id,
        plan: "Night",
        phone: seat.nightPhone || seat.phone || "",
        toDate: seat.nightTo || "",
        amount: seat.nightAmount || "",
      });
    }

    // FULL DAY
    if (seat.fullDayPayment === "Pending") {
      pendingStudents.push({
        name: seat.fullDayStudent || `Seat ${seat.id} - Full Day`,
        seat: seat.id,
        plan: "Full Day",
        phone: seat.fullDayPhone || seat.phone || "",
        toDate: seat.fullDayTo || seat.toDate || "",
        amount: seat.fullDayAmount || "",
      });
    }

    // 24 HOURS
    if (seat.nightPayment === "Pending" && seat.status === "24 Hours") {
      pendingStudents.push({
        name: seat.nightStudent || `Seat ${seat.id} - 24 Hours`,
        seat: seat.id,
        plan: "24 Hours",
        phone: seat.nightPhone || seat.phone || "",
        toDate: seat.nightTo || seat.toDate || "",
        amount: seat.nightAmount || "",
      });
    }
  });

  // =====================================================
  // ⚡ CLICK TO SMOOTH SCROLL TO PENDING FEES
  // =====================================================
  const scrollToPendingFees = () => {
    const section = document.getElementById("pending-fees-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlightPending(true);
      setTimeout(() => setHighlightPending(false), 2000);
    }
  };

  // =====================================================
  // 📲 1-CLICK WHATSAPP FEE REMINDER FUNCTION
  // =====================================================
  const sendWhatsAppReminder = (student) => {
    let cleanPhone = (student.phone || "").replace(/\D/g, "");

    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      alert(`Student (${student.name}) ka valid mobile number save nahi hai!`);
      return;
    }

    const message = `*Dear ${student.name},*

Greetings from *ANY TIME LIBRARY*! 📚

This is a gentle reminder that your monthly library seat subscription is due for *pending fees*.

📌 *Membership Details:*
• *Seat Number:* Seat ${student.seat}
• *Shift / Plan:* ${student.plan}
• *Pending Fees:* ₹${student.amount || 0}

🔍 *Apni seat online live check karne ke liye visit karein:*
👉 https://anytime-library-ruddy.vercel.app/

And don't forget to follow us on Instagram for the latest updates and offers:
👉 https://www.instagram.com/anytime_library/

To ensure your seat reservation continues without interruption, kindly complete your fee renewal at your earliest convenience.

💳 *Payment Options:*

1️⃣ *Online Payment:*
• *UPI ID:* gurpratap2611-@okhdfcbank
• *GPay / PhonePe / Paytm:* 9219384600
_(Kindly share the payment screenshot here once done)_

2️⃣ *Cash Payment:*
• You can also deposit the fee in cash directly at the library management staff.

Thank you for choosing Any Time Library for your studies!

Warm regards,  
*Management Team*  
*Any Time Library*`;

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className={`w-full pb-14 font-sans antialiased space-y-7 transition-colors ${
      isLight ? "text-slate-900" : "text-slate-100"
    }`}>
      {/* ================================================= */}
      {/* DASHBOARD HEADER */}
      {/* ================================================= */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b ${
        isLight ? "border-white/50" : "border-slate-800/80"
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]"></span>
            <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isLight ? "text-sky-800" : "text-amber-400"}`}>
              Anytime Library
            </span>
          </div>
          <h2 className={`text-3xl font-black tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
            Admin <span className={`text-transparent bg-clip-text ${
              isLight ? "bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600" : "bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400"
            }`}>Dashboard</span>
          </h2>
          <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
            Live overview of seats, students and payments.
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* MAIN SUMMARY CARDS (DYNAMIC SWEEP SHINE & GLOW) */}
      {/* ================================================= */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        
        {/* TOTAL SEATS */}
        <div
          onClick={() => setShowSeatMapModal(true)}
          role="button"
          tabIndex={0}
          title="Click to view full hall seat map"
          className={`group relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer active:scale-95 ${
            isLight
              ? "bg-white/35 backdrop-blur-2xl border-white/80 shadow-[0_8px_32px_rgba(14,165,233,0.12)] hover:border-white hover:shadow-[0_15px_40px_rgba(14,165,233,0.25)]"
              : "border-slate-800 bg-[#0b1120] hover:border-slate-600 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] shadow-xl"
          }`}
        >
          {/* ⚡ SHINE LASER SWEEP BEAM */}
          <span className={`pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full ${
            isLight ? "via-white/50" : "via-white/10"
          }`}></span>

          <div className={`flex items-center justify-between text-xs font-bold ${isLight ? "text-slate-700" : "text-slate-400"}`}>
            <span>Total Seats</span>
            <span className="text-sm opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">🪑</span>
          </div>
          <h3 className={`mt-2 text-3xl font-black font-mono tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
            {totalSeats}
          </h3>
          <p className={`mt-2 text-[11px] font-medium flex items-center justify-between ${isLight ? "text-slate-600" : "text-slate-500"}`}>
            <span>Active visible seats</span>
            <span className="text-sky-600 dark:text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">Map ↗</span>
          </p>
        </div>

        {/* AVAILABLE SEATS */}
        <div
          onClick={() => setShowSeatMapModal(true)}
          role="button"
          tabIndex={0}
          title="Click to view full hall seat map"
          className={`group relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer active:scale-95 ${
            isLight
              ? "bg-white/35 backdrop-blur-2xl border-emerald-300/70 shadow-[0_8px_32px_rgba(16,185,129,0.12)] hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              : "border-emerald-500/40 bg-[#0b1120] hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] shadow-xl"
          }`}
        >
          {/* ⚡ SHINE LASER SWEEP BEAM */}
          <span className={`pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full ${
            isLight ? "via-emerald-300/50" : "via-emerald-400/25"
          }`}></span>

          <div className={`flex items-center justify-between text-xs font-bold ${isLight ? "text-emerald-800" : "text-emerald-400"}`}>
            <span>Available</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h3 className={`mt-2 text-3xl font-black font-mono tracking-tight ${isLight ? "text-emerald-800" : "text-emerald-400"}`}>
            {availableSeats}
          </h3>
          <p className={`mt-2 text-[11px] font-medium flex items-center justify-between ${isLight ? "text-emerald-700" : "text-emerald-500/80"}`}>
            <span>Seats ready for booking</span>
            <span className="font-bold group-hover:translate-x-0.5 transition-transform">Map ↗</span>
          </p>
        </div>

        {/* OCCUPIED SEATS */}
        <div
          onClick={() => setShowSeatMapModal(true)}
          role="button"
          tabIndex={0}
          title="Click to view live hall seat map"
          className={`group relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer active:scale-95 ${
            isLight
              ? "bg-white/35 backdrop-blur-2xl border-rose-300/70 shadow-[0_8px_32px_rgba(244,63,94,0.12)] hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]"
              : "border-rose-500/40 bg-gradient-to-br from-rose-500/[0.08] via-[#0b1120] to-[#0b1120] hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] shadow-xl"
          }`}
        >
          {/* ⚡ SHINE LASER SWEEP BEAM */}
          <span className={`pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-rose-400/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full ${
            isLight ? "via-rose-300/50" : "via-rose-500/25"
          }`}></span>

          <div className={`flex items-center justify-between text-xs font-bold ${isLight ? "text-rose-800" : "text-rose-400"}`}>
            <span>Occupied</span>
            <span className="text-xs font-bold font-mono">
              {totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0}%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className={`text-3xl font-black font-mono tracking-tight ${isLight ? "text-rose-800" : "text-rose-400"}`}>
              {occupiedSeats}
            </h3>
            <span className={`text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5 ${
              isLight ? "text-rose-700" : "text-rose-400"
            }`}>
              Seat Map <span>↗</span>
            </span>
          </div>
          <p className={`mt-2 text-[11px] font-medium flex items-center justify-between ${isLight ? "text-rose-700" : "text-rose-400/80"}`}>
            <span>Currently assigned</span>
            <span className="underline decoration-dotted text-[10px] font-bold">Click to view map</span>
          </p>
        </div>

        {/* FEES PENDING */}
        <div
          onClick={scrollToPendingFees}
          role="button"
          tabIndex={0}
          title="Click to jump directly to pending students list"
          className={`group relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer active:scale-95 ${
            isLight
              ? "bg-white/35 backdrop-blur-2xl border-amber-300/80 shadow-[0_8px_32px_rgba(245,158,11,0.14)] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]"
              : "border-amber-400/40 bg-gradient-to-br from-amber-500/[0.08] via-[#0b1120] to-[#0b1120] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(251,191,36,0.35)] shadow-xl"
          }`}
        >
          {/* ⚡ SHINE LASER SWEEP BEAM */}
          <span className={`pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-400/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full ${
            isLight ? "via-amber-300/60" : "via-amber-400/25"
          }`}></span>

          <div className={`flex items-center justify-between text-xs font-bold ${isLight ? "text-amber-900" : "text-amber-400"}`}>
            <span>Fees Pending</span>
            <span className="text-xs group-hover:scale-125 transition-transform">⚠️</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className={`text-3xl font-black font-mono tracking-tight ${isLight ? "text-amber-900" : "text-amber-400"}`}>
              {feesDue}
            </h3>
            <span className={`text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5 ${
              isLight ? "text-amber-800" : "text-amber-400/80"
            }`}>
              View List <span>↓</span>
            </span>
          </div>
          <p className={`mt-2 text-[11px] font-medium flex items-center justify-between ${isLight ? "text-amber-800" : "text-amber-400/80"}`}>
            <span>Pending payment entries</span>
            <span className="underline decoration-dotted text-[10px] font-bold">Click to jump</span>
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* SECONDARY SUMMARY (GLASS CAPSULES WITH SHINE) */}
      {/* ================================================= */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* ACTIVE STUDENTS */}
        <div className={`group relative overflow-hidden rounded-3xl border p-4.5 transition-all duration-300 hover:-translate-y-1 ${
          isLight 
            ? "bg-white/35 backdrop-blur-2xl border-white/80 shadow-sm hover:shadow-lg hover:border-blue-300" 
            : "border-slate-800 bg-[#090e1a] shadow-md hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        }`}>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blue-400/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
          <p className={`text-xs font-bold ${isLight ? "text-slate-600" : "text-slate-400"}`}>Active Students</p>
          <h3 className={`mt-1.5 text-2xl font-black font-mono ${isLight ? "text-blue-700" : "text-blue-400"}`}>
            {activeStudents}
          </h3>
          <p className={`text-[10px] mt-1 ${isLight ? "text-slate-500 font-medium" : "text-slate-500"}`}>Submitted + pending members</p>
        </div>

        {/* HALF DAY */}
        <div className={`group relative overflow-hidden rounded-3xl border p-4.5 transition-all duration-300 hover:-translate-y-1 ${
          isLight 
            ? "bg-white/35 backdrop-blur-2xl border-white/80 shadow-sm hover:shadow-lg hover:border-purple-300" 
            : "border-slate-800 bg-[#090e1a] shadow-md hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
        }`}>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-purple-400/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
          <p className={`text-xs font-bold ${isLight ? "text-slate-600" : "text-slate-400"}`}>Half Day Seats</p>
          <h3 className={`mt-1.5 text-2xl font-black font-mono ${isLight ? "text-purple-700" : "text-purple-400"}`}>
            {halfDaySeats}
          </h3>
          <p className={`text-[10px] mt-1 ${isLight ? "text-slate-500 font-medium" : "text-slate-500"}`}>Morning & afternoon slots</p>
        </div>

        {/* FULL DAY */}
        <div className={`group relative overflow-hidden rounded-3xl border p-4.5 transition-all duration-300 hover:-translate-y-1 ${
          isLight 
            ? "bg-white/35 backdrop-blur-2xl border-white/80 shadow-sm hover:shadow-lg hover:border-sky-300" 
            : "border-slate-800 bg-[#090e1a] shadow-md hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        }`}>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-sky-400/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
          <p className={`text-xs font-bold ${isLight ? "text-slate-600" : "text-slate-400"}`}>Full Day Seats</p>
          <h3 className={`mt-1.5 text-2xl font-black font-mono ${isLight ? "text-sky-700" : "text-cyan-400"}`}>
            {fullDaySeats}
          </h3>
          <p className={`text-[10px] mt-1 ${isLight ? "text-slate-500 font-medium" : "text-slate-500"}`}>Day long dedicated seats</p>
        </div>

        {/* 24 HOURS */}
        <div className={`group relative overflow-hidden rounded-3xl border p-4.5 transition-all duration-300 hover:-translate-y-1 ${
          isLight 
            ? "bg-white/35 backdrop-blur-2xl border-white/80 shadow-sm hover:shadow-lg hover:border-amber-300" 
            : "border-slate-800 bg-[#090e1a] shadow-md hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]"
        }`}>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-400/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
          <p className={`text-xs font-bold ${isLight ? "text-slate-600" : "text-slate-400"}`}>24 Hours</p>
          <h3 className={`mt-1.5 text-2xl font-black font-mono ${isLight ? "text-indigo-700" : "text-orange-400"}`}>
            {twentyFourSeats}
          </h3>
          <p className={`text-[10px] mt-1 ${isLight ? "text-slate-500 font-medium" : "text-slate-500"}`}>Round-the-clock access</p>
        </div>
      </div>

      {/* ================================================= */}
      {/* RECORDS SECTION: MONTHLY + YEARLY */}
      {/* ================================================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 items-stretch">
        {/* MONTHLY RECORDS */}
        <div className={`flex flex-col justify-between overflow-hidden rounded-[32px] border transition-all duration-300 ${
          isLight ? "bg-white/35 backdrop-blur-2xl border-white/80 shadow-[0_8px_32px_rgba(14,165,233,0.08)] hover:shadow-[0_15px_40px_rgba(14,165,233,0.18)]" : "border-slate-800 bg-[#0b1120] shadow-xl hover:border-slate-700"
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b p-5 ${
              isLight ? "border-white/40" : "border-slate-800"
            }`}>
              <div>
                <h3 className={`font-black text-base tracking-tight flex items-center gap-2 ${
                  isLight ? "text-slate-900" : "text-white"
                }`}>
                  <span>📅</span> Monthly Records
                </h3>
                <p className={`mt-0.5 text-xs ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                  {currentMonthName} {currentYear} Collection
                </p>
              </div>

              <span className={`rounded-2xl border px-3 py-1 text-xs font-black font-mono ${
                isLight ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-800 backdrop-blur-md" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              }`}>
                ₹{monthlyTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* MONTHLY STUDENT LIST */}
            <div className="max-h-[350px] overflow-y-auto p-3 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-sky-400/50">
              {monthlyCollections.length === 0 ? (
                <div className={`p-12 text-center ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                  <div className="text-3xl mb-2 opacity-50">📭</div>
                  <p className="text-xs font-medium">
                    No collection recorded this month.
                  </p>
                </div>
              ) : (
                monthlyCollections.map((student, index) => (
                  <div
                    key={`${student.name}-${student.seat}-${index}`}
                    className={`group relative overflow-hidden flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-200 ${
                      isLight
                        ? "bg-white/45 backdrop-blur-md border-white/70 hover:bg-white/70 hover:shadow-md"
                        : "bg-[#080d16] border-slate-800/80 hover:border-slate-700 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    }`}
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl font-mono font-black flex items-center justify-center text-xs shrink-0 ${
                        isLight ? "bg-white/80 border border-white/90 text-amber-700 shadow-sm" : "bg-slate-800 border border-slate-700 text-amber-400"
                      }`}>
                        {student.seat}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`font-bold text-sm leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>{student.name}</p>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                            student.entryType === "Renewal"
                              ? (isLight ? "bg-blue-500/15 text-blue-800 border-blue-300/60" : "bg-blue-500/10 text-blue-400 border-blue-500/30")
                              : (isLight ? "bg-emerald-500/15 text-emerald-800 border-emerald-300/60" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30")
                          }`}>
                            {student.entryType}
                          </span>
                        </div>
                        <p className={`text-[11px] mt-0.5 font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                          {student.plan} • Paid On: <span className={`font-mono font-bold ${isLight ? "text-amber-800" : "text-amber-300"}`}>{student.date}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <p className={`font-black text-sm ${isLight ? "text-emerald-800" : "text-emerald-400"}`}>
                        ₹{student.amount.toLocaleString("en-IN")}
                      </p>
                      <span className={`inline-block text-[9px] uppercase font-bold tracking-wider ${isLight ? "text-emerald-700 font-bold" : "text-emerald-500/80"}`}>
                        Verified
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* MONTHLY FOOTER */}
          <div className={`border-t p-5 ${
            isLight ? "border-white/40 bg-white/20 backdrop-blur-md" : "border-slate-800 bg-[#080d16]/80"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  Total Monthly Collection
                </p>
                <p className={`mt-0.5 text-2xl font-black font-mono ${isLight ? "text-emerald-800" : "text-emerald-400"}`}>
                  ₹{monthlyTotal.toLocaleString("en-IN")}
                </p>
              </div>

              <div className={`rounded-2xl border px-3.5 py-1.5 text-center font-mono ${
                isLight ? "bg-white/60 backdrop-blur-md border-white/80 shadow-sm" : "border-slate-800 bg-slate-900"
              }`}>
                <p className={`text-base font-black ${isLight ? "text-emerald-800" : "text-emerald-400"}`}>
                  {monthlyCollections.length}
                </p>
                <p className={`text-[9px] uppercase font-bold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  Students
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* YEARLY RECORDS */}
        <div className={`flex flex-col justify-between overflow-hidden rounded-[32px] border transition-all duration-300 ${
          isLight ? "bg-white/35 backdrop-blur-2xl border-white/80 shadow-[0_8px_32px_rgba(14,165,233,0.08)] hover:shadow-[0_15px_40px_rgba(14,165,233,0.18)]" : "border-slate-800 bg-[#0b1120] shadow-xl hover:border-slate-700"
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b p-5 ${
              isLight ? "border-white/40" : "border-slate-800"
            }`}>
              <div>
                <h3 className={`font-black text-base tracking-tight flex items-center gap-2 ${
                  isLight ? "text-slate-900" : "text-white"
                }`}>
                  <span>📊</span> Annual Records
                </h3>
                <p className={`mt-0.5 text-xs ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                  Month-wise Collection • {currentYear} (Click to open in Accounts)
                </p>
              </div>

              <span className={`rounded-2xl border px-3 py-1 text-xs font-black font-mono ${
                isLight ? "bg-sky-500/15 border-sky-300/60 text-sky-800 backdrop-blur-md" : "border-sky-500/30 bg-sky-500/10 text-sky-400"
              }`}>
                ₹{yearlyTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* YEARLY MONTH-WISE LIST */}
            <div className="max-h-[350px] overflow-y-auto p-3 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-sky-400/50">
              {yearlyCollections.length === 0 ? (
                <div className={`p-12 text-center ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                  <div className="text-3xl mb-2 opacity-50">📊</div>
                  <p className="text-xs font-medium">
                    No yearly collection recorded yet.
                  </p>
                </div>
              ) : (
                yearlyCollections.map((item) => (
                  <div
                    key={item.month}
                    onClick={() => onNavigateToAccounts && onNavigateToAccounts(item.monthIndex, item.year)}
                    role="button"
                    tabIndex={0}
                    title={`Click to view ${item.month} entries in Accounts & Finance`}
                    className={`group relative overflow-hidden flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer active:scale-98 shadow-sm ${
                      isLight
                        ? "bg-white/45 backdrop-blur-md border-white/70 hover:bg-white/70 hover:border-sky-400 hover:shadow-[0_0_20px_rgba(14,165,233,0.25)]"
                        : "bg-[#080d16] border-slate-800/80 hover:border-amber-400/70 hover:bg-[#0d1627] hover:shadow-[0_0_20px_rgba(251,191,36,0.25)]"
                    }`}
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-base group-hover:scale-125 transition-transform">📅</span>
                      <div>
                        <p className={`font-bold text-sm leading-tight transition-colors ${
                          isLight ? "text-slate-800 group-hover:text-blue-700" : "text-slate-200 group-hover:text-amber-400"
                        }`}>
                          {item.month}
                        </p>
                        <span className={`text-[10px] font-medium ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                          Click to inspect ledger & roster
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 font-mono shrink-0">
                      <p className={`font-black text-sm ${isLight ? "text-sky-800" : "text-sky-400"}`}>
                        ₹{item.amount.toLocaleString("en-IN")}
                      </p>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 ${
                        isLight ? "bg-sky-500/15 text-sky-800 border-sky-300/60" : "bg-amber-400/10 text-amber-500 border-amber-400/20"
                      }`}>
                        Open <span>↗</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* YEARLY TOTAL */}
          <div className={`border-t p-5 ${
            isLight ? "border-white/40 bg-white/20 backdrop-blur-md" : "border-slate-800 bg-[#080d16]/80"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  Total Annual Collection
                </p>
                <p className={`mt-0.5 text-2xl font-black font-mono ${isLight ? "text-sky-800" : "text-sky-400"}`}>
                  ₹{yearlyTotal.toLocaleString("en-IN")}
                </p>
              </div>

              <span className={`text-[11px] font-mono font-bold ${isLight ? "text-slate-600" : "text-slate-500"}`}>
                Total: ₹{totalYearlyCollection.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ⚠️ PENDING FEES SECTION */}
      {/* ================================================= */}
      <div
        id="pending-fees-section"
        className={`overflow-hidden rounded-[32px] border transition-all duration-500 ${
          highlightPending
            ? "border-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.35)] scale-[1.005]"
            : isLight ? "border-white/80 bg-white/35 backdrop-blur-2xl shadow-[0_8px_32px_rgba(14,165,233,0.08)]" : "border-slate-800 bg-[#0b1120] shadow-xl"
        }`}
      >
        <div className={`flex items-center justify-between border-b p-5 ${
          isLight ? "border-white/40" : "border-slate-800"
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-base">⚠️</span>
              <h3 className={`font-black text-base tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                Pending Fee Students
              </h3>
            </div>
            <p className={`mt-0.5 text-xs ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
              Students whose payment is still pending.
            </p>
          </div>

          <span className={`rounded-2xl border px-3.5 py-1 text-xs font-black font-mono shadow-sm ${
            isLight ? "bg-amber-500/15 text-amber-900 border-amber-300/60 backdrop-blur-md" : "border-amber-400/30 bg-amber-400/10 text-amber-400"
          }`}>
            {pendingStudents.length}
          </span>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-3 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-sky-400/50">
          {pendingStudents.length === 0 ? (
            <div className={`p-12 text-center ${isLight ? "text-slate-500" : "text-slate-500"}`}>
              <div className="text-3xl mb-2 opacity-60">🎉</div>
              <p className="text-xs font-bold">
                No pending fees.
              </p>
            </div>
          ) : (
            pendingStudents.map((student, index) => (
              <div
                key={`${student.name}-${student.seat}-${index}`}
                className={`group relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all duration-200 ${
                  isLight
                    ? "bg-white/45 backdrop-blur-md border-white/70 hover:bg-white/70 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                    : "bg-[#080d16] border-slate-800/80 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(251,191,36,0.25)]"
                }`}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-400/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl font-mono font-black flex items-center justify-center text-xs shrink-0 ${
                    isLight ? "bg-white/80 text-amber-800 border border-white/90 shadow-sm" : "bg-amber-400/10 border border-amber-400/30 text-amber-400"
                  }`}>
                    {student.seat}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`font-bold text-sm leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                        {student.name}
                      </p>

                      {student.phone ? (
                        <a
                          href={`tel:${student.phone}`}
                          className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border cursor-pointer ${
                            isLight
                              ? "bg-emerald-500/15 text-emerald-800 border-emerald-300/60 hover:bg-emerald-500/25"
                              : "text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
                          }`}
                          title="Click to Call Student"
                        >
                          <span>📞</span>
                          <span>{student.phone}</span>
                        </a>
                      ) : (
                        <span className={`text-[10px] font-mono italic ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                          (No phone saved)
                        </span>
                      )}
                    </div>

                    <p className={`mt-1 text-[11px] font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      Seat {student.seat} • {student.plan}{" "}
                      {student.toDate ? (
                        <span className={`font-mono ml-1 font-bold ${isLight ? "text-rose-700" : "text-rose-400/90"}`}>
                          • Expiry: {student.toDate}
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                  <span className={`rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${
                    isLight ? "bg-amber-500/15 text-amber-900 border-amber-300/60" : "bg-amber-400/10 border-amber-400/20 text-amber-400"
                  }`}>
                    Pending
                  </span>

                  <button
                    type="button"
                    onClick={() => sendWhatsAppReminder(student)}
                    className="group/btn relative overflow-hidden flex items-center gap-1.5 bg-[#25D366] hover:brightness-110 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(37,211,102,0.35)] transition-all duration-200 active:scale-95 cursor-pointer"
                    title="Send WhatsApp payment reminder"
                  >
                    <span className="text-sm transition-transform duration-200 group-hover/btn:scale-110">💬</span>
                    <span>Reminder</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* =========================================================
          ⭐ STUDENT REVIEWS & TESTIMONIALS MODERATION
      ========================================================= */}
      <div className={`overflow-hidden rounded-[32px] border transition-all duration-300 ${
        isLight ? "border-white/80 bg-white/35 backdrop-blur-2xl shadow-[0_8px_32px_rgba(14,165,233,0.08)]" : "border-slate-800 bg-[#0b1120] shadow-xl"
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b p-5 ${
          isLight ? "border-white/40 bg-white/20 backdrop-blur-md" : "border-slate-800 bg-gradient-to-r from-[#0b1220] via-[#111827] to-[#0b1220]"
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-lg">⭐</span>
              <h3 className={`font-black text-base tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                Student Feedback &amp; Reviews Moderation
              </h3>
            </div>
            <p className={`mt-0.5 text-xs ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
              Control which reviews are live on the public website homepage.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={`rounded-xl border px-3 py-1 font-bold ${
              isLight ? "bg-white/60 border-white/90 text-slate-800 backdrop-blur-md" : "border-slate-700 bg-slate-900 text-slate-300"
            }`}>
              Total: {dashboardFeedbacks.length}
            </span>
            <span className={`rounded-xl border px-3 py-1 font-black ${
              isLight ? "bg-emerald-500/15 border-emerald-300/60 text-emerald-800 backdrop-blur-md" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            }`}>
              Live: {dashboardFeedbacks.filter((f) => f.isApproved).length}
            </span>
            <span className={`rounded-xl border px-3 py-1 font-black ${
              isLight ? "bg-amber-500/15 border-amber-300/60 text-amber-900 backdrop-blur-md" : "border-amber-500/30 bg-amber-500/10 text-amber-400"
            }`}>
              Pending: {dashboardFeedbacks.filter((f) => !f.isApproved).length}
            </span>
          </div>
        </div>

        <div className="p-5">
          {dashboardFeedbacks.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border ${
              isLight ? "bg-white/30 border-white/60 text-slate-500" : "text-slate-500 bg-[#080d16] border-slate-800/80"
            }`}>
              <div className="text-3xl mb-2 opacity-60">📝</div>
              <p className="text-xs font-bold">
                No student reviews submitted yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dashboardFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className={`group relative overflow-hidden flex flex-col justify-between rounded-3xl p-5 border transition-all duration-300 hover:-translate-y-1 ${
                    fb.isApproved
                      ? (isLight ? "bg-white/50 backdrop-blur-2xl border-emerald-300/70 shadow-[0_4px_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:border-emerald-400" : "bg-[#080d16] border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:border-emerald-400")
                      : (isLight ? "bg-white/35 backdrop-blur-2xl border-white/80 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]" : "bg-[#080d16] border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]")
                  }`}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className={`font-bold text-sm leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                          {fb.name}
                        </h4>
                        <div className="text-amber-400 text-xs mt-1">
                          {"★".repeat(Number(fb.rating || 5))}
                          <span className={`ml-1 font-mono text-[11px] ${isLight ? "text-slate-500" : "text-slate-600"}`}>
                            ({fb.rating}/5)
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          fb.isApproved
                            ? (isLight ? "bg-emerald-500/15 text-emerald-800 border-emerald-300/60" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30")
                            : (isLight ? "bg-amber-500/15 text-amber-800 border-amber-300/60" : "bg-amber-500/10 text-amber-400 border-amber-500/30")
                        }`}
                      >
                        {fb.isApproved ? "Live" : "Hidden"}
                      </span>
                    </div>

                    <p className={`mt-3 text-xs leading-relaxed italic p-3 rounded-2xl border ${
                      isLight ? "bg-white/50 backdrop-blur-md text-slate-800 border-white/70 shadow-sm" : "bg-slate-900/60 text-slate-300 border-slate-800/80"
                    }`}>
                      "{fb.text}"
                    </p>
                  </div>

                  <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
                    isLight ? "border-white/40" : "border-slate-800"
                  }`}>
                    <button
                      type="button"
                      onClick={() => handleToggleFeedbackLive(fb.id, fb.isApproved)}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                        fb.isApproved
                          ? (isLight ? "bg-amber-500/20 hover:bg-amber-500 text-amber-900 hover:text-white border border-amber-300/60" : "bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30")
                          : (isLight ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" : "bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30")
                      }`}
                    >
                      {fb.isApproved ? "✕ Hide From Site" : "✓ Make Live"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFeedback(fb.id)}
                      className={`p-1.5 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isLight
                          ? "text-rose-700 bg-rose-500/15 hover:bg-rose-600 hover:text-white border border-rose-300/60"
                          : "text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20"
                      }`}
                      title="Delete review"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          🗺️ LIVE QUICK HALL SEAT MAP POPUP MODAL
      ========================================================= */}
      {showSeatMapModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/75 backdrop-blur-2xl p-2 sm:p-4">
          <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-white/20 bg-black/70 shadow-[0_25px_100px_rgba(0,0,0,0.85)]">
            {/* TOP HEADER */}
            <div className="shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-xl px-4 py-4 sm:px-7 sm:py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xl font-black tracking-tight text-white sm:text-2xl flex items-center gap-2">
                    <span>🗺️</span> Live Hall Seat Occupancy Map
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 font-mono">
                    {occupiedSeats} of {totalSeats} seats occupied • {availableSeats} available
                  </p>
                </div>

                <button
                  onClick={() => setShowSeatMapModal(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl font-bold text-slate-300 transition hover:bg-red-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* LEGEND */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-[10px] font-bold text-gray-200">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                  Available ({availableSeats})
                </div>
                <div className="flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-[10px] font-bold text-gray-200">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>
                  Morning Available
                </div>
                <div className="flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-[10px] font-bold text-gray-200">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>
                  Afternoon Available
                </div>
                <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-[10px] font-bold text-gray-200">
                  <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-green-500 to-black"></span>
                  Night Available
                </div>
                <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold text-gray-200">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  Fully Booked ({occupiedSeats})
                </div>
              </div>
            </div>

            {/* HALL AREA */}
            <div className="min-h-0 flex-1 overflow-auto bg-[#050914]/80 p-3 sm:p-5">
              <div className="mx-auto min-w-[650px] max-w-5xl">
                <div className="relative overflow-hidden rounded-[24px] border-2 border-white/10 bg-gradient-to-br from-[#151d2b] via-[#0c1422] to-[#080d17] p-4 shadow-[inset_0_0_60px_rgba(0,0,0,0.55)] sm:p-6">
                  <div className="pointer-events-none absolute inset-2 rounded-[20px] border border-yellow-500/5"></div>

                  {/* WASHROOM & DISCUSSION */}
                  <div className="flex justify-between sm:mb-6">
                    <div className="relative left-17 rounded-xl border border-blue-400/20 bg-blue-500/5 px-10 py-4 text-center shadow-lg">
                      <div className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-300">
                        Washroom
                      </div>
                      <div className="mt-1 text-lg">🚻</div>
                    </div>

                    <div className="rounded-2xl border border-blue-400/20 bg-blue-500/5 px-20 py-5 text-center shadow-lg">
                      <div className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-300">
                        Discussion Hall 💬
                      </div>
                      <div className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-300 mt-1">
                        Lunch Area 🍽️
                      </div>
                    </div>
                  </div>

                  {/* MAIN HALL MAP */}
                  <div className="relative aspect-[1.08/1] w-full">
                    <div className="pointer-events-none absolute left-[46%] top-[10%] h-[75%] w-[8%] rounded-full bg-gradient-to-b from-white/[0.02] via-yellow-500/[0.025] to-transparent"></div>
                    <div className="pointer-events-none absolute left-[45.5%] top-[48%] -rotate-90 text-[7px] font-black uppercase tracking-[0.4em] text-gray-700 sm:text-[8px]">
                      WALKWAY
                    </div>

                    {/* LEFT SIDE — SEAT BLOCKS */}
                    <div className="absolute left-[3%] top-[5%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[40, 39, 38, 37].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    <div className="absolute left-[3%] top-[17%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[36, 35, 34, 33, 32, 31, 30, 29].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    <div className="absolute left-[3%] top-[36%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[28, 27, 26, 25, 24, 23, 22, 21].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    <div className="absolute left-[3%] top-[55%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[20, 19, 18, 17, 16, 15, 14, 13].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    <div className="absolute left-[3%] top-[74%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[12, 11, 10, 9, 8, 7, 6, 5].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    <div className="absolute bottom-[0%] left-[3%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[4, 3, 2, 1].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    {/* RIGHT SIDE — SEAT BLOCKS */}
                    <div className="absolute right-[32%] top-[14%] flex w-[10%] flex-col gap-1.5 sm:gap-2">
                      {[66, 65].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} vertical />;
                      })}
                    </div>

                    <div className="absolute right-[3%] top-[39%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[61, 62, 63, 64].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    <div className="absolute right-[3%] top-[52%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[57, 58, 59, 60, 53, 54, 55, 56].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    <div className="absolute right-[3%] top-[72%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[49, 50, 51, 52, 45, 46, 47, 48].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    <div className="absolute bottom-[0%] right-[3%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[41, 42, 43, 44].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
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

                  {/* FUTURE EXPANSION SEATS */}
                  {visibleSeats.some((seat) => seat.id > 66) && (
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
                        {visibleSeats
                          .filter((seat) => seat.id > 66)
                          .map((seat) => (
                            <HallSeat key={seat.id} seat={seat} />
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
    </div>
  );
};

export default Dashboard;