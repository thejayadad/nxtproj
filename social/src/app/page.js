import Image from 'next/image'
import { posts } from '@/lib/data'

import PostCard from '@/components/PostCard'

export default function Home() {
  return (
    <main>
      <h2>Social Site</h2>
    {posts.map((post) => (
      <PostCard key={post.desc} post={post} />
    ))}
    </main>
  )
}
