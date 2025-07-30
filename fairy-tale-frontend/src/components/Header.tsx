import React from 'react';
import {SparklesIcon} from 'lucide-react';
import {UserMenu} from './auth/UserMenu';
import type {User} from '@/lib/types';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onViewSavedTales: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onLogout,
  onViewSavedTales,
}) => {
  return (
    <header className="grid grid-cols-4 items-center mb-8">
      <div></div> {/* Empty spacer */}
      <div className="col-span-2 text-center">
        <div className="flex items-center justify-center mb-2">
          <SparklesIcon className="h-8 w-8 text-purple-600 mr-2" />
          <h1 className="text-4xl font-bold text-purple-800">
            Fairy Tale Generator
          </h1>
          <SparklesIcon className="h-8 w-8 text-purple-600 ml-2" />
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Create magical, personalized fairy tales tailored to your preferences.
          Simply fill in the form below and let our enchanted storyteller weave
          a tale just for you!
        </p>
      </div>
      <div className="flex justify-end">
        <UserMenu
          user={user ?? undefined}
          onLogin={onLogin}
          onLogout={onLogout}
          onViewSavedTales={onViewSavedTales}
        />
      </div>
    </header>
  );
};
