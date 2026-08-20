import { getGithubStars } from "@/lib/github-stars";
import { Nav } from "./Nav";

export async function SiteNav() {
  const stars = await getGithubStars();
  return <Nav stars={stars} />;
}
