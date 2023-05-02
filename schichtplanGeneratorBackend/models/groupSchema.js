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
    name: {
        type: String,
        required: true,
        unique: true,
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
            isEditable: true,
            isPublic: false,
            isPublished: false,
            isGenerated: false,
            isArchived: false,
            numberOfShiftsPerDay: 1,
            minNumberOfShiftsBetween: 2,
            numberOfOffDays: 1,
        },
    },
    /**
     * The users who can edit the group
     * @type {Array}
     */ 
    editors: [
        {
            type: Schema.ObjectId,
            ref: 'User',
        },
    ],
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
