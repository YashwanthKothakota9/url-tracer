import { useEffect, useState } from 'react';
import { sendMessage, onMessage } from 'webext-bridge/popup';

function formatDuration(milliseconds) {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600; // Remainder after dividing by 3600
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60; // Remainder after dividing by 60

  return `${hours} H ${minutes} Min ${seconds} s`;
}

// Example usage:

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export default function Popup() {
  const handleMessage = (message) => {
    console.log('Inside hanldeMessage');
    if (message.data.updated) {
      sendShortLivedMessageToBackground();
    }
  };
  onMessage('statsUpdated', handleMessage);

  const [messageResponse, setMessageResponse] = useState({});

  const sendShortLivedMessageToBackground = async () => {
    console.log('Inside Popup:');
    try {
      const response = await sendMessage(
        'RETURN_STATS',
        {
          from: 'Popup',
        },
        'background'
      );
      console.log('Response POPUP:', response);

      setMessageResponse((prevState) => ({
        ...prevState,
        ...response.message,
      }));
    } catch (error) {
      console.error('Error sending message to background:', error);
    }
  };

  useEffect(() => {
    sendShortLivedMessageToBackground();
    const intervalId = setInterval(() => {
      sendShortLivedMessageToBackground();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-slate-100 text-black w-[400px] h-[600px] flex flex-col p-5 gap-2">
      {/* <button
        onClick={refresh}
        className="w-full bg-gray-400 px-4 py-2 rounded-md hover:bg-gray-600"
      >
        Refresh
      </button> */}
      <h1 className="text-2xl">Your Usage Stats</h1>
      <ul className="w-full space-y-1 overflow-auto">
        {isEmptyObject(messageResponse) ? (
          <li className="text-xl">Loading...</li>
        ) : (
          Object.entries(messageResponse).map(([key, value]) => (
            <li key={key} className="text-xl border-b">
              {/* {key}: {millisecondsToMinutes(value)} */}
              <div className="w-full flex items-center justify-around gap-1">
                {value.favicon && (
                  <img
                    src={value.favicon}
                    alt="Favicon"
                    className="w-10 h-10 object-cover rounded-full p-1 bg-gray-700 border border-gray-100"
                  />
                )}
                <p className="capitalize">{key}</p>
                <p className="text-blue-500 text-xl">
                  {`${formatDuration(value.timeSpent)}`}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
