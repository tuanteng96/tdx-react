import http from '../utils/http'

const UploadsAPI = {
  sendFile: (body, progressCallBack) =>
    http.post('/api/v3/file?cmd=upload', body, {
      onUploadProgress: (ev) => progressCallBack && progressCallBack(Math.round((ev.loaded * 100) / ev.total))
    })
}

export default UploadsAPI
