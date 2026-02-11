"""Constants for the Sunlight Visualizer integration."""

DOMAIN = "sunlight_visualizer"

# Configuration keys
CONF_LATITUDE = "latitude"
CONF_LONGITUDE = "longitude"
CONF_HOUSE_ANGLE = "house_angle"
CONF_CEILING_TILT = "ceiling_tilt"
CONF_UPDATE_INTERVAL = "update_interval"
CONF_ADVANCED_MODE = "advanced_mode" 
CONF_DIRECTION = "direction"
CONF_USE_CUSTOM_ANGLE = "use_custom_angle"
CONF_ROOF_DIRECTION = "roof_direction"
CONF_ROOF_POWER_ENTITY = "roof_power_entity"
CONF_ROOF_POWER_ENABLED = "roof_power_enabled"
CONF_ROOF_POWER_INVERT = "roof_power_invert"
CONF_CAMERA_ROT_H = "camera_rotation_h"
CONF_CAMERA_ROT_V = "camera_rotation_v"
CONF_AUTO_ROTATE_SPEED = "auto_rotate_speed"
CONF_FORCE_SUN_FALLBACK = "force_sun_fallback"
CONF_FORCE_SUN_AZIMUTH = "force_sun_azimuth"
CONF_FORCE_SUN_ELEVATION = "force_sun_elevation"

# Marker used by the SVG house card to auto-bind sensors from this integration
CARD_SOURCE_ATTR = "sunlight_visualizer_source"
CARD_SOURCE_VALUE = "sunlight_visualizer"


# Fallback sun position if HA data is unavailable
FALLBACK_SUN_ELEVATION = 35
FALLBACK_SUN_AZIMUTH = 120

# Default values
DEFAULT_UPDATE_INTERVAL = 10  # minutes
MIN_UPDATE_INTERVAL = 1
MAX_UPDATE_INTERVAL = 60
DEFAULT_HOUSE_ANGLE = 180
DEFAULT_CEILING_TILT = 10
DEFAULT_ROOF_DIRECTION = "front"
DEFAULT_ROOF_POWER_ENTITY = None
DEFAULT_ROOF_POWER_ENABLED = False
DEFAULT_ROOF_POWER_INVERT = False
DEFAULT_CAMERA_ROT_H = 225
DEFAULT_CAMERA_ROT_V = 35
DEFAULT_AUTO_ROTATE_SPEED = 10
DEFAULT_FORCE_SUN_FALLBACK = False
DEFAULT_FORCE_SUN_AZIMUTH = FALLBACK_SUN_AZIMUTH
DEFAULT_FORCE_SUN_ELEVATION = FALLBACK_SUN_ELEVATION

# Wall types
WALLS = ["front", "left", "back", "right", "ceiling"]

# Compass direction options with their degree values
DIRECTIONS = {
    "N": 0,
    "NE": 45,
    "E": 90,
    "SE": 135,
    "S": 180,
    "SW": 225,
    "W": 270,
    "NW": 315
}

# Roof direction presets relative to house front (lowest edge / downhill side)
ROOF_DIRECTIONS = {
    "front": 0,
    "left": 270,
    "back": 180,
    "right": 90
}
