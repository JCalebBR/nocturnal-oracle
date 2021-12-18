const { Sequelize, Model, DataTypes } = require("sequelize");

// @ts-ignore
module.exports = class Releases extends Model {
    /**
     * @param {any} sequelize
     */
    static init(sequelize) {
        // @ts-ignore
        return super.init({
            type: {
                type: DataTypes.STRING,
                allowNull: false
            }, title: {
                type: DataTypes.STRING,
                allowNull: false
            }, tracklist: {
                type: DataTypes.TEXT,
                allowNull: true
            }, band: {
                type: DataTypes.STRING,
                allowNull: false
            }, date: {
                type: DataTypes.STRING,
                allowNull: false
            }, week: {
                type: DataTypes.INTEGER,
                allowNull: false
            }, month: {
                type: DataTypes.INTEGER,
                allowNull: false
            }, year: {
                type: DataTypes.INTEGER,
                allowNull: false
            }, artwork: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            modelName: "release",
        });
    }
};