import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './userContext';

import '../CSS/comment.css'; // Import the CSS file for styling

function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    body: '',
    userId: '',
  });

  useEffect(() => {
    fetchComments(postId);
  }, [postId]);

   const current_user = JSON.parse(localStorage.getItem("currentUser"));


  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/comments?postId=${postId}`);
      const commentsData = await response.json();
      setComments(commentsData);

      const response1 = await fetch(`http://localhost:3000/comments`);
      const commentsData1 = await response1.json();
      setTotalComments(commentsData1.length);
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewComment({
      ...newComment,
      [name]: value,
    });
  };

  const addComment = async () => {
    try {
      const response = await fetch(`http://localhost:3000/comments?postId=${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: postId,
          id: totalComments + 1,
          email: current_user.email,
          userId: current_user.userId,
          ...newComment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      setTotalComments(totalComments + 1)
      // Clear the input fields after successful comment addition
      setNewComment({
        name: '',
        email: '',
        body: '',
        userId: '',
      });

      // Fetch updated comments after adding a new comment (optional)
      fetchComments(postId);

    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="comments">
      <h3 className="comments-title">Comments:</h3>
      <ul className="comments-list">
        {comments.map(comment => (
          <li key={comment.id} className="comment-item">
            <strong>{comment.name}</strong> - {comment.body}
          </li>
        ))}
      </ul>
      <div className="comment-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newComment.name}
          onChange={handleInputChange}
          className="comment-input"
        />
        <input
          type="text"
          name="body"
          placeholder="Comment"
          value={newComment.body}
          onChange={handleInputChange}
          className="comment-input"
        />
        <button onClick={addComment} className="comment-button">Add Comment</button>
      </div>
    </div>
  );
}

export default Comments;
