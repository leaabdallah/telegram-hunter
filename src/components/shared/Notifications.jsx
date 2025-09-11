import React from 'react';

const Notifications = ({ notifications }) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-4 py-2 rounded text-sm shadow-lg ${
            n.type === 'success'
              ? 'bg-green-600'
              : n.type === 'error'
              ? 'bg-red-600'
              : 'bg-gray-700'
          }`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
