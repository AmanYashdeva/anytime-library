const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-10 border-t border-yellow-500">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

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
            <h3 className="text-xl font-bold text-white mb-4 hover:text-green-400"> Avinash Singh <span className="text-gray-400 font-normal text-sm"> &</span> <span><a href="tel:+916392165271" className="hover:text-green-400 cursor-pointer"> Devam Patel</a></span></h3>

            <p className="mb-2 hover:text-yellow-400 cursor-pointer">📍 Rajamau Road, Near Anant Sherwani's & Dulha Ghar, Bachhrawan Raebareli</p>
            <p className="mb-2 text-green-400 hover:text-green-400 cursor-pointer"><a href="tel:+919161340909">📞 +91 9161340909</a></p>
            <p>🕒 6:00 AM - 10:00 PM</p>
            <p className="mb-2 hover:text-blue-400 cursor-pointer"> <a href="mailto:anytimelibraries@gmail.com">📧 anytimelibraries@gmail.com</a> </p>
          </div>

          {/* Social */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              🌐 Follow Us
            </h2>

            <ul className="space-y-2">
              <li className="hover:text-pink-500 cursor-pointer">
                <a href="https://www.instagram.com/anytime_library?stkn=ejBmaHFneGhmZWJo">📸 Instagram</a>
              </li>

              <li className="hover:text-green-500 cursor-pointer">
                <a href="https://wa.me/919161310909">💬 WhatsApp</a>
              </li>

              <li className="hover:text-blue-500 cursor-pointer">
                📘 Facebook
              </li>
            </ul>
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
          <p className="mt-2 text-xs text-gray-600"> Developer: <a href="https://www.linkedin.com/in/aman-yashdeva-62ba12334" className="hover:text-blue-400 cursor-pointer">Aman Yashdeva</a></p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;