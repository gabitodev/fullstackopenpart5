import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('Blog form component', () => {
  test('suceeds if the add note details are correct', async () => {

    const mockHandler = jest.fn();

    const { container } = render(<BlogForm createBlog={mockHandler}/>);
    const user = userEvent.setup();
    const inputTitle = screen.getByPlaceholderText('Blog title');
    const inputAuthor = screen.getByPlaceholderText('Blog author');
    const inputUrl = screen.getByPlaceholderText('Blog url');
    const submitButton = container.querySelector('.submitButton');
    await user.type(inputTitle, 'React Patterns');
    await user.type(inputAuthor, 'Michael Moreno');
    await user.type(inputUrl, 'www.michaelteachreact.dev');
    await user.click(submitButton);

    expect(mockHandler.mock.calls).toHaveLength(1);
    expect(mockHandler.mock.calls[0][0].title).toBe('React Patterns');
    expect(mockHandler.mock.calls[0][0].author).toBe('Michael Moreno');
    expect(mockHandler.mock.calls[0][0].url).toBe('www.michaelteachreact.dev');

  });
});