import React from "react";
import { useDropzone } from "react-dropzone";
import Button from "./button";

const Dropzone = () => {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: "text/csv",
    maxFiles: 1,
  });

  return (
    <div>
      <div
        {...getRootProps({ className: "dropzone" })}
        className="text-center p-6 cursor-pointer mb-6 border-primary border-dashed border-2"
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop file here, or click to select a file</p>
        <em>(Only *.csv will be accepted)</em>
      </div>
      <div>
        <div className="flex flex-col mb-6">
          {Boolean(acceptedFiles.length) && (
            <span>
              {acceptedFiles[0].name} - {acceptedFiles[0].size} bytes
            </span>
          )}
          {Boolean(acceptedFiles.length) && (
            <span className="text-green-500">
              File looks good! Ready to upload.
            </span>
          )}
          {Boolean(fileRejections.length) && (
            <span className="text-red-500">
              Oh no no. Only a csv file is allowed.
            </span>
          )}
        </div>
        <Button>IMPORT</Button>
      </div>
    </div>
  );
};

export default Dropzone;
