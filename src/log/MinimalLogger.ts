import { Log } from 'src/types'

class MinimalLogger implements Log {
    debug = () => {
        // no op
    }

    info = () => {
        // no op
    }

    error = console.error
}

export const minimalLogger = (): Log => new MinimalLogger()
