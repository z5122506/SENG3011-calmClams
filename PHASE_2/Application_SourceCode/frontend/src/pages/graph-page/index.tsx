import React, { useState } from 'react';
import SearchPanel from './searchPanel';
import styled from 'styled-components';
import Spinner from '../../components/spinner';
import GraphPanel from './graphPanel';

const PageContainer = styled.div``;

interface GraphDataInterface {
  version: number;
  countries: Array<string>;
  graphData: Array<{}>;
}

export const SearchPage = () => {
  const [totalCases, setTotalCases] = useState(true);
  const [totalDeaths, setTotalDeaths] = useState(true);
  const [newCases, setNewCases] = useState(true);
  const [newDeaths, setNewDeaths] = useState(true);

  const [firstLoad, setFirstLoad] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);
  const [data, setData] = useState<GraphDataInterface>({
    version: 0,
    countries: [],
    graphData: [{}]
  });

  const fetchData = async (
    google: Array<string>,
    twitter: Array<string>,
    countries: Array<string>,
  ) => {
    
    setFirstLoad(false);

    fetch('http://localhost:8080/get_data', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_date: '2020-02-01',
        end_date: '2020-04-23',
        countries: countries,
        google: google,
        disease: 'covid19',
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
        let newData: GraphDataInterface = {
          version: dataVersion,
          countries: json.seriesTitles,
          graphData: json.graphData,
        };
        setData(newData);
        setDataVersion(dataVersion + 1);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      });
    setLoading(true);
  };
  return (
    <PageContainer>
      <SearchPanel
        fetchData={fetchData}
        error={error}
        totalCases={totalCases}
        setTotalCases={setTotalCases}
        totalDeaths={totalDeaths}
        setTotalDeaths={setTotalDeaths}
        firstLoad={firstLoad}
        newCases={newCases}
        setNewCases={setNewCases}
        newDeaths={newDeaths}
        setNewDeaths={setNewDeaths}
      />
      <>
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <GraphPanel
            data={data}
            totalDeaths={totalDeaths}
            newCases={newCases}
            totalCases={totalCases}
            newDeaths={newDeaths}
          />
        )}
      </>
    </PageContainer>
  );
};

// generate some random data, quite different range
function generateChartData(suffix) {
  let chartData = [] as any[];
  let firstDate = new Date();
  firstDate.setDate(firstDate.getDate() - 100);
  firstDate.setHours(0, 0, 0, 0);

  let new_cases = 1600;
  let new_deaths = 5;
  let total_cases = 2900;
  let total_deaths = 8700;

  for (var i = 0; i < 15; i++) {
    // we create date objects here. In your data, you can have date strings
    // and then set format of your dates using chart.dataDateFormat property,
    // however when possible, use date objects, as this will speed up chart rendering.
    let newDate = new Date(firstDate);
    newDate.setDate(newDate.getDate() + i);

    new_cases += Math.round(
      (Math.random() < 0.8 ? 1 : -1) * Math.random() * 10,
    );
    new_deaths += Math.round(
      (Math.random() < 0.8 ? 1 : -1) * Math.random() * 10,
    );
    total_cases += Math.round(
      (Math.random() < 0.85 ? 1 : -1) * Math.random() * 10,
    );
    total_deaths += Math.round(
      (Math.random() < 0.9 ? 1 : -1) * Math.random() * 10,
    );

    let data = {};
    data['date_' + suffix] = newDate;
    data['new_cases_' + suffix] = new_cases;
    data['new_deaths_' + suffix] = new_deaths;
    data['total_cases_' + suffix] = total_cases;
    data['total_deaths_' + suffix] = total_deaths;
    chartData.push(data);
  }
  return chartData;
}
export default SearchPage;
