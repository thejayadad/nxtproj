'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import {signIn, signOut, useSession} from 'next-auth/react'


const Navbar = () => {
    const {data: session} = useSession()



    const loggedIn = false
  return (
    <header className="shadow-sm border-b sticky top-0 bg-white z-30 p-6">
        <nav className="flex items-center justify-between max-w-6xl mx-4 xl:mx-auto">
            <Link className='hidden md:inline-flex  h-6 cursor-pointer hover:scale-125 transition-tranform duration-200 ease-out' href="/">Home</Link>

            <ul className="relative mt-1 flex space-x-4">
                {
                 session?.user
                    ? (
                        <>
                    <li className='hidden md:inline-flex  h-6 cursor-pointer' >Welcome {session.user.email}</li>
                    <li><Link className='hidden md:inline-flex  h-6 cursor-pointer hover:scale-125 transition-tranform duration-200 ease-out' href="/create-post">Create Post</Link></li>
                    <li>
                    <buton className='hidden md:inline-flex  h-6 cursor-pointer hover:scale-125 transition-tranform duration-200 ease-out' onClick={() => {signOut()}}>Logout</buton>
                    </li>
                    </>
                    )
                    :
                    (
                        <>
                       <li><Link href="/login">Login</Link></li>
                       <li><Link href="/register">Register</Link></li>
                       </>
                    )
                }
            </ul>
        </nav>
    </header>
  )
}

export default Navbar