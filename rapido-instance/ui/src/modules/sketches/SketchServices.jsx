import apiObj from '../utils/ApiServices'

const SketchApiCall = {
  getProjects(userId) {
    var token  = sessionStorage.getItem("token");
    
    return fetch(apiObj.endPoint + 'project', { 
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  deleteProject(projectId) {
    var token  = sessionStorage.getItem("token");
    
    return fetch(apiObj.endPoint + 'project/'+ projectId, { 
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  }
}

export default SketchApiCall;