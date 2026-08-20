import axios from "axios";

const apiPsgcClient = axios.create();

export default apiPsgcClient;

/**
 * /regions --> GET all the regions
 * /regions/{code}/provinces --> GET all the province in the selected region
 * /provinces/{code}/cities-municipalities --> GET all the cities/barangay in the selected province
 * /cities-municipalities/{code}/barangays --> GET all the barangay in the selected city
 */