import { TPeerMetadata } from '@/utils/types';
import { usePeerMetadata } from '@huddle01/react/hooks';
import { TMessage } from './ChatBox';

interface RemoteMessageBubbleProps {
  message: TMessage;
}

function RemoteMessageBubble({ message }: RemoteMessageBubbleProps) {
  const { metadata } = usePeerMetadata<TPeerMetadata>(message.sender);

  return (
    <div className="flex flex-col items-start space-y-1">
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500">{metadata?.displayName || 'Anonymous'}</span>
      </div>
      <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl rounded-tl-sm max-w-[85%]">
        {message.text}
      </div>
    </div>
  );
}

export default RemoteMessageBubble;
