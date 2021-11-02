const router = require('express').Router();

router.get('/', async (req, res) => {
  res.json('OK');
});

module.exports = router;
