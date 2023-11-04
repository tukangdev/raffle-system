import React from 'react'
import { useDropzone } from 'react-dropzone'
import { readString } from 'react-papaparse'
import { useCreateName } from '../queries'
import Button from './button'

type DropzoneProps = {
	wrapperclass?: string
	onSuccess: Function
}

const Dropzone = (props: DropzoneProps) => {
	const { isSuccess, mutate: create } = useCreateName()
	const [file, setFile] = React.useState<File>()
	const [showError, setShowError] = React.useState(false)
	const [errorMessage, setErrorMessage] = React.useState('')
	const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
		useDropzone({
			accept: 'text/csv',
			maxFiles: 1,
			onDropAccepted: files => {
				setFile(files[0])
				setShowError(false)
			},
		})

	React.useEffect(() => {
		if (isSuccess) {
			props.onSuccess()
		}
	}, [isSuccess])

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (file) {
			const reader = new FileReader()
			reader.onload = function (e) {
				let csvString = e.target?.result?.toString()

				if (csvString) {
					const json = readString(e.target?.result as string)
					create({ names: json.data.flat() as string[] })
				}
			}
			reader.readAsText(file)
		} else {
			setErrorMessage('No CSV file uploaded.')
			setShowError(true)
		}
		e.preventDefault()
	}

	return (
		<div>
			<div
				{...getRootProps({ className: 'dropzone' })}
				className={`text-center p-6 cursor-pointer mb-6 border-primary border-dashed border-2 ${props.wrapperclass}`}
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
					{showError && <span className="text-red-500">{errorMessage}</span>}
				</div>
				<Button onClick={handleSubmit}>IMPORT</Button>
			</div>
		</div>
	)
}

export default Dropzone
