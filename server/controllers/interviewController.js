// // interviewController.js

const { model_url } = require('./modelUrl');

const interview = async (req, res) => {
  try {
    const { resume, history } = req.body;

    console.log("📨 Sending to Flask:", { resume, history });

    const response = await fetch(`${model_url}/api/interview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resume, history })
    });

    // Handle non-JSON or HTML error responses
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Flask returned error HTML or status:", errorText);
      return res.status(500).json({ error: 'Flask error', details: errorText });
    }

    if (!contentType || !contentType.includes('application/json')) {
      const fallback = await response.text();
      console.error("❌ Expected JSON but got:", fallback.slice(0, 200));
      return res.status(500).json({ error: 'Invalid JSON from Flask', fallback });
    }

    const result = await response.json();

    console.log("✅ Flask response JSON:", result);
    return res.status(200).json(result);

  } catch (error) {
    console.error("🚨 Node.js server error:", error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports = { interview };


// __________________________________________________________________________
// const { colab_url } = require('./colabUrl');

// const interview = async (req, res) => {
//   try {
//     const { resume, history } = req.body;

//     const response = await fetch(`${colab_url}/api/interview`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ resume, history }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("Colab error:", data);
//       return res.status(500).json(data); // ← ✅ Pass through Colab's error details
//     }

//     res.json(data);
//   } catch (err) {
//     console.error("Server Error:", err.message);
//     res.status(500).json({ error: "Node.js Server Error", exception: err.message });
//   }
// };


// module.exports = { interview };