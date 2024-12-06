import { TPeerMetadata } from '@/utils/types';
import { useRemotePeer } from '@huddle01/react/hooks';
import { TMessage } from './ChatBox';

interface Props {
  message: TMessage;
}

function RemoteMessageBubble({ message }: Props) {
  const { metadata } = useRemotePeer<TPeerMetadata>({ peerId: message.sender });

  return (
    <div className='w-full flex flex-col items-start'>
      <div className='max-w-[80%] bg-zinc-700/80 px-4 py-2 rounded-2xl rounded-tl-sm'>
        <div className='text-blue-400 text-xs mb-1'>{metadata?.displayName}</div>
        <span className='text-white text-sm'>{message.text}</span>
      </div>
    </div>
  );
}

export default RemoteMessageBubble;
