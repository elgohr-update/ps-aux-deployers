import { VersionDetector } from 'src'
import Axios from 'axios'
import { appError } from 'src/error/AppError'

export const createUrlVersionDetector = (url: string): VersionDetector => {
    const http = Axios.create()
    const getVersion = async () => {
        const res = await http.get(url).then(r => r.data)

        let version = res.version

        if (!version) {
            throw appError(
                "Could not detect version. 'version' attribute not present in response"
            )
        }

        if (typeof version === 'number') {
            // Coercion
            version = version + ''
        }

        if (typeof version !== 'string') {
            throw appError(
                `Could not detect version. 'version' value is not a string: ${version} `
            )
        }

        return version
    }

    return {
        getVersion
    }
}
