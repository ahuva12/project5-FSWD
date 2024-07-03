import React, { useState } from 'react';
import Comments from './Comments';
import '../CSS/post.css'; // Import the CSS file for styling

function Post({ post, onDelete, onUpdate }) {
  const [expandedPostIds, setExpandedPostIds] = useState([]);
  const [showCommentsForPost, setShowCommentsForPost] = useState([]);
  const [updatedPost, setUpdatedPost] = useState({
    title: '',
    body: ''
  });

  const toggleExpand = (postId) => {
    if (expandedPostIds.includes(postId)) {
      setExpandedPostIds(expandedPostIds.filter(id => id !== postId));
      setShowCommentsForPost(showCommentsForPost.filter(id => id !== postId));
    } else {
      setExpandedPostIds([...expandedPostIds, postId]);
    }
  };

  const toggleComments = (postId) => {
    if (showCommentsForPost.includes(postId)) {
      setShowCommentsForPost(showCommentsForPost.filter(id => id !== postId));
    } else {
      setShowCommentsForPost([...showCommentsForPost, postId]);
    }
  };

  const isPostExpanded = (postId) => {
    return expandedPostIds.includes(postId);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedPost({
      ...updatedPost,
      [name]: value,
    });
  };

  return (
    <div className="post">
      <strong className="post-title">{post.id}. {post.title}</strong>&nbsp;
      <button className="post-expand-button" onClick={() => toggleExpand(post.id)}>
        {isPostExpanded(post.id) ? 'Hide Post' : 'Show Post'}
      </button>
      {isPostExpanded(post.id) && (
        <div>
          <p className="post-body">{post.body}</p>
          <div className="post-inputs">
            <input
              type="text"
              name="title"
              value={updatedPost.title}
              onChange={handleInputChange}
              placeholder="Enter new title"
            />
            <input
              type="text"
              name="body"
              value={updatedPost.body}
              onChange={handleInputChange}
              placeholder="Enter new body"
            />
            <button className="post-update-button" onClick={() => {
              onUpdate(post.id, updatedPost.title, updatedPost.body);
              setUpdatedPost({ title: '', body: '' });
            }}>Update Post</button>&nbsp;
            <button className="post-delete-button" onClick={() => onDelete(post.id)}>Delete Post</button>
          </div>
          <div className="post-comments-button">
            <button onClick={() => toggleComments(post.id)}>
              {showCommentsForPost.includes(post.id) ? 'Hide Comments' : 'Show Comments'}
            </button>
            {showCommentsForPost.includes(post.id) && (
              <Comments postId={post.id} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
