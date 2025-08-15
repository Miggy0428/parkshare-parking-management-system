// Theme colors based on the provided login page reference
export const theme = {
  colors: {
    primary: '#FF7A59', // Orange from reference
    primaryDark: '#E85D3D',
    primaryLight: '#FF9478',
    secondary: '#FFA07A',
    background: '#FFF5F3',
    surface: '#FFFFFF',
    text: {
      primary: '#2D1B1B',
      secondary: '#6B4E4E',
      light: '#FFFFFF',
    },
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    border: '#FFD4C4',
    shadow: 'rgba(255, 122, 89, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #FF7A59 0%, #E85D3D 100%)',
    secondary: 'linear-gradient(135deg, #FFA07A 0%, #FF7A59 100%)',
    background: 'linear-gradient(135deg, #FFF5F3 0%, #FFFFFF 100%)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(255, 122, 89, 0.05)',
    md: '0 4px 6px -1px rgba(255, 122, 89, 0.1), 0 2px 4px -1px rgba(255, 122, 89, 0.06)',
    lg: '0 10px 15px -3px rgba(255, 122, 89, 0.1), 0 4px 6px -2px rgba(255, 122, 89, 0.05)',
    xl: '0 20px 25px -5px rgba(255, 122, 89, 0.1), 0 10px 10px -5px rgba(255, 122, 89, 0.04)',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
};
