const postData = {
    skip_duplicate_check: true,
    members: [
        {
            email_address: process.env.HOSTEMAIL,
            status: 'subscribed',
        },
        {
            email_address: process.env.EMAILA,
            status: 'subscribed',
        },
        {
            email_address: process.env.EMAILB,
            status: 'subscribed',
        },
        {
            email_address: process.env.EMAILC,
            status: 'subscribed',
        },
    ]
};
    
    
const batchSubscribe = async (req, res) => {

    const { list_id } = JSON.parse(JSON.stringify(req.body.body));
    if (!list_id) { console.log('no req data', req.body) };

    const client = require("@mailchimp/mailchimp_marketing");
    
    client.setConfig({
        apiKey: `${process.env.APIKEY}-us17`,
        server: "us17",
    });

    try {
        const response = await client.lists.batchListMembers(list_id, postData);
        
        // console.log('batchListMembers', response);
        return res.status(200).json(response);
    } catch (err) {
        // console.log('err', err);
        return res.status(500).json(err.response);
    }
};

export default batchSubscribe;