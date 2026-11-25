import { useCallback, useEffect, useState } from 'react';
import { ACHIEVEMENTS, evaluateUnlockedBadges, getLevelInfo } from '../data/badges';
import { getTodayLocalDateString } from '../data/kuis';
import {
  AccentTheme,
  AuthSession,
  AvatarId,
  GamifikasiData,
  GlobalAnnouncement,
  SimulasiId,
  ToastMessage,
  UserAccount,
} from '../types';
import { hashPassword } from '../utils/crypto';

export const USERS_STORAGE_KEY = 'yukngoding_users_v1';
export const SESSION_STORAGE_KEY = 'yukngoding_session_v1';
export const ANNOUNCEMENT_STORAGE_KEY = 'yukngoding_announcement_v1';

export const USERNAME_REGEX = /^[a-z0-9_]{3,18}$/;
export const ALIAS_REGEX = /^[A-Za-z0-9_ -]{3,18}$/;

export function createEmptyGamifikasi(): GamifikasiData {
  return {
    xp: 0,
    level: 1,
    totalPoin: 0,
    badge: [],
    materiSelesai: {},
    claimedQuestions: [],
    simulasiSelesai: [],
    dailyCompletedDates: [],
  };
}

function createDefaultAnnouncement(): GlobalAnnouncement {
  return {
    pesan:
      'Selamat datang di YukNgoding! Mulai petualangan ngodingmu dari materi Python, JavaScript, atau SQL dan coba Daily Challenge hari ini.',
    updatedBy: 'Admin_YukNgoding',
    updatedAt: getTodayLocalDateString(),
  };
}

async function createSeedUsers(): Promise<UserAccount[]> {
  const today = getTodayLocalDateString();
  const adminHash = await hashPassword('admin123');

  return [
    {
      id: 'usr-admin-01',
      username: 'admin',
      passwordHash: adminHash,
      role: 'admin',
      profile: {
        namaAlias: 'Admin_YukNgoding',
        avatar: 'avatar-wizard',
        bio: 'Pengelola platform belajar koding YukNgoding',
        temaAksen: 'purple',
      },
      gamifikasi: createEmptyGamifikasi(),
      createdAt: today,
      lastActive: today,
    },
  ];
}

function sanitizeGamifikasi(raw: unknown): GamifikasiData {
  const fallback = createEmptyGamifikasi();
  if (!raw || typeof raw !== 'object') return fallback;
  const g = raw as Record<string, unknown>;
  const xp = typeof g.xp === 'number' && Number.isFinite(g.xp) && g.xp >= 0 ? Math.floor(g.xp) : 0;
  const totalPoin =
    typeof g.totalPoin === 'number' && Number.isFinite(g.totalPoin) && g.totalPoin >= 0
      ? Math.floor(g.totalPoin)
      : 0;

  const materiSelesai: GamifikasiData['materiSelesai'] = {};
  if (g.materiSelesai && typeof g.materiSelesai === 'object' && !Array.isArray(g.materiSelesai)) {
    for (const [key, val] of Object.entries(g.materiSelesai as Record<string, unknown>)) {
      if (val && typeof val === 'object') {
        const entry = val as Record<string, unknown>;
        materiSelesai[key] = {
          skor: typeof entry.skor === 'number' ? entry.skor : 100,
          status: 'Selesai',
          tanggalPenyelesaian:
            typeof entry.tanggalPenyelesaian === 'string'
              ? entry.tanggalPenyelesaian
              : getTodayLocalDateString(),
        };
      }
    }
  }

  const sanitized: GamifikasiData = {
    xp,
    level: getLevelInfo(xp).current.level,
    totalPoin,
    badge: Array.isArray(g.badge) ? g.badge.filter((x): x is string => typeof x === 'string') : [],
    materiSelesai,
    claimedQuestions: Array.isArray(g.claimedQuestions)
      ? g.claimedQuestions.filter((x): x is string => typeof x === 'string')
      : [],
    simulasiSelesai: Array.isArray(g.simulasiSelesai)
      ? g.simulasiSelesai.filter(
          (x): x is SimulasiId => x === 'sim-python' || x === 'sim-js' || x === 'sim-sql',
        )
      : [],
    dailyCompletedDates: Array.isArray(g.dailyCompletedDates)
      ? g.dailyCompletedDates.filter((x): x is string => typeof x === 'string')
      : [],
  };

  sanitized.badge = evaluateUnlockedBadges(sanitized);
  return sanitized;
}

function sanitizeUsersArray(raw: unknown): UserAccount[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const validAvatars: AvatarId[] = [
    'byte-mascot',
    'avatar-wizard',
    'avatar-cyber',
    'avatar-rocket',
    'avatar-terminal',
    'avatar-circuit',
    'avatar-shield',
  ];
  const validThemes: AccentTheme[] = ['blue', 'purple', 'green'];

  const list: UserAccount[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;
    if (
      typeof obj.id !== 'string' ||
      typeof obj.username !== 'string' ||
      typeof obj.passwordHash !== 'string' ||
      (obj.role !== 'admin' && obj.role !== 'user')
    ) {
      continue;
    }
    const p = (obj.profile && typeof obj.profile === 'object'
      ? obj.profile
      : {}) as Record<string, unknown>;
    const avatar = validAvatars.includes(p.avatar as AvatarId)
      ? (p.avatar as AvatarId)
      : 'byte-mascot';
    const temaAksen = validThemes.includes(p.temaAksen as AccentTheme)
      ? (p.temaAksen as AccentTheme)
      : 'blue';

    list.push({
      id: obj.id,
      username: obj.username.toLowerCase(),
      passwordHash: obj.passwordHash,
      role: obj.role,
      profile: {
        namaAlias:
          typeof p.namaAlias === 'string' && p.namaAlias.trim().length >= 3
            ? p.namaAlias.trim().slice(0, 18)
            : obj.username,
        avatar,
        bio: typeof p.bio === 'string' ? p.bio.slice(0, 80) : '',
        temaAksen,
      },
      gamifikasi: sanitizeGamifikasi(obj.gamifikasi),
      createdAt: typeof obj.createdAt === 'string' ? obj.createdAt : getTodayLocalDateString(),
      lastActive: typeof obj.lastActive === 'string' ? obj.lastActive : getTodayLocalDateString(),
    });
  }

  return list.length > 0 ? list : null;
}

function loadSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (
      parsed &&
      typeof parsed.userId === 'string' &&
      (parsed.role === 'admin' || parsed.role === 'user') &&
      typeof parsed.loginAt === 'string'
    ) {
      return { userId: parsed.userId, role: parsed.role, loginAt: parsed.loginAt };
    }
    return null;
  } catch {
    return null;
  }
}

function loadAnnouncement(): GlobalAnnouncement {
  try {
    const raw = window.localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
    if (!raw) return createDefaultAnnouncement();
    const parsed = JSON.parse(raw) as Partial<GlobalAnnouncement>;
    if (parsed && typeof parsed.pesan === 'string') {
      return {
        pesan: parsed.pesan,
        updatedBy: typeof parsed.updatedBy === 'string' ? parsed.updatedBy : 'Admin_YukNgoding',
        updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : getTodayLocalDateString(),
      };
    }
    return createDefaultAnnouncement();
  } catch {
    return createDefaultAnnouncement();
  }
}

export function useAuthStore() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [announcement, setAnnouncement] = useState<GlobalAnnouncement>(createDefaultAnnouncement);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Bootstrap users, session, and global announcement safely from localStorage
  useEffect(() => {
    let active = true;
    async function init() {
      let loadedUsers: UserAccount[] | null = null;
      try {
        const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
        if (raw) {
          loadedUsers = sanitizeUsersArray(JSON.parse(raw));
        }
      } catch {
        loadedUsers = null;
      }

      if (!loadedUsers) {
        loadedUsers = await createSeedUsers();
      } else {
        loadedUsers = loadedUsers.filter((u) => u.id !== 'usr-user-01');
        if (loadedUsers.length === 0) {
          loadedUsers = await createSeedUsers();
        }
      }
      try {
        window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(loadedUsers));
      } catch {
        // Ignore storage quota errors
      }

      const loadedAnn = loadAnnouncement();
      try {
        if (!window.localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY)) {
          window.localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(loadedAnn));
        }
      } catch {
        // Ignore
      }

      const storedSession = loadSession();
      const validSession =
        storedSession && loadedUsers.some((u) => u.id === storedSession.userId)
          ? storedSession
          : null;

      if (!validSession && storedSession) {
        try {
          window.localStorage.removeItem(SESSION_STORAGE_KEY);
        } catch {
          // Ignore
        }
      }

      if (active) {
        setUsers(loadedUsers);
        setSession(validSession);
        setAnnouncement(loadedAnn);
        setReady(true);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  // Persist users array
  useEffect(() => {
    if (!ready || users.length === 0) return;
    try {
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {
      // Ignore
    }
  }, [ready, users]);

  // Persist session
  useEffect(() => {
    if (!ready) return;
    try {
      if (session) {
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } else {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }, [ready, session]);

  // Persist global announcement
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(announcement));
    } catch {
      // Ignore
    }
  }, [ready, announcement]);

  const currentUser = session ? users.find((u) => u.id === session.userId) ?? null : null;

  const login = useCallback(
    async (
      rawUsername: string,
      password: string,
    ): Promise<{ ok: boolean; user?: UserAccount; error?: string }> => {
      const username = rawUsername.trim().toLowerCase();
      if (!username || !password) {
        return { ok: false, error: 'Masukkan username dan password terlebih dahulu.' };
      }

      const target = users.find((u) => u.username === username);
      if (!target) {
        return { ok: false, error: 'Username tidak ditemukan. Periksa kembali atau daftar akun baru.' };
      }

      const hashed = await hashPassword(password);
      if (hashed !== target.passwordHash) {
        return { ok: false, error: 'Password atau PIN salah. Silakan coba lagi.' };
      }

      const today = getTodayLocalDateString();
      setUsers((prev) =>
        prev.map((u) => (u.id === target.id ? { ...u, lastActive: today } : u)),
      );

      const newSession: AuthSession = {
        userId: target.id,
        role: target.role,
        loginAt: new Date().toISOString(),
      };
      setSession(newSession);

      pushToast({
        title: `Selamat datang, ${target.profile.namaAlias}!`,
        description:
          target.role === 'admin'
            ? 'Masuk sebagai Admin — Panel Admin siap digunakan.'
            : `Level ${target.gamifikasi.level} · ${target.gamifikasi.totalPoin} Poin`,
        variant: 'success',
      });

      return { ok: true, user: { ...target, lastActive: today } };
    },
    [pushToast, users],
  );

  const registerUser = useCallback(
    async (params: {
      namaAlias: string;
      username: string;
      password: string;
      createdByAdmin?: boolean;
    }): Promise<{ ok: boolean; user?: UserAccount; error?: string }> => {
      const namaAlias = params.namaAlias.trim();
      const username = params.username.trim().toLowerCase();
      const password = params.password;

      if (!ALIAS_REGEX.test(namaAlias)) {
        return {
          ok: false,
          error: 'Nama Alias harus 3–18 karakter (huruf, angka, spasi, _, atau -).',
        };
      }
      if (!USERNAME_REGEX.test(username)) {
        return {
          ok: false,
          error: 'Username harus 3–18 karakter huruf kecil, angka, atau garis bawah (_) tanpa spasi.',
        };
      }
      if (password.length < 4) {
        return { ok: false, error: 'Password / PIN minimal 4 karakter.' };
      }
      if (users.some((u) => u.username === username)) {
        return { ok: false, error: `Username @${username} sudah digunakan. Pilih username lain.` };
      }

      const passwordHash = await hashPassword(password);
      const today = getTodayLocalDateString();
      const newUser: UserAccount = {
        id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        username,
        passwordHash,
        // Public registration always hardcodes role 'user' (RBAC protection)
        role: 'user',
        profile: {
          namaAlias,
          avatar: 'byte-mascot',
          bio: 'Baru mulai petualangan belajar koding di YukNgoding!',
          temaAksen: 'blue',
        },
        gamifikasi: createEmptyGamifikasi(),
        createdAt: today,
        lastActive: today,
      };

      setUsers((prev) => [...prev, newUser]);
      pushToast({
        title: params.createdByAdmin
          ? `Akun @${username} berhasil ditambahkan`
          : `Akun @${username} berhasil dibuat!`,
        description: params.createdByAdmin
          ? `${namaAlias} siap login sebagai pembelajar.`
          : 'Silakan masuk menggunakan username dan password barumu.',
        variant: 'success',
      });
      return { ok: true, user: newUser };
    },
    [pushToast, users],
  );

  const logout = useCallback(() => {
    const alias = currentUser?.profile.namaAlias;
    setSession(null);
    pushToast({
      title: 'Berhasil keluar',
      description: alias
        ? `Progres akun ${alias} tetap tersimpan aman di perangkat ini.`
        : 'Sesi login telah diakhiri.',
      variant: 'info',
    });
  }, [currentUser?.profile.namaAlias, pushToast]);

  const mutateCurrentUserGamifikasi = useCallback(
    (
      updater: (
        current: GamifikasiData,
      ) => { next: GamifikasiData; notifications?: Omit<ToastMessage, 'id'>[] },
    ) => {
      if (!session) return;
      let pendingToasts: Omit<ToastMessage, 'id'>[] = [];
      const today = getTodayLocalDateString();

      setUsers((prev) =>
        prev.map((user) => {
          if (user.id !== session.userId) return user;
          const prevLevel = user.gamifikasi.level;
          const prevBadges = new Set(user.gamifikasi.badge);

          const { next: updatedRaw, notifications = [] } = updater(user.gamifikasi);
          const computedLevel = getLevelInfo(updatedRaw.xp).current;
          const evaluatedBadges = evaluateUnlockedBadges({
            ...updatedRaw,
            level: computedLevel.level,
          });

          const finalGamifikasi: GamifikasiData = {
            ...updatedRaw,
            level: computedLevel.level,
            badge: evaluatedBadges,
          };

          pendingToasts = [...notifications];
          if (finalGamifikasi.level > prevLevel) {
            pendingToasts.push({
              title: `Naik ke Level ${finalGamifikasi.level}: ${computedLevel.gelar}`,
              description: `Total XP kamu sekarang ${finalGamifikasi.xp} XP. Byte ikut berevolusi!`,
              variant: 'gamify',
            });
          }

          const newlyUnlocked = evaluatedBadges.filter((b) => !prevBadges.has(b));
          for (const badgeId of newlyUnlocked) {
            const badgeDef = ACHIEVEMENTS.find((a) => a.id === badgeId);
            if (badgeDef) {
              pendingToasts.push({
                title: `Badge Terbuka: ${badgeDef.nama}`,
                description: badgeDef.deskripsi,
                variant: 'gamify',
              });
            }
          }

          return {
            ...user,
            gamifikasi: finalGamifikasi,
            lastActive: today,
          };
        }),
      );

      window.setTimeout(() => {
        pendingToasts.forEach((t) => pushToast(t));
      }, 0);
    },
    [pushToast, session],
  );

  const recordQuizAnswer = useCallback(
    (params: {
      questionId: string;
      isCorrect: boolean;
      poin: number;
      xp: number;
    }): { rewarded: boolean; alreadyClaimed: boolean } => {
      if (!currentUser) return { rewarded: false, alreadyClaimed: false };
      const alreadyClaimed = currentUser.gamifikasi.claimedQuestions.includes(params.questionId);
      if (!params.isCorrect) return { rewarded: false, alreadyClaimed };
      if (alreadyClaimed) return { rewarded: false, alreadyClaimed: true };

      mutateCurrentUserGamifikasi((current) => {
        if (current.claimedQuestions.includes(params.questionId)) return { next: current };
        return {
          next: {
            ...current,
            totalPoin: current.totalPoin + params.poin,
            xp: current.xp + params.xp,
            claimedQuestions: [...current.claimedQuestions, params.questionId],
          },
          notifications: [
            {
              title: `Jawaban Benar (+${params.poin} Poin, +${params.xp} XP)`,
              variant: 'success',
            },
          ],
        };
      });

      return { rewarded: true, alreadyClaimed: false };
    },
    [currentUser, mutateCurrentUserGamifikasi],
  );

  const completeMateri = useCallback(
    (materiId: string, skor: number) => {
      const today = getTodayLocalDateString();
      mutateCurrentUserGamifikasi((current) => {
        const existing = current.materiSelesai[materiId];
        return {
          next: {
            ...current,
            materiSelesai: {
              ...current.materiSelesai,
              [materiId]: {
                skor: existing ? Math.max(existing.skor, skor) : skor,
                status: 'Selesai',
                tanggalPenyelesaian: today,
              },
            },
          },
          notifications: existing
            ? []
            : [
                {
                  title: 'Materi Selesai!',
                  description: `Progres modul tersimpan dengan skor ${skor}%.`,
                  variant: 'success',
                },
              ],
        };
      });
    },
    [mutateCurrentUserGamifikasi],
  );

  const completeSimulation = useCallback(
    (simId: SimulasiId, title: string): { rewarded: boolean } => {
      if (!currentUser) return { rewarded: false };
      const alreadyDone = currentUser.gamifikasi.simulasiSelesai.includes(simId);
      if (alreadyDone) {
        pushToast({
          title: `${title} selesai (Mode Latihan)`,
          description: 'Reward simulasi sudah pernah diklaim (+0 Poin, +0 XP).',
          variant: 'info',
        });
        return { rewarded: false };
      }

      mutateCurrentUserGamifikasi((current) => {
        if (current.simulasiSelesai.includes(simId)) return { next: current };
        return {
          next: {
            ...current,
            totalPoin: current.totalPoin + 50,
            xp: current.xp + 40,
            simulasiSelesai: [...current.simulasiSelesai, simId],
          },
          notifications: [
            {
              title: `${title} Ditaklukkan!`,
              description: '+50 Poin dan +40 XP ditambahkan ke akunmu.',
              variant: 'success',
            },
          ],
        };
      });
      return { rewarded: true };
    },
    [currentUser, mutateCurrentUserGamifikasi, pushToast],
  );

  const completeDailyChallenge = useCallback(
    (dateStr: string, poin: number, xp: number): { rewarded: boolean } => {
      if (!currentUser) return { rewarded: false };
      if (currentUser.gamifikasi.dailyCompletedDates.includes(dateStr)) {
        return { rewarded: false };
      }
      mutateCurrentUserGamifikasi((current) => {
        if (current.dailyCompletedDates.includes(dateStr)) return { next: current };
        return {
          next: {
            ...current,
            totalPoin: current.totalPoin + poin,
            xp: current.xp + xp,
            dailyCompletedDates: [...current.dailyCompletedDates, dateStr],
          },
          notifications: [
            {
              title: `Daily Challenge Selesai (+${poin} Poin, +${xp} XP)`,
              description: `Tantangan tanggal ${dateStr} berhasil diklaim.`,
              variant: 'success',
            },
          ],
        };
      });
      return { rewarded: true };
    },
    [currentUser, mutateCurrentUserGamifikasi],
  );

  const updateProfile = useCallback(
    (params: {
      namaAlias: string;
      avatar: AvatarId;
      bio: string;
      temaAksen: AccentTheme;
    }): { ok: boolean; error?: string } => {
      if (!session) return { ok: false, error: 'Sesi tidak aktif.' };
      const namaAlias = params.namaAlias.trim();
      const bio = params.bio.trim();

      if (!ALIAS_REGEX.test(namaAlias)) {
        return {
          ok: false,
          error: 'Nama Alias harus 3–18 karakter (huruf, angka, spasi, _, atau -).',
        };
      }
      if (bio.length > 80) {
        return { ok: false, error: 'Bio singkat maksimal 80 karakter.' };
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === session.userId
            ? {
                ...u,
                profile: {
                  namaAlias,
                  avatar: params.avatar,
                  bio,
                  temaAksen: params.temaAksen,
                },
                lastActive: getTodayLocalDateString(),
              }
            : u,
        ),
      );

      pushToast({
        title: 'Profil diperbarui',
        description: 'Perubahan identitas, avatar, dan bio berhasil disimpan.',
        variant: 'success',
      });
      return { ok: true };
    },
    [pushToast, session],
  );

  const changePassword = useCallback(
    async (params: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }): Promise<{ ok: boolean; error?: string }> => {
      if (!currentUser) return { ok: false, error: 'Sesi tidak aktif.' };
      const oldHash = await hashPassword(params.oldPassword);
      if (oldHash !== currentUser.passwordHash) {
        return { ok: false, error: 'Password lama tidak cocok.' };
      }
      if (params.newPassword.length < 4) {
        return { ok: false, error: 'Password baru minimal 4 karakter.' };
      }
      if (params.newPassword !== params.confirmPassword) {
        return { ok: false, error: 'Konfirmasi password baru tidak sama.' };
      }

      const newHash = await hashPassword(params.newPassword);
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, passwordHash: newHash } : u)),
      );
      pushToast({
        title: 'Password diperbarui',
        description: 'Gunakan password baru saat login berikutnya.',
        variant: 'success',
      });
      return { ok: true };
    },
    [currentUser, pushToast],
  );

  const resetOwnProgress = useCallback(() => {
    if (!session) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === session.userId
          ? {
              ...u,
              gamifikasi: createEmptyGamifikasi(),
              lastActive: getTodayLocalDateString(),
            }
          : u,
      ),
    );
    pushToast({
      title: 'Progres akun direset',
      description: 'Seluruh Poin, XP, Level, Badge, dan materi selesai kembali ke awal (Spark Byte Level 1).',
      variant: 'warning',
    });
  }, [pushToast, session]);

  // ==================== ADMIN-ONLY RBAC ACTIONS ====================
  const adminResetUserProgress = useCallback(
    (targetUserId: string) => {
      if (currentUser?.role !== 'admin') return;
      const target = users.find((u) => u.id === targetUserId);
      if (!target) return;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUserId ? { ...u, gamifikasi: createEmptyGamifikasi() } : u,
        ),
      );
      pushToast({
        title: `Progres @${target.username} direset`,
        description: `Skor, XP, level, dan materi ${target.profile.namaAlias} dikembalikan ke 0.`,
        variant: 'warning',
      });
    },
    [currentUser?.role, pushToast, users],
  );

  const adminDeleteUser = useCallback(
    (targetUserId: string): { ok: boolean; error?: string } => {
      if (currentUser?.role !== 'admin') {
        return { ok: false, error: 'Akses ditolak.' };
      }
      if (targetUserId === currentUser.id) {
        return { ok: false, error: 'Admin tidak dapat menghapus akunnya sendiri.' };
      }
      const target = users.find((u) => u.id === targetUserId);
      if (!target || target.role === 'admin') {
        return { ok: false, error: 'Akun admin tidak dapat dihapus.' };
      }

      setUsers((prev) => prev.filter((u) => u.id !== targetUserId));
      pushToast({
        title: `Akun @${target.username} dihapus`,
        description: `Akun ${target.profile.namaAlias} telah dihapus dari perangkat.`,
        variant: 'warning',
      });
      return { ok: true };
    },
    [currentUser, pushToast, users],
  );

  const adminUpdateAnnouncement = useCallback(
    (rawMessage: string): { ok: boolean; error?: string } => {
      if (currentUser?.role !== 'admin') {
        return { ok: false, error: 'Hanya Admin yang dapat mengubah pengumuman global.' };
      }
      const pesan = rawMessage.trim();
      if (pesan.length > 220) {
        return { ok: false, error: 'Pengumuman maksimal 220 karakter.' };
      }
      setAnnouncement({
        pesan,
        updatedBy: currentUser.profile.namaAlias,
        updatedAt: getTodayLocalDateString(),
      });
      pushToast({
        title: pesan ? 'Pengumuman global diperbarui' : 'Pengumuman global disembunyikan',
        description: pesan
          ? 'Pesan kini tampil di Dashboard seluruh akun pembelajar.'
          : 'Banner pengumuman tidak ditampilkan sampai diisi kembali.',
        variant: 'info',
      });
      return { ok: true };
    },
    [currentUser, pushToast],
  );

  return {
    ready,
    users,
    session,
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
  };
}
