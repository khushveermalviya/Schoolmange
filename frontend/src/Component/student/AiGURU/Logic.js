import axios from 'axios';

const fetch = async (prompt) => {
  try {
    const response = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB6IYc_2zeT8TIFeWRTFGgAnFBtvAie7Jk",
      method: "post",
      data: {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    const textResponse = response.data.candidates[0].content.parts[0].text;
    return textResponse;
  } catch (err) {
    console.error("Something went wrong", err);
    return "Error generating response";
  }
};

export { fetch };