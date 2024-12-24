import React, { useState, useEffect } from 'react'
import { TwitterPicker } from 'react-color'
import RangeSlider from './range-slider'
import Button from './button'
import { Settings } from '../enum'
import { storageService } from '../lib/localStorage'

interface SidebarProps {
	config: any
	onUpdateConfig: (setting: Settings, value: any) => void
}

const Sidebar: React.FC<SidebarProps> = ({ config, onUpdateConfig }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [names, setNames] = useState<any[]>([])
	const [newName, setNewName] = useState('')
	const [activeTab, setActiveTab] = useState<'settings' | 'names'>('settings')

	useEffect(() => {
		setNames(storageService.getAllNames())
	}, [])

	const handleAddName = (e: React.FormEvent) => {
		e.preventDefault()
		if (newName.trim()) {
			storageService.addName(newName.trim())
			setNames(storageService.getAllNames())
			setNewName('')
		}
	}

	const handleDeleteName = (id: string) => {
		storageService.deleteName(id)
		setNames(storageService.getAllNames())
	}

	return (
		<div
			className={`fixed right-0 top-0 h-full bg-white shadow-lg transition-all z-100 duration-300 ${
				isOpen ? 'w-80' : 'w-12'
			}`}
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="absolute left-0 top-4 transform -translate-x-full bg-white p-2 rounded-l-lg shadow-lg"
			>
				{isOpen ? '→' : '←'}
			</button>

			{isOpen && (
				<div className="h-full flex flex-col">
					{/* Tabs */}
					<div className="flex border-b">
						<button
							className={`flex-1 p-4 ${
								activeTab === 'settings' ? 'bg-gray-100' : ''
							}`}
							onClick={() => setActiveTab('settings')}
						>
							Settings
						</button>
						<button
							className={`flex-1 p-4 ${
								activeTab === 'names' ? 'bg-gray-100' : ''
							}`}
							onClick={() => setActiveTab('names')}
						>
							Names ({names.length})
						</button>
					</div>

					<div className="p-4 overflow-y-auto flex-1">
						{activeTab === 'settings' ? (
							// Settings Tab
							<div>
								{/* Background Color */}
								<div className="mb-4">
									<label className="block mb-2">Background Color</label>
									<TwitterPicker
										color={config.bgColor}
										onChangeComplete={color =>
											onUpdateConfig(Settings.bgColor, color.hex)
										}
									/>
								</div>

								{/* Card Colors */}
								<div className="mb-4">
									<label className="block mb-2">Card Colors</label>
									<TwitterPicker
										color={config.cardBgColor[0]}
										onChangeComplete={color =>
											onUpdateConfig(Settings.cardBgColor, [color.hex])
										}
									/>
								</div>

								{/* Intervals */}
								<div className="mb-4">
									<label className="block mb-2">Shuffle Interval (ms)</label>
									<RangeSlider
										values={[config.shuffleInterval]}
										onChange={values =>
											onUpdateConfig(Settings.shuffleInterval, values[0])
										}
									/>
								</div>

								<div className="mb-4">
									<label className="block mb-2">
										Card Reveal Interval (ms)
									</label>
									<RangeSlider
										values={[config.cardRevealInterval]}
										onChange={values =>
											onUpdateConfig(Settings.cardRevealInterval, values[0])
										}
									/>
								</div>
							</div>
						) : (
							// Names Tab
							<div>
								{/* Add Name Form */}
								<form onSubmit={handleAddName} className="mb-4">
									<div className="flex gap-2">
										<input
											type="text"
											value={newName}
											onChange={e => setNewName(e.target.value)}
											placeholder="Enter name"
											className="flex-1 border rounded px-2 py-1"
										/>
										<Button type="submit">Add</Button>
									</div>
								</form>

								{/* Names List */}
								<div className="space-y-2">
									{names.map(name => (
										<div
											key={name.id}
											className="flex justify-between items-center p-2 bg-gray-50 rounded"
										>
											<span
											// className={
											// 	name.isWinner ? 'text-green-600 font-bold' : ''
											// }
											>
												{name.name}
											</span>
											<button
												onClick={() => handleDeleteName(name.id)}
												className="text-red-500 hover:text-red-700"
											>
												×
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default Sidebar
