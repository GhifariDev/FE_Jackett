'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const [name, setName] = useState('');

  useEffect(() => {
    const username = Cookies.get('user_name');
    console.log('Cookie user_name:', username); // Debug di console
    if (username) {
      setName(username);
    }
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2 className='text-black'>Welcome, {name || 'Guest'}</h2>
    </div>
  );
}
