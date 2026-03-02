export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
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
