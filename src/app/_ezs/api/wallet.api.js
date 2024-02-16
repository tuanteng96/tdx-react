import http from '../utils/http'

const WalletsAPI = {
  list: (data) => http.post(`/api/v3/memberf25@drawList`, JSON.stringify(data)),
  deleteIdHistory: (data) => http.post(`/api/v3/memberf25@drawDelete`, JSON.stringify(data))
}

export default WalletsAPI
