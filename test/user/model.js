/**
 * Module dependencies.
 */
var should = require('should'),
    app = require('../../server'),
    config = require('../../config/config'),
    database = require('../../app/setupDatabase');

//Globals
var user, User;
var db;

//The tests
describe('<Unit Test>', function() {
    
    before(function (done) {
        database.setup(config.db, function (err, dbPassed) {
            db = dbPassed;
            User = db.models.user;
            done();
        });
    });

    describe('Model User:', function() {
        before(function(done) {
            User.find({}).remove(function (err) {
                user = new User({
                    name: 'Full name',
                    email: 'test@test.com',
                    username: 'user',
                    password: 'password'
                });
                user2 = new User({
                    name: 'Full name',
                    email: 'test@test.com',
                    username: 'user',
                    password: 'password'
                });

                done();
            });
        });

        describe('Method Save', function() {
            it('should begin with no users', function(done) {
                User.find({}, function(err, users) {
                    users.should.have.length(0);
                    done();
                });
            });

            it('should be able to save whithout problems', function(done) {
                user.save(function(err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should fail to save an existing user again', function(done) {
                user.save(function(err) {
                    should.not.exist(err);
                });
                return user2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should be able to show an error when try to save without name', function(done) {
                user.name = '';
                return user.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        describe('Model get:', function() {
            it('should error when given a non-integer', function(done) {
                User.get(3.14, function(err, user) {
                    should.exist(err);
                    should.not.exist(user);
                });

                return User.get('WellTheresYourProblem', function(err, user) {
                    should.exist(err);
                    should.not.exist(user);
                    done();
                });
            });

            it('should return user with id being order created', function(done) {
                
                //id 5 even though it should be 0; opened issue with node-orm2
                return User.get(5, function(err, user) {
                    should.not.exist(err);
                    should.exist(user);
                    user.should.equal(user);
                    done();
                });
            });
        });

        after(function(done) {
            User.find({}).remove(function (err) {
                if (err) throw err;
                done();
            });
        });
    });
});