import { useDataMessage, useLocalPeer } from '@huddle01/react/hooks';
import { useState } from 'react';
import LocalMessageBubble from './LocalMessageBubble';
import RemoteMessageBubble from './RemoteMessageBubble';
import { Button } from '@/components/ui/button';
import { Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TMessage = {
  text: string;
  sender: string;
};

type ChatBoxProps = {
  isOpen: boolean;
  onClose: () => void;
};

function ChatBox({ isOpen, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [text, setText] = useState<string>('');

  const { peerId } = useLocalPeer();
  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === 'chat') {
        setMessages((prev) => [...prev, { text: payload, sender: from }]);
      }
      if (label === 'server-message') {
        console.log('Recording', JSON.parse(payload)?.s3URL);
      }
    },
  });

  const sendMessage = () => {
    if (!text.trim()) return;
    sendData({
      to: '*',
      payload: text,
      label: 'chat',
    });
    setText('');
  };

  return (
    <div className={cn(
      'fixed right-0 top-0 bottom-0 w-[320px] bg-white shadow-lg transition-transform duration-300 transform border-l border-gray-200 flex flex-col',
      isOpen ? 'translate-x-0' : 'translate-x-full'
    )}>
      <div className='flex items-center justify-between p-4 border-b border-gray-200'>
        <h1 className='text-lg font-medium text-gray-900'>In-call messages</h1>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      <div className='flex-1 p-4 overflow-y-auto space-y-4'>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Send a message to the room</p>
          </div>
        ) : (
          messages.map((message, index) =>
            message.sender === peerId ? (
              <LocalMessageBubble key={index} message={message} />
            ) : (
              <RemoteMessageBubble key={index} message={message} />
            )
          )
        )}
      </div>
      <div className='p-4 border-t border-gray-200'>
        <div className='flex items-center space-x-2'>
          <input
            type='text'
            className='flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-gray-400'
            placeholder='Send a message to everyone'
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            size="icon"
            className="rounded-full flex-shrink-0"
            onClick={sendMessage}
            disabled={!text.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
