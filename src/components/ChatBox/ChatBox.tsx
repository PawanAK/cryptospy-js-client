import { useDataMessage, useLocalPeer } from '@huddle01/react/hooks';
import { useState, useEffect, useRef, useCallback } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { peerId } = useLocalPeer();

  // Improved resize handling with error prevention
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    // Prevent potential errors if refs are not set
    if (!chatBoxRef.current) return;

    try {
      // Calculate new width based on the mouse position
      const newWidth = Math.max(280, Math.min(600, window.innerWidth - e.clientX));
      setWidth(newWidth);
    } catch (error) {
      console.error('Error during resize:', error);
      setIsResizing(false);
    }
  }, [isResizing]);

  // Memoized cleanup function to ensure proper event listener removal
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  // Start resize with improved event handling
  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection during drag
    setIsResizing(true);
    
    // Add listeners to document to handle resize anywhere
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Function to fetch all messages with improved error handling
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/messages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Sort and update messages if needed
      const sortedMessages = data.sort((a: TMessage, b: TMessage) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      setMessages(prevMessages => {
        // Only update if messages are different
        return JSON.stringify(prevMessages) !== JSON.stringify(sortedMessages) 
          ? sortedMessages 
          : prevMessages;
      });

      // Scroll to bottom after messages update
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [scrollToBottom]);

  const { sendData } = useDataMessage({
    onMessage: async (payload, from, label) => {
      if (label === 'chat') {
        try {
          const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              text: payload, 
              sender: 'Agent',
              timestamp: new Date().toISOString()
            }),
          });

          const newMessage = response.ok 
            ? await response.json() 
            : { text: payload, sender: 'Agent', timestamp: new Date().toISOString() };

          setMessages(prev => [...prev, newMessage]);
          scrollToBottom();
        } catch (error) {
          console.error('Failed to process incoming message:', error);
        }
      }
    },
  });

  // Periodic message fetching with cleanup
  useEffect(() => {
    fetchMessages();

    const intervalId = setInterval(fetchMessages, 2000);

    return () => {
      clearInterval(intervalId);
      // Remove any lingering event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [fetchMessages, handleMouseMove, handleMouseUp]);

  // Send message function with improved error handling
  const sendMessage = async () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: trimmedText, 
          sender: 'Human',
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      }
      
      sendData({
        to: '*',
        payload: trimmedText,
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
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/20 group"
        onMouseDown={startResize}
      >
        <div className="absolute left-[-12px] top-1/2 transform -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100">
          <GripVertical className="w-4 h-4 text-blue-500" />
        </div>
      </div>

      {/* Header */}
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

      {/* Messages Container */}
      <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Send a message to start chatting</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender.toLowerCase() === 'human' ? 'justify-end' : 'justify-start'}`}
            >
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
        {/* Ref to scroll to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
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