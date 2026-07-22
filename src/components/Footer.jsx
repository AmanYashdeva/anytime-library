const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-10 border-t border-yellow-500">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Library */}
          <div className="text-left">
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
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white mb-4 hover:text-blue-500 cursor-pointer">
              Avinash Singh, Devam   
            </h2>

            <p className="mb-2 hover:text-yellow-500 cursor-pointer">📍 Rajamau Road, Above Anant Sherwani's & Dulha Ghar, Bachhrawan, Raebareli-229301 </p>
            <p className="mb-2 hover:text-yellow-500 cursor-pointer">📞 +919219384600</p>
            <p className="mb-2 hover:text-yellow-500 cursor-pointer">📞 +916392165271</p>
            <p className="mb-2 hover:text-yellow-500 cursor-pointer">📧 anytimelibrary@gmail.com</p>
            {/* <p>🕒 10:00 AM - 10:00 PM</p> */}
          </div>

          {/* Social */}
          <div className="text-right md:text-center">
            <h2 className="text-xl font-bold text-white mb-4">
              🌐 Follow Us
            </h2>

            <ul className="space-y-2">
              <li className="hover:text-pink-500 cursor-pointer">
                📸 Instagram
              </li>

              <li className="hover:text-green-500 cursor-pointer">
                 <a href="https://wa.me/919219384600?text=Hello%20Any%20Time%20Library%2C%20I%20want%20to%20make%20an%20inquiry.">💬 Whatsapp</a>
              </li>

              <li className="hover:text-blue-500 cursor-pointer">
                📘 Facebook
              </li>
            </ul>
          </div>

        </div>

        {/* Facilities */}
        

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center">

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Anytime Library. All Rights Reserved.
          </p>

          <p className="mt-2 text-xs text-gray-600">
            Made with ❤️ for students
            <br />
            Coded:- Aman Yashdeva
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;