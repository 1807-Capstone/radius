import React, { Component, Fragment } from 'react';
import { reduxForm } from 'redux-form';
import { Grid } from 'semantic-ui-react';

const preventDefault = event => {
  event.preventDefault();
};

class MapFilter extends Component {
  render() {
    return (
      <Fragment>
        <form
          onSubmit={this.props.valid ? this.props.handleSubmit : preventDefault}
          className="ui form"
          id="mapForm"
        >
          <Grid centered>
            <Grid.Column width={3} style={{ margin: '0rem 1rem !important' }}>
              <label>
                CUISINE:<select
                  name="cuisine"
                  onChange={this.props.handleSelectCuisine}
                >
                  <option value="">---</option>
                  <option value="american">American</option>
                  <option value="italian">Italian</option>
                  <option value="mexican">Mexican</option>
                  <option value="chinese">Chinese</option>
                  <option value="burgers">Burgers</option>
                  <option value="japanese">Japanese</option>
                  <option value="steakhouse">Steakhouses</option>
                </select>
              </label>
            </Grid.Column>
            <Grid.Column width={3}>
              <label>
                PRICE:<select
                  name="price"
                  onChange={this.props.handleSelectPrice}
                >
                  <option value="">---</option>
                  <option value="1">$</option>
                  <option value="2">$$</option>
                  <option value="3">$$$</option>
                  <option value="4">$$$$</option>
                </select>
              </label>
            </Grid.Column>
            <Grid.Column width={3}>
              <label>
                DISTANCE:{' '}
                <select
                  name="distance"
                  onChange={this.props.handleSelectDistance}
                >
                  <option value="">---</option>
                  <option value="804">Less than 0.5 miles</option>
                  <option value="1609">Less than 1 mile</option>
                  <option value="8046">Less than 5 miles</option>
                  <option value="32186">Less than 20 miles</option>
                </select>
              </label>
            </Grid.Column>
          </Grid>
          <div className="ui one column stackable center aligned page grid" />
        </form>
      </Fragment>
    );
  }
}
const MapFormRedux = reduxForm({
  form: 'filter'
})(MapFilter);

export default MapFormRedux;
