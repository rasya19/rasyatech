import { useSubdomain } from '../lib/SubdomainContext';
import Admin from './Admin';
import TenantDashboard from './TenantDashboard';

export default function DashboardRouter() {
  const subdomain = useSubdomain();
  
  // If subdomain exists (part of the URL), show Tenant Dashboard
  // If no subdomain (Main domain), show Admin (SuperAdmin)
  return subdomain ? <TenantDashboard /> : <Admin />;
}
