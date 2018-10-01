import React, {Component} from 'react'
import {fetchAllRestaurantsFromServer} from '../store/restaurant'
import {connect} from 'react-redux'

const mapStateToProps = state => {
  return {
    allRestaurants: state.restaurant.allRestaurants,
    allFetching: state.restaurant.allFetching
  }
}

const mapDispatchToProps = dispatch => ({
  fetchAllRestaurantsFromServer: () => dispatch(fetchAllRestaurantsFromServer())
})

export class AllRestaurants extends Component {
  handleClick = event => {
    event.preventDefault()
    this.props.fetchAllRestaurantsFromServer()
  }
  render() {
    const allRestaurants = this.props.allRestaurants
    if (this.props.allFetching) {
      return (
        <div>
          <button type="button" onClick={this.handleClick}>
            {' '}
            Fetch Restaurants
          </button>
        </div>
      )
    } else
      return (
        <div>
          <h1>All Restaurants</h1>
          {allRestaurants.map((restaurant, idx) => {
            return (
              <div key={restaurant.id}>
                <p>
                  {idx + 1} Google Name {restaurant.name} ---------- ||Yelp Name{' '}
                  {restaurant.yelpResults.name}
                </p>
                <p>
                  Price level: {restaurant.price_level} ---------- ||Yelp Price
                  level: {restaurant.yelpResults.price}
                </p>
                <p>
                  Google Rating: {restaurant.rating} ---------- ||Yelp Rating:{' '}
                  {restaurant.yelpResults.rating}{' '}
                </p>
                <p>
                  ---------------------------------------------------------------------------------------------
                </p>
              </div>
            )
          })}
        </div>
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllRestaurants)
