const router = require('express').Router();

const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
} = require('../../controllers/thought-controller');

// /api/thoughts <GET>
router
  .route('/')
  .get(getAllThought)
  .post(createThought);

// /api/thoughts/:id GET, PUT, DELETE
router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/:userId POST
router
  .route('/:thoughtId/reactions')
  .post(createReaction);

// /api/thoughts/:thoughtId/reactionId DELETE
router
  .route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction);

module.exports = router;