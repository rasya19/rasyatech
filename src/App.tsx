import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RasyatechLanding from './components/RasyatechLanding';
import Admin from './components/Admin';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RasyatechLanding />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
