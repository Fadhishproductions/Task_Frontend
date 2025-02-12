import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow">
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Router>
      </main>
      <Footer />
    </div>
  );
}
