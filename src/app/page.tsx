'use client';

import { createRoom } from '@/components/createRoom';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LandingPage } from '@/components/LandingPage';

export default function Home() {
  const router = useRouter();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const handleCreateRoom = async () => {
    if (isCreatingRoom) return;
    
    setIsCreatingRoom(true);
    try {
      const roomId = await createRoom();
      router.push(`/${roomId}`);
    } catch (error) {
      console.error('Failed to create room:', error);
      setIsCreatingRoom(false);
    }
  };

  return <LandingPage onCreateRoom={handleCreateRoom} />;
}

