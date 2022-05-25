import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `bearer ${newToken}`;
};

const create = async blogObject => {
  const config = {
    headers: { Authorization: token }
  };
  const { data } = await axios.post(baseUrl, blogObject, config);
  return data;
};

const update = async (id) => {
  const config = {
    headers: { Authorization: token }
  };
  const { data } = await axios.patch(`${baseUrl}/${id}`, {}, config);
  return data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  };
  const { data } = await axios.delete(`${baseUrl}/${id}`, config);
  return data;
};


const getAll = async () => {
  const { data } = await axios.get(baseUrl);
  return data;
};

const blogService = { getAll, create, setToken, update, remove };

export default blogService;