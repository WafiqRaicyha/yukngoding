import { Award, Trophy } from 'lucide-react';
import { useMemo } from 'react';
import { getLevelInfo } from '../data/badges';
import { DEMO_LEADERBOARD_BOTS } from '../data/demoProfiles';
import { DemoLeaderboardEntry, UserAccount } from '../types';

interface LeaderboardViewProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
}

export function LeaderboardView({ currentUser, allUsers }: LeaderboardViewProps) {
  const rankedList = useMemo(() => {
    const localLearners: DemoLeaderboardEntry[] = allUsers
      .filter((u) => u.role === 'user')
      .map((u) => ({
        id: u.id,
        namaAlias: u.profile.namaAlias,
        username: u.username,
        peranLabel:
          u.id === currentUser.id
            ? `Pembelajar · @${u.username} (Kamu)`
            : `Pembelajar · @${u.username}`,
        totalPoin: u.gamifikasi.totalPoin,
        xp: u.gamifikasi.xp,
        level: u.gamifikasi.level,
        badgeCount: u.gamifikasi.badge.length,
        materiCount: Object.keys(u.gamifikasi.materiSelesai).length,
        isCurrentUser: u.id === currentUser.id,
        isDemoBot: false,
      }));

    return [...DEMO_LEADERBOARD_BOTS, ...localLearners].sort((a, b) => {
      if (b.totalPoin !== a.totalPoin) return b.totalPoin - a.totalPoin;
      if (b.xp !== a.xp) return b.xp - a.xp;
      return a.isCurrentUser ? -1 : 1;
    });
  }, [allUsers, currentUser.id]);

  const topThree = rankedList.slice(0, 3);
  const userRankIndex = rankedList.findIndex((e) => e.isCurrentUser);
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : null;
  const aboveEntry = userRank && userRank > 1 ? rankedList[userRank - 2] : null;
  const pointsNeeded = aboveEntry
    ? Math.max(1, aboveEntry.totalPoin - currentUser.gamifikasi.totalPoin + 1)
    : 0;

  const podiumStyles = [
    {
      label: 'Peringkat #1',
      topBar: 'bg-amber-500',
      rankColor: 'text-amber-600',
      iconBg: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
    },
    {
      label: 'Peringkat #2',
      topBar: 'bg-slate-400',
      rankColor: 'text-slate-600',
      iconBg: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    },
    {
      label: 'Peringkat #3',
      topBar: 'bg-orange-400',
      rankColor: 'text-orange-700',
      iconBg: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Leaderboard Lokal
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            Peringkat menggabungkan seluruh akun pembelajar terdaftar di perangkat ini bersama 5 profil demo bot berdasarkan total poin tertinggi.
          </p>
        </div>

        {userRank !== null ? (
          <div className="inline-flex items-center gap-2 text-sm text-slate-700 surface-card px-4 py-2.5 rounded-xl shrink-0 tabular-nums">
            <Trophy className="w-4 h-4 text-amber-600" aria-hidden="true" />
            <span>
              Peringkat kamu: <strong className="text-slate-900">#{userRank}</strong> dari{' '}
              {rankedList.length}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#6D28D9] bg-violet-50 border border-violet-200 px-4 py-2.5 rounded-xl shrink-0">
            <Trophy className="w-4 h-4" aria-hidden="true" />
            <span>Mode Pratinjau Admin · {rankedList.length} peserta</span>
          </div>
        )}
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {topThree.map((entry, idx) => {
            const style = podiumStyles[idx] ?? podiumStyles[2];
            const gelar = getLevelInfo(entry.xp).current.gelar;
            return (
              <div
                key={entry.id}
                className={`surface-card rounded-2xl overflow-hidden ${
                  entry.isCurrentUser ? 'ring-2 ring-[#2563EB]/40' : ''
                }`}
              >
                <div className={`h-1.5 w-full ${style.topBar}`} aria-hidden="true" />
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wide ${style.rankColor}`}>
                      {style.label}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.iconBg}`}
                    >
                      {idx === 0 ? (
                        <Trophy className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Award className="w-4 h-4" aria-hidden="true" />
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 truncate">
                      {entry.namaAlias}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{entry.peranLabel}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between gap-2">
                    <span className="text-xs text-slate-600">
                      <strong className="font-mono text-[#1E3A8A]">Lv.{entry.level}</strong> · {gelar}
                    </span>
                    <span className="text-xl font-extrabold font-mono text-[#2563EB] tabular-nums">
                      {entry.totalPoin} <span className="text-xs font-semibold text-slate-500">pts</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Next Rank Motivation Banner */}
      <div className="surface-card rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-sm text-slate-700">
          {userRank === null ? (
            <>
              Papan peringkat menampilkan seluruh akun <strong>Pembelajar</strong> yang terdaftar di perangkat ini beserta 5 bot demo pembanding.
            </>
          ) : aboveEntry ? (
            <>
              Butuh{' '}
              <strong className="font-mono text-[#2563EB] tabular-nums">{pointsNeeded} Poin</strong>{' '}
              lagi untuk melampaui <strong>{aboveEntry.namaAlias}</strong> di peringkat #
              {userRank - 1}.
            </>
          ) : (
            <>
              Luar biasa! <strong>{currentUser.profile.namaAlias}</strong> sedang memimpin di posisi
              #1 Leaderboard Lokal.
            </>
          )}
        </div>
        <span className="text-xs text-slate-500 shrink-0">Diurutkan berdasarkan total poin</span>
      </div>

      {/* Full Leaderboard Table */}
      <div className="surface-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="px-5 py-3.5 w-20">Peringkat</th>
                <th className="px-5 py-3.5">Alias Pembelajar</th>
                <th className="px-5 py-3.5">Level &amp; Gelar</th>
                <th className="px-5 py-3.5 text-right">Materi</th>
                <th className="px-5 py-3.5 text-right">Badge</th>
                <th className="px-5 py-3.5 text-right">Total Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedList.map((entry, idx) => {
                const rank = idx + 1;
                const gelar = getLevelInfo(entry.xp).current.gelar;
                return (
                  <tr
                    key={entry.id}
                    className={
                      entry.isCurrentUser
                        ? 'bg-blue-50/75 font-semibold text-slate-900'
                        : 'hover:bg-slate-50/80 text-slate-700 transition-colors'
                    }
                  >
                    <td className="px-5 py-4 font-mono font-bold tabular-nums text-slate-900">
                      #{rank}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-slate-900 font-semibold">{entry.namaAlias}</div>
                      <div className="text-xs text-slate-500 font-normal">{entry.peranLabel}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-[#1E3A8A] tabular-nums">
                        Lv.{entry.level}
                      </span>{' '}
                      <span className="text-xs text-slate-600">· {gelar}</span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono tabular-nums">
                      {entry.materiCount}/12
                    </td>
                    <td className="px-5 py-4 text-right font-mono tabular-nums">
                      {entry.badgeCount}
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-[#2563EB] tabular-nums">
                      {entry.totalPoin}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
