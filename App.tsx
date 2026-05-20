import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond';
import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';

import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import ProcessingScreen from './src/screens/ProcessingScreen';
import AIDecisionScreen from './src/screens/AIDecisionScreen';
import BookingConfirmationScreen from './src/screens/BookingConfirmationScreen';
import BookingHistoryScreen from './src/screens/BookingHistoryScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import RatingScreen from './src/screens/RatingScreen';
import AgentLogsScreen from './src/screens/AgentLogsScreen';
import ProviderListScreen from './src/screens/ProviderListScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AuthScreen from './src/screens/AuthScreen';
import RoadmapScreen from './src/screens/RoadmapScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const C = { navy:'#223148', cream:'#f3eae0', steel:'#2f486d', white:'#ffffff', bg:'#f0f4f8' };

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.navy,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: C.cream,
        tabBarInactiveTintColor: C.steel,
        tabBarLabelStyle: { fontFamily: 'DMSans', fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }} 
      />
      <Tab.Screen 
        name="BookingsTab" 
        component={BookingHistoryScreen} 
        options={{ tabBarLabel: 'Bookings', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text> }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    CormorantGaramond: CormorantGaramond_700Bold,
    DMSans: DMSans_400Regular,
    DMSans_Bold: DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F3F4F6' },
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="ProviderList" component={ProviderListScreen} />
          <Stack.Screen 
            name="Processing" 
            component={ProcessingScreen} 
            options={{ animation: 'fade' }}
          />
          <Stack.Screen 
            name="AIDecision" 
            component={AIDecisionScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen 
            name="Booking" 
            component={BookingConfirmationScreen}
            options={{ animation: 'none' }}
          />
          <Stack.Screen name="History" component={BookingHistoryScreen} />
          <Stack.Screen name="Rating" component={RatingScreen} />
          <Stack.Screen name="AgentLogs" component={AgentLogsScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Roadmap" component={RoadmapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
