import terrain from "../assets/terrain.jpeg";
import dark from "../assets/dark.jpg";
import street from "../assets/street.png"; 

export const MAPBOX_API_KEY_STREET = "pk.eyJ1IjoiZHdpcHV0cmFzYW0iLCJhIjoiY2xlMDRxZDU2MTU3dTNxb2Fkc3Q0NWFpciJ9.M-nfqnbgrf7QQdXHAXn07Q";
export const MAPBOX_API_KEY_TERRAIN = "pk.eyJ1IjoiZHdpcHV0cmFzYW0iLCJhIjoiY2xlMDNhd2dpMDRhdTN4cnp5eWwzZjdqMyJ9.fNAd-CNd6xYIS6NdzSSJRQ";
export const MAPBOX_API_KEY_DARK = 'pk.eyJ1IjoiZHdpcHV0cmFzYW0iLCJhIjoiY2xlMDNhd2dpMDRhdTN4cnp5eWwzZjdqMyJ9.fNAd-CNd6xYIS6NdzSSJRQ'
export const MAPBOX_MASTER_API = "pk.eyJ1IjoiZHdpcHV0cmFzYW0iLCJhIjoiY2xlMDRxZDU2MTU3dTNxb2Fkc3Q0NWFpciJ9.M-nfqnbgrf7QQdXHAXn07Q"
export const MAPBOX_DIRECTION_API = "https://api.mapbox.com/directions/v5/"

export const MAPBOX_ROUTING_PROFILES = [
  {
    name: "Driving",
    value: "mapbox/driving"
  },
  {
    name: "Walking",
    value: "mapbox/walking"
  },
  {
    name: "Traffic",
    value: "mapbox/driving-traffic"
  }
] 

export const MAPBOX_STYLE = [
  {
    name: "Streets",
    url: "mapbox://styles/mapbox/streets-v11",
    apiKey: MAPBOX_API_KEY_STREET,
    image: street
  },
  {
    name: "Terrain",
    url: "mapbox://styles/dwiputrasam/cle2rqbe8001b01p5615gipnm",
    apiKey: MAPBOX_API_KEY_STREET,
    image: terrain
  },
  {
    name: "Dark",
    url: "mapbox://styles/dwiputrasam/cle2rw7gu000201sjlb96tjyc",
    apiKey: MAPBOX_API_KEY_DARK,
    image: dark
  }

]