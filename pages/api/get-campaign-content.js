const getCampaignContent = async (req, res) => {
 
    const { campaign_id } = JSON.parse(JSON.stringify(req.body.body));
  
    const client = require("@mailchimp/mailchimp_marketing");
    
    client.setConfig({
        apiKey: `${process.env.APIKEY}-us17`,
        server: "us17",
    });
  
    try {
        const response = await client.campaigns.getContent(campaign_id);
        // console.log('campaigns.getContent', response.html);
        return res.status(200).json(response);
    } catch (err) {
        // console.log('err', err);
        return res.status(500).json(err.response);
    }
  };
  
export default getCampaignContent;
