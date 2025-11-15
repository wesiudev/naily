import { getDocuments } from "@/firebase";
import EditPostPage from "./EditPostPage";
import { Post } from "@/types";

export default async function Page() {
  const posts = (await getDocuments("blog")) as Post[];
  return <EditPostPage posts={posts} />;
}
