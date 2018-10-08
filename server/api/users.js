const router = require('express').Router();
const {User} = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id);
    if (req.user === currentUser) {
      res.json(currentUser);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:id/suggested', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id);
    let suggestedRestaurants = await currentUser.getSuggested();
    res.status(200).json(suggestedRestaurants);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/visited', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id);
    let visitedRestaurants = await currentUser.getVisited();
    res.status(200).json(visitedRestaurants);
  } catch (err) {
    next(err);
  }
});
