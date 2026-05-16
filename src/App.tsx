import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RasyatechLanding from './components/RasyatechLanding';
import DashboardRouter from './components/DashboardRouter';
import AffiliatePortal from './components/AffiliatePortal';
import SchoolLogin from './components/SchoolLogin';
import { SubdomainProvider } from './lib/SubdomainContext';

export default function App() {
  return (
    <SubdomainProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RasyatechLanding />} />
          <Route path="/admin" element={<DashboardRouter />} />
          <Route path="/affiliate/portal" element={<AffiliatePortal />} />
          <Route path="/login-sekolah" element={<SchoolLogin />} />
        </Routes>
      </Router>
    </SubdomainProvider>
  );
}
