const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        enum: [
          'Governance',
          'Financial Management',
          'Operations',
          'Communications',
          'Human Resources',
          'Risk Management'
        ]
      },
      text: {
        type: String,
        required: true
      },
      choices: {
        type: [String],
        required: true,
        validate: {
          validator: arr => Array.isArray(arr) && arr.length === 4,
          message: 'You must provide exactly 4 answer options'
        }
      },
      answerIndex: {
        type: Number,
        required: true,
        min: 0,
        max: 3
      },
      explanation: {
        type: String
      }
    }, {
      timestamps: true
})

module.exports = mongoose.model('Question', questionSchema);
