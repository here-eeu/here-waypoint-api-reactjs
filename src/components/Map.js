import React, { Component } from 'react'
import { apikey } from '../assets/js/apikey'

export class Map extends Component {
    
    state = {
        map: null,
    }

    componentDidMount () {
        const platform = new window.H.service.Platform({
            apikey: apikey
        })

        const defaultLayers = platform.createDefaultLayers()

        const map = new window.H.Map(
        document.getElementById("map"),
        defaultLayers.vector.normal.map,
            {
                center: { lat: 55.75281545266021, lng: 37.621822357177734 },
                zoom: 12,
                pixelRatio: window.devicePixelRatio || 1
            }
        )

        const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map))
        const ui = window.H.ui.UI.createDefault(map, defaultLayers)

        window.addEventListener('resize', function() {
            map.getViewPort().resize()
        })

        map.addEventListener('contextmenu', e => {

            if (e.target !== map) {
                return
            }
           
            let coord  = map.screenToGeo(e.viewportX, e.viewportY)

            e.items.push(

                new window.H.util.ContextItem({
                  label: [
                    Math.abs(coord.lat.toFixed(4)) + ((coord.lat > 0) ? 'N' : 'S'),
                    Math.abs(coord.lng.toFixed(4)) + ((coord.lng > 0) ? 'E' : 'W')
                  ].join(' ')
                }),
                
                new window.H.util.ContextItem({
                  label: 'Центрировать карту',
                  callback: function() {
                    map.setCenter(coord, true);
                  }
                }),
                
                window.H.util.ContextItem.SEPARATOR,
                
                new window.H.util.ContextItem({
                  label: 'Добавить точку',
                  callback: () => {
                    this.props.updateWaypoints(coord)
                  }
                })
              )
        })

        this.setState({ map })
    }

    componentWillUnmount() {
        this.state.map.dispose()
    }

    styleRoute (linestring) {
        
        let routeOutline = new window.H.map.Polyline(linestring, {
            style: {
              lineWidth: 10,
              strokeColor: 'rgba(0, 128, 255, 0.7)',
              lineTailCap: 'arrow-tail',
              lineHeadCap: 'arrow-head'
            }
          })
          
          let routeArrows = new window.H.map.Polyline(linestring, {
            style: {
              lineWidth: 10,
              fillColor: 'white',
              strokeColor: 'rgba(255, 255, 255, 1)',
              lineDash: [0, 2],
              lineTailCap: 'arrow-tail',
              lineHeadCap: 'arrow-head' }
            }
          )
  
          let routeLine = new window.H.map.Group();
          routeLine.addObjects([routeOutline, routeArrows])

          return routeLine
    }
    
    render() {

        let { map } = this.state
        
        if( map != null ){
            map.removeObjects(map.getObjects())
            
            this.props.waypoints.forEach(feature => {
                map.addObject(new window.H.map.Marker(feature))
            })

            if (this.props.route.length !== 0) {
                
                let lineString = new window.H.geo.LineString()
                
                this.props.route.forEach(feature => {
                    lineString.pushPoint({lat: feature[0], lng: feature[1]})
                })
                
                let routeLine = this.styleRoute(lineString)

                map.addObject(routeLine)
            }
            
        }

        return <div id="map" style={{ height: "100%", width: "100%" }} />
    }
}