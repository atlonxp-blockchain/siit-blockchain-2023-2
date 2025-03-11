import re
import requests
from shapely.geometry import Polygon, LinearRing
from shapely.ops import orient
from area import area
import matplotlib.pyplot as plt
import matplotlib.transforms as transforms
import matplotlib
from matplotlib.backends.backend_agg import FigureCanvasAgg
import numpy as np
import time

matplotlib.use('Agg')

def timestamp_to_date_string(timestamp):
    # Convert timestamp to struct_time
    time_struct = time.localtime(timestamp)

    # Format struct_time as a string
    date_string = time.strftime("%A, %B %d, %Y %I:%M:%S %p", time_struct)

    return date_string

def is_valid_thai_id(id_number:int) -> bool:
    id_number = str(id_number)
    if(len(id_number) != 13):
        return False
    
    # Check if the ID number has exactly 13 digits
    if not re.match(r'^\d{13}$', id_number):
        return False

    # Extract individual digits
    digits = list(map(int, id_number))

    # Calculate the checksum
    checksum = 0
    for i in range(12):
        checksum += digits[i] * (13 - i)

    remainder = checksum % 11
    check_digit = (11 - remainder) % 10

    # Compare the calculated check digit with the last digit of the ID number
    return check_digit == digits[12]

def is_valid_holder_name(holder_name:list[str]) -> bool:
    if(len(holder_name) != 4):
        print("Component of name is invalid")
        return False
    
    title,firstname,middlename,lastname = holder_name
    
    title = title.lower()
    firstname = firstname.lower()
    middlename = middlename.lower()
    lastname = lastname.lower()

    if("." not in title):
        title += "."

    if(title not in ["mr.","ms.","mrs."]):
        print("Title is invalid")
        return False
    
    pattern = r'^[a-z ]+$'

    if(bool(re.match(pattern, firstname)) == False):
        print("Firstname is invalid")
        return False
    
    if(middlename != "-"):
        if(bool(re.match(pattern, middlename)) == False):
            print("Middlename is invalid")
            return False
    
    if(bool(re.match(pattern, lastname)) == False):
        print("Lastname is invalid")
        return False
    
    return True
    
def is_coordinate_valid(coordinate:tuple[float,float],OSM_service:bool=True) -> bool:
    if(not(-90 <= coordinate[0] <= 90)):
        print("lat should be between -90 and 90")
        return False
    
    if(not(-180 <= coordinate[1] <= 180)):
        print("long should be between -180 and 180")
        return False
    
    def is_in_thailand(lat, lon):
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}"
        response = requests.get(url)
        data = response.json()
        if "address" in data and "country" in data["address"]:
            return data["address"]["country"] == "Thailand" or data["address"]["country"] == "ประเทศไทย"
        return False
    
    if(OSM_service == True):
        if(not is_in_thailand(coordinate[0],coordinate[1])):
            print("The coordinate is not in Thailand")
            return False

    return True

def reorder_coordinate(lat_lon_list):
    # Create a Shapely LinearRing from the list of (latitude, longitude) tuples
    ring = LinearRing(lat_lon_list)

    # Check if the ring is oriented counter-clockwise, and reverse the order if needed
    if ring.is_ccw:
        lat_lon_list = list(lat_lon_list)[::-1]

    return lat_lon_list

def calculate_area(lat_lon_list):
    lat_lon_list = reorder_coordinate(lat_lon_list)
    if(lat_lon_list[0] != lat_lon_list[-1]):
        lat_lon_list.append(lat_lon_list[0])

    obj = {'type':'Polygon','coordinates':[lat_lon_list]}
    return area(obj)

def land_image(lat_lon_list, margin=0.001):
    # Convert latitude and longitude to Cartesian coordinates
    lat_lon_list = reorder_coordinate(lat_lon_list)
    
    if lat_lon_list[0] != lat_lon_list[-1]:
        lat_lon_list.append(lat_lon_list[0])

    lats, lons = zip(*lat_lon_list)

    # Create the polygon
    fig, ax = plt.subplots()
    ax.plot(lons, lats, marker='o', markersize=6, linestyle='-', color='black')

    # Set aspect ratio to equal
    ax.set_aspect('equal')
    ax.set_xticks([])
    ax.set_yticks([])

    # Rotate the plot to make the polygon face north
    plt.gca().set_aspect('equal', adjustable='box')
    ax.set_aspect('equal')

    # Adjust limits with margin
    min_x = min(lons) - margin
    max_x = max(lons) + margin
    min_y = min(lats) - margin
    max_y = max(lats) + margin
    ax.set_xlim(min_x, max_x)
    ax.set_ylim(min_y, max_y)

    # Associate the figure with FigureCanvasAgg
    canvas = FigureCanvasAgg(fig)

    # Draw the canvas
    canvas.draw()

    # Get the renderer
    renderer = canvas.get_renderer()

    # Convert the renderer to an image buffer
    image_buffer = np.frombuffer(renderer.tostring_rgb(), dtype='uint8')
    image_buffer = image_buffer.reshape(tuple(map(int, renderer.get_canvas_width_height()[::-1])) + (3,))


    # Close the Matplotlib figure to release resources
    plt.close(fig)

    return image_buffer


def is_valid_address(address):
    if(len(address) != 9):
        return {"status":0,"output":"Component of address is invalid"}
    
    number,moo,road,soi,sub_district,district,province,country,code = address
    
    pattern = r'^[1-9]\d*/[1-9]\d*$'
    if(not re.match(pattern,number) and number != "-"):
        print(f"House number {number} is invalid")
        return False
    
    if(not moo.isdigit() and moo != "-"):
        print(f"Moo {moo} is invalid")
        return False
    
    if(len(code) != 5 or not code.isdigit()):
        print(f"Postal code {code} is invalid")
        return False
    
    return True