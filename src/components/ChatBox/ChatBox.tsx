import { useDataMessage, useLocalPeer } from '@huddle01/react/hooks';
import { useState } from 'react';
import LocalMessageBubble from './LocalMessageBubble';
import RemoteMessageBubble from './RemoteMessageBubble';

export type TMessage = {
  text: string;
  sender: string;
};

function ChatBox() {
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
    sendData({
      to: '*',
      payload: text,
      label: 'chat',
    });
    setText('');
  };

  return (
    <div className='h-[600px] border border-zinc-700 bg-zinc-800/30 rounded-xl flex flex-col'>
      <h1 className='text-center text-xl font-medium py-4 border-b border-zinc-700'>
        Chat Room
      </h1>
      <div className='flex-1 p-4 overflow-y-auto space-y-4'>
        {messages.map((message, index) =>
          message.sender === peerId ? (
            <LocalMessageBubble key={index} message={message} />
          ) : (
            <RemoteMessageBubble key={index} message={message} />
          )
        )}
      </div>
      <div className='flex p-3 border-t border-zinc-700'>
        <input
          type='text'
          className='flex-1 px-4 py-2 rounded-lg bg-zinc-700/50 border border-zinc-600 focus:border-blue-500 focus:outline-none text-white'
          placeholder='Type Message...'
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button
          onClick={() => {
            sendMessage();
          }}
          className='ml-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors'
        >
          <svg
            width='24'
            height='24'
            viewBox='-2.4 -2.4 28.80 28.80'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            stroke='#000000'
            strokeWidth='0.00024000000000000003'
          >
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></g>
            <g id='SVGRepo_iconCarrier'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M1.265 4.42619C1.04293 2.87167 2.6169 1.67931 4.05323 2.31397L21.8341 10.1706C23.423 10.8727 23.423 13.1273 21.8341 13.8294L4.05323 21.686C2.6169 22.3207 1.04293 21.1283 1.265 19.5738L1.99102 14.4917C2.06002 14.0087 2.41458 13.6156 2.88791 13.4972L8.87688 12L2.88791 10.5028C2.41458 10.3844 2.06002 9.99129 1.99102 9.50829L1.265 4.42619ZM21.0257 12L3.2449 4.14335L3.89484 8.69294L12.8545 10.9328C13.9654 11.2106 13.9654 12.7894 12.8545 13.0672L3.89484 15.3071L3.2449 19.8566L21.0257 12Z'
                fill='#ffffff'
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
