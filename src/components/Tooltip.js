import React from 'react'
import { makeStyles } from '@material-ui/styles';

const styles = makeStyles({
    tooltip: {
        padding: '10px 5px',
        width: '200px',
    },
    tooltipSm: {
        width: '130px'
    },
    title: {
        textAlign: 'center',
        fontSize: '18px', 
        fontWeight: 'bold',
        paddingBottom: '10px'
    },
    titleSm: {
        textAlign: 'center',
        fontSize: '16px', 
        fontWeight: 'bold',
        paddingBottom: '5px'
    },
    dataDiv: {
        fontSize: '16px', 
        display: 'flex', 
        '& div': {
            padding: '5px'
        }
    }, 
    dataDivSm: {
        fontSize: '12px', 
        display: 'flex', 
        '& div': {
            padding: '2px'
        }
    },
    label: {
        width: '50%', 
        textAlign: 'right', 
        paddingRight: '5px',
        borderRight: '4px solid rgb(38, 38, 38)', 
        height: '50%'

    },    
    data: {
        maxWidth: '50%',
        textAlign: 'left', 
        paddingLeft: '5px'
    }
})

const Tooltip =(props) => {
    const classes = styles();

	const width = screen.width;
	const height = screen.height;
	const small = (width < 600 || height < 500) ? true : false;


    return <div className={small ? classes.tooltipSm : classes.tooltip}>
        {props.countryData ?
            <div>
                <div className={small ? classes.titleSm : classes.title}>{props.countryData.country}</div>
                    {/* <div className={classes.dataDiv}>
                        <div className={classes.label}>
                            <div>Confirmed Cases:</div>
                            <div>Deaths:</div>
                            <div>Recovered:</div>
                        </div>
                        <div className={classes.data}>
                            <div>{props.countryData.confirmed}</div>
                            <div>{props.countryData.deaths}</div>
                            <div>{props.countryData.recovered}</div>

                        </div>

                    </div>
 */}

                <div className={small ? classes.dataDivSm : classes.dataDiv}>
                    <div className={classes.label}>Confirmed: </div>
                    <div className={classes.data}>{props.countryData.confirmed.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</div>
                </div>
                <div className={small ? classes.dataDivSm : classes.dataDiv}>
                    <div className={classes.label}>Deaths: </div>
                    <div className={classes.data}>{props.countryData.deaths.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</div>
                </div>
                <div className={small ? classes.dataDivSm : classes.dataDiv}>
                    <div className={classes.label}>Recovered: </div>
                    <div className={classes.data}>{props.countryData.recovered.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</div>
                </div>
            </div>
            :
            <div>
                <div className={classes.title}>{props.country}</div>
                    No Cases Reported
            </div>
        }
    </div>
}

export default Tooltip