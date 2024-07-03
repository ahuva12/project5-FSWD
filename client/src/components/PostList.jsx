import React, { useState, useEffect, useContext } from 'react';
import '../CSS/PostList.css'; // Import the CSS file for styling
import { UserContext } from './userContext';
import Post from './Post';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [searchCriterion, setSearchCriterion] = useState('ID');
  const [searchValue, setSearchValue] = useState('');
  const [totalPosts, setTotalPosts] = useState(0);
  const [newPost, setNewPost] = useState({
    title: '',
    body: '',
  });

  const { current_user } = useContext(UserContext);

  useEffect(() => {
    fetchPosts();
  }, []);
  

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/?userId=${current_user.id}`);
      const postsData = await response.json();
      setPosts(postsData);
      setTotalPosts(postsData.length);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setPosts(posts.filter(post => post.id !== postId));
      setTotalPosts(totalPosts - 1);
    } catch (error) {
      console.error('Error deleting post:', error);
    }


    try {
      const response = await fetch(`http://localhost:3000/comments?postId=${postId}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      console.error('Error deleting comments:', error);
    }

  };

  const updatePost = async (postId, title, body) => {
    try {
      const updatedPostData = {
        userId: current_user.id,
        id: postId,
        title: title,
        body: body
      };

      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPostData),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      setPosts(posts.map(post => post.id === postId ? { ...post, ...updatedPostData } : post));
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const filterPosts = (posts, criterion, value) => {
    if (!value) return posts;

    switch (criterion) {
      case 'ID':
        return posts.filter(post => post.id === value);
      case 'title':
        return posts.filter(post => post.title.toLowerCase().includes(value.toLowerCase()));
      default:
        return posts;
    }
  };

  const filteredPosts = filterPosts(posts, searchCriterion, searchValue);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPost({
      ...newPost,
      [name]: value,
    });
  };

  const addPost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/?userId=${current_user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: current_user.id,
          title: newPost.title,
          body: newPost.body,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add post');
      }

      setTotalPosts(totalPosts + 1);
      setNewPost({
        title: '',
        body: '',
      });

      fetchPosts(); // Refetch posts after adding
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <div className="post-list-container">
      <h2>User Posts:</h2>

      <label>
        Search by:
        <select value={searchCriterion} onChange={(e) => setSearchCriterion(e.target.value)}>
          <option value="ID">ID</option>
          <option value="title">Title</option>
        </select>&nbsp;
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter search value"
        />
      </label>

      <ul className="post-list">
        {filteredPosts.map(post => (
          <li key={post.postId}>
            <Post post={post} onDelete={deletePost} onUpdate={updatePost} />
          </li>
        ))}
      </ul>

      <div className="post-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newPost.title}
          onChange={handleInputChange}
        />
        <br />
        <input
          type="text"
          name="body"
          placeholder="Content"
          value={newPost.body}
          onChange={handleInputChange}
        />
        <br />
        <button onClick={addPost}>Add Post</button>
      </div>
    </div>
  );
}

export default PostList;
