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
import { Dock, DockIcon } from '@/components/ui/dock';

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

  const toggleVideo = async () => {
    isVideoOn ? await disableVideo() : await enableVideo();
  };

  const toggleAudio = async () => {
    isAudioOn ? await disableAudio() : await enableAudio();
  };

  const toggleScreenShare = async () => {
    shareStream ? await stopScreenShare() : await startScreenShare();
  };

  const leaveRoom = () => {
    window.location.href = '/';
  };

  if (state === 'idle') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1117]">
        <div className="w-full max-w-md space-y-6 p-8 bg-[#1A1C23] rounded-2xl shadow-lg">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-100">Welcome to Huddle</h2>
            <p className="text-gray-400">Enter your name to join the meeting</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium text-gray-300">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-[#2A2D35] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
              onClick={async () => {
                const token = await getToken();
                joinRoom({ roomId: params.roomId, token });
              }}
              disabled={!displayName.trim()}
            >
              Join Meeting
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium">{displayName}</span>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-400 hover:text-gray-300 border-gray-700 hover:bg-gray-800"
            onClick={copyMeetingLink}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy meeting link
          </Button>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="bg-red-500 hover:bg-red-600"
          onClick={() => window.location.href = '/'}
        >
          Leave
        </Button>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Local Video */}
          <div className="relative aspect-video bg-[#1A1C23] rounded-xl overflow-hidden">
            {stream && (
              <Video
                stream={stream}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="bg-black/50 px-3 py-1 rounded-lg text-sm">
                You
              </span>
            </div>
          </div>

          {/* Remote Peers */}
          {peerIds.map((peerId) => (
            <RemotePeer key={peerId} peerId={peerId} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <Dock className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1A1C23] border border-gray-800 rounded-xl shadow-lg">
        <DockIcon
          onClick={() => isAudioOn ? disableAudio() : enableAudio()}
          className={isAudioOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"}
        >
          {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </DockIcon>
        <DockIcon
          onClick={() => isVideoOn ? disableVideo() : enableVideo()}
          className={isVideoOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"}
        >
          {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </DockIcon>
        <DockIcon
          onClick={() => shareStream ? stopScreenShare() : startScreenShare()}
          className="bg-gray-700 hover:bg-gray-600"
        >
          <MonitorUp className="w-5 h-5" />
        </DockIcon>
        <DockIcon
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`bg-gray-700 hover:bg-gray-600 ${isChatOpen ? 'text-blue-500' : ''}`}
        >
          <MessageCircle className="w-5 h-5" />
        </DockIcon>
        <DockIcon
          onClick={() => window.location.href = '/'}
          className="bg-red-500 hover:bg-red-600"
        >
          <PhoneOff className="w-5 h-5" />
        </DockIcon>
      </Dock>

      {/* Chat */}
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
