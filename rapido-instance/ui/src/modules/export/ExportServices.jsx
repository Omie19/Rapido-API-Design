import apiObj from '../utils/ApiServices'

const ExportApiCall = {
  getSwaggerJSON(sketchId,download) {
    var token  = sessionStorage.getItem("token");
    let url = null;
    
    if(download)
      url = apiObj.endPoint + 'project/'+sketchId+'/export?type=swagger&download=true'
    else
      url = apiObj.endPoint + 'project/'+sketchId+'/export?type=swagger'
    
    return fetch(url, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  getPostmanJSON(sketchId,download) {
    var token  = sessionStorage.getItem("token");
    let url = null;
    
    if(download)
      url = apiObj.endPoint + 'project/'+sketchId+'/export?type=postman&download=true'
    else
      url = apiObj.endPoint + 'project/'+sketchId+'/export?type=postman'

    return fetch(url, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  }
}

export default ExportApiCall;