export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
    location: user.location,
    website: user.website,
    profileImageUrl: user.profileImageUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export function publicBook(book) {
  return {
    id: book.id,
    authorId: book.authorId,
    title: book.title,
    description: book.description,
    genre: book.genre,
    publishedYear: book.publishedYear,
    bookFileUrl: book.bookFileUrl,
    coverImageUrl: book.coverImageUrl,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt
  };
}

export function publicPost(post) {
  return {
    id: post.id,
    authorId: post.authorId,
    title: post.title,
    category: post.category,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    isPublished: post.isPublished,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };
}
