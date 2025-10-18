import { Quote } from "lucide-react";

export default function BlockQuote({
  text,
  author,
  date,
}: {
  text: string;
  author: string;
  date: string;
}) {
  return (
    <figure>
      <Quote className="-scale-x-100" />
      <blockquote>{text}</blockquote>
      <figcaption>
        <cite>{author}</cite>: <i>{date}</i>
      </figcaption>
      <Quote />
    </figure>
  );
}
