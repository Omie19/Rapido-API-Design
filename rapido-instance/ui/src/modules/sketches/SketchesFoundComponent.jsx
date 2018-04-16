import React from 'react';
import { browserHistory } from 'react-router';
import Button from 'mineral-ui/Button';
import DeleteModal from '../d3/DeleteModal';
import SketchService from './SketchServices'
import Card, { CardBlock, CardTitle } from 'mineral-ui/Card';
import { createStyledComponent } from 'mineral-ui/styles';
import { createThemedComponent } from 'mineral-ui/themes';


export default class extends React.Component{
  
  constructor(props) {
    super(props);    
    this.state = {
      filteredData: this.props.sketches,
      sketches: this.props.sketches,
      isOpen: false,
      sortType: '',
      query: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.sortSketchCardBy = this.sortSketchCardBy.bind(this);
  }
  

  /* Method to handle search */
  handleChange(event) {   
    var queryResult=[];   
    this.props.sketches.forEach(function(sketch){   
      if(sketch.name.toLowerCase().indexOf(event.target.value.toLowerCase())!=-1)   
        queryResult.push(sketch);   
      if(sketch.description.toLowerCase().indexOf(event.target.value.toLowerCase())!=-1)    
        queryResult.push(sketch);   
    });   
    queryResult = queryResult.filter((sketch, index, self) =>   
      index === self.findIndex((s) => (   
        s.id === sketch.id && s.name === sketch.name    
      ))    
    )   
    this.setState({   
      query: event.target.value,    
      filteredData: queryResult   
    });   
  }

  sortSketchCardBy(event) {      
     let lastActiveId = null;    
     if(document.querySelector(".sortByBtn.active")) {   
       lastActiveId = document.querySelector(".sortByBtn.active").id;    
       document.querySelector(".sortByBtn.active").className = document.querySelector(".sortByBtn.active").className.replace(/\bactive\b/,'');   
     }   
     if(lastActiveId !== event.target.id)    
       event.target.className = event.target.className + " active";    
     
     let activeNow = null;   
     let activeSort = null;    
     if(document.querySelector(".sortByBtn.active"))   
       activeNow = document.querySelector(".sortByBtn.active").id;   
     
     var queryResult=[];   
     
     if(activeNow == "sortByNameBtn") {    
       activeSort = 'name';    
       queryResult = this.props.sketches.sort(function(a, b){    
         if(a.name < b.name) return -1;    
         if(a.name > b.name) return 1;   
         return 0;   
       });   
     }   
     
     if(activeNow == "sortByModifiedBtn") {    
       activeSort = 'modified';    
       queryResult = this.props.sketches.sort(function(a, b){    
         if(a.modifiedat < b.modifiedat) return -1;    
         if(a.modifiedat > b.modifiedat) return 1;   
         return 0;   
       });   
     }   
     
     if(activeNow == "sortByCreatedBtn") {   
       activeSort = 'created';   
       queryResult = this.props.sketches.sort(function(a, b){    
         if(a.createdat < b.createdat) return -1;    
         if(a.createdat > b.createdat) return 1;   
         return 0;   
       });   
     }   
     
     this.setState({   
       sortType: (activeSort !== null) ? activeSort : '',    
       filteredData: (activeSort !== null) ? queryResult : this.state.sketches   
     })    
  }

  /* Method to handle sketch click */
  navigateToDetails(row) {
    sessionStorage.setItem('sketchId',row.row.projectid);
    sessionStorage.setItem('selectedSketch',JSON.stringify(row.row));
    sessionStorage.setItem('sketchName',row.row.name);
    sessionStorage.removeItem('vocabularyInfo');
    browserHistory.push('/vocabulary');
  }

  /* Method to add new sketch */
  addNewSketch() {
    sessionStorage.setItem('sketchId','null');
    sessionStorage.setItem('sketchName','null');
    sessionStorage.removeItem('vocabularyInfo');
    browserHistory.push('/nodes/add');
  }

  /* Method to toggle modal */
  toggleModal(row) {
    this.setState({
      isOpen: !this.state.isOpen,
      projectId: (row.row) ? row.row.projectid : null
    });
  }

  /* Method to delete sketch */
  deleteSketch() {
    let sktSrvDelPrjRes = null;
    SketchService.deleteProject(this.state.projectId)
    .then((response) => {
      sktSrvDelPrjRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(sktSrvDelPrjRes.ok) {
        this.toggleModal({});
        browserHistory.push('/sketches');
        window.location.reload();
       /* TODO remove from state */
      } else {
        this.toggleModal({});
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(sktSrvDelPrjRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /* Render Method */
  render() {

    const { filteredData } = this.state;

    const CustomContent = createStyledComponent('div', ({ theme }) => ({
      backgroundColor: theme.color_gray_20,
      margin: `${theme.space_stack_md} 0`,
      padding: theme.space_inset_lg,

      '&:last-child': {
        borderRadius: `0 0 ${theme.borderRadius_1} ${theme.borderRadius_1}`,
        marginBottom: `-${theme.space_stack_md}`
      }
    }));

    const BlueButton = createThemedComponent(Button, {
      Button_backgroundColor: '#09AEEF',
      Button_color_text: '#ffffff',
      Button_fontWeight: '100',
      Button_borderColor: '#09AEEF',
      Button_borderWidth: '2px',
      Button_backgroundColor_active: '#09AEEF',
      Button_backgroundColor_focus: '#09AEEF',
      Button_backgroundColor_hover: '#09AEEF'
    });

    const sketchItems = filteredData.map(function (row) {
      return (
        <Card>
          <CardTitle>{row.name}</CardTitle>
          <CardBlock>{row.description}</CardBlock>
          <CustomContent>
            <Button onClick={this.navigateToDetails.bind(this,{row})}>{(row.ownership == 'READ') ? "View" : "Edit"}</Button>
            {row.ownership != 'READ' ? (
              <Button className="cardButtonSepMargin" onClick={this.toggleModal.bind(this,{row})}>Delete</Button>
            ) : (
              null
            )}
          </CustomContent>
        </Card>
      );
    }, this);

    const cardLayout = createStyledComponent('div');

    return(
      <div>
        <BlueButton onClick={this.addNewSketch.bind(this)} className="new-sketch-label">+ CREATE PROJECT</BlueButton>
        <div className="col-md-12 sketch-sort-section">
          <input className="search-sketch-input" placeholder="Search" type="text" value={this.state.query} onChange={this.handleChange} />
          <button id="sortByCreatedBtn" className={(this.state.sortType == 'created') ? "sortByBtn active" : "sortByBtn"} onClick={this.sortSketchCardBy}>Created</button>
          <button id="sortByModifiedBtn" className={(this.state.sortType == 'modified') ? "sortByBtn active" : "sortByBtn"} onClick={this.sortSketchCardBy}>Modified</button>
          <button id="sortByNameBtn" className={(this.state.sortType == 'name') ? "sortByBtn active" : "sortByBtn"} onClick={this.sortSketchCardBy}>Name</button>   
        </div>
        <cardLayout className="cardLayout">
          {sketchItems}
        </cardLayout>
        <DeleteModal show={this.state.isOpen}
          onClose={this.toggleModal.bind(this)}
          onConfirm={this.deleteSketch.bind(this)}
          modalText="Are you sure you want to delete this sketch project?">
        </DeleteModal>
      </div>
    )
  }
}
