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
interface File {
  fileId: string;
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

export default function CommentsPage({ fileId }: File) {
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
      createdBy: 1,
      parent: 1,
      modelName: 'Files',
      modelId: fileId,
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
    console.log(tempcomment);
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
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/comments/${fileId}/Files`;
    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data1) => {
        console.log(data1, apiUrl);
        setdata(data1);
      });
    console.log(data);
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
          <div className="d-flex justify-content-center">
            <div className="d-flex w-50 justify-content-between p-3">
              <input type="text" className="w-75 px-5" onChange={(e) => settypedcomment(e.target.value)} value={typedcomment} />
              <button type="button" className="btn btn-primary" onClick={(e) => onSubmitAction(e)}>Comment</button>
            </div>
          </div>
          <div>
            {
          data
            ? data.map((e, i) => (
              <div key={i} className="card mb-4 w-50 d-flex justify-content-center" id="cards">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex flex-row align-items-center w-100">
                      <div className="d-flex justify-content-between w-100">
                        <p className="small mb-0 ms-2">{e.title}</p>
                        <Date date={e.createdAt} />
                      </div>
                    </div>
                  </div>
                  <p>{e.description}</p>
                </div>
              </div>
            ))
            : <div><p>No Commments</p></div>
        }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
