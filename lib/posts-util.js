import fs from "fs";
import matter from "gray-matter";
import path from "path";

const postsDirectory = path.join(process.cwd(), "posts");

// 모든 카테고리(폴더) 목록 가져오기
export function getAllCategories() {
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

// 특정 카테고리의 포스트 파일 목록 가져오기
export function getPostsFiles(category) {
  const categoryPath = path.join(postsDirectory, category);
  if (!fs.existsSync(categoryPath)) {
    return [];
  }
  return fs.readdirSync(categoryPath).filter((file) => file.endsWith(".md"));
}

// 모든 카테고리의 모든 포스트 파일 가져오기 (category 정보 포함)
export function getAllPostsFiles() {
  const categories = getAllCategories();
  const allFiles = [];

  for (const category of categories) {
    const files = getPostsFiles(category);
    for (const file of files) {
      allFiles.push({ category, fileName: file });
    }
  }

  return allFiles;
}

// 특정 포스트 데이터 가져오기
export function getPostData(category, postIdentifier) {
  const postSlug = postIdentifier.replace(/\.md$/, "");
  const filePath = path.join(postsDirectory, category, `${postSlug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const postData = {
    slug: postSlug,
    category,
    ...data,
    content,
  };
  return postData;
}

// 모든 포스트 가져오기
export function getAllPosts() {
  const allPostsFiles = getAllPostsFiles();

  const allPosts = allPostsFiles.map(({ category, fileName }) => {
    return getPostData(category, fileName);
  });

  const sortedPosts = allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));

  return sortedPosts;
}

// 특정 카테고리의 포스트 가져오기
export function getPostsByCategory(category) {
  const postFiles = getPostsFiles(category);

  const posts = postFiles.map((fileName) => {
    return getPostData(category, fileName);
  });

  const sortedPosts = posts.sort((a, b) => (a.date > b.date ? -1 : 1));

  return sortedPosts;
}

// Featured 포스트 가져오기
export function getFeaturedPosts() {
  const allPosts = getAllPosts();

  const featuredPosts = allPosts.filter((post) => post.isFeatured);

  return featuredPosts;
}
