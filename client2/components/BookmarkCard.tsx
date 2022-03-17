import React from "react";

const BookmarkCard: React.FC<{ link: string; tags: string[] }> = ({
  link,
  tags,
}) => {
  return (
    <section>
      <header>
        <a href={link}>link</a>
      </header>
      <ul>
        {tags.map((tag, index) => (
          <li key={index}>{tag}</li>
        ))}
      </ul>
    </section>
  );
};

export default BookmarkCard;
