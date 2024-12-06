import { TPeerMetadata } from '@/utils/types';
import { useLocalPeer } from '@huddle01/react/hooks';
import { TMessage } from './ChatBox';

interface Props {
  message: TMessage;
}

function LocalMessageBubble({ message }: Props) {
  const { metadata } = useLocalPeer<TPeerMetadata>();

  return (
    <div className='w-full flex flex-col items-end'>
      <div className='max-w-[80%] bg-blue-600 px-4 py-2 rounded-2xl rounded-tr-sm'>
        <span className='text-white text-sm'>{message.text}</span>
      </div>
    </div>
  );
}

export default LocalMessageBubble;
