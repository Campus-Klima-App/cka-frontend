import React, { Component } from 'react';
import './menu.css';


class Menu extends Component {

    // Helper function to add a class when a certain condition is fulfilled
    conditionClass = (Class, appendClass, condition) => {
        if (Class === "")
            return(condition ? appendClass : null);
        else
            return(condition ? (Class + " " + appendClass) : Class);
    };

    render() {
        return (
            <div className="menu">
                <ul className="menuList" >
                    {
                        // Go through all menu entries that are given by the main component
                        // and create the menu entries including click event and icon
                        this.props.entries.map(entry => {
                            return (
                                <li key={entry.name}
                                    className={this.conditionClass("", "activeEntry", this.props.active === entry)}
                                    onClick={() => {this.props.select(entry)}}
                                >
                                    <img className="modeImg" src={entry.icon} alt=""/>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default Menu;