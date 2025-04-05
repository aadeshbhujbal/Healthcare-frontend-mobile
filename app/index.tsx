import React from 'react';
import {
  View,
  Image,
  Dimensions,
  ScrollView,
  useColorScheme,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 48 = padding (16 * 2) + gap (16)
const BORDER_RADIUS = 16; // Single consistent border radius across all UI elements

type Feature = {
  title: string;
  description: string;
  icon: string;
  colors: readonly [string, string];
  iconBg: string;
  topBarColor: string; // Added for the colored top bars
};

const features: Feature[] = [
  {
    title: 'Smart Scheduling',
    description: 'AI-powered appointment booking',
    icon: '🤖',
    colors: ['#6366F1', '#4F46E5'] as const,
    iconBg: '#EEF2FF',
    topBarColor: '#6366F1',
  },
  {
    title: 'Health Records',
    description: 'Secure medical history access',
    icon: '🏥',
    colors: ['#10B981', '#059669'] as const,
    iconBg: '#ECFDF5',
    topBarColor: '#10B981',
  },
  {
    title: 'Video Consults',
    description: '24/7 doctor consultations',
    icon: '📱',
    colors: ['#F43F5E', '#E11D48'] as const,
    iconBg: '#FFF1F2',
    topBarColor: '#F43F5E',
  },
  {
    title: 'Lab Results',
    description: 'Real-time test updates',
    icon: '🔬',
    colors: ['#8B5CF6', '#7C3AED'] as const,
    iconBg: '#F3F0FF',
    topBarColor: '#8B5CF6',
  },
  {
    title: 'Prescriptions',
    description: 'Digital medicine tracking',
    icon: '💊',
    colors: ['#F59E0B', '#D97706'] as const,
    iconBg: '#FFFBEB',
    topBarColor: '#F59E0B',
  },
  {
    title: 'Health Tips',
    description: 'AI health recommendations',
    icon: '💡',
    colors: ['#EC4899', '#DB2777'] as const,
    iconBg: '#FDF2F8',
    topBarColor: '#EC4899',
  },
];

const stats = [
  { value: '10M+', label: 'Users', icon: '👥' },
  { value: '50k+', label: 'Doctors', icon: '👨‍⚕️' },
  { value: '24/7', label: 'Support', icon: '🌟' },
  { value: '4.9★', label: 'Rating', icon: '⭐' },
] as const;

const testimonials = [
  {
    quote:
      "Revolutionary healthcare experience! The app's AI scheduling made finding the right doctor effortless.",
    author: 'Sarah Johnson',
    role: 'Patient',
    image: require('~/assets/images/icon.png'),
  },
  {
    quote:
      'This platform transformed my practice. Patient care has never been more streamlined and efficient.',
    author: 'Dr. Michael Chen',
    role: 'Cardiologist',
    image: require('~/assets/images/icon.png'),
  },
  {
    quote:
      'The telemedicine features are fantastic. I can consult with doctors from the comfort of my home.',
    author: 'Emily Rodriguez',
    role: 'Patient',
    image: require('~/assets/images/icon.png'),
  },
] as const;

const specialties = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Dentistry',
  'Psychology',
  'Oncology',
] as const;

export default function LandingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const renderFeatureCard = (feature: Feature, index: number) => {
    return (
      <View
        key={feature.title}
        style={{
          marginBottom: 16,
        }}
      >
        {/* Colored top bar */}
        <View
          style={{
            height: 8,
            backgroundColor: feature.topBarColor,
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: BORDER_RADIUS,
            marginHorizontal: 16,
            shadowColor: feature.topBarColor,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 1,
          }}
        />

        {/* Card body - separate from top bar */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: BORDER_RADIUS,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
            padding: 16,
            paddingVertical: 20,
            marginHorizontal: 16,
            borderTopLeftRadius: 0, // Flat top to connect with color bar
            borderTopRightRadius: 0, // Flat top to connect with color bar
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.03)',
            borderTopWidth: 0,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: BORDER_RADIUS,
                backgroundColor: feature.iconBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                shadowColor: feature.topBarColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18 }}>{feature.icon}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: 4,
                  lineHeight: 22,
                }}
              >
                {feature.title}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: '#6B7280',
                  fontWeight: '400',
                  lineHeight: 20,
                }}
              >
                {feature.description}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#0F172A' : '#F9FAFB' }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <LinearGradient
        colors={
          isDark
            ? ['#0F172A', '#1E293B', '#334155']
            : ['#4F46E5', '#6366F1', '#818CF8']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 24, paddingTop: 80, paddingBottom: 64 }}
      >
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 160,
              height: 160,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: BORDER_RADIUS,
              overflow: 'hidden',
              marginBottom: 24,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              shadowColor: isDark ? '#000' : '#4F46E5',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 15,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
            }}
          >
            <View
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 14,
                backgroundColor: '#F9FAFB',
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LinearGradient
                colors={['#4F46E5', '#818CF8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}
              />

              {/* Simple medical cross */}
              <View
                style={{
                  width: 50,
                  height: 120,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 5,
                }}
              />

              <View
                style={{
                  width: 120,
                  height: 50,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  position: 'absolute',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 5,
                }}
              />
            </View>
          </View>

          <Text
            style={{
              fontSize: 36,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: 16,
              lineHeight: 44,
              width: '100%',
              paddingHorizontal: 12,
            }}
          >
            HealthCare Pro
          </Text>

          <Text
            style={{
              fontSize: 20,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            Your Health Journey Starts Here
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              lineHeight: 24,
              maxWidth: 300,
            }}
          >
            Experience the future of healthcare with AI-powered features and
            seamless consultations
          </Text>
        </View>

        {/* Stats Section */}
        <View
          style={{
            marginTop: 48,
            borderRadius: BORDER_RADIUS,
            overflow: 'hidden',
            shadowColor: '#4F46E5',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Stats container with purple gradient background */}
          <LinearGradient
            colors={['#6366F1', '#818CF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 24,
              borderRadius: BORDER_RADIUS,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              {stats.map((stat) => (
                <View
                  key={stat.label}
                  style={{
                    width: '48%',
                    marginBottom: 16,
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: BORDER_RADIUS,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>{stat.icon}</Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: 2,
                    }}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>

      {/* Features Section */}
      <View
        style={{
          paddingTop: 24,
          paddingBottom: 40,
          backgroundColor: '#F9FAFB',
        }}
      >
        <View
          style={{
            marginBottom: 24,
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#111827',
              marginBottom: 4,
              marginTop: 12,
              lineHeight: 32,
            }}
          >
            Smart Features
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: '#6B7280',
              lineHeight: 24,
            }}
          >
            Experience the future of healthcare
          </Text>
        </View>

        <View style={{ paddingBottom: 12 }}>
          {features.map((feature, index) => renderFeatureCard(feature, index))}
        </View>
      </View>

      {/* CTA Section */}
      <LinearGradient
        colors={isDark ? ['#0F172A', '#1E293B'] : ['#4F46E5', '#6366F1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24, paddingVertical: 48 }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 16,
            textAlign: 'center',
            lineHeight: 36,
          }}
        >
          Ready to Transform{'\n'}Your Healthcare?
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 24,
          }}
        >
          Join millions of users who have revolutionized their healthcare
          experience
        </Text>

        <View style={{ gap: 16 }}>
          <Link href="/auth/register" asChild>
            <Button
              className="w-full h-14 bg-white shadow-xl"
              style={{ borderRadius: BORDER_RADIUS }}
              size="lg"
            >
              <Text
                style={{ color: '#4F46E5', fontSize: 18, fontWeight: 'bold' }}
              >
                Get Started Now
              </Text>
            </Button>
          </Link>

          <Link href="/auth/login" asChild>
            <Button
              variant="outline"
              className="w-full h-14 border-2 border-white mt-4"
              style={{ borderRadius: BORDER_RADIUS }}
              size="lg"
            >
              <Text
                style={{ color: '#4F46E5', fontSize: 18, fontWeight: 'bold' }}
              >
                Sign In
              </Text>
            </Button>
          </Link>

          <Text
            style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              marginTop: 16,
            }}
          >
            By continuing, you agree to our Terms of Service
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}
