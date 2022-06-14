import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import { postComment, fetchComments } from 'state/comments/commentsSlice';
import { fetchCommentsData } from 'services/commentsAPIServices';

export default function CommentsPage() {
  const dispatch = useAppDispatch();
  const [data, setdata] = useState([
    {
      userId: '02b',
      comId: '017',
      fullName: 'Lily',
      userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
      text: 'I think you have a point🤔',
      avatarUrl: 'https://ui-avatars.com/api/name=Lily&background=random',
      replies: [],
    },
  ]);

  const onSubmitAction = (e) => {
    const comment = {
      title: e.fullName,
      desciption: e.text,
      created_by: 1,
      parent: 1,
    };
    dispatch(postComment({ comment }));
    console.log('comment', comment);
    console.log('this comment was posted!', e);
  };
  const onReplyAction = (e) => {
    const comment = {
      title: e.fullName,
      desciption: e.text,
      created_by: 1,
      parent: 1,
    };
    console.log('comment', comment);
    console.log('this comment was replayed!', e);
  };
  return (
    <CommentSection
      currentUser={{
        currentUserId: '01a',
        currentUserImg: 'https://ui-avatars.com/api/name=Riya&background=random',
        currentUserProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
        currentUserFullName: 'Riya Negi',
      }}
      logIn={{
        loginLink: 'http://localhost:3001/',
        signupLink: 'http://localhost:3001/',
      }}
      commentData={data}
      onSubmitAction={(data1: {
        userId: string
        comId: string
        avatarUrl: string
        userProfile?: string
        fullName: string
        text: string
        replies: any
      }) => (onSubmitAction(data1))}
      currentData={(data3: any) => {
        console.log('curent data', data3);
      }}
      onDeleteAction={(data2: {
        comIdToDelete: string,
        parentOfDeleteId: string
      }) => (console.log('deleted', data2))}
      onReplyAction={(data3: {
        userId: string
        parentOfRepliedCommentId: string
        repliedToCommentId: string
        avatarUrl: string
        userProfile?: string
        fullName: string
        text: string
      }) => (onReplyAction(data3))}
    />
  );
}
