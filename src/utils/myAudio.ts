export class MyAudio {
  private _audioContext: AudioContext
  private _buffer: AudioBuffer | null = null
  private _bufferSource: AudioBufferSourceNode | null

  constructor(audioContext: AudioContext, audioSource: string) {
    this._audioContext = audioContext
    this._bufferSource = null
    this.load(audioSource)
  }
  private async load(audioSource: string) {
    const response = await fetch(audioSource)
    const arrayBuffer = await response.arrayBuffer()
    this._buffer = await this._audioContext.decodeAudioData(arrayBuffer)
    this.prapaerAudioBufferNode()
  }
  private prapaerAudioBufferNode() {
    // 次回の再生のために準備を行う
    this._bufferSource = this._audioContext.createBufferSource()
    this._bufferSource.buffer = this._buffer
    this._bufferSource.connect(this._audioContext.destination)
  }
  public play() {
    if (this._bufferSource) {
      this._bufferSource.start(0)
      this.prapaerAudioBufferNode()
    }
  }
}
