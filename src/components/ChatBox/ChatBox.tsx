import { useDataMessage, useLocalPeer } from '@huddle01/react/hooks';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to normalize sender names
  const normalizeSender = (sender: string): string => {
    return sender.toLowerCase() === 'human' ? 'human' : 'agent';
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
        // Normalize the sender names in the messages
        const normalizedMessages = data.map((msg: TMessage) => ({
          ...msg,
          sender: normalizeSender(msg.sender)
        }));
        console.log('Fetched messages:', normalizedMessages);
        setMessages(normalizedMessages);
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
              sender: 'agent'
            }),
          });
          if (response.ok) {
            const newMessage = await response.json();
            newMessage.sender = normalizeSender(newMessage.sender);
            setMessages(prev => [...prev, newMessage]);
          }
        } catch (error) {
          console.error('Failed to save message:', error);
          setMessages((prev) => [...prev, { 
            text: payload, 
            sender: 'agent',
            timestamp: new Date().toISOString()
          }]);
        }
      }
    },
  });

  useEffect(() => {
    fetchMessages();
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
          sender: 'human'
        }),
      });
      if (response.ok) {
        const newMessage = await response.json();
        newMessage.sender = normalizeSender(newMessage.sender);
        setMessages(prev => [...prev, newMessage]);
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
    <PanelGroup direction="horizontal">
      <Panel 
        defaultSize={25}
        minSize={20}
        maxSize={40}
        onResize={(size) => setWidth(size * window.innerWidth / 100)}
        className={cn(
          'fixed right-0 top-0 bottom-0 bg-gray-800 shadow-lg transition-transform duration-300 transform border-l border-gray-700 flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className='flex items-center justify-between p-4 border-b border-gray-700'>
          <h1 className='text-lg font-medium text-gray-100'>Chat Messages</h1>
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
              <div key={index} className={`flex ${message.sender === 'human' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                  message.sender === 'human' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-gray-700 text-gray-100 rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  {message.timestamp && (
                    <div className={`text-xs mt-1 ${
                      message.sender === 'human' ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
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
      </Panel>
    </PanelGroup>
  );
}

export default ChatBox;