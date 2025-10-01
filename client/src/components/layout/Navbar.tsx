import { useNavigate, useLocation } from 'react-router-dom';
import { Scale, BarChart3, FileText, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/judge', label: 'Judge Portal', icon: Scale },
    { path: '/comparison', label: 'Comparison', icon: BarChart3 },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Scale className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-gray-900">Meta-Judge</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Button
                  key={item.path}
                  variant={active ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate(item.path === '/' ? '/' : `${item.path}?org=2`)}
                  className={cn(
                    'flex items-center gap-2',
                    !active && 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
