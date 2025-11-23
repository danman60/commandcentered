'use client';

import { Sidebar } from '@/components/Sidebar'
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav'
import { CornerFrames } from '@/components/ui/CornerFrames'
import { MicrophoneFAB } from '@/components/voice/MicrophoneFAB'
import { useIsMobile } from '@/hooks/useMediaQuery'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile();

  const handleTranscription = (text: string) => {
    console.log('[Voice] Transcription:', text);
    // TODO: Connect to voice command router
  };

  const handleCommand = (command: any) => {
    console.log('[Voice] Command:', command);
    // TODO: Execute command via tRPC
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Tactical Corner Frames - only on desktop */}
      {!isMobile && <CornerFrames />}

      {/* Desktop Sidebar - hidden on mobile */}
      {!isMobile && <Sidebar />}

      {/* Main Content - with bottom padding on mobile for nav */}
      <main className={`flex-1 overflow-y-auto ${isMobile ? 'pb-20' : ''}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation - only on mobile */}
      {isMobile && <MobileBottomNav />}

      {/* AI Voice Agent FAB - always visible */}
      <MicrophoneFAB
        onTranscription={handleTranscription}
        onCommand={handleCommand}
        className={isMobile ? 'bottom-24' : ''} // Move up on mobile to avoid bottom nav
      />
    </div>
  )
}
