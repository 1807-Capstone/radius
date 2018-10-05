import React, {Component} from 'react';
import {Grid, Item, Pagination, Divider} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {gotOneRestaurant} from '../store/restaurant';
import {connect} from 'react-redux';
import ReactStars from 'react-stars';
import {StyledTitle} from './styledComponents';

class FilteredRestaurantList extends Component {
  handleRestaurantClick = value => {
    const selectedRestaurant = this.props.restaurants.filter(
      restaurant => restaurant.name === value
    );
    this.props.gotOneRestaurant(selectedRestaurant[0]);
  };

  render() {
    return (
      <div>
        <Divider hidden />
        <Divider hidden />
        <Grid centered stackable>
          <Grid.Column width={15} centered="true">
            <div>
              {/* <Header as="h4">Restaurants</Header> */}
              <Item.Group divided>
                <div className="two column doubling ui grid">
                  {this.props.restaurants.map(restaurant => {
                    return (
                      <Item key={restaurant.id} className="column">
                        <Item.Image src={restaurant.yelpResults.image_url} />
                        <Item.Content>
                          <Item.Header
                            as={Link}
                            to={`/restaurants/${restaurant.name}`}
                            onClick={() =>
                              this.handleRestaurantClick(restaurant.name)
                            }
                          >
                            <StyledTitle>{restaurant.name}</StyledTitle>
                          </Item.Header>

                          <Item.Description>
                            <p>
                              Radius rating:{' '}
                              <ReactStars
                                count={5}
                                value={restaurant.radiusRating}
                                half={true}
                                color2="#35b3bf"
                                size="25px"
                              />
                              Yelp rating:{' '}
                              <ReactStars
                                count={5}
                                value={restaurant.yelpResults.rating}
                                half={true}
                                color2="#C50A00"
                              />
                              Google rating:
                              <ReactStars
                                count={5}
                                value={restaurant.rating}
                                half={true}
                                color2="#C58600"
                              />
                            </p>
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    );
                  })}
                </div>
              </Item.Group>
              <div className="ui one column stackable center aligned page grid">
                <Pagination
                  boundaryRange={1}
                  siblingRange={1}
                  onPageChange={this.props.handleSelect}
                  size="mini"
                  totalPages={this.props.numPages}
                />
              </div>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  gotOneRestaurant: restaurant => dispatch(gotOneRestaurant(restaurant))
});

export default connect(null, mapDispatchToProps)(FilteredRestaurantList);