import jsSHA from "jssha"
import { apiKey, apiSecret } from "../secrets"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"

//configuring toast library
toast.configure()

function rand(digits) {
  return Math.floor(
    Math.random() * parseInt("8" + "9".repeat(digits - 1)) +
      parseInt("1" + "0".repeat(digits - 1))
  )
}

export { default as OptionBar } from "./OptionBar"
export { default as VideosList } from "./VideosList"
export { default as VideoRow } from "./VideoRow"
export { default as Players } from "./Players"
export { default as SearchBar } from "./SearchBar"
export { default as Preview } from "./Preview"
export { default as PlayerRow } from "./PlayerRow"

let apiCallHelper = () => {
  let api_format = "json"
  let api_key = apiKey
  let api_nonce = rand(8)
  let api_timestamp = Math.floor(new Date().getTime() / 1000)

  let call_string =
    "api_format=" +
    api_format +
    "&api_key=" +
    api_key +
    "&api_nonce=" +
    api_nonce +
    "&api_timestamp=" +
    api_timestamp

  return call_string
}

//API call to fetch template key for video preview
export let fetchTemplateKey = callback => {
  let api_secret = apiSecret
  let requestString = apiCallHelper()
  let shaObj = new jsSHA("SHA-1", "TEXT")
  shaObj.update(requestString + api_secret)
  let api_signature = shaObj.getHash("HEX")

  //need cors proxy to make request
  let cors_anywhere = "https://cors-anywhere.herokuapp.com/"

  requestString =
    "https://api.jwplatform.com/v1/accounts/templates/list?" +
    requestString +
    "&api_signature=" +
    api_signature

  fetch(cors_anywhere + requestString, {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      let templates = data["templates"]
      //for loop to send back the 180p template key back up to VideosList for preview player URL
      for (let i = 0; i < templates.length; i++) {
        if (templates[i].name === "180p") {
          callback(templates[i]["key"])
          break
        }
      }
    })
    .catch(error => console.error("Error:", error))
}

export let fetchVideos = (
  limit = 10,
  offset = 0,
  callback,
  searchString = ""
) => {
  let api_secret = apiSecret
  let requestString =
    apiCallHelper() + "&result_limit=" + limit + "&result_offset=" + offset

  if (searchString) {
    requestString += "&search=" + searchString
  }

  let shaObj = new jsSHA("SHA-1", "TEXT")
  shaObj.update(requestString + api_secret)
  let api_signature = shaObj.getHash("HEX")

  //need cors proxy to make request
  let cors_anywhere = "https://cors-anywhere.herokuapp.com/"

  requestString =
    "https://api.jwplatform.com/v1/videos/list?" +
    requestString +
    "&api_signature=" +
    api_signature

  fetch(cors_anywhere + requestString, {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      callback(data.videos)
    })
    .catch(error => console.error("Error:", error))
}

export let fetchPlayers = callback => {
  let api_secret = apiSecret
  let requestString = apiCallHelper()
  let shaObj = new jsSHA("SHA-1", "TEXT")

  shaObj.update(requestString + api_secret)

  let api_signature = shaObj.getHash("HEX")

  //need cors proxy to make request
  let cors_anywhere = "https://cors-anywhere.herokuapp.com/"

  requestString =
    "https://api.jwplatform.com/v1/players/list?" +
    requestString +
    "&api_signature=" +
    api_signature

  fetch(cors_anywhere + requestString, {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log("Management API response: ", data)
      callback(data.players)
    })
    .catch(error => console.error("Error:", error))
}

//helper function to display Toast
export let displayToast = e => {
  toast(`${e} was copied!`)
}
