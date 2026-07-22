const Dashboard = ({ seats, onToggleSeatVisibility }) => {
  // Sirf visible seats dashboard ke totals me count hongi
  const visibleSeats = seats.filter(
    (seat) => seat.isVisible !== false
  );

  const totalSeats = visibleSeats.length;

  const availableSeats = visibleSeats.filter(
    (seat) => seat.status === "Available"
  ).length;

  const occupiedSeats = totalSeats - availableSeats;

  const feesDue = visibleSeats.reduce((total, seat) => {
    const payments = [
      seat.morningPayment,
      seat.afternoonPayment,
      seat.nightPayment,
      seat.fullDayPayment,
    ];

    return (
      total +
      payments.filter((payment) => payment === "Pending").length
    );
  }, 0);

  return (
    <div className="w-full">

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        📊 Dashboard
      </h2>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Seats */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <p className="text-gray-400 text-sm">
            Total Seats
          </p>

          <h3 className="text-3xl font-bold text-white mt-2">
            {totalSeats}
          </h3>
        </div>

        {/* Available Seats */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <p className="text-gray-400 text-sm">
            Available Seats
          </p>

          <h3 className="text-3xl font-bold text-green-400 mt-2">
            {availableSeats}
          </h3>
        </div>

        {/* Occupied Seats */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <p className="text-gray-400 text-sm">
            Occupied Seats
          </p>

          <h3 className="text-3xl font-bold text-red-400 mt-2">
            {occupiedSeats}
          </h3>
        </div>

        {/* Fees Due */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <p className="text-gray-400 text-sm">
            Fees Due
          </p>

          <h3 className="text-3xl font-bold text-yellow-400 mt-2">
            {feesDue}
          </h3>
        </div>

      </div>

      {/* Manage Seat Visibility */}
      {/* Compact Seat Visibility */}
      {/* Compact Seat Visibility */}
      {/* <div className="mt-8 bg-gray-800 rounded-2xl p-5 border border-gray-700">

        <h3 className="text-xl font-bold text-white mb-4">
          🪑 Manage Seat Visibility
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">

          <select
            id="seatVisibilitySelect"
            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 outline-none"
          >
            <option value="">
              Select Seat
            </option>

            {seats.map((seat) => (
              <option key={seat.id} value={seat.id}>
                Seat {seat.id} -{" "}
                {seat.isVisible === false
                  ? "Hidden"
                  : "Visible"}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              const select =
                document.getElementById("seatVisibilitySelect");

              const seatId = Number(select.value);

              if (!seatId) return;

              onToggleSeatVisibility(seatId);

              select.value = "";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg font-semibold"
          >
            Hide / Show
          </button>

        </div>

      </div> */}
    </div>
  );
};

export default Dashboard;