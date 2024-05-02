// import 'https://smtpjs.com/v3/smtp.js'

function sendEmail(error) {
    const body= JSON.stringify(error)
    window.location.href = `mailto:tal.amit0311@gmail.com?subject=[reporting app bug ${new Date().toDateString()}]&body=${body}`;
}

export const reportService = {
    sendEmail
}