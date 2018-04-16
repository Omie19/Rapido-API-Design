import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import { showAlert, AlertOptions } from '../utils/AlertActions'
import { HeaderComponent } from './HeaderComponent';
import { SketchesSortComponent } from './SketchesSortComponent';
import Card, { CardBlock, CardTitle, CardFooter } from 'mineral-ui/Card';
import { CardComponent } from '../CardComponent';
import DeleteModal from '../d3/DeleteModal';
import SketchService from './SketchServices'

export class SketchesComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filteredData: this.props.sketches,
            sketches: this.props.sketches,
            isOpen: false,
            sortType: '',
            query: ''
        };
        this.alertOptions = AlertOptions;
        this.handleChange = this.handleChange.bind(this);
        this.sortSketchCardBy = this.sortSketchCardBy.bind(this);
    }

   
    /* Method to sort by Name/Updated */
    sortSketchCardBy(event) { 
        let lastActiveId = null;       
        if(document.querySelector(".activeButton")) {   
          lastActiveId = document.querySelector(".activeButton").id;    
          document.querySelector(".activeButton").className = document.querySelector(".activeButton").className.replace("active",'inactive');   
        }   
        if(lastActiveId !== event.target.parentNode.parentNode.id)    
          event.target.parentNode.parentNode.className = event.target.parentNode.parentNode.className.replace("inactiveButton","") + "activeButton";   


        let activeNow = null;
        // let activeUpdate = null;
        let activeSort = null;

        if(document.querySelector(".activeButton"))
          activeNow = document.querySelector(".activeButton").id;
        // activeNow = document.getElementById("sortByNameBtn").id; 
        // activeUpdate = document.getElementById("sortByUpdatedBtn").id; 
    
        var queryResult=[];
    
        if(activeNow == "sortByNameBtn") {
          activeSort = 'name';
          queryResult = this.props.sketches.sort(function(a, b){
            var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
            if(nameA < nameB) return -1;
            if(nameA > nameB) return 1;
            return 0;            
          });
    
          this.setState({   
            sortType: (activeSort !== null) ? activeSort : '',    
            filteredData: (activeSort !== null) ? queryResult : this.state.sketches   
          })  
        }    
       
        if(activeNow == "sortByUpdatedBtn") {
          activeSort = 'updated';
          queryResult = this.props.sketches.sort(function(a, b){
            if(a.modifiedat > b.modifiedat) return -1;
            if(a.modifiedat < b.modifiedat) return 1;
            return 0;
          });

          this.setState({   
            sortType: (activeSort !== null) ? activeSort : '',    
            filteredData: (activeSort !== null) ? queryResult : this.state.sketches   
          })  
        //   console.log("filteredData",this.state.filteredData);
        }
      }    

    /* Method to handle search */
    handleChange(event) {
        var queryResult = [];
        this.props.sketches.forEach(function (sketch) {
            if (sketch.name.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1)
                queryResult.push(sketch);
            if (sketch.description.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1)
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

    /* Method to handle sketch click */
    navigateToDetails(row) {
        sessionStorage.setItem('sketchId', row.row.projectid);
        sessionStorage.setItem('selectedSketch', JSON.stringify(row.row));
        sessionStorage.setItem('sketchName', row.row.name);
        sessionStorage.removeItem('vocabularyInfo');
        sessionStorage.setItem('updateMode',true)
        browserHistory.push('/vocabulary');
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
                if (sktSrvDelPrjRes.ok) {
                    this.toggleModal({});
                    browserHistory.push('/sketches');
                    window.location.reload();
                    /* TODO remove from state */
                } else {
                    this.toggleModal({});
                    showAlert(this, (responseData.message) ? responseData.message : "Error occured");
                    if (sktSrvDelPrjRes.status == 401) {
                        sessionStorage.removeItem('user')
                        sessionStorage.removeItem('token')
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    render() {
    
        let { filteredData } = this.state;
        if (filteredData == undefined) {
            filteredData = this.props.sketches;
        }
        let content;
        let headerComponent = <HeaderComponent  />;
        let sortComponent = <SketchesSortComponent onChange={this.handleChange} sortSketch={this.sortSketchCardBy} sortType={this.state.sortType}/>
        const userNotLoggedIn = <div className="text-center loading-project-details">Loading...</div>
        const sketchesNotFound = <div className="titleContainer firstTime">
            <h2>Welcome to CA API Design!</h2>
            <h3>Looks like you are getting started. Go ahead and start off with creating a new sketch or team below.</h3>
        </div>

        const sketchesResultNotFound = <div className="titleContainer firstTime noResultsFound">
                <h2>No Results Found</h2></div>

        if (this.state && this.props.sketches) {
            if (this.props.sketches && this.props.sketches.length > 0) {

                content = filteredData.map(function (row) {
                    let cardBlock = <div className="wrapper"><div className="wrapper-info">{row.description}</div>
                        <div className="wrapper-icon make-height-invisible">
                            {row.ownership != 'READ' ? (
                                <i className="edit-wrapper-oval" onClick={this.navigateToDetails.bind(this, { row })}><img src="/ui/src/images/edit.png" alt="Alt text" /></i>
                            ) : (
                                    null
                                )}
                            {row.ownership != 'READ' ? (
                                <i className="delete-wrapper-oval" onClick={this.toggleModal.bind(this, { row })}><img src="/ui/src/images/delete.png" alt="Alt text" /></i>
                            ) : (
                                    null
                                )}
                            <i className="forward-wrapper-oval"><img src="/ui/src/images/share.png" alt="Alt text" /></i>
                        </div></div>;
                    return (<div className="col-md-3 card-layout" key={row.projectid} >
                        <CardComponent title={row.name} block={cardBlock} />
                    </div>);
                }, this)
                if(filteredData.length==0){
                    content = <div>
                        {sketchesResultNotFound}
                    </div>
                }
                
            } else {
                content = <div>
                    {sketchesNotFound}
                </div>
            }
        } else {
            content = <div>{userNotLoggedIn}</div>
            sortComponent = null;
        }



        let cardFooter = <div><span className="red-status">Dev Team</span>&nbsp;&nbsp;<span className="green-status">Apps Team</span></div>
        let cardFooter1 = <div><span className="green-status">Apps Team</span></div>

        return (
            <div>                    
                    {headerComponent}
                
                <br />
                <div className="row">
                    {sortComponent}
                </div>
                <br />
                <div className="row main-content xs-pl-20 Personal_div">
                    <label className="bold-font">Personal</label>
                </div>
                <div className="row sketch-content Personal_div">
                    <div className="col-md-12">
                        {content}
                    </div>
                </div>
                <br />




                <div className="row main-content xs-pl-15 Shared_div">
                    <label className="bold-font">Shared</label>
                </div>


                
                <div className="row shared-sketch Shared_div">
                    <div className="col-md-12">
                        <div className="col-md-3">

                            <CardComponent subtitle={"Updated : 02 19 2018"} footer={cardFooter} title={"Risk Management"} block={"This is API management tool.."} />
                        </div>

                        <div className="col-md-3">

                            <CardComponent subtitle={"Updated : 02 19 2018"} footer={cardFooter1} title={"Central Book Store"} block={"This is API Management Tool."} />
                        </div>

                        <div className="col-md-3">
                            <CardComponent subtitle={"Updated : 02 19 2018"} footer={cardFooter} title={"CA API"} block={"This is API Management Tool."} />
                        </div>

                    </div>
                </div>

                <DeleteModal show={this.state.isOpen}
                    onClose={this.toggleModal.bind(this)}
                    onConfirm={this.deleteSketch.bind(this)}
                    modalText="Are you sure you want to delete this sketch project?">
                </DeleteModal>
            </div>

        )
    }

}