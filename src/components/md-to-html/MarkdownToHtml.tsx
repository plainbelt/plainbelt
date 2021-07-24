/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import marked from 'marked';
import { ipcRenderer, clipboard } from 'electron';

const Md2Html = () => {
  const [md, setMd] = useState('# Hello\n> This is a quote');
  const [preview, setPreview] = useState(true);
  const [opening, setOpening] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (evt: { target: { value: string } }) =>
    setMd(evt.target.value);

  const handleOpen = async () => {
    setOpening(true);
    const filters = [
      { name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] },
    ];
    const content = await ipcRenderer.invoke('open-file', filters);
    setMd(Buffer.from(content).toString());
    setOpening(false);
  };

  const handleClipboard = () => {
    setMd(clipboard.readText());
  };

  const handleCopy = () => {
    setCopied(true);
    clipboard.write({ text: marked(md) });
    setTimeout(() => setCopied(false), 500);
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex justify-between mb-1">
        <span className="flex space-x-2">
          <button type="button" className="btn" onClick={handleClipboard}>
            Clipboard
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleOpen}
            disabled={opening}
          >
            Open...
          </button>
        </span>
        <span className="flex space-x-2">
          <button
            type="button"
            className="btn"
            onClick={() => setPreview(!preview)}
          >
            {preview ? 'Raw HTML' : 'Preview'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleCopy}
            disabled={copied}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </span>
      </div>
      <div className="flex min-h-full flex-1">
        <textarea
          onChange={handleChange}
          className="flex-1 min-h-full bg-white p-4 rounded-md"
          value={md}
          disabled={opening}
        />
        <div className="mx-1" />
        {preview ? (
          <section
            className="flex-1 min-h-full bg-gray-100 p-4 prose w-full rounded-md"
            dangerouslySetInnerHTML={{ __html: marked(md) }}
          />
        ) : (
          <textarea
            className="flex-1 min-h-full bg-gray-100 p-4 rounded-md"
            value={marked(md)}
            readOnly
          />
        )}
      </div>
    </div>
  );
};

export default Md2Html;
