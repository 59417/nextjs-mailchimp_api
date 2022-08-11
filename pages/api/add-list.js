const postData = {
    name: "First List",
    permission_reminder: "You are receiving this email because you opted in via our website.",
    email_type_option: false,
    contact: {
        company: "My Company",
        address1: "Section 3, Taiwan Blvd",
        city: "Taichung",
        country: "TW",
    },
    campaign_defaults: {
        from_name: "CYC",
        from_email: process.env.HOSTEMAIL,
        subject: "Test subject",
        language: "en",
    }
}; 
    
    
const addList = async (req, res) => {

    const client = require("@mailchimp/mailchimp_marketing");
    
    client.setConfig({
        apiKey: `${process.env.APIKEY}-us17`,
        server: "us17",
    });

    try {
        const response = await client.lists.createList(postData);
        
        // console.log('createList', response);
        return res.status(200).json(response);
    } catch (err) {
        // console.log('err', err);
        return res.status(500).json(err.response);
    }
};

export default addList;