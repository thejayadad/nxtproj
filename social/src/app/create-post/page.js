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
        <h2>Create Post Page</h2>
        <form onSubmit={handleSubmit}>
        <textarea placeholder='Description...' onChange={(e) => setDesc(e.target.value)} />
        <input id='image' type="file"  onChange={(e) => setPhoto(e.target.files[0])} />
        <button>Create</button>
        </form>
        <ToastContainer />

    </div>
  )
}

export default CreatePost

