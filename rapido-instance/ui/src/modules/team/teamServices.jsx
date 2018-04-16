import apiObj from '../utils/ApiServices'

const TeamApiCall = {

  createTeam(obj) {
    var token  = sessionStorage.getItem("token");
      return fetch(apiObj.endPoint + 'team', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(obj)
    });
  },

  getTeams() {
    var token  = sessionStorage.getItem("token");
    
    return fetch(apiObj.endPoint + 'team', { 
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  getTeam(teamId) {
    var token  = sessionStorage.getItem("token");
    
    return fetch(apiObj.endPoint + 'team/'+ teamId, { 
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  deleteTeam(teamId) {
    var token  = sessionStorage.getItem("token");
    
    return fetch(apiObj.endPoint + 'team/'+ teamId, { 
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  searchMember(searchQuery) {
    var token  = sessionStorage.getItem("token");
    
    return fetch(apiObj.endPoint + 'user?filter='+ searchQuery, { 
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  addTeamMember(teamId, member) {
    var token  = sessionStorage.getItem("token");
      return fetch(apiObj.endPoint + 'team/'+ teamId + '/member', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(member)
    });
  },
  editTeamMember(teamId, member) {
    var token  = sessionStorage.getItem("token");
    return fetch(apiObj.endPoint + 'team/'+ teamId + '/member/' + member.id, { 
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(member)
    });
  },
  deleteTeamMember(teamId, memberId) {
    var token  = sessionStorage.getItem("token");
    
    return fetch(apiObj.endPoint + 'team/'+ teamId + '/member/' + memberId, { 
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },
}

export default TeamApiCall;