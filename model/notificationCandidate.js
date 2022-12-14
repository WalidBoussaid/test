//import connection with database
const connection = require("./connection");

//import methods to create model
const { Model, DataTypes } = require("sequelize");

class NotifCandidate extends Model {}

NotifCandidate.init(
    {
        msg: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        visited: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize: connection,
        modelName: "notifCandidate",
    }
);

module.exports = NotifCandidate;
