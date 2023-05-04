const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Represents a shift
 */
const shiftSchema = new Schema({
    /**
     * The name of the shift
     * @type {string}
     */
    shiftName: {
        type: String,
        required: true,
    },
    /**
     * The group the shift belongs to
     * @type {Schema.ObjectId}
     */
    group: {
        type: Schema.ObjectId,
        ref: 'Group',
    },
    /**
     * The participants assigned to the shift
     * @type {Array<Schema.ObjectId>}
     */
    participants: [
        {
            type: Schema.ObjectId,
            ref: 'Participant',
        },
    ],
    /**
     * The start date of the shift
     * @type {Date}
     */
    startDate: {
        type: Date,
        required: true,
    },
    /**
     * The end date of the shift
     * @type {Date}
     */
    endDate: {
        type: Date,
        required: true,
    },
    /**
     * The category of the shift
     * @type {number}
     * 0 = normal shift
     * 1 = seeseite shift
     * 2 = supervision shift
     */
    category: {
        type: Number,
        required: true,
    },
    /**
     * The type of the shift
     * @type {number}
     * 0 - No preference
     * 1 - Morning
     * 2 - Afternoon
     * 3 - Evening
     * 4 - Night 
     */
    type: {
        type: Number,
        required: true,
    },
    /**
     * The experience level of the shift
     * @type {number}
     */
    experienceLevel: {
        type: Number,
    },
    /**
     * The configuration settings for the shift
     * @type {Object}
     */
    config: {
        type: Object,
        default: {
            isLocked: false,
            disableSwap: false,
            minParticipants: 4,
            maxParticipants: 8,
            minSupervisors: 2,
            maxSupervisors: 2,
        },
    },
});

const Shift = mongoose.model('Shift', shiftSchema);
module.exports = Shift;
