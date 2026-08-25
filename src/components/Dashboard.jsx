const Dashboard = ({ seats, onToggleSeatVisibility }) => {

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
  // ACTIVE STUDENTS
  // =====================================================

  const activeStudents = visibleSeats.reduce((total, seat) => {

    const students = [
      seat.morningStudent,
      seat.afternoonStudent,
      seat.nightStudent,
      seat.fullDayStudent,
    ];

    return total + students.filter(Boolean).length;

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

  const currentMonthName = today.toLocaleString(
    "default",
    {
      month: "long",
    }
  );


  // =====================================================
  // ALL STUDENTS COLLECTION DATA
  // =====================================================
  // Sirf Submitted fees ko collection me count karega
  // =====================================================

  const allCollections = [];


  visibleSeats.forEach((seat) => {

    // ===================================================
    // STUDENT COLLECTION ADD KARNE KA HELPER
    // ===================================================

    const addCollection = (
      name,
      plan,
      payment,
      amount,
      collectionDate,
      fromDate,
      toDate,
      phone
    ) => {

      // Name nahi hai to skip
      if (!name) return;

      // Sirf submitted payment collection me aayega
      if (payment !== "Submitted") return;

      const actualAmount = Number(amount) || 0;

      allCollections.push({
        name: name,

        seat: seat.id,

        plan: plan,

        amount: actualAmount,

        // Collection date
        date: collectionDate || "",

        // Student complete details
        fromDate: fromDate || "",

        toDate: toDate || "",

        phone: phone || "",

        payment: payment,
      });
    };


    // ===================================================
    // MORNING STUDENT
    // ===================================================

    addCollection(
      seat.morningStudent,
      "Morning",
      seat.morningPayment,
      seat.morningAmount || seat.morningFee,

      seat.morningCollectionDate || "",

      seat.morningFrom || "",
      seat.morningTo || "",
      seat.morningPhone || ""
    );


    // ===================================================
    // AFTERNOON STUDENT
    // ===================================================

    addCollection(
      seat.afternoonStudent,
      "Afternoon",
      seat.afternoonPayment,
      seat.afternoonAmount || seat.afternoonFee,

      seat.afternoonCollectionDate || "",

      seat.afternoonFrom || "",
      seat.afternoonTo || "",
      seat.afternoonPhone || ""
    );


    // ===================================================
    // NIGHT STUDENT
    // ===================================================

    addCollection(
      seat.nightStudent,
      "Night",
      seat.nightPayment,
      seat.nightAmount || seat.nightFee,

      seat.nightCollectionDate || "",

      seat.nightFrom || "",
      seat.nightTo || "",
      seat.nightPhone || ""
    );


    // ===================================================
    // FULL DAY STUDENT
    // ===================================================

    addCollection(
      seat.fullDayStudent,
      "Full Day",
      seat.fullDayPayment,
      seat.fullDayAmount || seat.fullDayFee,

      seat.fullDayCollectionDate || "",

      seat.fullDayFrom || "",
      seat.fullDayTo || "",
      seat.fullDayPhone || ""
    );

  });


  // =====================================================
  // CURRENT MONTH COLLECTION
  // =====================================================

  const monthlyCollections = allCollections.filter(
    (student) => {

      // Date nahi hai to current month me show karo
      if (!student.date) return true;

      const collectionDate = new Date(student.date);

      return (
        collectionDate.getMonth() === currentMonthIndex &&
        collectionDate.getFullYear() === currentYear
      );

    }
  );


  // =====================================================
  // TOTAL MONTHLY COLLECTION
  // =====================================================

  const monthlyTotal = monthlyCollections.reduce(
    (total, student) => {
      return total + student.amount;
    },
    0
  );


  // =====================================================
  // MONTH NAMES
  // =====================================================

  const monthNames = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",

  ];


  // =====================================================
  // YEARLY MONTH-WISE COLLECTION
  // =====================================================

  const yearlyCollections = monthNames.map(
    (month, monthIndex) => {

      const monthTotal = allCollections
        .filter((student) => {

          // Date nahi hai to current month me count
          if (!student.date) {
            return monthIndex === currentMonthIndex;
          }

          const collectionDate = new Date(student.date);

          return (
            collectionDate.getMonth() === monthIndex &&
            collectionDate.getFullYear() === currentYear
          );

        })
        .reduce(
          (total, student) => {
            return total + student.amount;
          },
          0
        );


      return {

        month: month,

        amount: monthTotal,

      };

    }
  ).filter(
    (item) => item.amount > 0
  );


  // =====================================================
  // TOTAL YEARLY COLLECTION
  // =====================================================

  const yearlyTotal = yearlyCollections.reduce(
    (total, item) => {
      return total + item.amount;
    },
    0
  );


  // =====================================================
  // PENDING STUDENTS LIST
  // =====================================================

  const pendingStudents = [];

  visibleSeats.forEach((seat) => {

    if (
      seat.morningStudent &&
      seat.morningPayment === "Pending"
    ) {

      pendingStudents.push({
        name: seat.morningStudent,
        seat: seat.id,
        plan: "Morning",
      });

    }


    if (
      seat.afternoonStudent &&
      seat.afternoonPayment === "Pending"
    ) {

      pendingStudents.push({
        name: seat.afternoonStudent,
        seat: seat.id,
        plan: "Afternoon",
      });

    }


    if (
      seat.nightStudent &&
      seat.nightPayment === "Pending"
    ) {

      pendingStudents.push({
        name: seat.nightStudent,
        seat: seat.id,
        plan: "Night",
      });

    }


    if (
      seat.fullDayStudent &&
      seat.fullDayPayment === "Pending"
    ) {

      pendingStudents.push({
        name: seat.fullDayStudent,
        seat: seat.id,
        plan: "Full Day",
      });

    }

  });


  // =====================================================
  // PRINT DASHBOARD REPORT
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
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background: white;
            color: black;
          }

          * {
            color: black !important;
          }

          button {
            display: none !important;
          }
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

  // =====================================================
  // DASHBOARD UI START
  // =====================================================

  // =====================================================
  // PRINT DETAILED MONTHLY REPORT
  // =====================================================

  const printMonthlyReport = () => {

    // Current month ke students
    const studentsToPrint = monthlyCollections;

    // ===================================================
    // TOTALS
    // ===================================================

    const totalStudents = studentsToPrint.length;

    const submittedStudents = studentsToPrint.filter(
      (student) => student.payment === "Submitted"
    ).length;

    const pendingStudentsCount = studentsToPrint.filter(
      (student) => student.payment === "Pending"
    ).length;

    const totalCollection = studentsToPrint.reduce(
      (total, student) => total + (Number(student.amount) || 0),
      0
    );

    // ===================================================
    // TABLE ROWS
    // ===================================================

    const tableRows = studentsToPrint.map(
      (student, index) => {

        return `
        <tr>
          <td>${index + 1}</td>

          <td>
            <strong>${student.name || "-"}</strong>
          </td>

          <td>${student.seat || "-"}</td>

          <td>${student.plan || "-"}</td>

          <td>${student.timing || "-"}</td>

          <td>${student.phone || "-"}</td>

          <td>${student.fromDate || "-"}</td>

          <td>${student.toDate || "-"}</td>

          <td>
            ₹${(Number(student.amount) || 0).toLocaleString("en-IN")}
          </td>

          <td>
            ${student.payment || "-"}
          </td>
        </tr>
      `;

      }
    ).join("");


    // ===================================================
    // OPEN PRINT WINDOW
    // ===================================================

    const printWindow = window.open(
      "",
      "",
      "width=1200,height=800"
    );

    if (!printWindow) {
      alert("Please allow popups to print the report.");
      return;
    }


    // ===================================================
    // PRINT PAGE
    // ===================================================

    printWindow.document.write(`

    <!DOCTYPE html>

    <html>

      <head>

        <title>
          ${currentMonthName} ${currentYear} - Monthly Report
        </title>


        <style>

          * {
            box-sizing: border-box;
          }


          body {
            font-family: Arial, sans-serif;
            padding: 35px;
            color: #111;
            background: white;
          }


          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #111;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }


          h1 {
            margin: 0;
            font-size: 28px;
          }


          h2 {
            margin: 8px 0 0;
            font-size: 18px;
            font-weight: normal;
          }


          .print-date {
            text-align: right;
            font-size: 13px;
            color: #555;
          }


          .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 25px;
          }


          .summary-box {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
          }


          .summary-title {
            font-size: 12px;
            color: #666;
            margin-bottom: 6px;
          }


          .summary-value {
            font-size: 20px;
            font-weight: bold;
          }


          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }


          th {
            background: #eee;
            font-weight: bold;
          }


          th,
          td {
            border: 1px solid #999;
            padding: 9px 7px;
            text-align: left;
          }


          tr:nth-child(even) {
            background: #f7f7f7;
          }


          .footer {
            margin-top: 30px;
            border-top: 1px solid #ccc;
            padding-top: 12px;
            font-size: 11px;
            color: #666;
            text-align: center;
          }


          @media print {

            body {
              padding: 15px;
            }


            @page {
              size: A4 landscape;
              margin: 10mm;
            }

          }

        </style>

      </head>


      <body>


        <!-- ========================================= -->
        <!-- REPORT HEADER -->
        <!-- ========================================= -->

        <div class="header">

          <div>

            <h1>
              ANYTIME LIBRARY
            </h1>

            <h2>
              Monthly Student & Collection Report
            </h2>

            <h2>
              ${currentMonthName} ${currentYear}
            </h2>

          </div>


          <div class="print-date">

            <strong>Report Generated:</strong>

            <br />

            ${new Date().toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    )}

          </div>

        </div>



        <!-- ========================================= -->
        <!-- SUMMARY -->
        <!-- ========================================= -->

        <div class="summary">

          <div class="summary-box">

            <div class="summary-title">
              Total Students
            </div>

            <div class="summary-value">
              ${totalStudents}
            </div>

          </div>


          <div class="summary-box">

            <div class="summary-title">
              Submitted Payments
            </div>

            <div class="summary-value">
              ${submittedStudents}
            </div>

          </div>


          <div class="summary-box">

            <div class="summary-title">
              Pending Payments
            </div>

            <div class="summary-value">
              ${pendingStudentsCount}
            </div>

          </div>


          <div class="summary-box">

            <div class="summary-title">
              Total Collection
            </div>

            <div class="summary-value">
              ₹${totalCollection.toLocaleString("en-IN")}
            </div>

          </div>

        </div>



        <!-- ========================================= -->
        <!-- STUDENT DETAILS TABLE -->
        <!-- ========================================= -->

        <table>

          <thead>

            <tr>

              <th>#</th>

              <th>Student Name</th>

              <th>Seat</th>

              <th>Plan / Shift</th>

              <th>Timing</th>

              <th>Phone Number</th>

              <th>From Date</th>

              <th>To Date</th>

              <th>Fees</th>

              <th>Status</th>

            </tr>

          </thead>


          <tbody>

            ${tableRows || `
              <tr>
                <td colspan="10" style="text-align:center;">
                  No student records available.
                </td>
              </tr>
            `}

          </tbody>

        </table>



        <!-- ========================================= -->
        <!-- FOOTER -->
        <!-- ========================================= -->

        <div class="footer">

          This is a system generated report from Anytime Library Admin Dashboard.

        </div>


      </body>

    </html>

  `);


    printWindow.document.close();


    // ===================================================
    // PRINT
    // ===================================================

    setTimeout(() => {

      printWindow.focus();

      printWindow.print();

    }, 500);

  };


  return (

    <div className="w-full pb-10">


      {/* ================================================= */}
      {/* DASHBOARD HEADER */}
      {/* ================================================= */}

      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
            Anytime Library
          </p>

          <h2 className="text-2xl font-bold text-gray-500 sm:text-3xl">
            Admin Dashboard
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Live overview of seats, students and payments.
          </p>

        </div>


        <button
          onClick={printDashboard}
          className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-2.5 text-sm font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
        >
          🖨 Print Report
        </button>

      </div>


      {/* ================================================= */}
      {/* MAIN SUMMARY CARDS */}
      {/* ================================================= */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">


        {/* TOTAL SEATS */}

        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-5">

          <p className="text-sm text-gray-400">
            Total Seats
          </p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            {totalSeats}
          </h3>

          <p className="mt-2 text-xs text-gray-500">
            Active visible seats
          </p>

        </div>


        {/* AVAILABLE SEATS */}

        <div className="rounded-2xl border border-green-500/20 bg-gray-800 p-5">

          <p className="text-sm text-gray-400">
            Available
          </p>

          <h3 className="mt-2 text-3xl font-bold text-green-400">
            {availableSeats}
          </h3>

          <p className="mt-2 text-xs text-green-500/70">
            Seats ready for booking
          </p>

        </div>


        {/* OCCUPIED */}

        <div className="rounded-2xl border border-red-500/20 bg-gray-800 p-5">

          <p className="text-sm text-gray-400">
            Occupied
          </p>

          <h3 className="mt-2 text-3xl font-bold text-red-400">
            {occupiedSeats}
          </h3>

          <p className="mt-2 text-xs text-red-400/70">
            Currently assigned
          </p>

        </div>


        {/* FEES DUE */}

        <div className="rounded-2xl border border-yellow-500/20 bg-gray-800 p-5">

          <p className="text-sm text-gray-400">
            Fees Pending
          </p>

          <h3 className="mt-2 text-3xl font-bold text-yellow-400">
            {feesDue}
          </h3>

          <p className="mt-2 text-xs text-yellow-400/70">
            Pending payment entries
          </p>

        </div>

      </div>



      {/* ================================================= */}
      {/* SECONDARY SUMMARY */}
      {/* ================================================= */}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">


        {/* ACTIVE STUDENTS */}

        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-5">

          <p className="text-sm text-gray-400">
            Active Students
          </p>

          <h3 className="mt-2 text-3xl font-bold text-blue-400">
            {activeStudents}
          </h3>

        </div>


        {/* HALF DAY */}

        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-5">

          <p className="text-sm text-gray-400">
            Half Day Seats
          </p>

          <h3 className="mt-2 text-3xl font-bold text-purple-400">
            {halfDaySeats}
          </h3>

        </div>


        {/* FULL DAY */}

        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-5">

          <p className="text-sm text-gray-400">
            Full Day Seats
          </p>

          <h3 className="mt-2 text-3xl font-bold text-cyan-400">
            {fullDaySeats}
          </h3>

        </div>


        {/* 24 HOURS */}

        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-5">

          <p className="text-sm text-gray-400">
            24 Hours
          </p>

          <h3 className="mt-2 text-3xl font-bold text-orange-400">
            {twentyFourSeats}
          </h3>

        </div>

      </div>



      {/* ================================================= */}
      {/* RECORDS SECTION */}
      {/* MONTHLY + YEARLY */}
      {/* ================================================= */}

      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">


        {/* ================================================= */}
        {/* MONTHLY RECORDS */}
        {/* Student Name + Seat + Plan + Collection */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-900">


          {/* MONTHLY HEADER */}

          <div className="flex items-center justify-between border-b border-gray-700 p-5">

            <div>

              <h3 className="font-bold text-white">
                📅 Monthly Records
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                {currentMonthName} {currentYear} Collection
              </p>

            </div>


            <span className="rounded-full bg-green-400/10 px-3 py-1 text-sm font-bold text-green-400">
              ₹{monthlyTotal.toLocaleString("en-IN")}
            </span>

          </div>


          {/* MONTHLY STUDENT LIST */}

          <div className="max-h-[350px] overflow-y-auto">


            {monthlyCollections.length === 0 ? (

              <div className="p-10 text-center">

                <div className="text-4xl">
                  📭
                </div>

                <p className="mt-3 font-medium text-gray-400">
                  No collection recorded this month.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-gray-800">


                {monthlyCollections.map(
                  (student, index) => (

                    <div
                      key={`${student.name}-${student.seat}-${index}`}
                      className="flex items-center justify-between gap-4 p-4 transition hover:bg-white/[0.02]"
                    >

                      {/* STUDENT DETAILS */}

                      <div>

                        <p className="font-bold text-white">
                          {student.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Seat {student.seat} • {student.plan}
                        </p>

                      </div>


                      {/* ACTUAL COLLECTION */}

                      <div className="text-right">

                        <p className="font-bold text-green-400">
                          ₹{student.amount.toLocaleString("en-IN")}
                        </p>

                        <p className="mt-1 text-[10px] uppercase text-gray-500">
                          Collected
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* MONTHLY TOTAL */}

          <div className="border-t border-gray-700 bg-green-400/[0.03] p-5" id="monthly-report">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Monthly Collection
                </p>

                <p className="mt-1 text-2xl font-black text-green-400">
                  ₹{monthlyTotal.toLocaleString("en-IN")}
                </p>

              </div>


              <div className="rounded-xl bg-green-400/10 px-3 py-2 text-center">

                <p className="text-lg font-bold text-green-400">
                  {monthlyCollections.length}
                </p>

                <p className="text-[10px] uppercase text-gray-400">
                  Students
                </p>

              </div>

            </div>


            {/* PRINT MONTHLY REPORT */}

            <button
              onClick={printMonthlyReport}
              className="mt-5 w-full rounded-xl border border-green-400/30 bg-green-400/10 py-3 text-sm font-bold text-green-400 transition hover:bg-green-400 hover:text-black"
            >
              🖨 Print Detailed Monthly Report
            </button>

          </div>

        </div>



        {/* ================================================= */}
        {/* YEARLY RECORDS */}
        {/* Sirf Month + Collection */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-900">


          {/* YEARLY HEADER */}

          <div className="flex items-center justify-between border-b border-gray-700 p-5">

            <div>

              <h3 className="font-bold text-white">
                📊 Annual Records
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Month-wise Collection • {currentYear}
              </p>

            </div>


            <span className="rounded-full bg-blue-400/10 px-3 py-1 text-sm font-bold text-blue-400">
              ₹{yearlyTotal.toLocaleString("en-IN")}
            </span>

          </div>


          {/* YEARLY MONTH-WISE LIST */}

          <div className="max-h-[350px] overflow-y-auto">


            {yearlyCollections.length === 0 ? (

              <div className="p-10 text-center">

                <div className="text-4xl">
                  📊
                </div>

                <p className="mt-3 font-medium text-gray-400">
                  No yearly collection recorded yet.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-gray-800">


                {yearlyCollections.map((item) => (

                  <div
                    key={item.month}
                    className="flex items-center justify-between p-4 transition hover:bg-white/[0.02]"
                  >

                    <p className="font-bold text-white">
                      {item.month}
                    </p>


                    <p className="font-bold text-blue-400">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* YEARLY TOTAL */}

          <div className="border-t border-gray-700 bg-blue-400/[0.03] p-5">

            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total Annual Collection
            </p>

            <p className="mt-1 text-2xl font-black text-blue-400">
              ₹{yearlyTotal.toLocaleString("en-IN")}
            </p>


            {/* ============================================= */}
            {/* PRINT YEARLY REPORT */}
            {/* December me option show hoga */}
            {/* ============================================= */}

            {today.getMonth() === 11 && (

              <button
                onClick={printDashboard}
                className="mt-5 w-full rounded-xl border border-blue-400/30 bg-blue-400/10 py-3 text-sm font-bold text-blue-400 transition hover:bg-blue-400 hover:text-black"
              >
                🖨 Print Annual Report
              </button>

            )}

          </div>

        </div>

      </div>



      {/* ================================================= */}
      {/* PENDING FEES */}
      {/* ================================================= */}

      <div className="mt-7 overflow-hidden rounded-2xl border border-gray-700 bg-gray-900">

        <div className="flex items-center justify-between border-b border-gray-700 p-5">

          <div>

            <h3 className="font-bold text-white">
              ⚠️ Pending Fee Students
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Students whose payment is still pending.
            </p>

          </div>

          <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-sm font-bold text-yellow-400">
            {pendingStudents.length}
          </span>

        </div>


        <div className="max-h-[350px] overflow-y-auto">

          {pendingStudents.length === 0 ? (

            <div className="p-10 text-center">

              <div className="text-4xl">
                🎉
              </div>

              <p className="mt-3 font-medium text-gray-400">
                No pending fees.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-gray-800">

              {pendingStudents.map((student, index) => (

                <div
                  key={`${student.name}-${student.seat}-${index}`}
                  className="flex items-center justify-between p-4 transition hover:bg-white/[0.02]"
                >

                  <div>

                    <p className="font-bold text-white">
                      {student.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Seat {student.seat} • {student.plan}
                    </p>

                  </div>


                  <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-400">
                    Pending
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;