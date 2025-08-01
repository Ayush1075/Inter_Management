import styled, { keyframes, css } from 'styled-components';

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Theme object
export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
    info: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
    },
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      400: '#a855f7',
      500: '#8b5cf6',
      600: '#7c3aed',
    },
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
    }
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  }
};

// Layout Components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
  
  @media (max-width: 768px) {
    padding: 0 ${theme.spacing[4]};
  }
`;

export const Grid = styled.div`
  display: grid;
  gap: ${props => theme.spacing[props.gap] || theme.spacing[6]};
  grid-template-columns: ${props => props.columns || 'repeat(auto-fit, minmax(300px, 1fr))'};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[4]};
  }
`;

export const Flex = styled.div.withConfig({
  shouldForwardProp: (prop) => !['align', 'justify', 'gap', 'direction', 'wrap', 'responsive'].includes(prop),
})`
  display: flex;
  align-items: ${props => props.align || 'flex-start'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => theme.spacing[props.gap] || '0'};
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  
  @media (max-width: 768px) {
    ${props => props.responsive && css`
      flex-direction: column;
      align-items: stretch;
    `}
  }
`;

// Glass Card Components
export const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.radius.xl};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: ${props => theme.spacing[props.padding] || theme.spacing[6]};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.5s ease-out;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(255, 255, 255, 0.4);
  }

  ${props => props.hover && css`
    cursor: pointer;
  `}
`;

export const StatCard = styled(GlassCard)`
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

// Button Components
const ButtonBase = styled.button.withConfig({
  shouldForwardProp: (prop) => !['size'].includes(prop),
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  padding: ${props => {
    if (props.size === 'sm') return `${theme.spacing[2]} ${theme.spacing[4]}`;
    if (props.size === 'lg') return `${theme.spacing[4]} ${theme.spacing[8]}`;
    return `${theme.spacing[3]} ${theme.spacing[6]}`;
  }};
  font-family: inherit;
  font-size: ${props => {
    if (props.size === 'sm') return '0.8rem';
    if (props.size === 'lg') return '1rem';
    return '0.875rem';
  }};
  font-weight: 500;
  border-radius: ${theme.radius.lg};
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

export const PrimaryButton = styled(ButtonBase)`
  background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled(ButtonBase).withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop),
})`
  background: ${props => {
    if (props.variant === 'filled') return theme.colors.primary[500];
    return 'rgba(255, 255, 255, 0.9)';
  }};
  color: ${props => {
    if (props.variant === 'filled') return 'white';
    return theme.colors.gray[700];
  }};
  border: 1px solid ${props => {
    if (props.variant === 'filled') return theme.colors.primary[500];
    if (props.variant === 'outlined') return theme.colors.primary[500];
    return 'rgba(203, 213, 225, 0.5)';
  }};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &:hover:not(:disabled) {
    background: ${props => {
      if (props.variant === 'filled') return theme.colors.primary[600];
      if (props.variant === 'outlined') return theme.colors.primary[50];
      return 'rgba(255, 255, 255, 1)';
    }};
    border-color: ${props => {
      if (props.variant === 'filled') return theme.colors.primary[600];
      if (props.variant === 'outlined') return theme.colors.primary[600];
      return theme.colors.gray[300];
    }};
    color: ${props => {
      if (props.variant === 'filled') return 'white';
      if (props.variant === 'outlined') return theme.colors.primary[600];
      return theme.colors.gray[700];
    }};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.lg};
  }
`;

export const GhostButton = styled(ButtonBase)`
  background: transparent;
  color: ${theme.colors.gray[600]};
  border: 1px solid transparent;

  &:hover:not(:disabled) {
    background: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[800]};
  }
`;

// Input Components
export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: ${theme.radius.lg};
  font-family: inherit;
  font-size: 0.875rem;
  color: ${theme.colors.gray[800]};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &::placeholder {
    color: ${theme.colors.gray[400]};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: rgba(255, 255, 255, 1);
  }

  &:hover {
    border-color: ${theme.colors.gray[400]};
  }

  ${props => props.error && css`
    border-color: ${theme.colors.error[500]};
    &:focus {
      border-color: ${theme.colors.error[500]};
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: ${theme.radius.lg};
  font-family: inherit;
  font-size: 0.875rem;
  color: ${theme.colors.gray[800]};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  resize: vertical;
  min-height: 100px;

  &::placeholder {
    color: ${theme.colors.gray[400]};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: rgba(255, 255, 255, 1);
  }

  &:hover {
    border-color: ${theme.colors.gray[400]};
  }
`;

// Typography Components
export const Heading1 = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: ${theme.colors.gray[900]};
  line-height: 1.2;
  margin-bottom: ${theme.spacing[4]};
  
  @media (max-width: 768px) {
    font-size: 1.875rem;
  }
`;

export const Heading2 = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${theme.colors.gray[900]};
  line-height: 1.3;
  margin-bottom: ${theme.spacing[3]};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const Heading3 = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme.colors.gray[800]};
  line-height: 1.4;
  margin-bottom: ${theme.spacing[3]};
`;

export const Heading4 = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.gray[800]};
  line-height: 1.4;
  margin-bottom: ${theme.spacing[2]};
`;

export const Text = styled.p.withConfig({
  shouldForwardProp: (prop) => !['noMargin', 'size', 'variant'].includes(prop),
})`
  font-size: ${props => {
    if (props.size === 'sm') return '0.875rem';
    if (props.size === 'lg') return '1.125rem';
    return '1rem';
  }};
  color: ${props => {
    if (props.variant === 'muted') return theme.colors.gray[500];
    if (props.variant === 'secondary') return theme.colors.gray[600];
    return theme.colors.gray[700];
  }};
  line-height: ${props => props.size === 'sm' ? '1.5' : '1.6'};
  margin-bottom: ${props => props.noMargin ? '0' : theme.spacing[2]};
`;

// Badge Components
export const Badge = styled.span.withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop),
})`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: ${theme.radius.md};
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border: 1px solid;

  ${props => {
    switch (props.variant) {
      case 'success':
        return css`
          background: ${theme.colors.success[50]};
          color: ${theme.colors.success[600]};
          border-color: rgba(34, 197, 94, 0.2);
        `;
      case 'warning':
        return css`
          background: ${theme.colors.warning[50]};
          color: ${theme.colors.warning[600]};
          border-color: rgba(245, 158, 11, 0.2);
        `;
      case 'error':
        return css`
          background: ${theme.colors.error[50]};
          color: ${theme.colors.error[600]};
          border-color: rgba(239, 68, 68, 0.2);
        `;
      case 'primary':
        return css`
          background: ${theme.colors.primary[50]};
          color: ${theme.colors.primary[600]};
          border-color: rgba(59, 130, 246, 0.2);
        `;
      default:
        return css`
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[600]};
          border-color: ${theme.colors.gray[200]};
        `;
    }
  }}
`;

// Progress Components
export const ProgressContainer = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.gray[200]};
  border-radius: ${theme.radius.md};
  overflow: hidden;
  position: relative;
`;

export const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.value || 0}%;
  background: linear-gradient(90deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
  border-radius: ${theme.radius.md};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

// Table Components
export const Table = styled.table`
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: ${theme.radius.xl};
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  box-shadow: ${theme.shadows.lg};
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background: rgba(248, 250, 252, 0.8);
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

export const TableHeaderCell = styled.th`
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  text-align: left;
  font-weight: 600;
  color: ${theme.colors.gray[700]};
  font-size: 0.875rem;
`;

export const TableBody = styled.tbody`
  tr:hover {
    background: rgba(248, 250, 252, 0.5);
  }
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid rgba(226, 232, 240, 0.3);
  
  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  color: ${theme.colors.gray[800]};
  font-size: 0.875rem;
`;

// Loading Components
export const LoadingSpinner = styled.div`
  width: ${props => props.size || '24px'};
  height: ${props => props.size || '24px'};
  border: 2px solid ${theme.colors.gray[200]};
  border-top: 2px solid ${theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${pulse} 1s linear infinite;
`;

export const LoadingSkeleton = styled.div`
  background: linear-gradient(90deg, ${theme.colors.gray[200]} 25%, ${theme.colors.gray[100]} 50%, ${theme.colors.gray[200]} 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${theme.radius.md};
  height: ${props => props.height || '1rem'};
  width: ${props => props.width || '100%'};
`;

// Sidebar Components
export const Sidebar = styled.aside`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(226, 232, 240, 0.3);
  box-shadow: ${theme.shadows.lg};
  padding: ${theme.spacing[6]};
  min-height: 100vh;
  width: 280px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  
  @media (max-width: 768px) {
    width: 100%;
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
  }
`;

export const MainContent = styled.main`
  margin-left: 280px;
  padding: ${theme.spacing[6]};
  min-height: 100vh;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: ${theme.spacing[4]};
  }
`;

// Navigation Components
export const NavItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.radius.lg};
  color: ${props => props.active ? theme.colors.primary[600] : theme.colors.gray[600]};
  background: ${props => props.active ? theme.colors.primary[50] : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: ${theme.spacing[1]};

  &:hover {
    background: ${props => props.active ? theme.colors.primary[50] : theme.colors.gray[100]};
    color: ${props => props.active ? theme.colors.primary[600] : theme.colors.gray[800]};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// Modal Components
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeInUp} 0.2s ease-out;
`;

export const ModalContent = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.xl};
  padding: ${theme.spacing[6]};
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${theme.shadows.xl};
  position: relative;
  animation: ${fadeInUp} 0.3s ease-out;
  border: 1px solid ${theme.colors.gray[200]};
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing[4]};
  right: ${theme.spacing[4]};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.radius.lg};
  color: ${theme.colors.gray[500]};
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[700]};
  }
`;

// Complete Modal Component
// Note: Modal component moved to separate file due to JSX syntax
export { Modal } from './Modal';

// Component aliases for easier imports
export const Textarea = TextArea;
