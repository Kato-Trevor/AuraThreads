import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const getSongById = async (id: number): Promise<any> => {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: `https://deezerdevs-deezer.p.rapidapi.com/track/${id}`,
    headers: {
      "x-rapidapi-key": "b39ca678b1mshbf18ad787cffd3ap128e91jsnf75e323a4eaf",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  try {
    const response: AxiosResponse = await axios.request(options);
    return response.data; // Return the song data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Re-throw the error for the caller to handle
  }
};

export default getSongById;
