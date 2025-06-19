import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import Footer from '../Footer/Footer';

export default function Layout() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className='pt-16'>
        <Outlet context={{ searchTerm }} />
        <Footer/>
      </div>
    </>
  );
}
