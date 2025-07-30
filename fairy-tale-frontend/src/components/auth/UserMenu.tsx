import React, {useState} from 'react';
import {UserIcon, BookmarkIcon, LogOutIcon} from 'lucide-react';
interface UserMenuProps {
  user?: {
    name: string;
    email: string;
  };
  onLogin: () => void;
  onLogout: () => void;
  onViewSavedTales: () => void;
}
export const UserMenu = ({
  user,
  onLogin,
  onLogout,
  onViewSavedTales,
}: UserMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="relative">
      {user ? (
        <>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-2 text-purple-700 hover:text-purple-800">
            <UserIcon className="h-5 w-5" />
            <span>{user.name}</span>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={() => {
                  onViewSavedTales();
                  setIsMenuOpen(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full">
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Saved Tales
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full">
                <LogOutIcon className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={onLogin}
          className="flex items-center space-x-2 text-purple-700 hover:text-purple-800">
          <UserIcon className="h-5 w-5" />
          <span>Sign In</span>
        </button>
      )}
    </div>
  );
};
