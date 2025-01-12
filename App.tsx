import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './lib/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MiniPlayer } from './components/video/MiniPlayer';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { UnlimitedPage } from './pages/UnlimitedPage';
import { LivePage } from './pages/LivePage';
import { LiveWatchPage } from './pages/LiveWatchPage';
import { EventPurchasePage } from './pages/EventPurchasePage';
import { Top100Page } from './pages/Top100Page';
import { SparksPage } from './pages/SparksPage';
import { TVPage } from './pages/TVPage';
import { SettingsPage } from './pages/SettingsPage';
import { WatchPage } from './pages/WatchPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { SearchPage } from './pages/SearchPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { UploadPage } from './pages/UploadPage';
import { FeaturedVideosPage } from './pages/FeaturedVideosPage';
import { PurchasePointsPage } from './pages/PurchasePointsPage';
import { EmbedPage } from './pages/EmbedPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CreatorDashboard } from './pages/CreatorDashboard';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16 flex">
        <Sidebar />
        <main className="flex-1 lg:ml-52">
          {children}
        </main>
      </div>
      <MiniPlayer />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Embed Route - No Layout */}
          <Route path="/embed/:videoId" element={<EmbedPage />} />
          
          {/* Auth Route - No Layout */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Admin Route - No Layout */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Creator Route - No Layout */}
          <Route path="/creator/*" element={<CreatorDashboard />} />

          {/* Main App Routes - With Layout */}
          <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
          <Route path="/sparks" element={<AppLayout><SparksPage /></AppLayout>} />
          <Route path="/tv" element={<AppLayout><TVPage /></AppLayout>} />
          <Route path="/top-100" element={<AppLayout><Top100Page /></AppLayout>} />
          <Route path="/category/:category" element={<AppLayout><CategoryPage /></AppLayout>} />
          <Route path="/unlimited" element={<AppLayout><UnlimitedPage /></AppLayout>} />
          <Route path="/live" element={<AppLayout><LivePage /></AppLayout>} />
          <Route path="/live/:eventId" element={<AppLayout><LiveWatchPage /></AppLayout>} />
          <Route path="/live/:eventId/purchase" element={<AppLayout><EventPurchasePage /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
          <Route path="/watch/:videoId" element={<AppLayout><WatchPage /></AppLayout>} />
          <Route path="/profile/:username" element={<AppLayout><ProfilePage /></AppLayout>} />
          <Route path="/search" element={<AppLayout><SearchPage /></AppLayout>} />
          <Route path="/notifications" element={<AppLayout><NotificationsPage /></AppLayout>} />
          <Route path="/upload" element={<AppLayout><UploadPage /></AppLayout>} />
          <Route path="/featured/:section" element={<AppLayout><FeaturedVideosPage /></AppLayout>} />
          <Route path="/points/purchase" element={<AppLayout><PurchasePointsPage /></AppLayout>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}