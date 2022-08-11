const setCampaignContent = async (req, res) => {

    const client = require("@mailchimp/mailchimp_marketing");
    
    client.setConfig({
      apiKey: `${process.env.APIKEY}-us17`,
      server: "us17",
    });

    try {
        const response = await client.campaigns.setContent("f018f2dcef", { plain_text: '123456' });
        // console.log('campaigns.setContent', response);
        return res.status(200).json(response);
    } catch (err) {
        // console.log('err', err);
        return res.status(500).json(err.response);
    }
};

export default setCampaignContent;
