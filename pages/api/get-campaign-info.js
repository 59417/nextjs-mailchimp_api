const getData = 'e6e1b004bf';

const getCampaignInfo = async (req, res) => {
  
    const client = require("@mailchimp/mailchimp_marketing");
    
    client.setConfig({
        apiKey: `${process.env.APIKEY}-us17`,
        server: "us17",
    });
  
    try {
        const response = await client.campaigns.get(getData);

        // console.log('campaigns.get', response);
        return res.status(200).json(response);
    } catch (err) {
        // console.log('err', err);
        return res.status(500).json(err.response);
    }
};
  
export default getCampaignInfo;

