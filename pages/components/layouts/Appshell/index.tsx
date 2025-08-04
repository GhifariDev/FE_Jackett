'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../footer';
import Navbar from '../navbar';

type AppshellProps = {
  children: React.ReactNode;
};

const AppShell = ({ children }: AppshellProps) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Hindari render hingga client siap

  const isSpecialPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/404';

  return (
    <div className="min-h-screen flex flex-col">
      {!isSpecialPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isSpecialPage && <Footer />}
    </div>
  );
};

export default AppShell;
