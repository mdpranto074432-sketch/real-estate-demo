import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import {
  MonographErrorState,
  MonographSkeletonState,
} from './components/ui/FeedbackStates';
import { BangladeshLocalizationProvider } from './utils/bangladeshLocalization';

const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);
const ProjectDetailPage = lazy(() =>
  import('./pages/ProjectDetailPage').then((m) => ({
    default: m.ProjectDetailPage,
  }))
);
const LocationsPage = lazy(() =>
  import('./pages/LocationsPage').then((m) => ({ default: m.LocationsPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);

export function App() {
  return (
    <BangladeshLocalizationProvider>
      <BrowserRouter>
        <AppShell>
          <Suspense
            fallback={
              <MonographSkeletonState label="Preparing architectural monograph & spatial telemetry..." />
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<MonographErrorState />} />
            </Routes>
          </Suspense>
        </AppShell>
      </BrowserRouter>
    </BangladeshLocalizationProvider>
  );
}

export default App;
