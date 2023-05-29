
'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'
import { AiOutlineFileImage } from 'react-icons/ai'






const Edit = (ctx) => {
    const CLOUD_NAME = 'socialsite'
    const UPLOAD_PRESET = 'social_site'
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [category, setCategory] = useState("Nature")
    const [photo, setPhoto] = useState("")
    const { data: session, status } = useSession()
    const router = useRouter()
    
    useEffect(() => {
        async function fetchPost() {
            const res = await fetch(`http://localhost:3000/api/post/${ctx.params.id}`)

            const post = await res.json()

            setDesc(post.desc)

        }
        fetchPost()
    }, [])

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

        if(desc === ''){
            toast.error("All fields are required")
            return
        }

        try {
            let imageUrl = null
            if(photo){
                imageUrl = await uploadImage()
            }

            const body = {
                desc
            }

            if(imageUrl != null){
                body.imageUrl = imageUrl
            }
            
            const res = await fetch(`http://localhost:3000/api/post/${ctx.params.id}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                method: "PUT",
                body: JSON.stringify(body)
            })

            if(!res.ok){
                throw new Error("Error has occured")
            }

            const post = await res.json()

            router.push(`/post/${post?._id}`)
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
        <h2>Edit Post</h2>
        <form onSubmit={handleSubmit}>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        <input  id='image' type="file" onChange={(e) => setPhoto(e.target.files[0])} />
        
        
        <button>Update</button>

        </form>

        <ToastContainer />
    </div>
  )
}

export default Edit