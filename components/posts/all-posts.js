import classes from "./all-posts.module.css";
import PostsGrid from "./posts-grid";

export default function AllPosts(props) {
  const { posts, title = "All Posts" } = props;
  return (
    <section className={classes.posts}>
      <h1>{title}</h1>
      <PostsGrid posts={posts} />
    </section>
  );
}
