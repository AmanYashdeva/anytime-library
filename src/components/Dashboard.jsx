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
      date
    ) => {

      // Name nahi hai to skip
      if (!name) return;

      // Sirf Submitted payment collection me aayega
      if (payment !== "Submitted") return;


      // =================================================
      // ACTUAL AMOUNT
      // Agar amount field available nahi hai to 0
      // =================================================

      const actualAmount = Number(amount) || 0;


      allCollections.push({

        name: name,

        seat: seat.id,

        plan: plan,

        amount: actualAmount,

        date: date || "",

      });

    };


    // ===================================================
    // MORNING STUDENT
    // ===================================================

    addCollection(
      seat.morningStudent,
      "Morning",
      seat.morningPayment,

      // Actual morning fees
      seat.morningAmount || seat.morningFee,

      seat.morningCollectionDate ||
      seat.morningFrom
    );


    // ===================================================
    // AFTERNOON STUDENT
    // ===================================================

    addCollection(
      seat.afternoonStudent,
      "Afternoon",
      seat.afternoonPayment,

      // Actual afternoon fees
      seat.afternoonAmount || seat.afternoonFee,

      seat.afternoonCollectionDate ||
      seat.afternoonFrom
    );


    // ===================================================
    // NIGHT STUDENT
    // ===================================================

    addCollection(
      seat.nightStudent,
      "Night",
      seat.nightPayment,

      // Actual night fees
      seat.nightAmount || seat.nightFee,

      seat.nightCollectionDate ||
      seat.nightFrom
    );


    // ===================================================
    // FULL DAY STUDENT
    // ===================================================

    addCollection(
      seat.fullDayStudent,
      "Full Day",
      seat.fullDayPayment,

      // Actual full day fees
      seat.fullDayAmount || seat.fullDayFee,

      seat.fullDayCollectionDate ||
      seat.fullDayFrom ||
      seat.fromDate
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
              onClick={() => printSection("monthly-report")}
              className="mt-5 w-full rounded-xl border border-green-400/30 bg-green-400/10 py-3 text-sm font-bold text-green-400 transition hover:bg-green-400 hover:text-black"
            >
              🖨 Print Monthly Report
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