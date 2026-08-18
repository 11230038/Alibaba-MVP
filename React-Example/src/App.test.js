import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders supplier console navigation', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/实时汇聚客户会话、Agent 决策与业务卡片的运营驾驶舱/i)).toBeInTheDocument();
});
