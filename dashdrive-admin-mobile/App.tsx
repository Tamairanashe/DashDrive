import React from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import OperationsScreen from './src/screens/OperationsScreen';
import DriversScreen from './src/screens/DriversScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Icons
import { 
  LayoutDashboard, 
  Activity, 
  Bike, 
  Search, 
  AlertTriangle, 
  UserCircle 
} from 'lucide-react-native';

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#1C1C1E',
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#00FF90',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Ops" 
        component={OperationsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Fleet" 
        component={DriversScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Bike size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Audit" 
        component={OrdersScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Alerts" 
        component={AlertsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <AlertTriangle size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Admin" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <UserCircle size={size} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigation() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00FF90" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? <AppTabs /> : <LoginScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle="light-content" />
        <RootNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
