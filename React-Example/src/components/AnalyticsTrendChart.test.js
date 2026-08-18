import { render, screen } from '@testing-library/react';
import AnalyticsTrendChart from './AnalyticsTrendChart';

test('shows an empty state when no trend data is available', () => {
  render(<AnalyticsTrendChart data={[]} />);

  expect(screen.getByText('暂无趋势数据')).toBeInTheDocument();
});
