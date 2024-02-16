import http from "../utils/http"

const ConfigAPI = {
  getName: name =>
    http.get(`/api/v3/config?cmd=getnames&names=${name}&ignore_root=1`),
  saveName: ({ name, body }) =>
    http.post(`/api/v3/ConfigJson@save?name=${name}`, JSON.stringify(body))
}

export default ConfigAPI
