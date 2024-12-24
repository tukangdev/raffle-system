const isServer = typeof window === 'undefined'

interface StorageItem {
	id: string
	name: string
	nameLowercase: string
	isWinner: boolean
	createdAt: number
	updatedAt: number
}

interface Config {
	bgColor: string
	bgImage: string
	cardBgColor: string[]
	cardLogoImage: string
	gradient: number
	shuffleInterval: number
	cardRevealInterval: number
}

const defaultConfig: Config = {
	bgColor: '#FCB900',
	bgImage: '',
	cardBgColor: ['#9900EF'],
	cardLogoImage: '',
	gradient: 1,
	shuffleInterval: 3000,
	cardRevealInterval: 3000,
}

const defaultNames: string[] = [
	'John Doe',
	'Jane Smith',
	'Alice Johnson',
	'Bob Brown',
	'Charlie Davis',
	'Diana White',
	'Ethan Green',
	'Fiona Black',
]

class LocalStorageService {
	private namesKey = 'raffle_names'
	private configKey = 'raffle_config'

	constructor() {
		if (!isServer) {
			this.initializeStorage()
		}
	}

	private initializeStorage() {
		if (!this.getItem(this.namesKey)) {
			console.log('Initializing names')
			this.setItem(this.namesKey, JSON.stringify(defaultNames))
		}

		if (!this.getItem(this.configKey)) {
			this.setItem(this.configKey, JSON.stringify(defaultConfig))
		}
	}

	private getItem(key: string): string | null {
		if (isServer) return null
		return localStorage.getItem(key)
	}

	private setItem(key: string, value: string): void {
		if (isServer) return
		localStorage.setItem(key, value)
	}

	// Names methods
	getAllNames(): StorageItem[] {
		return JSON.parse(this.getItem(this.namesKey) || '[]')
	}

	addName(name: string): StorageItem {
		const names = this.getAllNames()
		const newItem: StorageItem = {
			id: Math.random().toString(36).substr(2, 9),
			name,
			nameLowercase: name.toLowerCase(),
			isWinner: false,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}
		names.push(newItem)
		this.setItem(this.namesKey, JSON.stringify(names))
		return newItem
	}

	updateName(id: string, updates: Partial<StorageItem>): StorageItem | null {
		const names = this.getAllNames()
		const index = names.findIndex(n => n.id === id)
		if (index === -1) return null

		names[index] = { ...names[index], ...updates, updatedAt: Date.now() }
		this.setItem(this.namesKey, JSON.stringify(names))
		return names[index]
	}

	deleteName(id: string): boolean {
		const names = this.getAllNames()
		const filtered = names.filter(n => n.id !== id)
		this.setItem(this.namesKey, JSON.stringify(filtered))
		return true
	}

	// Config methods
	getConfig(): Config {
		const stored = this.getItem(this.configKey)
		return stored ? JSON.parse(stored) : defaultConfig
	}

	updateConfig(updates: Partial<Config>): Config {
		const config = this.getConfig()
		const newConfig = { ...config, ...updates }
		this.setItem(this.configKey, JSON.stringify(newConfig))
		return newConfig
	}
}

export const storageService = new LocalStorageService()
