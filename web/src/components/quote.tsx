import type { HTMLAttributeAnchorTarget } from "react";

export default function Quote({
  text,
  author,
  date,
  link,
  profile,
  alt,
  target = "_blank",
}: {
  text: string;
  author: string;
  date: string;
  link: string;
  profile: string;
  alt?: string;
  target?: HTMLAttributeAnchorTarget;
}) {
  return (
    <figure>
      <a href={link} target={target}>
        <figcaption className="flex flex-col">
          <img
            src={profile}
            alt={alt ?? `${author}'s profile picture`}
            className="h-4 w-4 rounded-full"
          />
          <div>
            <cite>{author}</cite>
            <br />
            <i>{date}</i>
          </div>
        </figcaption>
        <blockquote>{text}</blockquote>
      </a>
    </figure>
  );
}
