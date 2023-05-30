'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { useSession } from 'next-auth/react'
import { AiOutlineFileImage } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify'


const CreatePost = () => {
    const CLOUD_NAME = 'socialsite'
    const UPLOAD_PRESET = 'social_site'
    const [desc, setDesc] = useState('')
    const [photo, setPhoto] = useState('')

    const { data: session, status } = useSession()
    const router = useRouter()

    if (status === 'loading') {
        return <p>Loading...</p>
    }

    if (status === 'unauthenticated') {
        return <p>
            Access Denied
        </p>
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!photo || !desc){
            toast.error("All fields are required")
            return
        }

        try {
          const imageUrl = await uploadImage()
          
          const res = await fetch(`http://localhost:3000/api/post`, {
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${session?.user?.accessToken}` 
            },
            method: 'POST',
            body: JSON.stringify({desc,imageUrl,authorId: session?.user?._id})
          })

          if(!res.ok){
            throw new Error("Error occured")
          }

          const post = await res.json()

          router.push("/")
        } catch (error) {
            console.log(error)
        }
    }

    const uploadImage = async () => {
        if (!photo) return

        const formData = new FormData()

        formData.append("file", photo)
        formData.append("upload_preset", UPLOAD_PRESET)

        try {
          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
          })

          const data = await res.json()

          const imageUrl = data['secure_url']

          return imageUrl
        } catch (error) {
            console.log(error)
        }
    }


  return (
    <div>
        <h2 className='text-center mt-3 text-6xl'>Create Post</h2>
        <div className='max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-md shadow-md'>
        <form onSubmit={handleSubmit}>
        <textarea  placeholder='Share Your Thoughts!' onChange={(e) => setDesc(e.target.value)} className="m-4 border-none text-center w-full focus:ring-0"/>
        <div className="flex flex-col justify-center items-center h-[100%]">
        <label htmlFor='image'>
                 Upload Image 
          
                    </label>
        </div>
        <input style={{ display: 'none' }} id='image' type="file"  onChange={(e) => setPhoto(e.target.files[0])} />
        <button 
        className="w-full bg-red-600 text-white p-2 mt-4 shadow-md hover:brightness-125 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:brightness-100"
      
       >Create</button>
        </form>
        </div>
        <ToastContainer />

    </div>
  )
}

export default CreatePost

