from flask import Flask, jsonify
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
from sqlalchemy import create_engine
import math

"""
database = {'user':'root',
            'password':'Ihaveh1bfor2020',
            'port':'3306',
            'host':'localhost',
            'database':'project2'}

"""

database_path = "globalhappiness"
engine = create_engine(f"sqlite:///{database_path}")

csv_file = "db/happiness-cantril-ladder.csv"
globalhappiness_data_df = pd.read_csv(csv_file)
globalhappiness_data_df.to_sql(name='happiness', con=engine, if_exists='replace', index=False)

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/globalhappiness.sqlite"

db = SQLAlchemy(app)


@app.route('/getdata.geojson')
def getdata1():
    return_list = []
    df = pd.read_sql_query('SELECT * FROM happiness Where Year = 2017', con=engine)
    for index, row in df.iterrows():
        temp = {
            "type": "Feature",
            "properties": {
                "Entity": row["Entity"],
                "Code": row["Code"],
                "Year": row["Year"],
                "WHR": row["World Happiness Report 2016 (Cantril Ladder (0=worst; 10=best))"]
            },
            "geometry":{
                "type" : "Point",
                "coordinates": [row["longitude"],row["latitude"]]
            }
        }
        if math.isnan(row["latitude"]) or math.isnan(row["longitude"]):
            pass
        else:
            return_list.append(temp)
    geojson = { "type":"FeatureCollection", "features": return_list}
    return jsonify(geojson)

# @app.route('/getdata2')
# def getdata2():
#     return 'test2'

# @app.route('/getdata3')
# def getdata3():
#     return 'getdata3'

@app.route('/')
def homepage():
    return render_template('index.html')


@app.after_request
def apply_caching(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    print('HERE!')
    return response

if __name__ == "__main__":
    app.run(debug=True)