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
    name: {
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
     * @type {Array<Schema.ObjectId>}
     */
    friends: [
        {
            type: Schema.ObjectId,
            ref: 'Participant',
        },
    ],
    /**
     * The enemies of the participant
     * @type {Array<Schema.ObjectId>}
     */
    enemies: [
        {
            type: Schema.ObjectId,
            ref: 'Participant',
        },
    ],
    /**
     * The shift preferences of the participant
     * @type {Object}
     */
    shiftPreferences: {
        type: Object,
        default: {
            isNightShift: false,
            isDayShift: false,
            isEarlyShift: false,
            isLateShift: false,
        },
    },
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
     * The role of the participant
     * @type {string}
     */
    role: {
        type: Object,
        default: {
            isParticipant: true,
            isSupervisor: false,
        },
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
            canEdit: true
        },
    },
});

const Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant;
