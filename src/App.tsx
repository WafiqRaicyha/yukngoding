/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { ResetModal } from './components/ResetModal';
import { ToastContainer } from './components/ToastContainer';
import { useAuthStore } from './state/useAuthStore';
import { KategoriBahasa, TabId, UserAccount } from './types';
import { AdminView } from './views/AdminView';
import { DailyChallengeView } from './views/DailyChallengeView';
import { DashboardView } from './views/DashboardView';
import { LeaderboardView } from './views/LeaderboardView';
import { LoginView } from './views/LoginView';
import { MateriView } from './views/MateriView';
import { ProfileView } from './views/ProfileView';
import { SimulasiView } from './views/SimulasiView';

export default function App() {
  const {
    ready,
    users,
    currentUser,
    announcement,
    toasts,
    pushToast,
    dismissToast,
    login,
    registerUser,
    logout,
    recordQuizAnswer,
    completeMateri,
    completeSimulation,
    completeDailyChallenge,
    updateProfile,
    changePassword,
    resetOwnProgress,
    adminResetUserProgress,
    adminDeleteUser,
    adminUpdateAnnouncement,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [materiCategory, setMateriCategory] = useState<KategoriBahasa | 'Semua'>('Semua');
  const [selectedMateriId, setSelectedMateriId] = useState<string | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Sync default landing tab when session restores on reload and enforce RBAC route guard
  useEffect(() => {
    if (!ready || !currentUser) return;
    if (activeTab === 'admin' && currentUser.role !== 'admin') {
      setActiveTab('dashboard');
      pushToast({
        title: 'Akses ditolak',
        description: 'Halaman Panel Admin hanya dapat diakses oleh akun Admin.',
        variant: 'warning',
      });
    }
  }, [activeTab, currentUser, pushToast, ready]);

  // Also restore admin tab cleanly on fresh page load if already logged in as admin
  useEffect(() => {
    if (ready && currentUser?.role === 'admin' && activeTab === 'dashboard') {
      // Only auto-switch on initial mount when restored session is admin
      setActiveTab('admin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const handleAuthSuccess = (loggedInUser: UserAccount) => {
    setSelectedMateriId(null);
    setMateriCategory('Semua');
    setActiveTab(loggedInUser.role === 'admin' ? 'admin' : 'dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab: TabId) => {
    if (tab === 'admin' && currentUser?.role !== 'admin') {
      pushToast({
        title: 'Akses ditolak',
        description: 'Halaman Panel Admin hanya tersedia untuk Admin.',
        variant: 'warning',
      });
      setActiveTab('dashboard');
      return;
    }
    setActiveTab(tab);
    if (tab === 'materi') {
      setSelectedMateriId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCategory = (kategori: KategoriBahasa) => {
    setMateriCategory(kategori);
    setSelectedMateriId(null);
    setActiveTab('materi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMateri = (materiId: string) => {
    setSelectedMateriId(materiId);
    setActiveTab('materi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setResetModalOpen(false);
    setSelectedMateriId(null);
    setActiveTab('dashboard');
    logout();
  };

  // Prevent login flash while SHA-256 seed/session initializes
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-slate-600 text-sm">
        Memuat YukNgoding...
      </div>
    );
  }

  // Route Guard: Unauthenticated users are always gated to LoginView
  if (!currentUser) {
    return (
      <>
        <LoginView
          onLogin={login}
          onRegister={registerUser}
          onAuthSuccess={handleAuthSuccess}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-studio-canvas text-[#0F172A]">
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        <div key={activeTab} className="view-enter">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={currentUser}
              announcement={announcement}
              onNavigate={handleNavigate}
              onOpenCategory={handleOpenCategory}
              onOpenMateri={handleOpenMateri}
            />
          )}

        {activeTab === 'materi' && (
          <MateriView
            key={`${materiCategory}-${currentUser.id}`}
            user={currentUser}
            initialCategory={materiCategory}
            selectedMateriId={selectedMateriId}
            onSelectMateri={setSelectedMateriId}
            onRecordQuizAnswer={recordQuizAnswer}
            onCompleteMateri={completeMateri}
          />
        )}

        {activeTab === 'simulasi' && (
          <SimulasiView
            key={currentUser.id}
            user={currentUser}
            onCompleteSimulation={completeSimulation}
          />
        )}

        {activeTab === 'daily' && (
          <DailyChallengeView
            key={currentUser.id}
            user={currentUser}
            onCompleteDaily={completeDailyChallenge}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView currentUser={currentUser} allUsers={users} />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={currentUser}
            onUpdateProfile={updateProfile}
            onChangePassword={changePassword}
            onOpenResetModal={() => setResetModalOpen(true)}
            onLogout={handleLogout}
            onOpenAdminPanel={
              currentUser.role === 'admin' ? () => handleNavigate('admin') : undefined
            }
          />
        )}

        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <AdminView
            currentUser={currentUser}
            users={users}
            announcement={announcement}
            onCreateUser={registerUser}
            onResetUserProgress={adminResetUserProgress}
            onDeleteUser={adminDeleteUser}
            onUpdateAnnouncement={adminUpdateAnnouncement}
            onPreviewLearning={() => handleNavigate('dashboard')}
          />
        )}
        </div>
      </main>

      <ResetModal
        open={resetModalOpen}
        profileAlias={currentUser.profile.namaAlias}
        onClose={() => setResetModalOpen(false)}
        onConfirmReset={resetOwnProgress}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
