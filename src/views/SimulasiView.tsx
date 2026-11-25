import { CheckCircle2, Cpu, Database, GitBranch } from 'lucide-react';
import { useState } from 'react';
import { JsLogicGateSim } from '../simulations/JsLogicGateSim';
import { PythonMazeSim } from '../simulations/PythonMazeSim';
import { SqlDetectiveSim } from '../simulations/SqlDetectiveSim';
import { SimulasiId, UserAccount } from '../types';

interface SimulasiViewProps {
  user: UserAccount;
  initialSim?: SimulasiId;
  onCompleteSimulation: (simId: SimulasiId, title: string) => void;
}

const SIM_TABS: {
  id: SimulasiId;
  label: string;
  bahasa: string;
  icon: typeof Cpu;
}[] = [
  { id: 'sim-python', label: 'Labirin Robot', bahasa: 'Python · Canvas', icon: Cpu },
  { id: 'sim-js', label: 'Gerbang Logika', bahasa: 'JavaScript · SVG', icon: GitBranch },
  { id: 'sim-sql', label: 'Detektif Data', bahasa: 'SQL · Query Builder', icon: Database },
];

export function SimulasiView({
  user,
  initialSim = 'sim-python',
  onCompleteSimulation,
}: SimulasiViewProps) {
  const { gamifikasi } = user;
  const [activeSim, setActiveSim] = useState<SimulasiId>(initialSim);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Simulasi Game Pemrograman
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            Praktikkan logika algoritma, percabangan boolean, dan penyaringan SQL langsung di browser. Selesaikan ketiga skenario untuk membuka badge Master Simulasi.
          </p>
        </div>
        <div className="text-sm text-slate-600 tabular-nums shrink-0">
          Selesai: <strong className="text-slate-900">{gamifikasi.simulasiSelesai.length} / 3</strong> skenario
        </div>
      </div>

      {/* Segmented Simulation Selector */}
      <div
        role="tablist"
        aria-label="Pilih skenario simulasi"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {SIM_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeSim === tab.id;
          const done = gamifikasi.simulasiSelesai.includes(tab.id);
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveSim(tab.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                active
                  ? 'bg-white border-[#2563EB] shadow-sm'
                  : 'bg-white/70 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      active ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{tab.label}</div>
                    <div className="text-xs text-slate-500">{tab.bahasa}</div>
                  </div>
                </div>
                {done && (
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0"
                    aria-label="Simulasi selesai"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Simulation Stage */}
      <div>
        {activeSim === 'sim-python' && (
          <PythonMazeSim
            playerLevel={gamifikasi.level}
            isCompleted={gamifikasi.simulasiSelesai.includes('sim-python')}
            onComplete={onCompleteSimulation}
          />
        )}
        {activeSim === 'sim-js' && (
          <JsLogicGateSim
            playerLevel={gamifikasi.level}
            isCompleted={gamifikasi.simulasiSelesai.includes('sim-js')}
            onComplete={onCompleteSimulation}
          />
        )}
        {activeSim === 'sim-sql' && (
          <SqlDetectiveSim
            playerLevel={gamifikasi.level}
            isCompleted={gamifikasi.simulasiSelesai.includes('sim-sql')}
            onComplete={onCompleteSimulation}
          />
        )}
      </div>
    </section>
  );
}
