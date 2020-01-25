import React, { Component } from 'react'
import axios from 'axios'

import { Map } from './Map'
import { Panel } from './Panel'

import { apikey } from '../assets/js/apikey'


class App extends Component {

  constructor (props) {
    super(props)

    this.state = {
      waypoints: [],
      route: []
    }

    this.updateWaypoints = this.updateWaypoints.bind(this)
    this.clearWaypoints = this.clearWaypoints.bind(this)
    this.calculateRoute = this.calculateRoute.bind(this)
  }

  calculateRoute () {
    let waypointBaseUrl = "https://wse.ls.hereapi.com/2/findsequence.json?"
    let routeBaseUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?"
    
    let waypointsToString = this.state.waypoints.map( (coords, i) => {

      if (i === 0) {
        return `start=${i};${coords.lat},${coords.lng}`
      } else if (i === this.state.waypoints.length -1) {
        return `end=${i};${coords.lat},${coords.lng}`
      } else {
        return `destination${i}=${i};${coords.lat},${coords.lng}`
      }
    }).join("&")

    let waypointsRequest = waypointBaseUrl + `apikey=${apikey}&&mode=fastest;car&` + waypointsToString

    axios.get(waypointsRequest)
      .then(res => {
        
        let routeToString = res.data.results[0].waypoints.map( (point, i) => {
          return `waypoint${i}=geo!${point.lat},${point.lng}`
        }).join("&")

        let routeRequest = routeBaseUrl + `apikey=${apikey}&&mode=fastest;car&routeattributes=sh&` + routeToString
        
        axios.get(routeRequest)
          .then(routeRes => {
            let polylineArray = routeRes.data.response.route[0].shape.map((coords, i) => {
              return coords.split(',').map(Number);
            })
            this.setState({route: polylineArray})
          })
      }, error => {
        console.log(error)
      })

  }

  updateWaypoints (waypoint) {
    this.setState({ waypoints: [...this.state.waypoints, waypoint] })
  }

  clearWaypoints () {
    this.setState({ waypoints: [], route: []})
  }

  render () {
    return (
      <>
        <Map updateWaypoints={ this.updateWaypoints } waypoints={ this.state.waypoints }  route={ this.state.route }/>
        <Panel clearWaypoints={ this.clearWaypoints } waypoints={ this.state.waypoints } calculateRoute={this.calculateRoute}/>
      </>
    )
  }
}

export default App
