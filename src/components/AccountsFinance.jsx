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

const AccountsFinance = ({ seats = [] }) => {
  const visibleSeats = seats.filter((seat) => seat.isVisible !== false);

  // ==========================================
  // 📅 1. DATE & MONTH SELECTOR
  // ==========================================
  const today = new Date();
  const currentMonthIndex = today.getMonth();
  const currentYear = today.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
  const [selectedYear, setSelectedYear] = useState(currentYear);

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
  const [expCategory, setExpCategory] = useState("Property Rent");
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
        description: expDescription.trim() || "No description provided",
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
    "Property Rent": "#8b5cf6",
    "Room / Hall Rent": "#8b5cf6",
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

  // 2. ALL HEADS: Full Year Breakdown (e.g. 2026, 2027)
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
  // ⚡ 100% AUTOMATIC PAST YEAR ARCHIVING (No manual button click needed)
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
    <div className="w-full pb-16 font-sans text-slate-100 antialiased space-y-7">
      
      {/* =========================================================================
          👑 1. TOP HEADER & MONTH SELECTOR
      ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
              Financial Intelligence
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Accounts & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400">Financial Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational cash flow, payment modes, and expense distribution.
          </p>
        </div>

        <button
          onClick={printFinancialReport}
          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-sm self-start lg:self-auto"
        >
          <span>🖨</span> Print Statement
        </button>
      </div>

      {/* Month Selector Tabs */}
      <div className="p-1.5 rounded-2xl bg-[#090e1a] border border-slate-800/90 flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {monthNames.map((m, idx) => (
          <button
            key={m}
            type="button"
            onClick={() => setSelectedMonth(idx)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
              selectedMonth === idx
                ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <span>{m}</span>
            {idx === currentMonthIndex && (
              <span className={`w-1.5 h-1.5 rounded-full ${selectedMonth === idx ? "bg-slate-950" : "bg-amber-400"}`}></span>
            )}
          </button>
        ))}
      </div>

      {/* =========================================================================
          ⚡ 2. FOUR CLEAN KPI TILES
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* REVENUE */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800/90 shadow-lg">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-400">
            <span>Gross Revenue</span>
            <span>💰</span>
          </div>
          <h3 className="text-2xl font-black text-white mt-2 font-mono">
            ₹{totalFeesRealized.toLocaleString("en-IN")}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {selectedMonthCollections.length} Verified Subscriptions
          </p>
        </div>

        {/* EXPENSES */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800/90 shadow-lg">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-rose-400">
            <span>Total Expenses</span>
            <span>📉</span>
          </div>
          <h3 className="text-2xl font-black text-white mt-2 font-mono">
            ₹{totalExpensesLogged.toLocaleString("en-IN")}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {selectedMonthExpenses.length} Outflow Records
          </p>
        </div>

        {/* NET PROFIT */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800/90 shadow-lg">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-amber-400">
            <span>Net Profit</span>
            <span>💎</span>
          </div>
          <h3 className={`text-2xl font-black mt-2 font-mono ${netProfit >= 0 ? "text-amber-400" : "text-rose-400"}`}>
            ₹{netProfit.toLocaleString("en-IN")}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {profitMargin}% Retention Margin
          </p>
        </div>

        {/* PAYMENT SPLIT */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800/90 shadow-lg">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-sky-400">
            <span>Payment Modes</span>
            <span>🔄</span>
          </div>
          <h3 className="text-xl font-black text-white mt-2 font-mono">
            {cashPercent}% <span className="text-xs text-slate-500 font-normal">Cash</span> / {onlinePercent}% <span className="text-xs text-slate-500 font-normal">UPI</span>
          </h3>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden flex">
            <div style={{ width: `${cashPercent}%` }} className="h-full bg-emerald-400"></div>
            <div style={{ width: `${onlinePercent}%` }} className="h-full bg-sky-400"></div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          📊 3. THE SINGLE UNIFIED PIE / DONUT CHART CONTAINER
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT (7 COLS): THE DONUT CHART WITH MONTH FLOW vs FULL YEAR ALL HEADS */}
        <div className="lg:col-span-7 bg-[#0b1120] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span>🥧</span> {pieMode === "flow" ? `Monthly Flow (${monthNames[selectedMonth]} ${selectedYear})` : `All Heads Annual Ledger (${selectedYear})`}
                </h3>
              </div>

              {/* Clean View Toggle: Monthly Flow vs Full Year All Heads */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setPieMode("flow");
                    setHoveredSliceIndex(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wider transition ${
                    pieMode === "flow" ? "bg-amber-400 text-slate-950 shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Montly ({monthNames[selectedMonth]})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPieMode("detailed");
                    setHoveredSliceIndex(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wider transition ${
                    pieMode === "detailed" ? "bg-amber-400 text-slate-950 shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Annual ({selectedYear})
                </button>
              </div>
            </div>

            {/* SVG Donut & Legend */}
            <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-6">
              
              {/* Donut SVG */}
              <div className="relative w-48 h-48 shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {activePieTotal === 0 ? (
                    <circle cx="100" cy="100" r="60" fill="none" stroke="#1e293b" strokeWidth="28" />
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
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate max-w-[110px]">
                        {pieSlices[hoveredSliceIndex].label}
                      </span>
                      <span className="text-base font-black text-white font-mono mt-0.5">
                        {pieSlices[hoveredSliceIndex].type === "outflow" ? "-" : ""}₹
                        {pieSlices[hoveredSliceIndex].value.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {pieSlices[hoveredSliceIndex].percent.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {pieMode === "flow" ? "Net Profit" : `Annual Net (${selectedYear})`}
                      </span>
                      <span className={`text-base font-black font-mono mt-0.5 ${(pieMode === "flow" ? netProfit : annualNetProfit) >= 0 ? "text-amber-400" : "text-rose-400"}`}>
                        ₹{(pieMode === "flow" ? netProfit : annualNetProfit).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400">
                        {pieMode === "flow" ? profitMargin : annualProfitMargin}% Margin
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Clean Legend */}
              <div className="flex-1 w-full space-y-2 max-h-[200px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-700">
                {pieSlices.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No financial transactions recorded.</p>
                ) : (
                  pieSlices.map((item, idx) => (
                    <div
                      key={item.label}
                      onMouseEnter={() => setHoveredSliceIndex(idx)}
                      onMouseLeave={() => setHoveredSliceIndex(null)}
                      className="p-2.5 rounded-xl bg-[#080d16] border border-slate-800/80 flex items-center justify-between text-xs transition hover:border-slate-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="font-semibold text-slate-300 truncate">{item.label}</span>
                      </div>
                      <div className="text-right font-mono shrink-0 ml-2">
                        <span className={`font-bold block text-xs ${item.type === "outflow" ? "text-rose-400" : "text-white"}`}>
                          {item.type === "outflow" ? "-" : "+"}₹{item.value.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-slate-500">{item.percent.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-mono">
            <span>
              {pieMode === "flow" ? `Month Gross (${monthNames[selectedMonth]}): ` : `Annual Gross (${selectedYear}): `}
              ₹{(pieMode === "flow" ? totalFeesRealized : annualFeesTotal).toLocaleString("en-IN")}
            </span>
            <span className="text-rose-400">
              {pieMode === "flow" ? "Month Deducted: " : "Annual Deducted: "}
              -₹{(pieMode === "flow" ? totalExpensesLogged : annualExpensesTotal).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* RIGHT (5 COLS): FINANCIAL RETENTION & METRICS */}
        <div className="lg:col-span-5 bg-[#0b1120] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-800/80">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>📈</span> Capital Realization
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Summary of physical vs digital inflow and operating margin.
              </p>
            </div>

            <div className="py-5 space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#080d16] border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm">💵</span>
                  <div>
                    <span className="text-xs font-bold text-white block">Cash in Hand</span>
                    <span className="text-[10px] text-slate-400 font-mono">{cashPercent}% of total revenue</span>
                  </div>
                </div>
                <span className="font-black font-mono text-emerald-400 text-sm">
                  ₹{totalCashCollected.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#080d16] border border-sky-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sm">📱</span>
                  <div>
                    <span className="text-xs font-bold text-white block">Online UPI</span>
                    <span className="text-[10px] text-slate-400 font-mono">{onlinePercent}% of total revenue</span>
                  </div>
                </div>
                <span className="font-black font-mono text-sky-400 text-sm">
                  ₹{totalOnlineCollected.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#080d16] border border-rose-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-sm">🔻</span>
                  <div>
                    <span className="text-xs font-bold text-white block">Expenses Deducted</span>
                    <span className="text-[10px] text-slate-400 font-mono">{selectedMonthExpenses.length} Outflow records</span>
                  </div>
                </div>
                <span className="font-black font-mono text-rose-400 text-sm">
                  -₹{totalExpensesLogged.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Retention Progress Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Net Profit Margin:</span>
                  <span className="text-amber-400 font-bold">{profitMargin}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex">
                  <div
                    style={{ width: `${Math.max(0, Math.min(profitMargin, 100))}%` }}
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-mono">
            <span>Net Retained Balance:</span>
            <span className={netProfit >= 0 ? "text-amber-400 font-bold" : "text-rose-400 font-bold"}>
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
        <div className="lg:col-span-5 bg-[#0b1120] border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h3 className="font-black text-white text-sm uppercase tracking-wider">Record Expense</h3>
              <p className="text-xs text-slate-400 mt-0.5">Log operational expense with reason.</p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-bold">
              Real-Time
            </span>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-3.5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Date</label>
              <input
                type="date"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                required
                className="w-full bg-[#080d16] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Category</label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value)}
                className="w-full bg-[#080d16] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Electricity Bill">⚡ Electricity Bill</option>
                <option value="WiFi & Internet">📶 WiFi & Internet</option>
                <option value="Cleaning & Maintenance">🧹 Cleaning & Maintenance</option>
                <option value="Hardware & Electrical">🔧 Hardware & Electrical</option>
                <option value="General / Miscellaneous">📦 General / Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Description / Purpose</label>
              <input
                type="text"
                placeholder="e.g., Hall 2 AC servicing / Cleaning supplies"
                value={expDescription}
                onChange={(e) => setExpDescription(e.target.value)}
                className="w-full bg-[#080d16] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-amber-400 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Amount (₹)</label>
              <input
                type="number"
                placeholder="e.g., 1200"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                required
                min="1"
                className="w-full bg-[#080d16] border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm font-black text-white outline-none focus:border-amber-400 placeholder-slate-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md mt-1"
            >
              {isSubmitting ? "Saving..." : "Add Expense Record"}
            </button>
          </form>
        </div>

        {/* EXPENSE LEDGER */}
        <div className="lg:col-span-7 bg-[#0b1120] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[440px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div>
                <h3 className="font-black text-white text-sm uppercase tracking-wider">Expense Ledger</h3>
                <p className="text-xs text-slate-400 mt-0.5">Itemized transaction log for {monthNames[selectedMonth]}.</p>
              </div>

              <span className="text-xs font-black text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 font-mono">
                Total: ₹{totalExpensesLogged.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2 [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter("ALL")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase whitespace-nowrap transition ${
                  selectedCategoryFilter === "ALL" ? "bg-amber-400 text-slate-950 font-black" : "bg-slate-900 text-slate-400 hover:text-white"
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
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                      selectedCategoryFilter === cat ? "bg-slate-200 text-slate-950 font-black" : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Expense rows */}
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700">
              {displayedExpenses.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-xs">
                  No expense records found.
                </div>
              ) : (
                displayedExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 rounded-2xl bg-[#080d16] border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center font-mono shrink-0 text-slate-300">
                        <span className="text-[9px] text-slate-400 font-bold uppercase leading-none">
                          {new Date(exp.date).toLocaleString("en-US", { month: "short" })}
                        </span>
                        <span className="text-xs font-black text-white leading-none mt-0.5">
                          {new Date(exp.date).getDate()}
                        </span>
                      </div>

                      <div>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold border inline-block"
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[exp.category] || "#64748b"}15`,
                            borderColor: `${CATEGORY_COLORS[exp.category] || "#64748b"}40`,
                            color: CATEGORY_COLORS[exp.category] || "#e2e8f0",
                          }}
                        >
                          {exp.category}
                        </span>
                        <p className="text-xs font-semibold text-white mt-1 leading-snug">
                          {exp.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="font-black text-xs text-rose-400 font-mono">
                        -₹{Number(exp.amount).toLocaleString("en-IN")}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(exp.id, exp.description, exp.amount)}
                        className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white flex items-center justify-center transition"
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

          <div className="pt-3 mt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Filtered Total:</span>
            <span className="font-black text-white">
              ₹{displayedExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          👥 5. REVENUE ROSTER & PAYMENT TILES
      ========================================================================= */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <span>🎓</span> Fee Collections Roster
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Itemized student fee submissions with payment dates and verified modes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by student or seat..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="bg-[#080d16] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400 placeholder-slate-500"
            />
            <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-mono">
              ₹{totalFeesRealized.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700">
          {displayedStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No revenue collections found for this period.
            </div>
          ) : (
            displayedStudents.map((student, idx) => (
              <div
                key={`${student.name}-${student.seat}-${idx}`}
                className="p-3 rounded-2xl bg-[#080d16] border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 font-mono font-black text-amber-400 flex items-center justify-center">
                    {student.seat}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-sm">{student.name}</p>
                      
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        student.paymentMode === "Cash"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-sky-500/10 text-sky-400 border-sky-500/30"
                      }`}>
                        {student.paymentMode === "Cash" ? "💵 Cash" : "📱 Online"}
                      </span>

                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        student.entryType === "Renewal"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                      }`}>
                        {student.entryType}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {student.plan} • Paid On: <span className="text-amber-300 font-mono font-bold">{student.paidDate}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <p className="font-black text-emerald-400 text-sm">
                    +₹{student.amount.toLocaleString("en-IN")}
                  </p>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-500/80">Verified</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2 TILES: CASH IN HAND & ONLINE / UPI */}
        <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl bg-[#080d16] border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg">
                💵
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  Cash in Hand
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Physical cash collected</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-emerald-400 font-mono">
                ₹{totalCashCollected.toLocaleString("en-IN")}
              </p>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedMonthCollections.filter((s) => s.paymentMode === "Cash").length} Subscriptions ({cashPercent}%)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#080d16] border border-sky-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-lg">
                📱
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block">
                  Online Payments (UPI)
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Direct bank transfers</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-sky-400 font-mono">
                ₹{totalOnlineCollected.toLocaleString("en-IN")}
              </p>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedMonthCollections.filter((s) => s.paymentMode !== "Cash").length} Subscriptions ({onlinePercent}%)
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          🏆 6. ANNUAL PERFORMANCE & AUTO-ARCHIVE DISPLAY
      ========================================================================= */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-amber-400 text-base">📅</span>
              <h3 className="font-black text-white text-sm uppercase tracking-wider">
                Annual Financial Performance
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Year-on-year automated audit ledger and historical archive.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
              Auto-Archive Active
            </span>
          </div>
        </div>

        {/* Current Year Running Card */}
        <div className="p-4 rounded-2xl bg-[#080d16] border border-amber-400/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white font-mono">{selectedYear}</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Active Year
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Cumulative revenue and expenses recorded across all 12 months in {selectedYear}.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
                <p className="text-[9px] uppercase font-bold text-slate-400">Revenue</p>
                <p className="text-sm font-black text-emerald-400 font-mono mt-0.5">₹{annualFeesTotal.toLocaleString("en-IN")}</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
                <p className="text-[9px] uppercase font-bold text-slate-400">Expenses</p>
                <p className="text-sm font-black text-rose-400 font-mono mt-0.5">₹{annualExpensesTotal.toLocaleString("en-IN")}</p>
              </div>

              <div className="bg-slate-900 border border-amber-400/20 px-3.5 py-2 rounded-xl text-center">
                <p className="text-[9px] uppercase font-bold text-amber-400">Net Profit</p>
                <p className="text-sm font-black text-amber-400 font-mono mt-0.5">₹{annualNetProfit.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 font-mono">
            <div className="flex items-center gap-4">
              <span>Cash Total: <strong className="text-emerald-400">₹{annualCashTotal.toLocaleString("en-IN")}</strong></span>
              <span>Online Total: <strong className="text-sky-400">₹{annualOnlineTotal.toLocaleString("en-IN")}</strong></span>
            </div>
            <span className="text-[11px] text-slate-500">
              {currentYearCollections.length} total admissions recorded in {selectedYear}
            </span>
          </div>
        </div>

        {/* Previous Years Archive (Automatically Populated When Year Changes) */}
        {archivedYears.filter((y) => Number(y.year) !== currentYear).length > 0 && (
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Archived Historical Records
            </h4>

            <div className="space-y-2">
              {archivedYears
                .filter((y) => Number(y.year) !== currentYear)
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#080d16] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-300 font-mono">{item.year}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        {item.status || "Archived"}
                      </span>
                      <span className="text-[11px] text-slate-500">Auto-saved on: {item.savedAt || "Year End"}</span>
                    </div>

                    <div className="flex items-center gap-4 text-right font-mono">
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase">Revenue</span>
                        <strong className="text-emerald-400">₹{Number(item.totalFees || 0).toLocaleString("en-IN")}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase">Expenses</span>
                        <strong className="text-rose-400">₹{Number(item.totalExpenses || 0).toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="pl-2 border-l border-slate-800">
                        <span className="text-[9px] text-amber-400 block font-bold uppercase">Net Profit</span>
                        <strong className="text-amber-400 text-sm">₹{Number(item.netProfit || 0).toLocaleString("en-IN")}</strong>
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