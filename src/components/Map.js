import React, { useState, useEffect } from "react";

import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
  } from "react-simple-maps";
  
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
  
import ReactTooltip from 'react-tooltip'

import { makeStyles } from "@material-ui/styles";

import Tooltip from './Tooltip'

const geoUrl = './data/world-110m.json'

const styles=makeStyles({
    map: {

    },
    legend: {
        position: 'absolute',
        zIndex: 100,
        bottom: 10,
        left: 10, 
    },
    legendTitle: {
        fontWeight: 'bold',
        fontSize: '20px',
    },
    legendBox: {
        backgroundColor: 'white',
        padding: 5,
        marginBottom: 10, 
    },
    legendList: {
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        '& div': {
            display: 'flex',
            alignItems: 'center'

        }
    },
    bullet: {
        height: '8px', 
        width: '8px',
        backgroundColor: 'red', 
        borderRadius: '50%', 
        border: '1px solid slategray',
        marginRight: 10
    },
    legendToggle: {
        backgroundColor: 'white', 
        padding: 5,
        paddingTop: 6,
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        width: '120px',
        maxWidth: '120px',
        cursor: 'pointer'

    },
    legendToggleSm: {
        backgroundColor: 'white', 
        padding: 4,
        paddingTop: 5,
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        width: '80px',
        maxWidth: '80px',
        cursor: 'pointer'


    }
})

// #ede5cf,#e0c2a2,#d39c83,#c1766f,#a65461,#813753,#541f3f

// const scale = ['#94939f', '#ede5cf','#d39c83','#a65461','#813753','#541f3f']
// const scale = ['#94939f','#fef0d9','#fdcc8a','#fc8d59','#e34a33','#b30000']
const scale = ['#94939f', '#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15']

const Map = (props) => {

    const classes = styles()
    const [show, toggleShow] = useState((screen.width > 500 && screen.height > 600) ? true: false)

    useEffect(() => {
        setTimeout(() => {
            ReactTooltip.rebuild()
        }, 1000);        
    }, [])

    const getCountryData = (country) => {
        try {

            const covidData =props.data.customList.find(el=>{
                return el.iso2 === country
            })
            return covidData
            ReactTooltip.show()
        } catch(e) {

        }
    }

    const getFill = (country) => {
        const results = getCountryData(country)
        if (results) {
            let color = scale[5]
            if (results.confirmed < 10) {
                color = scale[1];
            } else if (results.confirmed < 100) {
                color = scale[2]; 

            } else if (results.confirmed < 999) {
                color = scale[3]
            } else if (results.confirmed < 9999) {
                color =  scale[4];
            }
            return color; 


        } else 
        return scale[0]
    }

    return (
        <>
            <TransformComponent>
                <ComposableMap projection="geoMercator" projectionConfig={{scale: 125}} 
                height={450}
                >
                    <ZoomableGroup disablePanning disableZooming center={[0,30]}>
                        <Geographies geography={geoUrl}>
                            {({geographies}) =>
                                geographies.map(geo=>{
                                    const fill = getFill(geo.properties.ISO_A2)
                                    return <Geography 
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={fill}
                                    stroke="#d9d9d9"
                                    strokeWidth="0.1"
                                    data-tip={`${geo.properties.ISO_A2}|${geo.properties.NAME}`}
                                    onClick={()=>ReactTooltip.show()        }
                                    style={{
                                        default:{
                                            outline: 'none'
                                        }, 
                                        hover: {
                                            outline: 'none',
                                            fill: fill,
                                            opacity: 0.8,
                                            strokeWidth: '0.4'

                                        },
                                        pressed: {
                                            outline: 'none',
                                            fill: fill,

                                        }

                                    }}
                                    />
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
                <div className={classes.legend}>
                {show && 
                    <div className={classes.legendBox}>
                        <div style={{fontWeight: 'bold', fontSize: (screen.width > 500 && screen.height > 600) ? '20px' : '16px'}} className={classes.legendTitle}>Reported Cases</div>
                        <div className={classes.legendList}>
                            <div>
                                <div className={classes.bullet} style={{backgroundColor: scale[0]}}/> <div>0 or no data</div>
                            </div>
                            <div>
                                <div className={classes.bullet} style={{backgroundColor: scale[1]}}/> <div>1-9</div>
                            </div>
                            <div>
                                <div className={classes.bullet} style={{backgroundColor: scale[2]}}/> <div>10-99</div>
                            </div><div>
                                <div className={classes.bullet} style={{backgroundColor: scale[3]}}/> <div>100-999</div>
                            </div><div>
                                <div className={classes.bullet} style={{backgroundColor: scale[4]}}/> <div>1,000-9,999</div>
                            </div><div>
                                <div className={classes.bullet} style={{backgroundColor: scale[5]}}/> <div>10,000+</div>
                            </div>
                        </div>

                    </div>}
                    <div onClick={()=>toggleShow(!show)} className={(screen.width > 500 && screen.height > 600) ?classes.legendToggle: classes.legendToggleSm}>{show ? 'Hide' : 'Show'} Legend</div>
                </div>
            </TransformComponent>
            <ReactTooltip 
                overridePosition={ (
                    { left, top },
                    currentEvent, currentTarget, node) => {
                    const d = document.documentElement;
                    left = Math.min(d.clientWidth - node.clientWidth, left);
                    top = Math.min(d.clientHeight - node.clientHeight, top);
                    left = Math.max(0, left);
                    top = Math.max(20, top);
                    return { top, left }}}
                effect="solid" arrowColor='transparent' textColor={'#f2f2f2'} backgroundColor={'#808080'} 
                getContent={(data)=>{
                    if (data) {
                        const countryName = data.split('|')[1]
                        const countryCode = data.split('|')[0]
                        return <Tooltip country={countryName} countryData={getCountryData(countryCode)} />

                    }
            }}/>
</> 
    )
}

export default Map;
