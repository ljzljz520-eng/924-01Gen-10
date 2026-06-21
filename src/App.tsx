import { ModeSwitcher } from '@/components/ModeSwitcher';
import { CreatorMode } from '@/components/CreatorMode';
import { HostMode } from '@/components/HostMode';
import { useAppStore } from '@/store';

export default function App() {
  const currentMode = useAppStore((s) => s.currentMode);

  return (
    <div className="h-screen flex flex-col bg-ink-700 text-ink-900 overflow-hidden">
      <ModeSwitcher />
      {currentMode === 'creator' ? <CreatorMode /> : <HostMode />}
    </div>
  );
}
