import React, { useState } from 'react';
import { useTelegramStore } from '@/lib/store';

export const TelegramIntegration: React.FC = () => {
  const [telegramId, setTelegramId] = useState('');
  const { 
    isLinked, 
    telegramId: linkedId, 
    isLoading, 
    error, 
    linkTelegramAccount, 
    unlinkTelegramAccount, 
    sendTestMessage, 
    clearError 
  } = useTelegramStore();
  
  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramId) return;
    
    await linkTelegramAccount(telegramId);
    setTelegramId('');
  };
  
  const handleUnlink = async () => {
    await unlinkTelegramAccount();
  };
  
  const handleTestMessage = async () => {
    await sendTestMessage();
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Telegram Integration
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
            {error}
            <button 
              className="ml-2 text-sm underline" 
              onClick={clearError}
            >
              Dismiss
            </button>
          </div>
        )}
        
        {isLinked ? (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <h3 className="text-green-800 font-medium mb-2">
                Your Telegram account is linked
              </h3>
              <p className="text-green-700 text-sm">
                Your Telegram ID: <span className="font-mono">{linkedId}</span>
              </p>
              <p className="text-green-700 text-sm mt-2">
                You will receive notifications about task status changes and new briefs.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleTestMessage}
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Send Test Message
              </button>
              
              <button
                onClick={handleUnlink}
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isLoading
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Unlink Telegram
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Link your Telegram account to receive notifications about task status changes and new briefs.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <h3 className="text-blue-800 font-medium mb-2">
                How to get your Telegram ID:
              </h3>
              <ol className="list-decimal list-inside text-blue-700 text-sm space-y-1">
                <li>Open Telegram and search for "@userinfobot"</li>
                <li>Start a chat with this bot</li>
                <li>The bot will reply with your Telegram ID</li>
                <li>Copy your ID and paste it below</li>
              </ol>
            </div>
            
            <form onSubmit={handleLink} className="mt-4">
              <div className="flex">
                <input
                  type="text"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="Enter your Telegram ID"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading || !telegramId}
                  className={`px-4 py-2 rounded-r-md text-white font-medium ${
                    isLoading || !telegramId
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Linking...' : 'Link Account'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
