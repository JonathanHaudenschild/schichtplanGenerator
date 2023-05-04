const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Represents a participant
 */
const participantSchema = new Schema({
    /**
     * The unique token of the participant
     * @type {string}
     */
    participantToken: {
        type: String,
        required: true,
        unique: true,
    },
    /**
     * The name of the participant
     * @type {string}
     */
    displayName: {
        type: String,
        required: true,
    },
    /**
     * The group the participant belongs to
     * @type {Schema.ObjectId}
     */
    group: {
        type: Schema.ObjectId,
        ref: 'Group',
    },
    /**
     * The color associated with the participant
     * @type {string}
     */
    color: {
        type: String,
    },
    /**
     * The off days of the participant
     * @type {Array<Date>}
     */
    offDays: [
        {
            type: Date,
        },
    ],
    /**
     * The friends of the participant
     * @type {Array<string>}
     */
    friends: [
        {
            type: String,
        },
    ],
    /**
     * The enemies of the participant
     * @type {Array<string>}
     */
    enemies: [
        {
            type: String,
        },
    ],
    /**
     * The shift preferences of the participant
     * @type {Array<number>}
     * 0 - No preference
     * 1 - Morning
     * 2 - Afternoon
     * 3 - Evening
     * 4 - Night 
     * 
     */
    shiftPreferences: [
        {
            type: Number,
        },
    ],
    /**
     * The experience of the participant
     * @type {number}
     */
    experience: {
        type: Number,
        default: 0,
    },
    /**
     * The arrival time of the participant
     * @type {Date}
     */
    arrivalTime: {
        type: Date,
    },
    /**
     * The departure time of the participant
     * @type {Date}
     */
    departureTime: {
        type: Date,
    },
    /**
     * The absences of the participant
     * @type {Array<Object>}
     */
    absences: [
        {
            type: Object,
            default: {
                startDate: Date,
                endDate: Date,
            },
        },
    ],
    /**
     * The shifts assigned to the participant
     * @type {Array<Schema.ObjectId>}
     */
    shifts: [
        {
            type: Schema.ObjectId,
            ref: 'Shift',
        },
    ],
    /**
     * Shifts Open for Swap
     */
    shiftsOpenForSwap: [
        {
            type: Schema.ObjectId,
            ref: 'Shift',
        },
    ],
    /**
     * The role of the participant
     * @type {Number}
     * 0 - Normal
     * 1 - Seeseite
     * 2 - Supervision
     * 
     */
    role: {
        type: Number,
    },
    /**
     * The logs related to the participant
     * @type {Array}
     */
    logs: [],
    /**
     * The configuration settings for the participant
     * @type {Object}
     */
    config: {
        type: Object,
        default: {
            canEdit: true,
            canSwap: true
        },
    },
});

const Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant;
