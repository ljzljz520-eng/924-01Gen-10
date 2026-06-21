import { CreatorSidebar } from '@/components/CreatorSidebar';
import { CharactersPanel } from '@/components/panels/CharactersPanel';
import { ScenesPanel } from '@/components/panels/ScenesPanel';
import { ItemsPanel } from '@/components/panels/ItemsPanel';
import { TimelinePanel } from '@/components/panels/TimelinePanel';
import { CluesPanel } from '@/components/panels/CluesPanel';
import { ExportPanel } from '@/components/panels/ExportPanel';
import { useAppStore } from '@/store';

export function CreatorMode() {
  const activeTab = useAppStore((s) => s.creatorActiveTab);

  const renderPanel = () => {
    switch (activeTab) {
      case 'characters':
        return <CharactersPanel />;
      case 'scenes':
        return <ScenesPanel />;
      case 'items':
        return <ItemsPanel />;
      case 'timeline':
        return <TimelinePanel />;
      case 'clues':
        return <CluesPanel />;
      case 'export':
        return <ExportPanel />;
      default:
        return <CharactersPanel />;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <CreatorSidebar />
      <main className="flex-1 overflow-hidden bg-gradient-to-br from-parchment-50 via-parchment-100 to-parchment-50">
        <div className="h-full overflow-y-auto p-8 animate-parchment-unroll">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
}
