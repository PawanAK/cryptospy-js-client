import { useDataMessage, useLocalPeer } from '@huddle01/react/hooks';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send, X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TMessage = {
  text: string;
  sender: string;
  timestamp: string;
};

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChatBox({ isOpen, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [text, setText] = useState<string>('');
  const [width, setWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const { peerId } = useLocalPeer();

  // Function to handle mouse move during resize
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const chatBox = chatBoxRef.current;
    if (!chatBox) return;

    const newWidth = window.innerWidth - e.clientX;
    // Set minimum and maximum width
    const clampedWidth = Math.min(Math.max(newWidth, 280), 600);
    setWidth(clampedWidth);
  };

  // Function to handle mouse up after resize
  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Function to start resizing
  const startResize = () => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Function to fetch all messages
  const fetchMessages = async () => {
    try {
      console.log('Fetching messages...');
      const response = await fetch('/api/messages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched messages:', data);
        
        // Sort messages by timestamp
        const sortedMessages = data.sort((a: TMessage, b: TMessage) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        if (JSON.stringify(sortedMessages) !== JSON.stringify(messages)) {
          console.log('Updating messages in state...');
          setMessages(sortedMessages);
        } else {
          console.log('Messages are up to date, no need to update state.');
        }
      } else {
        console.error('Failed to fetch messages:', response.status);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const { sendData } = useDataMessage({
    onMessage: async (payload, from, label) => {
      if (label === 'chat') {
        try {
          console.log(`Received message from ${from}:`, payload);
          const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              text: payload, 
              sender: 'Agent'
            }),
          });
          if (response.ok) {
            const newMessage = await response.json();
            console.log('New message saved:', newMessage);
            setMessages(prev => [...prev, newMessage]);
          } else {
            console.error('Failed to save message:', response.status);
            setMessages((prev) => [...prev, { text: payload, sender: 'Agent', timestamp: new Date().toISOString() }]);
          }
        } catch (error) {
          console.error('Failed to save message:', error);
          setMessages((prev) => [...prev, { text: payload, sender: 'Agent', timestamp: new Date().toISOString() }]);
        }
      }
      if (label === 'server-message') {
        console.log('Recording', JSON.parse(payload)?.s3URL);
      }
    },
  });

  useEffect(() => {
    console.log('Fetching messages on component mount...');
    fetchMessages();

    const intervalId = setInterval(() => {
      console.log('Fetching messages periodically...');
      fetchMessages();
    }, 2000);

    return () => {
      console.log('Clearing message fetch interval on component unmount...');
      clearInterval(intervalId);
    };
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    
    try {
      console.log(`Sending message:`, text);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          sender: 'Human'
        }),
      });
      if (response.ok) {
        const newMessage = await response.json();
        console.log('New message saved:', newMessage);
        setMessages(prev => [...prev, newMessage]);
      } else {
        console.error('Failed to send message:', response.status);
      }
      
      sendData({
        to: '*',
        payload: text,
        label: 'chat',
      });
      
      setText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div 
      ref={chatBoxRef}
      className={cn(
        'fixed right-0 top-0 bottom-0 shadow-lg transition-transform duration-300 transform border-l border-gray-700 flex flex-col bg-gray-800',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
      style={{ width: `${width}px` }}
    >
      {/* Resize handle */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500 group"
        onMouseDown={startResize}
      >
        <div className="absolute left-[-12px] top-1/2 transform -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100">
          <GripVertical className="w-4 h-4 text-blue-500" />
        </div>
      </div>

      <div className='flex items-center justify-between p-4 border-b border-gray-700'>
        <h1 className='text-lg font-medium text-gray-100'>Real time Transcription</h1>
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
            <p className="text-xs mt-1">Send a message to start chatting</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender.toLowerCase() === 'human' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                message.sender.toLowerCase() === 'human'
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-gray-700 text-gray-100 rounded-tl-sm'
              }`}>
                <p className="text-sm">{message.text}</p>
                {message.timestamp && (
                  <div className={`text-xs mt-1 ${
                    message.sender.toLowerCase() === 'human' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))
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