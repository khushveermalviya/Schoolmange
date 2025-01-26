import axios from 'axios';

const fetch = async (prompt) => {
  try {
    const response = await axios({
      url: "https://api.deepseek.com/v1/chat/completions",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer sk-5ccf63351e1a4455b8814bd77923811d`
      },
      data: {
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      }
    });

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    return "Sorry, I encountered an error. Please try again.";
  }
};

export { fetch };