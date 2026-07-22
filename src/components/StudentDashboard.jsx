import React, { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    addDoc,
    query,
    where,
} from "firebase/firestore";
import { db } from "../firebase";

const StudentDashboard = ({ user, onLogout }) => {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState("");
    const [selectedTiming, setSelectedTiming] = useState("");
    const [bookingLoading, setBookingLoading] = useState(false);
    const [myBooking, setMyBooking] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);

    const studentName = user?.displayName || user?.email?.split("@")[0] || "Student";

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const snapshot = await getDocs(collection(db, "bookings"));

                const seatsData = snapshot.docs.map((doc) => ({
                    firebaseId: doc.id,
                    ...doc.data(),
                }));

                setSeats(seatsData);

            } catch (error) {
                console.error("Seats loading error:", error);
            }
        };

        fetchSeats();
    }, []);


    const plans = [
        {
            name: "Morning Plan",
            price: 500,
            timing: "Morning",
            description: "Morning study session without locker",
        },
        {
            name: "Afternoon Plan",
            price: 500,
            timing: "Afternoon",
            description: "Afternoon study session without locker",
        },
        {
            name: "Night Plan",
            price: 500,
            timing: "Night",
            description: "Night study session without locker",
        },
        {
            name: "Full Day Plan",
            price: 700,
            timing: "Full Day",
            description: "Full day study access without locker",
        },
        {
            name: "24 Hours Plan",
            price: 1000,
            timing: "24 Hours",
            description: "24 hours library access with locker",
        },
    ];

    const handleBookingSubmit = async () => {
        if (!selectedPlan || !selectedSeat || !selectedTiming) {
            alert("Please select plan, seat and timing");
            return;
        }

        try {
            setBookingLoading(true);

            const selectedPlanData = plans.find(
                (plan) => plan.name === selectedPlan
            );

            await addDoc(collection(db, "bookings"), {
                studentId: user.uid,
                studentName,
                studentEmail: user.email,

                plan: selectedPlan,
                amount: selectedPlanData?.price || "",

                seatId: selectedSeat,
                timing: selectedTiming,

                status: "Pending",
                createdAt: new Date(),
            });

            const whatsappMessage = `
🪑 NEW SEAT BOOKING REQUEST

👤 Student Name: ${studentName}
📧 Email: ${user.email}

📦 Plan: ${selectedPlan}
💰 Amount: ₹${selectedPlanData?.price || ""}

💺 Seat Number: ${selectedSeat}
⏰ Timing: ${selectedTiming}

📸 Payment screenshot is attached with this WhatsApp message.

Please verify the payment and approve the booking from the admin panel.
        `;

            const whatsappUrl = `https://wa.me/919219384600?text=${encodeURIComponent(
                whatsappMessage
            )}`;

            window.open(whatsappUrl, "_blank");

            alert(
                "Booking request submitted! Please attach your payment screenshot on WhatsApp."
            );

            setMyBooking({
                plan: selectedPlan,
                amount: selectedPlanData?.price || "",
                seatId: selectedSeat,
                timing: selectedTiming,
                status: "Pending",
            });

            setSelectedPlan("");
            setSelectedSeat("");
            setSelectedTiming("");

            setActiveSection("booking");

        } catch (error) {
            console.error("Booking error:", error);
            alert("Booking request failed");
        } finally {
            setBookingLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* TOP NAVBAR */}
            <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-xl">
                            📚
                        </div>

                        <div>
                            <h1 className="text-sm font-black tracking-wide sm:text-lg ">
                                ANY TIME LIBRARY
                            </h1>


                        </div>
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-bold">{studentName}</p>
                            <p className="text-xs text-slate-400">Student Account</p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold">
                            {studentName.charAt(0).toUpperCase()}
                        </div>

                        <button
                            onClick={onLogout}
                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20"
                        >
                            Logout
                        </button>

                    </div>
                </div>
            </header>


            {/* MAIN LAYOUT */}
            <div className="mx-auto flex max-w-[1600px]">

                {/* SIDEBAR */}
                <aside className="hidden min-h-[calc(100vh-64px)] w-64 border-r border-white/10 bg-slate-900/50 p-4 md:block">

                    <div className="mb-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                        <p className="text-xs text-indigo-300">
                            Welcome 👋
                        </p>

                        <h2 className="mt-1 text-lg font-black">
                            {studentName}
                        </h2>
                    </div>

                    <nav className="space-y-2">

                        <button
                            onClick={() => setActiveSection("dashboard")}
                            className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${activeSection === "dashboard"
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            🏠 Dashboard
                        </button>

                        <button
                            onClick={() => setActiveSection("book")}
                            className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${activeSection === "book"
                                ? "bg-indigo-600 text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            🪑 Book Your Seat
                        </button>

                        <button
                            onClick={() => setActiveSection("booking")}
                            className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${activeSection === "booking"
                                ? "bg-indigo-600 text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            📋 My Booking
                        </button>

                        <button
                            onClick={() => setActiveSection("profile")}
                            className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${activeSection === "profile"
                                ? "bg-indigo-600 text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            👤 My Profile
                        </button>

                    </nav>

                </aside>


                {/* CONTENT */}
                <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

                    {activeSection === "dashboard" && (

                        <div className="space-y-8">

                            {/* HERO */}
                            <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 sm:p-8">

                                <div className="relative z-10">

                                    <p className="mb-2 text-sm font-bold text-indigo-300">
                                        STUDENT DASHBOARD
                                    </p>

                                    <h2 className="text-3xl font-black sm:text-4xl">
                                        Welcome to the Library Portal, {studentName} 👋
                                    </h2>

                                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                                        Manage your seat booking, check approval status and access
                                        your Any Time Library student account.
                                    </p>

                                    <button
                                        onClick={() => setActiveSection("book")}
                                        className="mt-6 rounded-2xl bg-yellow-400 px-6 py-3 font-black text-black transition hover:-translate-y-1 hover:bg-yellow-300"
                                    >
                                        🚀 Book Your Seat
                                    </button>

                                </div>

                                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
                                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"></div>

                            </div>


                            {/* STATS */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <p className="text-sm text-slate-400">My Seat</p>
                                    <h3 className="mt-2 text-3xl font-black">--</h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        No seat assigned
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <p className="text-sm text-slate-400">Booking Status</p>
                                    <h3 className="mt-2 text-xl font-black text-yellow-400">
                                        Not Booked
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Submit a booking request
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <p className="text-sm text-slate-400">Timing</p>
                                    <h3 className="mt-2 text-xl font-black">--</h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        No timing selected
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <p className="text-sm text-slate-400">Account Status</p>
                                    <h3 className="mt-2 text-xl font-black text-yellow-400">
                                        Pending
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Awaiting approval
                                    </p>
                                </div>

                            </div>


                            {/* ACTIVITY */}
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

                                {/* PLANS */}
                                <div className="mt-6">
                                    <h3 className="text-xl font-black">
                                        Choose Your Plan 📦
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400">
                                        Select the plan that suits your study routine.
                                    </p>

                                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                                        {plans.map((plan) => (
                                            <button
                                                key={plan.name}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPlan(plan.name);
                                                    setSelectedTiming(plan.timing);
                                                }}
                                                className={`rounded-2xl border p-5 text-left transition-all ${selectedPlan === plan.name
                                                    ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/10"
                                                    : "border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10"
                                                    }`}
                                            >

                                                <div className="flex items-start justify-between gap-3">

                                                    <div>
                                                        <h4 className="font-black">
                                                            {plan.name}
                                                        </h4>

                                                        <p className="mt-2 text-sm text-slate-400">
                                                            {plan.description}
                                                        </p>
                                                    </div>

                                                    {selectedPlan === plan.name && (
                                                        <span className="text-xl">
                                                            ✅
                                                        </span>
                                                    )}

                                                </div>

                                                <div className="mt-5 text-2xl font-black text-yellow-400">
                                                    ₹{plan.price}
                                                </div>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {plan.timing} access
                                                </p>

                                            </button>
                                        ))}

                                    </div>
                                </div>

                                <h3 className="text-xl font-black">
                                    Recent Activity
                                </h3>

                                <div className="mt-6 space-y-4">

                                    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                                            ✅
                                        </div>

                                        <div>
                                            <p className="font-bold">
                                                Student Registration Completed
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Your account has been created successfully.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                                            ⏳
                                        </div>

                                        <div>
                                            <p className="font-bold">
                                                Ready to Book Your Seat
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Select an available seat to submit your request.
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>


                    )}


                    {/* BOOK SEAT */}
                    {activeSection === "book" && (

                        <div className="space-y-6">

                            <div>
                                <p className="text-sm font-bold text-indigo-400">
                                    SEAT BOOKING
                                </p>

                                <h2 className="mt-1 text-3xl font-black">
                                    Book Your Seat 🪑
                                </h2>

                                <p className="mt-2 text-slate-400">
                                    Select your preferred seat and timing.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

                                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">

                                    <p className="font-bold text-yellow-300">
                                        ⏳ Booking Approval System
                                    </p>

                                    <p className="mt-2 text-sm text-slate-300">
                                        Your booking request will be sent to the library admin.
                                        Your seat will be confirmed after approval.
                                    </p>

                                </div>

                                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">

                                    <div>
                                        <label className="mb-2 block text-sm font-bold">
                                            Select Seat
                                        </label>

                                        <div>
                                            <label className="mb-3 block text-sm font-bold">
                                                Select Your Seat 💺
                                            </label>

                                            <div className="grid grid-cols-5 gap-3 sm:grid-cols-8 lg:grid-cols-10">
                                                {seats
                                                    .filter((seat) => seat.seatNumber)
                                                    .sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber))
                                                    .map((seat) => (
                                                        <button
                                                            key={seat.firebaseId}
                                                            type="button"
                                                            onClick={() => setSelectedSeat(seat.seatNumber)}
                                                            className={`flex h-14 items-center justify-center rounded-xl border text-lg font-black transition-all ${selectedSeat === seat.seatNumber
                                                                ? "border-yellow-400 bg-yellow-400 text-black shadow-lg shadow-yellow-400/30 scale-105"
                                                                : "border-green-500/30 bg-green-500/10 text-green-400 hover:border-green-400 hover:bg-green-500/20"
                                                                }`}
                                                        >
                                                            {seat.seatNumber}
                                                        </button>
                                                    ))}
                                            </div>

                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold">
                                            Select Timing
                                        </label>

                                        <select
                                            value={selectedTiming}
                                            onChange={(e) => setSelectedTiming(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-500">
                                            <option value="">Select timing</option>
                                            <option value="Morning">Morning</option>
                                            <option value="Afternoon">Afternoon</option>
                                            <option value="Night">Night</option>
                                            <option value="Full Day">Full Day</option>
                                            <option value="24 Hours">24 Hours</option>
                                        </select>
                                    </div>

                                </div>
                                {/* PAYMENT DETAILS */}
                                {selectedPlan && (
                                    <div className="mt-8 rounded-3xl border border-green-500/20 bg-green-500/10 p-6">

                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-2xl">
                                                💳
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-black">
                                                    Payment Details
                                                </h3>

                                                <p className="text-sm text-slate-400">
                                                    Complete payment before submitting your booking request.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                                            <div className="rounded-2xl bg-slate-950/60 p-4">
                                                <p className="text-xs text-slate-400">
                                                    Selected Plan
                                                </p>

                                                <p className="mt-1 font-black text-yellow-400">
                                                    {selectedPlan}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-slate-950/60 p-4">
                                                <p className="text-xs text-slate-400">
                                                    Amount
                                                </p>

                                                <p className="mt-1 text-xl font-black text-green-400">
                                                    ₹
                                                    {
                                                        plans.find(
                                                            (plan) => plan.name === selectedPlan
                                                        )?.price
                                                    }
                                                </p>
                                            </div>

                                        </div>

                                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">

                                            <p className="text-sm font-bold text-slate-300">
                                                📱 Payment Number
                                            </p>

                                            <p className="mt-1 text-lg font-black">
                                                9219384600
                                            </p>

                                            <p className="mt-4 text-sm font-bold text-slate-300">
                                                🆔 UPI ID
                                            </p>

                                            <p className="mt-1 font-black text-yellow-400">
                                                YOUR_UPI_ID_HERE
                                            </p>

                                        </div>

                                        <div className="mt-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">

                                            <p className="font-bold text-yellow-300">
                                                📸 Payment Screenshot Required
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                                After making the payment, click the booking button below.
                                                WhatsApp will open automatically. Please attach your payment
                                                screenshot there and send your complete booking details.
                                            </p>

                                        </div>

                                    </div>
                                )}


                                <button
                                    onClick={handleBookingSubmit}
                                    disabled={bookingLoading}
                                    className="mt-8 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 py-4 font-black transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {bookingLoading
                                        ? "Submitting Request..."
                                        : "Submit Booking Request 🚀"}
                                </button>

                            </div>

                        </div>

                    )}


                    {/* MY BOOKING */}
                    {activeSection === "booking" && (

                        <div className="space-y-6">

                            <h2 className="text-3xl font-black">
                                My Booking 📋
                            </h2>

                            <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-8 text-center">

                                <div className="text-5xl">⏳</div>

                                <h3 className="mt-4 text-2xl font-black text-yellow-300">
                                    No Active Booking
                                </h3>

                                <p className="mx-auto mt-3 max-w-md text-sm text-slate-300">
                                    You have not submitted a seat booking request yet.
                                </p>

                                <button
                                    onClick={() => setActiveSection("book")}
                                    className="mt-6 rounded-xl bg-yellow-400 px-6 py-3 font-black text-black hover:bg-yellow-300"
                                >
                                    Book a Seat
                                </button>

                            </div>

                        </div>

                    )}


                    {/* PROFILE */}
                    {activeSection === "profile" && (

                        <div className="space-y-6">

                            <h2 className="text-3xl font-black">
                                My Profile 👤
                            </h2>

                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

                                <div className="flex items-center gap-5">

                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-3xl font-black">
                                        {studentName.charAt(0).toUpperCase()}
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-black">
                                            {studentName}
                                        </h3>

                                        <p className="text-slate-400">
                                            {user?.email || "Student Account"}
                                        </p>
                                    </div>

                                </div>

                                <div className="mt-8 grid gap-4 sm:grid-cols-2">

                                    <div className="rounded-2xl bg-white/5 p-4">
                                        <p className="text-xs text-slate-400">
                                            Account Type
                                        </p>

                                        <p className="mt-1 font-bold">
                                            Student
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-white/5 p-4">
                                        <p className="text-xs text-slate-400">
                                            Account Status
                                        </p>

                                        <p className="mt-1 font-bold text-yellow-400">
                                            Pending Approval
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                </main>

            </div>


            {/* MOBILE NAVIGATION */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 p-2 backdrop-blur-xl md:hidden">

                <div className="grid grid-cols-4 gap-1">

                    <button
                        onClick={() => setActiveSection("dashboard")}
                        className={`rounded-xl py-2 text-center text-[10px] font-bold ${activeSection === "dashboard"
                            ? "bg-indigo-600"
                            : "text-slate-400"
                            }`}
                    >
                        🏠
                        <span className="block">Home</span>
                    </button>

                    <button
                        onClick={() => setActiveSection("book")}
                        className={`rounded-xl py-2 text-center text-[10px] font-bold ${activeSection === "book"
                            ? "bg-indigo-600"
                            : "text-slate-400"
                            }`}
                    >
                        🪑
                        <span className="block">Book</span>
                    </button>

                    <button
                        onClick={() => setActiveSection("booking")}
                        className={`rounded-xl py-2 text-center text-[10px] font-bold ${activeSection === "booking"
                            ? "bg-indigo-600"
                            : "text-slate-400"
                            }`}
                    >
                        📋
                        <span className="block">Booking</span>
                    </button>

                    <button
                        onClick={() => setActiveSection("profile")}
                        className={`rounded-xl py-2 text-center text-[10px] font-bold ${activeSection === "profile"
                            ? "bg-indigo-600"
                            : "text-slate-400"
                            }`}
                    >
                        👤
                        <span className="block">Profile</span>
                    </button>

                </div>

            </div>

        </div>
    );
};

export default StudentDashboard;