import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders supplier console navigation', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/把会话和卡片捕获汇总到一个运营驾驶舱/i)).toBeInTheDocument();
});
