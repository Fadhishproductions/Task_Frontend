const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-2 mt-5">
      <div className="container mx-auto px-3 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-lg font-semibold">Task Manager</h2>
          <p className="text-sm">Simplify your workflow. Stay organized.</p>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-sm ">
          <p>Email : fadhishproductions@gmail.com</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-sm mt-4 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Task Manager. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
