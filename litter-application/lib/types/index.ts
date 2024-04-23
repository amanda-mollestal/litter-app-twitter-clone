export type Lit = {
  user_id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  content: string
  created_at: string
  id: string
  comment_count: number
  like_count: number
}

export type Comment = {
  user_id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  content: string
  created_at: string
  id: string
  parent_lit_id: string
  like_count: number
}
