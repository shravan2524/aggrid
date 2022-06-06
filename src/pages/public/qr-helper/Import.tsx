/* eslint-disable */
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

import './Import.css';

function Thumbnail(props: any) {
  const { img, isSelected, onSelect } = props;

  const className = `thumbnail ${isSelected ? 'thumbnail-selected' : ''}`;

  return (
    <div
      style={{
        float: 'left',
        textAlign: 'center',
        fontSize: '0.7em',
        marginBottom: '1em',
      }}
    >
      <img src={img} className={className} onClick={onSelect} loading='lazy' alt={img} />
      <br />
      <a href={img} target='_blank'>view</a>
    </div>
  );
}

function File(props) {
  const { name, value, onSelect } = props;

  const doSelect = (idx) => {
    return onSelect(name, idx);
  }

  return (
    <div className='file-stuff'>
      <p className='title'><a href={name} target='_blank'>{name}</a></p>
      {value.map((obj, idx) => {
        return (
          <Thumbnail img={obj.i} isSelected={Boolean(obj.s)} key={idx} onSelect={() => doSelect(idx)} />
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
      const f = el[0], i = el[1], n = el[2], s = '';
      if (!r[f]) {
        r[f] = [];
      }

      r[f].push({ i, n, s });
    });

    setItems(r);
  }, [data]);

  const [noFiles, setNoFiles] = useState(10);

  const onSelectImage = (fileName, imageIdx) => {
    const newItems = { ...items };
    newItems[fileName][imageIdx]['s'] = Boolean(newItems[fileName][imageIdx]['s']) ? '' : 'selected';
    setItems(newItems);
  }

  const exportStuff = () => {
    const wb = XLSX.utils.book_new();
    const dt = [['File', 'Image', 'PageNo', 'Status']];
    Object.keys(items).forEach((k, idx) => {
      items[k].forEach((o) => {
        dt.push([
          k,
          o.i,
          o.n,
          o.s !== '' ? o.s : (noFiles > idx ? 'viewed' : '')
        ]);
      })
    });

    const ws = XLSX.utils.aoa_to_sheet(dt);
    XLSX.utils.book_append_sheet(wb, ws, 'Result', true);
    XLSX.writeFileXLSX(wb, `Result - ${fileName} - ${sheetName} - ${new Date()}.xlsx`);
  }

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

  useEffect(() => {
    const newItems = data.map((el: any) => {
      const f = el[0], i = el[1], n = el[2], s = '';

      return { f, i, n, s };
    });

    setItems(newItems);
  }, [data]);

  const onSelectImage = (imageIdx) => {
    const newItems = [...items];
    newItems[imageIdx]['s'] = Boolean(items[imageIdx]['s']) ? '' : 'selected';
    setItems(newItems);
  }

  const exportStuff = () => {
    const wb = XLSX.utils.book_new();
    const dt = [['File', 'Image', 'PageNo', 'Status']];
    items.forEach((o: any, idx) => {
      dt.push([
        o.f,
        o.i,
        o.n,
        o.s !== '' ? o.s : (noFiles > idx ? 'viewed' : '')
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(dt);
    XLSX.utils.book_append_sheet(wb, ws, 'Result', true);
    XLSX.writeFileXLSX(wb, `Result - ${fileName} - ${sheetName} - ${new Date()}.xlsx`);
  }

  return (<>
    {
      items.map((el: any, idx) => {
        if (idx > noFiles) {
          return <></>;
        }

        return (
          <Thumbnail key={idx} img={el.i} isSelected={Boolean(el.s)} onSelect={() => onSelectImage(idx)} />
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
