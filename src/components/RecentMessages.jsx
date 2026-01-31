import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import api from '../api/axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);
  const { getToken } = useAuth();
  const { user } = useUser();
  const fetchRecentMessages = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get('/api/user/recent-messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        // Group messages by sender and get the latest message for each sender
        const groupedMessages = data.messages.reduce((acc, message) => {
          const senderId = message.from_user_id._id;
          if (
            !acc[senderId] ||
            new Date(message.createdAt) > new Date(acc[senderId].createdAt)
          ) {
            acc[senderId] = message;
          }
          return acc;
        }, {});
        const sortedMessages = Object.values(groupedMessages).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setMessages(sortedMessages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecentMessages();
      setInterval(fetchRecentMessages, 3000);
      return () => {
        clearInterval();
      };
    }
  }, []);
  return (
    <div className="bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800">
      <h3 className="font-semibold text-slate-8 mb-4">Recent Messages</h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => (
          <Link
            to={`/messages/${message.from_user_id._id}`}
            key={index}
            className="flex items-start gap-2 py-2 hover:bg-slate-100"
          >
            <img
              src={message.from_user_id.profile_picture}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <div className="flex justify-between w-full max-w-full">
              <div className="flex flex-col">
                <span className="text-xs font-medium">
                  {message.from_user_id.username}
                </span>
                <span className="text-gray-400">
                  {message.text ? message.text : 'Media'}
                </span>
              </div>
              <div className="relative">
                <div className="text-gray-400">
                  {moment(message.createdAt).fromNow()}
                </div>
                {!message.seen && (
                  <span className="bg-indigo-500 absolute -mr-2 px-1.5 mt-1 right-2 rounded-full text-white">
                    1
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;
