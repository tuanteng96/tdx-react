import http from '../utils/http'

const ManageAPI = {
  getMembers: (body) => http.post(`/api/v3/fsearch@member`, JSON.stringify(body)),
  getOrders: (body) => http.post(`/api/v3/fsearch@order`, JSON.stringify(body)),
  getRoses: (body) => http.post(`/api/v3/r23/bao-cao-thu-chi/danh-sach`, JSON.stringify(body)),
  FActive: ({ Mid, Value }) =>
    http.post(
      `/api/v3/Ftree@MemberFActive?mid=${Mid}&value=${Value}`,
      JSON.stringify({
        members: [
          {
            ID: Mid,
            FActive: true
          }
        ]
      })
    ),
  getProvince: () => http.get(`/api/v3/region25@getp?pid=0`),
  getDistrict: ({ ProvinceID }) => http.get(`/api/v3/region25@getd?pid=${ProvinceID}`),
  getWard: ({ ProvinceID, DistrictID }) => http.get(`/api/v3/region25@getw?did=${DistrictID}&pid=${ProvinceID}`)
}

export default ManageAPI
