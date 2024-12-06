'use client';

import ChatBox from '@/components/ChatBox/ChatBox';
import RemotePeer from '@/components/RemotePeer';
import { TPeerMetadata } from '@/utils/types';
import { Video } from '@huddle01/react/components';
import {
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
} from '@huddle01/react/hooks';
import { Inter } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
import { Copy, Mic, MicOff, Video as VideoIcon, VideoOff, MonitorUp, PhoneOff, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const inter = Inter({ subsets: ['latin'] });

export default function Home({ params }: { params: { roomId: string } }) {
  const [displayName, setDisplayName] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { joinRoom, state } = useRoom({
    onJoin: (room) => {
      console.log('onJoin', room);
      updateMetadata({ displayName });
    },
    onPeerJoin: (peer) => {
      console.log('onPeerJoin', peer);
    },
  });
  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare();
  const { updateMetadata } = useLocalPeer<TPeerMetadata>();
  const { peerIds } = usePeerIds();

  const getToken = async () => {
    const tokenResponse = await fetch(`token?roomId=${params.roomId}`);
    const token = await tokenResponse.text();
    return token;
  };

  const copyMeetingLink = async () => {
    const meetingLink = window.location.href;
    await navigator.clipboard.writeText(meetingLink);
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
  };

  return (
    <main className={`min-h-screen bg-white ${inter.className}`}>
      {/* Header Section */}
      <div className='w-full border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='text-lg font-medium text-gray-900'>{state === 'connected' ? displayName : 'Join Meeting'}</div>
            {state === 'connected' && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                onClick={copyMeetingLink}
              >
                <Copy className="w-4 h-4" />
                <span>Copy meeting link</span>
              </Button>
            )}
            {showCopiedToast && (
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg">
                Meeting link copied!
              </div>
            )}
          </div>
          {state === 'connected' && (
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => window.location.href = '/'}
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto p-4'>
        {state === 'idle' ? (
          <div className="max-w-md mx-auto mt-16 p-8 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Huddle</h2>
              <p className="text-gray-500">Enter your name to join the meeting</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display Name</label>
                <input
                  id="displayName"
                  disabled={state !== 'idle'}
                  placeholder='Enter your name'
                  type='text'
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors placeholder:text-gray-400'
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                />
              </div>
              <Button
                disabled={!displayName}
                className="w-full py-6 text-lg font-medium shadow-lg shadow-blue-500/20 transition-transform hover:scale-[1.02]"
                onClick={async () => {
                  const token = await getToken();
                  await joinRoom({
                    roomId: params.roomId as string,
                    token,
                  });
                }}
              >
                Join Meeting
              </Button>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
            {/* Video Section */}
            <div className='lg:col-span-4 space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {stream && (
                  <div className='relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50'>
                    <Video stream={stream} className='absolute inset-0 w-full h-full object-cover' />
                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-sm">
                      You
                    </div>
                  </div>
                )}
                {shareStream && (
                  <div className='relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50'>
                    <Video stream={shareStream} className='absolute inset-0 w-full h-full object-cover' />
                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-sm">
                      Your Screen
                    </div>
                  </div>
                )}
              </div>

              {/* Peers Grid */}
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {peerIds.map((peerId) =>
                  peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
                )}
              </div>

              {/* Controls */}
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white p-4 rounded-full shadow-lg">
                <Button
                  variant={isAudioOn ? "outline" : "destructive"}
                  size="icon"
                  className="rounded-full"
                  onClick={async () => {
                    isAudioOn ? await disableAudio() : await enableAudio();
                  }}
                >
                  {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>
                <Button
                  variant={isVideoOn ? "outline" : "destructive"}
                  size="icon"
                  className="rounded-full"
                  onClick={async () => {
                    isVideoOn ? await disableVideo() : await enableVideo();
                  }}
                >
                  {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
                <Button
                  variant={shareStream ? "destructive" : "outline"}
                  size="icon"
                  className="rounded-full"
                  onClick={async () => {
                    shareStream ? await stopScreenShare() : await startScreenShare();
                  }}
                >
                  <MonitorUp className="w-5 h-5" />
                </Button>
                <Button
                  variant={isChatOpen ? "destructive" : "outline"}
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsChatOpen(!isChatOpen)}
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Chat Section */}
            {state === 'connected' && (
              <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
