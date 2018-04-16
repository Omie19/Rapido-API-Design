const resourceBoxWidth = 225;
const resourceBoxHeight = 85;
const halfBoxWidth = resourceBoxWidth / 2;
const halfBoxHeight = resourceBoxHeight / 2;
const urlLeftMargin = 10;
const urlFontSize = 12;
const fullPathFontSize = 10;

/* Method to translate the rectangle selection for API Types */
export const setRectTranslation = (childCount) => {
  var translateValue;
  if(childCount === 1) {
    translateValue = 10;
  } else if(childCount === 3) {
    translateValue = 50;
  } else if(childCount === 5) {
    translateValue = 90;
  } else if(childCount === 7) {
    translateValue = 130;
  } else if(childCount === 9) {
    translateValue = 172;
  }
  return translateValue;
};

/* Method to translate the text selection for API Types */
export const setTextTranslation = (childCount) => {
  var translateValue;
  if(childCount === 2) {
    translateValue = 15;
  } else if(childCount === 4) {
    translateValue = 55;
  } else if(childCount === 6) {
    translateValue = 95;
  } else if(childCount === 8) {
    translateValue = 135;
  } else if(childCount === 10) {
    translateValue = 177;
  }
  return translateValue;
};

export default class {
  static resourceBoxWidth() { return resourceBoxWidth; }
  static resourceBoxHeight() { return resourceBoxHeight; }
  static halfBoxHeight() { return halfBoxHeight; }
  static halfBoxWidth() { return halfBoxWidth; }
  static drawNodes(g, rootTreeNode, handler) {

    // Create a new <g> for every object in the nodeList
    let node = g.selectAll(".node")
      .data(rootTreeNode.descendants(), function(d) {
        // Use the ID as the d3 identifier so that nodes can be replaced by ID
        return d.data.id;
      })
      .enter().append("g")
      .attr("class", function(d) { return "node" +
          (d.children ? " node--internal" : " node--leaf"); })
      .attr("id", function(d) { return d.data.id })
      .attr("transform", function(d) {
        //console.log("root")
        // console.log(d.Node)
       
        if(d.data.rootNode)
        return "translate(" + d.y + "," + d.x + ")"; 
        else{
        //  var y = d.y-40;
          return "translate(" + d.y + "," + d.x + ")"; 
        }
        
      });

    // inbound connector
    node.append("circle")
      .attr("class", "connector-in")
      .attr("r", "5")
      .attr("transform", function(d) {
        return "translate(0,45)";
      });

    // CRUD Node
    node.append("rect")
      .attr("width", resourceBoxWidth)
      .attr("height", resourceBoxHeight)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("class", function(d) {
        if(d.data.active) {
          return "node-uri-activated"
        } else {
          return "node-uri"
        }
      })
      .on("click", function(d) {
        handler({
          name: "detail",
          source: d.data
        })
      });

    // CRUD Node URI (not the full path)
    node.append("text")
      .filter(function(d) {
        return !d.data.rootNode
       })
      .attr("font-size", urlFontSize)
      .attr("class","node-path-text")
      .attr("transform", function(d) {
        return "translate(" + urlLeftMargin + "," + ((resourceBoxHeight / 2)+ urlFontSize/2) + ")"
      })
      .text(function(d) { return d.data.url; })
      .style("pointer-events",  "none");
    node.append("text")
      .filter(function(d) {
        return d.data.rootNode
       })
      .attr("font-size", urlFontSize)
      .attr("transform", function(d) {
        return "translate(" + urlLeftMargin + "," + ((resourceBoxHeight / 2)+ urlFontSize/2) + ")"
      })
      .text(function(d) { return d.data.name; })
      .style("pointer-events",  "none");

    // top separator
    node.append("path")
      .filter(function(d) {
        return !d.data.rootNode
       })
      .attr("class", "node-internal-border")
      .attr("d", function(d) {
          return "M0,20," + resourceBoxWidth + ",20"
      });

    // bottom separator
   /* node.append("path")
      .attr("class", "node-internal-border")
      .attr("d", function(d) {
          return "M0," + (resourceBoxHeight - 20) + "," + resourceBoxWidth + "," + (resourceBoxHeight - 20);
    });*/

    // outbound node
    node.append("circle")
      .attr("r", "15")
      .attr("class", function(d){
        if(!d.data.rootNode) {
          // TODO - child node changes 
          //if(d.data.url.length>1 && d.data.apiList.length>1) {
          //  return "connector-out"
          //} else {
          //  return "connector-out-disabled"
          //}
          return "connector-out"
        } else {
          return "connector-out"
        }
      })
      .attr("transform", function() {
        return "translate(" + resourceBoxWidth + "," + resourceBoxHeight / 2 +")";
      })
      .on("click", function(d) {
        handler({
          name: "add",
          source: d
        })
      });

    node.append("text")
      .attr("font-size", "25")
      .text("+")
      .attr("fill","white")
      .attr("x","-2")
      .attr("y","3")
      .attr("transform", function() {
        return "translate(" + (resourceBoxWidth - 5) + "," + (resourceBoxHeight / 2  + 5)+ ")";
      })
      .style("pointer-events",  "none");

    // Full URI path
    node.append("text")
      .attr("font-size", fullPathFontSize)
      .attr("class","node-full-path-text")
      .text(function(d) {
        if(d.data.rootNode) {
          return d.data.rootPath;
        }else {
          while (d.parent) {
            if(d.parent.data.rootNode) {
              handler({
                name: "updatePath",
                source: d.data,
                path: d.parent.data.rootPath + d.data.url
              })
              return d.data.fullPath = d.parent.data.rootPath + d.data.url
            } else {
              handler({
                name: "updatePath",
                source: d.data,
                path: d.parent.data.fullPath + d.data.url
              })
              return d.data.fullPath = d.parent.data.fullPath + d.data.url
            }
          }
        }
        
      })
      .attr("transform", "translate(10," + (resourceBoxHeight-20) + ")")
      .style("pointer-events",  "none")


    // Method badges
    let badges = node.append("g").attr("class", "badges");

    let getType = 
      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var getValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'GET') {
                getValue = true;
                return getValue;
              }
            })
            return getValue;
          }
        })
        .append("rect")
        .attr("width", 33)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .attr("transform", function(d){
          var translateX = setRectTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",5)";
        })
        .attr("class",function(d){
          if(d.data.apiList) {
            var className="inactive";
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'GET') {
               if(item.active)className="active";
              }
            })
            return className;
          }
        });

      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var getValue;
         
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'GET') {
                getValue = true;
               
                return getValue;
              }
            })
            return getValue;
          }
         })
        .append("text")
        .attr("font-size", fullPathFontSize)
        .attr("class",function(d){
          if(d.data.apiList) {
            var className="inactiveText";
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'GET') {
               if(item.active)className="activeText";
              }
            })
            return className;
          }
        })
        .text(function(d) {
          return "GET";
        })
        .attr("width", 20)
        .attr("height", 8)
        .attr("transform", function(d){
          var translateX = setTextTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",14)";
        });

    let putType = 
      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var putValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'PUT') {
                putValue = true;
                return putValue;
              }
            })
            return putValue;
          }
        })
        .append("rect")
        .attr("width", 33)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .attr("transform", function(d){
          var translateX = setRectTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",5)";
        })
       // .attr("class", "put");
        .attr("class",function(d){
          if(d.data.apiList) {
            var className="inactive";
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'PUT') {
               if(item.active)className="active";
              }
            })
            return className;
          }
        });

      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var putValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'PUT') {
                putValue = true;
                return putValue;
              }
            })
            return putValue;
          }
        })
        .append("text")
        .attr("font-size", fullPathFontSize)
        .attr("class",function(d){
          if(d.data.apiList) {
            var className="inactiveText";
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'PUT') {
               if(item.active)className="activeText";
              }
            })
            return className;
          }
        })
        .text(function(d) {
          return "PUT";
        })
        .attr("width", 20)
        .attr("height", 8)
        .attr("transform", function(d){
          var translateX = setTextTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",14)";
        });

    let postType = 
      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var postValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'POST') {
                postValue = true;
                return postValue;
              }
            })
            return postValue;
          }
        })
        .append("rect")
        .attr("width", 33)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .attr("transform", function(d){
          var translateX = setRectTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",5)";
        })
//.attr("class", "post");
.attr("class",function(d){
  if(d.data.apiList) {
    var className="inactive";
    d.data.apiList.forEach((item, index) => {
      if (item.apiType == 'POST') {
       if(item.active)className="active";
      }
    })
    return className;
  }
});

      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var postValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'POST') {
                postValue = true;
                return postValue;
              }
            })
            return postValue;
          }
        })
        .append("text")
        .attr("font-size", fullPathFontSize)
        .attr("class",function(d){
          if(d.data.apiList) {
            var className="inactiveText";
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'POST') {
               if(item.active)className="activeText";
              }
            })
            return className;
          }
        })
        .text(function(d) {
          return "POST";
        })
        .attr("width", 22)
        .attr("height", 8)
        .attr("transform", function(d){
          var translateX = setTextTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",14)";
        });

    let patchType = 
      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var patchValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'PATCH') {
                patchValue = true;
                return patchValue;
              }
            })
            return patchValue;
          }
        })
        .append("rect")
        .attr("width", 36)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .attr("transform", function(d){
          var translateX = setRectTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",5)";
        })
        //.attr("class", "patch");
        .attr("class",function(d){
          if(d.data.apiList) {
            var className="inactive";
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'PATCH') {
               if(item.active)className="active";
              }
            })
            return className;
          }
        });

      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var patchValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'PATCH') {
                patchValue = true;
                return patchValue;
              }
            })
            return patchValue;
          }
        })
        .append("text")
        .attr("font-size", fullPathFontSize)
        .attr("class",function(d){
          if(d.data.apiList) {
            var className="inactiveText";
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'PATCH') {
               if(item.active)className="activeText";
              }
            })
            return className;
          }
        })
        .text(function(d) {
          return "PATCH";
        })
        .attr("width", 22)
        .attr("height", 8)
        .attr("transform", function(d){
          var translateX = setTextTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",14)";
        });

    let deleteType = 
      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var delValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'DELETE') {
                delValue = true;
                return delValue;
              }
            })
            return delValue;
          }
        })
        .append("rect")
        .attr("width", 43)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .attr("transform", function(d){
          var translateX = setRectTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",5)";
        })
       // .attr("class", "delete");
       .attr("class",function(d){
        if(d.data.apiList) {
          var className="inactive";
          d.data.apiList.forEach((item, index) => {
            if (item.apiType == 'DELETE') {
             if(item.active)className="active";
            }
          })
          return className;
        }
      });

      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var delValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'DELETE') {
                delValue = true;
                return delValue;
              }
            })
            return delValue;
          }
        })
        .append("text")
        .attr("font-size", fullPathFontSize)
        .attr("class",function(d){
          if(d.data.apiList) {
            var className="inactiveText";
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'DELETE') {
               if(item.active)className="activeText";
              }
            })
            return className;
          }
        })
        .text(function(d) {
          return "DELETE";
        })
        .attr("width", 30)
        .attr("height", 8)
        .attr("transform", function(d){
          var translateX = setTextTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",14)";
        });

    let closeIcon = badges
      .filter(function(d) {
        return !d.data.rootNode;
       })
      .append("rect")
      .attr("width", 14)
      .attr("height", 14)
      .attr("rx", 3)
      .attr("ry", 2)
      .attr("transform", "translate(200,2)")
      .attr("fill","#f3aa4b")
      .style("cursor","pointer")
      .on("click", function(d) {
        handler({
          name: "delete",
          source: d
        })
      });

    badges.append("text")
      .filter(function(d) {
        return !d.data.rootNode
       })
      .attr("font-size", fullPathFontSize)
      .text(function(d) {
        return "X";
      })
      .attr("width", 20)
      .attr("height", 8)
      .attr("transform", "translate(204,12)")
      .style("cursor","pointer")
      .on("click", function(d) {
        handler({
          name: "delete",
          source: d
        })
      })

    return node;
  }
}