import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import SpinWheel from './pages/SpinWheel';
import Home from './pages/Home';
import About from './pages/About';
import Attendance from './pages/Attendance';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AntiProxy from './pages/AntiProxy';
import ProtectedRoute from './components/ProtectedRoute';
import Contact from './pages/Contact';
function App() {
  return (
    <div>
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
  path="/wheel"
  element={
    <ProtectedRoute>
      <SpinWheel />
    </ProtectedRoute>
  }
/>
<Route
  path="/contact"
  element={
    <ProtectedRoute>
      <Contact />
    </ProtectedRoute>
  }
/>
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
  path="/anti-proxy"
  element={
    <ProtectedRoute>
      <AntiProxy />
    </ProtectedRoute>
  }
/>

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

      </Routes>
    </div>
  );
}

export default App;