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
import './comments.scss';
import { MDBCollapse, MDBBtn } from 'mdb-react-ui-kit';
import { tenantUuid } from 'state/tenants/helper';

interface Type {
  date: string;
}
interface File {
  fileId: string;
}

interface Comment {
  id: number;
  onSubmitAction: Function;
}

function DateMod({ date }: Type) {
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

interface CommentUiType {
  description: string;
  createdAt: string;
  createdBy: string;
}
interface Search {
  inputValue: string;
  applyMention: Function;
  focusInput: Function;
  partialMention: any;
  suggestionList: Array<string>;
}

function Suggestions({
  inputValue, applyMention, focusInput, suggestionList, partialMention,
}: Search) {
  function selectSuggestion(username) {
    const regexp = /@[a-zA-Z0-9]*$/;
    const newValue = inputValue.replace(regexp, username.concat(' '));
    applyMention({ target: { value: newValue } }); // THIS MIMICS AN ONCHANGE EVENT
    focusInput();
  }
  return (
    <div className="container w-100 border border-white" style={{ position: 'relative', right: '18px' }}>
      {suggestionList.filter((item) => item.includes(partialMention)).map((item) => (
        <button type="button" className="item w-100 border border-white text-start" onClick={() => selectSuggestion('@'.concat(item))}>
          @
          {item}
        </button>
      ))}
    </div>
  );
}

function Reply({ id, onSubmitAction }: Comment) {
  const [showShow1, setShowShow1] = useState(false);
  const [typedcomment, settypedcomment] = useState('');
  const toggleShow = () => setShowShow1(!showShow1);
  function submit(e) {
    e.preventDefault();
    onSubmitAction(id, typedcomment);
    settypedcomment('');
  }
  return (
    <>
      <button className="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
        reply
        <i className="fa fa-reply" aria-hidden="true" />
        {' '}
      </button>
      <div className="collapse" id="collapseExample">
        <div className="mb-3 d-flex w-100">
          <input type="text" style={{ width: '83%' }} onChange={(e) => settypedcomment(e.target.value)} value={typedcomment} />
          <button type="button" className="btn btn-sm btn-primary px-4 d-flex gap-2 align-items-center justify-content-center" onClick={(e) => submit(e)}>
            <i className="fa fa-paper-plane">{' '}</i>
          </button>
        </div>
      </div>
    </>
  );
}

function CommentUI({ description, createdAt, createdBy } : CommentUiType) {
  return (
    <div className="card-body">
      <div className="d-flex justify-content-between">
        <div><i className="fas fa-user" style={{ fontSize: '50px' }} /></div>
        <div className="d-flex flex-column align-items-center w-100" id="mg">
          <div className="d-flex justify-content-between w-100">
            <p className="h4 mb-0">{createdBy}</p>
            <DateMod date={createdAt} />
          </div>
          <div className="w-100">
            <p id="pd">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommentsPage({ fileId }: File) {
  const dispatch = useAppDispatch();
  const [typedcomment, settypedcomment] = useState('');
  const [data, setdata] = useState([
    {
      parent: 1,
      description: 'aba',
      createdAt: '22:00',
      createdBy: '22:00',
      id: 123,
      Replies: [{
        parent: 1,
        description: 'aba',
        createdAt: '22:00',
        createdBy: '22:00',
        id: 123,
      },
      ],
    },
  ]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleSubmit = () => {
    setShow(false);
  };
  const [state, setstate] = useState(true);
  async function postreq(Comments) {
    await dispatch(postComment({ Comments, fileId }));
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/files/${fileId}/comments/`;
    await fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data1) => {
        console.log(data1, apiUrl);
        setdata(data1);
        setstate(!state);
      });
  }
  const onSubmitAction = (id, typedcomment1) => {
    console.log(id, typedcomment1);
    settypedcomment('');
    const d = new Date();
    const Comments = {
      description: typedcomment1,
      parent: id,
      modelName: 'Files',
    };
    const tComments = {
      description: typedcomment1,
      createdBy: '1',
      parent: id,
      createdAt: d.toLocaleDateString(),
      updatedAt: d.toLocaleDateString(),
      id: 1,
    };
    const tempcomment = data;
    // tempcomment.push(tComments);
    // setdata(tempcomment);
    console.log(tempcomment);
    // dispatch(postComment({ Comments, fileId }));
    postreq(Comments);
    setstate(!state);
    // const options: RequestInit = {
    //   method: 'GET',
    //   credentials: 'include',
    // };
    // const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/files/${fileId}/comments/`;
    // fetch(apiUrl, options)
    //   .then((response) => response.json())
    //   .then((data1) => {
    //     console.log(data1, apiUrl);
    //     setdata(data1);
    //   });
    // console.log(data);
  };
  const handleShow = () => {
    setShow(true);
  };
  useEffect(() => {
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/files/${fileId}/comments/`;
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
  const inputRef = React.useRef(null);
  const [inputValue, setInputValue] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [partialMention, setPartialMention] = React.useState(null);
  const [suggestionList, setSuggestionList] = React.useState(
    ['johnsmith', 'jennasurname2', 'tuijarajala'],
  );

  const onChange = (event) => {
    settypedcomment(event.target.value);
    const regexp = /@[a-zA-Z0-9]*$/;
    if (regexp.test(event.target.value)) {
      setPartialMention(event.target.value.split('@').pop());
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    setInputValue(event.target.value);
  };

  const focusInput = () => {
    if (inputRef && inputRef.current) {
      // @ts-ignore: Object is possibly 'null'.
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/files/${fileId}/comments/`;
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
      <Button variant="primary" className="btn btn-sm btn-primary" onClick={handleShow}><i className="fa fa-comment" /></Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
        style={{ height: '100%' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mapping h-100">
          <div>
            {
          data
            ? data.map((e, i) => (
              <div key={i} className="card mb-4 d-flex justify-content-center" id="cards">
                <div className="card-body" style={{ paddingBottom: '0rem' }}>
                  <CommentUI description={e.description} createdAt={e.createdAt} createdBy={e.createdBy} />
                </div>
                <div style={{ position: 'relative', bottom: '12px', left: '10px' }}>
                  {
                    e.Replies.map((ee) => (
                      <div className="card-body" id="replies">
                        <CommentUI description={ee.description} createdAt={ee.createdAt} createdBy={ee.createdBy} />
                      </div>
                    ))
                  }
                </div>
                <div style={{ position: 'relative', bottom: '12px', left: '10px' }}>
                  <Reply id={e.id} onSubmitAction={onSubmitAction} />
                </div>
              </div>
            ))
            : <div><p>No Commments</p></div>
        }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="mb-3 d-flex w-100 flex-column-reverse">
            <div className="mb-3 d-flex w-100">
              <input type="text" ref={inputRef} style={{ width: '95%' }} maxLength={250} onChange={onChange} value={typedcomment} />
              <button type="button" className="btn btn-sm btn-primary" onClick={(e) => onSubmitAction(null, typedcomment)}><i className="fa fa-paper-plane">{' '}</i></button>
            </div>
            <div>
              {showSuggestions
                ? (
                  <Suggestions
                    inputValue={inputValue}
                    suggestionList={suggestionList}
                    applyMention={onChange}
                    focusInput={focusInput}
                    partialMention={partialMention}
                  />
                )
                : null}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
