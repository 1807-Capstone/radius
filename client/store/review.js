import axios from 'axios'

// Action types
const GET_REVIEWS = 'GET_REVIEWS'
const ADD_REVIEW = 'ADD_REVIEW'

// Action creators
const getReviews = reviews => ({
  type: GET_REVIEWS,
  reviews
})

const addReview = review => ({
  type: ADD_REVIEW,
  review
})

// Thunks
export const getReviewsFromServer = restaurantId => {
  return async dispatch => {
    const res = await axios.get(`/api/reviews/${restaurantId}`)
    dispatch(getReviews(res.data))
  }
}

export const addReviewToServer = reviewInfo => {
  return async dispatch => {
    const res = await axios.post('/api/reviews', reviewInfo)
    dispatch(addReview(res.data))
  }
}

// Reducer
const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_REVIEWS:
      return action.reviews
    case ADD_REVIEW:
      return [...state, action.review]
    default:
      return state
  }
}

export default reducer;
