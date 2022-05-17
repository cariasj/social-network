const { User, Thought} = require('../models');

const thoughtController = {

  // all thoughts
  getAllThoughts(req,res) {
    Thought.find({})
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .then(dbThoughtsData => res.json(dbThoughtsData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
},

  // thoughts by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(thoughts => {
        if (!thoughts) {
          res.status(404).json({ message: 'Invalid ID' });
          return;
        }
        res.json(thoughts);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  createThought({ body }, res) {
    Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then(thoughts => {
            if (!thoughts) {
                res.status(404).json({ message: 'Invalid (create thought)' });
                return;
            }
            res.json(thoughts);
        })
        .catch(err => res.json(err));
},

  // update Thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "Invalid (update thought)" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // delete thought by ID
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(thoughts => {
        if (!thoughts) {
          res.status(404).json({ message: 'Invalid ID (del thought)' });
          return;
        }
        return User.findOneAndUpdate(
          { _id: parmas.userId },
          { $pull: { thoughts: params.Id } },
          { new: true }
        )
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Invalid' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  createReaction({params, body}, res) {
    Thought.findOneAndUpdate(
      {_id: params.thoughtId}, 
      {$push: {reactions: body}}, 
      {new: true, runValidators: false})
      .then(updatedThought => {
        if (!updatedThought) {
            res.status(404).json({
                message: 'Invalid'
            });
            return;
        }
        res.json(updatedThought);
    })
    .catch(err => res.json(err));
},

  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(thoughts => {
        if (!thoughts) {
          res.status(404).json({ message: 'error'});
          return;
        }
       res.json(thoughts);
      })
      .catch(err => res.json(err));
  }


};

module.exports = thoughtController