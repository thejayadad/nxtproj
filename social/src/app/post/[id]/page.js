"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { format } from 'timeago.js'
import { useRouter } from 'next/navigation'
import Comment from '@/models/Comment'
import { BsFillPencilFill } from 'react-icons/bs'
import { AiFillDelete, AiFillLike, AiOutlineLike } from 'react-icons/ai'


const PostDetails = (ctx) => {
    const [postDetails, setPostDetails] = useState("")
    const [isLiked, setIsLiked] = useState(false)
    const [postLikes, setPostLikes] = useState(0)

    const [commentText, setCommentText] = useState("")
    const [comments, setComments] = useState([])

    const { data: session } = useSession()
    const router = useRouter()



    /*Post Details */
    useEffect(() => {
        async function fetchPost() {
            const res = await fetch(`http://localhost:3000/api/post/${ctx.params.id}`, { cache: 'no-store' })
            const post = await res.json()

            setPostDetails(post)
            setIsLiked(post?.likes?.includes(session?.user?._id))
            setPostLikes(post?.likes?.length || 0)
        }
        session && fetchPost()
    }, [session])
  return (
    <div>
        <h2>Post Detail</h2>
        <Image alt="post detail" src={postDetails?.imageUrl} width='350' height='650' />
        <h3>{postDetails?.desc}</h3>
        {
                        postDetails?.authorId?._id.toString() === session?.user?._id.toString()
                            ? (
                                <div>
                                    <Link href={`/post/edit/${ctx.params.id}`}>
                                        Edit <BsFillPencilFill />
                                    </Link>
                                    <button >
                                        Delete
                                        <AiFillDelete />
                                    </button>
                                </div>
                            )
                            : (
                                <div>
                                    Author: <span>{postDetails?.authorId?.username}</span>
                                </div>
                            )
                    }
    </div>
  )
}

export default PostDetails