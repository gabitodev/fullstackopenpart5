import { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={addBlog} className='blogForm' >
      <div>
        title
        <input
          id='title-input'
          type="text"
          name='title'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder='Blog title'
        />
      </div>
      <div>
        author
        <input
          id='author-input'
          type="text"
          name='author'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder='Blog author'
        />
      </div>
      <div>
        url
        <input
          id='url-input'
          type="text"
          name='url'
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          placeholder='Blog url'
        />
      </div>
      <button id='create-button' type='submit'>Create</button>
    </form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;