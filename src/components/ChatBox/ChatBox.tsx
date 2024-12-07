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
      'fixed right-0 top-0 bottom-0 w-[320px] bg-gray-800 shadow-lg transition-transform duration-300 transform border-l border-gray-700 flex flex-col',
      isOpen ? 'translate-x-0' : 'translate-x-full'
    )}>
      <div className='flex items-center justify-between p-4 border-b border-gray-700'>
        <h1 className='text-lg font-medium text-gray-100'>In-call messages</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-100 hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
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

      <div className='p-4 border-t border-gray-700'>
        <div className='flex space-x-2'>
          <input
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder='Type a message...'
            className='flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <Button
            onClick={sendMessage}
            className='bg-blue-600 hover:bg-blue-700 text-white'
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
