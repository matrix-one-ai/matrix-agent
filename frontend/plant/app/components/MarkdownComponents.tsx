import React from "react";

const MarkdownComponents = {
  a: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: "underline",
      }}
    >
      {children}
    </a>
  ),
};

export default MarkdownComponents;
