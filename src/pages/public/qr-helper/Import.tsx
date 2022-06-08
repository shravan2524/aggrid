/* eslint-disable */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

import './Import.css';

const autoSaveInterval = 300 * 1000;

type ImgWH = {
  w: number;
  h: number;
};

type CoordinatesCb = (s: Coordinate, e: Coordinate) => void;
interface CanvasProps {
  imgWH: ImgWH;
  onCoordinatesChange: CoordinatesCb;
}

type Coordinate = {
  x: number;
  y: number;
};

type Coordinates = {
  s: Coordinate;
  e: Coordinate;
}

const Canvas = ({ imgWH, onCoordinatesChange }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);

  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setMousePosition(coordinates);
      setIsPainting(true);
      clearCanvas();
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousedown', startPaint);
    return () => {
      canvas.removeEventListener('mousedown', startPaint);
    };
  }, [startPaint]);

  const paint = useCallback(
    (event: MouseEvent) => {
      if (isPainting) {
        const newMousePosition = getCoordinates(event);

        if (mousePosition && newMousePosition) {
          onCoordinatesChange(mousePosition, newMousePosition);
          draw(mousePosition, newMousePosition);
          // setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition]
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousemove', paint);
    return () => {
      canvas.removeEventListener('mousemove', paint);
    };
  }, [paint]);

  const exitPaint = useCallback(() => {
    setIsPainting(false);
    setMousePosition(undefined);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);
    return () => {
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);
    };
  }, [exitPaint]);

  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }

    // console.log('modal', modal.offsetLeft, modal.offsetTop);
    // console.log('canvas', canvas.offsetLeft, canvas.offsetTop);
    // console.log('event', event.offsetX, event.offsetY);

    // console.log(event.pageX, canvas.offsetLeft, event.pageY, canvas.offsetTop);

    // return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop };
    return { x: event.offsetX, y: event.offsetY };
  };

  const escapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      clearCanvas();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escapeKey);
    return () => {
      document.removeEventListener('keydown', escapeKey);
    }
  }, [escapeKey]);

  const clearCanvas = () => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, imgWH.w, imgWH.h);
      // context.stroke();
    }
  }

  const draw = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.strokeStyle = 'red';
      context.lineJoin = 'round';
      context.lineWidth = 1;

      context.clearRect(0, 0, imgWH.w, imgWH.h);
      context.beginPath();
      // // this is for line
      // context.moveTo(originalMousePosition.x, originalMousePosition.y);
      // context.lineTo(newMousePosition.x, newMousePosition.y);
      // context.closePath();
      context.rect(
        originalMousePosition.x, originalMousePosition.y,
        newMousePosition.x - originalMousePosition.x, newMousePosition.y - originalMousePosition.y
      );

      context.stroke();
    }
  };

  return <canvas ref={canvasRef} height={imgWH.h} width={imgWH.w} style={{ position: 'absolute', left: '0', zIndex: '1000000' }} />;
};

function Thumbnail(props: any) {
  const { img, isSelected, onSelect } = props;
  const [showModal, setShowModal] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>();

  const className = `thumbnail ${isSelected === 'selected' ? 'thumbnail-selected' : ''} cursor-pointer`;

  const [imgWH, setImgWH] = useState({
    w: 0,
    h: 0,
  });

  const onImgLoad = ({ target: img }) => {
    const { offsetHeight, offsetWidth } = img;
    setImgWH({
      w: offsetWidth,
      h: offsetHeight,
    });
  };

  return (
    <div
      style={{
        float: 'left',
        textAlign: 'center',
        fontSize: '0.7em',
        marginBottom: '1em',
      }}
    >

      <div style={{ position: 'relative' }}>
        <img src={img} className={className} onClick={() => setShowModal(!showModal)} loading='lazy' alt={img} />
        <button className='btn btn-sm btn-primary px-2' onClick={() => onSelect()} style={{ position: 'absolute', left: 0, top: 0 }}>{isSelected ? 'u' : 's'}</button>
      </div>
      {(showModal === true) && (
        <div className="modal d-inline-block" tabIndex={-1} role="dialog" data-show={showModal}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <a className="modal-title" id="exampleModalLabel" href={img} target="_blank">{img}</a>
                <div className="float-right">
                  <button type="button" className="btn btn-primary m-1" onClick={() => { onSelect({ c: coordinates, wh: imgWH }); setShowModal(false); }}>{isSelected === 'selected' ? 'Unselect' : 'Select'}</button>
                  <button type="button" className="btn btn-secondary m-1" data-dismiss="modal" onClick={() => setShowModal(false)}>X</button>
                </div>
              </div>
              <div className="modal-body">
                <div style={{ position: 'relative', height: imgWH.h }}>
                  <img src={img} onLoad={onImgLoad} style={{ maxWidth: '750px', position: 'absolute', left: '0' }} onClick={() => setShowModal(!showModal)} loading='lazy' alt={img} />
                  <Canvas imgWH={imgWH} onCoordinatesChange={(s, e) => setCoordinates({ s, e })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => { onSelect({ c: coordinates, wh: imgWH }); setShowModal(false); }}>{isSelected === 'selected' ? 'Unselect' : 'Select'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <br /> */}
      {/* <a href={img} target='_blank'>view</a> */}
    </div>
  );
}

function File(props) {
  const { name, value, onSelect } = props;

  const doSelect = (idx, c) => {
    return onSelect(name, idx, c);
  }

  return (
    <div className='file-stuff'>
      <p className='title'><a href={name} target='_blank'>{name}</a></p>
      {value.map((obj, idx) => {
        return (
          <Thumbnail img={obj.i} isSelected={obj.s} key={idx} onSelect={(c) => doSelect(idx, c)} />
        )
      })}
      <div style={{ clear: 'both' }} ></div>
    </div>);
}

function ImportOld(props) {
  const { data, fileName, sheetName } = props;
  const [items, setItems] = useState<any>({});

  useEffect(() => {
    const r = {};
    data.forEach((el) => {
      const f = el[0], i = el[1], n = el[2], s = el[3] || '', c = el[4] || '';
      if (!r[f]) {
        r[f] = [];
      }

      r[f].push({ i, n, s, c });
    });

    setItems(r);
  }, [data]);

  const [noFiles, setNoFiles] = useState(10);

  const onSelectImage = (fileName, imageIdx, coordinates) => {
    const newItems = { ...items };
    newItems[fileName][imageIdx]['s'] = Boolean(newItems[fileName][imageIdx]['s']) ? '' : 'selected';
    newItems[fileName][imageIdx]['c'] = JSON.stringify(coordinates);
    setItems(newItems);
  }

  const exportStuff = () => {
    if (!fileName || !sheetName) {
      return;
    }

    const wb = XLSX.utils.book_new();
    const dt = [['File', 'Image', 'PageNo', 'Status', 'Coordinates']];
    Object.keys(items).forEach((k, idx) => {
      items[k].forEach((o) => {
        dt.push([
          k,
          o.i,
          o.n,
          o.s !== '' ? o.s : (noFiles > idx ? 'viewed' : ''),
          o.c,
        ]);
      })
    });

    const ws = XLSX.utils.aoa_to_sheet(dt);
    XLSX.utils.book_append_sheet(wb, ws, 'Result', true);
    XLSX.writeFileXLSX(wb, `Result - ${fileName} - ${sheetName} - ${new Date()}.xlsx`);
  }

  useEffect(() => {
    const interval = setInterval(exportStuff, autoSaveInterval);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {
        Object.keys(items).map((k, idx) => {
          if (idx > noFiles) {
            return null;
          }

          return (
            <File key={idx} name={k} value={items[k]} onSelect={onSelectImage} />
          );
        })
      }
      <div style={{ height: '4em', clear: 'both' }}>&nbsp;</div>
      {(sheetName !== '') &&
        <div className='p-3 fixed-bottom text-center' style={{ backgroundColor: '#f0f0f0', borderTop: '1px solid #000' }}>
          <button onClick={() => setNoFiles(noFiles + 10)} className='p-1 w-25 btn btn-primary float-left'>Load 10 more files</button>
          <span className='mx-auto'>Showing {noFiles}/{Object.keys(items).length}</span>
          <button onClick={exportStuff} className='btn btn-success w-25 float-right'>Save</button>
        </div>
      }
    </>
  );
}

function ImportNew(props) {

  const numberOfImages = 100;

  const { data, fileName, sheetName } = props;

  const [items, setItems] = useState([{}]);
  const [noFiles, setNoFiles] = useState(numberOfImages);

  const [shiftIsDown, setShiftIsDown] = useState(false);
  const [initialImageIdx, setInitialImageIdx] = useState<number | undefined>();

  useEffect(() => {
    const newItems = data.map((el: any) => {
      const f = el[0], i = el[1], n = el[2], s = el[3] || '', c = el[4] || '';

      return { f, i, n, s, c };
    });

    setItems(newItems);
  }, [data]);

  const shiftKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      setShiftIsDown(true);
    }
  }, []);

  const shiftKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      setShiftIsDown(false);
      setInitialImageIdx(undefined);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', shiftKeyDown);
    document.addEventListener('keyup', shiftKeyUp);
    return () => {
      document.removeEventListener('keydown', shiftKeyDown);
      document.removeEventListener('keyup', shiftKeyUp);
    }
  }, [shiftKeyDown]);

  const onSelectImage = (imageIdx, c) => {
    const newItems = [...items];
    newItems[imageIdx]['s'] = Boolean(items[imageIdx]['s']) ? '' : 'selected';
    newItems[imageIdx]['c'] = JSON.stringify(c);
    // console.log('shiftIsDown', shiftIsDown, initialImageIdx, imageIdx);
    if (!shiftIsDown) {
      setInitialImageIdx(imageIdx);
    } else {
      if (initialImageIdx) {
        for (let i = initialImageIdx + 1; i < imageIdx; i++) {
          newItems[i]['s'] = 'selected';
        }
      }
    }
    setItems(newItems);
  }

  const exportStuff = () => {
    if (!fileName || !sheetName) {
      return;
    }
    const wb = XLSX.utils.book_new();
    const dt = [['File', 'Image', 'PageNo', 'Status', 'Coordinates']];
    items.forEach((o: any, idx) => {
      dt.push([
        o.f,
        o.i,
        o.n,
        o.s !== '' ? o.s : (noFiles > idx ? 'viewed' : ''),
        o.c,
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(dt);
    XLSX.utils.book_append_sheet(wb, ws, 'Result', true);
    XLSX.writeFileXLSX(wb, `Result - ${fileName} - ${sheetName} - ${new Date()}.xlsx`);
  }

  useEffect(() => {
    const interval = setInterval(exportStuff, autoSaveInterval);
    return () => clearInterval(interval);
  }, []);

  return (<>
    {
      items.map((el: any, idx) => {
        if (idx > noFiles) {
          return null;
        }

        return (
          <Thumbnail key={idx} img={el.i} isSelected={el.s} onSelect={(c) => onSelectImage(idx, c)} />
        );
      })
    }
    <div style={{ height: '4em', clear: 'both' }}>&nbsp;</div>
    {(sheetName !== '') &&
      <>
        <div className='p-3 fixed-bottom text-center' style={{ backgroundColor: '#f0f0f0', borderTop: '1px solid #000' }}>
          <button onClick={() => setNoFiles(noFiles + numberOfImages)} className='p-1 w-25 btn btn-primary float-left'>Load {numberOfImages} more images</button>
          <span className='center'>Showing {noFiles}/{Object.keys(items).length}</span>
          <button onClick={exportStuff} className='btn btn-success w-25 float-right'>Save</button>
        </div>
      </>
    }
  </>
  );
}

function Import(props) {
  const [sheetNames, setSheetNames] = useState<Array<String>>([]);
  const [sheetName, setSheetName] = useState('');
  const [wb, setWb] = useState(null);
  const [fileName, setFileName] = useState('');
  const [data, setData] = useState<Array<any>>([]);
  const [noFiles, setNoFiles] = useState(0);
  const [importType, setImportType] = useState(0);

  const onFileUploaded = (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();
    setFileName(file.name);

    reader.onload = (evt: any) => {
      const bstr = evt.target.result;
      const wbX: any = XLSX.read(bstr, { type: "binary" });
      setWb(wbX);
      const sheetNames = [...wbX.SheetNames];
      setSheetNames(sheetNames);
      // const wsname = wb.SheetNames[0];
      // const ws = wb.Sheets[wsname];
      // const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      // console.log(data);
    };
    reader.readAsBinaryString(file);
  }

  const onSheetNameSelected = (e) => {
    const sheetNameX = e.target.value;
    setSheetName(sheetNameX);
    const wbX: any = wb;
    const ws = wbX.Sheets[sheetNameX];
    const dt = XLSX.utils.sheet_to_json(ws, { header: 1 });// skip header
    // then sort the data
    dt.sort((a: any, b: any) => {
      if (a[0] === b[0]) {
        if (a[2] < b[2]) {
          return -1;
        }

        return 1;
      }

      if (a[0] < b[0]) {
        return -1;
      }

      return 1;
    });

    setData(dt);
  }

  // const onSelectImage = (imageIdx) => {
  //   const newItems = [...items];
  //   newItems[imageIdx]['s'] = Boolean(items[imageIdx]['s']) ? '' : 'selected';
  //   setItems(newItems);
  // }

  // const exportStuff = () => {
  //   const wb = XLSX.utils.book_new();
  //   const dt = [['File', 'Image', 'PageNo', 'Status']];
  //   items.forEach((o: any, idx) => {
  //     dt.push([
  //       o.f,
  //       o.i,
  //       o.n,
  //       o.s !== '' ? o.s : (noFiles > idx ? 'viewed' : '')
  //     ]);
  //   });

  //   const ws = XLSX.utils.aoa_to_sheet(dt);
  //   XLSX.utils.book_append_sheet(wb, ws, 'Result', true);
  //   XLSX.writeFileXLSX(wb, `Result - ${fileName} - ${sheetName} - ${new Date()}.xlsx`);
  // }

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      <div style={{ backgroundColor: '#f0f0f0', borderBottom: '1px solid #000', position: 'fixed', width: '100%', marginTop: '-6em' }}>
        <span className='float-left p-3'>
          <span>Select XLSX file </span>
          <input type="file" onChange={onFileUploaded}></input>
          {
            (sheetNames.length > 0) && (
              <>
                <span>Worksheet </span>
                <select onChange={onSheetNameSelected}>
                  <option value="">- select sheet name -</option>
                  {sheetNames.map((el: any, idx) => {
                    return (
                      <option key={idx} value={el}>{el}</option>
                    )
                  })}
                </select>
              </>
            )}
        </span>
        <span className='float-right p-3'>
          <span>View type </span>
          <select onChange={(e) => setImportType(parseInt(e.target.value))}>
            <option value="0">Group</option>
            <option value="1">List</option>
          </select>
        </span>
        <div style={{ clear: 'both' }}></div>
      </div>
      <div style={{ height: '4em' }}></div>
      {/* <table className='table-example'>
        <thead>
          <tr>
            <th>Org_Invoice_URL</th>
            <th>Page_Image_URL</th>
            <th>Page_Number</th>
          </tr>
        </thead>
      </table> */}
      {(importType === 0) && <ImportOld data={data} sheetName={sheetName} fileName={fileName} />}
      {(importType === 1) && <ImportNew data={data} sheetName={sheetName} fileName={fileName} />}
    </div>
  );
}

export default Import;
