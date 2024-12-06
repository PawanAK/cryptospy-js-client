'use client';

import { createRoom } from '@/components/createRoom';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LandingPage } from '@/components/LandingPage';

export default function Home() {
  const router = useRouter();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const handleCreateRoom = async () => {
    console.log('[Home] Creating room...');
    if (isCreatingRoom) {
      console.log('[Home] Already creating room, skipping...');
      return;
    }
    
    setIsCreatingRoom(true);
    try {
      console.log('[Home] Creating room...');
      const roomId = await createRoom();
      console.log('[Home] Created room:', roomId);
      router.push(`/${roomId}`);
      console.log('[Home] Navigating to new room...');
    } catch (error) {
      console.error('[Home] Failed to create room:', error);
      setIsCreatingRoom(false);
    }
  };

  return <LandingPage onCreateRoom={handleCreateRoom} />;
}
