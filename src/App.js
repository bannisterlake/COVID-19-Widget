import React, { useState, useEffect } from "react";
import "./App.css";
import {makeStyles} from '@material-ui/core/styles';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ReactTooltip from 'react-tooltip'
import axios from 'axios'

//Components
import Map from './components/Map';

const styles = makeStyles({
	title: {
		padding: '10px 0',
		textAlign: 'center',
		color: '#d9d9d9', 
		fontSize: '38px',
		fontWeight: 'bold', 
		backgroundColor: 'rgba(38, 38, 38, 0.8)'

	}
})

const App = () => {

	const [data, setData] = useState(null)

	const [counter, setCounter] = useState(360)

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
				
			});
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
		<div className="main">
			<div className={classes.title} style={{fontSize: small && '20px'}} >COVID-19 Confirmed Cases</div>
			<TransformWrapper 
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
			</TransformWrapper>
		</div>
	);
}

export default App;