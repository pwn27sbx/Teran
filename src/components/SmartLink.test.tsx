import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SmartLink } from './SmartLink';
import { BrowserRouter } from 'react-router-dom';

describe('SmartLink', () => {
  it('renders external links correctly', () => {
    render(<SmartLink href="https://example.com">External</SmartLink>);
    const link = screen.getByText('External');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders internal links using React Router', () => {
    render(
      <BrowserRouter>
        <SmartLink href="/about">Internal</SmartLink>
      </BrowserRouter>
    );
    const link = screen.getByText('Internal');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/about');
    expect(link).not.toHaveAttribute('target');
  });
});
