import { render } from '@testing-library/react';
import { marked } from 'marked';
import AnalysisMarkdown from './AnalysisMarkdown';

afterEach(() => {
  jest.restoreAllMocks();
});

test('memoizes markdown parsing for unchanged content', () => {
  const parseSpy = jest.spyOn(marked, 'parse').mockReturnValue('<p>ok</p>');
  const { rerender } = render(<AnalysisMarkdown content="### 标题" />);

  expect(parseSpy).toHaveBeenCalledTimes(1);

  rerender(<AnalysisMarkdown content="### 标题" />);
  expect(parseSpy).toHaveBeenCalledTimes(1);

  rerender(<AnalysisMarkdown content="### 另一个标题" />);
  expect(parseSpy).toHaveBeenCalledTimes(2);
});
