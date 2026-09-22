import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

const AccountsFinance = ({
  seats = [],
  selectedMonth: propMonth,
  setSelectedMonth: propSetMonth,
  selectedYear: propYear,
  setSelectedYear: propSetYear,
  theme = "dark",
}) => {
  const isLight = theme === "light";
  const visibleSeats = seats.filter((seat) => seat.isVisible !== false);

  // ==========================================
  // 📅 1. DATE & MONTH SELECTOR (SYNCED WITH DASHBOARD)
  // ==========================================
  const today = new Date();
  const currentMonthIndex = today.getMonth();
  const currentYear = today.getFullYear();

  const [localMonth, setLocalMonth] = useState(currentMonthIndex);
  const [localYear, setLocalYear] = useState(currentYear);

  const selectedMonth = propMonth !== undefined ? propMonth : localMonth;
  const setSelectedMonth = propSetMonth || setLocalMonth;
  const selectedYear = propYear !== undefined ? propYear : localYear;
  const setSelectedYear = propSetYear || setLocalYear;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ==========================================
  // 📝 2. EXPENSE FORM STATE
  // ==========================================
  const [expDate, setExpDate] = useState(getTodayDateString());
  // FIXED: Default category "Electricity Bill" set ki hai taaki rent na aaye
  const [expCategory, setExpCategory] = useState("Electricity Bill");
  const [expDescription, setExpDescription] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Single Pie view mode: "flow" (Monthly Combined Flow) OR "detailed" (Annual All Heads)
  const [pieMode, setPieMode] = useState("flow");
  const [hoveredSliceIndex, setHoveredSliceIndex] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");

  // ==========================================
  // ⚡ 3. FIREBASE LIVE EXPENSES SYNC
  // ==========================================
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    const expensesRef = collection(db, "expenses");
    const unsubscribe = onSnapshot(
      expensesRef,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
        setExpensesList(list);
      },
      (error) => {
        console.error("Expense sync error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expAmount || Number(expAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, "expenses"), {
        date: expDate,
        category: expCategory,
        description: expDescription.trim() || "",
        amount: Number(expAmount),
        createdAt: Date.now(),
      });

      setExpDescription("");
      setExpAmount("");
    } catch (error) {
      console.error("Expense add error:", error);
      alert("Failed to save expense record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id, desc, amt) => {
    if (window.confirm(`Delete expense record: "₹${amt} - ${desc}"?`)) {
      try {
        await deleteDoc(doc(db, "expenses", id));
      } catch (error) {
        console.error("Expense delete error:", error);
        alert("Failed to delete record.");
      }
    }
  };

  // ==========================================
  // 💰 4. STUDENT REVENUE AGGREGATION
  // ==========================================
  const allCollections = [];

  visibleSeats.forEach((seat) => {
    const addCol = (name, plan, payment, amount, paidDate, fromDate, toDate, phone, entryType, mode) => {
      if (!name || payment !== "Submitted") return;
      allCollections.push({
        name,
        seat: seat.id,
        plan,
        amount: Number(amount) || 0,
        paidDate: paidDate || fromDate || "",
        fromDate: fromDate || "",
        toDate: toDate || "",
        phone: phone || "",
        payment,
        entryType: entryType || "New Admission",
        paymentMode: mode || "Cash",
      });
    };

    addCol(seat.morningStudent, "Morning", seat.morningPayment, seat.morningAmount, seat.morningPaidDate, seat.morningFrom, seat.morningTo, seat.morningPhone, seat.morningEntryType, seat.morningPaymentMode);
    addCol(seat.afternoonStudent, "Afternoon", seat.afternoonPayment, seat.afternoonAmount, seat.afternoonPaidDate, seat.afternoonFrom, seat.afternoonTo, seat.afternoonPhone, seat.afternoonEntryType, seat.afternoonPaymentMode);
    addCol(seat.nightStudent, seat.status === "24 Hours" ? "24 Hours" : "Night", seat.nightPayment, seat.nightAmount, seat.nightPaidDate, seat.nightFrom, seat.nightTo, seat.nightPhone, seat.nightEntryType, seat.nightPaymentMode);
    addCol(seat.fullDayStudent, "Full Day", seat.fullDayPayment, seat.fullDayAmount, seat.fullDayPaidDate, seat.fullDayFrom, seat.fullDayTo, seat.fullDayPhone, seat.fullDayEntryType, seat.fullDayPaymentMode);
  });

  // Selected Month Revenue
  const selectedMonthCollections = allCollections.filter((s) => {
    if (!s.paidDate || s.paidDate === "0-0-0") return false;
    const d = new Date(s.paidDate);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalFeesRealized = selectedMonthCollections.reduce((acc, curr) => acc + curr.amount, 0);

  const totalCashCollected = selectedMonthCollections
    .filter((s) => s.paymentMode === "Cash")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOnlineCollected = selectedMonthCollections
    .filter((s) => s.paymentMode !== "Cash")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const cashPercent = totalFeesRealized > 0 ? Math.round((totalCashCollected / totalFeesRealized) * 100) : 0;
  const onlinePercent = totalFeesRealized > 0 ? 100 - cashPercent : 0;

  // Selected Month Expenses
  const selectedMonthExpenses = expensesList.filter((e) => {
    if (!e.date) return false;
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalExpensesLogged = selectedMonthExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // Net Profit (Monthly)
  const netProfit = totalFeesRealized - totalExpensesLogged;
  const profitMargin = totalFeesRealized > 0 ? Math.round((netProfit / totalFeesRealized) * 100) : 0;

  // ==========================================
  // 🏆 FULL YEAR (ANNUAL) CALCULATIONS
  // ==========================================
  const currentYearCollections = allCollections.filter((s) => {
    if (!s.paidDate || s.paidDate === "0-0-0") return false;
    const d = new Date(s.paidDate);
    return d.getFullYear() === selectedYear;
  });

  const annualFeesTotal = currentYearCollections.reduce((acc, curr) => acc + curr.amount, 0);
  const annualCashTotal = currentYearCollections.filter(s => s.paymentMode === "Cash").reduce((acc, curr) => acc + curr.amount, 0);
  const annualOnlineTotal = currentYearCollections.filter(s => s.paymentMode !== "Cash").reduce((acc, curr) => acc + curr.amount, 0);

  const currentYearExpenses = expensesList.filter((e) => {
    if (!e.date) return false;
    const d = new Date(e.date);
    return d.getFullYear() === selectedYear;
  });

  const annualExpensesTotal = currentYearExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const annualNetProfit = annualFeesTotal - annualExpensesTotal;
  const annualProfitMargin = annualFeesTotal > 0 ? Math.round((annualNetProfit / annualFeesTotal) * 100) : 0;

  // ==========================================
  // 📊 5. ONE UNIFIED PIE / DONUT CHART
  // ==========================================
  const CATEGORY_COLORS = {
    "Electricity Bill": "#f59e0b",
    "WiFi & Internet": "#06b6d4",
    "Cleaning & Maintenance": "#10b981",
    "Pantry & Refreshments": "#ec4899",
    "Chai & Refreshments": "#ec4899",
    "Stationery & Printing": "#3b82f6",
    "Hardware & Electrical": "#f97316",
    "Hardware / Electrical Repair": "#f97316",
    "General / Miscellaneous": "#64748b",
    "Other / General": "#64748b",
  };

  // 1. COMBINED FLOW: Monthly breakdown (Selected Month)
  const flowItems = [
    { label: "Cash in Hand", value: totalCashCollected, color: "#10b981", type: "inflow" },
    { label: "Online UPI", value: totalOnlineCollected, color: "#0ea5e9", type: "inflow" },
    { label: "Expenses Deducted", value: totalExpensesLogged, color: "#f43f5e", type: "outflow" },
  ].filter((item) => item.value > 0);

  // 2. ALL HEADS: Full Year Breakdown
  const annualCategoryTotals = {};
  currentYearExpenses.forEach((e) => {
    const cat = e.category || "General / Miscellaneous";
    const amt = Number(e.amount) || 0;
    annualCategoryTotals[cat] = (annualCategoryTotals[cat] || 0) + amt;
  });

  const detailedItems = [
    { label: "Cash in Hand", value: annualCashTotal, color: "#10b981", type: "inflow" },
    { label: "Online UPI", value: annualOnlineTotal, color: "#0ea5e9", type: "inflow" },
    ...Object.keys(annualCategoryTotals).map((cat) => ({
      label: cat,
      value: annualCategoryTotals[cat],
      color: CATEGORY_COLORS[cat] || "#64748b",
      type: "outflow",
    })),
  ].filter((item) => item.value > 0);

  // Mode Selection
  const activeChartItems = pieMode === "flow" ? flowItems : detailedItems;
  const activePieTotal = activeChartItems.reduce((acc, curr) => acc + curr.value, 0);

  let cumulativeAngle = 0;
  const pieSlices = activeChartItems.map((item) => {
    const sliceAngle = activePieTotal > 0 ? (item.value / activePieTotal) * 360 : 0;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle = endAngle;
    const percent = activePieTotal > 0 ? (item.value / activePieTotal) * 100 : 0;
    return { ...item, startAngle, endAngle, percent };
  });

  const createDonutArc = (cx, cy, rIn, rOut, startAngle, endAngle) => {
    const angleDiff = endAngle - startAngle;
    if (angleDiff <= 0) return "";
    const adjustedEnd = angleDiff >= 359.99 ? startAngle + 359.99 : endAngle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((adjustedEnd - 90) * Math.PI) / 180;

    const x1 = cx + rOut * Math.cos(startRad);
    const y1 = cy + rOut * Math.sin(startRad);
    const x2 = cx + rOut * Math.cos(endRad);
    const y2 = cy + rOut * Math.sin(endRad);

    const x3 = cx + rIn * Math.cos(endRad);
    const y3 = cy + rIn * Math.sin(endRad);
    const x4 = cx + rIn * Math.cos(startRad);
    const y4 = cy + rIn * Math.sin(startRad);

    const largeArc = angleDiff > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  // Filtered lists
  const displayedExpenses = selectedMonthExpenses.filter((e) => {
    if (selectedCategoryFilter === "ALL") return true;
    return e.category === selectedCategoryFilter;
  });

  const displayedStudents = selectedMonthCollections.filter((s) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase().trim();
    return s.name.toLowerCase().includes(q) || String(s.seat).includes(q);
  });

  // Real-time listener for archived summaries
  const [archivedYears, setArchivedYears] = useState([]);

  useEffect(() => {
    const archRef = collection(db, "yearly_summary");
    const unsub = onSnapshot(
      archRef,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        list.sort((a, b) => Number(b.year) - Number(a.year));
        setArchivedYears(list);
      },
      (error) => {
        console.error("Yearly sync error:", error);
      }
    );
    return () => unsub();
  }, []);

  // =========================================================================
  // ⚡ 100% AUTOMATIC PAST YEAR ARCHIVING
  // =========================================================================
  useEffect(() => {
    if (allCollections.length === 0 && expensesList.length === 0) return;

    const autoArchivePastYears = async () => {
      const pastYearsWithData = new Set();

      allCollections.forEach((item) => {
        if (item.paidDate && item.paidDate !== "0-0-0") {
          const y = new Date(item.paidDate).getFullYear();
          if (y < currentYear) pastYearsWithData.add(y);
        }
      });

      expensesList.forEach((item) => {
        if (item.date) {
          const y = new Date(item.date).getFullYear();
          if (y < currentYear) pastYearsWithData.add(y);
        }
      });

      for (const pastYear of pastYearsWithData) {
        const yearStr = String(pastYear);

        const pastYearColls = allCollections.filter((s) => {
          if (!s.paidDate || s.paidDate === "0-0-0") return false;
          return new Date(s.paidDate).getFullYear() === pastYear;
        });

        const pastYearExps = expensesList.filter((e) => {
          if (!e.date) return false;
          return new Date(e.date).getFullYear() === pastYear;
        });

        const totalFees = pastYearColls.reduce((acc, curr) => acc + curr.amount, 0);
        const cashTotal = pastYearColls.filter(s => s.paymentMode === "Cash").reduce((acc, curr) => acc + curr.amount, 0);
        const onlineTotal = pastYearColls.filter(s => s.paymentMode !== "Cash").reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpenses = pastYearExps.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
        const netProfitCalc = totalFees - totalExpenses;

        const existingRecord = archivedYears.find((r) => String(r.year) === yearStr);

        if (
          !existingRecord ||
          existingRecord.totalFees !== totalFees ||
          existingRecord.totalExpenses !== totalExpenses
        ) {
          try {
            await setDoc(
              doc(db, "yearly_summary", yearStr),
              {
                year: pastYear,
                totalFees,
                totalExpenses,
                netProfit: netProfitCalc,
                cashTotal,
                onlineTotal,
                totalAdmissions: pastYearColls.length,
                status: "Auto-Archived",
                savedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              },
              { merge: true }
            );
          } catch (err) {
            console.error("Auto archive error for year:", pastYear, err);
          }
        }
      }
    };

    autoArchivePastYears();
  }, [allCollections.length, expensesList.length, archivedYears, currentYear]);

  // ==========================================
  // 🖨 7. PRINT REPORT
  // ==========================================
  const printFinancialReport = () => {
    const studentRows = selectedMonthCollections
      .map(
        (s, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${s.name}</strong></td>
        <td>Seat ${s.seat}</td>
        <td>${s.plan}</td>
        <td>${s.paidDate}</td>
        <td><span style="font-weight:bold; color:${s.paymentMode === "Cash" ? "#059669" : "#0284c7"}">${s.paymentMode}</span></td>
        <td>₹${s.amount.toLocaleString("en-IN")}</td>
      </tr>
    `
      )
      .join("");

    const expenseRows = selectedMonthExpenses
      .map(
        (e, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${e.date}</td>
        <td><strong>${e.category}</strong></td>
        <td>${e.description}</td>
        <td>₹${Number(e.amount).toLocaleString("en-IN")}</td>
      </tr>
    `
      )
      .join("");

    const printWin = window.open("", "", "width=1200,height=800");
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Financial Report - ${monthNames[selectedMonth]} ${selectedYear}</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 32px; color: #0f172a; background: #ffffff; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
            h1 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
            h2 { margin: 4px 0 0; font-size: 14px; color: #64748b; font-weight: 600; }
            .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
            .kpi-box { border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px; background: #f8fafc; }
            .kpi-title { font-size: 10px; text-transform: uppercase; font-weight: 800; color: #64748b; letter-spacing: 0.5px; }
            .kpi-val { font-size: 20px; font-weight: 800; margin-top: 6px; }
            h3 { font-size: 13px; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-top: 24px; letter-spacing: 0.5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th { background: #0f172a; color: #ffffff; padding: 8px 10px; text-align: left; }
            td { border-bottom: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
            tr:nth-child(even) { background: #f8fafc; }
            .footer { margin-top: 36px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>ANY TIME LIBRARY</h1>
              <h2>Executive Financial Statement • ${monthNames[selectedMonth]} ${selectedYear}</h2>
            </div>
            <div style="font-size: 11px; color: #64748b;">
              Generated on ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>

          <div class="kpis">
            <div class="kpi-box">
              <div class="kpi-title">Gross Revenue</div>
              <div class="kpi-val" style="color: #059669;">₹${totalFeesRealized.toLocaleString("en-IN")}</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-title">Cash in Hand</div>
              <div class="kpi-val" style="color: #10b981;">₹${totalCashCollected.toLocaleString("en-IN")}</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-title">Online / UPI</div>
              <div class="kpi-val" style="color: #0284c7;">₹${totalOnlineCollected.toLocaleString("en-IN")}</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-title">Net Profit</div>
              <div class="kpi-val" style="color: #d97706;">₹${netProfit.toLocaleString("en-IN")}</div>
            </div>
          </div>

          <h3>1. Fee Collections (${monthNames[selectedMonth]})</h3>
          <table>
            <thead><tr><th>#</th><th>Student Name</th><th>Seat</th><th>Shift</th><th>Payment Date</th><th>Mode</th><th>Amount</th></tr></thead>
            <tbody>${studentRows || "<tr><td colspan='7' style='text-align:center;'>No revenue recorded.</td></tr>"}</tbody>
          </table>

          <h3>2. Itemized Operational Expenses (${monthNames[selectedMonth]})</h3>
          <table>
            <thead><tr><th>#</th><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
            <tbody>${expenseRows || "<tr><td colspan='5' style='text-align:center;'>No expenses recorded.</td></tr>"}</tbody>
          </table>

          <div class="footer">Confidential Financial Audit • Any Time Library Management System</div>
        </body>
      </html>
    `);
    printWin.document.close();
    setTimeout(() => {
      printWin.focus();
      printWin.print();
    }, 500);
  };

  return (
    <div className={`w-full pb-16 font-sans antialiased space-y-7 ${isLight ? "text-slate-900" : "text-slate-100"}`}>
      
      {/* =========================================================================
          👑 1. TOP HEADER & MONTH SELECTOR
      ========================================================================= */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b ${
        isLight ? "border-white/50" : "border-slate-800/80"
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isLight ? "text-sky-800" : "text-emerald-400"}`}>
              Financial Intelligence
            </span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
            Accounts & <span className={`text-transparent bg-clip-text ${
              isLight 
                ? "bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600" 
                : "bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-500"
            }`}>Financial Ledger</span>
          </h2>
          <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
            Operational cash flow, payment modes, and expense distribution.
          </p>
        </div>

        <button
          onClick={printFinancialReport}
          className={`font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-sm self-start lg:self-auto cursor-pointer ${
            isLight
              ? "bg-white/40 backdrop-blur-2xl text-slate-800 border border-white/80 shadow-[0_4px_20px_rgba(14,165,233,0.1)] hover:bg-white/60 hover:text-sky-700"
              : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700"
          }`}
        >
          <span>🖨</span> Print Statement
        </button>
      </div>

      {/* Month Selector Tabs */}
      <div className={`p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border ${
        isLight
          ? "bg-white/35 backdrop-blur-2xl border-white/70 shadow-[0_8px_32px_rgba(14,165,233,0.08)]"
          : "bg-[#090e1a] border-slate-800/90"
      }`}>
        {monthNames.map((m, idx) => (
          <button
            key={m}
            type="button"
            onClick={() => setSelectedMonth(idx)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              selectedMonth === idx
                ? (isLight
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30"
                    : "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md")
                : (isLight
                    ? "text-slate-700 hover:text-slate-950 hover:bg-white/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60")
            }`}
          >
            <span>{m}</span>
            {idx === currentMonthIndex && (
              <span className={`w-1.5 h-1.5 rounded-full ${
                selectedMonth === idx 
                  ? (isLight ? "bg-white" : "bg-slate-950") 
                  : (isLight ? "bg-sky-500" : "bg-amber-400")
              }`}></span>
            )}
          </button>
        ))}
      </div>

      {/* =========================================================================
          ⚡ 2. FOUR CLEAN KPI TILES
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* REVENUE */}
        <div className={`p-5 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
          isLight 
            ? "bg-white/35 backdrop-blur-2xl border-white/70 shadow-[0_8px_32px_rgba(14,165,233,0.08)]" 
            : "bg-[#0b1120] border-slate-800/90 shadow-lg"
        }`}>
          <div className={`flex items-center justify-between text-[10px] font-black uppercase tracking-wider ${
            isLight ? "text-emerald-800" : "text-emerald-400"
          }`}>
            <span>Gross Revenue</span>
            <span>💰</span>
          </div>
          <h3 className={`text-2xl font-black mt-2 font-mono ${isLight ? "text-slate-900" : "text-white"}`}>
            ₹{totalFeesRealized.toLocaleString("en-IN")}
          </h3>
          <p className={`text-[11px] mt-1 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
            {selectedMonthCollections.length} Verified Subscriptions
          </p>
        </div>

        {/* EXPENSES */}
        <div className={`p-5 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
          isLight 
            ? "bg-white/35 backdrop-blur-2xl border-white/70 shadow-[0_8px_32px_rgba(14,165,233,0.08)]" 
            : "bg-[#0b1120] border-slate-800/90 shadow-lg"
        }`}>
          <div className={`flex items-center justify-between text-[10px] font-black uppercase tracking-wider ${
            isLight ? "text-rose-800" : "text-rose-400"
          }`}>
            <span>Total Expenses</span>
            <span>📉</span>
          </div>
          <h3 className={`text-2xl font-black mt-2 font-mono ${isLight ? "text-slate-900" : "text-white"}`}>
            ₹{totalExpensesLogged.toLocaleString("en-IN")}
          </h3>
          <p className={`text-[11px] mt-1 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
            {selectedMonthExpenses.length} Outflow Records
          </p>
        </div>

        {/* NET PROFIT */}
        <div className={`p-5 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
          isLight 
            ? "bg-white/35 backdrop-blur-2xl border-white/70 shadow-[0_8px_32px_rgba(14,165,233,0.08)]" 
            : "bg-[#0b1120] border-slate-800/90 shadow-lg"
        }`}>
          <div className={`flex items-center justify-between text-[10px] font-black uppercase tracking-wider ${
            isLight ? "text-sky-800" : "text-amber-400"
          }`}>
            <span>Net Profit</span>
            <span>💎</span>
          </div>
          <h3 className={`text-2xl font-black mt-2 font-mono ${
            netProfit >= 0 ? (isLight ? "text-emerald-800" : "text-amber-400") : "text-rose-600"
          }`}>
            ₹{netProfit.toLocaleString("en-IN")}
          </h3>
          <p className={`text-[11px] mt-1 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
            {profitMargin}% Retention Margin
          </p>
        </div>

        {/* PAYMENT SPLIT */}
        <div className={`p-5 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
          isLight 
            ? "bg-white/35 backdrop-blur-2xl border-white/70 shadow-[0_8px_32px_rgba(14,165,233,0.08)]" 
            : "bg-[#0b1120] border-slate-800/90 shadow-lg"
        }`}>
          <div className={`flex items-center justify-between text-[10px] font-black uppercase tracking-wider ${
            isLight ? "text-sky-800" : "text-sky-400"
          }`}>
            <span>Payment Modes</span>
            <span>🔄</span>
          </div>
          <h3 className={`text-xl font-black mt-2 font-mono ${isLight ? "text-slate-900" : "text-white"}`}>
            {cashPercent}% <span className={`text-xs font-normal ${isLight ? "text-slate-600" : "text-slate-500"}`}>Cash</span> / {onlinePercent}% <span className={`text-xs font-normal ${isLight ? "text-slate-600" : "text-slate-500"}`}>UPI</span>
          </h3>
          <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden flex ${isLight ? "bg-white/60 border border-white/80" : "bg-slate-800"}`}>
            <div style={{ width: `${cashPercent}%` }} className="h-full bg-emerald-500"></div>
            <div style={{ width: `${onlinePercent}%` }} className="h-full bg-sky-500"></div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          📊 3. THE SINGLE UNIFIED PIE / DONUT CHART CONTAINER
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT (7 COLS): THE DONUT CHART CONTAINER */}
        <div className={`lg:col-span-7 border rounded-[32px] p-6 shadow-sm flex flex-col justify-between transition-colors ${
          isLight 
            ? "bg-white/35 backdrop-blur-2xl border-white/70 shadow-[0_8px_32px_rgba(14,165,233,0.08)]" 
            : "bg-[#0b1120] border-slate-800 shadow-xl"
        }`}>
          <div>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
              isLight ? "border-white/40" : "border-slate-800/80"
            }`}>
              <div>
                <h3 className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${
                  isLight ? "text-slate-900" : "text-white"
                }`}>
                  <span>🥧</span> {pieMode === "flow" ? `Monthly Flow (${monthNames[selectedMonth]} ${selectedYear})` : `All Heads Annual Ledger (${selectedYear})`}
                </h3>
              </div>

              {/* Clean View Toggle */}
              <div className={`flex items-center p-1 rounded-2xl border self-start sm:self-auto ${
                isLight ? "bg-white/50 backdrop-blur-md border-white/80" : "bg-slate-900 border-slate-800"
              }`}>
                <button
                  type="button"
                  onClick={() => {
                    setPieMode("flow");
                    setHoveredSliceIndex(null);
                  }}
                  className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wider transition cursor-pointer ${
                    pieMode === "flow" 
                      ? (isLight ? "bg-sky-500 text-white shadow-md shadow-sky-500/25" : "bg-amber-400 text-slate-950 shadow-sm") 
                      : (isLight ? "text-slate-700 hover:text-slate-950" : "text-slate-400 hover:text-white")
                  }`}
                >
                  Combined Flow (Month)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPieMode("detailed");
                    setHoveredSliceIndex(null);
                  }}
                  className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wider transition cursor-pointer ${
                    pieMode === "detailed" 
                      ? (isLight ? "bg-sky-500 text-white shadow-md shadow-sky-500/25" : "bg-amber-400 text-slate-950 shadow-sm") 
                      : (isLight ? "text-slate-700 hover:text-slate-950" : "text-slate-400 hover:text-white")
                  }`}
                >
                  All Heads ({selectedYear})
                </button>
              </div>
            </div>

            {/* SVG Donut & Legend */}
            <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-6">
              
              {/* Donut SVG */}
              <div className="relative w-48 h-48 shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {activePieTotal === 0 ? (
                    <circle cx="100" cy="100" r="60" fill="none" stroke={isLight ? "rgba(255,255,255,0.6)" : "#1e293b"} strokeWidth="28" />
                  ) : (
                    pieSlices.map((slice, i) => {
                      const isHovered = hoveredSliceIndex === i;
                      const path = createDonutArc(100, 100, isHovered ? 45 : 48, isHovered ? 83 : 80, slice.startAngle, slice.endAngle);
                      return (
                        <path
                          key={slice.label}
                          d={path}
                          fill={slice.color}
                          className="transition-all duration-200 cursor-pointer"
                          style={{ opacity: hoveredSliceIndex === null || isHovered ? 1 : 0.4 }}
                          onMouseEnter={() => setHoveredSliceIndex(i)}
                          onMouseLeave={() => setHoveredSliceIndex(null)}
                        />
                      );
                    })
                  )}
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                  {hoveredSliceIndex !== null && pieSlices[hoveredSliceIndex] ? (
                    <>
                      <span className={`text-[9px] font-bold uppercase tracking-wider truncate max-w-[110px] ${
                        isLight ? "text-slate-600 font-medium" : "text-slate-400"
                      }`}>
                        {pieSlices[hoveredSliceIndex].label}
                      </span>
                      <span className={`text-base font-black font-mono mt-0.5 ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}>
                        {pieSlices[hoveredSliceIndex].type === "outflow" ? "-" : ""}₹
                        {pieSlices[hoveredSliceIndex].value.toLocaleString("en-IN")}
                      </span>
                      <span className={`text-[10px] font-mono ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                        {pieSlices[hoveredSliceIndex].percent.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${
                        isLight ? "text-slate-600 font-medium" : "text-slate-400"
                      }`}>
                        {pieMode === "flow" ? "Net Profit" : `Annual Net (${selectedYear})`}
                      </span>
                      <span className={`text-base font-black font-mono mt-0.5 ${
                        (pieMode === "flow" ? netProfit : annualNetProfit) >= 0 
                          ? (isLight ? "text-emerald-800" : "text-amber-400") 
                          : "text-rose-600"
                      }`}>
                        ₹{(pieMode === "flow" ? netProfit : annualNetProfit).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-700 font-bold">
                        {pieMode === "flow" ? profitMargin : annualProfitMargin}% Margin
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Clean Legend */}
              <div className="flex-1 w-full space-y-2 max-h-[200px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-sky-400/50">
                {pieSlices.length === 0 ? (
                  <p className={`text-xs text-center py-6 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                    No financial transactions recorded.
                  </p>
                ) : (
                  pieSlices.map((item, idx) => (
                    <div
                      key={item.label}
                      onMouseEnter={() => setHoveredSliceIndex(idx)}
                      onMouseLeave={() => setHoveredSliceIndex(null)}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs transition cursor-pointer ${
                        isLight
                          ? "bg-white/45 backdrop-blur-md border-white/70 hover:bg-white/65 shadow-sm"
                          : "bg-[#080d16] border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className={`font-semibold truncate ${isLight ? "text-slate-800" : "text-slate-300"}`}>{item.label}</span>
                      </div>
                      <div className="text-right font-mono shrink-0 ml-2">
                        <span className={`font-bold block text-xs ${item.type === "outflow" ? "text-rose-600" : (isLight ? "text-slate-900" : "text-white")}`}>
                          {item.type === "outflow" ? "-" : "+"}₹{item.value.toLocaleString("en-IN")}
                        </span>
                        <span className={`text-[10px] ${isLight ? "text-slate-500" : "text-slate-500"}`}>{item.percent.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

          <div className={`pt-3 border-t text-[11px] flex justify-between font-mono ${
            isLight ? "border-white/40 text-slate-700" : "border-slate-800 text-slate-400"
          }`}>
            <span>
              {pieMode === "flow" ? `Month Gross (${monthNames[selectedMonth]}): ` : `Annual Gross (${selectedYear}): `}
              ₹{(pieMode === "flow" ? totalFeesRealized : annualFeesTotal).toLocaleString("en-IN")}
            </span>
            <span className="text-rose-600 font-bold">
              {pieMode === "flow" ? "Month Deducted: " : "Annual Deducted: "}
              -₹{(pieMode === "flow" ? totalExpensesLogged : annualExpensesTotal).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* RIGHT (5 COLS): CAPITAL REALIZATION CONTAINER */}
        <div className={`lg:col-span-5 border rounded-[32px] p-6 shadow-sm flex flex-col justify-between transition-colors ${
          isLight 
            ? "bg-white/35 backdrop-blur-2xl border-white/70 shadow-[0_8px_32px_rgba(14,165,233,0.08)]" 
            : "bg-[#0b1120] border-slate-800 shadow-xl"
        }`}>
          <div>
            <div className={`pb-3 border-b ${isLight ? "border-white/40" : "border-slate-800/80"}`}>
              <h3 className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${
                isLight ? "text-slate-900" : "text-white"
              }`}>
                <span>📈</span> Capital Realization
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                Summary of physical vs digital inflow and operating margin.
              </p>
            </div>

            <div className="py-5 space-y-3">
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isLight ? "bg-white/50 backdrop-blur-md border-emerald-300/60 shadow-sm" : "bg-[#080d16] border-emerald-500/20"
              }`}>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm">💵</span>
                  <div>
                    <span className={`text-xs font-bold block ${isLight ? "text-slate-900" : "text-white"}`}>Cash in Hand</span>
                    <span className={`text-[10px] font-mono ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>{cashPercent}% of total revenue</span>
                  </div>
                </div>
                <span className={`font-black font-mono text-sm ${isLight ? "text-emerald-800" : "text-emerald-400"}`}>
                  ₹{totalCashCollected.toLocaleString("en-IN")}
                </span>
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isLight ? "bg-white/50 backdrop-blur-md border-sky-300/60 shadow-sm" : "bg-[#080d16] border-sky-500/20"
              }`}>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-lg">📱</span>
                  <div>
                    <span className={`text-xs font-bold block ${isLight ? "text-slate-900" : "text-white"}`}>Online UPI</span>
                    <span className={`text-[10px] font-mono ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>{onlinePercent}% of total revenue</span>
                  </div>
                </div>
                <span className={`font-black font-mono text-sm ${isLight ? "text-sky-800" : "text-sky-400"}`}>
                  ₹{totalOnlineCollected.toLocaleString("en-IN")}
                </span>
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isLight ? "bg-white/50 backdrop-blur-md border-rose-300/60 shadow-sm" : "bg-[#080d16] border-rose-500/20"
              }`}>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-sm">🔻</span>
                  <div>
                    <span className={`text-xs font-bold block ${isLight ? "text-slate-900" : "text-white"}`}>Expenses Deducted</span>
                    <span className={`text-[10px] font-mono ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>{selectedMonthExpenses.length} Outflow records</span>
                  </div>
                </div>
                <span className="font-black font-mono text-rose-600 text-sm">
                  -₹{totalExpensesLogged.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Retention Progress Bar */}
              <div className="pt-2">
                <div className={`flex items-center justify-between text-[11px] font-mono mb-1 ${
                  isLight ? "text-slate-600 font-medium" : "text-slate-400"
                }`}>
                  <span>Net Profit Margin:</span>
                  <span className={isLight ? "text-sky-800 font-bold" : "text-amber-400 font-bold"}>{profitMargin}%</span>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden border flex ${
                  isLight ? "bg-white/50 border-white/70" : "bg-slate-900 border-slate-800"
                }`}>
                  <div
                    style={{ width: `${Math.max(0, Math.min(profitMargin, 100))}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      isLight 
                        ? "bg-gradient-to-r from-sky-500 to-emerald-500" 
                        : "bg-gradient-to-r from-amber-400 to-emerald-500"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className={`pt-3 border-t text-[11px] flex justify-between font-mono ${
            isLight ? "border-white/40 text-slate-700" : "border-slate-800 text-slate-400"
          }`}>
            <span>Net Retained Balance:</span>
            <span className={netProfit >= 0 ? (isLight ? "text-emerald-800 font-bold" : "text-amber-400 font-bold") : "text-rose-600 font-bold"}>
              ₹{netProfit.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          📝 4. ADD EXPENSE & EXPENSE LEDGER
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ADD EXPENSE FORM */}
        <div className={`lg:col-span-5 border rounded-[32px] p-6 shadow-sm transition-colors ${
          isLight 
            ? "bg-white/35 backdrop-blur-2xl border-white/70 shadow-[0_8px_32px_rgba(14,165,233,0.08)]" 
            : "bg-[#0b1120] border-slate-800 shadow-xl"
        }`}>
          <div className={`flex items-center justify-between pb-3 mb-4 border-b ${
            isLight ? "border-white/40" : "border-slate-800"
          }`}>
            <div>
              <h3 className={`font-black text-sm uppercase tracking-wider ${isLight ? "text-slate-900" : "text-white"}`}>Record Expense</h3>
              <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>Log operational expense with reason.</p>
            </div>
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${
              isLight ? "text-sky-900 bg-sky-400/20 border-sky-400/40" : "text-amber-400 bg-amber-400/10 border-amber-400/20"
            }`}>
              Real-Time
            </span>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-3.5">
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                isLight ? "text-slate-700" : "text-slate-400"
              }`}>Date</label>
              <input
                type="date"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                required
                className={`w-full border rounded-xl px-3.5 py-2 text-xs font-semibold outline-none shadow-sm transition ${
                  isLight 
                    ? "bg-white/60 backdrop-blur-md border-white/90 text-slate-900 focus:border-sky-500 focus:bg-white" 
                    : "bg-[#080d16] border-slate-700/80 text-white focus:border-amber-400"
                }`}
              />
            </div>

            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                isLight ? "text-slate-700" : "text-slate-400"
              }`}>Category</label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value)}
                className={`w-full border rounded-xl px-3.5 py-2 text-xs font-semibold outline-none cursor-pointer shadow-sm transition ${
                  isLight 
                    ? "bg-white/60 backdrop-blur-md border-white/90 text-slate-900 focus:border-sky-500 focus:bg-white" 
                    : "bg-[#080d16] border-slate-700/80 text-white focus:border-amber-400"
                }`}
              >
                <option value="Electricity Bill" className={isLight ? "bg-white text-slate-900" : "bg-[#080d16] text-white"}>⚡ Electricity Bill</option>
                <option value="WiFi & Internet" className={isLight ? "bg-white text-slate-900" : "bg-[#080d16] text-white"}>📶 WiFi & Internet</option>
                <option value="Cleaning & Maintenance" className={isLight ? "bg-white text-slate-900" : "bg-[#080d16] text-white"}>🧹 Cleaning & Maintenance</option>
                <option value="Hardware & Electrical" className={isLight ? "bg-white text-slate-900" : "bg-[#080d16] text-white"}>🔧 Hardware & Electrical</option>
                <option value="General / Miscellaneous" className={isLight ? "bg-white text-slate-900" : "bg-[#080d16] text-white"}>📦 Miscellaneous Expenses</option>
              </select>
            </div>

            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                isLight ? "text-slate-700" : "text-slate-400"
              }`}>Description / Purpose</label>
              <input
                type="text"
                placeholder="Write a brief description of the expense..."
                value={expDescription}
                onChange={(e) => setExpDescription(e.target.value)}
                className={`w-full border rounded-xl px-3.5 py-2 text-xs outline-none shadow-sm transition ${
                  isLight 
                    ? "bg-white/60 backdrop-blur-md border-white/90 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white" 
                    : "bg-[#080d16] border-slate-700/80 text-white placeholder-slate-500 focus:border-amber-400"
                }`}
              />
            </div>

            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                isLight ? "text-slate-700" : "text-slate-400"
              }`}>Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter Amount ₹"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
                required
                min="1"
                className={`w-full border rounded-xl px-3.5 py-2 text-sm font-black outline-none font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-sm transition ${
                  isLight 
                    ? "bg-white/60 backdrop-blur-md border-white/90 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white" 
                    : "bg-[#080d16] border-slate-700/80 text-white placeholder-slate-500 focus:border-amber-400"
                }`}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-md mt-1 cursor-pointer active:scale-98 ${
                isLight
                  ? "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white shadow-sky-500/30"
                  : "bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950"
              }`}
            >
              {isSubmitting ? "Saving..." : "Add Expense Record"}
            </button>
          </form>
        </div>

        {/* EXPENSE LEDGER */}
        <div className={`lg:col-span-7 border rounded-[32px] p-6 shadow-sm flex flex-col justify-between min-h-[440px] transition-colors ${
          isLight 
            ? "bg-white/35 backdrop-blur-2xl border-white/70 shadow-[0_8px_32px_rgba(14,165,233,0.08)]" 
            : "bg-[#0b1120] border-slate-800 shadow-xl"
        }`}>
          <div>
            <div className={`flex items-center justify-between pb-3 mb-3 border-b ${
              isLight ? "border-white/40" : "border-slate-800"
            }`}>
              <div>
                <h3 className={`font-black text-sm uppercase tracking-wider ${isLight ? "text-slate-900" : "text-white"}`}>Expense Ledger</h3>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>Itemized transaction log for {monthNames[selectedMonth]}.</p>
              </div>

              <span className={`text-xs font-black px-2.5 py-1 rounded-xl border font-mono ${
                isLight ? "text-rose-700 bg-rose-500/15 border-rose-300/60" : "text-rose-400 bg-rose-500/10 border-rose-500/20"
              }`}>
                Total: ₹{totalExpensesLogged.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2 [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter("ALL")}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap transition cursor-pointer ${
                  selectedCategoryFilter === "ALL" 
                    ? (isLight 
                        ? "bg-sky-500 text-white font-black shadow-md shadow-sky-500/25" 
                        : "bg-amber-400 text-slate-950 font-black shadow-sm")
                    : (isLight 
                        ? "bg-white/60 border border-white/80 text-slate-700 hover:text-slate-900" 
                        : "bg-slate-900 text-slate-400 hover:text-white")
                }`}
              >
                All ({selectedMonthExpenses.length})
              </button>
              {Object.keys(CATEGORY_COLORS).map((cat) => {
                const count = selectedMonthExpenses.filter((e) => e.category === cat).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                      selectedCategoryFilter === cat 
                        ? (isLight ? "bg-sky-600 text-white font-black shadow-sm" : "bg-slate-200 text-slate-950 font-black") 
                        : (isLight 
                            ? "bg-white/60 border border-white/80 text-slate-700 hover:text-slate-900" 
                            : "bg-slate-900 text-slate-400 hover:text-white")
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Expense rows */}
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-sky-400/50">
              {displayedExpenses.length === 0 ? (
                <div className={`py-16 text-center text-xs ${isLight ? "text-slate-500 font-medium" : "text-slate-500"}`}>
                  No expense records found.
                </div>
              ) : (
                displayedExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                      isLight
                        ? "bg-white/45 backdrop-blur-md border-white/80 hover:bg-white/65 shadow-sm"
                        : "bg-[#080d16] border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl border flex flex-col items-center justify-center font-mono shrink-0 ${
                        isLight ? "bg-white/70 border-white/90 text-slate-800 shadow-sm" : "bg-slate-900 border-slate-800 text-slate-300"
                      }`}>
                        <span className={`text-[9px] font-bold uppercase leading-none ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                          {new Date(exp.date).toLocaleString("en-US", { month: "short" })}
                        </span>
                        <span className={`text-xs font-black leading-none mt-0.5 ${isLight ? "text-slate-900" : "text-white"}`}>
                          {new Date(exp.date).getDate()}
                        </span>
                      </div>

                      <div>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold border inline-block"
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[exp.category] || "#64748b"}15`,
                            borderColor: `${CATEGORY_COLORS[exp.category] || "#64748b"}40`,
                            color: CATEGORY_COLORS[exp.category] || (isLight ? "#0f172a" : "#e2e8f0"),
                          }}
                        >
                          {exp.category}
                        </span>
                        <p className={`text-xs font-semibold mt-1 leading-snug ${isLight ? "text-slate-900" : "text-white"}`}>
                          {exp.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="font-black text-xs text-rose-600 font-mono">
                        -₹{Number(exp.amount).toLocaleString("en-IN")}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(exp.id, exp.description, exp.amount)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                          isLight
                            ? "bg-rose-500/15 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-300/40"
                            : "bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white"
                        }`}
                        title="Delete Record"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`pt-3 mt-3 border-t flex justify-between items-center text-xs font-mono ${
            isLight ? "border-white/40 text-slate-700" : "border-slate-800 text-slate-400"
          }`}>
            <span>Filtered Total:</span>
            <span className={`font-black ${isLight ? "text-slate-900" : "text-white"}`}>
              ₹{displayedExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          👥 5. REVENUE ROSTER & PAYMENT TILES
      ========================================================================= */}
      <div className={`border rounded-[32px] p-6 shadow-sm space-y-4 transition-colors ${
        isLight 
          ? "bg-white/35 backdrop-blur-2xl border-white/70 shadow-[0_8px_32px_rgba(14,165,233,0.08)]" 
          : "bg-[#0b1120] border-slate-800 shadow-xl"
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
          isLight ? "border-white/40" : "border-slate-800"
        }`}>
          <div>
            <h3 className={`font-black text-sm uppercase tracking-wider flex items-center gap-2 ${
              isLight ? "text-slate-900" : "text-white"
            }`}>
              <span>🎓</span> Fee Collections Roster
            </h3>
            <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
              Itemized student fee submissions with payment dates and verified modes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by student or seat..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className={`border rounded-xl px-3 py-1.5 text-xs outline-none shadow-sm transition ${
                isLight 
                  ? "bg-white/60 backdrop-blur-md border-white/90 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white" 
                  : "bg-[#080d16] border-slate-700 text-white placeholder-slate-500 focus:border-amber-400"
              }`}
            />
            <span className={`text-xs font-black px-3 py-1.5 rounded-xl border font-mono ${
              isLight ? "text-emerald-800 bg-emerald-500/15 border-emerald-300/60" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            }`}>
              ₹{totalFeesRealized.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-sky-400/50">
          {displayedStudents.length === 0 ? (
            <div className={`py-12 text-center text-xs ${isLight ? "text-slate-500 font-medium" : "text-slate-500"}`}>
              No revenue collections found for this period.
            </div>
          ) : (
            displayedStudents.map((student, idx) => (
              <div
                key={`${student.name}-${student.seat}-${idx}`}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition ${
                  isLight
                    ? "bg-white/45 backdrop-blur-md border-white/80 hover:bg-white/65 shadow-sm"
                    : "bg-[#080d16] border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl font-mono font-black flex items-center justify-center ${
                    isLight ? "bg-white/70 border border-white/90 text-sky-700 shadow-sm" : "bg-slate-800 border border-slate-700 text-amber-400"
                  }`}>
                    {student.seat}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>{student.name}</p>
                      
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        student.paymentMode === "Cash"
                          ? (isLight ? "bg-emerald-500/15 text-emerald-800 border-emerald-300/60" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30")
                          : (isLight ? "bg-sky-500/15 text-sky-800 border-sky-300/60" : "bg-sky-500/10 text-sky-400 border-sky-500/30")
                      }`}>
                        {student.paymentMode === "Cash" ? "💵 Cash" : "📱 Online"}
                      </span>

                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        student.entryType === "Renewal"
                          ? (isLight ? "bg-blue-500/15 text-blue-800 border-blue-300/60" : "bg-blue-500/10 text-blue-400 border-blue-500/30")
                          : (isLight ? "bg-purple-500/15 text-purple-800 border-purple-300/60" : "bg-purple-500/10 text-purple-400 border-purple-500/30")
                      }`}>
                        {student.entryType}
                      </span>
                    </div>

                    <p className={`text-[11px] mt-0.5 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                      {student.plan} • Paid On: <span className={`font-mono font-bold ${isLight ? "text-sky-800" : "text-amber-300"}`}>{student.paidDate}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <p className={`font-black text-sm ${isLight ? "text-emerald-800" : "text-emerald-400"}`}>
                    +₹{student.amount.toLocaleString("en-IN")}
                  </p>
                  <span className={`text-[9px] uppercase font-bold tracking-wider ${isLight ? "text-emerald-700" : "text-emerald-500/80"}`}>Verified</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2 TILES: CASH IN HAND & ONLINE / UPI */}
        <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isLight ? "bg-white/45 backdrop-blur-md border-emerald-300/60 shadow-sm" : "bg-[#080d16] border-emerald-500/30"
          }`}>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg">
                💵
              </span>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider block ${
                  isLight ? "text-emerald-800" : "text-emerald-400"
                }`}>
                  Cash in Hand
                </span>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>Physical cash collected</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xl font-black font-mono ${isLight ? "text-emerald-800" : "text-emerald-400"}`}>
                ₹{totalCashCollected.toLocaleString("en-IN")}
              </p>
              <span className={`text-[10px] font-mono ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                {selectedMonthCollections.filter((s) => s.paymentMode === "Cash").length} Subscriptions ({cashPercent}%)
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isLight ? "bg-white/45 backdrop-blur-md border-sky-300/60 shadow-sm" : "bg-[#080d16] border-sky-500/30"
          }`}>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-lg">
                📱
              </span>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider block ${
                  isLight ? "text-sky-800" : "text-sky-400"
                }`}>
                  Online Payments (UPI)
                </span>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>Direct bank transfers</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xl font-black font-mono ${isLight ? "text-sky-800" : "text-sky-400"}`}>
                ₹{totalOnlineCollected.toLocaleString("en-IN")}
              </p>
              <span className={`text-[10px] font-mono ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                {selectedMonthCollections.filter((s) => s.paymentMode !== "Cash").length} Subscriptions ({onlinePercent}%)
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          🏆 6. ANNUAL PERFORMANCE & AUTO-ARCHIVE DISPLAY
      ========================================================================= */}
      <div className={`border rounded-[32px] p-6 shadow-sm space-y-5 transition-colors ${
        isLight 
          ? "bg-white/35 backdrop-blur-2xl border-white/70 shadow-[0_8px_32px_rgba(14,165,233,0.08)]" 
          : "bg-[#0b1120] border-slate-800 shadow-xl"
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
          isLight ? "border-white/40" : "border-slate-800"
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-amber-500 text-base">📅</span>
              <h3 className={`font-black text-sm uppercase tracking-wider ${isLight ? "text-slate-900" : "text-white"}`}>
                Annual Financial Performance
              </h3>
            </div>
            <p className={`text-xs ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
              Year-on-year automated audit ledger and historical archive.
            </p>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl self-start sm:self-auto border ${
            isLight ? "bg-emerald-500/15 border-emerald-300/60" : "bg-emerald-500/10 border-emerald-500/30"
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className={`text-[10px] font-black uppercase tracking-wider font-mono ${
              isLight ? "text-emerald-800" : "text-emerald-400"
            }`}>
              Auto-Archive Active
            </span>
          </div>
        </div>

        {/* Current Year Running Card */}
        <div className={`p-4 rounded-2xl border ${
          isLight ? "bg-white/45 backdrop-blur-xl border-sky-300/70 shadow-sm" : "bg-[#080d16] border-amber-400/30"
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-black font-mono ${isLight ? "text-slate-900" : "text-white"}`}>{selectedYear}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                  isLight ? "bg-emerald-500/15 text-emerald-800 border-emerald-300/60" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                }`}>
                  Active Year
                </span>
              </div>
              <p className={`text-xs mt-1 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                Cumulative revenue and expenses recorded across all 12 months in {selectedYear}.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className={`border px-3.5 py-2 rounded-xl text-center ${
                isLight ? "bg-white/60 backdrop-blur-md border-white/80 shadow-sm" : "bg-slate-900 border-slate-800"
              }`}>
                <p className={`text-[9px] uppercase font-bold ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>Revenue</p>
                <p className={`text-sm font-black font-mono mt-0.5 ${isLight ? "text-emerald-800" : "text-emerald-400"}`}>₹{annualFeesTotal.toLocaleString("en-IN")}</p>
              </div>

              <div className={`border px-3.5 py-2 rounded-xl text-center ${
                isLight ? "bg-white/60 backdrop-blur-md border-white/80 shadow-sm" : "bg-slate-900 border-slate-800"
              }`}>
                <p className={`text-[9px] uppercase font-bold ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>Expenses</p>
                <p className="text-sm font-black text-rose-600 font-mono mt-0.5">₹{annualExpensesTotal.toLocaleString("en-IN")}</p>
              </div>

              <div className={`border px-3.5 py-2 rounded-xl text-center ${
                isLight ? "bg-white/60 backdrop-blur-md border-sky-300/60 shadow-sm" : "bg-slate-900 border-amber-400/20"
              }`}>
                <p className={`text-[9px] uppercase font-bold ${isLight ? "text-sky-800 font-black" : "text-amber-400"}`}>Net Profit</p>
                <p className={`text-sm font-black font-mono mt-0.5 ${isLight ? "text-sky-800" : "text-amber-400"}`}>₹{annualNetProfit.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          <div className={`mt-3 pt-3 border-t flex flex-wrap items-center justify-between text-xs gap-2 font-mono ${
            isLight ? "border-white/40 text-slate-700" : "border-slate-800/80 text-slate-400"
          }`}>
            <div className="flex items-center gap-4">
              <span>Cash Total: <strong className={isLight ? "text-emerald-800 font-bold" : "text-emerald-400"}>₹{annualCashTotal.toLocaleString("en-IN")}</strong></span>
              <span>Online Total: <strong className={isLight ? "text-sky-800 font-bold" : "text-sky-400"}>₹{annualOnlineTotal.toLocaleString("en-IN")}</strong></span>
            </div>
            <span className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-500"}`}>
              {currentYearCollections.length} total admissions recorded in {selectedYear}
            </span>
          </div>
        </div>

        {/* Previous Years Archive */}
        {archivedYears.filter((y) => Number(y.year) !== currentYear).length > 0 && (
          <div className="space-y-2 pt-1">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-700 font-semibold" : "text-slate-400"}`}>
              Archived Historical Records
            </h4>

            <div className="space-y-2">
              {archivedYears
                .filter((y) => Number(y.year) !== currentYear)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      isLight
                        ? "bg-white/45 backdrop-blur-md border-white/80 shadow-sm"
                        : "bg-[#080d16] border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-black font-mono ${isLight ? "text-slate-900" : "text-slate-300"}`}>{item.year}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                        isLight ? "bg-white/70 text-slate-700 border-white/90 shadow-sm" : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}>
                        {item.status || "Archived"}
                      </span>
                      <span className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-500"}`}>Auto-saved on: {item.savedAt || "Year End"}</span>
                    </div>

                    <div className="flex items-center gap-4 text-right font-mono">
                      <div>
                        <span className={`text-[9px] block uppercase ${isLight ? "text-slate-500" : "text-slate-500"}`}>Revenue</span>
                        <strong className={isLight ? "text-emerald-800" : "text-emerald-400"}>₹{Number(item.totalFees || 0).toLocaleString("en-IN")}</strong>
                      </div>
                      <div>
                        <span className={`text-[9px] block uppercase ${isLight ? "text-slate-500" : "text-slate-500"}`}>Expenses</span>
                        <strong className="text-rose-600">₹{Number(item.totalExpenses || 0).toLocaleString("en-IN")}</strong>
                      </div>
                      <div className={`pl-2 border-l ${isLight ? "border-white/50" : "border-slate-800"}`}>
                        <span className={`text-[9px] block font-bold uppercase ${isLight ? "text-sky-800 font-black" : "text-amber-400"}`}>Net Profit</span>
                        <strong className={`text-sm ${isLight ? "text-sky-800 font-black" : "text-amber-400"}`}>₹{Number(item.netProfit || 0).toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AccountsFinance;