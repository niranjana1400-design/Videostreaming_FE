const videos = [
  {
    id: 1,
    title: "React Tutorial",
    description: "Learn React step by step",
    category: "Education",
    tags: ["react", "javascript", "frontend"],

    thumbnail:
      "https://campus.w3schools.com/cdn/shop/files/ExcelMySQLPostgreSQLDSANode.jsGitAWSCloudCVueDjango_3_700x700.png?v=1764576929",

    url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",

    uploader: "Admin",
    role: "admin",

    likes: [],
    dislikes: [],
    comments: [],
    views: 0,

    createdAt: new Date().toISOString()
  },

  {
    id: 2,
    title: "Funny Cats",
    description: "Cute and funny cats compilation",
    category: "Comedy",
    tags: ["cats", "funny", "animals"],

    thumbnail: "https://picsum.photos/300/200?2",
    url: "https://www.w3schools.com/html/movie.mp4",

    uploader: "Admin",
    role: "admin",

    likes: [],
    dislikes: [],
    comments: [],
    views: 0,

    createdAt: new Date().toISOString()
  },

  {
    id: 3,
    title: "Chill Music",
    description: "Relaxing music playlist",
    category: "Music",
    tags: ["music", "relax", "lofi"],

    thumbnail: "https://picsum.photos/300/200?3",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",

    uploader: "Admin",
    role: "admin",

    likes: [],
    dislikes: [],
    comments: [],
    views: 0,

    createdAt: new Date().toISOString()
  }
];

export default videos;