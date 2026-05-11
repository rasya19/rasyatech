import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RasyatechLanding from './components/RasyatechLanding';
import Admin from './components/Admin';
import AffiliatePortal from './components/AffiliatePortal';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RasyatechLanding />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/affiliate/portal" element={<AffiliatePortal />} />
      </Routes>
    </Router>
  );
}
