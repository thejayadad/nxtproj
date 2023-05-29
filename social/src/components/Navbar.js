import React from 'react'
import Link from 'next/link'

const Navbar = () => {
    const loggedIn = true
  return (
    <header>
        <nav>
            <Link href="/">Home</Link>

            <ul>
                {
                    loggedIn?
                    (
                        <>
                    <li>Welcome: Username</li>
                    <li>
                        <buton>Logout</buton>
                    </li>
                    </>
                    )
                    :
                    (
                        <>
                       <li><button>LogIn</button></li>
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