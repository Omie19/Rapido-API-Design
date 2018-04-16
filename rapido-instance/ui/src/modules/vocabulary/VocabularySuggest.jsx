import React from 'react'
import Autosuggest from 'react-autosuggest'

const theme = {
  container: {
    position: 'relative'
  },
  input: {
    padding: '6px 12px',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    border: '1px solid #aaa',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  inputFocused: {
    outline: 'none'
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  suggestionsContainer: {
    display: 'none'
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    top: 40,
    width: "100%",
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px'
  },
  suggestionHighlighted: {
    backgroundColor: '#ddd'
  }
};

var vocabularyData;
export default class extends React.Component{
  
  constructor(props) {
    super(props);
  
    this.state = {
      value: '',
      suggestions: {}
    };
  }

  /* Component Initialisation */
  componentWillMount() {
    let VocabStored = sessionStorage.getItem('vocabularyInfo');
    if(VocabStored) {
      vocabularyData = JSON.parse(sessionStorage.getItem('vocabularyInfo'));
    } else {
      vocabularyData = []
    }

    this.setState({
      value: this.props.queryInput,
      suggestions: vocabularyData
    })
  }

  componentWillReceiveProps(nextProps){
  if(nextProps.queryInput != undefined){
    this.props = nextProps;
    let VocabStored = sessionStorage.getItem('vocabularyInfo');
    if(VocabStored) {
      vocabularyData = JSON.parse(sessionStorage.getItem('vocabularyInfo'));
    } else {
      vocabularyData = []
    }

    this.setState({
      value: this.props.queryInput,
      suggestions: vocabularyData
    })
  }
  
  }

  /* Method to handle change */
  onChange (event, { newValue }) {
    let updateValue;
   
    if(event.type === 'keydown' || event.type === 'keyup' || event.type === 'click'){
      let sliceIndex = this.state.value.lastIndexOf('/');
      let slicedValue = this.state.value.slice(0,sliceIndex+1);
      updateValue = slicedValue+ newValue;
    } else {
      updateValue = newValue;
    }
    this.props.updateSuggestedDetails(updateValue.toLowerCase());
    this.setState({
      value: updateValue.toLowerCase()
    });
  };
 
  /* Method to fetch suggestions */
  onSuggestionsFetchRequested ({ value }) {
    if(value !== '/') {
      this.setState({
        suggestions: this.getSuggestions(value)
      });
    }
  };
 
  /* Method to clear suggestions */
  onSuggestionsClearRequested () {
    this.setState({
      suggestions: []
    });
  };

  /* Method to get suggestion */
  getSuggestions(value) {
    const slashIndex = value.lastIndexOf('/');
    const inputValue = value.trim().toLowerCase();
    const inputSlicedValue = inputValue.slice(slashIndex+1 ,inputValue.length)
    const inputLength = inputSlicedValue.length;

    return inputLength === 0 ? [] : vocabularyData.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputSlicedValue
    );
  };

  /* Render method */
  render() {
    const getSuggestionValue = suggestion => suggestion.name;
    const renderSuggestion = suggestion => (
       
    <div className="suggestion-section">
      { suggestion.name}
    </div>
    );

    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'path',
      value,
      onChange: this.onChange.bind(this)
    };
    
    return (
      <div className=" vocabulary-suggest">
         <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            theme = {theme}
          />
      </div>
    );
  }
}
