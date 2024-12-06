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
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Join Meeting</h2>
            <p className="mt-2 text-gray-600">Enter your display name to continue</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Display Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className={cn(
          "flex-1 p-4 grid gap-4 transition-all duration-300",
          isChatOpen ? "mr-[320px]" : ""
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {/* Local Video */}
            {isVideoOn && (
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                />
                <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-sm">
                  You
                </div>
              </div>
            )}
            
            {/* Screen Share */}
            {shareStream && (
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={screenRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                />
                <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-sm">
                  Your Screen
                </div>
              </div>
            )}

            {/* Remote Peers */}
            {peerIds.map((peerId) =>
              peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className={cn(
          "fixed right-0 top-0 bottom-0 w-[320px] bg-white shadow-lg transition-transform duration-300 transform",
          isChatOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <ChatBox />
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-20 bg-white border-t flex items-center justify-between px-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{displayName}</span>
          <span>•</span>
          <span>{router.query.roomId}</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Audio Control */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12",
              !isAudioOn && "bg-red-100 text-red-600 hover:bg-red-200"
            )}
            onClick={() => isAudioOn ? disableAudio() : enableAudio()}
          >
            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          {/* Video Control */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12",
              !isVideoOn && "bg-red-100 text-red-600 hover:bg-red-200"
            )}
            onClick={() => isVideoOn ? disableVideo() : enableVideo()}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          {/* Screen Share */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12",
              shareStream && "bg-blue-100 text-blue-600 hover:bg-blue-200"
            )}
            onClick={() => shareStream ? stopScreenShare() : startScreenShare()}
          >
            <Monitor className="w-5 h-5" />
          </Button>

          {/* Recording */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12",
              isRecording && "bg-red-100 text-red-600 hover:bg-red-200"
            )}
            onClick={async () => {
              const status = isRecording
                ? await fetch(`/api/stopRecording?roomId=${router.query.roomId}`)
                : await fetch(`/api/startRecording?roomId=${router.query.roomId}`);
              const data = await status.json();
              console.log({ data });
              setIsRecording(!isRecording);
            }}
          >
            <Record className="w-5 h-5" />
          </Button>

          {/* Leave Call */}
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700"
            onClick={() => router.push('/')}
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Chat Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12",
              isChatOpen && "bg-gray-100"
            )}
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>

          {/* Participants */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-12 h-12"
          >
            <Users className="w-5 h-5" />
          </Button>

          {/* More Options */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-12 h-12"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}