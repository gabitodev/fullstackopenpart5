import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    );
  }, []);

  useEffect(() => {
    const loggedUserJSON =  window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (error) {
      setNotification({
        message: error.response.data.error,
        isError: true
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const blogFormRef = useRef();

  const addBlog = async blogObject => {
    try {
      blogFormRef.current.toggleVisibility();
      const newBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(newBlog));
      setNotification({
        message: `A new blog ${newBlog.title} by ${newBlog.author} was added`,
        isError: false,
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.log(error.response);
      setNotification({
        message: error.response.data.error,
        isError: true,
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const updateBlog = async ({ id }) => {
    try {
      const updatedBlog = await blogService.update(id);
      setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog));
    } catch (error) {
      console.log(error.response);
      setNotification({
        message: error.response.data.error,
        isError: true,
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const removeBlog = async ({ id, title, author }) => {
    try {
      if (window.confirm(`Remove blog ${title} by ${author}`)) {
        await blogService.remove(id);
        setBlogs(blogs.filter(blog => blog.id !== id));
        setNotification({
          message: 'Blog removed',
          isError: false,
        });
        setTimeout(() => setNotification(null), 5000);
      }
      return;
    } catch (error) {
      console.log(error.response);
      setNotification({
        message: error.response.data.error,
        isError: true,
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      {user === null
        ? <div>
          <h2>Blog app</h2>
          <Notification notification={notification}/>
          <Togglable buttonLabel='Login'>
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Togglable>
        </div>
        : <div>
          <h2>blogs</h2>
          <Notification notification={notification}/>
          <h3>{user.name} logged-in <span><button onClick={handleLogout}>logout</button></span></h3>
          <Togglable buttonLabel='Create Blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog}/>
          </Togglable>
          {sortedBlogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />
          )}
        </div>

      }
    </div>
  );
};

export default App;
