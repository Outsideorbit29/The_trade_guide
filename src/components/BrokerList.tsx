import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, LinkIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../utils/formatters';

interface Broker {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface BrokerListProps {
  brokers: Broker[];
  onConnectBroker: (brokerType: string) => void;
}

const popularBrokers = [
  { name: 'MetaTrader 5', icon: '📈', description: 'Popular forex trading platform' },
  { name: 'Zerodha Kite', icon: '🔷', description: 'Leading Indian stock broker' },
  { name: 'Binance', icon: '🟡', description: 'World\'s largest crypto exchange' },
  { name: 'Interactive Brokers', icon: '🏦', description: 'Professional trading platform' },
];

export default function BrokerList({ brokers, onConnectBroker }: BrokerListProps) {
  if (brokers.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-400 text-lg mb-2">No brokers connected</p>
          <p className="text-gray-500 text-sm">Connect your first broker to start trading</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Popular Brokers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularBrokers.map((broker) => (
              <motion.button
                key={broker.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onConnectBroker(broker.name)}
                className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
              >
                <span className="text-2xl mr-3">{broker.icon}</span>
                <div>
                  <p className="text-white font-medium">{broker.name}</p>
                  <p className="text-gray-400 text-sm">{broker.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Connected Brokers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brokers.map((broker, index) => (
            <motion.div
              key={broker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors duration-200 border border-gray-600"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{broker.name}</h3>
                {broker.is_active ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                ) : (
                  <XCircleIcon className="h-6 w-6 text-red-400" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  Status: <span className={broker.is_active ? 'text-green-400' : 'text-red-400'}>
                    {broker.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
                <p className="text-sm text-gray-400">
                  Connected: {formatDate(broker.created_at)}
                </p>
              </div>
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Sync
                </button>
                <button className="flex-1 px-3 py-2 border border-gray-500 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition-colors">
                  Settings
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Add More Brokers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularBrokers.map((broker) => (
            <motion.button
              key={broker.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onConnectBroker(broker.name)}
              className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left border border-gray-600"
            >
              <span className="text-2xl mr-3">{broker.icon}</span>
              <div>
                <p className="text-white font-medium">{broker.name}</p>
                <p className="text-gray-400 text-sm">{broker.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
          </div>
        </motion.div>
      ))}
    </div>
  );
}