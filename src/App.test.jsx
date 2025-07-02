import { render } from '@testing-library/react';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { describe, it } from 'vitest';

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );
  });
});
