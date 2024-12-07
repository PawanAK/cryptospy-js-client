import { TMessage } from './ChatBox';

export default function RemoteMessageBubble({ message }: { message: TMessage }) {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-700 text-gray-100 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
        <div className="text-xs text-gray-400 mb-1">{message.sender}</div>
        <p className="text-sm">{message.text}</p>
        {message.timestamp && (
          <div className="text-xs text-gray-400 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
