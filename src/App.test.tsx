import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { App } from './App';

describe('Renders main page correctly', () => {
  it('should render the page correctly', () => {
    render(<App />);
    const title = screen.getByText( "Vite + React" );
    const logos = screen.getAllByRole( 'img' );

    expect(title).not.toBeNull();
    expect(logos).toHaveLength(2);
  });
});
