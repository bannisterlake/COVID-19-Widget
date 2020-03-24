import React, {useState, useEffect} from 'react';

import { Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TableContainer, TextField, InputAdornment, Input, Select, MenuItem, InputLabel, FormControl} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search';

const styles = makeStyles({
    root: {
        backgroundColor: 'white'
    },
    table: {
        maxHeight: 500
    },
    body: {
        overflow: 'auto'
    },
    searchBar: {
        display: 'flex',
        color: 'grey',
        justifyContent: 'flex-end',
        margin: 5,
        '& #search-bar': {
            alignSelf: 'flex-end',
            width: 200

        },
        '& svg': {
            paddingTop: 4,
            paddingRight: 5
        }
    }
})



const TableChart = (props) => { 
    
    const classes = styles();

    const [sortDirection, toggleSortDirection] = useState(1)
    const [sortBy, setSortBy] = useState("confirmed")
    const [filter, setFilter] = useState('')
    const [summary, setSummary] = useState({'confirmed': 0, 'deaths': 0, 'recovered': 0});

    useEffect(()=>{
        setTotals()
    },[])

    const changeSortBy = (sort) => {
        console.log(sort, sortBy)
        if (sortBy !== sort ) {
            setSortBy(sort)
        } else {
            console.log(sortDirection)
            toggleSortDirection(sortDirection*-1)
        }
    }

    const handleChange = e => {
        setFilter(e.target.value);
        setTotals
    }
    const setTotals = ()=> {
        if (props.data) {
            let totalConfirmed = 0
            let totalDeaths = 0
            let totalRecovered = 0

            props.data.customList.filter(arr=>{
                if (arr.region) {
                    if (arr.country.toLowerCase().indexOf(filter.toLowerCase()) != -1 ||arr.region.toLowerCase().indexOf(filter.toLowerCase()) != -1 ) {
                        return true
                    }
                }
            }).forEach(country=>{
                totalConfirmed+= parseInt(country.confirmed);
                totalDeaths+= parseInt(country.deaths);
                totalRecovered+= parseInt(country.recovered);
            })
        
            return (
                <TableRow >
                    <TableCell style={{fontWeight: 'bold'}}>Total</TableCell>
                    <TableCell style={{fontWeight: 'bold'}} align="right">{totalConfirmed.toString().replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>
                    <TableCell style={{fontWeight: 'bold'}} align="right">{totalDeaths.toString().replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>
                    <TableCell style={{fontWeight: 'bold'}} align="right">{totalRecovered.toString().replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>
                </TableRow>
            );
        }
    }

    const small = screen.width < 600
    console.log(small)
  
    return (
        <div className={classes.root}>
            <TableContainer className={classes.table}>

                <div className={classes.searchBar} style={{flexDirection: small ? 'column': 'row'}}>
    			{/* <h1>COVID-19 Cases by Country/Region</h1> */}

                <FormControl id="search-bar" >
                <InputLabel id="demo-simple-select-outlined-label">Select Region</InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={filter}
                    onChange={handleChange}
                    label="Region"
                    >
                        <MenuItem value="">
                            <em>World</em>
                        </MenuItem>
                        <MenuItem value={"Asia"}>Asia</MenuItem>
                        <MenuItem value={"Caribbean"}>Caribbean</MenuItem>
                        <MenuItem value={"Central America"}>Central America</MenuItem>
                        <MenuItem value={"Europe"}>Europe</MenuItem>
                        <MenuItem value={"Middle East"}>Middle East</MenuItem>
                        <MenuItem value={"North America"}>North America</MenuItem>
                        <MenuItem value={"Oceania"}>Oceania</MenuItem>
                        <MenuItem value={"South America"}>South America</MenuItem>

                    </Select>
                    {/* <InputLabel htmlFor="search-bar">Search</InputLabel>
                    <Input
                        id="search-bar"
                        value={filter}
                        onChange={handleChange}
                        endAdornment={
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                        }
                    /> */}
                    </FormControl>
                </div>
            <Table stickyHeader>
                <TableHead>
                    <TableRow role="checkbox">
                        <TableCell
								// data-tip="Sort by team name"
								onClick={() => changeSortBy("country")}
								>Country
								
								<TableSortLabel
									active={sortBy === "country" ? true : false}
									direction={sortDirection === 1 ? "asc" : "desc"}
								/>
                        </TableCell>
                        <TableCell align="right" onClick={() => changeSortBy("confirmed")} >
								
								<TableSortLabel
									active={sortBy === "confirmed" ? true : false}
									direction={sortDirection === 1 ? "asc" : "desc"}
								/>Confirmed
                        </TableCell>
                        <TableCell align="right" onClick={() => changeSortBy("deaths")} >
								
								<TableSortLabel
									active={sortBy === "deaths" ? true : false}
									direction={sortDirection === 1 ? "asc" : "desc"}
                            />Deaths
                        </TableCell>
                        <TableCell align="right" onClick={() => changeSortBy("recovered")} >
								
								<TableSortLabel
									active={sortBy === "recovered" ? true : false}
									direction={sortDirection === 1 ? "asc" : "desc"}
                            />Recovered
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className={classes.body}>
                    {
                        setTotals()
                    }
                    {props.data && 
                    props.data.customList
                    .sort((a,b)=>{
                        if (isNaN(parseInt(a[sortBy]))) {
                            if (a[sortBy] > b[sortBy]) {
                                return 1 * sortDirection;
                            } else if (a[sortBy] < b[sortBy]) {
                                return -1 * sortDirection;
                            } else
                                return 0;
                        } else {
                            if (parseInt(a[sortBy]) > parseInt(b[sortBy])) {
                                return -1 * sortDirection;
                            } else if (parseInt(a[sortBy]) < parseInt(b[sortBy])) {
                                return 1 * sortDirection;
                            } else
                                return 0;
                        }
                    })  
                    .filter(arr=>{
                        if (arr.region) {
                            if (arr.country.toLowerCase().indexOf(filter.toLowerCase()) != -1 ||arr.region.toLowerCase().indexOf(filter.toLowerCase()) != -1 ) {
                                return true
                            }
                        }
                        
                    })
                    .map(country=>{
                        return <TableRow key={country.id}>
                            <TableCell>{country.country}</TableCell>
                            <TableCell align="right">{country.confirmed.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>
                            <TableCell align="right" >{country.deaths.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>
                            <TableCell align="right">{country.recovered.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>

                        </TableRow>
                    })
                    }
                </TableBody>
            </Table>
            </TableContainer>
        </div>
    );
}

export default TableChart;