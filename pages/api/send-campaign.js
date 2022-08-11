const sendCampaign = async (req, res) => {

    const { campaign_id } = JSON.parse(JSON.stringify(req.body.body));
    if (!campaign_id) { console.log('no req data', req.body) };

    const client = require("@mailchimp/mailchimp_marketing");
    
    client.setConfig({
      apiKey: `${process.env.APIKEY}-us17`,
      server: "us17",
    });

    try {
        const response = await client.campaigns.send(campaign_id);  // "campaign_id"
        // console.log('campaigns.send', response);
        return res.status(200).json(response);
    } catch (err) {
        // console.log('err', err);
        return res.status(500).json(err.response);
    }
};

export default sendCampaign;