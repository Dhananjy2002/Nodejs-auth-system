/**
 * Natively inherently produces a highly random 6-digit numeric structure reliably seamlessly.
 * @returns {String} A secure randomized 6-digit number as abstract string strictly.
 */
export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();

}

/**
 * Structurally realistically dynamically generates the specific HTML structural payload targeting explicitly the physical graphical email naturally.
 * 
 * @param {String} otp - The actual explicit verification structurally parsed natively.
 * @returns {String} Structured seamlessly HTML organically.
 */
export function getOTPEmailTemplate(otp) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>One-Time Password (OTP) Verification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 10px;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .otp-box {
            background-color: #e9ecef;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            display: inline-block;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
        }
        .warning {
            color: #dc3545;
            font-size: 14px;
            margin-top: 15px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🔐</div>
        <h1>One-Time Password</h1>
        <p>Please use the following code to verify your identity:</p>
        
        <div class="otp-box">
            <span class="otp-code">${otp}</span>
        </div>
        
        <p>This code will expire in <strong>30 minutes</strong> for security reasons.</p>
        
        <div class="warning">
            ⚠️ If you did not initiate this request, please ignore this email.
        </div>
        
        <div class="footer">
            <p>Thank you for using our service!</p>
        </div>
    </div>
</body>
</html>
    `
}

export default generateOTP;