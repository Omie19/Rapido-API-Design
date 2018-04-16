import { browserHistory } from 'react-router'

export function showDetails(component, event) {
  component.setState({
    treeEditDetails: {
      rootNodeData: {},
      childNodeData: {},
      apiExportData: {}
    }
  })
  component.setActiveStatus(component.state.treedata);
  event.source.active = true;
  component.showDetailsSection(event.source);
}

export function addNode(component, event) {
  component.setActiveStatus(component.state.treedata);
  event.source.data.children.push({
    "name" : "default",
    "url": "/",
    "fullPath": "",
    "pId": event.source.data.pId + (event.source.data.children.length+1) ,
    "children":[],
    "active": false,
    "apiList": []
  });
  component.setState({
    isNodeEditMode: true
  })
  component.showDetailsSection(event.source);
}

export function deleteNode(component, ProjectService,browserHistory,event) {
  component.fetchChild(component.state.treedata, function(d) {
      if (d.children) {
        d.children.forEach((item, index) => {
          if (item == event.source.data) {
            d.children.splice(index,1);
            return
          }
        })
      }
    },
    function(d) {
       return d.children && d.children.length > 0 ? d.children : null;
    });

    var newData = component.state.treedata;
    component.setState({
      treedata: newData,
      treeEditDetails: {
        rootNodeData: {},
        childNodeData: {},
        apiExportData: {}
      }
    });

    let savedVocabulary;
    let userDetails = JSON.parse(sessionStorage.getItem('userInfo'));
    let VocabularyStored = sessionStorage.getItem('vocabularyInfo')
    if (VocabularyStored) {
      savedVocabulary = JSON.parse(VocabularyStored);
    } else {
      savedVocabulary = []
    }

    updateSketch(component, savedVocabulary, ProjectService, browserHistory)
}

export function updatePath(component, event) {
 // alert(event.source.pId)
  if(component.state.apidetails) {
    for (var key in component.state.apidetails[event.source.pId]) {
       component.state.apidetails[event.source.pId][key].fullPath = event.path
    }
  }
}

export function exportDesign(data) {
  data.exportAPI = {};
  let exportDetails = data.apidetails;
  for (var key in exportDetails) {
    var defKey = Object.keys(exportDetails[key])[0];
    var pathKey = exportDetails[key][defKey].fullPath
    data.exportAPI[pathKey] = exportDetails[key];
    var tempArray = Object.keys(data.exportAPI[pathKey]);
    Object.keys(data.exportAPI[pathKey]).forEach(function(api) {
      data.exportAPI[pathKey][api]["id"] = key;
      if(typeof data.exportAPI[pathKey][api].request !== "object") {
        data.exportAPI[pathKey][api].request = JSON.parse(data.exportAPI[pathKey][api].request);
      }
      if(typeof data.exportAPI[pathKey][api].responses !== "object") {
        data.exportAPI[pathKey][api].responses = JSON.parse(data.exportAPI[pathKey][api].responses);
      }
    });
  }
}

export function importDesign(data) {
  let importAPI = {};
  for (var key in data) {
    var defKey = Object.keys(data[key])[0];
    var pathKey = data[key][defKey].id;
    importAPI[pathKey] = data[key];
    var tempArray = Object.keys(importAPI[pathKey]);
    Object.keys(importAPI[pathKey]).forEach(function(api) {
      importAPI[pathKey][api].request = JSON.stringify(importAPI[pathKey][api].request, null, 2);
      importAPI[pathKey][api].responses = JSON.stringify(importAPI[pathKey][api].responses, null, 2);
    });
  }
  return importAPI;
}

export function updateTreeData(data, mode, component ) {
  if(mode){
    component.setState({
      isNodeEditMode: true,
      projectSaved: false
    })
  } else {
    component.setState({
      isNodeEditMode: false,
      projectSaved: false
    })
  }
}

export function updateProjectHeaders(data, mode, component) {
  if(mode) {
    component.setState({
      isProjectEmpty : true,
      projectDetails: data,
      projectSaved: component.state.projectSaved
    })
  } else {
    component.setState({
      isProjectEmpty : false,
      projectDetails: data,
      projectSaved: component.state.projectSaved
    })
  }
}

export function addEmptySketch (component) {
  component.state = {
    parentWidth: 0,
    width: '100%',
    editing: false,
    canvasHeight: "100%",
    offsetX: 50,
    offsetY: 0,
    projectDetails: {
      projectName: '',
      projectDesc: ''
    },
    isProjectEmpty: true,
    inListDetails: false,
    treedata: {
      "treeId": 0,
      "name": "Root",
      "rootPath": "/root",
      "pId": "1",
      "active": false,
      "rootNode": true,
      "children": []
    },
    isNodeEditMode: false,
    projectSaved: false,
    treeEditDetails: {
      rootNodeData: {},
      childNodeData: {},
      apiExportData: {},
      vocabulary: []
    },
    apidetails: {},
    exportAPI: {},
    exportStatus: component.props.designDetails.enableExport
  }
}

export function loadProjectDetails (ProjectService, component, sketchId) {
  let prjSrvGetPrjDetRes = null;
  ProjectService.getProjectDetails(sketchId)
    .then((response) => {
      prjSrvGetPrjDetRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(prjSrvGetPrjDetRes.ok) {       
        
        let updatedAPI = component.importSketchInfo(responseData.apidetails);        
        let tempVocabData = [];
        responseData.vocabulary.map(function (vocab) {
          if(typeof vocab === 'string')
          tempVocabData.push({"name":vocab});
          else
          tempVocabData.push({"name":vocab.name});
        }, this);

        component.setState({
          parentWidth: 0,
          width: '100%',
          editing: false,
          canvasHeight: "100%",
          offsetX: 50,
          offsetY: 0,
          projectDetails: {
            projectName: responseData.name,
            projectDesc: responseData.description,
            projectId: responseData.id,
            createdBy: responseData.createdby,
            access: responseData.access
          },
          isProjectEmpty: false,
          inListDetails: true,
          treedata: responseData.treedata,
          id: responseData.id,
          isNodeEditMode: true,
          projectSaved: true,
          treeEditDetails: {
            rootNodeData: {},
            childNodeData: {},
            apiExportData: responseData.apidetails,
            vocabulary: tempVocabData
          },
          apidetails: updatedAPI,
          vocabulary: tempVocabData,
          exportAPI: {},
          exportStatus: true
        })
        
        component.props.getCurrentNodeDetails(component);
        sessionStorage.setItem('vocabularyInfo',JSON.stringify(tempVocabData))
      } else {
        component.showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(prjSrvGetPrjDetRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}


export function createSketch(component, savedVocabulary, ProjectService, browserHistory) {
  component.exportSketchInfo(component.state.apidetails);
  let projectData = {
    "name" : component.state.projectDetails.projectName,
    "description" : component.state.projectDetails.projectDesc,
    "vocabulary": savedVocabulary,
    "treedata": component.state.treedata,
    "apidetails": component.state.exportAPI
  }
  let prjServCreatePrjRes = null;
  ProjectService.createProject(projectData)
    .then((response) => {
      prjServCreatePrjRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(prjServCreatePrjRes.ok ) {
        sessionStorage.removeItem('vocabularyInfo');
        sessionStorage.removeItem('projectInfo');
        sessionStorage.setItem('sketchId',responseData.id);
        sessionStorage.setItem('selectedSketch',JSON.stringify({
          "name": projectData.name,
          "description": projectData.description,
          "projectid": responseData.id
        }))
        browserHistory.push('/vocabulary');
      } else {
        component.showAlert((responseData.message) ? responseData.message : "Error occured");
        if(prjServCreatePrjRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
export function updateSketch(component, savedVocabulary, ProjectService, browserHistory) {
  component.exportSketchInfo(component.state.apidetails);
  let updatedVocabulary = formatVocabularyInfo(savedVocabulary)
  let projectData = {
    "id": component.state.id,
    "vocabulary": updatedVocabulary,
    "treedata": component.state.treedata,
    "apidetails": component.state.exportAPI
  }
  let prjSrvUpdPrj = null;
  ProjectService.updateProject(projectData)
    .then((response) => {
      prjSrvUpdPrj = response.clone();
      return response.json();
    })
    .then((responseData) => {
      
      if(prjSrvUpdPrj.ok) {
        component.setState({
          projectSaved: true,
          exportStatus: true,
          treeEditDetails: {
            rootNodeData: {},
            childNodeData: {},
            apiExportData: {}
          }
        })
        component.showAlertMessage("Sketch details are updated");
       loadProjectDetails (ProjectService, component, sessionStorage.getItem('sketchId'))
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(prjSrvUpdPrj.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
function formatVocabularyInfo(vocabularyInfo){
var updatedVocab = [];
vocabularyInfo.forEach(function(element){
  if(element =="string")updatedVocab.push(element)
  else updatedVocab.push(element.name)
})
return updatedVocab;
}