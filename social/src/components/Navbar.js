'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import {signIn, signOut, useSession} from 'next-auth/react'


const Navbar = () => {
    const {data: session} = useSession()



    const loggedIn = false
  return (
    <header>
        <nav>
            <Link href="/">Home</Link>

            <ul>
                {
                 session?.user
                    ? (
                        <>
                    <li>Welcome</li>
                    <li>
                    <buton onClick={() => {signOut()}}>Logout</buton>
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