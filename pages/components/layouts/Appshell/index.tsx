'use client';

import { usePathname } from 'next/navigation';
import Footer from '../footer';
import Navbar from '../navbar';

type AppshellProps = {
  children: React.ReactNode;
};

const AppShell = ({ children }: AppshellProps) => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
};

export default AppShell;
