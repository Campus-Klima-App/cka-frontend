import React, {useState} from 'react';
import DataView from './dataView';
import Menu from './menu';
import './styles.css';
import * as d3 from "d3";
import {testdata} from '../testdata.js';

import CO_Icon from '../icons/CO_Icon.svg';
import Temp_Icon from '../icons/Temp_Icon.svg';
import Humid_Icon from '../icons/Humid_Icon.svg';
import UV_Icon from '../icons/UV_Icon.svg';

function App() {

    const [activeEntry, setActiveEntry] = useState(null);
    const [entries] = useState([
        {id: 0, name: "Kohlenstoffmonoxid", icon: CO_Icon},
        {id: 1, name: "Temperatur", icon: Temp_Icon},
        {id: 3, name: "Luftfeuchtigkeit", icon: Humid_Icon},
        {id: 4, name: "UV-Index", icon: UV_Icon}
    ]);
    const [allowFetch, setAllowFetch] = useState(true);
    const [data, setData] = useState(null);

    if (allowFetch) {
        //d3.json("https://gist.githubusercontent.com/mickey175/bb19eff9e1625f9db89b68cff9cb5aed/raw/f710ad6374e04fc5bcaf69852a34fd9c35f6831c/data.json")
        //    .then(d => setData(d));
        setData(testdata);
        setAllowFetch(false);
    }

    const switchVis = () => {
        if (activeEntry === null) return;
        const id = activeEntry.id;
        if (id === 0) return (
            <div className="vis">
                <p>Kohlenstoffdioxid</p >
                <div>
                    <DataView
                        key={activeEntry.name}
                        data={data}
                        y_ID="co"
                        unit="ppm"
                        defaultYRange={[0, 300]}
                        margin={{left: 45, right: 30, top: 40, bottom: 35}}
                    />
                </div>
            </div>
        );
        else if (id === 1) return (
            <div className="vis">
                <p>Temperatur</p>
                <div>
                    <DataView
                        key={activeEntry.name}
                        data={data}
                        y_ID="temperature"
                        unit="°C"
                        defaultYRange={[0, 25]}
                        margin={{left: 40, right: 30, top: 40, bottom: 35}}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <div id="content">{switchVis()}</div>
            <Menu entries={entries}
                  active={activeEntry}
                  select={selection => setActiveEntry(selection)}
            />
            <div id="tooltip" />
        </div>
    );
}

export default App;