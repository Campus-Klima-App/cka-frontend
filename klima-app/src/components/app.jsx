import React, {useState} from 'react';
import LineGraph from './lineGraph';
import Menu from './menu';
import './styles.css';

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
    ])

    const switchVis = () => {
        if (activeEntry === null) return;
        const id = activeEntry.id;

        if (id === 0) return (
            <div>
                <div className="vis">
                    <h4>Kohlenstoffmonoxid</h4>
                    <LineGraph key={activeEntry.name + 0} data={dataset1} xProp="time" yProp="value" />
                </div>
                <div className="vis">
                    <h4>Kohlenstoffmonoxid</h4>
                    <LineGraph key={activeEntry.name + 1} data={dataset2} xProp="time" yProp="value" />
                </div>
                <div className="vis">
                    <h4>Kohlenstoffmonoxid</h4>
                    <LineGraph key={activeEntry.name + 2} data={dataset2} xProp="time" yProp="value" />
                </div>
            </div>
        )
        else if (id === 1) return (
            <div className="vis">
                <h4>Temperatur</h4>
                <LineGraph key={activeEntry.name} data={dataset2} xProp="time" yProp="value" />
            </div>
        )
    }

    return (
        <div className="App">
            <div id="content">
                {switchVis()}
            </div>
            <Menu entries={entries} active={activeEntry} select={selection => setActiveEntry(selection)} />
        </div>
    );
}

export default App;


const dataset1 = [
    { time: 0, value: 6 },
    { time: 1, value: 2.9 },
    { time: 2, value: 2.7 },
    { time: 3, value: 4.3 },
    { time: 4, value: 4.5 },
    { time: 5, value: 5 },
    { time: 6, value: 5.2 } ,
    { time: 7, value: 5.1 },
    { time: 8, value: 4.8 },
    { time: 9, value: 4.9 },
    { time: 10, value: 5.1 },
    { time: 11, value: 5.3 },
    { time: 12, value: 5.6 },
    { time: 13, value: 6.2 },
    { time: 14, value: 0 }
]

const dataset2 = [
    { time: 0, value: 0 },
    { time: 1, value: 10 },
    { time: 2, value: 0 },
    { time: 3, value: 100 },
    { time: 4, value: 50 },
    { time: 5, value: 40 },
    { time: 6, value: 0 },
    { time: 7, value: 50 },
    { time: 8, value: 80 }
]


/*
// Testing for update of the components when new data arrives
componentDidMount() {
    setInterval(() => {
        this.setState(prevState => {
            prevState.data[14].time += 0.05;
            prevState.data2[8].time += 0.05;
            return prevState;
        });
    }, 1000);
}
*/