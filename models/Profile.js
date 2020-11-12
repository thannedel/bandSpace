const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
    },
     
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {                   // band, composer, songwriter etc.
    type: String,
    required: true
  },
  genres: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  soundcloudusername: {
    type: String
    },
  instagramusername: {
    type: String
    },
  discography: [
    {
      title: {
        type: String,
        required: true
      },
      releaseType: {
        type: String,
        required: true
      },
      
      releaseDate: {
        type: Date,
        required: true
      },
      
        description: {
        type: String
      }
    }
    ],
  events: [
    {
      eventHall: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      
      eventDate: {
        type: Date,
        required: true
      },
      
      description: {
        type: String
      }
    }
    ],
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        soundcloud: {
            type: String
        },
        instagram: {
            type: String
        },
        bamdcamp: {
            type: String
        }
    },
        date: {
            type: Date,
            default: Date.now
        }
    
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);