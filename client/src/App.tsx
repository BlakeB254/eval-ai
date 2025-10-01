import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OrganizationDetail from './pages/OrganizationDetail';
import JudgeDashboardImproved from './pages/JudgeDashboardImproved';
import ApplicationScoringImproved from './pages/ApplicationScoringImproved';
import ComparisonDashboard from './pages/ComparisonDashboard';
import Reports from './pages/Reports';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/organizations/:id" element={<OrganizationDetail />} />
        <Route path="/judge" element={<JudgeDashboardImproved />} />
        <Route path="/judge/score/:applicationId" element={<ApplicationScoringImproved />} />
        <Route path="/comparison" element={<ComparisonDashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
