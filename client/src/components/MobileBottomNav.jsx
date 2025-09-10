import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  TagIcon,
  FireIcon,
  QuestionMarkCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  TagIcon as TagIconSolid,
  FireIcon as FireIconSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';

const MobileBottomNav = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
    },
    {
      name: 'Categories',
      path: '/categories',
      icon: TagIcon,
      activeIcon: TagIconSolid,
    },
    {
      name: 'Deals',
      path: '/deals',
      icon: FireIcon,
      activeIcon: FireIconSolid,
    },
    {
      name: 'Help',
      path: '/help',
      icon: QuestionMarkCircleIcon,
      activeIcon: QuestionMarkCircleIconSolid,
    },
    {
      name: 'Account',
      path: '/dashboard',
      icon: UserIcon,
      activeIcon: UserIconSolid,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = active ? item.activeIcon : item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                active
                  ? 'text-saffron-600'
                  : 'text-gray-500 hover:text-saffron-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;