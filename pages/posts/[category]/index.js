import Head from "next/head";

import AllPosts from "@/components/posts/all-posts";
import { getAllCategories, getPostsByCategory } from "@/lib/posts-util";

export default function CategoryPostsPage(props) {
  const { posts, category } = props;

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <>
      <Head>
        <title>{categoryTitle} Posts</title>
        <meta
          name="description"
          content={`All posts about ${categoryTitle}`}
        />
      </Head>
      <AllPosts posts={posts} title={`${categoryTitle} Posts`} />
    </>
  );
}

export function getStaticProps(context) {
  const { params } = context;
  const { category } = params;

  const posts = getPostsByCategory(category);

  return {
    props: {
      posts,
      category,
    },
    revalidate: 600,
  };
}

export function getStaticPaths() {
  const categories = getAllCategories();

  const paths = categories.map((category) => ({
    params: { category },
  }));

  return {
    paths,
    fallback: false,
  };
}
