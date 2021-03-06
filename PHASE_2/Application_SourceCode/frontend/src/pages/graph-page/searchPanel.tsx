import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/button';
import config from '../../config';
import Switch from '../../components/switch';
import Modal from '../../components/modal';
import Autocomplete from '../../components/autocomplete';
import HelpButton from '../../components/helpButton';

const FlexContainer = styled.div`
  display: flex;
  background: ${config.theme.darkColor};
  align-items: center;
  padding: 5px;
`;
const GridContainer = styled.div`
  display: grid;
  padding: 10px;
  color: ${config.theme.primaryLight};
  margin: auto;
  font-size: 12px;
  text-align: center;
`;

interface SearchPanelProps {
  fetchData: (
    google: Array<string>,
    twitter: Array<string>,
    countries: Array<string>
  ) => void;
  error: boolean;
  totalCases: boolean;
  setTotalCases: (value: boolean) => void;
  totalDeaths: boolean;
  setTotalDeaths: (value: boolean) => void;
  newCases: boolean;
  setNewCases: (value: boolean) => void;
  newDeaths: boolean;
  setNewDeaths: (value: boolean) => void;
  predict: boolean;
  setPredict: (value: boolean) => void;
}


export const SearchPanel = (props: SearchPanelProps) => {
  const {
    totalCases,
    setTotalCases,
    totalDeaths,
    setTotalDeaths,
    newCases,
    setNewCases,
    newDeaths,
    setNewDeaths,
    predict,
    setPredict
  } = props;
  const [googleTerms, setGoogleTerms] = useState([]);
  const [twitterTags, setTwitterTags] = useState([]);
  const [countries, setCountries] = useState(['Global']);

  const santitisedDataFetch = () => {
    try {
      if (googleTerms.length + twitterTags.length + countries.length === 0) {
        throw new Error('Please enter a Google search term, Twitter hashtag or Country');
      }
    } catch (err) {
      showModal(err);
      return null;
    }
    return props.fetchData(googleTerms, [], countries);
  };

  const handleSwitch = (event, setSwitch) => {
    setSwitch(event);
  };
  const handleGoogleTerms = (event, value, reason) => {
    setGoogleTerms(value);
  };
  const handleTwitterTags = (event, value, reason) => {
    setTwitterTags(value);
  };
  const handleCountry = (event, value, reason) => {
    setCountries(value);
  };

  const showModal = (error) => {
    var modals = document.getElementsByClassName('modal') as HTMLCollectionOf<
      HTMLElement
    >;
    var modalContents = modals[0].getElementsByClassName(
      'modal-content',
    ) as HTMLCollectionOf<HTMLElement>;
    modalContents[0].getElementsByTagName('p')[0].textContent = error;
    modals[0].style.display = 'block';
  };

  return (
    <FlexContainer>
      <Modal error={() => props.error}></Modal>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <GridContainer>
          Total Cases
          <Switch
            checked={totalCases}
            onChange={(event) => handleSwitch(event, setTotalCases)}
          />
        </GridContainer>
        <GridContainer>
          New Cases
          <Switch
            checked={newCases}
            onChange={(event) => handleSwitch(event, setNewCases)}
          />
        </GridContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <GridContainer>
          Total Deaths
          <Switch
            checked={totalDeaths}
            onChange={(event) => handleSwitch(event, setTotalDeaths)}
          />
        </GridContainer>
        <GridContainer>
          New Deaths
          <Switch
            checked={newDeaths}
            onChange={(event) => handleSwitch(event, setNewDeaths)}
          />
        </GridContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
        <GridContainer>
          Predict
          <Switch
            checked={predict}
            onChange={(event) => handleSwitch(event, setPredict)}
          />
        </GridContainer>
      </div>
      <FlexContainer>
        <Autocomplete height="100px" width="300px" onChange={handleGoogleTerms} options={'none'} label={'Google Search Terms'} placeholder={'Google Search Terms'} defaultValue={[]} />
        <HelpButton height="100px" toolTipMessage={'Type out your search terms separated by commas.\nEach search term will be a new graph.\nType [seachTerm]:[country] to narrow the search down to an individual country'} toolTipTitle={"Help"}></HelpButton>
      </FlexContainer>
      <FlexContainer>
        <Autocomplete height="100px" width="300px" onChange={handleTwitterTags} options={'none'} label={'Twitter Hashtags'} placeholder={'Twitter Hashtags'} defaultValue={[]} />
        <HelpButton height="100px" toolTipMessage={'Not Yet Implemented'} toolTipTitle={"Help"}></HelpButton>
      </FlexContainer>
      <FlexContainer>
        <Autocomplete height="100px" width="300px" onChange={handleCountry} options={'countries'} label={'COUNTRIES'} placeholder={'Countries'} defaultValue={['Global']} />
        <HelpButton height="100px" toolTipMessage={'Type out your countries separated by commas.\nEach country will be a new graph.'} toolTipTitle={"Help"}></HelpButton>
      </FlexContainer>
      <GridContainer>
        <Button hover={true} onClick={santitisedDataFetch}>
          SUBMIT
        </Button>
      </GridContainer>
    </FlexContainer>
  );
};

export default SearchPanel;
