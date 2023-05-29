"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { format } from 'timeago.js'
import { useRouter } from 'next/navigation'
import { BsFillPencilFill } from 'react-icons/bs'
import { AiFillDelete, AiFillLike, AiOutlineLike } from 'react-icons/ai'
import Comment from '@/components/Comment'

const PostDetails = (ctx) => {
    const [postDetails, setPostDetails] = useState("")
    const [isLiked, setIsLiked] = useState(false)
    const [postLikes, setPostLikes] = useState(0)

    const [commentText, setCommentText] = useState("")
    const [comments, setComments] = useState([])

    const { data: session } = useSession()
    const router = useRouter()



    useEffect(() => {
      async function fetchComments(){
        const res = await fetch(`http://localhost:3000/api/comment/${ctx.params.id}`, {cache: 'no-store'})
        const comments = await res.json()

        setComments(comments)
      }
      fetchComments()
    }, [])



/*Delete Post */

const handleDelete = async () => {
  try {
      const confirmModal = confirm("Are you sure you want to delete your post?")

      if (confirmModal) {
          const res = await fetch(`http://localhost:3000/api/post/${ctx.params.id}`, {
              headers: {
                  'Authorization': `Bearer ${session?.user?.accessToken}`
              },
              method: "DELETE"
          })

          if (res.ok) {
              router.push('/')
          }
      }
  } catch (error) {
      console.log(error)
  }
}

/*Like Post */
const handleLike = async () => {
  try {
      const res = await fetch(`http://localhost:3000/api/post/${ctx.params.id}/like`, {
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

/*Comments */
const handleComment = async () => {
  if(commentText?.length < 2){
      toast.error("Comment must be 2 characters long")
      return
  }

  try {
      const body = {
          postId: ctx.params.id,
          authorId: session?.user?._id,
          text: commentText
      }

      const res = await fetch(`http://localhost:3000/api/comment`, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.user?.accessToken}`
          },
          method: "POST",
          body: JSON.stringify(body)
      })

      const newComment = await res.json()

      setComments((prev) => {
          return [newComment, ...prev]
      })
      
      setCommentText("")
  } catch (error) {
      console.log(error)
  }
}



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
                                    <button onClick={handleDelete}>
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
                    <div>
                      {postLikes} {" "} {isLiked ? <AiFillLike size={20} onClick={handleLike} /> : <AiOutlineLike size={20} onClick={handleLike} />}
                    </div>
                    <div>
                      <p>{postDetails?.desc}</p>
                      <span>Posted: <span>{format(postDetails?.createdAt)}</span></span>
                    </div>
                    <div>
                    <input value={commentText} type="text" placeholder='Type message...' onChange={(e) => setCommentText(e.target.value)}/>
                        <button onClick={handleComment}>Post</button>
                    </div>
                    <div>
                    {
                            comments?.length > 0
                            ? comments.map((comment) => (
                                <Comment key={comment._id} comment={comment} setComments={setComments}/>
                            ))
                            : <h4>No comments. Be the first to leave a comment!</h4>
                        }
                    </div>
                    <ToastContainer />

    </div>
  )
}

export default PostDetails