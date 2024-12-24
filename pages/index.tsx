import React from 'react'
import Head from 'next/head'
import Confetti from 'react-confetti'
import { useWindowSize } from '../lib/useWindowResize'
import { storageService } from '../lib/localStorage'
import Sidebar from '../components/sidebar'
import Button from '../components/button'
import { Settings } from '../enum'
import { timeout } from '../lib/helpers'

export default function Home() {
	const { width, height } = useWindowSize()

	const [cursorInArea, setCursorInArea] = React.useState(false)
	const [isShuffle, setIsShuffle] = React.useState(false)
	const [isSelectCard, setIsSelectCard] = React.useState(false)
	const [flipCard, setFlipCard] = React.useState(false)
	const [randomName, setRandomName] = React.useState<any>(null)

	const [config, setConfig] = React.useState(storageService.getConfig())

	React.useEffect(() => {
		setConfig(storageService.getConfig())
	}, [])

	const handleConfigUpdate = (setting: Settings, value: any) => {
		const newConfig = storageService.updateConfig({ [setting]: value })
		setConfig(newConfig)
	}

	const getRandomName = () => {
		const names = storageService.getAllNames()
		// .filter(name => !name.isWinner)
		if (names.length === 0) return null

		const randomIndex = Math.floor(Math.random() * names.length)
		return names[randomIndex]
	}

	const updateWinnerName = (winner: any) => {
		if (winner) {
			storageService.updateName(winner.id, { isWinner: true })
		}
	}

	const startInterval = () =>
		new Promise(async (resolve: any) => {
			setIsShuffle(true)
			await timeout(config.shuffleInterval || 3000)
			setIsSelectCard(true)
			await timeout(1000)
			setFlipCard(true)
			await timeout(config.cardRevealInterval || 3000)
			setFlipCard(false)
			await timeout(1000)
			setIsSelectCard(false)
			await timeout(1000)
			setIsShuffle(false)
			resolve()
		})

	const getCardBackgroundColors = () => {
		switch (config.gradient) {
			case 3: {
				return `linear-gradient(to bottom right, ${config.cardBgColor[0]}, ${config.cardBgColor[1]}, ${config.cardBgColor[2]})`
			}
			case 2: {
				return `linear-gradient(to bottom right, ${config.cardBgColor[0]}, ${config.cardBgColor[1]})`
			}
			default: {
				return `${config.cardBgColor[0]}`
			}
		}
	}

	return (
		<>
			<Head>
				<title>Public Raffle System</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Sidebar config={config} onUpdateConfig={handleConfigUpdate} />

			{isSelectCard && flipCard && <Confetti width={width} height={height} />}
			<div
				className={`relative h-screen w-screen bg-no-repeat bg-cover -z-10 bg-center transition-opacity duration-1000 ease-in ${
					config ? 'opacity-100' : 'opacity-0'
				}`}
				style={{
					backgroundColor: config?.bgColor,
				}}
			>
				<p className="bg-white p-4 text-center sm:hidden">
					To run this raffle, you must at least be on a tablet.
				</p>
				<div
					className="absolute hidden sm:block mx-auto max-w-lg w-full h-100"
					onMouseEnter={() => setCursorInArea(true)}
					onMouseLeave={() => setCursorInArea(false)}
					style={{ transform: 'translate(-50%,-50%)', top: '50%', left: '50%' }}
				>
					{!isShuffle && (
						<div className="absolute -bottom-36 left-1/2 z-100 transform -translate-x-1/2 -translate-y-1/2">
							<Button
								className={`border border-black z-100 transition-all duration-500 ease-in-out ${
									cursorInArea ? 'opacity-100' : 'opacity-0'
								} hover:scale-110`}
								onClick={async () => {
									const winner = getRandomName()
									setRandomName(winner)
									await startInterval()

									// Remove winner function
									// if (winner) {
									// 	updateWinnerName(winner)
									// }
								}}
							>
								PICK A WINNER
							</Button>
						</div>
					)}
					<div
						style={{
							transformStyle: 'preserve-3d',
							background: getCardBackgroundColors(),
						}}
						className={`shadow-lg bg-transparent absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2   items-center transition-all transform duration-500 ease-in-out ${
							cursorInArea && !isShuffle
								? '-translate-x-64 -translate-y-32 -rotate-36'
								: isShuffle && !isSelectCard
								? '-translate-x-64 -translate-y-32 -rotate-0 animate-cardToBack1'
								: isShuffle && isSelectCard && !flipCard
								? '-translate-x-1/2 -translate-y-1/2 scale-150 -rotate-0'
								: isShuffle && isSelectCard && flipCard
								? 'animate-flipCard'
								: '-translate-x-1/2 -translate-y-1/2 rotate-0'
						} z-50`}
					>
						{config?.cardLogoImage && (
							<div
								style={{
									backfaceVisibility: 'hidden',
									WebkitBackfaceVisibility: 'hidden',
									MozBackfaceVisibility: 'hidden',
								}}
								className="absolute w-full h-full rounded-2xl flex justify-center items-center"
							>
								<img
									src={config?.cardLogoImage}
									className="h-32 w-32 rounded-full"
								/>
							</div>
						)}
						<div
							style={{
								backfaceVisibility: 'hidden',
								WebkitBackfaceVisibility: 'hidden',
								MozBackfaceVisibility: 'hidden',
								transform: 'rotateY(180deg)',
							}}
							className="absolute w-full h-full bg-white rounded-2xl flex justify-center items-center"
						>
							{randomName?.name || 'No winner selected'}
						</div>
					</div>
					<div
						style={{
							background: getCardBackgroundColors(),
						}}
						className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2  items-center transform transition-all duration-500 ease-in-out ${
							cursorInArea && !isShuffle
								? '-translate-x-48 -translate-y-40  -rotate-18'
								: isShuffle && !isSelectCard
								? '-translate-x-48 -translate-y-40 -rotate-0 animate-cardToBack2'
								: isShuffle && isSelectCard
								? '-translate-x-48 -translate-y-40 -rotate-0'
								: '-translate-x-1/2 -translate-y-1/2 rotate-0 '
						} z-40`}
					>
						{config?.cardLogoImage && (
							<div
								className="absolute"
								style={{
									transform: 'translate(-50%,-50%)',
									top: '50%',
									left: '50%',
								}}
							>
								<img
									src={config?.cardLogoImage}
									className="h-32 w-32 rounded-full"
								/>
							</div>
						)}
					</div>
					<div
						style={{
							background: getCardBackgroundColors(),
						}}
						className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2  items-center transition-all transform duration-500 ease-in-out ${
							cursorInArea && !isShuffle
								? '-translate-x-32 -translate-y-40 -rotate-9'
								: isShuffle && !isSelectCard
								? '-translate-x-32 -translate-y-48 -rotate-0 animate-cardToBack3'
								: isShuffle && isSelectCard
								? '-translate-x-32 -translate-y-48 -rotate-0'
								: '-translate-x-1/2 -translate-y-1/2 rotate-0'
						} z-30`}
					>
						{config?.cardLogoImage && (
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
								<img
									src={config?.cardLogoImage}
									className="h-32 w-32 rounded-full"
								/>
							</div>
						)}
					</div>
					<div
						style={{
							background: getCardBackgroundColors(),
						}}
						className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2   items-center transition-all transform duration-500 ease-in-out ${
							cursorInArea && !isShuffle
								? '-translate-x-16 -translate-y-40 -rotate-0'
								: isShuffle && !isSelectCard
								? '-translate-x-16 -translate-y-56 -rotate-0 animate-cardToBack4'
								: isShuffle && isSelectCard
								? '-translate-x-16 -translate-y-56 -rotate-0'
								: '-translate-x-1/2 -translate-y-1/2 rotate-0'
						} z-20`}
					>
						{config?.cardLogoImage && (
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
								<img
									src={config?.cardLogoImage}
									className="h-32 w-32 rounded-full"
								/>
							</div>
						)}
					</div>
					<div
						style={{
							background: getCardBackgroundColors(),
						}}
						className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2   items-center transition-all transform duration-500 ease-in-out ${
							cursorInArea && !isShuffle
								? '-translate-x-4 -translate-y-36 rotate-9'
								: isShuffle && !isSelectCard
								? '-translate-x-4 -translate-y-64 -rotate-0 animate-cardToBack5'
								: isShuffle && isSelectCard
								? '-translate-x-4 -translate-y-64 -rotate-0'
								: '-translate-x-1/2 -translate-y-1/2 rotate-0'
						} z-10`}
					>
						{config?.cardLogoImage && (
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
								<img
									src={config?.cardLogoImage}
									className="h-32 w-32 rounded-full"
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
