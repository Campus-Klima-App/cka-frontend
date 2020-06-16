import React, { Component, Fragment } from 'react';

class LineGraph extends Component {

    insertGraph() {
        /*
            The fetch of the data shouldn't happen via d3 but inside the react framework,
            therefore maybe use

            fetch("https://gist.githubusercontent.com/mickey175/bb19eff9e1625f9db89b68cff9cb5aed/raw/f710ad6374e04fc5bcaf69852a34fd9c35f6831c/data.json")
            .then(response => response.json())
            .then((jsonData) => {
                    console.log(jsonData)
            })
            .catch((error) => {
                    console.error(error)
            })
        */

        return (
            <div className={"graphic" + this.props.visId}>
                <h4 style={{textAlign: "center"}}>
                    {this.props.name}
                </h4>
            </div>
        );
    }

    render() {
        return ( <Fragment>{this.insertGraph()}</Fragment> );
    }
}

export default LineGraph;