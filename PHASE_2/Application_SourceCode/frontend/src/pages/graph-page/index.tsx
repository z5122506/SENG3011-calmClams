import React, { useState } from 'react';
import SearchPanel from './searchPanel';
import styled from 'styled-components';
import Spinner from '../../components/spinner';
import GraphPanel from './graphPanel';
import Switch from '../../components/switch';

const PageContainer = styled.div``;

interface GraphPageProps {
  disease: string;
  start: string;
  end: string;
};

interface GraphDataInterface {
  seriesTitles: Array<string>;
  graphData: Array<any>;
}

export const SearchPage = (props: GraphPageProps) => {
  console.log(props);
  const [totalCases, setTotalCases] = useState(true);
  const [totalDeaths, setTotalDeaths] = useState(true);
  const [newCases, setNewCases] = useState(true);
  const [newDeaths, setNewDeaths] = useState(true);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GraphDataInterface>({
    seriesTitles: [],
    graphData: [],
  });

  const fetchData = async (
    google: Array<string>,
    twitter: Array<string>,
    countries: Array<string>,
  ) => {

    fetch('http://localhost:8080/get_data', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_date: props.start,
        end_date: props.end,
        countries: countries,
        google: google,
        disease: props.disease,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
        let newData: GraphDataInterface = {
          seriesTitles: json.seriesTitles,
          graphData: json.graphData,
        };

        // Combine all the data and create each series
        for (let i in newData.seriesTitles) {
          const country = newData.seriesTitles[i];
          
          for (let k of newData.graphData[i]) {
              for (let n in k) {
                  if (n.includes("date_")) {
                      // Convert the string dates to actual dates
                      k[n] = new Date(k[n]);
                  } else {
                      // Can't use zero if we try to do a log scale
                      if (k[n] <= 0) {
                          k[n] = 0.0000000001;
                      }
                  }
              }
          }
        }
        setData(newData);
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
        newCases={newCases}
        setNewCases={setNewCases}
        newDeaths={newDeaths}
        setNewDeaths={setNewDeaths}
      />
      <>
        {loading && <Spinner loading={loading} />}
        <>
          <GraphPanel
            data={data}
            totalDeaths={totalDeaths}
            newCases={newCases}
            totalCases={totalCases}
            newDeaths={newDeaths}
          />
        </>
      </>
    </PageContainer>
  );
};
export default SearchPage;
