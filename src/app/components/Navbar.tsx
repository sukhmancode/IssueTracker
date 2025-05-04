"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { AiFillBug } from 'react-icons/ai'
import { signIn, useSession, signOut } from "next-auth/react";

const Navbar = () => {
    
    const currentPath = usePathname();
    const session = useSession();
    console.log(currentPath);
    
    const Links = [
        {label:"Dashboard",href:"/"},
        {label:"Issues",href:"/issues"}
    ]
  return (
    <nav className='flex justify-between border-b mb-5 items-center p-10 h-14'>
     
        <Link href={"/"}><AiFillBug size={40}/></Link>
        <ul className={`flex space-x-5`}>
            {Links.map((link,idx) => (
                <li key={idx} ><Link className={`${link.href === currentPath ? "text-red-900":"text-zinc-600"} hover:text-zinc-800 transition-colors`} href={link.href}>{link.label}</Link></li>
            ))}
        </ul>
      <div>
        {session.data?.user ?   (
            <div className='flex gap-3 items-center flex-row-reverse'>
              <img src={session.data.user.image} alt="" className='rounded-full' width={50} height={20}/>
           <Button onClick={() => signOut()}>Log Out</Button>
            </div>
     
        ) : (
            <Button onClick={() => signIn()}>signIn</Button>
        )}
      </div>
    </nav>
  )
}

export default Navbar