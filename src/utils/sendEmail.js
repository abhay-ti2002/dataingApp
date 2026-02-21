const sendEmail = async (to, otp) => {
  try {
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "json",
        },
        body: JSON.stringify({
          sender: {
            name: "HeartMatch",
            email: "support@heartmatch.app",
          },
          to: [{ email: to }],
          subject: "Email Verification OTP",
          htmlContent: `
            <h2>Email Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP is valid for 60 seconds.</p>
          `,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }
  } catch (error) {
    console.error("Email send failed:", error.message);
    throw error;
  }
};

module.exports = { sendEmail };

