import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoUsers = [
  {
    email: "author.demo@spotlightsurge.dev",
    name: "Author Demo",
    role: "AUTHOR",
    password: "AuthorDemo123!",
    bio: "Demo author account for testing dashboard and publishing flow.",
    website: "https://example.com/author-demo",
    location: "Lagos, Nigeria",
    profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    email: "reader.demo@spotlightsurge.dev",
    name: "Reader Demo",
    role: "READER",
    password: "ReaderDemo123!",
    bio: "",
    website: "",
    location: "",
    profileImageUrl: ""
  }
];

const seededAuthors = [
  {
    email: "amaya.hart@spotlightsurge.dev",
    name: "Amaya Hart",
    role: "AUTHOR",
    password: "SpotlightAuthor123!",
    bio: "Amaya Hart writes contemporary fiction rooted in family, migration, and second chances. Her work blends sharp dialogue with luminous, character-driven storytelling.",
    website: "https://example.com/amaya-hart",
    location: "Accra, Ghana",
    profileImageUrl: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    email: "julian.okeefe@spotlightsurge.dev",
    name: "Julian O’Keefe",
    role: "AUTHOR",
    password: "SpotlightAuthor123!",
    bio: "Julian O’Keefe crafts literary thrillers with high emotional stakes. He is drawn to mysteries where the biggest clue is what a character refuses to say.",
    website: "https://example.com/julian-okeefe",
    location: "Dublin, Ireland",
    profileImageUrl: "https://randomuser.me/api/portraits/men/14.jpg"
  },
  {
    email: "nadia.karim@spotlightsurge.dev",
    name: "Nadia Karim",
    role: "AUTHOR",
    password: "SpotlightAuthor123!",
    bio: "Nadia Karim writes speculative fiction about identity, technology, and belonging. Her stories imagine near-future worlds where community is the ultimate superpower.",
    website: "https://example.com/nadia-karim",
    location: "Toronto, Canada",
    profileImageUrl: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    email: "ezra.chen@spotlightsurge.dev",
    name: "Ezra Chen",
    role: "AUTHOR",
    password: "SpotlightAuthor123!",
    bio: "Ezra Chen writes narrative nonfiction and essays on craft, creativity, and work. He loves turning research into page-turning, practical insight.",
    website: "https://example.com/ezra-chen",
    location: "Singapore",
    profileImageUrl: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    email: "siena.morales@spotlightsurge.dev",
    name: "Siena Morales",
    role: "AUTHOR",
    password: "SpotlightAuthor123!",
    bio: "Siena Morales writes romance with big laughs and bigger feelings. Her books celebrate friendship, found family, and love that shows up on the hard days.",
    website: "https://example.com/siena-morales",
    location: "Mexico City, Mexico",
    profileImageUrl: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    email: "tariq.alhassan@spotlightsurge.dev",
    name: "Tariq Al-Hassan",
    role: "AUTHOR",
    password: "SpotlightAuthor123!",
    bio: "Tariq Al-Hassan writes epic fantasy and myth retellings inspired by desert folklore. His stories explore duty, exile, and the cost of power.",
    website: "https://example.com/tariq-alhassan",
    location: "Amman, Jordan",
    profileImageUrl: "https://randomuser.me/api/portraits/men/73.jpg"
  },
  {
    email: "claire.bennett@spotlightsurge.dev",
    name: "Claire Bennett",
    role: "AUTHOR",
    password: "SpotlightAuthor123!",
    bio: "Claire Bennett writes cozy mysteries set in small towns with big secrets. Her books pair clever puzzles with warm community dynamics.",
    website: "https://example.com/claire-bennett",
    location: "Bath, UK",
    profileImageUrl: "https://randomuser.me/api/portraits/women/29.jpg"
  },
  {
    email: "ibrahim.saeed@spotlightsurge.dev",
    name: "Ibrahim Saeed",
    role: "AUTHOR",
    password: "SpotlightAuthor123!",
    bio: "Ibrahim Saeed writes historical fiction that bridges archives and imagination. He is fascinated by the lives that history footnotes but fiction can restore.",
    website: "https://example.com/ibrahim-saeed",
    location: "Cairo, Egypt",
    profileImageUrl: "https://randomuser.me/api/portraits/men/58.jpg"
  },
  {
    email: "mina.patel@spotlightsurge.dev",
    name: "Mina Patel",
    role: "AUTHOR",
    password: "SpotlightAuthor123!",
    bio: "Mina Patel writes young adult stories about ambition, friendship, and the courage to be seen. Her work centers teens finding their voice and their people.",
    website: "https://example.com/mina-patel",
    location: "Mumbai, India",
    profileImageUrl: "https://randomuser.me/api/portraits/women/51.jpg"
  },
  {
    email: "lucas.andersen@spotlightsurge.dev",
    name: "Lucas Andersen",
    role: "AUTHOR",
    password: "SpotlightAuthor123!",
    bio: "Lucas Andersen writes science fiction that starts with wonder and ends with meaning. He loves stories where the universe expands and the heart follows.",
    website: "https://example.com/lucas-andersen",
    location: "Copenhagen, Denmark",
    profileImageUrl: "https://randomuser.me/api/portraits/men/19.jpg"
  }
];

function pick(list, index) {
  return list[index % list.length];
}

function makeBooksFor(author, offset) {
  const genres = [
    "Contemporary Fiction",
    "Literary Thriller",
    "Speculative Fiction",
    "Narrative Nonfiction",
    "Romance",
    "Epic Fantasy",
    "Cozy Mystery",
    "Historical Fiction",
    "Young Adult",
    "Science Fiction"
  ];

  const coverImages = [
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80"
  ];

  const year = new Date().getFullYear();

  return [
    {
      title: `${author.name.split(" ")[0]}'s First Light`,
      genre: pick(genres, offset),
      publishedYear: year - 2,
      description: "A vivid journey where a single decision reshapes a life, a family, and the stories they tell themselves.",
      bookFileUrl: `https://example.com/books/${author.email}/first-light.pdf`,
      coverImageUrl: pick(coverImages, offset)
    },
    {
      title: "Letters to the Quiet City",
      genre: pick(genres, offset + 1),
      publishedYear: year - 1,
      description: "A layered story about love, legacy, and the courage it takes to start again when everything feels unfinished.",
      bookFileUrl: `https://example.com/books/${author.email}/quiet-city.pdf`,
      coverImageUrl: pick(coverImages, offset + 1)
    },
    {
      title: "The Map Between Us",
      genre: pick(genres, offset + 2),
      publishedYear: year,
      description: "A fast-moving, heartfelt narrative exploring distance, devotion, and the invisible lines that bind us.",
      bookFileUrl: `https://example.com/books/${author.email}/map-between-us.pdf`,
      coverImageUrl: pick(coverImages, offset + 2)
    }
  ];
}

function makePostsFor(author, offset) {
  const coverImages = [
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"
  ];

  return [
    {
      title: "On finding the first sentence",
      category: "Writing",
      excerpt: "The first sentence is a promise. Here’s how I find one that keeps me honest to the story.",
      content:
        "Every draft begins with a question: what truth do I want to hold in my hands by the end? I don’t chase a clever opener. I chase clarity. I write ten starts that fail, then I read them aloud until the one that feels inevitable appears. If it sounds like a door opening, I keep it.",
      coverImage: pick(coverImages, offset),
      isPublished: true
    },
    {
      title: "Three scenes I never cut",
      category: "Behind the Scenes",
      excerpt: "Some scenes exist to teach the story how to breathe. These are the ones I protect.",
      content:
        "I’m ruthless with cuts, but a few scenes are the spine of the book: the moment a character chooses honesty, the moment they pay for it, and the moment they forgive themselves. If those survive revision, everything else can change shape around them.",
      coverImage: pick(coverImages, offset + 1),
      isPublished: true
    },
    {
      title: "What I’m reading this month",
      category: "Reading List",
      excerpt: "A short stack of books that kept me turning pages and thinking long after.",
      content:
        "I’m drawn to stories with strong interiority and generous worldbuilding. This month I’m reading work that balances momentum with meaning: a tender contemporary, a sharp mystery, and an essay collection that reminded me why sentences matter.",
      coverImage: pick(coverImages, offset + 2),
      isPublished: true
    }
  ];
}

async function main() {
  const allUsers = [...demoUsers, ...seededAuthors];

  for (const [index, user] of allUsers.entries()) {
    const passwordHash = await bcrypt.hash(user.password, 12);

    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
        bio: user.bio,
        website: user.website,
        location: user.location,
        profileImageUrl: user.profileImageUrl
      },
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHash,
        bio: user.bio,
        website: user.website,
        location: user.location,
        profileImageUrl: user.profileImageUrl
      }
    });

    console.log(`Upserted ${record.role} user: ${record.email}`);

    if (record.role !== "AUTHOR" && record.role !== "ADMIN") {
      continue;
    }

    await prisma.book.deleteMany({ where: { authorId: record.id } });
    await prisma.post.deleteMany({ where: { authorId: record.id } });

    const books = makeBooksFor(user, index);
    const posts = makePostsFor(user, index);

    await prisma.book.createMany({
      data: books.map((book) => ({
        authorId: record.id,
        title: book.title,
        description: book.description,
        genre: book.genre,
        publishedYear: book.publishedYear,
        bookFileUrl: book.bookFileUrl,
        coverImageUrl: book.coverImageUrl
      }))
    });

    await prisma.post.createMany({
      data: posts.map((post) => ({
        authorId: record.id,
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        isPublished: post.isPublished
      }))
    });

    console.log(`Seeded content for author: ${record.name}`);
  }
}

main()
  .catch((error) => {
    console.error("Failed to create demo users", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
