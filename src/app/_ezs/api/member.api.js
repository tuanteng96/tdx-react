import http from '../utils/http'

const MemberAPI = {
  search: ({ StockID = '', Key = '' }) => http.get(`/api/gl/select2?cmd=member&q=${Key}&CurrentStockID=${StockID}`),
  create: (data) => http.post(`/api/v3/member23?cmd=add`, JSON.stringify(data)),
  memberSelect: ({ Key, StockID }) =>
    http.get(`/api/gl/select2?cmd=member&q=${Key || ''}&CurrentStockID=${StockID || 0}`)
}

export default MemberAPI
