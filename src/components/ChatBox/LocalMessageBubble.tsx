import { TPeerMetadata } from '@/utils/types';
import { useLocalPeer } from '@huddle01/react/hooks';
import { TMessage } from './ChatBox';

interface LocalMessageBubbleProps {
  message: TMessage;
}

function LocalMessageBubble({ message }: LocalMessageBubbleProps) {
  const { metadata } = useLocalPeer<TPeerMetadata>();

  return (
    <div className="flex flex-col items-end space-y-1">
      <div className="flex items-center justify-end space-x-2">
        <span className="text-xs text-gray-500">You</span>
      </div>
      <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[85%]">
        {message.text}
      </div>
    </div>
  );
}

export default LocalMessageBubble;
