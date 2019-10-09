import React, { Component } from 'react';
import { Map, TileLayer, GeoJSON, Marker, Popup, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import img from '../Marcadores/marcador64.png'
import { departamentos } from '../GeoJSON/Departamentos'
import { cabeceras } from '../GeoJSON/Cabeceras'

let myIcon = L.icon({
    iconUrl: img,
    iconSize: [32, 32], //tamaño del marcador
    iconAnchor: [16, 32], //coordenadas del marcador 
    popupAnchor: [0, -32] //coordenadas de la ventana emeergente
})



class MapReact extends Component {


    state = {
        cabeceras: null,
        position: [13, -85],
        zoom: 8,
        url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',

        url2: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
    }



    componentDidMount() {
        this.setState({
            cabeceras: cabeceras
        })
    }

    render() {
        const { position, url, zoom, url2, cabeceras } = this.state


        return (
            <Map className='map' center={position} zoom={zoom}>

                <TileLayer
                    url={url2}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <LayersControl position='topright'>


                    <LayersControl.BaseLayer name='Normal'>
                        <TileLayer
                            url={url2}
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name='Dark'>
                        <TileLayer
                            url={url}
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name='Division'>

                        <GeoJSON

                            data={departamentos}

                            style={(feature) => {
                                return {
                                    color: '#335fff',
                                    fill: true,
                                    opacity: 0.7

                                }
                            }}

                            onEachFeature={(feature, layer) => {

                                layer.on('mouseover', function () {
                                    layer.bindTooltip(feature.properties['departamento']).openTooltip()
                                    this.setStyle({
                                        fillColor: '#FF335F'
                                    })

                                })



                                layer.on('mouseout', function () {

                                    this.setStyle({
                                        'fillColor': '#335fff'
                                    });
                                });

                                layer.on('click', function () {
                                    console.log(feature.properties['departamento'])
                                })

                            }} />
                    </LayersControl.BaseLayer>


                </LayersControl>



                {cabeceras !== null ?

                    cabeceras.features.map((x, i) => (
                        <Marker
                            position={
                                [x.geometry.coordinates[1],
                                x.geometry.coordinates[0]]
                            }
                            icon={myIcon}
                            key={i}>
                            <Popup>
                                Municipio: {x.properties.municipio}
                                <br />
                                Poblacion: {x.properties.poblacion}
                            </Popup>
                        </Marker>
                    )) : null
                }




            </Map>)
    }
}

export default MapReact;