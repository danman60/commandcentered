'use client';

import { Sidebar } from '@/components/Sidebar'
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav'
import { CornerFrames } from '@/components/ui/CornerFrames'
import { MicrophoneFAB } from '@/components/voice/MicrophoneFAB'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { trpc } from '@/lib/trpc/client'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile();

  const createVoiceCommand = trpc.voiceCommand.create.useMutation();
  const executeVoiceCommand = trpc.voiceCommand.execute.useMutation();

  const handleTranscription = async (text: string) => {
    console.log('[Voice] Transcription:', text);

    try {
      // Create voice command from transcription
      const command = await createVoiceCommand.mutateAsync({
        transcription: text,
      });

      console.log('[Voice] Command created:', command);

      // If command doesn't require confirmation, execute immediately
      if (command.status === 'CONFIRMED') {
        await handleCommand(command.id);
      }
    } catch (error) {
      console.error('[Voice] Error creating command:', error);
    }
  };

  const handleCommand = async (commandId: string) => {
    console.log('[Voice] Executing command:', commandId);

    try {
      // Execute voice command via tRPC
      const result = await executeVoiceCommand.mutateAsync({
        id: commandId,
      });

      console.log('[Voice] Command executed:', result);
    } catch (error) {
      console.error('[Voice] Error executing command:', error);
    }
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
