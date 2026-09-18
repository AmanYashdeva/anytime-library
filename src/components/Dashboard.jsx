import React, { useState } from "react";

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

const Dashboard = ({ seats = [], onToggleSeatVisibility, onNavigateToAccounts }) => {
  // State for Seat Map Popup Modal
  const [showSeatMapModal, setShowSeatMapModal] = useState(false);
  // State for highlighting pending section on jump
  const [highlightPending, setHighlightPending] = useState(false);

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

This is a gentle reminder that your monthly library seat subscription is due for renewal.

📌 *Membership Details:*
• *Seat Number:* Seat ${student.seat}
• *Shift / Plan:* ${student.plan}
• *Due Date:* ${student.toDate || "Expired"}

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

  // =====================================================
  // PRINT FUNCTIONS
  // =====================================================
  const printDashboard = () => {
    window.print();
  };

  const printSection = (sectionId) => {
    const content = document.getElementById(sectionId);
    if (!content) return;

    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Monthly Collection Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; background: white; color: black; }
            * { color: black !important; }
            button { display: none !important; }
          </style>
        </head>
        <body>
          ${content.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const printMonthlyReport = () => {
    const studentsToPrint = monthlyCollections;
    const totalStudents = studentsToPrint.length;
    const submittedStudents = studentsToPrint.filter((s) => s.payment === "Submitted").length;
    const totalCollection = studentsToPrint.reduce((total, s) => total + (Number(s.amount) || 0), 0);

    const tableRows = studentsToPrint
      .map(
        (student, index) => `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${student.name || "-"}</strong></td>
          <td>${student.seat || "-"}</td>
          <td>${student.plan || "-"}</td>
          <td>${student.phone || "-"}</td>
          <td>${student.fromDate || "-"}</td>
          <td>${student.toDate || "-"}</td>
          <td>₹${(Number(student.amount) || 0).toLocaleString("en-IN")}</td>
          <td>${student.payment || "-"}</td>
        </tr>
      `
      )
      .join("");

    const printWindow = window.open("", "", "width=1200,height=800");
    if (!printWindow) {
      alert("Please allow popups to print the report.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${currentMonthName} ${currentYear} - Monthly Report</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 35px; color: #111; background: white; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 25px; }
            h1 { margin: 0; font-size: 28px; }
            h2 { margin: 8px 0 0; font-size: 18px; font-weight: normal; }
            .print-date { text-align: right; font-size: 13px; color: #555; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 25px; }
            .summary-box { border: 1px solid #ccc; border-radius: 8px; padding: 15px; }
            .summary-title { font-size: 12px; color: #666; margin-bottom: 6px; }
            .summary-value { font-size: 20px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { background: #eee; font-weight: bold; }
            th, td { border: 1px solid #999; padding: 9px 7px; text-align: left; }
            tr:nth-child(even) { background: #f7f7f7; }
            .footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 12px; font-size: 11px; color: #666; text-align: center; }
            @media print { body { padding: 15px; } @page { size: A4 landscape; margin: 10mm; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>ANY TIME LIBRARY</h1>
              <h2>Monthly Student & Collection Report</h2>
              <h2>${currentMonthName} ${currentYear}</h2>
            </div>
            <div class="print-date">
              <strong>Report Generated:</strong><br />
              ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
          </div>
          <div class="summary">
            <div class="summary-box">
              <div class="summary-title">Total Students</div>
              <div class="summary-value">${totalStudents}</div>
            </div>
            <div class="summary-box">
              <div class="summary-title">Submitted Payments</div>
              <div class="summary-value">${submittedStudents}</div>
            </div>
            <div class="summary-box">
              <div class="summary-title">Total Collection</div>
              <div class="summary-value">₹${totalCollection.toLocaleString("en-IN")}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Seat</th>
                <th>Plan / Shift</th>
                <th>Phone Number</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Fees</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows || `<tr><td colspan="9" style="text-align:center;">No student records available.</td></tr>`}
            </tbody>
          </table>
          <div class="footer">This is a system generated report from Anytime Library Admin Dashboard.</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  return (
    <div className="w-full pb-14 font-sans text-slate-100 antialiased space-y-7">
      {/* ================================================= */}
      {/* DASHBOARD HEADER */}
      {/* ================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
              Anytime Library
            </span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400">Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Live overview of seats, students and payments.
          </p>
        </div>

        <button
          onClick={printDashboard}
          className="group relative overflow-hidden rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-amber-400 transition-all duration-300 hover:bg-amber-400 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] active:scale-95 flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
          <span>🖨</span> Print Overview
        </button>
      </div>

      {/* ================================================= */}
      {/* MAIN SUMMARY CARDS */}
      {/* ================================================= */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* TOTAL SEATS (Click to open Map) */}
        <div
          onClick={() => setShowSeatMapModal(true)}
          role="button"
          tabIndex={0}
          title="Click to view full hall seat map"
          className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1120] p-5 shadow-lg transition-all duration-300 hover:border-slate-700 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 cursor-pointer active:scale-95"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Total Seats</span>
            <span className="text-sm opacity-60 group-hover:opacity-100 transition-opacity">🪑</span>
          </div>
          <h3 className="mt-2 text-3xl font-black text-white font-mono tracking-tight">
            {totalSeats}
          </h3>
          <p className="mt-2 text-[11px] text-slate-500 font-medium flex items-center justify-between">
            <span>Active visible seats</span>
            <span className="text-amber-400/80 text-[10px] font-bold">Map ↗</span>
          </p>
        </div>

        {/* AVAILABLE SEATS (Click to open Map) */}
        <div
          onClick={() => setShowSeatMapModal(true)}
          role="button"
          tabIndex={0}
          title="Click to view full hall seat map"
          className="group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#0b1120] p-5 shadow-lg transition-all duration-300 hover:border-emerald-500/60 hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:-translate-y-1 cursor-pointer active:scale-95"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span>Available</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h3 className="mt-2 text-3xl font-black text-emerald-400 font-mono tracking-tight">
            {availableSeats}
          </h3>
          <p className="mt-2 text-[11px] text-emerald-500/80 font-medium flex items-center justify-between">
            <span>Seats ready for booking</span>
            <span className="text-emerald-400 text-[10px] font-bold">Map ↗</span>
          </p>
        </div>

        {/* ⚡ OCCUPIED SEATS (CLICK TO OPEN INSTANT SEAT MAP POPUP) */}
        <div
          onClick={() => setShowSeatMapModal(true)}
          role="button"
          tabIndex={0}
          title="Click to view live hall seat map"
          className="group relative overflow-hidden rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-500/[0.08] via-[#0b1120] to-[#0b1120] p-5 shadow-lg transition-all duration-300 hover:border-rose-500 hover:shadow-[0_0_25px_rgba(244,63,94,0.25)] hover:-translate-y-1 cursor-pointer active:scale-95"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-rose-500/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
          <div className="flex items-center justify-between text-xs font-bold text-rose-400">
            <span>Occupied</span>
            <span className="text-xs font-bold font-mono">
              {totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0}%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-3xl font-black text-rose-400 font-mono tracking-tight">
              {occupiedSeats}
            </h3>
            <span className="text-[10px] font-black uppercase text-rose-400/90 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5">
              Seat Map <span>↗</span>
            </span>
          </div>
          <p className="mt-2 text-[11px] text-rose-400/80 font-medium flex items-center justify-between">
            <span>Currently assigned</span>
            <span className="underline decoration-dotted text-[10px] text-rose-300 font-bold">Click to view map</span>
          </p>
        </div>

        {/* ⚡ FEES PENDING (CLICK TO JUMP DIRECTLY TO PENDING LIST) */}
        <div
          onClick={scrollToPendingFees}
          role="button"
          tabIndex={0}
          title="Click to jump directly to pending students list"
          className="group relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/[0.08] via-[#0b1120] to-[#0b1120] p-5 shadow-lg transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(251,191,36,0.25)] hover:-translate-y-1 cursor-pointer active:scale-95"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-400/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></span>
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Fees Pending</span>
            <span className="text-xs transition-transform duration-300 group-hover:translate-y-0.5">
              ⚠️
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-3xl font-black text-amber-400 font-mono tracking-tight">
              {feesDue}
            </h3>
            <span className="text-[10px] font-black uppercase text-amber-400/80 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5">
              View List <span>↓</span>
            </span>
          </div>
          <p className="mt-2 text-[11px] text-amber-400/80 font-medium flex items-center justify-between">
            <span>Pending payment entries</span>
            <span className="underline decoration-dotted text-[10px]">Click to jump</span>
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* SECONDARY SUMMARY */}
      {/* ================================================= */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* ACTIVE STUDENTS */}
        <div className="group rounded-2xl border border-slate-800 bg-[#090e1a] p-4.5 shadow-md transition-all duration-300 hover:border-slate-700 hover:-translate-y-0.5">
          <p className="text-xs font-semibold text-slate-400">Active Students</p>
          <h3 className="mt-1.5 text-2xl font-black text-blue-400 font-mono">
            {activeStudents}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Submitted + pending members</p>
        </div>

        {/* HALF DAY */}
        <div className="group rounded-2xl border border-slate-800 bg-[#090e1a] p-4.5 shadow-md transition-all duration-300 hover:border-slate-700 hover:-translate-y-0.5">
          <p className="text-xs font-semibold text-slate-400">Half Day Seats</p>
          <h3 className="mt-1.5 text-2xl font-black text-purple-400 font-mono">
            {halfDaySeats}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Morning & afternoon slots</p>
        </div>

        {/* FULL DAY */}
        <div className="group rounded-2xl border border-slate-800 bg-[#090e1a] p-4.5 shadow-md transition-all duration-300 hover:border-slate-700 hover:-translate-y-0.5">
          <p className="text-xs font-semibold text-slate-400">Full Day Seats</p>
          <h3 className="mt-1.5 text-2xl font-black text-cyan-400 font-mono">
            {fullDaySeats}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Day long dedicated seats</p>
        </div>

        {/* 24 HOURS */}
        <div className="group rounded-2xl border border-slate-800 bg-[#090e1a] p-4.5 shadow-md transition-all duration-300 hover:border-slate-700 hover:-translate-y-0.5">
          <p className="text-xs font-semibold text-slate-400">24 Hours</p>
          <h3 className="mt-1.5 text-2xl font-black text-orange-400 font-mono">
            {twentyFourSeats}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Round-the-clock access</p>
        </div>
      </div>

      {/* ================================================= */}
      {/* RECORDS SECTION: MONTHLY + YEARLY */}
      {/* ================================================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 items-stretch">
        {/* ================================================= */}
        {/* MONTHLY RECORDS */}
        {/* ================================================= */}
        <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-[#0b1120] shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 p-5">
              <div>
                <h3 className="font-black text-white text-base tracking-tight flex items-center gap-2">
                  <span>📅</span> Monthly Records
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  {currentMonthName} {currentYear} Collection
                </p>
              </div>

              <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black font-mono text-emerald-400">
                ₹{monthlyTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* MONTHLY STUDENT LIST */}
            <div className="max-h-[350px] overflow-y-auto p-3 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700/60 [&::-webkit-scrollbar-thumb]:rounded-full">
              {monthlyCollections.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <div className="text-3xl mb-2 opacity-50">📭</div>
                  <p className="text-xs font-medium text-slate-400">
                    No collection recorded this month.
                  </p>
                </div>
              ) : (
                monthlyCollections.map((student, index) => (
                  <div
                    key={`${student.name}-${student.seat}-${index}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#080d16] border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 font-mono font-black text-amber-400 flex items-center justify-center text-xs shrink-0">
                        {student.seat}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-sm leading-tight">{student.name}</p>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                            student.entryType === "Renewal"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          }`}>
                            {student.entryType}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                          {student.plan} • Paid On: <span className="text-amber-300 font-mono font-bold">{student.date}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <p className="font-black text-sm text-emerald-400">
                        ₹{student.amount.toLocaleString("en-IN")}
                      </p>
                      <span className="inline-block text-[9px] uppercase font-bold tracking-wider text-emerald-500/80">
                        Verified
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* MONTHLY FOOTER & PRINT BUTTON */}
          <div className="border-t border-slate-800 bg-[#080d16]/80 p-5" id="monthly-report">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Monthly Collection
                </p>
                <p className="mt-0.5 text-2xl font-black text-emerald-400 font-mono">
                  ₹{monthlyTotal.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-center font-mono">
                <p className="text-base font-black text-emerald-400">
                  {monthlyCollections.length}
                </p>
                <p className="text-[9px] uppercase font-bold text-slate-400">
                  Students
                </p>
              </div>
            </div>

            <button
              onClick={printMonthlyReport}
              className="mt-4 w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 text-xs font-black uppercase tracking-wider text-emerald-400 transition-all duration-200 hover:bg-emerald-500 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-95"
            >
              🖨 Print Detailed Monthly Report
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* 📊 YEARLY RECORDS (CLICK TO JUMP DIRECT TO THAT MONTH'S ACCOUNTS) */}
        {/* ================================================= */}
        <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-[#0b1120] shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 p-5">
              <div>
                <h3 className="font-black text-white text-base tracking-tight flex items-center gap-2">
                  <span>📊</span> Annual Records
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  Month-wise Collection • {currentYear} (Click to open in Accounts)
                </p>
              </div>

              <span className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-black font-mono text-sky-400">
                ₹{yearlyTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* YEARLY MONTH-WISE LIST WITH 1-CLICK JUMP TO ACCOUNTS */}
            <div className="max-h-[350px] overflow-y-auto p-3 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700/60 [&::-webkit-scrollbar-thumb]:rounded-full">
              {yearlyCollections.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <div className="text-3xl mb-2 opacity-50">📊</div>
                  <p className="text-xs font-medium text-slate-400">
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
                    className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#080d16] border border-slate-800/80 hover:border-amber-400/50 hover:bg-[#0d1627] transition-all duration-200 cursor-pointer active:scale-98 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base group-hover:scale-110 transition-transform">📅</span>
                      <div>
                        <p className="font-bold text-sm text-slate-200 group-hover:text-amber-400 transition-colors leading-tight">
                          {item.month}
                        </p>
                        <span className="text-[10px] text-slate-500 group-hover:text-slate-400 font-medium">
                          Click to inspect ledger & roster
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 font-mono shrink-0">
                      <p className="font-black text-sm text-sky-400">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        Open <span>↗</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* YEARLY TOTAL */}
          <div className="border-t border-slate-800 bg-[#080d16]/80 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Annual Collection
                </p>
                <p className="mt-0.5 text-2xl font-black text-sky-400 font-mono">
                  ₹{yearlyTotal.toLocaleString("en-IN")}
                </p>
              </div>

              <span className="text-[11px] font-mono text-slate-500 font-bold">
                Total: ₹{totalYearlyCollection.toLocaleString("en-IN")}
              </span>
            </div>

            {today.getMonth() === 11 && (
              <button
                onClick={printDashboard}
                className="mt-4 w-full rounded-xl border border-sky-400/30 bg-sky-400/10 py-2.5 text-xs font-black uppercase tracking-wider text-sky-400 transition-all duration-200 hover:bg-sky-400 hover:text-slate-950 active:scale-95"
              >
                🖨 Print Annual Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ⚠️ PENDING FEES SECTION (TARGET OF JUMP/SCROLL) */}
      {/* ================================================= */}
      <div
        id="pending-fees-section"
        className={`overflow-hidden rounded-3xl border bg-[#0b1120] shadow-xl transition-all duration-500 ${
          highlightPending
            ? "border-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.35)] scale-[1.005]"
            : "border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-base">⚠️</span>
              <h3 className="font-black text-white text-base tracking-tight">
                Pending Fee Students
              </h3>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              Students whose payment is still pending.
            </p>
          </div>

          <span className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-black font-mono text-amber-400 shadow-sm">
            {pendingStudents.length}
          </span>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-3 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700/60 [&::-webkit-scrollbar-thumb]:rounded-full">
          {pendingStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <div className="text-3xl mb-2 opacity-60">🎉</div>
              <p className="text-xs font-bold text-slate-400">
                No pending fees.
              </p>
            </div>
          ) : (
            pendingStudents.map((student, index) => (
              <div
                key={`${student.name}-${student.seat}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#080d16] border border-slate-800/80 hover:border-amber-400/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 font-mono font-black text-amber-400 flex items-center justify-center text-xs shrink-0">
                    {student.seat}
                  </div>
                  <div>
                    {/* Student Name & Clickable Phone Link */}
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-white text-sm leading-tight">
                        {student.name}
                      </p>

                      {student.phone ? (
                        <a
                          href={`tel:${student.phone}`}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 cursor-pointer"
                          title="Click to Call Student"
                        >
                          <span>📞</span>
                          <span>{student.phone}</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono italic">
                          (No phone saved)
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-[11px] text-slate-400 font-medium">
                      Seat {student.seat} • {student.plan}{" "}
                      {student.toDate ? (
                        <span className="text-rose-400/90 font-mono ml-1">
                          • Expiry: {student.toDate}
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                </div>

                {/* Actions Area */}
                <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                  <span className="rounded-lg bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Pending
                  </span>

                  {/* 1-Click WhatsApp Reminder Button */}
                  <button
                    type="button"
                    onClick={() => sendWhatsAppReminder(student)}
                    className="group/btn relative overflow-hidden flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-slate-950 border border-[#25D366]/30 hover:border-[#25D366] px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all duration-200 hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] active:scale-95 cursor-pointer"
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
          🗺️ LIVE QUICK HALL SEAT MAP POPUP MODAL (SAME AS HOME)
      ========================================================= */}
      {showSeatMapModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
          <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-amber-400/30 bg-[#080d18] shadow-[0_25px_100px_rgba(0,0,0,0.85)]">
            {/* TOP HEADER */}
            <div className="shrink-0 border-b border-white/10 bg-gradient-to-r from-[#0b1220] via-[#111827] to-[#0b1220] px-4 py-4 sm:px-7 sm:py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xl font-black tracking-tight text-amber-400 sm:text-2xl flex items-center gap-2">
                    <span>🗺️</span> Live Hall Seat Occupancy Map
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {occupiedSeats} of {totalSeats} seats occupied • {availableSeats} available
                  </p>
                </div>

                <button
                  onClick={() => setShowSeatMapModal(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl font-bold text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                >
                  ✕
                </button>
              </div>

              {/* LEGEND */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1.5 text-[10px] font-bold text-gray-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                  Available ({availableSeats})
                </div>
                <div className="flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1.5 text-[10px] font-bold text-gray-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>
                  Morning Available
                </div>
                <div className="flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1.5 text-[10px] font-bold text-gray-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>
                  Afternoon Available
                </div>
                <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1.5 text-[10px] font-bold text-gray-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-green-500 to-black"></span>
                  Night Available
                </div>
                <div className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-[10px] font-bold text-gray-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  Fully Booked ({occupiedSeats})
                </div>
              </div>
            </div>

            {/* HALL AREA */}
            <div className="min-h-0 flex-1 overflow-auto bg-[#050914] p-3 sm:p-5">
              <div className="mx-auto min-w-[650px] max-w-5xl">
                <div className="relative overflow-hidden rounded-[24px] border-2 border-gray-700 bg-gradient-to-br from-[#151d2b] via-[#0c1422] to-[#080d17] p-4 shadow-[inset_0_0_60px_rgba(0,0,0,0.55)] sm:p-6">
                  {/* WALL GLOW */}
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
                    {/* WALKING AISLE */}
                    <div className="pointer-events-none absolute left-[46%] top-[10%] h-[75%] w-[8%] rounded-full bg-gradient-to-b from-white/[0.02] via-yellow-500/[0.025] to-transparent"></div>
                    <div className="pointer-events-none absolute left-[45.5%] top-[48%] -rotate-90 text-[7px] font-black uppercase tracking-[0.4em] text-gray-700 sm:text-[8px]">
                      WALKWAY
                    </div>

                    {/* LEFT SIDE — SEAT BLOCKS */}
                    {/* 37 - 40 */}
                    <div className="absolute left-[3%] top-[5%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[40, 39, 38, 37].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    {/* 33 - 36 / 29 - 32 */}
                    <div className="absolute left-[3%] top-[17%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[36, 35, 34, 33, 32, 31, 30, 29].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    {/* 25 - 28 / 21 - 24 */}
                    <div className="absolute left-[3%] top-[36%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[28, 27, 26, 25, 24, 23, 22, 21].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    {/* 20 - 17 / 13 - 16 */}
                    <div className="absolute left-[3%] top-[55%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[20, 19, 18, 17, 16, 15, 14, 13].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    {/* 12 - 9 / 8 - 5 */}
                    <div className="absolute left-[3%] top-[74%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[12, 11, 10, 9, 8, 7, 6, 5].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    {/* 1 - 4 */}
                    <div className="absolute bottom-[0%] left-[3%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[4, 3, 2, 1].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    {/* RIGHT SIDE — SEAT BLOCKS */}
                    {/* 65 / 66 */}
                    <div className="absolute right-[32%] top-[14%] flex w-[10%] flex-col gap-1.5 sm:gap-2">
                      {[66, 65].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} vertical />;
                      })}
                    </div>

                    {/* 64 - 61 */}
                    <div className="absolute right-[3%] top-[39%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[61, 62, 63, 64].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    {/* 57 - 60 / 56 - 53 */}
                    <div className="absolute right-[3%] top-[52%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[57, 58, 59, 60, 53, 54, 55, 56].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    {/* 49 - 52 / 48 - 45 */}
                    <div className="absolute right-[3%] top-[72%] grid w-[37%] grid-cols-4 gap-1.5 sm:gap-2">
                      {[49, 50, 51, 52, 45, 46, 47, 48].map((id) => {
                        const seat = visibleSeats.find((s) => s.id === id);
                        if (!seat) return null;
                        return <HallSeat key={id} seat={seat} />;
                      })}
                    </div>

                    {/* 41 - 44 */}
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