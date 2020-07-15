import React, {useEffect, useState} from 'react';
import DataView from './dataView';
import Menu from './menu';
import './styles.css';
import {testdata} from '../testdata.js';
import * as d3 from "d3";

import CO_Icon from '../icons/CO_Icon.svg';
import Temp_Icon from '../icons/Temp_Icon.svg';
import Humid_Icon from '../icons/Humid_Icon.svg';
import UV_Icon from '../icons/UV_Icon.svg';

function App() {

    const [state, setState] = useState({
        activeEntry: null,
        activeDot: null,
        entries: [
            {id: 0, name: "Kohlenstoffmonoxid", icon: CO_Icon},
            {id: 1, name: "Temperatur", icon: Temp_Icon},
            {id: 3, name: "Luftfeuchtigkeit", icon: Humid_Icon},
            {id: 4, name: "UV-Index", icon: UV_Icon}
        ],
        data: null,
        allowFetch: true
    });

    if (state.allowFetch) {
        d3.json("https://gist.githubusercontent.com/mickey175/bb19eff9e1625f9db89b68cff9cb5aed/raw/f710ad6374e04fc5bcaf69852a34fd9c35f6831c/data.json")
            .then(d => setState(prevState => ({...prevState, data: d})));
        setState(prevState => ({...prevState, allowFetch: false}));
    }

    const handleActiveDot = (dat, el) => {
        setState(prevState => {
            if (prevState.activeDot !== null)
                prevState.activeDot.element.classList.remove("dotSelected");
            el.classList.add("dotSelected");
            return ({
                ...prevState,
                activeDot: {
                    datum: dat,
                    element: el
                }
            });
        });
    }

    const switchVis = () => {
        if (state.activeEntry === null) return;
        const id = state.activeEntry.id;
        if (id === 0) return (
            <div className="vis">
                <DataView
                    key={state.activeEntry.name}
                    visId={id}
                    data={state.data}
                    y_ID="co" // the property name in the raw data
                    unit="ppm" // y-axis label
                    defaultYRange={[0, 300]}
                    margin={{left: 50, right: 30, top: 40, bottom: 35}}
                    activeDot={handleActiveDot}
                />
            </div>
        );
        else if (id === 1) return (
            <div className="vis">
                <div>
                    <DataView
                        key={state.activeEntry.name}
                        visId={id}
                        data={state.data}
                        y_ID="temperature" // the property name in the raw data
                        unit="°C" // y-axis label
                        defaultYRange={[0, 30]}
                        margin={{left: 50, right: 30, top: 40, bottom: 35}}
                        activeDot={handleActiveDot}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <div id="content">
                {
                    state.activeEntry !== null ?
                    <header>{state.activeEntry.name}</header>
                    : null
                }
                <div style={{textAlign: "center"}}>
                {
                    state.activeDot ? (
                        <React.Fragment>
                            <p>{state.activeDot.datum[0]}</p>
                            <span className="graphValue">{state.activeDot.datum[1]}</span>
                        </React.Fragment>
                    )
                    : null
                }
                </div>
                {switchVis()}
            </div>
            <Menu entries={state.entries}
                  active={state.activeEntry}
                  select={selection => setState(prevState => ({...prevState, activeEntry: selection}))}
            />
        </div>
    );
}

export default App;