import { TPeerMetadata } from '@/utils/types';
import { useLocalPeer } from '@huddle01/react/hooks';
import { TMessage } from './ChatBox';

interface LocalMessageBubbleProps {
  message: TMessage;
}

export default function LocalMessageBubble({ message }: { message: TMessage }) {
  const { metadata } = useLocalPeer<TPeerMetadata>();

  return (
    <div className="flex justify-end">
      <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
        <p className="text-sm">{message.text}</p>
        {message.timestamp && (
          <div className="text-xs text-blue-200 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
