import React, { Component } from 'react';
import LineGraph from './lineGraph';
import Menu from './menu';
import './styles.css';

import CO_Icon from '../icons/CO_Icon.svg';
import Temp_Icon from '../icons/Temp_Icon.svg';
import Humid_Icon from '../icons/Humid_Icon.svg';
import UV_Icon from '../icons/UV_Icon.svg';

class App extends Component {

    // The state of the main component with the menu entries
    state = {
        showEntry: null,
        entries: [
            {id: 0, name: "Kohlenstoffmonoxid", icon: CO_Icon},
            {id: 1, name: "Temperatur", icon: Temp_Icon},
            {id: 2, name: "Luftfeuchtigkeit", icon: Humid_Icon},
            {id: 3, name: "UV-Index", icon: UV_Icon}
        ]
    };

    // Event-Handler for clicking on a menu entry (icon)
    handleMenuSelect = (activeEntry) => {
        this.setState({showEntry: activeEntry});
    };

    // Select the right representation of the data (until now only lineGraph)
    selectVis() {
        if (this.state.showEntry !== null)
            return (<LineGraph
                    name={this.state.showEntry.name}
                    visId={this.state.showEntry.id}
                />
            );
    }

    render() {
        return (
            <div className="App">
                <div id="content">
                    {this.selectVis()}
                </div>
                <Menu
                    // All menu entries and the active entry are given to the menu (called via "this.props")
                    entries={this.state.entries}
                    active={this.state.showEntry}
                    select={this.handleMenuSelect}
                />
            </div>
        );
    }
}

export default App;
