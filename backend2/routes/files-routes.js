const express = require('express');
const { check } = require('express-validator');

const filesControllers = require('../controllers/files-controller');

const router = express.Router();

router.get('/:id', filesControllers.getFileById);

router.get('/users/:id', filesControllers.getFilesByUserId);

router.post(
  '/',
  [
    // check('title')
    //   .not()
    //   .isEmpty(),
    // check('description').isLength({ min: 5 }),
    // check('address')
    //   .not()
    //   .isEmpty()
    check('userId')
    .not()
    .isEmpty(),
    check('Dataset')
    .not()
    .isEmpty()
  ],
  filesControllers.createFile
);

// router.patch(
//   '/:pid',
//   [
//     // check('title')
//     //   .not()
//     //   .isEmpty(),
//     // check('description').isLength({ min: 5 })
//     check('Dataset')
//     .not()
//     .isEmpty()
//   ],
//   filessControllers.updateFile
// );

router.delete('/:id', filesControllers.deleteFile);

module.exports = router;
