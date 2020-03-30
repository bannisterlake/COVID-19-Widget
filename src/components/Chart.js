import React, {useState, useEffect} from 'react';

import {makeStyles} from '@material-ui/core';

import {VictoryChart, LineSegment, VictoryLine, VictoryTooltip, createContainer, VictoryAxis} from 'victory';
import { Checkbox, FormGroup, FormControlLabel, RadioGroup, Radio, FormLabel, FormControl} from '@material-ui/core';

const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

const colors = ['#66c2a5', '#fc8d62', '#e78ac3', '#8da0cb', '#a6d854'];

const styles = makeStyles({
  chartDiv: {
    display: 'flex', 
    flexDirection: 'row',
    maxHeight: '90%',
    position: 'relative',
    width: '100%',
  },
  sideBar: {
    padding: 10,
    overflow: 'auto',
    backgroundColor: '#d9d9d9'
  },
  chart:  {
    flex: 5,
    padding: '20px'
  }, 
  legend: {
    padding: '10px',
    backgroundColor: '#d9d9d9',
    display: 'flex',
    flexWrap: 'wrap',

    '& .legendEl': {
      display: 'flex',
      width: '100px' ,
      alignItems: 'center',
      padding: '0 10px'
    }
  },
  radioDiv: {
    display: 'flex', 
    '& span': {
      fontSize: '14px !important',
      padding: '2px'
      
    }
    
  },
  comboBox: {
    paddingTop: '10px'
  }

});

const ChartWidget = (props) => {

    const [zoomDomain, setZoomDomain] = useState(null);
    const [indexList, setIndexList] = useState([0]);
    const [error, setError] = useState(false);
    const [domain, setDomain] = useState({x: [1, props.data[0].dayCount.length], y: [0,2088]});
    const [dataset, toggleDataset] = useState("confirmed")

    const classes = styles();

    useEffect(()=>{
      resetDomain([0])
    },[])

    const handleZoom = (domain) => {
      setZoomDomain(domain)
    }

    const resetDomain = (list, data=dataset) => {
      console.log("reset domain", dataset)
      let highlist = list.map(el=>{
        return Math.max.apply(Math, props.data[el].dayCount.map(function(o) { return o[data]; }))
      })

      let highcount = Math.max.apply(null, highlist)

      console.log(highlist, highcount)

      setDomain({x: [1, props.data[0].dayCount.length], y: [0,highcount]})
    }

    const handleChange = (e) => {
      setError(false)
      const value = parseInt(e.target.name)
        if (indexList.includes(parseInt(e.target.name)) && indexList.length === 1){
          setIndexList([0])
          resetDomain([0])
        } else if (indexList.includes(parseInt(e.target.name))) {
          setIndexList(indexList.filter((list)=>list!==value))
          resetDomain(indexList.filter((list)=>list!==value))
        } else if (indexList.length < 5) {

          setIndexList(indexList.concat(value))
          resetDomain(indexList.concat(value))
        } else 
          setError(true)
        
    }

    const getColor = (i) => {
      console.log(colors[i])
      return '#66c2a5'
    }
    
    const handleChangeRadio = (e) => {
      toggleDataset(e.target.value)
      resetDomain(indexList, e.target.value)
    }

    return (
        <div style={{flexDirection: props.small ? 'column': 'row'}} className={classes.chartDiv}>
          <div className={classes.sideBar} style={{flex: props.small ? 2: 1}}>
							<RadioGroup
                style={{flexDirection: props.small ? 'row': 'column'}}
								className={classes.radioDiv}
								color="white"
								value={dataset}
								onChange={handleChangeRadio}
							>
								<FormControlLabel 
									value="confirmed"
									control={<Radio color="primary" />}
									label="Confirmed"
									labelPlacement="end"
								/>
								<FormControlLabel 
									value="deaths"
									control={<Radio color="primary" />}
									label="Deaths"
									labelPlacement="end"
								/>
                <FormControlLabel 
									value="recovered"
									control={<Radio color="primary" />}
									label="Recovered"
									labelPlacement="end"
								/>
							</RadioGroup>
              <FormControl error={error} id="search-bar" className={classes.comboBox}>
                <FormLabel id="demo-simple-select-outlined-label">Select Up to 5 Countries</FormLabel>
                    <FormGroup
                    id="demo-simple-select-outlined"
                    value={""}
                    label="Region"
                    >
                      {props.data.map((el,i) => 
                        <FormControlLabel
                          key={i}
                          // error={error}
                          control={<Checkbox checked={indexList.includes(i)} onChange={handleChange} name={i.toString()} />}
                          label={el.country}
                        />
                      )
                      }
                    </FormGroup>
                  </FormControl>
            </div>
            <div className={classes.chart}>
              <div className={classes.legend} style={{ 
                  margin: props.small ? '0px': '20px 0'

              }}>
                  {
                    indexList.map((i, j)=>{
                      return <div className="legendEl">
                        <hr style={{margin: '5px',width: '25px', borderWidth: '2px',borderColor: colors[j], borderStyle: 'solid'}}/>
                        <div>{props.data[i].country}</div>
                      </div>
                    })
                  }    
              </div>
            <VictoryChart
                id="vicChart"
                style={{flex: 7, height: '100%'}}
                    containerComponent={
                    <VictoryZoomVoronoiContainer
                      zoomDimension="x"
                      // voronoiPadding={20}
                      // voronoiDimension="x"
                      domain={domain}
                      zoomDomain={domain}
                      onZoomDomainChange={handleZoom}
                      labelComponent={<VictoryTooltip 
                        style={{
                          fontSize: '10px',
                          fontFamily: 'Helvetica'
                        }} 
                        pointerLength={5} 
                        cornerRadius={0} 
                        flyoutStyle={{ width: 10, stroke: 'black', strokeWidth: '0.5'}}/>}
                        labels={({ datum }) => {
                          return `${datum.childName}\nDate: ${datum.date}\nCases: ${datum.confirmed.toString().replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}\nDeaths: ${datum.deaths.toString().replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}\nRecovered: ${datum.recovered.toString().replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}`
                        }}
                      
                    />
                }>
                  
                  <VictoryAxis
                    fixLabelOverlap
                    tickFormat={x=>{
                      const label = new Date(x);
                      return `${label.getMonth()+1}/${label.getDate()}` 
                    }}
                    style={{
                      axis: {stroke: '#756f6a'},
                      tickLabels: { 
                        fill: '#756f6a', 
                        fontFamily: 'Helvetica', 
                        fontSize: '12px'
                     }
                    }}

                  />
                  <VictoryAxis 
                    gridComponent={<LineSegment style={{stroke: '#756f6a'}} type={"grid"}/>}
                    tickCount={5} 
                    dependentAxis
                    style={{
                      axis: {stroke: '#756f6a'},
                      tickLabels: { fill: '#756f6a',
                      fontFamily: 'Helvetica',
                      fontSize: '12px'

                    }
                    }}
                    />
                    {indexList.map((i, j)=>{
                      return <VictoryLine 
                      key={j}
                      // color="#cc5f00"
                      tickFormat={(x,i) =>{ 
                        let label = new Date(x);
  
                        if (i % 10 === 0) {
                          return `${label.getMonth()+1}/${label.getDate()}`
                        }
  
                      }}
                      data={props.data[i].dayCount} 
                      style={{
                        data: {
                          stroke: colors[j]
                        }
                      }}
                      name={props.data[i].country}
                      x="date"
                      y={dataset}
  
                  />
                  
                    })



                    }
            </VictoryChart>
            </div>
        </div>
      );
}

export default ChartWidget;