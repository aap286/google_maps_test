
from math import pi, cos, pow
def metersToPixel(lat, zoom):
    earthCircumference = 40075017
    latitudeRadians = lat * (pi/180);
    return earthCircumference * cos(latitudeRadians) / pow(2, zoom + 8);

pixelValue = 309.01936161855167 / metersToPixel(48.857750591758055,16)  * 2

print(pixelValue)