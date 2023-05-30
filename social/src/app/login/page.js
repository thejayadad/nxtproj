'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { signIn } from 'next-auth/react'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password === '' || email === '') {
            toast.error("Fill all fields!")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        try {
            const res = await signIn('credentials', { email, password, redirect: false })

            if (res?.error == null) {
                router.push("/")
            } else {
                toast.error("Error occured while logging")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div >
        <h2 className='text-center mt-3 text-6xl'>Login</h2>
        <div className='max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-md shadow-md'>
        <div className="flex flex-col justify-center items-center h-[100%]">

                <form className='flex flex-col' onSubmit={handleSubmit}>
                   
                    <input className='mb-3 p-3' type="email" placeholder='Email...' onChange={(e) => setEmail(e.target.value)} />
                    <input className='mb-3 p-3' type="password" placeholder='Password...' onChange={(e) => setPassword(e.target.value)} />
                    <button 
                    className="w-full bg-green-600 text-white p-2 mt-4 shadow-md hover:brightness-125 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:brightness-100"
                    >Log in</button>
                    <Link  href='/register'>
                        Don&apos;t have an account? <br /> Register now.
                    </Link>
                </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login