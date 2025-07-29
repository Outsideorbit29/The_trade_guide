import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../utils/formatters';

interface Broker {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface BrokerListProps {
  brokers: Broker[];
}

export default function BrokerList({ brokers }: BrokerListProps) {
  if (brokers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No brokers connected</p>
        <p className="text-gray-500 text-sm mt-2">Connect your first broker to start trading</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {brokers.map((broker, index) => (
        <motion.div
          key={broker.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors duration-200"
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
  );
}