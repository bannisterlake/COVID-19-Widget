import React, { useState, useEffect } from "react";
import "./App.css";
import {makeStyles} from '@material-ui/core/styles';
import {Button} from '@material-ui/core'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ReactTooltip from 'react-tooltip'
import axios from 'axios'

//Components
import Map from './components/Map';
import TableChart from './components/Table';
import Chart from './components/Chart';


const styles = makeStyles({
	main: {
		position: 'relative',
		maxHeight: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#333333'
	
	},
	title: {
		marginTop: '10px',
		textAlign: 'center',
		color: '#d9d9d9', 
		fontSize: '34px',
		fontWeight: 'bold', 
		backgroundColor: 'rgba(38, 38, 38, 0.8)'

	},
	widgetNav: {
		position:'relative',
		fontSize: '12px',
		'& button': {
			fontSize: '12px',
			color: 'white'
		}
	},
	selected: {
		border: '1px solid white !important'
	}
})

const App = () => {

	const [data, setData] = useState(null)
	const [chartData, setChartData] = useState(null)

	const [counter, setCounter] = useState(360)

	const [widget, toggleWidget] = useState("chart")

	const classes = styles();

	useEffect(()=>{
		getData()
		startTimer()
	}, [])

	const getData = () => {
		console.log("fetching..")
		fetch(`./data/data.json`,{ cache: "no-cache"})
			.then(res => {
				if (res.ok) {
					return res.json();
				} 
			})
			.then(json => {
				setData(json)
				
			})
			.catch(e=>console.log(e))
		fetch(`./data/countries.json`, {cache: 'no-cache'})
			.then(res=>{
				if (res.ok) {
					return res.json()
				}
			})
			.then(json=>{
				setChartData(json)
			})
			.catch(e=>console.log(e))
	}

	const startTimer = () => {
		// console.log("updating")
		let remaining = counter
		let interval = setInterval(()=>{
			remaining --;
			if (remaining <= 0) {
				getData();
				remaining = counter
			}
		}, 1000);
	}
	
	const closeTooltip = () => {
		ReactTooltip.hide()
	}

	const width = screen.width;
	const height = screen.height;
	const small = (width < 600 || height < 500) ? true : false;

	return (
		<div className={classes.main}>
			<div className={classes.title} style={{fontSize: small && '20px'}} >COVID-19 Pandemic Data
				<div className={classes.widgetNav}>
					<Button className={widget === "map" && classes.selected} onClick={()=>toggleWidget("map")}>Map</Button>
					<Button className={widget === "table" && classes.selected} onClick={()=>toggleWidget("table")}>Table</Button>
					<Button className={widget === "chart" && classes.selected} onClick={()=>toggleWidget("chart")}>Chart</Button>

				</div>
			</div>
			{widget === 'map' && <TransformWrapper 
				wheel={{
					step: 80
				}}
				options={{
					maxScale: 1000,
				}}
				onWheel={closeTooltip}
				onPanning={closeTooltip}
				onPinching={closeTooltip}
				>
					
				<Map data={data}/>
				{/* {data && <p>{data.generated}</p>} */}
			</TransformWrapper>}
			{ widget === "table" &&
				<TableChart data={data} />
			}
			{ (widget === "chart" && chartData) &&
				<Chart small={small} data={chartData}/>

			}

		</div>
	);
}

export default App;