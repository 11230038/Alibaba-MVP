import { render, screen } from '@testing-library/react';
import { BusinessCard } from './BusinessCardRenderers';

test('renders generic card actions as external links', () => {
  render(
    <BusinessCard
      card={{
        type: 'generic',
        title: '物流时效提醒',
        subtitle: '平台提示',
        body: '该客户关注欧洲仓发货时效，建议优先展示 7 日达方案。',
        actionUrl: 'https://example.com/action/logistics',
      }}
    />,
  );

  const actionLink = screen.getByRole('link', { name: '查看动作' });
  expect(actionLink).toHaveAttribute('href', 'https://example.com/action/logistics');
  expect(actionLink).toHaveAttribute('target', '_blank');
});
