import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('Blog componet', () => {
  test('renders only title and auhtor at default', () => {
    const user = { username: 'robert123' };
    const blog = {
      title: 'Testing React Apps',
      author: 'Robert Williams',
      url: 'www.robertest.com',
      likes: 1,
      user: { username: 'robert123' }
    };

    const { container } = render(<Blog blog={blog} user={user} />);
    const div = container.querySelector('.blog');
    expect(div).not.toHaveTextContent('www.robertest.com 1');
  });

  test('renders url and likes only when the button controlling the details is clicked', async () => {
    const username = { username: 'robert123' };
    const blog = {
      title: 'Testing React Apps',
      author: 'Robert Williams',
      url: 'www.robertest.com',
      likes: 1,
      user: { username: 'robert123' }
    };

    const { container } = render(<Blog blog={blog} user={username} />);
    const user = userEvent.setup();
    const div = container.querySelector('.blog');
    const button = container.querySelector('.viewButton');
    expect(div).not.toHaveTextContent('www.robertest.com');
    expect(button).toHaveTextContent('View');
    await user.click(button);
    expect(div).toHaveTextContent('www.robertest.com');
    expect(button).toHaveTextContent('Hide');

  });

  test('succeeds if like button is clicked twice', async () => {
    const username = { username: 'robert123' };
    const blog = {
      title: 'Testing React Apps',
      author: 'Robert Williams',
      url: 'www.robertest.com',
      likes: 1,
      user: { username: 'robert123' }
    };

    const mockHandler = jest.fn();

    const { container } = render(<Blog blog={blog} user={username} updateBlog={mockHandler} />);
    const user = userEvent.setup();
    const viewButton = container.querySelector('.viewButton');
    await user.click(viewButton);
    const likeButton = container.querySelector('.likeButton');
    await user.click(likeButton);
    await user.click(likeButton);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});