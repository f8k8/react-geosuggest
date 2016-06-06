import React from 'react'; // eslint-disable-line no-unused-vars
import {expect} from 'chai';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import predictions from './fixtures/predictions';
import Geosuggest from '../src/Geosuggest';

window.google = global.google = {
  'maps': {
    'LatLng': () => true,
    'places': {
      AutocompleteService() {
        return {
          'getPlacePredictions': sinon.stub().callsArgWith(1, predictions())
        };
      }
    },
    Geocoder() {
      return {
        geocode: sinon.stub().callsArgWith(1, [
          {
            geometry: {
              location: {
                lat: () => 0,
                lng: () => 0
              }
            }
          }
        ], 'OK')
      };
    },
    'GeocoderStatus': {
      'OK': 'OK'
    }
  }
};

describe('Component: Geosuggest', () => {
  let component = null,
    onSuggestSelect = null,
    onActivateSuggest = null,
    isLocationCalled, // eslint-disable-line init-declarations
    isActivateCalled; // eslint-disable-line init-declarations

  beforeEach(() => {
    isLocationCalled = false;
    isActivateCalled = false;
    onSuggestSelect = () => isLocationCalled = true;
    onActivateSuggest = () => isActivateCalled = true;

    component = TestUtils.renderIntoDocument(
      <Geosuggest
        radius='20'
        onSuggestSelect={onSuggestSelect}
        onActivateSuggest={onActivateSuggest}
        style={{
          'input': {
            'borderColor': '#000'
          },
          'suggests': {
            'borderColor': '#000'
          },
          'suggestItem': {
            'borderColor': '#000',
            'borderWidth': 1
          }
        }}
      />
    );
  });

  it('should have an input field', () => {
    const input = TestUtils.scryRenderedDOMComponentsWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
    expect(input).to.have.lengthOf(1);
  });

  it('should call `onSuggestSelect` when we type a city name and choose some of the suggestions', () => { // eslint-disable-line max-len
    const input = component.refs.input,
      geoSuggestInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
    input.value = 'New';
    TestUtils.Simulate.change(geoSuggestInput);
    TestUtils.Simulate.keyDown(geoSuggestInput, {
      key: 'keyDown',
      keyCode: 40,
      which: 40
    });
    TestUtils.Simulate.keyDown(geoSuggestInput, {
      key: 'keyDown',
      keyCode: 40,
      which: 40
    });
    TestUtils.Simulate.keyDown(geoSuggestInput, {
      key: 'Enter',
      keyCode: 13,
      which: 13
    });
    expect(isLocationCalled).to.be.true; // eslint-disable-line no-unused-expressions, max-len
  });

  it('should call `onActivateSuggest` when we key down to a suggestion', () => { // eslint-disable-line max-len
    const input = component.refs.input,
      geoSuggestInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
    input.value = 'New';
    TestUtils.Simulate.change(geoSuggestInput);
    TestUtils.Simulate.keyDown(geoSuggestInput, {
      key: 'keyDown',
      keyCode: 40,
      which: 40
    });
    expect(isActivateCalled).to.be.true; // eslint-disable-line no-unused-expressions, max-len
  });

  it('should add external inline `style` to input component', () => { // eslint-disable-line max-len
    const geoSuggestInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
    expect(geoSuggestInput.style['border-color']).to.be.equal('#000');
  });

  it('should add external inline `style` to suggestList component', () => { // eslint-disable-line max-len
    const geoSuggestList = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__suggests'); // eslint-disable-line max-len
    expect(geoSuggestList.style['border-color']).to.be.equal('#000');
  });

  it('should hide the suggestion box when there are no suggestions', () => {
    const input = component.refs.input,
      geoSuggestInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'), // eslint-disable-line max-len
      geoSuggestList = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__suggests'), // eslint-disable-line max-len
      classList = geoSuggestList.classList;

    input.value = 'There is no result for this. Really.';
    TestUtils.Simulate.change(geoSuggestInput);

    expect(classList.contains('geosuggest__suggests--hidden')).to.be.true; // eslint-disable-line max-len, no-unused-expressions
  });
});
