import Head from "next/head";

import PostContent from "@/components/post-detail/post-content";
import { getPostData, getAllPostsFiles } from "@/lib/posts-util";

export default function PostDetailPage(props) {
  return (
    <>
      <Head>
        <title>{props.post.title}</title>
        <meta name="description" content={props.post.excerpt} />
      </Head>
      <PostContent post={props.post} />
    </>
  );
}

export function getStaticProps(context) {
  const { params } = context;
  const { category, slug } = params;

  const post = getPostData(category, slug);

  return {
    props: {
      post,
    },
    revalidate: 600,
  };
}

export function getStaticPaths() {
  const allPostsFiles = getAllPostsFiles();

  const paths = allPostsFiles.map(({ category, fileName }) => ({
    params: {
      category,
      slug: fileName.replace(/\.md$/, ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}
