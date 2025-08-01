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
  Waves
} from 'lucide-react';
import { Sidebar as StyledSidebar, NavItem, Heading3, Text } from './styled/StyledComponents';

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

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Manage Interns', path: '/manage-interns-new' },
    { icon: ClipboardList, label: 'Assign Tasks', path: '/assign-tasks-new' },
    { icon: Calendar, label: 'Mark Attendance', path: '/mark-attendance-new' },
    { icon: MessageSquare, label: 'Messages & Announcements', path: '/messages-announcements-new' },
    { icon: TrendingUp, label: 'Monitor Progress', path: '/monitor-progress-new' },
  ];

  return (
    <StyledSidebar>
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
    </StyledSidebar>
  );
};

export default Sidebar;
