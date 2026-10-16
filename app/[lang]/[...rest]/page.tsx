import { notFound } from "next/navigation";

/* Catches every address under /hi or /en that has no page, so the 404 page renders inside the site layout. */
export default function CatchAll() {
  notFound();
}
