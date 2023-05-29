import Image from 'next/image'

import PostCard from '@/components/PostCard'


export async function fetchPosts(){
  const res = await fetch('http://localhost:3000/api/post', {cache: 'no-store'})

  return res.json()
}

export default async function Home() {

  const posts = await fetchPosts()
  return (
    <main>
      {posts?.length > 0 && <h2>Social Site</h2>}
     <div>
      {posts?.length > 0 
       ? posts.map((post) => (
        <PostCard key={post._id} post={post}/>
      )) : <h3>No postse</h3>}
     </div>
    </main>
  )
}
