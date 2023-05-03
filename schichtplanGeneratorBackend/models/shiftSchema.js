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
    name: {
        type: String,
        required: true,
    },
    /**
     * The order of the shift
     * @type {number}
     */
    order: {
        type: Number,
        required: true,
    },
    /**
     * The day of the shift
     * @type {number}
     */
    day: {
        type: Date,
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
     * The configuration settings for the shift
     * @type {Object}
     */
    config: {
        type: Object,
        default: {
            isLocked: false,
            disableSwap: false,
            isNightShift: false,
            isEarlyShift: false,
            isLateShift: false,
            minParticipants: 4,
            maxParticipants: 8,
            minSupervisors: 2,
            maxSupervisors: 2,
        },
    },
});

const Shift = mongoose.model('Shift', shiftSchema);
module.exports = Shift;
