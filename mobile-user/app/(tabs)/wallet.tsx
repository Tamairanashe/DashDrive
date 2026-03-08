import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyledFontAwesome5 } from '../../src/lib/interop';

interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  date: string;
}

export default function WalletScreen() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      // In production, this would be: 
      // const res = await fetch('http://localhost:3000/wallet/summary', { ...auth });
      // For now, simulate the logistics engine response:
      setTimeout(() => {
        setBalance(150.50);
        setTransactions([
          { id: '1', type: 'CREDIT', amount: 50.00, description: 'Top up via MockGateway', date: 'Today, 10:30 AM' },
          { id: '2', type: 'DEBIT', amount: 15.20, description: 'Order #DSH-8492', date: 'Yesterday, 2:15 PM' },
          { id: '3', type: 'CREDIT', amount: 100.00, description: 'Top up via MockGateway', date: 'Aug 14, 09:00 AM' },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 py-4 flex-row justify-between items-center">
        <Text className="text-3xl font-uber-bold text-secondary dark:text-white">Wallet</Text>
        <TouchableOpacity onPress={fetchWalletData} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
            <StyledFontAwesome5 name="sync-alt" size={16} color="gray" />
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1 px-6 showsVerticalScrollIndicator={false}">
        {/* Balance Card */}
        <View className="bg-zinc-900 dark:bg-zinc-800 rounded-[32px] p-8 mb-8 mt-2 shadow-sm">
          <View className="flex-row justify-between items-center mb-2">
             <Text className="text-white/70 font-uber-medium text-sm">Dash Cash Balance</Text>
             <StyledFontAwesome5 name="wallet" size={20} color="rgba(255,255,255,0.7)" />
          </View>
          
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" className="self-start my-2" />
          ) : (
             <Text className="text-white font-uber-bold text-5xl">K{balance.toFixed(2)}</Text>
          )}
          
          <View className="flex-row gap-4 mt-8">
              <TouchableOpacity className="flex-1 bg-primary h-14 rounded-2xl items-center justify-center">
                <Text className="text-black font-uber-bold text-lg">Top Up</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-zinc-800 dark:bg-zinc-700 h-14 rounded-2xl items-center justify-center border border-zinc-700">
                <Text className="text-white font-uber-bold text-lg">Transfer</Text>
              </TouchableOpacity>
          </View>
        </View>

        {/* Transactions / Ledger */}
        <Text className="text-secondary dark:text-white font-uber-bold text-xl mb-4">Recent Activity</Text>
        
        {isLoading ? (
            <ActivityIndicator size="large" color="#000" className="mt-8" />
        ) : transactions.length === 0 ? (
            <Text className="text-gray-500 font-uber-medium text-center mt-8">No recent transactions</Text>
        ) : (
            transactions.map(tx => (
                <View key={tx.id} className="flex-row items-center justify-between mb-6">
                    <View className="flex-row items-center flex-1 pr-4">
                        <View className={`h-12 w-12 rounded-full items-center justify-center mr-4 ${tx.type === 'CREDIT' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                            <StyledFontAwesome5 
                                name={tx.type === 'CREDIT' ? 'arrow-down' : 'arrow-up'} 
                                size={16} 
                                color={tx.type === 'CREDIT' ? '#16a34a' : '#dc2626'} 
                            />
                        </View>
                        <View>
                            <Text className="text-secondary dark:text-white font-uber-bold text-base">{tx.description}</Text>
                            <Text className="text-gray-500 font-uber-medium text-sm mt-1">{tx.date}</Text>
                        </View>
                    </View>
                    <Text className={`font-uber-bold text-lg ${tx.type === 'CREDIT' ? 'text-green-600 dark:text-green-400' : 'text-secondary dark:text-white'}`}>
                        {tx.type === 'CREDIT' ? '+' : '-'}K{tx.amount.toFixed(2)}
                    </Text>
                </View>
            ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
