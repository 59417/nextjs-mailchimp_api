const postData = {
    type: "regular",
    recipients: { list_id: null, },
    settings: {
        subject_line: "【 Moon Festival 】 API Call",
        title: "【 Assignment - Mailchimp API Task 】 New event released!",
        from_name: process.env.HOSTNAME,
        reply_to: process.env.HOSTEMAIL,
        template_id: null,
    },
};


const addCampaign = async (req, res) => {

    // const aa = process.env.HOSTNAME;
    // const bb = process.env.APIKEY;
    // const cc = process.env.EMAILA;
    // const dd = process.env.EMAILB;
    // const ee = process.env.EMAILC;


    const { list_id, template_id } = JSON.parse(JSON.stringify(req.body.body));
    if (!list_id || !template_id) { console.log('no req data', req.body) }
    postData.recipients.list_id = list_id;
    postData.settings.template_id = template_id;

    const client = require("@mailchimp/mailchimp_marketing");
    
    client.setConfig({
      apiKey: `${process.env.APIKEY}-us17`,
      server: "us17",
    });

    try {
        const response = await client.campaigns.create(postData);
        // console.log('campaigns.create', response);
        return res.status(200).json(response);
    } catch (err) {
        // console.log('err', err);
        return res.status(500).json(err.response);
    }
};

export default addCampaign;