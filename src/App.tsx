import React, { createContext, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LiveMatches from './pages/LiveMatches';
import PrematchMatches from './pages/PrematchMatches';
import BetsManagement from './pages/BetsManagement';
import RiskManagement from './pages/RiskManagement';
import UserManagement from './pages/UserManagement';
import { getAppTheme } from './theme';
import { useEffect } from 'react';

export const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'dark' as 'light' | 'dark' });

const RouteTransitions: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.995 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ height: '100%' }}
          >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/live-matches" element={<LiveMatches />} />
          <Route path="/prematch-matches" element={<PrematchMatches />} />
          <Route path="/bets" element={<BetsManagement />} />
          <Route path="/risk-management" element={<RiskManagement />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('sb-color-mode') as 'light' | 'dark') || 'dark');
  const colorMode = useMemo(() => ({
    mode,
    toggleColorMode: () => setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('sb-color-mode', next);
      return next;
    })
  }), [mode]);
  const theme = useMemo(() => getAppTheme(mode), [mode]);
  useEffect(() => {
    NProgress.configure({ showSpinner: false, speed: 400, trickleSpeed: 120, minimum: 0.08 });
  }, []);

  useEffect(() => {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(mode === 'dark' ? 'dark-mode' : 'light-mode');
  }, [mode]);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <RouteChangeHandler />
            <RouteTransitions />
          </Layout>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// component responding to navigation start/finish for progress bar
const RouteChangeHandler: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    NProgress.start();
    // simulate slight delay to show animation; in real app tie to data fetching
  const t = setTimeout(() => NProgress.done(), 450);
    return () => {
      clearTimeout(t);
    };
  }, [location.pathname]);
  return null;
};

export default App;
