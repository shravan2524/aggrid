import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Button, Modal } from 'react-bootstrap';
import { BACKEND_API } from 'app/config';
import 'react-comments-section/dist/index.css';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import { postComment, fetchComments } from 'state/comments/commentsSlice';
import { fetchCommentsData } from 'services/commentsAPIServices';
import { type } from 'os';
import { tenantUuid } from 'state/tenants/helper';

interface Type {
  date: string;
}

function Date({ date }: Type) {
  const ret = date.slice(8, 10);
  ret.concat(' ');
  const check = date.slice(5, 7);
  let month = '';
  if (check.localeCompare('01') === 0) {
    month = 'January';
  } else if (check.localeCompare('02') === 0) {
    month = 'February';
  } else if (check.localeCompare('03') === 0) {
    month = 'March';
  } else if (check.localeCompare('04') === 0) {
    month = 'April';
  } else if (check.localeCompare('05') === 0) {
    month = 'May';
  } else if (check.localeCompare('06') === 0) {
    month = 'June';
  } else if (check.localeCompare('07') === 0) {
    month = 'July';
  } else if (check.localeCompare('08') === 0) {
    month = 'August';
  } else if (check.localeCompare('09') === 0) {
    month = 'September';
  } else if (check.localeCompare('10') === 0) {
    month = 'October';
  } else if (check.localeCompare('11') === 0) {
    month = 'November';
  } else if (check.localeCompare('12') === 0) {
    month = 'December';
  }
  return (
    <div className="blockquote-footer">
      {ret}
      {' '}
      {month}
      {', '}
      {date.slice(0, 4)}
    </div>
  );
}

export default function CommentsPage() {
  const dispatch = useAppDispatch();
  const [typedcomment, settypedcomment] = useState('');
  const [data, setdata] = useState([
    {
      title: 'a',
      parent: 1,
      description: 'aba',
      createdAt: '22:00',
    },
  ]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleSubmit = () => {
    setShow(false);
  };
  const [state, setstate] = useState(true);
  const onSubmitAction = (e) => {
    e.preventDefault();
    settypedcomment('');
    const Comments = {
      title: 'Finkraft',
      description: typedcomment,
      created_by: 1,
      parent: 1,
    };
    const tComments = {
      title: 'Finkraft',
      description: typedcomment,
      created_by: 1,
      parent: 1,
      createdAt: '220002001',
      updatedAt: '221321321',
      id: 1,
    };
    const tempcomment = data;
    tempcomment.push(tComments);
    setdata(tempcomment);
    dispatch(postComment({ Comments }));
    setstate(!state);
  };
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/comments/`;
    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data1) => {
        setdata(data1);
      });
  }, []);

  useEffect(() => {
    setstate(!state);
  }, []);

  return (
    <>
      <Button variant="primary" onClick={handleShow}><i className="fa fa-comment" /></Button>
      <Modal show={show} onHide={handleClose} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mapping">
          <div>adnakdmadwa</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
