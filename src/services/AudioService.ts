import { ServiceProvider } from "./ServiceProvider"

export interface AudioPlayer {
    trackBuffer: AudioBuffer,
    play(): void,
}

export class AudioService {
    ctx: AudioContext

    constructor() {
        this.ctx = new AudioContext()
    }

    private players: Map<string, AudioPlayer> = new Map()

    getPlayer(name: string): AudioPlayer | undefined {
        return this.players.get(name)
    }

    async loadAudioFile(path: string) {
        const buffer = await ServiceProvider.get('FileService').loadFile(path)
        return this.ctx.decodeAudioData(buffer)
    }

    async createPlayer(path: string, name: string) {
        const buffer = await ServiceProvider.get('FileService').loadFile(path)
        const ctx = this.ctx
        const audioBuffer = await ctx.decodeAudioData(buffer)

        const audioPlayer: AudioPlayer = {
            trackBuffer: audioBuffer,
            play() {
                const source = ctx.createBufferSource()
                source.buffer = audioBuffer
                source.connect(ctx.destination)
                source.start(0)
            }
        }
        this.players.set(name, audioPlayer)

        return audioPlayer 
    }
}
