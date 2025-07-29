import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  entry_price: number;
  exit_price: number | null;
  profit_loss: number;
  status: 'open' | 'closed';
  market_type: 'forex' | 'crypto';
  created_at: string;
  closed_at: string | null;
}

interface Broker {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface PortfolioStats {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  totalProfitLoss: number;
  winRate: number;
  totalInvested: number;
}

interface PortfolioContextType {
  trades: Trade[];
  brokers: Broker[];
  stats: PortfolioStats;
  loading: boolean;
  refreshData: () => Promise<void>;
  addTrade: (trade: Omit<Trade, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateTrade: (id: string, updates: Partial<Trade>) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { user, isGuest } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [stats, setStats] = useState<PortfolioStats>({
    totalTrades: 0,
    openTrades: 0,
    closedTrades: 0,
    totalProfitLoss: 0,
    winRate: 0,
    totalInvested: 0,
  });
  const [loading, setLoading] = useState(true);

  // Sample data for guest users
  const sampleTrades: Trade[] = [
    {
      id: 'sample-1',
      symbol: 'EURUSD',
      side: 'buy',
      quantity: 1.5,
      entry_price: 1.1234,
      exit_price: 1.1289,
      profit_loss: 82.5,
      status: 'closed',
      market_type: 'forex',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      closed_at: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      id: 'sample-2',
      symbol: 'BTCUSDT',
      side: 'buy',
      quantity: 0.1,
      entry_price: 45000,
      exit_price: null,
      profit_loss: 0,
      status: 'open',
      market_type: 'crypto',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      closed_at: null,
    },
    {
      id: 'sample-3',
      symbol: 'GBPUSD',
      side: 'sell',
      quantity: 2.0,
      entry_price: 1.2567,
      exit_price: 1.2534,
      profit_loss: 66.0,
      status: 'closed',
      market_type: 'forex',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      closed_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const sampleBrokers: Broker[] = [
    {
      id: 'sample-broker-1',
      name: 'MetaTrader 5',
      is_active: true,
      created_at: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: 'sample-broker-2',
      name: 'Zerodha Kite',
      is_active: true,
      created_at: new Date(Date.now() - 1209600000).toISOString(),
    },
  ];

  const fetchTrades = async () => {
    if (!user || isGuest) return;

    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trades:', error);
      return;
    }

    setTrades(data || []);
  };

  const fetchBrokers = async () => {
    if (!user || isGuest) return;

    const { data, error } = await supabase
      .from('brokers')
      .select('id, name, is_active, created_at')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }

    setBrokers(data || []);
  };

  const calculateStats = (trades: Trade[]) => {
    const totalTrades = trades.length;
    const openTrades = trades.filter(t => t.status === 'open').length;
    const closedTrades = trades.filter(t => t.status === 'closed').length;
    const totalProfitLoss = trades.reduce((sum, trade) => sum + trade.profit_loss, 0);
    const winningTrades = trades.filter(t => t.profit_loss > 0).length;
    const winRate = closedTrades > 0 ? (winningTrades / closedTrades) * 100 : 0;
    const totalInvested = trades.reduce((sum, trade) => sum + (trade.entry_price * trade.quantity), 0);

    setStats({
      totalTrades,
      openTrades,
      closedTrades,
      totalProfitLoss,
      winRate,
      totalInvested,
    });
  };

  const refreshData = async () => {
    setLoading(true);
    if (isGuest) {
      setTrades(sampleTrades);
      setBrokers(sampleBrokers);
    } else {
      await Promise.all([fetchTrades(), fetchBrokers()]);
    }
    setLoading(false);
  };

  const addTrade = async (trade: Omit<Trade, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    if (isGuest) {
      const newTrade = {
        ...trade,
        id: `sample-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      setTrades(prev => [newTrade, ...prev]);
      return;
    }

    const { error } = await supabase
      .from('trades')
      .insert({
        ...trade,
        user_id: user.id,
      });

    if (error) {
      console.error('Error adding trade:', error);
      throw error;
    }

    await fetchTrades();
  };

  const updateTrade = async (id: string, updates: Partial<Trade>) => {
    if (isGuest) {
      setTrades(prev => prev.map(trade => 
        trade.id === id ? { ...trade, ...updates } : trade
      ));
      return;
    }

    const { error } = await supabase
      .from('trades')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating trade:', error);
      throw error;
    }

    await fetchTrades();
  };

  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      setLoading(false);
    }
  }, [user, isGuest]);

  useEffect(() => {
    calculateStats(trades);
  }, [trades]);

  const value = {
    trades,
    brokers,
    stats,
    loading,
    refreshData,
    addTrade,
    updateTrade,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}