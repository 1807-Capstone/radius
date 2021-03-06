const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db');
const Restaurant = require('./restaurant');

const User = db.define(
  'user',
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      // Making `.password` act like a func hides it when serializing to JSON.
      // This is a hack to get around Sequelize's lack of a "private" option.
      get() {
        return () => this.getDataValue('password');
      }
    },
    salt: {
      type: Sequelize.STRING,
      // Making `.salt` act like a function hides it when serializing to JSON.
      // This is a hack to get around Sequelize's lack of a "private" option.
      get() {
        return () => this.getDataValue('salt');
      }
    },
    googleId: {
      type: Sequelize.STRING
    },
    checkedInRestaurants: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
    didCheckIn: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
    // imgUrl: {
    //   type: Sequelize.STRING,
    //   allowNull: true
    // },
    // isAdmin: {
    //   type: Sequelize.BOOLEAN,
    //   defaultValue: false
    // }
  },
  {
    setterMethods: {
      checkedInRestaurants: function(array) {
        this.setDataValue('checkedInRestaurants', array);
      }
    }
  }
);

module.exports = User;

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password();
};

function intersection(arrA, arrB) {
  const setB = new Set(arrB);
  return arrA.filter(elem => setB.has(elem));
}

function difference(arrA, arrB) {
  const setB = new Set(arrB);
  return arrA.filter(elem => !setB.has(elem));
}

function shuffle(array) {
  let m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

User.prototype.getVisited = function() {
  const userCheckedInRestaurants = this.getDataValue('checkedInRestaurants');
  if (!userCheckedInRestaurants) {
    return [
      {
        rating: 4,
        yelpResults: {rating: 3},
        radiusRating: 5,
        name: 'No Suggestions Based on Your Data!',
        yelpImg: '/img/dim-sum.jpg'
      }
    ];
  }
  const response = Restaurant.findAll({
    where: {
      id: {
        [Op.or]: userCheckedInRestaurants
      }
    }
  });
  return response;
};

User.prototype.getSuggested = async function() {
  const userId = this.getDataValue('id');
  const userCheckedInRestaurants = this.getDataValue('checkedInRestaurants');
  if (!userCheckedInRestaurants) {
    return [
      {
        rating: 4,
        yelpResults: {rating: 3},
        radiusRating: 5,
        name: 'No Suggestions Based on Your Data!',
        yelpImg: '/img/dim-sum.jpg'
      }
    ];
  } else {
    let recommendedRestaurants = [];
    //Retrieve all users' checked-in restaurant's array
    const allUsers = await User.findAll(
      {where: {id: {[Op.ne]: userId}}},
      {attributes: ['checkedInRestaurants', 'id']}
    );
    //Create an array of these arrays
    const allVisitedRestaurants = allUsers.map(
      elem => elem.dataValues.checkedInRestaurants
    );
    //Check each array for the largest intersection, and set recommendedRestaurants as the difference between that array and user's checked in restaurants
    allVisitedRestaurants.forEach(elem => {
      if (
        intersection(userCheckedInRestaurants, elem).length >
        recommendedRestaurants.length
      ) {
        recommendedRestaurants = difference(elem, userCheckedInRestaurants);
      }
    });
    //If no intersection, return data to avoid error
    if (!recommendedRestaurants.length)
      return [
        {
          rating: 4,
          yelpResults: {rating: 3},
          radiusRating: 5,
          name: 'No Suggestions Based on Your Data!',
          yelpImg: '/img/dim-sum.jpg'
        }
      ];
    //Shuffle and slice recommended restaurant array.
    let shuffledRestaurants = shuffle(recommendedRestaurants);
    if (shuffledRestaurants.length >= 3) {
      shuffledRestaurants = shuffledRestaurants.slice(0, 3);
    }
    //Return relevant data on these arrays, including imgUrl, rating, location etc.
    const response = await Restaurant.findAll({
      where: {
        id: {
          [Op.or]: shuffledRestaurants
        }
      }
    });
    return response;
  }
};

User.prototype.getVisited = function() {
  const userCheckedInRestaurants = this.getDataValue('checkedInRestaurants');
  const response = Restaurant.findAll({
    where: {
      id: {
        [Op.or]: userCheckedInRestaurants
      }
    }
  });
  return response;
};

/**
 * classMethods
 */
User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64');
};

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex');
};

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
