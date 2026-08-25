import React from "react";
import { Link } from "react-router-dom";

interface SmartLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function SmartLink({ href, className, children, ...props }: SmartLinkProps) {
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className} {...(props as Record<string, unknown>)}>
      {children}
    </Link>
  );
}
