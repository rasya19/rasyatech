import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RasyatechLanding from './components/RasyatechLanding';
import Admin from './components/Admin';
import AffiliatePortal from './components/AffiliatePortal';
import SchoolLogin from './components/SchoolLogin';
import { SubdomainProvider } from './lib/SubdomainContext';

export default function App() {
  return (
    <SubdomainProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RasyatechLanding />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/affiliate/portal" element={<AffiliatePortal />} />
          <Route path="/login-sekolah" element={<SchoolLogin />} />
        </Routes>
      </Router>
    </SubdomainProvider>
  );
}
