import React, { Component } from 'react'


export class Panel extends Component {
    render () {
        return (
            <div className='control-panel box-shadow'>
                <div className="bg-gradient-here-da" />
                
                <h2 className="pres">
                    HERE Waypoint API
                </h2>
                <p className="pres">
                    Оптимально построение маршрута c помощью HERE Waypoint API
                </p>
                <div  className="scroll">
                    { 
                        this.props.waypoints.map( (coords, i) => {
                            return (
                                <div className="pres " key={i}>{coords.lat}, {coords.lng}</div>
                            )
                        }) 
                    }
                </div>
                <div style={{ display:"flex", flexDirection:"row", justifyContent:"center"}}>
                    <button 
                        className="btn-here-da"
                        style={{outline: "none"}}
                        onClick={ this.props.clearWaypoints }>Очистить</button>
                    <button 
                        className="btn-here-da"
                        style={{outline: "none"}}
                        onClick={ this.props.calculateRoute }>Маршрут</button>
                </div>
                <div style={{textAlign: "center"}}>
                   
                </div>
                
            </div>
        )
    }
}