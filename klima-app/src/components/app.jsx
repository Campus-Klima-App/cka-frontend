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

    const [activeEntry, setActiveEntry] = useState(null);
    const [activeDot, setActiveDot] = useState(null);
    const [entries] = useState([
        {id: 0, name: "Kohlenstoffmonoxid", icon: CO_Icon},
        {id: 1, name: "Temperatur", icon: Temp_Icon},
        {id: 3, name: "Luftfeuchtigkeit", icon: Humid_Icon},
        {id: 4, name: "UV-Index", icon: UV_Icon}
    ]);
    const [allowFetch, setAllowFetch] = useState(true);
    const [data, setData] = useState(null);

    if (allowFetch) {
        d3.json("https://gist.githubusercontent.com/mickey175/bb19eff9e1625f9db89b68cff9cb5aed/raw/f710ad6374e04fc5bcaf69852a34fd9c35f6831c/data.json")
            .then(d => setData(d));
        //setData(testdata);
        setAllowFetch(false);
    }

    const handleActiveDot = (dat, el) => {
        setActiveDot(prevState => {
            if (prevState !== null)
                prevState.element.classList.remove("dotSelected");
            el.classList.add("dotSelected");
            return {
                datum: dat,
                element: el
            };
        });
    }

    const switchVis = () => {
        if (activeEntry === null) return;
        const id = activeEntry.id;
        if (id === 0) return (
            <div className="vis">
                <DataView
                    key={activeEntry.name}
                    visId={id}
                    data={data}
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
                        key={activeEntry.name}
                        visId={id}
                        data={data}
                        y_ID="temperature" // the property name in the raw data
                        unit="°C" // y-axis label
                        defaultYRange={[0, 25]}
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
                    activeEntry !== null ?
                    <header>{activeEntry.name}</header>
                    : null
                }

                <div style={{textAlign: "center"}}>
                {
                    activeDot ? (
                        <React.Fragment>
                            <p>{activeDot.datum[0]}</p>
                            <span className="graphValue">{activeDot.datum[1]}</span>
                        </React.Fragment>
                    )
                    : null
                }
                </div>
                {switchVis()}
            </div>
            <Menu entries={entries}
                  active={activeEntry}
                  select={selection => setActiveEntry(selection)}
            />
        </div>
    );
}

export default App;