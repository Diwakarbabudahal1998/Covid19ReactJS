import React, { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';
import Map from './Map';
import './App.css';
import Table from './Table';
import { sortData, prettyPrintStat } from './utils';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  // UseEffect =runs piece of code based on a given condition
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    //code inside here will run once when the component loads and not again
    const getCountruData = async () => {
      //API from (https://disease.sh/) https://disease.sh/v3/covid-19/countries
      await fetch('https://disease.sh/v3/covid-19/countries')//API call gareko
        .then((response) => response.json()) //API ko sabai data aauxa yha
        .then((data) => {
          const countries = data.map((country) => (
            {
              //data are separated here(required data)
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        })
    };
    getCountruData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log('Country code>>', countryCode);
    setCountry(countryCode);
    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  console.log('countryinfo>>', countryInfo);

  return (


    <div className="app"> {/* BEM Naming Convention */}
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID 19 Tracker</h1>
          <FormControl className='app__dropdown'>
            <Select
              onChange={onCountryChange}
              variant='outlined'
              value={country}
            >

              {/* Loop through all the countries and show a drop down list of the option */}
              <MenuItem value='worldwide'>Worldwide</MenuItem>

              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }


              {/* <MenuItem value='worldwide'>Worldwide</MenuItem>
            <MenuItem value='worldwide'>Nepal</MenuItem>
            <MenuItem value='worldwide'>China</MenuItem>
            <MenuItem value='worldwide'>India</MenuItem> */}

            </Select>

          </FormControl>
        </div>

        {/* InfoBox */}
        {/* InfoBox */}
        {/* InfoBox */}

        <div className='app__stats'>
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType('cases')}
            title='Coronavirus Cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType('recovered')}
            title='Recovered'
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType('deaths')}
            title='Deaths'
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>



        {/* Map */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />

      </div>
      <Card className='app__right'>
        <CardContent>
          {/* Table */}


          <h3>Live Cases By Country</h3>
          <Table countriess={tableData} />
          {/* Graph */}
          <h3>World wide {casesType}</h3>
          <LineGraph  className='app__graph' casesType={casesType} />
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
