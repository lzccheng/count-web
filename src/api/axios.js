import axios from 'axios'
import { Message } from 'element-ui'
import { getLs } from '../tool/storage'

const instance = axios.create({
    timeout: 10000,
    baseURL: '/api'
})

instance.interceptors.request.use(config => {
    config.headers.token = getLs('token')
    return config
})

const request = method => (url, data, config) => {
    const returnData = (res, err, response) => ({ res, err, response })
    const tips = msg => Message.warning(msg)
    return instance({
        ...config,
        url,
        method,
        data: method === 'get' ? {} : data,
        params: method === 'get' ? data : {}
    }).then(res => {
        const { data, data: { code, msg } } = res
        if (code === 200) {
            return returnData(data, null, res)
        } else {
            tips(msg)
            return returnData(null, data, res)
        }
    }, err => {
        return returnData(null, err, err)
    })
}

export const GET = request('get')
export const POST = request('post')
