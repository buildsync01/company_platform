'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthWallModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionText?: string;
}

export default function AuthWallModal({ isOpen, onClose, actionText = 'continue' }: AuthWallModalProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent hydration errors
  }

  const handleLogin = () => {
    onClose();
    router.push('/sign-in');
  };

  const handleRegister = () => {
    onClose();
    router.push('/sign-up');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#222222] border border-[#2d2d2d] rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#F01457]">Login or Register to {actionText}</DialogTitle>
          <DialogDescription className="text-slate-400">
            To protect our members from spam, you must be logged in to contact companies.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          <Button 
            className="w-full bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white"
            onClick={handleLogin}
          >
            Login
          </Button>
          
          <p className="text-center text-slate-500">or</p>
          
          <Button 
            variant="outline" 
            className="w-full border-[#2d2d2d] text-slate-300 hover:bg-[#2d2d2d]"
            onClick={handleRegister}
          >
            Register
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full text-slate-400 hover:text-slate-300 hover:bg-transparent"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}