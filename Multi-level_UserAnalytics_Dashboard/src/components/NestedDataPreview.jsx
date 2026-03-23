import { useEffect, useMemo, useState } from 'react'
import BarChart from './BarChart'
import PieChart from './PieChart'

function NestedDataPreview() {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function fetchAllData() {
      setLoading(true)
      setError('')

      try {
        const [usersRes, postsRes, commentsRes] = await Promise.all([
          fetch('http://localhost:3001/users'),
          fetch('http://localhost:3001/posts'),
          fetch('http://localhost:3001/comments'),
        ])

        if (!usersRes.ok || !postsRes.ok || !commentsRes.ok) {
          throw new Error('Failed to fetch one or more resources from json-server.')
        }

        const [usersData, postsData, commentsData] = await Promise.all([
          usersRes.json(),
          postsRes.json(),
          commentsRes.json(),
        ])

        if (!ignore) {
          setUsers(usersData)
          setPosts(postsData)
          setComments(commentsData)
        }
      } catch (fetchError) {
        if (!ignore) {
          setError(fetchError.message || 'Failed to fetch data.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchAllData()

    return () => {
      ignore = true
    }
  }, [])

  const nestedData = useMemo(() => {
    return users.map((user) => {
      const userPosts = posts
        .filter((post) => String(post.userId) === String(user.id))
        .map((post) => {
          const postComments = comments.filter(
            (comment) => String(comment.postId) === String(post.id),
          )

          return {
            ...post,
            comments: postComments,
          }
        })

      return {
        ...user,
        posts: userPosts,
      }
    })
  }, [users, posts, comments])

  useEffect(() => {
    console.log(nestedData)
  }, [nestedData])

  return (
    <section className="min-h-screen bg-[#102536] px-6 py-8">
<h2 className="mb-6 text-2xl font-bold text-red-500 dark:text-[#8fb2cf]">        Multi-level User Analytics
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <BarChart nestedData={nestedData} />
            <PieChart nestedData={nestedData} />
          </div>
          {nestedData.map((user) => (
            <UserAccordion key={user.id} user={user} />
          ))}
        </div>
      )}
    </section>
  )
}

function UserAccordion({ user }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl bg-white shadow dark:bg-zinc-800">
      <div
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center justify-between border-b p-4 dark:border-zinc-700"
      >
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
          {user.name}{' '}
         
        </h3>
        <span className="text-zinc-700 dark:text-zinc-200">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="space-y-6 p-4">
          {user.posts.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-300">No posts found for this user.</p>
          )}
          {user.posts.map((post) => (
            <PostAccordion key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

function PostAccordion({ post }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-700">
      <div
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer justify-between p-3"
      >
        <p className="font-medium text-zinc-900 dark:text-zinc-100">{post.title}</p>
        <span className="text-zinc-700 dark:text-zinc-200">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="space-y-1 pb-3 pl-4">
          {post.comments.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-300">No comments for this post.</p>
          )}
          {post.comments.map((comment) => (
            <p key={comment.id} className="text-sm text-zinc-600 dark:text-zinc-300">
              • {comment.body}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default NestedDataPreview