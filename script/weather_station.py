import board
import adafruit_dht
from datetime import datetime
import time
import requests
from tinydb import TinyDB
import schedule


def read_data_from_internet():
    api_key = "abdccb4a4aeb3b8fd648c4f18a39721a"
    base_url = "http://api.openweathermap.org/data/2.5/weather?"
    city_name = "Bern"
    language = "de"
    units = "metric"
    complete_url = base_url + "appid=" + api_key + "&q=" + city_name + "&lang=" + language + "&units=" + units;

    response = requests.get(complete_url)
    x = response.json()

    if x["cod"] != "404":
        current_temperature = x['main']["temp"]
        current_apparent_temperaure = x['main']['feels_like']
        current_pressure = x['main']["pressure"]
        current_humidiy = x['main']["humidity"]
        weather_description = x["weather"][0]["description"]
        time = datetime.fromtimestamp(x['dt'])

    else:
        print(" ERROR 404 ")

    return {"temp": current_temperature,
            "temp_app": current_apparent_temperaure,
            "pres": current_pressure,
            "rel_h": current_humidiy,
            "desc": weather_description,
            "time": (time.year, time.month, time.day, time.hour, time.minute)
            }

def read_data_from_sensor():

    meas_count = 7
    dhtDevice = adafruit_dht.DHT22(board.D17)
    current_temperature = [null for i in range(meas_count)]
    current_humidiy = [null for i in range(meas_count)]

    for i in range(meas_count):
        try:
            temp = dht.temperature
            humd = dht.humidity
        except RuntimeError as error:
            # Errors happen fairly often, DHT's are hard to read, just keep going
            print(error.args[0])
            time.sleep(2)
            continue
        except Exception as error:
            dhtDevice.exit()
            raise error

        current_temperature[i] = temp
        current_humidity[i] = humd

    current_temperature.sort()
    current_humidiy.sort()
    return {"temp": current_temperature[meas_count//2],
            "rel_h": current_humidiy[meas_count//2]
            }

def ask_for_weather():
    owd_data = read_data_from_internet()
    dht_data = read_data_from_sensor()
    print("{:.0f}: Asked for the weather: \tT={:.1f}\trel_h={:.0f}\tP_air={:.0f}".format(
        time.time(),
        dht_data['temp'],
        dht_data['rel_h'],
        owd_data['pres'])
    )
    with TinyDB("static/db.json") as db:
        owd_table = db.table('owd_table')
        owd_table.insert({"time": time.time(),
                          "temp": dht_data["temp"],
                          "rel_h": dht_data["rel_h"],
                          "pres": owd_data["pres"]})


if __name__ == '__main__': # on running python app.py
    dhtDevice = adafruit_dht.DHT22(board.D17)
    schedule.every(15).minute.do(ask_for_weather)
    while True:
        schedule.run_pending()
        time.sleep(1)
