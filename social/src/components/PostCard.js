import React from 'react'
import Link from 'next/link'
import Image from "next/image"
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'



const PostCard = ({post: { desc, img}}) => {
    const isLiked = true
  return (
    <div>
        <Link href="/">
            <Image alt="post Image" height="150" width="200" src={img} />
        </Link>
        <div>
            <h3>{desc}</h3>
        </div>
        <div>
            {10}{" "}{
                isLiked ? (<AiFillLike  size={20} />)
                : (<AiOutlineLike  size={20} />)
            }
        </div>

    </div>
  )
}

export default PostCard