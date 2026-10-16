/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { WelcomeScreen } from './components/auth/WelcomeScreen.tsx';
import { Header } from './components/common/Header.tsx';
import { BottomNav } from './components/common/BottomNav.tsx';
import { FeedView } from './components/feed/FeedView.tsx';
import { DiscoveryView } from './components/discovery/DiscoveryView.tsx';
import { CommunitiesView } from './components/communities/CommunitiesView.tsx';
import { MessagesView } from './components/messages/MessagesView.tsx';
import { ProfileView } from './components/profile/ProfileView.tsx';

// Modals & Overlays
import { StoryViewerModal } from './components/feed/StoryViewerModal.tsx';
import { CreateStoryModal } from './components/feed/CreateStoryModal.tsx';
import { ProfileDetailModal } from './components/discovery/ProfileDetailModal.tsx';
import { ConnectionsModal } from './components/connections/ConnectionsModal.tsx';
import { SettingsModal } from './components/profile/SettingsModal.tsx';
import { SafetyModal } from './components/safety/SafetyModal.tsx';
import { ReportModal } from './components/safety/ReportModal.tsx';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal.tsx';
import { NexiaPlusModal } from './components/premium/NexiaPlusModal.tsx';
import { PremiumPortalModal } from './components/premium/PremiumPortalModal.tsx';
import { NotificationDrawer } from './components/notifications/NotificationDrawer.tsx';

import { Wifi, Battery, Signal } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isLoggedIn, activeTab, useMobileFrame, premiumTheme } = useApp();

  if (!isLoggedIn) {
    return (
      <>
        <WelcomeScreen />
        <SafetyModal />
      </>
    );
  }

  // Active view content
  const renderActiveView = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedView />;
      case 'discover':
        return <DiscoveryView />;
      case 'communities':
        return <CommunitiesView />;
      case 'messages':
        return <MessagesView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <FeedView />;
    }
  };

  return (
    <div className={`min-h-screen bg-neutral-100 flex flex-col items-center justify-start ${useMobileFrame ? 'p-2 sm:p-6' : ''}`}>
      {/* Shell Container: either simulates an Android smartphone frame or stretches fluidly */}
      <div
        className={`w-full bg-neutral-50 flex flex-col justify-between transition-all duration-300 relative ${
          useMobileFrame
            ? 'max-w-[420px] h-[860px] rounded-[44px] shadow-2xl border-[10px] border-neutral-900 overflow-hidden ring-1 ring-neutral-400'
            : 'max-w-6xl min-h-screen shadow-xs'
        }`}
      >
        {/* Android Simulated Status Bar when inside frame */}
        {useMobileFrame && (
          <div className="bg-white px-6 py-2 flex items-center justify-between text-neutral-800 text-[11px] font-semibold select-none border-b border-neutral-100 shrink-0">
            <span>12:45</span>
            {/* Camera notch simulation */}
            <div className="w-4 h-4 rounded-full bg-neutral-900 mx-auto" />
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Global Top Header */}
        <Header />

        {/* Main Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-4 pt-3.5">
          {renderActiveView()}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNav />

        {/* Android simulated home bar gesture handle when inside frame */}
        {useMobileFrame && (
          <div className="bg-white py-1 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-neutral-300 rounded-full" />
          </div>
        )}
      </div>

      {/* Global Overlays and Modals */}
      <StoryViewerModal />
      <CreateStoryModal />
      <ProfileDetailModal />
      <ConnectionsModal />
      <SettingsModal />
      <SafetyModal />
      <ReportModal />
      <AdminDashboardModal />
      <NexiaPlusModal />
      <PremiumPortalModal />
      <NotificationDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
