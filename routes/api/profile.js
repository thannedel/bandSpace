const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
//@route GET api/profile/me
//@desc Get current users profile
//@access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route Post api/profile
//@desc Create or update user profile
//@access Private
router.post('/',
    [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('genres', 'Genre is required').not().isEmpty()
    ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
      location,
      website,
      bio,
      genres,
      status,
      soundcloudusername,
      instagramusername,
      youtube,
      twitter,
      instagram,
      soundcloud,
      bandcamp,
      facebook
        } = req.body;
        
        //Build profile object

        const profileFields = {};
        profileFields.user = req.user.id;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (soundcloudusername) profileFields.soundcloudusername = soundcloudusername;
        if (instagramusername) instagramlds.instagramusername = instagramusername;
        if (genres) {
            profileFields.genres = genres.split(',').map(genre => genre.trim());
        }

        //Build social object
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (soundcloud) profileFields.social.soundcloud = soundcloud;
        if (bandcamp) profileFields.social.bandcamp = bandcamp;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                //Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true });
                
                return res.json(profile);
            }

            //Create
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
       }
})

//@route Get api/profile
//@desc Get all profiles
//@access Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error ')
    }
})

//@route Get api/profile/user/:user_id
//@desc Get profile by user ID
//@access Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) return res.status(400).json({msg:'Profile not found'})
        res.json(profile);
    } catch (err) {
        console.error(err.message);

         //checking if the object Id is a valid object id to avoid server error  for invalid ids
        if (err.kind == 'ObjectId') {  
           return res.status(400).json({msg:'Profile not found'}) 
        }
      
        res.status(500).send('Server Error ')
    }
})

//@route DELETE api/profile
//@desc Delete profile,user,posts
//@access Private

router.delete('/', auth, async (req, res) => {
    try {
        
        //@todo-remove users posts

        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //Remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error ')
    }
})


//@route DELETE api/profile
//@desc DELETE profile,user & posts
//@access Private

router.delete('/', auth, async (req, res) => {
    try {
        //Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
       //Remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error ')
    }
})

//@route PUT api/profile/events
//@desc Add profile event
//@access Private

router.put('/events', [auth, [
    check('eventHall', 'The hall is required').not().isEmpty(),
    check('location', 'location is required').not().isEmpty(),
    check('eventDate', 'date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        eventHall,
        location,
        eventDate,
        description
    } = req.body;

        const newEvent = {
        eventHall,
        location,
        eventDate,
        description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.events.unshift(newEvent);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
});
    
//@route DELETE api/profile/events/:event_id
//@desc  DELETE event from profile
//@access Private
router.delete('/events/:event_id', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //Get remove index
        const removeIndex = profile.events.map(item => item.id).indexOf(req.params.event_id);

        profile.events.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
            res.status(500).send('Server Error');
    }
})

//@route PUT api/profile/discography
//@desc Add profile disk
//@access Private

router.put('/discography', [auth, [
    check('title', 'The title is required').not().isEmpty(),
    check('releaseType', 'type is required').not().isEmpty(),
    check('releaseDate', 'date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        releaseType,
        releaseDate,
        description
    } = req.body;

        const newDisk = {
        title,
        releaseType,
        releaseDate,
        description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.discography.unshift(newDisk);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
});
    
//@route DELETE api/profile/discography/:disk_id
//@desc  DELETE disk from profile
//@access Private
router.delete('/discography/:disk_id', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //Get remove index
        const removeIndex = profile.discography.map(item => item.id).indexOf(req.params.disk_id);

        profile.discography.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
            res.status(500).send('Server Error');
    }
})


module.exports = router;