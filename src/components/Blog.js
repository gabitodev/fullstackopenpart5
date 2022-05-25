import { useState } from 'react';

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  const pStyle = {
    padding: 0,
    margin: 0
  };

  const handleLike = (id) => {
    updateBlog({
      id
    });
  };

  const handleRemove = ({ id, title, author }) => {
    removeBlog({
      id,
      title,
      author
    });
  };

  const showDetails = () => {
    if (visible) {
      return (
        <div>
          <p style={pStyle}>{blog.url}</p>
          <p style={pStyle}>Likes {blog.likes} <span><button className='likeButton' onClick={() => handleLike(blog.id)}>Like</button></span></p>
          <p style={pStyle}>{blog.user.username}</p>
          {blog.user.username === user.username
            ? <button onClick={() => handleRemove(blog)}>Remove</button>
            : ''
          }
        </div>
      );
    } else {
      return;
    }
  };

  return (
    <div style={blogStyle} className='blog'>
      <div>
        <h4 style={pStyle}>{blog.title} by {blog.author}<span><button className='viewButton' onClick={toggleVisibility}>{visible ? 'Hide' : 'View'}</button></span></h4>
      </div>
      {showDetails()}
    </div>
  );
};

export default Blog;