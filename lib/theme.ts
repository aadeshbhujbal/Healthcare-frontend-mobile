export interface Theme {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  radius: string;
}

export const LIGHT_THEME: Theme = {
  background: '#ffffff',
  foreground: '#020817',
  primary: '#0f172a',
  primaryForeground: '#f8fafc',
  secondary: '#f1f5f9',
  secondaryForeground: '#0f172a',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  accent: '#f1f5f9',
  accentForeground: '#0f172a',
  destructive: '#ef4444',
  destructiveForeground: '#f8fafc',
  border: '#e2e8f0',
  input: '#e2e8f0',
  ring: '#0f172a',
  radius: '0.5rem',
};

export const DARK_THEME: Theme = {
  background: '#020817',
  foreground: '#f8fafc',
  primary: '#f8fafc',
  primaryForeground: '#0f172a',
  secondary: '#1e293b',
  secondaryForeground: '#f8fafc',
  muted: '#1e293b',
  mutedForeground: '#94a3b8',
  accent: '#1e293b',
  accentForeground: '#f8fafc',
  destructive: '#7f1d1d',
  destructiveForeground: '#f8fafc',
  border: '#1e293b',
  input: '#1e293b',
  ring: '#cbd5e1',
  radius: '0.5rem',
}; 