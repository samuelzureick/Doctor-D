class CountdownController
{
	/** @type {Phaser.Scene} */
	scene

	/** @type {Phaser.GameObjects.Text} */
	label

	/** @type {Phaser.Time.TimerEvent} */
	timerEvent

	duration = 0

	/**
	 * 
	 * @param {Phaser.Scene} scene 
	 * @param {Phaser.GameObjects.Text} label 
	 */
	constructor(scene, label)
	{
		this.scene = scene
		this.label = label
        this.active = true 
	}

	/**
	 * @param {() => void} callback
	 * @param {number} duration 
	 */
	start(callback, duration = 45000)
	{
        this.active = true
		this.stop()

		this.finishedCallback = callback
		this.duration = duration

		this.timerEvent = this.scene.time.addEvent({
			delay: duration,
			callback: () => {
				this.label.text = '0'

				this.stop()
				
				if (callback)
				{
					callback()
				}
			}
		})
	}

	stop()
	{
		if (this.timerEvent)
		{
			this.timerEvent.destroy()
			this.timerEvent = undefined
		}
	}

	update(pause)
	{
		

		if (!this.timerEvent || this.duration <= 0) 
		{
            this.active = false 
            this.timerEvent
			return
		}

		if(pause)
		{
			this.timerEvent.paused = true
		}else
		{
			this.timerEvent.paused = false
			const elapsed = this.timerEvent.getElapsed()
			const remaining = this.duration - elapsed
			const seconds = remaining / 1000

			this.label.text = seconds.toFixed(2)
		}
	}

    getDuration()
    {
        if (this.active == false) {
            return 0
        } else {
            const elapsed = this.timerEvent.getElapsed()
            const remaining = this.duration - elapsed
            const seconds = remaining / 1000

            return seconds 
        }
    }
}