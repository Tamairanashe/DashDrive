import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400"
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm"
            placeholder="Search drivers, users, rides, or zones..."
            type="search"
            name="search"
          />
        </form>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500" />
            <Bell className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </Button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="relative flex items-center gap-x-2 rounded-full p-1 hover:bg-slate-100" />}>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-2 text-sm font-semibold leading-6 text-slate-900" aria-hidden="true">
                  Admin User
                </span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
