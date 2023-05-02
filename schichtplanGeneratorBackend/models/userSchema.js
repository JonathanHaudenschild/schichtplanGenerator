const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Represents a user 
 */
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }],
    config: {
        type: Object,
        default: {
            activated: true,
            role: "admin",
            group: "default",
            theme: "dark",
            language: "en"
        }
    },
    tokens: {
        activationToken: String,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
});


const User = mongoose.model('User', userSchema);
module.exports = User;