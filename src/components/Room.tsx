'use client';

import ChatBox from '@/components/ChatBox/ChatBox';
import RemotePeer from '@/components/RemotePeer';
import { TPeerMetadata } from '@/utils/types';
import {
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
} from '@huddle01/react/hooks';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, 
  MessageCircle, Users, MoreVertical, Record
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type Props = {
  token: string;
};

export default function Room({ token }: Props) {
  const [displayName, setDisplayName] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [isRecording, setIsRecording] = useState<boolean>(false);

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
  const { startScreenShare, stopScreenShare, shareStream } = useLocalScreenShare();
  const { updateMetadata } = useLocalPeer<TPeerMetadata>();
  const { peerIds } = usePeerIds();

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (shareStream && screenRef.current) {
      screenRef.current.srcObject = shareStream;
    }
  }, [shareStream]);

  if (state === 'idle') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-100">
        <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-100">Join Meeting</h2>
            <p className="mt-2 text-gray-300">Enter your display name to continue</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Display Name"
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Button
              disabled={!displayName}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
              onClick={() => joinRoom({
                roomId: router.query.roomId as string,
                token,
              })}
            >
              Join Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium">Huddle Meeting</span>
          <span className="bg-green-600 text-xs px-2 py-1 rounded-full">Live</span>
        </div>
        <div className="flex items-center space-x-2">
          {isRecording && (
            <div className="flex items-center space-x-2 bg-red-500/10 text-red-500 px-3 py-1 rounded-full">
              <Record className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Recording</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-gray-100 hover:bg-gray-800"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-gray-100 hover:bg-gray-800"
          >
            <Users className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-gray-100 hover:bg-gray-800"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Local Video */}
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden group">
            {stream && (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="bg-black/50 px-3 py-1 rounded-lg text-white text-sm">
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
      <div className="flex items-center justify-center space-x-4 p-4 bg-gray-800 border-t border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full w-12 h-12",
            isAudioOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"
          )}
          onClick={() => (isAudioOn ? disableAudio() : enableAudio())}
        >
          {isAudioOn ? (
            <Mic className="w-5 h-5" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full w-12 h-12",
            isVideoOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"
          )}
          onClick={() => (isVideoOn ? disableVideo() : enableVideo())}
        >
          {isVideoOn ? (
            <Video className="w-5 h-5" />
          ) : (
            <VideoOff className="w-5 h-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600"
          onClick={() => {
            if (shareStream) {
              stopScreenShare();
            } else {
              startScreenShare();
            }
          }}
        >
          <Monitor className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-12 h-12 bg-red-500 hover:bg-red-600"
          onClick={() => router.push('/')}
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>

      {/* Chat */}
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}