const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Represents a group
 * @constructor
 */
const groupSchema = new Schema({
    /**
     * The unique name of the group
     * @type {string}
     */
    groupName: {
        type: String,
        required: true,
        unique: true,
    },
    /**
    * Description of the group
    */
    description: {
        type: String,
    },
    /**
     * The participants of the group
     * @type {Array}
     */
    participants: [
        {
            type: Schema.ObjectId,
            ref: 'Participant',
        },
    ],
    /**
     * The shifts in the group
     * @type {Array}
     */
    shifts: [
        {
            type: Schema.ObjectId,
            ref: 'Shift',
        },
    ],
    /**
   * The final shift plan in the group
   * @type {Array}
   */
    schedule: [
        {
            type: Schema.ObjectId,
            ref: 'Shift',
        },
    ],
    /**
     * The start date of the group
     * @type {Date}
     */
    startDate: {
        type: Date,
    },
    /**
     * The end date of the group
     * @type {Date}
     */
    endDate: {
        type: Date,
    },
    /**
     * The configuration settings of the group
     * @type {Object}
     */
    config: {
        type: Object,
        default: {
            isArchived: false,
            allowSwapping: false,
            numberOfShiftsPerDay: 1,
            minTimeBetweenShifts: 12 * 60 * 60 * 1000,
            numberOfOffDays: 1,
            minParticipantsPerShift: 4,
            maxParticipantsPerShift: 8,
            minSupervisorsPerShift: 2,
            maxSupervisorsPerShift: 2,
        },
    },
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
