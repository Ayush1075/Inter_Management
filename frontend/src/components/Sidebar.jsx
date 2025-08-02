import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  MessageSquare,
  TrendingUp,
  Waves,
  LogOut
} from 'lucide-react';
import { Sidebar as StyledSidebar, NavItem, Heading3, Text } from './styled/StyledComponents';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
  }
`;

const LogoText = styled.div``;

const Navigation = styled.nav`
  margin-bottom: 2rem;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  display: block;
  margin-bottom: 0.25rem;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: auto;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const SidebarContainer = styled(StyledSidebar)`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Manage Interns', path: '/manage-interns-new' },
    { icon: ClipboardList, label: 'Assign Tasks', path: '/assign-tasks-new' },
    { icon: Calendar, label: 'Mark Attendance', path: '/mark-attendance-new' },
    { icon: MessageSquare, label: 'Messages & Announcements', path: '/messages-announcements-new' },
    { icon: TrendingUp, label: 'Monitor Progress', path: '/monitor-progress-new' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarContainer>
      {/* Logo Section */}
      <LogoSection>
        <LogoIcon>
          <Waves />
        </LogoIcon>
        <LogoText>
          <Heading3 style={{ marginBottom: '0', fontSize: '1.25rem', fontWeight: '700' }}>
            INNODATATICS
          </Heading3>
          <Text size="sm" variant="muted" noMargin>
            Admin Portal
          </Text>
        </LogoText>
      </LogoSection>

      {/* Navigation */}
      <Navigation>
        {navItems.map((item) => (
          <StyledNavLink key={item.path} to={item.path}>
            {({ isActive }) => (
              <NavItem active={isActive}>
                <item.icon />
                <span>{item.label}</span>
              </NavItem>
            )}
          </StyledNavLink>
        ))}
      </Navigation>

      {/* Logout Button */}
      <LogoutButton onClick={handleLogout}>
        <LogOut />
        <span>Logout</span>
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
