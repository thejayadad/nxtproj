'use client'


import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from "next/image"
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { useSession } from 'next-auth/react'



const PostCard = ({post: { desc, imageUrl, likes, authorId, _id }}) => {
    const { data: session } = useSession()
    const [isLiked, setIsLiked] = useState(false)
    const [postLikes, setPostLikes] = useState(0)

    useEffect(() => {
        session && likes && setIsLiked(likes.includes(session?.user?._id))
        session && likes && setPostLikes(likes.length)
      }, [likes, session])
      const handleLike = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/post/${_id}/like`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.accessToken}`
            },
            method: 'PUT'
          })
    
          console.log(res)
          if (res.ok) {
            if (isLiked) {
              setIsLiked(prev => !prev)
              setPostLikes(prev => prev - 1)
            } else {
              setIsLiked(prev => !prev)
              setPostLikes(prev => prev + 1)
            }
          }
        } catch (error) {
          console.log(error)
        }
      }


  return (
    <div>
        <Link href={`/post/${_id}`}>
            <Image alt="post Image" height="150" width="200" src={imageUrl} />
        </Link>
        <div>
            <h3>{desc}</h3>
        </div>
        <div>
            {postLikes}{" "}{
                isLiked ? (<AiFillLike  size={20} />)
                : (<AiOutlineLike  size={20} />)
            }
        </div>

    </div>
  )
}

export default PostCard