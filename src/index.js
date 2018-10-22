import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import axios from 'axios';
import './index.css';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.handleChange(event.target.value);
    }

    render() {
        return (
            <form>
                 <div className="form-group">
                    <input type="text" placeholder="Search dog breeds..." className="form-control" onChange={this.handleChange}/>
                 </div>
            </form>
        );
    }
}


class BreedList extends React.Component {
    render() {
        console.log(this.props.data);
        let list = this.props.data.map(function(d) {
            return <BreedCard data={d}/>
        });
        return (
            <div className="row">     
                { list }
            </div>
        );
    }
}

class BreedCard extends React.Component {
    render() {
        return (
            <div className="col-md-4 col-sm-6 col-xs-1">
                <div className="card">
                    <img className="card-img-top" src={this.props.data.imageUrl}/>
                    <div className="card-body">
                        <div className="card-title">{this.props.data.name}</div>
                    </div>
                </div>
            </div>
        );
    }
}

class DogBreeds extends React.Component {

    constructor(props) {
        super(props);
        this.state = { query: '', breeds: [] };

        // debounce queries on input
        this.query = debounce(this.query, 500);

        // init list
        this.query('');
    }

    handleChange = (value) => {
        console.log("DogBreeds::handleChange", value);
        // this.setState({ query: value })
        this.query(value);
    }

    query(q) {
        axios.get(process.env.REACT_APP_API_URL + '/dogs?q=' + q, {
            crossdomain: true,
        })
        .then(response => this.setState({'breeds': response.data}));
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Search value={this.state.query} handleChange={this.handleChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <BreedList data={this.state.breeds}/>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <DogBreeds />,
    document.getElementById('root')
);
