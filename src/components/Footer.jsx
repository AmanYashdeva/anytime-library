const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-10 border-t border-yellow-500">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Library */}
          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              📚 Anytime Library
            </h2>

            <p className="text-sm leading-7 text-gray-400">
              A peaceful, comfortable and distraction-free study environment
              designed for students preparing for competitive exams,
              college studies and self learning.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              📍 Contact
            </h2>

            <p className="mb-2">📍 Your Library Address</p>
            <p className="mb-2">📞 +91 XXXXX XXXXX</p>
            <p className="mb-2">📧 your@email.com</p>
            <p>🕒 6:00 AM - 10:00 PM</p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              ⚡ Quick Links
            </h2>

            <ul className="space-y-2">
              <li className="hover:text-yellow-400 cursor-pointer">
                🏠 Home
              </li>

              <li className="hover:text-yellow-400 cursor-pointer">
                💺 Available Seats
              </li>

              <li className="hover:text-yellow-400 cursor-pointer">
                📝 Registration
              </li>

              <li className="hover:text-yellow-400 cursor-pointer">
                📞 Contact
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              🌐 Follow Us
            </h2>

            <ul className="space-y-2">
              <li className="hover:text-pink-500 cursor-pointer">
                📸 Instagram
              </li>

              <li className="hover:text-green-500 cursor-pointer">
                💬 WhatsApp
              </li>

              <li className="hover:text-blue-500 cursor-pointer">
                📘 Facebook
              </li>

              <li className="hover:text-red-500 cursor-pointer">
                ▶️ YouTube
              </li>
            </ul>
          </div>

        </div>

        {/* Facilities */}
        <div className="border-t border-gray-800 mt-10 pt-8">

          <h2 className="text-xl font-bold text-white mb-5 text-center">
            ⭐ Library Facilities
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">

            <div>📶 Free WiFi</div>
            <div>❄️ Air Conditioned</div>
            <div>💧 RO Water</div>
            <div>🔌 Charging Point</div>
            <div>🎥 CCTV Security</div>
            <div>🔋 Power Backup</div>
            <div>🤫 Silent Study Zone</div>
            <div>🪑 Comfortable Seating</div>

          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center">

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Anytime Library. All Rights Reserved.
          </p>

          <p className="mt-2 text-xs text-gray-600">
            Made with ❤️ for students
            
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;