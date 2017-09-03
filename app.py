from flask import Flask, Response, render_template, request
from flask.ext.pymongo import PyMongo
from flask import jsonify
from flask import session, flash, redirect, url_for, make_response
from flask import send_file, make_response, abort
from bson.json_util import dumps
import config_ext


app = Flask(__name__)

# --- MongoDB configs. --- #
app.config['MONGO_DBNAME'] = config_ext.mongo_dbname
app.config['MONGO_URI'] = config_ext.mongo_uri

mongo = PyMongo(app)

@app.route('/', methods = ['POST', 'GET'])
def index():
	return send_file('templates/index.html')

@app.route('/technologies', methods = ['POST'])
def tech():
	json = mongo.db.fruits.aggregate( [ { "$group" : { "_id" : "$payload.pull_request.base.repo.language", "count" : {"$sum":1} } } ] )
	return jsonify({"status" : 200, "data" : json})

@app.route('/repos', methods = ['POST'])
def reposByTech():
	data = request.get_json()
	lang = data["data"]["_id"]
	json1 = dumps(mongo.db.fruits.find({ "payload.pull_request.base.repo.language": { "$eq" : lang } }, {"payload.pull_request.base.repo" : 1} ))
	return jsonify({"status" : 200, "data" : json1 })

@app.route('/reposByUser', methods = ['POST'])
def reposByUser():
	data = request.get_json()
	user = data["data"]
	json1 = dumps(mongo.db.fruits.find( { "payload.pull_request.base.repo.owner.login": { "$eq" : user } }, {"payload.pull_request.base.repo" : 1} ))
	return jsonify({"status" : 200, "data" : json1 })

if __name__ == '__main__':
    app.run(debug=True)
