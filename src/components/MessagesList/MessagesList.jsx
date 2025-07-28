import { Trash2, User } from "lucide-react";

const MessagesList = ({ messages, onDelete }) => {
  if (!messages?.length)
    return <div className="text-white text-center mt-8">No messages found.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Messages</h2>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-gray-100 rounded-lg p-4 shadow-md text-gray-800 relative"
          >
            <button
              onClick={() => onDelete(message.id)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-600"
              aria-label="Delete message"
            >
              <Trash2 size={18} />
            </button>
            <div className="flex items-center gap-3 mb-2 pr-8">
              <User size={20} className="text-gray-500" />
              <div className="flex flex-wrap gap-x-2">
                <h6 className="font-semibold text-base text-gray-900">
                  {message.name || "No Name"}
                </h6>
                {message.email && (
                  <span className="text-sm text-gray-600">&lt;{message.email}&gt;</span>
                )}
                {message.phone && <span className="text-sm text-gray-600">+{message.phone}</span>}
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap break-words text-gray-700 pl-8">
              {message.message || "No message content."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesList;
